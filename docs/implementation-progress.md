# 知易 / Zhiyi Implementation Progress

Last updated: 2026-10-24

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
- Routes implemented: `/`, `/learn`, `/ask`, `/classics`,
  `/classics/[slug]`, `/hexagrams`, `/hexagrams/[id]`, and `/offline`.
- All 8 trigrams and structural data for all 64 hexagrams are present.
- All 64 hexagrams have original base reflection content, image observations,
  applications, and six bottom-to-top line-position observations.
- All 64 product-authored records and all 384 product-authored line observations
  have completed a first editorial pass.
- Product-authored interpretation and classical source text are stored and
  reviewed as separate layers.
- The classical layer records 64 judgments, 64 Great Image passages, 384
  bottom-to-top line statements, 乾 `用九`, and 坤 `用六`.
- The transmitted-text layer records 64 Tuan passages, 384 bottom-to-top Small
  Images, both special-use Small Images, Qian/Kun Wenyan, and the complete Xici
  Upper/Lower, Shuogua, Xugua, and Zagua texts.
- Scripture points to per-hexagram fixed Chinese Wikisource 《周易正義》
  `oldid` values; transmitted text points to separate fixed `周易` / `易傳`
  revisions. The scripture metadata retains ten transparent, field-specific
  HTML extraction corrections.
- `source-recorded` means reproducibly traceable, not a collation-based
  critical edition or a claim that textual variants have been resolved.
- Interactive line focus, trigram-driven atmospheric backgrounds, changing-line
  motion, PWA manifest, and base-path-isolated service-worker caching are
  present.
- Ask mode presents a three-step progress path, collapses setup after casting,
  moves focus to the result, and gives the final concrete action distinct
  visual priority.
- The hexagram browser receives summary-only records; detail prose is no longer
  serialized into its client payload.

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
| P1 | Isolate service-worker caches by deployment base path | Complete |
| P1 | Add automated GitHub Pages export verification | Complete |
| P1 | Add responsive atmosphere formats and layered line response | Complete |
| P1 | Refine Ask into a focused three-step flow | Complete |
| P1 | Keep the hexagram browser client payload summary-only | Complete |
| P2 | Editorially review product-authored content for hexagrams 4-10 | Complete |
| P2 | Editorially review product-authored content for hexagrams 11-20 | Complete |
| P2 | Editorially review product-authored content for hexagrams 21-30 | Complete |
| P2 | Editorially review product-authored content for hexagrams 31-64 | Complete |
| P2 | Editorially review product-authored content for hexagrams 1-3 | Complete |
| P1 | Separate product-authored and classical content review states | Complete |
| P1 | Record the bounded classical scope for all 64 fixed source revisions | Complete |
| P1 | Add repeatable `verify:classical-sources` source readback | Complete |
| P1 | Add the complete received Ten Wings scope and static reading routes | Complete |
| P1 | Add per-hexagram on-demand scripture/transmission assets to Ask | Complete |

## Content Expansion Strategy

Content was expanded in reviewable data modules so each batch remains
independently editable:

1. Hexagrams 1-3: detailed content and the same product-authored first editorial
   pass used for the remaining records. Complete.
2. Hexagrams 4-10: base meaning, reflection prompts, small action, and first
   editorial pass. Complete.
3. Hexagrams 11-20: same minimum content fields and first editorial pass.
   Complete.
4. Hexagrams 21-30: same minimum content fields and first editorial pass.
   Complete.
5. Hexagrams 31-40: same minimum content fields and first editorial pass.
   Complete.
6. Hexagrams 41-64: same minimum content fields and first editorial pass.
   Complete.
7. Classical source layer: all 64 fixed revisions recorded and reproducibly
   verifiable, while edition-level collation remains a separate future task.

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

### 2026-07-31 full product optimization pass

- Editorially reviewed hexagrams 4-10, including all 42 product-authored
  bottom-to-top line observations, without adding unverified classical text.
- Added tests for 4-10 line order, reflective-question and concrete-action
  form, deterministic wording, unverified classical text, and exact duplicate
  content.
- Rebuilt detail atmospheres as upper/lower 56% masked layers with per-trigram
  tuning and selected-line response; removed the muddy multiply blend.
- Added responsive 640px and 1024px AVIF/WebP variants for all eight trigram
  atmospheres while retaining JPEG fallbacks.
