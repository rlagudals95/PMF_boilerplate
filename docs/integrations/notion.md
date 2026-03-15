# Notion Integration Notes

이 문서는 Notion을 이 저장소와 함께 사용할 때의 권장 방향만 설명합니다.
설치, 인증, 개인 workspace 설정 같은 tool-specific detail은 다루지 않습니다.

## Positioning

- Notion은 optional integration입니다.
- discovery note, meeting note, PRD 초안 수집에 사용할 수 있습니다.
- PRD 공유와 리뷰를 위해 repo PRD를 Notion으로 옮겨 적는 운영은 충분히 권장됩니다.
- canonical spec은 repo 안 Markdown으로 귀결되어야 합니다.

## 권장 흐름

1. Notion에서 아이디어, 회의 기록, 인터뷰 메모를 수집합니다.
2. 구현 전 필요한 결정만 추려 repo 안 Markdown spec으로 정규화합니다.
3. 중요한 작업이면 `docs/work-items/<work-id>/` 문서를 만듭니다.
4. 구조 규칙 변경이면 `docs/architecture.md`나 ADR에 반영합니다.

PRD 작업에서는 아래 순서를 권장합니다.

1. PRD 초안은 대화나 Notion 메모에서 시작할 수 있습니다.
2. canonical PRD는 반드시 `docs/prds/<prd-slug>.md`에 저장합니다.
3. 팀이 보통 Notion에서 읽고 리뷰한다면, 그 뒤에 Notion 페이지를 보조 복사본으로 만듭니다.
4. Notion 복사본은 공유와 협업용이고, 최종 수정 기준은 계속 repo 문서입니다.

붙여넣기 기반 운영이면 아래 템플릿을 권장합니다.

- repo canonical: `docs/templates/prd.md`
- Notion mirror: `docs/templates/prd-notion.md`

## 사용해도 되는 것

- 초기 discovery 메모
- 회의 기록 정리
- PRD 초안이나 인터뷰 노트 보관
- repo에 저장된 PRD의 보조 공유본 생성
- repo PRD를 Notion 리뷰 문서로 복사해 운영하는 것

## 사용하면 안 되는 것

- Notion database schema를 source of truth로 취급하는 것
- repo spec 없이 Notion 문서만 보고 구현하는 것
- tool-specific prompt나 개인 설정을 repo 규칙으로 승격하는 것

## 정규화 기준

아래 중 하나로 옮겨야 구현 기준 문서로 인정합니다.

- `docs/templates/feature-spec.md`
- `docs/templates/experiment-spec.md`
- `docs/work-items/<work-id>/*.md`
- `docs/adr/*`

## PRD Mirror Checklist

- 먼저 `docs/prds/<prd-slug>.md`를 최신 상태로 저장합니다.
- 그 다음 `docs/templates/prd-notion.md` 구조로 Notion에 옮깁니다.
- Notion 문서 상단에 canonical PRD 경로를 남깁니다.
- Notion에서 바뀐 내용이 있으면 repo PRD와 `Document History`를 같이 갱신합니다.
