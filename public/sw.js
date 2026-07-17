const CACHE_VERSION = new URL(self.location.href).searchParams.get("v") ?? "dev";
const CACHE_NAME = `zhiyi-static-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";
const CORE_ASSETS = [
  "/",
  OFFLINE_URL,
  "/learn",
  "/ask",
  "/hexagrams",
  "/manifest.webmanifest",
  "/icons/apple-touch-icon.png",
  "/icons/zhiyi-icon-192.png",
  "/icons/zhiyi-icon-512.png",
  "/icons/zhiyi-icon.svg",
  "/icons/zhiyi-maskable-512.png",
  "/icons/zhiyi-maskable.svg",
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
            .filter((key) => key !== CACHE_NAME)
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
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
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
    const shouldRefresh =
      url.pathname === "/manifest.webmanifest" ||
      url.pathname.startsWith("/icons/");

    if (shouldRefresh) {
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
