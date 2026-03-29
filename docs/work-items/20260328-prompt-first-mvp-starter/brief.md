---
owner: "pm"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: pm
source_request: "자연어 비즈니스 프롬프트 하나로 recipe를 고르고 PRD/work item까지 여는 prompt-first mvp starter 추가"
affected_paths:
  - scripts/create-mvp-starter.mjs
  - README.md
  - ai/context/project.md
  - docs/prds/README.md
  - docs/work-items/README.md
  - docs/product-config-system.md
  - docs/vibe-coding-playbook.md
  - scripts/sync-ai-context.mjs
  - docs/start-your-mvp.md
dependencies:
  - docs/product-squad/goal-driven-delivery.md
  - docs/work-items/20260327-mvp-bootstrap-generator/brief.md
skip_reason: null
---

# Brief

## Problem

- 현재 `pnpm mvp:new`는 few inputs generator로는 충분히 좋아졌지만, 여전히 사용자가 `goal`, `audience`, `offer`, `signal`을 직접 구조화해야 한다.
- 실제 서비스 제작자는 기능명을 먼저 아는 사람이 아니라 "이런 비즈니스를 만들고 싶다"는 자연어 아이디어를 먼저 던지는 경우가 많다.
- 그래서 repo가 갖고 있는 랜딩, 리드, 상담, 결제, 어드민 기능이 많아도, 서비스를 만드는 입장에서는 어떤 흐름을 먼저 켜야 하는지 다시 사람이 해석해야 한다.

## Target User

- 아이디어 문장 하나만 가지고 AI와 함께 첫 MVP를 열고 싶은 1인 창업자
- 저장소 구조보다 사업 가설과 전환 목표에 더 익숙한 비개발직군
- 이 boilerplate를 downstream 서비스 스타터로 복제한 뒤 가장 빠른 시작 경로를 원하는 개발자

## Goal

- `pnpm mvp:new`가 `--prompt` 입력 하나로 goal packet 초안과 recipe를 추론할 수 있게 만든다.
- 생성 결과에 `선택한 recipe`, `활성화 기능`, `제외 기능`, `핵심 전환 이벤트`, `admin metric`이 드러나게 만든다.
- 사용자가 "무슨 기능이 있지?"보다 "내 비즈니스는 어떤 MVP 타입으로 시작하지?"라는 질문에 바로 답할 수 있게 한다.

## Constraints

- 첫 버전은 LLM 연동 없이 deterministic heuristic과 recipe catalog로 동작한다.
- 기존 `pnpm mvp:new <slug> --goal ... --audience ... --offer ... --signal ...` 흐름은 깨지지 않아야 한다.
- runtime 앱 구조를 바꾸지 않고, starter 문서와 setup guidance를 더 똑똑하게 만드는 데 집중한다.
- 특정 업종에 종속된 기본값을 새 canonical default로 넣지 않는다.

## Non-Goals

- 완전한 자연어 이해 엔진
- 모든 도메인에서 완벽한 recipe 자동 선택
- `apps/web/src/lib/product-config.ts`를 자동으로 덮어쓰는 기능
- runtime에서 실제 route를 on/off하는 feature flag 시스템
- 외부 AI provider 의존 CLI

## Success Metric

- `pnpm mvp:new <slug> --prompt "..." --dry-run`만으로 recipe와 setup summary가 생성된다.
- 생성된 PRD가 기존 `feature:new` parser와 호환된다.
- README와 starter 문서가 서비스 제작자 관점의 첫 시작 흐름을 설명한다.
- 예시 prompt 하나로 dry-run과 smoke run이 가능하다.

## Acceptance Criteria

- [ ] `pnpm mvp:new`가 `--prompt`를 받아 goal/audience/offer/signal 초안을 추론할 수 있다.
- [ ] prompt 기반 생성 결과에 recipe, active flows, deferred flows, primary CTA, key metrics가 포함된다.
- [ ] 기존 explicit flags 기반 `mvp:new` 사용법은 그대로 유지된다.
- [ ] README 또는 별도 starter 문서가 one-shot prompt 예시와 시작 경로를 안내한다.

## Open Questions

- recipe catalog를 canonical doc로 어디까지 명시할지 여부
- prompt에서 slug를 자동 생성할지, 현재처럼 명시적으로 받게 둘지 여부
- 후속 버전에서 generated product-config scaffold까지 연결할지 여부
