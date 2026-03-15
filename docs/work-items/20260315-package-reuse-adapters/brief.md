---
status: done
owner_role: pm
source_request: "packages/ab-test, packages/user-behavior-log 위 두개 패키지 다른 프로젝트에서 가져온 패키지야 이 보일러플레이트에서 사용가능한 형태로 재가공가능?"
affected_paths:
  - packages/ab-test
  - packages/user-behavior-log
  - docs/architecture.md
dependencies:
  - ai/context/spec-driven.md
  - ai/context/engineering-backend.md
  - ai/context/doc-sync.md
skip_reason: null
---

# Brief

## Problem

- `packages/ab-test`, `packages/user-behavior-log`는 다른 모노레포에서 그대로 복사된 상태라 현재 워크스페이스 명명 규칙, 타입스크립트 설정, 의존 패키지 체계와 맞지 않는다.
- 특히 `user-behavior-log`에는 현재 저장소에 없는 사내 유틸과 서비스 특화 taxonomy가 섞여 있어, 그대로 두면 패키지 목적보다 이식 비용이 더 커진다.

## Target User

- 이 보일러플레이트에서 실험 배정과 사용자 행동 로깅을 빠르게 재사용하려는 개발자
- 다음 사이드 프로젝트에서도 같은 패키지를 복제해 쓰고 싶은 1인 개발자 또는 작은 제품팀

## Goal

- `ab-test`는 앱이 실험 정의를 주입하면 바로 사용할 수 있는 generic AB test 패키지로 정리한다.
- `user-behavior-log`는 불필요한 서비스 전용 모듈을 제거하고, page view / click / impression 중심의 generic behavior logger로 축소한다.
- 두 패키지 모두 현재 `@pmf/*` 워크스페이스 규칙과 검증 흐름에 맞춰 타입체크와 테스트가 가능한 상태로 만든다.

## Non-Goals

- 가져온 프로젝트의 모든 legacy helper와 taxonomy를 보존하는 것
- 현재 `apps/web` 전체를 새 패키지로 즉시 마이그레이션하는 것
- 새 외부 SaaS, 새 인프라, 새 저장소 계층을 추가하는 것
- analytics schema나 DB 구조를 이번 작업에서 변경하는 것

## Success Metric

- 두 패키지가 현 워크스페이스에서 설치 가능하고 `pnpm --filter` 기준 테스트/타입체크가 통과한다.
- `ab-test`는 앱 밖 패키지 코드 수정 없이 실험 정의만 주입해 사용할 수 있다.
- `user-behavior-log`는 현재 저장소에 없는 외부 유틸 없이 generic sender 주입만으로 동작한다.

## Acceptance Criteria

- `packages/ab-test`는 `@pmf/ab-test`로 정리되고, 하드코딩된 특정 서비스 실험 정책 없이 middleware와 client/server helper를 제공한다.
- `packages/user-behavior-log`는 `@pmf/user-behavior-log`로 정리되고, 사내 전용 import를 제거한 generic event logger와 React helper만 남긴다.
- 두 패키지의 public API 이름은 현재 보일러플레이트 맥락에서 역할이 드러나며, README가 새 사용법을 설명한다.
- 구조 변경에 필요한 문서 영향은 최소 범위에서 같이 갱신한다.
- 검증은 적어도 두 패키지의 테스트와 타입체크를 포함한다.

## Open Questions

- 이번 작업에서는 패키지를 사용 가능한 상태까지 정리하고, 실제 `apps/web` 연동은 후속 작업으로 분리한다.
