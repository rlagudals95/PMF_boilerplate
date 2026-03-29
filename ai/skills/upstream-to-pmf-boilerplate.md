---
owner: "platform"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: Upstream To PMF Boilerplate

## Use when

- `pmf-boilerplate` 기반 다른 서비스 레포에서 만든 기능이나 패턴을 이 보일러플레이트에도 반영하고 싶을 때
- 사용자 요청이 "보일러플레이트에도 넣자", "스타터에 반영하자", "upstream 하자"에 가깝고, 제품 전용 구현을 공용 구조로 다시 정리해야 할 때
- UI 패턴, 모듈 구조, 폼 흐름, schema/repository 변경, 운영 워크플로우 중 재사용 가치가 있는 것을 현재 repo에 역이식해야 할 때

## Read first

1. 현재 작업 중인 서비스 레포의 관련 구현과 영향 파일
2. `AGENTS.md`
3. `ai/context/project.md`
4. `ai/context/ai-native.md`
5. `ai/context/engineering.md`
6. `ai/context/engineering-common.md`
7. `ai/context/spec-driven.md`
8. `ai/context/doc-sync.md`
9. 작업 성격에 맞는 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md`
10. 관련 `docs/*`와 패키지 문서

## Goal

- 현재 서비스에서 검증된 아이디어를 보일러플레이트에 재사용 가능한 형태로만 반영한다.
- 제품 전용 코드와 공용 코드를 분리해 다음 사이드 프로젝트에서도 바로 쓸 수 있게 만든다.
- 공용화 과정에서 과한 추상화나 금지 복잡도를 끌고 오지 않는다.

## Promotion checklist

업스트림하기 전에 아래를 확인한다.

- 두 번째 사용 사례가 보이거나, 최소한 다음 서비스에서도 바로 쓸 가능성이 높다
- 특정 제품명, 카피, slug, 실험 식별자, 고객사 운영 정책 없이도 성립한다
- 랜딩, 리드 수집, 상담/운영, 결제, 실험 루프 중 하나를 더 잘 돌게 해준다
- 복잡한 auth, background jobs, CMS, 무거운 design system, vendor lock-in을 끌고 오지 않는다
- 공통화 위치가 과하지 않다
  - 기본 승격 순서는 `module -> shared -> package`

하나라도 애매하면 먼저 "무엇을 올리고 무엇을 남길지"를 짧게 고정한다.

## Workflow

1. Candidate를 요약한다.
   - 현재 서비스에서 어떤 문제를 해결했는지
   - 왜 보일러플레이트 가치가 있는지
   - 무엇은 서비스 전용이라 제외할지
2. 현재 구현을 감사한다.
   - 영향 파일
   - env, analytics, schema, repository, copy, seed 의존성
   - 테스트와 failure mode
3. 타깃 설계를 정한다.
   - `apps/web/src/modules/*`, `apps/web/src/shared/*`, `apps/web/src/lib/*`, `packages/*` 중 어디에 둘지 결정한다
   - 다중 경계 변경이나 구조 변경이면 관련 spec이나 work item 문서를 먼저 만든다
4. 일반화해서 이식한다.
   - 제품 전용 네이밍과 하드코딩을 제거한다
   - 가능한 가장 작은 수직 slice만 옮긴다
   - 현재 서비스 구현을 그대로 복붙하지 말고 이 repo 구조에 맞춰 재배치한다
5. 문서를 sync한다.
   - 구조/운영 규칙이 바뀌면 canonical 문서를 갱신한다
   - 기능 흐름이 바뀌면 관련 task-local 문서도 같이 갱신한다
6. 검증한다.
   - 최소한 관련 typecheck, 테스트, 검증 명령을 실행한다
   - `ai/`나 adapter entry가 바뀌면 `pnpm ai:sync`를 실행한다
7. 결과를 정리한다.
   - boilerplate에 들어간 것
   - 의도적으로 올리지 않은 것
   - follow-up이 필요한 것

## Guardrails

- git history나 commit 단위 이식보다 현재 repo 구조에 맞는 결과를 우선한다
- 서비스 전용 copy, 실험 식별자, 임시 우회 코드를 공용 규칙처럼 올리지 않는다
- 새 패키지나 새 추상화를 "언젠가 쓸 수도 있어서" 추가하지 않는다
- boilerplate 수정과 현재 서비스 대규모 리팩터링을 한 번에 묶지 않는다
- 현재 서비스 규칙보다 이 repo의 canonical 문서와 구조 원칙을 우선한다

## Output contract

최종 답변에는 아래를 분리해서 남긴다.

- 무엇을 boilerplate로 올렸는가
- 무엇을 의도적으로 남겼는가
- 어떤 문서 sync와 검증을 했는가
