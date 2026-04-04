---
owner: "platform"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Harness Engineering V1 Design

## Summary

이 작업의 목표는 이 저장소의 기존 Repo OS를 `hybrid harness` 모델로 강화해, 특히 바이브 코딩 상황에서도 위험한 변경이 문서, 검증, 증거 없이 바로 ship되지 못하게 만드는 것이다.

핵심 방향은 새 플랫폼이나 별도 orchestration server를 만드는 것이 아니라, 이미 있는 `goal-packet`, `brief`, `team-plan`, `quality-scorecard`, `repo:check`, `squad:check`, `browser:qa`를 하나의 강제력 있는 gate stack으로 묶는 것이다.

유지:

- repo-native Docs-as-Code 운영 모델
- `product-squad` 중심 artifact graph
- `repo:check`, `squad:check`, `verify`, `browser:qa` 기반 검증 루프
- safe surface 우선 원칙

변경:

- 변경 성격 기반 `light | soft-gated | hard-gated` 분류 도입
- work item template에 classification metadata 추가
- `squad:check`와 `repo:check`가 classification별 artifact/evidence requirement를 검사
- ship 판단을 merge가 아니라 `evidence closure` 기준으로 더 명확히 고정

## Goal Packet

- business goal:
  - 바이브 코딩 속도를 유지하면서도 위험한 변경은 deterministic gate를 통과해야만 완료로 볼 수 있게 만든다.
- target user:
  - 이 저장소를 사용하는 개발자, AI coding agent, 그리고 product-facing 비개발 협업자
- target moment:
  - 요청을 구현으로 내리기 직전, 구현 중 scope가 커질 때, ship 직전 evidence를 닫는 순간
- success metric:
  - hard-gated 변경은 classification, required artifacts, required evidence 없이 `squad:check` 또는 `repo:check`를 통과하지 못한다.
- non-goals:
  - 별도 agent runtime이나 mailbox server를 만들지 않는다.
  - 모든 light work를 hard gate로 승격하지 않는다.
  - path-only 규칙으로 위험도를 판정하지 않는다.
  - hook만으로 품질 강제를 해결하지 않는다.
- constraints:
  - 기존 `product-squad`와 Repo OS 용어를 유지해야 한다.
  - 문서 계약은 repo 안 Markdown이어야 한다.
  - gate는 설명 가능해야 하고, 실패 메시지는 바로 수정 가능해야 한다.
  - safe surface와 thin-slice 원칙을 해치지 않아야 한다.
- existing evidence:
  - 저장소는 이미 `goal-packet -> brief -> team-plan -> quality-scorecard` artifact graph를 가진다.
  - `scripts/create-work-item.mjs`, `scripts/check-squad-work-item.mjs`, `scripts/check-repo-os.mjs`, `scripts/browser-qa.mjs`가 존재한다.
  - `product-config` safe surface와 `browser-qa`, `quality-scorecard` 기반 release loop가 이미 운영 중이다.
- visual bar:
  - 하네스는 “문서를 더 쓰게 하는 체계”처럼 보이기보다, 개발 흐름을 부드럽게 유도하면서도 위험한 변경을 확실히 멈추는 구조로 느껴져야 한다.

## Chosen Approach

채택한 접근은 `gate-stack hybrid harness`다.

즉, 강제의 본체는 아래 네 단계로 둔다.

1. `change classifier`
2. `artifact matrix`
3. `deterministic gates`
4. `release closure`

이 접근을 고른 이유는 아래와 같다.

1. `docs-first`만으로는 바이브 코딩 중 쉽게 우회된다.
2. `hook-first`만으로는 왜 막혔는지 설명력과 재현성이 약하다.
3. 현재 저장소는 이미 scaffold와 verify entrypoint가 강하므로, 기존 Repo OS를 강화하는 편이 새 도구를 만드는 것보다 자연스럽다.
4. hard gate 기준을 파일 경로가 아니라 `변경 성격`으로 두어야 실제 위험을 더 정확히 잡을 수 있다.

## Design Decisions

### 1. Delivery Model은 `hybrid harness`로 고정한다

모든 작업은 아래 셋 중 하나로 분류한다.

- `light`
- `soft-gated`
- `hard-gated`

기본 의미는 아래와 같다.

- `light`
  - 오탈자, 비동작 스타일 수정, contract 변화 없는 소규모 리팩터링
- `soft-gated`
  - 구현 영향은 있으나 full artifact set까지는 필요 없는 변경
