#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const prdsDir = path.join(rootDir, "docs", "prds");
const workItemsDir = path.join(rootDir, "docs", "work-items");

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
    writeFile(path.join(targetDir, "brief.md"), renderBrief(workId, planning)),
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
  ]);

  process.stdout.write(
    [
      `Prepared feature work item: ${workId}`,
      `- PRD: docs/prds/${prdSlug}.md`,
      `- Feature slice: ${selectedFeature.slug}`,
      `- Directory: docs/work-items/${workId}`,
      `- Implementation readiness: ${planning.readiness}`,
      `- Blocking questions: ${planning.blockingQuestions.length}`,
    ].join("\n") + "\n",
  );
}

function parseArgs(args) {
  let prdSlug = "";
  let requestedFeatureSlug = "";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--prd") {
      prdSlug = normalizeSlug(args[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--feature") {
      requestedFeatureSlug = normalizeSlug(args[index + 1] ?? "");
      index += 1;
    }
  }

  if (!prdSlug) {
    throw new Error(
      "Usage: pnpm feature:new --prd <prd-slug> [--feature <feature-slug>]",
    );
  }

  return {
    prdSlug,
    requestedFeatureSlug,
  };
}

function parsePrdDocument(markdown, prdSlug) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const sections = splitSections(body, 2);
  const scopeSections = splitSections(sections["Scope"] ?? "", 3);
  const featureCandidates = parseFeatureCandidates(
    sections["Feature Candidates"] ?? "",
    prdSlug,
  );

  return {
    slug: prdSlug,
    title: normalizeContent(frontmatter.title) || toTitleCase(prdSlug),
    status: normalizeContent(frontmatter.status) || "draft",
    owner: normalizeContent(frontmatter.owner) || "unknown",
    sourceUrl: normalizeContent(frontmatter.source_url),
    sections,
    scope: {
      inScope: listFromSection(scopeSections["In Scope"]),
      outOfScope: listFromSection(scopeSections["Out Of Scope"]),
    },
    featureCandidates,
  };
}

function parseFeatureCandidates(sectionContent, fallbackSlug) {
  const candidates = [];
  const sections = splitSections(sectionContent, 3);

  for (const [title, content] of Object.entries(sections)) {
    const fields = parseKeyValueBullets(content);
    const slug = normalizeSlug(title);

    candidates.push({
      slug,
      title,
      content: normalizeContent(content),
      summary: normalizeContent(fields.summary),
      userValue: normalizeContent(fields.user_value),
      primaryModule: normalizeSlugAllowEmpty(fields.primary_module),
      routes: splitCsv(fields.routes),
      uiSurface: parseYesNo(fields.ui_surface),
      adminSurface: parseYesNo(fields.admin_surface),
      backendChanges: parseYesNo(fields.backend_changes),
      authRequired: parseYesNo(fields.auth_required),
      paymentRequired: parseYesNo(fields.payment_required),
      externalProviderImpact: normalizeContent(fields.external_provider_impact),
      analyticsRequired: parseYesNo(fields.analytics_required),
      recommended: parseYesNo(fields.recommended) === "yes",
    });
  }

  if (candidates.length > 0) {
    return candidates;
  }

  return [
    {
      slug: fallbackSlug,
      title: toTitleCase(fallbackSlug),
      content: "",
      summary: "",
      userValue: "",
      primaryModule: fallbackSlug,
      routes: [],
      uiSurface: "unknown",
      adminSurface: "unknown",
      backendChanges: "unknown",
      authRequired: "unknown",
      paymentRequired: "unknown",
      externalProviderImpact: "",
      analyticsRequired: "unknown",
      recommended: true,
    },
  ];
}

function selectFeatureCandidate(prd, requestedFeatureSlug) {
  if (requestedFeatureSlug) {
    const match = prd.featureCandidates.find(
      (candidate) => candidate.slug === requestedFeatureSlug,
    );

    if (!match) {
      throw new Error(
        `Feature candidate "${requestedFeatureSlug}" was not found in docs/prds/${prd.slug}.md`,
      );
    }

    return match;
  }

  return (
    prd.featureCandidates.find((candidate) => candidate.recommended) ??
    prd.featureCandidates[0]
  );
}

