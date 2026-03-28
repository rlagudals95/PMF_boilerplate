#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const rootDir = process.cwd();
const prdsDir = path.join(rootDir, "docs", "prds");

const FLOW_CATALOG = {
  landing: {
    label: "landing",
    dependencyPath: "apps/web/src/modules/landing/*",
    scopeLine: (offer) => `${offer}를 설명하는 랜딩 hero, trust, CTA를 정리한다.`,
  },
  lead: {
    label: "lead capture",
    dependencyPath: "apps/web/src/modules/lead/*",
    scopeLine: () => "관심 신호를 남길 intake 또는 lead form을 붙인다.",
  },
  consultation: {
    label: "consultation",
    dependencyPath: "apps/web/src/modules/consultation/*",
    scopeLine: () =>
      "더 강한 구매 또는 상담 의사를 확인하는 consultation flow를 연결한다.",
  },
  payment: {
    label: "payment intent",
    dependencyPath: "apps/web/src/modules/payment/*",
    scopeLine: () =>
      "결제 의사 또는 예약금 intent를 확인하는 payment flow를 연결한다.",
  },
  admin: {
    label: "admin",
    dependencyPath: "apps/web/src/modules/admin/*",
    scopeLine: () =>
      "운영자가 결과를 해석할 최소 admin/analytics visibility를 유지한다.",
  },
  auth: {
    label: "auth starter",
    dependencyPath: "apps/web/src/modules/auth/*",
    scopeLine: () => "필요한 경우 social auth starter를 붙인다.",
  },
};

