# PRDs

이 폴더는 기능 작업의 canonical PRD를 저장합니다.

## 원칙

- PRD의 source of truth는 repo 안 `docs/prds/*.md`입니다.
- Notion 같은 외부 문서는 입력 채널일 뿐이며, 구현 전에 이 폴더로 정규화합니다.
- 한 PRD가 여러 기능을 담아도 `feature:new`는 한 번에 하나의 feature slice만 work item으로 정리합니다.

## Preferred Entry

대부분의 사용자는 [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)로 AI가 먼저 repo를 읽고 PRD와 제품 적용 방향을 정하도록 시작하는 편이 좋습니다.

- AI는 먼저 repo context를 읽고 필요한 경우에만 1~3개의 질문으로 목표를 확인합니다.
- 그 다음 goal / audience / offer / signal을 정리하고 active/deferred flow를 결정합니다.
- 필요하면 PRD를 `docs/prds/<slug>.md`에 정규화하고, 그 문서를 source of truth로 사용합니다.

## Manual / Advanced Commands

```bash
pnpm mvp:new <slug> --prompt "..."
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
pnpm prd:new <slug>
pnpm feature:new --prd <slug>
pnpm feature:new --prd <slug> --feature <feature-slug>
```

- `pnpm mvp:new <slug> --prompt "..."`는 자연어 비즈니스 아이디어를 PRD 초안과 첫 feature work item으로 정규화하는 intake/scaffold helper입니다.
- `pnpm mvp:new ...`는 few inputs로 PRD 초안과 첫 feature work item까지 같이 생성하는 manual workflow helper입니다.
- `pnpm prd:new <slug>`는 더 자유도가 높은 빈 PRD scaffold가 필요할 때 사용합니다.

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

- AI 코딩 툴에서 raw business request로 시작한다면 prompt pack을 먼저 쓰고, 필요하면 그 결과를 `docs/prds/<slug>.md`로 정규화합니다.
- repo-local scaffold가 먼저 필요하면 `pnpm mvp:new <slug> --prompt "..."`를 사용할 수 있습니다.
- prompt보다 구조화된 입력이 더 편하면 기존 `pnpm mvp:new <slug> --goal ... --audience ... --offer ... --signal ...`도 그대로 사용할 수 있습니다.
- PRD를 만든 뒤에는 `pnpm feature:new --prd <slug>`로 work item, `feature-spec.md`, `quality-scorecard.md`를 생성합니다.
- PRD 정보가 부족하면 generator는 open questions를 만들고 구현 준비 상태를 `blocked`로 남깁니다.
