---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: approved
owner_role: product-squad
source_request: "few inputs로 PRD 초안과 feature work item까지 같이 만드는 범용 mvp:new 생성기 추가"
affected_paths:
  - docs/work-items/20260327-mvp-bootstrap-generator/brief.md
  - scripts/create-mvp-starter.mjs
  - scripts/create-feature-from-prd.mjs
  - docs/prds/README.md
  - docs/work-items/README.md
dependencies:
  - docs/work-items/20260327-mvp-bootstrap-generator/brief.md
skip_reason: null
---

# Team Plan

## Mission

- business input 몇 개만으로 PRD와 첫 work item을 동시에 여는 범용 `mvp:new` generator를 추가하고, 기존 generator 흐름과 문서를 깨지 않게 연결한다.

## Execution Mode

- `single-agent sequential`

## Team Topology

- lead: 범위 확정, generator UX 결정, 최종 synthesis
- pm: goal packet 기준과 acceptance criteria 고정
- pd: 입력 수를 최소화하면서도 문서 품질이 유지되는지 검토
- fe: skipped
- be: CLI generator와 script wiring 구현
- quality review: dry-run, smoke run, verify, squad:check 확인

## Shared Context Pack

- brief: docs/work-items/20260327-mvp-bootstrap-generator/brief.md
- feature spec: 없음
- ux review: docs/work-items/20260327-mvp-bootstrap-generator/ux-review.md
- frontend spec: docs/work-items/20260327-mvp-bootstrap-generator/frontend-spec.md
- backend spec: docs/work-items/20260327-mvp-bootstrap-generator/backend-spec.md
- external evidence: docs/prds/README.md, docs/work-items/README.md, ai/context/project.md

## Shared Task List

- task_id: T-01
  owner: pm
  status: completed
  depends_on: []
  output: few inputs 기반 acceptance criteria 고정
- task_id: T-02
  owner: pd
  status: completed
  depends_on: [T-01]
  output: 입력 수와 generator UX trade-off 검토
- task_id: T-03
  owner: be
  status: completed
  depends_on: [T-01, T-02]
  output: `mvp:new` script, package wiring, docs update
- task_id: T-04
  owner: quality review
  status: completed
  depends_on: [T-03]
  output: dry-run or smoke run, `pnpm verify`, `pnpm squad:check`

## File Ownership Plan

- owner: product-squad
  paths:
  - docs/work-items/20260327-mvp-bootstrap-generator/\*
- owner: be
  paths:
  - scripts/create-mvp-starter.mjs
  - scripts/create-feature-from-prd.mjs
  - package.json
  - scripts/sync-ai-context.mjs
- owner: lead
  paths:
  - docs/prds/README.md
  - docs/work-items/README.md
  - docs/vibe-coding-playbook.md
  - ai/context/project.md

## Handoff Log

- from: pm
  to: be
  packet: few inputs는 goal, audience, offer, signal로 제한하고 결과는 PRD + first work item까지 이어져야 한다.
- from: be
  to: quality review
  packet: new script와 docs update 완료. dry-run 및 repo verify로 품질 게이트 확인 필요.

## Escalations

- generator가 별도 planning platform처럼 커지려 하면 범위를 멈추고 follow-up work item으로 분리한다.
