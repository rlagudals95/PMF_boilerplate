import { existsSync } from "node:fs";
import path from "node:path";

const findAncestorWith = (startDir: string, marker: string) => {
  let currentDir = startDir;

  while (true) {
    if (existsSync(path.join(currentDir, marker))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      return undefined;
    }

    currentDir = parentDir;
  }
};

export const loadApiEnv = () => {
  const currentDir = process.cwd();
  const repoRoot = findAncestorWith(currentDir, "pnpm-workspace.yaml");
  const looksLikeApiPackage =
    existsSync(path.join(currentDir, "package.json")) &&
    (existsSync(path.join(currentDir, "src/main.ts")) ||
      existsSync(path.join(currentDir, "dist/main.js")));
  const packageRoot = looksLikeApiPackage
    ? currentDir
    : repoRoot
      ? path.join(repoRoot, "apps/api")
      : currentDir;

  const envFiles = [
    repoRoot ? path.join(repoRoot, ".env") : undefined,
    repoRoot ? path.join(repoRoot, ".env.local") : undefined,
    path.join(packageRoot, ".env"),
    path.join(packageRoot, ".env.local"),
  ].filter((file): file is string => Boolean(file));

  for (const envFile of envFiles) {
    if (existsSync(envFile)) {
      process.loadEnvFile(envFile);
    }
  }
};