- Connected the home hero explicitly to 屯卦 and its water-over-thunder image.
- Refined Ask into「写问题、起卦、观变化」with result focus management,
  collapsible setup, chapter anchors, and a visually distinct concrete action.
- Reduced `/hexagrams` client data to summary fields and added a static-export
  HTML size budget.
- Isolated service-worker cleanup to the exact deployment base path and stopped
  caching failed navigation responses.
- Added repeatable `build:pages` and `verify:pages` commands and made Pages CI
  validate the complete static artifact before upload.
- `git diff --check` and `npm run lint` passed; all 25 tests passed.
- The normal and Pages builds each generated 73 routes. Pages verification
  checked 72 HTML files, all 64 detail pages, and 40 atmosphere assets; the
  browser index measured 188,846 bytes.
- Browser QA at 390×844 and 1280×900 confirmed zero horizontal overflow,
  selected-line atmosphere response, Ask focus/collapse behavior, responsive
  AVIF loading, and no console warnings or errors.
- `npm audit --omit=dev` still reports the same three high-severity aggregate
  entries described above; no incompatible automated downgrade was applied.

### 2026-08-08 hexagrams 11-20 editorial review

- Editorially revised all ten base records and 60 bottom-to-top,
  product-authored line observations for hexagrams 11-20.
- Replaced repeated positional openings and project-management phrasing with
  more natural, image-led, suggestive language and concrete small actions.
- Kept `judgmentOriginal`, `imageText`, and classical line text empty pending
  separate source review.
- Extended the editorial contract from hexagrams 4-10 through 4-20, including
  line order, question/action form, exact duplicates, deterministic claims,
  unverified classical text, and positional-template checks.
- `git diff --check` and `npm run lint` passed; all 25 tests passed across five
  files.
- The normal and Pages builds each generated 73 routes. Pages verification
  checked 72 HTML files, all 64 detail pages, and 40 atmosphere assets; the
  browser index measured 188,846 bytes.
- Static-export readback confirmed the revised 泰、大有、观 content appears in
  their generated detail pages.

### 2026-08-08 hexagrams 21-30 editorial review

- Editorially revised all ten base records and 60 bottom-to-top,
  product-authored line observations for hexagrams 21-30.
- Removed all positional template openings and replaced project-management
  language with image-led, everyday wording specific to each hexagram.
- Kept `judgmentOriginal`, `imageText`, and classical line text empty pending
  separate source review.
- Extended the editorial contract through hexagram 30. The expanded test caught
  and removed one remaining deterministic phrase before full verification.
- `git diff --check` and `npm run lint` passed; all 25 tests passed across five
  files.
- The normal and Pages builds each generated 73 routes. Pages verification
  checked 72 HTML files, all 64 detail pages, and 40 atmosphere assets; the
  browser index measured 188,846 bytes.
- Static-export readback confirmed the revised 噬嗑、大过、离 content appears
  in their generated detail pages.

### 2026-08-08 hexagrams 31-64 editorial completion

- Editorially revised all 34 base records and 204 bottom-to-top,
  product-authored line observations for hexagrams 31-64.
- This completes the first editorial pass for all 61 product-authored records
  and 366 line observations from hexagrams 4-64.
- Replaced positional templates and management-style wording with image-led,
  everyday language while preserving distinct 象、理、用、问、行 content.
- Kept `judgmentOriginal`, `imageText`, and classical line text empty pending
  separate source review.
- Extended the editorial contract through hexagram 64 with cross-hexagram exact
  duplicate checks, concrete-action rules, and deterministic and
  management-template wording checks. The expanded contract also caught and
  removed older wording that no longer met the all-range standard.
- `git diff --check` and `npm run lint` passed; all 25 tests passed across five
  files.
- The normal and Pages builds each generated 73 routes. Pages verification
  checked 72 HTML files, all 64 detail pages, and 40 atmosphere assets; the
  browser index measured 188,846 bytes.
- Static-export readback confirmed the revised 咸、夬、归妹、未济 content
  appears in their generated detail pages.

### 2026-08-09 all-64 authored review and classical source recording

- Completed the first editorial pass for the detailed product-authored 乾、坤、
  屯 records, bringing all 64 product-authored records and all 384
  product-authored line observations to `first-pass-reviewed`.
- Separated product-authored review state from classical provenance so neither
  layer implies a review status for the other.
