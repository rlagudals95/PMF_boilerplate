# PMF Boilerplate

비즈니스 아이디어, 운영 정책, business goal을 받아 `데모 가능한 MVP`로 빠르게 적용하기 위한 PMF 탐색용 모노레포 kit입니다.

## 목적 요약

이 레포는 작은 제품팀이 AI와 함께 `첫 데모 가능한 MVP`를 빠르게 여는 데 초점을 둔 starter입니다.

핵심 운영 약속은 아래와 같습니다.

- 정책이나 business goal도 goal packet과 MVP thin slice로 정규화합니다.
- 바이브 코딩이어도 repo-local quality gate로 품질을 판정합니다.
- 중요한 작업은 PM/PD/FE/BE 역할 관점으로 검토합니다.
- 제품/전략/PRD/운영 규칙의 source of truth는 repo Markdown입니다.

운영 철학과 quality bar의 canonical source는 [ai/context/ai-native.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai/context/ai-native.md)입니다. Repo OS 문서 계층과 verification entrypoint 인덱스는 [docs/repo-os.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md)에 있습니다.

잘 맞는 경우:

- 비즈니스 아이디어를 repo-aware one-shot prompt로 바로 제품 형태까지 끌고 가고 싶은 경우
- 랜딩, 리드, 상담, 결제 의사, 운영 확인을 한 앱 안에서 실험하고 싶은 경우
- PMF 전 단계에서 `기능 수`보다 `측정 가능한 사용자 신호`를 더 중요하게 보는 경우

Day 0 목표는 아래 흐름을 가장 빠르게 여는 것입니다.

`랜딩 -> 리드 수집 -> 상담 요청 -> 결제 의사 확인 -> 어드민 확인 -> 실험 문서화`

## Day 0 사용 순서

처음 이 레포를 받으면 보통 아래 순서로 시작합니다.

### 1. 로컬 실행

당신이 하는 일:

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

기대 결과:

- `http://localhost:3000`에서 기본 starter가 뜹니다.
- `DATABASE_URL`이 없으면 `packages/db/local-data.json` fallback으로 바로 데모할 수 있습니다.

### 2. AI에 one-shot prompt 붙여 넣기

당신이 하는 일:

- Codex, Cursor, Claude Code 같은 AI 코딩 툴에 아래 starter prompt를 넣습니다.
- 이때 비즈니스 아이디어, 운영 정책, 첫 MVP 목표 중 핵심 입력만 적으면 충분합니다.
- 같은 prompt 원문은 [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)에도 있습니다.

기대 결과:

- AI가 repo를 먼저 읽고, 정말 필요할 때만 1~3개의 짧은 질문을 합니다.

### 3. AI가 repo-aware MVP shape를 고르기

당신이 하는 일:

- shape를 직접 고르지 않아도 됩니다.
- AI가 `landing / lead / consultation / payment / admin / auth` 블록 중 가장 얇은 MVP 구성을 고르게 합니다.

기대 결과:

- `selected MVP shape`
- `active flows`
- `deferred flows`

### 4. `product-config.mvp + copy` 먼저 수정

당신이 하는 일:

- AI가 먼저 [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)를 바꾸게 합니다.

기대 결과:

- `mvp.shape`
- `activeFlows / deferredFlows`
- `primaryRoute / primaryCta`
- `navExposure / capability mode`
- `admin.highlightedMetrics`
- 서비스명, hero angle, trust signal, lead / consultation copy

### 5. 필요한 경우에만 deeper code 수정

당신이 하는 일:

- 먼저 기존 블록으로 표현 가능한지 봅니다.
- 정말 필요할 때만 lead/consult/admin surface나 schema/action을 더 바꾸게 합니다.

기대 결과:

- one-shot 범위 안에서는 큰 구조 변경 없이도 데모 가능한 MVP가 나옵니다.
- 기존 블록으로 안 되는 요구만 추가 구현합니다.

### 6. `pnpm verify`와 브라우저 확인

당신이 하는 일:

