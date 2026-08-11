import { describe, expect, it } from "vitest";
import {
  classicalSource,
  classicalTextRecords,
  getClassicalText,
} from "../data/classical-text";
import { authoredContentReviews } from "../data/content-reviews";
import { hexagrams, hexagramsById } from "../data/hexagrams";
import {
  getChangedHexagram,
  getChangedLines,
  getHexagramByLines,
  getMutualHexagram,
  getTrigramsFromHexagram,
  invertHexagram,
  reverseHexagram,
  type HexagramLines,
} from "../lib/hexagram";

const qian: HexagramLines = [1, 1, 1, 1, 1, 1];
const kun: HexagramLines = [0, 0, 0, 0, 0, 0];
const zhun: HexagramLines = [1, 0, 0, 0, 1, 0];
const editorialReviewIds = hexagrams
  .filter(
    (hexagram) =>
      hexagram.authoredReview.status === "first-pass-reviewed",
  )
  .map((hexagram) => hexagram.id);

function expectedLinePosition(line: number, index: number) {
  const placeLabels = ["初", "二", "三", "四", "五", "上"];

  if (index === 0) {
    return line === 1 ? "初九" : "初六";
  }

  if (index === 5) {
    return line === 1 ? "上九" : "上六";
  }

  return `${line === 1 ? "九" : "六"}${placeLabels[index]}`;
}

