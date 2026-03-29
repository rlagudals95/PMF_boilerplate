import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

import {
  assertApiHealthPayload,
  getAvailablePort,
  waitForApiHealth,
} from "./lib/api-smoke.mjs";

const execFileAsync = promisify(execFile);

const runCommand = async (command, args, options = {}) => {
  const { stdout, stderr } = await execFileAsync(command, args, options);

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
  };
};

const runStreamingCommand = async (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}.`),
      );
    });
  });

const main = async () => {
  const projectRoot = process.cwd();
  const imageTag = `pmf-api-smoke:${Date.now()}`;
  const containerName = `pmf-api-smoke-${Date.now()}`;
  const hostPort = await getAvailablePort();

  try {
    await runStreamingCommand(
      "docker",
      ["build", "-f", "apps/api/Dockerfile", "-t", imageTag, "."],
      {
        cwd: projectRoot,
      },
    );

    await runCommand(
      "docker",
      [
        "run",
        "--rm",
        "-d",
        "--name",
        containerName,
        "-p",
        `${hostPort}:4000`,
        imageTag,
      ],
      { cwd: projectRoot },
    );

    const health = await waitForApiHealth(`http://127.0.0.1:${hostPort}/health`, {
      timeoutMs: 20_000,
    });
    assertApiHealthPayload(health, "local-json");
    console.log(`API Docker smoke passed on port ${hostPort}.`);
  } finally {
    await execFileAsync("docker", ["rm", "-f", containerName], {
      cwd: projectRoot,
    }).catch(() => undefined);
    await execFileAsync("docker", ["image", "rm", imageTag], {
      cwd: projectRoot,
    }).catch(() => undefined);
  }
};

void main();
