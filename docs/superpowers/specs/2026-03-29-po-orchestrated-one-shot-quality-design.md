---
owner: "platform"
doc_type: "spec"
source_of_truth: false
freshness: "draft"
verification: "manual"
status: proposed
owner_role: platform
source_request: "one-shot 시작 품질과 역할별 판단력 부족으로 상용 서비스 같은 랜딩이 잘 나오지 않는 문제를 PO 오케스트레이션과 역할별 품질 게이트로 보완하고 싶다."
affected_paths:
  - "docs/ai-starter-prompt-pack.md"
  - "ai/skills/product-squad.md"
  - "docs/product-squad/goal-driven-delivery.md"
  - "docs/product-squad/operating-model.md"
  - "ai/context/ai-native.md"
  - "ai/context/platform-optimization.md"
dependencies:
  - "ai/skills/product-squad.md"
  - "docs/product-squad/goal-driven-delivery.md"
  - "docs/ai-starter-prompt-pack.md"
skip_reason: null
---

# PO-Orchestrated One-Shot Quality Design

## Summary

이 설계의 목적은 이 보일러플레이트가 one-shot 요청을 받았을 때도 평균적인 boilerplate 결과로 수렴하지 않고, 비즈니스 목표에 맞는 상용 서비스 수준의 판단을 더 안정적으로 하게 만드는 것입니다.

핵심 제안은 세 가지입니다.

- `po-role`을 canonical 역할로 추가해 goal packet completeness, 질문 강제, 구현 보류, 역할 간 충돌 정리를 맡긴다.
- one-shot 시작 프롬프트를 `질문 없는 생성`이 아니라 `한 번의 입력으로 최대한 전진하되 부족하면 시스템이 멈추고 보충하는 계약`으로 바꾼다.
- `pm-role` / `pd-role` / `fe-role` / `be-role`의 역할을 “분업”이 아니라 “실패 가능성을 먼저 드러내는 비평 게이트”로 강화한다.

이 설계는 별도 orchestration 서버나 전용 멀티에이전트 플랫폼을 만들지 않는다. 대신 repo 안 canonical 문서, prompt pack, skill, quality gate를 재정렬해 같은 품질 바를 강제한다.

## Problem

현재 시스템은 goal packet, role debate, browser evidence 같은 좋은 원칙을 이미 갖고 있다. 하지만 실제 one-shot 시작 순간에는 아래 문제가 남아 있다.

- 입력이 부족해도 구현이 너무 빨리 시작될 수 있다.
- `product-config-friendly` 기본 전략이 목표 달성보다 블록 재사용 쪽으로 기울 수 있다.
- PD 역할 정의가 “가벼운 UX 리뷰”에 머물러 상용 서비스 수준의 랜딩 비평을 충분히 강제하지 못한다.
- one-shot prompt는 repo 구조와 build order는 알려주지만, “commercial quality bar”를 명시적으로 집행하지 않는다.

그 결과는 다음과 같은 패턴으로 나타난다.

1. business idea가 들어온다.
2. 시스템이 빠르게 shape와 block 조합을 고른다.
3. 필요한 질문은 최소화되지만, 시각적 기준과 trust 근거가 충분히 고정되지 않는다.
4. 결과 화면은 동작은 하지만 상용 서비스처럼 느껴지지 않고, 유저가 몰라도 되는 워딩이 남는다.

이 문제의 본질은 “디자인 감각 부족”만이 아니다. 누가 멈추고, 무엇이 부족한지 선언하고, 구현을 보류할 권한을 가지는지가 비어 있는 운영 계약의 문제다.

## Goals

- one-shot 입력만으로 시작하더라도 business goal, target user, target moment, quality bar가 약하면 시스템이 질문으로 되돌아가게 만든다.
- `pm-role` / `pd-role` / `fe-role` / `be-role`이 각자 비즈니스 목표 관점에서 실패 가능성을 먼저 비평하게 만든다.
- 랜딩 같은 user-facing 결과물이 “상용 서비스처럼 보이는가”를 canonical quality gate 안에 포함한다.
- repo-local 문서와 skill만으로 같은 루프를 재현 가능하게 유지한다.

## Non-Goals

- 별도 orchestration 서버 구축
- 자동 subagent spawning 플랫폼
- 모든 요청에 브라우저 companion 강제
- 디자인 생성 모델을 붙여 시안을 자동으로 만드는 기능
- 역할 정의를 사람 조직도처럼 과도하게 복잡하게 만드는 것

## Proposed Operating Model

