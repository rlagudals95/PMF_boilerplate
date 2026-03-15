# Cross-Agent Context Strategy

이 저장소는 특정 AI 코딩 도구 하나에 종속되지 않도록 컨텍스트를 3계층으로 나눕니다.

## 계층

### 1. Canonical context

공통 원본은 `ai/` 아래에 둡니다.

- `ai/context/project.md`: 프로젝트 목적, 구조, 명령어, 가드레일
- `ai/context/engineering.md`: 엔지니어링 문서 entry와 로드 순서
- `ai/context/engineering-common.md`: FE/BE 공통 규칙
- `ai/context/spec-driven.md`: spec-driven 개발 기준과 문서 우선순위
- `ai/context/engineering-frontend.md`: `apps/web` FE 규칙
- `ai/context/engineering-backend.md`: domain/backend/integration 규칙
- `ai/context/doc-sync.md`: 코드-문서 sync 정책과 drift 기준
- `ai/skills/_index.md`: 사용 가능한 스킬과 트리거 규칙
- `ai/skills/*.md`, `ai/skills/*/SKILL.md`: 플랫폼 독립 스킬 문서

이 레이어는 Claude Code, Codex, Gemini 어느 쪽에서도 읽을 수 있는 일반 Markdown만 사용합니다.

### 2. Platform adapters

각 도구는 얇은 진입 문서만 가집니다.

- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/*.mdc`
- `pnpm ai:sync`로 생성하는 `.claude/skills/*/SKILL.md`
- `pnpm ai:sync`로 생성하는 `.gemini/commands/repo/*`
- `pnpm ai:sync`로 생성하는 `.gemini/extensions/*/skills/*/SKILL.md`
- `pnpm ai:sync`로 생성하는 `.codex/skills/*/SKILL.md`

이 파일들은 공통 원본을 참조하고, 각 도구가 기대하는 최소 포맷만 담습니다.
단, Codex의 공식 repo entry는 계속 루트 `AGENTS.md`입니다.

### 3. Task-local context

특정 작업에만 필요한 임시 문맥은 해당 디렉터리 옆에 둡니다.

예시:

- `docs/architecture.md`
- `docs/prds/*.md`
- `docs/product-squad/operating-model.md`
- `docs/work-items/<work-id>/*.md`
- `apps/web/src/modules/README.md`
- `apps/web/src/shared/README.md`

범용 규칙을 task-local 문서에 넣지 말고, 반복적으로 필요한 내용만 `ai/skills`로 승격합니다.

## 추천 로딩 순서

1. platform entry (`AGENTS.md` / `CLAUDE.md` / `GEMINI.md` / `.github/copilot-instructions.md` / relevant `.cursor/rules/*.mdc`)
2. `ai/context/project.md`
3. `ai/context/engineering.md`
4. `ai/context/engineering-common.md`
5. `ai/context/spec-driven.md`
6. 현재 작업에 맞는 FE/BE 문서 하나 또는 둘 다
7. `ai/context/doc-sync.md`
8. `ai/skills/_index.md`
9. 현재 작업에 맞는 스킬 문서
10. 중요한 작업이면 `docs/product-squad/operating-model.md`
11. 활성 work item이 있으면 `docs/work-items/<work-id>/*.md`
12. task-local 문서

## 왜 이 구조가 필요한가

- 플랫폼마다 시스템 프롬프트 형식이 다릅니다.
- 하지만 프로젝트 지식과 팀 규칙은 같아야 합니다.
- 그래서 지식 본문은 중립 Markdown으로 두고, 플랫폼 파일은 로더 역할만 하게 합니다.

## 운영 규칙

- 같은 규칙을 세 파일에 복붙하지 않습니다.
- 새 플랫폼을 추가할 때는 `ai/`는 건드리지 않고 진입 문서만 하나 추가합니다.
- tool-native instruction 파일이 필요하면 `ai/`와 루트 adapter 문서를 source로 삼아 generated adapter를 만듭니다.
- 한 번 쓰고 끝날 규칙은 스킬로 만들지 않습니다.
- 공통성이 검증된 워크플로우만 `ai/skills`에 등록합니다.
- 세션 종료 시 반복되는 변경 요약, 문서 영향 점검, 커밋 제안은 `session-wrap` 같은 canonical skill로 관리합니다.
- 외부 도구 메모는 입력 채널일 뿐 canonical source가 아닙니다.
- 플랫폼 런타임 포맷이 필요하면 `ai/`를 source로 삼아 generated adapter를 만듭니다.
- generated adapter는 직접 수정하지 않고 `pnpm ai:sync`로 다시 만듭니다.

## Spec-Driven Layer

- `spec-driven.md`는 구현 전에 어떤 문서를 읽고 어떤 결정을 먼저 고정해야 하는지 정의합니다.
- `doc-sync.md`는 어떤 변경이 어떤 문서를 같이 갱신해야 하는지 정의합니다.
- `product-squad`는 중요한 작업을 위한 역할 기반 task-local 운영 모델입니다.
- `new-feature`는 canonical PRD를 기존 `product-squad` 흐름으로 정규화하는 상위 오케스트레이터입니다.
- 외부 노트는 repo 안 Markdown spec으로 정규화한 뒤에만 구현 기준 문서로 사용합니다.

## Role-Based Operating Mode

중요한 작업은 `product-squad`를 기본 진입점으로 사용합니다.

- 기본 오케스트레이터는 `product-squad`입니다.
- 세부 역할은 `pm-role`, `pd-role`, `fe-role`, `be-role`입니다.
- 중요한 작업은 먼저 `docs/work-items/<work-id>/`에 문서 산출물을 만들고, 그 문서를 입력으로 구현합니다.
- 작은 수정은 full process를 생략할 수 있지만, 생략 사유를 기록할 수 있어야 합니다.

## Mandatory Working Mode

모든 에이전트는 아래 규칙을 기본값으로 따릅니다.

- 코드 변경 전에 관련 문서와 실제 영향 파일을 먼저 읽습니다.
- FE 작업이면 `engineering-frontend.md`를 읽습니다.
- DB/schema/repository/integration 작업이면 `engineering-backend.md`를 읽습니다.
- full-stack 작업이면 FE/BE 문서를 모두 읽습니다.
- 중요한 작업이면 `spec-driven.md`와 `doc-sync.md`를 먼저 확인합니다.
- 중요한 기능 작업이면 `product-squad` 규칙과 활성 work item 문서를 먼저 확인합니다.
- 중요한 작업과 핵심 로직 변경은 `spec -> failing test -> minimal implementation -> refactor -> verify`를 기본 흐름으로 따릅니다.
- TDD는 `validation`, `use case`, `route/action 경계`, `adapter 계약`, `상태 전이`에 우선 적용하고 단순 카피/스타일 수정에는 full TDD를 강제하지 않습니다.
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
