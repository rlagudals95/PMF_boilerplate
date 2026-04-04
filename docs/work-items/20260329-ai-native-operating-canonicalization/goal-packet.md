---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: in_progress
owner_role: product-squad
source_request: "AI-native 운영 원칙 canonicalization plan 구현 + PM/PD/FE/BE 역할별 엔터프라이즈급 철칙 반영"
affected_paths:
  - AGENTS.md
  - CLAUDE.md
  - GEMINI.md
  - ai/context/ai-native.md
  - ai/context/project.md
  - ai/context/engineering.md
  - ai/context/spec-driven.md
  - ai/skills/pm-role.md
  - ai/skills/pd-role.md
  - ai/skills/fe-role.md
  - ai/skills/be-role.md
  - ai/skills/product-squad.md
  - ai/skills/goal-driven-delivery.md
  - ai/agents
  - docs/agent-context.md
  - docs/product-squad
  - docs/work-items/README.md
  - docs/spec-lifecycle.md
  - README.md
  - docs/architecture.md
  - docs/vibe-coding-playbook.md
  - docs/ai-starter-prompt-pack.md
  - scripts/check-squad-work-item.mjs
  - scripts/sync-ai-context.mjs
dependencies:
  - ai/context/doc-sync.md
  - docs/product-squad/operating-model.md
  - docs/product-squad/goal-driven-delivery.md
skip_reason: null
work_class: "hard-gated"
change_types:
  - "prompt-workflow"
evidence_requirements:
  - "repo:check"
  - "squad:check"
  - "ai:sync"
  - "verify"
release_surface: "none"
primary_gate: "scorecard"
---

# Goal Packet

## Business Goal

- AI-native 운영 원칙을 단일 canonical source와 role-based quality gate로 재정렬한다.

## Target User

- 이 레포에서 작업하는 AI 에이전트와 인간 기여자
- 같은 운영체계를 downstream 서비스에 재사용하려는 팀

## Target Moment

- 구조/운영 규칙을 바꾸는 중요한 작업을 시작할 때
- raw request, policy, business goal을 thin slice와 work item으로 정규화해야 할 때

## Success Metric

- `ai/context/ai-native.md`와 load-order/adapters가 같은 canonical source를 가리킨다.
- `pnpm ai:sync`, `pnpm squad:check 20260329-ai-native-operating-canonicalization`, `pnpm verify`가 통과한다.

## Non-Goals

- 별도 orchestration 서비스, agent runtime, background agent 플랫폼 구현
- heavy enterprise feature 범위 확장
- 제품 UI나 business runtime 동작 변경

## Constraints

- 이번 slice는 문서/운영 규칙 정비가 중심이며 `apps/web` 런타임 구조와 패키지 경계는 바꾸지 않는다.
- generated adapter는 파생 산출물로 유지하고 source of truth는 `ai/`와 `docs/`에 남긴다.
- 새 본문 정책을 adapter에 복제하지 않고 읽기 순서와 참조만 강화한다.

## Existing Evidence

- AI-native 약속이 `project.md`, `spec-driven.md`, `agent-context.md`, `goal-driven-delivery.md` 등에 분산돼 있었다.
- 현재 generated adapter read order에는 `ai/context/ai-native.md`가 초반 canonical source로 드러나지 않았다.
- 현재 role skill과 agent prompt는 enterprise-grade 역할 철칙을 충분히 드러내지 않았다.

## Selected Delivery Shape

- non-product operating slice

## Active Scope

- canonical context
- role skills
- adapter sync
- work-item templates
- quality gates

## Deferred Scope

- `apps/web` runtime code
- `packages/*` runtime behavior
- product-facing MVP surface changes

## Selection Rationale

- 이번 요청은 제품 기능 추가보다 운영체계 hardening이 핵심이므로 가장 작은 측정 가능한 단위는 문서, 템플릿, check script, adapter generation 정렬이다.
- runtime product code를 건드리지 않고도 canonical source, quality gate, role operating model을 선명하게 만들 수 있다.
