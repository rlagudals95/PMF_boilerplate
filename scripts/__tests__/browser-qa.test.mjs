import assert from "node:assert/strict";
import test from "node:test";

import {
  buildManifest,
  buildSuggestedScorecardEntryLines,
  collectBrowserQaInputs,
  renderBrowserQaMarkdown,
} from "../lib/browser-qa.mjs";

test("prefers existing browser-qa scope over frontend and UX inputs", async () => {
  const inputs = collectBrowserQaInputs({
    browserQaMarkdown: `---
status: in_progress
skip_reason: null
---

# Browser QA

## Scope

- \`/custom\`
- \`/custom-secondary\`
`,
    frontendSpecMarkdown: `# Frontend Spec

## Affected Routes

- \`/\`
- \`/consult\`
`,
    uxReviewMarkdown: `# UX Review

## Entry Points

- landing hero
- consultation request form

## Browser QA Plan

- desktop에서 \`/\`를 확인한다.
- mobile에서 \`/consult\`를 확인한다.
`,
  });

  assert.deepEqual(inputs.routes, ["/custom", "/custom-secondary"]);
  assert.equal(inputs.source, "browser-qa");
  assert.equal(inputs.skipReason, "");
});

test("falls back to frontend routes before UX plan routes", async () => {
  const inputs = collectBrowserQaInputs({
    browserQaMarkdown: "",
    frontendSpecMarkdown: `# Frontend Spec

## Affected Routes

- \`/\`
- \`/consult\`
- app layout / shared header

## Manual Browser QA

- mobile에서 CTA 문구를 확인한다.
`,
    uxReviewMarkdown: `# UX Review

## Browser QA Plan

- desktop에서 \`/fallback\`를 확인한다.
`,
  });

  assert.deepEqual(inputs.routes, ["/", "/consult"]);
  assert.equal(inputs.source, "frontend-spec");
});

test("treats skipped UX or frontend docs as explicit non-user-facing guidance", async () => {
  const inputs = collectBrowserQaInputs({
    browserQaMarkdown: "",
    frontendSpecMarkdown: `---
status: skipped
skip_reason: "apps/web route, module, component, client/server state 흐름을 바꾸지 않는다."
---

# Frontend Spec
`,
    uxReviewMarkdown: `---
status: skipped
skip_reason: "런타임 UI, IA, CTA, 브라우저 상호작용을 바꾸는 작업이 아니다."
---

# UX Review
`,
  });

  assert.deepEqual(inputs.routes, []);
  assert.equal(inputs.source, "skip-reason");
  assert.match(inputs.skipReason, /(브라우저 상호작용|바꾸지 않는다)/);
});

test("renders browser QA markdown with the required sections and generated metadata", async () => {
  const markdown = renderBrowserQaMarkdown({
    workId: "20260401-browser-qa-smoke",
    sourceRequest: "QA harness smoke",
    affectedPaths: [
      "docs/work-items/20260401-browser-qa-smoke/frontend-spec.md",
      "docs/work-items/20260401-browser-qa-smoke/quality-scorecard.md",
    ],
    dependencies: [
      "docs/work-items/20260401-browser-qa-smoke/frontend-spec.md",
      "docs/work-items/20260401-browser-qa-smoke/ux-review.md",
    ],
    status: "done",
    scopeLines: ["- desktop + mobile browser QA evidence for landing and consult"],
    routeMatrixLines: ["- `/` -> desktop, mobile", "- `/consult` -> desktop, mobile"],
    runMetadataLines: [
      "- run_at: 2026-04-01T10:00:00.000Z",
      "- source: frontend-spec",
    ],
    evidenceLines: [
      "- `/` desktop screenshot: `test-results/browser-qa/20260401-browser-qa-smoke/home-desktop.png`",
      "- `/consult` mobile trace: `test-results/browser-qa/20260401-browser-qa-smoke/consult-mobile-trace.zip`",
    ],
    openIssueLines: ["- none"],
    suggestedScorecardEntryLines: [
      "- Browser QA summary: `docs/work-items/20260401-browser-qa-smoke/browser-qa.md`",
    ],
    skipReason: null,
  });

  assert.match(markdown, /verification: "generated"/);
  assert.match(markdown, /owner_role: pd/);
  assert.match(markdown, /## Scope/);
  assert.match(markdown, /## Route Matrix/);
  assert.match(markdown, /## Run Metadata/);
  assert.match(markdown, /## Evidence/);
  assert.match(markdown, /## Open Issues/);
  assert.match(markdown, /## Suggested Scorecard Entry/);
});

test("renders scorecard references and manifest paths relative to the repo root", async () => {
  const suggested = buildSuggestedScorecardEntryLines({
    workId: "20260401-browser-qa-smoke",
    rawArtifactsDir:
      "/repo/test-results/browser-qa/20260401-browser-qa-smoke",
    reportManifestPath:
      "/repo/playwright-report/browser-qa/20260401-browser-qa-smoke/manifest.json",
    skipReason: null,
    rootDir: "/repo",
  });

  assert.deepEqual(suggested, [
    "- Browser QA summary: `docs/work-items/20260401-browser-qa-smoke/browser-qa.md`",
    "- Local raw artifacts: `test-results/browser-qa/20260401-browser-qa-smoke`",
    "- Local report manifest: `playwright-report/browser-qa/20260401-browser-qa-smoke/manifest.json`",
  ]);

  const manifest = buildManifest({
    workId: "20260401-browser-qa-smoke",
    runAt: "2026-04-01T10:00:00.000Z",
    source: "frontend-spec",
    baseUrl: "http://127.0.0.1:3100",
    serverMode: "reused",
    rootDir: "/repo",
    results: [
      {
        route: "/",
        viewport: "desktop",
        ok: true,
        screenshotPath:
          "/repo/test-results/browser-qa/20260401-browser-qa-smoke/home-desktop.png",
        tracePath:
          "/repo/test-results/browser-qa/20260401-browser-qa-smoke/home-desktop-trace.zip",
      },
    ],
  });

  assert.deepEqual(manifest.results, [
    {
      route: "/",
      viewport: "desktop",
      ok: true,
      screenshotPath:
        "test-results/browser-qa/20260401-browser-qa-smoke/home-desktop.png",
      tracePath:
        "test-results/browser-qa/20260401-browser-qa-smoke/home-desktop-trace.zip",
      error: null,
    },
  ]);
});
