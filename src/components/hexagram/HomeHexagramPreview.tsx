"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { InkLine } from "./InkLine";

type HomeLineText = {
  position: string;
  plain?: string;
};

type HomeHexagramPreviewProps = {
  lines: readonly [number, number, number, number, number, number];
  lineTexts: readonly HomeLineText[];
  hexagramLabel?: string;
  movingLineIndex?: number;
};

const visualLineIndexes = [5, 4, 3, 2, 1, 0] as const;

function fallbackPosition(line: number, index: number) {
  const placeLabels = ["初", "二", "三", "四", "五", "上"];

  if (index === 0) {
    return line === 1 ? "初九" : "初六";
  }

  if (index === 5) {
    return line === 1 ? "上九" : "上六";
  }

  return `${line === 1 ? "九" : "六"}${placeLabels[index]}`;
}

export function HomeHexagramPreview({
  lines,
  lineTexts,
  hexagramLabel = "首页卦象",
  movingLineIndex = 1,
}: HomeHexagramPreviewProps) {
  const [selectedLineIndex, setSelectedLineIndex] = useState(movingLineIndex);
  const lineInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const radioGroupName = useId();
  const readingId = `${radioGroupName}-reading`;
  const selectedLine = lineTexts[selectedLineIndex];
  const selectedPosition =
    selectedLine?.position ??
    fallbackPosition(lines[selectedLineIndex], selectedLineIndex);
  const selectedPlain = selectedLine?.plain ?? "观察这一爻在全卦中的位置与变化。";

  const moveWithArrowKey = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const direction =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;

    if (direction === 0) {
      return;
    }

    event.preventDefault();
    const currentVisualIndex = visualLineIndexes.indexOf(
      index as (typeof visualLineIndexes)[number],
    );
    const nextVisualIndex =
      (currentVisualIndex + direction + visualLineIndexes.length) %
      visualLineIndexes.length;
    const nextLineIndex = visualLineIndexes[nextVisualIndex];

    setSelectedLineIndex(nextLineIndex);
    lineInputRefs.current[nextLineIndex]?.focus();
  };

  return (
    <div className="flex w-full flex-col items-center">
      <fieldset
        className="min-w-0 border-0 p-0"
        role="radiogroup"
        aria-label={`选择${hexagramLabel}一爻观察`}
        aria-orientation="vertical"
      >
        <legend className="sr-only">从上爻到初爻选择一爻</legend>

        <div className="flex w-52 flex-col gap-1.5 text-ink">
          {visualLineIndexes.map((index) => {
            const position =
              lineTexts[index]?.position ?? fallbackPosition(lines[index], index);

            return (
              <label
                key={`${index}-${lines[index]}`}
                className="hexagram-touch-line group relative flex min-h-11 w-full cursor-pointer touch-pan-y items-center justify-center px-2 outline-none"
              >
                <input
                  className="hexagram-line-input sr-only"
                  type="radio"
                  name={radioGroupName}
                  value={index}
                  data-line-index={index}
                  checked={selectedLineIndex === index}
                  onChange={() => setSelectedLineIndex(index)}
                  onKeyDown={(event) => moveWithArrowKey(event, index)}
                  ref={(input) => {
                    lineInputRefs.current[index] = input;
                  }}
                  aria-label={`查看${position}`}
                  aria-controls={readingId}
                />
                <InkLine
                  line={lines[index]}
                  moving={index === movingLineIndex}
                  animated
                  delayMs={index * 110}
                  size="lg"
                  seed={index}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <div
        id={readingId}
        className="mt-5 min-h-24 w-full max-w-md border-t border-mist/65 pt-4"
        role="region"
        aria-label={`${selectedPosition}观察`}
      >
        <div key={selectedLineIndex} className="home-line-reading">
          <p className="text-lg font-semibold text-ink">{selectedPosition}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {selectedPlain}
          </p>
        </div>
      </div>

      <p className="ui-copy mt-2 text-[0.68rem] tracking-[0.12em] text-ink-soft/75">
        轻触逐爻 · 朱砂仅标示示例动爻
      </p>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        已选{selectedPosition}，第 {selectedLineIndex + 1} 爻，共六爻
      </p>
    </div>
  );
}
