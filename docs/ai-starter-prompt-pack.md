# AI Starter Prompt Pack

이 문서는 이 저장소를 `generator-first`가 아니라 `tool-neutral prompt-first MVP kit`로 쓰기 위한 canonical prompt pack입니다.

역할 분리는 아래처럼 생각하면 됩니다.

- README: 처음 받은 팀이 그대로 따라 하는 Day 0 사용 순서
- 이 문서: AI 툴에 붙여 넣는 prompt 원문과 follow-up prompt source

## Recommended Default

- 대부분의 사용자는 명령어보다 AI 코딩 툴에서 이 prompt pack으로 시작합니다.
- 사용자 경험은 one-shot에 가깝게 유지하되, AI는 내부적으로 repo context를 먼저 읽고 필요한 경우에만 1~3개의 질문으로 목표를 확인합니다.
- 입력이 business idea이든 정책/운영 규칙이든 먼저 goal packet으로 정규화한 뒤 가장 얇은 MVP slice를 고릅니다.
- 이 저장소의 강점은 자유 생성이 아니라 existing block 조합입니다. 먼저 `landing`, `lead`, `consultation`, `payment`, `admin`, `auth` 블록 안에서 해결하고, 먼저 `apps/web/src/lib/product-config.ts`의 `mvp` contract와 copy surface를 맞춥니다.
- `mvp:new`, `prd:new`, `feature:new`, `work:new`는 계속 유지하지만, manual scaffold나 power-user workflow일 때 우선 사용합니다.

## Supported MVP Shapes

아래 recipe는 generator magic이 아니라 existing module composition pattern입니다.

| Shape | Active flows | Best for |
| --- | --- | --- |
| `lead-gen` | landing, lead capture, admin | 빠르게 문의/관심 신호를 모으는 MVP |
| `consultation` | landing, consultation, admin | 상담 요청 자체가 핵심 전환인 MVP |
| `comparison-routing` | landing, lead capture, consultation, admin | 비교 후 파트너 연결이 핵심인 MVP |
| `paid-intent` | landing, payment intent, admin | 결제 의사나 예약금을 강한 신호로 보는 MVP |
| `waitlist` | landing, lead capture, admin | 출시 전 관심자와 early signal을 모으는 MVP |

Auth와 payment는 기본 기능이 아니라 optional runtime capability입니다. 비즈니스 목표가 요구할 때만 surface에 올립니다.

## Canonical Starter Prompt

아래 프롬프트를 Cursor, Claude Code, Codex 같은 AI 코딩 툴에 그대로 붙여 넣는 것을 기본값으로 둡니다.

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

## Short Prompt

더 짧은 시작이 필요하면 아래 프롬프트를 사용합니다.

```text
이 repo를 읽고 내 사업 아이디어나 운영 정책을 이 구조에 맞는 가장 얇은 MVP로 적용해줘.
먼저 repo context를 읽고 꼭 필요할 때만 1~3개의 질문을 해줘.
existing landing / lead / consultation / payment / admin 블록 안에서 풀고, 먼저 `product-config.mvp`와 copy surface를 맞춘 뒤 verify까지 해줘.
마지막엔 active flows, deferred flows, required env vars, verification result를 요약해줘.
```

## Output Contract

좋은 실행 결과는 아래를 항상 포함해야 합니다.

- selected MVP shape
- active flows
- deferred flows
- major copy/product changes applied
- required env vars for enabled capabilities
- verification result
- remaining manual follow-ups

이 계약은 [docs/mvp-starter-prompt-evaluation.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/mvp-starter-prompt-evaluation.md)와 report template의 기준이기도 합니다.

## Policy-Driven Example

정책이나 운영 제약이 먼저 들어와도 같은 계약으로 정규화합니다.

### 입력 예시

```text
우리 MVP는 출시 첫 주에는 결제보다 상담 전환이 더 중요해.
개인정보를 최소 수집해야 하고, 운영팀이 바로 후속 연락할 수 있어야 해.
첫 성공 기준은 qualified consultation request가 일주일 안에 10건 넘는 거야.
```

### 기대하는 정규화

- business goal: qualified consultation request 확보
- target user: 상담이 필요한 초기 관심 사용자
- target moment: 비교/문의 직전 의사결정 순간
- success metric: qualified consultation request >= 10 in 7 days
- non-goals: 첫 주 결제 전환 최적화
- constraints: 개인정보 최소 수집, 운영팀 후속 연락 가능해야 함
- existing evidence: 현재 운영 정책과 첫 주 launch priority

### 보통 이어지는 MVP 판단

- selected MVP shape: `consultation`
- active flows: `landing`, `consultation`, `admin`
- deferred flows: `payment`, `auth`

## Follow-Up Prompt Pack

### Tighten Copy

```text
지금 MVP 구조는 유지하고, 카피만 더 날카롭게 다듬어줘.
target user와 핵심 전환은 유지하고, hero / trust signal / form copy / CTA를 더 명확하고 설득력 있게 맞춰줘.
수정한 copy surface와 변경 이유를 함께 요약해줘.
```

### Change Funnel

```text
현재 MVP에서 funnel shape를 바꾸고 싶어.
existing building block 안에서 active flows와 deferred flows를 다시 정리하고, `product-config.mvp`와 관련 surface를 그에 맞게 조정해줘.
무엇을 켜고 무엇을 내렸는지와 이유를 같이 요약해줘.
```

### Add Or Remove Payment/Auth

```text
현재 MVP에서 payment 또는 auth를 추가하거나 빼고 싶어.
비즈니스 목표 기준으로 이 capability가 정말 필요한지 먼저 판단하고, 필요한 경우에만 surface와 env requirements를 맞춰줘.
변경 후 필요한 env vars와 optional capability 상태를 요약해줘.
```

### Make Admin More Useful

```text
현재 MVP에서 admin이 더 바로 의사결정에 도움이 되게 만들어줘.
핵심 전환에 맞는 metric emphasis, signal ordering, copy를 개선하고, 운영자가 다음 액션을 정하기 쉬운 방향으로 정리해줘.
무엇이 바뀌었고 어떤 의사결정이 쉬워졌는지 요약해줘.
```

## When To Use CLI Helpers

- raw business idea에서 바로 시작할 때는 이 문서의 starter prompt를 그대로 사용합니다.
- `pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."`: 입력이 이미 구조화된 경우 PRD와 첫 work item을 여는 structured helper
- `pnpm prd:new <slug>`: 더 자유도가 높은 PRD 초안이 필요할 때
- `pnpm feature:new --prd <slug>`: canonical PRD를 단일 feature work item으로 정리할 때
- `pnpm work:new <slug> --request "..."`: 중요한 작업 문서 scaffold가 먼저 필요할 때

이 명령들은 repo-local workflow에는 계속 중요하지만, 이 저장소의 primary onboarding promise는 prompt-first입니다.