- Recorded 64 judgments, 64 Great Image passages, 384 bottom-to-top line
  statements, 乾 `用九`, and 坤 `用六` from per-hexagram fixed Chinese
  Wikisource 《周易正義》 revisions.
- Retained ten transparent extraction corrections for fixed-page HTML edge
  cases. Each records the affected hexagram, locked revision, field, reason,
  and chosen text instead of silently changing the source result; a changed
  revision now fails closed for human review.
- Added `npm run verify:classical-sources`; a complete network readback with the
  project-declared npm 11.18.0 passed and reported `64 卦辞 · 64 大象 · 384
  爻辞 · 用九/用六 2 条`.
- Hardened source verification to reject missing or duplicate IDs, missing
  `oldid` values, inconsistent fixed URLs, and source-metadata drift before
  making network requests.
- Kept the classical dataset out of the shared client-side `Hexagram` object
  and joined it only in server-rendered detail pages. Ask and Learn client
  chunks each fell from 210,474 to 151,740 bytes, while static detail readback
  retained source labels, fixed revision links, and the expected passages.
- Added explicit accessible names to related-hexagram links so screen-reader
  link lists identify the relation, hexagram number, and name.
- Documented that `source-recorded` establishes reproducible provenance only;
  it does not claim a collation-based critical edition or resolve textual
  variants among received editions.
- Final verification passed: `git diff --check`, lint, 30 tests across six
  files, the normal 73-route build, the 73-route Pages build, and Pages artifact
  checks for 72 HTML files, 64 detail pages, 40 responsive atmosphere assets,
  and the 188,846-byte browser index.
- Pinned transitive `nanoid` to patched version 3.3.18 through an npm override;
  a clean npm 11.18.0 install passed and removed its two high-severity audit
  findings. `npm audit --omit=dev` still reports three aggregated high entries
  through Next.js `postcss` and optional `sharp`, whose only automated proposal
  crosses the declared Next.js range; no force fix was applied.

### 2026-08-10 detail reading continuity and accessibility

- Audited the mobile home → browser → search → detail → related-hexagram flow
  at 390×844 before editing.
- Added a compact detail-page guide for 象、辞、理、用、问、行、六爻 and
  related structures, with stable anchors, 44px touch targets, and visible
  keyboard focus.
- Added previous and next links in King Wen order to every detail page, while
  retaining the structural 错、综、互 links. Self-relations now remain
  informative but are no longer links back to the same page; related cards also
  expose target-hexagram keywords.
- Exposed all three existing product-authored reflection questions under
  “选一问” instead of silently rendering only the first.
- Joined each interactive hero line with its matching fixed-source classical
  line text, then clearly separated it from the product-authored position
  observation and reflection prompt. The six-line bottom-to-top index remains
  unchanged and the classical dataset remains server-only.
- Updated the hexagram-browser introduction to describe the now-complete
  classical, authored, line, and relation layers.
- Added programmatic selected states, polite live-result regions, consistent
  focus-visible treatment, and Ask setup focus restoration across Ask, Learn,
  and the hexagram browser.
- Added a development-only cleanup for a previously installed local Zhiyi
  service worker, preventing old production caches from hydrating current dev
  pages with stale client chunks while leaving unrelated workers untouched.
- Changed Next.js runtime assets from cache-first to network-first with cached
  fallback, and added a regression test so current HTML cannot be paired with
  a stale client chunk after an update.
- Extended Pages verification so all 64 detail exports must contain the reading
  guide, all reflection prompts, and sequence navigation.
- Final Chrome QA at 390×844 confirmed eight guide links, three visible
  reflection questions, matching classical text in the active line card,
  previous/next navigation, and zero horizontal overflow. A clean-origin dev
  run produced no hydration or runtime warnings.
- Verification passed: `git diff --check`, lint, 31 tests across six files, the
  normal 73-route build, the 73-route Pages build, and Pages artifact checks for
  72 HTML files, 64 detail pages, 40 responsive atmosphere assets, and the
  188,940-byte browser index.

### 2026-08-10 complete received scripture and Ten Wings integration

- Added all 64 Tuan passages, all 384 bottom-to-top Small Image passages, the
  Qian and Kun special-use Small Images, Qian/Kun Wenyan, and the complete Xici
  Upper, Xici Lower, Shuogua, Xugua, and Zagua transmitted texts.
