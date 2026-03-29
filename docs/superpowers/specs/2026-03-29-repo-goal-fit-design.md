# Repo Goal Fit Design

## 목적

- 이 레포가 아래 네 가지 목표에 얼마나 잘 맞는지 평가 결과를 문서로 고정한다.
- 강한 축과 약한 축을 분리해, 이후 개선 작업이 "감"이 아니라 명시적 설계 기준 위에서 진행되게 만든다.
- 앞으로의 보강 방향을 구조, 검증, 역할 운영, 문서 체계 관점으로 정리한다.

평가 대상 목표는 아래 네 가지다.

1. 정책이나 비즈니스 목표로 MVP 수준의 서비스를 뽑아낸다.
2. 바이브 코딩으로 만들어도 엔터프라이즈급 코드 퀄리티가 나온다.
3. PM, PD, FE, BE 등의 에이전트가 비즈니스 목표를 위해 최고의 퍼포먼스를 내는 구조다.
4. Docs-as-Code 제품/전략, PRD, 요구사항, 운영/정책 등 레포 자체를 SSOT로 만든다.

## 평가 요약

현재 레포는 네 가지 목표 모두에서 "방향성만 좋은 초안" 수준은 이미 넘었다.
특히 문서 운영체계와 역할 기반 작업 구조는 상당히 강하다.

다만 강도는 축마다 다르다.

- 가장 강한 축: Docs-as-Code SSOT
- 그다음으로 강한 축: 역할 기반 에이전트 운영
- 그다음 축: 정책/비즈니스 목표에서 MVP shape를 고르는 구조
- 가장 보강 여지가 큰 축: 바이브 코딩 결과를 더 자동으로 엔터프라이즈급 품질에 가깝게 강제하는 구조

한 문장으로 요약하면 아래와 같다.

`이 레포는 이미 좋은 repo-native operating system에 가깝고, 앞으로는 입력 정규화의 artifact화, 품질 강제 자동화, 역할 운영 자동화가 핵심 보강 포인트다.`

## 목표별 판정

### 1. 정책/비즈니스 목표에서 MVP를 뽑아내는 구조

판정: `대체로 잘 되어 있음. 다만 마지막 연결고리 보강이 필요하다.`

현재 강한 점:

- `ai/context/ai-native.md`가 `policy / business goal / PRD / raw request -> goal packet -> thin slice`를 canonical 규칙으로 정의한다.
- `README.md`, `docs/ai-starter-prompt-pack.md`, `docs/start-your-mvp.md`가 prompt-first 온보딩을 같은 방향으로 안내한다.
- `scripts/create-mvp-starter.mjs`가 structured helper로 PRD/work item 초안 생성까지 연결한다.
- `apps/web/src/lib/product-config.ts`가 선택한 MVP shape를 실제 product-facing surface에 연결하는 typed control plane 역할을 한다.

현재 약한 점:

- goal packet이 중요한 개념이지만 first-class artifact는 아니다.
- raw policy 입력에서 어떤 MVP shape를 골랐는지, 무엇을 deferred 했는지 남기는 결정 로그가 아직 약하다.
- `prompt-first`와 `mvp:new`의 역할 구분은 문서상 이해되지만 replayable decision trail은 충분히 강하지 않다.

설계 결정:

- goal packet을 문서 artifact로 승격한다.
- MVP shape 선택 이유와 deferred flow 판단을 문서로 남긴다.
- 같은 입력을 다시 검토할 수 있는 evaluation trail을 만든다.

### 2. 바이브 코딩이어도 엔터프라이즈급 코드 퀄리티가 나오게 하는 구조

판정: `꽤 잘 되어 있다. 다만 강한 가드레일형 품질 시스템에 가깝고, 계층 위반 자동 차단은 더 보강할 수 있다.`

현재 강한 점:

- `ai/context/engineering-common.md`, `engineering-frontend.md`, `engineering-backend.md`가 폴더 책임과 금지 패턴을 구체화한다.
- 실제 구조가 `app -> modules | shared | lib -> packages` 방향을 잘 따른다.
- `pnpm verify`와 `pnpm repo:check`가 기본 품질 게이트로 작동한다.
- 핵심 surface를 `product-config.ts`로 typed centralization 한 점은 비개발자와 AI 모두에게 안전한 수정면을 제공한다.

