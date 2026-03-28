# Work Items

중요한 작업은 이 폴더 아래에 `docs/work-items/<work-id>/` 형태로 관리합니다.

## Naming

- 기본 형식: `YYYYMMDD-short-slug`
- 실험 작업: `LP-001-YYYYMMDD-short-slug`

## Preferred Entry

raw business request에서 시작한다면 [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)로 AI가 repo를 먼저 읽고, 필요한 경우 1~3개의 질문으로 목표를 확인한 뒤 PRD/work item 또는 직접 적용 방향을 정하게 하는 편이 좋습니다.

## Manual / Scaffolding Quick Start

```bash
pnpm mvp:new <slug> --prompt "..."
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
pnpm work:new <short-slug> --request "원 요청 또는 작업 배경"
pnpm feature:new --prd <prd-slug>
pnpm squad:check [work-id]
```

- `pnpm mvp:new <slug> --prompt "..."`는 자연어 비즈니스 아이디어 한 문장을 PRD 초안과 첫 feature work item으로 정규화하는 scaffold helper입니다.
- `pnpm mvp:new ...`는 비즈니스 요구 몇 개만으로 PRD 초안과 첫 feature work item을 함께 만듭니다.
- 위 명령은 `docs/product-squad/templates/*`를 복사해 새 work item 디렉터리를 만듭니다.
- `pnpm feature:new --prd <prd-slug>`는 role spec 4종에 더해 `feature-spec.md`와 `quality-scorecard.md`까지 같이 생성합니다.
- 중요한 작업이면 이 scaffold를 만든 뒤 문서를 채우고, 구현 단위를 테스트 가능한 behavior slice로 자른 뒤 진행합니다.
- 기본 구현 루프는 `spec -> failing test -> minimal implementation -> refactor -> verify`입니다.
- `frontend-spec.md`, `backend-spec.md`, `feature-spec.md`에는 어떤 behavior를 먼저 failing test로 고정할지 적어야 합니다.
- handoff 전에 `pnpm squad:check [work-id]`로 placeholder가 남아 있는지 점검합니다.

## Required files

- `brief.md`
- `feature-spec.md` (PRD 기반 feature 작업이면 필수)
- `team-plan.md`
- `ux-review.md`
- `frontend-spec.md`
- `backend-spec.md`
- `quality-scorecard.md`

필요하지 않은 문서는 삭제하지 말고 `status: skipped`와 `skip_reason`을 채워 둡니다.

## Source of truth

- 구현 전 기준 문서는 항상 최신 `brief.md`입니다.
- PRD 기반 작업에서는 `docs/prds/<slug>.md`와 `feature-spec.md`가 brief를 보완하는 task-local source입니다.
- 각 역할 문서는 `docs/product-squad/templates/*.md`를 복사해서 시작합니다.
- `team-plan.md`는 실제 subagent/team 기능이 없어도 shared task list와 handoff를 시뮬레이션하는 coordination 문서입니다.
- 중요한 작업과 핵심 로직 변경은 문서에 적힌 behavior slice를 먼저 failing test로 고정한 뒤 최소 구현을 추가합니다.
- user-facing 또는 goal-critical 작업은 `quality-scorecard.md`에 browser QA evidence와 ship 판단을 남깁니다.
- `pnpm squad:check [work-id]`는 work item 문서가 아직 템플릿 상태인지 빠르게 확인하는 기본 검증입니다.
- 구현 중 scope가 바뀌면 코드보다 문서를 먼저 갱신합니다.
