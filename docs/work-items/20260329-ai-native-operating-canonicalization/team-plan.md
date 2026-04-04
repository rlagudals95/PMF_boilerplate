---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: product-squad
source_request: "AI-native 운영 원칙 canonicalization plan 구현"
affected_paths:
  - ai/context
  - ai/skills
  - docs/product-squad
  - docs/work-items/README.md
  - docs/spec-lifecycle.md
  - README.md
  - docs/architecture.md
  - docs/vibe-coding-playbook.md
  - docs/ai-starter-prompt-pack.md
  - scripts/sync-ai-context.mjs
  - .github/copilot-instructions.md
  - .cursor/rules
dependencies:
  - docs/work-items/20260329-ai-native-operating-canonicalization/brief.md
  - ai/context/doc-sync.md
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

# Team Plan

## Mission

- AI-native 운영 약속을 한 canonical source로 고정하고, 중요한 작업의 기본 경로가 `role-based docs + quality gate`임을 문서와 adapter에서 동시에 보이게 만든다.

## Execution Mode

- `single-agent sequential`

## Team Topology

- lead: Codex main agent가 전체 문서/adapter 변경을 조율한다.
- pm: brief와 acceptance criteria, decision quality principles를 고정한다.
- pd: UX system quality principles를 canonical skill/template에 반영한다.
- fe: FE code/module quality principles를 canonical skill/template에 반영한다.
- be: `scripts/sync-ai-context.mjs`, `scripts/check-squad-work-item.mjs`, generated adapter 반영과 BE principles를 담당한다.
- quality review: 문서 drift, `pnpm squad:check`, `pnpm ai:sync`, `pnpm verify`를 근거로 최종 판단한다.

## Shared Context Pack

- brief: `docs/work-items/20260329-ai-native-operating-canonicalization/brief.md`
- feature spec: 없음. 구조/운영 규칙 정비 slice라 별도 `feature-spec.md`는 사용하지 않는다.
- ux review: `docs/work-items/20260329-ai-native-operating-canonicalization/ux-review.md`
- frontend spec: `docs/work-items/20260329-ai-native-operating-canonicalization/frontend-spec.md`
- backend spec: `docs/work-items/20260329-ai-native-operating-canonicalization/backend-spec.md`
- external evidence: `AGENTS.md`, `ai/context/spec-driven.md`, `docs/agent-context.md`, `docs/product-squad/operating-model.md`, `scripts/sync-ai-context.mjs`
- external evidence: `AGENTS.md`, `ai/context/spec-driven.md`, `docs/agent-context.md`, `docs/product-squad/operating-model.md`, `scripts/sync-ai-context.mjs`, `scripts/check-squad-work-item.mjs`

## Shared Task List

- task_id: T1-canonical-doc
  owner: lead
  status: completed
  depends_on: none
  output: `ai/context/ai-native.md`와 load-order 문서 갱신
- task_id: T2-artifact-contracts
  owner: pm
  status: completed
  depends_on: T1-canonical-doc
  output: brief/quality-scorecard 템플릿과 workflow 문서 갱신
- task_id: T3-adapter-sync
  owner: be
  status: completed
  depends_on: T1-canonical-doc
  output: `scripts/sync-ai-context.mjs` 갱신과 generated adapter 재생성
- task_id: T4-verification
  owner: quality review
  status: completed
  depends_on: T2-artifact-contracts, T3-adapter-sync
  output: `pnpm squad:check`, `pnpm ai:sync`, `pnpm verify` evidence와 scorecard 업데이트
- task_id: T5-role-enterprise-principles
  owner: lead
  status: completed
  depends_on: T1-canonical-doc, T2-artifact-contracts
  output: `ai-native`, role skills, agent prompts, product-squad docs, templates, check script에 역할별 enterprise principles 반영
- task_id: T6-reverify
  owner: quality review
  status: completed
  depends_on: T5-role-enterprise-principles
  output: regenerated adapters와 fresh verification evidence로 scorecard 재확인

## File Ownership Plan

- owner: lead
  paths: `AGENTS.md`, `ai/context/*`, `ai/skills/*`, `ai/agents/*`, `docs/agent-context.md`, `README.md`, `docs/architecture.md`, `docs/vibe-coding-playbook.md`, `docs/ai-starter-prompt-pack.md`
- owner: pm
  paths: `docs/product-squad/*`, `docs/work-items/README.md`, `docs/spec-lifecycle.md`, `docs/work-items/20260329-ai-native-operating-canonicalization/*`
- owner: be
  paths: `scripts/sync-ai-context.mjs`, `scripts/check-squad-work-item.mjs`, generated adapter outputs

## Handoff Log

- from: lead
  to: pm
  packet: canonical source와 load-order 갱신 후, artifact 계약에 goal packet과 quality gate를 녹이는 작업으로 handoff
- from: pm
  to: be
  packet: 템플릿/운영 문서가 확정되었으니 adapter generation 입력과 generated output을 동일 축으로 맞추는 작업으로 handoff
- from: be
  to: quality review
  packet: generated adapter 재생성과 검증 명령 결과를 확인해 scorecard를 닫는 단계로 handoff
- from: lead
  to: quality review
  packet: 역할별 enterprise principles가 canonical source, role skill, agent prompt, template, check script까지 일관되게 반영됐는지 확인하는 단계로 handoff

## Escalations

- load order 충돌이 생기면 `ai/context/ai-native.md`를 early-read canonical source로 우선한다.
- generated adapter와 canonical 문서가 충돌하면 generated output을 직접 고치지 않고 `scripts/sync-ai-context.mjs`를 수정한다.