const RECIPE_CATALOG = [
  {
    id: "comparison-routing",
    keywords: [
      "비교",
      "compare",
      "추천",
      "옵션",
      "견적",
      "제휴",
      "파트너",
      "partner",
      "연결",
      "매칭",
      "routing",
      "route",
      "보내",
    ],
    activeFlowIds: ["landing", "lead", "consultation", "admin"],
    deferredItems: [
      "payment demo",
      "social auth starter",
      "heavy experiment setup",
    ],
    primaryModule: "landing",
    routes: ["/", "/consult", "/admin"],
    paymentRequired: false,
    primaryCta: "내 조건으로 비교 결과 받기",
    adminMetrics: [
      "qualified_lead_rate",
      "consultation_request_rate",
      "partner_handoff_count",
    ],
    keyEvents: [
      "cta_clicked",
      "lead_form_submitted",
      "consultation_requested",
    ],
    trustThemes: [
      "비교 기준 공개",
      "연결 프로세스 설명",
      "제휴 파트너 신뢰 정보",
    ],
    buildGoal: ({ subject, targetOutcome }) =>
      targetOutcome ||
      `${subject} 탐색 사용자를 qualified lead와 partner handoff로 전환한다.`,
    buildAudience: ({ subject }) =>
      `${subject} 비교 과정에서 적합한 파트너와 연결되고 싶은 사용자`,
    buildOffer: ({ subject }) =>
      `${subject} 비교 후 적합한 파트너로 연결해 주는 서비스`,
    buildSignal: () => "qualified_lead_rate >= 20% within 14 days",
    buildProblem: ({ subject, audience }) =>
      `${audience}는 ${subject} 비교 과정에서 기준을 빠르게 이해하고 신뢰할 수 있는 파트너까지 이동하고 싶지만, 비교와 후속 연결이 한 흐름으로 묶인 MVP가 부족하다.`,
    buildFeatureSummary: ({ offer, goal }) =>
      `${offer}를 중심으로 랜딩, lead capture, consultation, admin signal을 구성해 ${goal}을 검증한다.`,
    buildUserValue: ({ audience }) =>
      `${audience}는 비교 기준을 빠르게 이해하고, 조건을 남긴 뒤 후속 연결까지 이어질 수 있다.`,
    heroAngle: "비교와 후속 연결을 한 번에 이해시키는 신뢰형 hero",
    openQuestions: [
      "비교 기준을 몇 개 축으로 요약할지",
      "partner handoff를 어떤 기준에서 qualified로 볼지",
    ],
  },
  {
    id: "consultation",
    keywords: [
      "상담",
      "consult",
      "demo",
      "미팅",
      "예약",
      "전화",
      "call",
    ],
    activeFlowIds: ["landing", "consultation", "admin"],
    deferredItems: [
      "payment demo",
      "social auth starter",
      "heavy experiment setup",
    ],
    primaryModule: "consultation",
    routes: ["/", "/consult", "/admin"],
    paymentRequired: false,
    primaryCta: "상담 요청하기",
    adminMetrics: ["consultation_request_rate", "qualified_consult_count"],
    keyEvents: ["cta_clicked", "consultation_requested"],
    trustThemes: [
      "응답 속도 설명",
      "상담 프로세스 공개",
      "상담 대상 적합도 안내",
    ],
    buildGoal: ({ subject, targetOutcome }) =>
      targetOutcome ||
      `${subject} 관련 상담 요청과 qualified consult 비중을 높인다.`,
    buildAudience: ({ subject }) =>
      `${subject} 관련해 빠르게 전문가 상담이나 후속 안내를 받고 싶은 사용자`,
    buildOffer: ({ subject }) =>
      `${subject} 관련 상담 요청을 빠르게 접수하고 후속 연결로 이어주는 서비스`,
    buildSignal: () => "consultation_request_rate >= 15% within 14 days",
    buildProblem: ({ subject, audience }) =>
      `${audience}는 ${subject} 관련 상담을 받고 싶지만, 신뢰를 주는 설명과 상담 요청까지의 짧은 흐름이 부족하다.`,
    buildFeatureSummary: ({ offer, goal }) =>
      `${offer}를 중심으로 랜딩과 consultation flow를 구성해 ${goal}을 검증한다.`,
    buildUserValue: ({ audience }) =>
      `${audience}는 상황을 빠르게 남기고 명확한 다음 단계를 안내받을 수 있다.`,
    heroAngle: "짧은 설명과 높은 신뢰로 상담 CTA를 여는 hero",
    openQuestions: [
      "상담 요청 시 운영자가 먼저 보고 싶은 qualification 항목이 무엇인지",
    ],
  },
  {
    id: "paid-intent",
    keywords: [
      "결제",
      "payment",
      "pay",
      "예약금",
      "preorder",
      "pre-order",
      "구매",
      "checkout",
      "paid",
    ],
    activeFlowIds: ["landing", "payment", "admin"],
    deferredItems: [
      "social auth starter",
      "consultation flow",
      "heavy experiment setup",
    ],
    primaryModule: "payment",
    routes: ["/", "/pay", "/admin"],
    paymentRequired: true,
    primaryCta: "결제 의사 확인하기",
    adminMetrics: [
      "payment_checkout_started_rate",
      "payment_intent_count",
      "payment_success_count",
    ],
    keyEvents: ["cta_clicked", "payment_checkout_started", "payment_completed"],
    trustThemes: ["가격/조건 공개", "환불 또는 취소 안내", "결제 전 확인 정보"],
    buildGoal: ({ subject, targetOutcome }) =>
      targetOutcome ||
      `${subject} 관련 strong purchase intent를 빠르게 검증한다.`,
    buildAudience: ({ subject }) =>
      `${subject}에 관심은 있지만 실제로 결제할지 판단 중인 사용자`,
    buildOffer: ({ subject }) =>
      `${subject}에 대한 결제 의사나 예약금을 빠르게 확인하는 서비스`,
    buildSignal: () => "payment_checkout_started_rate >= 10% within 14 days",
    buildProblem: ({ subject, audience }) =>
      `${audience}는 ${subject}에 관심이 있어도 실제 지불 의사까지 이어지는 흐름이 부족하고, 운영자는 strong signal을 해석하기 어렵다.`,
    buildFeatureSummary: ({ offer, goal }) =>
      `${offer}를 중심으로 랜딩과 payment intent flow를 구성해 ${goal}을 검증한다.`,
    buildUserValue: ({ audience }) =>
      `${audience}는 핵심 조건을 이해한 뒤 바로 결제 의사나 예약금 intent를 남길 수 있다.`,
    heroAngle: "가격과 결제 확신을 빠르게 만드는 conversion hero",
    openQuestions: [
      "첫 릴리스에서 실제 결제 완료를 볼지, 결제 시작 signal만 볼지",
    ],
  },
  {
    id: "waitlist",
    keywords: [
      "대기",
      "waitlist",
      "베타",
      "beta",
      "early access",
      "얼리",
      "알림",
      "런칭 전",
    ],
    activeFlowIds: ["landing", "lead", "admin"],
    deferredItems: [
      "consultation flow",
      "payment demo",
      "social auth starter",
    ],
    primaryModule: "landing",
    routes: ["/", "/admin"],
    paymentRequired: false,
    primaryCta: "오픈 알림 신청하기",
    adminMetrics: ["waitlist_signup_rate", "qualified_waitlist_count"],
    keyEvents: ["cta_clicked", "lead_form_submitted"],
    trustThemes: ["출시 일정 안내", "누가 먼저 초대되는지 설명", "초기 혜택 공개"],
    buildGoal: ({ subject, targetOutcome }) =>
      targetOutcome ||
      `${subject} 출시 전 관심 사용자와 early signal을 모은다.`,
    buildAudience: ({ subject }) =>
      `${subject} 출시 전에 먼저 써보고 싶은 초기 관심 사용자`,
    buildOffer: ({ subject }) =>
      `${subject} 출시 전 관심 사용자와 early signal을 모으는 서비스`,
    buildSignal: () => "waitlist_signup_rate >= 25% within 14 days",
    buildProblem: ({ subject, audience }) =>
      `${audience}는 ${subject} 출시 전에 관심을 남기고 싶지만, 대기 등록과 기대 관리를 위한 간단한 진입점이 부족하다.`,
    buildFeatureSummary: ({ offer, goal }) =>
      `${offer}를 중심으로 랜딩과 waitlist capture flow를 구성해 ${goal}을 검증한다.`,
    buildUserValue: ({ audience }) =>
      `${audience}는 복잡한 입력 없이 관심을 남기고 출시 소식을 받을 수 있다.`,
    heroAngle: "초기 기대감과 우선 초대 동기를 만드는 launch hero",
    openQuestions: ["waitlist 참여자에게 어떤 후속 메시지를 보낼지"],
  },
  {
    id: "lead-gen",
    keywords: [
      "리드",
      "lead",
      "문의",
      "contact",
      "신청",
      "inquiry",
      "intake",
      "수집",
      "모으",
    ],
    activeFlowIds: ["landing", "lead", "admin"],
    deferredItems: [
      "consultation flow",
      "payment demo",
      "social auth starter",
    ],
    primaryModule: "landing",
    routes: ["/", "/admin"],
    paymentRequired: false,
    primaryCta: "핵심 정보 남기기",
    adminMetrics: ["lead_capture_rate", "qualified_lead_rate"],
    keyEvents: ["cta_clicked", "lead_form_submitted"],
    trustThemes: ["문의 후 다음 단계 설명", "응답 속도 약속", "입력 정보 최소화"],
    buildGoal: ({ subject, targetOutcome }) =>
      targetOutcome ||
      `${subject} 관련 관심 사용자를 qualified lead로 전환한다.`,
    buildAudience: ({ subject }) =>
      `${subject} 관련 도움을 받고 싶지만 긴 상담 전에 먼저 관심을 남기고 싶은 사용자`,
    buildOffer: ({ subject }) =>
      `${subject} 관련 관심 신호를 빠르게 수집하는 서비스`,
    buildSignal: () => "lead_capture_rate >= 20% within 14 days",
    buildProblem: ({ subject, audience }) =>
      `${audience}는 ${subject} 관련 도움을 받고 싶지만, 문의를 남길 빠른 진입점과 운영자가 바로 해석할 수 있는 신호가 부족하다.`,
    buildFeatureSummary: ({ offer, goal }) =>
      `${offer}를 중심으로 랜딩과 lead capture flow를 구성해 ${goal}을 검증한다.`,
    buildUserValue: ({ audience }) =>
      `${audience}는 긴 설명 없이 핵심 정보를 남기고 빠르게 후속 연락을 받을 수 있다.`,
    heroAngle: "빠른 문의와 낮은 마찰을 만드는 response hero",
    openQuestions: ["lead quality를 어떤 입력 조합으로 구분할지"],
  },
];

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const resolved = resolveStarterOptions(options);
  const prdPath = path.join(prdsDir, `${resolved.slug}.md`);
  const now = new Date();
  const today = buildLocalDate(now);
  const prdMarkdown = renderMvpPrd({
    ...resolved,
    createdAt: today,
  });
  const summaryLines = renderSetupSummaryLines(resolved.starterSummary);

  if (resolved.dryRun) {
    process.stdout.write(
      [
        `Dry run: pnpm mvp:new ${resolved.slug}`,
        `- PRD: docs/prds/${resolved.slug}.md`,
        `- Planned feature work item: docs/work-items/${buildDatePart(now)}-${resolved.slug}`,
        "- Inputs:",
        `  - title: ${resolved.title}`,
        `  - audience: ${resolved.audience}`,
        `  - offer: ${resolved.offer}`,
        `  - goal: ${resolved.goal}`,
        `  - signal: ${resolved.signal}`,
        ...(resolved.prompt ? [`  - prompt: ${resolved.prompt}`] : []),
        "- Setup:",
        ...summaryLines.map((line) => `  ${line}`),
        "",
        "Preview:",
        prdMarkdown.split("\n").slice(0, 56).join("\n"),
      ].join("\n") + "\n",
    );
    return;
  }

  await mkdir(prdsDir, { recursive: true });
  await writeFile(prdPath, prdMarkdown, {
    flag: resolved.force ? "w" : "wx",
  });

  const featureCommand = [
    path.join(rootDir, "scripts", "create-feature-from-prd.mjs"),
    "--prd",
    resolved.slug,
    "--feature",
    resolved.slug,
  ];

  const featureRun = await execFileAsync("node", featureCommand, {
    cwd: rootDir,
  });

  process.stdout.write(
    [
      `Created MVP starter: ${resolved.slug}`,
      `- PRD: docs/prds/${resolved.slug}.md`,
      `- Title: ${resolved.title}`,
      `- Goal: ${resolved.goal}`,
      `- Audience: ${resolved.audience}`,
      `- Offer: ${resolved.offer}`,
      `- Signal: ${resolved.signal}`,
      ...(resolved.prompt ? [`- Prompt: ${resolved.prompt}`] : []),
      ...summaryLines,
      "",
      featureRun.stdout.trim(),
      "",
      "Next steps:",
      `- Review docs/prds/${resolved.slug}.md`,
      "- Review docs/start-your-mvp.md for recipe-specific starting guidance",
      `- Update apps/web/src/lib/product-config.ts for this MVP`,
      `- Fill the generated work item docs before implementation`,
    ].join("\n") + "\n",
  );
}

