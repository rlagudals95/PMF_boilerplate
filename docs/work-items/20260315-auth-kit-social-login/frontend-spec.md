---
status: done
owner_role: fe
source_request: "이 보일러플레이트에, auth 관련된 kit이 빠진거 같아. 카카오, 네이버, 구글 로그인 보일러플레이트 kit도 추가해줘"
affected_paths:
  - apps/web/src/app/auth/page.tsx
  - apps/web/src/app/auth/callback/page.tsx
  - apps/web/src/modules/auth/model
  - apps/web/src/modules/auth/ui
  - apps/web/src/shared/ui/site-header.tsx
  - apps/web/src/modules/landing/ui/landing-page.tsx
dependencies:
  - docs/work-items/20260315-auth-kit-social-login/brief.md
  - docs/work-items/20260315-auth-kit-social-login/ux-review.md
skip_reason: null
---

# Frontend Spec

## Affected Routes

- `/auth`
- `/auth/callback`

## Module Targets

- `modules/auth/model/provider-config.ts`: provider availability와 setup hint 계산
- `modules/auth/model/naver-oauth.ts`: Naver authorize URL/state/session normalization
- `modules/auth/model/browser-auth.ts`: client login start, sign-out, callback orchestration
- `modules/auth/ui/*`: demo page, social buttons, callback status UI

## Component Plan

- `app/auth/page.tsx`는 `AuthDemoPage`만 렌더링한다.
- `app/auth/callback/page.tsx`는 `AuthCallbackPage`만 렌더링한다.
- header와 landing runtime 카드에 auth demo 진입 링크를 추가한다.
- `AuthDemoPage`는 provider 상태, 로그인 버튼, starter session 카드, setup note를 조합한다.

## State And Events

- provider availability는 서버 env에서 계산한 값을 client UI에 전달한다.
- 현재 starter session은 브라우저 storage에 저장해 `/auth`에서 다시 읽는다.
- callback page는 provider별로 성공/실패 상태를 표시하고 성공 시 `/auth`로 복귀시킨다.

## Test-First Plan

- `provider-config`가 env 조합에 따라 enabled provider와 setup hint를 올바르게 계산하는지 먼저 테스트한다.
- `naver-oauth`가 authorize URL과 state 기반 callback 입력을 안전하게 다루는지 테스트한다.
- 수동 검증은 provider enabled/disabled UI, callback success/failure copy, sign-out 동작에 한정한다.

## Out Of Scope

- `/admin` 보호
- server component 기반 사용자 세션 주입
- user profile 편집 화면
