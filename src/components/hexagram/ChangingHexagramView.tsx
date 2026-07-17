import {
  getChangedLines,
  type HexagramLines as HexagramLineTuple,
  type MovingLineIndex,
} from "../../../lib/hexagram";
import { HexagramLines } from "./HexagramLines";
import type { InkLineSize } from "./InkLine";

type ChangingHexagramViewProps = {
  lines: HexagramLineTuple;
  movingLineIndexes?: number[];
  size?: InkLineSize;
  originalLabel?: string;
  changedLabel?: string;
};

function isMovingLineIndex(index: number): index is MovingLineIndex {
  return Number.isInteger(index) && index >= 0 && index <= 5;
}

export function ChangingHexagramView({
  lines,
  movingLineIndexes = [],
  size = "sm",
  originalLabel = "本卦",
  changedLabel = "变卦",
}: ChangingHexagramViewProps) {
  const normalizedMovingLineIndexes =
    movingLineIndexes.filter(isMovingLineIndex);
  const changedLines = getChangedLines(lines, normalizedMovingLineIndexes);

  return (
    <div className="rounded-sm border border-mist/70 bg-paper/80 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 flex-col items-center">
          <p className="ui-copy mb-4 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
            {originalLabel}
          </p>
          <HexagramLines
            lines={lines}
            movingLineIndexes={normalizedMovingLineIndexes}
            animated
            size={size}
            label={`${originalLabel}卦象`}
          />
        </div>

        <div
          className="ui-copy flex h-8 w-8 items-center justify-center rounded-full border border-mist text-sm text-vermilion"
          aria-hidden="true"
        >
          →
        </div>

        <div className="flex min-w-0 flex-col items-center">
          <p className="ui-copy mb-4 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
            {changedLabel}
          </p>
          <HexagramLines
            lines={changedLines}
            movingLineIndexes={normalizedMovingLineIndexes}
            animated
            size={size}
            transitionFromLines={lines}
            label={`${changedLabel}卦象`}
          />
        </div>
      </div>
    </div>
  );
}
