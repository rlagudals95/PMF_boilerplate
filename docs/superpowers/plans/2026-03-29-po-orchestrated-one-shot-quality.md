# PO-Orchestrated One-Shot Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a PO-first operating gate so one-shot requests trigger clarification, role critique, and commercial-quality checks before implementation begins.

**Architecture:** Strengthen the repo's canonical operating model instead of adding a new orchestration service. Update starter prompts, role skills, product-squad docs, and adapter-facing context so `po-role` becomes the first gate and `pd-role` gains explicit commercial landing critique authority.

**Tech Stack:** Markdown canonical docs, repo-local AI skills, generated adapters via `pnpm ai:sync`, repo verification via `pnpm repo:check`

---

### Task 1: Add the New `po-role` Canonical Skill

**Files:**
- Create: `ai/skills/po-role.md`
- Modify: `ai/skills/_index.md`

- [ ] **Step 1: Write the new canonical role contract**

Add `ai/skills/po-role.md` with:

```md
---
owner: "po"
doc_type: "canonical"
source_of_truth: true
freshness: "active"
verification: "manual"
---
# Skill: PO Role

## Use when

- raw business idea, policy, or one-shot request must be normalized before implementation
- goal packet completeness must be judged
- role critique and approval gates must be orchestrated

## Checklist

- goal packet completeness is classified as `ready`, `needs-clarification`, or `not-safe-to-build`
- visual bar is explicit for landing or other user-facing work
- role critique order is fixed before implementation
- implementation is blocked until design approval exists
```

- [ ] **Step 2: Register the skill in the index**

Insert a new `po-role` section in `ai/skills/_index.md` near `product-squad` and `pm-role`.

- [ ] **Step 3: Verify the new skill is discoverable**

Run: `rg -n "po-role" ai/skills/_index.md ai/skills/po-role.md`
Expected: both files include the new role entry and canonical path.

### Task 2: Upgrade the Core Operating Model

**Files:**
- Modify: `ai/context/ai-native.md`
- Modify: `docs/product-squad/operating-model.md`
- Modify: `docs/product-squad/goal-driven-delivery.md`
- Modify: `docs/product-squad/agent-team-delivery.md`

- [ ] **Step 1: Add PO-first normalization and visual-bar language to the core context**

Update `ai/context/ai-native.md` so:

```md
- important work is reviewed through `product-squad` plus `po-role`, `pm-role`, `pd-role`, `fe-role`, `be-role`
- goal packet includes `visual bar`
- `po-role` can force clarification before implementation
```

- [ ] **Step 2: Rework `operating-model.md` around `po-role`**

Add:

```md
- `po-role` as first gate owner
- triage rows that include `po`
- role responsibilities and blocking authority
- operating sequence `po -> pm -> pd -> fe/be -> quality`
```

- [ ] **Step 3: Strengthen goal-driven quality gates**

Update `docs/product-squad/goal-driven-delivery.md` to include:

```md
- `visual bar` in the goal packet
- landing-specific input requirements
- critique-based design gate
- explicit `commercial quality` and `boilerplate smell` checks
```

- [ ] **Step 4: Align team-delivery language**

Update `docs/product-squad/agent-team-delivery.md` so `lead` is clearly the orchestration shell and `po-role` is the first gate inside that loop.

- [ ] **Step 5: Verify the new operating terms are consistent**

Run: `rg -n "visual bar|po-role|commercial quality|boilerplate smell" ai/context/ai-native.md docs/product-squad/*.md`
Expected: the new gate language appears in the operating model and quality docs without contradictory sequencing.

### Task 3: Upgrade Role Expectations and Starter Prompts

**Files:**
- Modify: `docs/ai-starter-prompt-pack.md`
- Modify: `ai/skills/product-squad.md`
- Modify: `ai/skills/pd-role.md`

- [ ] **Step 1: Rewrite the starter prompt contract**

Update `docs/ai-starter-prompt-pack.md` so the canonical starter prompt explicitly requires:

```text
- goal packet completeness check
- visual bar / reference / anti-reference questions for landing work
- role critique before coding
- clarification loop when the request is not safe to build
```

- [ ] **Step 2: Update `product-squad` to call `po-role` first**

Change the workflow and role selection defaults in `ai/skills/product-squad.md` so `po-role` is named as the first gated-work reviewer and implementation cannot start before approval.

- [ ] **Step 3: Expand `pd-role` into commercial landing critique**

Update `ai/skills/pd-role.md` to add:

```md
- first-impression and hierarchy review
- trust-as-evidence review
- explanation-overload / boilerplate-smell rejection criteria
- explicit mobile density checks
```

- [ ] **Step 4: Verify prompt and role language align**

Run: `rg -n "reference|anti-reference|clarification|commercial|boilerplate" docs/ai-starter-prompt-pack.md ai/skills/product-squad.md ai/skills/pd-role.md`
Expected: the starter prompt and role docs use matching gate language.

### Task 4: Update Cross-Context and Agent Entry Docs

**Files:**
- Modify: `docs/agent-context.md`
- Modify: `docs/architecture.md`
- Modify: `ai/agents/product-lead.md`
- Modify: `ai/agents/pd-reviewer.md`

- [ ] **Step 1: Add `po-role` to cross-agent context**

Update `docs/agent-context.md` so the role-based operating mode and loading guidance include `po-role`.

- [ ] **Step 2: Update architecture-facing role lists**

Adjust `docs/architecture.md` to reflect `po-role` as the first gate in important work.

- [ ] **Step 3: Align agent prompts with the new gate**

Update `ai/agents/product-lead.md` and `ai/agents/pd-reviewer.md` so:

```md
- product-lead explicitly performs or simulates `po-role` gating
- pd-reviewer treats commercial landing critique as part of the job
```

- [ ] **Step 4: Verify role naming across cross-agent docs**

Run: `rg -n "po-role|product-lead|commercial landing critique" docs/agent-context.md docs/architecture.md ai/agents/*.md`
Expected: cross-agent docs reflect the same sequencing and role expectations.

### Task 5: Sync Adapters and Run Repo Verification

**Files:**
- Modify: generated adapter files under `.codex/`, `.claude/`, `.gemini/`, `.cursor/`, `.github/` via `pnpm ai:sync`

- [ ] **Step 1: Regenerate adapters**

Run: `pnpm ai:sync`
Expected: generated adapter files update to reflect the new `po-role` skill and revised canonical skill text.

- [ ] **Step 2: Run repo checks**

Run: `pnpm repo:check`
Expected: metadata, work-item completeness, and adapter drift checks pass.

- [ ] **Step 3: Run broad verification**

Run: `pnpm verify`
Expected: lint, typecheck, and test pass after doc and skill updates.

- [ ] **Step 4: Capture final diff summary**

Run: `git diff --stat`
Expected: canonical docs, skills, and generated adapters reflect the new operating model.
