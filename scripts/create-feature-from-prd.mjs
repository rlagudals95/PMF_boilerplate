#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const prdsDir = path.join(rootDir, "docs", "prds");
const workItemsDir = path.join(rootDir, "docs", "work-items");
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

function renderGoalPacket(workId, planning) {
  return [
    renderFrontmatter(
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
    ),
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
  const constraints = listFromSection(prd.sections["Constraints"]);
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
  const targetMoment = deriveTargetMoment(prd, feature, targetUser);
  const existingEvidence = deriveExistingEvidence(
    prd,
    analyticsImpact,
    dataImpact,
    dependencies,
  );
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
    targetMoment,
    existingEvidence,
    jobsToBeDone,
    successMetric,
    inScope: uniqueItems(inScope),
    outOfScope: uniqueItems(nonGoals),
    userFlow,
    acceptanceCriteria,
    analyticsImpact,
    dataImpact,
    constraints,
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

function buildUserFlow(feature, prd, targetUser) {
  const flow = [];

  if (feature.routes.length > 0) {
    flow.push(
      `핵심 대상 사용자가 ${feature.routes.join(", ")} 경로로 진입한다.`,
    );
  } else if (feature.adminSurface === "yes") {
    flow.push("핵심 대상 사용자가 admin surface에서 기능을 사용한다.");
  } else {
    flow.push(`핵심 대상 사용자가 ${feature.title} 흐름을 시작한다.`);
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

function deriveTargetMoment(prd, feature, targetUser) {
  const coreUseCases = normalizeContent(prd.sections["Core Use Cases"]);
  const primarySituation = coreUseCases.match(/- 상황:\s*(.+)/);

  if (primarySituation?.[1]) {
    return primarySituation[1].trim();
  }

  if (feature.routes.length > 0) {
    return `${targetUser}가 ${feature.routes.join(", ")} 경로로 문제 해결을 시도하는 순간`;
  }

  return `${targetUser}가 ${feature.title} 관련 문제를 해결하려고 첫 행동을 시작하는 순간`;
}

function deriveExistingEvidence(
  prd,
  analyticsImpact,
  dataImpact,
  dependencies,
) {
  const evidence = [];
  const sourceUrl = normalizeContent(prd.sourceUrl);

  if (sourceUrl) {
    evidence.push(`원본 입력 또는 참고 문서: ${sourceUrl}`);
  }

  if (analyticsImpact.length > 0) {
    evidence.push(
      `현재 알려진 measurement surface: ${analyticsImpact.join(", ")}`,
    );
  }

  if (dataImpact.length > 0) {
    evidence.push(`현재 알려진 data impact: ${dataImpact.join(", ")}`);
  }

  if (dependencies.length > 0) {
    evidence.push(`의존 시스템 또는 선행 조건: ${dependencies.join(", ")}`);
  }

  if (evidence.length === 0) {
    evidence.push(
      "명시적 existing evidence가 부족하므로 구현 전에 analytics, 고객 메모, 또는 운영 맥락을 추가로 확인해야 한다.",
    );
  }

  return evidence;
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

  if (feature.uiSurface === "yes") {
    paths.push("apps/web/src/lib/product-config.ts");
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
    renderFrontmatter(
      withHarnessDefaults(
        {
          status,
          owner_role: "pm",
          source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
          affected_paths: planning.affectedPaths,
          dependencies: buildDependencies(workId, planning, true),
          skip_reason: null,
        },
        planning,
      ),
    ),
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
    "## Target Moment",
    "",
    renderParagraph(planning.targetMoment),
    "",
    "## Goal",
    "",
    renderParagraph(planning.goal),
    "",
    "## Constraints",
    "",
    ...renderBulletList(planning.constraints),
    "",
    "## Non-Goals",
    "",
    ...renderBulletList(planning.outOfScope),
    "",
    "## Existing Evidence",
    "",
    ...renderBulletList(planning.existingEvidence),
    "",
    "## Enterprise Decision Guardrails",
    "",
    ...renderBulletList(buildEnterpriseDecisionGuardrails(planning)),
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
    renderFrontmatter(
      withHarnessDefaults(
        {
          status: planning.readiness === "blocked" ? "blocked" : "draft",
          owner_role: "product-squad",
          related_prd: `docs/prds/${planning.prd.slug}.md`,
          related_work_item: `docs/work-items/${workId}`,
          feature_slug: planning.feature.slug,
          implementation_readiness: planning.readiness,
          affected_paths: planning.affectedPaths,
          dependencies: buildDependencies(workId, planning, false),
          skip_reason: null,
        },
        planning,
      ),
    ),
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
    "## Business Goal Mapping",
    "",
    ...renderBulletList(buildBusinessGoalMapping(planning)),
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
    "## Quality Gates",
    "",
    ...renderBulletList(buildQualityGates(planning)),
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

function renderTeamPlan(workId, planning) {
  return [
    renderFrontmatter(
      withHarnessDefaults(
        {
          status: planning.readiness === "blocked" ? "blocked" : "draft",
          owner_role: "product-squad",
          source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
          affected_paths: planning.affectedPaths,
          dependencies: uniqueItems([
            `docs/work-items/${workId}/brief.md`,
            `docs/work-items/${workId}/feature-spec.md`,
          ]),
          skip_reason: null,
        },
        planning,
      ),
    ),
    "# Team Plan",
    "",
    "## Mission",
    "",
    renderParagraph(planning.featureSummary),
    "",
    "## Execution Mode",
    "",
    ...renderBulletList(buildExecutionMode(planning)),
    "",
    "## Team Topology",
    "",
    ...renderBulletList(buildTeamTopology(planning)),
    "",
    "## Shared Context Pack",
    "",
    ...renderBulletList(buildSharedContextPack(workId, planning)),
    "",
    "## Shared Task List",
    "",
    ...renderBulletList(buildSharedTaskList(planning)),
    "",
    "## File Ownership Plan",
    "",
    ...renderBulletList(buildFileOwnershipPlan(planning)),
    "",
    "## Handoff Log",
    "",
    ...renderBulletList(buildInitialHandoffLog(planning)),
    "",
    "## Escalations",
    "",
    ...renderBulletList(buildEscalations(planning)),
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
      planning,
      sections: [
        "## Goal Alignment",
        "",
        "-",
        "",
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
        "## Primary CTA And Trust",
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
        "## Enterprise UX Principles",
        "",
        "-",
        "",
        "## Browser QA Plan",
        "",
        "-",
        "",
      ],
    });
  }

  return [
    renderFrontmatter(
      withHarnessDefaults(
        {
          status: planning.readiness === "blocked" ? "blocked" : "draft",
          owner_role: "pd",
          source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
          affected_paths: planning.affectedPaths,
          dependencies: buildDependencies(workId, planning, true),
          skip_reason: null,
        },
        planning,
      ),
    ),
    "# UX Review",
    "",
    "## Goal Alignment",
    "",
    ...renderBulletList(buildGoalAlignment(planning)),
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
    "## Primary CTA And Trust",
    "",
    ...renderBulletList(buildPrimaryCtaAndTrust(planning)),
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
    "## Enterprise UX Principles",
    "",
    ...renderBulletList(buildEnterpriseUxPrinciples(planning)),
    "",
    "## Browser QA Plan",
    "",
    ...renderBulletList(buildBrowserQaPlan(planning)),
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
      planning,
      sections: [
        "## Goal Alignment",
        "",
        "-",
        "",
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
        "## Instrumentation Hooks",
        "",
        "-",
        "",
        "## Enterprise FE Guardrails",
        "",
        "-",
        "",
        "## Test-First Plan",
        "",
        "-",
        "",
        "## Manual Browser QA",
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
    renderFrontmatter(
      withHarnessDefaults(
        {
          status: planning.readiness === "blocked" ? "blocked" : "draft",
          owner_role: "fe",
          source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
          affected_paths: planning.affectedPaths,
          dependencies: buildDependencies(workId, planning),
          skip_reason: null,
        },
        planning,
      ),
    ),
    "# Frontend Spec",
    "",
    "## Goal Alignment",
    "",
    ...renderBulletList(buildGoalAlignment(planning)),
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
    "## Instrumentation Hooks",
    "",
    ...renderBulletList(buildInstrumentationHooks(planning)),
    "",
    "## Enterprise FE Guardrails",
    "",
    ...renderBulletList(buildEnterpriseFeGuardrails(planning)),
    "",
    "## Test-First Plan",
    "",
    ...renderBulletList(buildFrontendTests(planning)),
    "",
    "## Manual Browser QA",
    "",
    ...renderBulletList(buildBrowserQaPlan(planning)),
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
      planning,
      sections: [
        "## Goal Alignment",
        "",
        "-",
        "",
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
        "## Measurement Guardrails",
        "",
        "-",
        "",
        "## Enterprise BE Guardrails",
        "",
        "-",
        "",
        "## Boundary / Use Case / Repository Contract Test Plan",
        "",
        "-",
        "",
      ],
    });
  }

  return [
    renderFrontmatter(
      withHarnessDefaults(
        {
          status: planning.readiness === "blocked" ? "blocked" : "draft",
          owner_role: "be",
          source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
          affected_paths: planning.affectedPaths,
          dependencies: buildDependencies(workId, planning),
          skip_reason: null,
        },
        planning,
      ),
    ),
    "# Backend Spec",
    "",
    "## Goal Alignment",
    "",
    ...renderBulletList(buildGoalAlignment(planning)),
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
    "## Measurement Guardrails",
    "",
    ...renderBulletList(buildMeasurementGuardrails(planning)),
    "",
    "## Enterprise BE Guardrails",
    "",
    ...renderBulletList(buildEnterpriseBeGuardrails(planning)),
    "",
    "## Boundary / Use Case / Repository Contract Test Plan",
    "",
    ...renderBulletList(buildBackendTests(planning)),
    "",
  ].join("\n");
}

function renderQualityScorecard(workId, planning) {
  return [
    renderFrontmatter(
      withHarnessDefaults(
        {
          status: planning.readiness === "blocked" ? "blocked" : "draft",
          owner_role: "product-squad",
          source_request: `PRD: docs/prds/${planning.prd.slug}.md`,
          affected_paths: planning.affectedPaths,
          dependencies: uniqueItems(
            [
              `docs/work-items/${workId}/brief.md`,
              `docs/work-items/${workId}/team-plan.md`,
              `docs/work-items/${workId}/feature-spec.md`,
              `docs/work-items/${workId}/ux-review.md`,
              `docs/work-items/${workId}/frontend-spec.md`,
              planning.backendRequired
                ? `docs/work-items/${workId}/backend-spec.md`
                : null,
            ].filter(Boolean),
          ),
          skip_reason: null,
        },
        planning,
      ),
    ),
    "# Quality Scorecard",
    "",
    "## Goal Fit",
    "",
    ...renderBulletList(buildGoalAlignment(planning)),
    "",
    "## Product Risks To Kill",
    "",
    ...renderBulletList(buildQualityRisks(planning)),
    "",
    "## Review Checklist",
    "",
    ...renderChecklist(buildQualityChecklist(planning)),
    "",
    "## Browser QA Evidence",
    "",
    ...renderBulletList(buildBrowserQaPlan(planning)),
    "",
    "## Code Quality Evidence",
    "",
    ...renderBulletList(buildCodeQualityEvidence(planning)),
    "",
    "## Principle Adherence",
    "",
    ...renderBulletList(buildPrincipleAdherence(planning)),
    "",
    "## Docs And Spec Sync",
    "",
    ...renderBulletList(buildDocsAndSpecSync(workId, planning)),
    "",
    "## Verification Evidence",
    "",
    ...renderBulletList(buildVerificationEvidence(workId, planning)),
    "",
    "## Measurement And Ops Checks",
    "",
    ...renderBulletList(buildMeasurementGuardrails(planning)),
    "",
    "## Release Recommendation",
    "",
    ...renderBulletList(buildReleaseRecommendation(planning)),
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
  planning,
  sections,
}) {
  return [
    renderFrontmatter(
      withHarnessDefaults(
        {
          status: "skipped",
          owner_role: ownerRole,
          source_request: sourceRequest,
          affected_paths: affectedPaths,
          dependencies,
          skip_reason: skipReason,
        },
        planning,
      ),
    ),
    `# ${title}`,
    "",
    ...sections,
  ].join("\n");
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

  if (planning.frontendRequired) {
    tests.push(
      "user-facing surface면 browser QA evidence와 quality scorecard를 함께 남긴다.",
    );
  }

  return tests;
}

function buildBusinessGoalMapping(planning) {
  const mapping = [`이 작업의 목표: ${planning.goal}`];

  if (planning.successMetric.length > 0) {
    mapping.push(`주요 success signal: ${planning.successMetric.join(", ")}`);
  }

  mapping.push("사용자 행동 변화와 운영 해석 가능성이 동시에 확보되어야 한다.");

  return uniqueItems(mapping);
}

function buildQualityGates(planning) {
  const gates = [
    "goal, success metric, acceptance criteria가 문서에 고정되어 있다.",
    "team-plan에 execution mode, task graph, file ownership이 정리되어 있다.",
    "테스트 가능한 behavior slice와 verify 계획이 있다.",
  ];

  if (planning.frontendRequired) {
    gates.push(
      "browser QA evidence와 responsive/accessibility 확인 기준이 있다.",
    );
  }

  if (planning.analyticsImpact.length > 0 || planning.backendRequired) {
    gates.push(
      "measurement와 운영 해석에 필요한 event/data visibility가 있다.",
    );
  }

  gates.push("최종 ship / iterate / stop 판단을 quality scorecard에 남긴다.");

  return gates;
}

function buildGoalAlignment(planning) {
  const items = [`이 작업의 목표: ${planning.goal}`];

  if (planning.successMetric.length > 0) {
    items.push(`주요 success signal: ${planning.successMetric.join(", ")}`);
  }

  items.push(
    "사용자 행동 변화와 business signal을 함께 관찰할 수 있어야 한다.",
  );

  return items;
}

function buildPrimaryCtaAndTrust(planning) {
  const items = [
    "가장 중요한 CTA 하나를 기준으로 hierarchy를 정리한다.",
    "첫 화면에서 사용자가 왜 지금 행동해야 하는지 설명한다.",
  ];

  if (planning.backendRequired) {
    items.push(
      "신뢰에 영향을 주는 입력, 저장, 후속 연락 기대치를 분명히 드러낸다.",
    );
  }

  return items;
}

function buildExecutionMode(planning) {
  const mode =
    planning.frontendRequired && planning.backendRequired
      ? "agent-team 또는 subagent fan-out을 검토하되, platform capability가 불명확하면 single-agent sequential을 기본으로 둔다."
      : "single-agent sequential을 기본으로 둔다.";

  return [mode, "병렬 구현보다 병렬 research/review를 먼저 수행한다."];
}

function buildTeamTopology(planning) {
  const topology = [
    "lead: product-squad",
    "pm: brief와 acceptance criteria 담당",
  ];

  if (planning.uxRequired) {
    topology.push("pd: CTA, IA, trust, browser QA 담당");
  }

  if (planning.frontendRequired) {
    topology.push("fe: route/module/state/instrumentation 담당");
  }

  if (planning.backendRequired) {
    topology.push("be: validation/persistence/analytics/admin visibility 담당");
  }

  topology.push("quality review: quality-scorecard와 ship 판단 담당");

  return topology;
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

function buildSharedTaskList(planning) {
  const tasks = [
    "T-01 lead: goal packet과 scope를 brief로 고정한다.",
    "T-02 lead: execution mode, task graph, file ownership을 team-plan에 정리한다.",
  ];

  if (planning.uxRequired) {
    tasks.push("T-03 pd: CTA, trust, edge state, browser QA 계획을 정리한다.");
  }

  if (planning.frontendRequired) {
    tasks.push(
      "T-04 fe: UI thin slice, instrumentation, test-first plan을 정리한다.",
    );
  }

  if (planning.backendRequired) {
    tasks.push(
      "T-05 be: validation, persistence, analytics, failure mode를 정리한다.",
    );
  }

  tasks.push("T-06 lead: 역할 산출물을 수렴해 quality-scorecard를 채운다.");

  return tasks;
}

function buildFileOwnershipPlan(planning) {
  return planning.affectedPaths.map((path) => `owner to assign: ${path}`);
}

function buildInitialHandoffLog(planning) {
  const log = [
    "lead -> pm: mission, success metric, non-goals, constraints를 고정한다.",
  ];

  if (planning.uxRequired) {
    log.push(
      "pm -> pd: target moment, primary CTA, trust question을 handoff한다.",
    );
  }

  if (planning.frontendRequired) {
    log.push(
      "pd -> fe: happy path, edge state, browser QA focus를 handoff한다.",
    );
  }

  if (planning.backendRequired) {
    log.push("fe -> be: instrumentation과 data dependency를 handoff한다.");
  }

  log.push(
    "all roles -> lead: open questions, proof, risks를 scorecard로 수렴한다.",
  );

  return log;
}

function buildEscalations(planning) {
  const escalations = [
    "goal 또는 success metric이 흔들리면 구현보다 문서 갱신을 우선한다.",
    "같은 파일을 둘 이상 수정해야 하면 병렬 구현을 중단하고 owner를 재배정한다.",
  ];

  if (planning.frontendRequired) {
    escalations.push(
      "browser QA evidence가 비면 ship 대신 iterate를 기본값으로 둔다.",
    );
  }

  return escalations;
}

function buildEnterpriseDecisionGuardrails(planning) {
  const items = [
    "goal, success metric, acceptance criteria를 구현 전에 decision-complete하게 고정한다.",
    "문서에 없는 요구를 구현 중 추측으로 채우지 않고 open question으로 승격한다.",
    "thin slice 하나를 먼저 닫고 나서만 scope를 확장한다.",
  ];

  if (planning.readiness === "blocked") {
    items.push(
      "blocking question 해소 전에는 implementation readiness를 올리지 않는다.",
    );
  }

  return items;
}

function buildBrowserQaPlan(planning) {
  if (!planning.uxRequired && !planning.frontendRequired) {
    return [
      "non-user-facing scope이므로 browser QA는 skip reason과 measurement proof 중심으로 처리한다.",
    ];
  }

  const items = [
    "desktop viewport에서 happy path와 CTA hierarchy를 확인한다.",
    "mobile viewport에서 첫 스크린 메시지, 폼 길이, sticky CTA 필요 여부를 확인한다.",
    "error / empty / pending state를 실제 브라우저에서 확인한다.",
    "focus order, label, helper text, contrast를 점검한다.",
  ];

  if (planning.feature.routes.length > 0) {
    items.push(
      `핵심 경로 ${planning.feature.routes.join(", ")} 기준으로 recorded flow 또는 manual proof를 남긴다.`,
    );
  }

  items.push(
    "회귀 우려가 큰 화면이면 screenshot diff 또는 visual regression을 검토한다.",
  );

  return items;
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

function buildEnterpriseUxPrinciples(planning) {
  const items = [
    "CTA hierarchy와 trust signal을 한 흐름 안에서 일관되게 유지한다.",
    "happy path뿐 아니라 error, empty, pending state를 같은 정보 구조로 다룬다.",
    "접근성과 이해 가능성을 novelty보다 우선한다.",
  ];

  if (planning.backendRequired) {
    items.push(
      "입력 후 어떤 후속 연락 또는 처리 결과가 생기는지 기대치를 분명히 적는다.",
    );
  }

  return items;
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

function buildInstrumentationHooks(planning) {
  const items = [
    "핵심 CTA, submit, state transition에만 measurement hook를 둔다.",
  ];

  if (planning.analyticsImpact.length > 0) {
    items.push(...planning.analyticsImpact);
  } else {
    items.push(
      "추가 event가 없다면 어떤 기존 signal로 효과를 해석할지 적는다.",
    );
  }

  return uniqueItems(items);
}

function buildFrontendTests(planning) {
  const tests = ["새 또는 변경된 route의 happy path를 수동 검증한다."];

  if (planning.analyticsImpact.length > 0) {
    tests.push("이벤트가 중복 없이 필요한 시점에만 기록되는지 확인한다.");
  }

  tests.push("오류 상태, 빈 상태, pending 상태를 확인한다.");

  return tests;
}

function buildEnterpriseFeGuardrails(planning) {
  const items = [
    "route entry는 얇게 두고 UI, 상태, 행동의 책임을 module 경계로 분리한다.",
    "큰 컴포넌트 하나에 state, copy, side effect를 모두 몰아넣지 않는다.",
    "재사용은 inheritance보다 composition과 explicit props/interface를 우선한다.",
  ];

  if (planning.analyticsImpact.length > 0) {
    items.push(
      "instrumentation은 핵심 state transition 경계에만 두고 중복 emit을 피한다.",
    );
  }

  return items;
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

function buildEnterpriseBeGuardrails(planning) {
  const items = [
    "validation, use case, repository, adapter 책임을 한 파일에 섞지 않는다.",
    "domain invariant와 measurement integrity는 호출부가 아니라 경계 안에서 보호한다.",
    "class나 layer는 명확성이 커질 때만 추가하고 speculative abstraction은 피한다.",
  ];

  if (planning.analyticsImpact.length > 0) {
    items.push(
      "analytics 기록과 외부 전송은 분리해 optional provider 실패가 core signal을 깨지 않게 한다.",
    );
  }

  return items;
}

function buildMeasurementGuardrails(planning) {
  const items = [];

  if (planning.analyticsImpact.length > 0) {
    items.push(...planning.analyticsImpact);
  }

  if (planning.dataImpact.length > 0) {
    items.push(
      "운영자가 후속 액션을 정할 수 있게 저장/조회 데이터가 남아야 한다.",
    );
  }

  items.push(
    "optional provider 실패가 핵심 business signal 수집을 막지 않게 한다.",
  );

  return uniqueItems(items);
}

function buildQualityRisks(planning) {
  const risks = [
    "business goal과 직접 연결되지 않는 부가 UI 변경이 scope를 흐릴 수 있다.",
    "measurement 또는 admin visibility가 부족하면 결과 해석이 불가능해질 수 있다.",
  ];

  if (planning.frontendRequired) {
    risks.push(
      "happy path는 좋아 보여도 mobile/edge state에서 전환이 무너질 수 있다.",
    );
  }

  return uniqueItems([...risks, ...planning.openQuestions]);
}

function buildQualityChecklist(planning) {
  const items = [
    "primary business goal과 success metric이 이 변경과 연결된다",
    "risky boundary test evidence가 있거나 skip reason이 명시되어 있다",
    "역할별 산출물이 enterprise principles를 따른다",
    "사용자에게 가장 중요한 CTA와 value proposition이 분명하다",
    "trust, error, empty, pending state가 검토되었다",
    "docs/spec sync가 확인되었다",
    "fresh `pnpm verify` 또는 `pnpm verify:full` 결과가 있다",
  ];

  if (planning.analyticsImpact.length > 0 || planning.backendRequired) {
    items.push("analytics/admin visibility가 있어 결과를 해석할 수 있다");
  }

  if (planning.frontendRequired) {
    items.push("responsive + accessibility + browser QA evidence가 있다");
  }

  return items;
}

function buildCodeQualityEvidence(planning) {
  const items = [
    "중요한 behavior slice를 먼저 테스트 가능한 단위로 자르고 최소 구현으로 수렴한다.",
  ];

  if (planning.frontendRequired) {
    items.push(
      "state transition과 UI 경계를 검증할 테스트 또는 manual proof 계획이 있다.",
    );
  }

  if (planning.backendRequired) {
    items.push(
      "validation, persistence, analytics 경계에 대한 contract test 계획이 있다.",
    );
  }

  return items;
}

function buildPrincipleAdherence(planning) {
  const items = [
    "PM 산출물은 goal, metric, acceptance criteria를 모호성 없이 고정한다.",
  ];

  if (planning.uxRequired) {
    items.push(
      "PD 산출물은 trust, hierarchy, edge state completeness를 확인한다.",
    );
  }

  if (planning.frontendRequired) {
    items.push(
      "FE 산출물은 explicit UI/state boundary와 composition-first 구조를 유지한다.",
    );
  }

  if (planning.backendRequired) {
    items.push(
      "BE 산출물은 validation/use case/repository/adapter 책임을 분리한다.",
    );
  }

  return items;
}

function buildDocsAndSpecSync(workId, planning) {
  return uniqueItems(
    [
      `docs/prds/${planning.prd.slug}.md`,
      `docs/work-items/${workId}/brief.md`,
      `docs/work-items/${workId}/team-plan.md`,
      `docs/work-items/${workId}/quality-scorecard.md`,
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

function buildVerificationEvidence(workId, planning) {
  const items = [
    `run pnpm repo:check --work ${workId}`,
    `run pnpm squad:check ${workId}`,
  ];

  if (planning.frontendRequired) {
    items.push(
      "run pnpm verify:full if browser-critical flow or integration risk grows beyond unit coverage",
    );
  } else {
    items.push("run pnpm verify");
  }

  return items;
}

function buildReleaseRecommendation(planning) {
  const items = [
    "구현 후 `ship`, `iterate`, `stop` 중 하나를 선택하고 근거를 남긴다.",
  ];

  if (planning.readiness === "blocked") {
    items.push(
      "현재는 open question 해소 전이라 구현/ship 판단을 내리지 않는다.",
    );
  } else {
    items.push(
      "browser evidence와 measurement check가 비면 ship 대신 iterate를 기본값으로 둔다.",
    );
  }

  return items;
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
    }
  }

  return uniqueItems(items.filter(Boolean));
}

function renderFrontmatter(fields) {
  const mergedFields = {
    ...("owner_role" in fields
      ? {
          owner: fields.owner_role,
          doc_type: "task-local",
          source_of_truth: true,
          freshness: "active",
          verification: "scripted",
        }
      : {}),
    ...fields,
  };

  return [
    "---",
    ...Object.entries(mergedFields).map(([key, value]) =>
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
