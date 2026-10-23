# Zhiyi PWA Notes

Zhiyi includes basic installability and offline support for V0.1.

## Included

- Web app manifest at `/manifest.webmanifest` locally and below the resolved
  base path on GitHub Pages.
- App name `知易 / Zhiyi` and short name `知易`.
- Rice-paper theme and background colors.
- SVG, standard PNG, maskable PNG, and Apple touch icons.
- Production-only service worker registration.
- Offline fallback page at `/offline`.
- Runtime caching for visited same-origin pages and static assets.

## Cache Version Strategy

`next.config.ts` exposes a deployment version as `NEXT_PUBLIC_APP_VERSION`.
Local and conventional server builds use the current `package.json` version;
GitHub Pages builds use `GITHUB_SHA`. The browser registers:

```txt
<base-path>/sw.js?v=<deployment-version>
```

`public/sw.js` derives its scope base path from its own URL. Cache names use an
encoded path followed by an unambiguous delimiter, for example
`zhiyi-static-v2:%2Fzhiyi:<version>`. A root deployment, `/zhiyi`, and
`/zhiyi-preview` have different namespaces. When migrating the old ambiguous
cache names, the worker verifies both the exact cached homepage URL and
manifest URL before deleting a cache; the name prefix alone is not sufficient.

Installation fetches the six core pages (home, offline, Learn, Ask, hexagram
browser, and Classics) and extracts the same-origin, same-scope `/_next/`
JavaScript and CSS referenced by their resource tags. The HTML, dependencies,
manifest, and icons must all return successfully before installation completes.
Install requests bypass the browser's stale HTTP cache and consume response
bodies as they arrive, so large chunks cannot exhaust the HTTP connection pool
while installation waits for later response headers. Dependencies are stored
before HTML. A failed install removes only a newly created incomplete
cache, never a pre-existing cache with the same version.

An update does **not** call `skipWaiting`: existing pages may still need their
old build's chunks. The new worker waits until all pages controlled by the old
worker have closed. Close all Zhiyi tabs and installed-app windows, then reopen
to use the new version; an ordinary reload may keep the update waiting. Once
the fully prepared worker activates, it removes older caches only in its own
scope. Previous versions are not accumulated indefinitely. Previously visited
non-core pages must be visited again after this version change to be available
offline.

Navigation responses are cached only when `response.ok` is true and their
referenced JS/CSS has been cached successfully. A failed dependency fetch
preserves the earlier complete cached document. Offline navigation falls back
to the current version's cached page or the scoped offline page. Reads are
restricted to the active worker's cache, not a global search across releases.

Next.js runtime assets use network-first delivery with a cached fallback for
both network exceptions and HTTP errors such as 404 or 503. Failed responses
are never cached. Cache writes are awaited within the fetch response's
lifetime; storage failures do not block an otherwise successful online
response. If opening or reading runtime CacheStorage itself fails, requests
still use the network. Installation remains strict because an incomplete new
offline cache must not replace the previous worker.

The service worker is registered with `updateViaCache: "none"`. Manifest and
icon requests prefer the network and fall back to cache, so metadata and icon
updates do not remain permanently hidden behind a cache-first response.

Release rule: bump the package version for semantic releases. GitHub Pages
cache invalidation does not depend on a manual version bump.

## Not Included

- Push notifications.
- Background sync.
- Login or cloud data.
- A custom install prompt.

## Local Testing

Use a production build because service worker registration is disabled during
development:

```bash
npm run build
npm run start
```

Open `http://localhost:3000` in Chrome or Edge, then:

1. Open DevTools > Application.
2. Check Manifest for names, colors, and icons.
3. Confirm the registered worker URL includes `sw.js?v=0.1.0` or the current
   package version.
4. Wait for installation to complete; confirm cached core HTML plus its
   referenced JS and CSS exist without having to visit every core route.
5. Enable offline mode in DevTools and directly open `/learn/`, `/ask/`, and
   `/hexagrams/`. Confirm styles and controls work, not just the HTML text.
6. Reload a visited detail route and verify the offline fallback for an
   uncached detail route. Ask's per-hexagram classical assets and decorative
   images are still cached on demand; they are not all downloaded at install.
7. Go online, publish a different deployment version, and request its worker.
   Confirm the new worker waits while the old page remains open. Close all
   controlled tabs/windows, reopen, then go offline and reload a core route.
   Check that only the complete new cache remains and JS/CSS still load.
8. Simulate a 404 or 503 for a cached Next.js chunk. The cached successful
   response should still be returned. A failed core dependency during install
   must leave the previous worker/cache usable.

When returning to `npm run dev`, Zhiyi unregisters a previously installed local
Zhiyi worker and reloads once if that worker still controls the page. This keeps
old production caches from serving stale development chunks; it does not touch
workers registered by other paths or applications.

For a GitHub Pages check, build with `GITHUB_PAGES=true` and a `/zhiyi` base
path as documented in `docs/deployment.md`. Confirm the worker scope, manifest,
icons, navigation, and cached URLs all remain below `/zhiyi/`.

The repeatable local check is:

```bash
npm run build:pages
npm run verify:pages
npm run test:browser
```

Install the browser once with `npx playwright install chromium` (Linux CI:
`npx playwright install --with-deps chromium`). The browser suite starts its own
static server; it verifies first-install and waiting-update offline behavior
with the browser's ordinary HTTP cache disabled as an alternative source.

`tests/service-worker.test.ts` covers complete first-install/upgrade dependency
sets, limited-connection body consumption, failed-install preservation
(including a reused local version), waiting
activation, exact root/project/prefix scope isolation, legacy cache migration,
navigation dependency ordering, and network/HTTP-error fallback. These VM
tests complement rather than replace production-browser offline/update QA.
