---
name: spec-driven-delivery
description: "Use when 중요한 작업을 시작하기 전에 spec 존재 여부, 읽기 순서, 구현 전 결정 누락을 점검할 때"
---

# Skill: Spec-Driven Delivery

## Use when

- 요구사항이 모호한 작업을 시작할 때
- 구현 전에 문서와 결정을 먼저 고정해야 할 때
- 기능 범위와 spec 정렬이 중요한 작업을 진행할 때

## Read first

1. `ai/context/project.md`
2. `ai/context/engineering.md`
3. `ai/context/spec-driven.md`
4. 작업에 맞는 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md`
5. `ai/context/doc-sync.md`
6. 관련 `docs/*`와 실제 영향 파일

중요한 작업이면 추가:

7. `docs/product-squad/operating-model.md`
8. 활성 `docs/work-items/<work-id>/*.md`

## Workflow

1. 작업을 `light work`와 `important work` 중 어디에 속하는지 분류합니다.
2. 이미 구현 기준이 되는 spec이나 brief가 있는지 확인합니다.
3. 없으면 repo 안 Markdown 문서로 최소 spec을 먼저 정리합니다.
4. 구현 전에 goal, non-goals, acceptance criteria, 영향 경계를 고정합니다.
5. 구현 중 scope가 바뀌면 문서를 먼저 또는 함께 갱신합니다.
6. 마무리할 때 docs, tests, types sync를 같이 확인합니다.

## 최소 spec 기준

### 기능 작업

- `docs/templates/feature-spec.md` 또는 work item brief를 기준으로 사용합니다.
- 중요한 작업이면 `docs/work-items/<work-id>/`를 우선합니다.

### 실험 작업

- `docs/templates/experiment-spec.md`를 기준으로 사용합니다.
- success metric과 stop/ship 기준이 없으면 구현을 서두르지 않습니다.

### 구조 변경

- `docs/architecture.md`와 필요 시 ADR을 먼저 갱신합니다.

## Decision Checklist

- 이 작업의 문제와 목표가 한 문장으로 적혀 있는가
- non-goals가 있어 scope를 제한할 수 있는가
- public behavior 기준 acceptance criteria가 있는가
- analytics, experiment, validation, persistence 영향이 정리되어 있는가
- FE/BE 경계와 route/module/package 책임이 정리되어 있는가
- full process를 생략한다면 그 이유를 설명할 수 있는가

## Docs/Test Sync Checklist

- 구현 기준 문서가 최신 상태인가
- 구조 규칙 변경이면 canonical 문서를 갱신했는가
- task-local 문서와 실제 구현이 크게 어긋나지 않는가
- typecheck, 테스트, 관련 검증 명령을 확인했는가

## Guardrails

- 외부 노트나 MCP 출력물을 source of truth로 쓰지 않습니다.
- spec 없이 중요한 작업 구현부터 시작하지 않습니다.
- 문서 계약은 repo 안 Markdown으로 정규화합니다.
- tool-specific command guide를 skill 본문에 넣지 않습니다.
