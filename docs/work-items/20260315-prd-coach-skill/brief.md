---
status: done
owner_role: pm
source_request: "문제나 유저데이터 등등을 가설 비즈니스 목표등을 주었을때 PRD를 생성하는 스킬을 만들고 싶어 원하는 결과물이 나올때까지 티키타카해주는 스킬이 필요해"
affected_paths:
  - ai/skills/_index.md
  - ai/skills/prd-coach.md
dependencies:
  - ai/context/spec-driven.md
  - ai/context/doc-sync.md
  - docs/product-squad/operating-model.md
skip_reason: null
---

# Brief

## Problem

- 현재 저장소에는 문제 정의, 사용자 데이터, 가설, 비즈니스 목표처럼 입력이 덜 정리된 상태에서 PRD를 대화형으로 만들어 주는 repo-local 스킬이 없다.
- 기존 `create-prd`는 PRD 템플릿 작성에는 도움이 되지만, 입력의 빈칸을 식별하고 짧은 왕복으로 초안을 다듬는 운영 방식은 이 저장소 기준으로 고정되어 있지 않다.

## Target User

- discovery 메모와 사용자 신호를 빠르게 PRD로 정리하고 싶은 창업자, PM, 1인 제품팀
- 이 저장소에서 문서 기반으로 구현을 시작하려는 AI 코딩 에이전트 사용자

## Goal

- 문제, 유저 데이터, 가설, 비즈니스 목표를 받아 PRD 초안을 빠르게 만들고 반복적으로 다듬는 스킬을 추가한다.
- 입력이 불완전해도 사실, 가설, 미확정 정보를 구분해 문서를 진행시키는 workflow를 고정한다.
- 구현 단계로 넘어갈 때는 이 저장소의 `product-squad` 흐름으로 자연스럽게 handoff되게 한다.

## Non-Goals

- 외부 SaaS PM 툴과의 자동 연동
- 별도 멀티에이전트 런타임 구축
- PRD에서 바로 코드 구현까지 자동 오케스트레이션

## Success Metric

- `prd-coach` 스킬만 읽고도 짧은 질의응답으로 PRD 초안을 만들 수 있다.
- 스킬이 사실, 가설, 미확정 정보를 구분해서 추정 오염을 줄인다.
- 구현 전환 시 `product-squad` 또는 work item 문서로 이어지는 연결점이 명시된다.

## Acceptance Criteria

- `ai/skills/prd-coach.md`가 추가된다.
- `ai/skills/_index.md`에 새 스킬이 등록된다.
- 스킬 본문에 `초기 구조화 -> v0 초안 -> 집중 질문 -> 수정 반복 -> handoff` 흐름이 포함된다.
- 스킬 본문이 한 번에 많은 질문을 던지지 않고, turn당 1~3개의 높은 leverage 질문만 하도록 규정한다.
- `pnpm ai:sync` 후 `.codex/skills/prd-coach/SKILL.md`가 생성된다.

## Open Questions

- 없음. v1은 repo-local PRD 코칭 workflow에 집중한다.
