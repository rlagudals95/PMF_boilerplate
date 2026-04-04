---
owner: "platform"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Supabase DB Default Design

## Summary

이 작업의 목표는 저장소의 기본 DB 권장 방향을 Neon 중심 표현에서 Supabase Postgres 중심 표현으로 전환하는 것입니다.
단, 실제 런타임 데이터 접근 구조는 그대로 유지합니다.

- 유지:
  - `Drizzle + DATABASE_URL`
  - local JSON fallback
  - generic Postgres 호환성
- 변경:
  - canonical 문서의 기본 권장 DB 서술
  - user-facing/setup-facing 문구 중 Neon 중심 표현
  - DB 기본값을 설명하는 안내 문장과 예시

## Goal Packet

- business goal:
  - 새 프로젝트 시작 시 저장소의 기본 DB 선택지가 Supabase 기준으로 일관되게 보이도록 한다.
- target user:
  - 이 보일러플레이트로 MVP를 빠르게 띄우려는 1인 개발자 또는 작은 팀
- target moment:
  - 저장소를 처음 읽고 DB/infra 선택을 결정하는 초기 세팅 단계
- success metric:
  - 핵심 문서와 대표 UI 문구에서 Neon이 기본 권장값처럼 읽히지 않는다.
- non-goals:
  - Supabase SDK 기반 DB access로 전환하지 않는다.
  - repository/client 구조를 Supabase 전용으로 재설계하지 않는다.
  - auth starter 범위를 넓히지 않는다.
  - runtime env contract를 `DATABASE_URL`에서 다른 값으로 바꾸지 않는다.
- constraints:
  - local fallback은 유지해야 한다.
  - generic Postgres 호환성은 유지해야 한다.
  - 문서와 코드 표현은 정직해야 한다.
- existing evidence:
  - 현재 `packages/db`는 `Drizzle + postgres + DATABASE_URL` 구조다.
  - `apps/web`에는 Supabase browser auth starter가 이미 optional capability로 존재한다.
  - canonical docs와 일부 UI 문구에서 Neon이 기본 권장 DB처럼 서술된다.
- visual bar:
  - setup 문구는 과장 없이 명확해야 하고, “Supabase 기본 + Postgres 호환 유지”가 한 번에 이해돼야 한다.

## Chosen Approach

채택한 접근은 `Supabase 권장 + generic Postgres 병기`다.

즉, 저장소의 기본 권장 managed DB는 `Supabase Postgres`로 바꾸되, 내부 런타임/코드 계약은 여전히 `generic Postgres via DATABASE_URL`로 유지한다.

이 접근을 고른 이유는 다음과 같다.

1. 현재 저장소의 실제 DB 접근은 vendor-neutral Postgres 계약이다.
2. 사용자가 읽는 기본 메시지는 Supabase 기준으로 정리할 수 있다.
3. 내부 타입, health payload, repository 계약까지 억지로 `supabase`로 바꾸면 실제 구조보다 더 vendor-locked처럼 보일 수 있다.

## Architecture Decisions

### 1. DB runtime contract는 그대로 둔다

아래 요소는 유지한다.

- `packages/db/src/client/postgres.ts`
- `DATABASE_URL`
- `drizzle-orm` + `postgres`
- local JSON fallback

즉, 이번 작업은 DB access adapter 변경이 아니라 “기본 권장 provider와 설명 surface 정렬” 작업이다.

### 2. 기본 권장 provider 표현만 Supabase로 바꾼다

다음과 같은 문구는 Supabase 기준으로 정리한다.

- “Neon/Postgres 권장”
- “Neon 같은 managed Postgres”
- “local fallback 또는 Neon/other postgres”

원칙:

- 기본 추천은 `Supabase Postgres`
- 호환성 설명은 `other Postgres` 또는 `generic Postgres`
- local fallback은 계속 별도 축으로 유지

