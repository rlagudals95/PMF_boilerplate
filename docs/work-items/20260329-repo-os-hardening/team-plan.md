---
owner: "product-squad"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: done
owner_role: product-squad
source_request: "Repo OS hardening: core docs metadata, repo:check static gate, adapter drift control, and canonical Repo OS index"
affected_paths:
  - "docs/repo-os.md"
  - "ai/context/*"
  - "docs/product-squad/*"
  - "docs/prds/*"
  - "docs/work-items/*"
  - "scripts/check-repo-os.mjs"
  - "scripts/check-squad-work-item.mjs"
  - "scripts/sync-ai-context.mjs"
  - "scripts/create-prd.mjs"
  - "scripts/create-mvp-starter.mjs"
  - "scripts/create-feature-from-prd.mjs"
  - "package.json"
dependencies:
  - "docs/work-items/20260329-repo-os-hardening/brief.md"
skip_reason: null
---

# Team Plan

## Mission

- Repo OS hardening을 문서 계층, metadata contract, generated adapter drift check, active work item gate까지 포함하는 static 운영 체계로 마무리한다.

## Execution Mode

- `single-agent sequential`
- 구조/운영 규칙 변경이므로 canonical docs, generator, static check를 한 세션에서 순차적으로 수렴한다.

## Team Topology

- lead: Repo OS 범위 고정, metadata contract 설계, 최종 synthesis
- pm: goal, non-goals, acceptance criteria, success metric 잠금
- pd: non-user-facing 범위 확인, browser evidence skip contract 검토
- fe: README/entry/router 문서가 사용자에게 과도한 복잡도를 만들지 않는지 검토
- be: metadata schema, static check, generator, adapter drift check 구현
- quality review: `repo:check`, `squad:check`, `ai:sync`, `verify` 근거로 최종 판단

## Shared Context Pack

- brief: `docs/work-items/20260329-repo-os-hardening/brief.md`
- feature spec: not used for this workflow hardening slice
- ux review: `docs/work-items/20260329-repo-os-hardening/ux-review.md`
- frontend spec: `docs/work-items/20260329-repo-os-hardening/frontend-spec.md`
- backend spec: `docs/work-items/20260329-repo-os-hardening/backend-spec.md`
- external evidence: `docs/repo-os.md`, `ai/context/ai-native.md`, `docs/agent-context.md`

## Shared Task List

- task_id: T1-repo-os-index-and-metadata
  owner: pm
  status: completed
  depends_on: none
  output: Repo OS index 초안, metadata contract, affected docs 범위 고정
- task_id: T2-generator-and-template-contract
  owner: be
  status: completed
  depends_on: T1-repo-os-index-and-metadata
  output: work item/PRD/template/generator가 metadata와 최신 artifact contract를 기본 출력으로 가짐
- task_id: T3-static-repo-gate
  owner: be
  status: completed
  depends_on: T1-repo-os-index-and-metadata
  output: `pnpm repo:check`, `ai:sync --check`, metadata validation
- task_id: T4-canonical-doc-sync
  owner: fe
  status: completed
  depends_on: T1-repo-os-index-and-metadata
  output: AGENTS/README/agent-context/work-item guides가 Repo OS wording과 command를 안내
- task_id: T5-verification-and-scorecard
  owner: quality review
  status: completed
  depends_on: T2-generator-and-template-contract
  output: `repo:check`, `squad:check`, `ai:sync`, `verify` evidence와 quality-scorecard 완료

## File Ownership Plan

- owner: be
  paths: `scripts/check-repo-os.mjs`, `scripts/check-squad-work-item.mjs`, `scripts/sync-ai-context.mjs`, `scripts/create-*.mjs`, `package.json`, `.github/workflows/ci.yml`
- owner: pm
  paths: `docs/repo-os.md`, `docs/work-items/20260329-repo-os-hardening/brief.md`
- owner: fe
  paths: `AGENTS.md`, `README.md`, `docs/agent-context.md`, `docs/architecture.md`, `docs/spec-lifecycle.md`, `docs/doc-sync-playbook.md`, `docs/work-items/README.md`, `docs/prds/README.md`
- owner: product-squad
  paths: `docs/product-squad/*`, `docs/product-squad/templates/*`, `docs/work-items/20260329-repo-os-hardening/*.md`

## Handoff Log

- from: lead
  to: be
  packet: Repo OS는 새 platform이 아니라 existing canonical/task-local/generated 구조를 metadata와 static gate로 잠그는 작업이다. `repo:check`는 static proof만 맡고 browser QA 의미 판정은 scorecard에 남긴다.
- from: quality review
  to: lead
  packet: `pnpm repo:check --work 20260329-repo-os-hardening`, `pnpm squad:check 20260329-repo-os-hardening`, `pnpm ai:sync`, `pnpm verify`가 모두 통과했고 Repo OS metadata와 adapter drift gate가 활성화되었다.

## Escalations

- metadata 범위가 핵심 문서를 넘어서 과도하게 확장되면 범위를 다시 줄인다.
- adapter drift check가 generated 본문을 새로운 source of truth처럼 다루기 시작하면 설계를 되돌린다.