function buildPlanningContext(prd, feature) {
  const sectionValue = (name) => normalizeContent(prd.sections[name]);
  const acceptanceCriteria = checklistFromSection(
    prd.sections["Acceptance Criteria"],
  );
  const analyticsImpact = listFromSection(prd.sections["Analytics Impact"]);
  const dataImpact = listFromSection(prd.sections["Data Impact"]);
  const dependencies = listFromSection(prd.sections["Dependencies"]);
  const existingOpenQuestions = listFromSection(prd.sections["Open Questions"]);
  const successMetric = listFromSection(prd.sections["Success Metric"]);
  const blockingQuestions = [];

  requireHighRiskField("Problem", sectionValue("Problem"), blockingQuestions);
  requireHighRiskField("Goal", sectionValue("Goal"), blockingQuestions);
  requireHighRiskField(
    "Target User",
    sectionValue("Target User"),
    blockingQuestions,
  );

  if (acceptanceCriteria.length === 0) {
    blockingQuestions.push("Acceptance criteria가 비어 있습니다.");
  }

  if (dataImpact.length === 0) {
    blockingQuestions.push("Data impact가 비어 있습니다.");
  }

  if (analyticsImpact.length === 0) {
    blockingQuestions.push("Analytics impact가 비어 있습니다.");
  }

  const systemQuestions = collectSystemQuestions(feature);
  blockingQuestions.push(...systemQuestions);

  const readiness = blockingQuestions.length > 0 ? "blocked" : "ready";
  const targetUser = sectionParagraph(prd.sections["Target User"]) || "-";
  const problem = sectionParagraph(prd.sections["Problem"]) || "-";
  const goal = sectionParagraph(prd.sections["Goal"]) || "-";
  const jobsToBeDone = listFromSection(prd.sections["Jobs To Be Done"]);
  const nonGoals = [
    ...prd.scope.outOfScope,
    ...listFromSection(prd.sections["Non-Goals"]),
    ...prd.featureCandidates
      .filter((candidate) => candidate.slug !== feature.slug)
      .map((candidate) => candidate.title),
  ];
  const inScope = [
    ...prd.scope.inScope,
    feature.summary ? `${feature.title}: ${feature.summary}` : feature.title,
  ];
  const featureSummary =
    feature.summary ||
    goal ||
    `${prd.title} PRD에서 ${feature.title} feature slice를 구현하기 위한 계획입니다.`;
  const userFlow = buildUserFlow(feature, prd, targetUser);
  const affectedPaths = deriveAffectedPaths(
    feature,
    analyticsImpact,
    dataImpact,
  );
  const docsToUpdate = [
    `docs/prds/${prd.slug}.md`,
    "docs/work-items/<work-id>/brief.md",
    "docs/work-items/<work-id>/feature-spec.md",
  ];

  return {
    prd,
    feature,
    readiness,
    featureSummary,
    problem,
    goal,
    targetUser,
    jobsToBeDone,
    successMetric,
    inScope: uniqueItems(inScope),
    outOfScope: uniqueItems(nonGoals),
    userFlow,
    acceptanceCriteria,
    analyticsImpact,
    dataImpact,
    dependencies,
    affectedPaths,
    docsToUpdate,
    openQuestions: uniqueItems([
      ...existingOpenQuestions,
      ...blockingQuestions,
    ]),
    blockingQuestions,
    uxRequired: isUxRequired(feature),
    frontendRequired: isFrontendRequired(feature),
    backendRequired: isBackendRequired(feature, analyticsImpact, dataImpact),
  };
}

function buildUserFlow(feature, prd, targetUser) {
  const flow = [];

  if (feature.routes.length > 0) {
    flow.push(`${targetUser}가 ${feature.routes.join(", ")} 경로로 진입한다.`);
  } else if (feature.adminSurface === "yes") {
    flow.push(`${targetUser}가 admin surface에서 기능을 사용한다.`);
  } else {
    flow.push(`${targetUser}가 ${feature.title} 흐름을 시작한다.`);
  }

  if (feature.summary) {
    flow.push(feature.summary);
  }

  if (feature.userValue) {
    flow.push(feature.userValue);
  }

  if (flow.length === 1 && prd.scope.inScope.length > 0) {
    flow.push(...prd.scope.inScope);
  }

  return uniqueItems(flow);
}

