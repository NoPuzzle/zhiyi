# Zhiyi Line-Position Folio Design QA

## Evidence

- Source visual truth: the `853 × 1844` product-design reference supplied for
  the line-position folio review. The external reference is not part of this
  repository.
- Browser-rendered implementation: `/hexagrams/1`, captured locally at
  `390 × 844` and `1280 × 900` with device pixel ratio 1.
- Comparison set: normalized full-page, focused folio, equal-viewport ink-edge,
  hover, checked, yin-line, and desktop states were reviewed locally. Temporary
  QA captures are intentionally excluded from the repository.
- Route and state: `/hexagrams/1`, default selected line 九二.
- Source pixels: `853 × 1844`. It was normalized to `390 × 844` for
  comparison.
- Implementation pixels and CSS viewport: `390 × 844`, device pixel ratio 1.
  The final comparison therefore uses equal pixel and CSS dimensions without a
  browser frame or density mismatch.
- Secondary viewport: `1280 × 900`, device pixel ratio 1.

## Comparison History

### Pass 1

- P1 · Composition: the back link and initial hero spacing pushed the central
  folio below the mobile viewport, unlike the source's single-screen reading
  sequence. The back link was retained as a focus-revealed accessible link;
  the header, title, line banks, and folio overlap were recalibrated to the
  source proportions.
- P1 · Reading relationship: the previous detail design separated the six-line
  selector from a side reading panel. It was rebuilt as one vertical sequence:
  upper three lines, a shared selected-line folio, and lower three lines.
- P1 · Keyboard order: the former CSS-reversed display made native radio arrow
  movement oppose the visible direction. DOM, visual, and reading order now run
  from the top line to the bottom line while all data indexes remain stored
  bottom-to-top.
- P2 · Asset fidelity: the first generated wash read as a broad landscape-like
  band. It was replaced by a reference-derived, text-free real watercolor folio
  asset with quiet center, blue-gray wings, and visible paper folds.

### Pass 2

- P2 · Folio rhythm: the product-original layer label touched the lower framing
  line. The reading stack was aligned from its top padding and its internal
  section spacing tightened. The focused comparison now shows clear separation
  between all three content layers and both framing lines.
- P2 · First-screen completeness: line spacing, folio height, and lower-bank
  overlap were tuned until all six lines and the interaction cue fit inside the
  `390 × 844` viewport with zero horizontal overflow.
- Post-fix evidence: the final full comparison and focused folio comparison
  show the same title hierarchy, six-line vertical axis, central 九二 state,
  content order, cool-ivory palette, blue-gray folio, restrained vermilion, and
  quiet bottom cue as the source.

### Pass 3 · Ink-edge interaction

- P2 · Interaction visibility: the previous hover state changed only the
  line's container opacity and did not visibly connect the pointer with the
  ink stroke. Every line now carries separate edge, core, and texture layers.
- P2 · Visual restraint: the first motion study used a wider and stronger
  bloom that could read as a digital shadow. The final edge is a 14px
  low-opacity pass with a fixed 0.55px blur; it expands chiefly on the vertical
  axis and never jitters, changes hue, or shifts sideways.
- Pointer QA at 390×844 confirmed that hovering changes only the hovered line,
  without switching its reading. The original press study used an 80ms edge
  release; the later mobile-continuity pass below replaces that abrupt peak
  while preserving the quiet checked state.
- Kun QA confirmed that the two edge paths remain separate and the yin gap does
  not close. Desktop QA at 1280×900 retained the centered manuscript axis and
  produced no horizontal overflow.

### Pass 4 · Mobile touch continuity

- P1 · Home-page affordance: the landing-page 屯 image was a static `role=img`,
  so its six visible lines did not respond on touch. It now uses six native
  radio controls in top-to-bottom visual order, keeps 44px targets, and shows
  the selected position's existing product-authored observation below the
  hexagram.
- P2 · Reading continuity: detail readings previously switched with
  `display: none/grid`, making the old passage disappear in one frame and
  allowing content height to feel unstable. All six readings now share one
  grid cell; the inactive passage fades out while the next passage enters with
  a 4px ink-settling movement, and the folio height stays fixed through the
  change.
- P2 · Touch rhythm: the press peak was reduced from `opacity: 0.2` and
  `scaleY(1.38)` at 80ms to `opacity: 0.17` and `scaleY(1.28)` at 180ms. The
  checked state then settles over 420–560ms, intended to avoid an abrupt flash
  on touch. Physical iOS acceptance remains separate.
