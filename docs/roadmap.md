# 知易 / Zhiyi Roadmap

## Roadmap Principles

- Build the learning foundation before expanding interpretation depth.
- Keep V0.1 local and reviewable.
- Avoid database, login, payment, and external AI APIs until explicitly approved.
- Treat safety language as product infrastructure.
- Keep each milestone small enough to test on mobile.

## V0.1 Documentation And Foundation

Goals:

- Define product vision and boundaries.
- Define design system.
- Define local data schema.
- Define engineering principles.
- Create initial Next.js App Router foundation.

Deliverables:

- Product docs.
- `AGENTS.md`.
- Next.js, TypeScript, Tailwind CSS setup.
- Basic app shell.
- Mobile viewport QA.

## V0.2 Visual Core

Goals:

- Make the hexagram the visual center.
- Establish reusable rendering primitives.

Deliverables:

- SVG line renderer.
- Trigram renderer.
- Hexagram renderer.
- Changing line styling.
- Reduced-motion support.
- Story or test page for visual states.

## V0.3 Static Yi Jing Data

Goals:

- Add structured local data.
- Keep data separate from UI.

Deliverables:

- Eight Trigrams data.
- Initial reviewed hexagram subset.
- Hexagram lookup by line pattern.
- Pure transformation helpers.
- Unit tests for line transformation and lookup.

## V0.4 Learning Flow

Goals:

- Let users learn core concepts before asking questions.

Deliverables:

- Yin/Yang learning page.
- Eight Trigrams page.
- Hexagram browsing page.
- Individual hexagram detail page.
- Plain-language explanations.

## V0.5 Ask Flow

Goals:

- Let users ask a question and generate or build a hexagram.

Deliverables:

- Reflective question input.
- Manual line builder or simple local casting method.
- Line-by-line generation animation.
- Changing line detection.
- Transformed hexagram display.
- Empty, loading, and reduced-motion states.

## V0.6 Structured Interpretation

Goals:

- Present readings through the fixed framework.
- Keep interpretation suggestive and reflective.

Deliverables:

- 象 / Image section.
- 辞 / Text section.
- 理 / Principle section.
- 用 / Application section.
- 问 / Reflection section.
- 行 / Small Action section.
- Safety note for high-stakes categories.

## V0.7 PWA Prototype

Goals:

- Make the prototype feel installable and reliable on mobile.

Deliverables:

- App manifest.
- Mobile icons.
- Theme color.
- Offline-friendly static shell.
- Basic metadata.
- Mobile browser QA.

## Later Considerations

Do not implement without explicit approval:

- User accounts.
- Cloud sync.
- Database-backed reading history.
- Paid features.
- External AI APIs.
- Personalized generated interpretations.
- Community or sharing features.
- Notifications.

## Suggested Next Coding Task

Scaffold the Next.js App Router project with TypeScript and Tailwind CSS, then create the first mobile app shell:

- Rice-paper background.
- Minimal header with 知易 / Zhiyi.
- Centered SVG hexagram placeholder.
- Two entry points: 学易 and 问卦.
- Safety-aware tagline and copy.

