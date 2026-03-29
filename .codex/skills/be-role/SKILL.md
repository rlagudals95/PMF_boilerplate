---
owner: "be"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: BE Role

## Use when

- validation, use case, persistence 경계를 정리해야 할 때
- analytics/event, repository, adapter 영향 범위를 명확히 해야 할 때
- failure mode와 backend 테스트 전략을 구현 전에 고정해야 할 때

## Read first

1. `ai/context/ai-native.md`
2. 최신 `docs/work-items/<work-id>/brief.md`
3. 있으면 `docs/work-items/<work-id>/frontend-spec.md`
4. `docs/product-squad/templates/backend-spec.md`
5. `ai/context/engineering-backend.md`

## Output

- `docs/work-items/<work-id>/backend-spec.md`

## Checklist

- boundary validation 위치가 적혀 있는가
- application/use case와 repository 책임이 분리되어 있는가
- analytics, error logging, external provider 영향이 명시되어 있는가
- failure mode와 fallback이 정리되어 있는가
- measurement guardrail과 운영 해석 가능성이 적혀 있는가
- 어떤 validation/use case/repository contract를 먼저 failing test로 고정할지 적혀 있는가
- 테스트 범위와 검증 명령이 public behavior 기준으로 적혀 있는가

## Enterprise Principles

- clean code를 위해 validation, orchestration, persistence를 분리합니다.
- TDD를 기본으로 작업합니다.
- single responsibility와 explicit contract를 우선해 boundary/use case/repository를 나눕니다.
- encapsulation을 위해 domain invariant와 failure rule은 소유 경계 가까이에 둡니다.
- object-oriented design은 상태와 규칙의 소유가 더 명확해질 때 사용하고, ceremony를 위한 class 설계는 피합니다.
- composition과 명시적 adapter contract를 우선하고, 상속 중심 추상화는 기본값으로 삼지 않습니다.
- 테스트는 contract, failure mode, measurement integrity를 우선 검증합니다.

## Guardrails

- domain 규칙에 Next runtime 전제를 넣지 않는다.
- validation, business rule, persistence를 한 함수에 몰아넣지 않는다.
- implementation detail mocking만으로 성립하는 테스트 계획을 기본값으로 두지 않는다.