### 1. Add `po-role` as the first gate

`po-role`은 단순 PM 상위호환이 아니다. 이 역할은 “지금 구현해도 되는가”를 판정하는 orchestration owner다.

PO의 책임은 아래와 같다.

- 입력을 goal packet으로 정규화
- goal packet completeness를 판정
- 부족 정보가 있으면 질문을 강제
- `pm-role` / `pd-role` / `fe-role` / `be-role` 비평 라운드를 시작
- 역할 간 충돌이 있을 때 우선순위를 정리
- 설계 승인 전에는 구현을 보류

`po-role`은 항상 첫 번째 판정자이며, 중요한 작업에서 구현 시작 권한은 `po-role` 승인 이후에만 열린다.

### 2. Reframe one-shot as “kickoff + completion loop”

앞으로 one-shot은 “질문 없이 바로 만든다”가 아니라 아래 계약으로 정의한다.

- 좋은 입력이면 바로 role debate로 전진한다.
- 일부 정보가 비어 있으면 1~3개의 짧은 질문으로 보충한다.
- quality bar를 판단하기 어려울 정도로 정보가 부족하면 구현을 시작하지 않고 설계 단계로 되돌린다.

즉 시스템은 one-shot 지향이되, 부족한 입력을 억지로 채워 넣지 않는다.

### 3. Redefine the roles as critique gates

각 역할은 구현 담당이 아니라 “실패를 미리 드러내는 시각”을 가져야 한다.

- `pm-role`
  - business goal, target user, target moment, KPI, non-goals를 고정한다.
  - 핵심 행동을 하나로 좁히고, conversion을 흐리는 요소를 제거한다.
- `pd-role`
  - 기존 이름은 유지하되, 가벼운 UX 리뷰를 넘어 commercial landing critique까지 책임 범위를 확장한다.
  - first impression, hierarchy, trust, tone, density, CTA clarity를 비평한다.
  - 상용 서비스 같지 않음, boilerplate smell, 설명 과잉을 반려할 수 있다.
- `fe-role`
  - 디자인이 실제 화면, 상태 변화, responsive layout에서 살아남는지 본다.
  - 기존 block 재사용이 목표를 해치면 구조 변경 escalation을 제안한다.
- `be-role`
  - analytics, admin visibility, measurement interpretability를 본다.
  - 예뻐졌지만 무엇이 전환을 만들었는지 알 수 없는 상태를 반려한다.

### 4. Keep product-squad as the shell

`product-squad`는 제거하지 않는다. 다만 실제 operating sequence는 아래처럼 더 명확하게 바꾼다.

1. `po-role`: goal packet completeness check
2. `pm-role`: goal framing
3. `pd-role`: commercial quality critique
4. `fe-role` / `be-role`: build and measurement review
5. product-squad: synthesis and scorecard convergence

즉 `product-squad`는 shell이고, `po-role`이 gate owner가 된다.

## One-Shot Input Contract

중요한 작업의 one-shot 시작 시 내부적으로 아래 입력을 확보해야 한다.

- business goal
- target user
- target moment
- success metric
- non-goals
- constraints
- existing evidence
- visual bar

여기서 `visual bar`는 새 항목이다. 아래를 명시할 수 있어야 한다.

- 상용 서비스처럼 보여야 하는지
- trust를 어떤 근거로 세울지
- reference 또는 anti-reference가 있는지

### Completeness Levels

`po-role`은 입력을 세 단계로 분류한다.

- `ready`
  - goal packet과 visual bar가 충분하다.
  - role debate로 바로 간다.
- `needs-clarification`
  - 1~3개의 짧은 질문으로 채울 수 있다.
  - 구현 시작 전에 보충한다.
- `not-safe-to-build`
  - 이 상태로 구현하면 boilerplate 결과가 나올 가능성이 높다.
  - 설계/질문 단계로 되돌린다.

## Landing-Specific Quality Contract

랜딩은 일반 기능보다 더 강한 품질 바를 갖는다. 최소한 아래 다섯 가지 입력이 있어야 한다.

- primary conversion goal
- one-line value proposition
- trust source
- visual tone
- reference or anti-reference

### Landing critique questions

`pd-role`과 `pm-role`은 구현 전 아래 질문에 답해야 한다.

- 사용자가 3초 안에 “이 서비스가 무엇이고 왜 필요한지” 이해하는가
- hero 아래 정보가 CTA를 강화하는가
- trust 요소가 설명이 아니라 증거처럼 읽히는가
- 유저가 몰라도 되는 운영자 시선 문구가 전면에 있지 않은가
- mobile에서 정보 밀도가 과하지 않은가
- 기존 스타터 냄새가 시각적으로 남아 있지 않은가

