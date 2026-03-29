# PMF Boilerplate

비즈니스 아이디어, 운영 정책, business goal을 `데모 가능한 MVP`로 빠르게 바꾸기 위한 AI-native PMF boilerplate입니다. 이 저장소는 자유 생성형 app builder보다, 이미 있는 MVP block을 빠르게 조합하고 검증해 첫 신호를 보는 데 더 잘 맞습니다.

## Why This Exists

이 레포는 작은 팀이 PMF 단계의 MVP를 빠르게 여는 동안에도 품질 게이트와 문서 규율을 잃지 않게 하려고 만들어졌습니다. 목표는 “많이 만드는 것”이 아니라, business goal을 기준으로 가장 얇은 slice를 고르고 repo 안 증거로 품질을 닫는 것입니다.

## Good Fit / Bad Fit

잘 맞는 경우:

- PMF-stage MVP를 빠르게 열고 싶은 경우
- founder/operator가 AI와 함께 제품 shape를 직접 잡고 싶은 경우
- landing, lead, consultation, admin 중심 funnel을 실험하고 싶은 경우
- 기능 수보다 측정 가능한 signal을 더 중요하게 보는 경우

덜 맞는 경우:

- day 1부터 무거운 enterprise platform을 만들려는 경우
- CMS-first 제품을 바로 운영하려는 경우
- background job과 async workflow가 핵심인 경우
- infra-first multi-service platform을 먼저 세우려는 경우

## Core Value

- 정책, business goal, PRD, raw request처럼 입력이 달라도 먼저 goal packet과 thin slice로 정규화합니다.
- 빠른 구현 흐름에서도 `pnpm verify`, `pnpm repo:check`, `pnpm browser:qa` 같은 repo-local proof로 품질을 닫습니다.
- 중요한 작업은 PM/PD/FE/BE 관점의 product-squad review로 business goal 달성 가능성을 높입니다.
- 제품, 전략, PRD, 운영 규칙의 source of truth는 repo 안 Markdown이고, adapter나 외부 툴은 파생 surface로 둡니다.

핵심 운영 철학은 [ai/context/ai-native.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai/context/ai-native.md), Repo OS 인덱스는 [docs/repo-os.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md)에 있습니다.

## Start In 5 Minutes

가장 짧은 Day 0 경로는 아래입니다.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

그다음:

1. `http://localhost:3000`을 엽니다.
2. [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)의 starter prompt로 AI를 시작합니다.
3. 먼저 `product-config`에서 해결 가능한지 보고, 필요할 때만 deeper code로 내려갑니다.
4. 마지막에 `pnpm verify`를 실행합니다.

더 자세한 Day 0 흐름은 [docs/start-your-mvp.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md)에 있습니다.

## How It Works

이 레포의 one-shot은 자유 생성이 아니라, 이미 있는 block을 business goal에 맞게 빠르게 조합하는 방식입니다.

`goal packet -> shape selection -> product-config -> deeper code only if needed -> verify`

요청을 받으면 먼저 이 변경이 `product-config-friendly`인지, `gated work`인지, `deep code`까지 필요한지 봅니다. 기본값은 언제나 safe surface부터 시작하는 것이고, [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)가 가장 안전한 첫 수정면입니다. deeper code는 기본 동작이 아니라 escalation path입니다.

## Daily Commands

```bash
pnpm dev
pnpm verify
pnpm repo:check
pnpm browser:qa --work <work-id>
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
pnpm feature:new --prd <slug>
pnpm work:new <slug> --request "..."
```

## Choose Your Path

- MVP를 오늘 바로 시작하고 싶다면: [docs/start-your-mvp.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md)
- AI를 canonical prompt로 움직이고 싶다면: [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)
- Repo OS와 agent operating rule을 이해하고 싶다면: [docs/repo-os.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md)
- 안전한 첫 수정 surface를 알고 싶다면: [docs/product-config-system.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-config-system.md)

## Read Next

- [docs/start-your-mvp.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md)
- [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)
- [docs/product-config-system.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-config-system.md)
- [docs/repo-os.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/repo-os.md)
- [docs/agent-context.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/agent-context.md)
