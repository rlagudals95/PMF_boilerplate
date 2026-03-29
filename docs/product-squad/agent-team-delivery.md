---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Agent Team Delivery

## 목적

- Claude Agent Teams 같은 환경에서는 실제 teammate를 활용하고, 그렇지 않은 환경에서는 같은 문서와 루프로 팀 작업을 시뮬레이션할 수 있게 한다.
- `ai:sync`로 생성되는 각 플랫폼 어댑터가 같은 방법론을 읽고 따를 수 있도록 canonical 규칙을 repo에 둔다.
- 에이전트 수보다 중요한 shared context, task graph, handoff packet, review loop를 표준화한다.

## 핵심 생각

- 진짜 팀처럼 일한다는 것은 agent를 많이 띄우는 것이 아니라 역할 간 handoff가 명시적이라는 뜻입니다.
- 기본값은 peer-to-peer 자유 토론이 아니라 `po supervisor -> bounded specialists -> evaluator gate`입니다.
- 플랫폼 기능은 다르지만, 아래 네 가지는 공통으로 유지할 수 있습니다.
  - shared context pack
  - shared task list
  - explicit handoff packet
  - lead synthesis + quality gate

## 실행 모드

### 1. Single-Agent Sequential

- 기본 모드입니다.
- 한 에이전트가 `lead/po gate -> pm -> pd -> fe -> be -> evaluator -> quality review`를 순차적으로 수행합니다.
- subagent나 agent team 기능이 없어도 동일한 산출물을 만들 수 있습니다.

### 2. Subagent Fan-Out

- 병렬 research, review, competing hypotheses에 적합합니다.
- 각 worker는 결과를 lead에게 반환하고, worker 간 직접 통신은 필수가 아닙니다.
- focused task에서 먼저 사용합니다.

### 3. Agent Team

- 역할 간 직접 토론, shared task self-claim, cross-layer coordination이 필요할 때 사용합니다.
- coordination cost와 token cost가 크므로 명확히 독립 가능한 task에만 씁니다.

## 언제 어떤 모드를 쓰는가

- 단일 흐름 설계, small slice 구현
  - `single-agent sequential`
- library 비교, 경쟁 가설 검증, 병렬 조사
  - `subagent fan-out`
- frontend/backend/test/ops가 동시에 움직이되 서로 결과를 주고받아야 하는 작업
  - `agent-team`

platform capability가 없거나 불명확하면 항상 `single-agent sequential`로 내려갑니다.

## Team Topology

- lead
  - orchestration shell, `po-role` gate 수행, task 분해, review synthesis, 최종 판단
- pm
  - goal, metric, acceptance criteria
- pd
  - CTA, IA, trust, edge state, browser QA
- fe
  - route/module/component, state, instrumentation, UI verify
- be
  - validation, persistence, analytics, admin visibility, failure mode
- evaluator
  - quality-scorecard 독립 판정, release recommendation, replayable evaluation 필요 여부
- quality reviewer
  - 별도 agent일 수도 있고 evaluator와 같은 agent일 수도 있습니다.

각 역할은 단순히 산출물만 채우는 것이 아니라 `ai/context/ai-native.md`의 enterprise principles를 자기 관점에서 적용해야 합니다.
즉 PM은 decision quality, PD는 UX system quality, FE는 code/module quality, BE는 contract/domain quality를 담당합니다.

## Default Topology V2

- `po-role`
  - user conversation owner
  - question routing
  - synthesis owner
- specialist roles
  - bounded artifact producer
  - direct user ping-pong 비기본
- `evaluator-role`
  - implementation과 분리된 release judge

이 구조는 manager-first 기본값이며, direct worker-to-worker chat은 exception path입니다.

## Permission Defaults

- `po`, `pm`, `pd`, `evaluator`
  - read-first, docs-first
- `fe`, `be`
  - owned files 안에서 write
- browser/evidence worker
  - no code edits

플랫폼이 실제 tool restriction을 제공하지 않더라도, canonical 운영 expectation은 위와 같습니다.

## Shared Artifacts

중요한 작업의 공용 산출물은 아래입니다.

- `goal-packet.md`
- `brief.md`
- `feature-spec.md`
- `ux-review.md`
- `frontend-spec.md`
- `backend-spec.md`
- `team-plan.md`
- `quality-scorecard.md`

이 중 `goal-packet.md`는 입력 정규화 source of truth이고, `team-plan.md`는 coordination source of truth이며, `quality-scorecard.md`는 최종 review source of truth입니다.

## Team Plan

`docs/work-items/<work-id>/team-plan.md`에는 아래가 들어갑니다.

- mission
- execution mode
- team topology
- shared context pack
- shared task list
- file ownership plan
- handoff log
- escalation rules

이 문서는 플랫폼이 실제 shared task list를 제공하지 않아도 같은 협업 구조를 재현하기 위한 최소 계약입니다.

## Handoff Packet

각 task가 끝날 때 다음 형식으로 handoff합니다.

- mission
  - 내가 맡았던 일과 그 범위
