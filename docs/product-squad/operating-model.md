---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Product Squad Operating Model

## 목적

- 중요한 작업을 `po-role`, PM/PD/FE/BE, `evaluator-role` 역할로 분리하되, repo 안 문서를 source of truth로 유지한다.
- 구현 전에 결정 누락을 문서로 고정해 바이브 코딩의 품질 편차를 줄인다.

## 기본 원칙

- 기본 진입점은 `product-squad`다.
- 중요한 작업의 기본값은 `역할 기반 문서 + quality gate`다.
- 중요한 작업의 기본 토폴로지는 `po supervisor -> bounded specialists -> evaluator gate`다.
- 중요한 작업의 Repo OS 기본 경로는 `goal packet -> brief -> role specs -> team-plan -> tests -> browser evidence -> quality-scorecard`다.
- 중요한 작업은 `po-role`의 completeness check와 build approval을 먼저 지난다.
- canonical PRD가 있으면 `new-feature`가 `product-squad` 앞단에서 work item 생성기를 담당할 수 있다.
- 중요한 작업은 먼저 문서 산출물을 만든다.
- 최신 `goal-packet.md`가 입력 정규화 기준 문서이고, 최신 `brief.md`가 구현 전 기준 문서다.
- user-facing 또는 goal-critical 작업은 `goal-driven-delivery` 기준으로 browser evidence와 quality scorecard까지 남긴다.
- 역할 handoff나 병렬 탐색이 있으면 `agent-team-delivery` 기준으로 `team-plan.md`를 coordination source로 사용한다.
- 작은 수정은 full process를 생략할 수 있지만 `skip_reason`은 남긴다.
- spec-driven 기준은 `ai/context/spec-driven.md`를 따른다.
- 문서 sync 기준은 `ai/context/doc-sync.md`를 따른다.
- 모든 역할은 `ai/context/ai-native.md`의 enterprise principles를 기본값으로 따른다.

## Task Triage Matrix

| Request Type | Default Work Class | Default Roles | Default Execution Mode |
| --- | --- | --- | --- |
| policy / business goal -> MVP shaping | gated work | product-squad + po + pm + pd + fe + evaluator (+ be when data or analytics change) | single-agent sequential |
| user-facing flow or copy change | gated work | po + pm + pd + fe + evaluator | single-agent sequential |
| validation / persistence / analytics contract change | gated work | po + pm + fe + be + evaluator | single-agent sequential |
| pure FE refactor with no behavior change | light work | fe | single-agent sequential |
| pure BE refactor with no contract change | light work | be | single-agent sequential |
| parallel research or competing hypotheses | gated work | product-squad + po + role owners + evaluator | subagent fan-out |
| tightly coupled cross-layer implementation | gated work | product-squad + po + pm + pd + fe + be + evaluator | agent-team only when platform support is clearly useful |

## Hybrid Harness Defaults

- `light`: small low-risk changes that can close with local verify
- `soft-gated`: meaningful changes that require `brief` and verify evidence
- `hard-gated`: changes that alter user behavior, contracts, ops interpretation, prompt/workflow, or release rules

대표 `change_types`:

- `user-facing-behavior`
- `validation-schema`
- `repository-contract`
- `cross-repo-contract`
- `prompt-workflow`
- `release-ops`
- `new-capability`

## Editing Surface Triage

작업 분류와 별개로, 구현을 어디서 시작할지에 대한 triage도 같이 합니다.

| Triage Label | Meaning | Default First Move |
| --- | --- | --- |
| `product-config-friendly` | existing block 안에서 해결 가능한 copy, CTA, trust, active/deferred flow, admin metric 강조 변경 | [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)부터 조정 |
| `gated work` | goal-critical, user-facing, contract-affecting, multi-file change | work item과 role spec, quality gate를 먼저 열기 |
| `deep code` | existing block이나 `product-config`로 표현되지 않는 새 폼 필드, validation/schema, action/use case/repository, 새로운 도메인 규칙 | safe surface 검토 후 module/action/schema 쪽으로만 내려가기 |

중요한 점은 이 분류가 서로 배타적이지 않다는 것입니다.

