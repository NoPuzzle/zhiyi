import type { Hexagram } from "../data/hexagrams";

export type HexagramSummary = Pick<
  Hexagram,
  | "id"
  | "name"
  | "chineseName"
  | "unicodeSymbol"
  | "upperTrigramId"
  | "lowerTrigramId"
  | "lines"
  | "keywords"
>;

export function toHexagramSummary(hexagram: Hexagram): HexagramSummary {
  return {
    id: hexagram.id,
    name: hexagram.name,
    chineseName: hexagram.chineseName,
    unicodeSymbol: hexagram.unicodeSymbol,
    upperTrigramId: hexagram.upperTrigramId,
    lowerTrigramId: hexagram.lowerTrigramId,
    lines: hexagram.lines,
    keywords: hexagram.keywords,
  };
}
