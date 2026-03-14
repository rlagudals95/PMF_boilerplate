# Engineering Guide

이 문서는 이 저장소의 엔지니어링 규칙을 어떤 순서로 읽어야 하는지 안내하는 canonical entry입니다.
세부 규칙의 본문은 아래 세 문서로 분리합니다.

- `ai/context/engineering-common.md`
- `ai/context/engineering-frontend.md`
- `ai/context/engineering-backend.md`

## 목적

- FE 규칙과 BE 규칙을 분리해 검색성과 재사용성을 높인다.
- backend가 미래에 별도 repo로 옮겨가더라도 규칙 문서를 최대한 그대로 가져갈 수 있게 한다.
- 공통 규칙은 한 곳에만 두고, 플랫폼별 세부 규칙은 각 문서에 분리한다.

## 문서 분리 원칙

- 분리는 배포 단위가 아니라 책임 경계 기준으로 한다.
- 공통 규칙은 `engineering-common.md`에만 둔다.
- `apps/web`에 강하게 묶인 규칙은 `engineering-frontend.md`에 둔다.
- domain, schema, repository, integration, adapter 규칙은 `engineering-backend.md`에 둔다.
- 구조 규칙을 바꾸면 관련 문서도 함께 갱신한다.

## 추천 로드 순서

기본 순서:

1. `ai/context/project.md`
2. 이 문서
3. `ai/context/engineering-common.md`
4. `ai/context/spec-driven.md`
5. 작업에 맞는 FE/BE 문서
6. `ai/context/doc-sync.md`
7. `ai/skills/_index.md`
8. 관련 스킬 문서
9. 관련 `docs/*`와 실제 영향 파일

## 어떤 작업에 어떤 문서를 읽는가

- FE 작업
  - `engineering-common.md`
  - `spec-driven.md`
  - `engineering-frontend.md`
- DB/schema/repository/integration 작업
  - `engineering-common.md`
  - `spec-driven.md`
  - `engineering-backend.md`
- full-stack 작업
  - `engineering-common.md`
  - `spec-driven.md`
  - `engineering-frontend.md`
  - `engineering-backend.md`

## 공통 핵심 가드레일 요약

- 코드 변경 전에는 관련 문서와 실제 영향 파일을 먼저 읽는다.
- 중요한 작업은 spec 존재 여부를 먼저 확인한다.
- 공통 규칙은 한 문서에만 두고 중복 복붙하지 않는다.
- 추상화는 재사용 근거가 있을 때만 도입한다.
- 구조 규칙이 바뀌면 canonical context와 관련 아키텍처 문서를 함께 갱신한다.
- FE와 BE 규칙은 분리하되, 둘 다 공통 품질 기준을 따른다.
