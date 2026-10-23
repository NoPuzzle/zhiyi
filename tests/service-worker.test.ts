import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const serviceWorkerSource = readFileSync(
  new URL("../public/sw.js", import.meta.url),
  "utf8",
);

type WorkerListener = (event: Record<string, unknown>) => void;
type TestRequest = string | { url: string; method?: string; mode?: string; cache?: string };
const origin = "https://example.test";
const cacheName = (basePath: string, version = "current") =>
  `zhiyi-static-v2:${encodeURIComponent(basePath || "/")}:${version}`;
const requestUrl = (request: TestRequest) =>
  new URL(typeof request === "string" ? request : request.url, origin).href;

function createCache() {
  const entries = new Map<string, Response>();
  return {
    entries,
    match: vi.fn(async (request: TestRequest) => entries.get(requestUrl(request))?.clone()),
    put: vi.fn(async (request: TestRequest, response: Response) => {
      entries.set(requestUrl(request), response.clone());
    }),
  };
}

function loadServiceWorker(basePath = "/zhiyi", version = "current") {
  const listeners = new Map<string, WorkerListener>();
  const stores = new Map<string, ReturnType<typeof createCache>>();
  const cacheStorage = {
    open: vi.fn(async (name: string) => {
      if (!stores.has(name)) stores.set(name, createCache());
      return stores.get(name)!;
    }),
    keys: vi.fn(async () => [...stores.keys()]),
    delete: vi.fn(async (name: string) => stores.delete(name)),
  };
  const fetchMock = vi.fn(async (request: TestRequest) => {
    const pathname = new URL(requestUrl(request)).pathname;
    if (pathname.endsWith("/")) {
      const page = pathname.slice(basePath.length).replaceAll("/", "") || "home";
      return new Response(
        `<link rel="stylesheet" href="${basePath}/_next/static/main.css">` +
        `<script src="${basePath}/_next/static/shared.js"></script>` +
        `<script src="${basePath}/_next/static/${page}.js"></script>`,
        { headers: { "Content-Type": "text/html" } },
      );
    }
    return new Response(pathname);
  });
  const workerGlobal = {
    location: { href: `${origin}${basePath}/sw.js?v=${version}`, origin },
    addEventListener: (type: string, listener: WorkerListener) => {
      listeners.set(type, listener);
    },
    skipWaiting: vi.fn(async () => undefined),
    clients: { claim: vi.fn(async () => undefined) },
  };

  runInNewContext(serviceWorkerSource, {
    URL, Request, Response, caches: cacheStorage, fetch: fetchMock, self: workerGlobal,
  });

  async function lifecycle(type: "install" | "activate") {
    let completion: Promise<unknown> | undefined;
    listeners.get(type)!({
      waitUntil: (promise: Promise<unknown>) => { completion = promise; },
    });
    expect(completion).toBeDefined();
    await completion;
  }

  async function request(path: string, mode = "cors", method = "GET") {
    let response: Promise<Response> | undefined;
    listeners.get("fetch")!({
      request: { url: new URL(path, origin).href, method, mode },
      respondWith: (promise: Promise<Response>) => { response = promise; },
    });
    return response;
  }

  return { stores, cacheStorage, fetchMock, workerGlobal, lifecycle, request };
}

