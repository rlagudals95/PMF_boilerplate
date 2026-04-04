# Harness Engineering V1 Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a classification-aware hybrid harness so risky changes are forced through the right work-item artifacts and scripted gates before they can be treated as done.

**Architecture:** Extend the existing Repo OS instead of adding a new platform. First encode `work_class`, `change_types`, `release_surface`, `evidence_requirements`, and `primary_gate` into work-item templates and canonical docs. Then make `work:new` and `feature:new` scaffold those fields, teach `squad:check` to enforce a risk-based artifact matrix, and finally teach `repo:check` to validate classification consistency across active work items.

**Tech Stack:** Node.js CLI scripts, Markdown templates/docs, pnpm, repo-local verification scripts

---

## Scope Decision

- This plan implements the core harness slice only: classification contract, scaffolding, and deterministic gates.
- It intentionally stops short of deeper browser-qa script changes, hook UX, or full cross-repo contract automation.
- The first shippable result should already make vibe-coded risky changes harder to ship without evidence.

## File Map

- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/goal-packet.md`
  Responsibility: add classification metadata to the normalization artifact
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/brief.md`
  Responsibility: capture work class and risk summary at the implementation entry document
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/team-plan.md`
  Responsibility: record classification in shared context and evidence ownership
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/quality-scorecard.md`
  Responsibility: express required evidence and release-surface-specific closure rules
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/operating-model.md`
  Responsibility: document the hybrid harness model and risk-based hard-gate taxonomy
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md`
  Responsibility: explain the new classification contract and how gates interpret it
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md`
  Responsibility: update the Repo OS delivery contract and verification entry points
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai/context/ai-native.md`
  Responsibility: declare evidence closure and hybrid harness as canonical operating language
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md`
  Responsibility: align prompt-first workflow with classification-aware gating
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-work-item.mjs`
  Responsibility: scaffold classification metadata into manual work items
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-feature-from-prd.mjs`
  Responsibility: scaffold classification metadata into PRD-derived work items
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-squad-work-item.mjs`
  Responsibility: enforce the artifact/evidence matrix based on declared risk
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-repo-os.mjs`
  Responsibility: enforce classification consistency across active work items
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/*.md`
  Responsibility: backfill the active work item so the new gates can pass immediately

### Task 1: Encode The Hybrid Harness Contract In Templates And Canonical Docs

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/goal-packet.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/brief.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/team-plan.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/quality-scorecard.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/operating-model.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai/context/ai-native.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md`
- Test: static text search under `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs` and `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai`

- [ ] **Step 1: Confirm the classification contract does not exist yet**

Run:

```bash
rg -n "work_class|change_types|release_surface|primary_gate|evidence_requirements" \
  docs/product-squad/templates \
  docs/product-squad/operating-model.md \
  docs/work-items/README.md \
  docs/repo-os.md \
  ai/context/ai-native.md \
  docs/ai-starter-prompt-pack.md
```

Expected: no matches.

- [ ] **Step 2: Add machine-readable classification metadata to the templates**

Update the frontmatter in the four template files to include the same new fields directly after `skip_reason`.

```md
work_class: "soft-gated"
change_types: []
evidence_requirements: []
release_surface: "none"
primary_gate: "brief"
```

Also update the bodies as follows.

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/goal-packet.md`, add a section after `## Visual Bar`:

```md
## Change Classification

- work class:
- change types:
- release surface:
- primary gate:
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/brief.md`, replace the empty `Enterprise Decision Guardrails` section body with:

```md
- work class:
- why this is gated:
- change types:
- evidence requirements:
- primary gate:
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/team-plan.md`, add these lines under `## Shared Context Pack`:

```md
- work class:
- change types:
- release surface:
- evidence requirements:
- primary gate:
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/quality-scorecard.md`, insert the section below `## Product Risks To Kill`:

```md
## Required Evidence

- required artifacts:
- required evidence:
- release surface:
- primary gate:
- explicit skip reasons:
```

- [ ] **Step 3: Update canonical docs to describe the hybrid harness**

