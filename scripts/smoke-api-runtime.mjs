import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { once } from "node:events";
import { spawn } from "node:child_process";

import {
  assertApiHealthPayload,
  getAvailablePort,
  sleep,
  waitForApiHealth,
} from "./lib/api-smoke.mjs";

const projectRoot = process.cwd();
const distEntry = path.join(projectRoot, "apps/api/dist/main.js");

const stopProcess = async (child) => {
  if (child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  const exited = once(child, "exit");
  const timeout = sleep(5_000).then(() => {
    if (child.exitCode === null) {
      child.kill("SIGKILL");
    }
  });

  await Promise.race([exited, timeout]);
};

const main = async () => {
  const distSource = await readFile(distEntry, "utf8");

  assert.equal(
    /from "@pmf\/|require\("@pmf\//.test(distSource),
    false,
    "apps/api dist bundle must not keep @pmf/* runtime imports.",
  );

  const port = await getAvailablePort();
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "pmf-api-runtime-"));
  const localDataFile = path.join(tempDir, "local-data.json");
  const child = spawn("node", [distEntry], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: String(port),
      LOCAL_DATA_FILE: localDataFile,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";

  child.stdout?.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr?.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    const health = await waitForApiHealth(`http://127.0.0.1:${port}/health`);
    assertApiHealthPayload(health, "local-json");
    console.log(`API runtime smoke passed on port ${port}.`);
  } catch (error) {
    const output = [stdout.trim(), stderr.trim()].filter(Boolean).join("\n");
    const detail = output ? `\n${output}` : "";

    throw new Error(
      `API runtime smoke failed: ${
        error instanceof Error ? error.message : String(error)
      }${detail}`,
    );
  } finally {
    await stopProcess(child);
    await rm(tempDir, { recursive: true, force: true });
  }
};

void main();
