import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const serviceWorkerSource = readFileSync(
  new URL("../public/sw.js", import.meta.url),
  "utf8",
);

type WorkerListener = (event: Record<string, unknown>) => void;

type MockResponse = {
  ok: boolean;
  clone: ReturnType<typeof vi.fn>;
};

function loadServiceWorker(workerUrl: string, cacheKeys: string[] = []) {
  const listeners = new Map<string, WorkerListener>();
  const cache = {
    addAll: vi
      .fn<(assets: string[]) => Promise<void>>()
      .mockResolvedValue(undefined),
    put: vi
      .fn<(request: unknown, response: unknown) => Promise<void>>()
      .mockResolvedValue(undefined),
  };
  const cacheStorage = {
    open: vi
      .fn<(name: string) => Promise<typeof cache>>()
      .mockResolvedValue(cache),
    keys: vi
      .fn<() => Promise<string[]>>()
      .mockResolvedValue(cacheKeys),
    delete: vi
      .fn<(name: string) => Promise<boolean>>()
      .mockResolvedValue(true),
    match: vi.fn<(request: unknown) => Promise<unknown>>(),
  };
  const fetchMock =
    vi.fn<(request: unknown) => Promise<MockResponse>>();
  const workerGlobal = {
    location: { href: workerUrl, origin: new URL(workerUrl).origin },
    addEventListener: (type: string, listener: WorkerListener) => {
      listeners.set(type, listener);
    },
    skipWaiting: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    clients: {
      claim: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    },
  };

  runInNewContext(serviceWorkerSource, {
    URL,
    caches: cacheStorage,
    fetch: fetchMock,
    self: workerGlobal,
  });

  return {
    cache,
    cacheStorage,
    fetchMock,
    listeners,
  };
}

async function activateWorker(
  listeners: Map<string, WorkerListener>,
) {
  let completion: Promise<unknown> | undefined;
  const listener = listeners.get("activate");

  if (!listener) {
    throw new Error("activate listener was not registered");
  }

  listener({
    waitUntil: (promise: Promise<unknown>) => {
      completion = promise;
    },
  });

  if (!completion) {
    throw new Error("activate listener did not extend its lifetime");
  }

  await completion;
}

async function navigate(
  listeners: Map<string, WorkerListener>,
  fetchMock: ReturnType<typeof vi.fn>,
  response: MockResponse,
) {
  const request = {
    method: "GET",
    mode: "navigate",
    url: "https://example.test/hexagrams/",
  };
  let responsePromise: Promise<MockResponse> | undefined;
  const listener = listeners.get("fetch");

  if (!listener) {
    throw new Error("fetch listener was not registered");
  }

  fetchMock.mockResolvedValue(response);
  listener({
    request,
    respondWith: (promise: Promise<MockResponse>) => {
      responsePromise = promise;
    },
  });

  if (!responsePromise) {
    throw new Error("navigation did not provide a response");
  }

  await responsePromise;
  await Promise.resolve();

  return request;
}

async function requestAsset(
  listeners: Map<string, WorkerListener>,
  fetchMock: ReturnType<typeof vi.fn>,
  response: MockResponse,
  url: string,
) {
  const request = {
    method: "GET",
    mode: "cors",
    url,
  };
  let responsePromise: Promise<MockResponse> | undefined;
  const listener = listeners.get("fetch");

  if (!listener) {
    throw new Error("fetch listener was not registered");
  }

  fetchMock.mockResolvedValue(response);
  listener({
    request,
    respondWith: (promise: Promise<MockResponse>) => {
      responsePromise = promise;
    },
  });

  if (!responsePromise) {
    throw new Error("asset request did not provide a response");
  }

  await responsePromise;
  await Promise.resolve();

  return request;
}

describe("service worker cache isolation", () => {
  it("removes only old root-scoped Zhiyi caches", async () => {
    const harness = loadServiceWorker("https://example.test/sw.js?v=current", [
      "zhiyi-static-root-previous",
      "zhiyi-static-root-current",
      "zhiyi-static-/zhiyi-previous",
      "another-app-cache",
    ]);

    await activateWorker(harness.listeners);

    expect(harness.cacheStorage.delete).toHaveBeenCalledTimes(1);
    expect(harness.cacheStorage.delete).toHaveBeenCalledWith(
      "zhiyi-static-root-previous",
    );
  });

  it("removes only old caches for the /zhiyi base path", async () => {
    const harness = loadServiceWorker(
      "https://example.test/zhiyi/sw.js?v=current",
      [
        "zhiyi-static-/zhiyi-previous",
        "zhiyi-static-/zhiyi-current",
        "zhiyi-static-root-previous",
        "zhiyi-static-/another-project-previous",
        "another-app-cache",
      ],
    );

    await activateWorker(harness.listeners);

    expect(harness.cacheStorage.delete).toHaveBeenCalledTimes(1);
    expect(harness.cacheStorage.delete).toHaveBeenCalledWith(
      "zhiyi-static-/zhiyi-previous",
    );
  });
});

describe("service worker navigation caching", () => {
  it("caches a successful navigation response", async () => {
    const harness = loadServiceWorker(
      "https://example.test/zhiyi/sw.js?v=current",
    );
    const cachedResponse = { cached: true };
    const response = {
      ok: true,
      clone: vi.fn(() => cachedResponse),
    };

    const request = await navigate(
      harness.listeners,
      harness.fetchMock,
      response,
    );

    expect(harness.cacheStorage.open).toHaveBeenCalledWith(
      "zhiyi-static-/zhiyi-current",
    );
    expect(harness.cache.put).toHaveBeenCalledWith(request, cachedResponse);
  });

  it("does not cache a failed navigation response", async () => {
    const harness = loadServiceWorker(
      "https://example.test/zhiyi/sw.js?v=current",
    );
    const response = {
      ok: false,
      clone: vi.fn(),
    };

    await navigate(harness.listeners, harness.fetchMock, response);

    expect(response.clone).not.toHaveBeenCalled();
    expect(harness.cacheStorage.open).not.toHaveBeenCalled();
    expect(harness.cache.put).not.toHaveBeenCalled();
  });
});

describe("service worker Next.js asset refresh", () => {
  it("checks the network before a cached Next.js chunk", async () => {
    const harness = loadServiceWorker(
      "https://example.test/zhiyi/sw.js?v=current",
    );
    const cachedResponse = { cached: true };
    const response = {
      ok: true,
      clone: vi.fn(() => cachedResponse),
    };
    harness.cacheStorage.match.mockResolvedValue({ stale: true });

    const request = await requestAsset(
      harness.listeners,
      harness.fetchMock,
      response,
      "https://example.test/zhiyi/_next/static/chunks/app.js",
    );

    expect(harness.fetchMock).toHaveBeenCalledWith(request);
    expect(harness.cacheStorage.match).not.toHaveBeenCalled();
    expect(harness.cache.put).toHaveBeenCalledWith(request, cachedResponse);
  });
});
