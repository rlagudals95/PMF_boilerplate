---
owner: "platform"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# AI-Native Operating Model

이 문서는 이 저장소가 어떤 입력을 어떤 작업 방식으로 MVP thin slice로 바꾸는지, 그리고 그 결과를 어떤 품질 기준으로 판정하는지 정의하는 canonical context입니다.

`ai/context/project.md`가 구조, 명령어, 폴더 책임을 설명한다면, 이 문서는 운영 약속, 품질 바, 역할 모델, Docs-as-Code 원칙의 source of truth 역할을 합니다.
이 저장소는 agent runtime이 아니라 repo-native operating system으로 동작하며, 그 문서 계층과 gate는 `docs/repo-os.md`에 요약됩니다.

## Repo Promise

이 저장소는 아래 네 가지 약속을 중심으로 동작합니다.

- 정책, business goal, PRD, raw request처럼 입력 형태가 달라도 goal packet과 MVP thin slice로 정규화할 수 있어야 합니다.
- 바이브 코딩처럼 빠른 구현 흐름에서도 repo 안 문서와 검증으로 엔터프라이즈급 품질 기준을 판정할 수 있어야 합니다.
- 중요한 작업은 `product-squad`와 `po-role`, PM/PD/FE/BE, `evaluator-role` 관점으로 검토해 business goal을 더 잘 달성해야 합니다.
- 제품, 전략, PRD, 운영 규칙의 source of truth는 repo 안 Markdown이어야 하며, adapter와 외부 툴은 파생 surface여야 합니다.

## Input Normalization

이 저장소는 입력의 표현보다 해석 규칙을 더 중요하게 봅니다.

- `policy`
  - 제약, 운영 원칙, 법무/브랜드 기준, 금지 범위를 먼저 고정합니다.
- `business goal`
  - 달성해야 하는 사업 신호와 success metric을 먼저 고정합니다.
- `PRD`
  - 문제 정의와 범위를 task-local spec으로 정규화한 뒤 feature slice로 자릅니다.
- `raw request`
  - goal packet이 비어 있으면 brief나 PRD 문서로 먼저 보강합니다.

정규화 결과는 가능하면 아래 goal packet으로 수렴해야 합니다.

- business goal
- target user
- target moment
- success metric
- non-goals
- constraints
- existing evidence
- visual bar

정책 입력은 goal packet 밖의 별도 체계로 두지 않고, 주로 `constraints`, `non-goals`, `required quality bar`로 변환합니다.

landing이나 다른 강한 user-facing 작업이면 `visual bar`에는 아래가 포함되어야 합니다.

- 상용 서비스처럼 보여야 하는지
- 어떤 trust source를 전면에 둘지
- reference 또는 anti-reference가 있는지
- boilerplate smell을 어떻게 피할지

raw request에서 시작할 때 `po-role`은 goal packet을 `ready`, `needs-clarification`, `not-safe-to-build`로 먼저 분류합니다. quality bar를 판단할 근거가 부족하면 구현보다 질문과 문서 보강이 먼저입니다.

정규화가 끝나면 아래 순서로 얇은 slice를 고릅니다.

1. 기존 block으로 해결 가능한지 확인합니다.
2. 가장 작은 measurable MVP shape 또는 work item slice를 고릅니다.
3. 먼저 `product-config`, work item, role spec 같은 문서/표면을 맞춥니다.
4. existing block으로 안 되는 요구만 deeper code로 내립니다.

## Quality Bar

이 저장소에서 말하는 “엔터프라이즈급 품질”은 복잡한 인프라가 아니라, 빠른 구현에서도 신뢰 가능한 작업 기준이 있는 상태를 뜻합니다.

최소 기준은 아래와 같습니다.

- 경계가 명확하다.
- spec과 source of truth 문서가 먼저 또는 함께 갱신된다.
- risky boundary는 가능하면 failing test로 먼저 고정하고, 생략 시 skip reason이 남는다.
- `pnpm repo:check`, `pnpm squad:check`, `pnpm verify`, 필요 시 `pnpm verify:full` 같은 repo-local proof로 종료한다.
- user-facing 변경은 browser evidence와 quality scorecard 없이 완료로 보지 않는다.
- landing 같은 user-facing surface는 browser evidence 전에 commercial quality critique를 통과해야 한다.
- prompt, workflow, role topology 변경은 replayable evaluation evidence 또는 explicit skip reason 없이 완료로 보지 않는다.

완료 판정에 필요한 최소 증거는 아래입니다.

- 최신 `brief.md` 또는 해당 spec
- 필요한 role spec과 `quality-scorecard.md`
- boundary test evidence 또는 skip reason
- docs/spec sync evidence
- fresh verification output

## Enterprise Principles

모든 역할은 아래 원칙을 기본값으로 따릅니다.

- clean code
  - 의도가 드러나는 이름, 작은 단위, 높은 응집도, 낮은 결합도를 우선합니다.
- single responsibility
  - 한 문서, 한 함수, 한 컴포넌트, 한 use case가 여러 종류의 결정을 동시에 떠안지 않게 합니다.
