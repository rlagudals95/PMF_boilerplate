---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: approved
owner_role: product-squad
source_request: "속도는 물론 비개발/개발 직군 상관없이 퀄리티가 보장되는 시스템을 고려해 작업"
affected_paths:
  - docs/work-items/20260326-quality-assured-mvp-system/brief.md
  - docs/product-config-system.md
  - apps/web/src/lib/product-config.ts
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - apps/web/src/modules/lead/ui/lead-capture-form.tsx
  - apps/web/src/modules/consultation/ui/*
dependencies:
  - docs/work-items/20260326-quality-assured-mvp-system/brief.md
skip_reason: null
---

# Team Plan

## Mission

- 제품별 copy와 trust surface를 한 곳으로 모아, 비개발직군도 AI와 함께 더 안전하게 MVP를 제품화할 수 있는 첫 번째 config-first 시스템을 만든다.

## Execution Mode

- `single-agent sequential`

## Team Topology

- lead: 문제 재정의, 범위 조정, 최종 synthesis
- pm: goal, non-goals, acceptance criteria 고정
- pd: copy/trust surface와 browser QA 관점 검토
- fe: config structure, UI wiring, 테스트 경계 구현
- be: 이번 슬라이스는 skipped
- quality review: verify 결과와 ship 판단 정리

## Shared Context Pack

- brief: docs/work-items/20260326-quality-assured-mvp-system/brief.md
- feature spec: 없음
- ux review: docs/work-items/20260326-quality-assured-mvp-system/ux-review.md
- frontend spec: docs/work-items/20260326-quality-assured-mvp-system/frontend-spec.md
- backend spec: docs/work-items/20260326-quality-assured-mvp-system/backend-spec.md
- external evidence: 이전 평가와 `docs/product-squad/goal-driven-delivery.md`

## Shared Task List

- task_id: T-01
  owner: pm
  status: completed
  depends_on: []
  output: brief와 acceptance criteria 고정
- task_id: T-02
  owner: pd
  status: completed
  depends_on: [T-01]
  output: copy/trust surface와 browser QA 포인트 정리
- task_id: T-03
  owner: fe
  status: completed
  depends_on: [T-01, T-02]
  output: product-config 도입과 user-facing surface wiring
- task_id: T-04
  owner: quality review
  status: completed
  depends_on: [T-03]
  output: verify 결과와 quality-scorecard 갱신

## File Ownership Plan

- owner: product-squad
  paths:
  - docs/work-items/20260326-quality-assured-mvp-system/\*
- owner: fe
  paths:
  - apps/web/src/lib/product-config.ts
  - apps/web/src/lib/app-config.ts
  - apps/web/src/app/layout.tsx
  - apps/web/src/shared/ui/site-header.tsx
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - apps/web/src/modules/lead/ui/lead-capture-form.tsx
  - apps/web/src/modules/consultation/ui/\*
- owner: lead
  paths:
  - docs/product-config-system.md
  - ai/context/project.md
  - ai/context/engineering-frontend.md
  - docs/architecture.md

## Handoff Log

- from: pm
  to: fe
  packet: 제품 copy를 단일 surface로 올리고 최소 품질 기준을 테스트에서 잡는다.
- from: fe
  to: quality review
  packet: product-config를 중심으로 헤더, 랜딩, 리드, 상담 surface를 연결하고 verify로 확인한다.

## Escalations

- runtime product switcher나 recipe engine까지 요구되면 이번 슬라이스에서 분리하고 다음 work item으로 승격한다.