- Kept the existing 64-hexagram scripture dataset and its ten transparent
  《周易正義》 extraction corrections intact. The transmitted-text layer uses
  separately pinned, independent Chinese Wikisource `周易/<卦名>` and
  `易傳/<篇名>` pages; Kanripo remains a structural cross-check only.
- Hardened the new source reader with an explicit 64-entry revision manifest,
  fixed treatise revisions, strict unknown-template rejection, exact count and
  line-order checks, and fail-closed source-metadata comparison.
- Added `/classics` and five static treatise routes. Hexagram details now show
  scripture, Tuan, Great Image, Small Image, optional Wenyan, and product-authored
  observations as visibly distinct layers; the interactive line card includes
  its matching scripture and Small Image passages.
- Added 64 generated per-hexagram reading assets. Ask mode fetches only the
  original and changed hexagrams it needs, shows relevant scripture and
  transmitted text, and retains the product-authored result if the local asset
  cannot be loaded. The shared client-side `Hexagram` type still contains no
  classical corpus fields.
- Added source, structure, contamination, line-alignment, special-use, Wenyan,
  treatise, and client-boundary contracts. The suite now passes 39 tests across
  seven files.
- Full fixed-revision readback passed for 64 judgments, 64 Great Images, 384
  line statements, two special-use statements, 64 Tuan passages, 384 Small
  Images, two Wenyan records, two special-use Small Images, and five complete
  treatises with logical section counts `12/9/11/1/1`.
- Final build evidence: normal build generated 79 routes; Pages build generated
  79 routes and 78 HTML files; Pages verification found all 64 detail pages, all
  64 Ask reading assets, 40 responsive atmosphere assets, and a 190,007-byte
  browser index. No classical-corpus marker was present in client static chunks
  or the Ask HTML shell.

### 2026-08-11 line-position folio detail redesign

- Rebuilt the hexagram-detail hero around the selected “爻位阅卷” direction:
  the visible and DOM order now runs from the top line to the bottom line, with
  one shared reading folio between the upper and lower trigrams. The stored line
  order remains bottom-to-top.
- Added a dedicated original blue-gray watercolor folio in 1200×736 AVIF and
  WebP. It keeps the reading center quiet, uses real raster paper folds instead
  of CSS decoration, and breathes subtly alongside the existing trigram
  atmosphere. All movement stops for reduced-motion users.
- Integrated the selected line's fixed-source `经 · 爻辞` and `传 · 小象` in
  the folio, with a distinct `位置观察 · 产品原创` layer. 乾 defaults to 九二;
  the other 63 hexagrams retain their first-line default.
- Corrected the vertical radio keyboard sequence, removed long-passage
  `aria-describedby` announcements, named each reading region, added concise
  polite selection feedback, and retained a visible default reading when
  `:has()` is unavailable.
- Added a four-test server-rendered contract covering all six controls, visual
  order, central-folio placement, Jing/Small Image/product layer separation,
  `aria-controls`, and the 64-hexagram default selection rule.
- Chrome production QA passed at 390×844 and 1280×900: all six lines remain
  visible on the mobile first screen, ArrowUp/ArrowDown follow the visual
  direction, horizontal overflow is zero, and a fresh tab produced no console
  errors. The normalized and focused comparisons are recorded in
  `design-qa.md` with `final result: passed`.
- Final verification passed: `git diff --check`, lint, 43 tests across eight
  files, the normal 79-route build, the 79-route Pages build, and Pages checks
  for 78 HTML files, all 64 detail pages, 40 trigram atmosphere resources, two
  folio assets, and the 190,183-byte browser index.

### 2026-08-11 interactive ink-edge feedback

- Split every rendered line into a legible core, a restrained texture pass,
  and a low-opacity outer ink edge. The same structural renderer continues to
  support yin, yang, moving-line, and transformation states.
- Added fine-pointer hover, keyboard-focus, press, and checked-state feedback.
  Hover lets the edge spread mostly vertically without changing the reading;
  pressing releases it in 80ms, then the checked line settles to a quiet bloom.
  Touch panning and all 44px targets remain unchanged.
- Kept the effect neutral and semantic: ordinary lines do not gain vermilion,
  the core never blurs, and yin gaps remain separate. Reduced-motion mode turns
  off the new transitions and transforms but keeps an immediate static edge.
