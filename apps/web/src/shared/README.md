# Shared

`apps/web/src/shared`는 `apps/web` 내부에서 두 개 이상 모듈이나 route가 함께 쓰는 app-local 코드를 둡니다.

## 목적

- 모듈 간 직접 참조를 막고 재사용 지점을 한 곳으로 모은다.
- `packages/*`로 올리기에는 이르지만, 이미 여러 기능에서 쓰이는 코드를 관리한다.
- strict FSD 대신 `Hybrid FSD Lite`에서 필요한 최소 공용 계층을 제공한다.

## 하위 폴더

```txt
shared/
  ui/      # app-local shared UI
  lib/     # hooks, client helpers, small shared utilities
  api/     # shared server action entrypoint
  types/   # shared app-local types
```

## `shared`와 `lib`의 차이

- `shared/*`: 여러 모듈이 직접 import하는 app-local 재사용 코드
- `src/lib/*`: analytics, env, client wiring처럼 앱 전역 인프라 조립 코드

예시:

- `shared/ui/tracked-link.tsx`
- `shared/lib/use-funnel.tsx`
- `shared/api/track-event-action.ts`
- `lib/analytics.ts`
- `lib/app-config.ts`
- `lib/supabase/client.ts`
