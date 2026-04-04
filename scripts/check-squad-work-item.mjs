#!/usr/bin/env node

import { existsSync } from "node:fs";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const workItemsDir = path.join(rootDir, "docs", "work-items");
const requiredFiles = [
  "goal-packet.md",
  "brief.md",
  "team-plan.md",
  "ux-review.md",
  "frontend-spec.md",
  "backend-spec.md",
  "quality-scorecard.md",
];
const nonSkippableFiles = new Set(["goal-packet.md"]);
const optionalFiles = ["feature-spec.md", "browser-qa.md"];
const allowedFreshness = new Set(["active", "review-needed"]);
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
const allowedEvidenceRequirements = new Set([
  "verify",
  "quality-scorecard",
  "browser-qa",
  "ops-evidence",
  "contract-test",
  "replayable-evaluation",
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

async function main() {
  const { workId, strict } = await parseArgs(process.argv.slice(2));
  const targetDir = path.join(workItemsDir, workId);
  const results = [];
  const inspectionsByFile = new Map();

  await access(targetDir);

  for (const fileName of requiredFiles) {
    const filePath = path.join(targetDir, fileName);
    try {
      const markdown = await readFile(filePath, "utf8");
      const inspection = inspectFile(fileName, markdown, { workId, targetDir });
      inspectionsByFile.set(fileName, inspection);
      results.push(...inspection.results);
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
      const inspection = inspectFile(fileName, markdown, { workId, targetDir });
      results.push(...inspection.results);
    } catch (error) {
      if (!isMissingPathError(error)) {
        throw error;
      }
    }
  }

  const workItemContract = collectHarnessContract(inspectionsByFile);
  const requiredEvidenceRequirements = deriveExpectedEvidenceRequirements(
    workItemContract,
  );
  const missingEvidenceRequirements = requiredEvidenceRequirements.filter(
    (evidenceRequirement) =>
      !workItemContract.evidenceRequirements.includes(evidenceRequirement),
  );

  if (missingEvidenceRequirements.length > 0) {
    results.push(
      fail(
        "work-item",
        `evidence_requirements must include ${formatList(missingEvidenceRequirements)} for ${describeHarnessContract(workItemContract)}`,
      ),
    );
  }

  enforceArtifactMatrix({
    results,
    inspectionsByFile,
    workItemContract,
    workId,
  });

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

function inspectFile(fileName, markdown, context) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const status = normalizeScalar(frontmatter.status);
  const metadataResults = checkMetadataFields(fileName, frontmatter);
  const harness = readHarnessContract(frontmatter);
  const results = [...metadataResults];

  results.push(...validateHarnessContract(fileName, harness));

  if (status === "skipped") {
    if (nonSkippableFiles.has(fileName)) {
      return {
        fileName,
        body,
        frontmatter,
        harness,
        results: [
          ...results,
          fail(
            fileName,
            "status skipped is not allowed for this required artifact",
          ),
        ],
        status,
      };
    }

    const skipReason = normalizeScalar(frontmatter.skip_reason);
    if (!skipReason || skipReason === "null") {
      return {
        fileName,
        body,
        frontmatter,
        harness,
        results: [
          ...results,
          fail(fileName, "status is skipped but skip_reason is empty"),
        ],
        status,
      };
    }

    return {
      fileName,
      body,
      frontmatter,
      harness,
      results: [...results, pass(fileName, `skipped with reason: ${skipReason}`)],
      status,
    };
  }

  if (!status || status === "draft") {
    results.push(
      warn(fileName, "status is still draft; review completion before handoff"),
    );
  }

  switch (fileName) {
    case "goal-packet.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Business Goal", basicPlaceholderSet()],
          ["Target User", basicPlaceholderSet()],
          ["Target Moment", basicPlaceholderSet()],
          ["Success Metric", basicPlaceholderSet()],
          ["Non-Goals", basicPlaceholderSet()],
          ["Constraints", basicPlaceholderSet()],
          ["Existing Evidence", basicPlaceholderSet()],
          ["Selected Delivery Shape", basicPlaceholderSet()],
          ["Active Scope", basicPlaceholderSet()],
          ["Deferred Scope", basicPlaceholderSet()],
          ["Selection Rationale", basicPlaceholderSet()],
        ]),
      );
      break;
    case "brief.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Problem", basicPlaceholderSet()],
          ["Target User", basicPlaceholderSet()],
          ["Target Moment", basicPlaceholderSet()],
          ["Goal", basicPlaceholderSet()],
          ["Existing Evidence", basicPlaceholderSet()],
          ["Enterprise Decision Guardrails", basicPlaceholderSet()],
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
          ["Enterprise UX Principles", basicPlaceholderSet()],
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
          ["Enterprise FE Guardrails", basicPlaceholderSet()],
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
          ["Enterprise BE Guardrails", basicPlaceholderSet()],
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
          ["Code Quality Evidence", basicPlaceholderSet()],
          ["Principle Adherence", basicPlaceholderSet()],
          ["Docs And Spec Sync", basicPlaceholderSet()],
          ["Verification Evidence", basicPlaceholderSet()],
          ["Measurement And Ops Checks", basicPlaceholderSet()],
          ["Release Recommendation", basicPlaceholderSet()],
        ]),
      );
      {
        const browserQaEvidence = extractSection(body, "Browser QA Evidence");
        if (
          !hasBrowserQaEvidence(browserQaEvidence, {
            workId: context.workId,
            hasBrowserQaDoc: hasOptionalArtifact(
              context.targetDir,
              "browser-qa.md",
            ),
          })
        ) {
          results.push(
            fail(
              fileName,
              "Browser QA Evidence must reference browser-qa.md when present, or include an explicit non-user-facing skip reason",
            ),
          );
        }
      }
      {
        const verificationEvidence = extractSection(body, "Verification Evidence");
        if (!hasVerificationCommand(verificationEvidence)) {
          results.push(
            fail(
              fileName,
              "Verification Evidence must mention `pnpm verify` or `pnpm verify:full`",
            ),
          );
        }
      }
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
    case "browser-qa.md":
      results.push(
        ...checkSections(fileName, body, [
          ["Scope", basicPlaceholderSet()],
          ["Route Matrix", basicPlaceholderSet()],
          ["Run Metadata", basicPlaceholderSet()],
          ["Evidence", basicPlaceholderSet()],
          ["Open Issues", basicPlaceholderSet()],
          ["Suggested Scorecard Entry", basicPlaceholderSet()],
        ]),
      );
      break;
    default:
      break;
  }

  if (results.every((result) => result.level !== "fail")) {
    results.unshift(pass(fileName, "required sections are present"));
  }

  return {
    fileName,
    body,
    frontmatter,
    harness,
    results,
    status,
  };
}

