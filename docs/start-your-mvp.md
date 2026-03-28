# Start Your MVP

이 문서는 이 저장소를 `기능이 많은 boilerplate`가 아니라 `비즈니스 목표를 받아 첫 MVP를 여는 kit`로 쓰는 가장 빠른 시작 경로를 설명합니다.

## 가장 빠른 시작

가능하면 기능 목록부터 보지 말고, 아래 한 줄 명령부터 시작합니다.

```bash
pnpm mvp:new <slug> --prompt "..."
```

예시:

```bash
pnpm mvp:new rental-support-match --prompt "나는 렌탈 지원금을 비교해주는 사이트를 만들고 싶고 최종 목표는 렌탈사로 보내는 게 목표야"
```

이 명령은 첫 버전에서 아래를 같이 만듭니다.

- PRD 초안
- 첫 feature work item
- 추천 MVP recipe
- active flows / deferred flows
- primary CTA
- admin metric 초안

## Prompt Template

아래 포맷이면 충분합니다.

```text
나는 [무엇을 해주는 사이트/서비스/앱]를 만들고 싶고
최종 목표는 [어떤 비즈니스 전환]이야
```

더 길게 써도 됩니다.

```text
이 repo를 generic MVP kit로 사용해서 아래 사업 아이디어의 첫 실험 버전을 세팅해줘.
나는 [서비스 아이디어]를 만들고 싶고, 최종 목표는 [핵심 비즈니스 목표]야.
필요한 기능만 켜고 PRD/work item/product-config까지 이어질 수 있게 정리해줘.
```

## Recipe Quick Guide

### `lead-gen`

- 언제: 빠르게 문의/관심 신호를 모으고 싶을 때
- active flows: landing, lead capture, admin
- deferred flows: consultation, payment, auth

### `consultation`

- 언제: 상담 요청 자체가 핵심 전환일 때
- active flows: landing, consultation, admin
- deferred flows: payment, auth

### `comparison-routing`

- 언제: 비교 후 적합한 파트너나 제휴사로 연결하는 게 목표일 때
- active flows: landing, lead capture, consultation, admin
- deferred flows: payment, auth

### `paid-intent`

- 언제: 결제 의사, 예약금, pre-order 같은 stronger signal이 필요할 때
- active flows: landing, payment intent, admin
- deferred flows: consultation, auth

### `waitlist`

- 언제: 출시 전 관심 사용자와 early signal을 모으고 싶을 때
- active flows: landing, lead capture, admin
- deferred flows: consultation, payment, auth

## 생성 후 첫 3단계

### 1. PRD 확인

- `docs/prds/<slug>.md`
- 여기서 recipe, active flows, deferred flows, key metrics를 먼저 본다.

### 2. Work item 확인

- `docs/work-items/<work-id>/brief.md`
- 생성된 범위가 너무 크면 여기서 먼저 줄인다.

### 3. Product copy 맞추기

- `apps/web/src/lib/product-config.ts`
- 서비스명, hero angle, trust signal, CTA, quality metric을 여기서 맞춘다.

## 처음엔 무시해도 되는 것

- social auth starter
- payment demo
- A/B test package 세부 설정
- admin의 모든 화면

중요한 건 “기능을 다 이해하는 것”이 아니라 “이번 MVP에서 어떤 흐름만 켜는가”입니다.

## Fallback

prompt보다 구조화된 입력이 더 편하면 기존 방식도 그대로 쓸 수 있습니다.

```bash
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
```

이 경우에도 generator는 적절한 recipe와 setup summary를 같이 제안합니다.
