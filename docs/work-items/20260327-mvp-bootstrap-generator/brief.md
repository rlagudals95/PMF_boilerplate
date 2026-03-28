---
status: approved
owner_role: pm
source_request: "few inputs로 PRD 초안과 feature work item까지 같이 만드는 범용 mvp:new 생성기 추가"
affected_paths:
  - scripts/create-mvp-starter.mjs
  - scripts/create-feature-from-prd.mjs
  - package.json
  - ai/context/project.md
  - docs/prds/README.md
  - docs/work-items/README.md
  - docs/vibe-coding-playbook.md
  - scripts/sync-ai-context.mjs
dependencies:
  - docs/product-squad/goal-driven-delivery.md
  - docs/product-config-system.md
skip_reason: null
---

# Brief

## Problem

- 현재 저장소는 `prd:new`, `feature:new`, `work:new`가 분리돼 있어 익숙한 개발자는 쓸 수 있지만, 비개발직군이나 1인 창업자가 "비즈니스 요구 몇 개"만으로 첫 문서 세트를 만드는 진입점은 약하다.
- 그래서 범용 MVP kit라고 해도 여전히 PRD 구조와 work item 흐름을 사용자가 수동으로 조합해야 한다.
- `mvp:new` 같은 상위 generator가 없으면 speed와 quality를 동시에 잡는 시스템 경험이 끊긴다.

## Target User

- goal packet은 줄 수 있지만 저장소 구조는 잘 모르는 비개발직군
- AI와 함께 빠르게 첫 MVP 문서를 만들고 싶은 1인 창업자
- 기존 `prd:new`와 `feature:new`보다 더 짧은 진입 루프가 필요한 개발자

## Goal

- few inputs만으로 PRD 초안과 첫 feature work item까지 같이 생성하는 `pnpm mvp:new` 진입점을 추가한다.
- 생성된 산출물이 현재 보일러플레이트의 범용 MVP kit 방향과 `product-config` 흐름을 자연스럽게 가리키게 만든다.
- 기존 `feature:new`도 user-facing work에서 `product-config.ts`를 영향 경로로 포함하도록 보강한다.

## Constraints

- 기존 `prd:new`, `feature:new`, `work:new` 흐름은 유지한다.
- `mvp:new`는 상위 convenience command여야지 별도 도메인 시스템이 되면 안 된다.
- 첫 버전은 few inputs 기반 generic PRD와 work item 생성에 집중한다.
- runtime 앱 구조나 DB schema는 건드리지 않는다.

## Non-Goals

- 완전한 no-code builder
- UI 기반 wizard
- 여러 feature 후보를 동시에 정교하게 만드는 planner
- recipe engine 전체 자동 생성
- runtime multi-product switcher

## Success Metric

- `pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."`만으로 PRD와 첫 feature work item이 생성된다.
- 생성된 PRD는 `feature:new`가 바로 읽을 수 있는 구조를 가진다.
- generated docs와 canonical docs가 새 명령을 안내한다.
- dry-run 또는 smoke 검증으로 실제 출력 흐름을 확인할 수 있다.

## Acceptance Criteria

- [ ] `pnpm mvp:new`가 few inputs를 받아 canonical PRD를 생성한다.
- [ ] 같은 명령에서 첫 feature work item까지 이어서 생성한다.
- [ ] generated PRD는 범용 MVP kit 톤을 유지하고 특정 업종 기본값에 묶이지 않는다.
- [ ] 관련 문서와 adapter sync source가 새 명령을 안내한다.

## Open Questions

- 향후 `mvp:new`가 `product-config` 파일 scaffold까지 직접 만들지 여부
- 후속 버전에서 `--title`, `--problem`, `--source-url` 외 추가 인자를 얼마나 더 열지 여부
