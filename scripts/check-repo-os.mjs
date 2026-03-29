#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const workItemsDir = path.join(docsDir, "work-items");
const activeWorkStatuses = new Set(["approved", "in_progress", "blocked"]);
const allowedDocTypes = new Set(["canonical", "task-local", "generated"]);
const allowedFreshness = new Set(["active", "review-needed", "generated"]);
const allowedVerification = new Set([
  "none",
  "manual",
  "scripted",
  "generated",
]);

async function main() {
  const options = await parseArgs(process.argv.slice(2));
  const results = [];
  const workIds = await resolveTargetWorkIds(options);

  await checkMetadata(results);
  await checkTargetWorkItems(results, workIds, options.strict);
  await checkAdapterDrift(results);
  await checkLintToolingContract(results);

  process.stdout.write(
    [
      "Repo OS check",
      ...results.map(
        (result) =>
          `${result.level.toUpperCase()} ${result.scope}: ${result.message}`,
      ),
      "",
      `Summary: ${countByLevel(results, "pass")} pass, ${countByLevel(results, "fail")} fail`,
    ].join("\n") + "\n",
  );

  if (results.some((result) => result.level === "fail")) {
    process.exitCode = 1;
  }
}

async function parseArgs(args) {
  let workId = "";
  let all = false;
  let strict = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--work") {
      workId = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--all") {
      all = true;
      continue;
    }

    if (arg === "--strict") {
      strict = true;
      continue;
    }

    if (!workId) {
      workId = arg;
    }
  }

  return { workId, all, strict };
}

async function resolveTargetWorkIds({ workId, all, strict }) {
  if (workId) {
    return [workId];
  }

  if (all) {
    return await listWorkItemIds();
  }

  return await resolveActiveWorkIds({ includeDrafts: strict });
}

async function listWorkItemIds() {
  try {
    const entries = await readdir(workItemsDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }

    throw error;
  }
}

async function resolveActiveWorkIds({ includeDrafts }) {
  const workIds = await listWorkItemIds();
  const targets = [];

  for (const workId of workIds) {
    const briefPath = path.join(workItemsDir, workId, "brief.md");

    try {
      const markdown = await readFile(briefPath, "utf8");
      const status = normalizeScalar(parseFrontmatter(markdown).frontmatter.status);

      if (
        activeWorkStatuses.has(status) ||
        (includeDrafts && status === "draft") ||
        !status
      ) {
        targets.push(workId);
      }
    } catch (error) {
      if (isMissingPathError(error)) {
        targets.push(workId);
        continue;
      }

      throw error;
    }
  }

  return targets;
}