function checkMetadataFields(fileName, frontmatter) {
  const results = [];
  const owner = normalizeScalar(frontmatter.owner);
  const docType = normalizeScalar(frontmatter.doc_type);
  const sourceOfTruth = normalizeScalar(frontmatter.source_of_truth);
  const freshness = normalizeScalar(frontmatter.freshness);
  const verification = normalizeScalar(frontmatter.verification);
  const expectedMetadata = expectedMetadataForFile(fileName);

  if (!owner) {
    results.push(fail(fileName, "missing metadata field: owner"));
  }

  if (docType !== expectedMetadata.docType) {
    results.push(
      fail(fileName, `expected doc_type=${expectedMetadata.docType}`),
    );
  }

  if (sourceOfTruth !== expectedMetadata.sourceOfTruth) {
    results.push(
      fail(
        fileName,
        `expected source_of_truth=${expectedMetadata.sourceOfTruth}`,
      ),
    );
  }

  if (!allowedFreshness.has(freshness)) {
    results.push(
      fail(
        fileName,
        `expected freshness to be one of: ${Array.from(allowedFreshness).join(", ")}`,
      ),
    );
  }

  if (verification !== expectedMetadata.verification) {
    results.push(
      fail(fileName, `expected verification=${expectedMetadata.verification}`),
    );
  }

  return results;
}

function readHarnessContract(frontmatter) {
  return {
    workClass: normalizeScalar(frontmatter.work_class),
    changeTypes: normalizeList(frontmatter.change_types),
    evidenceRequirements: normalizeList(frontmatter.evidence_requirements),
    releaseSurface: normalizeScalar(frontmatter.release_surface),
    primaryGate: normalizeScalar(frontmatter.primary_gate),
  };
}

function validateHarnessContract(fileName, contract) {
  const results = [];

  if (!allowedWorkClasses.has(contract.workClass)) {
    results.push(
      fail(fileName, `invalid work_class: ${contract.workClass || "(empty)"}`),
    );
  }

  const invalidChangeTypes = contract.changeTypes.filter(
    (changeType) => !allowedChangeTypes.has(changeType),
  );
  if (invalidChangeTypes.length > 0) {
    results.push(
      fail(fileName, `invalid change_types: ${formatList(invalidChangeTypes)}`),
    );
  }

  const invalidEvidenceRequirements = contract.evidenceRequirements.filter(
    (evidenceRequirement) => !allowedEvidenceRequirements.has(evidenceRequirement),
  );
  if (invalidEvidenceRequirements.length > 0) {
    results.push(
      fail(
        fileName,
        `invalid evidence_requirements: ${formatList(invalidEvidenceRequirements)}`,
      ),
    );
  }

  if (!allowedReleaseSurfaces.has(contract.releaseSurface)) {
    results.push(
      fail(
        fileName,
        `invalid release_surface: ${contract.releaseSurface || "(empty)"}`,
      ),
    );
  }

  if (!allowedPrimaryGates.has(contract.primaryGate)) {
    results.push(
      fail(fileName, `invalid primary_gate: ${contract.primaryGate || "(empty)"}`),
    );
  }

  return results;
}

