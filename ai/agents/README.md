# Canonical Agents

이 폴더는 플랫폼 전용 acceleration에 쓰는 canonical agent prompt를 보관합니다.

## 목적

- Claude project subagent처럼 agent-native delegation 기능이 있는 플랫폼에서 더 좋은 퍼포먼스를 낼 수 있게 한다.
- agent prompt도 generated adapter가 아니라 repo source에서 관리한다.

## Rules

- 공통 정책은 `ai/context/*`, `ai/skills/*`에 둔다.
- agent prompt는 delegation 방식, handoff, 역할별 output contract만 다룬다.
- generated output은 `.claude/agents/*` 같은 adapter에만 둔다.
- 새로운 agent를 추가하면 `pnpm ai:sync` 결과와 관련 문서를 함께 확인한다.