- 한 요청은 `product-config-friendly`이면서 동시에 `gated work`일 수 있습니다.
- `deep code`는 work class가 아니라 escalation depth입니다.
- 기본 escalation path는 `product-config-friendly -> existing module surface -> deep code`입니다.
- 단, landing처럼 quality bar가 중요한 경우 `product-config-friendly`라도 `po-role`과 `pd-role` critique를 건너뛰지 않습니다.

## 어떤 작업이 gated work 인가

- 새 실험 추가 또는 기존 실험 로직 변경
- 랜딩, 폼, 어드민 동작 변경
- analytics event, marketing event, error logging 변경
- DB schema, repository, validation 변경
- AI adapter, 읽기 순서, 역할/운영 규칙 변경
- 여러 파일에 걸친 기능 작업

위 항목 중에서도 existing block과 `product-config`로 표현 가능한 user-facing 변경이라면, 구현의 첫 스텝은 safe surface에서 시작합니다.

## 어떤 작업은 light work 인가

- 오탈자 수정
- 시맨틱 변화 없는 스타일 수정
- 단순 카피 수정
- 명백한 소규모 버그 수정
- 기존 spec 범위 안의 단순 리팩터링

light work도 제품 문구, CTA, trust surface 변경이라면 raw TSX보다 `product-config`를 먼저 봅니다.

단, 아래 변경은 light work라도 TDD 적용을 우선 검토합니다.

- validation 조건 변경
- action/route/use case 경계 변경
- 상태 전이 또는 실패 처리 규칙 변경
- adapter 호출 계약 변경

## 역할

- `product-squad`
  - 작업 분류
  - `po-role` orchestration shell 유지
  - 역할 선택
  - work item 구조와 skip 규칙 관리
- `po-role`
  - goal packet completeness 분류
  - clarification loop 시작
  - 역할 비평 순서 고정
  - 구현 시작 승인 또는 보류 선언
  - user conversation과 final synthesis 소유
- `pm-role`
  - 문제 정의
  - 목표, 비범위, success metric
  - acceptance criteria
  - 테스트 가능한 public behavior 문장 검토
- `pd-role`
  - 카피, IA, CTA/폼 흐름
  - commercial landing critique
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
- `evaluator-role`
  - goal fit, evidence completeness, replayable evaluation 필요 여부
  - `quality-scorecard.md`의 independent release recommendation

## 역할별 TDD 기대치

- `po-role`
  - goal packet과 visual bar가 충분하지 않으면 구현을 시작하지 않게 합니다.
  - 질문이 필요한지, 설계로 돌아가야 하는지, build를 진행해도 되는지 판정합니다.
- `pm-role`
  - acceptance criteria를 구현자가 추가 해석 없이 테스트 가능한 문장으로 고정합니다.
- `pd-role`
  - happy path, edge state, 오류 문구가 public behavior 기준으로 검증 가능하도록 정리합니다.
- `fe-role`
  - `modules/*/model`, `actions`, `route` 경계의 핵심 상태 전이와 입력 처리를 먼저 실패시키는 계획을 적습니다.
- `be-role`
  - validation, use case, repository contract, adapter failure handling 중 무엇을 먼저 failing test로 고정할지 적습니다.

## 역할별 Enterprise Principles

- `po-role`
  - quality bar가 약하면 구현 보류를 기본값으로 둡니다.
  - 역할 간 충돌이 생기면 더 빠른 구현보다 더 좋은 goal fit을 우선합니다.
- `pm-role`
  - decision-complete 문서, 일관된 용어, 테스트 가능한 acceptance criteria를 기본값으로 둡니다.
- `pd-role`
  - CTA hierarchy, trust, accessibility, edge state completeness를 기본값으로 둡니다.
- `fe-role`
  - 작은 책임 단위, explicit UI/state boundary, composition-first 구조를 기본값으로 둡니다.
- `be-role`
  - validation/use case/repository 분리, encapsulated domain rule, explicit adapter contract를 기본값으로 둡니다.
- `evaluator-role`
  - weak proof를 추측으로 메우지 않고, 독립적으로 `ship | iterate | stop`을 남깁니다.
- `quality review`
  - 동작 확인만이 아니라 principle adherence와 verification evidence를 같이 봅니다.

## 역할 선택 규칙