현재 약한 점:

- 일부 server-side orchestration은 validation, persistence, analytics, cache revalidation이 같은 흐름에 함께 있다.
- browser QA와 quality scorecard는 강한 운영 규칙이지만 기본 verify에 포함된 자동 증거는 아니다.
- architecture rule 위반을 정적 수준에서 더 강하게 막는 장치는 아직 약하다.
- `product-config.ts`가 계속 커질 경우 또 다른 monolith file이 될 위험이 있다.

설계 결정:

- FE/BE 구조 규칙은 유지한다.
- server use case 계층을 더 명시적으로 분리한다.
- import/layer violation을 잡는 정적 체크를 추가한다.
- browser evidence와 quality scorecard를 반자동화 가능한 방향으로 보강한다.

### 3. 역할 기반 에이전트가 최고의 퍼포먼스를 내는 구조

판정: `상당히 잘 설계되어 있다. 특히 역할 분리를 artifact contract로 만든 점이 강하다.`

현재 강한 점:

- `docs/product-squad/*`가 역할 분리를 artifact graph, execution mode, handoff loop로 정의한다.
- `ai/skills/product-squad.md`, `pm-role.md`, `pd-role.md`, `fe-role.md`, `be-role.md`가 산출물과 체크리스트를 명확히 분리한다.
- `team-plan.md`와 `quality-scorecard.md`가 coordination source와 final review source를 분리한다.
- `ai/agents/*` canonical prompt가 platform acceleration을 지원한다.
- subagent 기능이 없어도 `single-agent sequential`로 같은 방법론을 재현할 수 있다.

현재 약한 점:

- 요청 유형별 역할 조합 선택이 아직 lead의 성실한 판단에 많이 의존한다.
- 어떤 작업은 PM+PD+FE가 적절하고 어떤 작업은 FE만 충분한지 빠르게 분기하는 matrix가 더 있으면 좋다.
- handoff packet 품질을 일정하게 유지하는 rubric은 아직 약하다.
- 역할 충돌이나 우선순위 충돌을 다루는 운영 예시가 더 있으면 좋다.

설계 결정:

- role separation 구조는 유지한다.
- task triage matrix, role-combination defaults, handoff quality rubric을 추가한다.
- execution mode 선택을 더 빠르고 일관되게 만든다.

### 4. Docs-as-Code SSOT 구조

판정: `네 가지 목표 중 가장 잘 되어 있다.`

현재 강한 점:

- `ai/context/ai-native.md`와 `docs/repo-os.md`가 canonical source와 verification index를 명확히 나눈다.
- `docs/agent-context.md`가 canonical / platform adapter / task-local 3계층을 분명히 정의한다.
- `scripts/sync-ai-context.mjs`와 `scripts/check-repo-os.mjs`가 generated adapter와 metadata gate를 실제로 강제한다.
- `pnpm repo:check`가 metadata, active work item contract, adapter drift를 함께 검사한다.
- generated adapter가 실제로 얇은 loader 역할에 머문다.

현재 약한 점:

- `docs/templates/feature-spec.md`, `docs/templates/experiment-spec.md`는 useful하지만 Repo OS metadata contract와 덜 통합돼 있다.
- goal packet은 중요한 개념인데 아직 독립 문서 계약이 없다.
- canonical 문서끼리 의미가 미묘하게 어긋나는 semantic drift는 아직 사람 리뷰 비중이 크다.
- 템플릿 레이어가 다소 많아 처음 온 사람에게는 구조가 살짝 복잡하게 보일 수 있다.

설계 결정:

- 현재 canonical -> generated 구조는 유지한다.
- goal-packet artifact를 도입한다.
- template metadata standardization과 semantic drift check를 추가한다.

## 목표 상태

이 설계의 목표 상태는 아래와 같다.

### 입력 정규화

- 정책, business goal, PRD, raw request를 받으면 먼저 goal packet artifact가 생성된다.
- 그 뒤 MVP shape 선택 이유, active flows, deferred flows가 문서에 남는다.
- 같은 입력을 나중에 다시 검토해도 왜 그런 판단을 했는지 replay 가능하다.

### 품질 강제