- `hard-gated`
  - 사용자 행동, 데이터 계약, 운영 해석, prompt/workflow, release 기준을 바꾸는 변경

이 분류는 “중요해 보인다” 같은 감각적 표현이 아니라 scripted gate가 읽을 수 있는 값으로 문서에 남긴다.

### 2. Hard Gate는 path가 아니라 `change type`으로 판정한다

첫 버전의 대표 `change_types`는 아래처럼 둔다.

- `user-facing-behavior`
- `validation-schema`
- `repository-contract`
- `cross-repo-contract`
- `prompt-workflow`
- `release-ops`
- `new-capability`

판정 기준은 아래 네 질문으로 요약한다.

- 사용자 행동 해석이 바뀌는가
- 데이터 계약이 바뀌는가
- 운영자가 믿는 신호가 바뀌는가
- AI가 다음 작업을 수행하는 방식이 바뀌는가

하나라도 `yes`면 기본값은 `hard-gated`다.

### 3. `artifact matrix`는 risk-based로 강제한다

모든 hard gate가 같은 문서 세트를 요구하지는 않는다.
대신 `change_types`에 맞는 artifact와 evidence만 요구한다.

예시:

- `soft-gated`
  - 최소 `brief`와 verify evidence
- `hard-gated + user-facing-behavior`
  - `goal-packet`, `brief`, `ux-review`, `frontend-spec`, `team-plan`, `quality-scorecard`, `browser-qa` 또는 explicit skip reason
- `hard-gated + repository-contract`
  - `goal-packet`, `brief`, `backend-spec`, `team-plan`, `quality-scorecard`, contract evidence
- `hard-gated + prompt-workflow`
  - `goal-packet`, `brief`, `team-plan`, `quality-scorecard`, replayable evaluation evidence 또는 explicit skip reason
- `hard-gated + release-ops`
  - `goal-packet`, `brief`, `backend-spec`, `quality-scorecard`, readiness/publish/ops evidence

원칙은 “중요한 작업이니까 문서를 다 써라”가 아니라 “이 위험을 닫는 데 필요한 artifact만 강제한다”이다.

### 4. Template frontmatter를 machine-readable contract로 승격한다

`docs/product-squad/templates/*` frontmatter에 아래 필드를 추가한다.

- `work_class`
  - `light | soft-gated | hard-gated`
- `change_types`
  - string array
- `evidence_requirements`
  - string array
- `release_surface`
  - `none | user-facing | ops-facing | cross-repo`
- `primary_gate`
  - `brief | scorecard | browser-qa | contract-test`

이 값은 단순 설명용이 아니라 `create-work-item`, `feature:new`, `squad:check`, `repo:check`가 읽는 계약이다.

### 5. `squad:check`가 하네스 본체가 된다

`scripts/check-squad-work-item.mjs`는 현재 “필수 파일 존재 여부와 placeholder 탈출 여부”를 주로 검사한다.
하네스 v1에서는 여기에 classification-aware 검사를 추가한다.

대표 규칙:

- `work_class: hard-gated`면 `goal-packet`, `team-plan`, `quality-scorecard`가 `skipped`일 수 없다.
- `change_types`에 `user-facing-behavior`가 있으면 `ux-review`, `frontend-spec`, `browser-qa` reference 또는 explicit skip reason이 필요하다.
- `change_types`에 `validation-schema` 또는 `repository-contract`가 있으면 `backend-spec`과 contract evidence가 필요하다.
- `change_types`에 `prompt-workflow`가 있으면 replayable evaluation evidence 또는 explicit skip reason이 필요하다.
- `change_types`에 `release-ops`가 있으면 scorecard의 `Measurement And Ops Checks`와 publish/readiness evidence가 비어 있으면 안 된다.

실패 메시지는 문서 존재 여부보다 수정 행동이 바로 드러나게 설계한다.

예:

- `hard-gated release-ops change requires Measurement And Ops Checks evidence`
- `user-facing-behavior change requires browser-qa reference or explicit skip reason`

### 6. `repo:check`는 상위 consistency gate만 맡는다

`scripts/check-repo-os.mjs`는 아래 상위 규칙을 본다.

- active work item의 classification metadata validity
- template contract와 generated work item contract consistency
- hard-gated active work item이 여전히 `draft`로만 남아 있지 않은지
- `user-facing`인데 browser evidence reference가 빠지지 않았는지
- `prompt-workflow`인데 `ai:sync` 또는 replayable evaluation evidence가 빠지지 않았는지

