# 知易 / Zhiyi Implementation Progress

Last updated: 2026-07-31

## Product Goal

Zhiyi is a mobile-first visual Yi Jing / Zhouyi learning and reflection PWA.
It helps users learn through lines, trigrams, hexagrams, changing lines, and
related hexagram structures. It also provides a careful framework for
reflecting on situations without presenting readings as deterministic
predictions.

Every interpretation follows:

1. 象 / Image
2. 辞 / Text
3. 理 / Principle
4. 用 / Application
5. 问 / Reflection
6. 行 / Small Action

The final `行` must be one small, concrete action. High-stakes medical, legal,
financial, and mental-health questions must include a reminder to seek
qualified professional support.

## V0.1 Boundaries

- Local static data only.
- No database, login, payment, or external AI API.
- No deterministic fortune-telling claims.
- No copied modern translations or competitor content.
- Mobile-first, calm, ink-inspired visual design.

## Current Baseline

- Initial Git baseline: `a01502b` (`chore: establish Zhiyi prototype baseline`).
- Next.js App Router, TypeScript, Tailwind CSS, and ESLint are configured.
- Routes implemented: `/`, `/learn`, `/ask`, `/hexagrams`,
  `/hexagrams/[id]`, and `/offline`.
- All 8 trigrams and structural data for all 64 hexagrams are present.
- All 64 hexagrams have original base reflection content, image observations,
  applications, and six bottom-to-top line-position observations.
- Classical source and line-text drafts remain limited to 乾、坤、屯 pending
  source review.
- Interactive line focus, trigram-driven atmospheric backgrounds, changing-line
  motion, PWA manifest, and a basic service worker are present.

## Work Plan

| Priority | Work item | Status |
| --- | --- | --- |
| P0 | Establish Git baseline | Complete |
| P0 | Add independent `smallAction` content | Complete for all 64 hexagrams |
| P0 | Add high-stakes safety guidance | Complete |
| P1 | Add automated tests for hexagram transformations | Complete |
| P1 | Synchronize roadmap and data schema | Complete |
| P1 | Improve PWA cache update behavior | Complete |
| P2 | Normalize pinyin search and centralize trigram copy | Complete |
| P2 | Add reviewed base content for hexagrams 4-10 | Complete |
| P2 | Add original base content and completeness coverage for hexagrams 11-20 | Complete |
| P1 | Make clean npm installation reproducible across development Macs | Complete |
| P1 | Add a Mac mini Codex handoff prompt | Complete |
| P1 | Add a cross-user and cross-device Git collaboration protocol | Complete |
| P2 | Design a distinctive ink-wash project README | Complete |
| P1 | Configure GitHub Pages static export and deployment | Complete and active |
| P2 | Continue content in reviewed batches through hexagram 64 | Complete |
| P1 | Add six original line-position observations to all 64 hexagrams | Complete |
| P1 | Add interactive detail-page line focus and trigram atmospheres | Complete |
| P1 | Upgrade Next.js and its ESLint config from 16.2.6 to 16.2.12 | Complete |

## Content Expansion Strategy

Content was expanded in reviewable data modules so each batch remains
independently editable:

1. Hexagrams 4-10: base meaning, reflection prompts, and small action. Complete.
2. Hexagrams 11-20: same minimum content fields. Complete.
3. Hexagrams 21-40: same minimum content fields. Complete.
4. Hexagrams 41-64: same minimum content fields. Complete.
5. Add verified classical text only after source and wording review.

Minimum base content means:

- `imageObservation`
- `coreMeaning`
- original short `judgmentPlain`
- `application`
- non-empty `keywords`
- `reflectionQuestions`
- `smallAction`
- six bottom-to-top product-authored line observations

## Verification Log

### 2026-07-17 baseline review

- Production build passed and generated 73 static pages.
- All 64 IDs, line patterns, and Unicode symbols were unique.
- Core relation lookups resolved for all 64 hexagrams.
- Mobile checks found no horizontal overflow in the primary routes.
- Current local lint installation was missing `hermes-parser`; dependency
  installation will be refreshed before final verification.

### 2026-07-17 stabilization pass

- Established Git baseline commit `a01502b`.
- Added dedicated small actions for hexagrams 1-10.
- Added local high-stakes detection and professional-support guidance.
- Added Vitest with 16 passing data, transformation, safety, and search tests.
- Restored a passing ESLint run after refreshing dependencies.
- Centralized Chinese trigram copy in `data/trigram-copy.ts`.
- Added compact and tone-marked pinyin search normalization.
- Tied service worker cache names to the application version.
- Updated roadmap, data schema, and PWA documentation to match the code.
- `npm run lint` passed.
- `npm test` passed with 16 tests across 3 files.
- `npm run build` passed and generated 73 static pages.
- Mobile browser verification confirmed compact pinyin search, high-stakes
  safety copy, concrete small-action copy, and no horizontal overflow at 390px.

### 2026-07-21 Mac mini handoff

