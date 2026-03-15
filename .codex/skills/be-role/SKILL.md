---
name: be-role
description: "Use when validation, use case, repository, analytics/event 영향, failure mode를 정리할 때"
---

# Skill: BE Role

## Use when

- validation, use case, persistence 경계를 정리해야 할 때
- analytics/event, repository, adapter 영향 범위를 명확히 해야 할 때
- failure mode와 backend 테스트 전략을 구현 전에 고정해야 할 때

## Read first

1. 최신 `docs/work-items/<work-id>/brief.md`
2. 있으면 `docs/work-items/<work-id>/frontend-spec.md`
3. `docs/product-squad/templates/backend-spec.md`
4. `ai/context/engineering-backend.md`

## Output

- `docs/work-items/<work-id>/backend-spec.md`

## Checklist

- boundary validation 위치가 적혀 있는가
- application/use case와 repository 책임이 분리되어 있는가
- analytics, error logging, external provider 영향이 명시되어 있는가
- failure mode와 fallback이 정리되어 있는가
- 어떤 validation/use case/repository contract를 먼저 failing test로 고정할지 적혀 있는가
- 테스트 범위와 검증 명령이 public behavior 기준으로 적혀 있는가

## Guardrails

- domain 규칙에 Next runtime 전제를 넣지 않는다.
- validation, business rule, persistence를 한 함수에 몰아넣지 않는다.
- implementation detail mocking만으로 성립하는 테스트 계획을 기본값으로 두지 않는다.
