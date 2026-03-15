# PMF Boilerplate

PMF를 찾기 위한 실험용 모노레포 보일러플레이트입니다.

이 레포는 아래 흐름을 바로 실행할 수 있게 설계되어 있습니다.

`랜딩 -> 리드 수집 -> 상담 요청 -> 결제 의사 확인 -> 어드민 확인 -> 실험 문서화`

## 기본 작업 워크플로

이 저장소의 기본값은 `spec-driven + selective TDD + verify`입니다.

### 1. 언제 어떤 플로우가 발동되나

| 상황 | 발동 플로우 | 기준 |
| --- | --- | --- |
| 오탈자, 단순 카피 수정, 시맨틱 변화 없는 스타일 수정, 명백한 소규모 버그 수정 | `Quick fix` | full work item 없이 바로 수정 가능 |
| 여러 파일에 걸친 기능 작업, 폼/어드민/analytics/DB 변경, 핵심 로직 변경 | `Important change` | `docs/work-items/*` 문서를 먼저 만들고 진행 |
| PRD가 이미 있는 기능 작업 | `PRD-driven feature` | `docs/prds/*`를 source로 `feature work item` 생성 |
| AI 규칙, 문서 구조, adapter 규칙 변경 | `AI context change` | 문서 수정 후 `pnpm ai:sync`까지 실행 |

### 2. 실제로 어떤 로직으로 실행되나

#### Quick fix

1. 관련 canonical 문서만 읽습니다.
2. light work인지 확인합니다.
3. validation, 상태 전이, route/action 경계, adapter 계약 변경이 아니면 full TDD를 생략할 수 있습니다.
4. 바로 수정합니다.
5. 마지막에 `pnpm verify`를 실행합니다.

#### Important change

1. `pnpm work:new <slug> --request "..."`로 work item을 만듭니다.
2. `brief.md`와 필요한 role spec을 채웁니다.
3. 구현 단위를 테스트 가능한 `behavior slice`로 나눕니다.
4. 각 slice마다 먼저 failing test로 public behavior를 고정합니다.
5. 테스트를 통과시키는 최소 구현만 추가합니다.
6. 필요하면 리팩터링하고 slice 테스트를 다시 통과시킵니다.
7. 마지막에 `pnpm verify`, 필요하면 `pnpm verify:full`을 실행합니다.

#### PRD-driven feature

1. PRD를 `docs/prds/<slug>.md`에 둡니다.
2. `pnpm feature:new --prd <slug>`로 feature work item을 생성합니다.
3. `feature-spec.md`, `frontend-spec.md`, `backend-spec.md`에 어떤 behavior를 먼저 failing test로 고정할지 적습니다.
4. 그 문서를 기준으로 구현합니다.
5. 마지막에 `pnpm verify`, 필요하면 `pnpm verify:full`을 실행합니다.

### 3. 핵심 판단 규칙

- 기본 철학은 “테스트 파일을 먼저 만든다”가 아니라 “public behavior를 먼저 고정한다”입니다.
- full TDD는 모든 작업에 강제하지 않고 `validation`, `use case`, `server action/route 경계`, `adapter 계약`, `상태 전이`에 우선 적용합니다.
- spec과 코드가 충돌하면 코드를 먼저 밀지 말고 문서를 먼저 갱신합니다.
- 중요한 작업은 `spec -> failing test -> minimal implementation -> refactor -> verify` 순서를 기본값으로 둡니다.

## 이 레포로 할 수 있는 것

- 단일 `Next.js` 앱에서 랜딩, 폼, 결제 데모, 어드민을 함께 운영할 수 있습니다.
- `local-data.json` fallback으로 DB 없이도 바로 개발과 데모를 시작할 수 있습니다.
- `Supabase/Postgres + Drizzle`로 자연스럽게 확장할 수 있습니다.
- 리드와 상담 요청을 분리해 관심 신호와 실행 신호를 다르게 해석할 수 있습니다.
- 내부 이벤트 저장을 기준으로 두고, Mixpanel/광고 스크립트는 선택적으로 붙일 수 있습니다.
- AI 에이전트가 읽을 컨텍스트와 작업 문서를 repo 안에 함께 유지할 수 있습니다.

## 5분 체험 순서

처음 보는 사람은 아래 순서대로 보면 가장 빠릅니다.

1. 개발 서버 실행

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

기본 주소는 `http://localhost:3000`입니다.

2. 사용자 흐름 확인

- `/`: 랜딩 페이지와 리드 폼
- `/auth`: 소셜 로그인 starter demo
- `/consult`: 상담 요청 폼
- `/pay`: 토스 결제 데모 시작

3. 운영 화면 확인

- `/admin`: 전체 개요
- `/admin/leads`: 리드/상담 요청 inbox
- `/admin/experiments`: 실험 목록
- `/admin/payments`: 결제 상태