describe("service worker installation", () => {
  it("drains resource bodies without exhausting a limited HTTP connection pool", async () => {
    const harness = loadServiceWorker();
    const normalFetch = harness.fetchMock.getMockImplementation()!;
    const waiting: Array<() => void> = [];
    let active = 0;
    harness.fetchMock.mockImplementation(async (request) => {
      if (active === 2) {
        await new Promise<void>((resolve) => waiting.push(resolve));
      } else {
        active += 1;
      }
      const response = await normalFetch(request);
      const originalClone = response.clone.bind(response);
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        const next = waiting.shift();
        if (next) next();
        else active -= 1;
      };
      response.clone = () => {
        const copy = originalClone();
        const readBuffer = copy.arrayBuffer.bind(copy);
        const readText = copy.text.bind(copy);
        copy.arrayBuffer = async () => {
          try { return await readBuffer(); } finally { release(); }
        };
        copy.text = async () => {
          try { return await readText(); } finally { release(); }
        };
        return copy;
      };
      return response;
    });

    await harness.lifecycle("install");
    expect(waiting).toEqual([]);
    expect(active).toBe(0);
    expect(harness.stores.get(cacheName("/zhiyi"))).toBeDefined();
  }, 2_000);

  it.each(["", "/zhiyi"])("precaches the complete core HTML/JS/CSS set at %s", async (basePath) => {
    const harness = loadServiceWorker(basePath);
    await harness.lifecycle("install");
    const cache = harness.stores.get(cacheName(basePath))!;

    for (const route of ["/", "/offline/", "/learn/", "/ask/", "/hexagrams/", "/classics/"]) {
      expect(await cache.match(basePath + route)).toBeDefined();
      const page = route.replaceAll("/", "") || "home";
      expect(await cache.match(`${basePath}/_next/static/${page}.js`)).toBeDefined();
    }
    expect(await cache.match(`${basePath}/_next/static/main.css`)).toBeDefined();
    expect(await cache.match(`${basePath}/_next/static/shared.js`)).toBeDefined();
    expect(harness.fetchMock.mock.calls.every(([request]) =>
      typeof request !== "string" && request.cache === "reload",
    )).toBe(true);
    expect(harness.fetchMock.mock.calls.filter(([request]) =>
      requestUrl(request).endsWith("/shared.js"),
    )).toHaveLength(1);
    expect(harness.workerGlobal.skipWaiting).not.toHaveBeenCalled();
    const putUrls = cache.put.mock.calls.map(([request]) => requestUrl(request));
    expect(putUrls.findIndex((url) => url.endsWith("/main.css")))
      .toBeLessThan(putUrls.indexOf(origin + basePath + "/"));
  });

  it("only precaches same-origin, same-scope JS and CSS references", async () => {
    const harness = loadServiceWorker();
    harness.fetchMock.mockImplementation(async (request) =>
      new Response(requestUrl(request).endsWith("/") ? [
        '<script src="/zhiyi/_next/static/valid.js"></script>',
        '<link href="/zhiyi/_next/static/main.css" rel="stylesheet">',
        '<script src="https://elsewhere.test/zhiyi/_next/foreign.js"></script>',
        '<script src="/zhiyi-preview/_next/other.js"></script>',
        '<script src="/_next/root.js"></script>',
        '<link href="/zhiyi/_next/static/font.woff2" rel="preload">',
        '<script src="/zhiyi/api/not-a-chunk.js"></script>',
      ].join("") : "asset"),
    );

    await harness.lifecycle("install");
    const urls = harness.fetchMock.mock.calls.map(([request]) => requestUrl(request));
    expect(urls).toContain(origin + "/zhiyi/_next/static/valid.js");
    expect(urls).toContain(origin + "/zhiyi/_next/static/main.css");
    expect(urls.some((url) => /foreign|other\.js|root\.js|font\.woff2|not-a-chunk/.test(url))).toBe(false);
  });

  it("does not activate an incomplete install or remove the previous release", async () => {
    const harness = loadServiceWorker();
    const previous = await harness.cacheStorage.open(cacheName("/zhiyi", "previous"));
    await previous.put("/zhiyi/", new Response("previous document"));
    const normalFetch = harness.fetchMock.getMockImplementation()!;
    harness.fetchMock.mockImplementation((request) =>
      requestUrl(request).endsWith("/ask.js")
        ? Promise.resolve(new Response("unavailable", { status: 503 }))
        : normalFetch(request),
    );

    await expect(harness.lifecycle("install")).rejects.toThrow("503");
    expect(harness.stores.has(cacheName("/zhiyi"))).toBe(false);
    expect(await (await previous.match("/zhiyi/"))!.text()).toBe("previous document");
    expect(harness.workerGlobal.skipWaiting).not.toHaveBeenCalled();
    expect(harness.workerGlobal.clients.claim).not.toHaveBeenCalled();
  });

  it("preserves a pre-existing same-version cache on install failure", async () => {
    const harness = loadServiceWorker();
    const previous = await harness.cacheStorage.open(cacheName("/zhiyi"));
    await previous.put("/zhiyi/", new Response("same-version document"));
    harness.fetchMock.mockRejectedValue(new Error("offline"));

    await expect(harness.lifecycle("install")).rejects.toThrow("offline");
    expect(harness.cacheStorage.delete).not.toHaveBeenCalled();
    expect(await (await previous.match("/zhiyi/"))!.text()).toBe("same-version document");
  });

  it("keeps the old release until activation, then supports offline reload without it", async () => {
    const harness = loadServiceWorker();
    const oldName = cacheName("/zhiyi", "previous");
    const oldCache = await harness.cacheStorage.open(oldName);
    await oldCache.put("/zhiyi/ask/", new Response('<script src="/zhiyi/_next/static/obsolete.js"></script>'));
    await oldCache.put("/zhiyi/_next/static/obsolete.js", new Response("previous build"));
    await harness.lifecycle("install");
    expect(harness.stores.has(oldName)).toBe(true);

    await harness.lifecycle("activate");
    expect(harness.stores.has(oldName)).toBe(false);
    harness.fetchMock.mockRejectedValue(new Error("offline"));
    for (const path of ["/ask/", "/_next/static/ask.js", "/_next/static/main.css"]) {
      const response = await harness.request("/zhiyi" + path, path === "/ask/" ? "navigate" : "cors");
      expect(response?.ok).toBe(true);
    }
  });
});

