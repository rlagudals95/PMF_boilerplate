---
status: "draft"
owner_role: "product-squad"
related_prd: "docs/prds/modurent-demand-validation.md"
related_work_item: "docs/work-items/20260315-rental-intake-funnel"
feature_slug: "rental-intake-funnel"
implementation_readiness: "ready"
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

# Feature Spec

## Feature Summary

랜딩과 리드 폼을 `모두의렌탈` 카피와 렌탈 intake 질문으로 바꾸고, 카테고리/긴급도/연락 선호를 구조화해 저장한다.

## Problem

렌탈이 필요한 사용자는 블로그, 카페, 오픈마켓, 카카오 상담을 오가며 정보를 비교하지만, 자신의 조건을 한 번에 정리해 상담으로 연결할 간단한 진입점이 부족하다. 현재 저장소에는 리드 수집, 상담 요청, 결제 데모, 어드민이 이미 있지만 사용자-facing 카피와 입력 항목이 아직 `모두의렌탈` 도메인에 최적화되어 있지 않아 실제 렌탈 수요 신호를 측정하기 어렵다. 따라서 첫 실제 제품 use case로서 "렌탈 의도가 있는 사용자가 카테고리/긴급도/연락 선호를 남기고 상담으로 이어지는가"를 검증해야 한다.

## Goal

`모두의렌탈`을 단순 스타터 데모가 아니라 실제 렌탈 수요 검증용 제품으로 전환한다. 랜딩에서 리드, 리드에서 상담 요청까지 이어지는 핵심 퍼널이 카테고리 기반 rental intake 흐름으로 작동하는지 확인한다. 운영자가 어떤 카테고리, 어떤 유입 메시지, 어떤 연락 방식이 강한 신호로 이어지는지 어드민에서 바로 해석할 수 있게 만든다.

## In Scope

- `모두의렌탈` 기준의 렌탈 도메인 카피와 CTA로 랜딩을 재작성한다.
- 리드 폼에서 카테고리, 사용 맥락, 긴급도, 선호 연락 방식을 수집한다.
- 상담 요청 플로우에서 리드의 핵심 맥락을 이어받아 더 강한 신호를 수집한다.
- 어드민에서 새 qualification 필드를 확인할 수 있게 한다.
- 핵심 퍼널 이벤트를 카테고리/긴급도 기준으로 나눠서 저장한다.
- Rental Intake Funnel: 랜딩과 리드 폼을 `모두의렌탈` 카피와 렌탈 intake 질문으로 바꾸고, 카테고리/긴급도/연락 선호를 구조화해 저장한다.

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

## Target User

가정용 정수기, 공기청정기, 비데, 생활가전 렌탈을 검토하는 개인 사용자와 사무실/소형 매장용 렌탈이 급하게 필요한 소상공인 또는 운영 담당자. "지금 어떤 제품을 얼마나 빨리 써야 하는지"는 분명하지만, 여러 판매 채널을 돌며 조건을 다시 설명하는 데 피로를 느끼는 사람이 핵심 대상이다.

## User Flow

- 핵심 대상 사용자가 /, /consult, /admin, /admin/leads 경로로 진입한다.
- 랜딩과 리드 폼을 `모두의렌탈` 카피와 렌탈 intake 질문으로 바꾸고, 카테고리/긴급도/연락 선호를 구조화해 저장한다.
- 사용자는 어떤 렌탈이 필요한지 짧은 입력만으로 전달하고 적절한 후속 상담을 기대할 수 있다.

## Acceptance Criteria

- [ ] 사용자가 `/`에서 `모두의렌탈` 기준의 렌탈 카피와 CTA를 보고, generic boilerplate/B2B SaaS 예시 없이 리드 폼을 이해할 수 있다.
- [ ] 사용자가 필수 qualification 항목을 채워 리드를 제출하면 category, urgency, preferred contact가 함께 저장되고 성공 메시지를 본다.
- [ ] 운영자가 `/admin` 또는 `/admin/leads`에서 새 qualification 필드를 확인해 후속 연락 우선순위를 판단할 수 있다.
- [ ] 핵심 이벤트는 일반 page view와 구분되어 rental lead submission 및 consult request 신호로 기록된다.

## Analytics Impact

- `lead_form_submitted` 이벤트에 rental category, urgency, preferred contact 속성을 추가한다.
- qualified lead 판별에 필요한 최소 속성 집합을 정의한다.
- `consultation_requested` 이벤트가 리드에서 이어진 흐름인지 구분 가능해야 한다.
- 어드민 지표에서 `landing -> lead -> consult` 전환을 카테고리별로 볼 수 있어야 한다.

## Data Impact

- lead 스키마 또는 관련 저장 구조에 `category`, `urgency`, `preferred_contact`, `usage_context` 필드가 필요하다.
- consultation request가 lead qualification 문맥을 이어받을 수 있게 매핑 규칙이 필요하다.
- mock seed와 local fallback 데이터도 새 필드를 반영해야 한다.
- admin summary가 qualified lead 기준을 새 필드 기반으로 해석할 수 있어야 한다.

## Affected Routes And Modules

- apps/web/src/app/page.tsx
- apps/web/src/app/consult/*
- apps/web/src/app/admin/*
- apps/web/src/app/admin/leads/*
- apps/web/src/modules/lead/*
- apps/web/src/modules/admin/*
- packages/core/*
- packages/db/*
- packages/analytics/*
- apps/web/src/lib/analytics.ts

## Test Strategy

- Generated 문서의 acceptance criteria를 기준으로 public behavior를 검증한다.
- 주요 사용자 경로에 대한 수동 검증 또는 UI 테스트 포인트를 정리한다.
- validation, persistence, analytics 영향에 대한 단위 테스트 또는 통합 테스트를 검토한다.
- 변경 범위에 맞춰 `pnpm verify` 또는 `pnpm verify:full`을 선택한다.

## Docs To Update

- docs/prds/modurent-demand-validation.md
- docs/work-items/20260315-rental-intake-funnel/brief.md
- docs/work-items/20260315-rental-intake-funnel/feature-spec.md

## Open Questions

- 첫 버전에서 어떤 카테고리 세트를 기본값으로 둘지: 정수기/공기청정기/비데 중심으로 시작할지 여부
- qualified lead의 최소 기준을 어떤 조합으로 볼지: category + urgency + consent만으로 충분한지 여부
- preferred contact 기본값을 전화로 둘지, 카카오를 강조할지 여부
- 상담 요청 단계에서 lead 데이터를 자동 prefill할지, 같은 세션 내에서만 이어받을지 여부

## Implementation Readiness

Ready for implementation once the work item docs are reviewed.