- AI에게 마지막에 `pnpm verify`를 실행하게 합니다.
- canonical 문서, work item contract, adapter-driving 파일을 바꿨다면 `pnpm repo:check`도 같이 실행하게 합니다.
- 브라우저에서 `/`, `/consult`, `/pay`, `/admin` 중 active flow에 맞는 화면을 확인합니다.

기대 결과:

- major copy/product changes applied
- required env vars for enabled capabilities
- verification result
- remaining manual follow-ups

## One-Shot 프롬프트

아래 프롬프트를 Codex, Cursor, Claude Code 같은 AI 코딩 툴에 그대로 붙여 넣는 것을 권장합니다.

```text
이 repo를 PMF 탐색용 MVP kit로 사용해서 아래 사업 아이디어 또는 운영 정책/비즈니스 목표를 첫 데모 가능한 버전으로 만들어줘.

입력:
[여기에 설명]

반드시 아래 순서로 진행해줘.
1. AGENTS.md와 관련 ai/context/docs를 읽어 이 repo 구조와 기존 building block을 먼저 이해한다.
2. 정말 필요한 경우에만 1~3개의 짧은 질문으로 goal, target user, target moment, constraints를 확인한다.
3. 입력을 goal packet과 goal / audience / offer / signal로 정리한다.
4. 기존 landing / lead / consultation / payment / admin / auth 블록 안에서 가장 얇고 데모 가능한 MVP shape를 고른다.
5. active flows와 deferred flows를 정한다.
6. 먼저 `apps/web/src/lib/product-config.ts`의 `mvp` shape, active/deferred flow, primary CTA와 copy surface를 맞춘다.
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

## 실전 예시 1개

아래처럼 `가전렌탈 비교 사이트`를 만들고 싶다고 넣으면, 보통 이런 흐름으로 진행됩니다.

### 입력한 사업 아이디어

```text
가전렌탈 비교 사이트를 만들고 싶어.
사용자가 TV, 냉장고, 정수기 같은 렌탈 상품을 비교하고 내게 맞는 옵션을 찾게 하고 싶어.
첫 MVP 목표는 상담 신청이나 제휴 파트너 연결이야.
```

### AI가 보통 고르는 첫 구조

- selected MVP shape: `comparison-routing`
- active flows: `landing`, `lead`, `consultation`, `admin`
- deferred flows: `payment`, `auth`

### 먼저 바뀌는 곳

- [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)
  - `mvp.shape`
  - `activeFlows / deferredFlows`
  - `primaryCta`
  - hero / trust / lead / consultation copy

### 경우에 따라 추가로 바뀌는 곳

- 리드 폼 문구나 입력 흐름: `lead` surface
- 상담 요청 문구나 stronger signal 흐름: `consultation` surface
- 운영자가 먼저 봐야 할 지표와 상태: `admin` surface

### 마지막 확인

- `/`: 비교형 랜딩과 리드 진입이 맞는지 본다
- `/consult`: 상담 요청 flow가 실제 stronger signal처럼 보이는지 본다
- `/admin`: qualified lead와 consult signal이 먼저 보이는지 본다
- `pnpm verify`: 타입, lint, 테스트가 모두 통과하는지 본다

## How One-Shot Works Here

이 레포의 one-shot은 `자연어를 마법처럼 앱으로 자동 생성`하는 방식이 아닙니다.

실제로는 아래 계약으로 동작합니다.

`one-shot prompt -> goal packet 정규화 -> repo-aware shape selection -> product-config.mvp + copy update -> optional deeper code -> verify`

즉 AI는 아래 순서로 움직입니다.

1. repo context를 먼저 읽습니다.
2. `landing / lead / consultation / payment / admin / auth` 중 가장 얇은 shape를 고릅니다.
3. 먼저 `product-config.mvp`와 copy surface를 맞춥니다.
4. inactive flow는 라우트는 남기되 header, landing, admin 기본 노출에서는 숨깁니다.
5. 기존 블록으로 안 되는 경우에만 deeper code를 수정합니다.
6. payment/auth는 필요할 때만 surface에 올리고, env가 없으면 `setup required` 상태로 남깁니다.

그래서 이 레포의 강점은 `아무거나 자동 생성`이 아니라 `기존 MVP 블록을 빠르게 제품화하기 쉬운 구조`에 있습니다.

## 로컬 실행과 확인 경로

### 기본 실행

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

기본 주소는 `http://localhost:3000`입니다.

