# 知易 / Zhiyi Design System

## Design Direction

Zhiyi should feel calm, minimal, mobile-first, and ink-wash inspired. The interface should resemble a quiet study room rather than a fortune-telling stall.

The hexagram is the visual center. Decorative elements should support focus and rhythm, not create historical clutter.

## Visual Principles

- Mobile-first.
- Calm and spacious.
- Minimal controls.
- Neutral ivory rice-paper background.
- Ink black and gray as primary colors.
- Vermilion accent only for changing lines or rare emphasis.
- Generous whitespace.
- Thin dividers and subtle texture.
- No noisy ancient-style ornament.
- No mystical, guaranteed, or sensational visual language.

## Color Palette

Use a restrained palette with enough warmth to avoid a cold monochrome interface.

| Token | Use | Value |
| --- | --- | --- |
| `paper` | App background | `#F3F1EA` |
| `paper-deep` | Section contrast | `#E8E6DF` |
| `ink` | Primary text and hexagram lines | `#171512` |
| `ink-soft` | Secondary text | `#4E4A43` |
| `mist` | Borders, dividers, disabled controls | `#C7C5BE` |
| `wash` | Soft panels and inactive surfaces | `#DCDAD4` |
| `vermilion` | Changing lines only | `#B23A2E` |
| `vermilion-soft` | Changing line background tint | `#E7B8A9` |

Vermilion should be rare. If everything is accented, changing lines lose meaning.

## Typography

Use a system font stack for V0.1.

Recommended CSS font stack:

```css
font-family: ui-serif, "Songti SC", "STSong", "Noto Serif CJK SC", serif;
```

For compact UI labels and controls:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Typography rules:

- Keep line length comfortable on mobile.
- Use clear hierarchy but avoid oversized marketing-style display type.
- Do not use negative letter spacing.
- Do not scale font size directly with viewport width.
- Chinese and English text should feel balanced when paired.

## Layout

Primary viewport assumptions:

- Design first for 360px to 430px wide mobile screens.
- Desktop layouts should expand gracefully without becoming dense dashboards.
- The primary reading screen should keep the hexagram centered and prominent.

Recommended layout structure:

- Top app bar with product name and minimal navigation.
- Main content column with generous vertical rhythm.
- Hexagram visual zone.
- Context or reading sections below.
- Bottom action area for primary next step when needed.

Avoid nested cards. Use full-width sections, quiet panels, or simple list rows.

## Components

### Hexagram Renderer

The hexagram renderer should be an SVG component. It should accept structured line data and render:

- Six lines from bottom to top.
- Solid Yang lines.
- Broken Yin lines.
- Changing Yang lines.
- Changing Yin lines.
- Optional line labels or position markers.

Rendering rules:

- Normal lines use ink black.
- Changing lines use vermilion.
- Stroke widths should feel substantial enough on mobile.
- Line spacing should be stable and not shift during animation.

### Trigram Renderer

The trigram renderer should reuse the same line rendering primitives as the hexagram renderer.

### Interpretation Sections

Use the fixed framework:

- 象 / Image
- 辞 / Text
- 理 / Principle
- 用 / Application
- 问 / Reflection
- 行 / Small Action

Each section should have a compact heading and readable body. The final action should be concrete and small.

### Controls

Use quiet controls:

- Primary button: ink background, paper text.
- Secondary button: transparent or paper surface with ink border.
- Changing line emphasis: vermilion.
- Inputs: simple border, warm paper background, strong focus state.

Avoid overly rounded, glossy, neon, or mystical controls.

## Motion

Motion should be slow, calm, and purposeful.

Recommended animation uses:

- Generate hexagram lines one by one from bottom to top.
- Fade in transformed hexagram after original hexagram is complete.
- Use slight ink-settling opacity changes, not dramatic effects.

Motion should not:

- Flash.
- Shake.
- Simulate gambling.
- Create a sense of supernatural revelation.

Respect reduced motion preferences.

## Imagery And Texture

Detail pages use eight locally stored, original ink-wash atmosphere assets for
天、泽、火、雷、风、水、山、地. The upper and lower trigram assets are layered
with restrained opacity and slow movement so the background reflects the
hexagram structure without competing with the six lines.

The global page surface remains a clean neutral ivory. Atmosphere movement must
stop when the user prefers reduced motion.

Avoid:

- Heavy temple imagery.
- Fortune-telling props.
- Excessive seals, clouds, dragons, coins, or talismans.
- Dark mystical gradients.

## Voice And Copy

Copy should be reflective, careful, and plain.

Use:

- "this suggests"
- "one possible reading is"
- "this invites reflection"
- "from the image of the hexagram..."

Avoid:

- "destiny"
- "guaranteed"
- "prediction"
- "magic"
- "this will happen"
