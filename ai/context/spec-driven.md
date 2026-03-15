# Spec-Driven Delivery

이 문서는 이 저장소에서 spec-driven 개발을 어떻게 운영하는지 정의하는 canonical context입니다.

## 목적

- 구현 전에 필요한 결정을 문서로 고정한다.
- 중요한 작업에서 바이브 코딩의 품질 편차를 줄인다.
- repo 안 Markdown 문서를 source of truth로 유지한다.

## 문서 계층

### 1. Canonical doc

저장소 전반 규칙과 반복되는 운영 기준을 담습니다.

- 위치: `ai/context/*`, `ai/skills/*`, `docs/architecture.md`
- 예시: 구조 규칙, 역할 분리, 문서 sync 정책

### 2. Task-local doc

특정 작업, 특정 기능, 특정 실험에만 필요한 결정을 담습니다.

- 위치: `docs/work-items/*`, `docs/templates/*`, 특정 모듈 옆 `README.md`
- 예시: 기능 spec, 실험 spec, role spec, work brief
- PRD가 입력이면 `docs/prds/*`에 먼저 정규화한 뒤 task-local 문서로 사용합니다.

### 3. Ephemeral note

임시 메모, 외부 노트, 회의 기록처럼 가공 전 상태의 문서입니다.

- 예시: Notion 메모, 회의 중 적은 초안, 채팅 요약
- canonical source로 취급하지 않습니다.
- 구현 전에 repo 안 Markdown spec으로 정규화해야 합니다.

## Source Of Truth 원칙

- 구현 기준 문서는 repo 안 Markdown입니다.
- Notion 같은 외부 도구는 협업 surface 또는 입력 채널로만 사용합니다.
- 외부 문서가 있더라도 최종 결정은 repo spec에 반영되어야 합니다.
- repo 안 spec이 없으면 구현보다 문서 정리가 먼저입니다.
- PRD 기반 작업이면 `docs/prds/<slug>.md`를 먼저 만들고, 그 문서를 기준으로 work item을 생성합니다.

## 작업 전 읽기 규칙

기본 순서:

1. `ai/context/project.md`
2. `ai/context/engineering.md`
3. `ai/context/engineering-common.md`
4. `ai/context/spec-driven.md`
5. 작업에 맞는 `engineering-frontend.md`, `engineering-backend.md`
6. `ai/context/doc-sync.md`
7. `ai/skills/_index.md`
8. 관련 스킬 문서
9. 관련 `docs/*`와 영향 파일

추가 규칙:

- 중요한 작업이면 `docs/product-squad/operating-model.md`를 읽습니다.
- 활성 work item이 있으면 `docs/work-items/<work-id>/*.md`를 먼저 읽습니다.
- PRD가 있으면 먼저 `docs/prds/<slug>.md`를 읽고 `pnpm feature:new --prd <slug>`로 work item을 정규화할 수 있습니다.
- work item이 아직 없으면 `pnpm work:new <slug> --request "..."`로 scaffold를 만들 수 있습니다.
- 실험 작업이면 `docs/experiment-playbook.md`와 `docs/templates/experiment-spec.md`를 확인합니다.

## 어떤 문서가 먼저 필요한가

### 기능 추가

최소 필요 문서:

- 관련 canonical context
- 관련 PRD가 있으면 `docs/prds/<slug>.md`
- task-local feature spec 또는 work item brief
- 영향 받는 모듈/패키지 문서

권장 문서:

- `docs/templates/feature-spec.md` 형식의 spec
- PRD 입력이면 `docs/templates/prd.md`와 `docs/prds/<slug>.md`
- 중요한 작업이면 `docs/work-items/<work-id>/` 산출물

### 구조 변경

최소 필요 문서:

- `docs/architecture.md`
- 관련 `engineering-*`
- `ai/context/doc-sync.md`
- 필요 시 ADR

### 실험 변경

최소 필요 문서:

- `docs/experiment-playbook.md`
- 관련 feature spec 또는 experiment spec
- `ai/skills/experiment-ops.md`

### 운영 규칙 변경

최소 필요 문서:

- 관련 canonical context
- 관련 skill
- 영향 받는 adapter entry 또는 playbook

## 구현 전 Decision Checklist

- 문제와 목표가 한 문장으로 정리되어 있는가
- non-goals가 있어 scope를 자를 수 있는가
- acceptance criteria가 public behavior 기준으로 적혀 있는가
- test strategy와 TDD 적용 범위가 정리되어 있는가
- 중요한 작업이라면 어떤 behavior slice를 failing test부터 풀지 정했는가
- analytics, experiment, error logging 영향이 정리되어 있는가
- 구조 변경이라면 어떤 canonical 문서를 같이 고칠지 정했는가
- 작은 수정이라 full process를 생략한다면 그 근거가 명확한가

## 중요한 작업 운영 규칙

- 여러 파일에 걸친 기능 작업은 brief 없이 바로 구현하지 않습니다.
- 랜딩, 폼, 어드민, analytics, schema, repository 변경은 spec을 먼저 고정합니다.
- 중요한 작업의 spec에는 test-first로 풀 핵심 behavior slice를 적습니다.
- 구현은 작은 slice 단위로 `failing test -> minimal implementation -> refactor` 순서를 기본값으로 둡니다.
- `pnpm verify`, `pnpm verify:full`은 최종 검증 게이트이며, TDD 루프를 대체하지 않습니다.
- `product-squad`는 역할 분리를 위한 운영 모델이고, 이 문서는 그 상위의 spec-driven 기준입니다.
- work item 문서는 task-local source of truth이며, canonical 규칙을 대체하지 않습니다.

## 문서 없는 새 규칙 금지

아래 변경은 관련 문서 없이 추가하지 않습니다.

- 새 구조 규칙
- 새 역할 분리 규칙
- 새 패키지/새 추상화 도입 기준
- 새 운영 플로우
- 새 외부 도구를 전제로 한 팀 규칙

이 경우 최소한 아래 둘 중 하나는 필요합니다.

- canonical context 업데이트
- task-local spec 또는 ADR 추가

## 구현 후 확인

- 구현 결과가 spec과 일치하는가
- spec과 다르게 바뀐 결정이 있다면 문서가 먼저 또는 함께 갱신되었는가
- canonical 문서와 task-local 문서 역할이 섞이지 않았는가
- test, type, docs 영향이 함께 검토되었는가
- spec만 읽고도 어떤 테스트부터 작성해야 하는지 추론할 수 있는가
