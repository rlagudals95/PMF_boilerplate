# Repo Goal Fit Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-class `goal-packet.md` artifact to the work-item flow, wire scaffolding and checks around it, and strengthen triage/handoff docs without touching runtime product behavior.

**Architecture:** Introduce `goal-packet.md` as a canonical template under `docs/product-squad/templates`, materialize it into task-local work items from both `work:new` and `feature:new`, and extend `squad:check` so active work items cannot pass without it. Then align `operating-model`, `agent-team-delivery`, `team-plan`, and `work-items/README` so the new artifact, triage matrix, and handoff rubric are visible in the operating docs.

**Tech Stack:** Node.js CLI scripts, Markdown templates/docs, pnpm, repo-local verification scripts

---

## Scope Decision

- This phase intentionally stops at the Repo OS and work-item contract layer.
- No `apps/web` runtime code, package logic, or browser UI is changed in this slice.
- Because this repository uses work items for both product and non-product changes, `goal-packet.md` should be implemented as a generalized normalization artifact with `Selected Delivery Shape`, `Active Scope`, and `Deferred Scope` instead of forcing product-only wording into operating-model work items.

## File Map

- Create: `docs/product-squad/templates/goal-packet.md`
  Responsibility: canonical scaffold for normalized request context before `brief.md`
- Modify: `scripts/create-work-item.mjs`
  Responsibility: materialize canonical templates as task-local docs and include `goal-packet.md`
- Modify: `scripts/create-feature-from-prd.mjs`
  Responsibility: derive a task-local `goal-packet.md` from PRD context and reference it from generated docs
- Modify: `scripts/check-squad-work-item.mjs`
  Responsibility: require `goal-packet.md` for active work items and validate its sections
- Create: `docs/work-items/20260329-ai-native-operating-canonicalization/goal-packet.md`
  Responsibility: backfill the current active work item so `repo:check` stays green after the new contract lands
- Modify: `docs/product-squad/operating-model.md`
  Responsibility: show the new artifact order and add a task-triage matrix
- Modify: `docs/product-squad/agent-team-delivery.md`
  Responsibility: add a handoff quality rubric that makes packets more actionable
- Modify: `docs/product-squad/templates/team-plan.md`
  Responsibility: expose `goal packet` in shared context and add handoff quality criteria
- Modify: `docs/work-items/README.md`
  Responsibility: document `goal-packet.md` as a required work-item artifact and explain its role

### Task 1: Add `goal-packet` Template And Fix `work:new` Materialization

**Files:**
- Create: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/goal-packet.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-work-item.mjs`
- Test: generated smoke dir under `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/`

- [ ] **Step 1: Reproduce the current scaffold gap**

Run:

```bash
tmp_id="$(date +%Y%m%d)-scaffold-metadata-smoke"
rm -rf "docs/work-items/$tmp_id"
pnpm work:new scaffold-metadata-smoke --request "smoke"
sed -n '1,12p' "docs/work-items/$tmp_id/brief.md"
test -f "docs/work-items/$tmp_id/goal-packet.md"
```

Expected: `brief.md` still shows `doc_type: "canonical"` and `test -f` exits non-zero because `goal-packet.md` is missing.

- [ ] **Step 2: Create the canonical `goal-packet` template**

Create `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/goal-packet.md` with this exact content:

```md
---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: draft
owner_role: product-squad
source_request: ""
affected_paths: []
dependencies: []
skip_reason: null
---

# Goal Packet

## Business Goal

-

## Target User

-

## Target Moment

-

## Success Metric

-

## Non-Goals

-

## Constraints

-

## Existing Evidence

-

## Selected Delivery Shape

-

## Active Scope

-

## Deferred Scope

-

## Selection Rationale

-
```

- [ ] **Step 3: Make `work:new` emit task-local docs and include `goal-packet.md`**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-work-item.mjs`, update the scaffold list and add a materialization helper instead of writing canonical templates verbatim.

