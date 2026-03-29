---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: Goal-Driven Delivery

## Use when

- 사용자가 기능 목록보다 비즈니스 목표를 먼저 주고 제품 방향을 정해 달라고 할 때
- AI가 PM/PD/FE/BE처럼 역할을 나눠 논의한 뒤 더 높은 품질의 결과를 내야 할 때
- 중요한 작업을 구현 전에 목표, metric, browser QA, release 판단까지 한 루프로 고정해야 할 때

## Read first

1. `ai/context/ai-native.md`
2. `docs/product-squad/goal-driven-delivery.md`
3. `docs/product-squad/operating-model.md`
4. `ai/context/spec-driven.md`
5. `docs/work-items/README.md`
6. 활성 work item이 있으면 `docs/work-items/<work-id>/*.md`

## Workflow

1. 입력을 기능 요청이 아니라 `goal packet`으로 재해석합니다.
2. business goal, target user, success metric, non-goals, constraints가 비어 있으면 먼저 문서에 고정합니다.
3. 중요한 작업이면 `product-squad` 흐름으로 `brief.md`, role spec, `quality-scorecard.md`를 준비합니다.
4. PM은 business outcome과 acceptance criteria를 고정합니다.
5. PD는 CTA, 정보 구조, trust, edge state, browser QA 포인트를 정리합니다.
6. FE/BE는 가장 작은 measurable slice와 test-first 경계를 정합니다.
7. 구현 후에는 `quality-scorecard.md`에 goal fit, browser evidence, measurement, ship/iterate 판단을 남깁니다.
8. 여러 역할이 실제 handoff해야 하면 `agent-team-delivery` 기준으로 `team-plan.md`를 함께 사용합니다.

## Goal Packet Checklist

- business goal이 구현량이 아니라 사업 신호 기준으로 적혀 있는가
- target user와 target moment가 분리되어 있는가
- success metric, stop signal, pivot signal이 있는가
- non-goals와 constraints가 있어 scope를 자를 수 있는가
- 기존 카피, 화면, 데이터, 세일즈 운영, 실험 이력 중 어떤 evidence를 참고하는지 적혀 있는가

## Defaults

- 기본 최적화 대상은 화면 수나 기능 수가 아니라 business outcome이다.
- user-facing 작업은 browser QA evidence 없이 완료로 보지 않는다.
- role debate는 여러 에이전트를 반드시 띄우지 않아도 되고, 한 에이전트가 순차적으로 역할을 수행해도 된다.
- metric이 비어 있으면 구현보다 metric 정의를 먼저 진행한다.
- quality scorecard에서 ship 근거가 약하면 빠르게 scope를 줄여 다시 실험한다.
- role output은 결과물만이 아니라 enterprise principle adherence도 남겨야 한다.

## Guardrails

- “에이전트 팀”을 별도 서비스로 만들기 전에 repo 문서와 template로 같은 품질 루프를 재현하는 것을 우선한다.
- 역할 분리는 구현 분업이 아니라 관점 충돌을 의도적으로 만들기 위한 장치다.
- 브라우저 증거, analytics 영향, 운영 해석 가능성이 빠지면 goal-driven delivery가 아니다.
