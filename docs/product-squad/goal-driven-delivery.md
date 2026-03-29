---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Goal-Driven Delivery

## 목적

- 사용자가 “무엇을 만들까”보다 “어떤 비즈니스 목표를 달성해야 하나”를 먼저 주더라도 AI가 높은 품질의 제품 결정을 내릴 수 있게 한다.
- 정책, 운영 원칙, business goal처럼 구현보다 상위 입력이 먼저 와도 같은 goal packet과 quality gate로 정규화할 수 있게 한다.
- 멀티에이전트 서비스가 없어도 repo 안 문서, 스킬, 템플릿만으로 역할 기반 논의와 품질 루프를 재현한다.
- downstream 서비스가 이 보일러플레이트만 가져가도 같은 작업 방식을 재사용할 수 있게 한다.

## 핵심 원칙

- 좋은 결과는 agent 수보다 `명확한 goal packet`과 `짧은 evidence loop`에서 나온다.
- 역할 분리는 구현 분업이 아니라 관점 충돌을 의도적으로 만들기 위한 장치다.
- user-facing 품질은 코드 리뷰만으로 충분하지 않고 browser evidence가 필요하다.
- AI가 스스로 추측해 채워 넣는 영역을 줄이고, metric과 non-goals를 먼저 고정한다.
- 별도 orchestration 서비스보다 repo 안 source of truth를 우선한다.
- one-shot 지향은 질문 없는 생성이 아니라, 부족한 입력을 빠르게 드러내고 보충하는 계약으로 본다.

## Goal Packet

중요한 작업을 시작할 때 최소한 아래 입력이 있어야 합니다.

- business goal
  - 예: 상담 전환율 상승, qualified lead 비중 개선, 첫 결제 의사 확인
- target user
  - 누구를 위한 변경인지
- target moment
  - 어떤 맥락에서 그 사용자가 제품을 여는지
- success metric
  - ship/iterate/stop을 판단할 수 있는 숫자
- non-goals
  - 이번 작업에서 해석을 흐리는 확장 범위
- constraints
  - 브랜드, 법무, 운영, 기술, 일정 제약
- existing evidence
  - 기존 랜딩, 영업 메모, 실험 이력, 고객 피드백, analytics, 경쟁 사례
- visual bar
  - 상용 서비스 품질 바, trust source, reference 또는 anti-reference, 피해야 할 boilerplate smell

이 packet이 약하면 구현보다 문서 보강이 먼저입니다.

정책 입력은 별도 체계로 분리하지 않고 아래처럼 goal packet 안으로 정규화합니다.

- 꼭 지켜야 하는 운영/법무/브랜드 규칙
  - `constraints`
- 이번 단계에서 하면 안 되는 것
  - `non-goals`
- 무조건 통과해야 하는 품질 기준
  - `required quality bar`

`po-role`은 goal packet을 아래 세 단계로 분류합니다.

- `ready`
  - 바로 역할 비평으로 진행 가능
- `needs-clarification`
  - 1~3개의 짧은 질문으로 보강 가능
- `not-safe-to-build`
  - 지금 구현하면 boilerplate 결과가 나올 가능성이 높아 설계 보강이 먼저 필요

## 팀 토폴로지

- `product-squad`
  - 전체 흐름 오케스트레이션, work item 상태, 최종 scorecard 정리
- `po-role`
  - goal packet completeness, clarification loop, build-start approval
- `pm-role`
  - 문제, 목표, success metric, acceptance criteria 고정
- `pd-role`
  - IA, copy, CTA, trust, edge state, accessibility, browser QA 포인트, commercial landing quality 검토
- `fe-role`
  - route/module/component 경계, state flow, instrumentation 위치, UI test-first 계획
- `be-role`
  - validation, persistence, analytics/event, failure mode, admin 해석 가능성 검토
- `quality review`
  - 별도 상시 역할이 아니라 각 역할 산출물을 `quality-scorecard.md`로 수렴하는 단계

팀처럼 실제 handoff해야 하면 `docs/product-squad/agent-team-delivery.md`의 `team-plan.md` 규칙을 함께 사용합니다.

## 작업 루프

### 1. Goal Frame

- 요청을 기능 목록, 정책 문장, business goal 중 어떤 형태로 받았든 business goal 문장과 goal packet으로 다시 쓴다.
- `po-role`이 target user, target moment, success metric, non-goals, constraints, existing evidence, visual bar를 먼저 적고 completeness를 분류한다.
- `needs-clarification` 또는 `not-safe-to-build`면 구현보다 질문과 문서 보강이 먼저다.
- 이 단계 산출물은 `brief.md`다.

### 2. Role Debate

- PM은 outcome과 acceptance criteria를 고정한다.
- PD는 사용자가 어떤 CTA와 어떤 흐름을 만나야 하는지 정리하고, commercial quality와 boilerplate smell을 비평한다.
- FE/BE는 어떤 얇은 slice를 먼저 구현해야 metric을 해석할 수 있는지 정한다.
- 이 단계에서는 “예쁘다/별로다”보다 “목표에 기여하나/상용 서비스처럼 신뢰를 주나/해석 가능한가”를 묻는다.

### Landing Quality Contract

landing이나 강한 user-facing surface는 아래 다섯 가지 입력이 명시되어야 합니다.

- primary conversion goal
- one-line value proposition
- trust source
- visual tone
- reference or anti-reference

`pd-role`과 `pm-role`은 구현 전 아래 질문에 답해야 합니다.