Add or adjust the following language in the canonical docs.

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai/context/ai-native.md`, extend the `Quality Bar` section with:

```md
- 중요한 작업은 `light | soft-gated | hard-gated` 분류를 먼저 선언한다.
- hard-gated 변경은 declared risk에 맞는 artifact와 evidence 없이 완료로 보지 않는다.
- ship 판단은 merge 자체가 아니라 `evidence closure`를 기준으로 한다.
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md`, replace the generic delivery contract text with:

```md
요청 triage는 아래 세 축으로 해석합니다.

- work class: `light | soft-gated | hard-gated`
- editing depth: `product-config-friendly | deep code`
- release surface: `none | user-facing | ops-facing | cross-repo`

hard-gated 작업은 change type에 맞는 artifact matrix와 evidence closure를 통과해야 합니다.
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/operating-model.md`, add a subsection after `Task Triage Matrix`:

```md
## Hybrid Harness Defaults

- `light`: small low-risk changes that can close with local verify
- `soft-gated`: meaningful changes that require `brief` and verify evidence
- `hard-gated`: changes that alter user behavior, contracts, ops interpretation, prompt/workflow, or release rules

대표 `change_types`:

- `user-facing-behavior`
- `validation-schema`
- `repository-contract`
- `cross-repo-contract`
- `prompt-workflow`
- `release-ops`
- `new-capability`
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md`, add:

```md
- work item frontmatter는 `work_class`, `change_types`, `evidence_requirements`, `release_surface`, `primary_gate`를 함께 가진다.
- `squad:check`는 이 metadata를 읽어 required artifact/evidence matrix를 검사한다.
- `repo:check`는 active work item의 classification consistency를 검사한다.
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md`, update the triage description to say:

```md
- 먼저 `light | soft-gated | hard-gated`를 판정한다.
- hard-gated면 change type과 release surface를 선언하고 work item artifact를 먼저 연다.
```

- [ ] **Step 4: Verify the new contract text is present everywhere expected**

Run:

```bash
rg -n "work_class|change_types|release_surface|primary_gate|evidence_requirements|hybrid harness|evidence closure" \
  docs/product-squad/templates \
  docs/product-squad/operating-model.md \
  docs/work-items/README.md \
  docs/repo-os.md \
  ai/context/ai-native.md \
  docs/ai-starter-prompt-pack.md
```

Expected: matches in all updated templates plus the four canonical docs.

- [ ] **Step 5: Commit**

```bash
git add \
  docs/product-squad/templates/goal-packet.md \
  docs/product-squad/templates/brief.md \
  docs/product-squad/templates/team-plan.md \
  docs/product-squad/templates/quality-scorecard.md \
  docs/product-squad/operating-model.md \
  docs/work-items/README.md \
  docs/repo-os.md \
  ai/context/ai-native.md \
  docs/ai-starter-prompt-pack.md
git commit -m "docs: define hybrid harness contract"
```

### Task 2: Scaffold Classification Metadata From `work:new` And `feature:new`

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-work-item.mjs`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-feature-from-prd.mjs`
- Test: generated smoke dirs under `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/`

- [ ] **Step 1: Reproduce the current scaffold output**

Run:

```bash
tmp_id="$(date +%Y%m%d)-harness-classification-smoke"
rm -rf "docs/work-items/$tmp_id"
pnpm work:new harness-classification-smoke \
  --request "classification smoke" \
  --class hard-gated \
  --type user-facing-behavior \
  --release-surface user-facing \
  --primary-gate scorecard
sed -n '1,20p' "docs/work-items/$tmp_id/goal-packet.md"
rm -rf "docs/work-items/$tmp_id"
```

Expected: the generated file still shows template defaults such as `work_class: "soft-gated"` because `work:new` does not yet honor the override flags.

- [ ] **Step 2: Make `work:new` preserve classification defaults and allow future overrides**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-work-item.mjs`, update `parseArgs` and `materializeTaskLocalTemplate` like this:

