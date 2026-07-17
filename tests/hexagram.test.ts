import { describe, expect, it } from "vitest";
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

  it("resolves every stored line pattern back to the same hexagram", () => {
    for (const hexagram of hexagrams) {
      expect(getHexagramByLines(hexagram.lines)?.id).toBe(hexagram.id);
    }
  });

  it("provides base reflective content for the first content batch", () => {
    for (let id = 1; id <= 10; id += 1) {
      const hexagram = hexagramsById.get(id);

      expect(hexagram?.coreMeaning).toBeTruthy();
      expect(hexagram?.judgmentPlain).toBeTruthy();
      expect(hexagram?.reflectionQuestions).toHaveLength(3);
      expect(hexagram?.smallAction).toBeTruthy();
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
