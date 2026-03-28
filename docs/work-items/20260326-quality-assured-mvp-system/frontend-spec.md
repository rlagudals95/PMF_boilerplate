---
status: approved
owner_role: fe
source_request: "속도는 물론 비개발/개발 직군 상관없이 퀄리티가 보장되는 시스템을 고려해 작업"
affected_paths:
  - apps/web/src/lib/product-config.ts
  - apps/web/src/lib/product-config.test.ts
  - apps/web/src/lib/app-config.ts
  - apps/web/src/app/layout.tsx
  - apps/web/src/shared/ui/site-header.tsx
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - apps/web/src/modules/lead/ui/lead-capture-form.tsx
  - apps/web/src/modules/consultation/ui/consult-page.tsx
  - apps/web/src/modules/consultation/ui/consultation-request-form.tsx
dependencies:
  - docs/work-items/20260326-quality-assured-mvp-system/brief.md
  - docs/work-items/20260326-quality-assured-mvp-system/ux-review.md
skip_reason: null
---

# Frontend Spec

## Affected Routes

- `/`
- `/consult`
- app layout / shared header

## Module Targets

- `apps/web/src/lib/product-config.ts`
- `apps/web/src/modules/landing/ui/landing-page.tsx`
- `apps/web/src/modules/lead/ui/lead-capture-form.tsx`
- `apps/web/src/modules/consultation/ui/consult-page.tsx`
- `apps/web/src/modules/consultation/ui/consultation-request-form.tsx`
- `apps/web/src/shared/ui/site-header.tsx`

## Component Plan

- product-facing copy를 `product-config.ts`에 모은다.
- 헤더, footer metadata, landing hero, lead form, consultation surface가 config를 읽도록 변경한다.
- quality signal이 빠졌을 때 fail-fast하는 validation과 test를 추가한다.

## State And Events

- 신규 client state는 추가하지 않는다.
- 기존 submit action과 tracking event는 그대로 유지하고 UI copy source만 이동한다.
- header CTA 목적지를 제품 목표와 맞는 consult flow로 조정한다.

## Instrumentation Hooks

- 새 analytics event는 추가하지 않는다.
- 기존 `TrackedLink`와 form submit tracking은 유지한다.
- 이번 슬라이스의 측정은 copy surface centralization과 verify 성공 여부다.

## Test-First Plan

- 먼저 failing test로 고정할 behavior slice
  - product config에 필수 품질 surface가 비어 있으면 validation이 실패해야 한다
- 어떤 module/model/action/route 경계를 검증할지
  - `apps/web/src/lib/product-config.ts`와 `apps/web/src/lib/product-config.test.ts`
- manual verify가 필요한 UI 상태가 무엇인지
  - header CTA, landing hero copy, lead form label, consultation form label 일관성

## Manual Browser QA

- header title/description/CTA가 제품 목적과 맞는지
- landing hero badge, title, highlight가 현재 제품 언어를 쓰는지
- lead form과 consultation form의 label/placeholder/consent가 제품 문맥과 맞는지
- mobile에서 CTA와 consent 문구가 깨지지 않는지

## Out Of Scope

- recipe library와 multi-product switcher
- admin metric 재설계
- backend schema 변경