function parseArgs(args) {
  let slug = "";
  let title = "";
  let goal = "";
  let audience = "";
  let offer = "";
  let signal = "";
  let problem = "";
  let owner = "Founder";
  let sourceUrl = "";
  let prompt = "";
  let force = false;
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--title") {
      title = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--goal") {
      goal = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--audience") {
      audience = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--offer") {
      offer = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--signal") {
      signal = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--problem") {
      problem = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--owner") {
      owner = args[index + 1] ?? owner;
      index += 1;
      continue;
    }

    if (arg === "--source-url") {
      sourceUrl = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--prompt") {
      prompt = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--force") {
      force = true;
      continue;
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (!slug) {
      slug = arg;
    }
  }

  const normalizedPrompt = normalizeSentence(prompt);
  const hasPrompt = Boolean(normalizedPrompt);
  const hasExplicitCore =
    Boolean(goal.trim()) &&
    Boolean(audience.trim()) &&
    Boolean(offer.trim()) &&
    Boolean(signal.trim());

  if (!slug || (!hasPrompt && !hasExplicitCore)) {
    throw new Error(
      'Usage: pnpm mvp:new <slug> (--prompt "..." | --goal "..." --audience "..." --offer "..." --signal "...") [--title "..."] [--problem "..."] [--owner "..."] [--source-url "https://..."] [--force] [--dry-run]',
    );
  }

  return {
    slug: normalizeSlug(slug),
    title: normalizeSentence(title),
    goal: normalizeSentence(goal),
    audience: normalizeSentence(audience),
    offer: normalizeSentence(offer),
    signal: normalizeSentence(signal),
    problem: normalizeSentence(problem),
    owner: owner.trim() || "Founder",
    sourceUrl,
    prompt: normalizedPrompt,
    force,
    dryRun,
  };
}

