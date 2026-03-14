---
status: done
owner_role: be
source_request: "PLEASE IMPLEMENT THIS PLAN: 실무형 PM/PD/FE/BE 에이전트 운영체계 도입 계획"
affected_paths:
  - apps/web/src/modules/lead/model/submit-lead.ts
  - apps/web/src/modules/consultation/model/submit-consultation-request.ts
  - ai/context/project.md
  - ai/skills/_index.md
  - ai/skills/product-squad.md
  - ai/skills/pm-role.md
  - ai/skills/pd-role.md
  - ai/skills/fe-role.md
  - ai/skills/be-role.md
  - docs/product-squad/operating-model.md
  - docs/product-squad/templates/brief.md
  - docs/product-squad/templates/ux-review.md
  - docs/product-squad/templates/frontend-spec.md
  - docs/product-squad/templates/backend-spec.md
  - docs/work-items/README.md
dependencies:
  - docs/work-items/20260314-product-squad-rollout/brief.md
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- 기존 Zod schema는 유지한다.
- `leadCaptureInputSchema`, `consultationRequestInputSchema` 검증 위치를 model에서 action boundary로 이동한다.

## Action Service Repository Plan

- `submitLeadAction`, `submitConsultationRequestAction`은 `unknown` input을 safeParse 한다.
- validation 성공 시에만 model use case로 검증된 타입을 넘긴다.
- model use case는 validation 로직 없이 orchestration, persistence, analytics, revalidation만 담당한다.

## Analytics Impact

- `lead_form_submitted`, `consultation_requested` 이벤트 이름과 payload는 유지한다.
- tracking 위치는 그대로 model use case에 둔다.

## Failure Modes

- invalid input은 기존과 같은 `ActionResult`로 돌려준다.
- persistence 또는 analytics 실패 시 기존과 같은 error logger 경로를 유지한다.

## Test Plan

- 변경 파일 targeted eslint 실행
- 전체 workspace 검증 실행
- payment 모듈의 기존 lint/typecheck/test 실패는 별도 리스크로 기록
