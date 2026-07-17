import { InkLine, type InkLineSize } from "./InkLine";

type HexagramLinesProps = {
  lines: number[];
  movingLineIndexes?: number[];
  animated?: boolean;
  size?: InkLineSize;
  transitionFromLines?: number[];
  label?: string;
  className?: string;
};

const sizeClass: Record<InkLineSize, string> = {
  sm: "w-24 gap-1.5",
  md: "w-36 gap-2",
  lg: "w-52 gap-3",
};

const delayStep: Record<InkLineSize, number> = {
  sm: 95,
  md: 115,
  lg: 135,
};

function displayLines(lines: number[]) {
  return lines.slice(0, 6).concat(Array(Math.max(0, 6 - lines.length)).fill(0));
}

export function HexagramLines({
  lines,
  movingLineIndexes = [],
  animated = false,
  size = "md",
  transitionFromLines,
  label = "卦象",
  className = "",
}: HexagramLinesProps) {
  const renderedLines = displayLines(lines);
  const movingIndexes = new Set(movingLineIndexes);

  return (
    <div
      className={`flex flex-col-reverse ${sizeClass[size]} ${className}`}
      role="img"
      aria-label={label}
    >
      {renderedLines.map((line, index) => (
        <InkLine
          key={`${index}-${line}-${transitionFromLines?.[index] ?? "none"}`}
          line={line}
          moving={movingIndexes.has(index)}
          animated={animated}
          delayMs={index * delayStep[size]}
          size={size}
          seed={index}
          transitionFrom={transitionFromLines?.[index]}
        />
      ))}
    </div>
  );
}
