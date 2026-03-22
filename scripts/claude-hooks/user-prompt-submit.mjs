#!/usr/bin/env node

async function main() {
  const raw = await readStdin();
  const payload = raw ? safeParseJson(raw) : null;
  const prompt = extractPrompt(payload).trim();

  if (!prompt || !shouldRemind(prompt)) {
    return;
  }

  process.stdout.write(
    [
      "Repo workflow reminder:",
      "- Important or business-goal-driven work should use `product-squad`, `goal-driven-delivery`, and `agent-team-delivery`.",
      "- Create or update `docs/work-items/<work-id>/brief.md`, `team-plan.md`, and `quality-scorecard.md` before or alongside implementation.",
      "- Available Claude project agents: `product-lead`, `pm-analyst`, `pd-reviewer`, `fe-builder`, `be-builder`, `quality-reviewer`.",
      "- Before handoff, run `pnpm squad:check [work-id]` and the appropriate verify command.",
    ].join("\n"),
  );
}

function shouldRemind(prompt) {
  const importantPatterns = [
    /feature|experiment|landing|funnel|admin|analytics|schema|repository|workflow|subagent|agent|squad|business goal|product|prd|spec|review|platform/i,
    /기능|실험|랜딩|퍼널|어드민|분석|스키마|리포지토리|워크플로|서브에이전트|서브에어전트|에이전트|에어전트|스쿼드|비즈니스 목표|제품|prd|스펙|설계|플랫폼/i,
  ];
  const lightPatterns = [
    /typo|copy only|spacing|css only|small style/i,
    /오탈자|간격|문구만|스타일만/i,
  ];

  if (lightPatterns.some((pattern) => pattern.test(prompt))) {
    return false;
  }

  return importantPatterns.some((pattern) => pattern.test(prompt));
}

function extractPrompt(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (typeof payload.prompt === "string") {
    return payload.prompt;
  }

  if (typeof payload.userPrompt === "string") {
    return payload.userPrompt;
  }

  if (payload.message && typeof payload.message === "string") {
    return payload.message;
  }

  return "";
}

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function readStdin() {
  const chunks = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
