const SERVICE_WORKER_URL = new URL(self.location.href);
const CACHE_VERSION = SERVICE_WORKER_URL.searchParams.get("v") ?? "dev";
const BASE_PATH = SERVICE_WORKER_URL.pathname.replace(/\/sw\.js$/, "");
const withBasePath = (path) => `${BASE_PATH}${path}`;
const CACHE_NAMESPACE = `zhiyi-static-${BASE_PATH || "root"}-`;
const CACHE_NAME = `${CACHE_NAMESPACE}${CACHE_VERSION}`;
const OFFLINE_URL = withBasePath("/offline/");
const CORE_ASSETS = [
  withBasePath("/"),
  OFFLINE_URL,
  withBasePath("/learn/"),
  withBasePath("/ask/"),
  withBasePath("/hexagrams/"),
  withBasePath("/classics/"),
  withBasePath("/manifest.webmanifest"),
  withBasePath("/icons/apple-touch-icon.png"),
  withBasePath("/icons/zhiyi-icon-192.png"),
  withBasePath("/icons/zhiyi-icon-512.png"),
  withBasePath("/icons/zhiyi-icon.svg"),
  withBasePath("/icons/zhiyi-maskable-512.png"),
  withBasePath("/icons/zhiyi-maskable.svg"),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith(CACHE_NAMESPACE) && key !== CACHE_NAME,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }

          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached ?? caches.match(OFFLINE_URL)),
        ),
    );
    return;
  }

  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    const isNextAsset = url.pathname.startsWith(withBasePath("/_next/"));
    const shouldRefresh =
      url.pathname === withBasePath("/manifest.webmanifest") ||
      url.pathname.startsWith(withBasePath("/icons/"));

    if (isNextAsset || shouldRefresh) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }

            return response;
          })
          .catch(() => caches.match(request)),
      );
      return;
    }

    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }

          return response;
        });
      }),
    );
  }
});
