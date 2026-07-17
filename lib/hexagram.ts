import { hexagrams, type Hexagram } from "../data/hexagrams";
import { trigrams, type Trigram } from "../data/trigrams";

export type TrigramLines = [number, number, number];
export type HexagramLines = [number, number, number, number, number, number];
export type MovingLineIndex = 0 | 1 | 2 | 3 | 4 | 5;

const hexagramsByLineKey = new Map(
  hexagrams.map((hexagram) => [lineKey(hexagram.lines), hexagram]),
);

const trigramsByLineKey = new Map(
  trigrams.map((trigram) => [lineKey(trigram.binaryLines), trigram]),
);

function lineKey(lines: readonly number[]) {
  return lines.join("");
}

function isBinaryLine(line: number) {
  return line === 0 || line === 1;
}

function assertHexagramLines(lines: HexagramLines) {
  if (lines.length !== 6 || !lines.every(isBinaryLine)) {
    throw new Error("Hexagram lines must contain exactly six 0/1 values.");
  }
}

function assertMovingLineIndexes(indexes: MovingLineIndex[]) {
  const valid = indexes.every(
    (index) => Number.isInteger(index) && index >= 0 && index <= 5,
  );

  if (!valid) {
    throw new Error("Moving line indexes must be integers from 0 to 5.");
  }
}

function invertLine(line: number) {
  return line === 1 ? 0 : 1;
}

/**
 * Lines are stored from bottom to top throughout Zhiyi.
 *
 * Example:
 * - 乾 is [1, 1, 1, 1, 1, 1]
 * - 坤 is [0, 0, 0, 0, 0, 0]
 * - 屯 is [1, 0, 0, 0, 1, 0]
 */
export function getHexagramByLines(lines: HexagramLines): Hexagram | undefined {
  assertHexagramLines(lines);

  return hexagramsByLineKey.get(lineKey(lines));
}

/**
 * Applies moving-line changes.
 *
 * Moving line convention:
 * - old yang changes from yang to yin: 1 -> 0
 * - old yin changes from yin to yang: 0 -> 1
 *
 * Expected examples:
 * - getChangedLines([1, 1, 1, 1, 1, 1], [0]) returns [0, 1, 1, 1, 1, 1]
 * - getChangedLines([0, 0, 0, 0, 0, 0], [5]) returns [0, 0, 0, 0, 0, 1]
 */
export function getChangedLines(
  lines: HexagramLines,
  movingLineIndexes: MovingLineIndex[],
): HexagramLines {
  assertHexagramLines(lines);
  assertMovingLineIndexes(movingLineIndexes);

  const movingIndexes = new Set(movingLineIndexes);

  return lines.map((line, index) =>
    movingIndexes.has(index as MovingLineIndex) ? invertLine(line) : line,
  ) as HexagramLines;
}

/**
 * Returns the changed hexagram after applying moving-line indexes.
 *
 * Expected example:
 * - getChangedHexagram([1, 1, 1, 1, 1, 1], [0]) returns hexagram 44, 姤.
 */
export function getChangedHexagram(
  lines: HexagramLines,
  movingLineIndexes: MovingLineIndex[],
): Hexagram | undefined {
  return getHexagramByLines(getChangedLines(lines, movingLineIndexes));
}

/**
 * 错卦: invert every line.
 *
 * Expected example:
 * - invertHexagram([1, 1, 1, 1, 1, 1]) returns [0, 0, 0, 0, 0, 0].
 */
export function invertHexagram(lines: HexagramLines): HexagramLines {
  assertHexagramLines(lines);

  return lines.map(invertLine) as HexagramLines;
}

/**
 * 综卦: reverse the hexagram by turning the line order upside down.
 *
 * Expected example:
 * - reverseHexagram([1, 0, 0, 0, 1, 0]) returns [0, 1, 0, 0, 0, 1].
 */
export function reverseHexagram(lines: HexagramLines): HexagramLines {
  assertHexagramLines(lines);

  return [...lines].reverse() as HexagramLines;
}

/**
 * 互卦: use the inner lines to form the nuclear hexagram.
 *
 * Bottom-to-top convention:
 * - lower mutual trigram uses positions 2, 3, 4: indexes [1, 2, 3]
 * - upper mutual trigram uses positions 3, 4, 5: indexes [2, 3, 4]
 *
 * Expected example:
 * - getMutualHexagram([1, 0, 0, 0, 1, 0]) returns [0, 0, 0, 0, 0, 1].
 */
export function getMutualHexagram(lines: HexagramLines): HexagramLines {
  assertHexagramLines(lines);

  return [lines[1], lines[2], lines[3], lines[2], lines[3], lines[4]];
}

/**
 * Splits a six-line hexagram into lower and upper trigrams.
 *
 * Expected example:
 * - getTrigramsFromHexagram([1, 1, 1, 1, 1, 1]) returns qian / qian.
 */
export function getTrigramsFromHexagram(lines: HexagramLines): {
  lower: Trigram;
  upper: Trigram;
} {
  assertHexagramLines(lines);

  const lowerLines = lines.slice(0, 3) as TrigramLines;
  const upperLines = lines.slice(3, 6) as TrigramLines;
  const lower = trigramsByLineKey.get(lineKey(lowerLines));
  const upper = trigramsByLineKey.get(lineKey(upperLines));

  if (!lower || !upper) {
    throw new Error("Unable to derive trigrams from hexagram lines.");
  }

  return { lower, upper };
}
