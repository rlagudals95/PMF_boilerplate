#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const templatesDir = path.join(rootDir, "docs", "product-squad", "templates");
const workItemsDir = path.join(rootDir, "docs", "work-items");
const allowedWorkClasses = new Set(["light", "soft-gated", "hard-gated"]);
const allowedChangeTypes = new Set([
  "user-facing-behavior",
  "validation-schema",
  "repository-contract",
  "cross-repo-contract",
  "prompt-workflow",
  "release-ops",
  "new-capability",
]);
const allowedReleaseSurfaces = new Set([
  "none",
  "user-facing",
  "ops-facing",
  "cross-repo",
]);
const allowedPrimaryGates = new Set([
  "brief",
  "scorecard",
  "browser-qa",
  "contract-test",
]);
const templateFiles = [
  "goal-packet.md",
  "brief.md",
  "team-plan.md",
  "ux-review.md",
  "frontend-spec.md",
  "backend-spec.md",
  "quality-scorecard.md",
];

async function main() {
  const {
    slug,
    request,
    force,
    workClass,
    changeTypes,
    releaseSurface,
    primaryGate,
  } = parseArgs(process.argv.slice(2));
  const datePart = buildDatePart(new Date());
  const workId = `${datePart}-${slug}`;
  const targetDir = path.join(workItemsDir, workId);

  await mkdir(targetDir, { recursive: force });

  for (const fileName of templateFiles) {
    const templatePath = path.join(templatesDir, fileName);
    const destinationPath = path.join(targetDir, fileName);
    const template = await readFile(templatePath, "utf8");
    const contents = materializeTaskLocalTemplate(template, {
      request,
      workClass,
      changeTypes,
      releaseSurface,
      primaryGate,
    });

    await writeFile(destinationPath, contents);
  }

  process.stdout.write(
    [
      `Created work item: ${workId}`,
      `- Directory: docs/work-items/${workId}`,
      "- Files:",
      ...templateFiles.map((fileName) => `  - ${fileName}`),
    ].join("\n"),
  );
}

function parseArgs(args) {
  let slug;
  let request = "";
  let force = false;
  const changeTypes = [];
  let workClass = "soft-gated";
  let releaseSurface = "none";
  let primaryGate = "brief";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--request") {
      request = readOptionValue(args, index, "--request");
      index += 1;
      continue;
    }

    if (arg === "--class") {
      workClass = readEnumOption(
        args,
        index,
        "--class",
        allowedWorkClasses,
      );
      index += 1;
      continue;
    }

    if (arg === "--type") {
      changeTypes.push(
        readEnumOption(args, index, "--type", allowedChangeTypes),
      );
      index += 1;
      continue;
    }

    if (arg === "--release-surface") {
      releaseSurface = readEnumOption(
        args,
        index,
        "--release-surface",
        allowedReleaseSurfaces,
      );
      index += 1;
      continue;
    }

    if (arg === "--primary-gate") {
      primaryGate = readEnumOption(
        args,
        index,
        "--primary-gate",
        allowedPrimaryGates,
      );
      index += 1;
      continue;
    }

    if (arg === "--force") {
      force = true;
      continue;
    }

    if (!slug) {
      slug = arg;
      continue;
    }

    throw new Error(`Unexpected argument: ${arg}`);
  }

  if (!slug) {
    throw new Error(
      'Usage: pnpm work:new <short-slug> [--request "original request"] [--force]',
    );
  }

  return {
    slug: normalizeSlug(slug),
    request,
    force,
    workClass,
    changeTypes: changeTypes.filter(Boolean),
    releaseSurface,
    primaryGate,
  };
}

function materializeTaskLocalTemplate(template, options) {
  const contract = buildHarnessContract(options);
  let output = template;

  output = replaceFrontmatterField(output, "doc_type", "task-local");
  output = replaceFrontmatterField(output, "source_of_truth", true);
  output = replaceFrontmatterField(output, "freshness", "active");
  output = replaceFrontmatterField(output, "verification", "scripted");
  output = replaceFrontmatterField(output, "work_class", contract.workClass);
  output = replaceFrontmatterField(
    output,
    "change_types",
    contract.changeTypes,
  );
  output = replaceFrontmatterField(
    output,
    "evidence_requirements",
    contract.evidenceRequirements,
  );
  output = replaceFrontmatterField(
    output,
    "release_surface",
    contract.releaseSurface,
  );
  output = replaceFrontmatterField(output, "primary_gate", contract.primaryGate);

  if (contract.request) {
    output = replaceFrontmatterField(output, "source_request", contract.request);
  }

  return output;
}

