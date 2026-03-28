---
status: approved
owner_role: pd
source_request: "속도는 물론 비개발/개발 직군 상관없이 퀄리티가 보장되는 시스템을 고려해 작업"
affected_paths:
  - apps/web/src/shared/ui/site-header.tsx
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - apps/web/src/modules/lead/ui/lead-capture-form.tsx
  - apps/web/src/modules/consultation/ui/consult-page.tsx
  - apps/web/src/modules/consultation/ui/consultation-request-form.tsx
dependencies:
  - docs/work-items/20260326-quality-assured-mvp-system/brief.md
skip_reason: null
---

# UX Review

## Goal Alignment

- 제품의 핵심 문구를 한 곳에서 관리하면 PRD와 실제 화면 언어가 어긋날 가능성이 줄어든다.
- 비개발직군은 구조를 이해하지 못해도 copy와 trust surface를 더 안전하게 다룰 수 있어야 한다.

## Entry Points

- sticky header
- landing hero
- lead capture form
- consultation intro
- consultation request form

## Copy Changes

- generic한 `PMF Boilerplate` 중심 문구를 현재 제품 맥락이 보이는 문구로 이동한다.
- 랜딩, 폼, 상담 흐름이 같은 제품 언어를 쓰도록 정렬한다.
- 헤더 primary CTA는 제품 목표와 같은 방향의 흐름으로 연결한다.

## IA Changes

- IA 자체를 크게 바꾸지 않고, user-facing product surface의 source of truth만 `product-config`로 이동한다.

## Primary CTA And Trust

- primary CTA는 제품의 다음 강한 신호 흐름과 연결되어야 한다.
- trust는 hero highlight, consultation benefit, quality signal 세 곳에서 반복 확인 가능해야 한다.

## Happy Path

- 운영자나 비개발 사용자가 `product-config.ts` 한 파일만 읽어도 주요 카피와 폼 문구를 바꿀 수 있다.
- 화면을 열었을 때 헤더, 랜딩, 폼 문구가 같은 제품을 설명한다.

## Edge States

- 필수 문구나 trust signal이 비어 있으면 테스트가 실패해야 한다.
- 상담/리드 제출 실패 상태의 사용자 메시지는 기존 흐름을 유지한다.

## Accessibility Checks

- label과 placeholder 관계를 그대로 유지한다.
- CTA 텍스트 변경 후에도 keyboard flow와 form semantics는 유지한다.

## Browser QA Plan

- desktop에서 헤더, hero, lead form, consultation page copy가 일관적인지 확인한다.
- mobile에서 hero, form CTA, consent 문구 줄바꿈과 가독성을 확인한다.
- header primary CTA가 의도한 경로로 이동하는지 확인한다.
