# Architecture Decisions

## 목표

이 저장소의 목표는 한 제품을 예쁘게 만드는 것이 아니라, 여러 사이드 프로젝트에서 PMF를 찾기 위한 실험 루프를 반복 가능하게 만드는 것입니다.

## 핵심 결정

### 1. 단일 Next.js 앱 + 공유 패키지

- 랜딩, 폼, 어드민, 헬스체크를 모두 `apps/web` 하나에서 처리합니다.
- 별도 API 서버를 두지 않았습니다.
- 이유: PMF 탐색 단계에서 배포와 변경 속도가 가장 중요하기 때문입니다.

추가 기준:

- `apps/web`는 하나의 제품 앱이면서 동시에 modular monolith의 host 역할을 합니다.
- FE와 BE를 모두 이 앱 안에서 처리하되, 프레임워크 계층과 도메인 계층은 분리합니다.

### 2. Supabase/Postgres 지향 + 로컬 JSON fallback

- 실제 운영 대상 DB는 Supabase/Postgres 입니다.
- 하지만 초기 개발과 테스트는 `packages/db/local-data.json` 기반으로 동작합니다.
- 이유: 로컬에서 바로 폼 제출과 어드민 확인이 가능해야 실험 iteration 속도가 납니다.

추가 기준:

- Supabase는 DB 전환뿐 아니라 Google/Kakao social login starter를 붙일 때도 우선 선택지로 둡니다.
- 다만 auth는 lightweight starter 범위에 머물고, admin 보호나 role 체계는 별도 작업으로 분리합니다.

### 3. Drizzle 스키마는 제품보다 실험 루프 중심

초기 모델은 다음 여섯 가지입니다.

- `leads`
- `consultation_requests`
- `products`
- `experiments`
- `page_events`
- `payments`

이 구조는 특정 렌탈 상품이 아니라 "문제-가설-리드-상담-결제-이벤트" 루프를 재사용하기 위한 최소 공통 분모입니다.

### 4. 리드와 상담 요청 분리

- 랜딩 리드는 약한 관심 신호입니다.
- 상담 요청은 강한 실행 신호입니다.
- 둘을 한 폼에 합치지 않고 분리해, 신호 품질을 다르게 해석할 수 있게 했습니다.

### 5. analytics와 marketing/error logging은 얇은 추상화 + optional provider 구조

- `packages/analytics`는 `track()` 인터페이스와 adapter 조합만 가집니다.
- 기본 provider는 내부 저장소와 콘솔입니다.
- `MIXPANEL_PROJECT_TOKEN`이 있을 때만 Mixpanel adapter를 추가합니다.
- 브라우저 광고 채널 추적은 `apps/web/src/modules/marketing`에서 다룹니다.
- 이유: 제품의 기준 이벤트 저장은 우리 쪽 DB가 책임지고, 외부 SaaS는 선택적으로 붙여야 하기 때문입니다.

추가 규칙:

- 내부 저장 adapter는 `required`
- Mixpanel 같은 외부 provider는 `optional`
- Meta Pixel, Kakao Pixel, Google Ads 같은 마케팅 채널도 `optional`
- 외부 provider 장애가 리드 제출이나 상담 요청 자체를 깨뜨리면 안 됩니다.

에러 로깅도 같은 방향을 따릅니다.

- `packages/error-logging`은 `report()` 인터페이스와 adapter 조합만 가집니다.
- 기본 provider는 콘솔이며 `required`입니다.
- 외부 provider는 필요할 때만 `optional`로 추가합니다.

### 6. social auth는 optional starter로만 둔다

- `/auth` route는 Google, Kakao, Naver 로그인을 빠르게 검증하기 위한 demo/starter입니다.
- Google/Kakao는 Supabase social login provider를, Naver는 별도 OAuth adapter를 사용합니다.
- starter session은 브라우저 demo 검증을 위한 최소 상태만 저장합니다.
- 이유: 새 프로젝트에서 자주 반복되는 OAuth wiring은 줄이되, 복잡한 auth product scope는 아직 넣지 않기 위해서입니다.

### 7. UI는 작은 shadcn 스타일 베이스만 공유

