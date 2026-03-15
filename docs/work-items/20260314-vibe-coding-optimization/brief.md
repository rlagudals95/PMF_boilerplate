---
status: done
owner_role: pm
source_request: "그리고 이건 PMF를 찾기 위한 바이브 코더(속도와 품질을 놓치고 싶지않은) 보일러 플레이트야 바이브 코딩하기에 최적으 경험을 제공하는 보일러 플레이트인가? 많은 사례 및 패턴 실제로 심층서치해보고 매우 심층적으로 평가하고 개선해줘"
affected_paths:
  - README.md
  - AGENTS.md
  - ai/context/project.md
  - ai/context/spec-driven.md
  - docs/agent-context.md
  - docs/work-items/README.md
  - docs/vibe-coding-playbook.md
  - scripts/sync-ai-context.mjs
  - scripts/create-work-item.mjs
  - package.json
dependencies:
  - docs/agent-context.md
  - ai/context/spec-driven.md
skip_reason: null
---

# Brief

## Problem

- 저장소는 canonical AI context와 구조 규칙이 강하지만, 최신 AI 코딩 도구들이 권장하는 tool-native instruction, work scaffold, fast quality gate가 일부 비어 있다.
- 그래서 “좋은 구조의 보일러플레이트”이긴 해도 “바이브 코딩 경험이 최적화된 보일러플레이트”라고 말하기엔 근거가 부족하다.

## Target User

- PMF를 빠르게 탐색해야 하는 1인 개발자 또는 작은 제품팀
- AI 코딩 도구를 쓰지만 속도 때문에 구조와 품질을 버리고 싶지 않은 개발자

## Goal

- 최신 AI 코딩 도구들의 공통 패턴을 조사해 저장소의 현재 적합도를 평가한다.
- 저장소 안에서 바로 쓸 수 있는 vibe-coding 운영 가이드와 adapter 개선을 추가한다.
- 중요한 작업 문서화, AI context sync, 검증 루프를 더 짧고 명확하게 만든다.

## Non-Goals

- 특정 hosted builder 하나에만 종속되는 전용 workflow
- background agent 런타임 자체를 저장소 안에 구현하는 것
- auth, CMS, job system 같은 제품 범위 확장

## Success Metric

- repo 안 문서만 읽어도 이 저장소의 vibe-coding 운영 기준과 trade-off를 이해할 수 있다.
- `pnpm work:new`, `pnpm verify`, `pnpm verify:full`, `pnpm ai:sync` 흐름이 README와 canonical context에 반영되어 있다.
- Copilot과 Cursor에서 바로 활용 가능한 adapter 산출물이 생성된다.

## Acceptance Criteria

- 외부 사례를 바탕으로 한 평가 문서가 추가된다.
- 새 work item scaffold script가 추가된다.
- 빠른 quality gate와 full gate 명령이 추가된다.
- `pnpm ai:sync`가 Copilot과 Cursor adapter까지 생성한다.
- 관련 canonical docs와 README가 함께 갱신된다.

## Open Questions

- hosted builder 전용 산출물은 당장 추가하지 않고, canonical context와 repo-native workflow를 먼저 강화한다.
