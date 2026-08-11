import { describe, expect, it } from "vitest";
import {
  classicalTreatises,
  classicalWingsSource,
  getClassicalTreatise,
  getHexagramWings,
  hexagramWings,
} from "../data/classical-wings";
import { getClassicalText } from "../data/classical-text";
import { hexagrams, type Hexagram } from "../data/hexagrams";

const expectedTreatisePageCounts = [
  ["xici-shang", 12],
  ["xici-xia", 9],
  ["shuogua", 11],
  ["xugua", 1],
  ["zagua", 1],
] as const;
const forbiddenSourceMarkers =
  /\[(?:疏|注)\]|[〖〗【】]|(?:正義|正义|疏|注)曰|{{/;
const forbiddenSharedHexagramKeys = [
  "tuanText",
  "tuanParagraphs",
  "smallImageTexts",
  "specialUseImageText",
  "wenyanText",
  "wenyanParagraphs",
  "classicalTreatises",
] as const;
type SharedWingKey = Extract<
  keyof Hexagram,
  (typeof forbiddenSharedHexagramKeys)[number]
>;
const sharedHexagramTypeHasNoWingKeys: SharedWingKey extends never
  ? true
  : false = true;

function classicalWingTexts() {
  return [
    ...hexagramWings.flatMap((record) => [
      ...record.tuanParagraphs,
      ...record.smallImageTexts.map((line) => line.original),
      record.specialUseImageText?.original,
      ...(record.wenyanParagraphs ?? []),
    ]),
    ...classicalTreatises.flatMap((treatise) =>
      treatise.pages.flatMap((page) => page.paragraphs),
    ),
  ].filter((text): text is string => typeof text === "string");
}

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

describe("classical wings", () => {
  it("provides one non-empty Tuan passage for every hexagram", () => {
    expect(hexagramWings).toHaveLength(64);
    expect(new Set(hexagramWings.map((record) => record.id)).size).toBe(64);

    for (const hexagram of hexagrams) {
      const wings = getHexagramWings(hexagram.id);

      expect(wings.id).toBe(hexagram.id);
      expect(wings.tuanParagraphs.length, `hexagram ${hexagram.id} Tuan`).toBeGreaterThan(
        0,
      );
      expect(
        wings.tuanParagraphs.every((paragraph) => paragraph.trim().length > 0),
        `hexagram ${hexagram.id} Tuan paragraphs`,
      ).toBe(true);
    }
  });

  it("keeps all 384 Small Image passages aligned bottom-to-top", () => {
    let smallImageCount = 0;

    for (const hexagram of hexagrams) {
      const wings = getHexagramWings(hexagram.id);
      const classical = getClassicalText(hexagram.id);

      expect(wings.smallImageTexts, `hexagram ${hexagram.id} Small Images`).toHaveLength(
        6,
      );
      expect(wings.smallImageTexts.map((line) => line.position)).toEqual(
        classical.lineTexts.map((line) => line.position),
      );
      expect(wings.smallImageTexts.map((line) => line.position)).toEqual(
        hexagram.lines.map((line, index) => expectedLinePosition(line, index)),
      );
      expect(
        wings.smallImageTexts.every((line) => line.original.trim().length > 0),
        `hexagram ${hexagram.id} Small Image text`,
      ).toBe(true);

      smallImageCount += wings.smallImageTexts.length;
    }

    expect(smallImageCount).toBe(384);
  });

  it("limits special-use Small Images and Wenyan to Qian and Kun", () => {
    const specialUseRecords = hexagramWings.filter(
      (record) => record.specialUseImageText,
    );
    const wenyanRecords = hexagramWings.filter(
      (record) => record.wenyanParagraphs?.length,
    );

    expect(specialUseRecords.map((record) => record.id)).toEqual([1, 2]);
    expect(wenyanRecords.map((record) => record.id)).toEqual([1, 2]);

    for (const id of [1, 2]) {
      const wings = getHexagramWings(id);
      const classical = getClassicalText(id);

      expect(wings.specialUseImageText?.position).toBe(
        classical.specialUseText?.position,
      );
      expect(wings.specialUseImageText?.original.trim()).toBeTruthy();
      expect(wings.wenyanParagraphs?.length).toBeGreaterThan(0);
      expect(
        wings.wenyanParagraphs?.every(
          (paragraph) => paragraph.trim().length > 0,
        ),
      ).toBe(true);
    }
  });

  it("records five unique treatises with fixed source-page coverage", () => {
    expect(classicalTreatises).toHaveLength(5);
    expect(new Set(classicalTreatises.map((treatise) => treatise.slug)).size).toBe(
      5,
    );
    expect(new Set(classicalTreatises.map((treatise) => treatise.slug))).toEqual(
      new Set(expectedTreatisePageCounts.map(([slug]) => slug)),
    );

    for (const [slug, pageCount] of expectedTreatisePageCounts) {
      const treatise = getClassicalTreatise(slug);

      expect(treatise.pages, slug).toHaveLength(pageCount);

      for (const page of treatise.pages) {
        expect(page.pageTitle.trim()).toBeTruthy();
        expect(page.revisionId).toBeGreaterThan(0);
        expect(page.revisionUrl).toContain(`oldid=${page.revisionId}`);
        expect(page.paragraphs.length).toBeGreaterThan(0);
        expect(page.paragraphs.every((paragraph) => paragraph.trim().length > 0)).toBe(
          true,
        );
      }
    }
  });

  it("keeps commentary markup out of every stored classical passage", () => {
    const texts = classicalWingTexts();

    expect(texts.length).toBeGreaterThan(0);
    for (const text of texts) {
      expect(text).not.toMatch(forbiddenSourceMarkers);
    }
  });

  it("pins source metadata and the structural cross-check revision", () => {
    expect(classicalWingsSource.id).toBe("zhouyi-yizhuan-wikisource");
    expect(classicalWingsSource.catalogUrl).toBe(
      "https://zh.wikisource.org/wiki/周易",
    );
    expect(classicalWingsSource).toHaveProperty(
      "treatiseCatalogUrl",
      "https://zh.wikisource.org/wiki/易傳",
    );
    expect(classicalWingsSource.licenseUrl).toBe(
      "https://creativecommons.org/licenses/by-sa/4.0/",
    );
    expect(classicalWingsSource.structuralCrossCheck).toMatchObject({
      provider: "Kanripo",
      repository: "https://github.com/kanripo/KR1a0001",
      commit: "8284adbf9e3435d713180e24f05bf75f8b7d1d96",
    });
  });

  it("keeps transmission text out of the shared Hexagram client model", () => {
    expect(sharedHexagramTypeHasNoWingKeys).toBe(true);

    for (const hexagram of hexagrams) {
      for (const key of forbiddenSharedHexagramKeys) {
        expect(hexagram).not.toHaveProperty(key);
      }
    }
  });

  it("pins representative passages across source layouts", () => {
    expect(getHexagramWings(1).tuanParagraphs.join("")).toBe(
      "大哉乾元，萬物資始，乃統天。雲行雨施，品物流形，大明終始，六位時成。時乘六龍以御天，乾道變化，各正性命，保合大和，乃利貞。首出庶物，萬國咸寧。",
    );
    expect(getHexagramWings(3).smallImageTexts[0]).toEqual({
      position: "初九",
      original: "雖磐桓，志行正也。以貴下賤，大得民也。",
    });
    expect(getHexagramWings(8).smallImageTexts[2]).toEqual({
      position: "六三",
      original: "比之匪人，不亦傷乎！",
    });
    expect(getHexagramWings(18).smallImageTexts[2]).toEqual({
      position: "九三",
      original: "幹父之蠱，終无咎也。",
    });
    expect(getHexagramWings(2).specialUseImageText).toEqual({
      position: "用六",
      original: "用六永貞，以大終也。",
    });
  });
});
