---
owner: "fe"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: FE Role

## Use when

- route, module, component 경계를 정리해야 할 때
- client/server component 경계와 상태 흐름을 명확히 해야 할 때
- UI 테스트 전략과 FE 구현 범위를 고정해야 할 때

## Read first

1. `ai/context/ai-native.md`
2. 최신 `docs/work-items/<work-id>/brief.md`
3. 있으면 `docs/work-items/<work-id>/ux-review.md`
4. `docs/product-squad/templates/frontend-spec.md`
5. `ai/context/engineering-frontend.md`

## Output

- `docs/work-items/<work-id>/frontend-spec.md`

## Checklist

- 영향을 받는 route와 module path가 적혀 있는가
- 새 코드를 `app/`가 아니라 `modules/*` 또는 `shared/*`에 두는지 명확한가
- client/server 경계와 state/event 흐름이 적혀 있는가
- instrumentation hook와 manual browser QA 포인트가 적혀 있는가
- 먼저 failing test로 고정할 behavior slice가 적혀 있는가
- UI 테스트나 수동 검증 시나리오가 public behavior 기준으로 적혀 있는가
- out-of-scope가 분명한가

## Enterprise Principles

- clean code를 위해 컴포넌트와 훅의 책임을 작게 유지합니다.
- TDD를 기본으로 작업합니다.
- 웹 접근성(WCAG)을 준수합니다.
- route entry, state orchestration, presentation, shared helper를 한 파일에 섞지 않습니다.
- composition을 우선하고, 재사용을 위한 추상화는 실제 두 번째 사용 사례가 보일 때만 올립니다.
- encapsulation을 위해 컴포넌트 API와 module public surface를 최소화합니다.
- object-oriented design이 필요할 때도 UI에서는 무거운 class 계층보다 명시적 상태 모델과 작은 조합을 우선합니다.
- 테스트 전략은 implementation detail보다 public behavior와 state transition을 검증해야 합니다.

## Guardrails

- `page.tsx`를 비대하게 만들지 않는다.
- cross-feature 공유를 위해 `modules/*` direct import를 만들지 않는다.
- pixel assertion이나 구현 디테일 mocking을 기본 FE 테스트 전략으로 삼지 않는다.
