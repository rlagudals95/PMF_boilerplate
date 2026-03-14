# Modules

`apps/web/src/modules`는 `apps/web` 안의 도메인별 feature slice를 두는 위치입니다.

## 목적

- `app/`에서 프레임워크 코드와 도메인 로직을 분리한다.
- FE와 BE 코드를 기능 단위로 함께 배치한다.
- AI가 수정할 때도 자연스럽게 같은 경계 안에서 작업하게 만든다.
- strict FSD 대신 `Hybrid FSD Lite` 방식으로 기능 경계를 유지한다.

## 예시 구조

```txt
modules/
  lead/
    ui/
    model/
    actions/
  consultation/
  payment/
  admin/
  landing/
```

## 규칙

- 특정 기능 전용 UI는 먼저 해당 모듈의 `ui/`에 둔다.
- 기능 전용 유스케이스와 상태 로직은 먼저 해당 모듈의 `model/`에 둔다.
- 모듈 밖으로 꺼낼 코드는 두 번 이상 재사용될 때만 검토한다.
- `page.tsx`나 `route.ts`는 이 모듈들을 조합하는 entrypoint 역할만 한다.
- 공용 코드는 `src/shared/*`로 올리고, 앱 인프라 wiring만 `src/lib/*`에 둔다.