function deriveAffectedPaths(feature, analyticsImpact, dataImpact) {
  const paths = [];

  for (const route of feature.routes) {
    if (route === "/") {
      paths.push("apps/web/src/app/page.tsx");
      continue;
    }

    const segments = route
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean)
      .join("/");
    paths.push(`apps/web/src/app/${segments}/*`);
  }

  if (feature.primaryModule) {
    paths.push(`apps/web/src/modules/${feature.primaryModule}/*`);
  }

  if (feature.adminSurface === "yes") {
    paths.push("apps/web/src/modules/admin/*");
    paths.push("apps/web/src/app/admin/*");
  }

  if (feature.backendChanges === "yes" || dataImpact.length > 0) {
    paths.push("packages/core/*");
    paths.push("packages/db/*");
  }

  if (feature.analyticsRequired === "yes" || analyticsImpact.length > 0) {
    paths.push("packages/analytics/*");
    paths.push("apps/web/src/lib/analytics.ts");
  }

  if (
    feature.externalProviderImpact &&
    feature.externalProviderImpact !== "none"
  ) {
    paths.push("packages/error-logging/*");
    paths.push("apps/web/src/lib/*");
  }

  return uniqueItems(paths);
}

async function resolveWorkId(featureSlug) {
  const today = buildDatePart(new Date());
  const todayWorkId = `${today}-${featureSlug}`;
  const todayPath = path.join(workItemsDir, todayWorkId);

  try {
    await readdir(todayPath);
    return todayWorkId;
  } catch (error) {
    if (!isMissingPathError(error)) {
      throw error;
    }
  }

  return todayWorkId;
}

function renderBrief(workId, planning) {
  const status = planning.readiness === "blocked" ? "blocked" : "draft";

  return [
    renderFrontmatter({
      status,
      owner_role: "pm",
      source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
      affected_paths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning, true),
      skip_reason: null,
    }),
    "# Brief",
    "",
    "## Problem",
    "",
    renderParagraph(planning.problem),
    "",
    "## Target User",
    "",
    renderParagraph(planning.targetUser),
    "",
    "## Goal",
    "",
    renderParagraph(planning.goal),
    "",
    "## Non-Goals",
    "",
    ...renderBulletList(planning.outOfScope),
    "",
    "## Success Metric",
    "",
    ...renderBulletList(planning.successMetric),
    "",
    "## Acceptance Criteria",
    "",
    ...renderChecklist(planning.acceptanceCriteria),
    "",
    "## Open Questions",
    "",
    ...renderBulletList(planning.openQuestions),
    "",
  ].join("\n");
}

function renderFeatureSpec(workId, planning) {
  return [
    renderFrontmatter({
      status: planning.readiness === "blocked" ? "blocked" : "draft",
      owner_role: "product-squad",
      related_prd: `docs/prds/${planning.prd.slug}.md`,
      related_work_item: `docs/work-items/${workId}`,
      feature_slug: planning.feature.slug,
      implementation_readiness: planning.readiness,
      affected_paths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning, false),
      skip_reason: null,
    }),
    "# Feature Spec",
    "",
    "## Feature Summary",
    "",
    renderParagraph(planning.featureSummary),
    "",
    "## Problem",
    "",
    renderParagraph(planning.problem),
    "",
    "## Goal",
    "",
    renderParagraph(planning.goal),
    "",
    "## In Scope",
    "",
    ...renderBulletList(planning.inScope),
    "",
    "## Out Of Scope",
    "",
    ...renderBulletList(planning.outOfScope),
    "",
    "## Target User",
    "",
    renderParagraph(planning.targetUser),
    "",
    "## User Flow",
    "",
    ...renderBulletList(planning.userFlow),
    "",
    "## Acceptance Criteria",
    "",
    ...renderChecklist(planning.acceptanceCriteria),
    "",
    "## Analytics Impact",
    "",
    ...renderBulletList(planning.analyticsImpact),
    "",
    "## Data Impact",
    "",
    ...renderBulletList(planning.dataImpact),
    "",
    "## Affected Routes And Modules",
    "",
    ...renderBulletList(planning.affectedPaths),
    "",
    "## Test Strategy",
    "",
    ...renderBulletList(buildTestStrategy(planning)),
    "",
    "## Docs To Update",
    "",
    ...renderBulletList(
      planning.docsToUpdate.map((item) => item.replace("<work-id>", workId)),
    ),
    "",
    "## Open Questions",
    "",
    ...renderBulletList(planning.openQuestions),
    "",
    "## Implementation Readiness",
    "",
    renderParagraph(
      planning.readiness === "blocked"
        ? "Blocked. Resolve open questions before implementation."
        : "Ready for implementation once the work item docs are reviewed.",
    ),
    "",
  ].join("\n");
}

