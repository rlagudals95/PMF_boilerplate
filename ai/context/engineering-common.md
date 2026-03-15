# Engineering Common

이 문서는 FE와 BE 모두에 적용되는 공통 엔지니어링 규칙을 다룹니다.

## 목적

- FE/BE에 공통으로 적용되는 품질 기준을 한 곳에 둔다.
- 문서 중복을 줄이고, 공통 가드레일의 canonical source 역할을 한다.

## 공통 설계 원칙

- public API 이름은 역할이 드러나야 한다.
- 한 파일이 여러 책임을 동시에 가지면 분리한다.
- 변경 단위는 작고 명확해야 한다.
- 경계에서 입력을 검증하고, 내부 규칙과 저장을 분리한다.
- 공통화는 가치가 확인된 뒤에만 수행한다.

## 추상화 도입 기준

- 새 추상화는 최소 두 번째 사용 사례가 보일 때만 도입한다.
- 공통화 승격 순서는 `로컬 -> app-local/shared -> package`다.
- speculative abstraction, placeholder abstraction은 만들지 않는다.
- 한 번 쓰고 끝날 규칙이나 구조는 문서나 local module에 남긴다.

## 네이밍 규칙

- UI 컴포넌트: PascalCase
- 함수/변수: camelCase
- DB 컬럼: snake_case
- 파일명은 역할이 드러나야 한다.
- `utils.ts`, `helpers.ts`, `misc.ts` 같은 포괄적 이름을 기본값으로 쓰지 않는다.

## 에러 처리 원칙

- 에러는 무시하지 않는다.
- 사용자 영향이 있는 에러와 운영 관찰이 필요한 에러를 구분한다.
- 외부 provider 실패가 핵심 사용자 흐름을 깨지 않게 한다.
- 로깅과 보고는 domain logic과 분리된 adapter나 infrastructure를 통해 수행한다.

## 테스트/검증 원칙

- 코드 변경 시 타입, 테스트, 문서 영향을 같이 검토한다.
- 가능한 범위에서 lint, typecheck, 관련 테스트를 확인한다.
- 테스트는 구현 디테일보다 public behavior와 경계를 검증해야 한다.
- 중요한 작업과 핵심 로직 변경은 가능하면 failing test로 시작한다.
- 기본 흐름은 `spec -> failing test -> minimal implementation -> refactor -> verify`다.
- TDD 적용 우선순위는 `domain/use case/boundary -> adapter -> route/action -> UI`다.
- 단순 카피 수정, 시맨틱 변화 없는 스타일 수정, 명백한 소규모 버그 수정에는 full TDD를 강제하지 않는다.
- snapshot 위주의 취약한 테스트나 implementation detail mocking에만 의존하는 테스트를 기본 전략으로 삼지 않는다.

## 문서화 원칙

- 구조 규칙이 바뀌면 관련 문서를 함께 갱신한다.
- 같은 규칙을 여러 파일에 그대로 복제하지 않는다.
- task-local 문서와 canonical context의 역할을 섞지 않는다.

## Done Checklist

- 변경이 하나의 사용자 흐름 또는 하나의 경계 안에 머무는가
- 검증과 저장이 분리되어 있는가
- 불필요한 추상화나 범용화가 추가되지 않았는가
- dead code, speculative TODO, 미사용 경로가 남지 않았는가
- 필요한 문서와 테스트가 같이 갱신되었는가
