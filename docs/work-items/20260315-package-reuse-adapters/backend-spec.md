---
status: done
owner_role: be
source_request: "packages/ab-test, packages/user-behavior-log 위 두개 패키지 다른 프로젝트에서 가져온 패키지야 이 보일러플레이트에서 사용가능한 형태로 재가공가능?"
affected_paths:
  - packages/ab-test
  - packages/user-behavior-log
  - docs/architecture.md
dependencies:
  - docs/work-items/20260315-package-reuse-adapters/brief.md
skip_reason: null
---

# Backend Spec

## Package Boundary Plan

- `packages/ab-test`
  - 앱 특화 정책 정의 파일은 제거하고, generic experiment definition과 assignment engine만 남긴다.
  - middleware는 request/response cookie boundary만 다루고, 앱이 제공한 실험 정의를 기준으로 배정한다.
  - client/server helper는 cookie 값을 읽는 역할만 수행한다.
- `packages/user-behavior-log`
  - log sender, event model, metadata merge, React helper를 중심으로 다시 구성한다.
  - 현재 저장소에 없는 `@repo/hooks`, `@repo/utils`, `@repo/error-sentinel` 같은 의존성은 제거한다.
  - 패키지 내부에서 provider, DB, app route를 직접 알지 못하게 하고 sender injection으로 끝낸다.

## Validation And Data Rules

- `ab-test`는 실험 정의의 variant weight와 feature key 형식을 boundary에서 검증해야 한다.
- `user-behavior-log`는 입력 이벤트 이름과 공통 metadata merge만 책임지고, persistence/analytics provider 호출은 주입된 sender로 위임한다.
- 이번 작업에서는 DB schema와 repository는 변경하지 않는다.

## Failure Modes

- 잘못된 AB test 정의는 middleware 실행 전에 명확한 에러를 반환해야 한다.
- cookie가 없거나 일부 실험 값이 비어 있어도 helper는 빈 assignment 맵을 반환해야 한다.
- behavior log sender 실패는 패키지 내부에서 삼키지 않고 caller가 선택적으로 처리할 수 있게 둔다.
- 브라우저 전용 helper는 SSR 환경에서 안전하게 no-op 또는 빈 결과를 반환해야 한다.

## Test Plan

- `ab-test`
  - independent / exclusive assignment가 기대한 cookie를 설정하는지 먼저 검증한다.
  - disabled experiment cleanup과 invalid definition rejection을 검증한다.
- `user-behavior-log`
  - generic logger가 base metadata와 event-specific payload를 올바르게 합치는지 검증한다.
  - page view / click / impression helper가 sender에 기대한 event를 넘기는지 검증한다.
  - React helper는 브라우저 의존이 있는 부분만 최소 행동 테스트로 검증한다.

## Docs Sync

- 패키지 경계가 저장소의 재사용 가능한 표준 패키지로 유지될 수 있도록 `docs/architecture.md`에 새 패키지 목적을 짧게 반영한다.
