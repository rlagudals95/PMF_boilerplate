---
status: done
owner_role: be
source_request: "이 보일러플레이트에, auth 관련된 kit이 빠진거 같아. 카카오, 네이버, 구글 로그인 보일러플레이트 kit도 추가해줘"
affected_paths:
  - apps/web/src/app/api/auth/naver/session/route.ts
  - apps/web/src/modules/auth/model/naver-oauth.ts
  - .env.example
  - docs/architecture.md
dependencies:
  - docs/work-items/20260315-auth-kit-social-login/brief.md
  - docs/work-items/20260315-auth-kit-social-login/frontend-spec.md
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- DB schema 변경은 없다.
- Naver callback exchange payload에 대한 boundary validation만 추가한다.

## Action Service Repository Plan

- Naver code exchange는 route handler에서 수행한다.
- provider-specific URL 생성과 profile normalization은 `modules/auth/model/naver-oauth.ts`에 둔다.
- 저장소나 user persistence는 도입하지 않고, route는 normalized demo session JSON만 반환한다.

## Analytics Impact

- 제품 analytics 이벤트 추가는 이번 범위에서 제외한다.
- 로그인 starter는 제품 퍼널과 별도 demo feature로 유지한다.

## Failure Modes

- Naver client id/secret이 없으면 Naver flow는 disabled 상태여야 한다.
- callback에 `code` 또는 `state`가 없으면 route는 400을 반환해야 한다.
- token exchange 또는 profile fetch 실패 시 route는 502/500 계열의 실패 응답을 반환하고, UI는 이를 메시지로 보여줘야 한다.
- 외부 provider 실패가 랜딩, 폼, 결제, 어드민 흐름에 영향을 주면 안 된다.

## Boundary / Use Case / Repository Contract Test Plan

- 먼저 failing test로 `POST /api/auth/naver/session`의 invalid payload rejection을 고정한다.
- 그 다음 Naver token/profile fetch 성공 시 normalized session JSON을 반환하는 contract를 검증한다.
- 최종 verify에는 `pnpm --filter web test`, `pnpm lint`, `pnpm typecheck`를 포함한다.