describe("hexagram data", () => {
  it("contains all 64 unique IDs, line patterns, and symbols", () => {
    expect(hexagrams).toHaveLength(64);
    expect(new Set(hexagrams.map((hexagram) => hexagram.id)).size).toBe(64);
    expect(new Set(hexagrams.map((hexagram) => hexagram.lines.join(""))).size).toBe(
      64,
    );
    expect(new Set(hexagrams.map((hexagram) => hexagram.unicodeSymbol)).size).toBe(
      64,
    );
  });

  it("records an explicit product-authored review state for every hexagram", () => {
    expect(authoredContentReviews.size).toBe(64);
    expect(editorialReviewIds).toEqual(
      Array.from({ length: 64 }, (_, index) => index + 1),
    );

    for (const hexagram of hexagrams) {
      expect(hexagram.authoredReview).toBeDefined();

      if (hexagram.authoredReview.status === "first-pass-reviewed") {
        expect(hexagram.authoredReview.reviewedOn).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );
        expect(hexagram.authoredReview.scope).toBe("product-authored");
      } else {
        expect(hexagram.authoredReview.recordedOn).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );
      }
    }
  });

  it("provides source-recorded classical text for all 64 hexagrams", () => {
    expect(classicalTextRecords).toHaveLength(64);
    expect(classicalSource.id).toBe("wuying-zhouyi-zhengyi-wikisource");
    expect(classicalSource.bibliographicScanUrl).toMatch(/^https:\/\//);

    let lineCount = 0;
    const sourcePages = new Set<string>();
    const forbiddenClassicalMarkers =
      /\[(?:疏|注)\]|[〖〗]|《(?:彖|文言|象)》|(?:象|彖|注|疏|正義)曰[：:]?/;

    for (const hexagram of hexagrams) {
      const classical = getClassicalText(hexagram.id);
      const expectedPositions = hexagram.lines.map((line, index) =>
        expectedLinePosition(line, index),
      );

      expect(classical.id).toBe(hexagram.id);
      expect(classical.review.status).toBe("source-recorded");
      expect(classical.review.method).toBe("fixed-revision-readback");
      expect(classical.review.recordedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(classical.revisionId).toBeGreaterThan(0);
      expect(classical.revisionUrl).toContain(
        `oldid=${classical.revisionId}`,
      );
      expect(classical.judgmentOriginal.trim()).toBeTruthy();
      expect(classical.imageText.trim()).toBeTruthy();
      expect(classical.lineTexts).toHaveLength(6);
      expect(classical.lineTexts.map((line) => line.position)).toEqual(
        expectedPositions,
      );
      expect(
        classical.lineTexts.every((line) => line.original.trim().length > 0),
      ).toBe(true);
      for (const text of [
        classical.judgmentOriginal,
        classical.imageText,
        ...classical.lineTexts.map((line) => line.original),
      ]) {
        expect(text).not.toMatch(forbiddenClassicalMarkers);
        expect(text).not.toMatch(/[。！？；，、]{2}/);
        expect(text.match(/「/g)?.length ?? 0).toBe(
          text.match(/」/g)?.length ?? 0,
        );
      }

      sourcePages.add(classical.pageTitle);
      lineCount += classical.lineTexts.length;
    }

    expect(sourcePages.size).toBe(64);
    expect(lineCount).toBe(384);
    expect(getClassicalText(1).specialUseText).toEqual({
      position: "用九",
      original: "見群龍，無首，吉。",
    });
    expect(getClassicalText(2).specialUseText).toEqual({
      position: "用六",
      original: "利永貞。",
    });
    expect(
      hexagrams.slice(2).every((hexagram) => !getClassicalText(hexagram.id).specialUseText),
    ).toBe(true);
    expect(getClassicalText(64).judgmentOriginal).toBe(
      "亨，小狐汔濟，濡其尾，無攸利。",
    );
  });

  it("keeps every reviewed extraction exception explicit and reproducible", () => {
    expect(
      classicalSource.extractionCorrections.map(
        ({ id, revisionId, field }) => [id, revisionId, field],
      ),
    ).toEqual([
      [6, 2404945, "line:九四"],
      [10, 2404942, "judgmentOriginal"],
      [14, 2386341, "line:九二"],
      [14, 2386341, "line:九四"],
      [28, 2692227, "imageText"],
      [36, 2772387, "imageText"],
      [36, 2772387, "line:六二"],
      [39, 2404967, "line:六二"],
      [48, 2407709, "judgmentOriginal"],
      [49, 2407710, "line:上六"],
    ]);
    expect(getClassicalText(6).lineTexts[3].original).toBe(
      "不克訟。復即命渝，安貞吉。",
    );
    expect(getClassicalText(10).judgmentOriginal).toBe(
      "履虎尾，不咥人，亨。",
    );
    expect(getClassicalText(14).lineTexts[1].original).toBe(
      "大車以載，有攸往，無咎。",
    );
    expect(getClassicalText(14).lineTexts[3].original).toBe(
      "匪其彭，無咎。",
    );
    expect(getClassicalText(28).imageText).toBe(
      "澤滅木，大過。君子以獨立不懼，遁世無悶。",
    );
    expect(getClassicalText(36).imageText).toBe(
      "「明入地中，明夷」，君子以蒞眾，用晦而明。",
    );
    expect(getClassicalText(36).lineTexts[1].original).toBe(
      "明夷，夷於左股，用拯馬壯，吉。",
    );
    expect(getClassicalText(39).lineTexts[1].original).toBe(
      "王臣蹇蹇，匪躬之故。",
    );
    expect(getClassicalText(48).judgmentOriginal).toBe(
      "改邑不改井，無喪無得，往來井井。汔至亦未繘井，羸其瓶，凶。",
    );
    expect(getClassicalText(49).lineTexts[5].original).toBe(
      "君子豹變，小人革面。征凶，居貞吉。",
    );
  });

  it("resolves every stored line pattern back to the same hexagram", () => {
    for (const hexagram of hexagrams) {
      expect(getHexagramByLines(hexagram.lines)?.id).toBe(hexagram.id);
    }
  });

  it("provides complete reflective content for every hexagram", () => {
    for (let id = 1; id <= 64; id += 1) {
      const hexagram = hexagramsById.get(id);

      expect(hexagram, `hexagram ${id} should exist`).toBeDefined();
      expect(
        hexagram?.imageObservation?.trim(),
        `hexagram ${id} imageObservation`,
      ).toBeTruthy();
      expect(
        hexagram?.coreMeaning?.trim(),
        `hexagram ${id} coreMeaning`,
      ).toBeTruthy();
      expect(
        hexagram?.judgmentPlain?.trim(),
        `hexagram ${id} judgmentPlain`,
      ).toBeTruthy();
      expect(
        hexagram?.keywords.length,
        `hexagram ${id} keywords`,
      ).toBeGreaterThan(0);
      expect(
        hexagram?.keywords.every((keyword) => keyword.trim().length > 0),
        `hexagram ${id} keywords should be non-empty`,
      ).toBe(true);
      expect(
        hexagram?.reflectionQuestions,
        `hexagram ${id} reflectionQuestions`,
      ).toHaveLength(3);
      expect(
        hexagram?.reflectionQuestions?.every(
          (question) => question.trim().length > 0,
        ),
        `hexagram ${id} reflectionQuestions should be non-empty`,
      ).toBe(true);
      expect(
        hexagram?.smallAction?.trim(),
        `hexagram ${id} smallAction`,
      ).toBeTruthy();
      expect(
        hexagram?.application?.trim(),
        `hexagram ${id} application`,
      ).toBeTruthy();
      expect(
        hexagram?.lineTexts,
        `hexagram ${id} lineTexts`,
      ).toHaveLength(6);
      expect(
        hexagram?.lineTexts?.every(
          (lineText) =>
            lineText.position.trim().length > 0 &&
            Boolean(lineText.plain?.trim()) &&
            Boolean(lineText.reflection?.trim()),
        ),
        `hexagram ${id} line content should be complete`,
      ).toBe(true);
    }
  });

  it("keeps all 64 editorially reviewed records distinct and suggestive", () => {
    const deterministicPhrases = [
      "只会",
      "必然",
      "必定",
      "注定",
      "保证",
      "一定会",
      "肯定会",
      "预测命运",
      "改变命运",
      "魔法",
    ];
    const positionTemplatePrefixes = [
      "初位",
      "二位",
      "三位",
      "四位",
      "五位",
      "上位",
    ];
    const reflectionOnlyActionPhrases = [
      "想一想",
      "思考一下",
      "反思一下",
      "问问自己",
      "考虑一下",
    ];
    const managementPhrases = [
      "项目",
      "复盘",
      "指标",
      "授权",
      "流程",
      "负责人",
      "完成标准",
      "风险预案",
      "启动条件",
      "停止条件",
      "高风险任务",
      "优先级",
      "协作",
      "系统",
      "停机",
      "校准",
      "可执行",
    ];
    const reviewedAuthoredTextOwners = new Map<string, number>();

    for (const id of editorialReviewIds) {
      const hexagram = hexagramsById.get(id);

      expect(hexagram, `hexagram ${id} should exist`).toBeDefined();
      expect(
        hexagram?.lineTexts?.map((lineText) => lineText.position),
        `hexagram ${id} positions should stay bottom-to-top`,
      ).toEqual(
        hexagram?.lines.map((line, index) =>
          expectedLinePosition(line, index),
        ),
      );
      expect(
        hexagram?.reflectionQuestions?.every((question) =>
          question.trim().endsWith("？"),
        ),
        `hexagram ${id} reflection questions should be questions`,
      ).toBe(true);
      expect(
        hexagram?.lineTexts?.every((lineText) =>
          lineText.reflection?.trim().endsWith("？"),
        ),
        `hexagram ${id} line reflections should be questions`,
      ).toBe(true);
      expect(
        hexagram?.lineTexts?.every((lineText) =>
          positionTemplatePrefixes.every(
            (prefix) => !lineText.plain?.trim().startsWith(prefix),
          ),
        ),
        `hexagram ${id} line observations should not use position templates`,
      ).toBe(true);
      expect(
        hexagram?.smallAction?.trim(),
        `hexagram ${id} small action should not be a question`,
      ).not.toMatch(/[？?]$/);
      expect(
        reflectionOnlyActionPhrases.every(
          (phrase) => !hexagram?.smallAction?.includes(phrase),
        ),
        `hexagram ${id} small action should be a concrete action`,
      ).toBe(true);

      const authoredText = [
        hexagram?.imageObservation,
        hexagram?.judgmentPlain,
        hexagram?.coreMeaning,
        hexagram?.application,
        hexagram?.smallAction,
        ...(hexagram?.reflectionQuestions ?? []),
        ...(hexagram?.lineTexts?.flatMap((lineText) => [
          lineText.plain,
          lineText.reflection,
        ]) ?? []),
      ]
        .filter((text): text is string => Boolean(text?.trim()))
        .map((text) => text.trim());

      expect(
        new Set(authoredText).size,
        `hexagram ${id} should not repeat an authored field verbatim`,
      ).toBe(authoredText.length);

      for (const text of authoredText) {
        expect(
          reviewedAuthoredTextOwners.get(text),
          `hexagram ${id} should not duplicate reviewed text from another hexagram`,
        ).toBeUndefined();
        reviewedAuthoredTextOwners.set(text, id);
      }

      for (const phrase of deterministicPhrases) {
        expect(
          authoredText.every((text) => !text.includes(phrase)),
          `hexagram ${id} should avoid deterministic phrase "${phrase}"`,
        ).toBe(true);
      }

      for (const phrase of managementPhrases) {
        expect(
          authoredText.every((text) => !text.includes(phrase)),
          `hexagram ${id} should avoid management phrase "${phrase}"`,
        ).toBe(true);
      }
    }
  });
});

