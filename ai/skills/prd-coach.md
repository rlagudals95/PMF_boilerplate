# Skill: PRD Coach

## Use when

- 문제 정의, 사용자 데이터, 인터뷰 메모, 가설, 비즈니스 목표가 흩어져 있는데 이를 PRD로 정리해야 할 때
- 처음부터 모든 정보가 준비되어 있지 않아 짧은 왕복으로 문서를 다듬어야 할 때
- discovery 입력을 빠르게 PRD 초안으로 바꾸고, 구현 전에 결정 누락을 드러내야 할 때

## Read first

1. 사용자가 제공한 메모, 문서, 링크, 데이터
2. `docs/prds/README.md`
3. `docs/templates/prd.md`
4. `docs/templates/prd-notion.md`
5. 관련 `docs/*` 또는 task-local 문서
6. 구현으로 이어질 작업이면 `docs/product-squad/operating-model.md`
7. 구현 스펙으로 이어질 작업이면 `ai/skills/pm-role.md`

## Goal

- 불완전한 입력을 그대로 받아도 PRD를 멈추지 않고 진행한다.
- 사실, 해석, 가설, 미확정 정보를 분리해 추정 오염을 줄인다.
- 핵심 use case를 산출물 안에 남겨 구현과 검증 기준을 선명하게 만든다.
- 한 번에 긴 설문을 던지지 않고 turn 단위로 필요한 정보만 묻는다.
- 사용자가 만족할 때까지 초안을 계속 갱신한다.
- 완료된 PRD는 repo 안 canonical 문서로 저장한다.
- Notion integration이 가능하면 로컬 저장 후 선택적으로 Notion에도 발행한다.

## Workflow

1. 입력을 아래 네 묶음으로 정리한다.
   - `Facts`: 사용자가 명시한 문제, 데이터, 고객 발화, 사업 목표
   - `Interpretations`: 데이터에서 읽히는 의미
   - `Hypotheses`: 아직 검증되지 않은 원인, 해결책, 시장 반응
   - `Unknowns`: PRD 품질에 직접 영향을 주는 빈칸
2. 바로 쓸 수 있는 정보가 있으면 `v0 PRD`를 먼저 만든다.
3. 부족한 정보가 있어도 문서를 멈추지 말고, 빈칸은 `[Unknown]`, 추정은 `[Assumption]`, 해석은 `[Inference]`로 표시한다.
4. 초안 뒤에는 가장 영향력이 큰 질문만 1~3개 남긴다.
5. 사용자의 답변이 오면 바뀐 부분만 반영하고, 어떤 가정이 확정되었는지 짧게 요약한다.
6. 아래 종료 조건이 충족될 때까지 `질문 -> 수정 -> 확인`을 반복한다.

## Intake Frame

초기 입력을 받을 때 아래 항목으로 재구성한다.

- Problem: 어떤 문제가 반복되고 있는가
- Target user: 누가 그 문제를 겪는가
- Evidence: 인터뷰, 로그, 설문, 정성 메모, 시장 신호
- Business goal: 이 문서가 달성하려는 사업 목적은 무엇인가
- Hypotheses: 무엇이 맞다고 믿고 있는가
- Use cases: 어떤 상황에서 어떤 목표를 이루려는가
- Constraints: 일정, 리소스, 기술, 정책 제약
- Alternatives: 현재 사용자가 쓰는 대안
- Open questions: 아직 결정되지 않은 핵심 항목

입력이 여러 형식으로 섞여 있으면 먼저 이 틀로 정리한 뒤 PRD를 쓴다.

## Questioning Rules

- 한 번에 모든 정보를 캐묻지 않는다.
- 질문은 최대 3개까지만 한다.
- 빈칸이 많아도 우선순위가 높은 질문부터 묻는다.
- 질문은 선택지를 포함해 답하기 쉽게 만든다.
- 이미 문서에 드러난 사실을 다시 묻지 않는다.

질문 우선순위는 아래 순서를 따른다.

1. 목표 사용자가 불명확한가
2. 해결하려는 문제가 실제로 중요한지 근거가 부족한가
3. 사업 목표와 사용자 가치가 충돌하는가
4. success metric이 없거나 구현량 지표뿐인가
5. 핵심 use case가 빠졌거나 서로 다른 흐름이 섞여 있는가
6. v1 범위와 비범위가 섞여 있는가

## PRD Output Contract

PRD는 아래 구조를 기본값으로 사용한다.

### 1. Summary

- 이 문서가 다루는 대상과 기대 결과를 2~3문장으로 요약한다.

### 2. Problem

- 현재 사용자의 문제
- 문제 강도와 빈도
- 왜 지금 해결해야 하는지

### 3. Target User And Context

- 핵심 사용자 세그먼트
- 현재 행동 또는 대안
- 관련 맥락과 제약

### 4. Core Use Cases

- primary use case
- secondary use case
- 사용자의 시작 조건, 행동, 기대 결과

