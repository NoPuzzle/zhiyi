# AGENTS.md

## Project

This repository implements “知易 / Zhiyi”, a mobile-first Yi Jing / Zhouyi visual learning and reflection web app.

Optional full product expression:
知易 · 观象

Tagline:
以象入易，以问观心

Secondary tagline:
看见变化，理解自己

## Product meaning

“知易 / Zhiyi” has three layers of meaning:

1. 知《易》:
   Learn and understand the Yi Jing / Zhouyi, including Yin/Yang, trigrams, hexagrams, changing lines, and classical text.

2. 知变化:
   Understand change, transformation, timing, position, and recurring patterns in life and situations.

3. 知易行难:
   Understanding can be easier than action. The product should not stop at interpretation; it should guide users back to reflection and one small practical action.

## Product principles

- This is a learning and reflection tool, not a deterministic fortune-telling tool.
- Avoid claims of certainty.
- Avoid wording such as “predict your fate”, “change your destiny”, “guaranteed result”, or “magic”.
- Use wording such as:
  - “this suggests”
  - “one possible reading is”
  - “this invites reflection”
  - “from the image of the hexagram, we can observe...”
- Interpretations should help users understand situations, emotions, tensions, and possible next steps.
- Interpretations should not replace professional advice in medical, legal, financial, or mental health contexts.

## Core interpretation framework

Every reading should be structured as:

1. 象 / Image:
   What the hexagram image shows.

2. 辞 / Text:
   Relevant original text, judgment, image text, or line text.

3. 理 / Principle:
   The underlying principle of change, timing, position, or relationship.

4. 用 / Application:
   How this may apply to the user’s question or context.

5. 问 / Reflection:
   A question that helps the user reflect.

6. 行 / Small Action:
   One small practical action, connecting to 知易行难.

## Design principles

- Mobile-first.
- Calm and minimal.
- Ink-wash inspired.
- Warm rice-paper background.
- Ink black and gray as primary colors.
- Vermilion accent only for changing lines.
- The hexagram should be the visual center.
- Use generous whitespace.
- Avoid noisy decorative “ancient style” clutter.
- The product should feel like a quiet study room, not a fortune-telling stall.

## Engineering principles

- Use TypeScript.
- Keep data structured.
- Do not hard-code hexagram logic inside UI components.
- Use pure functions for line transformations.
- Use reusable components for hexagram rendering.
- Use local static data in V0.1.
- Do not add databases, login, payment, or external AI APIs without explicit approval.
- Do not commit real API keys.
- Keep README and docs updated when adding major features.
- Prefer small, reviewable changes.

## Content principles

- Classical Yi Jing text can be used where appropriate.
- Do not copy modern copyrighted translations, competitor explanations, or competitor UI text.
- Plain-language explanations should be original draft content unless otherwise reviewed.
- All interpretations should be suggestive and reflective, not absolute.
