export type Trigram = {
  id: string;
  name: string;
  chineseName: string;
  // Lines are stored from bottom to top. 1 = yang, 0 = yin.
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

export const trigrams: Trigram[] = [
  {
    id: "qian",
    name: "Qian",
    chineseName: "乾",
    binaryLines: [1, 1, 1],
    symbol: "☰",
    natureImage: "Heaven",
    attributes: {
      direction: "Northwest",
      element: "Metal",
      familyRole: "Father",
      bodyPart: "Head",
      keywords: ["creative", "active", "strong", "initiating"],
    },
  },
  {
    id: "dui",
    name: "Dui",
    chineseName: "兑",
    binaryLines: [1, 1, 0],
    symbol: "☱",
    natureImage: "Lake",
    attributes: {
      direction: "West",
      element: "Metal",
      familyRole: "Youngest daughter",
      bodyPart: "Mouth",
      keywords: ["open", "joyful", "expressive", "responsive"],
    },
  },
  {
    id: "li",
    name: "Li",
    chineseName: "离",
    binaryLines: [1, 0, 1],
    symbol: "☲",
    natureImage: "Fire",
    attributes: {
      direction: "South",
      element: "Fire",
      familyRole: "Middle daughter",
      bodyPart: "Eyes",
      keywords: ["bright", "clear", "attached", "discerning"],
    },
  },
  {
    id: "zhen",
    name: "Zhen",
    chineseName: "震",
    binaryLines: [1, 0, 0],
    symbol: "☳",
    natureImage: "Thunder",
    attributes: {
      direction: "East",
      element: "Wood",
      familyRole: "Eldest son",
      bodyPart: "Feet",
      keywords: ["arousing", "moving", "startling", "beginning"],
    },
  },
  {
    id: "xun",
    name: "Xun",
    chineseName: "巽",
    binaryLines: [0, 1, 1],
    symbol: "☴",
    natureImage: "Wind",
    attributes: {
      direction: "Southeast",
      element: "Wood",
      familyRole: "Eldest daughter",
      bodyPart: "Thighs",
      keywords: ["entering", "gentle", "permeating", "adaptive"],
    },
  },
  {
    id: "kan",
    name: "Kan",
    chineseName: "坎",
    binaryLines: [0, 1, 0],
    symbol: "☵",
    natureImage: "Water",
    attributes: {
      direction: "North",
      element: "Water",
      familyRole: "Middle son",
      bodyPart: "Ears",
      keywords: ["danger", "depth", "flow", "practice"],
    },
  },
  {
    id: "gen",
    name: "Gen",
    chineseName: "艮",
    binaryLines: [0, 0, 1],
    symbol: "☶",
    natureImage: "Mountain",
    attributes: {
      direction: "Northeast",
      element: "Earth",
      familyRole: "Youngest son",
      bodyPart: "Hands",
      keywords: ["stillness", "boundary", "stopping", "restraint"],
    },
  },
  {
    id: "kun",
    name: "Kun",
    chineseName: "坤",
    binaryLines: [0, 0, 0],
    symbol: "☷",
    natureImage: "Earth",
    attributes: {
      direction: "Southwest",
      element: "Earth",
      familyRole: "Mother",
      bodyPart: "Belly",
      keywords: ["receptive", "supporting", "yielding", "holding"],
    },
  },
];

export const trigramsById = new Map(
  trigrams.map((trigram) => [trigram.id, trigram]),
);
