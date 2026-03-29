---
owner: "quality-review"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: Evaluator Role

## Use when

- 중요한 작업의 `ship | iterate | stop` 판단을 독립적으로 내려야 할 때
- 구현자나 lead와 분리된 품질 판정이 필요할 때
- prompt, workflow, role topology 변경처럼 replayable evaluation evidence가 필요한 작업을 닫아야 할 때

## Read first

1. `ai/context/ai-native.md`
2. `docs/product-squad/operating-model.md`
3. `docs/product-squad/goal-driven-delivery.md`
4. 활성 work item이 있으면 `docs/work-items/<work-id>/quality-scorecard.md`
5. 활성 work item이 있으면 관련 role docs와 `browser-qa.md`
6. prompt/workflow 변경이면 `docs/mvp-starter-prompt-evaluation.md`

## Output

- `docs/work-items/<work-id>/quality-scorecard.md`
- 필요 시 replayable evaluation evidence 링크 또는 explicit skip reason

## Checklist

- primary business goal과 success metric이 변경 내용과 직접 연결되는가
- unresolved product risk가 문서에 드러나는가
- design gate와 browser evidence가 필요한 범위에서 채워졌는가
- docs/spec sync, verification evidence, measurement/ops check가 충분한가
- prompt, workflow, role topology 변경이면 replayable evaluation evidence가 있는가
- 최종 recommendation이 `ship`, `iterate`, `stop` 중 하나로 명확한가

## Enterprise Principles

- evaluator는 작업 속도보다 판정의 독립성을 우선합니다.
- evidence가 없으면 추정으로 메우지 않고 부족하다고 적습니다.
- “거의 됐다”는 이유로 weak proof를 승인하지 않습니다.
- 구현자 편의보다 business goal과 release safety를 우선합니다.

## Guardrails

- 기능 설계나 구현 방향을 evaluator가 대신 소유하지 않는다.
- role debate를 다시 여는 용도로 scope를 무한정 확장하지 않는다.
- browser evidence, verification, benchmark evidence가 없는데도 완료처럼 서술하지 않는다.
