#!/usr/bin/env node

import { spawn } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

import {
  buildArtifactFileNames,
  buildBrowserQaPaths,
  buildBrowserQaViewports,
  buildEvidenceLines,
  buildManifest,
  buildOpenIssueLines,
  buildRouteMatrixLines,
  buildScopeLines,
  buildSuggestedScorecardEntryLines,
  collectBrowserQaInputs,
  parseFrontmatter,
  renderBrowserQaMarkdown,
} from "./lib/browser-qa.mjs";

const rootDir = process.cwd();
const defaultBaseUrl = "http://127.0.0.1:3100";
const defaultServerCommand = "pnpm db:seed && pnpm --filter web exec next dev --port 3100";
const serverTimeoutMs = 120_000;
const pollIntervalMs = 1_000;

async function main() {
  const { workId } = parseArgs(process.argv.slice(2));
  const artifactPaths = buildBrowserQaPaths({ workId, rootDir });

  await access(artifactPaths.workItemDir);

  const docs = await readWorkItemDocs(artifactPaths.workItemDir);
  const inputs = collectBrowserQaInputs({
    browserQaMarkdown: docs.browserQaMarkdown,
    frontendSpecMarkdown: docs.frontendSpecMarkdown,
    uxReviewMarkdown: docs.uxReviewMarkdown,
  });
  const sourceRequest =
    readSourceRequest(docs.goalPacketMarkdown) ||
    readSourceRequest(docs.briefMarkdown) ||
    `Browser QA run for ${workId}`;
  const dependencies = [
    path.join("docs", "work-items", workId, "frontend-spec.md"),
    path.join("docs", "work-items", workId, "ux-review.md"),
    path.join("docs", "work-items", workId, "quality-scorecard.md"),
  ].filter((dependency) => existsInDocs(dependency, docs));
  const affectedPaths = [...dependencies];

  if (inputs.skipReason) {
    const markdown = renderBrowserQaMarkdown({
      sourceRequest,
      affectedPaths,
      dependencies,
      status: "skipped",
      scopeLines: buildScopeLines({
        routes: [],
        source: inputs.source,
        skipReason: inputs.skipReason,
      }),
      routeMatrixLines: ["- none"],
      runMetadataLines: [
        `- run_at: ${new Date().toISOString()}`,
        `- source: ${inputs.source}`,
        "- execution: skipped",
      ],
      evidenceLines: buildEvidenceLines([], inputs.skipReason, rootDir),
      openIssueLines: buildOpenIssueLines([], inputs.skipReason),
      suggestedScorecardEntryLines: buildSuggestedScorecardEntryLines({
        workId,
        rawArtifactsDir: artifactPaths.rawArtifactsDir,
        reportManifestPath: artifactPaths.reportManifestPath,
        skipReason: inputs.skipReason,
        rootDir,
      }),
      skipReason: inputs.skipReason,
    });

    await writeFile(artifactPaths.browserQaDocPath, markdown);
    process.stdout.write(
      [
        `Browser QA skipped for ${workId}`,
        `- Reason: ${inputs.skipReason}`,
        `- Summary: docs/work-items/${workId}/browser-qa.md`,
      ].join("\n") + "\n",
    );
    return;
  }

  if (inputs.routes.length === 0) {
    throw new Error(
      `No user-facing browser QA routes could be resolved for ${workId}. Fill Affected Routes, Entry Points, or Browser QA Plan first.`,
    );
  }

  await mkdir(artifactPaths.rawArtifactsDir, { recursive: true });
  await mkdir(artifactPaths.reportDir, { recursive: true });

  const server = await ensureWebServer(defaultBaseUrl);

  try {
    const runAt = new Date().toISOString();
    const results = await captureBrowserEvidence({
      baseUrl: defaultBaseUrl,
      routes: inputs.routes,
      rawArtifactsDir: artifactPaths.rawArtifactsDir,
    });

    const manifest = buildManifest({
      workId,
      runAt,
      source: inputs.source,
      baseUrl: defaultBaseUrl,
      serverMode: server.mode,
      rootDir,
      results,
    });
    await writeFile(
      artifactPaths.reportManifestPath,
      `${JSON.stringify(manifest, null, 2)}\n`,
    );

    const failures = results.filter((result) => !result.ok);
    const markdown = renderBrowserQaMarkdown({
      sourceRequest,
      affectedPaths,
      dependencies,
      status: failures.length === 0 ? "done" : "in_progress",
      scopeLines: buildScopeLines({
        routes: inputs.routes,
        source: inputs.source,
        skipReason: "",
      }),
      routeMatrixLines: buildRouteMatrixLines(inputs.routes),
      runMetadataLines: [
        `- run_at: ${runAt}`,
        `- source: ${inputs.source}`,
        `- base_url: ${defaultBaseUrl}`,
        `- server_mode: ${server.mode}`,
        `- report_manifest: \`${path.relative(rootDir, artifactPaths.reportManifestPath)}\``,
      ],
      evidenceLines: buildEvidenceLines(results, "", rootDir),
      openIssueLines: buildOpenIssueLines(results, ""),
      suggestedScorecardEntryLines: buildSuggestedScorecardEntryLines({
        workId,
        rawArtifactsDir: artifactPaths.rawArtifactsDir,
        reportManifestPath: artifactPaths.reportManifestPath,
        skipReason: null,
        rootDir,
      }),
      skipReason: null,
    });
    await writeFile(artifactPaths.browserQaDocPath, markdown);

    process.stdout.write(
      [
        `Browser QA complete for ${workId}`,
        `- Routes: ${inputs.routes.join(", ")}`,
        `- Raw artifacts: ${path.relative(rootDir, artifactPaths.rawArtifactsDir)}`,
        `- Report manifest: ${path.relative(rootDir, artifactPaths.reportManifestPath)}`,
        `- Summary: docs/work-items/${workId}/browser-qa.md`,
      ].join("\n") + "\n",
    );

    if (failures.length > 0) {
      throw new Error(
        `Browser QA captured ${failures.length} failing route/viewport pairs. Check docs/work-items/${workId}/browser-qa.md for details.`,
      );
    }
  } finally {
    await server.stop();
  }
}

