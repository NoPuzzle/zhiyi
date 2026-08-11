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
  judgmentPlain?: string;
  imageObservation?: string;
  coreMeaning?: string;
  application?: string;
  authoredReview: AuthoredContentReview;
  keywords: string[];
  lineTexts?: {
    position: string;
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

Product-authored content patches live in `data/hexagram-content/`. They contain
plain-language observations, applications, questions, actions, and line-position
reflections only; they do not contain classical source text.

## Product-Authored Review State

Implemented in `data/content-reviews.ts`:

```ts
export type AuthoredContentReview =
  | {
      status: "draft";
      recordedOn: IsoDate;
      note: string;
    }
  | {
      status: "first-pass-reviewed";
      reviewedOn: IsoDate;
      method: "codex-assisted-editorial-pass";
      scope: "product-authored";
    };
```

This status applies only to Zhiyi's product-authored layer. It does not assert
that classical source wording or textual variants have been critically
reviewed. Git remains the revision history; the status records the content
review stage, not deployment state.

## Classical Text and Provenance

Classical text is stored separately in `data/classical-text.json`, typed and
loaded by `data/classical-text.ts`, then joined by ID only in the server-rendered
detail route. It is deliberately not attached to the shared client-side
`Hexagram` object, so learning and Ask bundles do not carry source text they do
not display.

```ts
export type ClassicalLineText = {
  position: string;
  original: string;
};

export type HexagramClassicalText = {
  id: number;
  name: string;
  pageTitle: string;
  revisionId: number;
  revisionUrl: string;
  review: {
    status: "source-recorded";
    recordedOn: IsoDate;
    method: "fixed-revision-readback";
  };
  judgmentOriginal: string;
  imageText: string;
  lineTexts: [
    ClassicalLineText,
    ClassicalLineText,
    ClassicalLineText,
    ClassicalLineText,
    ClassicalLineText,
    ClassicalLineText,
  ];
  specialUseText?: ClassicalLineText;
};
```

The dataset contains 64 judgments, 64 Great Image passages, and 384 line
statements. 乾 additionally records `用九`; 坤 additionally records `用六`.
Each line tuple is stored bottom to top and must match the derived binary line
pattern.

Every hexagram record identifies a fixed Chinese Wikisource
《周易正義》 revision through `revisionId` and an `oldid` URL. The Chinese Text
Project 武英殿 scan link is retained only for bibliography and manual checking.
Kanripo `KR1a0001` commit
`8284adbf9e3435d713180e24f05bf75f8b7d1d96` is used only for structural
cross-checking, not as a silent replacement text.

Ten known extraction edge cases are recorded as source-level corrections with
their hexagram ID, locked `revisionId`, field, and reason. Exact resulting text
lives in the synchronization script and is pinned by tests. A correction must
not run against a different revision without explicit human review.

`source-recorded` means the passage can be traced to and re-read from a fixed
revision. It does not mean that Zhiyi has produced a collation-based critical
edition or resolved differences among received editions. See
`docs/classical-sources.md` for source roles, attribution, verification, and
change rules.

## Ten Wings Source Layer

`data/classical-wings.json` adds the transmitted material that is not carried
by the legacy scripture record. `data/classical-wings.ts` exposes it to
server-rendered reading routes and tests.

```ts
type HexagramWingRecord = {
  id: number;
  name: string;
  pageTitle: string;
  revisionId: number;
  revisionUrl: string;
  review: ClassicalWingReview;
  tuanParagraphs: string[];
  smallImageTexts: SixSmallImageTexts;
  specialUseImageText?: ClassicalWingLineText;
  wenyanParagraphs?: string[];
};

type ClassicalTreatise = {
  slug: "xici-shang" | "xici-xia" | "shuogua" | "xugua" | "zagua";
  title: string;
  shortTitle: string;
  description: string;
  pages: Array<{
    id: string;
    label: string;
    pageTitle: string;
    revisionId: number;
    revisionUrl: string;
    review: ClassicalWingReview;
    paragraphs: string[];
  }>;
};
```

Each hexagram has one Tuan passage and exactly six Small Image records aligned
with the six scripture line statements from bottom to top. Only 乾 and 坤 may
have `specialUseImageText` or `wenyanParagraphs`. The five treatise records
preserve logical sections extracted from five fixed Wikisource work pages: 12
sections for Xici Upper, 9 for Xici Lower, 11 for Shuogua, and one record each
for Xugua and Zagua. These source-specific divisions are not presented as a
claim about every historical chapter division.

Ask mode does not import this full dataset. The generated
`public/classical-readings/{id}.json` files contain only one hexagram's
scripture, Tuan, Great Image, and Small Images. They are loaded on demand and
must match the checked-in source datasets under
`npm run verify:classical-assets`.

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
  classical?: Array<{
    label: string;
    text: string | string[];
  }>;
};
```

The sections are 象、辞、理、用、问、行. `行` reads the dedicated
`hexagram.smallAction` field and falls back to a question-category action. It
must not reuse a reflection question.

When the current per-hexagram static asset is available, 象、辞 and the changed
hexagram context also show their source-labeled scripture or transmitted text.
Failure to load that local asset does not replace or block the product-authored
reflection result.

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

The `/hexagrams` client receives `HexagramSummary` records from
`lib/hexagram-summary.ts` containing only identity, trigram, line, symbol, and
keyword fields. Detail prose and all six line observations stay in
server-rendered detail routes instead of being serialized into the browser
index payload.

## Current Content Depth

- All 8 trigrams have structural data.
- All 64 hexagrams have IDs, names, upper/lower trigrams, line patterns,
  Unicode symbols, and keywords.
- All 64 hexagrams include an original image observation, core meaning,
  application, three reflection prompts, and a concrete small action.
- All 64 hexagrams include six bottom-to-top product-authored line-position
  observations and reflection questions.
- The classical source layers contain all 64 judgments, all 384 line
  statements, 64 Tuan passages, 64 Great Images, 384 Small Images, the two
  special-use statements and their Small Images, Qian/Kun Wenyan, and the five
  complete transmitted works.
- Each classical record points to its own fixed Wikisource `oldid`; the review
  state remains `source-recorded`, not “critical edition complete.”
- All 64 hexagrams have completed a first editorial pass over base content and
  all 384 product-authored line observations.
- Automated completeness coverage checks all required content and six line
  observations for every hexagram. Editorial contract tests additionally
  cover line order, field form, concrete-action language, cross-hexagram exact
  duplicates, deterministic claims, and management-template wording.
- Classical checks cover source metadata, fixed-revision URLs, scripture and
  Ten Wings counts, line order, special-use isolation, known extraction
  corrections, treatise section coverage, generated Ask assets, and
  contamination markers.

## Content Boundaries

- Classical text and product-authored interpretation must remain visibly and
  structurally separate.
- A recorded source is reproducible provenance, not proof that textual variants
  have been resolved.
- Do not silently normalize a recorded character or punctuation variant; retain
  the fixed revision and review the change with evidence.
- Modern copyrighted translations and competitor copy must not be copied.
- Product-authored explanations must be original and non-deterministic.
- High-stakes interpretations must not replace professional advice.

Run the network-backed fixed-revision readback with:

```bash
npm run verify:classical-sources
npm run verify:classical-assets
```