async function checkMetadata(results) {
  const rules = [
    {
      scope: "ai/context",
      files: await walkMarkdownFiles(path.join(rootDir, "ai", "context")),
      expectedForFile: () => ({
        docType: "canonical",
        sourceOfTruth: "true",
        verification: "manual",
      }),
    },
    {
      scope: "ai/skills",
      files: await walkMarkdownFiles(path.join(rootDir, "ai", "skills")),
      expectedForFile: () => ({
        docType: "canonical",
        sourceOfTruth: "true",
        verification: "manual",
      }),
    },
    {
      scope: "ai/agents",
      files: (
        await walkMarkdownFiles(path.join(rootDir, "ai", "agents"))
      ).filter((filePath) => path.basename(filePath) !== "README.md"),
      expectedForFile: () => ({
        docType: "canonical",
        sourceOfTruth: "true",
        verification: "manual",
      }),
    },
    {
      scope: "docs/core",
      files: [
        path.join(docsDir, "repo-os.md"),
        path.join(docsDir, "agent-context.md"),
        path.join(docsDir, "architecture.md"),
        path.join(docsDir, "spec-lifecycle.md"),
        path.join(docsDir, "doc-sync-playbook.md"),
        path.join(docsDir, "prds", "README.md"),
        path.join(docsDir, "work-items", "README.md"),
      ],
      expectedForFile: () => ({
        docType: "canonical",
        sourceOfTruth: "true",
        verification: "manual",
      }),
    },
    {
      scope: "docs/product-squad",
      files: await walkMarkdownFiles(path.join(docsDir, "product-squad")),
      expectedForFile: (filePath) => ({
        docType: "canonical",
        sourceOfTruth: "true",
        verification: filePath.includes(`${path.sep}templates${path.sep}`)
          ? "scripted"
          : "manual",
      }),
    },
    {
      scope: "docs/templates",
      files: [path.join(docsDir, "templates", "prd.md")],
      expectedForFile: () => ({
        docType: "canonical",
        sourceOfTruth: "true",
        verification: "scripted",
      }),
    },
    {
      scope: "docs/prds",
      files: (await walkMarkdownFiles(path.join(docsDir, "prds"))).filter(
        (filePath) => path.basename(filePath) !== "README.md",
      ),
      expectedForFile: () => ({
        docType: "task-local",
        sourceOfTruth: "true",
        verification: "manual",
      }),
    },
    {
      scope: "docs/work-items",
      files: (await walkMarkdownFiles(path.join(docsDir, "work-items"))).filter(
        (filePath) => path.basename(filePath) !== "README.md",
      ),
      expectedForFile: () => ({
        docType: "task-local",
        sourceOfTruth: "true",
        verification: "scripted",
      }),
    },
  ];

  for (const rule of rules) {
    if (rule.files.length === 0) {
      results.push(fail(rule.scope, "no files matched the metadata rule"));
      continue;
    }

    const ruleFailures = [];

    for (const filePath of rule.files) {
      try {
        await access(filePath);
      } catch (error) {
        if (isMissingPathError(error)) {
          ruleFailures.push(`${relativePath(filePath)} is missing`);
          continue;
        }

        throw error;
      }

      const markdown = await readFile(filePath, "utf8");
      const { frontmatter } = parseFrontmatter(markdown);
      const metadataIssues = validateMetadataFrontmatter(
        frontmatter,
        rule.expectedForFile(filePath),
      );

      if (metadataIssues.length > 0) {
        ruleFailures.push(
          `${relativePath(filePath)}: ${metadataIssues.join("; ")}`,
        );
      }
    }

    if (ruleFailures.length > 0) {
      for (const message of ruleFailures) {
        results.push(fail(rule.scope, message));
      }
      continue;
    }

    results.push(
      pass(rule.scope, `${rule.files.length} files have valid metadata`),
    );
  }
}

function validateMetadataFrontmatter(frontmatter, expected) {
  if (Object.keys(frontmatter).length === 0) {
    return ["missing frontmatter"];
  }

  const issues = [];
  const owner = normalizeScalar(frontmatter.owner);
  const docType = normalizeScalar(frontmatter.doc_type);
  const sourceOfTruth = normalizeScalar(frontmatter.source_of_truth);
  const freshness = normalizeScalar(frontmatter.freshness);
  const verification = normalizeScalar(frontmatter.verification);

  if (!owner) {
    issues.push("missing metadata field: owner");
  }

  if (!allowedDocTypes.has(docType)) {
    issues.push(`invalid doc_type: ${docType || "(empty)"}`);
  } else if (docType !== expected.docType) {
    issues.push(`expected doc_type=${expected.docType}`);
  }

  if (!["true", "false"].includes(sourceOfTruth)) {
    issues.push(`invalid source_of_truth: ${sourceOfTruth || "(empty)"}`);
  } else if (sourceOfTruth !== expected.sourceOfTruth) {
    issues.push(`expected source_of_truth=${expected.sourceOfTruth}`);
  }

  if (!allowedFreshness.has(freshness)) {
    issues.push(`invalid freshness: ${freshness || "(empty)"}`);
  }

  if (!allowedVerification.has(verification)) {
    issues.push(`invalid verification: ${verification || "(empty)"}`);
  } else if (verification !== expected.verification) {
    issues.push(`expected verification=${expected.verification}`);
  }

  return issues;
}

async function checkTargetWorkItems(results, workIds, strict) {
  if (workIds.length === 0) {
    results.push(pass("work-item", "no active work items found"));
    return;
  }

  for (const workId of workIds) {
    const targetDir = path.join(workItemsDir, workId);

    try {
      await access(targetDir);
    } catch (error) {
      if (isMissingPathError(error)) {
        results.push(
          fail(
            "work-item",
            `target work item is missing: docs/work-items/${workId}`,
          ),
        );
        continue;
      }

      throw error;
    }

    const args = [path.join(rootDir, "scripts", "check-squad-work-item.mjs"), workId];
    if (strict) {
      args.push("--strict");
    }

    const run = spawnSync(process.execPath, args, {
      cwd: rootDir,
      encoding: "utf8",
    });

    if (run.status !== 0) {
      results.push(
        fail(
          "work-item",
          [
            `squad:check failed for ${workId}`,
            summarizeChildOutput(run.stdout, run.stderr),
          ]
            .filter(Boolean)
            .join(" | "),
        ),
      );
      continue;
    }

    results.push(pass("work-item", `squad:check passed for ${workId}`));
  }
}

