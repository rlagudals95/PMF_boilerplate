# ADR 0001: Repo Markdown Is The Canonical Source Of Truth

## Status

Accepted

## Context

이 저장소는 여러 AI 코딩 도구와 외부 협업 도구를 함께 사용할 수 있습니다.
특히 Notion 같은 외부 문서 도구는 회의 기록, 아이디어 수집, 초안 정리에 유용합니다.
하지만 구현 기준 문서가 repo 밖에만 있으면 다음 문제가 생깁니다.

- 코드 리뷰와 문서 리뷰가 분리된다.
- 에이전트마다 읽는 기준이 달라진다.
- 외부 도구 접근 권한이 없으면 작업 기준을 재현할 수 없다.
- 구조 규칙과 작업별 결정이 한곳에서 이어지지 않는다.

## Decision

- 구현 기준 문서는 repo 안 Markdown으로 유지한다.
- `ai/context/*`, `ai/skills/*`, `docs/*`가 canonical source를 구성한다.
- Notion 같은 외부 도구는 optional collaboration surface로만 사용한다.
- 외부 메모는 구현 전에 repo spec으로 정규화한다.

## Consequences

### Positive

- AI 도구가 바뀌어도 같은 기준 문서를 읽을 수 있다.
- 구조 규칙과 task-local spec을 같은 저장소 안에서 관리할 수 있다.
- 문서-코드 sync를 하나의 PR 단위로 유지하기 쉽다.

### Negative

- 외부 도구에만 익숙한 운영 방식보다 초기 정리 비용이 든다.
- 문서 수가 늘어나면 canonical과 task-local 경계를 더 엄격히 관리해야 한다.

## Affected Docs / Paths

- `AGENTS.md`
- `ai/context/spec-driven.md`
- `ai/context/doc-sync.md`
- `docs/agent-context.md`
- `docs/spec-lifecycle.md`
- `docs/integrations/notion.md`