function resolveStarterOptions(options) {
  const inferenceSeed = options.prompt || options.offer || options.title || options.goal || options.slug;
  const inference = inferStarterFromText({
    slug: options.slug,
    text: inferenceSeed,
    prompt: options.prompt,
  });

  const goal = options.goal || inference.goal;
  const audience = options.audience || inference.audience;
  const offer = options.offer || inference.offer;
  const signal = options.signal || inference.signal;
  const problem = options.problem || inference.problem;
  const title =
    options.title ||
    (options.prompt ? inference.title : toTitleCase(options.slug));
  const starterSummary = buildStarterSummary({
    ...inference,
    title,
    goal,
    audience,
    offer,
    signal,
    problem,
    prompt: options.prompt,
  });

  return {
    ...options,
    title,
    goal,
    audience,
    offer,
    signal,
    problem,
    starterSummary,
  };
}

function inferStarterFromText({ slug, text, prompt }) {
  const normalizedText = normalizeForMatch(text);
  const recipeMatch = selectRecipe(normalizedText);
  const topic = extractPromptTopic(prompt || text) || toTitleCase(slug);
  const subject = buildSubjectLabel(topic);
  const targetOutcome = extractGoalHint(prompt || text);
  const audienceHint = extractAudienceHint(prompt || text);
  const recipe = recipeMatch.recipe;
  const title = buildPromptTitle(topic, slug);
  const goal = recipe.buildGoal({ subject, targetOutcome });
  const audience = audienceHint || recipe.buildAudience({ subject });
  const offer = recipe.buildOffer({ subject, topic });
  const signal = recipe.buildSignal({ subject, topic });
  const problem = recipe.buildProblem({ subject, audience, topic });

  return {
    recipe,
    topic,
    subject,
    title,
    goal,
    audience,
    offer,
    signal,
    problem,
    recipeReason: recipeMatch.reason,
    recipeConfidence: recipeMatch.confidence,
    matchedKeywords: recipeMatch.matchedKeywords,
    audienceWasInferred: !audienceHint,
    signalWasInferred: true,
    targetOutcomeWasInferred: !targetOutcome,
  };
}

