import type { summarizePipeline } from "@pmf/core";

import type { AppConfig } from "./app-config";
import type {
  AdminMetricKey,
  CapabilityMode,
  FlowId,
  ProductConfig,
} from "./product-config";

type DashboardMetrics = ReturnType<typeof summarizePipeline>;
type CapabilityId = keyof ProductConfig["mvp"]["capabilities"];
type DirectRouteFlowId = Exclude<FlowId, "lead">;

export type LandingPrimaryAction = {
  label: string;
  href: string;
  variant: "default" | "outline" | "secondary";
  setupRequired: boolean;
};

export type VisibleNavItem = {
  flowId: DirectRouteFlowId;
  label: string;
  href: string;
  setupRequired: boolean;
};

export type RuntimeEntry = {
  flowId: DirectRouteFlowId;
  title: string;
  description: string;
  href: string;
  cta: string;
  setupRequired: boolean;
};

export type StarterSnapshotItem = {
  label: string;
  value: string;
};

export type AdminMetricCardModel = {
  key: AdminMetricKey;
  title: string;
  description: string;
  value: number;
  emphasis: "primary" | "secondary";
};

export type CapabilityState = {
  mode: CapabilityMode;
  status: "hidden" | "ready" | "setup-required";
  setupRequired: boolean;
  requiredEnvVars: string[];
};

const directFlowHrefMap: Record<DirectRouteFlowId, string> = {
  landing: "/",
  consultation: "/consult",
  payment: "/pay",
  admin: "/admin",
  auth: "/auth",
};

const navLabels: Record<DirectRouteFlowId, string> = {
  landing: "랜딩",
  consultation: "상담 요청",
  payment: "결제 데모",
  admin: "어드민",
  auth: "소셜 로그인",
};

const runtimeEntryMeta: Record<
  DirectRouteFlowId,
  { title: string; description: string; cta: string }
> = {
  landing: {
    title: "랜딩 + CTA 추적",
    description:
      "히어로, 신뢰 요소, tracked CTA와 라이브 리드 섹션이 이미 연결돼 있습니다.",
    cta: "랜딩 보기",
  },
  consultation: {
    title: "상담 요청 플로우",
    description:
      "예산, 일정, 선호 채널까지 포함한 더 강한 신호 수집 화면이 준비돼 있습니다.",
    cta: "상담 플로우 열기",
  },
  payment: {
    title: "결제 의사 플로우",
    description:
      "서버에서 결제를 생성하고 stronger intent signal을 저장하는 결제 데모입니다.",
    cta: "결제 플로우 열기",
  },
  admin: {
    title: "어드민 운영 화면",
    description:
      "리드, 상담, 결제, 이벤트 데이터를 한 화면에서 해석할 수 있습니다.",
    cta: "어드민 열기",
  },
  auth: {
    title: "소셜 로그인 starter",
    description:
      "Google, Kakao, Naver starter 중 필요한 provider만 붙여 검증할 수 있습니다.",
    cta: "Auth starter 열기",
  },
};

const adminMetricDefinitions: Array<{
  key: AdminMetricKey;
  title: string;
  description: string;
  select: (metrics: DashboardMetrics) => number;
  flowId?: FlowId;
}> = [
  {
    key: "qualified_leads",
    title: "Qualified leads",
    description: "후속 액션이 가능한 리드",
    select: (metrics) => metrics.qualifiedLeads,
    flowId: "lead",
  },
  {
    key: "consult_requests",
    title: "Consult requests",
    description: "강한 의사 신호로 볼 수 있는 상담 요청 수",
    select: (metrics) => metrics.totalConsultations,
    flowId: "consultation",
  },
  {
    key: "payment_attempts",
    title: "Payments",
    description: "결제 생성부터 완료까지 저장된 결제 시도 수",
    select: (metrics) => metrics.totalPayments,
    flowId: "payment",
  },
  {
    key: "paid_payments",
    title: "Paid payments",
    description: "최종 완료 상태로 동기화된 결제 수",
    select: (metrics) => metrics.paidPayments,
    flowId: "payment",
  },
  {
    key: "total_leads",
    title: "Total leads",
    description: "랜딩/상담 흐름을 통해 누적된 전체 리드",
    select: (metrics) => metrics.totalLeads,
    flowId: "lead",
  },
  {
    key: "tracked_events",
    title: "Tracked events",
    description: "폼 제출과 핵심 페이지 이벤트 누적치",
    select: (metrics) => metrics.trackedEvents,
  },
  {
    key: "active_products",
    title: "Active products",
    description: "현재 운영 중인 제품 수",
    select: (metrics) => metrics.activeProducts,
  },
  {
    key: "active_experiments",
    title: "Active experiments",
    description: "실행 중인 실험 수",
    select: (metrics) => metrics.activeExperiments,
  },
];

