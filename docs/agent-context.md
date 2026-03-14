# Cross-Agent Context Strategy

이 저장소는 특정 AI 코딩 도구 하나에 종속되지 않도록 컨텍스트를 3계층으로 나눕니다.

## 계층

### 1. Canonical context

공통 원본은 `ai/` 아래에 둡니다.

- `ai/context/project.md`: 프로젝트 목적, 구조, 명령어, 가드레일
- `ai/context/engineering.md`: 엔지니어링 문서 entry와 로드 순서
- `ai/context/engineering-common.md`: FE/BE 공통 규칙
- `ai/context/engineering-frontend.md`: `apps/web` FE 규칙
- `ai/context/engineering-backend.md`: domain/backend/integration 규칙
- `ai/skills/_index.md`: 사용 가능한 스킬과 트리거 규칙
- `ai/skills/*.md`: 플랫폼 독립 스킬 문서

이 레이어는 Claude Code, Codex, Gemini 어느 쪽에서도 읽을 수 있는 일반 Markdown만 사용합니다.

### 2. Platform adapters

각 도구는 얇은 진입 문서만 가집니다.

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

이 파일들은 공통 원본을 참조하고, 각 도구가 기대하는 최소 포맷만 담습니다.

### 3. Task-local context

특정 작업에만 필요한 임시 문맥은 해당 디렉터리 옆에 둡니다.

예시:

- `docs/architecture.md`
- `apps/web/src/modules/README.md`
- `apps/web/src/shared/README.md`

범용 규칙을 task-local 문서에 넣지 말고, 반복적으로 필요한 내용만 `ai/skills`로 승격합니다.

## 추천 로딩 순서

1. platform entry (`AGENTS.md` / `CLAUDE.md` / `GEMINI.md`)
2. `ai/context/project.md`
3. `ai/context/engineering.md`
4. `ai/context/engineering-common.md`
5. 현재 작업에 맞는 FE/BE 문서 하나 또는 둘 다
6. `ai/skills/_index.md`
7. 현재 작업에 맞는 스킬 문서
8. task-local 문서

## 왜 이 구조가 필요한가

- 플랫폼마다 시스템 프롬프트 형식이 다릅니다.
- 하지만 프로젝트 지식과 팀 규칙은 같아야 합니다.
- 그래서 지식 본문은 중립 Markdown으로 두고, 플랫폼 파일은 로더 역할만 하게 합니다.

## 운영 규칙

- 같은 규칙을 세 파일에 복붙하지 않습니다.
- 새 플랫폼을 추가할 때는 `ai/`는 건드리지 않고 진입 문서만 하나 추가합니다.
- 한 번 쓰고 끝날 규칙은 스킬로 만들지 않습니다.
- 공통성이 검증된 워크플로우만 `ai/skills`에 등록합니다.

## Mandatory Working Mode

모든 에이전트는 아래 규칙을 기본값으로 따릅니다.

- 코드 변경 전에 관련 문서와 실제 영향 파일을 먼저 읽습니다.
- FE 작업이면 `engineering-frontend.md`를 읽습니다.
- DB/schema/repository/integration 작업이면 `engineering-backend.md`를 읽습니다.
- full-stack 작업이면 FE/BE 문서를 모두 읽습니다.
- `packages/*`는 재사용이 검증된 코드만 올립니다.
- 문서 없는 새 규칙, 새 툴, 새 인프라를 추가하지 않습니다.
- 코드가 바뀌면 테스트, 타입, 문서 영향도 같이 확인합니다.

## Vibe Coding Guardrails

AI가 빠르게 코드를 생성하더라도 아래 징후가 보이면 수정 방향이 잘못된 것입니다.

- page 파일이 비대해진다.
- domain logic이 `app/`과 `lib/`에 흩어진다.
- cross-feature 재사용이 `modules/*` direct import로 흘러간다.
- 비슷한 helper가 여러 곳에 복제된다.
- 공통성 확인 전에 새 패키지나 새 abstraction이 추가된다.
- 동작은 되지만 경계와 책임이 흐려진다.

이 경우 기능 추가보다 구조 정리를 먼저 해야 합니다.
