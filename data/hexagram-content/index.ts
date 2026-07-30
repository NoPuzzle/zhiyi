import { hexagramContent04To20 } from "./hexagrams-04-20";
import { hexagramContent21To42 } from "./hexagrams-21-42";
import { hexagramContent43To64 } from "./hexagrams-43-64";
import type { HexagramContentPatch } from "./types";

export const hexagramContentPatches: Record<number, HexagramContentPatch> = {
  ...hexagramContent04To20,
  ...hexagramContent21To42,
  ...hexagramContent43To64,
};

export type { HexagramContentPatch, HexagramLineContent } from "./types";
