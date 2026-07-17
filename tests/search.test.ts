import { describe, expect, it } from "vitest";
import { hexagramsById } from "../data/hexagrams";
import { matchesHexagramSearch, normalizeSearchTerm } from "../lib/search";

describe("hexagram search", () => {
  it("ignores spaces, separators, case, and pinyin tone marks", () => {
    expect(normalizeSearchTerm(" Xiǎo-Chù ")).toBe("xiaochu");
  });

  it("finds 小畜 with compact pinyin", () => {
    const xiaoChu = hexagramsById.get(9);

    expect(xiaoChu).toBeTruthy();
    expect(matchesHexagramSearch(xiaoChu!, "xiaochu")).toBe(true);
  });

  it("still finds Chinese names and keywords", () => {
    const qian = hexagramsById.get(1);

    expect(qian).toBeTruthy();
    expect(matchesHexagramSearch(qian!, "乾")).toBe(true);
    expect(matchesHexagramSearch(qian!, "主动")).toBe(true);
  });
});