### 5. Evidence And Insights

- 확인된 사실
- 데이터에서 읽은 해석
- 아직 검증되지 않은 가설

### 6. Goals

- Business goal
- User outcome
- Non-goals

### 7. Success Metrics

- north-star 또는 핵심 결과 지표
- leading metric
- stop or pivot signal

### 8. Solution Direction

- 해결 접근
- 핵심 사용자 흐름
- v1 scope
- later scope

### 9. Risks And Open Questions

- 가장 큰 리스크
- 검증이 필요한 가정
- 아직 결정되지 않은 항목

## Use Case Rules

- 최소 1개의 primary use case는 항상 남긴다.
- use case는 `상황 -> 사용자 행동 -> 기대 결과` 순서로 적는다.
- 유저 세그먼트가 여러 개면 use case를 섞지 말고 분리한다.
- 구현 세부가 아니라 사용자의 목표와 완료 조건을 중심으로 쓴다.
- 범위를 자를 때는 use case 단위로 자른다.

## Drafting Rules

- 정보가 부족하면 그 사실을 숨기지 않는다.
- 과장된 확신을 만들지 않는다.
- 문제, 사용자, 목표, 지표, 범위는 분리해서 쓴다.
- use case 없이 솔루션만 먼저 확정하지 않는다.
- 구현 세부보다 의사결정 기준을 우선한다.
- 사용자 데이터가 약하면 해결안보다 검증 계획을 더 선명하게 적는다.

## Iteration Loop

각 턴은 아래 형식을 기본값으로 사용한다.

1. `Updated PRD`: 최신 초안
2. `What Changed`: 이번 답변으로 확정되거나 수정된 내용
3. `Next Questions`: 다음 턴에 필요한 1~3개 질문

사용자가 "계속", "다듬어줘", "더 공격적으로", "더 보수적으로"처럼 짧게 답해도, 그 의도를 해석해 초안을 갱신한다.

## Save Contract

- PRD가 usable 상태가 되면 `docs/prds/<prd-slug>.md`에 저장한다.
- 파일 구조는 `docs/templates/prd.md`를 기본으로 삼는다.
- 저장본에는 `Core Use Cases`와 최하단 `Document History`를 포함한다.
- 저장 전에는 제목과 slug를 정한다.
- 외부 문서나 원본 링크가 있으면 frontmatter `source_url`에 남긴다.
- frontmatter `created_at`, `updated_at`를 채운다.
- 생성 시 `Document History`에 `created` 행을 남기고, 의미 있는 수정 시 `updated` 행을 append-only로 추가한다.
- repo 안 Markdown이 항상 source of truth다.

## Notion Mirror

- PRD는 보통 로컬 저장 뒤 Notion에도 옮긴다.
- Notion 문서는 로컬 PRD 저장이 끝난 뒤에만 만든다.
- Notion integration이나 MCP가 현재 세션에서 사용 가능하면, 사용자가 명시적으로 거절하지 않는 한 Notion 복사본 생성을 기본 후속 단계로 본다.
- Notion 페이지를 만들더라도 canonical 문서는 계속 `docs/prds/<prd-slug>.md`다.
- Notion 생성이 실패하면 로컬 PRD만 남기고, 바로 붙여넣을 수 있는 Markdown 본문을 함께 제공한다.
- Notion이 없는 세션에서는 붙여넣기용 제목과 본문을 정리해 전달한다.
- 붙여넣기용 구조는 `docs/templates/prd-notion.md`를 따른다.
- Notion mirror에도 `Document History`를 같이 넣는다.

## Exit Criteria

아래 항목이 충족되면 일단 usable PRD로 본다.

- 문제와 대상 사용자가 한 문장으로 설명된다.
- 사실과 가설이 구분되어 있다.
- 최소 1개의 핵심 use case가 정리되어 있다.
- business goal과 user outcome이 모두 적혀 있다.
- success metric이 적어도 하나 이상 있고, 허무한 vanity metric이 아니다.
- v1 범위와 비범위가 나뉘어 있다.
- 가장 큰 리스크와 열린 질문이 남아 있다.

## Handoff

- 사용자가 구현까지 원하면 이 PRD를 입력으로 `product-squad`와 `pm-role` 흐름으로 넘긴다.
- 구현 repo 문서가 필요하면 PRD를 `brief.md`와 역할별 spec으로 분해할 준비를 한다.
- feature 단위로 구현을 자를 때는 `new-feature` workflow로 넘길 수 있다.

## Guardrails

- 입력이 빈약하다고 해서 문서 생성을 미루지 않는다.
- 모르는 내용을 사실처럼 쓰지 않는다.
- 질문 수집이 목적이 되지 않게, 매 턴마다 문서 품질이 실제로 올라가야 한다.
- PRD가 실험 문서에 가까우면 success metric과 stop condition을 반드시 남긴다.
- Notion이 가능해도 repo 저장을 건너뛰지 않는다.
