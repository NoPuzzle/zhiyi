import type { CSSProperties } from "react";

export type InkLineSize = "sm" | "md" | "lg";

type InkLineProps = {
  line: number;
  moving?: boolean;
  animated?: boolean;
  delayMs?: number;
  size?: InkLineSize;
  seed?: number;
  transitionFrom?: number;
};

type LineStyle = CSSProperties & {
  "--line-delay"?: string;
};

const sizeClass: Record<InkLineSize, string> = {
  sm: "h-5",
  md: "h-6",
  lg: "h-8",
};

const organicPaths = [
  {
    yang: "M14 12 C42 10.9 72 13.1 146 11.8",
    yinLeft: "M14 12 C30 11.1 46 12.8 64 12",
    yinRight: "M96 12 C114 11.2 130 12.7 146 11.9",
  },
  {
    yang: "M14 12.2 C48 11.1 84 12.7 146 12",
    yinLeft: "M14 12.2 C32 11.6 50 12.4 64 12",
    yinRight: "M96 12 C112 11.4 130 12.5 146 12.1",
  },
  {
    yang: "M14 11.8 C44 12.8 86 10.9 146 12.1",
    yinLeft: "M14 11.9 C31 12.5 47 11.3 64 12.1",
    yinRight: "M96 12.1 C113 12.8 130 11.5 146 12",
  },
];

function isYang(line: number) {
  return line === 1;
}

export function InkLine({
  line,
  moving = false,
  animated = false,
  delayMs = 0,
  size = "md",
  seed = 0,
  transitionFrom,
}: InkLineProps) {
  const path = organicPaths[seed % organicPaths.length];
  const lineColor = moving ? "text-vermilion" : "text-ink";
  const transitioning =
    moving &&
    typeof transitionFrom === "number" &&
    isYang(transitionFrom) !== isYang(line);

  const style: LineStyle = {
    "--line-delay": `${delayMs}ms`,
  };

  const finalClass =
    transitioning && isYang(transitionFrom)
      ? "hex-open-final"
      : transitioning
        ? "hex-connect-final"
        : "";

  const ghostClass =
    transitioning && isYang(transitionFrom)
      ? "hex-yang-ghost"
      : transitioning
        ? "hex-yin-ghost"
        : "";

  return (
    <svg
      className={`${sizeClass[size]} w-full overflow-visible ${lineColor} ${
        animated ? "hex-line-appear" : ""
      }`}
      style={style}
      viewBox="0 0 160 24"
      aria-hidden="true"
      focusable="false"
    >
      {transitioning ? (
        <g className={ghostClass}>
          {isYang(transitionFrom) ? (
            <path
              d={path.yang}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="8.5"
            />
          ) : (
            <>
              <path
                d={path.yinLeft}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="8.5"
              />
              <path
                d={path.yinRight}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="8.5"
              />
            </>
          )}
        </g>
      ) : null}

      <g className={finalClass}>
        {isYang(line) ? (
          <path
            d={path.yang}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="8.5"
          />
        ) : (
          <>
            <path
              className={transitioning ? "hex-open-left" : ""}
              d={path.yinLeft}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="8.5"
            />
            <path
              className={transitioning ? "hex-open-right" : ""}
              d={path.yinRight}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="8.5"
            />
          </>
        )}
      </g>

      <g opacity={moving ? "0.24" : "0.13"}>
        {isYang(line) ? (
          <path
            d={path.yang}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="11"
          />
        ) : (
          <>
            <path
              d={path.yinLeft}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="11"
            />
            <path
              d={path.yinRight}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="11"
            />
          </>
        )}
      </g>
    </svg>
  );
}
