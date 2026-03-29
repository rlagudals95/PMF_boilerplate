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
  - "scripts/check-repo-os.mjs"
  - "scripts/check-squad-work-item.mjs"
  - "scripts/sync-ai-context.mjs"
  - "docs/product-squad/*"
  - "docs/work-items/*"
dependencies:
  - "docs/work-items/20260329-repo-os-hardening/brief.md"
  - "docs/work-items/20260329-repo-os-hardening/team-plan.md"
  - "docs/work-items/20260329-repo-os-hardening/backend-spec.md"
skip_reason: null
---

# Quality Scorecard

## Goal Fit

- Repo OS를 새 플랫폼이 아니라 existing artifact graph를 더 엄격하게 잠그는 방향으로 정리한다.
- contributor가 `repo:check` 하나로 metadata, adapter drift, active work item completeness를 빠르게 판정할 수 있어야 한다.

## Product Risks To Kill

- canonical 문서와 generated adapter가 다시 drift하는 위험
- 새 work item/PRD scaffold가 metadata 계약을 놓쳐서 Repo OS gate를 통과하지 못하는 위험
- static gate가 과하게 확장되어 browser QA 의미 판단까지 자동화하려는 위험

## Review Checklist

- [x] primary business goal과 success metric이 이 변경과 연결된다
- [x] risky boundary test evidence가 있거나 skip reason이 명시되어 있다
- [x] 역할별 산출물이 enterprise principles를 따른다
- [x] 사용자에게 가장 중요한 CTA와 value proposition이 분명하거나 non-user-facing 범위라고 적혀 있다
- [x] trust, error, empty, pending state 또는 관련 skip reason이 검토되었다
- [x] analytics/admin visibility 또는 운영 해석 근거가 있어 결과를 해석할 수 있다
- [x] docs/spec sync가 확인되었다
- [x] fresh `pnpm verify` 또는 `pnpm verify:full` 결과가 있다
- [x] responsive + accessibility + browser QA evidence가 있거나 non-user-facing skip reason이 있다

## Browser QA Evidence

- non-user-facing workflow hardening scope다.
- browser QA skip reason: 새로운 user-facing route, CTA, copy flow를 추가하지 않는다.
- `ux-review.md`, `frontend-spec.md`는 모두 skipped이며 skip reason이 명시돼 있다.

## Code Quality Evidence

- static gate는 script responsibility를 나눠 구현한다.
- generator와 template/check contract를 같은 change에서 같이 맞춘다.
- adapter drift check는 generated file을 직접 mutate하지 않는 `--check` path를 갖는다.
- `scripts/check-repo-os.mjs`, `scripts/check-squad-work-item.mjs`, `scripts/sync-ai-context.mjs`, generator scripts를 함께 갱신했다.

## Principle Adherence

- PM: metadata 범위와 non-goals를 decision-complete하게 고정한다.
- FE: AGENTS/README/router 문서를 얇게 유지하고 Repo OS index만 추가한다.
- BE: metadata validation, work item validation, adapter drift detection 책임을 명시적으로 분리한다.
- Quality review: 동작 인상보다 `repo:check`, `squad:check`, `ai:sync`, `verify` evidence를 기준으로 판정한다.

## Docs And Spec Sync

- Repo OS index, canonical context, operating docs, README, templates, generators, CI가 같은 command와 metadata contract를 안내해야 한다.
- `docs/work-items/20260329-repo-os-hardening/*`는 최종 verification evidence와 ship 판단을 남긴다.
- `docs/repo-os.md`, `AGENTS.md`, `docs/agent-context.md`, `docs/work-items/README.md`, `docs/prds/README.md`, `docs/product-squad/*`가 `repo:check`와 metadata contract를 함께 안내한다.

## Verification Evidence

- `pnpm repo:check --work 20260329-repo-os-hardening` → 10 pass, 0 fail
- `pnpm squad:check 20260329-repo-os-hardening` → 6 pass, 0 warn, 0 fail
- `pnpm ai:sync` → success
- `pnpm verify` → exit code 0

## Measurement And Ops Checks

- `repo:check` output만으로 어느 계층에서 drift가 났는지 사람이 빠르게 알 수 있어야 한다.
- prompt evaluation은 전역 hard fail이 아니라 여전히 별도 canonical evaluation/report 흐름으로 유지한다.
- CI에 `pnpm repo:check`를 추가해 metadata drift와 stale adapter를 더 일찍 실패시킨다.

## Release Recommendation

- ship
- 이번 slice는 runtime product behavior를 바꾸지 않으면서 Repo OS contract와 static gate를 강화했고, fresh verification evidence가 모두 확보되었다.
