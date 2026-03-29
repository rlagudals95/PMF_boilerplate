---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: product-squad
source_request: "Cursor/Claude Code/Codex에서 공통으로 쓸 MVP starter prompt를 비교 평가하는 기준과 템플릿 추가"
affected_paths:
  - README.md
  - docs/start-your-mvp.md
  - docs/mvp-starter-prompt-evaluation.md
  - docs/templates/prompt-evaluation-report.md
dependencies:
  - docs/work-items/20260328-prompt-evaluation-framework/brief.md
skip_reason: null
---

# Quality Scorecard

## Goal Fit

- 이 변경은 prompt를 더 많이 만드는 것이 아니라, 어떤 prompt가 기본값으로 적합한지 반복 가능하게 판단하게 만든다.
- 평가 문서가 있으면 tool compatibility와 output quality를 같은 기준으로 비교할 수 있다.

## Product Risks To Kill

- prompt 개선이 개인 취향이나 최근 성공 사례에만 의존하는 문제
- 도구별 차이를 논할 때 공통 기준이 없어 대화가 공전하는 문제
- README에 프롬프트는 있는데 왜 그 프롬프트를 추천하는지 근거가 없는 문제

## Review Checklist

- [x] primary business goal과 success metric이 이 변경과 연결된다
- [x] 사용자에게 가장 중요한 CTA와 value proposition이 분명하다
- [x] trust, error, empty, pending state가 검토되었다
- [x] analytics/admin visibility가 있어 결과를 해석할 수 있다
- [x] responsive + accessibility + browser QA evidence가 있다

## Browser QA Evidence

- browser QA 대상 아님
- 문서 링크와 텍스트 스캔성 확인 완료

## Measurement And Ops Checks

- 새 canonical 평가 문서가 prompt variants, scenarios, scoring rubric, decision rule을 포함하는지 확인
- report template가 실제 기록용으로 충분한지 확인
- README/start guide에서 평가 문서로 이동 가능한지 확인
- `pnpm squad:check --work 20260328-prompt-evaluation-framework` 통과

## Release Recommendation

- `ship`