function renderUxReview(workId, planning) {
  if (!planning.uxRequired) {
    return renderSkippedRoleDoc({
      ownerRole: "pd",
      sourceRequest: `PRD: docs/prds/${planning.prd.slug}.md`,
      title: "UX Review",
      skipReason: "This feature does not add or change a user-facing surface.",
      affectedPaths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning, true),
      sections: [
        "## Entry Points",
        "",
        "-",
        "",
        "## Copy Changes",
        "",
        "-",
        "",
        "## IA Changes",
        "",
        "-",
        "",
        "## Happy Path",
        "",
        "-",
        "",
        "## Edge States",
        "",
        "-",
        "",
        "## Accessibility Checks",
        "",
        "-",
        "",
      ],
    });
  }

  return [
    renderFrontmatter({
      status: planning.readiness === "blocked" ? "blocked" : "draft",
      owner_role: "pd",
      source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
      affected_paths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning, true),
      skip_reason: null,
    }),
    "# UX Review",
    "",
    "## Entry Points",
    "",
    ...renderBulletList(
      planning.feature.routes.length > 0
        ? planning.feature.routes
        : ["User-facing entry point to be confirmed in the PRD."],
    ),
    "",
    "## Copy Changes",
    "",
    ...renderBulletList(
      planning.feature.summary
        ? [planning.feature.summary]
        : ["Copy changes are not fully specified yet."],
    ),
    "",
    "## IA Changes",
    "",
    ...renderBulletList(
      planning.feature.adminSurface === "yes"
        ? ["Admin navigation or admin page composition will change."]
        : ["No major IA change beyond the primary feature route is expected."],
    ),
    "",
    "## Happy Path",
    "",
    ...renderBulletList(planning.userFlow),
    "",
    "## Edge States",
    "",
    ...renderBulletList(buildEdgeStates(planning)),
    "",
    "## Accessibility Checks",
    "",
    ...renderBulletList([
      "Keyboard navigation and focus order remain intact.",
      "Form labels, helper text, and error messaging are explicit.",
      "Status feedback is visible without relying on color alone.",
    ]),
    "",
  ].join("\n");
}

function renderFrontendSpec(workId, planning) {
  if (!planning.frontendRequired) {
    return renderSkippedRoleDoc({
      ownerRole: "fe",
      sourceRequest: `PRD: docs/prds/${planning.prd.slug}.md`,
      title: "Frontend Spec",
      skipReason:
        "This feature does not require a new or changed frontend surface.",
      affectedPaths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning, true),
      sections: [
        "## Affected Routes",
        "",
        "-",
        "",
        "## Module Targets",
        "",
        "-",
        "",
        "## Component Plan",
        "",
        "-",
        "",
        "## State And Events",
        "",
        "-",
        "",
        "## Test Plan",
        "",
        "-",
        "",
        "## Out Of Scope",
        "",
        "-",
        "",
      ],
    });
  }

  return [
    renderFrontmatter({
      status: planning.readiness === "blocked" ? "blocked" : "draft",
      owner_role: "fe",
      source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
      affected_paths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning),
      skip_reason: null,
    }),
    "# Frontend Spec",
    "",
    "## Affected Routes",
    "",
    ...renderBulletList(
      planning.feature.routes.length > 0
        ? planning.feature.routes
        : ["No route path is explicitly defined yet."],
    ),
    "",
    "## Module Targets",
    "",
    ...renderBulletList(
      planning.feature.primaryModule
        ? [`apps/web/src/modules/${planning.feature.primaryModule}/*`]
        : ["Primary module target is still unknown."],
    ),
    "",
    "## Component Plan",
    "",
    ...renderBulletList(buildComponentPlan(planning)),
    "",
    "## State And Events",
    "",
    ...renderBulletList(buildFrontendStatePlan(planning)),
    "",
    "## Test Plan",
    "",
    ...renderBulletList(buildFrontendTests(planning)),
    "",
    "## Out Of Scope",
    "",
    ...renderBulletList(planning.outOfScope),
    "",
  ].join("\n");
}