const capabilityEnvVars: Record<CapabilityId, string[]> = {
  auth: [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_AUTH_GOOGLE_ENABLED or NEXT_PUBLIC_AUTH_KAKAO_ENABLED",
  ],
  payment: ["TOSS_PAYMENTS_API_KEY", "NEXT_PUBLIC_SITE_URL"],
};

function isCapabilityReady(capability: CapabilityId, appConfig: AppConfig) {
  if (capability === "auth") {
    return appConfig.authProviders.length > 0;
  }

  return appConfig.paymentProviders.length > 0;
}

function isFlowVisible(config: ProductConfig, flowId: FlowId) {
  return (
    config.mvp.activeFlows.includes(flowId) &&
    config.mvp.navExposure[flowId] === "primary"
  );
}

function formatFlowLabel(flowId: FlowId) {
  switch (flowId) {
    case "landing":
      return "landing";
    case "lead":
      return "lead capture";
    case "consultation":
      return "consultation";
    case "payment":
      return "payment";
    case "admin":
      return "admin";
    case "auth":
      return "auth";
  }
}

export function getCapabilityState(
  capability: CapabilityId,
  config: ProductConfig,
  appConfig: AppConfig,
): CapabilityState {
  const mode = config.mvp.capabilities[capability];

  if (mode === "off") {
    return {
      mode,
      status: "hidden",
      setupRequired: false,
      requiredEnvVars: [],
    };
  }

  const ready = isCapabilityReady(capability, appConfig);
  return {
    mode,
    status: ready ? "ready" : "setup-required",
    setupRequired: !ready,
    requiredEnvVars: ready ? [] : capabilityEnvVars[capability],
  };
}

export function buildVisibleNavItems(
  config: ProductConfig,
  appConfig: AppConfig,
): VisibleNavItem[] {
  return (Object.keys(directFlowHrefMap) as DirectRouteFlowId[])
    .filter((flowId) => isFlowVisible(config, flowId))
    .map((flowId) => ({
      flowId,
      label: navLabels[flowId],
      href: directFlowHrefMap[flowId],
      setupRequired:
        (flowId === "auth" &&
          getCapabilityState("auth", config, appConfig).setupRequired) ||
        (flowId === "payment" &&
          getCapabilityState("payment", config, appConfig).setupRequired),
    }));
}

export function buildLandingPrimaryActions(
  config: ProductConfig,
  appConfig: AppConfig,
): LandingPrimaryAction[] {
  const actions: LandingPrimaryAction[] = [
    {
      label: config.mvp.primaryCta.label,
      href: config.mvp.primaryCta.href,
      variant: "default",
      setupRequired:
        config.mvp.primaryCta.href === "/pay" &&
        getCapabilityState("payment", config, appConfig).setupRequired,
    },
  ];

  const supportFlows: DirectRouteFlowId[] = ["consultation", "payment", "admin"];
  for (const flowId of supportFlows) {
    if (!isFlowVisible(config, flowId)) {
      continue;
    }

    const href = directFlowHrefMap[flowId];
    if (actions.some((action) => action.href === href)) {
      continue;
    }

    actions.push({
      label: runtimeEntryMeta[flowId].cta,
      href,
      variant: actions.length === 1 ? "outline" : "secondary",
      setupRequired:
        flowId === "payment"
          ? getCapabilityState("payment", config, appConfig).setupRequired
          : flowId === "auth"
            ? getCapabilityState("auth", config, appConfig).setupRequired
            : false,
    });
  }

  return actions;
}

