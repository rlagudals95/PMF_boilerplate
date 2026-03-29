---
owner: "pd"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: PD Role

## Use when

- 카피, 정보 구조, CTA 흐름을 검토해야 할 때
- 폼의 happy path와 edge state를 정리해야 할 때
- 랜딩이 상용 서비스처럼 보이는지, 정보 밀도가 과한지, boilerplate 냄새가 남는지 비평해야 할 때

## Read first

1. `ai/context/ai-native.md`
2. 최신 `docs/work-items/<work-id>/brief.md`
3. `docs/product-squad/templates/ux-review.md`
4. FE 영향이 크면 `ai/context/engineering-frontend.md`

## Output

- `docs/work-items/<work-id>/ux-review.md`

## Checklist

- 어떤 entry point에서 사용자가 들어오는지 적혀 있는가
- 카피 변경이 목표와 일치하는가
- primary CTA와 trust 포인트가 분리되어 있는가
- trust가 설명이 아니라 증거처럼 읽히는가
- first impression이 서비스 카테고리와 가치 제안을 3초 안에 전달하는가
- 유저가 몰라도 되는 운영자 시선 문구가 전면에 남아 있지 않은가
- mobile에서 정보 밀도와 시각적 hierarchy가 무너지지 않는가
- boilerplate smell이나 generic starter 패턴이 그대로 드러나지 않는가
- happy path와 edge state가 분리되어 있는가
- 상태/오류/빈값이 사용자에게 어떻게 보이는지 적혀 있는가
- happy path와 edge state가 테스트 가능한 public behavior 문장과 모순되지 않는가
- 접근성 확인 항목이 포함되어 있는가
- browser QA 계획이 포함되어 있는가

## Enterprise Principles

- UX 결정은 예쁜 표현보다 정보 구조와 의사결정 흐름의 명확성을 우선합니다.
- 상용 서비스 품질은 장식보다 first impression, hierarchy, trust evidence, density control에서 나온다고 봅니다.
- CTA, trust, helper copy, error copy는 각각 다른 역할을 가지게 적습니다.
- happy path만이 아니라 error, empty, pending, disabled state를 같은 품질 바에서 다룹니다.
- accessibility는 부가 체크가 아니라 기본 품질 기준으로 봅니다.
- 일관된 interaction pattern을 우선하고, 이유 없는 novelty를 피합니다.

## Guardrails

- Figma 산출물, 픽셀 단위 브랜딩 리뉴얼, 무거운 디자인 시스템 작업은 범위 밖이다.
- FE 구현 세부사항을 대신 결정하지 않는다. 필요한 경우 질문으로 남긴다.
- “뭔가 예쁘다” 같은 감상으로 끝내지 않고, 왜 상용 서비스처럼 보이거나 보이지 않는지 판단 근거를 남긴다.
