---
status: approved
owner_role: pm
source_request: "속도는 물론 비개발/개발 직군 상관없이 퀄리티가 보장되는 시스템을 고려해 작업"
affected_paths:
  - apps/web/src/lib/product-config.ts
  - apps/web/src/lib/app-config.ts
  - apps/web/src/app/layout.tsx
  - apps/web/src/shared/ui/site-header.tsx
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - apps/web/src/modules/lead/ui/lead-capture-form.tsx
  - apps/web/src/modules/consultation/ui/consult-page.tsx
  - apps/web/src/modules/consultation/ui/consultation-request-form.tsx
  - ai/context/project.md
  - ai/context/engineering-frontend.md
  - docs/architecture.md
  - docs/product-config-system.md
dependencies:
  - docs/product-squad/goal-driven-delivery.md
  - docs/product-squad/operating-model.md
skip_reason: null
---

# Brief

## Problem

- 현재 저장소는 구조와 검증 루프는 강하지만, 제품별 copy와 신뢰 surface가 여러 TSX 파일에 흩어져 있어 비개발직군이 안전하게 바꾸기 어렵다.
- 그 결과 PRD와 business goal은 좋아도 실제 랜딩, 리드 폼, 상담 폼, 헤더 메타데이터가 서로 다른 제품 언어를 말할 수 있다.
- 속도만 빠른 보일러플레이트가 아니라 역할과 숙련도에 상관없이 일정 품질을 보장하는 시스템으로 가려면 typed product surface와 최소 품질 가드레일이 먼저 필요하다.

## Target User

- AI와 함께 빠르게 MVP를 만드는 1인 창업자
- 개발자가 아니더라도 business goal과 제품 문구를 직접 다듬고 싶은 운영자, PM, PD
- 구조를 버리지 않고 실험 속도를 유지하려는 개발자

## Goal

- 제품별 헤더, hero, trust, form copy를 한 곳에서 관리하는 `product-config` surface를 추가한다.
- 랜딩, 리드, 상담 흐름이 같은 제품 언어를 쓰도록 맞춘다.
- 최소 품질 기준이 빠졌을 때 테스트에서 빨리 실패하게 만든다.

## Constraints

- 단일 `apps/web` 구조와 현재 모듈 경계를 유지한다.
- CMS나 무거운 no-code builder는 추가하지 않는다.
- schema, repository, analytics taxonomy는 이번 턴에서 크게 넓히지 않는다.
- 첫 슬라이스는 copy/trust/form surface의 centralization에 집중한다.

## Non-Goals

- 다중 제품 런타임 스위처
- 완전 no-code product builder
- recipe library 전체 자동 생성
- backend schema와 admin metric 재설계
- hosted builder 전용 export 시스템

## Success Metric

- 제품 카피를 바꾸려면 우선 `apps/web/src/lib/product-config.ts`를 수정하는 흐름이 생긴다.
- 헤더, 메타데이터, 랜딩 hero, 리드 폼, 상담 폼이 같은 product surface를 읽는다.
- 핵심 품질 surface가 비어 있으면 테스트에서 실패한다.
- canonical 문서가 새 product-config surface를 설명한다.

## Acceptance Criteria

- [ ] `apps/web/src/lib/product-config.ts`가 현재 활성 제품의 copy, trust, quality signal source of truth 역할을 한다.
- [ ] 헤더, footer metadata, landing hero, lead form, consultation surface가 이 config를 읽는다.
- [ ] hero highlight, consultation benefit, trust signal, primary metric 최소 개수를 validation/test로 검증한다.
- [ ] 문서가 `product-config`를 비개발직군-friendly editing surface로 설명한다.

## Open Questions

- 다음 단계에서 `mvp:new` generator까지 연결할지 여부
- future recipe system을 별도 config layer로 둘지 여부
