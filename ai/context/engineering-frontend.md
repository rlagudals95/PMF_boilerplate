# Engineering Frontend

이 문서는 `apps/web`에 적용되는 FE 구조 규칙을 다룹니다.

## 목적

- `apps/web` 안의 FE 수정 규칙을 명확하게 정의한다.
- `Next.js App Router`와 `Hybrid FSD Lite` 구조를 안정적으로 유지한다.

## 적용 범위

- `apps/web/src/app`
- `apps/web/src/modules`
- `apps/web/src/shared`
- `apps/web/src/lib`

## 기본 구조

이 저장소의 FE는 `Next.js App Router` 기반 modular monolith 위에서 `Hybrid FSD Lite` 방식으로 구성합니다.

```txt
apps/web/src/
  app/        # route entry, layout, page, route.ts
  modules/    # feature slice
  shared/     # app-local shared UI, hooks, actions, types
  lib/        # app-wide infrastructure wiring
```

## Hybrid FSD Lite 규칙

- `app/`은 route entry와 조합만 담당한다.
- 기능 코드는 `modules/*`에 둔다.
- app-local 공용 코드는 `shared/*`에 둔다.
- 인프라 wiring은 `lib/*`에 둔다.
- strict FSD의 `entities / features / widgets / pages` 레이어를 강제하지 않는다.
- 재사용 승격은 `module -> shared -> package` 순서를 따른다.

## route/page/layout 책임

- `page.tsx`, `layout.tsx`
  - 화면 조합, metadata, entry wiring
- `route.ts`
  - request entry, auth/session 확인, use case 호출
- `modules/*/ui`
  - feature 전용 UI
- `modules/*/model`
  - feature 전용 상태와 유스케이스

금지:

- `page.tsx`에서 직접 DB repository 호출
- `layout.tsx`에 도메인 규칙 누적
- 큰 JSX 블록과 유스케이스를 route entry에 함께 두는 것

## server action 규칙

- server action은 entrypoint 역할만 한다.
- `app/actions.ts`처럼 모든 흐름을 한 파일에 모으지 않는다.
- feature 전용 action은 `modules/*/actions`에 둔다.
- 여러 feature가 공유하는 action은 `shared/api`에 둔다.
- validation, domain rule, persistence를 한 action 파일에 모두 섞지 않는다.

## UI/상태 배치 규칙

- feature 전용 form, block, page 조합은 먼저 `modules/*/ui`에 둔다.
- `TrackedLink`, `PageViewTracker`, app-local hook 같은 cross-feature 코드는 `shared/*`로 올린다.
- `src/components` 같은 광범위 공용 폴더는 다시 만들지 않는다.
- `modules/*` direct import로 cross-feature 공유하지 않는다.
- client/server component 경계는 React/Next 제약 기준으로 나눈다.
- shared UI와 app shell에서는 raw brand color utility를 직접 쓰지 않고, 서비스 테마는 `apps/web/src/lib/app-theme.ts`에서 관리한다.

## FE Checklist

- `app/`이 얇게 유지되는가
- feature 코드는 `modules/*`에 있는가
- cross-feature 공용 코드는 `shared/*`에 있는가
- `lib/*`가 인프라 wiring 역할만 하는가
- `app/actions.ts`나 `src/components` 같은 금지 패턴이 다시 생기지 않았는가
