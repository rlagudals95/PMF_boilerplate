---
owner: "platform"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---

# Repo OS Index

이 문서는 이 저장소를 agent runtime이 아니라 repo-native operating system으로 운영할 때, 어떤 문서 레이어와 어떤 검증 명령을 기준으로 삼아야 하는지 한 번에 보여주는 운영 인덱스입니다.

## Layer Map

| Layer | Purpose | Source Of Truth | Typical Paths |
| --- | --- | --- | --- |
| canonical | 여러 작업에 반복되는 정책, 역할, 품질 바, 읽기 순서 | yes | `ai/context/*`, `ai/skills/*`, `ai/agents/*`, `docs/agent-context.md`, `docs/product-squad/*` |
| task-local | 현재 작업 또는 현재 제품 결정 | yes | `docs/prds/*.md`, `docs/work-items/*/*.md` |
| generated | 플랫폼별 로더, rule, skill output | no | `.claude/*`, `.codex/*`, `.gemini/*`, `.cursor/*`, `.github/copilot-instructions.md` |

## Metadata Contract

핵심 문서와 task-local artifact는 아래 frontmatter를 기본값으로 가집니다.

- `owner`
  - 문서를 유지할 기본 역할 또는 책임자
- `doc_type`
  - `canonical | task-local | generated`
- `source_of_truth`
  - 현재 문서가 실제 구현 기준인지 여부
- `freshness`
  - `active | review-needed | generated`
- `verification`
  - `none | manual | scripted | generated`

기본 해석은 아래와 같습니다.

- canonical 문서는 `doc_type: canonical`, `source_of_truth: true`
- task-local 문서는 `doc_type: task-local`, `source_of_truth: true`
- generated surface는 repo check 대상 문서 본문이 아니라 drift check 대상으로만 다룹니다.
- work item 문서는 기존 `status`, `owner_role`, `source_request` 계약을 유지하면서 위 metadata를 함께 가집니다.

## Tracked Core Docs

Repo OS v1에서 metadata와 static gate를 강제하는 핵심 범위는 아래입니다.

- canonical AI layer
  - `ai/context/*`
  - `ai/skills/*`
  - `ai/agents/*`
- canonical operating docs
  - `docs/agent-context.md`
  - `docs/architecture.md`
  - `docs/spec-lifecycle.md`
  - `docs/doc-sync-playbook.md`
  - `docs/product-squad/*`
  - `docs/prds/README.md`
  - `docs/work-items/README.md`
  - `docs/templates/prd.md`
- task-local docs
  - `docs/prds/*.md`
  - `docs/work-items/*/*.md`

## Delivery Contract

중요한 작업의 기본 artifact graph는 아래 순서를 따릅니다.

1. goal packet
2. `brief.md`
3. role specs
4. `team-plan.md`
5. tests
6. browser evidence
7. `quality-scorecard.md`

PM/PD/FE/BE 역할은 multi-bot 기능이 아니라 같은 goal packet을 다른 관점으로 검증하는 문서 계약입니다.

요청 triage는 아래 세 축으로 해석합니다.

- work class: `light | soft-gated | hard-gated`
- editing depth: `product-config-friendly | deep code`
- release surface: `none | user-facing | ops-facing | cross-repo`

`gated work`는 기존의 넓은 우산 분류이고, hybrid harness contract에서는 `soft-gated`/`hard-gated`로 더 쪼갭니다.
hard-gated 작업은 change type에 맞는 artifact matrix와 evidence closure를 요구하는 대상으로 분류합니다. 실제 enforcement는 upcoming harness gate 작업에서 붙습니다.

## Verification Entry Points

- `pnpm lint`
  - workspace 기본 lint gate다.
  - canonical default는 `ESLint`이며, 각 workspace의 `lint` 스크립트는 shared config를 통해 이 계약을 따른다.
- `pnpm repo:check`
  - 기본값은 `status: approved | in_progress | blocked` work item 전체를 검사합니다.
  - `--work <work-id>`로 특정 work item만 검사할 수 있고, `--strict`는 `draft`도 포함합니다.
  - `--all`은 historical artifact까지 포함해 모든 work item을 검사하는 migration/audit 모드입니다.
  - core docs metadata, adapter drift, active work item contract, tracked workspace의 lint tooling contract를 함께 확인합니다.
- `pnpm squad:check [work-id]`
  - work item 문서가 placeholder 상태를 벗어났는지 확인합니다.
- `pnpm verify`
  - lint, typecheck, unit test를 확인합니다.
- `pnpm verify:full`
  - browser-critical 또는 integration-heavy 변경의 더 무거운 검증 게이트입니다.
- `pnpm browser:qa --work <work-id>`
  - repo-native Browser QA harness다.
  - desktop/mobile evidence를 수집하고 `docs/work-items/<work-id>/browser-qa.md` 요약을 남깁니다.
  - raw screenshots, traces, report는 local Playwright output으로 유지합니다.
- `pnpm ai:sync`
  - generated adapter를 canonical source 기준으로 다시 만듭니다.

## Drift Rules

- canonical 규칙을 바꿨으면 generated adapter를 직접 고치지 않고 `pnpm ai:sync`를 실행합니다.
- 구조, 운영, work item contract가 바뀌었으면 `pnpm repo:check`를 먼저 통과시킵니다.
- lint 기본 엔진이나 workspace `lint`/`verify` 계약을 바꾸려면 canonical 문서와 검증 로직을 함께 갱신합니다.
- user-facing 또는 goal-critical 작업은 browser evidence와 measurement check가 없는 상태에서 ship-ready로 보지 않습니다.
- optional automation은 Repo OS artifact를 읽는 실행기일 뿐, 새로운 source of truth가 되면 안 됩니다.
