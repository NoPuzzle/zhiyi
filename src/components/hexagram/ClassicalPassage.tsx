type ClassicalPassageProps = {
  label: string;
  text: string | string[];
  compact?: boolean;
};

export function ClassicalPassage({
  label,
  text,
  compact = false,
}: ClassicalPassageProps) {
  return (
    <div>
      <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft/75">
        {label}
      </p>
      <blockquote
        className={`${compact ? "mt-1 text-lg leading-8" : "mt-2 text-xl leading-9"} text-ink`}
      >
        {Array.isArray(text) ? (
          <div className={compact ? "space-y-2" : "space-y-3"}>
            {text.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 18)}`}>{paragraph}</p>
            ))}
          </div>
        ) : (
          text
        )}
      </blockquote>
    </div>
  );
}
