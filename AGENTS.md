# AGENTS.md

이 파일은 저장소에서 동작하는 모든 AI 코딩 에이전트를 위한 기본 진입점입니다.

## 프로젝트 목적

- PMF를 찾기 위한 실험용 보일러플레이트
- 첫 사용 사례는 `모두의렌탈`
- 다음 사이드 프로젝트에서도 재사용 가능해야 함

## 먼저 읽을 것

1. `ai/context/project.md`
2. `ai/context/engineering.md`
3. `ai/context/engineering-common.md`
4. `ai/context/spec-driven.md`
5. 현재 작업에 맞는 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md` 중 하나 또는 둘 다
6. `ai/context/doc-sync.md`
7. `ai/skills/_index.md`
8. `docs/agent-context.md`
9. 현재 작업과 관련된 `docs/*` 또는 패키지 문서
10. 실험 관련 작업이면 `docs/experiment-playbook.md`

## 아키텍처 원칙

- 랜딩, 폼, 어드민은 `apps/web` 단일 앱에서 처리
- `apps/web`는 modular monolith 구조를 따르며 `app/`은 얇게 유지
- FE 조직 방식은 strict FSD가 아니라 `Hybrid FSD Lite`
- 기능별 코드는 우선 `apps/web/src/modules/*`에 둠
- app-local 공용 코드는 `apps/web/src/shared/*`에 둠
- 공통 타입/검증/DB/UI만 `packages/*`로 분리
- DB 기본 방향은 Supabase/Postgres이지만 로컬 fallback을 유지
- 구현보다 실험 루프와 신호 품질을 우선

## 폴더 규칙

- `apps/web`: 제품별 화면, 서버 액션, 페이지 조합
- `apps/web/src/app`: route, layout, page, route handler entry
- `apps/web/src/modules`: 도메인별 feature slice
- `apps/web/src/shared`: app-local shared UI, hooks, action entrypoint, types
- `apps/web/src/lib`: env, wiring, framework helper
- `packages/core`: 도메인 타입, zod, fixture
- `packages/db`: schema, repository, seed
- `packages/ui`: 공유 UI
- `packages/analytics`: track 추상화
- `packages/error-logging`: error report abstraction
- `docs/prds`: canonical PRD source of truth
- `ai/`: 벤더 중립 컨텍스트와 스킬

## 네이밍 규칙

- UI 컴포넌트: PascalCase
- 함수/변수: camelCase
- DB 컬럼: snake_case
- 실험 코드: `LP-001`, `CF-002` 같은 짧은 식별자

## 새 실험 추가 방법

1. 제품/실험 seed 추가
2. 랜딩 카피와 CTA 업데이트
3. success metric 정의
4. 필요한 이벤트만 추가
5. 어드민에서 확인 가능한지 검증

## PR을 작게 유지하는 방법

- 한 번에 하나의 흐름만 건드린다.
- 패키지 추상화와 UI 개편을 동시에 하지 않는다.
- 코드 수정과 문서 수정은 같이 올리되, unrelated cleanup은 넣지 않는다.

## 작업 기본 규칙

- 코드 수정 전에는 관련 문서와 영향 파일을 먼저 읽는다.
- 중요한 작업이면 spec 존재 여부와 source of truth 문서를 먼저 확인한다.
- PRD 기반 기능 작업이면 먼저 `docs/prds/<slug>.md`를 확인하고 `pnpm feature:new --prd <slug>`로 work item 문서를 정규화한다.
- FE 작업이면 `engineering-frontend.md`, DB/schema/repository/integration 작업이면 `engineering-backend.md`를 읽는다.
- `page.tsx`나 `route.ts`에 비즈니스 로직을 넣지 않는다.
- `app/actions.ts`처럼 모든 흐름을 한 액션 파일에 모으지 않는다.
- 검증, 유스케이스, 저장 로직을 한 파일에 섞지 않는다.
- `utils.ts` 같은 범용 파일을 기본 선택지로 쓰지 않는다.
- 공용화는 `module -> shared -> package` 순서로만 올린다.
- 새 패키지나 새 추상화는 재사용 근거가 있을 때만 추가한다.
- 구조 규칙이 바뀌면 `docs/architecture.md`와 관련 `engineering-*` 문서를 같이 갱신한다.

## 과하게 만들지 말 것

- 복잡한 auth
- background jobs
- CMS
- 무거운 design system
- vendor lock-in analytics
- 추상화만 많은 repository layer

## 플랫폼 중립 운영

- 공통 규칙은 `ai/`에 둔다.
- 이 파일은 canonical source가 아니라 adapter entry다.
- Claude Code, Codex, Gemini용 문서를 따로 두더라도 내용 본문은 복제하지 않는다.
- Notion 같은 외부 도구는 optional integration이며 repo Markdown이 canonical source다.
- 실제 런타임 어댑터 산출물은 `pnpm ai:sync`로 `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`, `.claude/skills/*/SKILL.md`, `.gemini/commands/repo/*`, `.gemini/extensions/*/skills/*/SKILL.md`, `.codex/skills/*/SKILL.md`에 생성한다.
- 생성된 어댑터 파일은 파생 산출물이고 source of truth는 계속 `ai/`와 이 루트 엔트리 문서다.
