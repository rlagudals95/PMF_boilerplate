# PMF Boilerplate

PMF를 찾기 위한 실험용 모노레포 보일러플레이트입니다.  
첫 제품은 `모두의렌탈`이지만, 구조 자체는 다음 사이드 프로젝트에도 그대로 복제할 수 있도록 설계했습니다.

이 저장소의 핵심은 단순 랜딩 템플릿이 아닙니다.  
`랜딩 -> 리드 -> 상담 -> 결제 의사 -> 어드민 확인 -> 실험 문서화`까지 이어지는 초기 검증 루프를 바로 실행할 수 있게 만드는 것이 목적입니다.

## 한눈에 보기

- 단일 `Next.js App Router` 앱에서 랜딩, 폼, 결제 데모, 어드민을 모두 처리합니다.
- `modules / shared / lib / packages` 경계를 가진 modular monolith 구조를 사용합니다.
- 기본 저장소는 `local-data.json` fallback이며, 운영 시 `Supabase/Postgres + Drizzle`로 전환할 수 있습니다.
- 리드와 상담 요청을 분리해 관심 신호와 실행 신호를 다르게 해석할 수 있습니다.
- analytics, marketing, error logging은 optional provider를 붙일 수 있는 얇은 adapter 구조입니다.
- 문서와 AI 컨텍스트를 repo 안에 함께 두어 spec-driven 방식으로 작업할 수 있습니다.

## 포함된 기능

### 실행 가능한 제품 흐름

- 랜딩 페이지와 CTA 추적
- 리드 캡처 폼
- 상담 요청 폼
- 토스 결제 데모 플로우
- 리드 / 제품 / 실험 / 결제 어드민 화면
- 모바일 퍼널 데모

### 기본 인프라

- Next.js App Router 기반 단일 웹 앱
- pnpm workspace + Turborepo 모노레포
- Supabase/Postgres 지향 Drizzle 스키마
- 로컬 개발용 `packages/db/local-data.json` fallback 저장소
- analytics / marketing script / error logging 기본 wiring
- 공유 UI, 도메인 타입, Zod 스키마

### 품질과 운영

- Vitest unit test
- Playwright smoke E2E
- AI 도구 공통 컨텍스트 레이어
- architecture / spec-driven / doc-sync 문서
- 역할 기반 work item 문서 운영 규칙

## 바로 확인할 수 있는 화면

| 경로                 | 설명                  |
| -------------------- | --------------------- |
| `/`                  | 랜딩 + 라이브 리드 폼 |
| `/consult`           | 상담 요청 플로우      |
| `/pay`               | 토스 결제 데모        |
| `/admin`             | 운영 개요             |
| `/admin/leads`       | 리드 inbox            |
| `/admin/products`    | 제품 목록             |
| `/admin/experiments` | 실험 목록             |
| `/admin/payments`    | 결제 목록             |
| `/demo/funnel`       | 모바일 퍼널 예시      |

## 빠른 시작

### 요구사항

- Node 22+
- pnpm 10+

### 실행

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

기본 실행 주소는 `http://localhost:3000` 입니다.

## 자주 쓰는 명령어

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm db:seed
pnpm db:generate
pnpm db:migrate
pnpm format
pnpm ai:sync
```

## 구조 요약

### 앱 구조

```text
apps/web/src/
  app/        route entry, layout, page, route.ts
  modules/    도메인별 feature slice
  shared/     app-local shared UI, hooks, shared action
  lib/        앱 전역 wiring, env, provider setup