- route/page entry는 계속 얇게 유지된다.
- orchestration, domain rule, persistence, adapter가 더 분명히 분리된다.
- architecture violation은 lint 또는 static check에서 가능한 한 빠르게 실패한다.
- user-facing 변경은 browser evidence 없이는 truly done으로 보지 않는 흐름이 반자동화된다.

### 역할 운영

- 요청을 받으면 어떤 execution mode와 역할 조합을 선택할지 빠르게 결정할 수 있다.
- `team-plan.md`는 단순 템플릿이 아니라 실제 coordination artifact로 더 일관되게 채워진다.
- handoff packet은 다음 역할이 바로 이어받을 수 있는 수준의 품질을 가진다.

### SSOT

- canonical, task-local, generated 문서의 경계는 계속 분명하다.
- generated adapter는 계속 파생 산출물에 머문다.
- 중요한 문서와 템플릿은 metadata contract와 scripted gate 안에 더 많이 편입된다.

## 제안 변경

### 1. Goal Packet Artifact 도입

새 artifact:

- `docs/work-items/<work-id>/goal-packet.md`

최소 필드:

- business goal
- target user
- target moment
- success metric
- non-goals
- constraints
- existing evidence
- selected MVP shape
- active flows
- deferred flows
- selection rationale

이 문서는 아래 역할을 가진다.

- `brief.md`보다 먼저 입력 정규화 결과를 고정한다.
- 정책/비즈니스 목표 입력을 feature/work item 문서로 연결하는 브리지 역할을 한다.
- MVP shape 선택 근거를 재검토 가능한 상태로 남긴다.

### 2. MVP Selection Rationale 계약 추가

추천 위치:

- `goal-packet.md` 안 섹션으로 포함
- 또는 `brief.md` 안 `MVP Fit Rationale` 섹션 추가

최소 내용:

- 왜 이 shape를 골랐는가
- 어떤 active flow가 success metric에 직접 기여하는가
- 왜 어떤 flow는 deferred 되었는가
- 어떤 evidence가 있으면 iterate 또는 pivot 판단을 내릴 수 있는가

### 3. Replayable Evaluation 추가

추천 위치:

- `docs/prompt-evaluations/*` 또는 work item 하위 문서

목적:

- 같은 유형의 입력을 주었을 때 어떤 shape를 선택했는지 비교 가능하게 한다.
- starter prompt와 recipe catalog의 품질을 회고할 수 있게 한다.
- prompt-first onboarding이 실제로 goal-driven한지 검증한다.

### 4. Server Use Case 분리 강화

현재 일부 feature model 파일에 함께 있는 아래 책임을 더 분리한다.

- domain input creation
- repository 호출
- analytics emit
- error logging
- cache revalidation

추천 방향:

- action entry
- use case
- repository / adapter
- revalidation helper

이 분리는 전체 백엔드 프레임워크 확장이 아니라, 현재 monorepo 구조 안에서 orchestration boundary를 더 선명하게 만드는 수준으로 제한한다.

### 5. Architecture Violation Check 추가

추천 항목:

- `app/`에서 금지된 direct import 패턴 체크
- `packages/* -> apps/web/*` 역참조 금지 체크
- `modules/*` 간 direct import 금지 체크
- giant action file, giant page file를 탐지하는 휴리스틱 체크

목표:

- 좋은 구조를 "권장"에서 끝내지 않고, 적어도 눈에 띄는 위반은 자동으로 잡는다.

### 6. Browser Evidence 반자동화

추천 방향:

- `quality-scorecard.md`의 Browser QA Evidence 섹션 입력 포맷을 더 명확히 한다.
- `pnpm verify:full` 또는 별도 helper가 screenshot, route checklist, accessibility check 여부를 남기게 한다.
- non-user-facing 작업은 explicit skip reason을 더 표준화한다.

목표:

- browser QA가 사람의 기억이나 친절함에만 의존하지 않게 만든다.

### 7. Task Triage Matrix 추가

추천 위치:

- `docs/product-squad/operating-model.md`
- 또는 별도 `docs/product-squad/task-triage.md`

필요 내용:

- 요청 유형별 기본 execution mode
- 역할 조합 기본값
- light work / gated work / goal-driven work 분기표
- 어떤 경우 `PM + PD + FE + BE`가 필요하고 어떤 경우 `FE only` 또는 `BE only`가 충분한지