- explicit boundaries
  - validation, orchestration, persistence, UI state, copy decision의 경계를 분리합니다.
- encapsulation
  - 규칙과 불변식은 그것을 소유하는 문서나 모듈 가까이에 둡니다.
- composition over inheritance
  - 공통화는 작은 조합과 명시적 계약을 우선하고, 추상 상속 계층은 마지막 선택지로 둡니다.
- object-oriented design where it adds clarity
  - 상태 전이, 도메인 규칙, 책임 소유가 더 명확해질 때만 OOP식 모델링을 사용하고, 의식적인 class 남용은 피합니다.
- testability and observability
  - 중요한 경계는 먼저 검증 가능해야 하고, 운영자가 후속 판단을 내릴 evidence가 남아야 합니다.
- no speculative complexity
  - “언젠가 필요할 수도 있음”을 이유로 추상화, 계층, 규칙을 추가하지 않습니다.

## Role Operating Model

중요한 작업의 기본 진입점은 `product-squad`입니다.

- `po`
  - goal packet completeness, clarification loop, build-start approval을 담당합니다.
- `pm`
  - goal, success metric, acceptance criteria를 고정합니다.
- `pd`
  - CTA, IA, trust, edge state, browser QA 포인트와 commercial landing quality를 검토합니다.
- `fe`
  - route/module/component 경계와 UI verify 계획을 정합니다.
- `be`
  - validation, persistence, analytics, failure mode, adapter 계약을 정합니다.
- `evaluator`
  - goal fit, evidence completeness, release recommendation, replayable evaluation 필요 여부를 판정합니다.

이 역할은 반드시 별도 agent를 띄우라는 뜻이 아니라, business goal을 기준으로 관점을 분리해 누락을 줄이기 위한 장치입니다.
기본 토폴로지는 `po supervisor -> bounded specialists -> evaluator gate`입니다.
즉 `po`가 user conversation과 synthesis를 소유하고, specialist는 artifact를 반환하며, evaluator가 독립적으로 마무리 판정을 합니다.

역할별 enterprise-grade 철칙은 아래를 추가로 따릅니다.

- `pm`
  - 문제 정의와 acceptance criteria를 decision-complete하게 적습니다.
  - 용어와 범위를 일관되게 유지하고, 모호한 “좋아 보여야 한다” 식 요구를 남기지 않습니다.
- `pd`
  - happy path, error, empty, pending state를 모두 다룹니다.
  - 정보 구조, trust, accessibility, CTA hierarchy를 일관된 시스템으로 봅니다.
  - boilerplate smell, 정보 과밀, first impression 실패를 명시적으로 반려할 수 있습니다.
- `fe`
  - route entry는 얇게 두고, UI/상태/행동의 책임을 모듈 경계로 분리합니다.
  - 큰 컴포넌트, 암묵적 state coupling, 재사용을 해치는 direct import를 경계합니다.
- `be`
  - boundary validation, use case, repository, adapter 책임을 분리합니다.
  - domain invariant, failure mode, measurement integrity를 코드 구조로 보호합니다.
- `evaluator`
  - 구현 편의보다 goal fit, release safety, evidence completeness를 우선합니다.
  - `ship | iterate | stop` 판단은 독립적으로 남기고 weak proof를 추측으로 보완하지 않습니다.
- `quality review`
  - 결과가 돌아간다는 인상보다 evidence와 principle adherence를 기준으로 판정합니다.

기본 실행 모드는 `single-agent sequential`입니다.
subagent나 agent-team 기능은 optional acceleration이며, canonical source를 대체하지 않습니다.

## Docs-As-Code SSOT

이 저장소의 source of truth 계층은 아래와 같습니다.

- canonical context
  - `ai/context/*`, `ai/skills/*`
- task-local docs
  - `docs/prds/*`, `docs/work-items/*`, `docs/templates/*`, 모듈 옆 README
- generated adapters
  - `.claude/*`, `.codex/*`, `.gemini/*`, `.cursor/*`, `.github/*`

운영 원칙은 아래를 지킵니다.

- 반복 규칙은 canonical context에 둡니다.
- 현재 작업 결정은 task-local 문서에 둡니다.
- generated adapter는 본문 규칙을 복제하지 않고 canonical source를 가리키는 loader 역할만 맡습니다.
- 핵심 문서와 task-local artifact는 metadata와 static gate로 freshness를 추적합니다.
- 외부 도구 메모나 vendor-specific surface는 collaboration channel일 뿐 source of truth가 아닙니다.

## Non-Goals

이 문서가 기본값으로 요구하지 않는 것은 아래와 같습니다.

- 별도 멀티에이전트 orchestration 서비스
- agent runtime이나 mailbox 자체 구현
- heavy enterprise platform, 복잡한 auth, CMS, background job 같은 범위 확장
- 특정 벤더 전용 instruction 파일을 canonical source처럼 운영하는 방식

이 저장소의 목표는 AI tooling 위에 또 다른 플랫폼을 만드는 것이 아니라, 어떤 tool에서도 재현 가능한 운영 체계를 repo 안에 고정하는 것입니다.