describe("service worker cache isolation", () => {
  it.each(["", "/zhiyi"])("removes only old releases for the exact scope %s", async (basePath) => {
    const harness = loadServiceWorker(basePath);
    const otherPath = basePath ? "/zhiyi-preview" : "/root";
    const oldName = cacheName(basePath, "previous");
    const currentName = cacheName(basePath);
    const otherName = cacheName(otherPath, "previous");
    const legacyName = `zhiyi-static-${basePath || "root"}-previous`;
    const legacyOtherName = `zhiyi-static-${basePath || "root"}-preview-previous`;
    for (const name of [oldName, currentName, otherName, "another-app-cache"]) {
      await harness.cacheStorage.open(name);
    }
    const legacy = await harness.cacheStorage.open(legacyName);
    await legacy.put(basePath + "/", new Response("legacy home"));
    await legacy.put(basePath + "/manifest.webmanifest", new Response("{}"));
    const otherLegacy = await harness.cacheStorage.open(legacyOtherName);
    await otherLegacy.put(otherPath + "/", new Response("other home"));
    await otherLegacy.put(otherPath + "/manifest.webmanifest", new Response("{}"));

    await harness.lifecycle("activate");

    expect(harness.cacheStorage.delete.mock.calls.map(([name]) => name)).toEqual([oldName, legacyName]);
    expect([...harness.stores.keys()]).toEqual([currentName, otherName, "another-app-cache", legacyOtherName]);
    expect(harness.workerGlobal.clients.claim).toHaveBeenCalledOnce();
  });

  it("never reads a failed request from another release's cache", async () => {
    const harness = loadServiceWorker();
    const previous = await harness.cacheStorage.open(cacheName("/zhiyi", "previous"));
    await previous.put("/zhiyi/_next/static/shared.js", new Response("old code"));
    harness.fetchMock.mockRejectedValue(new Error("offline"));

    const response = await harness.request("/zhiyi/_next/static/shared.js");
    expect(response?.type).toBe("error");
  });

  it("leaves another project, external requests, and writes untouched", async () => {
    const harness = loadServiceWorker();
    expect(await harness.request("/zhiyi-preview/_next/static/shared.js")).toBeUndefined();
    expect(await harness.request("https://elsewhere.test/a.js")).toBeUndefined();
    expect(await harness.request("/zhiyi/ask/", "cors", "POST")).toBeUndefined();
    expect(harness.fetchMock).not.toHaveBeenCalled();
  });
});

