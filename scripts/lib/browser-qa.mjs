import path from "node:path";

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { frontmatter: {}, body: markdown };
  }

  const frontmatter = {};

  for (const line of match[1].split("\n")) {
    const parsed = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!parsed) {
      continue;
    }

    frontmatter[parsed[1]] = parsed[2];
  }

  return {
    frontmatter,
    body: markdown.slice(match[0].length),
  };
}

export function normalizeScalar(value) {
  return String(value ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function extractSection(body, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`## ${escaped}\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = body.match(pattern);

  return match?.[1]?.trim() ?? "";
}

function extractBulletLines(section) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "));
}

function extractRoutesFromLines(lines) {
  const routes = [];

  for (const line of lines) {
    for (const match of line.matchAll(/`(\/[^`\s]*)`|(\/[A-Za-z0-9/_-]*)/g)) {
      const route = match[1] ?? match[2];

      if (!route || route === "/") {
        routes.push(route || "/");
        continue;
      }

      if (route.startsWith("/")) {
        routes.push(route);
      }
    }
  }

  return uniqueItems(routes.filter(Boolean));
}

function uniqueItems(items) {
  return Array.from(new Set(items));
}

function slugifyRoute(route) {
  if (route === "/") {
    return "home";
  }

  return route
    .replace(/^\/+/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function resolveSkipReason(...markdowns) {
  for (const markdown of markdowns) {
    if (!markdown) {
      continue;
    }

    const { frontmatter } = parseFrontmatter(markdown);
    const status = normalizeScalar(frontmatter.status);
    const skipReason = normalizeScalar(frontmatter.skip_reason);

    if (status === "skipped" && skipReason) {
      return skipReason;
    }
  }

  return "";
}

export function collectBrowserQaInputs({
  browserQaMarkdown = "",
  frontendSpecMarkdown = "",
  uxReviewMarkdown = "",
}) {
  const existingBrowserQa = parseFrontmatter(browserQaMarkdown);
  const browserQaScope = extractBulletLines(
    extractSection(existingBrowserQa.body, "Scope"),
  );
  const browserQaRoutes = extractRoutesFromLines(browserQaScope);

  if (browserQaRoutes.length > 0) {
    return {
      source: "browser-qa",
      routes: browserQaRoutes,
      skipReason: "",
    };
  }

  const frontendSpec = parseFrontmatter(frontendSpecMarkdown);
  const affectedRoutes = extractRoutesFromLines(
    extractBulletLines(extractSection(frontendSpec.body, "Affected Routes")),
  );

  if (affectedRoutes.length > 0) {
    return {
      source: "frontend-spec",
      routes: affectedRoutes,
      skipReason: "",
    };
  }

  const uxReview = parseFrontmatter(uxReviewMarkdown);
  const uxRoutes = extractRoutesFromLines(
    uniqueItems([
      ...extractBulletLines(extractSection(uxReview.body, "Entry Points")),
      ...extractBulletLines(extractSection(uxReview.body, "Browser QA Plan")),
    ]),
  );

  if (uxRoutes.length > 0) {
    return {
      source: "ux-review",
      routes: uxRoutes,
      skipReason: "",
    };
  }

  const skipReason = resolveSkipReason(browserQaMarkdown, frontendSpecMarkdown, uxReviewMarkdown);

  if (skipReason) {
    return {
      source: "skip-reason",
      routes: [],
      skipReason,
    };
  }

  return {
    source: "none",
    routes: [],
    skipReason: "",
  };
}

function renderFrontmatter({
  owner = "pd",
  docType = "task-local",
  sourceOfTruth = true,
  freshness = "active",
  verification = "generated",
  status = "in_progress",
  ownerRole = "pd",
  sourceRequest = "",
  affectedPaths = [],
  dependencies = [],
  skipReason = null,
}) {
  const yamlList = (items) =>
    items.length === 0 ? "[]" : `\n${items.map((item) => `  - ${item}`).join("\n")}`;

  return [
    "---",
    `owner: "${owner}"`,
    `doc_type: "${docType}"`,
    `source_of_truth: ${sourceOfTruth}`,
    `freshness: "${freshness}"`,
    `verification: "${verification}"`,
    `status: ${status}`,
    `owner_role: ${ownerRole}`,
    `source_request: ${JSON.stringify(sourceRequest)}`,
    `affected_paths:${yamlList(affectedPaths)}`,
    `dependencies:${yamlList(dependencies)}`,
    `skip_reason: ${skipReason === null ? "null" : JSON.stringify(skipReason)}`,
    "---",
    "",
  ].join("\n");
}

function renderSection(title, lines) {
  return [`## ${title}`, "", ...(lines.length > 0 ? lines : ["-"]), ""].join("\n");
}

export function renderBrowserQaMarkdown({
  sourceRequest,
  affectedPaths,
  dependencies,
  status,
  scopeLines,
  routeMatrixLines,
  runMetadataLines,
  evidenceLines,
  openIssueLines,
  suggestedScorecardEntryLines,
  skipReason,
}) {
  return [
    renderFrontmatter({
      sourceRequest,
      affectedPaths,
      dependencies,
      status,
      skipReason,
    }),
    "# Browser QA",
    "",
    renderSection("Scope", scopeLines),
    renderSection("Route Matrix", routeMatrixLines),
    renderSection("Run Metadata", runMetadataLines),
    renderSection("Evidence", evidenceLines),
    renderSection("Open Issues", openIssueLines),
    renderSection("Suggested Scorecard Entry", suggestedScorecardEntryLines),
  ].join("\n");
}

export function buildBrowserQaPaths({ workId, rootDir }) {
  return {
    workItemDir: `${rootDir}/docs/work-items/${workId}`,
    browserQaDocPath: `${rootDir}/docs/work-items/${workId}/browser-qa.md`,
    rawArtifactsDir: `${rootDir}/test-results/browser-qa/${workId}`,
    reportDir: `${rootDir}/playwright-report/browser-qa/${workId}`,
    reportManifestPath: `${rootDir}/playwright-report/browser-qa/${workId}/manifest.json`,
  };
}

export function buildBrowserQaViewports() {
  return [
    {
      key: "desktop",
      label: "desktop",
      viewport: { width: 1440, height: 1200 },
    },
    {
      key: "mobile",
      label: "mobile",
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3,
    },
  ];
}

export function buildScopeLines({ routes, source, skipReason }) {
  if (skipReason) {
    return [`- skipped: ${skipReason}`];
  }

  return [
    `- source: ${source}`,
    `- routes: ${routes.map((route) => `\`${route}\``).join(", ")}`,
    "- viewports: desktop, mobile",
  ];
}

export function buildRouteMatrixLines(routes) {
  return routes.map((route) => `- \`${route}\` -> desktop, mobile`);
}

export function buildSuggestedScorecardEntryLines({
  workId,
  rawArtifactsDir,
  reportManifestPath,
  skipReason,
  rootDir,
}) {
  if (skipReason) {
    return [
      `- Browser QA skip reason: ${skipReason}`,
      `- Browser QA summary: \`docs/work-items/${workId}/browser-qa.md\``,
    ];
  }

  return [
    `- Browser QA summary: \`docs/work-items/${workId}/browser-qa.md\``,
    `- Local raw artifacts: \`${relativeFromRoot(rawArtifactsDir, rootDir)}\``,
    `- Local report manifest: \`${relativeFromRoot(reportManifestPath, rootDir)}\``,
  ];
}

export function buildEvidenceLines(results, skipReason, rootDir) {
  if (skipReason) {
    return ["- Browser QA skipped because this work item is explicitly non-user-facing."];
  }

  return results.map((result) => {
    const status = result.ok ? "ok" : "failed";

    return [
      `- [${result.viewport}] \`${result.route}\` ${status}`,
      `screenshot: \`${relativeFromRoot(result.screenshotPath, rootDir)}\``,
      `trace: \`${relativeFromRoot(result.tracePath, rootDir)}\``,
    ].join(" | ");
  });
}

export function buildOpenIssueLines(results, skipReason) {
  if (skipReason) {
    return ["- none"];
  }

  const issues = results
    .filter((result) => !result.ok)
    .map((result) => `- [${result.viewport}] \`${result.route}\`: ${result.error}`);

  return issues.length > 0 ? issues : ["- none"];
}

export function buildManifest({
  workId,
  runAt,
  source,
  baseUrl,
  serverMode,
  results,
  rootDir,
}) {
  return {
    workId,
    runAt,
    source,
    baseUrl,
    serverMode,
    results: results.map((result) => ({
      route: result.route,
      viewport: result.viewport,
      ok: result.ok,
      screenshotPath: relativeFromRoot(result.screenshotPath, rootDir),
      tracePath: relativeFromRoot(result.tracePath, rootDir),
      error: result.error ?? null,
    })),
  };
}

function relativeFromRoot(absolutePath, rootDir) {
  if (!rootDir) {
    return absolutePath;
  }

  return path.relative(rootDir, absolutePath) || absolutePath;
}

export function buildArtifactFileNames(route, viewport) {
  const slug = slugifyRoute(route);

  return {
    screenshotFileName: `${slug}-${viewport}.png`,
    traceFileName: `${slug}-${viewport}-trace.zip`,
  };
}
