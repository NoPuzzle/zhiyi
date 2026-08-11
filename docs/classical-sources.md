# Classical Text Sources and Provenance

## Purpose

Zhiyi keeps classical text separate from product-authored interpretation. The
classical dataset exists so every displayed passage can be traced back to a
fixed source revision. It is not presented as a new translation or as a
critical edition of the *Zhouyi*.

The checked-in scope now covers the received *Zhouyi* scripture and the
traditional Ten Wings material used by the product:

- 64 hexagram judgments (`卦辞`).
- 384 line statements (`爻辞`), six per hexagram and stored bottom to top.
- `用九` for 乾 and `用六` for 坤 as two separately labeled special-use
  passages.
- 64 Tuan passages (`彖传`).
- 64 Great Image passages (`大象`) and 384 line-level Small Image passages
  (`小象`), with the 乾 `用九` and 坤 `用六` Small Images stored separately
  rather than as seventh physical lines.
- The Qian and Kun Wenyan passages (`文言`).
- The complete transmitted text of Xici Upper, Xici Lower, Shuogua, Xugua,
  and Zagua, divided into logical sections from five fixed Wikisource work
  pages.

The dataset does not intentionally include Wang Bi, Han Kangbo, or Kong
Yingda commentary and subcommentary, later interpretive traditions, modern
translations, or product interpretation. Those layers must not be merged into
the scripture or transmitted-text fields during extraction.

## Separation from Product-Authored Content

The two content layers have different ownership and review states:

- Product-authored observations, plain-language explanations, reflection
  questions, and small actions live in `data/hexagrams.ts` and
  `data/hexagram-content/`. Their status is recorded in
  `data/content-reviews.ts`.
- Scripture, the already-recorded Great Image passages, and their source
  metadata live in `data/classical-text.json` and are exposed through
  `data/classical-text.ts`.
- Tuan, Small Image, Wenyan, Xici, Shuogua, Xugua, and Zagua live in
  `data/classical-wings.json` and are exposed through
  `data/classical-wings.ts`.
- `public/classical-readings/{id}.json` is a generated, per-hexagram projection
  used by Ask mode. It is verified against the two source datasets and is not
  edited as an independent source.

The server-rendered hexagram detail route joins the layers by ID, but the shared
client-side `Hexagram` object does not carry either classical dataset. Ask mode
loads only the one or two generated per-hexagram assets needed for the current
reading; learning and browser bundles do not carry the full corpus. Classical
wording must never be rewritten to make a product explanation, and
product-authored wording must never be presented as classical text.

## Transcription Sources

The scripture dataset uses fixed Chinese Wikisource 《周易正義》 pages identified
there with the 《武英殿十三經注疏》本《周易正義》. The transmitted-text dataset
uses fixed, independent Chinese Wikisource `周易/<卦名>` pages for Tuan, Small
Image, and Qian/Kun Wenyan, plus fixed `易傳/<篇名>` pages for the five general
treatises. These are separate transcription records; the second dataset is not
silently described as the same edition as the first.

Each hexagram record and every treatise source page stores:

- The Wikisource page title.
- The exact MediaWiki revision ID (`revisionId`).
- A fixed revision URL containing that `oldid` (`revisionUrl`).
- The date and method used to record the source.

The fixed `oldid` is essential. A current Wikisource page may change after the
dataset is recorded, so an unfixed page URL is not sufficient provenance. The
stored revision remains the reproducible readback target until a reviewed
source update intentionally replaces it.

Ancient classical text is in the public domain. The Wikisource transcription
is provided under CC BY-SA 4.0; the checked-in metadata retains the provider,
catalog, license, and fixed revision links needed for attribution and
readback.

## Supporting References and Their Limits

Two other references have bounded roles:

1. The Chinese Text Project entry for the 武英殿 scan is retained as a
   bibliographic scan entrance and for manual page-level checking. It is not an
   automated text source, does not silently override the fixed Wikisource
   transcription, and is not evidence that every textual variant has been
   resolved.
2. Kanripo repository `KR1a0001`, fixed at commit
   `8284adbf9e3435d713180e24f05bf75f8b7d1d96`, is used only to cross-check the
   structural presence of 64 hexagrams, 384 line statements, the corresponding
   Tuan/Image/Wenyan structure, and the five transmitted works. It is not the
   sole base text and is not used to silently normalize characters,
   punctuation, or variants.

These boundaries are recorded in the dataset itself. If another edition is
introduced later, it must be named and linked independently rather than folded
into the existing source record without an audit trail.

The scripture fields contain ten known HTML-layout edge cases: split passages, one
title/text collision, a Great Image without the usual book-title brackets, and
annotation-boundary artifacts. `scripts/sync-classical-text.mjs` handles these
through an explicit `extractionCorrections` list rather than hidden cleanup.
The dataset records each affected hexagram, fixed revision, field, and reason;
the source script holds the exact resulting text; and automated tests pin all
ten outcomes. A correction refuses to run against a different `oldid`, forcing
the next source update back through human review. These are reproducible
extraction decisions for the named fixed revisions, not a general license to
modernize wording or settle variants. The Ten Wings dataset deliberately uses
the independent, annotation-free `周易` and `易傳` pages instead of trying to
recover transmitted text from the annotated 《周易正義》 layout. Its 64-page
source manifest and five treatise revisions are pinned in the synchronization
script; unknown templates, missing passages, count drift, and revision drift
fail closed. No Ten Wings extraction correction is currently required.

## What `source-recorded` Means

Every classical record currently has review status `source-recorded`. This
means:

- The source identity is explicit.
- The record points to a fixed page revision.
- The stored fields can be re-read and compared against that revision.
- The expected structural count and bottom-to-top line order can be tested.

It does **not** mean:

- Zhiyi has produced a collation-based critical edition.
- Differences among received editions have been resolved.
- Every Wikisource transcription choice has been independently verified
  against the scan.
- Recorded punctuation or character variants may be silently modernized.

When a source page contains a suspected transcription error, extraction edge
case, or meaningful variant, preserve the fixed-revision evidence and document
the finding. Any correction must be reviewed as a source change; do not erase
the earlier provenance or describe the variant as resolved without evidence.

## Verification

Run the read-only source verification command from the repository root:

```bash
npm run verify:classical-sources
```

The command re-reads 64 fixed 《周易正義》 scripture pages, 64 fixed independent
`周易/<卦名>` transmission pages, and five fixed `易傳/<篇名>` pages. It compares
the results with both checked-in datasets. Expected coverage is 64 judgments,
384 line statements, 64 Tuan passages, 64 Great Images, 384 Small Images, two
special-use statements and their two Small Images, Qian/Kun Wenyan, and five
complete transmitted works with logical section counts `12/9/11/1/1`.

Ask mode's generated projections have a separate local drift check:

```bash
npm run verify:classical-assets
```

The source readback requires network access and may be temporarily affected by
Wikisource rate limits; the generated-asset check is local. A successful result
confirms reproducible agreement with the recorded fixed revisions; it does not
upgrade the dataset to a critical edition or settle textual variants.

Before accepting any source-data change:

1. Inspect the exact fixed revision and the generated diff.
2. Confirm that no annotation or later commentary entered a scripture or
   transmitted-text field.
3. Confirm all six scripture and Small Image labels against the hexagram's
   bottom-to-top binary structure.
4. Preserve the previous revision and decision history in Git and project
   documentation.
5. Run `npm run verify:classical-sources`, `npm test`, and the normal build
   verification.