function buildStarterSummary(inference) {
  const {
    recipe,
    topic,
    subject,
    title,
    goal,
    audience,
    offer,
    signal,
    problem,
    prompt,
    recipeReason,
    recipeConfidence,
    matchedKeywords,
    audienceWasInferred,
    signalWasInferred,
    targetOutcomeWasInferred,
  } = inference;
  const activeFlows = recipe.activeFlowIds.map((flowId) => FLOW_CATALOG[flowId].label);
  const dependencies = uniqueItems([
    "apps/web/src/lib/product-config.ts",
    ...recipe.activeFlowIds.map((flowId) => FLOW_CATALOG[flowId].dependencyPath),
    "packages/core/*",
    "packages/db/*",
    "packages/analytics/*",
  ]);
  const inScope = recipe.activeFlowIds.map((flowId) =>
    FLOW_CATALOG[flowId].scopeLine(offer),
  );
  const outOfScope = [
    ...recipe.deferredItems.map((item) => `${item}는 이번 첫 MVP에서 제외한다.`),
    "복수 제품/복수 플랜 운영",
    "정교한 CRM 자동화",
    "완성형 고객 지원 시스템",
    "heavy customization without measurement",
  ];
  const acceptanceCriteria = buildAcceptanceCriteria({
    audience,
    offer,
    recipe,
  });
  const analyticsImpact = buildAnalyticsImpact(recipe);
  const dataImpact = buildDataImpact(recipe);
  const testabilityNotes = buildTestabilityNotes(recipe);
  const openQuestions = uniqueItems([
    ...recipe.openQuestions,
    ...(recipeConfidence === "low"
      ? [
          "Recipe inference confidence가 낮아 primary flow를 사람이 한 번 더 확인해야 한다.",
        ]
      : []),
    ...(audienceWasInferred
      ? ["Target user가 prompt에서 명확하지 않아 generic default를 사용했다."]
      : []),
    ...(signalWasInferred
      ? ["Success metric threshold는 recipe default를 사용했으므로 실제 사업 기준으로 보정이 필요할 수 있다."]
      : []),
    ...(targetOutcomeWasInferred
      ? ["최종 비즈니스 목표가 prompt에서 명시되지 않아 recipe 기본 goal을 사용했다."]
      : []),
  ]);
  const productConfigStarter = {
    appName: title,
    heroAngle: recipe.heroAngle,
    primaryCta: recipe.primaryCta,
    trustThemes: recipe.trustThemes,
    primaryMetrics: recipe.adminMetrics,
  };

  return {
    recipeId: recipe.id,
    recipeReason,
    recipeConfidence,
    matchedKeywords,
    topic,
    subject,
    prompt,
    routes: recipe.routes,
    primaryModule: recipe.primaryModule,
    activeFlowIds: recipe.activeFlowIds,
    activeFlows,
    deferredFlows: recipe.deferredItems,
    primaryCta: recipe.primaryCta,
    keyMetrics: recipe.adminMetrics,
    keyEvents: recipe.keyEvents,
    trustThemes: recipe.trustThemes,
    featureSummary: recipe.buildFeatureSummary({ offer, goal, recipe }),
    userValue: recipe.buildUserValue({ audience, offer, recipe }),
    inScope,
    outOfScope,
    acceptanceCriteria,
    analyticsImpact,
    dataImpact,
    testabilityNotes,
    openQuestions,
    dependencies,
    productConfigStarter,
    paymentRequired: recipe.paymentRequired,
    problem,
    signal,
  };
}

