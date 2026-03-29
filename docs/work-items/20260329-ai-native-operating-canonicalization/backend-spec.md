---
owner: "be"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: be
source_request: "AI-native 운영 원칙 canonicalization plan 구현"
affected_paths:
  - scripts/sync-ai-context.mjs
  - .github/copilot-instructions.md
  - .cursor/rules/*.mdc
  - .claude/skills/*/SKILL.md
  - .gemini/commands/repo/*
  - .gemini/extensions/*/skills/*/SKILL.md
  - .codex/skills/*/SKILL.md
dependencies:
  - docs/work-items/20260329-ai-native-operating-canonicalization/brief.md
  - ai/context/ai-native.md
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- 제품 데이터 스키마 변경은 없다.
- 변경 대상은 adapter generation 스크립트와 generated read-order/output contract다.

## Action Service Repository Plan

- `scripts/sync-ai-context.mjs`가 generated adapter의 canonical source 목록에 `ai/context/ai-native.md`를 포함하게 만든다.
- Copilot instructions와 Cursor repo rule이 policy/business-goal 입력 정규화와 `ai/context/ai-native.md` 우선 갱신 원칙을 반영하게 만든다.
- generated adapter는 본문 정책을 직접 복제하지 않고 read order와 canonical reference만 강화한다.

## Analytics Impact

- 제품 analytics 이벤트에는 영향이 없다.
- 운영 측면에서는 AI tool이 더 일관된 early context를 읽게 되어 drift를 줄이는 개선이다.

## Failure Modes

- `pnpm ai:sync`가 새 canonical source를 generated adapter에 반영하지 못하면 entry 문서와 generated output 사이에 read-order drift가 남는다.
- adapter에 정책 본문을 과하게 복제하면 canonical source가 다시 분기된다.
- work item template와 generated rule이 서로 다른 quality gate를 말하면 중요한 작업에서 운영 기준이 흔들린다.

## Measurement Guardrails

- 성공 기준은 runtime metric이 아니라 운영 문서/adapter 정렬이다.
- `ai/context/ai-native.md`가 entry 문서, canonical docs, generated adapter에 모두 early-read source로 반영돼야 한다.
- `quality-scorecard.md`에는 docs/spec sync, verify evidence, non-user-facing browser skip reason이 함께 남아야 한다.

## Enterprise BE Guardrails

- validation, orchestration, persistence, adapter 책임을 섞지 않는다.
- contract와 invariant를 명시적으로 보호하고, optional provider failure가 core flow를 오염시키지 않게 한다.
- object-oriented design은 상태와 규칙의 소유를 더 명확하게 만들 때만 사용하고, ceremony를 위한 계층은 피한다.
- `scripts/check-squad-work-item.mjs`는 새 backend guardrail 섹션을 확인해 문서 품질을 강제한다.

## Boundary / Use Case / Repository Contract Test Plan

- 먼저 failing evidence로 고정할 contract
  - 변경 전 `rg -n "ai/context/ai-native\\.md"`가 entry 문서와 generated adapter에서 0 match여야 한다.
- adapter generation 검증 포인트
  - `pnpm ai:sync` 후 Copilot instructions와 Cursor repo rule이 새 canonical source를 초반에 읽도록 생성되어야 한다.
  - generated skill output은 `ai/skills/*` source 수정 결과만 반영하고, 별도 수동 수정 흔적이 없어야 한다.
- 최종 verify에 남길 통합 확인 항목
  - `pnpm squad:check 20260329-ai-native-operating-canonicalization`
- `pnpm ai:sync`
- `pnpm verify`