즉 `squad:check`는 work item completeness, `repo:check`는 Repo OS contract consistency를 본다.

### 7. Browser QA와 Ops evidence를 같은 scorecard closure 안에서 다룬다

`release_surface`는 아래 값을 갖는다.

- `none`
- `user-facing`
- `ops-facing`
- `cross-repo`

해석은 아래처럼 둔다.

- `user-facing`
  - browser evidence 기본 요구
- `ops-facing`
  - browser QA는 optional이지만 ops evidence는 필수
- `cross-repo`
  - browser QA 여부와 별개로 contract/publish evidence가 필수

핵심은 “최신”보다 “검증된 published”가 우선이라는 운영 원칙을 quality scorecard에 닫히는 evidence로 연결하는 것이다.

### 8. Hooks는 보조 수단으로만 둔다

prompt-submit hook이나 pre-commit hook은 도입할 수 있다.
하지만 이들은 차단 본체가 아니라 안내 레이어여야 한다.

이유:

- repo 밖 환경에서도 재현 가능해야 한다.
- CI와 local scripted gate가 source of truth여야 한다.
- 실패 원인은 항상 문서/스크립트 계약에서 읽혀야 한다.

## Artifact Contract Changes

### `goal-packet.md`

추가/강화할 내용:

- `work_class`
- `change_types`
- `release_surface`
- 선택한 delivery shape와 active/deferred scope가 classification과 모순되지 않는지 설명

### `brief.md`

추가/강화할 내용:

- 현재 요청의 위험 성격 요약
- 왜 `soft-gated` 또는 `hard-gated`인지 한 문장으로 설명
- `Enterprise Decision Guardrails` 안에 gate-sensitive constraints 명시

### `team-plan.md`

추가/강화할 내용:

- classifier 결과를 shared context pack에 명시
- 어떤 evidence를 누가 닫을지 ownership 기록
- `release-ops`, `prompt-workflow`, `cross-repo`용 task owner를 분명히 둠

### `quality-scorecard.md`

추가/강화할 내용:

- `required evidence` 체크리스트
- `release_surface`별 closure 조건
- explicit skip reason formatting 강화
- `Measurement And Ops Checks`를 release-ops/classifier와 연결

## Enforcement Architecture

### Classifier

분류는 사람이 결정하지만, 저장은 machine-readable해야 한다.
첫 버전에서는 work item frontmatter에 직접 기록한다.

후속 버전에서 고려할 수 있는 것:

- `pnpm work:new --class hard-gated --type user-facing-behavior`
- `pnpm feature:new --type prompt-workflow`

단, v1의 본질은 CLI UX보다 contract 일관성이다.

### Artifact Matrix

classification은 아래 둘을 결정한다.

1. 어떤 문서가 `required`인가
2. 어떤 evidence가 `required`인가

이 매트릭스는 `squad:check`가 읽는 단일 규칙 표로 구현하는 것이 좋다.

### Deterministic Gates

엔트리포인트별 역할은 아래처럼 분리한다.

- `pnpm work:new`
  - classification metadata 기본 scaffold
- `pnpm feature:new`
  - PRD 문맥 기반 scaffold
- `pnpm squad:check`
  - classification별 artifact/evidence completeness 검사
- `pnpm repo:check`
  - classification consistency + canonical/template drift 검사
- `pnpm verify`
  - 타입/린트/테스트 기본 증거
- `pnpm browser:qa --work <work-id>`
  - user-facing evidence 생성

### Release Closure

완료 기준은 아래다.

- required artifacts present
- required evidence present
- docs/spec sync complete
- evaluator recommendation present
- explicit skip reason documented when evidence is intentionally omitted

즉 merge 가능 여부보다 evidence closure가 먼저다.

## Recommended Implementation Plan

### Phase 1. Contract First

변경 대상:

- `docs/product-squad/templates/goal-packet.md`
- `docs/product-squad/templates/brief.md`
- `docs/product-squad/templates/team-plan.md`
- `docs/product-squad/templates/quality-scorecard.md`
- `docs/work-items/README.md`
- `docs/product-squad/operating-model.md`
- `docs/repo-os.md`
- `ai/context/ai-native.md`
- `docs/ai-starter-prompt-pack.md`

목표:

- `hybrid harness` 용어와 classification 계약을 canonical 문서에 고정
- template frontmatter를 classification-aware contract로 확장

### Phase 2. Scaffold Alignment

변경 대상:

- `scripts/create-work-item.mjs`
- `scripts/create-feature-from-prd.mjs`

