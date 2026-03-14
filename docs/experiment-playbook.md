# Experiment Playbook

PMF 실험 보일러플레이트를 여러 제품에 재사용하려면, 코드보다 먼저 실험 운영 규칙이 일정해야 합니다.

## 1. 실험은 세 가지 질문으로 시작한다

- 어떤 고객 문제를 검증하려는가?
- 어떤 행동 변화를 기대하는가?
- 그 변화를 어떤 지표로 판단할 것인가?

이 세 질문에 답하지 못하면 실험 등록부터 하지 않습니다.

## 2. 최소 실험 문서 포맷

`experiments` 레코드에는 아래 항목이 항상 있어야 합니다.

- `code`: 짧고 검색 가능한 식별자. 예: `LP-001`, `CF-002`
- `name`: 실험 제목
- `hypothesis`: “만약 X를 바꾸면 Y 지표가 Z 만큼 좋아질 것이다”
- `channel`: 유입 채널 또는 배포 채널
- `successMetric`: 종료 판단 기준
- `owner`: 실험 책임자
- `status`: `draft`, `running`, `won`, `lost` 등

## 3. success metric 네이밍 규칙

- 가능한 한 문장 대신 식으로 남깁니다.
- 예:
  - `landing_to_lead_conversion >= 7%`
  - `consult_completion_rate >= 15%`
  - `qualified_lead_share >= 30%`

이유는 어드민과 문서에서 한눈에 비교하기 쉽기 때문입니다.

## 4. 추천 이벤트 세트

기본 이벤트는 이 정도면 충분합니다.

- `page_view`
- `admin_page_viewed`
- `cta_clicked`
- `lead_form_submitted`
- `consultation_requested`

이벤트를 늘리기 전에 먼저 “이 데이터가 다음 인터뷰/후속 연락 우선순위를 바꾸는가?”를 확인합니다.

## 5. CTA / feature flag 네이밍 규칙

랜딩 카피나 CTA를 바꿀 때는 아래 식으로 이름을 맞춥니다.

- CTA id: `hero_consult_primary`
- section id: `landing_problem_block`
- feature flag key: `lp_consult_value_prop_v1`

규칙:

- 제품별 prefix보다 실험 목적 prefix를 우선
- 약어는 팀이 모두 이해하는 범위만 사용
- `new`, `test`, `final` 같은 임시 이름 금지

## 6. 실험 종료 규칙

실험은 아래 셋 중 하나면 종료합니다.

- success metric 충족
- 질적 피드백상 가설이 명확히 깨짐
- 더 이상 다음 액션을 바꾸지 못하는 데이터만 추가로 쌓이는 상태

## 7. 모두의렌탈 기준 예시

- 가설: “즉시 견적/상담 가능성을 강조하면 일반 소개형 카피보다 문의 전환이 높다”
- 랜딩 변경: hero headline, CTA 문구
- 기대 행동: `/consult` 이동 증가, 리드 제출 증가
- success metric: `landing_to_lead_conversion >= 7%`
- follow-up: 제출 리드 중 상위 5명을 인터뷰 후보로 선정
