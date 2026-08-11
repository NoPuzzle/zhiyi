# 知易 / Zhiyi Roadmap

Last updated: 2026-08-10

## Roadmap Principles

- Learning and reflection come before interpretive depth.
- Safety language is product infrastructure.
- Product-authored and classical content remain separate, reviewable layers.
- Classical source changes retain fixed revisions and an explicit audit trail.
- V0.1 remains local: no database, login, payment, or external AI API.
- Every milestone must pass mobile, lint, test, and production-build checks.

## Completed Foundation

- Product, design, data, and PWA documentation.
- Next.js App Router, TypeScript, Tailwind CSS, and ESLint.
- Mobile app shell and primary navigation.
- SVG yin/yang line and hexagram renderer.
- Calm bottom-to-top line animation and reduced-motion handling.
- Eight Trigrams and structural data for all 64 hexagrams.
- Pure helpers for changing, opposite, reversed, and mutual hexagrams.
- Seven-section guided learning flow.
- Three-step manual and random Ask flow with a focused result handoff.
- Six-part reflective interpretation structure.
- Hexagram browser, search, trigram filters, and 64 detail routes.
- PWA manifest, icons, service worker, and offline fallback.
- GitHub Pages static export and automatic deployment workflow.
- Scoped service-worker cache isolation and static-export verification.
- Responsive AVIF/WebP trigram atmospheres with selected-line response.
- First-pass editorial review for all 64 product-authored hexagram records and
  all 384 product-authored line observations.
- Separate classical records for 64 judgments, 384 line statements, 64 Tuan
  passages, 64 Great Images, 384 Small Images, special-use text and images,
  Qian/Kun Wenyan, and five complete transmitted works.
- Fixed-revision Wikisource provenance for both 《周易正義》 scripture pages and
  the independent `周易` / `易傳` transmitted-text pages, with repeatable source
  readback through `npm run verify:classical-sources`.
- `/classics` and five static treatise routes, plus on-demand per-hexagram
  scripture/transmission assets for Ask mode.
- Initial Git baseline and executable domain tests.

## Current Stabilization Pass

- Dedicated `smallAction` content instead of reusing reflection questions.
- High-stakes medical, legal, financial, and mental-health safety guidance.
- Automated tests for data invariants, transformations, search, and safety.
- Search normalization for compact and tone-marked pinyin.
- One shared source for Chinese trigram UI copy.
- Application-versioned service worker caches.
- Explicit review metadata for the product-authored layer and source-recorded
  metadata for the classical layer.
- Documentation synchronized with implemented types and routes.

Detailed status and verification history live in
`docs/implementation-progress.md`.

## Content Milestones

### Batch 1: Hexagrams 1-10

Status: base content and first editorial pass complete.

- 1-3 retain their detailed content depth and have completed the same
  product-authored first-pass review.
- 4-10 have original base explanations, reflection prompts, and small actions.
- Reviewed all ten base records and 60 product-authored line observations for
  natural, suggestive, practical language.

### Batch 2: Hexagrams 11-20

Status: base content and first editorial pass complete.

- Added original `judgmentPlain`, `coreMeaning`, `reflectionQuestions`, and
  `smallAction` content while retaining concise keywords.
- Reviewed all ten base records and 60 product-authored line observations for
  natural, suggestive, practical language.
- This batch originally extended automated completeness coverage through
  hexagram 20; the current contract covers all 64.

### Batch 3: Hexagrams 21-40

Status: base content and first editorial pass complete.

- Added original base content, image observations, applications, and six
  line-position observations for each hexagram.
- Reviewed all 20 base records and 120 product-authored line observations.

### Batch 4: Hexagrams 41-64

Status: base content and first editorial pass complete.

- Added original base content, image observations, applications, and six
  line-position observations for each hexagram.
- Reviewed all 24 base records and 144 product-authored line observations.

### Classical Source Recording

Status: source recording and reproducible fixed-revision readback complete for
the received scripture and Ten Wings scope used by the product.

- Stored 64 judgments, 64 Great Image passages, and 384 bottom-to-top line
  statements, with 乾 `用九` and 坤 `用六` recorded separately.
- Stored 64 Tuan passages, 384 bottom-to-top Small Images, both special-use
  Small Images, Qian/Kun Wenyan, and the complete Xici Upper/Lower, Shuogua,
  Xugua, and Zagua transmitted texts.
- Scripture points to fixed Chinese Wikisource 《周易正義》 `oldid` values;
  Tuan, Small Image, Wenyan, and the five treatises point to their own fixed
  independent `周易` / `易傳` revisions.
- Ten HTML extraction edge cases are handled through transparent corrections
  that retain the affected hexagram, field, reason, and chosen text.
- `npm run verify:classical-sources` re-reads all fixed hexagram and treatise
  revisions; `npm run verify:classical-assets` prevents Ask projections from
  drifting from the source datasets.
- `source-recorded` establishes provenance, not a collation-based critical
  edition or a claim that received-text variants have been resolved.

## Engineering Milestones

### V0.1 Stabilization

- Keep lint, test, normal build, and Pages export checks green. Ongoing.
- Add accessible selected states to interactive controls. Complete.
- Add explicit Ask progress and result focus management. Complete.
- Isolate service-worker caches by deployment path. Complete.
- Keep the hexagram browser payload summary-only. Complete.
- Verify PWA install and offline behavior after each release version change.
  Ongoing.

### V0.2 Content Review Tools

- Extend the local content completeness test as each batch is published.
  Complete through hexagram 64.
- Validate required fields, cross-hexagram exact duplicates, action form, and
  editorial wording in the automated content contract. Complete.
- Record product-authored editorial status per hexagram. Complete: all 64 are
  `first-pass-reviewed`.
- Record classical provenance separately and verify fixed source revisions.
  Complete for the received scripture and Ten Wings scope.

### V0.3 Optional Local History

Do not implement without explicit approval.

- Consider opt-in local-only reading history.
- Provide clear delete/export controls.
- Do not introduce accounts or cloud storage by default.

## Later Considerations

Require explicit approval:

- User accounts or cloud sync.
- Database-backed history.
- Paid features.
- External AI APIs.
- Personalized generated interpretations.
- Community or social sharing.
- Push notifications.

## Next Recommended Task

Continue issue-driven refinement after the all-64 product-authored first pass.
For classical text, continue small, edition-aware manual collation batches while
preserving every fixed source record and avoiding any claim of a settled
critical edition.