function renderBackendSpec(workId, planning) {
  if (!planning.backendRequired) {
    return renderSkippedRoleDoc({
      ownerRole: "be",
      sourceRequest: `PRD: docs/prds/${planning.prd.slug}.md`,
      title: "Backend Spec",
      skipReason:
        "This feature does not change validation, persistence, analytics, or external integrations.",
      affectedPaths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning),
      sections: [
        "## Schema And Validation Changes",
        "",
        "-",
        "",
        "## Action Service Repository Plan",
        "",
        "-",
        "",
        "## Analytics Impact",
        "",
        "-",
        "",
        "## Failure Modes",
        "",
        "-",
        "",
        "## Test Plan",
        "",
        "-",
        "",
      ],
    });
  }

  return [
    renderFrontmatter({
      status: planning.readiness === "blocked" ? "blocked" : "draft",
      owner_role: "be",
      source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
      affected_paths: planning.affectedPaths,
      dependencies: buildDependencies(workId, planning),
      skip_reason: null,
    }),
    "# Backend Spec",
    "",
    "## Schema And Validation Changes",
    "",
    ...renderBulletList(
      planning.dataImpact.length > 0
        ? planning.dataImpact
        : ["No explicit schema change is currently required."],
    ),
    "",
    "## Action Service Repository Plan",
    "",
    ...renderBulletList(buildBackendPlan(planning)),
    "",
    "## Analytics Impact",
    "",
    ...renderBulletList(planning.analyticsImpact),
    "",
    "## Failure Modes",
    "",
    ...renderBulletList(buildFailureModes(planning)),
    "",
    "## Test Plan",
    "",
    ...renderBulletList(buildBackendTests(planning)),
    "",
  ].join("\n");
}

function renderSkippedRoleDoc({
  ownerRole,
  sourceRequest,
  title,
  skipReason,
  affectedPaths,
  dependencies,
  sections,
}) {
  return [
    renderFrontmatter({
      status: "skipped",
      owner_role: ownerRole,
      source_request: sourceRequest,
      affected_paths: affectedPaths,
      dependencies,
      skip_reason: skipReason,
    }),
    `# ${title}`,
    "",
    ...sections,
  ].join("\n");
}

function buildDependencies(workId, planning, includeFeatureSpec) {
  return uniqueItems(
    [
      `docs/prds/${planning.prd.slug}.md`,
      includeFeatureSpec ? `docs/work-items/${workId}/feature-spec.md` : null,
    ].filter(Boolean),
  );
}

function buildTestStrategy(planning) {
  const tests = [
    "Generated 문서의 acceptance criteria를 기준으로 public behavior를 검증한다.",
  ];

  if (planning.frontendRequired) {
    tests.push(
      "주요 사용자 경로에 대한 수동 검증 또는 UI 테스트 포인트를 정리한다.",
    );
  }

  if (planning.backendRequired) {
    tests.push(
      "validation, persistence, analytics 영향에 대한 단위 테스트 또는 통합 테스트를 검토한다.",
    );
  }

  tests.push(
    "변경 범위에 맞춰 `pnpm verify` 또는 `pnpm verify:full`을 선택한다.",
  );

  return tests;
}

function buildEdgeStates(planning) {
  const edgeStates = [
    "필수 입력이 누락되면 명시적인 오류 상태를 보여준다.",
    "비동기 처리 중 pending 상태를 사용자에게 노출한다.",
  ];

  if (planning.backendRequired) {
    edgeStates.push(
      "optional provider 실패가 핵심 흐름을 깨지 않도록 분리한다.",
    );
  }

  if (planning.openQuestions.length > 0) {
    edgeStates.push(
      "남은 open questions에 따라 추가 edge state가 필요할 수 있다.",
    );
  }

  return edgeStates;
}

function buildComponentPlan(planning) {
  const plan = [];

  if (planning.feature.primaryModule) {
    plan.push(
      `기능 전용 UI와 상태는 \`apps/web/src/modules/${planning.feature.primaryModule}\` 아래에 둔다.`,
    );
  } else {
    plan.push(
      "Primary module이 확정되지 않아 module target을 먼저 정해야 한다.",
    );
  }

  if (planning.feature.routes.length > 0) {
    plan.push("Route entry는 얇게 유지하고 module UI를 조합만 하게 한다.");
  }

  if (planning.feature.adminSurface === "yes") {
    plan.push(
      "관리자 화면 영향이 있으면 기존 admin shell과 nav 구조를 재사용한다.",
    );
  }

  return plan;
}

