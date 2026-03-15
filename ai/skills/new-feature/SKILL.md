---
name: new-feature
description: "Plan one MVP feature slice from a canonical repo PRD and turn it into work item docs."
---

# Skill: New Feature

## Use when

- `docs/prds/<slug>.md`에 정규화된 PRD가 있고, 그 PRD에서 한 개의 feature를 구현 가능한 작업 단위로 잘라야 할 때
- `product-squad`, `spec-driven-delivery`, `work:new`를 수동으로 엮는 대신 PRD 기준 오케스트레이션이 필요할 때
- 구현 전에 `feature-spec.md`와 role-based work item 문서를 먼저 만들고 싶을 때

## Inputs

- canonical PRD: `docs/prds/<prd-slug>.md`
- optional feature slice: `--feature <feature-slug>`

## Outputs

- `docs/work-items/<work-id>/brief.md`
- `docs/work-items/<work-id>/feature-spec.md`
- `docs/work-items/<work-id>/ux-review.md`
- `docs/work-items/<work-id>/frontend-spec.md`
- `docs/work-items/<work-id>/backend-spec.md`

## Read first

1. `ai/context/project.md`
2. `ai/context/engineering.md`
3. `ai/context/spec-driven.md`
4. `ai/context/doc-sync.md`
5. `docs/product-squad/operating-model.md`
6. `docs/templates/prd.md`
7. `docs/templates/feature-spec.md`
8. 관련 `ai/skills/product-squad.md`, `ai/skills/spec-driven-delivery.md`

## Workflow

1. PRD가 repo 안 canonical 문서인지 확인한다.
2. PRD에서 이번에 만들 feature slice 하나를 고른다.
3. 여러 후보가 있으면 `recommended: yes` 또는 가장 작은 수직 slice를 우선한다.
4. `feature-spec.md`와 role-based work item 문서를 만든다.
5. 누락된 고위험 결정은 open questions와 blocked readiness로 남긴다.
6. 구현은 문서가 준비된 뒤에만 시작한다.

## Blocking questions

- 문제 정의가 비어 있는가
- 목표가 비어 있는가
- 대상 사용자가 비어 있는가
- 핵심 acceptance criteria가 비어 있는가
- 데이터 저장 영향이 비어 있는가
- analytics 영향이 비어 있는가
- admin/auth/payment/external provider 영향이 불명확한가

## Defaults

- source of truth는 항상 `docs/prds/*.md`
- 한 번에 하나의 PRD에서 하나의 feature만 자른다
- role spec이 불필요하면 삭제하지 않고 `status: skipped`와 `skip_reason`을 채운다
- 구현 코드는 생성하지 않는다

## Do not

- Notion 문서를 source of truth처럼 직접 참조하지 않는다
- 여러 feature를 한 work item으로 한꺼번에 밀어 넣지 않는다
- 문서 없이 구현부터 시작하지 않는다
