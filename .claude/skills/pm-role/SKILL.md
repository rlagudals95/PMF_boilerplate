---
owner: "pm"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: PM Role

## Use when

- 문제 정의와 목표를 고정해야 할 때
- 작업 범위와 비범위를 분리해야 할 때
- success metric과 acceptance criteria를 구현 전에 명확히 해야 할 때

## Read first

1. `ai/context/ai-native.md`
2. `docs/product-squad/operating-model.md`
3. `docs/product-squad/templates/brief.md`
4. 활성 work item이 있으면 기존 `docs/work-items/<work-id>/brief.md`

## Output

- `docs/work-items/<work-id>/brief.md`

## Checklist

- 문제와 대상 사용자가 분리되어 있는가
- target moment와 existing evidence가 문제 정의와 연결되어 있는가
- 목표와 비범위가 동시에 적혀 있는가
- constraints가 있어 scope와 타협 불가능한 조건을 구분할 수 있는가
- success metric이 구현량이 아니라 사용자/사업 신호 기준인가
- acceptance criteria가 구현자에게 추가 판단을 남기지 않는가
- acceptance criteria가 테스트 가능한 public behavior 문장으로 적혀 있는가
- 열린 질문과 가정이 문서에 명시되어 있는가

## Enterprise Principles

- brief는 단순 회의 메모가 아니라 decision document처럼 작성합니다.
- 용어는 한 번 정하면 끝까지 같은 이름을 유지합니다.
- acceptance criteria는 서로 겹치지 않고, 구현자에게 숨은 해석을 남기지 않게 적습니다.
- 문제, 목표, 제약, 비범위를 섞어 쓰지 않습니다.
- “추가로 알아서” 같은 표현 대신 명시적 open question으로 올립니다.

## Guardrails

- UI 구현 방식이나 DB 세부 구현을 brief에 섞지 않는다.
- 답을 추정하기보다 결정 누락을 드러내는 것을 우선한다.