```js
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

function materializeTaskLocalTemplate(template, { request }) {
  let output = template
    .replace(/^doc_type:\s*".*"$/m, 'doc_type: "task-local"')
    .replace(/^source_of_truth:\s*.*$/m, "source_of_truth: true")
    .replace(/^freshness:\s*".*"$/m, 'freshness: "active"')
    .replace(/^verification:\s*".*"$/m, 'verification: "scripted"');

  if (request) {
    output = output.replace(
      'source_request: ""',
      `source_request: ${JSON.stringify(request)}`,
    );
  }

  return output;
}
```

- [ ] **Step 4: Re-run the scaffold smoke check and confirm the new artifact exists**

Run:

```bash
tmp_id="$(date +%Y%m%d)-scaffold-metadata-smoke"
rm -rf "docs/work-items/$tmp_id"
pnpm work:new scaffold-metadata-smoke --request "smoke"
sed -n '1,12p' "docs/work-items/$tmp_id/brief.md"
sed -n '1,24p' "docs/work-items/$tmp_id/goal-packet.md"
rm -rf "docs/work-items/$tmp_id"
```

Expected: `brief.md` now shows `doc_type: "task-local"` and `goal-packet.md` exists with the new scaffold sections.

- [ ] **Step 5: Commit**

```bash
git add docs/product-squad/templates/goal-packet.md scripts/create-work-item.mjs
git commit -m "feat: scaffold goal packets for work items"
```

### Task 2: Generate `goal-packet.md` From PRD-Based Feature Scaffolds

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-feature-from-prd.mjs`
- Test: generated smoke dir under `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/`

- [ ] **Step 1: Confirm `feature:new` has no goal-packet generation today**

Run:

```bash
rg -n "goal-packet\\.md|renderGoalPacket|buildActiveScope|buildDeferredScope" scripts/create-feature-from-prd.mjs
```

Expected: no matches.

- [ ] **Step 2: Add `renderGoalPacket` and wire it into `feature:new`**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-feature-from-prd.mjs`, add goal-packet rendering, plus helper functions and dependency/context references.