- Extended the hero contract with two tests covering all six edge/core/texture
  layer sets and the hover, focus-visible, checked, and reduced-motion CSS
  states. The suite now passes 45 tests across eight files.
- In-app browser QA passed for Qian and Kun at 390×844 and for Qian at
  1280×900. Hover changed only its target line, checked state exposed exactly
  one matching reading, the yin center stayed open, 44px targets were retained,
  and both viewports had zero horizontal overflow and no console errors.
- Final verification passed: `git diff --check`, lint, 45 tests across eight
  files, the normal 79-route build, the 79-route Pages build, and Pages checks
  for 78 HTML files, all 64 detail pages, 40 trigram atmosphere resources, two
  folio assets, and the 190,183-byte browser index.
- Hardened the Pages `Verify source` gate with the deterministic local
  `npm run verify:classical-assets` check. Fixed-revision network source
  readback remains a separate maintainer action and is not part of deployment.

### 2026-08-11 release hardening

- Added a persistent Ask boundary explaining that medical, legal, financial,
  and mental-health questions require qualified professional support. General
  mental-health prompts remain separate from immediate-danger language; common
  Chinese and English crisis expressions now add local emergency-service,
  crisis-line, and trusted-person guidance.
- Completed the hero's `位置观察 · 产品原创` layer with the selected line's
  concise product-authored observation instead of leaving a label without
  content. The server-rendered hero contract now guards all three reading
  layers for all six positions.
- Final pre-release gates passed with the declared npm 11.18.0 runtime:
  `git diff --check`, lint, 55 tests across eight files, all 64 generated Ask
  classical-reading assets, the 79-route normal build, the 79-route Pages build,
  and verification of 78 exported HTML files.
- Fixed-revision network readback also passed for 64 judgments, 64 Great Images,
  384 line texts, both special-use texts, 64 Tuan texts, 384 Small Images, both
  Wenyan texts, and the five received treatises.

### 2026-08-11 mobile line interaction continuity

- Replaced the home page's static 屯 hexagram image with six native, 44px line
  controls. The visible and keyboard order runs from the top line to the bottom
  line while the data remains bottom-to-top; selecting a line reveals its
  existing product-authored position observation.
- Replaced detail-page `display` switching with a stable, overlapping folio
  layout and a short exit/entry crossfade. The selected article, `aria-hidden`
  state, checked radio, atmosphere response, and one shared polite status now
  update together.
- Softened the mobile ink response by lowering the press bloom and extending
  its release from 80ms to 180ms, followed by a restrained 420–560ms checked
  settle. Normal vertical touch panning and reduced-motion behavior remain
  intact.
- Added home interaction and detail transition contracts. The suite now passes
  60 tests across nine files.
- Local in-app-browser QA at 390×844 confirmed all six home targets are 44px,
  the selected home observation updates, the detail folio remains 342px through
  a line change, only one reading is visible and exposed to assistive
  technology, horizontal overflow is zero, and no console warnings or errors
  were reported.
- Final verification passed with npm 11.18.0: `git diff --check`, lint, 60 tests
  across nine files, all 64 generated Ask classical assets, the normal 79-route
  build, the 79-route Pages build, and Pages verification of 78 exported HTML
  files.

### 2026-10-07 review fixes and browser regression coverage

- Continued `codex/soft-line-interactions` at `9c88a30`, preserving the eight
  uncommitted files from this thread's earlier mobile-touch pass. Refreshed
  `origin/main` with no divergence. Git identity remains
  `NoPuzzle <liang.liang@outlook.com.au>`; Node 22.23.1 and declared npm 11.18.0
  passed clean installation, baseline lint, 60 tests, and the 79-route build.
- Fixed all six findings from the preceding review: long folio text no longer
  overlaps line targets; reduced-motion reading/pressed-edge states remain
  static; smart punctuation and common Traditional Chinese crisis wording
  receive consistent safety guidance; worker installation caches complete core
  HTML/JS/CSS; HTTP errors use existing valid resources; scope cleanup cannot
  confuse `/zhiyi` with `/zhiyi-preview`.
- PWA installation fully consumes resource response bodies before waiting for
  the whole group, avoiding a real HTTP connection-pool stall caught by the new
  browser tests. New workers wait for old controlled pages to close instead of
  force-claiming them. Dependency failures preserve the prior cached document.
  Runtime cache-open/read failures fall back to the network; an unavailable
  cache must not prevent an otherwise valid online page from loading.
