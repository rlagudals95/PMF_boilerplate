---
owner: "pd"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: approved
owner_role: pd
source_request: "자연어 비즈니스 프롬프트 하나로 recipe를 고르고 PRD/work item까지 여는 prompt-first mvp starter 추가"
affected_paths:
  - scripts/create-mvp-starter.mjs
  - README.md
  - docs/start-your-mvp.md
dependencies:
  - docs/work-items/20260328-prompt-first-mvp-starter/brief.md
skip_reason: null
---

# UX Review

## Goal Alignment

- prompt-first starter의 목표는 기능을 다 보여주는 것이 아니라, 서비스 제작자가 "내 아이디어는 어떤 MVP 흐름으로 시작하면 되나"를 빠르게 판단하게 돕는 것이다.
- 따라서 결과 출력은 feature inventory보다 `recipe`, `active flows`, `deferred flows`, `primary CTA`, `key metric`이 먼저 보이게 해야 한다.

## Entry Points

- CLI: `pnpm mvp:new <slug> --prompt "..."`
- 문서: README의 `Start Your MVP` 섹션, `docs/start-your-mvp.md`

## Copy Changes

- `few inputs` 중심 설명에 더해 `one-shot prompt` 예시를 제공한다.
- 예시 프롬프트는 업종 고정형이 아니라 사업 목표 해석형 문장으로 쓴다.
- 출력 카피는 "무엇을 build하라"보다 "무엇을 이번 MVP에서 켠다/미룬다"를 드러내야 한다.

## IA Changes

- README와 starter 문서에서 기능 소개보다 시작 순서를 앞에 둔다.
- recipe catalog는 길게 설명하기보다 `언제 쓰는지`, `켜는 흐름`, `미루는 흐름`만 빠르게 스캔 가능해야 한다.

## Primary CTA And Trust

- primary CTA는 "지금 당장 이 아이디어를 scaffold한다"가 되어야 하므로 `pnpm mvp:new --prompt` 예시가 핵심 CTA다.
- trust 포인트는 이 starter가 기존 explicit generator 흐름을 깨지 않는다는 점, 그리고 결과에 admin metric과 deferred scope가 같이 남는다는 점이다.

## Happy Path

- 사용자가 사업 아이디어 한 문장을 입력한다.
- 시스템이 적절한 recipe를 고른다.
- 생성 결과에 goal packet 초안과 active/deferred flow가 요약된다.
- 사용자는 generated PRD와 work item을 열어 `product-config.ts`와 첫 implementation slice를 바로 결정할 수 있다.

## Edge States

- prompt가 모호할 때는 완벽한 추론보다 generic default recipe와 follow-up open question을 남긴다.
- 여러 recipe 신호가 섞이면 가장 얇은 measurable flow를 우선 추천한다.
- slug가 없거나 prompt만으로 안전한 slug를 만들기 어렵다면 사용자가 slug를 명시하도록 유지한다.

## Accessibility Checks

- README와 starter 문서의 예시 명령은 복사 가능한 한 줄 명령으로 제공한다.
- recipe 표나 bullet은 스캔 가능해야 하고, 긴 서술 속에 핵심 명령을 숨기지 않는다.

## Browser QA Plan

- runtime UI 변경이 아니라 문서/CLI 작업이므로 browser QA 대상은 아니다.
- 대신 README와 starter 문서에서 첫 시작 동선이 앞부분에 노출되는지 텍스트 리뷰로 확인한다.