describe("hexagram transformations", () => {
  it("changes old yang to yin and old yin to yang", () => {
    expect(getChangedLines(qian, [0])).toEqual([0, 1, 1, 1, 1, 1]);
    expect(getChangedLines(kun, [5])).toEqual([0, 0, 0, 0, 0, 1]);
  });

  it("resolves the changed hexagram", () => {
    expect(getChangedHexagram(qian, [0])?.chineseName).toBe("姤");
  });

  it("creates the opposite hexagram by inverting every line", () => {
    expect(invertHexagram(qian)).toEqual(kun);
  });

  it("creates the reversed hexagram by reversing line order", () => {
    expect(reverseHexagram(zhun)).toEqual([0, 1, 0, 0, 0, 1]);
  });

  it("creates the mutual hexagram from the four inner lines", () => {
    const mutual = getMutualHexagram(zhun);

    expect(mutual).toEqual([0, 0, 0, 0, 0, 1]);
    expect(getHexagramByLines(mutual)?.chineseName).toBe("剥");
  });

  it("derives lower and upper trigrams in bottom-to-top order", () => {
    const { lower, upper } = getTrigramsFromHexagram(zhun);

    expect(lower.id).toBe("zhen");
    expect(upper.id).toBe("kan");
  });

  it("keeps every derived relationship inside the 64 hexagrams", () => {
    for (const hexagram of hexagrams) {
      expect(getHexagramByLines(invertHexagram(hexagram.lines))).toBeTruthy();
      expect(getHexagramByLines(reverseHexagram(hexagram.lines))).toBeTruthy();
      expect(getHexagramByLines(getMutualHexagram(hexagram.lines))).toBeTruthy();
    }
  });
});
