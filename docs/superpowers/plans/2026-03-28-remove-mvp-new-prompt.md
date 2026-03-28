# Remove `mvp:new --prompt` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `mvp:new --prompt` as a supported onboarding path and realign the repo around repo-aware one-shot AI prompting plus structured `mvp:new` inputs only.

**Architecture:** Keep the one-shot experience entirely in canonical prompt docs and AI context. Simplify `scripts/create-mvp-starter.mjs` so `mvp:new` accepts only structured inputs, then update canonical docs and regenerate adapter outputs with `pnpm ai:sync`.

**Tech Stack:** Node.js scripts, Markdown docs, Turborepo, pnpm, generated AI adapters

---

### Task 1: Simplify `mvp:new` CLI Contract

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/scripts/create-mvp-starter.mjs`

- [ ] **Step 1: Remove `--prompt` parsing from the CLI args**

Delete the `--prompt` branch in `parseArgs` and remove `prompt` from the returned object.

```js
    if (arg === "--prompt") {
      prompt = args[index + 1] ?? "";
      index += 1;
      continue;
    }
```

- [ ] **Step 2: Change the required usage contract to structured inputs only**

Update the usage error so only the structured variant is supported.

```js
  if (!slug || !hasExplicitCore) {
    throw new Error(
      'Usage: pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..." [--title "..."] [--problem "..."] [--owner "..."] [--source-url "https://..."] [--force] [--dry-run]',
    );
  }
```

- [ ] **Step 3: Keep inference only as helper logic for structured inputs**

Resolve starter defaults from `offer`, `title`, `goal`, or `slug`, but stop using `prompt`.

```js
  const inferenceSeed = options.offer || options.title || options.goal || options.slug;
  const inference = inferStarterFromText({
    slug: options.slug,
    text: inferenceSeed,
    prompt: "",
  });
```

- [ ] **Step 4: Smoke-check the CLI usage failure**

Run:

```bash
pnpm mvp:new demo-slug --prompt "example" --dry-run
```

Expected: command exits non-zero with updated usage text.

- [ ] **Step 5: Smoke-check the structured path still works**

Run:

```bash
pnpm mvp:new demo-slug --goal "상담 전환" --audience "렌탈 비교 사용자" --offer "조건 비교 후 파트너 연결" --signal "qualified_lead_rate >= 20% within 14 days" --dry-run
```

Expected: dry-run succeeds and prints PRD/work-item setup summary.

### Task 2: Reword Canonical Docs Around One-Shot Prompt-First UX

**Files:**
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/README.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/start-your-mvp.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/product-config-system.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/prds/README.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/work-items/README.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/vibe-coding-playbook.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/mvp-starter-prompt-evaluation.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/ai/context/project.md`
- Modify: `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/agent-context.md`

- [ ] **Step 1: Remove `mvp:new --prompt` as a recommended entry**

Replace mentions like:

```md
pnpm mvp:new <slug> --prompt "..."
```

with either one-shot AI prompt guidance or the structured helper:

```md
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
```

- [ ] **Step 2: Keep `mvp:new` positioned as structured helper only**

Use wording like:

```md
`mvp:new`는 manual scaffold가 필요한 contributor용 structured helper입니다.
```

- [ ] **Step 3: Preserve the one-shot AI output contract**

Keep these bullets in canonical prompt docs:

```md
- selected MVP shape
- active flows
- deferred flows
- major copy/product changes applied
- required env vars for enabled capabilities
- verification result
- remaining manual follow-ups
```

- [ ] **Step 4: Leave historical work-item docs untouched**

Do not rewrite archived/historical work-item records unless they are canonical onboarding docs.

### Task 3: Regenerate Adapters And Verify

**Files:**
- Modify (generated): `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/.github/copilot-instructions.md`
- Modify (generated): `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/.cursor/rules/*`
- Modify (generated): `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/.claude/**/*`
- Modify (generated): `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/.gemini/**/*`
- Modify (generated): `/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/.codex/**/*`

- [ ] **Step 1: Regenerate adapter outputs**

Run:

```bash
pnpm ai:sync
```

Expected: generated adapter files reflect the updated prompt-first/structured-helper wording.

- [ ] **Step 2: Re-scan for canonical `mvp:new --prompt` mentions**

Run:

```bash
rg -n "pnpm mvp:new <slug> --prompt|mvp:new --prompt|--prompt" README.md docs ai scripts .github .cursor .claude .gemini .codex
```

Expected: only historical work-item records or removed CLI parser references remain absent from canonical/generated surfaces.

- [ ] **Step 3: Run repository verification**

Run:

```bash
pnpm verify
```

Expected: exit code 0.
