# Skill: Agent Team Delivery

## Use when

- 여러 에이전트 또는 역할이 실제 팀처럼 handoff하며 제품 결정을 만들어야 할 때
- 플랫폼에 따라 subagent, agent team, 단일 세션 역할 시뮬레이션을 모두 지원해야 할 때
- 같은 목표를 유지하면서 병렬 조사, 역할별 논의, review loop를 재현해야 할 때

## Read first

1. `docs/product-squad/agent-team-delivery.md`
2. `docs/product-squad/goal-driven-delivery.md`
3. `docs/product-squad/operating-model.md`
4. 활성 work item이 있으면 `docs/work-items/<work-id>/team-plan.md`
5. 활성 work item이 있으면 `docs/work-items/<work-id>/*.md`

## Workflow

1. 작업을 `single-agent sequential`, `subagent fan-out`, `agent-team` 중 어떤 실행 모드로 돌릴지 정합니다.
2. `team-plan.md`에 lead, teammates, shared context pack, task graph, file ownership를 먼저 적습니다.
3. lead는 goal packet과 success metric을 기준으로 task를 작게 나눕니다.
4. 각 teammate는 결과만 넘기지 말고 다음 역할이 바로 이어받을 수 있는 handoff packet을 남깁니다.
5. 병렬 작업이면 같은 파일을 동시에 편집하지 않도록 owner를 나눕니다.
6. 구현보다 먼저 research/review task를 태워서 방향을 좁힙니다.
7. 마지막에는 lead가 `quality-scorecard.md`로 결과를 수렴하고 ship / iterate / stop을 판단합니다.

## Execution Modes

- `single-agent sequential`
  - 기본값. 한 에이전트가 PM -> PD -> FE -> BE -> review 순서로 역할을 시뮬레이션합니다.
- `subagent fan-out`
  - focused task를 병렬로 탐색하고 lead가 결과를 수렴합니다.
- `agent-team`
  - 역할 간 직접 토론이나 shared task list가 필요할 때 사용합니다.

## Handoff Packet

각 task 종료 시 아래를 남깁니다.

- mission
- current decision
- unresolved questions
- files or docs touched
- next owner
- success check before handoff

## Defaults

- platform capability가 불명확하면 `single-agent sequential`을 기본으로 둡니다.
- 병렬 구현보다 병렬 research/review를 먼저 시도합니다.
- file conflict가 예상되면 병렬 구현을 금지하고 plan 단계만 병렬화합니다.
- lead는 오래 방치하지 않고 진행 중간에 방향을 재조정합니다.

## Guardrails

- tool-specific subagent 기능이 있더라도 canonical source는 repo Markdown입니다.
- team method는 병렬 실행 기능이 아니라 shared context, explicit handoff, review loop를 뜻합니다.
- 한 역할이 다음 역할에 기대는 implicit context를 남기지 않습니다.
