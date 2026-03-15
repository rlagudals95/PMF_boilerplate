---
status: done
owner_role: fe
source_request: "packages/ab-test, packages/user-behavior-log 정리 후 apps/web에 실제로 연결해봐"
affected_paths:
  - README.md
  - apps/web/src/middleware.ts
  - apps/web/src/app/layout.tsx
  - apps/web/src/app/page.tsx
  - apps/web/src/modules/landing/model
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - apps/web/src/shared/lib
  - apps/web/src/shared/ui
  - apps/web/package.json
  - apps/web/next.config.ts
dependencies:
  - docs/work-items/20260315-package-reuse-adapters/brief.md
  - docs/work-items/20260315-package-reuse-adapters/backend-spec.md
skip_reason: null
---

# Frontend Spec

## Route And Module Plan

- `apps/web/src/middleware.ts`
  - `@pmf/ab-test` middleware를 연결해 sample experiment cookie를 배정한다.
- `apps/web/src/app/page.tsx`
  - landing page 진입 시 server boundary에서 assignment를 읽어 variant를 UI에 전달한다.
- `apps/web/src/modules/landing/model`
  - landing 전용 sample experiment 정의와 variant 해석 로직을 둔다.
- `apps/web/src/shared/lib`
  - `@pmf/user-behavior-log` sender wiring과 앱 공통 logger를 둔다.
- `apps/web/src/shared/ui`
  - behavior logger provider, page view tracker, tracked link를 패키지 기반으로 다시 연결한다.

## Client / Server Boundary

- experiment assignment 생성은 middleware에서 처리한다.
- assignment 조회는 server component인 `/` route에서 수행한다.
- behavior logging은 client component boundary에서 session id와 pathname을 함께 조합한다.
- marketing provider 호출과 `trackEventAction` 호출은 앱 logger sender 안에서 유지한다.

## Acceptance Criteria

- landing 첫 진입 시 sample experiment cookie가 배정되고, variant에 따라 hero copy가 달라진다.
- `PageViewTracker`는 `@pmf/user-behavior-log` hook을 통해 `page_view` 또는 `admin_page_viewed`를 전송한다.
- `TrackedLink`는 기존 destination/source metadata를 유지하면서 `cta_clicked`를 전송한다.
- provider, page tracker, tracked link 연결이 기존 route 구조를 비대하게 만들지 않는다.

## Test Strategy

- 먼저 landing experiment variant 해석을 pure model test로 고정한다.
- 다음으로 app behavior logger sender가 marketing + analytics action을 올바르게 호출하는지 테스트한다.
- 마지막으로 `TrackedLink`와 `PageViewTracker`의 public behavior를 component test로 검증한다.
