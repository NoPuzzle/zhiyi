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

`public/sw.js` derives its scope base path from its own URL and uses both the
path and deployment version in its cache name. A new Pages commit therefore
creates a new cache and removes older Zhiyi caches during activation.

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
4. Visit `/learn`, `/ask`, and `/hexagrams` once.
5. Enable offline mode in DevTools.
6. Reload a visited route and verify the offline fallback for an uncached route.

For a GitHub Pages check, build with `GITHUB_PAGES=true` and a `/zhiyi` base
path as documented in `docs/deployment.md`. Confirm the worker scope, manifest,
icons, navigation, and cached URLs all remain below `/zhiyi/`.
