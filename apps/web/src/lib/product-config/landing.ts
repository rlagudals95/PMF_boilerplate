import type { ProductConfig } from "./types";

export const productLandingConfig = {
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
} satisfies ProductConfig["landing"];
