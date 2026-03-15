# Work Items

중요한 작업은 이 폴더 아래에 `docs/work-items/<work-id>/` 형태로 관리합니다.

## Naming

- 기본 형식: `YYYYMMDD-short-slug`
- 실험 작업: `LP-001-YYYYMMDD-short-slug`

## Quick Start

```bash
pnpm work:new <short-slug> --request "원 요청 또는 작업 배경"
pnpm feature:new --prd <prd-slug>
```

- 위 명령은 `docs/product-squad/templates/*`를 복사해 새 work item 디렉터리를 만듭니다.
- `pnpm feature:new --prd <prd-slug>`는 role spec 4종에 더해 `feature-spec.md`까지 같이 생성합니다.
- 중요한 작업이면 이 scaffold를 만든 뒤 문서를 채우고, 구현 단위를 테스트 가능한 behavior slice로 자른 뒤 진행합니다.
- 기본 구현 루프는 `spec -> failing test -> minimal implementation -> refactor -> verify`입니다.
- `frontend-spec.md`, `backend-spec.md`, `feature-spec.md`에는 어떤 behavior를 먼저 failing test로 고정할지 적어야 합니다.

## Required files

- `brief.md`
- `feature-spec.md` (PRD 기반 feature 작업이면 필수)
- `ux-review.md`
- `frontend-spec.md`
- `backend-spec.md`

필요하지 않은 문서는 삭제하지 말고 `status: skipped`와 `skip_reason`을 채워 둡니다.

## Source of truth

- 구현 전 기준 문서는 항상 최신 `brief.md`입니다.
- PRD 기반 작업에서는 `docs/prds/<slug>.md`와 `feature-spec.md`가 brief를 보완하는 task-local source입니다.
- 각 역할 문서는 `docs/product-squad/templates/*.md`를 복사해서 시작합니다.
- 중요한 작업과 핵심 로직 변경은 문서에 적힌 behavior slice를 먼저 failing test로 고정한 뒤 최소 구현을 추가합니다.
- 구현 중 scope가 바뀌면 코드보다 문서를 먼저 갱신합니다.
