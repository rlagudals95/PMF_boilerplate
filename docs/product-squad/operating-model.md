# Product Squad Operating Model

## 목적

- 중요한 작업을 PM/PD/FE/BE 역할로 분리하되, repo 안 문서를 source of truth로 유지한다.
- 구현 전에 결정 누락을 문서로 고정해 바이브 코딩의 품질 편차를 줄인다.

## 기본 원칙

- 기본 진입점은 `product-squad`다.
- canonical PRD가 있으면 `new-feature`가 `product-squad` 앞단에서 work item 생성기를 담당할 수 있다.
- 중요한 작업은 먼저 문서 산출물을 만든다.
- 최신 `brief.md`가 구현 전 기준 문서다.
- 작은 수정은 full process를 생략할 수 있지만 `skip_reason`은 남긴다.
- spec-driven 기준은 `ai/context/spec-driven.md`를 따른다.
- 문서 sync 기준은 `ai/context/doc-sync.md`를 따른다.

## 어떤 작업이 gated work 인가

- 새 실험 추가 또는 기존 실험 로직 변경
- 랜딩, 폼, 어드민 동작 변경
- analytics event, marketing event, error logging 변경
- DB schema, repository, validation 변경
- 여러 파일에 걸친 기능 작업

## 어떤 작업은 light work 인가

- 오탈자 수정
- 시맨틱 변화 없는 스타일 수정
- 단순 카피 수정
- 명백한 소규모 버그 수정
- 기존 spec 범위 안의 단순 리팩터링

단, 아래 변경은 light work라도 TDD 적용을 우선 검토합니다.

- validation 조건 변경
- action/route/use case 경계 변경
- 상태 전이 또는 실패 처리 규칙 변경
- adapter 호출 계약 변경

## 역할

- `product-squad`
  - 작업 분류
  - 역할 선택
  - work item 구조와 skip 규칙 관리
- `pm-role`
  - 문제 정의
  - 목표, 비범위, success metric
  - acceptance criteria
  - 테스트 가능한 public behavior 문장 검토
- `pd-role`
  - 카피, IA, CTA/폼 흐름
  - happy path와 edge state 검토
  - acceptance criteria와 상태 문구가 테스트 가능한지 검토
- `fe-role`
  - route, module, component 경계
  - client/server 상태 흐름
  - state flow, action/route 경계, 모델 단위 behavior test-first 계획
- `be-role`
  - validation, use case, repository
  - analytics/event 영향
  - failure mode와 boundary/use case/repository contract test-first 계획

## 역할별 TDD 기대치

- `pm-role`
  - acceptance criteria를 구현자가 추가 해석 없이 테스트 가능한 문장으로 고정합니다.
- `pd-role`
  - happy path, edge state, 오류 문구가 public behavior 기준으로 검증 가능하도록 정리합니다.
- `fe-role`
  - `modules/*/model`, `actions`, `route` 경계의 핵심 상태 전이와 입력 처리를 먼저 실패시키는 계획을 적습니다.
- `be-role`
  - validation, use case, repository contract, adapter failure handling 중 무엇을 먼저 failing test로 고정할지 적습니다.

## 역할 선택 규칙

- 사용자 흐름, 카피, 폼 변경: `PM + PD + FE`
- validation, persistence, analytics event, DB 영향 포함: `PM + PD + FE + BE`
- 순수 FE 리팩터링: `FE`만 허용 가능
- 순수 BE 리팩터링: `BE`만 허용 가능

생략한 역할 문서는 `status: skipped`와 `skip_reason`을 채운다.

## Work ID 규칙

- 기본 형식: `YYYYMMDD-short-slug`
- 실험 작업: `LP-001-YYYYMMDD-short-slug`

예시:

- `20251201-consult-form-copy`
- `LP-001-20251201-hero-cta-test`

## 폴더 구조

```txt
docs/work-items/<work-id>/
  brief.md
  feature-spec.md
  ux-review.md
  frontend-spec.md
  backend-spec.md
```

## Frontmatter 계약

모든 work item 문서는 아래 필드를 가진다.

- `status`
  - `draft`, `approved`, `in_progress`, `blocked`, `done`, `skipped`
- `owner_role`
  - `product-squad`, `pm`, `pd`, `fe`, `be`
- `source_request`
  - 사용자 요청 또는 이슈 링크
- `affected_paths`
  - 예상 영향 경로 목록
- `dependencies`
  - 선행 문서 또는 의존 작업 목록
- `skip_reason`
  - 생략 시 사유, 아니면 `null`

## 운영 순서

1. 요청을 `gated work` 또는 `light work`로 분류한다.
2. gated work면 `work-id`를 만든다.
3. `brief.md`를 먼저 만든다.
4. 필요한 역할 문서를 만든다.
5. 필요 없는 문서는 `skipped`로 남긴다.
6. 구현 단위를 테스트 가능한 behavior slice로 자른다.
7. 중요한 작업과 핵심 로직 변경은 각 slice를 failing test로 먼저 고정한 뒤 최소 구현과 리팩터링을 진행한다.
8. 구현 중 scope가 바뀌면 관련 문서를 먼저 갱신한다.
9. 작업 종료 전에는 canonical 문서와 work item 문서 sync를 함께 확인하고 `pnpm verify` 또는 `pnpm verify:full`을 실행한다.

## PD 범위 제한

- PD는 첫 버전에서 가벼운 UX 리뷰 역할만 맡는다.
- 픽셀 단위 디자인 시스템, Figma 산출물, 브랜딩 리뉴얼은 범위 밖이다.

## V1 제외 범위

- 외부 PM 툴 연동
- 백그라운드 에이전트
- 별도 멀티에이전트 오케스트레이션 서비스
