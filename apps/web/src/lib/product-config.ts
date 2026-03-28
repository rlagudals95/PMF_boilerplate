type ProductHeroVariant = "control" | "benefit";

type ProductCopyItem = {
  title: string;
  description: string;
};

type NonEmptyList<T> = [T, ...T[]];

export type FlowId =
  | "landing"
  | "lead"
  | "consultation"
  | "payment"
  | "admin"
  | "auth";
export type MvpShape =
  | "lead-gen"
  | "consultation"
  | "comparison-routing"
  | "paid-intent"
  | "waitlist";
export type SurfaceExposure = "primary" | "hidden";
export type CapabilityMode = "off" | "optional" | "primary";
export type PrimaryRoute = "/" | "/consult" | "/pay";
export type AdminMetricKey =
  | "total_leads"
  | "qualified_leads"
  | "consult_requests"
  | "payment_attempts"
  | "paid_payments"
  | "tracked_events"
  | "active_products"
  | "active_experiments";

export const allFlowIds = [
  "landing",
  "lead",
  "consultation",
  "payment",
  "admin",
  "auth",
] as const satisfies readonly FlowId[];

export const shapeRequiredFlowMap = {
  "lead-gen": ["landing", "lead", "admin"],
  consultation: ["landing", "consultation", "admin"],
  "comparison-routing": ["landing", "lead", "consultation", "admin"],
  "paid-intent": ["landing", "payment", "admin"],
  waitlist: ["landing", "lead", "admin"],
} as const satisfies Record<MvpShape, readonly FlowId[]>;

type ProductHeroCopy = {
  title: string;
  emphasis: string;
  description: string;
  badge: string;
};

export type ProductConfig = {
  appName: string;
  primaryProduct: string;
  description: string;
  mvp: {
    shape: MvpShape;
    activeFlows: NonEmptyList<FlowId>;
    deferredFlows: FlowId[];
    primaryRoute: PrimaryRoute;
    primaryCta: {
      label: string;
      href: string;
    };
    navExposure: Record<FlowId, SurfaceExposure>;
    capabilities: {
      auth: CapabilityMode;
      payment: CapabilityMode;
    };
    admin: {
      highlightedMetrics: NonEmptyList<AdminMetricKey>;
    };
  };
  site: {
    mark: string;
    headerTitle: string;
    headerDescription: string;
    footerDescription: string;
    headerPrimaryCtaLabel: string;
  };
  landing: {
    productBadge: string;
    heroVariants: Record<ProductHeroVariant, ProductHeroCopy>;
    heroHighlights: NonEmptyList<ProductCopyItem>;
  };
  leadForm: {
    cardTitle: string;
    description: string;
    productInterestLabel: string;
    productInterestPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    consentLabel: string;
    submitLabel: string;
    pendingLabel: string;
  };
  consultation: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionDescription: string;
    benefitCards: NonEmptyList<ProductCopyItem>;
    formTitle: string;
    formDescription: string;
    productInterestLabel: string;
    productInterestPlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    timelineLabel: string;
    timelinePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    consentLabel: string;
    submitLabel: string;
    pendingLabel: string;
  };
  quality: {
    primaryGoal: string;
    trustSignals: NonEmptyList<string>;
    primaryMetrics: NonEmptyList<string>;
  };
};

