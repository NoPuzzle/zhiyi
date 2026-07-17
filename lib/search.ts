import type { Hexagram } from "../data/hexagrams";

export function normalizeSearchTerm(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s·'’_-]+/g, "");
}

export function matchesHexagramSearch(hexagram: Hexagram, search: string) {
  const query = normalizeSearchTerm(search);

  if (!query) {
    return true;
  }

  const fields = [
    hexagram.chineseName,
    hexagram.name,
    hexagram.id.toString(),
    ...hexagram.keywords,
  ];

  return fields.some((field) => normalizeSearchTerm(field).includes(query));
}
