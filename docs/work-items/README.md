# Work Items

중요한 작업은 이 폴더 아래에 `docs/work-items/<work-id>/` 형태로 관리합니다.

## Naming

- 기본 형식: `YYYYMMDD-short-slug`
- 실험 작업: `LP-001-YYYYMMDD-short-slug`

## Quick Start

```bash
pnpm work:new <short-slug> --request "원 요청 또는 작업 배경"
```

- 위 명령은 `docs/product-squad/templates/*`를 복사해 새 work item 디렉터리를 만듭니다.
- 중요한 작업이면 이 scaffold를 만든 뒤 문서를 채우고 구현을 시작합니다.

## Required files

- `brief.md`
- `ux-review.md`
- `frontend-spec.md`
- `backend-spec.md`

필요하지 않은 문서는 삭제하지 말고 `status: skipped`와 `skip_reason`을 채워 둡니다.

## Source of truth

- 구현 전 기준 문서는 항상 최신 `brief.md`입니다.
- 각 역할 문서는 `docs/product-squad/templates/*.md`를 복사해서 시작합니다.
- 구현 중 scope가 바뀌면 코드보다 문서를 먼저 갱신합니다.
