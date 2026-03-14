# Doc Sync Playbook

이 문서는 자주 발생하는 변경 유형별로 어떤 문서를 같이 갱신해야 하는지 사례 중심으로 정리합니다.

## 목적

- 문서 sync 판단을 빠르게 만든다.
- canonical context와 task-local doc의 책임 혼선을 줄인다.

## Case 1. 새 기능 추가

예시:

- 새 신청 흐름
- 새 어드민 섹션
- 새 결제 단계

기본 문서:

- 관련 feature spec 또는 work item brief
- FE/BE 역할 문서가 필요한 경우 해당 spec

함께 볼 수 있는 문서:

- `ai/context/engineering-frontend.md`
- `ai/context/engineering-backend.md`
- `docs/architecture.md`

문서 갱신이 필요한 경우:

- 새로운 사용자 흐름이 생긴다.
- acceptance criteria가 바뀐다.
- route/module/package 경계가 달라진다.

## Case 2. 구조 규칙 변경

예시:

- 새 모듈 배치 규칙
- 역할 기반 운영 모델 추가
- app/module/shared/package 책임 조정

우선 갱신:

- `docs/architecture.md`
- 관련 `ai/context/*`
- `docs/agent-context.md`

필요 시 추가:

- `docs/adr/*`
- 관련 skill 문서

## Case 3. 실험 변경

예시:

- CTA 문구 테스트
- success metric 변경
- 종료 기준 변경

우선 갱신:

- experiment spec
- 관련 brief 또는 PM 문서

함께 확인:

- `docs/experiment-playbook.md`
- `ai/skills/experiment-ops.md`

주의:

- 카피, 채널, 오퍼, 폼 구조를 한 번에 다 바꾸지 않습니다.
- metric 이름과 이벤트 이름이 문서마다 다르면 drift입니다.

## Case 4. Backend 경계 변경

예시:

- validation 위치 이동
- repository 책임 조정
- analytics/event emit 시점 변경

우선 갱신:

- backend spec 또는 work item 문서

구조 영향이 있으면 추가 갱신:

- `ai/context/engineering-backend.md`
- `docs/architecture.md`

## Case 5. 운영 모델 변경

예시:

- 새 skill 추가
- 읽기 순서 변경
- gated work 기준 변경

우선 갱신:

- `ai/skills/_index.md`
- 관련 `ai/context/*`
- `docs/agent-context.md`
- adapter entry 문서

## Canonical vs Task-Local 빠른 판단표

- 여러 작업에 반복되는 규칙: canonical
- 현재 기능 범위와 결정: task-local
- 장기 구조 결정: canonical + ADR
- 실험별 가설과 metric: task-local

## 종료 전 Quick Checklist

- 문서가 코드보다 뒤처지지 않았는가
- 같은 규칙이 여러 파일에 복제되지 않았는가
- 외부 메모 없이도 repo 문서만으로 작업 배경을 이해할 수 있는가
- architecture, engineering, skill, work item 문서가 서로 모순되지 않는가
