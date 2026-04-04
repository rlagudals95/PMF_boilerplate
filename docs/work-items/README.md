---
owner: "product-squad"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Work Items

중요한 작업은 이 폴더 아래에 `docs/work-items/<work-id>/` 형태로 관리합니다.

## Naming

- 기본 형식: `YYYYMMDD-short-slug`
- 실험 작업: `LP-001-YYYYMMDD-short-slug`

## Preferred Entry

raw business request에서 시작한다면 [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)로 AI가 repo를 먼저 읽고, 필요한 경우 1~3개의 질문으로 목표를 확인한 뒤 PRD/work item 또는 직접 적용 방향을 정하게 하는 편이 좋습니다.
정책이나 business goal이 먼저 주어지는 경우에도 같은 흐름으로 `goal packet -> work item -> thin slice` 순서로 정규화하는 것을 기본값으로 둡니다.

여기서 먼저 보는 triage는 두 축입니다.

- work class: `light` 또는 `soft-gated` 또는 `hard-gated`
- editing depth: `product-config-friendly` 또는 `deep code`

즉 user-facing 변경이라 work item이 필요한 경우에도, 구현은 먼저 safe surface인 `product-config`에서 시작할 수 있습니다.

- work item frontmatter는 `work_class`, `change_types`, `evidence_requirements`, `release_surface`, `primary_gate`를 함께 가진다.
- `squad:check`는 이 metadata를 읽어 required artifact/evidence matrix를 검사한다.
- `repo:check`는 active work item의 classification consistency를 검사한다.

## Manual / Scaffolding Quick Start

```bash
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
pnpm work:new <short-slug> --request "원 요청 또는 작업 배경"
pnpm feature:new --prd <prd-slug>
pnpm browser:qa --work <work-id>
pnpm repo:check
pnpm repo:check --work <work-id>
pnpm squad:check [work-id]
```

- `pnpm mvp:new ...`는 goal, audience, offer, signal이 이미 정리된 경우 PRD 초안과 첫 feature work item을 함께 만드는 structured scaffold helper입니다.
- 위 명령은 `docs/product-squad/templates/*`를 복사해 새 work item 디렉터리를 만듭니다.
- `pnpm feature:new --prd <prd-slug>`는 `goal-packet.md`, role spec 4종, `feature-spec.md`, `quality-scorecard.md`를 함께 생성합니다.
- `pnpm browser:qa --work <work-id>`는 user-facing work의 browser evidence summary를 `browser-qa.md`로 남기는 repo-native helper입니다.
- 중요한 작업이면 이 scaffold를 만든 뒤 문서를 채우고, 구현 단위를 테스트 가능한 behavior slice로 자른 뒤 진행합니다.
- `brief.md`에는 최소한 business goal, target user, target moment, success metric, non-goals, constraints, existing evidence가 드러나야 합니다.
- 기본 구현 루프는 `spec -> failing test -> minimal implementation -> refactor -> verify`입니다.
- `frontend-spec.md`, `backend-spec.md`, `feature-spec.md`에는 어떤 behavior를 먼저 failing test로 고정할지 적어야 합니다.
- work item 문서는 `owner`, `doc_type`, `source_of_truth`, `freshness`, `verification` metadata를 함께 유지합니다.
- `pnpm repo:check` 기본값은 `approved | in_progress | blocked` 상태의 active work item 전체를 검사합니다.
- historical work item은 `done` 또는 `skipped`로 닫아 active 검사 대상에서 빠지게 유지합니다.
- historical artifact까지 한 번에 감사하려면 `pnpm repo:check --all`을 사용합니다. 이 모드는 migration/audit 용도로 봅니다.
- handoff 전에 `pnpm squad:check [work-id]`로 placeholder가 남아 있는지 점검합니다.

## Required files

- `goal-packet.md`
- `brief.md`
- `feature-spec.md` (PRD 기반 feature 작업이면 필수)
- `team-plan.md`
- `ux-review.md`
- `frontend-spec.md`
- `backend-spec.md`
- `quality-scorecard.md`

필요하지 않은 문서는 삭제하지 말고 `status: skipped`와 `skip_reason`을 채워 둡니다.

## Source of truth

- 입력 정규화 기준 문서는 항상 최신 `goal-packet.md`입니다.
- 구현 전 기준 문서는 항상 최신 `brief.md`입니다.
- PRD 기반 작업에서는 `docs/prds/<slug>.md`와 `feature-spec.md`가 brief를 보완하는 task-local source입니다.
- 각 역할 문서는 `docs/product-squad/templates/*.md`를 복사해서 시작합니다.
- `team-plan.md`는 실제 subagent/team 기능이 없어도 shared task list와 handoff를 시뮬레이션하는 coordination 문서입니다.
- 중요한 작업과 핵심 로직 변경은 문서에 적힌 behavior slice를 먼저 failing test로 고정한 뒤 최소 구현을 추가합니다.
- `quality-scorecard.md`는 browser QA뿐 아니라 test/docs sync/verify evidence까지 모으는 최종 quality gate입니다.
- `quality-scorecard.md`는 역할별 enterprise principle adherence도 함께 확인하는 최종 quality gate입니다.
- user-facing 또는 goal-critical 작업은 `quality-scorecard.md`에 `browser-qa.md` reference와 ship 판단을 남깁니다.
- `browser-qa.md`에는 raw screenshots/trace path 대신 summary와 repo-local evidence만 적고, Playwright output은 local artifact로 둡니다.
- `pnpm repo:check [work-id]`는 core docs metadata, adapter drift, active work item contract를 함께 확인하는 상위 static gate입니다.
- `pnpm squad:check [work-id]`는 work item 문서가 아직 템플릿 상태인지 빠르게 확인하는 기본 검증입니다.
- 구현 중 scope가 바뀌면 코드보다 문서를 먼저 갱신합니다.
