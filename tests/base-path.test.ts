import { afterEach, describe, expect, it, vi } from "vitest";
import { getBasePath, withBasePath } from "../src/lib/base-path";

describe("base path helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses root paths for local and custom-domain builds", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");

    expect(getBasePath()).toBe("");
    expect(withBasePath("/offline/")).toBe("/offline/");
  });

  it("prefixes public assets for a GitHub project site", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/zhiyi");

    expect(getBasePath()).toBe("/zhiyi");
    expect(withBasePath("/manifest.webmanifest")).toBe(
      "/zhiyi/manifest.webmanifest",
    );
    expect(withBasePath("icons/zhiyi-icon.svg")).toBe(
      "/zhiyi/icons/zhiyi-icon.svg",
    );
  });

  it("normalizes surrounding slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "//zhiyi//");

    expect(getBasePath()).toBe("/zhiyi");
    expect(withBasePath("/")).toBe("/zhiyi/");
  });
});
