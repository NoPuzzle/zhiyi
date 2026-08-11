type CompactHexagramProps = {
  label: string;
  lines: number[];
};

export function CompactHexagram({ label, lines }: CompactHexagramProps) {
  return (
    <svg
      viewBox="0 0 96 72"
      className="h-24 w-28 text-ink"
      role="img"
      aria-label={label}
    >
      {lines.slice(0, 6).map((line, index) => {
        const y = 66 - index * 12;
        const curve = `C28 ${y - 0.35} 68 ${y + 0.35}`;

        return line === 1 ? (
          <path
            key={index}
            d={`M4 ${y} ${curve} 92 ${y}`}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="6"
          />
        ) : (
          <g key={index}>
            <path
              d={`M4 ${y} C16 ${y - 0.3} 28 ${y + 0.3} 40 ${y}`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d={`M56 ${y} C68 ${y - 0.3} 80 ${y + 0.3} 92 ${y}`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="6"
            />
          </g>
        );
      })}
    </svg>
  );
}
