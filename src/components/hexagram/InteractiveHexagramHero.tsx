import type { SixClassicalLineTexts } from "../../../data/classical-text";
import type { SixSmallImageTexts } from "../../../data/classical-wings";
import type { Hexagram } from "../../../data/hexagrams";
import { FolioWash } from "./FolioWash";
import { HexagramAtmosphere } from "./HexagramAtmosphere";
import { InkLine } from "./InkLine";

type InteractiveHexagramHeroProps = {
  hexagram: Hexagram;
  classicalLineTexts: SixClassicalLineTexts;
  smallImageTexts: SixSmallImageTexts;
  upperLabel: string;
  lowerLabel: string;
};

const upperLineIndexes = [5, 4, 3] as const;
const lowerLineIndexes = [2, 1, 0] as const;
const visualLineIndexes = [...upperLineIndexes, ...lowerLineIndexes] as const;

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
  classicalLineTexts,
  smallImageTexts,
  upperLabel,
  lowerLabel,
}: InteractiveHexagramHeroProps) {
  const defaultLineIndex = hexagram.id === 1 ? 1 : 0;

  const renderLineControl = (index: (typeof visualLineIndexes)[number]) => {
    const line = hexagram.lines[index];
    const position =
      classicalLineTexts[index]?.position ?? linePosition(hexagram, index);
    const readingId = `hexagram-${hexagram.id}-line-${index}-reading`;

    return (
      <label
        key={`${index}-${line}`}
        className="hexagram-touch-line group relative flex min-h-11 w-full cursor-pointer touch-pan-y items-center justify-center px-2 outline-none"
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
        <InkLine
          line={line}
          animated
          delayMs={(5 - index) * 90}
          size="lg"
          seed={index}
        />
      </label>
    );
  };

  return (
    <section
      className="hexagram-hero relative isolate overflow-hidden border-y border-mist/55"
      aria-labelledby="hexagram-title"
    >
      <HexagramAtmosphere
        upperTrigramId={hexagram.upperTrigramId}
        lowerTrigramId={hexagram.lowerTrigramId}
        variant="folio"
      />

      <div className="hexagram-selector mx-auto max-w-3xl px-5 py-5 text-center sm:px-8 sm:py-14">
        <header className="hexagram-folio-title">
          <p className="ui-copy text-xs tracking-[0.24em] text-ink-soft">
            第 {hexagram.id} 卦
          </p>
          <h1
            id="hexagram-title"
            className="mt-3 text-5xl font-semibold leading-none text-ink sm:mt-4 sm:text-7xl"
          >
            {hexagram.chineseName}
          </h1>
          <p className="ui-copy mt-3 text-xs uppercase tracking-[0.28em] text-ink-soft sm:mt-4">
            {hexagram.name}
          </p>
        </header>

        <fieldset
          className="hexagram-folio-reader mt-6 min-w-0 border-0 p-0 sm:mt-12"
          role="radiogroup"
          aria-orientation="vertical"
          aria-label="选择一爻观察"
        >
          <legend className="sr-only">选择一爻阅读</legend>

          <div
            className="hexagram-line-bank hexagram-line-bank-upper"
            aria-label={`${upperLabel}三爻`}
          >
            {upperLineIndexes.map(renderLineControl)}
          </div>

          <div className="hexagram-folio-stage">
            <FolioWash />
            <div className="hexagram-reading-stack relative z-10 text-left">
              {visualLineIndexes.map((index) => {
                const classicalLine = classicalLineTexts[index];
                const smallImage = smallImageTexts[index];
                const productObservation =
                  hexagram.lineTexts?.[index]?.plain ?? hexagram.coreMeaning;
                const position =
                  classicalLine?.position ?? linePosition(hexagram, index);
                const readingId = `hexagram-${hexagram.id}-line-${index}-reading`;
                const headingId = `${readingId}-title`;

                return (
                  <article
                    key={position}
                    id={readingId}
                    className="hexagram-line-reading"
                    data-line-index={index}
                    data-default={index === defaultLineIndex ? "true" : undefined}
                    role="region"
                    aria-labelledby={headingId}
                  >
                    <p
                      className="sr-only"
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      已展开{position}，第 {index + 1} 爻，共六爻
                    </p>

                    <div className="hexagram-folio-meta">
                      <h2
                        id={headingId}
                        className="text-2xl font-semibold text-vermilion sm:text-3xl"
                      >
                        {position}
                      </h2>
                      <p className="ui-copy mt-2 text-[0.68rem] tracking-[0.16em] text-ink-soft/75">
                        {String(index + 1).padStart(2, "0")} / 06
                      </p>
                    </div>

                    <div className="hexagram-folio-copy">
                      <section>
                        <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft/75">
                          经 · 爻辞
                        </p>
                        <p className="mt-2 text-base leading-7 text-ink sm:text-xl sm:leading-9">
                          {classicalLine?.original}
                        </p>
                      </section>

                      <section className="mt-2 border-t border-mist/75 pt-2">
                        <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft/75">
                          传 · 小象
                        </p>
                        <p className="mt-1 text-base leading-7 text-ink">
                          {smallImage.original}
                        </p>
                      </section>

                      <section className="mt-1 border-t border-mist/75 pt-1">
                        <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft/75">
                          位置观察 · 产品原创
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
                          {productObservation}
                        </p>
                      </section>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div
            className="hexagram-line-bank hexagram-line-bank-lower"
            aria-label={`${lowerLabel}三爻`}
          >
            {lowerLineIndexes.map(renderLineControl)}
          </div>
        </fieldset>

        <p className="ui-copy mx-auto mt-9 max-w-sm border-t border-mist/65 pt-4 text-xs tracking-[0.18em] text-ink-soft/80">
          点触一爻，逐爻而观
        </p>
      </div>
    </section>
  );
}
