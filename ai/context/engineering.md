---
owner: "platform"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Engineering Guardrails

이 문서는 이 저장소의 엔지니어링 규칙 entrypoint입니다.

운영 모델, 역할 게이트, goal packet, release 판단의 canonical source는 `ai/context/ai-native.md`이고, 이 문서는 그 위에서 실제 코드 수정 시 어떤 구조와 책임 분리를 지켜야 하는지 정의합니다.

## 목적

- AI가 빠르게 수정해도 구조가 무너지지 않게 한다.
- FE/BE를 함께 다루더라도 경계, 책임, 검증 순서가 흐려지지 않게 한다.
- PMF 탐색 속도를 해치지 않는 선에서 엔터프라이즈급 코드 품질을 유지한다.

## 이 문서의 역할

- `ai/context/ai-native.md`
  - 중요한 작업의 operating model, goal packet, 역할 게이트, quality bar
- `docs/product-squad/*`
  - gated work의 task-local workflow와 quality gate
- `ai/context/engineering.md`
  - 코드 구조와 엔지니어링 수정 규칙의 entrypoint
- `ai/context/engineering-common.md`
  - FE/BE 공통 설계 원칙과 테스트/검증 기준
- `ai/context/engineering-frontend.md`
  - `apps/web` FE 구조 규칙
- `ai/context/engineering-backend.md`
  - domain, validation, persistence, adapter 규칙

즉 business-goal-driven 판단은 `ai-native`와 `product-squad`가 먼저 소유하고, 이 문서는 그 결정이 코드에 들어갈 때의 구조 가드레일을 소유합니다.

## 언제 먼저 읽는가

- 여러 파일에 걸친 기능 작업을 시작할 때
- FE/BE를 같이 건드는 작업일 때
- 구조가 흐트러질 위험이 있는 빠른 수정 작업일 때

권장 순서는 아래입니다.