```js
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
      request = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--class") {
      workClass = args[index + 1] ?? workClass;
      index += 1;
      continue;
    }

    if (arg === "--type") {
      changeTypes.push(args[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--release-surface") {
      releaseSurface = args[index + 1] ?? releaseSurface;
      index += 1;
      continue;
    }

    if (arg === "--primary-gate") {
      primaryGate = args[index + 1] ?? primaryGate;
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
  const {
    request,
    workClass,
    changeTypes,
    releaseSurface,
    primaryGate,
  } = options;

  let output = template
    .replace(/^doc_type:\s*".*"$/m, 'doc_type: "task-local"')
    .replace(/^source_of_truth:\s*.*$/m, "source_of_truth: true")
    .replace(/^freshness:\s*".*"$/m, 'freshness: "active"')
    .replace(/^verification:\s*".*"$/m, 'verification: "scripted"')
    .replace(/^work_class:\s*".*"$/m, `work_class: ${JSON.stringify(workClass)}`)
    .replace(
      /^change_types:\s*\[\]$/m,
      changeTypes.length === 0
        ? "change_types: []"
        : `change_types:\n${changeTypes.map((item) => `  - ${JSON.stringify(item)}`).join("\n")}`,
    )
    .replace(
      /^release_surface:\s*".*"$/m,
      `release_surface: ${JSON.stringify(releaseSurface)}`,
    )
    .replace(
      /^primary_gate:\s*".*"$/m,
      `primary_gate: ${JSON.stringify(primaryGate)}`,
    );

  if (request) {
    output = output.replace(
      /^source_request:\s*.*$/m,
      `source_request: ${JSON.stringify(request)}`,
    );
  }

  return output;
}
```

- [ ] **Step 3: Make `feature:new` emit classification metadata through `renderFrontmatter`**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-feature-from-prd.mjs`, add a helper and pass the metadata into each rendered artifact:

```js
function buildHarnessDefaults(planning) {
  const changeTypes = [];

  if (planning.frontendRequired || planning.uxRequired) {
    changeTypes.push("user-facing-behavior");
  }

  if (planning.backendRequired) {
    changeTypes.push("repository-contract");
  }

  return {
    work_class: "hard-gated",
    change_types: uniqueItems(changeTypes),
    evidence_requirements: planning.frontendRequired
      ? ["verify", "browser-qa", "quality-scorecard"]
      : ["verify", "quality-scorecard"],
    release_surface: planning.frontendRequired ? "user-facing" : "none",
    primary_gate: "scorecard",
  };
}

function withHarnessDefaults(baseFields, planning) {
  return {
    ...baseFields,
    ...buildHarnessDefaults(planning),
  };
}

const goalPacketFrontmatter = renderFrontmatter(
  withHarnessDefaults(
    {
      status: planning.readiness === "blocked" ? "blocked" : "draft",
      owner_role: "product-squad",
      source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
      affected_paths: planning.affectedPaths,
      dependencies: [`docs/prds/${planning.prd.slug}.md`],
      skip_reason: null,
    },
    planning,
  ),
);
```

Then replace each existing `renderFrontmatter({ ... })` call in `renderGoalPacket`, `renderBrief`, `renderTeamPlan`, `renderUxReview`, `renderFrontendSpec`, `renderBackendSpec`, and `renderQualityScorecard` with `renderFrontmatter(withHarnessDefaults({ ... }, planning))`.

- [ ] **Step 4: Smoke-test both scaffold paths**

Run:

```bash
tmp_id="$(date +%Y%m%d)-harness-classification-smoke"
rm -rf "docs/work-items/$tmp_id"
pnpm work:new harness-classification-smoke \
  --request "classification smoke" \
  --class hard-gated \
  --type user-facing-behavior \
  --release-surface user-facing \
  --primary-gate scorecard
sed -n '1,22p' "docs/work-items/$tmp_id/goal-packet.md"
rm -rf "docs/work-items/$tmp_id"

tmp_feature_id="$(date +%Y%m%d)-rental-intake-funnel"
rm -rf "docs/work-items/$tmp_feature_id"
pnpm feature:new --prd rental-demand-validation-example --feature rental-intake-funnel
sed -n '1,22p' "docs/work-items/$tmp_feature_id/brief.md"
rm -rf "docs/work-items/$tmp_feature_id"
```

Expected: both generated artifacts include `work_class`, `change_types`, `release_surface`, and `primary_gate`.

- [ ] **Step 5: Commit**

```bash
git add scripts/create-work-item.mjs scripts/create-feature-from-prd.mjs
git commit -m "feat: scaffold harness classifications"
```

### Task 3: Teach `squad:check` The Classification-Aware Artifact Matrix

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-squad-work-item.mjs`
- Test: temporary work items under `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/`

