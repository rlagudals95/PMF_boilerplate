import type { ProductConfig } from "./types";

export const productLeadFormConfig = {
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
} satisfies ProductConfig["leadForm"];
