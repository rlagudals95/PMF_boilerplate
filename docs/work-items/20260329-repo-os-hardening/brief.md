---
owner: "pm"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: pm
source_request: "Repo OS hardening: core docs metadata, repo:check static gate, adapter drift control, and canonical Repo OS index"
affected_paths:
  - "AGENTS.md"
  - "README.md"
  - "ai/context/*"
  - "ai/skills/*"
  - "ai/agents/*"
  - "docs/repo-os.md"
  - "docs/product-squad/*"
  - "docs/prds/*"
  - "docs/work-items/*"
  - "docs/templates/prd.md"
  - "scripts/check-repo-os.mjs"
  - "scripts/check-squad-work-item.mjs"
  - "scripts/sync-ai-context.mjs"
  - "scripts/create-prd.mjs"
  - "scripts/create-mvp-starter.mjs"
  - "scripts/create-feature-from-prd.mjs"
  - "package.json"
dependencies:
  - "docs/repo-os.md"
  - "docs/work-items/README.md"
  - "docs/product-squad/operating-model.md"
  - "docs/product-squad/goal-driven-delivery.md"
skip_reason: null
---

# Brief

## Problem

- 이 레포는 이미 canonical -> task-local -> generated 구조와 product-squad artifact 흐름을 갖고 있지만, 핵심 문서 metadata, adapter drift, active work item completeness를 한 번에 묶는 static gate가 없다.
- 현재 상태에서는 Repo OS가 암묵적 운영 철학에 가깝고, 어떤 문서가 실제 source of truth인지와 freshness를 기계적으로 판정하기 어렵다.
- generated adapter도 `pnpm ai:sync`를 사람이 기억해서 실행해야만 정합성이 맞고, check-only drift gate가 없어 CI나 handoff에서 빠르게 실패시키기 어렵다.

## Target User

- 이 레포를 직접 사용하는 founder, PM/PD/FE/BE 역할 에이전트, downstream service maintainer
- canonical docs와 generated adapter를 함께 관리해야 하는 contributor

## Target Moment

- 구조 규칙, 운영 규칙, work item contract, adapter-driving 문서를 함께 바꾸는 중요한 작업을 시작하거나 마무리하는 순간
- raw business goal에서 work item을 만든 뒤, 구현 전에 artifact graph와 문서 계층이 실제로 잠겨 있는지 확인해야 하는 순간

## Goal

- 이 레포를 agent runtime이 아니라 repo-native operating system으로 더 명확히 고정한다.
- 핵심 문서 metadata, active work item contract, generated adapter drift를 `pnpm repo:check` 하나로 빠르게 판정 가능하게 만든다.
- 중요한 작업의 공식 경로를 `goal packet -> brief -> role specs -> team-plan -> tests -> browser evidence -> quality-scorecard`로 문서와 generator에 동시에 반영한다.

## Constraints

- platform-specific orchestration이나 GitHub 전용 agent profile generation은 v1 범위에 넣지 않는다.
- generated adapter는 계속 canonical source를 복제하지 않는 loader로 유지한다.
- metadata 강제는 핵심 문서와 task-local artifact에만 한정하고, 나머지 `docs/*` 전반으로 과하게 확장하지 않는다.
- browser QA 자체를 자동 판정하는 런타임은 만들지 않고 static proof와 artifact contract까지만 다룬다.

## Non-Goals

- agent mailbox, orchestration server, long-running multi-agent platform을 새로 만들지 않는다.
- GitHub 전용 `.github/agents/*` 같은 speculative surface를 v1에 넣지 않는다.
- user-facing runtime behavior나 `apps/web` 제품 기능을 변경하지 않는다.

## Existing Evidence

- `ai/context/ai-native.md`, `docs/agent-context.md`, `docs/product-squad/*`, `docs/work-items/*`가 이미 Repo OS primitive 역할을 하고 있다.
- `scripts/check-squad-work-item.mjs`는 section completeness를, `scripts/sync-ai-context.mjs`는 generated adapter sync를 담당하지만 둘을 묶는 static gate는 없다.
- 최근 canonicalization 작업에서 `ai/context/ai-native.md`와 role artifacts는 정리되었으나, metadata/freshness/drift 추적은 아직 문서 계약으로만 남아 있다.

## Enterprise Decision Guardrails

- metadata는 핵심 문서에만 강제하고 나머지 문서에는 과한 운영 비용을 만들지 않는다.
- `repo:check`는 static proof만 다루고, browser QA 의미 판단은 계속 quality-scorecard에 남긴다.
- generated adapter drift는 `ai:sync --check` 형태로 해결하고, generated file 본문을 새로운 source of truth로 승격하지 않는다.
- work item generator와 template가 새 계약을 기본으로 만들지 못하면 Repo OS hardening은 완료로 보지 않는다.

## Success Metric

- `pnpm repo:check`가 core docs metadata, adapter drift, active work item contract를 한 번에 판정한다.
- canonical doc 변경 후 adapter regenerate를 생략하면 `repo:check`가 실패한다.
- 새 PRD/work item scaffold와 `feature:new` generated docs가 metadata와 최신 artifact contract를 기본값으로 가진다.
- `pnpm repo:check`, `pnpm squad:check 20260329-repo-os-hardening`, `pnpm ai:sync`, `pnpm verify`가 모두 통과한다.

## Acceptance Criteria

- [ ] `docs/repo-os.md`가 canonical/task-local/generated layer, metadata contract, verification entrypoint를 설명한다.
- [ ] 핵심 canonical docs, PRD docs, work item docs에 `owner`, `doc_type`, `source_of_truth`, `freshness`, `verification` metadata가 들어간다.
- [ ] `pnpm repo:check`가 metadata validity, adapter drift, active work item contract를 검사한다.
- [ ] `scripts/sync-ai-context.mjs --check`가 stale generated adapter를 non-mutating하게 검출한다.
- [ ] `scripts/create-prd.mjs`, `scripts/create-mvp-starter.mjs`, `scripts/create-feature-from-prd.mjs`, work item templates가 새 metadata 계약을 기본 출력으로 쓴다.
- [ ] `README.md`, `AGENTS.md`, `docs/agent-context.md`, `docs/work-items/README.md`가 `repo:check`와 Repo OS index를 안내한다.

## Open Questions

- `repo:check`가 historical work item까지 모두 hard fail로 볼지, active work item 중심으로 볼지는 migration 이후 운영에서 다시 조정할 수 있다.