4. 저장 방식 확인

- `DATABASE_URL`이 없으면 `packages/db/local-data.json`에 저장됩니다.
- `DATABASE_URL`이 있으면 Postgres/Drizzle 경로를 사용합니다.

## 포함된 기능

### 제품 흐름

- 랜딩 페이지와 CTA 추적
- 리드 캡처 폼
- Google / Kakao / Naver 소셜 로그인 starter
- 상담 요청 폼
- 토스 단건 결제 데모
- 관리자 대시보드
- 모바일 퍼널 데모

### 운영/분석 기반

- `leads`, `consultation_requests`, `products`, `experiments`, `page_events`, `payments` 기본 모델
- 내부 이벤트 저장 + optional analytics provider
- optional marketing pixel script 로딩
- optional error logging adapter

### AI 드리븐 작업 기반

- repo 내부 Markdown 기반 spec-driven 작업 방식
- PRD/work item 스캐폴딩 스크립트
- Copilot/Cursor/Claude/Gemini/Codex용 컨텍스트 동기화

## 주요 화면

| 경로 | 용도 |
| --- | --- |
| `/` | 랜딩과 리드 수집 |
| `/auth` | 소셜 로그인 starter demo |
| `/consult` | 상담 요청 접수 |
| `/pay` | 결제 데모 시작 |
| `/pay/result` | 결제 복귀 결과 확인 |
| `/pay/cancel` | 결제 취소 복귀 |
| `/admin` | 운영 개요 |
| `/admin/leads` | 리드/상담 요청 확인 |
| `/admin/products` | 제품 목록 |
| `/admin/experiments` | 실험 상태 확인 |
| `/admin/payments` | 결제 상태 확인 |
| `/demo/funnel` | 모바일 퍼널 데모 |
| `/health` | 헬스체크 |

## 빠른 시작

### 요구사항

- Node `22+`
- pnpm `10+`

### 설치 및 실행

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

### 자주 쓰는 명령어

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm verify
pnpm verify:full
pnpm db:seed
pnpm db:generate
pnpm db:migrate
pnpm prd:new my-prd
pnpm feature:new --prd my-prd
pnpm work:new my-task --request "작업 배경"
pnpm ai:sync
```

## 환경 변수

전체 목록은 [`.env.example`](./.env.example)을 보면 됩니다.

### 데이터

- `DATABASE_URL`
- `LOCAL_DATA_FILE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Auth Starter

- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED`
- `NEXT_PUBLIC_AUTH_KAKAO_ENABLED`
- `NEXT_PUBLIC_NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `NEXT_PUBLIC_SITE_URL`

### 사이트/결제

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

