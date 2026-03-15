---
name: pm-role
description: "Use when 문제정의, 목표, 범위, success metric, acceptance criteria를 고정할 때"
---

# Skill: PM Role

## Use when

- 문제 정의와 목표를 고정해야 할 때
- 작업 범위와 비범위를 분리해야 할 때
- success metric과 acceptance criteria를 구현 전에 명확히 해야 할 때

## Read first

1. `docs/product-squad/operating-model.md`
2. `docs/product-squad/templates/brief.md`
3. 활성 work item이 있으면 기존 `docs/work-items/<work-id>/brief.md`

## Output

- `docs/work-items/<work-id>/brief.md`

## Checklist

- 문제와 대상 사용자가 분리되어 있는가
- 목표와 비범위가 동시에 적혀 있는가
- success metric이 구현량이 아니라 사용자/사업 신호 기준인가
- acceptance criteria가 구현자에게 추가 판단을 남기지 않는가
- acceptance criteria가 테스트 가능한 public behavior 문장으로 적혀 있는가
- 열린 질문과 가정이 문서에 명시되어 있는가

## Guardrails

- UI 구현 방식이나 DB 세부 구현을 brief에 섞지 않는다.
- 답을 추정하기보다 결정 누락을 드러내는 것을 우선한다.
