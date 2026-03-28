# MVP Starter Prompt Evaluation

이 문서는 `README`, [start-your-mvp.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md), [ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)에 있는 starter prompt를 감이 아니라 반복 가능한 기준으로 비교하기 위한 canonical guide입니다.

## 목적

- Cursor, Claude Code, Codex 같은 도구에서 공통으로 쓸 수 있는 starter prompt를 비교합니다.
- 어떤 prompt를 기본값으로 둘지 `ship | iterate | reject` 기준으로 판단합니다.
- 평가 기준은 단순 command correctness보다 `time to usable demo`와 `surface coherence`를 더 우선합니다.
- prompt 변경 사유를 repo 안 문서로 남깁니다.

## 언제 사용하나

- README의 starter prompt를 바꾸려 할 때
- 새 prompt variant를 추가하려 할 때
- 특정 도구에서만 잘 작동하는지, 공통 호환성이 있는지 확인할 때

## Prompt Variants

### Variant A: Short AI Prompt

```text
이 repo를 읽고 내 사업 아이디어를 이 구조에 맞는 가장 얇은 MVP로 적용해줘.
먼저 repo context를 읽고 꼭 필요할 때만 1~3개의 질문을 해줘.
existing landing / lead / consultation / payment / admin 블록 안에서 풀고, 먼저 product-config를 맞춘 뒤 verify까지 해줘.
마지막엔 active flows, deferred flows, required env vars, verification result를 요약해줘.
```

- 장점: 가장 짧고 tool-neutral하다.
- 약점: 너무 짧은 도구에서는 output contract가 흔들릴 수 있다.

### Variant B: Full AI Prompt

```text
이 repo를 PMF 탐색용 MVP kit로 사용해서 아래 사업 아이디어의 첫 데모 가능한 버전을 만들어줘.

사업 아이디어:
[여기에 설명]

반드시 아래 순서로 진행해줘.
1. AGENTS.md와 관련 ai/context/docs를 읽어 이 repo 구조와 기존 building block을 먼저 이해한다.
2. 정말 필요한 경우에만 1~3개의 짧은 질문으로 goal, target user, 핵심 전환을 확인한다.
3. 아이디어를 goal / audience / offer / signal로 정리한다.
4. 기존 landing / lead / consultation / payment / admin / auth 블록 안에서 가장 얇고 데모 가능한 MVP shape를 고른다.
5. active flows와 deferred flows를 정한다.
6. 먼저 `apps/web/src/lib/product-config.ts`와 관련 product-facing surface를 맞춘다.
7. 기존 블록으로 표현되지 않는 요구일 때만 deeper code를 변경한다.
8. auth와 payment는 비즈니스 목표가 필요로 할 때만 노출한다.
9. 필요한 env vars와 optional capability 상태를 정리한다.
10. 마지막에 적절한 verify 명령을 실행한다.

최종 요약에는 아래를 꼭 포함해줘.
- selected MVP shape
- active flows
- deferred flows
- major copy/product changes applied
- required env vars for enabled capabilities
- verification result
- remaining manual follow-ups
```

- 장점: 산출물과 output contract가 가장 안정적이다.
- 약점: 길어서 도구별 context budget 영향을 더 받을 수 있다.

### Variant C: CLI Scaffold Helper

- 형태: `pnpm mvp:new <slug> --prompt "..."`
- 장점: deterministic한 PRD/work item scaffold를 빠르게 만들 수 있다.
- 약점: repo를 직접 제품화하는 one-shot UX의 primary promise는 아니다.

## Evaluation Scenarios

### S-01 Comparison Routing

- idea: `나는 렌탈 지원금을 비교해주는 사이트를 만들고 싶고 최종 목표는 렌탈사로 보내는 거야.`
- expected recipe: `comparison-routing`
- must-have signals: `qualified lead`, `partner handoff`, `consultation intent`

### S-02 Consultation

- idea: `나는 창업자에게 세무 상담을 연결해주는 서비스를 만들고 싶고 최종 목표는 상담 신청을 늘리는 거야.`
- expected recipe: `consultation`
- must-have signals: `consultation request`, `qualified consult`

### S-03 Paid Intent

- idea: `나는 AI 회의록 서비스를 만들고 싶고 최종 목표는 예약 결제 의사를 검증하는 거야.`
- expected recipe: `paid-intent`
- must-have signals: `checkout started`, `payment intent`

### S-04 Waitlist Or Lead Capture