### 3. runtime 라벨은 generic하게 유지한다

아래 표현은 그대로 둔다.

- `dataMode: "postgres" | "local-json"`
- `process.env.DATABASE_URL ? "postgres" : "local-json"`
- Postgres repository/client naming

이유:

- 현재 의미가 정확하다.
- Supabase는 이 저장소에서 DB host 권장값이지, DB access protocol 이름이 아니다.

## Expected File Changes

### Canonical docs

- `AGENTS.md`
  - DB 기본 방향 문구를 `Supabase Postgres 권장 + local fallback 유지`로 수정
- `ai/context/project.md`
  - working rules의 DB 기본값 설명 수정
- `docs/architecture.md`
  - `Neon/Postgres 권장` 섹션을 `Supabase Postgres 권장` 기준으로 수정
  - auth starter 설명에 있는 Neon 기준 표현 수정

### User-facing or setup-facing code copy

- `apps/web/src/modules/auth/ui/auth-demo-page.tsx`
  - setup note의 Neon 기준 문구 수정
- `apps/web/src/modules/payment/ui/payment-page.tsx`
  - 저장 위치 설명 문구를 Supabase Postgres 기준으로 수정

### Optional follow-up scan

아래 경로는 wording drift가 있으면 함께 수정한다.

- `docs/start-your-mvp.md`
- 기타 `Neon` 문자열이 남아 있는 README/setup 문서

단, 실제 구현 중 새로운 구조 변경이 생기지 않는 한 canonical docs + 대표 UI 문구 범위 안에서 끝낸다.

## Acceptance Criteria

### Docs

- 핵심 구조 문서에서 기본 권장 DB가 Supabase 기준으로 읽힌다.
- 문서가 여전히 `DATABASE_URL` 기반 generic Postgres 호환성을 설명한다.
- local fallback이 비권장 경로처럼 보이지 않고, 실험 속도를 위한 의도된 fallback으로 남는다.

### Product/setup copy

- auth/payment 관련 setup 문구에서 Neon이 기본값처럼 보이지 않는다.
- 사용자가 읽을 때 “Supabase 권장, 하지만 내부 계약은 Postgres + DATABASE_URL”를 오해 없이 이해할 수 있다.

### Non-regression

- `dataMode` 타입/헬스 payload/repository naming은 바뀌지 않는다.
- DB client implementation, schema, repository behavior는 바뀌지 않는다.

## Test Strategy

이번 작업은 구조 문서 + copy alignment 중심이라 full behavioral TDD 대상은 아니다.
대신 아래 검증을 수행한다.

- 관련 타입/테스트가 깨지지 않는지 확인
- workspace verify 실행
- canonical source를 건드렸으므로 `pnpm repo:check` 실행

필요 시 snapshot성 문구 테스트가 이미 있는 파일은 해당 테스트 영향만 확인한다.

## Risks And Mitigations

### Risk 1. 문구는 Supabase인데 실제 구조는 generic Postgres라 혼란이 생길 수 있음

대응:

- 문서에 `Supabase Postgres 권장`과 `DATABASE_URL 기반 generic Postgres 계약 유지`를 함께 적는다.

### Risk 2. 일부 surface만 바뀌고 다른 문서에 Neon 표현이 남을 수 있음

대응:

- `rg` 기반 문자열 검색으로 남은 `Neon|neon` 표현을 재확인한다.

### Risk 3. runtime label까지 바꾸고 싶은 유혹으로 scope가 커질 수 있음

대응:

- 이번 작업의 non-goal에 runtime 라벨 변경 제외를 명시한다.

## Verification Plan

- `rg -n "Neon|neon" docs apps/web ai AGENTS.md`
- `pnpm verify`
- `pnpm repo:check`

## Out Of Scope

- Supabase server client 추가
- service role 기반 repository 전환
- RLS 정책 도입
- auth user sync
- migration strategy 변경
- schema or repository refactor