function parseArgs(args) {
  let workId = "";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--work") {
      workId = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (!workId) {
      workId = arg;
    }
  }

  if (!workId) {
    throw new Error("Usage: pnpm browser:qa --work <work-id>");
  }

  return { workId };
}

async function readWorkItemDocs(workItemDir) {
  return {
    browserQaMarkdown: await readIfExists(path.join(workItemDir, "browser-qa.md")),
    frontendSpecMarkdown: await readIfExists(path.join(workItemDir, "frontend-spec.md")),
    uxReviewMarkdown: await readIfExists(path.join(workItemDir, "ux-review.md")),
    goalPacketMarkdown: await readIfExists(path.join(workItemDir, "goal-packet.md")),
    briefMarkdown: await readIfExists(path.join(workItemDir, "brief.md")),
    qualityScorecardMarkdown: await readIfExists(
      path.join(workItemDir, "quality-scorecard.md"),
    ),
  };
}

async function readIfExists(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return "";
    }

    throw error;
  }
}

function readSourceRequest(markdown) {
  if (!markdown) {
    return "";
  }

  return parseFrontmatter(markdown).frontmatter.source_request?.replace(
    /^['"]|['"]$/g,
    "",
  ) ?? "";
}

function existsInDocs(relativePath, docs) {
  const fileName = path.basename(relativePath);

  switch (fileName) {
    case "frontend-spec.md":
      return Boolean(docs.frontendSpecMarkdown);
    case "ux-review.md":
      return Boolean(docs.uxReviewMarkdown);
    case "quality-scorecard.md":
      return Boolean(docs.qualityScorecardMarkdown);
    default:
      return false;
  }
}

async function captureBrowserEvidence({ baseUrl, routes, rawArtifactsDir }) {
  const browser = await chromium.launch();
  const results = [];

  try {
    for (const route of routes) {
      for (const viewport of buildBrowserQaViewports()) {
        const { screenshotFileName, traceFileName } = buildArtifactFileNames(
          route,
          viewport.key,
        );
        const screenshotPath = path.join(rawArtifactsDir, screenshotFileName);
        const tracePath = path.join(rawArtifactsDir, traceFileName);
        const context = await browser.newContext({
          baseURL: baseUrl,
          viewport: viewport.viewport,
          isMobile: viewport.isMobile,
          hasTouch: viewport.hasTouch,
          deviceScaleFactor: viewport.deviceScaleFactor,
        });
        const page = await context.newPage();
        let errorMessage = "";

        try {
          await context.tracing.start({ screenshots: true, snapshots: true });
          const response = await page.goto(route, { waitUntil: "networkidle" });

          if (!response) {
            throw new Error("navigation produced no response");
          }

          if (response.status() >= 400) {
            throw new Error(`navigation returned HTTP ${response.status()}`);
          }

          await page.screenshot({ path: screenshotPath, fullPage: true });
          results.push({
            route,
            viewport: viewport.label,
            ok: true,
            screenshotPath,
            tracePath,
          });
        } catch (error) {
          errorMessage = error instanceof Error ? error.message : String(error);

          try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
          } catch {}

          results.push({
            route,
            viewport: viewport.label,
            ok: false,
            screenshotPath,
            tracePath,
            error: errorMessage,
          });
        } finally {
          try {
            await context.tracing.stop({ path: tracePath });
          } catch {}
          await page.close().catch(() => {});
          await context.close().catch(() => {});
        }
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function ensureWebServer(baseUrl) {
  if (await isUrlReady(baseUrl)) {
    return { mode: "reused", stop: async () => {} };
  }

  const child = spawn(defaultServerCommand, {
    cwd: rootDir,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  let serverLogs = "";

  child.stdout?.on("data", (chunk) => {
    serverLogs = `${serverLogs}${chunk}`;
    serverLogs = trimServerLogs(serverLogs);
  });
  child.stderr?.on("data", (chunk) => {
    serverLogs = `${serverLogs}${chunk}`;
    serverLogs = trimServerLogs(serverLogs);
  });

  try {
    await waitForUrl(baseUrl, child, () => serverLogs, serverTimeoutMs);
  } catch (error) {
    if (child.exitCode === null) {
      if (process.platform === "win32") {
        child.kill("SIGTERM");
      } else {
        process.kill(-child.pid, "SIGTERM");
      }
    }

    throw error;
  }

  return {
    mode: "started",
    stop: async () => {
      if (child.exitCode !== null) {
        return;
      }

      if (process.platform === "win32") {
        child.kill("SIGTERM");
        return;
      }

      process.kill(-child.pid, "SIGTERM");
    },
  };
}

async function waitForUrl(url, child, getServerLogs, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isUrlReady(url)) {
      return;
    }

    if (child.exitCode !== null) {
      const logTail = summarizeServerLogs(getServerLogs());
      throw new Error(
        logTail
          ? `Browser QA server failed before ${url} became ready.\n${logTail}`
          : `Browser QA server failed before ${url} became ready.`,
      );
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  const logTail = summarizeServerLogs(getServerLogs());
  throw new Error(
    logTail ? `Timed out waiting for ${url}\n${logTail}` : `Timed out waiting for ${url}`,
  );
}

async function isUrlReady(url) {
  try {
    const response = await fetch(url, { method: "GET" });
    return response.ok;
  } catch {
    return false;
  }
}

function isMissingPathError(error) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT",
  );
}

function trimServerLogs(logs) {
  const normalized = logs.slice(-8_000);
  const lines = normalized.split("\n");

  return lines.slice(-40).join("\n");
}

function summarizeServerLogs(logs) {
  const summary = logs.trim();

  if (!summary) {
    return "";
  }

  return `Server log tail:\n${summary}`;
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