- 버튼, 카드, 입력, 배지, 테이블 정도만 공유 패키지로 둡니다.
- 무거운 디자인 시스템은 만들지 않되, 서비스별 브랜드 변경을 위한 작은 semantic theme layer는 둡니다.
- shared UI와 app shell은 raw brand color utility 대신 semantic token을 사용합니다.
- 이유: PMF 실험 보일러플레이트는 미학보다 속도와 가독성이 우선입니다.

### 8. `apps/web`는 Hybrid FSD Lite 구조를 따른다

`apps/web/src/app`에 모든 로직이 몰리기 시작하면 Next 앱은 금방 유지보수가 어려워집니다.
이 저장소는 아래 구조를 목표로 합니다.

```txt
apps/web/src/
  app/                  # routing, layout, page, route handler entry
  modules/              # domain-oriented feature slices
    landing/
    lead/
    consultation/
    payment/
    auth/
    admin/
    demo-funnel/
  shared/               # app-local shared UI, hooks, action entrypoint
  lib/                  # env, client wiring, framework helpers
```

배치 규칙:

- `app/`: 가능한 한 얇게 유지한다.
- `modules/`: 제품 기능별 `ui`, `model`, `actions`를 함께 둔다.
- `shared/`: 두 개 이상 모듈에서 쓰는 app-local code를 둔다.
- `lib/`: 도메인 규칙이 아닌 wiring만 둔다.

이 구조는 strict FSD의 `shared / entities / features / widgets / pages`를 그대로 적용하지 않습니다.
대신 Next 풀스택에 맞춰 `app -> modules | shared | lib -> packages` 방향만 명확하게 유지합니다.

문서 경계:

- FE 수정 규칙의 canonical source는 `ai/context/engineering-frontend.md`
- backend/domain/infrastructure 규칙의 canonical source는 `ai/context/engineering-backend.md`
- spec-driven 운영 기준의 canonical source는 `ai/context/spec-driven.md`
- 문서 sync 기준의 canonical source는 `ai/context/doc-sync.md`
- 이 문서는 현재 저장소 구조를 설명하고, `engineering-*` 문서는 수정 규칙을 설명합니다.

### 9. 책임 분리 규칙

각 계층은 아래 책임만 가집니다.

- `page.tsx`, `layout.tsx`
  - 화면 조합, metadata, data entry 연결
- `route.ts`, server action
  - request parsing, auth/session 확인, use case 호출
- `modules/*/model`
  - 비즈니스 규칙, 상태 전이, 유스케이스
- `shared/*`
  - app-local shared UI, client helper, shared server action
- `packages/db`
  - persistence, schema, repository
- `packages/core`
  - 순수 타입, schema, fixture, mapper

금지:

- page에서 직접 repository 호출
- `app/actions.ts`처럼 중앙 action 파일 하나에 모든 흐름을 몰아넣는 것
- action 안에 validation, domain rule, persistence를 모두 혼합
- 재사용이 검증되지 않은 코드를 `packages/*`로 이동
- `utils.ts` 하나에 여러 도메인 함수를 계속 누적

### 10. 의존 방향

의존성은 아래 방향을 넘지 않습니다.

```txt
app -> modules | shared | lib -> packages
```

예시:

```txt
page.tsx
  -> module ui
  -> module action
  -> module model
  -> shared api
  -> packages/db repository
  -> packages/analytics adapter
```

`packages/*`는 `apps/web/*`를 참조하지 않습니다.
`modules/*`끼리 직접 참조하지 않고, 공용화가 필요하면 `shared/*`로 올립니다.

이 package 경계는 현재 monorepo 구조를 위한 것일 뿐 아니라, 미래에 backend를 별도 repo로 추출할 때도 유지되어야 하는 분리 기준입니다.

### 11. 엔터프라이즈급 품질을 위한 최소 기준

복잡한 아키텍처를 뜻하지 않습니다. 다음 네 가지를 꾸준히 지키는 것을 뜻합니다.

- 경계가 명확하다.
- 변경 단위가 작다.
- 검증과 저장이 분리된다.
- 문서와 테스트가 코드 변경을 따라간다.

