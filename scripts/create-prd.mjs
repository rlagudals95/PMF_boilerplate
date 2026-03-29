#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const templatePath = path.join(rootDir, "docs", "templates", "prd.md");
const prdsDir = path.join(rootDir, "docs", "prds");

async function main() {
  const { slug, owner, sourceUrl, force } = parseArgs(process.argv.slice(2));
  const template = await readFile(templatePath, "utf8");
  const destinationPath = path.join(prdsDir, `${slug}.md`);
  const today = buildLocalDate(new Date());
  const contents = replaceField(
    replaceField(
      replaceField(
        replaceField(
          replaceField(
            replaceField(template, "title", JSON.stringify(toTitleCase(slug))),
            "owner",
            JSON.stringify(owner),
          ),
          "source_url",
          JSON.stringify(sourceUrl),
        ),
        "created_at",
        JSON.stringify(today),
      ),
      "updated_at",
      JSON.stringify(today),
    ),
    "history",
    `| ${today} | created | Initial PRD created. | ${owner} |`,
  );

  await mkdir(prdsDir, { recursive: true });
  await writeFile(destinationPath, contents, {
    flag: force ? "w" : "wx",
  });

  process.stdout.write(
    [
      `Created PRD: docs/prds/${slug}.md`,
      `- Title: ${toTitleCase(slug)}`,
      `- Owner: ${owner}`,
      `- Created At: ${today}`,
      sourceUrl ? `- Source URL: ${sourceUrl}` : "- Source URL: (empty)",
    ].join("\n") + "\n",
  );
}

function parseArgs(args) {
  let slug;
  let owner = "Founder";
  let sourceUrl = "";
  let force = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--source-url") {
      sourceUrl = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--owner") {
      owner = args[index + 1] ?? owner;
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
      'Usage: pnpm prd:new <slug> [--owner "Founder"] [--source-url "https://..."] [--force]',
    );
  }

  return {
    slug: normalizeSlug(slug),
    owner: owner.trim() || "Founder",
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

function replaceField(template, field, value) {
  if (field === "history") {
    return template.replace(
      /\| YYYY-MM-DD \| created \| .* \| owner \|/,
      value,
    );
  }

  return template.replace(
    new RegExp(`^${field}:\\s*.*$`, "m"),
    `${field}: ${value}`,
  );
}

function toTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildLocalDate(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
