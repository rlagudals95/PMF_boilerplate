# Doc Sync Policy

이 문서는 코드와 문서의 sync를 어떻게 유지하는지 정의하는 canonical context입니다.

## 목적

- 문서 drift를 줄인다.
- 어떤 변경이 어떤 문서 갱신을 요구하는지 일관되게 판단한다.
- canonical context와 task-local doc의 책임을 구분한다.

## 기본 원칙

- 코드와 문서는 같은 변경 단위로 움직입니다.
- 모든 변경이 문서 갱신을 요구하지는 않지만, 구조와 운영 규칙 변경은 거의 항상 문서 영향이 있습니다.
- 같은 규칙을 여러 문서에 복제하지 않고, source 문서를 먼저 갱신합니다.
- 외부 노트는 sync 대상이 아니라 입력 재료입니다.

## 어떤 변경이 어떤 문서를 유발하는가

### 구조 규칙 변경

예시:

- 레이어 책임 변경
- 새 폴더 규칙
- 의존 방향 변경
- 역할 기반 운영 흐름 변경

함께 볼 문서:

- `docs/architecture.md`
- 관련 `ai/context/engineering*.md`
- `docs/agent-context.md`
- 필요 시 `docs/adr/*`

### 기능 흐름 변경

예시:

- 새 화면/새 폼/새 admin flow
- 기존 사용자 흐름 변경

함께 볼 문서:

- 관련 feature spec
- 활성 `docs/work-items/<work-id>/*.md`
- 관련 모듈 README 또는 task-local 문서

### 실험 정의 변경

예시:

- 가설 변경
- success metric 변경
- CTA/event naming 변경

함께 볼 문서:

- `docs/experiment-playbook.md`
- experiment spec
- 관련 brief 또는 PM 문서

### backend/integration 변경

예시:

- validation 위치 변경
- repository/use case 책임 이동
- analytics, error logging, external adapter 변경

함께 볼 문서:

- `ai/context/engineering-backend.md`
- backend spec 또는 work item 문서
- 구조 영향이 있으면 `docs/architecture.md`

### 운영 규칙 변경

예시:

- 에이전트 읽기 순서
- 문서 템플릿 계약
- gated work 기준

함께 볼 문서:

- `AGENTS.md`
- `docs/agent-context.md`
- 관련 `ai/context/*`
- 관련 `ai/skills/*`

## 문서 갱신이 필요한 경우

- 코드가 새 규칙이나 새 경계를 도입한다.
- 기존 문서의 설명과 실제 구현이 달라졌다.
- 에이전트가 작업 전에 읽어야 할 기준이 바뀌었다.
- 작업 산출물 계약의 필드나 상태값이 달라졌다.
- 실험이나 기능의 acceptance criteria가 달라졌다.

## 문서 갱신이 보통 불필요한 경우

- 오탈자 수정
- 시맨틱 변화 없는 스타일 수정
- 기존 spec 범위 안의 작은 버그 수정
- 문서가 이미 설명하는 구현 세부 리팩터링

단, 구현 방식이 책임 경계를 바꾸면 작은 리팩터링이라도 문서 영향이 생깁니다.

## 최소 확인 항목

변경 후 아래를 확인합니다.

- 바뀐 규칙의 canonical source가 어디인지 명확한가
- 같은 규칙이 여러 문서에 중복 서술되지 않았는가
- task-local 문서가 canonical 규칙을 덮어쓰고 있지 않은가
- work item 문서와 실제 구현 상태가 크게 어긋나지 않는가
- 문서 링크와 경로가 현재 구조와 맞는가

## Drift 징후

- AGENTS와 `docs/agent-context.md`의 읽기 순서가 다르다.
- `engineering-*` 문서와 실제 폴더 책임이 다르다.
- work item spec 없이 구현이 먼저 진행된다.
- `docs/architecture.md`에는 없는 레이어 규칙이 코드에 생겼다.
- 실험 metric과 이벤트 이름이 문서마다 다르게 적혀 있다.
- external tool note가 구현 기준 문서처럼 취급된다.

## 영향 문서 찾기 Workflow

1. 변경의 종류를 분류합니다.
2. 그 변경을 설명하는 canonical source가 이미 있는지 찾습니다.
3. 현재 작업의 task-local spec이나 brief를 확인합니다.
4. 규칙 변경이면 canonical doc을 먼저 갱신합니다.
5. 작업 범위 설명이면 task-local doc을 갱신합니다.
6. 둘 다 바뀌면 canonical과 task-local을 함께 갱신합니다.

## Canonical vs Task-Local 판단 기준

- 여러 작업에서 반복되는 규칙이면 canonical입니다.
- 현재 작업에만 필요한 결정이면 task-local입니다.
- 구조 원칙은 `ai/context/*` 또는 `docs/architecture.md`에 둡니다.
- 현재 work item의 scope, acceptance criteria, edge case는 `docs/work-items/*`에 둡니다.

## Drift Remediation Checklist

- source of truth 문서를 먼저 정한다.
- 중복된 설명이 있으면 한 곳을 canonical로 남기고 나머지는 참조로 줄인다.
- 구현 기준에 필요한 링크만 유지하고, 복붙 서술은 제거한다.
- 구현과 문서가 다르면 구현 또는 문서 중 무엇을 수정할지 명시적으로 결정한다.
- 구조 변경이면 ADR 또는 architecture 문서 반영 여부를 확인한다.

## 작업 종료 Checklist

- 필요한 canonical 문서를 갱신했다.
- 필요한 task-local 문서를 갱신했다.
- docs/test/type 영향 여부를 확인했다.
- work item이 있다면 상태와 실제 구현 단계가 크게 어긋나지 않는다.
- Notion 같은 외부 노트가 있다면 repo spec에 필요한 내용이 반영되었다.