export function buildRuntimeEntries(
  config: ProductConfig,
  appConfig: AppConfig,
): RuntimeEntry[] {
  return (Object.keys(runtimeEntryMeta) as DirectRouteFlowId[])
    .filter((flowId) => isFlowVisible(config, flowId))
    .map((flowId) => ({
      flowId,
      href: directFlowHrefMap[flowId],
      ...runtimeEntryMeta[flowId],
      setupRequired:
        flowId === "auth"
          ? getCapabilityState("auth", config, appConfig).setupRequired
          : flowId === "payment"
            ? getCapabilityState("payment", config, appConfig).setupRequired
            : false,
    }));
}

export function buildStarterSnapshot(
  config: ProductConfig,
  appConfig: AppConfig,
): StarterSnapshotItem[] {
  const paymentState = getCapabilityState("payment", config, appConfig);
  const authState = getCapabilityState("auth", config, appConfig);
  const formatCapabilityState = (state: CapabilityState) =>
    state.status === "setup-required" ? "setup required" : state.status;

  return [
    {
      label: "MVP shape",
      value: config.mvp.shape,
    },
    {
      label: "Active flows",
      value: config.mvp.activeFlows.map((flowId) => formatFlowLabel(flowId)).join(" / "),
    },
    {
      label: "Deferred flows",
      value: config.mvp.deferredFlows
        .map((flowId) => formatFlowLabel(flowId))
        .join(" / "),
    },
    {
      label: "Capabilities",
      value: [
        `payment: ${
          paymentState.status === "hidden"
            ? "off"
            : formatCapabilityState(paymentState)
        }`,
        `auth: ${
          authState.status === "hidden" ? "off" : formatCapabilityState(authState)
        }`,
      ].join(" · "),
    },
    {
      label: "Providers",
      value: [
        `analytics ${appConfig.analyticsProviders.length}`,
        `marketing ${appConfig.marketingProviders.length}`,
        `error logging ${appConfig.errorLoggingProviders.length}`,
      ].join(" / "),
    },
    {
      label: "Data mode",
      value: appConfig.dataMode,
    },
  ];
}

export function buildAdminMetricCards(
  metrics: DashboardMetrics,
  config: ProductConfig,
  appConfig: AppConfig,
): AdminMetricCardModel[] {
  void appConfig;
  const highlightedSet = new Set(config.mvp.admin.highlightedMetrics);
  const visibleCards = adminMetricDefinitions.filter(
    (definition) =>
      !definition.flowId || config.mvp.activeFlows.includes(definition.flowId),
  );

  return visibleCards
    .sort((left, right) => {
      const leftHighlightIndex =
        config.mvp.admin.highlightedMetrics.indexOf(left.key);
      const rightHighlightIndex =
        config.mvp.admin.highlightedMetrics.indexOf(right.key);
      const leftPriority =
        leftHighlightIndex === -1
          ? config.mvp.admin.highlightedMetrics.length + visibleCards.indexOf(left)
          : leftHighlightIndex;
      const rightPriority =
        rightHighlightIndex === -1
          ? config.mvp.admin.highlightedMetrics.length + visibleCards.indexOf(right)
          : rightHighlightIndex;

      return leftPriority - rightPriority;
    })
    .map((definition) => ({
      key: definition.key,
      title: definition.title,
      description: definition.description,
      value: definition.select(metrics),
      emphasis: highlightedSet.has(definition.key) ? "primary" : "secondary",
    }));
}

export function buildCapabilitySetupNotes(
  config: ProductConfig,
  appConfig: AppConfig,
) {
  return (Object.keys(config.mvp.capabilities) as CapabilityId[])
    .map((capability) => ({
      capability,
      state: getCapabilityState(capability, config, appConfig),
    }))
    .filter((item) => item.state.setupRequired);
}
