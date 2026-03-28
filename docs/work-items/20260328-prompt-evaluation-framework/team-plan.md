---
status: approved
owner_role: product-squad
source_request: "Cursor/Claude Code/Codex에서 공통으로 쓸 MVP starter prompt를 비교 평가하는 기준과 템플릿 추가"
affected_paths:
  - docs/work-items/20260328-prompt-evaluation-framework/brief.md
  - README.md
  - docs/start-your-mvp.md
  - docs/mvp-starter-prompt-evaluation.md
  - docs/templates/prompt-evaluation-report.md
dependencies:
  - docs/work-items/20260328-prompt-evaluation-framework/brief.md
skip_reason: null
---

# Team Plan

## Mission

- MVP starter prompt를 감으로 고르지 않도록, 도구 공통 평가 기준과 report template를 repo에 추가한다.

## Execution Mode

- `single-agent sequential`

## Team Topology

- lead: 범위 확정, canonical doc 구조 설계, 최종 synthesis
- pm: 평가 목표, success metric, ship 기준 고정
- pd: 프롬프트 가독성, 사용 흐름, summary 품질 기준 검토
- fe: skipped
- be: skipped
- quality review: 문서 재현성, 링크, squad:check 확인

## Shared Context Pack

- brief: docs/work-items/20260328-prompt-evaluation-framework/brief.md
- feature spec: 없음
- ux review: docs/work-items/20260328-prompt-evaluation-framework/ux-review.md
- frontend spec: docs/work-items/20260328-prompt-evaluation-framework/frontend-spec.md
- backend spec: docs/work-items/20260328-prompt-evaluation-framework/backend-spec.md
- external evidence: README.md, docs/start-your-mvp.md, docs/agent-context.md

## Shared Task List

- task_id: T-01
  owner: pm
  status: completed
  depends_on: []
  output: 평가 목적, acceptance criteria, decision rule 고정
- task_id: T-02
  owner: pd
  status: completed
  depends_on: [T-01]
  output: prompt variants와 사용 흐름, summary 평가 포인트 검토
- task_id: T-03
  owner: lead
  status: completed
  depends_on: [T-01, T-02]
  output: canonical evaluation doc, report template, README/start guide link 추가
- task_id: T-04
  owner: quality review
  status: completed
  depends_on: [T-03]
  output: 문서 링크, 재현성, squad:check 확인

## File Ownership Plan

- owner: product-squad
  paths:
  - docs/work-items/20260328-prompt-evaluation-framework/\*
- owner: lead
  paths:
  - README.md
  - docs/start-your-mvp.md
  - docs/mvp-starter-prompt-evaluation.md
  - docs/templates/prompt-evaluation-report.md

## Handoff Log

- from: pm
  to: lead
  packet: prompt의 좋은 정도를 감으로 말하지 말고, scenario와 score rubric으로 판정 가능해야 한다.
- from: pd
  to: lead
  packet: prompt는 짧을수록 좋다는 식의 단순 기준이 아니라, clarification overhead와 final summary usefulness를 함께 봐야 한다.
- from: lead
  to: quality review
  packet: canonical evaluation guide와 report template, README/start guide 링크 추가 완료. squad:check와 문서 연결 확인 필요.

## Escalations

- 도구별 전용 최적화 prompt를 각자 따로 관리하려는 방향으로 커지면 이번 슬라이스에서 멈추고 follow-up으로 분리한다.