describe("service worker runtime caching", () => {
  const runtimeRequests = [
    { path: "/zhiyi/ask/", mode: "navigate" },
    { path: "/zhiyi/_next/static/shared.js", mode: "cors" },
    { path: "/zhiyi/ink/thunder.avif", mode: "cors" },
  ];

  it.each(runtimeRequests)("uses the network when CacheStorage is unavailable for $path", async ({ path, mode }) => {
    const harness = loadServiceWorker();
    harness.cacheStorage.open.mockRejectedValue(new Error("Storage disabled"));
    harness.fetchMock.mockResolvedValue(new Response("online response"));

    const response = await harness.request(path, mode);
    expect(response?.status).toBe(200);
    expect(await response?.text()).toBe("online response");
    expect(harness.fetchMock).toHaveBeenCalledOnce();
  });

  it.each(runtimeRequests)("does not lose the network response when cache reads fail for $path", async ({ path, mode }) => {
    const harness = loadServiceWorker();
    const cache = await harness.cacheStorage.open(cacheName("/zhiyi"));
    cache.match.mockRejectedValue(new Error("Cache read failed"));
    harness.fetchMock.mockResolvedValue(new Response("online response"));

    const response = await harness.request(path, mode);
    expect(response?.status).toBe(200);
    expect(await response?.text()).toBe("online response");
    expect(harness.fetchMock).toHaveBeenCalledOnce();
  });

  it.each(runtimeRequests)("retains the HTTP response when cached fallback lookup fails for $path", async ({ path, mode }) => {
    const harness = loadServiceWorker();
    const cache = await harness.cacheStorage.open(cacheName("/zhiyi"));
    cache.match.mockRejectedValue(new Error("Cache read failed"));
    harness.fetchMock.mockResolvedValue(new Response("temporary outage", { status: 503 }));

    const response = await harness.request(path, mode);
    expect(response?.status).toBe(503);
    expect(await response?.text()).toBe("temporary outage");
    expect(cache.put).not.toHaveBeenCalled();
  });

  it("downloads document dependencies when cache lookup fails, without losing the page", async () => {
    const harness = loadServiceWorker();
    const cache = await harness.cacheStorage.open(cacheName("/zhiyi"));
    cache.match.mockRejectedValue(new Error("Cache read failed"));

    const response = await harness.request("/zhiyi/ask/", "navigate");
    expect(response?.status).toBe(200);
    expect(await response?.text()).toContain("/zhiyi/_next/static/ask.js");
    expect(harness.fetchMock.mock.calls.some(([request]) => requestUrl(request).endsWith("/ask.js"))).toBe(true);
    expect(cache.put.mock.calls.at(-1)?.[0]).toMatchObject({ url: origin + "/zhiyi/ask/" });
  });

  it("stores a visited document only after its dependencies", async () => {
    const harness = loadServiceWorker();
    const response = await harness.request("/zhiyi/hexagrams/3/", "navigate");
    expect(response?.ok).toBe(true);
    const cache = harness.stores.get(cacheName("/zhiyi"))!;
    const writes = cache.put.mock.calls.map(([request]) => requestUrl(request));
    expect(writes.at(-1)).toBe(origin + "/zhiyi/hexagrams/3/");
    expect(await cache.match("/zhiyi/_next/static/main.css")).toBeDefined();

    harness.fetchMock.mockRejectedValue(new Error("offline"));
    expect((await harness.request("/zhiyi/hexagrams/3/", "navigate"))?.ok).toBe(true);
  });

  it("preserves the cached document if the new document's chunks are missing", async () => {
    const harness = loadServiceWorker();
    const cache = await harness.cacheStorage.open(cacheName("/zhiyi"));
    await cache.put("/zhiyi/ask/", new Response("complete previous document"));
    const normalFetch = harness.fetchMock.getMockImplementation()!;
    harness.fetchMock.mockImplementation((request) =>
      requestUrl(request).endsWith("/ask.js")
        ? Promise.resolve(new Response("missing", { status: 404 }))
        : normalFetch(request),
    );

    expect((await harness.request("/zhiyi/ask/", "navigate"))?.ok).toBe(true);
    expect(await (await cache.match("/zhiyi/ask/"))!.text()).toBe("complete previous document");
  });

  it.each([404, 500, 503])("returns cached JS rather than an HTTP %s response", async (status) => {
    const harness = loadServiceWorker();
    const cache = await harness.cacheStorage.open(cacheName("/zhiyi"));
    await cache.put("/zhiyi/_next/static/shared.js", new Response("working chunk"));
    harness.fetchMock.mockResolvedValue(new Response("failure", { status }));

    const response = await harness.request("/zhiyi/_next/static/shared.js");
    expect(response?.status).toBe(200);
    expect(await response?.text()).toBe("working chunk");
    expect(cache.put).toHaveBeenCalledTimes(1);
  });

  it("returns an uncached HTTP error without storing it", async () => {
    const harness = loadServiceWorker();
    harness.fetchMock.mockResolvedValue(new Response("missing", { status: 404 }));
    expect((await harness.request("/zhiyi/unknown/", "navigate"))?.status).toBe(404);
    expect(harness.stores.get(cacheName("/zhiyi"))!.put).not.toHaveBeenCalled();
  });

  it("prefers a successful network chunk over its cached copy", async () => {
    const harness = loadServiceWorker();
    const cache = await harness.cacheStorage.open(cacheName("/zhiyi"));
    await cache.put("/zhiyi/_next/static/shared.js", new Response("previous"));
    harness.fetchMock.mockResolvedValue(new Response("current"));

    const response = await harness.request("/zhiyi/_next/static/shared.js");
    expect(await response?.text()).toBe("current");
    expect(await (await cache.match("/zhiyi/_next/static/shared.js"))!.text()).toBe("current");
  });

  it("uses the scoped offline page for an uncached offline navigation", async () => {
    const harness = loadServiceWorker();
    await harness.lifecycle("install");
    harness.fetchMock.mockRejectedValue(new Error("offline"));
    expect((await harness.request("/zhiyi/hexagrams/64/", "navigate"))?.ok).toBe(true);
  });
});
