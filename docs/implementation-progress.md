# 知易 / Zhiyi Implementation Progress

Last updated: 2026-07-17

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
- Detailed draft content currently exists for 乾、坤、屯.
- SVG hexagram rendering, changing-line motion, PWA manifest, and a basic
  service worker are present.

## Work Plan

| Priority | Work item | Status |
| --- | --- | --- |
| P0 | Establish Git baseline | Complete |
| P0 | Add independent `smallAction` content | Complete for hexagrams 1-10 |
| P0 | Add high-stakes safety guidance | Complete |
| P1 | Add automated tests for hexagram transformations | Complete |
| P1 | Synchronize roadmap and data schema | Complete |
| P1 | Improve PWA cache update behavior | Complete |
| P2 | Normalize pinyin search and centralize trigram copy | Complete |
| P2 | Add reviewed base content for hexagrams 4-10 | Complete |
| P2 | Continue content in reviewed batches through hexagram 64 | Planned |

## Content Expansion Strategy

Content will be expanded in reviewable batches instead of generating all
remaining interpretations at once:

1. Hexagrams 4-10: base meaning, reflection prompts, and small action.
2. Hexagrams 11-20: same minimum content fields.
3. Hexagrams 21-40: same minimum content fields.
4. Hexagrams 41-64: same minimum content fields.
5. Add classical text and line-level drafts only after source and wording
   review.

Minimum base content means:

- `coreMeaning`
- original short `judgmentPlain`
- `reflectionQuestions`
- `smallAction`

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

## Known Follow-ups

- Hexagrams 11-64 still need reviewed base content.
- `npm audit --omit=dev` reports two moderate PostCSS advisories through the
  current Next.js dependency chain. npm only proposes a breaking Next.js
  downgrade, so `npm audit fix --force` must not be used. Recheck this when a
  compatible Next.js release updates the dependency.
- Git used the machine-inferred identity `Leo <test@Wololo--Air.local>` for the
  initial commit. Configure the intended public Git identity before sharing
  future commits.

## Definition Of Done For This Stabilization Pass

- Git working tree has an intentional commit history.
- `行` uses a dedicated action field rather than a reflection question.
- High-stakes questions display a clear professional-support reminder.
- Core transformation and lookup logic has executable tests.
- Product and engineering docs match the implemented schema and routes.
- Search handles common pinyin spacing variations.
- PWA cache behavior has an explicit update strategy.
- `npm run lint`, `npm test`, and `npm run build` pass.
