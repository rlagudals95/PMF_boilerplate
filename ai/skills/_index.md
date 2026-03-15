# Skill Index

이 폴더는 플랫폼에 종속되지 않는 저장소 로컬 스킬 레지스트리입니다.

## 사용 규칙

- 작업이 아래 스킬과 명확히 맞으면 해당 문서를 먼저 읽습니다.
- 스킬 본문은 일반 Markdown 또는 `ai/skills/<name>/SKILL.md` 형태의 skill-native 문서로 유지합니다.
- 도구별 기능 이름이나 proprietary syntax는 넣지 않습니다.

## Available skills

### `repo-guardrails`

- 위치: `ai/skills/repo-guardrails.md`
- 사용 시점: 새 패키지/새 추상화/새 인프라를 추가하려 할 때

### `experiment-ops`

- 위치: `ai/skills/experiment-ops.md`
- 사용 시점: 실험 등록, 이벤트 명명, success metric 설계, 종료 기준 판단

### `product-squad`

- 위치: `ai/skills/product-squad.md`
- 사용 시점: 중요한 기능 작업이나 실험 변경을 PM/PD/FE/BE 역할로 나눠서 운영할 때

### `new-feature`

- 위치: `ai/skills/new-feature/SKILL.md`
- 사용 시점: canonical PRD를 읽고 단일 feature slice의 work item과 spec 문서를 만들 때

### `pm-role`

- 위치: `ai/skills/pm-role.md`
- 사용 시점: 문제정의, 목표, 범위, success metric, acceptance criteria를 고정할 때

### `prd-coach`

- 위치: `ai/skills/prd-coach.md`
- 사용 시점: 문제, 유저 데이터, 가설, 비즈니스 목표를 바탕으로 PRD 초안을 만들고 짧은 왕복으로 계속 다듬어야 할 때

### `pd-role`

- 위치: `ai/skills/pd-role.md`
- 사용 시점: 카피, 정보 구조, CTA/폼 흐름, 상태/예외 UX를 검토할 때

### `fe-role`

- 위치: `ai/skills/fe-role.md`
- 사용 시점: route, module, component, client/server 경계, FE 테스트 전략을 정리할 때

### `be-role`

- 위치: `ai/skills/be-role.md`
- 사용 시점: validation, use case, repository, analytics/event 영향, failure mode를 정리할 때

### `spec-driven-delivery`

- 위치: `ai/skills/spec-driven-delivery.md`
- 사용 시점: 중요한 작업을 시작하기 전에 spec 존재 여부, 읽기 순서, 구현 전 결정 누락을 점검할 때

### `doc-sync`

- 위치: `ai/skills/doc-sync.md`
- 사용 시점: 구조 변경, 운영 규칙 변경, PR 마무리 시 문서 sync 필요 여부를 판단할 때

### `session-wrap`

- 위치: `ai/skills/session-wrap.md`
- 사용 시점: 작업 세션을 마무리하며 변경 요약, 문서 영향 점검, 선택적 커밋을 함께 진행할 때