- Added Playwright as a development-only dependency and `npm run test:browser`.
  The Pages workflow now runs Chromium regressions before artifact upload.
  Tests cover all 64 mobile folio layouts, 360/390px touch interactions,
  keyboard/ARIA state, computed reduced-motion styles, first-install offline
  reload, and waiting-worker update followed by offline home/Ask interactions.
- Longer readings may extend below the first viewport. All six 44px controls
  remain in ordinary page flow; text is neither clipped nor covered to keep a
  forced single-screen composition. Mobile and desktop screenshots were
  inspected; evidence lives in ignored `tmp/review-fix-*.png`.
- Verification: 115 unit tests across nine files, six UI browser regressions,
  and two real worker lifecycle regressions passed locally using Chrome.
  Lint, normal and Pages builds (79 routes each), 64/64 classical assets, and
  Pages artifact verification (78 HTML files) passed. No external release was
  requested or performed.
- Changed-file ownership: all current changes belong to this thread. The
  earlier eight files are `design-qa.md`, `docs/implementation-progress.md`,
  `src/app/globals.css`, `src/app/page.tsx`,
  `src/components/hexagram/InteractiveHexagramHero.tsx`,
  `src/components/hexagram/HomeHexagramPreview.tsx`,
  `tests/interactive-hexagram-hero.test.tsx`, and
  `tests/home-hexagram-interaction.test.tsx`. This fix additionally touches
  `public/sw.js`, `lib/safety.ts`, their tests, `docs/pwa.md`,
  `docs/design-system.md`, `README.md`, browser-test/config/server files,
  package manifests, ignore/lint/Vitest configuration, and the Pages workflow.
- No commit, push, PR, merge, or online deployment was performed. Physical
  iPhone/Safari acceptance and the separate dependency-upgrade task remain open.

### 2026-10-24 authorized repair handoff

- Rechecked ownership of all 25 pending files on `codex/soft-line-interactions`
  at `9c88a30`; all belong to this thread's mobile/PWA/safety repair work.
  Refreshed `origin/main` with no divergence. The user authorized committing
  and pushing this repair branch only, not merging or deploying it.
- Clean installation with Node 22.23.1 and npm 11.18.0, lint, 115 unit tests,
  and the normal 79-route build passed again. The preceding preflight in the
  same session also passed all eight Chromium regressions, Pages build/export
  verification (78 HTML files), and 64/64 classical assets.
- The current installation audit reports 11 aggregate dependency findings:
  three moderate, seven high, and one critical. This is not a claim that the
  static Pages deployment exposes every reported server-side attack path.
  Dependency upgrades remain a separate task; no forced fix was applied.
- Physical iPhone/Safari acceptance remains open. Existing worker-update tests
  change the worker version against one export; they do not establish a real
  two-build chunk transition or cover every offline client-side Link path.

## Known Follow-ups

- Product-authored content for all 64 hexagrams has completed a first editorial
  pass; further revisions can be issue-driven rather than batch-driven.
- The received scripture and Ten Wings scope is source-recorded. Future work
  should use small, edition-aware manual collation batches and retain both
  source layers' fixed-revision evidence; do not describe them as a settled
  critical edition.
- Next.js remains pinned to 16.2.12. Known dependency audit warnings remain;
  historical audit counts and upgrade suggestions are not current guarantees.
  Re-audit and upgrade in a separate dependency task with compatibility, Pages,
  and browser regression checks. Do not run `npm audit fix --force`.
- Validate the repaired touch and motion behavior on a physical iPhone/Safari.
  Chromium touch emulation is not a substitute for that acceptance step.
- The initial two commits retain the original machine-inferred author identity.
  Future commits should use `NoPuzzle <liang.liang@outlook.com.au>`.

## Definition Of Done For This Stabilization Pass

- Git working tree has an intentional commit history.
- `行` uses a dedicated action field rather than a reflection question.
- High-stakes questions display a clear professional-support reminder.
- Core transformation and lookup logic has executable tests.
- Product and engineering docs match the implemented schema and routes.
- Product-authored review state and classical source provenance remain separate.
- All bounded classical records have fixed source revisions and reproducible
  readback coverage.
- Search handles common pinyin spacing variations.
- PWA cache behavior has an explicit update strategy.
- `npm run lint`, `npm test`, and `npm run build` pass.