- [ ] **Step 1: Capture the current gate behavior for a hard-gated work item**

Run:

```bash
tmp_id="$(date +%Y%m%d)-harness-gate-smoke"
rm -rf "docs/work-items/$tmp_id"
pnpm work:new harness-gate-smoke --request "gate smoke"
pnpm squad:check "$tmp_id"
rm -rf "docs/work-items/$tmp_id"
```

Expected: the check only warns about draft/placeholder sections and does not understand risk-based evidence requirements.

- [ ] **Step 2: Add classification parsing and an artifact/evidence matrix**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-squad-work-item.mjs`, add these helpers near the top-level utilities:

```js
const allowedWorkClasses = new Set(["light", "soft-gated", "hard-gated"]);
const allowedReleaseSurfaces = new Set([
  "none",
  "user-facing",
  "ops-facing",
  "cross-repo",
]);

function readHarnessContract(frontmatter) {
  const workClass = normalizeScalar(frontmatter.work_class);
  const changeTypes = normalizeList(frontmatter.change_types);
  const evidenceRequirements = normalizeList(frontmatter.evidence_requirements);
  const releaseSurface = normalizeScalar(frontmatter.release_surface);
  const primaryGate = normalizeScalar(frontmatter.primary_gate);

  return {
    workClass,
    changeTypes,
    evidenceRequirements,
    releaseSurface,
    primaryGate,
  };
}

function validateHarnessContract(fileName, contract) {
  const results = [];

  if (!allowedWorkClasses.has(contract.workClass)) {
    results.push(fail(fileName, `invalid work_class: ${contract.workClass || "(empty)"}`));
  }

  if (!allowedReleaseSurfaces.has(contract.releaseSurface)) {
    results.push(
      fail(fileName, `invalid release_surface: ${contract.releaseSurface || "(empty)"}`),
    );
  }

  if (!contract.primaryGate) {
    results.push(fail(fileName, "primary_gate is empty"));
  }

  return results;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeScalar(item))
      .filter(Boolean);
  }

  const normalized = normalizeScalar(value);
  return normalized ? [normalized] : [];
}

function collectHarnessContract(inspectionsByFile) {
  const source =
    inspectionsByFile.get("brief.md") ??
    inspectionsByFile.get("goal-packet.md") ??
    {
      harness: {
        workClass: "soft-gated",
        changeTypes: [],
        evidenceRequirements: [],
        releaseSurface: "none",
        primaryGate: "brief",
      },
    };

  return source.harness;
}

function requireFileStatus(results, fileName, predicate, message) {
  const fileResult = results.find((result) => result.file === fileName);

  if (!fileResult || !predicate(fileResult)) {
    results.push(fail("work-item", message));
  }
}

function requireScorecardEvidence(results, scorecardBody, heading, message) {
  const sectionPattern = new RegExp(`## ${heading}[\\s\\S]*?(?=\\n## |$)`);
  const match = scorecardBody.match(sectionPattern);

  if (!match || /^\s*##[^\n]+\s*-\s*$/m.test(match[0]) || match[0].trim().endsWith("\n-")) {
    results.push(fail("work-item", message));
  }
}
```

Change `inspectFile` to return a structured object:

```js
function inspectFile(fileName, markdown, context) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const status = normalizeScalar(frontmatter.status);
  const metadataResults = checkMetadataFields(fileName, frontmatter);
  const results = [...metadataResults];
  const harness = readHarnessContract(frontmatter);

  results.push(...validateHarnessContract(fileName, harness));

  // keep the existing skipped/draft/section checks here

  return {
    fileName,
    body,
    frontmatter,
    harness,
    results,
    status,
  };
}
```

Then update the main loop to keep file-level inspection data:

```js
const inspectionsByFile = new Map();

for (const fileName of requiredFiles) {
  const markdown = await readFile(path.join(targetDir, fileName), "utf8");
  const inspection = inspectFile(fileName, markdown, { workId, targetDir });
  inspectionsByFile.set(fileName, inspection);
  results.push(...inspection.results);
}
```

Finally, replace the old inline call site with:

```js
const harness = readHarnessContract(frontmatter);
results.push(...validateHarnessContract(fileName, harness));
```

Add a work-item-level pass after all files are inspected:

```js
const workItemContract = collectHarnessContract(inspectionsByFile);
const scorecardBody = inspectionsByFile.get("quality-scorecard.md")?.body ?? "";

