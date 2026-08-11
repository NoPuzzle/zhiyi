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
  without switching its reading. Pressing gives an immediate 80ms release and
  the checked state settles to a quiet edge while its matching reading becomes
  the sole visible region.
- Kun QA confirmed that the two edge paths remain separate and the yin gap does
  not close. Desktop QA at 1280×900 retained the centered manuscript axis and
  produced no horizontal overflow.

## Required Fidelity Surfaces

- Fonts and typography: the system Songti stack preserves the source's Chinese
  editorial character. Display name, pinyin, UI labels, classical text, and
  folio metadata remain legible at 390px without clipping or truncation.
- Spacing and layout rhythm: the mobile hero ends at approximately one viewport;
  the desktop version retains the same single vertical manuscript axis rather
  than reverting to a generic two-column card layout. Both checked viewports
  have zero horizontal overflow.
- Colors and tokens: the result uses neutral cool ivory, carbon ink, soft
  blue-gray watercolor, and vermilion only for the active line position. No
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

## Verification

- `git diff --check`: passed.
- `npm run lint`: passed.
- `npm test`: passed, 45 tests across 8 files.
- `npm run build`: passed, 79 routes.
- `npm run build:pages`: passed, 79 routes and 78 exported HTML files.
- `npm run verify:pages`: passed, including all 64 detail pages, 40 trigram
  atmosphere resources, and 2 folio assets.

No actionable P0, P1, or P2 findings remain. The missing decorative dotted
track and chevrons are intentional: they do not represent a real gesture and
would add non-semantic ornament without improving the core reading task.

final result: passed
