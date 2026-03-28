# PMF Boilerplate

PMF를 찾기 위한 실험용 모노레포 MVP kit입니다.

이 저장소는 아래 흐름을 가장 빠르게 열 수 있게 설계되어 있습니다.

`랜딩 -> 리드 수집 -> 상담 요청 -> 결제 의사 확인 -> 어드민 확인 -> 실험 문서화`

## One-Shot으로 시작하기

이 레포의 기본 온보딩은 명령어보다 `AI tool + one-shot prompt`입니다.

좋은 시작은 아래처럼 움직입니다.

1. AI가 먼저 `AGENTS.md`, `ai/context/*`, 관련 `docs/*`를 읽습니다.
2. 꼭 필요할 때만 1~3개의 짧은 질문으로 목표를 확인합니다.
3. 기존 `landing / lead / consultation / payment / admin / auth` 블록 안에서 가장 얇은 MVP shape를 고릅니다.
4. 먼저 [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)를 중심으로 product-facing surface를 맞춥니다.
5. 마지막에 active flows, deferred flows, env requirements, verification result를 요약합니다.

아래 프롬프트를 Codex, Cursor, Claude Code 같은 AI 코딩 툴에 그대로 붙여 넣는 것을 권장합니다.

```text
이 repo를 PMF 탐색용 MVP kit로 사용해서 아래 사업 아이디어에 맞는 첫 데모 가능한 버전을 세팅해줘.

사업 아이디어:
[여기에 설명]

반드시 아래 순서로 진행해줘.
1. AGENTS.md와 관련 ai/context/docs를 읽어 이 repo 구조와 existing building block을 먼저 이해한다.
2. 정말 필요한 경우에만 1~3개의 짧은 질문으로 goal, target user, 핵심 전환을 확인한다.
3. 아이디어를 goal / audience / offer / signal로 정리한다.
4. 기존 landing / lead / consultation / payment / admin / auth 블록 안에서 가장 얇고 데모 가능한 MVP shape를 고른다.
5. active flows와 deferred flows를 정한다.
6. 먼저 `apps/web/src/lib/product-config.ts`와 관련 product-facing surface를 맞춘다.
7. 기존 블록으로 표현되지 않는 요구일 때만 deeper code를 변경한다.
8. auth와 payment는 비즈니스 목표가 필요로 할 때만 노출한다.
9. 필요한 env vars와 optional capability 상태를 정리한다.
10. 마지막에 적절한 verify 명령을 실행한다.

최종 요약에는 반드시 아래를 포함해줘.
- selected MVP shape
- active flows
- deferred flows
- major copy/product changes applied
- required env vars for enabled capabilities
- verification result
- remaining manual follow-ups
```

더 짧은 프롬프트와 follow-up prompt는 [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)에 있습니다.

### 예시 프롬프트

위 프롬프트의 `사업 아이디어:` 자리에 아래처럼 넣으면 바로 시작할 수 있습니다.

```text
가전렌탈 비교 사이트를 만들고 싶어.
사용자가 TV, 냉장고, 정수기 같은 렌탈 상품을 비교하고 내게 맞는 옵션을 찾게 하고 싶어.
첫 MVP 목표는 상담 신청이나 제휴 파트너 연결이야.
```

```text
소상공인 AI 도입 진단 사이트를 만들고 싶어.
업종과 현재 업무 방식을 입력하면 어떤 자동화부터 시작해야 하는지 보여주고 싶어.
첫 MVP 목표는 진단 신청서 제출과 상담 예약이야.
```

```text
출시 전 영어 회화 코치 앱의 대기자 명단 페이지를 만들고 싶어.
누가 어떤 문제 때문에 기다리는지와 유료 의사가 어느 정도 있는지 확인하고 싶어.
첫 MVP 목표는 리드 수집과 강한 관심층 파악이야.
```

관련 문서:

- canonical prompt pack: [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)
- 시작 가이드: [docs/start-your-mvp.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md)
- prompt 평가 가이드: [docs/mvp-starter-prompt-evaluation.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/mvp-starter-prompt-evaluation.md)

## 이 레포로 바로 할 수 있는 것

