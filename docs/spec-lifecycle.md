# Spec Lifecycle

이 문서는 기능 spec과 실험 spec이 어떤 흐름으로 생성, 사용, 갱신, 종료되는지 설명합니다.

## 목적

- 구현 전에 필요한 결정을 문서로 고정한다.
- 구현 중 scope drift를 문서 기준으로 관리한다.
- 작업 종료 후 어떤 문서가 살아남아야 하는지 구분한다.

## 단계

### 1. Draft

- 입력: 사용자 요청, 회의 메모, Notion 초안, 기존 이슈
- 결과: repo 안 Markdown 초안
- 권장 위치:
  - 중요한 작업: `docs/work-items/<work-id>/brief.md`
  - 독립 기능/실험: `docs/templates/*` 기반 문서

이 단계에서는 아직 구현보다 결정 수집이 우선입니다.

### 2. Review

- 목표, non-goals, acceptance criteria를 고정합니다.
- 필요한 역할 문서를 추가합니다.
- 구조 영향, 데이터 영향, analytics 영향, 실험 영향을 확인합니다.

중요한 작업이면 `product-squad` 흐름을 따릅니다.

### 3. Implement

- 구현은 approved된 spec 또는 brief를 기준으로 진행합니다.
- 중요한 작업과 핵심 로직 변경은 작은 behavior slice 단위의 red-green-refactor를 기본으로 합니다.
- 각 slice는 가능하면 먼저 failing test로 public behavior를 고정한 뒤 최소 구현으로 통과시킵니다.
- 구현 중 결정이 바뀌면 문서를 먼저 또는 함께 갱신합니다.
- spec과 다른 방향으로 코드가 먼저 앞서가면 drift로 취급합니다.

### 4. Verify

- 결과가 acceptance criteria를 충족하는지 확인합니다.
- slice 단위 테스트가 통과한 뒤 최종 `pnpm verify` 또는 필요 시 `pnpm verify:full`로 마무리합니다.
- 최종 verify는 구현 중간의 TDD 루프를 대체하지 않고, release gate 역할을 합니다.
- test, type, docs 영향이 반영되었는지 확인합니다.
- 필요한 경우 work item 상태를 갱신합니다.

### 5. Reflect

- 구조 규칙이 바뀌었으면 canonical 문서를 갱신합니다.
- 현재 작업에만 필요한 결정은 task-local 문서에 남깁니다.
- 반복 규칙으로 승격할 가치가 있으면 `ai/context/*` 또는 `ai/skills/*`에 반영합니다.

### 6. Archive Or Reuse

- 구현 기준으로 계속 참고할 spec은 남깁니다.
- 작업 종료 후 참고용 산출물은 `docs/work-items/*`에 보관합니다.
- 외부 도구 메모는 필요 내용이 repo로 반영되었으면 source of truth에서 제외합니다.

## 어떤 문서를 언제 쓰는가

- `docs/templates/feature-spec.md`
  - 단일 기능이나 흐름을 설계할 때
- `docs/templates/experiment-spec.md`
  - 실험 가설, metric, 종료 기준을 고정할 때
- `docs/work-items/<work-id>/*.md`
  - 여러 역할이 관여하는 중요한 작업을 진행할 때
- `docs/adr/*`
  - 구조 규칙이나 장기 결정이 바뀔 때

## 운영 규칙

- 중요한 작업은 spec 없이 바로 구현하지 않습니다.
- 작은 수정은 full process를 생략할 수 있지만 생략 근거가 있어야 합니다.
- 단순 카피 수정, 시맨틱 변화 없는 스타일 수정, 명백한 소규모 버그 수정에는 full TDD를 강제하지 않습니다.
- validation, action/route 경계, 상태 전이, adapter 계약이 바뀌면 light work라도 TDD 적용을 우선 검토합니다.
- spec은 구현 복붙 문서가 아니라 결정 문서여야 합니다.
- canonical context는 반복 규칙만, task-local doc은 현재 작업 결정만 담습니다.

## Exit Checklist

- 구현 기준 문서가 repo 안에 있다.
- acceptance criteria와 실제 구현이 크게 어긋나지 않는다.
- 필요한 canonical 문서가 갱신되었다.
- 더 이상 source of truth가 아닌 외부 메모에 의존하지 않는다.