- Confirmed that the GitHub SSH clone succeeds on the Mac mini.
- Reproduced the Mac mini `npm ci` failure with the newer npm resolver.
- Regenerated the lockfile so its optional Tailwind WASM dependencies are
  complete and clean installs work with npm 11.18.
- Added `docs/handoff-prompt.md` for continuing the existing repository in a
  new Codex task on the Mac mini.

### 2026-07-21 content batch 2

- Added original, non-deterministic base content for hexagrams 11-20.
- Added three reflection questions and one concrete small action to each
  record.
- Extended the completeness test to check all required base-content fields,
  including non-empty keywords, for hexagrams 1-20.
- `npm run lint` passed.
- `npm test` passed with 16 tests across 3 files.
- `npm run build` passed and generated 73 static pages.

### 2026-07-22 collaboration protocol

- Added a root README with a visible collaboration and local-development entry
  point.
- Added `CONTRIBUTING.md` with preflight, branch ownership, dirty-worktree,
  verification, Git identity, SSH, push, and handoff rules for humans and
  Codex.
- Made the collaboration startup protocol mandatory in `AGENTS.md` and linked
  it from the Mac mini handoff prompt.
- `npm run lint`, `npm test`, and `npm run build` passed; the build generated
  73 static pages.

### 2026-07-22 README identity

- Redesigned the root README around the product's quiet-study-room positioning,
  six-part reflection path, current feature snapshot, safety boundaries, and
  collaboration entry points.
- Added an original local SVG hero using the documented rice-paper, ink, and
  hexagram visual system without external image dependencies.
- SVG validation, `npm run lint`, `npm test`, and `npm run build` passed; the
  build generated 73 static pages.

### 2026-07-22 GitHub Pages configuration

- Added a GitHub Actions workflow that builds and deploys `main` with the
  official Pages artifact and deployment actions.
- Added conditional static export support without changing the normal local
  server build.
- Made manifest, icons, service worker scope, offline caching, and public asset
  URLs compatible with the `/zhiyi` project-site base path.
- Added base-path unit coverage and a deployment runbook.
- Workflow YAML validation, `npm run lint`, all 19 tests, the normal production
  build, and the GitHub Pages static build passed.
- Local `/zhiyi/` HTTP checks returned 200 for the main routes, CSS, manifest,
  icon, service worker, offline page, and hexagram 64 detail page.
- Repository Pages activation and the first public deployment were completed;
  the public site and primary routes returned HTTP 200.

### 2026-07-31 complete content and interactive atmospheres

- Added original base reflection content for hexagrams 21-64.
- Added original image observations, applications, and six bottom-to-top
  line-position observations for all 64 hexagrams.
- Extended automated completeness coverage through hexagram 64.
- Reworked hexagram detail pages around an interactive six-line focus: pointer,
  touch, and keyboard focus reveal the selected line's content.
- Added eight locally stored ink-wash atmosphere assets. Upper and lower
  trigrams combine into a slowly moving background, with reduced-motion
  support.
- Shifted the global paper palette from yellow-brown to a cooler neutral ivory.
- Mobile, tablet, and desktop visual QA passed, including a verified 九二 →
  九五 interaction and a mixed-trigram atmosphere check. See `design-qa.md`.
- `npm run lint`, all 19 tests, and the 73-page production build passed.

### 2026-07-31 dependency security patch

- Upgraded `next` and `eslint-config-next` from 16.2.6 to the current 16.2.12
  patch while keeping React, ESLint, and TypeScript versions unchanged.
- Moved beyond the affected version ranges for the nine Next.js advisories in
  the 16.2.11 security update that applied to 16.2.6.
- `npm audit --omit=dev` still reports three aggregated high-severity entries:
  `next`, its bundled `postcss` 8.4.31, and optional `sharp` 0.34.5. The only
  automated suggestion is an incompatible Next.js downgrade, so it was not
  applied.
- Clean installation, lint, all 19 tests, the normal 73-page build, and the
  GitHub Pages static export passed with the project-declared npm version.

## Known Follow-ups

- Product-authored content for all 64 hexagrams needs editorial review.
- Classical judgment, image, and line texts should be added only in
  source-recorded, reviewed batches.
- Recheck the three remaining `npm audit --omit=dev` entries when Next.js
  publishes a compatible update for its bundled `postcss` and optional
  `sharp`. Do not apply the current incompatible downgrade or run
  `npm audit fix --force`.
- The initial two commits retain the original machine-inferred author identity.
  Future commits should use `NoPuzzle <liang.liang@outlook.com.au>`.

## Definition Of Done For This Stabilization Pass

- Git working tree has an intentional commit history.
- `行` uses a dedicated action field rather than a reflection question.
- High-stakes questions display a clear professional-support reminder.
- Core transformation and lookup logic has executable tests.
- Product and engineering docs match the implemented schema and routes.
- Search handles common pinyin spacing variations.
- PWA cache behavior has an explicit update strategy.
- `npm run lint`, `npm test`, and `npm run build` pass.