function buildFrontendStatePlan(planning) {
  const items = [
    "client/server 경계는 route 제약이 아니라 실제 상호작용 필요성 기준으로 나눈다.",
  ];

  if (planning.analyticsImpact.length > 0) {
    items.push(
      "필수 이벤트는 feature submit 또는 state transition 시점에만 남긴다.",
    );
  }

  if (planning.feature.routes.length > 0) {
    items.push(
      `주요 상태 전이는 ${planning.feature.routes.join(", ")} 경로 기준으로 정리한다.`,
    );
  }

  return items;
}

function buildFrontendTests(planning) {
  const tests = ["새 또는 변경된 route의 happy path를 수동 검증한다."];

  if (planning.analyticsImpact.length > 0) {
    tests.push("이벤트가 중복 없이 필요한 시점에만 기록되는지 확인한다.");
  }

  tests.push("오류 상태, 빈 상태, pending 상태를 확인한다.");

  return tests;
}

function buildBackendPlan(planning) {
  const items = [];

  if (planning.dataImpact.length > 0) {
    items.push(
      "boundary validation, use case orchestration, repository 책임을 분리한다.",
    );
  }

  if (planning.feature.paymentRequired === "yes") {
    items.push(
      "결제 provider 영향은 optional adapter와 핵심 흐름을 분리해서 설계한다.",
    );
  }

  if (
    planning.feature.externalProviderImpact &&
    planning.feature.externalProviderImpact !== "none"
  ) {
    items.push(
      "외부 provider 관련 실패와 fallback을 adapter 경계에서 정규화한다.",
    );
  }

  if (planning.analyticsImpact.length > 0) {
    items.push("analytics 이벤트 저장과 외부 전송을 분리한다.");
  }

  if (items.length === 0) {
    items.push(
      "현재 PRD 기준으로 backend orchestration은 최소 변경으로 유지한다.",
    );
  }

  return items;
}

function buildFailureModes(planning) {
  const items = ["입력 검증 실패 시 사용자에게 설명 가능한 상태를 반환한다."];

  if (
    planning.feature.externalProviderImpact &&
    planning.feature.externalProviderImpact !== "none"
  ) {
    items.push(
      "외부 provider 실패는 관찰 가능해야 하지만 핵심 흐름을 깨뜨리지 않게 한다.",
    );
  }

  if (planning.feature.paymentRequired === "yes") {
    items.push(
      "결제 상태 동기화 실패 시 운영자 관찰과 재시도 기준을 문서에 남긴다.",
    );
  }

  if (planning.openQuestions.length > 0) {
    items.push(
      "남은 open questions 해소 전에는 일부 failure mode가 추가될 수 있다.",
    );
  }

  return items;
}

function buildBackendTests(planning) {
  const tests = ["validation과 use case 경계를 단위 테스트로 검토한다."];

  if (planning.dataImpact.length > 0) {
    tests.push("저장 로직과 schema 영향 범위를 확인한다.");
  }

  if (planning.analyticsImpact.length > 0) {
    tests.push(
      "핵심 이벤트가 누락되지 않고 optional provider 실패가 흐름을 깨지 않는지 확인한다.",
    );
  }

  return tests;
}

function collectSystemQuestions(feature) {
  const questions = [];
  const fields = [
    ["admin surface", feature.adminSurface],
    ["auth requirement", feature.authRequired],
    ["payment requirement", feature.paymentRequired],
    ["backend change", feature.backendChanges],
    ["analytics requirement", feature.analyticsRequired],
  ];

  for (const [label, value] of fields) {
    if (value === "unknown") {
      questions.push(`${label}가 PRD에 명시되지 않았습니다.`);
    }
  }

  if (!feature.externalProviderImpact) {
    questions.push("External provider impact가 PRD에 명시되지 않았습니다.");
  }

  return questions;
}

function isUxRequired(feature) {
  return (
    feature.uiSurface !== "no" ||
    feature.adminSurface === "yes" ||
    feature.routes.length > 0
  );
}

function isFrontendRequired(feature) {
  return (
    feature.uiSurface !== "no" ||
    feature.routes.length > 0 ||
    feature.adminSurface === "yes"
  );
}

function isBackendRequired(feature, analyticsImpact, dataImpact) {
  return (
    feature.backendChanges === "yes" ||
    feature.paymentRequired === "yes" ||
    feature.authRequired === "yes" ||
    (feature.externalProviderImpact &&
      feature.externalProviderImpact !== "none") ||
    analyticsImpact.length > 0 ||
    dataImpact.length > 0
  );
}

