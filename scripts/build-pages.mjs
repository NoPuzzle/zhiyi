import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const nextCli = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const result = spawnSync(process.execPath, [nextCli, "build"], {
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    GITHUB_REPOSITORY:
      process.env.GITHUB_REPOSITORY ?? "NoPuzzle/zhiyi",
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
