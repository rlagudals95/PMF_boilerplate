#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const templatesDir = path.join(rootDir, "docs", "product-squad", "templates");
const workItemsDir = path.join(rootDir, "docs", "work-items");
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
  const { slug, request, force } = parseArgs(process.argv.slice(2));
  const datePart = buildDatePart(new Date());
  const workId = `${datePart}-${slug}`;
  const targetDir = path.join(workItemsDir, workId);

  await mkdir(targetDir, { recursive: force });

  for (const fileName of templateFiles) {
    const templatePath = path.join(templatesDir, fileName);
    const destinationPath = path.join(targetDir, fileName);
    const template = await readFile(templatePath, "utf8");
    const contents = materializeTaskLocalTemplate(template, { request });

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

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--request") {
      request = args[index + 1] ?? "";
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
  };
}

function materializeTaskLocalTemplate(template, { request }) {
  let output = template
    .replace(/^doc_type:\s*".*"$/m, 'doc_type: "task-local"')
    .replace(/^source_of_truth:\s*.*$/m, "source_of_truth: true")
    .replace(/^freshness:\s*".*"$/m, 'freshness: "active"')
    .replace(/^verification:\s*".*"$/m, 'verification: "scripted"');

  if (request) {
    output = output.replace(
      /^source_request:\s*.*$/m,
      `source_request: ${JSON.stringify(request)}`,
    );
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