- 단일 `Next.js` 앱에서 랜딩, 폼, 결제 데모, 어드민을 함께 운영할 수 있습니다.
- `packages/db/local-data.json` fallback으로 DB 없이도 바로 데모를 시작할 수 있습니다.
- 필요해지면 `DATABASE_URL` 하나로 Neon 같은 managed Postgres + Drizzle 경로로 전환할 수 있습니다.
- 리드와 상담 요청을 분리해 약한 신호와 강한 신호를 다르게 해석할 수 있습니다.
- auth, payment, marketing, analytics는 optional capability로 붙일 수 있습니다.
- AI가 읽을 repo context와 task 문서를 저장소 안에 같이 유지할 수 있습니다.

## 5분 만에 데모 띄우기

### 1. 로컬 실행

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

기본 주소는 `http://localhost:3000`입니다.

### 2. 사용자 흐름 확인

- `/`: 랜딩 페이지와 리드 폼
- `/consult`: 상담 요청 폼
- `/pay`: 토스 결제 데모
- `/auth`: optional social login starter demo

### 3. 운영 화면 확인

- `/admin`: 전체 개요
- `/admin/leads`: 리드/상담 요청 inbox
- `/admin/experiments`: 실험 목록
- `/admin/payments`: 결제 상태

### 4. 저장 방식 확인

- `DATABASE_URL`이 없으면 `packages/db/local-data.json`에 저장됩니다.
- `DATABASE_URL`이 있으면 Neon을 포함한 generic Postgres/Drizzle 경로를 사용합니다.

## 데이터와 인프라 기본값

### 데이터 저장

- 가장 빠른 기본값은 local JSON fallback입니다.
- 운영 DB 기본 권장값은 Neon입니다.
- 런타임 계약은 `DATABASE_URL` 하나로 유지하고, Neon 외 다른 Postgres도 사용할 수 있습니다.

### Auth

- DB 기본값과 auth starter는 별개입니다.
- Google/Kakao는 optional Supabase Auth starter를 사용합니다.
- Naver는 별도 OAuth starter를 사용합니다.
- auth는 기본 기능이 아니라 필요할 때만 surface에 올립니다.

### Payment / Marketing / Analytics

- payment는 토스 데모 wiring이 준비돼 있습니다.
- marketing, analytics, error logging은 optional provider 구조입니다.
- 외부 provider가 없어도 local demo와 기본 signal 수집은 유지됩니다.

## 어떤 MVP shape로 시작할까

아래 recipe는 generator magic이 아니라 existing module composition pattern입니다.

| Shape | Active flows | Best for |
| --- | --- | --- |
| `lead-gen` | landing, lead capture, admin | 빠르게 문의/관심 신호를 모으는 MVP |
| `consultation` | landing, consultation, admin | 상담 요청 자체가 핵심 전환인 MVP |
| `comparison-routing` | landing, lead capture, consultation, admin | 비교 후 파트너 연결이 핵심인 MVP |
| `paid-intent` | landing, payment intent, admin | 결제 의사나 예약금을 강한 신호로 보는 MVP |
| `waitlist` | landing, lead capture, admin | 출시 전 관심자와 early signal을 모으는 MVP |

Auth와 payment는 기본 기능이 아니라 optional capability입니다. 비즈니스 목표가 요구할 때만 surface에 올리는 편이 맞습니다.

## 가장 먼저 바꾸는 곳

첫 수정 surface는 [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)입니다.

여기서 먼저 맞추는 것:

- 서비스명
- hero angle
- trust signal
- lead / consultation copy
- primary CTA
- quality metric

그 다음 순서는 보통 아래와 같습니다.

1. active flows와 deferred flows를 결정합니다.
2. auth, payment, marketing 같은 optional capability를 필요한 만큼만 올립니다.
3. 기존 `landing / lead / consultation / payment / admin` 블록으로 표현되지 않는 요구일 때만 deeper code를 바꿉니다.
4. 마지막에 `pnpm verify`를 실행합니다.

user-facing 흐름이나 integration까지 크게 바뀌었다면 `pnpm verify:full`까지 권장합니다.

## AI 없이 시작하려면

manual workflow나 power-user용 scaffold helper도 그대로 유지합니다.

```bash
pnpm mvp:new <slug> --prompt "..."
```

예시:

