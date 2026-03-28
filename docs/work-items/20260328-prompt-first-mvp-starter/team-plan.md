---
status: approved
owner_role: product-squad
source_request: "자연어 비즈니스 프롬프트 하나로 recipe를 고르고 PRD/work item까지 여는 prompt-first mvp starter 추가"
affected_paths:
  - docs/work-items/20260328-prompt-first-mvp-starter/brief.md
  - scripts/create-mvp-starter.mjs
  - README.md
  - docs/start-your-mvp.md
  - docs/prds/README.md
  - docs/work-items/README.md
dependencies:
  - docs/work-items/20260328-prompt-first-mvp-starter/brief.md
skip_reason: null
---

# Team Plan

## Mission

- 비즈니스 아이디어 한 문장만으로도 `mvp:new`가 적절한 MVP recipe와 활성 흐름을 제안하고, PRD/work item에 그 판단을 남기는 prompt-first starter를 추가한다.

## Execution Mode

- `single-agent sequential`

## Team Topology

- lead: scope 고정, recipe model 결정, docs synthesis
- pm: goal packet과 acceptance criteria 고정
- pd: recipe별 CTA/trust/flow naming이 제품 제작자 관점에서 자연스러운지 검토
- fe: skipped
- be: CLI parsing, recipe inference, PRD rendering 구현
- quality review: prompt dry-run, backward compatibility, verify, squad:check 확인

## Shared Context Pack

- brief: docs/work-items/20260328-prompt-first-mvp-starter/brief.md
- feature spec: 없음
- ux review: docs/work-items/20260328-prompt-first-mvp-starter/ux-review.md
- frontend spec: docs/work-items/20260328-prompt-first-mvp-starter/frontend-spec.md
- backend spec: docs/work-items/20260328-prompt-first-mvp-starter/backend-spec.md
- external evidence: README.md, docs/prds/README.md, docs/product-config-system.md, docs/product-squad/goal-driven-delivery.md

## Shared Task List

- task_id: T-01
  owner: pm
  status: completed
  depends_on: []
  output: prompt-first 범위와 acceptance criteria 고정
- task_id: T-02
  owner: pd
  status: completed
  depends_on: [T-01]
  output: recipe naming, active/deferred flow, CTA/trust guidance 검토
- task_id: T-03
  owner: be
  status: completed
  depends_on: [T-01, T-02]
  output: `mvp:new --prompt` 구현, docs update
- task_id: T-04
  owner: quality review
  status: completed
  depends_on: [T-03]
  output: prompt dry-run, explicit flags backward compatibility, `pnpm verify`, `pnpm squad:check`

## File Ownership Plan

- owner: product-squad
  paths:
  - docs/work-items/20260328-prompt-first-mvp-starter/\*
- owner: be
  paths:
  - scripts/create-mvp-starter.mjs
  - scripts/sync-ai-context.mjs
- owner: lead
  paths:
  - README.md
  - docs/start-your-mvp.md
  - docs/prds/README.md
  - docs/work-items/README.md
  - docs/product-config-system.md
  - docs/vibe-coding-playbook.md
  - ai/context/project.md

## Handoff Log

- from: pm
  to: be
  packet: 자연어 비즈니스 문장을 goal packet으로 바꾸되, 첫 버전은 deterministic recipe inference로 제한한다.
- from: pd
  to: be
  packet: 결과에는 선택한 recipe와 active/deferred flow가 보여야 서비스 제작자가 무엇을 먼저 쓸지 바로 이해할 수 있다.
- from: be
  to: quality review
  packet: `mvp:new --prompt`와 starter docs 업데이트 완료. prompt dry-run, temp smoke run, ai:sync, verify 확인 필요.

## Escalations

- recipe 엔진이 runtime feature toggle 시스템으로 번지면 이번 슬라이스에서 멈추고 follow-up work item으로 분리한다.