function renderMvpPrd({
  slug,
  title,
  goal,
  audience,
  offer,
  signal,
  problem,
  owner,
  sourceUrl,
  createdAt,
  starterSummary,
}) {
  const featureCandidateTitle = toTitleCase(slug);
  const historyLine = `| ${createdAt} | created | Initial PRD created via \`pnpm mvp:new\`. | ${owner} |`;
  const deferredFlowsText = starterSummary.deferredFlows.join(", ");
  const activeFlowsText = starterSummary.activeFlows.join(", ");
  const adminMetricsText = starterSummary.keyMetrics.join(", ");
  const keyEventsText = starterSummary.keyEvents.join(", ");
  const trustThemesText = starterSummary.trustThemes.join(", ");

  return [
    "---",
    `title: ${JSON.stringify(title)}`,
    'status: "draft"',
    `owner: ${JSON.stringify(owner)}`,
    `source_url: ${JSON.stringify(sourceUrl)}`,
    `created_at: ${JSON.stringify(createdAt)}`,
    `updated_at: ${JSON.stringify(createdAt)}`,
    "---",
    "",
    "# PRD",
    "",
    ...(starterSummary.prompt
      ? [
          "## Source Prompt",
          "",
          `- ${starterSummary.prompt}`,
          "",
        ]
      : []),
    "## MVP Setup",
    "",
    `- recipe: ${starterSummary.recipeId}`,
    `- recipe_reason: ${starterSummary.recipeReason}`,
    `- active_flows: ${activeFlowsText}`,
    `- deferred_flows: ${deferredFlowsText}`,
    `- primary_cta: ${starterSummary.primaryCta}`,
    `- admin_metrics: ${adminMetricsText}`,
    `- key_events: ${keyEventsText}`,
    "",
    "## Problem",
    "",
    `- ${problem}`,
    "",
    "## Goal",
    "",
    `- ${goal}`,
    "",
    "## Constraints",
    "",
    "- 단일 `apps/web` 구조와 existing product modules를 우선 사용한다.",
    "- 새 MVP는 `apps/web/src/lib/product-config.ts`에서 user-facing copy를 먼저 정리한다.",
    "- 첫 릴리스는 한 개의 measurable user flow에 집중한다.",
    "- 복잡한 auth, CMS, background jobs, heavy design system은 이번 범위에서 제외한다.",
    "",
    "## Non-Goals",
    "",
    ...starterSummary.outOfScope.map((item) => `- ${item}`),
    "",
    "## Target User",
    "",
    audience,
    "",
    "## Core Use Cases",
    "",
    "### Primary",
    "",
    `- 상황: ${audience}가 ${offer}와 관련된 문제를 해결하려고 첫 비교나 탐색을 시작한 상태다.`,
    `- 사용자 행동: 사용자가 \`/\`에서 가치를 이해하고 \`${starterSummary.primaryCta}\` CTA를 통해 핵심 흐름으로 진입한다.`,
    `- 기대 결과: 사용자는 빠르게 신뢰를 얻고 다음 행동을 남길 수 있으며, 운영자는 후속 액션 근거를 확보한다.`,
    "",
    "### Secondary",
    "",
    "- 상황: 운영자는 들어온 신호 중 우선 대응할 대상을 골라야 한다.",
    "- 사용자 행동: 운영자가 `/admin`에서 핵심 제출 데이터와 이벤트를 확인한다.",
    "- 기대 결과: 운영자는 어떤 메시지와 어떤 흐름이 실제 전환 가능성이 높은지 해석할 수 있다.",
    "",
    "## Jobs To Be Done",
    "",
    `- ${audience}는 ${offer}의 가치를 짧은 시간 안에 이해하고 싶다.`,
    `- ${audience}는 긴 설명 없이 자신의 상황을 남기고 후속 안내를 받고 싶다.`,
    "- 운영자는 어떤 유입과 어떤 메시지가 실제 상담 가능성이나 구매 의사로 이어지는지 알고 싶다.",
    "",
    "## Success Metric",
    "",
    `- ${signal}`,
    `- ${adminMetricsText}`,
    "- Stop signal과 pivot signal은 PRD 리뷰 중 추가로 명시한다.",
    "",
    "## Scope",
    "",
    "### In Scope",
    "",
    ...starterSummary.inScope.map((item) => `- ${item}`),
    "",
    "### Out Of Scope",
    "",
    ...starterSummary.outOfScope.map((item) => `- ${item}`),
    "",
    "## Product Config Starter",
    "",
    `- app_name: ${starterSummary.productConfigStarter.appName}`,
    `- hero_angle: ${starterSummary.productConfigStarter.heroAngle}`,
    `- primary_cta: ${starterSummary.productConfigStarter.primaryCta}`,
    `- trust_signal_themes: ${trustThemesText}`,
    `- primary_metrics: ${adminMetricsText}`,
    "",
    "## Feature Candidates",
    "",
    `### ${featureCandidateTitle}`,
    "",
    `- summary: ${starterSummary.featureSummary}`,
    `- user_value: ${starterSummary.userValue}`,
    `- primary_module: ${starterSummary.primaryModule}`,
    `- routes: ${starterSummary.routes.join(",")}`,
    "- ui_surface: yes",
    "- admin_surface: yes",
    "- backend_changes: yes",
    "- auth_required: no",
    `- payment_required: ${starterSummary.paymentRequired ? "yes" : "no"}`,
    "- external_provider_impact: none",
    "- analytics_required: yes",
    "- recommended: yes",
    "",
    "## Testability Notes",
    "",
    ...starterSummary.testabilityNotes.map((item) => `- ${item}`),
    "",
    "## Acceptance Criteria",
    "",
    ...starterSummary.acceptanceCriteria.map((item) => `- [ ] ${item}`),
    "",
    "Acceptance Criteria 작성 규칙:",
    "",
    "구현 디테일이 아니라 public behavior 기준으로 적습니다.",
    "구현자가 추가 해석 없이 테스트 가능한 문장으로 적습니다.",
    "중요한 작업이면 어떤 기준을 먼저 failing test로 고정할지 PRD 단계에서 힌트를 남깁니다.",
    "",
    "## Analytics Impact",
    "",
    ...starterSummary.analyticsImpact.map((item) => `- ${item}`),
    "",
    "## Data Impact",
    "",
    ...starterSummary.dataImpact.map((item) => `- ${item}`),
    "",
    "## Dependencies",
    "",
    ...starterSummary.dependencies.map((item) => `- ${item}`),
    "",
    "## Open Questions",
    "",
    ...starterSummary.openQuestions.map((item) => `- ${item}`),
    "",
    "## Document History",
    "",
    "| 날짜 | 유형 | 요약 | 작성자 |",
    "| --- | --- | --- | --- |",
    historyLine,
    "",
    "History 규칙:",
    "",
    "- PRD 생성 시 `created` 행을 남깁니다.",
    "- 의미 있는 수정이 있을 때마다 새 행을 추가합니다.",
    "- 기존 행을 덮어쓰지 않고 이어서 추가합니다.",
    "- 최신 변경이 항상 최하단에 오게 합니다.",
    "",
  ].join("\n");
}

