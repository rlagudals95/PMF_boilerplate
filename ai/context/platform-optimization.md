---
owner: "platform"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Platform Optimization

이 문서는 플랫폼별 AI adapter를 어떻게 최적화할지 정의하는 canonical context입니다.

## 목적

- 같은 저장소 규칙을 유지하면서도 Claude, Codex, Gemini, Cursor, Copilot이 각자 가장 잘 먹는 형식을 제공한다.
- 플랫폼 전용 기능을 쓰더라도 source of truth가 분기되지 않게 한다.
- 사람용 문서, 모델용 규칙, generated adapter를 분리한다.

## Canonical Layers

- `ai/context/*`, `ai/skills/*`
  - 플랫폼 중립 규칙과 workflow source of truth
- `ai/agents/*`
  - 플랫폼 전용 acceleration이 필요할 때 사용하는 canonical agent prompt
- `docs/*`
  - 사람이 읽고 합의하고 채우는 artifact와 운영 설명
- generated adapter
  - `.claude/*`, `.codex/*`, `.gemini/*`, `.cursor/*`, `.github/*`

## Optimization Principle

- 공통 규칙은 `ai/`에 둔다.
- 사람이 채우는 산출물은 `docs/`에 둔다.
- 플랫폼 전용 acceleration은 generated adapter로만 노출한다.
- 플랫폼 전용 기능이 canonical policy를 새로 만들면 안 된다.
- platform feature는 loading, delegation, reminder, validation acceleration까지만 맡는다.

## Platform Strategy

### Claude

- `.claude/skills/*`로 canonical skill을 노출한다.
- `.claude/agents/*`로 project subagent를 노출한다.
- `.claude/settings.json` hook으로 중요한 작업에서 workflow를 더 잘 타게 만든다.
- subagent와 hook은 acceleration일 뿐, 기준 문서는 여전히 repo Markdown이다.

### Codex

- 루트 `AGENTS.md`를 repository entry로 유지한다.
- `.codex/skills/*`와 skill index를 generated adapter로 유지한다.
- tool-native subagent가 없더라도 `product-squad`, `goal-driven-delivery`, `agent-team-delivery`, `repo:check`, `squad:check`를 통해 같은 품질 루프를 재현한다.

### Gemini

- `.gemini/commands/repo/*`를 slash command entry로 사용한다.
- `.gemini/extensions/*/skills/*`를 installable extension skill로 유지한다.
- 중요한 작업은 command entry보다 canonical work item artifact와 `repo:check`, `squad:check`를 기준으로 마무리한다.

### Cursor And Copilot

- `.cursor/rules/*.mdc`, `.github/copilot-instructions.md`는 짧은 guidance와 loading hint만 둔다.
- 긴 정책은 adapter에 복붙하지 않고 canonical 문서로 되돌린다.

## What “Best Performance” Means

- 모델이 중요한 작업에서 `brief.md`, `team-plan.md`, `quality-scorecard.md`를 더 자주 만들고 읽는다.
- 모델이 중요한 작업에서 `po-role` gate, goal packet completeness, clarification loop를 생략하지 않는다.
- goal-driven 작업에서 role debate와 browser QA를 생략하지 않는다.
- landing 같은 user-facing 작업에서 commercial quality critique와 visual bar 판단을 건너뛰지 않는다.
- 플랫폼 기능이 있으면 delegation과 reminder를 활용하되, 기능이 없어도 같은 artifact와 command로 재현 가능하다.
- finishing gate는 감이 아니라 `pnpm repo:check`, `pnpm verify`, `pnpm squad:check`, browser evidence 같은 repo-local proof로 닫힌다.

## Guardrails

- generated adapter는 직접 수정하지 않는다. `pnpm ai:sync`로 다시 만든다.
- 플랫폼 전용 프롬프트에 canonical policy를 복제하지 않는다.
- platform feature가 unavailable이어도 같은 결과를 낼 수 있어야 한다.
- vendor-specific orchestration을 제품 코드나 운영 규칙의 source of truth로 삼지 않는다.
