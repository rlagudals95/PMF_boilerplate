---
status: approved
owner_role: pd
source_request: "Cursor/Claude Code/Codex에서 공통으로 쓸 MVP starter prompt를 비교 평가하는 기준과 템플릿 추가"
affected_paths:
  - README.md
  - docs/start-your-mvp.md
  - docs/mvp-starter-prompt-evaluation.md
dependencies:
  - docs/work-items/20260328-prompt-evaluation-framework/brief.md
skip_reason: null
---

# UX Review

## Goal Alignment

- 이 변경의 목적은 더 많은 프롬프트를 나열하는 것이 아니라, 어떤 prompt를 기본값으로 추천할지 판단 기준을 주는 것이다.
- 따라서 문서 구조는 `프롬프트 모음`보다 `언제 어떤 prompt를 쓰고, 어떻게 비교해 채택할지`가 먼저 보이게 해야 한다.

## Entry Points

- README의 `Using AI Tools`
- `docs/start-your-mvp.md`
- 새 canonical 평가 문서

## Copy Changes

- 평가 문서는 도구 홍보 톤이 아니라 실험 프로토콜 톤으로 쓴다.
- score 항목 이름은 짧고 명확해야 하며, evaluator가 같은 의미로 해석할 수 있어야 한다.

## IA Changes

- `short prompt`, `full prompt`, `CLI prompt`를 분리한다.
- 시나리오, scoring rubric, decision rule, report template 순으로 읽게 만든다.

## Primary CTA And Trust

- primary CTA는 `이 프롬프트를 바로 써봐라`보다 `이 기준으로 비교해라`가 되어야 한다.
- trust는 평가 결과가 repo 안 report로 남는다는 점에서 나온다.

## Happy Path

- evaluator가 시나리오 하나를 고른다.
- 같은 repo 상태에서 같은 prompt variant를 여러 도구에 넣는다.
- 결과를 template로 기록한다.
- 점수와 notes를 보고 기본 prompt를 유지하거나 교체한다.

## Edge States

- 한 도구가 추가 질문을 많이 하면 clarification overhead 항목으로 벌점을 준다.
- command는 맞았지만 산출물이 부족하면 artifact completeness 항목에서 낮게 본다.
- 도구 특성상 더 잘하는 부분이 있어도, vendor-specific 문법 의존이 크면 portability 점수는 낮다.

## Accessibility Checks

- 표와 체크리스트는 한 화면에서 빠르게 스캔 가능해야 한다.
- score rubric은 1~5 의미가 명확해야 한다.

## Browser QA Plan

- browser QA 대상 아님
- 문서 스캔성과 링크 연결만 텍스트 리뷰로 확인한다.