```

### 워크스페이스 패키지

```text
packages/core           도메인 타입, zod 스키마, fixture, mapper
packages/db             Drizzle 스키마, 저장소, 로컬 fallback, seed
packages/ui             공유 UI 컴포넌트
packages/analytics      벤더 중립 track() 추상화
packages/error-logging  벤더 중립 report() 추상화
```

### 문서와 AI 컨텍스트

```text
docs/                   아키텍처, 실험 운영, work item 문서
ai/context/             프로젝트/엔지니어링/spec-driven canonical context
ai/skills/              저장소 로컬 스킬 레지스트리
AGENTS.md               Codex/에이전트용 루트 엔트리
CLAUDE.md               Claude adapter entry
GEMINI.md               Gemini adapter entry
```

## 아키텍처 핵심 원칙

- `apps/web` 하나에서 랜딩, 폼, 어드민, 결제 데모를 모두 처리합니다.
- `app/`은 얇게 유지하고, 기능 코드는 `modules/*`에 둡니다.
- 공용 코드는 `module -> shared -> package` 순서로만 승격합니다.
- 입력 검증은 boundary에서 하고, model/use case는 orchestration에 집중합니다.
- 외부 provider 실패가 핵심 사용자 흐름을 깨지 않게 설계합니다.
- 중요한 작업은 구현보다 먼저 repo 안 Markdown 문서로 결정을 고정합니다.

## 데이터 전략

- 기본값은 `packages/db/local-data.json` 기반 로컬 저장소입니다.
- `DATABASE_URL`이 설정되면 Drizzle + Postgres로 전환됩니다.
- 초기 PMF 실험 단계에서는 설치 장벽보다 반복 속도가 중요하기 때문에 fallback을 유지합니다.

### 저장되는 기본 엔티티

- `leads`
- `consultation_requests`
- `products`
- `experiments`
- `page_events`
- `payments`

### 왜 리드와 상담 요청을 분리하나

- 랜딩 리드는 약한 관심 신호입니다.
- 상담 요청은 더 강한 실행 신호입니다.
- 둘을 분리해야 후속 인터뷰 우선순위와 신호 품질을 다르게 해석할 수 있습니다.

## 이벤트와 provider

### 기본 추적

- 내부 저장소 `page_events`에는 기본 이벤트가 항상 기록됩니다.
- 브라우저의 `session_id`를 저장해 anonymous session continuity를 유지합니다.

### Analytics

- 기본 provider는 `console`, `store` 입니다.
- `MIXPANEL_PROJECT_TOKEN`이 있으면 같은 이벤트를 Mixpanel에도 전송합니다.
- Mixpanel 실패는 optional provider 실패로 처리되어 핵심 사용자 흐름은 유지됩니다.

### Marketing

- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_KAKAO_PIXEL_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`

위 값이 있으면 브라우저에 provider script를 로드합니다.

기본 브리지 대상 이벤트:

- `page_view`
- `cta_clicked`
- `lead_form_submitted`
- `consultation_requested`

### Error logging

- 기본 error logger는 console adapter입니다.
- 외부 provider는 필요할 때만 붙이는 방향을 전제로 합니다.

## 환경 변수

자세한 값은 [`.env.example`](./.env.example)을 기준으로 보면 됩니다.

### 데이터 / 인프라

- `DATABASE_URL`
- `LOCAL_DATA_FILE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 사이트 / 결제

- `NEXT_PUBLIC_SITE_URL`
- `TOSS_PAYMENTS_API_KEY`

### 마케팅

- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_KAKAO_PIXEL_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_CONSULTATION`

### Analytics

- `MIXPANEL_PROJECT_TOKEN`
- `MIXPANEL_API_HOST`
- `MIXPANEL_DEBUG`

## 새 제품으로 복제하는 순서

1. `packages/core/src/fixtures/mock-data.ts`에서 제품 seed와 실험 seed를 바꿉니다.
2. 랜딩 카피와 CTA는 `apps/web/src/modules/landing/*`에서 수정합니다.
3. 리드 폼과 상담 폼 필드는 `apps/web/src/modules/lead/*`, `apps/web/src/modules/consultation/*`에서 조정합니다.
4. 브랜드 색상은 `apps/web/src/lib/app-theme.ts`에서 바꿉니다.
5. 새 제품 가설은 `/admin/experiments`에 보이도록 seed와 스키마 데이터를 갱신합니다.
6. 운영 단계로 넘어가면 `DATABASE_URL`을 Supabase/Postgres로 연결합니다.

## 이 저장소가 의도적으로 넣지 않은 것

- 복잡한 auth
- background jobs
- CMS
- 무거운 design system
- vendor lock-in analytics
- 과한 repository abstraction

PMF를 찾기 전에는 구현 속도와 신호 품질이 더 중요하다는 전제를 둡니다.

## AI 컨텍스트와 spec-driven 작업 방식

이 저장소는 특정 AI 도구 하나에 종속되지 않도록 `ai/` 폴더에 공통 컨텍스트와 스킬을 둡니다.

### 구성

- `ai/context/*`: 프로젝트 목적, 엔지니어링 규칙, spec-driven, doc-sync
- `ai/skills/*`: 반복 작업용 저장소 로컬 스킬
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`: 각 도구용 얇은 adapter entry
- `.claude/skills/*/SKILL.md`, `.gemini/commands/repo/*`, `.gemini/extensions/*/skills/*/SKILL.md`, `.codex/skills/*/SKILL.md`: `pnpm ai:sync`로 생성되는 adapter 산출물

### 작업 원칙

- 중요한 작업은 구현 전에 repo 안 Markdown 문서로 기준을 먼저 고정합니다.
- 여러 파일에 걸친 기능 변경은 `docs/work-items/<work-id>/` 문서를 기준으로 진행합니다.
- PM / PD / FE / BE 역할 문서를 나눠서 남길 수 있습니다.
- source of truth는 외부 문서가 아니라 repo 안 Markdown입니다.

## 문서를 어디부터 읽으면 좋은가

### 구조를 이해하고 싶을 때

- [아키텍처 결정과 트레이드오프](./docs/architecture.md)
- [실험 운영 플레이북](./docs/experiment-playbook.md)

### AI 작업 규칙을 보고 싶을 때

- [AI 컨텍스트 운영 규칙](./docs/agent-context.md)
- [에이전트 작업 규칙](./AGENTS.md)
- [`ai/context/project.md`](./ai/context/project.md)

### 중요한 작업을 시작할 때

- [product-squad operating model](./docs/product-squad/operating-model.md)
- [work items 안내](./docs/work-items/README.md)
- [spec lifecycle](./docs/spec-lifecycle.md)

### 결제 데모를 볼 때

- [Toss 결제 데모 문서](./docs/toss-payment.md)
