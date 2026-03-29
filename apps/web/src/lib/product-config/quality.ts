import type { ProductConfig } from "./types";

export const productQualityConfig = {
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
} satisfies ProductConfig["quality"];
