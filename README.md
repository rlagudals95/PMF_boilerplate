# PMF Boilerplate

사업 아이디어나 운영 목표를 넣으면, 이미 있는 MVP block을 조합해 데모 가능한 첫 버전으로 빠르게 바꾸는 AI-native PMF boilerplate입니다.

## Who This Is For

- founder, operator, business starter처럼 직접 첫 MVP를 열고 싶은 사람
- landing, lead, consultation, admin 중심으로 빠르게 실험하고 싶은 팀
- 기능 수보다 측정 가능한 첫 signal이 더 중요한 PMF-stage 제품

이 레포는 자유 생성형 app builder보다, 이미 있는 block을 business goal에 맞게 조합하고 검증하는 데 더 잘 맞습니다.

## Start Your MVP In 5 Minutes

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

그다음 `http://localhost:3000`을 열면 starter가 뜹니다.

기본적으로 바로 확인할 수 있는 화면:

- `/`: 랜딩과 주요 CTA
- 필요 시 `/consult` 또는 `/pay`: 더 강한 전환 흐름
- `/admin`: 현재 핵심 지표와 setup 상태

이제 아래 프롬프트를 AI 코딩 툴에 그대로 붙여 넣으면 됩니다.

```text
이 repo를 PMF 탐색용 MVP kit로 사용해서 아래 사업 아이디어 또는 운영 목표를 첫 데모 가능한 버전으로 만들어줘.

입력:
[여기에 아이디어나 목표를 적기]

반드시 아래 순서로 진행해줘.
1. AGENTS.md와 관련 문서를 읽고 이 repo의 기존 building block을 먼저 이해한다.
2. 정말 필요한 경우에만 1~3개의 짧은 질문으로 goal, target user, target moment, constraints를 확인한다.
3. 입력을 goal / audience / offer / signal로 정리한다.
4. 기존 landing / lead / consultation / payment / admin / auth block 안에서 가장 얇고 데모 가능한 MVP shape를 고른다.
5. active flows와 deferred flows를 정한다.
6. 대부분의 첫 MVP는 copy, CTA, 활성 흐름 조정만으로 시작할 수 있으니 먼저 `apps/web/src/lib/product-config.ts`부터 맞춘다.
7. 새 폼 필드, 데이터 규칙, admin 구조처럼 기존 block으로 표현되지 않는 요구일 때만 deeper code를 수정한다.
8. 필요한 env vars와 optional capability 상태를 정리한다.
9. 마지막에 적절한 verify 명령을 실행한다.

최종 요약에는 반드시 아래를 포함해줘.
- selected MVP shape
- active flows
- deferred flows
- major copy/product changes applied
- required env vars for enabled capabilities
- verification result
- remaining manual follow-ups
```

입력 예시:

```text
가전렌탈 비교 사이트를 만들고 싶어.
사용자가 TV, 냉장고, 정수기 같은 렌탈 상품을 비교하고 내게 맞는 옵션을 찾게 하고 싶어.
첫 MVP 목표는 상담 신청이나 제휴 파트너 연결이야.
```

좋은 실행 결과는 보통 아래를 바로 알려줍니다.

- `selected MVP shape`
- `active flows`
- `deferred flows`
- `major copy/product changes applied`
- `required env vars for enabled capabilities`
- `verification result`
- `remaining manual follow-ups`

## Pick Your MVP Shape

| Shape | 언제 쓰면 좋은가 | 보통 켜지는 흐름 |
| --- | --- | --- |
| `lead-gen` | 관심 고객 정보를 빨리 모으고 싶은 경우 | landing, lead, admin |
| `consultation` | 상담 요청 자체가 첫 성공 신호인 경우 | landing, consultation, admin |
| `comparison-routing` | 비교 후 파트너 연결이나 상담 전환이 중요한 경우 | landing, lead, consultation, admin |
| `paid-intent` | 결제 의사나 예약금 같은 강한 구매 신호를 보고 싶은 경우 | landing, payment, admin |
| `waitlist` | 출시 전 관심자와 early signal을 모으고 싶은 경우 | landing, lead, admin |

대부분의 Day 0 MVP는 이 다섯 가지 안에서 고르면 충분합니다.

## What AI Will Change First

대부분의 첫 MVP는 새 코드를 많이 만드는 것보다, 기존 starter를 내 서비스처럼 보이게 맞추는 작업으로 시작합니다.

첫 수정 포인트는 보통 [`apps/web/src/lib/product-config.ts`](apps/web/src/lib/product-config.ts)입니다.

여기서 AI가 먼저 맞추는 것:

- 어떤 MVP shape를 쓸지
- 어떤 흐름을 지금 노출할지
- primary CTA와 주요 카피
- 서비스명, hero, trust signal
- lead 또는 consultation 문구
- admin에서 먼저 볼 핵심 metric

대부분의 첫 MVP는 카피, CTA, 활성 흐름 조정만으로 시작할 수 있습니다. 새 폼 필드, 데이터 규칙, admin 구조 변경처럼 현재 block으로 표현되지 않는 요구가 있을 때만 구조나 로직 수정이 들어갑니다.

## First Demo Is Done When

아래 네 가지가 맞으면 Day 0 데모는 거의 닫힌 상태입니다.

1. `/`가 내 서비스의 랜딩과 CTA처럼 보인다.
2. 필요한 경우 `/consult` 또는 `/pay`가 실제 전환 흐름처럼 보인다.
3. `/admin`에서 핵심 signal과 setup 상태를 읽을 수 있다.
4. `pnpm verify`가 통과한다.

## When You Need More

- 더 자세한 Day 0 흐름: [docs/start-your-mvp.md](docs/start-your-mvp.md)
- canonical starter prompt와 follow-up pack: [docs/ai-starter-prompt-pack.md](docs/ai-starter-prompt-pack.md)
- 첫 수정 surface 설명: [docs/product-config-system.md](docs/product-config-system.md)
- 입력이 이미 구조화돼 있다면: `pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."`
- Repo OS와 운영 규칙: [docs/repo-os.md](docs/repo-os.md)
- 전체 agent context: [docs/agent-context.md](docs/agent-context.md)
