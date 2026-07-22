# 知易 / Zhiyi Data Schema

## Goals

The data model keeps Yi Jing structure, product-authored content, safety rules,
and UI rendering separate. V0.1 uses local static data only.

## Line Convention

- Lines are stored from bottom to top.
- Index `0` is the bottom line; index `5` is the top line.
- `1` means yang.
- `0` means yin.
- Old yang changes `1 -> 0`.
- Old yin changes `0 -> 1`.

```ts
export type TrigramLines = [number, number, number];
export type HexagramLines = [number, number, number, number, number, number];
export type MovingLineIndex = 0 | 1 | 2 | 3 | 4 | 5;
```

## Trigram

Implemented in `data/trigrams.ts`:

```ts
export type Trigram = {
  id: string;
  name: string;
  chineseName: string;
  binaryLines: [number, number, number];
  symbol?: string;
  natureImage: string;
  attributes: {
    direction?: string;
    element?: string;
    familyRole?: string;
    bodyPart?: string;
    keywords: string[];
  };
};
```

Chinese UI copy for the eight trigrams lives in `data/trigram-copy.ts`. This is
the single source used by learning and hexagram pages.

## Hexagram

Implemented in `data/hexagrams.ts`:

```ts
export type Hexagram = {
  id: number;
  name: string;
  chineseName: string;
  unicodeSymbol?: string;
  upperTrigramId: string;
  lowerTrigramId: string;
  lines: [number, number, number, number, number, number];
  judgmentOriginal?: string;
  judgmentPlain?: string;
  imageText?: string;
  coreMeaning?: string;
  keywords: string[];
  lineTexts?: {
    position: string;
    original?: string;
    plain?: string;
    reflection?: string;
  }[];
  reflectionQuestions?: string[];
  smallAction?: string;
};
```

`lines` and `unicodeSymbol` are derived when each hexagram is defined:

- `lines` combines the lower trigram followed by the upper trigram.
- Unicode symbols use the standard 64-hexagram Unicode block.
- UI components do not construct canonical hexagram structure themselves.

## Ask Mode State

Ask mode distinguishes four line kinds:

```ts
type LineKindId = "yin" | "yang" | "old_yin" | "old_yang";
```

A reading result contains:

- The question and selected category.
- Manual or random casting method.
- Six line kinds stored bottom to top.
- Original and changed binary lines.
- Moving line indexes.
- Original and changed hexagram records.
- An optional high-stakes safety note.

The reading exists only in React client state. V0.1 does not save it to local
storage or send it to a server.

## Structured Interpretation

The UI creates six required sections:

```ts
type InterpretationSection = {
  title: string;
  body: string;
};
```

The sections are 象、辞、理、用、问、行. `行` reads the dedicated
`hexagram.smallAction` field and falls back to a question-category action. It
must not reuse a reflection question.

When `lib/safety.ts` detects medical, legal, financial, or mental-health terms,
the result adds a seventh safety section. Detection only controls explanatory
copy; it does not diagnose, block, or classify the user.

## Pure Domain Helpers

Implemented in `lib/hexagram.ts`:

- `getHexagramByLines`
- `getChangedLines`
- `getChangedHexagram`
- `invertHexagram` for 错卦
- `reverseHexagram` for 综卦
- `getMutualHexagram` for 互卦
- `getTrigramsFromHexagram`

Search normalization is implemented in `lib/search.ts`. High-stakes keyword
detection is implemented in `lib/safety.ts`.

## Current Content Depth

- All 8 trigrams have structural data.
- All 64 hexagrams have IDs, names, upper/lower trigrams, line patterns,
  Unicode symbols, and keywords.
- Hexagrams 1-3 include classical draft text, line text, original plain-language
  explanations, reflection prompts, and small actions.
- Hexagrams 4-20 include original base explanations, reflection prompts, and
  small actions.
- Hexagrams 21-64 remain structural records and will be expanded in reviewed
  batches.
- An automated completeness test checks required base-content fields for
  hexagrams 1-20.

## Content Boundaries

- Classical text may be included with source review.
- Modern copyrighted translations and competitor copy must not be copied.
- Product-authored explanations must be original and non-deterministic.
- High-stakes interpretations must not replace professional advice.
