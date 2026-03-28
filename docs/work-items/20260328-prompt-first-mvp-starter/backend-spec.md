---
status: approved
owner_role: be
source_request: "자연어 비즈니스 프롬프트 하나로 recipe를 고르고 PRD/work item까지 여는 prompt-first mvp starter 추가"
affected_paths:
  - scripts/create-mvp-starter.mjs
  - scripts/sync-ai-context.mjs
  - README.md
  - docs/start-your-mvp.md
  - docs/prds/README.md
dependencies:
  - docs/work-items/20260328-prompt-first-mvp-starter/brief.md
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- 없음. CLI input contract와 generated markdown contract만 바뀐다.

## Action Service Repository Plan

- `scripts/create-mvp-starter.mjs`가 `--prompt`와 기존 explicit flags를 함께 지원한다.
- prompt가 들어오면 deterministic recipe catalog를 사용해 goal packet 초안과 setup summary를 만든다.
- generated PRD에 `recipe`, `active flows`, `deferred flows`, `primary CTA`, `recommended metrics` 같은 setup section을 추가한다.
- 기존 explicit flags 경로는 그대로 유지하고, prompt 기반 추론값은 사용자가 별도 flag를 주면 override 가능하게 둔다.

## Analytics Impact

- 없음

## Failure Modes

- prompt는 있지만 slug가 없으면 usage 에러로 중단해야 한다.
- prompt 해석이 모호해도 generator는 실패보다 generic recipe fallback과 open question을 남겨야 한다.
- 새 PRD section이 기존 `feature:new` parser를 깨면 안 된다.
- 기존 explicit flags only 사용법이 regress 되면 안 된다.

## Measurement Guardrails

- dry-run 출력만 봐도 선택한 recipe와 active/deferred flow를 이해할 수 있어야 한다.
- generated PRD는 여전히 `feature:new` parser가 읽는 필수 섹션을 유지해야 한다.
- README와 starter 문서가 prompt-first 진입을 가장 앞에 안내해야 한다.

## Boundary / Use Case / Repository Contract Test Plan

- 먼저 failing test로 고정할 validation/use case/repository contract
  - `--prompt` 사용 시 recipe inference와 required slug contract
  - explicit flags 기반 사용법 backward compatibility
- adapter failure handling과 fallback 검증 포인트
  - dry-run 출력에 recipe/setup summary가 포함되는지 확인
  - prompt가 모호한 경우 generic fallback과 open question이 남는지 확인
- 최종 verify에 남길 통합 확인 항목
  - `pnpm verify`
  - `pnpm squad:check --work 20260328-prompt-first-mvp-starter`