if (workItemContract.workClass === "hard-gated") {
  requireFileStatus(
    results,
    "goal-packet.md",
    (result) => result.level !== "fail",
    "hard-gated change requires goal-packet.md, team-plan.md, and quality-scorecard.md",
  );
  requireFileStatus(
    results,
    "team-plan.md",
    (result) => result.level !== "fail",
    "hard-gated change requires goal-packet.md, team-plan.md, and quality-scorecard.md",
  );
  requireFileStatus(
    results,
    "quality-scorecard.md",
    (result) => result.level !== "fail",
    "hard-gated change requires goal-packet.md, team-plan.md, and quality-scorecard.md",
  );
}

if (workItemContract.changeTypes.includes("user-facing-behavior")) {
  requireFileStatus(
    results,
    "ux-review.md",
    (result) => result.level !== "fail",
    "user-facing-behavior change requires ux-review.md and frontend-spec.md",
  );
  requireFileStatus(
    results,
    "frontend-spec.md",
    (result) => result.level !== "fail",
    "user-facing-behavior change requires ux-review.md and frontend-spec.md",
  );
  requireScorecardEvidence(
    results,
    scorecardBody,
    "Browser QA Evidence",
    "user-facing-behavior change requires browser QA evidence or an explicit skip reason",
  );
}

if (
  workItemContract.changeTypes.includes("validation-schema") ||
  workItemContract.changeTypes.includes("repository-contract")
) {
  requireFileStatus(
    results,
    "backend-spec.md",
    (result) => result.level !== "fail",
    "repository-contract change requires backend-spec.md and code quality evidence",
  );
  requireScorecardEvidence(
    results,
    scorecardBody,
    "Code Quality Evidence",
    "repository-contract change requires backend-spec.md and code quality evidence",
  );
}

if (workItemContract.changeTypes.includes("prompt-workflow")) {
  requireScorecardEvidence(
    results,
    scorecardBody,
    "Replayable Evaluation Evidence",
    "prompt-workflow change requires replayable evaluation evidence or an explicit skip reason",
  );
}

if (workItemContract.changeTypes.includes("release-ops")) {
  requireScorecardEvidence(
    results,
    scorecardBody,
    "Measurement And Ops Checks",
    "release-ops change requires Measurement And Ops Checks evidence",
  );
}
```

- [ ] **Step 3: Make the failure messages action-oriented**

Add or update the work-item-level failures so they read like this:

```js
fail("work-item", "hard-gated change requires goal-packet.md, team-plan.md, and quality-scorecard.md")
fail("work-item", "user-facing-behavior change requires browser QA evidence or an explicit skip reason")
fail("work-item", "repository-contract change requires backend-spec.md and code quality evidence")
fail("work-item", "prompt-workflow change requires replayable evaluation evidence or an explicit skip reason")
fail("work-item", "release-ops change requires Measurement And Ops Checks evidence")
```

- [ ] **Step 4: Reproduce both a failing and a passing path**

Run:

```bash
tmp_id="$(date +%Y%m%d)-harness-gate-smoke"
rm -rf "docs/work-items/$tmp_id"
pnpm work:new harness-gate-smoke \
  --request "gate smoke" \
  --class hard-gated \
  --type user-facing-behavior \
  --release-surface user-facing \
  --primary-gate scorecard
pnpm squad:check "$tmp_id"
```

Expected: FAIL with a browser QA or user-facing evidence message.

Then patch the temporary scorecard and rerun:

```bash
perl -0pi -e 's/## Browser QA Evidence\n\n-\n/## Browser QA Evidence\n\n- docs\\/work-items\\/'"$tmp_id"'\\/browser-qa.md\\n/' "docs/work-items/$tmp_id/quality-scorecard.md"
perl -0pi -e 's/status: draft/status: in_progress/' \
  "docs/work-items/$tmp_id/goal-packet.md" \
  "docs/work-items/$tmp_id/brief.md" \
  "docs/work-items/$tmp_id/team-plan.md" \
  "docs/work-items/$tmp_id/ux-review.md" \
  "docs/work-items/$tmp_id/frontend-spec.md" \
  "docs/work-items/$tmp_id/backend-spec.md" \
  "docs/work-items/$tmp_id/quality-scorecard.md"
