# One-Shot Prompt-First MVP Design

## 목적

- `mvp:new --prompt`를 사용자-facing 메인 경험에서 완전히 제거한다.
- 이 레포의 primary onboarding promise를 `repo-aware one-shot prompt -> AI가 바로 MVP 적용`으로 고정한다.
- README, AI context, generated adapter, runtime guidance가 모두 같은 메시지를 말하게 만든다.

## 문제 정의

현재 레포는 문서상으로는 prompt-first를 지향하지만, 여전히 `mvp:new --prompt`가 여러 문서와 generated adapter에서 "가장 빠른 시작"처럼 소개되고 있다.

이 상태는 아래 문제를 만든다.

- 사용자가 one-shot prompt 대신 CLI 사용법을 먼저 배워야 하는 것처럼 느낀다.
- "AI가 repo를 읽고 바로 제품을 만든다"는 레포의 핵심 promise가 흐려진다.
- `mvp:new`의 역할이 `structured scaffold helper`인지 `메인 진입점`인지 모호해진다.
- README와 AI context가 runtime 구조보다 generator UX를 더 강조하는 것처럼 읽힌다.

## 목표 상태

사용자는 README 최상단에서 아래 경험을 바로 이해해야 한다.

1. 이 레포는 AI에게 one-shot prompt를 던져 비즈니스 요구에 맞는 MVP를 적용하는 kit다.
2. AI는 `AGENTS.md`, `ai/context/*`, 관련 `docs/*`를 먼저 읽는다.
3. AI는 정말 필요할 때만 1~3개의 짧은 질문을 한다.
4. AI는 existing `landing / lead / consultation / payment / admin / auth` 블록 안에서 가장 얇은 MVP shape를 고른다.
5. AI는 먼저 `apps/web/src/lib/product-config.ts`와 product-facing surface를 맞춘다.
6. 마지막에 active/deferred flows, env requirements, verification result를 요약한다.

`mvp:new`는 남더라도 아래 역할로만 남는다.

- `--goal --audience --offer --signal` 기반 structured helper
- manual scaffold가 필요한 contributor용 보조 도구
- primary onboarding promise가 아닌 secondary/internal workflow

## 비목표

- `mvp:new` 자체를 삭제하지 않는다.
- prompt를 받아 PRD/work item을 자동 생성하는 deterministic heuristic 전체를 지금 제거하지 않는다.
- 이번 단계에서 runtime feature toggle system 전체를 구현하지 않는다.
- `prompt -> product-config 자동 덮어쓰기`까지 한 번에 구현하지 않는다.

## 제안 접근

### 1. 사용자-facing UX 재정렬

- README 최상단은 one-shot prompt와 예시 프롬프트를 중심으로 유지한다.
- `mvp:new --prompt` 예시는 제거한다.
- `mvp:new` 섹션은 structured helper로만 설명한다.
- 시작 문서, prompt pack, PRD/work item 문서도 같은 메시지로 정렬한다.

### 2. CLI contract 단순화

- `scripts/create-mvp-starter.mjs`에서 `--prompt` 입력을 제거한다.
- usage/help text는 structured input만 허용하도록 바꾼다.
- `pnpm mvp:new <slug> --goal ... --audience ... --offer ... --signal ...`만 공식 지원으로 남긴다.

### 3. Adapter/generated guidance 동기화

- canonical source에서 `mvp:new --prompt` 언급을 제거한다.
- `pnpm ai:sync`로 generated adapter를 다시 만든다.
- generated output에서도 prompt-first는 AI prompt pack 기준으로, `mvp:new`는 structured helper 기준으로 읽히게 만든다.

### 4. Runtime guidance는 prompt-first를 뒷받침

- `product-config` 문서는 계속 "AI가 repo를 읽고 먼저 product-facing surface를 맞춘다"를 중심으로 설명한다.
- 다만 `mvp:new --prompt`를 repo-local starter로 소개하는 문구는 제거한다.
- structured helper와 prompt-first applicator의 역할 차이를 더 분명히 나눈다.

## 영향 범위

### 코드

- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-mvp-starter.mjs`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/package.json`

### 사용자-facing 문서

- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/README.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-config-system.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/prds/README.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/vibe-coding-playbook.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/mvp-starter-prompt-evaluation.md`

### AI context / adapter source

- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai/context/project.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/agent-context.md`
- `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/sync-ai-context.mjs`

### generated output

- `pnpm ai:sync`로 갱신되는 `.github`, `.cursor`, `.claude`, `.gemini`, `.codex` adapter files

## 수용 기준

- README와 시작 문서에서 메인 시작 방식이 one-shot prompt로만 읽힌다.
- `mvp:new --prompt`는 코드와 canonical 문서에서 더 이상 지원/권장되지 않는다.
- `mvp:new`는 structured helper로만 설명된다.
- AI prompt pack과 output contract는 유지된다.
- `pnpm ai:sync`와 `pnpm verify`가 통과한다.

## 리스크와 대응

### 리스크 1. 기존 문서와 generated adapter 간 drift

- 대응: canonical source 수정 후 `pnpm ai:sync`를 반드시 실행한다.

### 리스크 2. `mvp:new --prompt`에 의존하던 설명이나 평가 문서 누락

- 대응: `rg`로 `--prompt`와 `mvp:new` 관련 문구를 전수 검색해 제거 또는 재서술한다.

### 리스크 3. 사용자에게 `mvp:new` 자체가 사라진 것으로 오해될 수 있음

- 대응: README와 시작 문서에서 structured helper로서의 `mvp:new`는 짧게 유지한다.

## 구현 후 기대 결과

- 사용자 입장에서는 "이 repo는 AI에게 one-shot prompt를 주면 비즈니스 목표에 맞는 MVP를 바로 적용하는 kit"로 훨씬 선명하게 느껴진다.
- contributor 입장에서는 `mvp:new`가 prompt generator가 아니라 structured scaffold helper로 더 명확해진다.
- 문서, AI context, adapter, CLI contract가 한 방향으로 정렬된다.
