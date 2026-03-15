# Project Context

## Purpose

이 저장소는 PMF를 찾기 위한 실험용 보일러플레이트입니다.
첫 제품은 `모두의렌탈`이지만, 다음 사이드 프로젝트에서도 랜딩-리드-상담-결제-실험 관리 루프를 재사용할 수 있어야 합니다.

## Working rules

- Node 22
- pnpm workspace + Turborepo
- Next.js App Router + TypeScript
- Supabase + Postgres + Drizzle
- Tailwind CSS + shadcn 스타일 UI
- React Hook Form + Zod
- Vitest + Playwright
- Vercel 배포 전제

추가 기준:

- 앱 구조는 `Next.js App Router` 기반 modular monolith를 따른다.
- FE 조직 방식은 strict FSD가 아니라 `Hybrid FSD Lite`를 따른다.
- `app/`은 라우팅과 조합에 집중하고, 기능 코드는 `apps/web/src/modules/*`에 둔다.
- app-local 공용 코드는 `apps/web/src/shared/*`, 앱 인프라는 `apps/web/src/lib/*`에 둔다.
- 엔지니어링 규칙은 `engineering-common.md`, `engineering-frontend.md`, `engineering-backend.md`로 분리한다.
- FE 구조는 `apps/web`를 기준으로 관리한다.
- backend/domain/integration 규칙은 package 기반이지만 extract-ready하게 관리한다.
- 엔지니어링 품질 기준의 entry는 `ai/context/engineering.md`다.

## Guardrails

- separate API server, microservice, background job를 추가하지 않는다.
- 공통성이 확인되기 전에는 패키지 추상화를 늘리지 않는다.
- social auth starter는 허용하되, admin auth enforcement와 role 체계는 미래 작업으로 둔다.
- 제품별 내용은 `apps/web`에, 재사용 가능한 타입/검증/컴포넌트만 `packages/*`로 올린다.

## Key commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm verify
pnpm verify:full
pnpm prd:new my-prd
pnpm feature:new --prd my-prd
pnpm work:new my-task --request "작업 배경"
pnpm ai:sync
pnpm db:seed
```

## Primary folders

- `apps/web`: UI, routes, server actions, module composition
- `apps/web/src/app`: route entrypoint
- `apps/web/src/modules`: 도메인별 feature slice
- `apps/web/src/shared`: app-local shared UI, hooks, action entrypoint, types
- `apps/web/src/lib`: app-wide infrastructure wiring
- `packages/core`: domain models, zod schemas, fixtures
- `packages/db`: drizzle schema, repositories, seed
- `packages/ui`: shared UI
- `packages/analytics`: track abstraction
- `packages/error-logging`: error report abstraction
- `docs/product-squad`: 역할 기반 운영 규칙과 work item 템플릿
- `docs/prds`: canonical PRD 문서
- `docs/work-items`: 실제 작업별 brief, spec, review 산출물
- `docs/templates`: feature/experiment spec 템플릿
- `docs/adr`: 구조와 운영 원칙에 대한 경량 결정 로그

## How to add a new experiment

1. 제품 seed와 랜딩 copy를 바꾼다.
2. 실험 가설과 success metric을 `products`, `experiments`에 등록한다.
3. 필요한 경우 폼 스키마를 확장한다.
4. 이벤트 이름은 가능하면 기존 enum 안에서 재사용한다.
5. 자세한 운영 규칙은 `docs/experiment-playbook.md`를 따른다.

## How to run important work

- 여러 파일에 걸친 기능 작업, 실험 변경, 폼/어드민/analytics/DB 변경은 먼저 `docs/product-squad/operating-model.md`를 읽는다.
- 중요한 작업은 `ai/context/spec-driven.md`와 `ai/context/doc-sync.md`도 함께 읽는다.
- PRD가 있다면 먼저 `docs/prds/<slug>.md`로 정규화하고 `pnpm feature:new --prd <slug>`로 feature work item을 만든다.
- 해당 작업은 `pnpm work:new <slug> --request "..."` 또는 수동 작성으로 `docs/work-items/<work-id>/`에 brief와 role spec을 만든다.
- 중요한 작업과 핵심 로직 변경은 구현 단위를 테스트 가능한 behavior slice로 자르고 `spec -> failing test -> minimal implementation -> refactor -> verify` 순서를 기본값으로 둔다.
- feature/work item 문서에는 어떤 behavior를 먼저 failing test로 고정할지 적고, light work가 아니라면 그 문서를 기준으로 구현한다.
- 구현 후 기본 검증은 `pnpm verify`, 더 무거운 사용자 흐름 검증은 `pnpm verify:full`을 사용한다.
- AI 컨텍스트나 adapter entry가 바뀌면 `pnpm ai:sync`를 실행한다.
- 작은 문구 수정이나 단일 스타일 수정은 full process를 생략할 수 있지만, skip 이유는 남긴다.

## Documentation source of truth

- 구현 기준 문서는 repo 안 Markdown이다.
- Notion 같은 외부 도구는 optional collaboration surface로만 사용한다.
- 외부 메모는 구현 전에 `docs/templates/*`, `docs/work-items/*`, `docs/adr/*` 중 하나로 정규화한다.
