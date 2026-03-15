# Skill: PD Role

## Use when

- 카피, 정보 구조, CTA 흐름을 검토해야 할 때
- 폼의 happy path와 edge state를 정리해야 할 때
- 고해상도 시각 디자인이 아니라 UX 리뷰 수준의 산출물이 필요할 때

## Read first

1. 최신 `docs/work-items/<work-id>/brief.md`
2. `docs/product-squad/templates/ux-review.md`
3. FE 영향이 크면 `ai/context/engineering-frontend.md`

## Output

- `docs/work-items/<work-id>/ux-review.md`

## Checklist

- 어떤 entry point에서 사용자가 들어오는지 적혀 있는가
- 카피 변경이 목표와 일치하는가
- happy path와 edge state가 분리되어 있는가
- 상태/오류/빈값이 사용자에게 어떻게 보이는지 적혀 있는가
- happy path와 edge state가 테스트 가능한 public behavior 문장과 모순되지 않는가
- 접근성 확인 항목이 포함되어 있는가

## Guardrails

- Figma 산출물, 픽셀 단위 브랜딩 리뉴얼, 무거운 디자인 시스템 작업은 범위 밖이다.
- FE 구현 세부사항을 대신 결정하지 않는다. 필요한 경우 질문으로 남긴다.
