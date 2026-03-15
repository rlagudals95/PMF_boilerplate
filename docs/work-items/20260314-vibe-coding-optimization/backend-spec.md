---
status: done
owner_role: be
source_request: "그리고 이건 PMF를 찾기 위한 바이브 코더(속도와 품질을 놓치고 싶지않은) 보일러 플레이트야 바이브 코딩하기에 최적으 경험을 제공하는 보일러 플레이트인가? 많은 사례 및 패턴 실제로 심층서치해보고 매우 심층적으로 평가하고 개선해줘"
affected_paths:
  - scripts/sync-ai-context.mjs
  - scripts/create-work-item.mjs
  - package.json
  - README.md
  - AGENTS.md
  - ai/context/project.md
  - ai/context/spec-driven.md
  - docs/agent-context.md
  - docs/work-items/README.md
  - docs/vibe-coding-playbook.md
dependencies:
  - docs/work-items/20260314-vibe-coding-optimization/brief.md
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- 데이터 스키마 변경은 없다.
- 대신 AI workflow와 adapter generation 경로를 확장한다.

## Action Service Repository Plan

- `scripts/create-work-item.mjs`를 추가해 `docs/work-items/<work-id>/` scaffold를 한 번에 만든다.
- `scripts/sync-ai-context.mjs`를 확장해 Copilot instruction과 Cursor rules를 생성한다.
- root `package.json`에 `pnpm verify`, `pnpm verify:full`, `pnpm work:new`를 추가해 빠른 품질 루프를 표준화한다.

## Analytics Impact

- 제품 analytics 이벤트에는 영향이 없다.
- 다만 AI context adapter 변경은 개발 생산성 측면의 운영 개선이다.

## Failure Modes

- `work:new`는 slug가 비어 있으면 실패해야 한다.
- `ai:sync`는 canonical context를 source로 삼아 반복 실행해도 동일한 adapter를 재생성할 수 있어야 한다.
- generated adapter를 수동 수정하면 다음 sync에서 덮어써진다.

## Test Plan

- `pnpm work:new ...` 실행으로 scaffold 생성 확인
- `pnpm ai:sync` 실행으로 Copilot/Cursor adapter 생성 확인
- `pnpm verify`