function renderSetupSummaryLines(starterSummary) {
  return [
    `- Recipe: ${starterSummary.recipeId}`,
    `- Recipe reason: ${starterSummary.recipeReason}`,
    `- Active flows: ${starterSummary.activeFlows.join(", ")}`,
    `- Deferred flows: ${starterSummary.deferredFlows.join(", ")}`,
    `- Primary CTA: ${starterSummary.primaryCta}`,
    `- Key metrics: ${starterSummary.keyMetrics.join(", ")}`,
  ];
}

function buildAcceptanceCriteria({ audience, offer, recipe }) {
  const items = [
    `${audience}가 \`/\`에서 ${offer}의 가치를 이해하고 다음 행동 CTA를 찾을 수 있다.`,
  ];

  if (recipe.activeFlowIds.includes("payment")) {
    items.push(
      "사용자가 payment intent 또는 checkout 시작까지 이어지면 운영자가 stronger intent signal을 확인할 수 있다.",
    );
  } else if (recipe.activeFlowIds.includes("consultation")) {
    items.push(
      "사용자가 핵심 정보를 남기고 consultation 요청까지 이어가면 운영자가 후속 액션을 시작할 수 있다.",
    );
  } else {
    items.push(
      "사용자가 핵심 정보를 남기면 성공 상태를 보고 운영자가 후속 액션을 시작할 수 있다.",
    );
  }

  items.push(
    "운영자가 `/admin` 또는 동등한 운영 surface에서 핵심 신호를 해석할 수 있다.",
  );
  items.push(
    `핵심 CTA와 ${recipe.keyEvents.join(", ")} signal이 analytics에 남는다.`,
  );

  return items;
}

function buildAnalyticsImpact(recipe) {
  const items = [
    "`cta_clicked`에 entry point와 recipe context를 남긴다.",
  ];

  if (recipe.activeFlowIds.includes("lead")) {
    items.push(
      "`lead_form_submitted` 또는 동등한 intake event에 제출 맥락과 유입 정보를 남긴다.",
    );
  }

  if (recipe.activeFlowIds.includes("consultation")) {
    items.push(
      "`consultation_requested`에 qualification context를 남긴다.",
    );
  }

  if (recipe.activeFlowIds.includes("payment")) {
    items.push(
      "`payment_checkout_started`와 필요 시 `payment_completed`를 구분 가능하게 남긴다.",
    );
  }

  items.push(
    "운영자가 funnel drop-off를 해석할 수 있는 최소 event context를 유지한다.",
  );

  return items;
}

function buildDataImpact(recipe) {
  const items = [];

  if (recipe.activeFlowIds.includes("lead")) {
    items.push(
      "lead 또는 intake 저장 구조에 핵심 문제 맥락과 연락 수단이 남아야 한다.",
    );
  }

  if (recipe.activeFlowIds.includes("consultation")) {
    items.push(
      "consultation flow가 lead context를 이어받거나 연결 가능한 구조여야 한다.",
    );
  }

  if (recipe.activeFlowIds.includes("payment")) {
    items.push(
      "payment intent 또는 checkout 시작 시도에 offer context와 핵심 메타데이터가 남아야 한다.",
    );
  }

  items.push("local fallback과 mock seed도 새 흐름을 설명할 수 있어야 한다.");
  items.push("admin summary에서 primary signal을 해석할 수 있어야 한다.");

  return items;
}

function buildTestabilityNotes(recipe) {
  const items = [];

  if (recipe.activeFlowIds.includes("payment")) {
    items.push(
      "첫 failing test는 payment intent가 기대한 payload와 함께 시작되는지로 잡는다.",
    );
  } else if (recipe.activeFlowIds.includes("consultation")) {
    items.push(
      "첫 failing test는 핵심 intake 또는 consultation submission이 기대한 데이터와 함께 저장되는지로 잡는다.",
    );
  } else {
    items.push(
      "첫 failing test는 핵심 lead submission이 기대한 데이터와 함께 저장되는지로 잡는다.",
    );
  }

  items.push(
    `다음 slice는 ${recipe.activeFlowIds
      .map((flowId) => FLOW_CATALOG[flowId].label)
      .join(" -> ")} 순서로 자른다.`,
  );
  items.push(
    "browser QA에서는 hero, CTA hierarchy, form 또는 payment state, responsive layout을 확인한다.",
  );

  return items;
}

