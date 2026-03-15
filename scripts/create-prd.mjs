#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const templatePath = path.join(rootDir, "docs", "templates", "prd.md");
const prdsDir = path.join(rootDir, "docs", "prds");

async function main() {
  const { slug, sourceUrl, force } = parseArgs(process.argv.slice(2));
  const template = await readFile(templatePath, "utf8");
  const destinationPath = path.join(prdsDir, `${slug}.md`);
  const today = new Date().toISOString().slice(0, 10);
  const contents = template
    .replace('title: "New PRD"', `title: ${JSON.stringify(toTitleCase(slug))}`)
    .replace('source_url: ""', `source_url: ${JSON.stringify(sourceUrl)}`)
    .replace('created_at: ""', `created_at: ${JSON.stringify(today)}`)
    .replace('updated_at: ""', `updated_at: ${JSON.stringify(today)}`)
    .replace(
      "| YYYY-MM-DD | created | Initial PRD created. | owner |",
      `| ${today} | created | Initial PRD created. | TBD |`,
    );

  await mkdir(prdsDir, { recursive: true });
  await writeFile(destinationPath, contents, {
    flag: force ? "w" : "wx",
  });

  process.stdout.write(
    [
      `Created PRD: docs/prds/${slug}.md`,
      `- Title: ${toTitleCase(slug)}`,
      `- Created At: ${today}`,
      sourceUrl ? `- Source URL: ${sourceUrl}` : "- Source URL: (empty)",
    ].join("\n") + "\n",
  );
}

function parseArgs(args) {
  let slug;
  let sourceUrl = "";
  let force = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--source-url") {
      sourceUrl = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--force") {
      force = true;
      continue;
    }

    if (!slug) {
      slug = arg;
    }
  }

  if (!slug) {
    throw new Error(
      'Usage: pnpm prd:new <slug> [--source-url "https://..."] [--force]',
    );
  }

  return {
    slug: normalizeSlug(slug),
    sourceUrl,
    force,
  };
}

function normalizeSlug(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("The PRD slug must contain at least one letter or number.");
  }

  return slug;
}

function toTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
