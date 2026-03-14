# Notion Integration Notes

이 문서는 Notion을 이 저장소와 함께 사용할 때의 권장 방향만 설명합니다.
설치, 인증, 개인 workspace 설정 같은 tool-specific detail은 다루지 않습니다.

## Positioning

- Notion은 optional integration입니다.
- discovery note, meeting note, PRD 초안 수집에 사용할 수 있습니다.
- canonical spec은 repo 안 Markdown으로 귀결되어야 합니다.

## 권장 흐름

1. Notion에서 아이디어, 회의 기록, 인터뷰 메모를 수집합니다.
2. 구현 전 필요한 결정만 추려 repo 안 Markdown spec으로 정규화합니다.
3. 중요한 작업이면 `docs/work-items/<work-id>/` 문서를 만듭니다.
4. 구조 규칙 변경이면 `docs/architecture.md`나 ADR에 반영합니다.

## 사용해도 되는 것

- 초기 discovery 메모
- 회의 기록 정리
- PRD 초안이나 인터뷰 노트 보관

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