목표:

- 새 work item이 classification metadata를 기본값과 함께 생성
- later prompt/tooling integration을 위한 CLI surface 확보

### Phase 3. Gate Activation

변경 대상:

- `scripts/check-squad-work-item.mjs`
- `scripts/check-repo-os.mjs`

목표:

- classifier별 artifact/evidence matrix를 scripted gate로 강제
- failure message를 행동 지향적으로 개선

### Phase 4. Evidence Closure Hardening

변경 대상:

- `scripts/browser-qa.mjs`
- `docs/product-squad/templates/browser-qa.md`
- 필요 시 `quality-scorecard` sections

목표:

- `user-facing`, `ops-facing`, `cross-repo` surface에 맞는 evidence closure를 더 분명히 만듦

### Phase 5. Optional UX Layers

후순위:

- prompt-submit warning hook
- pre-commit hint
- CI summary helper

원칙:

- 이 단계는 안내 품질을 높이기 위한 것이지, 본체를 대체하지 않는다.

## Example Classification Defaults

### `light`

예:

- 오탈자 수정
- 시맨틱 변화 없는 스타일 조정
- contract 변화 없는 내부 정리

기본 요구:

- 필요한 경우 brief 또는 skip note
- `pnpm verify`

### `soft-gated`

예:

- 제한된 범위의 feature copy 정리
- 구조 변화 없는 테스트/문서 보강
- 영향 범위가 좁은 개선 작업

기본 요구:

- `brief`
- relevant spec 또는 skip note
- `pnpm verify`

### `hard-gated`

예:

- 랜딩 CTA 흐름 변경
- schema/validation/repository contract 변경
- prompt/workflow 변경
- readiness/publish 판단 변경
- scraper/app 간 cross-repo data contract 변경

기본 요구:

- `goal-packet`
- `brief`
- role specs as needed
- `team-plan`
- `quality-scorecard`
- required evidence for declared `change_types`

## Risks And Mitigations

### Risk 1. 분류 기준이 애매하면 결국 사람이 감으로 우회할 수 있다

대응:

- `change_types` vocabulary를 작게 시작한다.
- path보다 risk question을 canonical 문서에 고정한다.
- failure message가 왜 hard gate인지 드러나게 만든다.

### Risk 2. 문서 burden이 커져 바이브 코딩 속도가 너무 느려질 수 있다

대응:

- `light`, `soft-gated`, `hard-gated`를 분리한다.
- 모든 hard gate가 full artifact set를 요구하지 않게 한다.
- safe surface work는 가능한 한 `soft-gated`로 유지한다.

### Risk 3. hook에 너무 의존하면 환경마다 재현성이 깨진다

대응:

- source of truth는 `repo:check`, `squad:check`, `verify`, `browser:qa` 같은 scripted gate로 둔다.
- hook은 hint layer로만 둔다.

### Risk 4. 운영 신호와 UI 신호가 서로 다른 quality bar로 평가될 수 있다

대응:

- `release_surface`로 browser evidence와 ops evidence를 같은 scorecard closure에 연결한다.
- `release-ops`와 `cross-repo-contract`에는 publish/readiness evidence를 필수로 둔다.

## Acceptance Criteria

- canonical 문서가 이 저장소의 기본 delivery model을 `hybrid harness`로 설명한다.
- work item template가 classification metadata를 포함한다.
- `squad:check`가 classification별 artifact/evidence requirement를 검사할 수 있다.
- `repo:check`가 classification consistency와 canonical/template drift를 검사할 수 있다.
- failure message가 “무엇이 빠졌는지”뿐 아니라 “어떤 위험을 닫기 위한 증거가 빠졌는지”를 설명한다.
- user-facing, release-ops, prompt-workflow, repository-contract 변경이 서로 다른 closure 조건을 가진다.

## Verification Plan

이 문서 자체는 설계 문서이므로 현재 단계의 검증은 아래로 충분하다.

- 문서 내용이 기존 `product-squad`, `repo-os`, `goal-driven-delivery`와 모순되지 않는지 확인
- 기존 스크립트 책임과 충돌하지 않는지 확인
- 구현 단계에서는 `repo:check`, `squad:check`, `verify`, 필요 시 `browser:qa`를 실행

## Out Of Scope

- 별도 하네스 서버 구축
- agent mailbox 또는 task-claiming engine
- path-only hard gate
- 모든 변경을 browser QA 대상으로 확대
- v1에서 완전 자동 risk inference 구현