### 12. 중요한 작업은 역할 기반 문서 산출물로 관리한다

- 기본 진입점은 `product-squad` 오케스트레이터입니다.
- 역할은 `pm-role`, `pd-role`, `fe-role`, `be-role`로 나눕니다.
- 중요한 작업은 구현 전에 `docs/work-items/<work-id>/`에 brief와 role spec을 먼저 만듭니다.
- 이 문서 산출물은 외부 PM 툴이 아니라 repo 안의 source of truth로 취급합니다.
- 작은 문구 수정, 단일 스타일 수정, 명백한 소규모 버그는 full process를 생략할 수 있습니다.
- 자세한 운영 규칙은 `docs/product-squad/operating-model.md`를 canonical source로 둡니다.

### 13. Spec-driven 운영은 repo 문서를 기준으로 한다

- 구현 기준 문서는 repo 안 Markdown입니다.
- `ai/context/spec-driven.md`는 어떤 작업에 어떤 문서가 먼저 필요한지 정의합니다.
- `ai/context/doc-sync.md`는 어떤 변경이 어떤 문서를 갱신해야 하는지 정의합니다.
- `docs/templates/*`는 feature/experiment spec의 최소 계약을 제공합니다.
- `docs/adr/*`는 반복 규칙이나 구조 결정이 바뀔 때 기록합니다.
- Notion 같은 외부 도구는 discovery와 협업에 사용할 수 있지만 source of truth는 아닙니다.

## 트레이드오프

### 의도적으로 넣지 않은 것

- 복잡한 인증 플로우와 admin 권한 체계
- 복잡한 구독/정산/환불 백오피스
- CMS
- 큐/백그라운드 잡
- vendor lock-in analytics
- 무거운 design system

### 나중에 붙일 가능성이 높은 것

- Supabase auth 기반 admin 보호
- user/profile persistence와 server-protected session
- 실험별 랜딩 템플릿 시스템
- 이벤트 속성 표준화와 세션 추적
- 다회차 결제/정산/환불 운영 도구
- CSV export / CRM 연동
- feature flags

## 다음 제품으로 재사용하는 방법

1. `packages/core/src/fixtures/mock-data.ts`와 랜딩 카피를 바꿉니다.
2. 필요한 경우 폼 zod 스키마를 확장합니다.
3. 실험 채널/상태 enum을 추가합니다.
4. 제품별 코드는 먼저 `apps/web/src/modules/*`에 두고, 두 번 이상 재사용되는 코드는 `apps/web/src/shared/*`를 검토합니다.
5. 중요한 작업이면 관련 spec을 repo 문서로 먼저 고정한 뒤 구현합니다.

## 무엇을 더 넣고 무엇을 빼야 하는가

### 추가하면 좋은 것

- `experiment playbook`: 실험 생성 규칙, success metric 네이밍, 종료 기준
- `feature flag naming`: 메시지/CTA 테스트를 깔끔히 운영하려면 유용
- `lead review checklist`: 질적 인터뷰 후보 선별 기준

### 지금은 빼는 편이 좋은 것

- 일반화되지 않은 repository pattern
- 관리자 권한 레벨 세분화
- 메시징 채널 자동화
- 정교한 BI 대시보드

이 네 가지는 PMF를 찾기 전에는 유지비가 가치보다 커지기 쉽습니다.

## 실무 적용 가이드

새 기능을 넣을 때는 아래 순서를 기본값으로 삼습니다.

1. `modules/<domain>` 안에 `ui`, `model`, `actions`를 먼저 둡니다.
2. route/page는 해당 모듈을 조합만 하게 유지합니다.
3. 중요한 작업이면 `docs/work-items/<work-id>/brief.md`를 먼저 만들고, 필요한 role spec을 채웁니다.
4. 두 번 이상 재사용되는 코드는 먼저 `shared/*`로 올리고, 그 다음에만 `packages/*` 승격을 검토합니다.
5. 구조 규칙이 바뀌면 `ai/context/engineering.md`, 관련 `engineering-*` 문서, 이 문서를 함께 갱신합니다.
6. 중요한 작업이면 spec, work item, 관련 문서 sync를 함께 확인합니다.