function deriveExpectedEvidenceRequirements({
  workClass,
  changeTypes,
  releaseSurface,
  primaryGate,
}) {
  const evidence = new Set(["verify", "quality-scorecard"]);

  if (
    releaseSurface === "user-facing" ||
    changeTypes.includes("user-facing-behavior")
  ) {
    evidence.add("browser-qa");
  }

  if (releaseSurface === "ops-facing" || changeTypes.includes("release-ops")) {
    evidence.add("ops-evidence");
  }

  if (
    releaseSurface === "cross-repo" ||
    changeTypes.some((type) =>
      ["validation-schema", "repository-contract", "cross-repo-contract"].includes(
        type,
      ),
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

function collectHarnessContract(inspectionsByFile) {
  const source =
    inspectionsByFile.get("brief.md") ??
    inspectionsByFile.get("goal-packet.md") ??
    inspectionsByFile.get("team-plan.md") ??
    inspectionsByFile.get("quality-scorecard.md") ??
    null;

  if (!source) {
    return {
      workClass: "soft-gated",
      changeTypes: [],
      evidenceRequirements: [],
      releaseSurface: "none",
      primaryGate: "brief",
    };
  }

  return source.harness;
}

function enforceArtifactMatrix({
  results,
  inspectionsByFile,
  workItemContract,
  workId,
}) {
  const hasUserFacingBehavior =
    workItemContract.changeTypes.includes("user-facing-behavior") ||
    workItemContract.releaseSurface === "user-facing";
  const hasContractChange =
    workItemContract.changeTypes.some((type) =>
      ["validation-schema", "repository-contract", "cross-repo-contract"].includes(
        type,
      ),
    ) || workItemContract.releaseSurface === "cross-repo";
  const hasPromptWorkflow = workItemContract.changeTypes.includes(
    "prompt-workflow",
  );
  const hasReleaseOps =
    workItemContract.changeTypes.includes("release-ops") ||
    workItemContract.releaseSurface === "ops-facing";

  if (workItemContract.workClass === "hard-gated") {
    requireArtifactPresent(
      results,
      inspectionsByFile,
      "goal-packet.md",
      "hard-gated change requires goal-packet.md, team-plan.md, and quality-scorecard.md",
    );
    requireArtifactPresent(
      results,
      inspectionsByFile,
      "team-plan.md",
      "hard-gated change requires goal-packet.md, team-plan.md, and quality-scorecard.md",
    );
    requireArtifactPresent(
      results,
      inspectionsByFile,
      "quality-scorecard.md",
      "hard-gated change requires goal-packet.md, team-plan.md, and quality-scorecard.md",
    );
  }

  if (hasUserFacingBehavior) {
    requireArtifactPresent(
      results,
      inspectionsByFile,
      "ux-review.md",
      "user-facing-behavior change requires ux-review.md and frontend-spec.md",
    );
    requireArtifactPresent(
      results,
      inspectionsByFile,
      "frontend-spec.md",
      "user-facing-behavior change requires ux-review.md and frontend-spec.md",
    );
    requireScorecardEvidence(
      results,
      inspectionsByFile.get("quality-scorecard.md")?.body ?? "",
      "Browser QA Evidence",
      "user-facing-behavior change requires browser QA evidence or an explicit skip reason",
      {
        workId,
        hasBrowserQaDoc: hasOptionalArtifact(
          path.join(workItemsDir, workId),
          "browser-qa.md",
        ),
      },
    );
  }

  if (hasContractChange) {
    requireArtifactPresent(
      results,
      inspectionsByFile,
      "backend-spec.md",
      "validation-schema or repository-contract change requires backend-spec.md and code quality evidence",
    );
    requireScorecardEvidence(
      results,
      inspectionsByFile.get("quality-scorecard.md")?.body ?? "",
      "Code Quality Evidence",
      "validation-schema or repository-contract change requires backend-spec.md and code quality evidence",
    );
  }

  if (hasPromptWorkflow) {
    requireScorecardEvidence(
      results,
      inspectionsByFile.get("quality-scorecard.md")?.body ?? "",
      "Replayable Evaluation Evidence",
      "prompt-workflow change requires replayable evaluation evidence or an explicit skip reason",
    );
  }

  if (hasReleaseOps) {
    requireScorecardEvidence(
      results,
      inspectionsByFile.get("quality-scorecard.md")?.body ?? "",
      "Measurement And Ops Checks",
      "release-ops change requires Measurement And Ops Checks evidence",
    );
  }
}

function requireArtifactPresent(
  results,
  inspectionsByFile,
  fileName,
  message,
) {
  const inspection = inspectionsByFile.get(fileName);

  if (!inspection || inspection.status === "skipped") {
    results.push(fail("work-item", message));
  }
}

function requireScorecardEvidence(
  results,
  scorecardBody,
  heading,
  message,
  context = {},
) {
  const section = extractSection(scorecardBody, heading);

  if (!section) {
    results.push(fail("work-item", message));
    return;
  }

  if (
    heading === "Browser QA Evidence" &&
    !hasBrowserQaEvidence(section, context)
  ) {
    results.push(fail("work-item", message));
    return;
  }

  if (!hasMeaningfulContent(section, basicPlaceholderSet())) {
    results.push(fail("work-item", message));
  }
}

function describeHarnessContract(contract) {
  const parts = [contract.workClass];

  if (contract.changeTypes.length > 0) {
    parts.push(contract.changeTypes.join("+"));
  }

  if (contract.releaseSurface !== "none") {
    parts.push(contract.releaseSurface);
  }

  return parts.join(" ");
}

function formatList(values) {
  return values.map((value) => JSON.stringify(value)).join(", ");
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
  let currentKey = "";

  for (const line of match[1].split("\n")) {
    const parsed = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!parsed) {
      const listItem = line.match(/^\s*-\s*(.*)$/);

      if (listItem && currentKey) {
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = [];
        }

        frontmatter[currentKey].push(listItem[1]);
        continue;
      }

      if (!line.trim()) {
        continue;
      }

      currentKey = "";
      continue;
    }

    currentKey = parsed[1];
    const value = parsed[2].trim();

    if (!value || value === "[]") {
      frontmatter[currentKey] = [];
      continue;
    }

    if (value === "null") {
      frontmatter[currentKey] = null;
      continue;
    }

    frontmatter[currentKey] = value;
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
    .filter(Boolean)
    .filter((line) => !line.startsWith("<!--"));

  if (lines.length === 0) {
    return false;
  }

  return lines.some((line) => !placeholders.has(line));
}

function basicPlaceholderSet(extra = []) {
  return new Set(["-", ...extra]);
}

function hasBrowserQaEvidence(section, { workId, hasBrowserQaDoc }) {
  const normalized = section.toLowerCase();
  const expectedBrowserQaPath = `docs/work-items/${workId}/browser-qa.md`;

  if (
    normalized.includes("browser-qa.md") ||
    normalized.includes(expectedBrowserQaPath.toLowerCase())
  ) {
    return true;
  }

  if (
    normalized.includes("non-user-facing") ||
    normalized.includes("non user-facing") ||
    normalized.includes("browser qa 대상 아님") ||
    normalized.includes("브라우저 qa 대상 아님") ||
    normalized.includes("대상 아님") ||
    normalized.includes("skip reason") ||
    normalized.includes("skip_reason")
  ) {
    return true;
  }

  if (hasBrowserQaDoc) {
    return false;
  }

  return [
    "desktop",
    "mobile",
    "viewport",
    "screenshot",
    "record",
    "flow",
    "responsive",
    "focus",
    "label",
    "contrast",
    "playwright",
    "manual proof",
    "chrome",
  ].some((keyword) => normalized.includes(keyword));
}

function expectedMetadataForFile(fileName) {
  return {
    docType: "task-local",
    sourceOfTruth: "true",
    verification: fileName === "browser-qa.md" ? "generated" : "scripted",
  };
}

function hasOptionalArtifact(targetDir, fileName) {
  return existsSync(path.join(targetDir, fileName));
}

function hasVerificationCommand(section) {
  return /pnpm verify(?::full)?/.test(section);
}

function normalizeScalar(value) {
  return String(value ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return uniqueItems(value.map((item) => normalizeScalar(item)).filter(Boolean));
  }

  const normalized = normalizeScalar(value);

  if (!normalized || normalized === "[]") {
    return [];
  }

  return uniqueItems([normalized]);
}

function uniqueItems(items) {
  return [...new Set(items.filter(Boolean))];
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
