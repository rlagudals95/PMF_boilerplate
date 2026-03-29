---
owner: "pm"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: pm
source_request: "Cursor/Claude Code/Codex에서 공통으로 쓸 MVP starter prompt를 비교 평가하는 기준과 템플릿 추가"
affected_paths:
  - README.md
  - docs/start-your-mvp.md
  - docs/mvp-starter-prompt-evaluation.md
  - docs/templates/prompt-evaluation-report.md
dependencies:
  - docs/start-your-mvp.md
  - docs/product-squad/goal-driven-delivery.md
skip_reason: null
---

# Brief

## Problem

- 현재 README와 starter 문서에는 유용한 프롬프트가 들어가 있지만, 어떤 프롬프트가 더 잘 작동하는지 비교하는 기준은 없다.
- 그래서 prompt를 추가하거나 바꿔도 `좋아 보인다` 수준의 판단에 머무르기 쉽고, Cursor/Claude Code/Codex 사이에서 실제 호환성과 안정성을 추적하기 어렵다.
- prompt pack이 늘어날수록 어떤 것을 기본값으로 추천할지, 언제 짧은 프롬프트를 쓰고 언제 풀 프롬프트를 써야 할지 근거가 필요하다.

## Target User

- 이 boilerplate를 여러 AI 코딩 툴과 함께 쓰는 창업자나 개발자
- README에 있는 starter prompt를 관리하거나 개선하려는 maintainer
- 프롬프트 품질을 감이 아니라 반복 가능한 기준으로 비교하고 싶은 팀

## Goal

- MVP starter prompt를 비교 평가하는 canonical 기준 문서를 추가한다.
- 프롬프트 후보, 테스트 시나리오, 점수표, report template를 repo 안에 남긴다.
- 이후 prompt를 바꿀 때 `왜 기본 prompt가 바뀌었는지`를 근거 있게 설명할 수 있게 만든다.

## Constraints

- 특정 도구 vendor에 종속된 prompt 문법이나 API를 전제로 하지 않는다.
- 평가 기준은 repo 안 산출물 중심이어야 한다.
- 첫 버전은 문서와 템플릿에 집중하고, 자동 채점 시스템은 넣지 않는다.
- 기존 starter prompt와 `mvp:new` 흐름은 유지한다.

## Non-Goals

- 자동 benchmark runner
- 각 AI 도구의 내부 세션/SDK 연동
- 프롬프트 실험 결과를 DB나 외부 SaaS에 저장하는 시스템
- 도구별 전용 프롬프트를 각각 최적화하는 작업

## Success Metric

- evaluator가 같은 시나리오로 Cursor/Claude Code/Codex를 비교할 수 있는 문서가 생긴다.
- prompt 변경 시 어떤 기준으로 `ship | iterate | reject`할지 repo 문서만 보고 이해할 수 있다.
- README 또는 starter 문서에서 prompt tuning 문서로 자연스럽게 이동할 수 있다.

## Acceptance Criteria

- [ ] canonical 평가 문서가 prompt 후보, 시나리오, 점수표, 판정 기준을 포함한다.
- [ ] prompt 평가 결과를 기록할 수 있는 report template가 추가된다.
- [ ] README 또는 `docs/start-your-mvp.md`가 평가 문서로 연결된다.
- [ ] 문서만 읽어도 같은 조건으로 프롬프트 비교 실험을 재현할 수 있다.

## Open Questions

- 평가 시나리오를 몇 개까지 canonical로 유지할지 여부
- 도구별 차이를 별도 섹션으로 기록할지, report에서만 기록할지 여부
- 후속 버전에서 반자동 scoring 체크리스트를 CLI로 만들지 여부
