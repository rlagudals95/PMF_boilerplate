# Engineering Backend

이 문서는 domain, schema, repository, integration, adapter 계층에 적용되는 backend 규칙을 다룹니다.

현재 저장소에서는 주로 아래 위치를 예시로 사용합니다.

- `packages/core`
- `packages/db`
- `packages/analytics`
- `packages/error-logging`

그러나 이 규칙은 미래에 backend가 별도 repo로 옮겨가더라도 그대로 유지될 수 있어야 합니다.
엄격한하게 OOP 기준을 따라 개발하고 클린코드를 준수합니다.

## 목적

- backend/domain/infrastructure 규칙을 FE 문서와 분리한다.
- monorepo 안에서도 extract-ready한 backend 구조를 유지한다.

## 적용 범위

- domain types, schema, mapper
- persistence, repository, DB client
- analytics, error logging, 외부 integration adapter
- backend use case와 boundary validation

## 백엔드 계층 모델

권장 경계는 아래와 같습니다.

```txt
boundary -> application/use case -> domain -> infrastructure
```

현재 저장소 예시:

- boundary: server action, route handler, importable service entry
- application/use case: 입력 처리, orchestration, 상태 전이
- domain: type, schema, mapper, entity 규칙
- infrastructure: DB client, repository, analytics adapter, error logging adapter

## domain/application/infrastructure 책임

- domain
  - framework-independent 해야 한다
  - 비즈니스 의미와 데이터 형태를 정의한다
- application/use case
  - 입력을 받아 domain 규칙과 infrastructure를 조합한다
  - orchestration과 상태 전이를 담당한다
- infrastructure
  - persistence, 외부 provider 연동, adapter 구현을 담당한다

금지:

- domain이 frontend-specific import나 Next runtime 전제를 가지는 것
- repository가 UI 또는 route entry를 참조하는 것
- infrastructure 구현이 domain 규칙을 소유하는 것

## schema/repository/use case 규칙

- 입력 검증은 boundary에서 수행한다.
- persistence는 repository/client 계층에서 담당한다.
- use case는 validation 결과와 repository, adapter를 조합한다.
- schema, repository, use case naming은 역할이 드러나야 한다.
- 일반화되지 않은 repository abstraction은 성급하게 도입하지 않는다.

## validation / input-output 경계

- boundary에서 input을 검증한다.
- 내부에서는 검증된 타입을 사용한다.
- 외부 provider로 나가는 output은 adapter 경계에서 정규화한다.
- validation, business rule, persistence를 한 함수에 몰아넣지 않는다.

## adapter / integration 규칙

- analytics, error logging, 외부 서비스는 adapter로 분리한다.
- 내부 기준 인터페이스를 먼저 정의하고 provider는 선택적으로 연결한다.
- 외부 provider 실패가 핵심 흐름을 깨지 않게 한다.
- provider-specific 세부사항은 domain이나 application 본문에 새지 않게 한다.

## migration / extraction 관점

- backend는 현재 monorepo package로 존재하지만, 구조 원칙은 별도 backend repo로 이전 가능해야 한다.
- frontend-specific import나 Next runtime 전제를 domain/backend 규칙에 넣지 않는다.
- path 예시는 현재 저장소 기준이되, 규칙 설명은 path-agnostic하게 쓴다.

추후 분리 시 옮겨야 할 최소 단위 예시:

- `packages/core`
- `packages/db`
- `packages/analytics`
- `packages/error-logging`
- backend use case 계층

## BE Checklist

- domain 규칙이 framework-independent한가
- validation과 persistence가 분리되어 있는가
- repository와 adapter 책임이 명확한가
- 외부 provider 실패가 핵심 흐름을 깨지 않는가
- `packages/*`가 `apps/web/*`에 의존하지 않는가
- backend를 별도 repo로 옮겨도 유지될 구조인가
