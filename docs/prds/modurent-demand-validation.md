---
title: "모두의렌탈 수요 검증"
status: draft
owner: "Founder"
source_url: ""
created_at: "2026-03-15"
updated_at: "2026-03-15"
---

# PRD

## Problem

- 렌탈이 필요한 사용자는 블로그, 카페, 오픈마켓, 카카오 상담을 오가며 정보를 비교하지만, 자신의 조건을 한 번에 정리해 상담으로 연결할 간단한 진입점이 부족하다.
- 현재 저장소에는 리드 수집, 상담 요청, 결제 데모, 어드민이 이미 있지만 사용자-facing 카피와 입력 항목이 아직 `모두의렌탈` 도메인에 최적화되어 있지 않아 실제 렌탈 수요 신호를 측정하기 어렵다.
- 따라서 첫 실제 제품 use case로서 "렌탈 의도가 있는 사용자가 카테고리/긴급도/연락 선호를 남기고 상담으로 이어지는가"를 검증해야 한다.

## Goal

- `모두의렌탈`을 단순 스타터 데모가 아니라 실제 렌탈 수요 검증용 제품으로 전환한다.
- 랜딩에서 리드, 리드에서 상담 요청까지 이어지는 핵심 퍼널이 카테고리 기반 rental intake 흐름으로 작동하는지 확인한다.
- 운영자가 어떤 카테고리, 어떤 유입 메시지, 어떤 연락 방식이 강한 신호로 이어지는지 어드민에서 바로 해석할 수 있게 만든다.

## Non-Goals

- 자동 견적 엔진 구축
- 제휴사 inventory 연동
- 관리자 인증과 권한 체계 도입
- 실제 정산/환불/구독형 결제 운영
- 다중 지역/다국어 지원

## Target User

가정용 정수기, 공기청정기, 비데, 생활가전 렌탈을 검토하는 개인 사용자와 사무실/소형 매장용 렌탈이 급하게 필요한 소상공인 또는 운영 담당자. "지금 어떤 제품을 얼마나 빨리 써야 하는지"는 분명하지만, 여러 판매 채널을 돌며 조건을 다시 설명하는 데 피로를 느끼는 사람이 핵심 대상이다.

## Core Use Cases

### Primary

- 상황: 사용자가 정수기나 공기청정기 렌탈이 필요해 비교를 시작했지만, 어떤 판매처에 문의해야 할지 결정하지 못한 상태다.
- 사용자 행동: `/` 랜딩에서 카테고리와 사용 맥락, 긴급도, 연락처를 남기고 빠른 상담 또는 카카오 안내를 기대하며 리드를 제출한다.
- 기대 결과: 사용자는 "내 조건이 전달되었다"는 확신과 함께 빠른 후속 연락을 기대할 수 있고, 운영자는 구조화된 리드를 확보한다.

### Secondary

- 상황: 운영자는 들어온 리드 중 실제 상담 가능성이 높은 건을 우선순위로 판단해야 한다.
- 사용자 행동: `/admin`과 `/admin/leads`에서 카테고리, 긴급도, 선호 연락 방식, 상담 전환 여부를 확인하고 후속 연락 대상을 고른다.
- 기대 결과: 운영자는 약한 관심 신호와 강한 실행 신호를 구분해 실험 성과를 해석할 수 있다.

## Jobs To Be Done

- 사용자는 여러 판매 채널에 같은 설명을 반복하지 않고, 필요한 렌탈 조건을 한 번에 전달하고 싶다.
- 사용자는 전화, 카카오, 이메일 중 자신이 편한 방식으로 후속 연락을 받고 싶다.
- 운영자는 어떤 카테고리와 메시지가 단순 조회가 아니라 상담 요청으로 이어지는지 알고 싶다.
- 운영자는 후속 대응 우선순위를 정할 수 있을 만큼 구조화된 리드 데이터를 원한다.

## Success Metric

- `landing_to_lead_conversion >= 5%`
- `qualified_lead_rate >= 60%`
- `lead_to_consult_request_rate >= 20% within 7 days`
- `category_completion_rate >= 85%` for submitted leads
- Stop signal: 랜딩 세션 300회 이후에도 `landing_to_lead_conversion < 2%`
- Pivot signal: 리드는 생기지만 `lead_to_consult_request_rate < 10%`면 카피보다 qualification 방식 재설계 우선

## Scope

### In Scope

- `모두의렌탈` 기준의 렌탈 도메인 카피와 CTA로 랜딩을 재작성한다.
- 리드 폼에서 카테고리, 사용 맥락, 긴급도, 선호 연락 방식을 수집한다.
- 상담 요청 플로우에서 리드의 핵심 맥락을 이어받아 더 강한 신호를 수집한다.
- 어드민에서 새 qualification 필드를 확인할 수 있게 한다.
- 핵심 퍼널 이벤트를 카테고리/긴급도 기준으로 나눠서 저장한다.

### Out Of Scope