### 8. Handoff Quality Rubric 추가

추천 위치:

- `docs/product-squad/agent-team-delivery.md`
- `docs/product-squad/templates/team-plan.md`

rubric 기준:

- next owner가 추가 질문 없이 바로 이어받을 수 있는가
- unresolved questions가 명시되어 있는가
- changed files/docs가 빠짐없이 적혀 있는가
- success check가 verification evidence를 포함하는가

### 9. Template Metadata Standardization

우선 대상:

- `docs/templates/feature-spec.md`
- `docs/templates/experiment-spec.md`

추천 내용:

- frontmatter metadata contract 통일
- owner / doc_type / source_of_truth / freshness / verification 추가
- scripted gate 대상 여부 정리

### 10. Cross-Doc Semantic Drift Check

가능한 범위의 정적 체크를 추가한다.

예시:

- load order 문서 간 주요 순서 불일치 탐지
- canonical source 경로 불일치 탐지
- work item 템플릿 필수 섹션 이름 불일치 탐지
- generated adapter가 참조하는 canonical 파일 존재 여부 탐지

이 단계는 완전한 semantic understanding이 아니라, 자주 틀어지는 규칙을 먼저 잡는 pragmatic check로 시작한다.

## 우선순위

### Phase 1. 높은 ROI, 낮은 구조 충격

- goal-packet artifact 추가
- MVP selection rationale 추가
- task triage matrix 추가
- handoff quality rubric 추가
- template metadata standardization

### Phase 2. 품질 강제 보강

- architecture violation check 추가
- browser evidence 반자동화
- `product-config` 분할 전략 검토

### Phase 3. 구조 심화

- server use case 분리 강화
- semantic drift check 확장
- replayable evaluation 체계 정식화

## 비목표

- 별도 멀티에이전트 orchestration 서비스를 만들지 않는다.
- agent mailbox, background runner, runtime control plane을 새로 구현하지 않는다.
- heavy enterprise platform, CMS, 복잡한 auth, background job를 이 개선의 전제로 삼지 않는다.
- generated adapter를 canonical source로 승격하지 않는다.

## 수용 기준

이 설계가 성공하려면 아래 상태가 가능해야 한다.

- 정책이나 business goal만 받아도 goal packet artifact를 남기고 MVP shape를 선택할 수 있다.
- 중요한 user-facing 작업은 quality scorecard와 browser evidence까지 남는 흐름이 더 일관되게 작동한다.
- 역할 기반 문서 생성 후 어떤 역할 조합과 execution mode를 고를지 더 빠르게 분기할 수 있다.
- template와 core docs가 Repo OS metadata contract 안에 더 일관되게 들어온다.
- `pnpm repo:check`가 지금보다 더 많은 drift를 조기에 잡는다.

## 권장 첫 구현 슬라이스

가장 먼저 추천하는 thin slice는 아래다.

1. `goal-packet.md` 템플릿 추가
2. `work:new`, `feature:new`, `squad:check`, `repo:check`에 goal packet 계약 반영
3. `docs/product-squad/operating-model.md`에 triage matrix 추가
4. `docs/product-squad/agent-team-delivery.md`에 handoff rubric 추가

이 슬라이스는 runtime product code를 거의 건드리지 않으면서도 네 가지 목표를 동시에 보강한다.

## 최종 권고

지금 레포는 이미 "잘 세팅된 편"이라고 말할 수 있다.
다만 현재의 강점은 문서 운영체계와 역할 계약 쪽에 더 많이 모여 있고, 품질 강제 자동화는 그보다 한 단계 뒤에 있다.

따라서 앞으로의 핵심 전략은 새 기능을 늘리는 것이 아니라 아래 순서를 지키는 것이다.

1. 입력 정규화 결과를 artifact로 만든다.
2. 역할 운영 분기를 더 자동화한다.
3. 구조 위반과 browser 품질 누락을 더 빨리 실패시킨다.

이 세 가지를 보강하면, 이 레포는 단순한 PMF starter를 넘어 "정책/목표 입력을 재현 가능한 MVP delivery system으로 바꾸는 repo-native OS"에 더 가까워진다.