pnpm squad:check "$tmp_id"
rm -rf "docs/work-items/$tmp_id"
```

Expected: the second run no longer fails on missing harness evidence for the declared change type.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-squad-work-item.mjs
git commit -m "feat: enforce harness artifact matrix in squad check"
```

### Task 4: Extend `repo:check` And Backfill The Active Work Item

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-repo-os.mjs`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/goal-packet.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/brief.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/team-plan.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/quality-scorecard.md`
- Test: active work item `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/`

- [ ] **Step 1: Show that the current active work item lacks harness metadata**

Run:

```bash
rg -n "work_class|change_types|release_surface|primary_gate|evidence_requirements" \
  docs/work-items/20260329-ai-native-operating-canonicalization
```

Expected: no matches.

- [ ] **Step 2: Add classification consistency checks to `repo:check`**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-repo-os.mjs`, add helpers after `validateMetadataFrontmatter`:

```js
function validateHarnessMetadata(frontmatter) {
  const workClass = normalizeScalar(frontmatter.work_class);
  const releaseSurface = normalizeScalar(frontmatter.release_surface);
  const primaryGate = normalizeScalar(frontmatter.primary_gate);

  const issues = [];

  if (workClass && !["light", "soft-gated", "hard-gated"].includes(workClass)) {
    issues.push(`invalid work_class: ${workClass}`);
  }

  if (
    releaseSurface &&
    !["none", "user-facing", "ops-facing", "cross-repo"].includes(releaseSurface)
  ) {
    issues.push(`invalid release_surface: ${releaseSurface}`);
  }

  if ("work_class" in frontmatter && !primaryGate) {
    issues.push("missing primary_gate");
  }

  return issues;
}
```

Inside `checkTargetWorkItems`, after reading each active work item's `brief.md`, validate the harness metadata and emit failures like:

```js
results.push(
  fail("work-item", `${workId}: brief.md missing valid harness metadata`),
);
```

Also add a follow-up read of `quality-scorecard.md` so `user-facing` active work items fail if browser evidence is absent:

```js
if (releaseSurface === "user-facing" && !scorecardBody.includes("browser-qa.md")) {
  results.push(
    fail("work-item", `${workId}: user-facing work item is missing browser QA evidence reference`),
  );
}
```

- [ ] **Step 3: Backfill the active work item with explicit harness metadata**

In each of these files:

- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/goal-packet.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/brief.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/team-plan.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/quality-scorecard.md`

add this frontmatter block:

```md
work_class: "hard-gated"
change_types:
  - "prompt-workflow"
evidence_requirements:
  - "repo:check"
  - "squad:check"
  - "ai:sync"
  - "verify"
release_surface: "none"
primary_gate: "scorecard"
```

Then add a short note in the scorecard body under `## Replayable Evaluation Evidence`:

```md
- skip reason: canonical workflow hardening slice. `repo:check`, `squad:check`, `ai:sync`, and `verify` act as the replayable proof for this non-user-facing change.
```

- [ ] **Step 4: Run the end-to-end verification for the core slice**

Run:

```bash
pnpm squad:check 20260329-ai-native-operating-canonicalization
pnpm repo:check --work 20260329-ai-native-operating-canonicalization
pnpm verify
```

Expected: all three commands pass.

- [ ] **Step 5: Commit**

```bash
git add \
  scripts/check-repo-os.mjs \
  docs/work-items/20260329-ai-native-operating-canonicalization/goal-packet.md \
  docs/work-items/20260329-ai-native-operating-canonicalization/brief.md \
  docs/work-items/20260329-ai-native-operating-canonicalization/team-plan.md \
  docs/work-items/20260329-ai-native-operating-canonicalization/quality-scorecard.md
git commit -m "feat: add repo-level harness consistency checks"
```

## Follow-Up Plan Boundary

- Browser-qa script changes for richer release-surface awareness are intentionally deferred.
- Hook UX and CI summary improvements are intentionally deferred.
- Cross-repo contract automation is intentionally deferred until this repository-level harness proves stable.
