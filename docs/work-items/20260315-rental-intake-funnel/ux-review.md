---
status: "draft"
owner_role: "pd"
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
  - "docs/work-items/20260315-rental-intake-funnel/feature-spec.md"
skip_reason: null
---

# UX Review

## Entry Points

- /
- /consult
- /admin
- /admin/leads

## Copy Changes

- 랜딩과 리드 폼을 `모두의렌탈` 카피와 렌탈 intake 질문으로 바꾸고, 카테고리/긴급도/연락 선호를 구조화해 저장한다.

## IA Changes

- Admin navigation or admin page composition will change.

## Happy Path

- 핵심 대상 사용자가 /, /consult, /admin, /admin/leads 경로로 진입한다.
- 랜딩과 리드 폼을 `모두의렌탈` 카피와 렌탈 intake 질문으로 바꾸고, 카테고리/긴급도/연락 선호를 구조화해 저장한다.
- 사용자는 어떤 렌탈이 필요한지 짧은 입력만으로 전달하고 적절한 후속 상담을 기대할 수 있다.

## Edge States

- 필수 입력이 누락되면 명시적인 오류 상태를 보여준다.
- 비동기 처리 중 pending 상태를 사용자에게 노출한다.
- optional provider 실패가 핵심 흐름을 깨지 않도록 분리한다.
- 남은 open questions에 따라 추가 edge state가 필요할 수 있다.

## Accessibility Checks

- Keyboard navigation and focus order remain intact.
- Form labels, helper text, and error messaging are explicit.
- Status feedback is visible without relying on color alone.