- idea: `나는 출시 전 신규 서비스 관심자를 모으고 싶고 최종 목표는 초기 가입 대기자를 모으는 거야.`
- expected recipe: `waitlist` 또는 `lead-gen`
- must-have signals: `signup`, `qualified waitlist`

## Run Protocol

1. 새 세션 또는 깨끗한 대화에서 시작합니다.
2. 같은 repo 상태와 같은 브랜치에서 실행합니다.
3. 같은 시나리오를 각 도구에 그대로 입력합니다.
4. 중간 힌트는 주지 않고, 도구가 먼저 묻는 clarification만 기록합니다. 질문 수는 1~3개 이내가 이상적입니다.
5. 결과를 [prompt-evaluation-report.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/templates/prompt-evaluation-report.md)로 남깁니다.

## Scoring Rubric

각 항목은 1~5점으로 기록합니다.

### 1. Goal Packet Extraction

- 5: goal, audience, offer, signal을 모두 적절하게 정리했다.
- 3: 핵심은 맞지만 하나 이상이 generic하거나 흔들린다.
- 1: goal packet이 부정확하거나 빠져 있다.

### 2. MVP Shape Fit

- 5: expected recipe 또는 동등한 active flow 조합을 고르고 이유도 납득 가능하다.
- 3: 쓸 수는 있지만 더 나은 flow 조합이 있다.
- 1: 잘못된 flow를 중심으로 잡는다.

### 3. Product Surface Coherence

- 5: landing, form, admin emphasis, CTA가 같은 제품 언어를 쓴다.
- 3: 큰 방향은 맞지만 일부 surface가 generic하거나 엇갈린다.
- 1: surface마다 다른 제품을 말한다.

### 4. Time To Usable Demo

- 5: 거의 바로 데모 가능한 형태로 적용 방향이 명확하다.
- 3: PRD나 scaffold는 괜찮지만 사람이 더 많이 손봐야 한다.
- 1: 문서만 생기고 usable demo 경로가 약하다.

### 5. Scope Control

- 5: 첫 MVP 범위를 얇고 measurable하게 자른다.
- 3: 범위가 약간 크지만 조정 가능하다.
- 1: 불필요한 기능을 많이 켠다.

### 6. Clarification Overhead

- 5: 추가 질문이 없거나 1개 정도로 잘 진행한다.
- 3: 질문이 1~3개 있지만 흐름을 크게 끊지 않는다.
- 1: 질문이 많아 시작 속도를 해친다.

### 7. Capability & Env Accuracy

- 5: auth/payment/marketing 등 optional capability와 필요한 env vars를 정확히 설명한다.
- 3: 큰 방향은 맞지만 일부 env나 capability 설명이 빠진다.
- 1: 필요 없는 capability를 권하거나 env 요약이 부정확하다.

### 8. Portability

- 5: tool-specific 문법 없이 그대로 다른 도구에도 복붙 가능하다.
- 3: 약간의 도구 가정은 있지만 크게 의존하지 않는다.
- 1: 특정 도구 기능에 강하게 묶여 있다.

### 9. Final Summary Contract

- 5: selected MVP shape, active/deferred flows, major changes, env requirements, verify result, follow-up이 한 번에 정리된다.
- 3: 일부 요약은 있지만 의사결정에 부족하다.
- 1: 장황하거나 핵심 output contract가 빠진다.

## Decision Rule

- `ship`
  - 평균 4.0 이상
  - `MVP Shape Fit`, `Product Surface Coherence`, `Time To Usable Demo` 중 3점 미만이 없음
- `iterate`
  - 평균 3.0 이상 4.0 미만
  - 또는 핵심 항목 중 하나가 3점 미만
- `reject`
  - 평균 3.0 미만
  - 또는 `MVP Shape Fit`이 1점

## Recording Rules

- 결과는 말로만 남기지 않고 report template로 저장합니다.
- completed report는 `docs/prompt-evaluations/<date>-<tool>-<variant>-<scenario>.md` 형식으로 저장합니다.
- 도구 특이사항은 notes에 적되, canonical prompt 자체는 가능한 한 tool-neutral하게 유지합니다.
- 도구가 추가 지시를 요구했다면 그 문구를 그대로 기록합니다.

## Recommended Default

현재 기본 추천은 아래와 같습니다.

- AI 툴에 복붙해서 end-to-end 작업: Variant B (Full AI Prompt)
- 빠른 테스트용 보조 prompt: Variant A (Short AI Prompt)
- repo-local scaffold helper: Variant C (`pnpm mvp:new --prompt`)