## 저장소 구조

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
packages/core           도메인 타입, zod 스키마, fixture
packages/db             Drizzle 스키마, 저장소, local fallback, seed
packages/ui             공유 UI 컴포넌트
packages/analytics      track() 추상화와 adapter
packages/error-logging  report() 추상화와 adapter
```

### 문서와 AI 컨텍스트

```text
ai/context/             프로젝트/엔지니어링/spec-driven canonical context
ai/skills/              저장소 로컬 스킬
docs/                   아키텍처, 실험 운영, PRD, work item 문서
AGENTS.md               에이전트용 루트 엔트리
```

## 아키텍처 핵심

- `apps/web` 하나에서 랜딩, 폼, 어드민, 결제 데모를 모두 처리합니다.
- `app/`은 얇게 두고 기능 코드는 `modules/*`에 둡니다.
- 공용화는 `module -> shared -> package` 순서로만 올립니다.
- 입력 검증은 boundary에서, 유스케이스는 `model`, 저장은 `packages/db`에서 처리합니다.
- 외부 provider 장애가 핵심 흐름을 깨뜨리지 않게 설계합니다.

자세한 배경과 트레이드오프는 [아키텍처 문서](./docs/architecture.md)에 정리되어 있습니다.

## 데이터 전략

- 기본 개발 모드는 `packages/db/local-data.json` 기반입니다.
- 운영 환경에서는 `DATABASE_URL`을 설정해 Postgres/Drizzle로 전환합니다.
- seed를 넣으면 랜딩, 어드민, 실험 목록, 결제 목록을 바로 데모할 수 있습니다.

### 왜 리드와 상담 요청을 분리하나

- 리드 제출은 약한 관심 신호입니다.
- 상담 요청은 더 강한 실행 신호입니다.
- 둘을 분리해야 후속 연락 우선순위와 실험 품질을 다르게 해석할 수 있습니다.

## 이벤트와 외부 provider

### 기본 원칙

- 핵심 이벤트는 내부 `page_events`에 먼저 저장합니다.
- `session_id`를 저장해 익명 세션 흐름을 이어갑니다.
- 외부 SaaS는 optional provider입니다.

### Analytics

- 기본 provider는 `console`, `store`입니다.
- `MIXPANEL_PROJECT_TOKEN`이 있으면 Mixpanel 전송을 추가합니다.
- Mixpanel 실패는 경고로 취급하고 사용자 흐름은 유지합니다.

### Marketing

다음 값이 있으면 해당 스크립트를 브라우저에 로드합니다.

- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_KAKAO_PIXEL_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`

기본 브리지 이벤트는 다음 네 가지입니다.

- `page_view`
- `cta_clicked`
- `lead_form_submitted`
- `consultation_requested`

## Auth Starter 사용법

- `/auth`에서 provider 상태와 현재 starter session을 확인할 수 있습니다.
- Google/Kakao는 Supabase social login 설정과 `NEXT_PUBLIC_AUTH_*_ENABLED=true`가 필요합니다.
- Naver는 `NEXT_PUBLIC_NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `NEXT_PUBLIC_SITE_URL`이 필요합니다.
- callback route는 `/auth/callback`, Naver code exchange route는 `/api/auth/naver/session`입니다.
- 이 흐름은 demo/starter 범위이며 `/admin` 보호나 DB user sync는 하지 않습니다.

### Provider 설정 순서

1. `.env.local`에 `NEXT_PUBLIC_SITE_URL`을 현재 앱 주소로 설정합니다.
2. Google/Kakao를 쓸 경우 Supabase Auth의 Social Providers에서 provider를 활성화하고 callback URL에 `/auth/callback`을 등록합니다.
3. Google은 `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`, Kakao는 `NEXT_PUBLIC_AUTH_KAKAO_ENABLED=true`를 설정합니다.
4. Naver를 쓸 경우 네이버 개발자 센터에서 앱을 만들고 `NEXT_PUBLIC_NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`을 채웁니다.
5. `/auth`에 들어가 provider가 `활성` 상태로 보이는지 확인한 뒤 로그인 흐름을 테스트합니다.

## 결제 데모 사용법

- `/pay`에서 테스트 결제 요청을 생성합니다.
- 브라우저 복귀는 `/pay/result`, 취소는 `/pay/cancel`로 들어옵니다.
- 서버 callback은 `/api/payments/toss/callback`에서 받습니다.
- 저장된 결제 상태는 `/admin/payments`에서 확인합니다.

로컬에서도 브라우저 복귀 테스트는 가능하지만, Toss `resultCallback`은 외부에서 호출되므로 로컬만으로는 완전히 재현되지 않을 수 있습니다. 자세한 내용은 [결제 데모 문서](./docs/toss-payment.md)를 보면 됩니다.

## AI 드리븐 작업 방식

이 저장소는 코드를 AI로 빠르게 생성하더라도 규칙과 문서가 먼저 남도록 설계되어 있습니다.

### 기본 원칙

- source of truth는 repo 안 Markdown입니다.
- 중요한 작업은 구현 전에 문서로 범위와 결정을 고정합니다.
- 구조 규칙은 `ai/context/*`, 작업별 결정은 `docs/work-items/*`에 둡니다.

### 스캐폴딩 명령어

```bash
pnpm prd:new my-prd
pnpm feature:new --prd my-prd
pnpm work:new my-task --request "작업 배경"
pnpm ai:sync
```

### 언제 무엇을 읽으면 좋은가

- 구조 이해: [docs/architecture.md](./docs/architecture.md)
- 실험 운영: [docs/experiment-playbook.md](./docs/experiment-playbook.md)
- AI 작업 규칙: [docs/agent-context.md](./docs/agent-context.md), [AGENTS.md](./AGENTS.md)
- spec-driven 흐름: [docs/spec-lifecycle.md](./docs/spec-lifecycle.md)
- vibe coding 운영 기준: [docs/vibe-coding-playbook.md](./docs/vibe-coding-playbook.md)

## 새 제품으로 복제하는 순서

1. `packages/core/src/fixtures/mock-data.ts`에서 제품/실험 seed를 바꿉니다.
2. `apps/web/src/modules/landing/*`에서 랜딩 카피와 CTA를 수정합니다.
3. `apps/web/src/modules/lead/*`, `apps/web/src/modules/consultation/*`에서 폼 필드를 조정합니다.
4. `apps/web/src/lib/app-theme.ts`에서 브랜드 테마를 바꿉니다.
5. `/admin/experiments`에 노출될 실험 데이터를 함께 갱신합니다.
6. 운영 단계에 들어가면 `DATABASE_URL`을 연결합니다.

## 의도적으로 넣지 않은 것

- 복잡한 admin auth / role system
- background jobs
- CMS
- 무거운 design system
- vendor lock-in analytics
- 과한 repository abstraction

PMF 이전 단계에서는 구현 속도와 신호 품질이 더 중요하다는 전제를 유지합니다.
