---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: Product Squad

## Use when

- 여러 파일에 걸친 기능 작업을 시작할 때
- 랜딩, 폼, 어드민, analytics, DB 변경이 함께 얽힌 작업을 다룰 때
- `po-role`, PM/PD/FE/BE, `evaluator-role` 관점을 분리해 작업 문서를 만들고 구현 순서를 고정해야 할 때

## Read first

1. `ai/context/ai-native.md`
2. `docs/product-squad/operating-model.md`
3. `docs/product-squad/goal-driven-delivery.md`
4. `docs/product-squad/agent-team-delivery.md`
5. 활성 work item이 있으면 `docs/work-items/<work-id>/brief.md`
6. 작업이 FE/BE를 걸치면 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md`

## Workflow

1. 요청을 `gated work` 또는 `light work`로 분류한다.
2. gated work면 `po-role`이 first gate로 goal packet completeness를 먼저 판정한다.
3. `ready`, `needs-clarification`, `not-safe-to-build` 중 하나로 분류하고, clarifying loop가 끝나기 전에는 구현하지 않는다.
4. `work-id`를 정하고 `docs/work-items/<work-id>/` 산출물을 기준으로 삼는다.
5. 먼저 `goal-packet.md`와 `brief.md`를 고정한다.
6. 역할 선택 규칙에 따라 `team-plan.md`, `ux-review.md`, `frontend-spec.md`, `backend-spec.md`, `quality-scorecard.md`를 준비한다.
7. team-plan에 execution mode, task graph, file ownership을 먼저 적는다.
8. user-facing 작업이면 browser QA와 release 판단까지 scorecard에 남길 계획을 적는다.
9. specialist는 free-form peer chat보다 bounded artifact를 남기고, 최종 synthesis는 `po-role`이 맡는다.
10. 구현은 `po-role` 승인과 필요한 문서 준비가 끝난 뒤에만 시작한다.
11. 중요한 작업은 `evaluator-role` 또는 동등한 independent reviewer가 최종 release recommendation을 남긴다.

## Role selection

- 사용자 흐름, 카피, 폼 변경: `po-role` + `pm-role` + `pd-role` + `fe-role` + `evaluator-role`
- validation, persistence, analytics event, DB 영향 포함: 위 조합에 `be-role` + `evaluator-role` 추가
- 순수 FE 리팩터링: `fe-role`만 사용 가능, 생략한 역할은 `skip_reason`을 남긴다
- 순수 BE 리팩터링: `be-role`만 사용 가능, 생략한 역할은 `skip_reason`을 남긴다

## Defaults

- 기본 진입점은 항상 `product-squad`다.
- `po-role`은 중요한 작업의 goal packet completeness와 build gate owner다.
- `po-role`은 기본적으로 user conversation owner이자 final synthesis owner다.
- `pd-role`은 UX 리뷰뿐 아니라 commercial landing critique와 boilerplate smell check까지 맡는다.
- specialist는 직접 user와 ping-pong하기보다 artifact를 반환하는 bounded reviewer/worker로 동작한다.
- `evaluator-role`은 quality-scorecard를 닫는 independent release judge다.
- 최신 `brief.md`가 구현 전 source of truth다.
- `quality-scorecard.md`는 중요한 작업의 최종 ship/iterate 판단 문서다.
- 외부 툴, 백그라운드 에이전트, 별도 오케스트레이션 서비스는 v1 범위 밖이다.
- 각 역할은 `ai/context/ai-native.md`의 enterprise principles를 자기 역할 산출물에 반영해야 한다.
