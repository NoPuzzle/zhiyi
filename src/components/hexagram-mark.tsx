type HexagramLine = {
  broken?: boolean;
  changing?: boolean;
};

const placeholderLines: HexagramLine[] = [
  { broken: false },
  { broken: true, changing: true },
  { broken: false },
  { broken: true },
  { broken: true },
  { broken: false },
];

export function HexagramMark({
  lines = placeholderLines,
  label = "占位卦象",
}: {
  lines?: HexagramLine[];
  label?: string;
}) {
  return (
    <svg
      className="h-auto w-full max-w-[220px]"
      viewBox="0 0 168 220"
      role="img"
      aria-label={label}
    >
      <rect
        x="1"
        y="1"
        width="166"
        height="218"
        rx="28"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.09"
      />
      {lines.map((line, index) => {
        const y = 174 - index * 27;
        const fill = line.changing ? "fill-vermilion" : "fill-ink";

        if (line.broken) {
          return (
            <g key={`${index}-${y}`} className={fill}>
              <rect x="26" y={y} width="46" height="10" rx="5" />
              <rect x="96" y={y} width="46" height="10" rx="5" />
            </g>
          );
        }

        return (
          <rect
            key={`${index}-${y}`}
            className={fill}
            x="26"
            y={y}
            width="116"
            height="10"
            rx="5"
          />
        );
      })}
    </svg>
  );
}
