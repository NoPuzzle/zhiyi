import type { Hexagram } from "../../../data/hexagrams";
import { trigramsById } from "../../../data/trigrams";
import { HexagramLines } from "./HexagramLines";

type HexagramCardProps = {
  hexagram: Hexagram;
  movingLineIndexes?: number[];
  animated?: boolean;
};

function trigramName(id: string) {
  return trigramsById.get(id)?.chineseName ?? id;
}

export function HexagramCard({
  hexagram,
  movingLineIndexes = [],
  animated = false,
}: HexagramCardProps) {
  return (
    <article className="rounded-sm border border-mist/70 bg-paper/80 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="ui-copy text-xs text-vermilion">
            第 {hexagram.id} 卦
          </p>
          <h3 className="mt-2 text-4xl font-semibold leading-none text-ink">
            {hexagram.chineseName}
          </h3>
        </div>
        <span className="text-4xl leading-none text-ink-soft" aria-hidden="true">
          {hexagram.unicodeSymbol}
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <HexagramLines
          lines={hexagram.lines}
          movingLineIndexes={movingLineIndexes}
          animated={animated}
          size="sm"
          label={`${hexagram.chineseName}卦`}
        />
      </div>

      <div className="ui-copy mt-6 grid grid-cols-2 gap-3 text-sm text-ink-soft">
        <div>
          <span className="block text-xs uppercase tracking-[0.16em] text-ink-soft/70">
            上卦
          </span>
          <span className="mt-1 block text-ink">
            {trigramName(hexagram.upperTrigramId)}
          </span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-[0.16em] text-ink-soft/70">
            下卦
          </span>
          <span className="mt-1 block text-ink">
            {trigramName(hexagram.lowerTrigramId)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {hexagram.keywords.map((keyword) => (
          <span
            key={keyword}
            className="ui-copy rounded-sm border border-mist/70 px-2.5 py-1 text-xs text-ink-soft"
          >
            {keyword}
          </span>
        ))}
      </div>
    </article>
  );
}