```js
const knownGoalPacketScopes = [
  "landing",
  "lead",
  "consultation",
  "payment",
  "admin",
  "auth",
];

async function main() {
  const { prdSlug, requestedFeatureSlug } = parseArgs(process.argv.slice(2));
  const prdPath = path.join(prdsDir, `${prdSlug}.md`);
  const prdRaw = await readFile(prdPath, "utf8");
  const prd = parsePrdDocument(prdRaw, prdSlug);
  const selectedFeature = selectFeatureCandidate(prd, requestedFeatureSlug);
  const planning = buildPlanningContext(prd, selectedFeature);
  const workId = await resolveWorkId(selectedFeature.slug);
  const targetDir = path.join(workItemsDir, workId);

  await mkdir(targetDir, { recursive: true });

  await Promise.all([
    writeFile(
      path.join(targetDir, "goal-packet.md"),
      renderGoalPacket(workId, planning),
    ),
    writeFile(path.join(targetDir, "brief.md"), renderBrief(workId, planning)),
    writeFile(
      path.join(targetDir, "team-plan.md"),
      renderTeamPlan(workId, planning),
    ),
    writeFile(
      path.join(targetDir, "feature-spec.md"),
      renderFeatureSpec(workId, planning),
    ),
    writeFile(
      path.join(targetDir, "ux-review.md"),
      renderUxReview(workId, planning),
    ),
    writeFile(
      path.join(targetDir, "frontend-spec.md"),
      renderFrontendSpec(workId, planning),
    ),
    writeFile(
      path.join(targetDir, "backend-spec.md"),
      renderBackendSpec(workId, planning),
    ),
    writeFile(
      path.join(targetDir, "quality-scorecard.md"),
      renderQualityScorecard(workId, planning),
    ),
  ]);
}

function renderGoalPacket(workId, planning) {
  return [
    renderFrontmatter({
      status: planning.readiness === "blocked" ? "blocked" : "draft",
      owner_role: "product-squad",
      source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
      affected_paths: planning.affectedPaths,
      dependencies: [`docs/prds/${planning.prd.slug}.md`],
      skip_reason: null,
    }),
    "# Goal Packet",
    "",
    "## Business Goal",
    "",
    ...renderBulletList([planning.goal]),
    "",
    "## Target User",
    "",
    ...renderBulletList([planning.targetUser]),
    "",
    "## Target Moment",
    "",
    ...renderBulletList([planning.targetMoment]),
    "",
    "## Success Metric",
    "",
    ...renderBulletList(planning.successMetric),
    "",
    "## Non-Goals",
    "",
    ...renderBulletList(planning.outOfScope),
    "",
    "## Constraints",
    "",
    ...renderBulletList(planning.constraints),
    "",
    "## Existing Evidence",
    "",
    ...renderBulletList(planning.existingEvidence),
    "",
    "## Selected Delivery Shape",
    "",
    ...renderBulletList([buildSelectedDeliveryShape(planning)]),
    "",
    "## Active Scope",
    "",
    ...renderBulletList(buildActiveScope(planning)),
    "",
    "## Deferred Scope",
    "",
    ...renderBulletList(buildDeferredScope(planning)),
    "",
    "## Selection Rationale",
    "",
    ...renderBulletList(buildSelectionRationale(planning)),
    "",
  ].join("\n");
}

function buildSelectedDeliveryShape(planning) {
  return `${planning.feature.slug} feature slice`;
}

function buildActiveScope(planning) {
  const scope = [];

  if (planning.feature.routes.includes("/")) {
    scope.push("landing");
  }

  if (planning.feature.primaryModule === "lead") {
    scope.push("lead");
  }

  if (planning.feature.routes.some((route) => route.startsWith("/consult"))) {
    scope.push("consultation");
  }

  if (planning.feature.routes.some((route) => route.startsWith("/pay"))) {
    scope.push("payment");
  }

  if (planning.feature.routes.some((route) => route.startsWith("/admin"))) {
    scope.push("admin");
  }

  if (planning.feature.primaryModule === "auth") {
    scope.push("auth");
  }

  return scope.length > 0
    ? uniqueItems(scope)
    : [planning.feature.primaryModule || "documentation"];
}

function buildDeferredScope(planning) {
  const activeScope = new Set(buildActiveScope(planning));
  const deferred = knownGoalPacketScopes.filter((item) => !activeScope.has(item));

  return deferred.length > 0 ? deferred : ["none"];
}

function buildSelectionRationale(planning) {
  return uniqueItems([
    `Selected because the thinnest measurable slice is ${planning.feature.title}.`,
    planning.feature.summary || planning.goal,
    `Primary module target: ${planning.feature.primaryModule || "unknown"}.`,
  ]);
}

function buildDependencies(workId, planning, includeFeatureSpec) {
  return uniqueItems(
    [
      `docs/prds/${planning.prd.slug}.md`,
      `docs/work-items/${workId}/goal-packet.md`,
      includeFeatureSpec ? `docs/work-items/${workId}/feature-spec.md` : null,
    ].filter(Boolean),
  );
}

function buildSharedContextPack(workId, planning) {
  return uniqueItems(
    [
      `docs/work-items/${workId}/goal-packet.md`,
      `docs/prds/${planning.prd.slug}.md`,
      `docs/work-items/${workId}/brief.md`,
      `docs/work-items/${workId}/feature-spec.md`,
      planning.uxRequired ? `docs/work-items/${workId}/ux-review.md` : null,
      planning.frontendRequired
        ? `docs/work-items/${workId}/frontend-spec.md`
        : null,
      planning.backendRequired
        ? `docs/work-items/${workId}/backend-spec.md`
        : null,
    ].filter(Boolean),
  );
}
```

- [ ] **Step 3: Smoke-check the PRD path and inspect the generated goal packet**

