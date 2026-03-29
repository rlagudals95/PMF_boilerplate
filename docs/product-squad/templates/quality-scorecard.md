---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: draft
owner_role: product-squad
source_request: ""
affected_paths: []
dependencies: []
skip_reason: null
---

# Quality Scorecard

## Goal Fit

<!-- 이 변경이 어떤 business goal과 success metric을 직접 움직이는지 적습니다. -->

-

## Product Risks To Kill

-

## Review Checklist

- [ ] primary business goal과 success metric이 이 변경과 연결된다
- [ ] risky boundary test evidence가 있거나 skip reason이 명시되어 있다
- [ ] 역할별 산출물이 enterprise principles를 따른다
- [ ] 사용자에게 가장 중요한 CTA와 value proposition이 분명하거나 non-user-facing 범위라고 적혀 있다
- [ ] trust, error, empty, pending state 또는 관련 skip reason이 검토되었다
- [ ] analytics/admin visibility 또는 운영 해석 근거가 있어 결과를 해석할 수 있다
- [ ] docs/spec sync가 확인되었다
- [ ] fresh `pnpm verify` 또는 `pnpm verify:full` 결과가 있다
- [ ] responsive + accessibility + browser QA evidence가 `docs/work-items/<work-id>/browser-qa.md`로 정리되었거나 non-user-facing skip reason이 있다

## Browser QA Evidence

<!--
  user-facing work라면 `docs/work-items/<work-id>/browser-qa.md`를 참조해
  desktop/mobile, happy path, error/empty/pending, focus/accessibility evidence를 적습니다.
  non-user-facing work라면 browser QA skip reason을 명시합니다.
-->

-

## Code Quality Evidence

<!-- boundary test, type/lint/test, 구조 경계 유지 근거를 적습니다. -->

-

## Principle Adherence

-

## Docs And Spec Sync

<!-- 함께 갱신한 canonical/task-local 문서를 적습니다. -->

-

## Verification Evidence

<!-- `pnpm repo:check --work <work-id>`, `pnpm squad:check <work-id>`, `pnpm verify` 또는 `pnpm verify:full` 결과를 적습니다. -->

-

## Measurement And Ops Checks

-

## Release Recommendation

-
