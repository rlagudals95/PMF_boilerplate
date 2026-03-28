---
status: approved
owner_role: be
source_request: "few inputs로 PRD 초안과 feature work item까지 같이 만드는 범용 mvp:new 생성기 추가"
affected_paths:
  - scripts/create-mvp-starter.mjs
  - scripts/create-feature-from-prd.mjs
  - package.json
  - scripts/sync-ai-context.mjs
dependencies:
  - docs/work-items/20260327-mvp-bootstrap-generator/brief.md
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- 없음. repo 문서와 script output contract만 바뀐다.

## Action Service Repository Plan

- `scripts/create-mvp-starter.mjs`가 few inputs를 파싱한다.
- 같은 스크립트가 canonical PRD markdown을 만든다.
- PRD 생성 후 `scripts/create-feature-from-prd.mjs`를 호출해 첫 feature work item까지 이어 준다.
- `create-feature-from-prd.mjs`는 user-facing feature일 때 `apps/web/src/lib/product-config.ts`를 affected path에 포함한다.

## Analytics Impact

- 없음

## Failure Modes

- required input이 빠지면 usage 에러를 내고 중단해야 한다.
- 기존 PRD 파일이 있으면 `--force` 없이 덮어쓰지 않아야 한다.
- `feature:new` downstream 실행이 실패하면 사용자에게 부분 실패가 드러나야 한다.

## Measurement Guardrails

- `--dry-run`으로 output shape를 미리 확인할 수 있어야 한다.
- generated docs는 현재 PRD parser가 읽을 수 있는 heading/field 구조를 유지해야 한다.
- canonical docs가 새 명령을 같은 턴에 안내해야 한다.

## Boundary / Use Case / Repository Contract Test Plan

- 먼저 failing test로 고정할 validation/use case/repository contract
  - `mvp:new` usage parsing과 required flags contract
- adapter failure handling과 fallback 검증 포인트
  - `--dry-run` output 확인
  - temp workspace smoke run으로 PRD + work item 생성 확인
- 최종 verify에 남길 통합 확인 항목
  - `pnpm verify`
  - `pnpm squad:check --work 20260327-mvp-bootstrap-generator`
