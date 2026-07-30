import Image from "next/image";
import type { Hexagram } from "../../../data/hexagrams";
import { withBasePath } from "@/lib/base-path";
import { InkLine } from "./InkLine";

type InteractiveHexagramHeroProps = {
  hexagram: Hexagram;
  upperLabel: string;
  lowerLabel: string;
};

function linePosition(hexagram: Hexagram, index: number) {
  const existingPosition = hexagram.lineTexts?.[index]?.position;

  if (existingPosition) {
    return existingPosition;
  }

  const placeLabels = ["初", "二", "三", "四", "五", "上"];
  const lineValue = hexagram.lines[index];

  if (index === 0) {
    return lineValue === 1 ? "初九" : "初六";
  }

  if (index === 5) {
    return lineValue === 1 ? "上九" : "上六";
  }

  return `${lineValue === 1 ? "九" : "六"}${placeLabels[index]}`;
}

export function InteractiveHexagramHero({
  hexagram,
  upperLabel,
  lowerLabel,
}: InteractiveHexagramHeroProps) {
  const repeatedAtmosphere =
    hexagram.upperTrigramId === hexagram.lowerTrigramId;
  const defaultLineIndex = hexagram.id === 1 ? 1 : 0;

  return (
    <section
      className="hexagram-hero relative isolate mt-8 overflow-hidden border-y border-mist/55"
      aria-labelledby="hexagram-title"
    >
      <div
        className="hexagram-atmosphere absolute inset-0 -z-10 overflow-hidden"
        data-repeated={repeatedAtmosphere}
      >
        <Image
          src={withBasePath(
            `/atmospheres/${hexagram.lowerTrigramId}.jpg`,
          )}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hexagram-atmosphere-lower object-cover"
          aria-hidden="true"
        />
        {!repeatedAtmosphere ? (
          <Image
            src={withBasePath(
              `/atmospheres/${hexagram.upperTrigramId}.jpg`,
            )}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hexagram-atmosphere-upper object-cover"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="hexagram-selector mx-auto grid max-w-5xl items-center gap-6 px-1 py-8 md:min-h-[43rem] md:grid-cols-[minmax(0,1fr)_minmax(20rem,0.82fr)] md:gap-10 md:px-8 md:py-12">
        <div className="text-center">
          <p className="ui-copy text-xs tracking-[0.2em] text-ink-soft">
            第 {hexagram.id} 卦
          </p>
          <div className="mt-3 flex items-baseline justify-center gap-3">
            <h1
              id="hexagram-title"
              className="text-6xl font-semibold leading-none text-ink sm:text-7xl"
            >
              {hexagram.chineseName}
            </h1>
            <span className="text-4xl text-ink-soft/80" aria-hidden="true">
              {hexagram.unicodeSymbol}
            </span>
          </div>
          <p className="ui-copy mt-3 text-xs uppercase tracking-[0.24em] text-ink-soft">
            {hexagram.name}
          </p>

          <div
            className="interactive-hexagram mx-auto mt-5 flex w-64 flex-col-reverse"
            role="radiogroup"
            aria-label="选择一爻观察"
          >
            {hexagram.lines.map((line, index) => {
              const position = linePosition(hexagram, index);
              const readingId = `hexagram-${hexagram.id}-line-${index}-reading`;

              return (
                <label
                  key={`${index}-${line}`}
                  className="hexagram-touch-line group relative flex min-h-11 w-full cursor-pointer items-center justify-center px-5 outline-none"
                >
                  <input
                    className="hexagram-line-input sr-only"
                    type="radio"
                    name={`hexagram-${hexagram.id}-line`}
                    value={index}
                    data-line-index={index}
                    defaultChecked={index === defaultLineIndex}
                    aria-label={`查看${position}`}
                    aria-controls={readingId}
                  />
                  <span
                    className="hexagram-line-marker absolute left-0 flex h-6 min-w-6 items-center justify-center text-[0.66rem] text-vermilion"
                    aria-hidden="true"
                  >
                    {position}
                  </span>
                  <InkLine
                    line={line}
                    animated
                    delayMs={index * 110}
                    size="lg"
                    seed={index}
                  />
                </label>
              );
            })}
          </div>

          <p className="mt-4 text-base leading-8 text-ink-soft">
            {hexagram.imageText ?? hexagram.imageObservation}
          </p>
          <p className="ui-copy mt-3 text-xs tracking-[0.14em] text-ink-soft/80">
            触碰一爻，观其位
          </p>
        </div>

        <div className="hexagram-reading-stack mx-4 text-left md:mx-0">
          {hexagram.lines.map((_, index) => {
            const line = hexagram.lineTexts?.[index];
            const position = linePosition(hexagram, index);

            return (
              <article
                key={position}
                id={`hexagram-${hexagram.id}-line-${index}-reading`}
                className="hexagram-line-reading border-y border-mist/65 bg-paper/72 px-1 py-6 backdrop-blur-[2px] md:px-7 md:py-7"
                data-line-index={index}
              >
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-semibold text-vermilion">
                    {position}
                  </p>
                  <span className="ui-copy text-xs tracking-[0.16em] text-ink-soft">
                    {index + 1} / 6
                  </span>
                </div>
                {line?.original ? (
                  <p className="mt-5 text-xl leading-9 text-ink">
                    {line.original}
                  </p>
                ) : null}
                <p className="mt-3 text-base leading-8 text-ink-soft">
                  {line?.plain}
                </p>
                <p className="mt-5 border-l-2 border-vermilion/55 pl-4 text-base leading-8 text-vermilion">
                  {line?.reflection}
                </p>

                <dl className="ui-copy mt-7 grid grid-cols-2 gap-4 border-t border-mist/55 pt-5 text-sm">
                  <div>
                    <dt className="text-xs tracking-[0.14em] text-ink-soft/75">
                      上卦
                    </dt>
                    <dd className="mt-1 text-ink">{upperLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-[0.14em] text-ink-soft/75">
                      下卦
                    </dt>
                    <dd className="mt-1 text-ink">{lowerLabel}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
