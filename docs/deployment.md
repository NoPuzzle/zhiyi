# Zhiyi GitHub Pages Deployment

Zhiyi uses a GitHub Actions workflow to build a static Next.js export and
publish it to GitHub Pages without a separate hosting account.

Expected project-site URL:

```text
https://nopuzzle.github.io/zhiyi/
```

## Prerequisites

- The repository must be public when using GitHub Free. Private-repository
  Pages requires an eligible paid GitHub plan.
- GitHub Actions must be enabled for the repository.
- A maintainer must enable Pages once under **Settings → Pages → Build and
  deployment → Source → GitHub Actions**.

GitHub documentation:

- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Using custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Deployment Flow

The workflow in `.github/workflows/deploy-pages.yml` runs on every push to
`main` and can also be started manually from the Actions tab.

It performs the following steps:

1. Checks out the exact `main` commit.
2. Configures the Pages base path.
3. Installs Node 22 and the npm version declared in `package.json`.
4. Installs dependencies with `npm ci`.
5. Runs lint and the complete test suite.
6. Builds a Next.js static export into `out/`.
7. Uploads the static artifact.
8. Deploys the artifact to the protected `github-pages` environment.

Pull requests do not publish the production site. Review and merge a task
branch into `main`; the merged commit becomes the deployed release.

## Static Export And Base Path

Normal local builds keep the default Next.js server output. The static export
is enabled only when `GITHUB_PAGES=true`, so `npm run build` followed by
`npm start` continues to work locally.

GitHub project sites live below a repository path. For this repository that
path is `/zhiyi`. The Pages build therefore adjusts:

- Next.js links and static chunks.
- Manifest, icons, start URL, and PWA scope.
- Service worker registration and cached routes.
- Offline fallback routing.

The workflow reads the resolved base path from `actions/configure-pages`. This
also allows a future custom domain to use the correct root path.

## Local Pages Build Check

Run the same export mode locally before changing deployment behavior:

```bash
GITHUB_PAGES=true \
GITHUB_REPOSITORY=NoPuzzle/zhiyi \
GITHUB_SHA=local-pages-check \
NEXT_PUBLIC_BASE_PATH=/zhiyi \
npm run build
```

The command must create:

```text
out/index.html
out/manifest.webmanifest
out/offline/index.html
out/hexagrams/64/index.html
out/icons/zhiyi-icon.svg
```

Do not commit the generated `out/` directory. GitHub Actions creates it for
each deployment.

## Release Checklist

1. Run `npm run lint`, `npm test`, and `npm run build`.
2. Review and merge the task branch into `main`.
3. Open the repository Actions tab and watch **Deploy GitHub Pages**.
4. Open the deployment URL shown by the `github-pages` environment.
5. Verify `/`, `/learn/`, `/ask/`, `/hexagrams/64/`, and `/offline/`.
6. Confirm the manifest and service worker are under the same `/zhiyi/` scope.

## Troubleshooting

### Pages is unavailable in repository settings

Confirm the repository is public or the account has a plan that supports Pages
for private repositories.

### The workflow cannot deploy

Confirm Pages Source is set to **GitHub Actions** and the workflow retains
`pages: write` and `id-token: write` permissions in its deploy job.

### HTML loads but CSS, icons, or navigation return 404

Check the build log for the Pages base path and confirm generated URLs begin
with `/zhiyi/`. Do not hard-code root-only public asset paths.

### Visitors still see an older version

Each Pages build uses the Git commit SHA as the service-worker cache version.
Check that the new workflow completed, then close and reopen the installed PWA
or reload the page while online.
