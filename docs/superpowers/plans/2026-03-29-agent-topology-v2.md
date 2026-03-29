# Agent Topology V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the repository's default agent workflow to a supervisor-first model where `po-role` owns the conversation, specialists return bounded artifacts, and `evaluator-role` independently closes the release gate.

**Architecture:** Update canonical AI context, product-squad docs, starter prompt docs, and agent prompts instead of adding any runtime service. Keep the existing repo-native workflow but make the default topology explicit and measurable.

**Tech Stack:** Markdown canonical docs, AI skills under `ai/skills`, agent prompts under `ai/agents`, generated adapters via `pnpm ai:sync`, repo checks via `pnpm repo:check`, verification via `pnpm verify`

---

### Task 1: Define The Topology In Canonical Docs

**Files:**
- Create: `docs/superpowers/specs/2026-03-29-agent-topology-v2-design.md`
- Modify: `ai/context/ai-native.md`
- Modify: `ai/context/platform-optimization.md`
- Modify: `docs/product-squad/operating-model.md`
- Modify: `docs/product-squad/goal-driven-delivery.md`
- Modify: `docs/product-squad/agent-team-delivery.md`

- [ ] **Step 1: Write the design spec**
- [ ] **Step 2: Update the core operating model to `po supervisor -> specialists -> evaluator gate`**
- [ ] **Step 3: Verify role terminology consistency with `rg -n "evaluator-role|supervisor|release gate|replayable evaluation"`**

### Task 2: Add The Evaluator Role Contract

**Files:**
- Create: `ai/skills/evaluator-role.md`
- Modify: `ai/skills/_index.md`
- Modify: `docs/product-squad/templates/quality-scorecard.md`

- [ ] **Step 1: Add the new canonical evaluator skill**
- [ ] **Step 2: Register it in the skill index**
- [ ] **Step 3: Extend the scorecard template with evaluator and replayable evaluation sections**

### Task 3: Align Skills, Prompts, And Onboarding

**Files:**
- Modify: `ai/skills/product-squad.md`
- Modify: `ai/skills/goal-driven-delivery.md`
- Modify: `ai/skills/agent-team-delivery.md`
- Modify: `docs/ai-starter-prompt-pack.md`
- Modify: `docs/mvp-starter-prompt-evaluation.md`
- Modify: `README.md`
- Modify: `docs/start-your-mvp.md`

- [ ] **Step 1: Reframe skills around supervisor-first execution**
- [ ] **Step 2: Update the starter prompt contract**
- [ ] **Step 3: Update README and `start-your-mvp`**
- [ ] **Step 4: Update the prompt evaluation rubric**

### Task 4: Align Platform Agent Prompts

**Files:**
- Modify: `ai/agents/product-lead.md`
- Modify: `ai/agents/quality-reviewer.md`

- [ ] **Step 1: Strengthen the product lead prompt**
- [ ] **Step 2: Convert quality reviewer into the evaluator acceleration prompt**

### Task 5: Regenerate Adapters And Verify

**Files:**
- Modify: generated adapter files under `.claude/`, `.codex/`, `.gemini/`, `.cursor/`, `.github/` via `pnpm ai:sync`

- [ ] **Step 1: Run `pnpm ai:sync`**
- [ ] **Step 2: Run `pnpm repo:check`**
- [ ] **Step 3: Run `pnpm verify`**
- [ ] **Step 4: Inspect `git diff --stat`**
