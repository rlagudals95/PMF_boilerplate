# Skill: Product Squad

## Use when

- 여러 파일에 걸친 기능 작업을 시작할 때
- 랜딩, 폼, 어드민, analytics, DB 변경이 함께 얽힌 작업을 다룰 때
- PM/PD/FE/BE 역할을 분리해 작업 문서를 만들고 구현 순서를 고정해야 할 때

## Read first

1. `docs/product-squad/operating-model.md`
2. 활성 work item이 있으면 `docs/work-items/<work-id>/brief.md`
3. 작업이 FE/BE를 걸치면 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md`

## Workflow

1. 요청을 `gated work` 또는 `light work`로 분류한다.
2. gated work면 `work-id`를 정하고 `docs/work-items/<work-id>/` 산출물을 기준으로 삼는다.
3. 먼저 `brief.md`를 고정한다.
4. 역할 선택 규칙에 따라 `ux-review.md`, `frontend-spec.md`, `backend-spec.md`를 만들거나 `skipped`로 남긴다.
5. 구현은 필요한 문서가 모두 준비된 뒤에만 시작한다.

## Role selection

- 사용자 흐름, 카피, 폼 변경: `pm-role` + `pd-role` + `fe-role`
- validation, persistence, analytics event, DB 영향 포함: 위 조합에 `be-role` 추가
- 순수 FE 리팩터링: `fe-role`만 사용 가능, 생략한 역할은 `skip_reason`을 남긴다
- 순수 BE 리팩터링: `be-role`만 사용 가능, 생략한 역할은 `skip_reason`을 남긴다

## Defaults

- 기본 진입점은 항상 `product-squad`다.
- PD는 가벼운 UX 리뷰 역할로 제한한다.
- 최신 `brief.md`가 구현 전 source of truth다.
- 외부 툴, 백그라운드 에이전트, 별도 오케스트레이션 서비스는 v1 범위 밖이다.
