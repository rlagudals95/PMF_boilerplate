---
status: "draft"
owner_role: "fe"
source_request: "PRD: docs/prds/modurent-demand-validation.md"
affected_paths:
  - "apps/web/src/app/page.tsx"
  - "apps/web/src/app/consult/*"
  - "apps/web/src/app/admin/*"
  - "apps/web/src/app/admin/leads/*"
  - "apps/web/src/modules/lead/*"
  - "apps/web/src/modules/admin/*"
  - "packages/core/*"
  - "packages/db/*"
  - "packages/analytics/*"
  - "apps/web/src/lib/analytics.ts"
dependencies:
  - "docs/prds/modurent-demand-validation.md"
skip_reason: null
---

# Frontend Spec

## Affected Routes

- /
- /consult
- /admin
- /admin/leads

## Module Targets

- apps/web/src/modules/lead/*

## Component Plan

- 기능 전용 UI와 상태는 `apps/web/src/modules/lead` 아래에 둔다.
- Route entry는 얇게 유지하고 module UI를 조합만 하게 한다.
- 관리자 화면 영향이 있으면 기존 admin shell과 nav 구조를 재사용한다.

## State And Events

- client/server 경계는 route 제약이 아니라 실제 상호작용 필요성 기준으로 나눈다.
- 필수 이벤트는 feature submit 또는 state transition 시점에만 남긴다.
- 주요 상태 전이는 /, /consult, /admin, /admin/leads 경로 기준으로 정리한다.

## Test Plan

- 새 또는 변경된 route의 happy path를 수동 검증한다.
- 이벤트가 중복 없이 필요한 시점에만 기록되는지 확인한다.
- 오류 상태, 빈 상태, pending 상태를 확인한다.

## Out Of Scope

- 결제 성공 자체를 PMF 판단의 핵심 기준으로 삼는 것
- 정교한 추천 알고리즘이나 가격 비교 엔진
- 렌탈 제휴사 관리 백오피스
- CRM 자동화, 문자 발송, 콜센터 연동
- 회원가입과 로그인 기반 개인화
- 자동 견적 엔진 구축
- 제휴사 inventory 연동
- 관리자 인증과 권한 체계 도입
- 실제 정산/환불/구독형 결제 운영
- 다중 지역/다국어 지원
- Consultation Handoff
- Payment Intent Signal
