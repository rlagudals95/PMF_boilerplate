---
owner: "be"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: be
source_request: "Repo OS hardening: core docs metadata, repo:check static gate, adapter drift control, and canonical Repo OS index"
affected_paths:
  - "scripts/check-repo-os.mjs"
  - "scripts/check-squad-work-item.mjs"
  - "scripts/sync-ai-context.mjs"
  - "scripts/create-prd.mjs"
  - "scripts/create-mvp-starter.mjs"
  - "scripts/create-feature-from-prd.mjs"
  - "package.json"
  - ".github/workflows/ci.yml"
dependencies:
  - "docs/work-items/20260329-repo-os-hardening/brief.md"
  - "docs/repo-os.md"
skip_reason: null
---

# Backend Spec

## Schema And Validation Changes

- 런타임 schema나 DB 변경은 없다.
- Repo OS metadata schema를 Markdown frontmatter contract로 추가한다.
- `owner`, `doc_type`, `source_of_truth`, `freshness`, `verification`를 핵심 문서와 task-local artifact의 공통 field로 사용한다.

## Action Service Repository Plan

- 새 static gate 스크립트 `scripts/check-repo-os.mjs`를 추가한다.
- `scripts/check-squad-work-item.mjs`에 work item metadata validation을 추가한다.
- `scripts/sync-ai-context.mjs`에 `--check` 모드를 넣어 generated adapter drift를 non-mutating하게 판정한다.
- PRD/work item generator와 `feature:new` output이 새 metadata와 최신 artifact contract를 기본으로 생성되게 맞춘다.

## Analytics Impact

- product analytics 이벤트 영향은 없다.
- 대신 운영 품질 측정 지점이 `repo:check`, `squad:check`, `verify`, `ai:sync --check`로 더 명확해진다.

## Failure Modes

- metadata migration이 일부 핵심 문서나 historical work item에 빠지면 `repo:check`가 false fail 할 수 있다.
- `ai:sync --check`가 stale file과 content drift를 제대로 구분하지 못하면 adapter gate 신뢰도가 떨어진다.
- `feature:new` generated docs가 template/check script와 어긋나면 새 work item이 생성 직후부터 failing 상태가 된다.

## Measurement Guardrails

- `repo:check`는 static proof만 다루고 browser QA 의미 판단이나 shipping 판단 자체를 자동화하지 않는다.
- active work item contract는 `squad:check`를 통해 section completeness로, Repo OS check는 그 상위 gate로 다룬다.
- generated adapter는 여전히 canonical source를 소비하는 파생 산출물이며, generated 본문을 새 source of truth로 다루지 않는다.

## Enterprise BE Guardrails

- metadata validation, work item validation, adapter drift check 책임을 스크립트 경계로 분리한다.
- frontmatter parsing은 현재 repo 패턴을 재사용하되, 불필요한 새 infra나 config format을 만들지 않는다.
- check script는 static inspection만 하고 repo tracked file을 mutate하지 않는다.
- generator는 최신 template/check contract와 어긋나지 않게 같은 change에서 함께 고친다.

## Boundary / Use Case / Repository Contract Test Plan

- 먼저 failing test로 고정할 contract는 `repo:check`의 metadata validity, adapter drift detection, active work item validation output이다.
- `scripts/sync-ai-context.mjs --check`는 canonical source 수정 후 regenerate를 생략한 상태를 실패시키는지 확인한다.
- 최종 verify에는 `pnpm repo:check --work 20260329-repo-os-hardening`, `pnpm squad:check 20260329-repo-os-hardening`, `pnpm ai:sync`, `pnpm verify`를 남긴다.