1. `ai/context/project.md`
2. `ai/context/ai-native.md`
3. 이 문서
4. `ai/context/engineering-common.md`
5. `ai/context/spec-driven.md`
6. 작업에 맞는 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md`
7. `ai/context/doc-sync.md`
8. 중요한 작업이면 `docs/product-squad/operating-model.md`
9. goal-driven 제품 작업이면 `docs/product-squad/goal-driven-delivery.md`
10. 역할 handoff나 병렬 탐색이 중요하면 `docs/product-squad/agent-team-delivery.md`

## 기본 구조

이 저장소는 `Next.js App Router` 기반의 modular monolith를 지향합니다.

- `apps/web/src/app`
  - route segment, `page.tsx`, `layout.tsx`, `route.ts` 같은 framework entry만 둡니다.
  - 화면 조합, request entry, metadata 같은 프레임워크 코드를 담당합니다.
  - 비즈니스 규칙, DB 접근, 큰 폼 로직을 직접 소유하지 않습니다.
- `apps/web/src/modules`
  - 제품 기능을 도메인별 vertical slice로 둡니다.
  - 기능별 UI, action, model, query, schema는 가능한 한 이 경계 안에 둡니다.
- `apps/web/src/shared`
  - app-local 공용 UI, hook, helper, type을 둡니다.
  - cross-feature 재사용이 검증된 app-local 자산만 둡니다.
- `apps/web/src/lib`
  - env, auth bootstrap, analytics wiring, framework helper 같은 앱 전역 인프라만 둡니다.
  - 도메인 규칙을 넣지 않습니다.
- `packages/*`
  - 두 번 이상 재사용되거나 앱 경계를 넘는 타입, schema, DB, UI, adapter만 둡니다.
  - 재사용이 검증되기 전에는 `apps/web/src/modules/*` 또는 `apps/web/src/shared/*`에 남깁니다.

## 기본 의존 방향

의존 방향은 아래처럼 유지합니다.

```txt
app -> modules -> shared/lib -> packages
```

중요한 건 경계의 의미입니다.

- `app/`은 얇은 entry여야 합니다.
- `modules/`는 feature/domain 책임을 가집니다.
- `shared/`는 app-local 재사용 경계입니다.
- `lib/`는 인프라 wiring 경계입니다.
- `packages/`는 cross-app 또는 extract-ready 재사용 경계입니다.

## 금지 패턴

- `packages/*`가 `apps/web/*`를 참조하는 것
- `page.tsx`나 `layout.tsx`에서 직접 DB repository를 호출하는 것
- route handler나 server action 안에 검증, 비즈니스 규칙, 저장 로직을 한꺼번에 넣는 것
- 공통성이 검증되지 않은 코드를 성급하게 `packages/*`로 올리는 것
- `utils.ts`, `helpers.ts`, `misc.ts` 같은 포괄적 파일명을 기본값으로 쓰는 것
- engineering convenience를 이유로 `po-role`, `pd-role`, `evaluator-role` quality gate를 우회하는 것

## FE/BE 수정 원칙

Next 안에서 FE와 BE를 함께 다룰 때 아래 기준을 지킵니다.

- 화면은 입력과 상태 표시를 담당합니다.
- server action과 route handler는 entrypoint 역할만 합니다.
- 유스케이스와 상태 전이는 모듈 model/service 또는 적절한 application layer에 둡니다.
- 저장소 접근은 `packages/db` 또는 그 위의 얇은 조합 계층을 통해 이뤄집니다.
- 입력 검증은 Zod로 경계에서 수행합니다.
- 외부 서비스 실패가 핵심 사용자 흐름을 깨지 않게 합니다.
- 제품 카피, trust surface, CTA hierarchy처럼 여러 화면에 걸친 user-facing 결정은 raw TSX literal보다 `product-config` 같은 단일 surface를 우선합니다.

## Gated Work와 Engineering의 관계

이 문서는 gated work 자체를 판정하지 않습니다. 그 판단은 `po-role`과 `product-squad`가 합니다.

다만 gated work가 시작되면 엔지니어링 관점에서는 아래를 지킵니다.

- `goal packet`, `brief`, 필요한 role spec이 준비되기 전에는 구조 변경을 시작하지 않습니다.
- `po-role` 승인 전에는 구현을 시작하지 않습니다.
- landing 같은 user-facing surface는 `pd-role` critique와 browser evidence를 우회하지 않습니다.
- 최종 완료는 `evaluator-role` 또는 동등한 independent reviewer의 release recommendation 없이 닫지 않습니다.

## 수정 절차

### 코드 변경 전

1. `ai/context/project.md`
2. `ai/context/ai-native.md`
3. 이 문서
4. `ai/context/engineering-common.md`
5. 작업에 맞는 `engineering-frontend.md`, `engineering-backend.md`
6. `ai/context/spec-driven.md`
7. `ai/context/doc-sync.md`
8. 관련 `docs/*`와 실제 영향 파일

중요한 작업이면 여기에 더해 아래를 읽습니다.

- `docs/product-squad/operating-model.md`
- `docs/product-squad/goal-driven-delivery.md`
- 필요 시 `docs/product-squad/agent-team-delivery.md`
- 활성 work item이 있으면 `docs/work-items/<work-id>/*.md`

### 코드 변경 중

- 먼저 기존 구조에 맞는 위치를 찾고, 새 폴더는 정말 필요할 때만 추가합니다.
- UI 수정과 패키지 추상화 추가를 한 변경 단위에 섞지 않습니다.
- `product-config-friendly` 작업이면 raw TSX보다 안전한 surface를 먼저 수정합니다.
- 파일 이동 시 import, test, docs를 함께 정리합니다.
- 구조 단순화를 위해 책임을 더 작은 단위로 쪼개는 것은 허용하지만, unrelated refactor는 넣지 않습니다.

### 코드 변경 후

- lint, typecheck, 관련 테스트를 가능한 범위에서 확인합니다.
- 구조 규칙을 바꿨다면 `docs/architecture.md`도 같이 수정합니다.
- 운영 규칙이나 AI 컨텍스트가 바뀌었으면 관련 canonical 문서와 adapter sync를 확인합니다.
- 새로운 반복 패턴이 생기면 `ai/skills` 승격 후보인지 검토합니다.

## Verification Expectations

- 기본 검증은 `pnpm verify`입니다.
- canonical context, skill, work item contract, generated adapter에 영향이 있으면 `pnpm repo:check`를 함께 실행합니다.
- `ai/context/*`, `ai/skills/*`, `ai/agents/*`를 바꿨다면 `pnpm ai:sync`를 실행합니다.
- 중요한 작업 문서 completeness는 필요 시 `pnpm squad:check [work-id]`로 확인합니다.

## Done Checklist

아래를 모두 통과하지 못하면 완료로 간주하지 않습니다.

- 변경이 하나의 사용자 흐름 또는 하나의 패키지 경계 안에 머무는가
- `app/`이 얇게 유지되는가
- 도메인 로직이 `modules`, `shared`, `packages`의 적절한 계층에 있는가
- 검증과 저장이 분리되어 있는가
- 불필요한 추상화나 범용화가 추가되지 않았는가
- gated work라면 필요한 문서와 quality gate가 같이 갱신되었는가
- 필요한 문서와 테스트가 같이 갱신되었는가