하나라도 “아니오”면 `pd-role`은 반려할 수 있다.

## Canonical Doc Changes

### `docs/ai-starter-prompt-pack.md`

추가해야 할 내용

- one-shot 품질 계약
- 부족 정보 시 질문 강제
- 랜딩 작업 시 visual bar / reference / anti-reference 요구
- `pm-role` / `pd-role` / `fe-role` / `be-role` critique before coding
- block reuse is default, but business goal and quality bar outrank starter convenience

### `ai/skills/product-squad.md`

추가해야 할 내용

- `po-role`을 first gate로 명시
- 중요한 작업에서 goal packet completeness check를 먼저 수행
- role debate 순서와 sign-off rules 명시
- 설계 승인 전 구현 금지

### `docs/product-squad/goal-driven-delivery.md`

추가해야 할 내용

- visual bar를 goal packet 항목으로 승격
- landing-specific quality gate 신설
- role별 반려 기준
- “상용 서비스처럼 보이는가”를 browser evidence와 별개로 design critique 기준으로 기록

### `docs/product-squad/operating-model.md`

추가해야 할 내용

- product-squad shell과 `po-role` gate owner의 관계
- 중요한 작업의 default sequencing
- PO가 conflict resolver라는 점

### New canonical role doc

새 문서가 필요하다.

- `ai/skills/po-role.md`

이 문서는 아래를 정의해야 한다.

- role purpose
- required checks
- escalation rules
- approval and blocking authority
- handoff contract to `pm-role` / `pd-role` / `fe-role` / `be-role`

## Workflow

중요한 작업은 아래 순서로 진행한다.

1. user request intake
2. `po-role` goal packet normalization
3. completeness classification
4. clarification loop if needed
5. `pm-role` goal framing
6. `pd-role` commercial landing critique
7. `fe-role` / `be-role` viability review
8. design approval
9. work item/spec/plan
10. implementation
11. browser evidence + measurement review

핵심은 8번 전에는 코드 작업을 시작하지 않는다는 점이다.

## Quality Gates

### Goal Gate

- business goal과 success metric이 숫자 또는 해석 가능한 형태로 적혀 있다.
- target user와 target moment가 존재한다.
- non-goals와 constraints가 적혀 있다.

### Design Gate

- visual bar가 있다.
- 랜딩이라면 trust source와 reference/anti-reference가 있다.
- `pd-role` critique가 통과했다.

### Role Gate

- `pm-role`, `pd-role`, `fe-role`, `be-role`이 각자 “이대로 가면 실패하는 이유”를 먼저 적었다.
- unresolved conflict가 남지 않았다.

### Build Gate

- `po-role`이 구현 시작을 승인했다.
- 필요한 work item/spec/plan이 준비되었다.

## Acceptance Criteria

- starter prompt pack이 one-shot 시작 품질 계약을 explicit하게 포함한다.
- 중요한 작업에서 `po-role`이 first gate로 문서화된다.
- landing 작업에서 visual bar와 reference/anti-reference 질문이 기본 규칙이 된다.
- `pd-role`이 “commercial quality”와 “boilerplate smell”을 반려 근거로 사용할 수 있다.
- repo 안 canonical 문서만으로, 별도 orchestration 서비스 없이도 같은 루프를 재현할 수 있다.

## Risks

- 문서만 늘고 실제로 읽히지 않을 수 있다.
- `po-role`이 과하게 무거워져 속도를 해칠 수 있다.
- 역할이 많아졌지만 실질적인 sign-off authority가 약하면 다시 형식적인 체크리스트가 될 수 있다.

## Mitigations

- 역할 추가보다 gate authority를 더 명확하게 쓴다.
- one-shot 질문 수는 최소화하되, quality bar 판단에 필요한 정보는 생략하지 않는다.
- `po-role`, `pd-role`, `pm-role`의 반려 기준을 짧고 날카로운 문장으로 문서화한다.
- first implementation slice는 문서 변경부터 시작해 운영 계약이 실제로 강제되는지 검증한다.

## Recommended Next Plan

구현은 아래 순서로 계획한다.

1. starter prompt pack 강화
2. product-squad / goal-driven-delivery / operating-model 갱신
3. `po-role` 문서 추가
4. `pd-role` 정의를 commercial critique 중심으로 강화
5. 이후 실제 랜딩 작업에서 새 계약을 사용해 재설계
