---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: product-squad
source_request: "속도는 물론 비개발/개발 직군 상관없이 퀄리티가 보장되는 시스템을 고려해 작업"
affected_paths:
  - apps/web/src/lib/product-config.ts
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - apps/web/src/modules/lead/ui/lead-capture-form.tsx
  - apps/web/src/modules/consultation/ui/*
dependencies:
  - docs/work-items/20260326-quality-assured-mvp-system/brief.md
  - docs/work-items/20260326-quality-assured-mvp-system/frontend-spec.md
skip_reason: null
---

# Quality Scorecard

## Goal Fit

- 제품 copy와 trust surface를 단일 config로 올려 비개발직군도 더 안전하게 제품화할 수 있는 기반을 만든다.
- 랜딩, 리드, 상담 흐름이 같은 제품 언어를 쓰게 해 PRD와 실제 UI의 간극을 줄인다.

## Product Risks To Kill

- generic header/landing copy와 productized form copy가 어긋나는 문제
- 비개발직군이 어디를 수정해야 할지 몰라 raw TSX를 직접 만지는 문제
- 최소 trust signal과 metric surface가 빠져도 눈치채기 어려운 문제

## Review Checklist

- [ ] primary business goal과 success metric이 이 변경과 연결된다
- [ ] 사용자에게 가장 중요한 CTA와 value proposition이 분명하다
- [ ] trust, error, empty, pending state가 검토되었다
- [ ] analytics/admin visibility가 있어 결과를 해석할 수 있다
- [ ] responsive + accessibility + browser QA evidence가 있다

## Browser QA Evidence

- 이번 턴에서는 browser QA를 실제 실행하지 않았다.
- code-level evidence는 `pnpm verify` 통과와 `pnpm squad:check --work 20260326-quality-assured-mvp-system` 통과다.
- 다음 턴 또는 release 전 desktop/mobile에서 header, landing, lead, consultation surface를 확인해야 한다.

## Measurement And Ops Checks

- `pnpm verify` 통과
- `pnpm squad:check --work 20260326-quality-assured-mvp-system` 통과
- `src/lib/product-config.test.ts` 추가로 필수 quality surface validation 확인
- 기존 analytics wiring과 form submit 흐름은 type/test 기준으로 유지 확인

## Release Recommendation

- `iterate`
- 이유: 문서/타입/테스트 품질 게이트는 통과했지만 user-facing copy 변경에 대한 browser QA evidence가 아직 없다.
