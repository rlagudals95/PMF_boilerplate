import type {
  ConsultationRequest,
  Experiment,
  Lead,
  PageEvent,
  Payment,
  Product,
} from "../domain/types";

const now = new Date("2025-01-10T09:00:00.000Z").toISOString();

export const mockProducts: Product[] = [
  {
    id: "product_modurent",
    slug: "modurent",
    name: "모두의렌탈",
    category: "렌탈 리드 생성",
    oneLiner: "렌탈 문의를 빠르게 받고 상담까지 연결하는 검증용 서비스",
    stage: "active",
    valueProps: [
      "카테고리별 렌탈 문의 수집",
      "전화/카카오 선호 상담 방식 선택",
      "실험별 랜딩 메시지 검증",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "product_waitlist",
    slug: "waitlist-lab",
    name: "Waitlist Lab",
    category: "사전 수요 검증",
    oneLiner: "랜딩과 대기자 등록만으로 초기 수요를 측정하는 템플릿",
    stage: "idea",
    valueProps: ["빠른 수요 검증", "간단한 폼 기반 리드 수집"],
    createdAt: now,
    updatedAt: now,
  },
];

export const mockExperiments: Experiment[] = [
  {
    id: "experiment_lp_message_a",
    productId: "product_modurent",
    code: "LP-001",
    name: "긴급 렌탈 니즈 메시지 실험",
    hypothesis:
      "즉시 견적과 상담 가능성을 강조하면 일반 안내형 메시지보다 문의 전환율이 높다.",
    channel: "seo",
    status: "running",
    successMetric: "landing_to_lead_conversion >= 7%",
    owner: "PM",
    notes: "가설 검증 후 카테고리별 세부 페이지로 확장",
    startDate: "2025-01-08",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "experiment_channel_kakao",
    productId: "product_modurent",
    code: "CF-002",
    name: "카카오 상담 선호도 실험",
    hypothesis:
      "전화 대신 카카오 상담 옵션을 노출하면 상담 요청 완료율이 상승한다.",
    channel: "community",
    status: "draft",
    successMetric: "consult_completion_rate >= 15%",
    owner: "Founder",
    startDate: "2025-01-15",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockLeads: Lead[] = [
  {
    id: "lead_1",
    name: "김민서",
    phone: "010-1234-5678",
    email: "minseo@example.com",
    productInterest: "정수기 렌탈 비교",
    source: "landing_page",
    status: "qualified",
    message: "가정용 정수기 3년 약정 조건이 궁금해요.",
    tags: ["home", "water"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "lead_2",
    name: "박지훈",
    phone: "010-8765-4321",
    email: "jihoon@example.com",
    productInterest: "사무실 공기청정기",
    source: "consult_page",
    status: "new",
    message: "월 예산 10만원 이하 옵션 요청",
    tags: ["office"],
    createdAt: now,
    updatedAt: now,
  },
];

export const mockConsultationRequests: ConsultationRequest[] = [
  {
    id: "consult_1",
    leadId: "lead_1",
    productInterest: "정수기 렌탈 비교",
    consultationType: "kakao",
    preferredDate: "2025-01-12T10:00:00.000Z",
    rentalPeriod: "36개월",
    budgetRange: "월 3-5만원",
    notes: "필터 교체 정책도 같이 설명 필요",
    status: "scheduled",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockPageEvents: PageEvent[] = [
  {
    id: "event_1",
    path: "/",
    eventName: "page_view",
    properties: {
      referrer: "direct",
    },
    occurredAt: now,
  },
  {
    id: "event_2",
    path: "/consult",
    eventName: "consultation_requested",
    leadId: "lead_1",
    properties: {
      consultationType: "kakao",
    },
    occurredAt: now,
  },
];

export const mockPayments: Payment[] = [
  {
    id: "payment_1",
    provider: "toss",
    orderNo: "order_demo_001",
    productDescription: "모두의렌탈 결제 데모",
    amount: 39000,
    currency: "KRW",
    status: "paid",
    customerName: "김민서",
    customerEmail: "minseo@example.com",
    payToken: "pay_token_demo_001",
    checkoutUrl: "https://pay.toss.im/demo/checkout",
    payMethod: "TOSS_MONEY",
    metadata: {
      source: "seed",
    },
    approvedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];