```bash
pnpm mvp:new rental-support-match --prompt "나는 렌탈 지원금을 비교해주는 사이트를 만들고 싶고 최종 목표는 렌탈사로 보내는 게 목표야"
```

이 명령은 PRD 초안, 첫 work item, 추천 recipe, active flows, deferred flows, primary CTA, admin metric 초안을 함께 만듭니다.

## 자주 쓰는 명령어

### Daily

```bash
pnpm dev
pnpm verify
pnpm verify:full
pnpm test:e2e
```

### PRD / Work item / Scaffold

```bash
pnpm mvp:new my-mvp --prompt "..."
pnpm mvp:new my-mvp --goal "..." --audience "..." --offer "..." --signal "..."
pnpm prd:new my-prd
pnpm feature:new --prd my-prd
pnpm work:new my-task --request "작업 배경"
pnpm squad:check
```

### Data / Context

```bash
pnpm db:seed
pnpm db:generate
pnpm db:migrate
pnpm ai:sync
```

## 환경 변수

전체 목록은 [`.env.example`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/.env.example)을 보면 됩니다.

### 로컬 데모

- `LOCAL_DATA_FILE`
- `NEXT_PUBLIC_SITE_URL`

### Managed Postgres

- `DATABASE_URL` (`Neon` 권장)

### Optional Supabase Auth Starter

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED`
- `NEXT_PUBLIC_AUTH_KAKAO_ENABLED`

### Optional Naver OAuth Starter

- `NEXT_PUBLIC_NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

### Optional Payment / Marketing / Analytics

- `TOSS_PAYMENTS_API_KEY`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_KAKAO_PIXEL_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_CONSULTATION`
- `MIXPANEL_PROJECT_TOKEN`
- `MIXPANEL_API_HOST`
- `MIXPANEL_DEBUG`

## 기본 작업 규칙

이 저장소의 기본값은 `spec-driven + selective TDD + verify`입니다.

- 작은 문구 수정이나 명백한 quick fix는 바로 고칠 수 있습니다.
- 여러 파일에 걸친 기능 작업, 폼/어드민/analytics/DB 변경은 work item 문서를 먼저 만듭니다.
- 중요한 작업은 `spec -> failing test -> minimal implementation -> refactor -> verify` 순서를 기본값으로 둡니다.
- spec과 코드가 충돌하면 코드를 먼저 밀지 말고 문서를 먼저 갱신합니다.

관련 문서:

- 구조 이해: [docs/architecture.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/architecture.md)
- 실험 운영: [docs/experiment-playbook.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/experiment-playbook.md)
- AI 작업 규칙: [docs/agent-context.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/agent-context.md), [AGENTS.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/AGENTS.md)
- vibe coding 운영 기준: [docs/vibe-coding-playbook.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/vibe-coding-playbook.md)

## 주요 구조만 빠르게 보기

```text
apps/web/src/
  app/        route entry
  modules/    도메인별 feature slice
  shared/     app-local shared UI, hooks, shared action
  lib/        앱 전역 wiring, env, provider setup
```

```text
packages/core               도메인 타입, zod 스키마, fixture
packages/db                 Drizzle 스키마, 저장소, local fallback, seed
packages/ui                 공유 UI 컴포넌트
packages/ab-test            cookie 기반 variant assignment
packages/user-behavior-log  page_view / click / impression logger
packages/analytics          track() 추상화와 adapter
packages/error-logging      report() 추상화와 adapter
```

자세한 구조 설명은 [docs/architecture.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/architecture.md)에 있습니다.

## 더 읽을 문서

- prompt-first 시작 가이드: [docs/start-your-mvp.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md)
- tool-neutral prompt pack: [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)
- prompt 평가 가이드: [docs/mvp-starter-prompt-evaluation.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/mvp-starter-prompt-evaluation.md)
- 결제 데모 문서: [docs/toss-payment.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/toss-payment.md)
- PRD 규칙: [docs/prds/README.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/prds/README.md)
- work item 규칙: [docs/work-items/README.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md)

## 의도적으로 넣지 않은 것

- 복잡한 admin auth / role system
- background jobs
- CMS
- 무거운 design system
- vendor lock-in analytics
- 과한 repository abstraction

PMF 이전 단계에서는 구현 속도보다 중요한 것이 `측정 가능한 사용자 신호`라는 전제를 유지합니다.
