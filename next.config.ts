import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1);
const defaultPagesBasePath = repositoryName ? `/${repositoryName}` : "";
const basePath = isGitHubPages
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? defaultPagesBasePath)
  : "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isGitHubPages,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION:
      process.env.GITHUB_SHA ?? process.env.npm_package_version ?? "0.1.0",
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
