---
owner: "fe"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: draft
owner_role: fe
source_request: ""
affected_paths: []
dependencies: []
skip_reason: null
---

# Frontend Spec

## Goal Alignment

<!-- 이 FE 변경이 어떤 business goal과 사용자 행동 변화를 더 직접적으로 돕는지 적습니다. -->

-

## Affected Routes

-

## Module Targets

-

## Component Plan

-

## State And Events

-

## Instrumentation Hooks

-

## Enterprise FE Guardrails

-

## Test-First Plan

- 먼저 failing test로 고정할 behavior slice
- 어떤 module/model/action/route 경계를 검증할지
- manual verify가 필요한 UI 상태가 무엇인지

## Manual Browser QA

`pnpm browser:qa --work <work-id>`를 실행해 desktop/mobile evidence를 수집하고,
요약은 `docs/work-items/<work-id>/browser-qa.md`에 남긴다.
raw screenshots와 traces는 local Playwright output으로만 유지한다.

-

## Out Of Scope

-