function normalizeSlug(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error(
      "The work item slug must contain at least one letter or number.",
    );
  }

  return slug;
}

function buildHarnessContract(options) {
  const changeTypes = uniqueItems(options.changeTypes ?? []);

  return {
    request: options.request,
    workClass: options.workClass,
    changeTypes,
    evidenceRequirements: inferEvidenceRequirements({
      workClass: options.workClass,
      changeTypes,
      releaseSurface: options.releaseSurface,
      primaryGate: options.primaryGate,
    }),
    releaseSurface: options.releaseSurface,
    primaryGate: options.primaryGate,
  };
}

function inferEvidenceRequirements({
  workClass,
  changeTypes,
  releaseSurface,
  primaryGate,
}) {
  const evidence = new Set(["verify", "quality-scorecard"]);

  if (releaseSurface === "user-facing" || changeTypes.includes("user-facing-behavior")) {
    evidence.add("browser-qa");
  }

  if (
    releaseSurface === "ops-facing" ||
    changeTypes.includes("release-ops")
  ) {
    evidence.add("ops-evidence");
  }

  if (
    releaseSurface === "cross-repo" ||
    changeTypes.some((type) =>
      [
        "validation-schema",
        "repository-contract",
        "cross-repo-contract",
      ].includes(type),
    )
  ) {
    evidence.add("contract-test");
  }

  if (changeTypes.includes("prompt-workflow")) {
    evidence.add("replayable-evaluation");
  }

  if (workClass === "light" && evidence.size === 2 && primaryGate === "brief") {
    return ["verify"];
  }

  if (primaryGate === "browser-qa") {
    evidence.add("browser-qa");
  }

  if (primaryGate === "contract-test") {
    evidence.add("contract-test");
  }

  if (primaryGate === "scorecard") {
    evidence.add("quality-scorecard");
  }

  return [...evidence];
}

function readOptionValue(args, index, flagName) {
  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flagName}.`);
  }

  return value;
}

function readEnumOption(args, index, flagName, allowedValues) {
  const value = readOptionValue(args, index, flagName);

  if (!allowedValues.has(value)) {
    throw new Error(
      `Invalid value for ${flagName}: ${value}. Expected one of: ${[
        ...allowedValues,
      ].join(", ")}`,
    );
  }

  return value;
}

function replaceFrontmatterField(template, fieldName, value) {
  const { frontmatterLines, body } = splitFrontmatter(template);
  const fieldStartIndex = frontmatterLines.findIndex((line) =>
    line.match(new RegExp(`^${escapeRegExp(fieldName)}:\\s*`)),
  );

  if (fieldStartIndex === -1) {
    return `---\n${[
      ...frontmatterLines,
      ...formatFrontmatterField(fieldName, value),
    ].join("\n")}\n---\n${body}`;
  }

  const fieldEndIndex = findFrontmatterFieldEnd(frontmatterLines, fieldStartIndex);
  const replacementLines = formatFrontmatterField(fieldName, value);
  const nextFrontmatterLines = [
    ...frontmatterLines.slice(0, fieldStartIndex),
    ...replacementLines,
    ...frontmatterLines.slice(fieldEndIndex),
  ];

  return `---\n${nextFrontmatterLines.join("\n")}\n---\n${body}`;
}

function splitFrontmatter(template) {
  if (!template.startsWith("---\n")) {
    throw new Error("Template is missing frontmatter block.");
  }

  const closingIndex = template.indexOf("\n---\n", 4);

  if (closingIndex === -1) {
    throw new Error("Template frontmatter block is not closed.");
  }

  const frontmatter = template.slice(4, closingIndex);
  const body = template.slice(closingIndex + 5);

  return {
    frontmatterLines: frontmatter.split("\n"),
    body,
  };
}

function findFrontmatterFieldEnd(lines, startIndex) {
  let endIndex = startIndex + 1;

  while (endIndex < lines.length && !isFrontmatterFieldLine(lines[endIndex])) {
    endIndex += 1;
  }

  return endIndex;
}

function isFrontmatterFieldLine(line) {
  return /^[a-zA-Z0-9_]+:\s*/.test(line);
}

function formatFrontmatterField(fieldName, value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [`${fieldName}: []`];
    }

    return [
      `${fieldName}:`,
      ...value.map((item) => `  - ${JSON.stringify(item)}`),
    ];
  }

  if (value === null) {
    return [`${fieldName}: null`];
  }

  if (typeof value === "boolean") {
    return [`${fieldName}: ${value ? "true" : "false"}`];
  }

  return [`${fieldName}: ${JSON.stringify(value)}`];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueItems(items) {
  return [...new Set(items.filter(Boolean))];
}

function buildDatePart(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