- current decision
  - 지금까지 내린 결론
- unresolved questions
  - 아직 남은 결정
- changed files or docs
  - 다음 역할이 꼭 읽어야 하는 경로
- next owner
  - 이어받을 역할
- success check
  - handoff 전에 확인한 증거
- evaluator follow-up
  - evaluator가 추가로 확인해야 하는 잔여 증거

가능하면 success check에는 아래 둘을 함께 남깁니다.

- verification evidence
- role principle adherence note

다음 역할은 이전 대화 로그가 아니라 이 packet과 repo 문서를 기준으로 움직입니다.

## Handoff Quality Rubric

- next owner가 채팅 로그를 다시 읽지 않아도 바로 이어받을 수 있어야 합니다.
- unresolved questions는 `없음` 또는 구체 항목으로 명시해야 합니다.
- changed files or docs는 실제 repo 경로로 적어 다음 역할이 바로 읽을 수 있어야 합니다.
- success check에는 verification evidence 또는 explicit skip reason이 포함되어야 합니다.
- 이 기준을 못 맞추면 lead가 바로 보완을 요청합니다.

## Shared Task List 규칙

- task는 `pending`, `in_progress`, `completed`, `blocked` 중 하나를 가집니다.
- 각 task는 owner를 하나만 둡니다.
- file owner가 겹치면 병렬 구현 대신 병렬 research로 바꿉니다.
- dependency가 있는 task는 선행 task가 끝나기 전 완료로 바꾸지 않습니다.
- 구현 task 전에 research/review task를 최소 하나 둡니다.

## Parallelization Rules

- 병렬화는 task가 아니라 file ownership 기준으로 결정합니다.
- 같은 파일을 여러 agent가 동시에 편집하지 않습니다.
- 브라우저 QA, release 판단, final synthesis는 lead가 수렴합니다.
- release recommendation은 가능하면 `evaluator-role`이 먼저 적고, lead가 최종 synthesis를 합니다.
- 병렬 implementation보다 병렬 investigation이 먼저입니다.

## Lead Rules

- lead는 초반에 `po-role`처럼 goal packet과 visual bar가 충분한지 점검합니다.
- lead는 기본적으로 user-facing conversation을 직접 소유합니다.
- 진행 중간에 team을 방치하지 않고 수시로 steer합니다.
- 산출물 간 충돌이 생기면 더 최신 대화가 아니라 repo 문서를 source of truth로 삼습니다.
- 최종 답은 역할별 산출물을 합쳐 `quality-scorecard.md`에 남깁니다.

## Platform-Neutral Rules

- Claude의 subagents / agent teams 같은 기능은 optional acceleration입니다.
- Codex, Gemini, Copilot, Cursor에서도 같은 작업 방식을 쓰려면 canonical 규칙과 템플릿이 repo 안에 있어야 합니다.
- `ai:sync`는 skill과 context를 각 플랫폼 어댑터로 풀어줄 뿐, 방법론의 source of truth는 `ai/`와 `docs/`입니다.

## Platform Acceleration

- Claude에서는 `.claude/agents/*.md` project subagent와 `.claude/settings.json` hook을 acceleration으로 사용할 수 있습니다.
- Codex, Gemini, Copilot, Cursor에서는 generated skill/command/rule이 같은 canonical workflow를 더 잘 로드하도록 돕습니다.
- 중요한 작업 마무리 전에는 플랫폼과 무관하게 `pnpm squad:check [work-id]`를 실행해 artifact가 placeholder 상태가 아닌지 확인합니다.
- canonical 문서, work item metadata, adapter drift는 `pnpm repo:check`로 먼저 확인합니다.

## Browser Review Loop

team 방식으로 작업하더라도 user-facing 결과는 아래를 지나야 합니다.

- desktop + mobile 확인
- happy path
- error / empty / pending state
- focus / keyboard / label
- CTA hierarchy
- metric instrumentation
- screenshot diff 또는 recorded flow 검토 여부

## 시작 규칙

- 처음부터 병렬 구현하지 않습니다.
- 먼저 research, review, plan approval부터 시작합니다.
- 목표가 크더라도 첫 구현은 thin slice 하나로 제한합니다.

## 종료 규칙

- `team-plan.md`의 모든 task가 completed 또는 explicitly deferred 상태인지 확인합니다.
- `quality-scorecard.md`에 ship / iterate / stop이 남아 있어야 합니다.
- 필요한 경우 `pnpm repo:check --work <work-id>`를 실행합니다.
- 필요한 경우 `pnpm squad:check [work-id]`를 실행합니다.
- 필요한 경우 `pnpm verify` 또는 `pnpm verify:full`을 실행합니다.

## V1에서 하지 않는 것

- 플랫폼별 전용 orchestration 서버
- agent mailbox 자체 구현
- 자동 task claiming 엔진

이 보일러플레이트는 agent runtime을 만들지 않고, 어떤 runtime 위에서도 재현 가능한 협업 규칙을 먼저 표준화합니다.
