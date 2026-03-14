---
status: done
owner_role: fe
source_request: "PLEASE IMPLEMENT THIS PLAN: 실무형 PM/PD/FE/BE 에이전트 운영체계 도입 계획"
affected_paths:
  - apps/web/src/modules/lead/actions/submit-lead-action.ts
  - apps/web/src/modules/consultation/actions/submit-consultation-request-action.ts
  - docs/agent-context.md
  - docs/architecture.md
dependencies:
  - docs/work-items/20260314-product-squad-rollout/brief.md
skip_reason: null
---

# Frontend Spec

## Affected Routes

- 직접적인 route 변경은 없다.
- `app/` entry는 그대로 두고, feature action boundary만 정리한다.

## Module Targets

- `apps/web/src/modules/lead/actions`
- `apps/web/src/modules/consultation/actions`
- `docs/agent-context.md`
- `docs/architecture.md`

## Component Plan

- UI 컴포넌트 이동은 하지 않는다.
- form submit 진입점인 server action에서 boundary validation을 수행하고, 검증된 값만 model use case로 넘긴다.

## State And Events

- 클라이언트 form 상태 흐름은 유지한다.
- action validation 실패 시 기존과 동일한 `ActionResult` 에러 매핑을 유지한다.

## Test Plan

- 변경 action 파일에 대해 targeted eslint를 돌린다.
- 전체 `pnpm lint`, `pnpm typecheck`, `pnpm test`는 실행하되, 기존 payment 작업 중인 오류는 별도로 기록한다.

## Out Of Scope

- landing / consult UI 재설계
- 새 shared action 추상화 추가