function assertNonEmptyString(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertMinItems(
  items: readonly unknown[],
  minimum: number,
  label: string,
) {
  if (items.length < minimum) {
    throw new Error(`${label} must include at least ${minimum} items.`);
  }
}

function assertCopyItems(
  items: readonly ProductCopyItem[],
  minimum: number,
  label: string,
) {
  assertMinItems(items, minimum, label);

  for (const [index, item] of items.entries()) {
    assertNonEmptyString(item.title, `${label}[${index}].title`);
    assertNonEmptyString(item.description, `${label}[${index}].description`);
  }
}

function assertStringItems(
  items: readonly string[],
  minimum: number,
  label: string,
) {
  assertMinItems(items, minimum, label);

  for (const [index, item] of items.entries()) {
    assertNonEmptyString(item, `${label}[${index}]`);
  }
}

function normalizeFlowIds(flows: readonly FlowId[]) {
  return [...new Set(flows)].sort();
}

function resolveHrefFlowId(href: string): FlowId | null {
  if (href.startsWith("/consult")) {
    return "consultation";
  }

  if (href.startsWith("/pay")) {
    return "payment";
  }

  if (href.startsWith("/auth")) {
    return "auth";
  }

  if (href.startsWith("/admin")) {
    return "admin";
  }

  if (href === "/#live-form") {
    return "lead";
  }

  if (href === "/" || href.startsWith("/#")) {
    return "landing";
  }

  return null;
}

export function validateProductConfig(config: ProductConfig) {
  assertNonEmptyString(config.appName, "appName");
  assertNonEmptyString(config.primaryProduct, "primaryProduct");
  assertNonEmptyString(config.description, "description");
  assertNonEmptyString(config.mvp.primaryCta.label, "mvp.primaryCta.label");
  assertNonEmptyString(config.mvp.primaryCta.href, "mvp.primaryCta.href");
  assertNonEmptyString(config.site.mark, "site.mark");
  assertNonEmptyString(config.site.headerTitle, "site.headerTitle");
  assertNonEmptyString(config.site.headerDescription, "site.headerDescription");
  assertNonEmptyString(config.site.footerDescription, "site.footerDescription");
  assertNonEmptyString(
    config.site.headerPrimaryCtaLabel,
    "site.headerPrimaryCtaLabel",
  );
  assertNonEmptyString(config.landing.productBadge, "landing.productBadge");

  for (const [variant, heroCopy] of Object.entries(
    config.landing.heroVariants,
  )) {
    assertNonEmptyString(
      heroCopy.title,
      `landing.heroVariants.${variant}.title`,
    );
    assertNonEmptyString(
      heroCopy.emphasis,
      `landing.heroVariants.${variant}.emphasis`,
    );
    assertNonEmptyString(
      heroCopy.description,
      `landing.heroVariants.${variant}.description`,
    );
    assertNonEmptyString(
      heroCopy.badge,
      `landing.heroVariants.${variant}.badge`,
    );
  }

  assertCopyItems(config.landing.heroHighlights, 3, "landing.heroHighlights");

  assertNonEmptyString(config.leadForm.cardTitle, "leadForm.cardTitle");
  assertNonEmptyString(config.leadForm.description, "leadForm.description");
  assertNonEmptyString(
    config.leadForm.productInterestLabel,
    "leadForm.productInterestLabel",
  );
  assertNonEmptyString(
    config.leadForm.productInterestPlaceholder,
    "leadForm.productInterestPlaceholder",
  );
  assertNonEmptyString(config.leadForm.messageLabel, "leadForm.messageLabel");
  assertNonEmptyString(
    config.leadForm.messagePlaceholder,
    "leadForm.messagePlaceholder",
  );
  assertNonEmptyString(config.leadForm.consentLabel, "leadForm.consentLabel");
  assertNonEmptyString(config.leadForm.submitLabel, "leadForm.submitLabel");
  assertNonEmptyString(config.leadForm.pendingLabel, "leadForm.pendingLabel");

  assertNonEmptyString(
    config.consultation.sectionEyebrow,
    "consultation.sectionEyebrow",
  );
  assertNonEmptyString(
    config.consultation.sectionTitle,
    "consultation.sectionTitle",
  );
  assertNonEmptyString(
    config.consultation.sectionDescription,
    "consultation.sectionDescription",
  );
  assertCopyItems(
    config.consultation.benefitCards,
    3,
    "consultation.benefitCards",
  );
  assertNonEmptyString(config.consultation.formTitle, "consultation.formTitle");
  assertNonEmptyString(
    config.consultation.formDescription,
    "consultation.formDescription",
  );
  assertNonEmptyString(
    config.consultation.productInterestLabel,
    "consultation.productInterestLabel",
  );
  assertNonEmptyString(
    config.consultation.productInterestPlaceholder,
    "consultation.productInterestPlaceholder",
  );
  assertNonEmptyString(
    config.consultation.budgetLabel,
    "consultation.budgetLabel",
  );
  assertNonEmptyString(
    config.consultation.budgetPlaceholder,
    "consultation.budgetPlaceholder",
  );
  assertNonEmptyString(
    config.consultation.timelineLabel,
    "consultation.timelineLabel",
  );
  assertNonEmptyString(
    config.consultation.timelinePlaceholder,
    "consultation.timelinePlaceholder",
  );
  assertNonEmptyString(
    config.consultation.notesLabel,
    "consultation.notesLabel",
  );
  assertNonEmptyString(
    config.consultation.notesPlaceholder,
    "consultation.notesPlaceholder",
  );
  assertNonEmptyString(
    config.consultation.consentLabel,
    "consultation.consentLabel",
  );
  assertNonEmptyString(
    config.consultation.submitLabel,
    "consultation.submitLabel",
  );
  assertNonEmptyString(
    config.consultation.pendingLabel,
    "consultation.pendingLabel",
  );

  assertNonEmptyString(config.quality.primaryGoal, "quality.primaryGoal");
  assertStringItems(config.quality.trustSignals, 3, "quality.trustSignals");
  assertStringItems(config.quality.primaryMetrics, 2, "quality.primaryMetrics");
  assertMinItems(
    config.mvp.activeFlows,
    1,
    "mvp.activeFlows",
  );
  assertStringItems(
    config.mvp.admin.highlightedMetrics,
    2,
    "mvp.admin.highlightedMetrics",
  );

  const expectedActiveFlows = normalizeFlowIds(shapeRequiredFlowMap[config.mvp.shape]);
  const activeFlows = normalizeFlowIds(config.mvp.activeFlows);
  const extraFlows = activeFlows.filter(
    (flowId) => !expectedActiveFlows.includes(flowId),
  );

  if (config.mvp.capabilities.auth === "off" && extraFlows.includes("auth")) {
    throw new Error(
      "mvp.activeFlows must not include auth when mvp.capabilities.auth is off.",
    );
  }

  if (config.mvp.capabilities.payment === "off" && extraFlows.includes("payment")) {
    throw new Error(
      "mvp.activeFlows must not include payment when mvp.capabilities.payment is off.",
    );
  }

  const allowedExtraFlows = extraFlows.filter((flowId) => {
    if (flowId === "auth") {
      return config.mvp.capabilities.auth !== "off";
    }

    if (flowId === "payment") {
      return config.mvp.capabilities.payment !== "off";
    }

    return false;
  });

  if (
    expectedActiveFlows.length + allowedExtraFlows.length !== activeFlows.length ||
    !expectedActiveFlows.every((flowId) => activeFlows.includes(flowId))
  ) {
    throw new Error(
      `mvp.activeFlows must match the ${config.mvp.shape} recipe plus optional auth/payment capability flows.`,
    );
  }

  const unresolvedFlows = allFlowIds.filter(
    (flowId) =>
      !config.mvp.activeFlows.includes(flowId) &&
      !config.mvp.deferredFlows.includes(flowId),
  );

  const overlappingFlows = config.mvp.deferredFlows.filter((flowId) =>
    config.mvp.activeFlows.includes(flowId),
  );

  if (unresolvedFlows.length > 0 || overlappingFlows.length > 0) {
    throw new Error(
      "mvp.deferredFlows must be a non-overlapping complement of mvp.activeFlows.",
    );
  }

  const primaryRouteFlowId = resolveHrefFlowId(config.mvp.primaryRoute);
  if (!primaryRouteFlowId || !config.mvp.activeFlows.includes(primaryRouteFlowId)) {
    throw new Error("mvp.primaryRoute must point to an active flow.");
  }

  const primaryCtaFlowId = resolveHrefFlowId(config.mvp.primaryCta.href);
  if (!primaryCtaFlowId || !config.mvp.activeFlows.includes(primaryCtaFlowId)) {
    throw new Error("mvp.primaryCta.href must point to an active flow.");
  }

  if (
    config.mvp.capabilities.auth === "primary" &&
    !config.mvp.activeFlows.includes("auth")
  ) {
    throw new Error(
      "mvp.capabilities.auth must be active when set to primary.",
    );
  }

  if (
    config.mvp.capabilities.payment === "primary" &&
    !config.mvp.activeFlows.includes("payment")
  ) {
    throw new Error(
      "mvp.capabilities.payment must be active when set to primary.",
    );
  }

  for (const flowId of allFlowIds) {
    if (
      config.mvp.navExposure[flowId] === "primary" &&
      !config.mvp.activeFlows.includes(flowId)
    ) {
      throw new Error(
        `mvp.navExposure.${flowId} must be hidden when the flow is not active.`,
      );
    }
  }

  if (config.mvp.navExposure.lead !== "hidden") {
    throw new Error("mvp.navExposure.lead must stay hidden because it has no standalone route.");
  }
}

function defineProductConfig(config: ProductConfig) {
  validateProductConfig(config);
  return config;
}

export const productConfig = defineProductConfig({
  appName: "PMF Boilerplate",
  primaryProduct: "PMF MVP Kit",
  description:
    "여러 사이드 프로젝트에서 PMF를 빠르게 탐색하기 위한 랜딩, 리드 캡처, 상담 요청, 실험 운영 기본 골격",
  mvp: {
    shape: "comparison-routing",
    activeFlows: ["landing", "lead", "consultation", "admin"],
    deferredFlows: ["payment", "auth"],
    primaryRoute: "/",
    primaryCta: {
      label: "핵심 정보 남기기",
      href: "/#live-form",
    },
    navExposure: {
      landing: "primary",
      lead: "hidden",
      consultation: "primary",
      payment: "hidden",
      admin: "primary",
      auth: "hidden",
    },
    capabilities: {
      auth: "off",
      payment: "off",
    },
    admin: {
      highlightedMetrics: [
        "qualified_leads",
        "consult_requests",
        "total_leads",
      ],
    },
  },
  site: {
    mark: "PK",
    headerTitle: "PMF MVP Kit",
    headerDescription: "범용 랜딩·리드·상담·운영 시스템",
    footerDescription:
      "비즈니스 요구를 빠르게 실험 가능한 랜딩·리드·상담 흐름으로 바꾸는 MVP 운영 시스템",
    headerPrimaryCtaLabel: "핵심 플로우 열기",
  },
  landing: {
    productBadge: "Generic MVP Starter",
    heroVariants: {
      control: {
        title: "새 MVP를 시작할 때 필요한 기본선이",
        emphasis: "한 앱 안에서 이미 연결돼 있습니다",
        description:
          "특정 업종에 묶이지 않고, 랜딩, 리드, 상담, 결제 의사 신호, 운영 리뷰를 빠르게 이어 붙여야 하는 제품이 코드 구조보다 먼저 검증 루프를 돌릴 수 있게 설계했습니다.",
        badge: "Hero Copy: control",
      },
      benefit: {
        title: "비즈니스 요구를 받으면",
        emphasis: "즉시 실험 가능한 제품 흐름으로 압축합니다",
        description:
          "비개발자도 goal packet과 product config를 기준으로 copy, 신뢰 요소, 폼 문구를 정리하고 AI와 함께 빠르게 실제 MVP를 만들 수 있도록 돕는 starter입니다.",
        badge: "Hero Copy: benefit",
      },
    },
    heroHighlights: [
      {
        title: "비즈니스 요구에서 바로 출발",
        description:
          "목표, 타깃, 신호를 먼저 고정하고 화면은 그 뒤에 맞춥니다.",
      },
      {
        title: "비개발자도 바꿀 수 있는 copy surface",
        description:
          "제품 카피와 폼 문구를 한 곳에서 관리하도록 구조를 정리합니다.",
      },
      {
        title: "실험에 필요한 운영 기본선",
        description:
          "리드, 상담, 결제, 어드민, 추적까지 한 번에 검증할 수 있습니다.",
      },
      {
        title: "품질 게이트 포함",
        description:
          "문서, 테스트, 브라우저 QA를 빠르게 닫는 흐름을 기본값으로 둡니다.",
      },
    ],
  },
  leadForm: {
    cardTitle: "빠른 문의 접수",
    description:
      "어떤 제품이 필요한지와 연락 가능 정보만 남기면, 운영자가 바로 후속 상담 우선순위를 잡을 수 있습니다.",
    productInterestLabel: "관심 영역",
    productInterestPlaceholder: "예: AI 자동화, 고객 관리, 내부 운영 도구",
    messageLabel: "추가 메모",
    messagePlaceholder:
      "현재 문제, 도입 희망 시점, 예산, 원하는 후속 연락 방식을 남겨 주세요.",
    consentLabel: "개인정보 수집 및 후속 연락에 동의합니다.",
    submitLabel: "문의 남기기",
    pendingLabel: "접수 중...",
  },
  consultation: {
    sectionEyebrow: "Consult flow",
    sectionTitle: "실제 도입 의사를 확인하는 상담 요청 폼",
    sectionDescription:
      "단순 관심 리드보다 한 단계 더 강한 신호가 필요한 제품은 별도 상담 흐름이 있어야 운영 우선순위와 전환 가능성을 더 정확히 읽을 수 있습니다.",
    benefitCards: [
      {
        title: "상담 선호 채널 수집",
        description:
          "전화, 카카오, 방문, 이메일 중 실제 선호 접점을 확인합니다.",
      },
      {
        title: "도입 시점 파악",
        description:
          "희망 일정과 검토 타임라인을 모아 지금 해결이 필요한 문제인지 구분합니다.",
      },
      {
        title: "후속 상담 우선순위 정리",
        description:
          "예산과 상세 요구를 함께 받아 운영자가 빠르게 다음 액션을 정합니다.",
      },
    ],
    formTitle: "상담 요청",
    formDescription:
      "예산, 선호 채널, 세부 요구사항까지 함께 받아 실제 상담 가능성이 높은 리드를 구분합니다.",
    productInterestLabel: "상담 주제",
    productInterestPlaceholder: "고객 문의 자동화",
    budgetLabel: "예산 범위",
    budgetPlaceholder: "월 10-30만원 / 프로젝트 300-500만원",
    timelineLabel: "도입 희망 시점",
    timelinePlaceholder: "이번 달 / 다음 분기",
    notesLabel: "상세 요구사항",
    notesPlaceholder:
      "현재 운영 방식, 팀 규모, 원하는 결과, 연락 가능 시간 등을 남겨 주세요.",
    consentLabel: "상담 진행을 위한 개인정보 수집 및 연락에 동의합니다.",
    submitLabel: "상담 요청 보내기",
    pendingLabel: "상담 요청 중...",
  },
  quality: {
    primaryGoal: "비즈니스 요구를 실험 가능한 MVP 흐름으로 빠르게 압축한다.",
    trustSignals: [
      "문제와 대상 사용자가 분리된 goal packet",
      "랜딩과 폼 문구가 제품 도메인과 맞아야 한다",
      "운영자가 admin과 analytics로 결과를 해석할 수 있어야 한다",
    ],
    primaryMetrics: [
      "landing_to_lead_conversion",
      "lead_to_consult_request_rate",
      "qualified_lead_rate",
    ],
  },
});