function selectRecipe(normalizedText) {
  const scores = RECIPE_CATALOG.map((recipe) => {
    const matchedKeywords = recipe.keywords.filter((keyword) =>
      normalizedText.includes(keyword.toLowerCase()),
    );
    const score = matchedKeywords.reduce(
      (total, keyword) => total + (keyword.length >= 4 ? 2 : 1),
      0,
    );

    return {
      recipe,
      score,
      matchedKeywords,
    };
  }).sort((left, right) => right.score - left.score);

  const best = scores[0];
  const second = scores[1];

  if (!best || best.score === 0) {
    return {
      recipe: RECIPE_CATALOG.find((recipe) => recipe.id === "lead-gen"),
      confidence: "low",
      matchedKeywords: [],
      reason:
        "No strong recipe keyword was found, so the generic lead-gen starter was selected.",
    };
  }

  const confidence =
    best.score >= 4 && (!second || best.score - second.score >= 2)
      ? "high"
      : "medium";
  const matchedText =
    best.matchedKeywords.length > 0
      ? `matched keywords: ${best.matchedKeywords.join(", ")}`
      : "best keyword match";

  return {
    recipe: best.recipe,
    confidence,
    matchedKeywords: best.matchedKeywords,
    reason: `${best.recipe.id} selected from ${matchedText}.`,
  };
}

function extractPromptTopic(value) {
  const text = normalizeSentence(value);

  if (!text) {
    return "";
  }

  const cleaned = text.replace(
    /^(?:나는|저는|우리는|서비스는|제품은|프로덕트는)\s+/u,
    "",
  );
  const productPatterns = [
    /(.+?(?:사이트|서비스|앱|플랫폼|툴))(?:를|을)?\s*(?:만들고 싶|만들려|만들고자|기획하고 싶|기획하려|준비하고 싶|하려고)/u,
    /(.+?(?:사이트|서비스|앱|플랫폼|툴))(?:이고|이며|인데)/u,
  ];

  for (const pattern of productPatterns) {
    const match = cleaned.match(pattern);

    if (match?.[1]) {
      return tidyTopic(match[1]);
    }
  }

  const firstClause = cleaned.split(/(?:최종 목표|목표는|goal is|goal:|\.|,)/iu)[0];
  return tidyTopic(firstClause);
}

function tidyTopic(value) {
  return value
    .trim()
    .replace(/^["'“”]/u, "")
    .replace(/["'“”]$/u, "")
    .replace(/\s+/g, " ");
}

function buildSubjectLabel(topic) {
  const base = stripProductSuffix(topic);
  const actionPatterns = [
    /(.+?)\s*(?:을|를)\s*(?:비교해주는|비교하는|연결해주는|추천해주는|관리해주는|도와주는|모아주는)$/u,
    /(.+?)\s*(?:비교해주는|비교하는|연결해주는|추천해주는|관리해주는|도와주는|모아주는)$/u,
  ];

  for (const pattern of actionPatterns) {
    const match = base.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return base || "핵심 문제";
}

function stripProductSuffix(value) {
  return value
    .trim()
    .replace(/\s*(?:사이트|서비스|앱|플랫폼|툴)$/u, "")
    .trim();
}

function buildPromptTitle(topic, slug) {
  const cleaned = tidyTopic(topic);

  if (cleaned && cleaned.length <= 80) {
    return cleaned;
  }

  return toTitleCase(slug);
}

function extractGoalHint(value) {
  const text = normalizeSentence(value);
  const patterns = [
    /최종 목표는\s+(.+?)\s*(?:이|가)?\s*목표(?:야|입니다|이다|\.|,|$)/u,
    /목표는\s+(.+?)\s*(?:이|가)?\s*목표(?:야|입니다|이다|\.|,|$)/u,
    /최종 목표는\s+(.+?)(?:이야|야|입니다|이다|\.|,|$)/u,
    /목표는\s+(.+?)(?:이야|야|입니다|이다|\.|,|$)/u,
    /goal is\s+(.+?)(?:\.|,|$)/iu,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return normalizeGoalHint(match[1]);
    }
  }

  return "";
}

function normalizeGoalHint(value) {
  return value
    .trim()
    .replace(/\s*(?:게|거)$/u, " 것")
    .replace(/\s+/g, " ");
}

function extractAudienceHint(value) {
  const text = normalizeSentence(value);
  const patterns = [
    /(?:타겟|대상|주 고객)은\s+(.+?)(?:이야|야|입니다|이다|\.|,|$)/u,
    /for\s+(.+?)(?:\.|,|$)/iu,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function normalizeSlug(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("The MVP slug must contain at least one letter or number.");
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

function normalizeSentence(value) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeForMatch(value) {
  return value.trim().toLowerCase();
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