- 결제 성공 자체를 PMF 판단의 핵심 기준으로 삼는 것
- 정교한 추천 알고리즘이나 가격 비교 엔진
- 렌탈 제휴사 관리 백오피스
- CRM 자동화, 문자 발송, 콜센터 연동
- 회원가입과 로그인 기반 개인화

## Feature Candidates

### Rental Intake Funnel

- summary: 랜딩과 리드 폼을 `모두의렌탈` 카피와 렌탈 intake 질문으로 바꾸고, 카테고리/긴급도/연락 선호를 구조화해 저장한다.
- user_value: 사용자는 어떤 렌탈이 필요한지 짧은 입력만으로 전달하고 적절한 후속 상담을 기대할 수 있다.
- primary_module: lead
- routes: /,/consult,/admin,/admin/leads
- ui_surface: yes
- admin_surface: yes
- backend_changes: yes
- auth_required: no
- payment_required: no
- external_provider_impact: none
- analytics_required: yes
- recommended: yes

### Consultation Handoff

- summary: 리드에서 입력한 카테고리와 기본 맥락을 상담 요청 플로우에 이어붙여 중복 입력을 줄이고 stronger intent를 측정한다.
- user_value: 사용자는 이미 남긴 정보를 반복하지 않고 구체 상담 단계로 넘어갈 수 있다.
- primary_module: consultation
- routes: /consult,/admin,/admin/leads
- ui_surface: yes
- admin_surface: yes
- backend_changes: yes
- auth_required: no
- payment_required: no
- external_provider_impact: none
- analytics_required: yes
- recommended: no

### Payment Intent Signal

- summary: 기존 Toss 결제 데모를 실제 구매 의사 확인용 예약금/의향금 흐름으로 재포지셔닝한다.
- user_value: 사용자는 상담 이후 더 강한 의사 표현을 할 수 있고, 운영자는 결제 직전 신호를 별도로 확인할 수 있다.
- primary_module: payment
- routes: /pay,/pay/result,/pay/cancel,/admin/payments
- ui_surface: yes
- admin_surface: yes
- backend_changes: yes
- auth_required: no
- payment_required: yes
- external_provider_impact: toss
- analytics_required: yes
- recommended: no

## Testability Notes

- `rental-intake-funnel`은 validation, action/use case 경계, admin 노출 필드가 함께 바뀌므로 light work가 아니라 gated work로 다룬다.
- 첫 failing test는 "렌탈 qualification 필드가 포함된 lead 제출이 성공하고 저장소에 구조화되어 남는다"를 기준으로 잡는다.
- 다음 behavior slice는 `lead form validation -> submit action/use case -> repository persistence -> admin list exposure -> analytics event payload` 순서로 자른다.

## Acceptance Criteria

- [ ] 사용자가 `/`에서 `모두의렌탈` 기준의 렌탈 카피와 CTA를 보고, generic boilerplate/B2B SaaS 예시 없이 리드 폼을 이해할 수 있다.
- [ ] 사용자가 필수 qualification 항목을 채워 리드를 제출하면 category, urgency, preferred contact가 함께 저장되고 성공 메시지를 본다.
- [ ] 운영자가 `/admin` 또는 `/admin/leads`에서 새 qualification 필드를 확인해 후속 연락 우선순위를 판단할 수 있다.
- [ ] 핵심 이벤트는 일반 page view와 구분되어 rental lead submission 및 consult request 신호로 기록된다.

Acceptance Criteria 작성 규칙:

구현 디테일이 아니라 public behavior 기준으로 적습니다.
구현자가 추가 해석 없이 테스트 가능한 문장으로 적습니다.
중요한 작업이면 어떤 기준을 먼저 failing test로 고정할지 PRD 단계에서 힌트를 남깁니다.

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

## Dependencies

- `apps/web/src/modules/landing/*`
- `apps/web/src/modules/lead/*`
- `apps/web/src/modules/consultation/*`
- `apps/web/src/modules/admin/*`
- `packages/core/*`
- `packages/db/*`
- `packages/analytics/*`

## Open Questions

- 첫 버전에서 어떤 카테고리 세트를 기본값으로 둘지: 정수기/공기청정기/비데 중심으로 시작할지 여부
- qualified lead의 최소 기준을 어떤 조합으로 볼지: category + urgency + consent만으로 충분한지 여부
- preferred contact 기본값을 전화로 둘지, 카카오를 강조할지 여부
- 상담 요청 단계에서 lead 데이터를 자동 prefill할지, 같은 세션 내에서만 이어받을지 여부

## Document History

| 날짜 | 유형 | 요약 | 작성자 |
| --- | --- | --- | --- |
| 2026-03-15 | created | Initial PRD created. | TBD |
| 2026-03-15 | updated | 모두의렌탈 첫 실제 제품 PRD와 feature candidates를 채움. | Codex |

History 규칙:

- PRD 생성 시 `created` 행을 남깁니다.
- 의미 있는 수정이 있을 때마다 새 행을 추가합니다.
- 기존 행을 덮어쓰지 않고 이어서 추가합니다.
- 최신 변경이 항상 최하단에 오게 합니다.
