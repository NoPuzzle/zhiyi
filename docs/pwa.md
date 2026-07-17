# Zhiyi PWA Notes

Zhiyi includes basic installability support for V0.1.

## Included

- Web app manifest at `/manifest.webmanifest`.
- App name: `知易 / Zhiyi`.
- Short name: `知易`.
- Rice-paper theme and background color.
- Placeholder SVG and PNG icons in `public/icons`.
- Production-only service worker registration.
- Simple offline fallback page at `/offline`.

## Not Included

- Push notifications.
- Login.
- Payment.
- Background sync.

## Local Testing

Use a production build when testing PWA behavior:

```bash
npm run build
npm run start
```

Then open:

```txt
http://localhost:3000
```

In Chrome or Edge DevTools:

1. Open the **Application** panel.
2. Check **Manifest** for name, short name, theme color, and icons.
3. Check **Service Workers** and confirm `/sw.js` is registered.
4. Visit `/learn`, `/ask`, or `/hexagrams` once so the service worker can cache pages.
5. Enable offline mode in DevTools.
6. Reload a cached page, or navigate to a new page to see the `/offline` fallback.

If you previously tested an older service worker, unregister it from DevTools before retesting.
