---
name: doc-sync
description: "Use when 구조 변경, 운영 규칙 변경, PR 마무리 시 문서 sync 필요 여부를 판단할 때"
---

# Skill: Doc Sync

## Use when

- 구조 변경이나 운영 규칙 변경을 마무리할 때
- 어떤 문서를 같이 갱신해야 할지 판단할 때
- PR 또는 작업 종료 전에 문서 drift를 점검할 때

## Read first

1. `ai/context/doc-sync.md`
2. `ai/context/spec-driven.md`
3. 관련 `ai/context/engineering*.md`
4. 관련 `docs/*`
5. 활성 `docs/work-items/<work-id>/*.md`

## Workflow

1. 변경을 구조, 기능, 실험, 운영 규칙 중 어디에 속하는지 분류합니다.
2. 변경을 설명하는 canonical source가 이미 있는지 찾습니다.
3. 현재 작업의 task-local spec 또는 brief를 확인합니다.
4. 문서 갱신이 필요한지 판정합니다.
5. 필요하면 canonical 문서와 task-local 문서를 역할에 맞게 나눠 갱신합니다.
6. 중복 서술은 줄이고 source 문서를 기준으로 링크만 남깁니다.

## Canonical 문서에 반영할 것

- 반복되는 구조 규칙
- 역할/운영 방식
- 읽기 순서
- 문서 계약
- 여러 작업에 적용되는 가드레일

## Task-Local 문서에 반영할 것

- 현재 작업의 scope
- acceptance criteria
- edge case
- 테스트 포인트
- skip reason과 결정 사유

## Drift Remediation Checklist

- source of truth 문서를 먼저 정했다.
- 같은 규칙이 여러 파일에 복붙되어 있지 않다.
- architecture와 engineering 문서가 실제 구조와 맞는다.
- work item 문서가 현재 구현과 크게 어긋나지 않는다.
- external note 의존 없이 repo 문서만으로 작업 기준을 이해할 수 있다.

## Guardrails

- 문서가 많아질수록 canonical과 task-local 역할을 더 엄격히 나눕니다.
- AGENTS 같은 adapter entry에 본문 규칙을 복붙하지 않습니다.
- Notion 같은 외부 도구 규칙은 optional integration으로만 다룹니다.
