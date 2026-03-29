import type { ProductConfig } from "./types";

export const productConsultationConfig = {
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
} satisfies ProductConfig["consultation"];
