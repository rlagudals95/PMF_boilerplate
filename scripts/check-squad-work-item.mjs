#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const workItemsDir = path.join(rootDir, "docs", "work-items");
const requiredFiles = [
  "brief.md",
  "team-plan.md",
  "ux-review.md",
  "frontend-spec.md",
  "backend-spec.md",
  "quality-scorecard.md",
];
const optionalFiles = ["feature-spec.md"];

async function main() {
  const { workId, strict } = await parseArgs(process.argv.slice(2));
  const targetDir = path.join(workItemsDir, workId);
  const results = [];

  await access(targetDir);

  for (const fileName of requiredFiles) {
    const filePath = path.join(targetDir, fileName);
    try {
      const markdown = await readFile(filePath, "utf8");
      results.push(...inspectFile(fileName, markdown));
    } catch (error) {
      if (isMissingPathError(error)) {
        results.push(fail(fileName, "required file is missing"));
        continue;
      }

      throw error;
    }
  }

  for (const fileName of optionalFiles) {
    const filePath = path.join(targetDir, fileName);

    try {
      const markdown = await readFile(filePath, "utf8");
      results.push(...inspectFile(fileName, markdown));
    } catch (error) {
      if (!isMissingPathError(error)) {
        throw error;
      }
    }
  }

  const hasFailure = results.some((result) => result.level === "fail");
  const hasStrictWarning =
    strict && results.some((result) => result.level === "warn");

  process.stdout.write(
    [
      `Squad check: ${workId}`,
      ...results.map(
        (result) =>
          `${result.level.toUpperCase()} ${result.file}: ${result.message}`,
      ),
      "",
      `Summary: ${countByLevel(results, "pass")} pass, ${countByLevel(results, "warn")} warn, ${countByLevel(results, "fail")} fail`,
    ].join("\n") + "\n",
  );

  if (hasFailure || hasStrictWarning) {
    process.exitCode = 1;
  }
}

async function parseArgs(args) {
  let workId = "";
  let strict = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--work") {
      workId = args[index + 1] ?? "";
      index += 1;
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

  if (!workId) {
    workId = await resolveLatestWorkId();
  }

  if (!workId) {
    throw new Error(
      "Usage: pnpm squad:check [<work-id>] [--work <work-id>] [--strict]",
    );
  }

  return { workId, strict };
}