async function checkAdapterDrift(results) {
  const run = spawnSync(
    process.execPath,
    [path.join(rootDir, "scripts", "sync-ai-context.mjs"), "--check"],
    {
      cwd: rootDir,
      encoding: "utf8",
    },
  );

  if (run.status !== 0) {
    results.push(
      fail(
        "adapter-drift",
        summarizeChildOutput(run.stdout, run.stderr) ||
          "`pnpm ai:sync` outputs are out of date",
      ),
    );
    return;
  }

  results.push(
    pass("adapter-drift", "generated adapters match canonical sources"),
  );
}

async function checkLintToolingContract(results) {
  const packageFiles = await listTrackedPackageJsonFiles();

  if (packageFiles.length === 0) {
    results.push(fail("lint-tooling", "no tracked package.json files found"));
    return;
  }

  const issues = [];

  for (const filePath of packageFiles) {
    const absolutePath = path.join(rootDir, filePath);
    const pkg = JSON.parse(await readFile(absolutePath, "utf8"));
    const scripts = pkg.scripts ?? {};

    if (filePath === "package.json") {
      const rootLint = normalizeScalar(scripts.lint);
      const rootVerify = normalizeScalar(scripts.verify);

      if (!rootLint) {
        issues.push("package.json: missing scripts.lint");
      }

      if (!rootVerify) {
        issues.push("package.json: missing scripts.verify");
      } else if (!rootVerify.includes("pnpm lint")) {
        issues.push("package.json: scripts.verify must include `pnpm lint`");
      }

      continue;
    }

    const lintScript = normalizeScalar(scripts.lint);

    if (!lintScript) {
      continue;
    }

    if (!lintScript.includes("eslint")) {
      issues.push(
        `${filePath}: scripts.lint must remain ESLint-backed (found: ${lintScript})`,
      );
      continue;
    }

    if (/\boxlint\b|biome/i.test(lintScript)) {
      issues.push(
        `${filePath}: scripts.lint must not replace ESLint with Oxlint/Biome (found: ${lintScript})`,
      );
    }
  }

  if (issues.length > 0) {
    for (const issue of issues) {
      results.push(fail("lint-tooling", issue));
    }
    return;
  }

  results.push(
    pass(
      "lint-tooling",
      `${packageFiles.length} tracked package manifests keep the ESLint lint contract`,
    ),
  );
}

async function listTrackedPackageJsonFiles() {
  const run = spawnSync(
    "git",
    ["ls-files", "package.json", "apps/*/package.json", "packages/*/package.json"],
    {
      cwd: rootDir,
      encoding: "utf8",
    },
  );

  if (run.status !== 0) {
    throw new Error(
      summarizeChildOutput(run.stdout, run.stderr) ||
        "Failed to list tracked package manifests via git ls-files",
    );
  }

  return (run.stdout ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

async function walkMarkdownFiles(directoryPath) {
  const files = [];

  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries.sort((left, right) =>
      left.name.localeCompare(right.name),
    )) {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await walkMarkdownFiles(entryPath)));
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(entryPath);
      }
    }
  } catch (error) {
    if (!isMissingPathError(error)) {
      throw error;
    }
  }

  return files;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { frontmatter: {}, body: markdown };
  }

  const frontmatter = {};

  for (const line of match[1].split("\n")) {
    const parsed = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!parsed) {
      continue;
    }

    frontmatter[parsed[1]] = parsed[2];
  }

  return {
    frontmatter,
    body: markdown.slice(match[0].length),
  };
}

function normalizeScalar(value) {
  return String(value ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function summarizeChildOutput(stdout, stderr) {
  const combined = `${stdout ?? ""}\n${stderr ?? ""}`.trim();

  if (!combined) {
    return "";
  }

  return combined
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-3)
    .join(" | ");
}

function relativePath(filePath) {
  return path.relative(rootDir, filePath) || filePath;
}

function pass(scope, message) {
  return { level: "pass", scope, message };
}

function fail(scope, message) {
  return { level: "fail", scope, message };
}

function countByLevel(results, level) {
  return results.filter((result) => result.level === level).length;
}

function isMissingPathError(error) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "ENOENT",
  );
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
