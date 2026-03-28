---
status: done
owner_role: product-squad
source_request: "자연어 비즈니스 프롬프트 하나로 recipe를 고르고 PRD/work item까지 여는 prompt-first mvp starter 추가"
affected_paths:
  - scripts/create-mvp-starter.mjs
  - README.md
  - docs/start-your-mvp.md
  - docs/prds/README.md
  - docs/work-items/README.md
dependencies:
  - docs/work-items/20260328-prompt-first-mvp-starter/brief.md
  - docs/work-items/20260328-prompt-first-mvp-starter/backend-spec.md
skip_reason: null
---

# Quality Scorecard

## Goal Fit

- prompt-first starter는 "기능이 많은 boilerplate"를 "비즈니스 목표를 받아 적절한 MVP 흐름을 열어주는 kit"로 더 가깝게 만든다.
- 사용자는 goal packet 구조를 몰라도 one-shot prompt로 첫 문서 세트를 만들 수 있어야 한다.

## Product Risks To Kill

- 사용자에게 어떤 흐름을 먼저 켜야 하는지 다시 해석 부담이 남는 문제
- prompt가 들어와도 recipe/active flows가 안 보이면 여전히 기능 중심 boilerplate처럼 느껴지는 문제
- 새 PRD section 때문에 `feature:new` downstream parser가 깨지는 문제

## Review Checklist

- [x] primary business goal과 success metric이 이 변경과 연결된다
- [x] 사용자에게 가장 중요한 CTA와 value proposition이 분명하다
- [x] trust, error, empty, pending state가 검토되었다
- [x] analytics/admin visibility가 있어 결과를 해석할 수 있다
- [x] responsive + accessibility + browser QA evidence가 있다

## Browser QA Evidence

- browser QA 대상 아님
- README 및 starter docs의 시작 동선은 텍스트 리뷰로 확인 완료

## Measurement And Ops Checks

- `pnpm mvp:new rental-support-match --prompt "나는 렌탈 지원금을 비교해주는 사이트를 만들고 싶고 최종 목표는 렌탈사로 보내는 게 목표야" --dry-run` 통과
- `pnpm mvp:new inbox-copilot --goal "반복 문의에 대한 첫 응답 시간을 줄인다" --audience "운영팀과 고객 성공 담당자" --offer "반복 문의를 AI 초안으로 정리해 주는 inbox assistant" --signal "first_response_time_reduction >= 30% within 14 days" --dry-run` 통과
- temp workspace smoke run에서 `pnpm mvp:new rental-support-match --prompt "..."` 실행 후 PRD와 work item 생성 확인
- `pnpm ai:sync` 통과
- `pnpm verify` 통과
- `pnpm squad:check --work 20260328-prompt-first-mvp-starter` 통과

## Release Recommendation

- `ship`
