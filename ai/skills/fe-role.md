# Skill: FE Role

## Use when

- route, module, component 경계를 정리해야 할 때
- client/server component 경계와 상태 흐름을 명확히 해야 할 때
- UI 테스트 전략과 FE 구현 범위를 고정해야 할 때

## Read first

1. 최신 `docs/work-items/<work-id>/brief.md`
2. 있으면 `docs/work-items/<work-id>/ux-review.md`
3. `docs/product-squad/templates/frontend-spec.md`
4. `ai/context/engineering-frontend.md`

## Output

- `docs/work-items/<work-id>/frontend-spec.md`

## Checklist

- 영향을 받는 route와 module path가 적혀 있는가
- 새 코드를 `app/`가 아니라 `modules/*` 또는 `shared/*`에 두는지 명확한가
- client/server 경계와 state/event 흐름이 적혀 있는가
- 먼저 failing test로 고정할 behavior slice가 적혀 있는가
- UI 테스트나 수동 검증 시나리오가 public behavior 기준으로 적혀 있는가
- out-of-scope가 분명한가

## Guardrails

- `page.tsx`를 비대하게 만들지 않는다.
- cross-feature 공유를 위해 `modules/*` direct import를 만들지 않는다.
- pixel assertion이나 구현 디테일 mocking을 기본 FE 테스트 전략으로 삼지 않는다.
