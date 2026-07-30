# Zhiyi Hexagram Detail Design QA

## Scope

- Screen: `/hexagrams/1` with a secondary check on `/hexagrams/21`
- Reference: generated 乾 mobile design mock used for this QA pass
- Evidence: local source-versus-implementation composite inspected during the
  pass; temporary captures are intentionally not committed
- Viewports checked: `390 × 844`, `768 × 900`, `1280 × 900`
- States checked: 乾 default 九二, 乾 selected 九五, 噬嗑 default 初九

## Comparison passes

### Pass 1

- P1 · Behavior: the first client-state button implementation did not produce
  a reliable state change in browser automation. Replaced it with a native
  six-option radio group and CSS-selected reading panels. 九二 → 九五 now
  changes the highlighted line, line number, original text, plain-language
  observation, and reflection prompt together.
- P1 · Imagery: the first atmosphere treatment was almost imperceptible on
  乾. Increased the single-trigram atmosphere presence and moved its landscape
  rise into the readable middle of the hero while retaining strong text
  contrast.
- P2 · Density: the first mobile hero pushed the selected reading too far below
  the fold. Reduced line gaps and mobile vertical padding while preserving
  44 px touch targets.

### Pass 2

- Typography: the title, pinyin, selected-line label, body copy, and UI labels
  retain a clear hierarchy at all tested widths. No clipping or broken wrapping
  was found.
- Spacing and layout: the mobile view remains a vertical reading sequence;
  tablet and desktop use a balanced two-column hero. No overlap or horizontal
  overflow was found.
- Color: the previous yellow-brown paper cast is removed. The final palette is
  neutral ivory, ink black, blue-gray atmosphere, and restrained vermilion for
  the active line and reflection prompt.
- Image quality: all eight atmosphere files are real local 1024 × 1536 JPEG
  assets. Their crops remain soft enough for text and distinct enough to express
  天、泽、火、雷、风、水、山、地.
- Interaction: the six positions are keyboard-reachable native radio controls
  with a named group, visible focus, checked state, and linked reading region.
  Mouse hover provides a preview-strength visual emphasis; selection persists
  on click or keyboard activation.
- Accessibility: controls have descriptive labels, practical mobile target
  sizes, visible focus, and reduced-motion fallbacks. Decorative background
  images are hidden from assistive technology.
- Runtime: browser console inspection found no warnings or errors.

## Intentional reference deviations

- The generated visual reference contains an extra line-like stroke. The
  implementation keeps the domain invariant of exactly six lines, stored and
  displayed bottom to top.
- The reference compresses the full six-part reading into one mobile frame at
  very small text sizes. The implementation keeps readable mobile typography
  and uses natural vertical scrolling.
- The implementation uses the project navigation and real content model rather
  than reproducing decorative mock-only details.

## Verification

- `npm run lint`: passed
- `npm test`: passed, 19 tests across 4 files
- `npm run build`: passed, 73 static pages
- Content completeness: 64 of 64 hexagrams have required base reflection
  fields and six product-authored line-position observations

final result: passed