### 자주 확인하는 화면

- `/`: 랜딩 페이지와 리드 폼
- `/consult`: 상담 요청 폼
- `/pay`: 토스 결제 데모
- `/auth`: optional social login starter demo
- `/admin`: 전체 개요
- `/admin/leads`: 리드 / 상담 요청 inbox
- `/admin/experiments`: 실험 목록
- `/admin/payments`: 결제 상태

### 저장 방식

- `DATABASE_URL`이 없으면 `packages/db/local-data.json`에 저장됩니다.
- `DATABASE_URL`이 있으면 Neon을 포함한 generic Postgres/Drizzle 경로를 사용합니다.

## 지원하는 MVP Shapes

아래 recipe는 generator magic이 아니라 existing module composition pattern입니다.

| Shape | Active flows | Best for |
| --- | --- | --- |
| `lead-gen` | landing, lead capture, admin | 빠르게 문의/관심 신호를 모으는 MVP |
| `consultation` | landing, consultation, admin | 상담 요청 자체가 핵심 전환인 MVP |
| `comparison-routing` | landing, lead capture, consultation, admin | 비교 후 파트너 연결이 핵심인 MVP |
| `paid-intent` | landing, payment intent, admin | 결제 의사나 예약금을 강한 신호로 보는 MVP |
| `waitlist` | landing, lead capture, admin | 출시 전 관심자와 early signal을 모으는 MVP |

Auth와 payment는 기본 기능이 아니라 optional capability입니다. 비즈니스 목표가 요구할 때만 surface에 올리는 편이 맞습니다.

## Env / Optional Capability

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

전체 목록은 [`.env.example`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/.env.example)을 보면 됩니다.

## Structured Helper는 언제 쓰는가

기본 사용자 여정은 one-shot prompt입니다. 다만 아래 상황이면 structured helper가 유용합니다.

- AI 없이 repo-local scaffold를 먼저 만들고 싶을 때
- 이미 `goal / audience / offer / signal`이 정리돼 있을 때
- PRD 초안과 첫 work item을 바로 만들고 싶을 때

```bash
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
```

예시:

```bash
pnpm mvp:new rental-support-match --goal "상담 신청과 제휴 파트너 연결" --audience "렌탈 비교 후 적합한 업체를 찾고 싶은 사용자" --offer "조건 비교 후 적합한 파트너로 연결해 주는 서비스" --signal "qualified_lead_rate >= 20% within 14 days"
```

이 명령은 PRD 초안, 첫 work item, 추천 recipe, active flows, deferred flows, primary CTA, admin metric 초안을 함께 만듭니다.

## 자주 쓰는 명령어

### Daily

```bash
pnpm dev
pnpm repo:check
pnpm verify
pnpm verify:full
pnpm test:e2e
```

### PRD / Work item / Scaffold

```bash
pnpm mvp:new my-mvp --goal "..." --audience "..." --offer "..." --signal "..."
pnpm prd:new my-prd
pnpm feature:new --prd my-prd
pnpm work:new my-task --request "작업 배경"
pnpm repo:check
pnpm squad:check
```

### Data / Context

```bash
pnpm db:seed
pnpm db:generate
pnpm db:migrate
pnpm ai:sync
```

## 더 자세히 볼 문서

- canonical prompt pack: [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)
- Repo OS index: [docs/repo-os.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md)
- 시작 가이드: [docs/start-your-mvp.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md)
- prompt 평가 가이드: [docs/mvp-starter-prompt-evaluation.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/mvp-starter-prompt-evaluation.md)