async function resolveLatestWorkId() {
  try {
    const entries = await readdir(workItemsDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
      .at(-1);
  } catch (error) {
    if (isMissingPathError(error)) {
      return "";
    }

    throw error;
  }
}

function inspectFile(fileName, markdown) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const status = normalizeScalar(frontmatter.status);

  if (status === "skipped") {
    const skipReason = normalizeScalar(frontmatter.skip_reason);
    if (!skipReason || skipReason === "null") {
      return [fail(fileName, "status is skipped but skip_reason is empty")];
    }

    return [pass(fileName, `skipped with reason: ${skipReason}`)];
  }

  const results = [];

  if (!status || status === "draft") {
    results.push(
      warn(fileName, "status is still draft; review completion before handoff"),
    );
  }

  switch (fileName) {
    case "brief.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Problem", basicPlaceholderSet()],
          ["Target User", basicPlaceholderSet()],
          ["Goal", basicPlaceholderSet()],
          ["Success Metric", basicPlaceholderSet()],
          ["Acceptance Criteria", basicPlaceholderSet()],
        ]),
      );
      break;
    case "team-plan.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Mission", basicPlaceholderSet()],
          [
            "Execution Mode",
            basicPlaceholderSet([
              "- `single-agent sequential | subagent fan-out | agent-team`",
            ]),
          ],
          [
            "Team Topology",
            basicPlaceholderSet([
              "- lead:",
              "- pm:",
              "- pd:",
              "- fe:",
              "- be:",
              "- quality review:",
            ]),
          ],
          [
            "Shared Task List",
            basicPlaceholderSet([
              "- task_id:",
              "owner:",
              "status:",
              "depends_on:",
              "output:",
            ]),
          ],
          ["Handoff Log", basicPlaceholderSet(["- from:", "to:", "packet:"])],
        ]),
      );
      break;
    case "ux-review.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Goal Alignment", basicPlaceholderSet()],
          ["Happy Path", basicPlaceholderSet()],
          ["Edge States", basicPlaceholderSet()],
          ["Browser QA Plan", basicPlaceholderSet()],
        ]),
      );
      break;
    case "frontend-spec.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Module Targets", basicPlaceholderSet()],
          ["State And Events", basicPlaceholderSet()],
          ["Instrumentation Hooks", basicPlaceholderSet()],
          [
            "Test-First Plan",
            basicPlaceholderSet([
              "- 먼저 failing test로 고정할 behavior slice",
              "- 어떤 module/model/action/route 경계를 검증할지",
              "- manual verify가 필요한 UI 상태가 무엇인지",
            ]),
          ],
        ]),
      );
      break;
    case "backend-spec.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Schema And Validation Changes", basicPlaceholderSet()],
          ["Analytics Impact", basicPlaceholderSet()],
          ["Measurement Guardrails", basicPlaceholderSet()],
          [
            "Boundary / Use Case / Repository Contract Test Plan",
            basicPlaceholderSet([
              "- 먼저 failing test로 고정할 validation/use case/repository contract",
              "- adapter failure handling과 fallback 검증 포인트",
              "- 최종 verify에 남길 통합 확인 항목",
            ]),
          ],
        ]),
      );
      break;
    case "quality-scorecard.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Goal Fit", basicPlaceholderSet()],
          ["Product Risks To Kill", basicPlaceholderSet()],
          ["Browser QA Evidence", basicPlaceholderSet()],
          ["Measurement And Ops Checks", basicPlaceholderSet()],
          ["Release Recommendation", basicPlaceholderSet()],
        ]),
      );
      break;
    case "feature-spec.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Feature Summary", basicPlaceholderSet()],
          [
            "Business Goal Mapping",
            basicPlaceholderSet([
              "- 어떤 business outcome을 움직이려는지",
              "- 그 결과를 위해 어떤 사용자 행동을 바꾸려는지",
              "- success를 어떤 evidence로 판단할지",
            ]),
          ],
          ["Acceptance Criteria", basicPlaceholderSet()],
        ]),
      );
      results.push(
        ...checkAnySection(
          fileName,
          body,
          ["Behavior Slices / Test Strategy", "Test Strategy"],
          basicPlaceholderSet([
            "- 먼저 failing test로 고정할 핵심 behavior slice",
            "- TDD 적용 범위와 생략 근거",
            "- FE/BE public behavior 검증 포인트",
          ]),
          "Test Strategy",
        ),
      );
      results.push(
        ...checkSections(fileName, body, [
          [
            "Quality Gates",
            basicPlaceholderSet([
              "- spec 승인 기준",
              "- browser QA evidence 기준",
              "- measurement / admin visibility 기준",
              "- ship / iterate / stop 판단 기준",
            ]),
          ],
        ]),
      );
      break;
    default:
      break;
  }

  if (results.every((result) => result.level !== "fail")) {
    results.unshift(pass(fileName, "required sections are present"));
  }

  return results;
}

function checkSections(fileName, body, checks) {
  return checks.flatMap(([heading, placeholders]) => {
    const section = extractSection(body, heading);

    if (!section) {
      return fail(fileName, `missing section: ${heading}`);
    }

    if (!hasMeaningfulContent(section, placeholders)) {
      return fail(fileName, `section is still placeholder: ${heading}`);
    }

    return [];
  });
}

function checkAnySection(fileName, body, headings, placeholders, label) {
  for (const heading of headings) {
    const section = extractSection(body, heading);

    if (!section) {
      continue;
    }

    if (!hasMeaningfulContent(section, placeholders)) {
      return [
        fail(fileName, `section is still placeholder: ${label ?? heading}`),
      ];
    }

    return [];
  }

  return [fail(fileName, `missing section: ${label ?? headings[0]}`)];
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

function extractSection(body, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`## ${escaped}\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = body.match(pattern);

  return match?.[1]?.trim() ?? "";
}

function hasMeaningfulContent(section, placeholders) {
  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return false;
  }

  return lines.some((line) => !placeholders.has(line));
}

function basicPlaceholderSet(extra = []) {
  return new Set(["-", ...extra]);
}

function normalizeScalar(value) {
  return String(value ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function countByLevel(results, level) {
  return results.filter((result) => result.level === level).length;
}

function pass(file, message) {
  return { level: "pass", file, message };
}

function warn(file, message) {
  return { level: "warn", file, message };
}

function fail(file, message) {
  return { level: "fail", file, message };
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
