# PRDs

이 폴더는 기능 작업의 canonical PRD를 저장합니다.

## 원칙

- PRD의 source of truth는 repo 안 `docs/prds/*.md`입니다.
- Notion 같은 외부 문서는 입력 채널일 뿐이며, 구현 전에 이 폴더로 정규화합니다.
- 한 PRD가 여러 기능을 담아도 `feature:new`는 한 번에 하나의 feature slice만 work item으로 정리합니다.

## 시작 명령

```bash
pnpm prd:new <slug>
pnpm feature:new --prd <slug>
pnpm feature:new --prd <slug> --feature <feature-slug>
```

## 문서 규칙

- 파일 경로: `docs/prds/<prd-slug>.md`
- 기본 템플릿: `docs/templates/prd.md`
- `Target User`, `Core Use Cases`, `Jobs To Be Done`를 함께 유지해 문제, 맥락, 흐름을 분리합니다.
- PRD가 여러 기능을 담으면 `## Feature Candidates` 아래에 `### <feature-slug>` 단위로 나눕니다.
- 외부 PRD 링크가 있다면 frontmatter `source_url`에 기록합니다.
- frontmatter에는 `created_at`, `updated_at`를 남깁니다.
- 문서 최하단 `## Document History`는 append-only로 유지합니다.
- PRD 생성 시 `created` 행을 추가하고, 의미 있는 수정 시 `updated` 행을 아래에 이어 붙입니다.

## 구현 진입

- PRD를 만든 뒤에는 `pnpm feature:new --prd <slug>`로 work item과 `feature-spec.md`를 생성합니다.
- PRD 정보가 부족하면 generator는 open questions를 만들고 구현 준비 상태를 `blocked`로 남깁니다.
