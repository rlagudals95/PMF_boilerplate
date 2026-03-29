---
owner: "platform"
doc_type: "spec"
source_of_truth: false
freshness: "draft"
verification: "manual"
status: proposed
owner_role: platform
source_request: "웹서치로 검증된 multi-agent 방법론을 바탕으로 이 repo의 에이전트 팀 토폴로지를 supervisor-first 구조로 강화하고 싶다."
affected_paths:
  - "ai/context/ai-native.md"
  - "ai/context/platform-optimization.md"
  - "ai/skills/product-squad.md"
  - "ai/skills/agent-team-delivery.md"
  - "ai/skills/goal-driven-delivery.md"
  - "ai/skills/_index.md"
  - "docs/product-squad/operating-model.md"
  - "docs/product-squad/goal-driven-delivery.md"
  - "docs/product-squad/agent-team-delivery.md"
  - "docs/product-squad/templates/quality-scorecard.md"
  - "docs/ai-starter-prompt-pack.md"
  - "docs/mvp-starter-prompt-evaluation.md"
  - "README.md"
  - "docs/start-your-mvp.md"
  - "ai/agents/product-lead.md"
  - "ai/agents/quality-reviewer.md"
dependencies:
  - "docs/superpowers/specs/2026-03-29-po-orchestrated-one-shot-quality-design.md"
  - "ai/skills/product-squad.md"
  - "docs/product-squad/agent-team-delivery.md"
skip_reason: null
---

# Agent Topology V2 Design

## Summary

이 설계의 목적은 이 보일러플레이트의 역할 기반 작업 방식을 “여러 역할이 자유롭게 떠드는 팀”에서 “PO supervisor가 흐름을 통제하고, bounded specialist가 산출물을 반환하고, evaluator가 독립적으로 release를 판정하는 구조”로 정교화하는 것입니다.

외부 사례를 보면 MetaGPT, ChatDev 같은 연구 시스템은 소프트웨어 회사를 흉내 내는 역할 팀 구성을 보여주지만, OpenAI, Anthropic, LangChain, Microsoft 같은 production guidance는 더 보수적입니다. 공통점은 아래 네 가지입니다.

- 중앙 orchestrator 또는 supervisor가 user conversation과 최종 synthesis를 소유한다.
- specialist는 좁은 책임과 명확한 handoff packet으로 움직인다.
- quality/release/eval 역할이 구현 역할과 분리된다.
- 운영 품질은 agent 수보다 SOP, tool scope, benchmark, evidence loop에서 나온다.

이 저장소는 이미 `po-role`, `goal packet`, `visual bar`, `quality-scorecard`를 갖고 있으므로 방향은 맞다. 다만 아직 아래 빈칸이 남아 있다.

- `po-role`이 user conversation owner라는 점이 충분히 강하지 않다.
- PM/PD/FE/BE가 동등 peer처럼 읽히는 문맥이 남아 있다.
- independent evaluator role이 canonical skill로 존재하지 않는다.
- starter prompt와 evaluation rubric이 “release gate discipline”을 명시적으로 평가하지 않는다.

## Goals

- 중요한 작업의 기본 토폴로지를 `po supervisor -> bounded specialists -> evaluator gate`로 명시한다.
- specialist는 자유 토론보다 repo artifact와 handoff packet을 기준으로 일하게 만든다.
- `evaluator-role`을 canonical skill로 추가해 `ship | iterate | stop` 판단을 독립적으로 남기게 한다.
- prompt/workflow/agent topology 변경 시 replayable benchmark 또는 evaluation evidence를 요구한다.
- 이 모든 규칙을 tool-neutral canonical docs와 generated adapters로 동기화한다.

## Non-Goals

- 별도 orchestration 서버 구축
- agent mailbox나 autonomous swarm runtime 구현
- 모든 작업을 무조건 multi-agent로 바꾸는 것
- browser companion을 기본값으로 강제하는 것
- benchmark runner를 코드로 자동화하는 것

## Proposed Canonical Topology

### Default Work Loop

1. `po-role`
   - request triage
   - goal packet completeness
   - user conversation ownership
   - role ordering and approval
2. `pm-role`
   - decision-complete goal framing
3. `pd-role`
   - commercial quality and trust critique
4. `fe-role` / `be-role`
   - build slice and measurement contract
5. `evaluator-role`
   - independent release judgment
6. `product-squad`
   - work item synthesis and scorecard convergence

`product-squad`는 shell이고, 실제 flow control owner는 `po-role`이다.

### Communication Rules

- 사용자와 직접 대화하는 기본 owner는 `po-role`이다.
- specialist는 handoff packet과 repo docs로만 다음 역할에 넘긴다.
- direct worker-to-worker chat은 `agent-team` 모드에서만 허용한다.
- evaluator는 implementation convenience보다 evidence completeness를 우선한다.

### Permission Default

- `po`, `pm`, `pd`, `evaluator`
  - read-first, docs-first
- `fe`, `be`
  - owned files 안에서 write
- browser/evidence worker
  - no code edits

이 권한 모델은 실제 tool permission과 1:1 대응하지 않아도 되지만, canonical operating expectation으로는 남겨야 한다.

## Canonical Changes

- `ai/skills/evaluator-role.md`
  - 독립 evaluator의 checklist, output, guardrails 정의
- `ai/context/ai-native.md`
  - supervisor-first role model과 evaluator 추가
- `ai/context/platform-optimization.md`
  - best performance 정의에 evaluator gate와 replayable evaluation 추가
- `docs/product-squad/operating-model.md`
  - role selection과 closing loop를 evaluator 포함 구조로 조정
- `docs/product-squad/goal-driven-delivery.md`
  - release gate independence와 replayable evaluation 추가
- `docs/product-squad/agent-team-delivery.md`
  - lead-owned conversation, specialist artifact contract, permission defaults 추가
- `docs/product-squad/templates/quality-scorecard.md`
  - evaluator gate와 replayable evaluation evidence 항목 추가
- `README.md`, `docs/start-your-mvp.md`, `docs/ai-starter-prompt-pack.md`
  - day-0 시작 흐름을 supervisor-first 구조로 수정
- `docs/mvp-starter-prompt-evaluation.md`
  - release gate discipline과 commercial quality discipline 평가 추가
- `ai/agents/product-lead.md`, `ai/agents/quality-reviewer.md`
  - platform-native acceleration prompt를 새 토폴로지와 정렬

## Acceptance Criteria

- canonical docs에서 default topology가 `po supervisor -> bounded specialists -> evaluator gate`로 일관되게 읽힌다.
- `evaluator-role`이 canonical skill index에 등록되고 quality gate 문서와 연결된다.
- starter prompt와 evaluation rubric이 release gate discipline을 평가한다.
- `pnpm ai:sync`, `pnpm repo:check`, `pnpm verify`가 모두 통과한다.
