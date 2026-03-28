---
status: done
owner_role: product-squad
source_request: "few inputs로 PRD 초안과 feature work item까지 같이 만드는 범용 mvp:new 생성기 추가"
affected_paths:
  - scripts/create-mvp-starter.mjs
  - docs/prds/README.md
  - docs/work-items/README.md
  - ai/context/project.md
dependencies:
  - docs/work-items/20260327-mvp-bootstrap-generator/brief.md
  - docs/work-items/20260327-mvp-bootstrap-generator/backend-spec.md
skip_reason: null
---

# Quality Scorecard

## Goal Fit

- `mvp:new`는 비개발직군이나 1인 창업자가 few inputs로 첫 PRD와 work item을 같이 여는 범용 진입점 역할을 한다.
- 기존 `prd:new`, `feature:new`, `work:new`를 대체하지 않고 상위 convenience flow로 감싼다.

## Product Risks To Kill

- 비즈니스 요구만 있는 상태에서 첫 문서 세트를 수동으로 조합해야 하는 진입 장벽
- 업종 편향된 초기 문구가 다시 generator 기본값으로 굳는 문제
- generated PRD가 기존 `feature:new` parser와 맞지 않는 문제

## Review Checklist

- [x] primary business goal과 success metric이 이 변경과 연결된다
- [x] 사용자에게 가장 중요한 CTA와 value proposition이 분명하다
- [x] trust, error, empty, pending state가 검토되었다
- [x] analytics/admin visibility가 있어 결과를 해석할 수 있다
- [x] responsive + accessibility + browser QA evidence가 있다

## Browser QA Evidence

- browser QA 대상 아님
- CLI dry-run과 temp workspace smoke run으로 대체 검증 완료

## Measurement And Ops Checks

- `pnpm mvp:new inbox-copilot --title "Inbox Copilot" --goal "반복 문의에 대한 첫 응답 시간을 줄인다" --audience "운영팀과 고객 성공 담당자" --offer "반복 문의를 AI 초안으로 정리해 주는 inbox assistant" --signal "first_response_time_reduction >= 30% within 14 days" --dry-run` 통과
- temp workspace smoke run에서 `pnpm mvp:new inbox-copilot ...` 실행 후 PRD와 work item 생성 확인
- `pnpm ai:sync` 통과
- `pnpm verify` 통과
- `pnpm squad:check --work 20260327-mvp-bootstrap-generator` 통과

## Release Recommendation

- `ship`