- Accessibility semantics now update with the visual state: only the selected
  article has `aria-hidden="false"`, and one shared polite status announces the
  new position without duplicating six live regions.
- Local in-app-browser QA at 390×844 confirmed six 44px home targets, a 九五
  selection and matching observation, a stable 342px detail folio before and
  after switching, exactly one visible/accessible reading, zero horizontal
  overflow, and no console warnings or errors. Temporary screenshots remain in
  ignored QA storage rather than the repository.

## Required Fidelity Surfaces

- Fonts and typography: the system Songti stack preserves the source's Chinese
  editorial character. Display name, pinyin, UI labels, classical text, and
  folio metadata remain legible at 390px without clipping or truncation.
- Spacing and layout rhythm: the hero retains a single vertical manuscript axis.
  Long readings can extend beyond the first viewport with normal page scrolling;
  no prose overlaps a line's touch target. Both checked viewports have zero
  horizontal overflow. The first-screen claims in earlier passes above are
  historical and are superseded by the October review fixes below.
- Colors and tokens: the result uses neutral cool ivory, carbon ink, and soft
  blue-gray watercolor. Ordinary line strokes stay neutral; vermilion line
  strokes indicate moving lines. Existing folio headings retain their accent. No
  muddy yellow-brown cast or card shadow was introduced.
- Image quality and asset fidelity: the folio uses dedicated 1200 × 736 AVIF and
  WebP raster assets generated from the selected visual direction. Existing
  trigram atmosphere images remain real local assets and continue their subtle
  slow movement.
- Copy and content: the selected folio presents `经 · 爻辞`, `传 · 小象`, and
  `位置观察 · 产品原创` in the same order as the source. The interaction cue is
  deliberately changed from the mock's non-functional “上下滑动” to the true
  behavior, “点触一爻，逐爻而观”.

## Interaction And Accessibility

- Six native radio controls remain full-width 44px touch targets.
- Fine-pointer hover, keyboard focus, press, and checked states all expose the
  same low-contrast ink-edge language. Hover alone does not change selection;
  touch press continues to allow normal vertical page panning.
- Default 乾 state is 九二. Browser testing confirmed ArrowUp changes 九二 to
  九三 and ArrowDown returns to 九二, with exactly one matching reading region
  visible each time.
- Each control owns its reading through `aria-controls`; the reading is a named
  region. Live feedback announces only the selected position instead of reading
  the whole passage as a description.
- The default content remains readable when `:has()` is unsupported.
- All folio, atmosphere, line, reveal, and ink-edge animations stop under
  `prefers-reduced-motion`; the selected line keeps an immediate static edge.
- Fresh production-browser inspection reported no console errors.

## October Review Fixes

- The 390px 屯六二 observation previously sat underneath the lower trigram's
  first line. Reduced decorative overlap and reserved bottom space now keep
  the entire reading outside all six 44px touch targets. All 64 folios are
  checked geometrically at 360px; 屯's six states are tapped at both 360/390px,
  including the formerly obscured final paragraph.
- Selected-reading motion is enabled only for `no-preference`; computed-style
  tests now confirm zero transition duration/delay under reduced motion.
  The checked-and-pressed ink edge also has no transform or transition.
- Current screenshots were inspected at 390×844 (屯六二) and 1280×900
  (乾九二), including complete hero captures in ignored `tmp/review-fix-*`.
  There is no clipped prose, line overlap, or horizontal overflow. Some lower
  lines require scrolling; preserving readable text takes priority over
  fitting all content into one screen.
- This is Chrome touch emulation and desktop verification, not physical
  iPhone/Safari acceptance.

## Verification

- `git diff --check`: passed.
- `npm run lint`: passed.
- `npm test`: passed, 115 tests across 9 files.
- `npm run build`: passed, 79 routes.
- `npm run build:pages`: passed, 79 routes and 78 exported HTML files.
- `npm run verify:pages`: passed, including all 64 detail pages, 40 trigram
  atmosphere resources, and 2 folio assets.
- `npm run test:browser`: six UI regressions and two PWA lifecycle regressions.
  The latter disable HTTP cache assistance and exercise offline home/Ask controls
  after initial installation and after a waiting worker activates.

The reviewed overlap and reduced-motion defects are resolved within the tested
browser scope. Dependency maintenance and physical-device acceptance remain
separate follow-ups. The omitted dotted track and chevrons do not represent a
real gesture and are still intentionally absent.

final result: passed for the recorded Chromium regression scope