function requireHighRiskField(label, value, questions) {
  if (!value || value === "-") {
    questions.push(`${label}이(가) 비어 있습니다.`);
  }
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    return {
      frontmatter: {},
      body: markdown,
    };
  }

  const closingIndex = markdown.indexOf("\n---\n", 4);

  if (closingIndex === -1) {
    return {
      frontmatter: {},
      body: markdown,
    };
  }

  const frontmatterRaw = markdown.slice(4, closingIndex);
  const body = markdown.slice(closingIndex + 5);
  const frontmatter = {};

  for (const line of frontmatterRaw.split("\n")) {
    const match = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);

    if (!match) {
      continue;
    }

    frontmatter[match[1]] = stripQuotes(match[2].trim());
  }

  return {
    frontmatter,
    body,
  };
}

function splitSections(markdown, level) {
  const sections = {};
  const headingPrefix = "#".repeat(level);
  const regex = new RegExp(`^${headingPrefix}\\s+(.+)$`, "gm");
  let currentTitle = "";
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    if (currentTitle) {
      sections[currentTitle] = markdown.slice(lastIndex, match.index).trim();
    }

    currentTitle = match[1].trim();
    lastIndex = regex.lastIndex;
  }

  if (currentTitle) {
    sections[currentTitle] = markdown.slice(lastIndex).trim();
  }

  return sections;
}

function parseKeyValueBullets(content) {
  const fields = {};

  for (const line of content.split("\n")) {
    const match = line.match(/^- ([a-zA-Z0-9_]+):\s*(.*)$/);

    if (match) {
      fields[match[1]] = stripQuotes(match[2].trim());
    }
  }

  return fields;
}

function listFromSection(content) {
  const normalized = normalizeContent(content);

  if (!normalized || normalized === "-") {
    return [];
  }

  const items = [];

  for (const line of normalized.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (trimmed.startsWith("- [ ] ")) {
      items.push(trimmed.slice(6).trim());
      continue;
    }

    if (trimmed.startsWith("- ")) {
      items.push(trimmed.slice(2).trim());
      continue;
    }

    items.push(trimmed);
  }

  return uniqueItems(items.filter(Boolean));
}

function checklistFromSection(content) {
  const normalized = normalizeContent(content);

  if (!normalized || normalized === "-") {
    return [];
  }

  const items = [];

  for (const line of normalized.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- [ ] ")) {
      items.push(trimmed.slice(6).trim());
      continue;
    }

    if (trimmed.startsWith("- ")) {
      items.push(trimmed.slice(2).trim());
    }
  }

  return uniqueItems(items.filter(Boolean));
}

function renderFrontmatter(fields) {
  return [
    "---",
    ...Object.entries(fields).map(([key, value]) =>
      renderYamlField(key, value),
    ),
    "---",
    "",
  ].join("\n");
}

function renderYamlField(key, value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${key}: []`;
    }

    return `${key}:\n${value.map((item) => `  - ${JSON.stringify(item)}`).join("\n")}`;
  }

  if (value === null) {
    return `${key}: null`;
  }

  return `${key}: ${JSON.stringify(value)}`;
}

function renderBulletList(items) {
  if (!items || items.length === 0) {
    return ["-"];
  }

  return items.map((item) => `- ${item}`);
}

function renderChecklist(items) {
  if (!items || items.length === 0) {
    return ["- [ ] Acceptance criteria to be defined."];
  }

  return items.map((item) => `- [ ] ${item}`);
}

function renderParagraph(value) {
  return value && value !== "-" ? value : "-";
}

function sectionParagraph(content) {
  const items = listFromSection(content);

  if (items.length > 0) {
    return items.join(" ");
  }

  return normalizeContent(content);
}

function uniqueItems(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeContent(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseYesNo(value) {
  const normalized = normalizeContent(value).toLowerCase();

  if (normalized === "yes" || normalized === "true") {
    return "yes";
  }

  if (normalized === "no" || normalized === "false" || normalized === "none") {
    return "no";
  }

  return "unknown";
}

function splitCsv(value) {
  return normalizeContent(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSlug(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("Slug must contain at least one letter or number.");
  }

  return slug;
}

function normalizeSlugAllowEmpty(value) {
  const normalized = normalizeContent(value);

  return normalized ? normalizeSlug(normalized) : "";
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function buildDatePart(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function toTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