- 사용자 흐름, 카피, 폼 변경: `PO + PM + PD + FE + evaluator`
- validation, persistence, analytics event, DB 영향 포함: `PO + PM + PD + FE + BE + evaluator`
- 순수 FE 리팩터링: `FE`만 허용 가능
- 순수 BE 리팩터링: `BE`만 허용 가능
- prompt, workflow, role topology 변경: `PO + PM + PD + evaluator`를 기본으로 시작하고 필요 시 `FE` 또는 `BE`를 추가

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
  goal-packet.md
  brief.md
  feature-spec.md
  team-plan.md
  ux-review.md
  frontend-spec.md
  backend-spec.md
  quality-scorecard.md
```

## Frontmatter 계약

모든 work item 문서는 아래 필드를 가진다.

- `owner`
  - 문서 유지 역할
- `doc_type`
  - `task-local`
- `source_of_truth`
  - 현재 작업 기준 문서 여부
- `freshness`
  - `active`, 필요 시 `review-needed`
- `verification`
  - 기본값은 `scripted`
- `status`
  - `draft`, `approved`, `in_progress`, `blocked`, `done`, `skipped`
- `owner_role`
  - `product-squad`, `po`, `pm`, `pd`, `fe`, `be`
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
2. 동시에 이 요청이 `product-config-friendly`인지, `deep code`가 필요한지 판단한다.
3. gated work면 `po-role`이 goal packet completeness를 `ready`, `needs-clarification`, `not-safe-to-build`로 분류한다.
4. clarifying loop나 설계 보강이 필요하면 구현보다 먼저 끝낸다.
5. gated work면 `work-id`를 만든다.
6. `goal-packet.md`로 입력을 정규화하고 delivery shape와 active/deferred scope를 먼저 고정한다.
7. `brief.md`를 만든다.
8. `team-plan.md`로 execution mode와 task graph를 먼저 정한다.
9. 필요한 역할 문서를 만든다.
10. 필요 없는 문서는 `skipped`로 남긴다.
11. `product-config-friendly`면 raw TSX나 deeper code보다 safe surface를 먼저 수정한다.
12. 구현 단위를 테스트 가능한 behavior slice로 자른다.
13. 중요한 작업과 핵심 로직 변경은 각 slice를 failing test로 먼저 고정한 뒤 최소 구현과 리팩터링을 진행한다.
14. user-facing 작업이면 browser QA evidence와 measurement check를 `quality-scorecard.md`에 남긴다.
15. prompt, workflow, role topology 변경이면 replayable evaluation evidence 또는 explicit skip reason을 남긴다.
16. `evaluator-role` 또는 동등한 reviewer가 `quality-scorecard.md`에 independent release recommendation을 남긴다.
17. non-user-facing 작업이어도 `quality-scorecard.md`에 test/docs sync/verify evidence를 남긴다.
18. 작업 종료 전에는 `pnpm repo:check --work <work-id>`와 `pnpm squad:check [work-id]`로 문서와 metadata가 placeholder 상태를 벗어났는지 확인한다.
19. 구현 중 scope가 바뀌면 관련 문서를 먼저 갱신한다.
20. 작업 종료 전에는 canonical 문서와 work item 문서 sync를 함께 확인하고 `pnpm verify` 또는 `pnpm verify:full`을 실행한다.

## Goal-Driven Review Loop

- 기능 아이디어보다 business goal을 먼저 고정합니다.
- role spec은 병렬 문서가 아니라 같은 문제를 다른 관점으로 검토하는 장치입니다.
- landing이나 강한 user-facing 작업은 `pd-role`의 commercial quality critique를 build gate 앞에 둡니다.
- 최종 판단은 `quality-scorecard.md`에 `ship | iterate | stop` 형태로 남기며, browser evidence뿐 아니라 test/docs sync/verify evidence도 같이 남깁니다.
- user-facing 변경은 browser QA evidence 없이 완료로 보지 않습니다.

## PD 범위 제한

- PD는 full brand system을 담당하지 않지만, first impression, trust, density, boilerplate smell critique는 기본 역할로 맡는다.
- 픽셀 단위 디자인 시스템, Figma 산출물, 브랜딩 리뉴얼은 범위 밖이다.

## V1 제외 범위

- 외부 PM 툴 연동
- 백그라운드 에이전트
- 별도 멀티에이전트 오케스트레이션 서비스