- 사용자가 3초 안에 서비스 가치 제안을 이해하는가
- hero 아래 정보가 CTA를 강화하는가
- trust 요소가 설명이 아니라 증거처럼 읽히는가
- 유저가 몰라도 되는 운영자 시선 문구가 전면에 남지 않았는가
- mobile에서 정보 밀도가 과하지 않은가
- starter boilerplate smell이 그대로 드러나지 않는가

### 3. Thin-Slice Build

- 가장 작은 measurable slice부터 구현한다.
- 중요한 작업과 핵심 경계는 `failing test -> minimal implementation -> refactor`를 따른다.
- 실험 해석을 흐리는 동시 변경을 피한다.

### 4. Browser Evidence Review

user-facing 변경이면 아래를 최소 확인합니다.

- desktop + mobile viewport
- happy path
- error / empty / pending state
- copy와 CTA hierarchy
- keyboard/focus 흐름
- contrast 또는 스타일 drift
- 필요 시 screenshot diff 또는 recorded flow
- 가능하면 `pnpm browser:qa --work <work-id>`로 evidence summary를 만들고 `docs/work-items/<work-id>/browser-qa.md`에 남깁니다.
- raw screenshots, traces, report는 local Playwright output으로 유지합니다.

## Quality Gates

### Goal Gate

- business goal과 success metric이 문서에 명시되어 있다.
- non-goals와 constraints가 있어 scope를 자를 수 있다.
- visual bar가 있어 user-facing 품질 바를 해석할 수 있다.

### Spec Gate

- `brief.md`, 필요한 role spec, `quality-scorecard.md`가 준비되어 있다.
- `brief.md`에는 target moment와 existing evidence가 적혀 있다.
- landing이라면 trust source와 reference/anti-reference가 적혀 있다.
- acceptance criteria가 public behavior 기준으로 적혀 있다.
- 필요한 경우 `pnpm repo:check --work <work-id>`와 `pnpm squad:check [work-id]`로 work item 문서가 placeholder 상태를 벗어났는지 확인한다.

### Design Gate

- `pd-role`의 commercial quality critique가 있다.
- `po-role`이 build-safe 판단을 내렸다.
- boilerplate smell, 정보 과밀, trust 근거 부재가 unresolved 상태로 남지 않았다.

### Build Gate

- 얇은 slice 기준으로 구현되었고, 필요한 경계 테스트 계획이 있다.
- `po-role` 승인 전에는 구현을 시작하지 않는다.

### Browser Gate

- user-facing surface라면 browser evidence가 있다.
- browser evidence는 가능하면 `docs/work-items/<work-id>/browser-qa.md`로 정리합니다.
- edge state와 accessibility 기본선이 검토되었다.

### Measurement Gate

- analytics/event/admin visibility가 있어 결과를 해석할 수 있다.
- 운영자가 후속 액션을 정할 수 있는 데이터가 남는다.

### Release Gate

- `quality-scorecard.md`에 ship / iterate / stop 판단과 근거가 남아 있다.
- 각 역할 산출물이 enterprise principles를 지켰는지 확인된다.
- canonical 문서, work item metadata, generated adapter drift가 static gate를 통과한다.

## Quality Scorecard

중요한 작업은 구현 종료 전에 `docs/work-items/<work-id>/quality-scorecard.md`를 채웁니다.

scorecard에는 아래가 들어갑니다.

- goal fit
- 지금 죽여야 하는 product risk
- design gate 결과
- browser QA evidence
- code quality evidence
- principle adherence
- docs/spec sync evidence
- verification evidence
- measurement / ops check
- ship / iterate / stop recommendation

browser QA evidence는 `docs/work-items/<work-id>/browser-qa.md`를 참조하거나, user-facing이 아닌 경우 explicit skip reason을 남기는 방식으로 정리합니다.

이 문서는 “보기 좋다”가 아니라 “목표를 움직일 만한가”를 판정하는 문서입니다.

## 브라우저 QA 기본선

- Chrome DevTools 또는 동급 도구로 responsive view를 확인합니다.
- 필요 시 CSS/contrast overview와 accessibility audit를 봅니다.
- 반복 가능한 핵심 흐름은 recorder 또는 E2E로 남깁니다.
- 회귀 우려가 큰 화면은 screenshot diff 또는 visual test를 검토합니다.

## Downstream 서비스 적용 규칙

- 새 서비스를 만들 때는 theme나 hero copy보다 goal packet을 먼저 채웁니다.
- 레퍼런스가 없는 랜딩은 그대로 구현하지 말고 anti-reference나 visual tone을 먼저 보강합니다.
- 서비스별 정보는 `docs/prds/*`, `docs/work-items/*`에 두고, 반복되는 운영 규칙만 `ai/`에 둡니다.
- tool-specific subagent 기능은 optional로 보고, 없어도 같은 품질 루프를 돌릴 수 있게 문서와 템플릿을 유지합니다.
- 브라우저 증거와 운영 지표가 없는 “감으로 만든 UI”는 기본값으로 허용하지 않습니다.

## V1에서 하지 않는 것

- 별도 백그라운드 멀티에이전트 플랫폼
- 툴 종속 orchestration 서버
- 자동 완결형 design critique bot

현재 보일러플레이트의 목표는 에이전트 플랫폼을 만드는 것이 아니라, 어떤 도구가 와도 같은 품질 바를 적용하는 작업 체계를 만드는 것입니다.
