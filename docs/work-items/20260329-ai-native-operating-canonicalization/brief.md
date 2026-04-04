---
owner: "pm"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: in_progress
owner_role: pm
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
  - "verify"
  - "quality-scorecard"
  - "replayable-evaluation"
release_surface: "none"
primary_gate: "scorecard"
---

# Brief

## Problem

- AI-native 운영 약속, quality bar, role-based operating model, Docs-as-Code 원칙이 여러 canonical 문서에 흩어져 있다.
- 그래서 레포의 핵심 promise는 강하지만, 어떤 문서가 최상위 source인지와 어떤 artifact가 그 약속을 실제로 강제하는지는 덜 선명하다.
- adapter read order와 work item template도 이 약속을 직접 반영하지 않아 drift가 생길 수 있다.

## Target User

- 이 레포에서 작업하는 AI 에이전트와 인간 기여자
- business-goal-driven 작업을 downstream 서비스에도 같은 방식으로 재사용하려는 팀

## Target Moment

- 구조/운영 규칙을 바꾸는 중요한 작업을 시작할 때
- raw request, policy, business goal을 실제 work item과 thin slice로 정규화해야 할 때

## Goal

- `ai/context/ai-native.md`를 early-read canonical source로 추가하고, 관련 entry 문서, workflow 문서, template, adapter generation 경로를 이 축으로 재정렬한다.
- 중요한 작업의 기본값이 `role-based docs + quality gate`라는 점을 문서와 template에서 직접 드러내게 만든다.
- PM/PD/FE/BE 역할이 각자 엔터프라이즈급 철칙을 수행하도록 공통 원칙과 역할별 guardrail을 canonical source에 고정한다.

## Constraints

- 이번 slice는 문서/운영 규칙 정비가 중심이며 `apps/web` 런타임 구조와 패키지 경계는 바꾸지 않는다.
- generated adapter는 여전히 파생 산출물로 두고, source of truth는 `ai/`와 `docs/`에 남긴다.
- 새 본문 정책을 adapter에 복제하지 않고, 읽기 순서와 참조만 강화한다.

## Non-Goals

- 별도 orchestration 서비스, agent runtime, background agent 플랫폼 구현
- heavy enterprise feature 범위 확장
- 제품 UI나 business runtime 동작 변경

## Existing Evidence

- 기존 `project.md`, `spec-driven.md`, `agent-context.md`, `goal-driven-delivery.md`, `vibe-coding-playbook.md`에 AI-native 약속이 부분적으로 분산돼 있다.
- 현재 `brief.md` 템플릿에는 `Target Moment`, `Existing Evidence`가 없어 goal packet이 완전히 드러나지 않는다.
- 현재 generated adapter read order에는 `ai/context/ai-native.md`가 존재하지 않는다.
- 현재 role skill과 agent prompt는 역할 책임은 설명하지만 clean code, OOP/encapsulation, decision quality, UX system quality 같은 enterprise-grade 철칙은 충분히 명시하지 않는다.

## Enterprise Decision Guardrails

- PM 산출물은 회의 메모가 아니라 decision-complete 문서처럼 작성한다.
- 용어는 끝까지 일관되게 유지하고, acceptance criteria에는 숨은 해석을 남기지 않는다.
- 역할별 철칙은 `ai/context/ai-native.md`를 canonical source로 두고 role skill, agent prompt, template, check script까지 같은 방향으로 맞춘다.

## Success Metric

- `ai/context/ai-native.md`가 early-read canonical source로 추가된다.
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, generated adapter read order가 새 문서를 초반에 읽도록 맞춰진다.
- `brief.md`와 `quality-scorecard.md` 템플릿만 읽어도 goal packet과 quality gate의 핵심 빈칸이 드러난다.
- role skill과 agent prompt만 읽어도 각 역할이 어떤 enterprise-grade 원칙을 지켜야 하는지 알 수 있다.
- `pnpm ai:sync`, `pnpm squad:check 20260329-ai-native-operating-canonicalization`, `pnpm verify`가 통과한다.

## Acceptance Criteria

- `ai/context/ai-native.md`가 repo promise, input normalization, quality bar, role operating model, Docs-as-Code SSOT, non-goals를 담는 canonical 문서로 추가된다.
- entry/load-order 문서와 관련 canonical skill/context 문서가 `project.md -> ai-native.md -> engineering/spec-driven` 순서를 반영한다.
- `docs/product-squad/templates/brief.md`에 `Target Moment`, `Existing Evidence` 섹션이 추가된다.
- `docs/product-squad/templates/brief.md`, `ux-review.md`, `frontend-spec.md`, `backend-spec.md`가 각 역할의 enterprise guardrail을 드러낸다.
- `docs/product-squad/templates/quality-scorecard.md`가 test/docs sync/verify evidence를 quality gate로 요구한다.
- `docs/product-squad/goal-driven-delivery.md`, `docs/product-squad/operating-model.md`, `docs/work-items/README.md`, `docs/spec-lifecycle.md`가 새 운영 원칙을 반영한다.
- `ai/skills/pm-role.md`, `ai/skills/pd-role.md`, `ai/skills/fe-role.md`, `ai/skills/be-role.md`, `ai/skills/product-squad.md`, `ai/skills/goal-driven-delivery.md`가 역할별 enterprise principles를 반영한다.
- `ai/agents/product-lead.md`, `pm-analyst.md`, `pd-reviewer.md`, `fe-builder.md`, `be-builder.md`, `quality-reviewer.md`가 같은 철칙을 읽고 적용한다.
- `scripts/check-squad-work-item.mjs`가 새 guardrail 섹션을 확인한다.
- README, architecture, vibe-coding playbook, prompt pack이 새 canonical source와 모순되지 않는다.
- `scripts/sync-ai-context.mjs`가 generated adapter read order와 docs rule에 새 canonical source를 반영한다.

## Open Questions

- 없음. 상세 결정은 승인된 plan과 이 brief에 고정한다.