Run:

```bash
tmp_work_id="$(date +%Y%m%d)-rental-intake-funnel"
rm -rf "docs/work-items/$tmp_work_id"
pnpm feature:new --prd rental-demand-validation-example --feature rental-intake-funnel
sed -n '1,40p' "docs/work-items/$tmp_work_id/goal-packet.md"
rg -n "goal-packet\\.md" \
  "docs/work-items/$tmp_work_id/team-plan.md" \
  "docs/work-items/$tmp_work_id/frontend-spec.md" \
  "docs/work-items/$tmp_work_id/backend-spec.md"
rm -rf "docs/work-items/$tmp_work_id"
```

Expected: the generated work item includes `goal-packet.md`, and the role docs reference it through dependencies or shared context.

- [ ] **Step 4: Re-run the static search and confirm the new helpers exist**

Run:

```bash
rg -n "goal-packet\\.md|renderGoalPacket|buildActiveScope|buildDeferredScope" scripts/create-feature-from-prd.mjs
```

Expected: matches for the new file generation and helper functions.

- [ ] **Step 5: Commit**

```bash
git add scripts/create-feature-from-prd.mjs
git commit -m "feat: derive goal packets from feature scaffolds"
```

### Task 3: Enforce The Contract In `squad:check` And Backfill The Current Active Work Item

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-squad-work-item.mjs`
- Create: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/goal-packet.md`
- Test: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/`

- [ ] **Step 1: Require `goal-packet.md` and validate its sections**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/check-squad-work-item.mjs`, add the new required file and a section validator.

```js
const requiredFiles = [
  "goal-packet.md",
  "brief.md",
  "team-plan.md",
  "ux-review.md",
  "frontend-spec.md",
  "backend-spec.md",
  "quality-scorecard.md",
];

function inspectFile(fileName, markdown) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const status = normalizeScalar(frontmatter.status);
  const metadataResults = checkMetadataFields(fileName, frontmatter);

  if (status === "skipped") {
    const skipReason = normalizeScalar(frontmatter.skip_reason);
    if (!skipReason || skipReason === "null") {
      return [
        ...metadataResults,
        fail(fileName, "status is skipped but skip_reason is empty"),
      ];
    }

    return [
      ...metadataResults,
      pass(fileName, `skipped with reason: ${skipReason}`),
    ];
  }

  const results = [...metadataResults];

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
    // existing cases...
  }

  if (results.every((result) => result.level !== "fail")) {
    results.unshift(pass(fileName, "required sections are present"));
  }

  return results;
}
```

- [ ] **Step 2: Confirm the checker now fails on the current active work item**

Run:

```bash
pnpm squad:check 20260329-ai-native-operating-canonicalization
```

Expected: FAIL with `goal-packet.md: required file is missing`.

- [ ] **Step 3: Backfill the current active work item with a concrete goal packet**

Create `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/20260329-ai-native-operating-canonicalization/goal-packet.md` with this exact content:

```md
---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: in_progress
owner_role: product-squad
source_request: "AI-native 운영 원칙 canonicalization plan 구현 + PM/PD/FE/BE 역할별 엔터프라이즈급 철칙 반영"
affected_paths:
  - AGENTS.md
  - CLAUDE.md
  - GEMINI.md
  - ai/context/ai-native.md
  - ai/context/project.md
  - ai/context/engineering.md
  - ai/context/spec-driven.md
  - ai/skills/pm-role.md
  - ai/skills/pd-role.md
  - ai/skills/fe-role.md
  - ai/skills/be-role.md
  - ai/skills/product-squad.md
  - ai/skills/goal-driven-delivery.md
  - ai/agents
  - docs/agent-context.md
  - docs/product-squad
  - docs/work-items/README.md
  - docs/spec-lifecycle.md
  - README.md
  - docs/architecture.md
  - docs/vibe-coding-playbook.md
  - docs/ai-starter-prompt-pack.md
  - scripts/check-squad-work-item.mjs
  - scripts/sync-ai-context.mjs
dependencies:
  - ai/context/doc-sync.md
  - docs/product-squad/operating-model.md
  - docs/product-squad/goal-driven-delivery.md
skip_reason: null
---

# Goal Packet

## Business Goal

- AI-native 운영 원칙을 단일 canonical source와 role-based quality gate로 재정렬한다.

## Target User

- 이 레포에서 작업하는 AI 에이전트와 인간 기여자
- 같은 운영체계를 downstream 서비스에 재사용하려는 팀

## Target Moment

- 구조/운영 규칙을 바꾸는 중요한 작업을 시작할 때
- raw request, policy, business goal을 thin slice와 work item으로 정규화해야 할 때

## Success Metric

- `ai/context/ai-native.md`와 load-order/adapters가 같은 canonical source를 가리킨다.
- `pnpm ai:sync`, `pnpm squad:check 20260329-ai-native-operating-canonicalization`, `pnpm verify`가 통과한다.

## Non-Goals

- 별도 orchestration 서비스, agent runtime, background agent 플랫폼 구현
- heavy enterprise feature 범위 확장
- 제품 UI나 business runtime 동작 변경

## Constraints

- 이번 slice는 문서/운영 규칙 정비가 중심이며 `apps/web` 런타임 구조와 패키지 경계는 바꾸지 않는다.
- generated adapter는 파생 산출물로 유지하고 source of truth는 `ai/`와 `docs/`에 남긴다.
- 새 본문 정책을 adapter에 복제하지 않고 읽기 순서와 참조만 강화한다.

## Existing Evidence

- AI-native 약속이 `project.md`, `spec-driven.md`, `agent-context.md`, `goal-driven-delivery.md` 등에 분산돼 있었다.
- 현재 generated adapter read order에는 `ai/context/ai-native.md`가 초반 canonical source로 드러나지 않았다.
- 현재 role skill과 agent prompt는 enterprise-grade 역할 철칙을 충분히 드러내지 않았다.

## Selected Delivery Shape

- non-product operating slice

## Active Scope

- canonical context
- role skills
- adapter sync
- work-item templates
- quality gates

## Deferred Scope

- `apps/web` runtime code
- `packages/*` runtime behavior
- product-facing MVP surface changes

## Selection Rationale

- 이번 요청은 제품 기능 추가보다 운영체계 hardening이 핵심이므로 가장 작은 측정 가능한 단위는 문서, 템플릿, check script, adapter generation 정렬이다.
- runtime product code를 건드리지 않고도 canonical source, quality gate, role operating model을 선명하게 만들 수 있다.
```

- [ ] **Step 4: Re-run both checks and confirm the active work item is green again**

Run:

```bash
pnpm squad:check 20260329-ai-native-operating-canonicalization
pnpm repo:check --work 20260329-ai-native-operating-canonicalization
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-squad-work-item.mjs docs/work-items/20260329-ai-native-operating-canonicalization/goal-packet.md
git commit -m "feat: require goal packets for active work items"
```

### Task 4: Add The Triage Matrix And Handoff Rubric To Operating Docs

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/operating-model.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/agent-team-delivery.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/team-plan.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md`

- [ ] **Step 1: Confirm the new operating sections do not exist yet**

Run:

```bash
rg -n "Task Triage Matrix|Handoff Quality Rubric|goal packet:" \
  docs/product-squad/operating-model.md \
  docs/product-squad/agent-team-delivery.md \
  docs/product-squad/templates/team-plan.md \
  docs/work-items/README.md
```

Expected: no matches for the new headings and no `goal packet:` row in `team-plan.md`.

- [ ] **Step 2: Update the operating model and work-item README**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/operating-model.md`, add the new artifact to the folder structure and insert a triage matrix.

```md
## Task Triage Matrix

| Request Type | Default Work Class | Default Roles | Default Execution Mode |
| --- | --- | --- | --- |
| policy / business goal -> MVP shaping | gated work | product-squad + pm + pd + fe (+ be when data or analytics change) | single-agent sequential |
| user-facing flow or copy change | gated work | pm + pd + fe | single-agent sequential |
| validation / persistence / analytics contract change | gated work | pm + fe + be | single-agent sequential |
| pure FE refactor with no behavior change | light work | fe | single-agent sequential |
| pure BE refactor with no contract change | light work | be | single-agent sequential |
| parallel research or competing hypotheses | gated work | product-squad + role owners | subagent fan-out |
| tightly coupled cross-layer implementation | gated work | product-squad + pm + pd + fe + be | agent-team only when platform support is clearly useful |
```

Update the folder structure block to this:

```txt
docs/work-items/<work-id>/
  goal-packet.md
  brief.md
  feature-spec.md
  team-plan.md
  ux-review.md
  frontend-spec.md
  backend-spec.md
  quality-scorecard.md
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md`, update the required-files list and source-of-truth wording:

```md
## Required files

- `goal-packet.md`
- `brief.md`
- `feature-spec.md` (PRD 기반 feature 작업이면 필수)
- `team-plan.md`
- `ux-review.md`
- `frontend-spec.md`
- `backend-spec.md`
- `quality-scorecard.md`

## Source of truth

- 입력 정규화 기준 문서는 최신 `goal-packet.md`입니다.
- 구현 전 기준 문서는 최신 `brief.md`입니다.
```

- [ ] **Step 3: Add the handoff rubric to the team docs and template**

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/agent-team-delivery.md`, add this section after `## Handoff Packet`:

```md
## Handoff Quality Rubric

- next owner가 채팅 로그를 다시 읽지 않아도 바로 이어받을 수 있어야 합니다.
- unresolved questions는 "없음" 또는 구체 항목으로 명시해야 합니다.
- changed files or docs는 실제 경로 기준으로 적어 다음 역할이 읽을 파일을 바로 알 수 있어야 합니다.
- success check에는 verification evidence 또는 explicit skip reason이 포함되어야 합니다.
- handoff packet이 이 기준을 못 맞추면 lead가 바로 보완을 요청합니다.
```

In `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-squad/templates/team-plan.md`, update shared context and add a checklist section:

```md
## Shared Context Pack

- goal packet:
- brief:
- feature spec:
- ux review:
- frontend spec:
- backend spec:
- external evidence:

## Handoff Quality Bar

- [ ] next owner can continue without re-reading chat history
- [ ] unresolved questions are explicit
- [ ] changed files or docs are listed
- [ ] success check includes verification evidence or explicit skip reason
```

- [ ] **Step 4: Run repository verification after the doc updates**

Run:

```bash
pnpm repo:check
pnpm verify
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add \
  docs/product-squad/operating-model.md \
  docs/product-squad/agent-team-delivery.md \
  docs/product-squad/templates/team-plan.md \
  docs/work-items/README.md
git commit -m "docs: add goal packet triage and handoff guidance"
```

## Self-Review

### Spec coverage

- `goal-packet artifact 추가`: Task 1, Task 2, Task 3
- `work:new / feature:new / squad:check 연동`: Task 1, Task 2, Task 3
- `첫 thin slice로 operating docs 보강`: Task 4
- `task triage matrix`: Task 4
- `handoff quality rubric`: Task 4

### Placeholder scan

- No `TODO`, `TBD`, or "implement later" placeholders remain.
- Every task includes exact file paths, concrete commands, and concrete code or markdown snippets.

### Type consistency

- `goal-packet.md` is consistently treated as a task-local artifact in generated work items.
- The chosen generalized section names are `Selected Delivery Shape`, `Active Scope`, `Deferred Scope`, and `Selection Rationale`.
- `scripts/check-squad-work-item.mjs`, `scripts/create-work-item.mjs`, `scripts/create-feature-from-prd.mjs`, and the operating docs all use the same artifact name: `goal-packet.md`.
