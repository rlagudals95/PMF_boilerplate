---
status: "draft"
owner_role: "be"
source_request: "PRD: docs/prds/modurent-demand-validation.md"
affected_paths:
  - "apps/web/src/app/page.tsx"
  - "apps/web/src/app/consult/*"
  - "apps/web/src/app/admin/*"
  - "apps/web/src/app/admin/leads/*"
  - "apps/web/src/modules/lead/*"
  - "apps/web/src/modules/admin/*"
  - "packages/core/*"
  - "packages/db/*"
  - "packages/analytics/*"
  - "apps/web/src/lib/analytics.ts"
dependencies:
  - "docs/prds/modurent-demand-validation.md"
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- lead 스키마 또는 관련 저장 구조에 `category`, `urgency`, `preferred_contact`, `usage_context` 필드가 필요하다.
- consultation request가 lead qualification 문맥을 이어받을 수 있게 매핑 규칙이 필요하다.
- mock seed와 local fallback 데이터도 새 필드를 반영해야 한다.
- admin summary가 qualified lead 기준을 새 필드 기반으로 해석할 수 있어야 한다.

## Action Service Repository Plan

- boundary validation, use case orchestration, repository 책임을 분리한다.
- analytics 이벤트 저장과 외부 전송을 분리한다.

## Analytics Impact

- `lead_form_submitted` 이벤트에 rental category, urgency, preferred contact 속성을 추가한다.
- qualified lead 판별에 필요한 최소 속성 집합을 정의한다.
- `consultation_requested` 이벤트가 리드에서 이어진 흐름인지 구분 가능해야 한다.
- 어드민 지표에서 `landing -> lead -> consult` 전환을 카테고리별로 볼 수 있어야 한다.

## Failure Modes

- 입력 검증 실패 시 사용자에게 설명 가능한 상태를 반환한다.
- 남은 open questions 해소 전에는 일부 failure mode가 추가될 수 있다.

## Test Plan

- validation과 use case 경계를 단위 테스트로 검토한다.
- 저장 로직과 schema 영향 범위를 확인한다.
- 핵심 이벤트가 누락되지 않고 optional provider 실패가 흐름을 깨지 않는지 확인한다.
