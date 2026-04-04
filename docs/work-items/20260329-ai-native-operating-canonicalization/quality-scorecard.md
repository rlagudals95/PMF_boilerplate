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
  - ai/context/ai-native.md
  - AGENTS.md
  - CLAUDE.md
  - GEMINI.md
  - docs/product-squad/templates/brief.md
  - docs/product-squad/templates/quality-scorecard.md
  - ai/skills/pm-role.md
  - ai/skills/pd-role.md
  - ai/skills/fe-role.md
  - ai/skills/be-role.md
  - ai/agents
  - scripts/check-squad-work-item.mjs
  - scripts/sync-ai-context.mjs
dependencies:
  - docs/work-items/20260329-ai-native-operating-canonicalization/brief.md
  - docs/work-items/20260329-ai-native-operating-canonicalization/backend-spec.md
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

# Quality Scorecard

## Goal Fit

- 이 변경은 AI-native 운영 약속을 한 canonical source로 고정하고, 중요한 작업의 기본 경로가 `role-based docs + quality gate`라는 점을 문서와 adapter에서 동시에 보이게 만든다.
- 정책, business goal, PRD, raw request가 같은 goal packet 규칙으로 수렴하도록 정리해 downstream 적용성을 높인다.
- PM/PD/FE/BE 역할이 enterprise-grade 철칙을 기본값으로 수행하게 만들어, 역할 분리가 단순 분업이 아니라 품질 보증 장치가 되도록 한다.

## Product Risks To Kill

- `ai/context/ai-native.md`를 추가했지만 기존 read order가 그대로 남아 사실상 읽히지 않는 위험
- 템플릿이 goal packet과 quality gate를 요구하지 않아 선언과 실제 artifact가 어긋나는 위험
- generated adapter가 새 canonical source를 몰라 다시 플랫폼별 drift가 생기는 위험
- 역할 스킬과 agent prompt가 책임은 말하지만 clean code, decision quality, UX system quality, contract quality를 충분히 강제하지 못하는 위험

## Review Checklist

- [x] primary business goal과 success metric이 이 변경과 연결된다
- [x] risky boundary test evidence가 있거나 skip reason이 명시되어 있다
- [x] 역할별 산출물이 enterprise principles를 따른다
- [x] 사용자에게 가장 중요한 CTA와 value proposition이 분명하거나 non-user-facing 범위라고 적혀 있다
- [x] trust, error, empty, pending state 또는 관련 skip reason이 검토되었다
- [x] analytics/admin visibility 또는 운영 해석 근거가 있어 결과를 해석할 수 있다
- [x] docs/spec sync가 확인되었다
- [x] fresh `pnpm verify` 또는 `pnpm verify:full` 결과가 있다
- [x] responsive + accessibility + browser QA evidence가 있거나 non-user-facing skip reason이 있다

## Browser QA Evidence

- non-user-facing 작업이다.
- skip reason: 앱 runtime UI를 바꾸지 않고 문서, 템플릿, adapter generation, read-order만 조정한다.

## Code Quality Evidence

- `ai/context/ai-native.md`에 clean code, single responsibility, explicit boundaries, encapsulation, composition over inheritance, selective OOP 원칙을 공통 enterprise principles로 추가했다.
- `ai/skills/pm-role.md`, `pd-role.md`, `fe-role.md`, `be-role.md`에 역할별 enterprise principles를 추가했고, `ai/agents/*.md`도 같은 원칙을 읽고 적용하도록 맞췄다.
- `scripts/check-squad-work-item.mjs`가 `Enterprise Decision Guardrails`, `Enterprise UX Principles`, `Enterprise FE Guardrails`, `Enterprise BE Guardrails`, `Principle Adherence` 섹션을 확인하도록 갱신됐다.
- fresh `pnpm verify`가 exit code 0으로 끝났고 lint, typecheck, test가 모두 통과했다.

## Replayable Evaluation Evidence

- skip reason: canonical workflow hardening slice. `pnpm repo:check --work 20260329-ai-native-operating-canonicalization`, `pnpm squad:check 20260329-ai-native-operating-canonicalization`, `pnpm ai:sync`, and `pnpm verify` act as the replayable proof for this non-user-facing change.

## Principle Adherence

- PM은 decision-complete 문서와 명확한 acceptance criteria를 기본값으로 두도록 정리했다.
- PD는 hierarchy, trust, accessibility, edge-state completeness를 기본값으로 두도록 정리했다.
- FE는 작은 책임 단위, explicit boundary, composition-first 구조를 기본값으로 두도록 정리했다.
- BE는 validation/use case/repository 분리, encapsulated invariant, explicit adapter contract를 기본값으로 두도록 정리했다.
- quality review는 principle adherence까지 판정하도록 정리했다.

## Docs And Spec Sync

- role principle source는 `ai/context/ai-native.md`로 두고, role skill, agent prompt, product-squad docs, template, check script가 같은 원칙을 말하도록 정리했다.
- `docs/product-squad/operating-model.md`, `agent-team-delivery.md`, `goal-driven-delivery.md`, `docs/work-items/README.md`도 principle adherence가 quality gate의 일부임을 반영했다.

## Verification Evidence

- `pnpm squad:check 20260329-ai-native-operating-canonicalization`
  - 6 pass, 0 warn, 0 fail
- `pnpm ai:sync`
  - Claude skills 15, Claude agents 6, Gemini commands 15, Gemini extension skills 15, Codex skills 15, Cursor rules 4, Copilot instructions 1
- `pnpm verify`
  - lint, typecheck, test 모두 exit code 0

## Measurement And Ops Checks

- 성공 판단은 제품 metric이 아니라 운영 문서/adapter 정렬로 본다.
- entry 문서와 generated adapter 모두에 `ai/context/ai-native.md`가 early-read source로 반영돼야 한다.

## Release Recommendation

- ship
- 근거: 역할별 enterprise principles가 canonical context, role skills, agent prompts, product-squad docs, templates, `squad:check`, generated adapters까지 일관되게 반영됐고 fresh verification이 모두 통과했다.
