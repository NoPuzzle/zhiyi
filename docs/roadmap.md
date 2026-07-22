# 知易 / Zhiyi Roadmap

Last updated: 2026-07-21

## Roadmap Principles

- Learning and reflection come before interpretive depth.
- Safety language is product infrastructure.
- Content expands in small, reviewable batches.
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
- Manual and random Ask flow.
- Six-part reflective interpretation structure.
- Hexagram browser, search, trigram filters, and 64 detail routes.
- PWA manifest, icons, service worker, and offline fallback.
- Initial Git baseline and executable domain tests.

## Current Stabilization Pass

- Dedicated `smallAction` content instead of reusing reflection questions.
- High-stakes medical, legal, financial, and mental-health safety guidance.
- Automated tests for data invariants, transformations, search, and safety.
- Search normalization for compact and tone-marked pinyin.
- One shared source for Chinese trigram UI copy.
- Application-versioned service worker caches.
- Documentation synchronized with implemented types and routes.

Detailed status and verification history live in
`docs/implementation-progress.md`.

## Content Milestones

### Batch 1: Hexagrams 1-10

Status: complete for base content.

- 1-3 have detailed draft content and line text.
- 4-10 have original base explanations, reflection prompts, and small actions.

### Batch 2: Hexagrams 11-20

Status: complete for base content.

- Added original `judgmentPlain`, `coreMeaning`, `reflectionQuestions`, and
  `smallAction` content while retaining concise keywords.
- Automated completeness coverage now checks all required fields for
  hexagrams 1-20.

### Batch 3: Hexagrams 21-40

Status: planned with the same minimum content fields.

### Batch 4: Hexagrams 41-64

Status: planned with the same minimum content fields.

### Classical And Line-Level Review

Status: later.

- Verify classical source text.
- Add line-level plain-language drafts gradually.
- Keep source text separate from product-authored interpretation.

## Engineering Milestones

### V0.1 Stabilization

- Keep lint, test, and build green.
- Add accessible selected states to interactive controls.
- Remove unused starter assets and legacy components.
- Verify PWA install and offline behavior after each release version change.

### V0.2 Content Review Tools

- Extend the local content completeness test as each batch is published.
- Add a data validation script for required fields and duplicate content.
- Define a lightweight editorial review status per hexagram.

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

Complete and review base content for hexagrams 21-40, then extend the
completeness test through hexagram 40.
