# 知易 / Zhiyi Data Schema

## Goals

The data model should keep Yi Jing structure separate from UI rendering and interpretation copy.

V0.1 uses local static data only. No database, login, payment, external AI API, or real API keys.

## Principles

- Keep identifiers stable.
- Store line data in a consistent direction.
- Keep transformation logic in pure functions.
- Do not hard-code hexagram logic inside UI components.
- Separate classical text from original product explanations.
- Make room for future localization and content review.

## Line Direction

Hexagram lines should be stored from bottom to top because line positions are traditionally counted from the bottom:

```ts
type LineIndex = 0 | 1 | 2 | 3 | 4 | 5;
```

`0` is the bottom line.  
`5` is the top line.

## Core Types

```ts
export type YinYang = "yin" | "yang";

export type LineKind =
  | "old_yin"
  | "young_yang"
  | "young_yin"
  | "old_yang";

export interface Line {
  index: 0 | 1 | 2 | 3 | 4 | 5;
  yinYang: YinYang;
  changing: boolean;
  kind?: LineKind;
}

export interface Trigram {
  id: string;
  nameZh: string;
  nameEn: string;
  symbol: string;
  lines: [YinYang, YinYang, YinYang];
  image: string;
  attributes: string[];
  familyRole?: string;
  direction?: string;
  element?: string;
  originalText?: string;
  explanation: string;
}

export interface Hexagram {
  number: number;
  nameZh: string;
  namePinyin: string;
  nameEn?: string;
  unicode?: string;
  lines: [YinYang, YinYang, YinYang, YinYang, YinYang, YinYang];
  upperTrigramId: string;
  lowerTrigramId: string;
  judgmentText?: string;
  imageText?: string;
  lineTexts?: [string, string, string, string, string, string];
  explanation: HexagramExplanation;
  relations?: HexagramRelations;
}

export interface HexagramExplanation {
  image: string;
  principle: string;
  plainLanguage: string;
  reflectionPrompt: string;
  smallActionPrompt: string;
}

export interface HexagramRelations {
  oppositeHexagramNumber?: number;
  reversedHexagramNumber?: number;
  mutualHexagramNumber?: number;
}
```

## Reading Types

```ts
export interface ReadingQuestion {
  text: string;
  category?: "self" | "work" | "relationship" | "decision" | "emotion" | "other";
  createdAt?: string;
}

export interface CastLine {
  index: 0 | 1 | 2 | 3 | 4 | 5;
  kind: LineKind;
  yinYang: YinYang;
  changing: boolean;
}

export interface Reading {
  id: string;
  question: ReadingQuestion;
  originalLines: [CastLine, CastLine, CastLine, CastLine, CastLine, CastLine];
  originalHexagramNumber: number;
  changingLineIndexes: Array<0 | 1 | 2 | 3 | 4 | 5>;
  transformedLines: [Line, Line, Line, Line, Line, Line];
  transformedHexagramNumber?: number;
  interpretation: StructuredInterpretation;
}

export interface StructuredInterpretation {
  image: string;
  text: string;
  principle: string;
  application: string;
  reflection: string;
  smallAction: string;
  safetyNote?: string;
}
```

## Static Data Files

Recommended initial structure:

```txt
src/
  data/
    trigrams.ts
    hexagrams.ts
    copy.ts
  lib/
    iching/
      lines.ts
      transforms.ts
      lookup.ts
```

`trigrams.ts` should contain the Eight Trigrams.

`hexagrams.ts` should contain the Sixty-Four Hexagrams when content is ready. V0.1 may start with a smaller reviewed subset while the rendering and transformation logic is built.

`copy.ts` should contain UI copy and safety language.

## Transformation Rules

Changing lines transform as follows:

| Original | Changing | Transformed |
| --- | --- | --- |
| old yin | yes | yang |
| young yang | no | yang |
| young yin | no | yin |
| old yang | yes | yin |

Pure helper functions should cover:

- Convert cast line kind to Yin/Yang.
- Detect changing line indexes.
- Transform original lines into transformed lines.
- Look up hexagram by six-line pattern.
- Derive upper and lower trigram IDs.
- Derive opposite, reversed, and mutual hexagrams when supported.

## Content Boundaries

Classical Yi Jing text may be included where appropriate. Modern copyrighted translations, competitor explanations, and competitor UI text must not be copied.

Plain-language explanations should be original product content and should use suggestive, reflective language.

## Example Hexagram Data Shape

```ts
export const hexagramOne: Hexagram = {
  number: 1,
  nameZh: "乾",
  namePinyin: "Qian",
  nameEn: "The Creative",
  lines: ["yang", "yang", "yang", "yang", "yang", "yang"],
  upperTrigramId: "qian",
  lowerTrigramId: "qian",
  judgmentText: "元亨利贞。",
  imageText: "天行健，君子以自强不息。",
  explanation: {
    image: "Six unbroken lines suggest active, rising, initiating force.",
    principle: "This image points to strength, continuity, and disciplined movement.",
    plainLanguage: "One possible reading is that the situation asks for clarity, steadiness, and responsible initiative.",
    reflectionPrompt: "Where is action needed, and where might force become excess?",
    smallActionPrompt: "Choose one concrete step that can be completed today without overreaching."
  }
};
```

