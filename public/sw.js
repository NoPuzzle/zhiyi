const SERVICE_WORKER_URL = new URL(self.location.href);
const CACHE_VERSION = SERVICE_WORKER_URL.searchParams.get("v") ?? "dev";
const BASE_PATH = SERVICE_WORKER_URL.pathname.replace(/\/sw\.js$/, "");
const withBasePath = (path) => `${BASE_PATH}${path}`;
// The encoded path and delimiter distinguish /zhiyi from /zhiyi-preview.
const CACHE_NAMESPACE = `zhiyi-static-v2:${encodeURIComponent(BASE_PATH || "/")}:`;
const CACHE_NAME = `${CACHE_NAMESPACE}${encodeURIComponent(CACHE_VERSION)}`;
const LEGACY_NAMESPACE = `zhiyi-static-${BASE_PATH || "root"}-`;
const HOME_URL = withBasePath("/");
const OFFLINE_URL = withBasePath("/offline/");
const CORE_PAGES = [
  HOME_URL,
  OFFLINE_URL,
  withBasePath("/learn/"),
  withBasePath("/ask/"),
  withBasePath("/hexagrams/"),
  withBasePath("/classics/"),
];
const CORE_ASSETS = [
  withBasePath("/manifest.webmanifest"),
  withBasePath("/icons/apple-touch-icon.png"),
  withBasePath("/icons/zhiyi-icon-192.png"),
  withBasePath("/icons/zhiyi-icon-512.png"),
  withBasePath("/icons/zhiyi-icon.svg"),
  withBasePath("/icons/zhiyi-maskable-512.png"),
  withBasePath("/icons/zhiyi-maskable.svg"),
];

function documentDependencies(html) {
  const dependencies = new Set();

  // Only inspect resource tags in our generated HTML, never inline script text.
  for (const [tag] of html.matchAll(/<(?:script|link)\b[^>]*>/gi)) {
    const source = tag.match(/\b(?:src|href)\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!source) continue;

    const url = new URL(source.replaceAll("&amp;", "&"), self.location.origin);
    if (
      url.origin === self.location.origin &&
      url.pathname.startsWith(withBasePath("/_next/")) &&
      /\.(?:js|css)$/.test(url.pathname)
    ) {
      dependencies.add(url.href);
    }
  }

  return [...dependencies];
}

async function fetchRequired(url) {
  // An install must not combine fresh HTML with the browser's old HTTP cache.
  const response = await fetch(new Request(url, { cache: "reload" }));
  if (!response.ok) throw new Error(`Cannot cache ${url}: ${response.status}`);
  // Drain each body before awaiting the next batch of headers. Otherwise large
  // unconsumed JS responses can occupy every HTTP/1 connection and stall install.
  // Cloning retains the browser's response metadata for the later cache write.
  await response.clone().arrayBuffer();
  return response;
}

async function installCore() {
  const existed = (await caches.keys()).includes(CACHE_NAME);
  try {
    const pages = await Promise.all(CORE_PAGES.map(async (path) => {
      const url = new URL(path, self.location.origin).href;
      const response = await fetchRequired(url);
      const dependencies = documentDependencies(await response.clone().text());
      return { url, response, dependencies };
    }));
    const dependencies = [...new Set(pages.flatMap((page) => page.dependencies))];
    const assets = await Promise.all([...CORE_ASSETS, ...dependencies].map(async (path) => {
      const url = new URL(path, self.location.origin).href;
      return { url, response: await fetchRequired(url) };
    }));

    // Read everything first, then store dependencies before their HTML. If a
    // local build reuses its version, a failed fetch leaves its old cache intact.
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(assets.map(({ url, response }) => cache.put(url, response)));
    await Promise.all(pages.map(({ url, response }) => cache.put(url, response)));
  } catch (error) {
    if (!existed) await caches.delete(CACHE_NAME);
    throw error;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(installCore());
  // Do not skipWaiting: an open page may still need its previous build's chunks.
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key === CACHE_NAME) continue;

      if (key.startsWith(CACHE_NAMESPACE)) {
        await caches.delete(key);
      } else if (key.startsWith(LEGACY_NAMESPACE)) {
        // Old names have an ambiguous '-' separator. Verify ownership from
        // mandatory cached URLs rather than deleting by their shared prefix.
        const legacy = await caches.open(key);
        const home = await legacy.match(HOME_URL);
        const manifest = await legacy.match(withBasePath("/manifest.webmanifest"));
        if (home && manifest) await caches.delete(key);
      }
    }
    await self.clients.claim();
  })());
});

async function openRuntimeCache() {
  try {
    return await caches.open(CACHE_NAME);
  } catch {
    // Runtime storage is optional: a disabled or unavailable cache must not
    // turn a working network request into an application outage.
    return undefined;
  }
}

async function matchRuntimeCache(cache, request) {
  try {
    return await cache?.match(request);
  } catch {
    return undefined;
  }
}

async function cacheDocument(cache, request, response) {
  const dependencies = documentDependencies(await response.clone().text());
  await Promise.all(dependencies.map(async (url) => {
    if (!(await matchRuntimeCache(cache, url))) {
      await cache.put(url, await fetchRequired(url));
    }
  }));
  await cache.put(request, response);
}

async function networkFirst(request, isNavigation) {
  const cache = await openRuntimeCache();
  try {
    const response = await fetch(request);
    if (response.ok) {
      try {
        if (cache) {
          if (isNavigation) {
            await cacheDocument(cache, request, response.clone());
          } else {
            await cache.put(request, response.clone());
          }
        }
      } catch {
        // Storage limits or missing new chunks must not destroy an old document
        // or prevent the network response from being used while online.
      }
      return response;
    }
    // HTTP failures do not throw. A cached script is still usable after a 404
    // (removed build) or 5xx (temporary outage).
    return (await matchRuntimeCache(cache, request)) ?? response;
  } catch {
    return (await matchRuntimeCache(cache, request)) ??
      (isNavigation ? await matchRuntimeCache(cache, OFFLINE_URL) : undefined) ??
      Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await openRuntimeCache();
  const cached = await matchRuntimeCache(cache, request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    try {
      await cache?.put(request, response.clone());
    } catch {
      // The fetched resource remains usable when storage is full.
    }
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(withBasePath("/"))
  ) return;

  const isNavigation = request.mode === "navigate";
  const shouldRefresh = isNavigation ||
    url.pathname.startsWith(withBasePath("/_next/")) ||
    url.pathname === withBasePath("/manifest.webmanifest") ||
    url.pathname.startsWith(withBasePath("/icons/"));

  // Awaiting writes in the response promise keeps the worker alive until the
  // cache operation finishes, instead of launching untracked background work.
  event.respondWith(shouldRefresh ? networkFirst(request, isNavigation) : cacheFirst(request));
});
