---
status: done
owner_role: pm
source_request: "PLEASE IMPLEMENT THIS PLAN: 실무형 PM/PD/FE/BE 에이전트 운영체계 도입 계획"
affected_paths:
  - ai/context/project.md
  - ai/skills/_index.md
  - ai/skills/product-squad.md
  - ai/skills/pm-role.md
  - ai/skills/pd-role.md
  - ai/skills/fe-role.md
  - ai/skills/be-role.md
  - docs/agent-context.md
  - docs/architecture.md
  - docs/product-squad/operating-model.md
  - docs/product-squad/templates/brief.md
  - docs/product-squad/templates/ux-review.md
  - docs/product-squad/templates/frontend-spec.md
  - docs/product-squad/templates/backend-spec.md
  - docs/work-items/README.md
dependencies: []
skip_reason: null
---

# Brief

## Problem

- 저장소에 AI 컨텍스트와 기능 모듈은 있지만, 중요한 작업을 PM/PD/FE/BE 역할로 나눠 문서화하고 구현 순서를 고정하는 운영체계가 없다.
- 리드/상담 제출 흐름은 모듈로 이동했지만 validation boundary가 action 밖에 남아 있어 FE/BE 가드레일과 완전히 맞지 않는다.

## Target User

- 이 저장소를 기반으로 PMF 탐색 제품을 만드는 창업자 또는 1인 제품팀
- Codex, Claude Code, Gemini 같은 에이전트를 같이 쓰는 개발자

## Goal

- repo 안에서 바로 사용할 수 있는 역할 기반 운영체계를 추가한다.
- 중요한 작업은 `docs/work-items/<work-id>/` 문서를 기준으로 진행하게 만든다.
- 리드/상담 제출 흐름의 validation boundary를 server action으로 올린다.

## Non-Goals

- 외부 PM 툴 연동
- 백그라운드 멀티에이전트 런타임
- 완전 자율 제품팀 구현

## Success Metric

- `product-squad`와 역할 스킬이 저장소에 등록되어 있다.
- `docs/product-squad/*`와 `docs/work-items/*` 규칙만 보고 새 work item을 시작할 수 있다.
- 리드/상담 제출 action이 boundary validation을 직접 수행한다.

## Acceptance Criteria

- `product-squad`, `pm-role`, `pd-role`, `fe-role`, `be-role` 스킬 문서가 추가된다.
- `docs/product-squad/operating-model.md`와 4개 템플릿이 추가된다.
- `docs/work-items/README.md`와 예시 work item이 추가된다.
- `docs/agent-context.md`, `docs/architecture.md`, `ai/context/project.md`, `ai/skills/_index.md`가 새 운영체계를 가리킨다.
- `submitLeadAction`, `submitConsultationRequestAction`이 boundary validation을 수행한다.

## Open Questions

- 없음. v1은 repo-local workflow만 지원한다.
