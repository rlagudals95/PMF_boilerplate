# Project Context

## Purpose

이 저장소는 PMF를 찾기 위한 실험용 보일러플레이트입니다.
첫 제품은 `모두의렌탈`이지만, 다음 사이드 프로젝트에서도 랜딩-리드-상담-실험 관리 루프를 재사용할 수 있어야 합니다.

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
- admin auth는 미래 작업으로 두되, 구조는 Supabase를 붙이기 쉽게 유지한다.
- 제품별 내용은 `apps/web`에, 재사용 가능한 타입/검증/컴포넌트만 `packages/*`로 올린다.

## Key commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
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

## How to add a new experiment

1. 제품 seed와 랜딩 copy를 바꾼다.
2. 실험 가설과 success metric을 `products`, `experiments`에 등록한다.
3. 필요한 경우 폼 스키마를 확장한다.
4. 이벤트 이름은 가능하면 기존 enum 안에서 재사용한다.
5. 자세한 운영 규칙은 `docs/experiment-playbook.md`를 따른다.
