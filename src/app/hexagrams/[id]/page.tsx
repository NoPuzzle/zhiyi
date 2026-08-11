import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassicalPassage } from "@/components/hexagram/ClassicalPassage";
import { HexagramLines } from "@/components/hexagram/HexagramLines";
import { InteractiveHexagramHero } from "@/components/hexagram/InteractiveHexagramHero";
import {
  classicalSource,
  getClassicalText,
  type HexagramClassicalText,
} from "../../../../data/classical-text";
import {
  classicalWingsSource,
  getHexagramWings,
} from "../../../../data/classical-wings";
import { trigramCopy } from "../../../../data/trigram-copy";
import { hexagrams, hexagramsById, type Hexagram } from "../../../../data/hexagrams";
import { trigramsById, type Trigram } from "../../../../data/trigrams";
import {
  authoredReviewLabel,
  classicalReviewLabel,
  classicalRevisionLabel,
} from "../../../../lib/content-provenance";
import {
  getHexagramByLines,
  getMutualHexagram,
  invertHexagram,
  reverseHexagram,
  type HexagramLines as HexagramLineTuple,
} from "../../../../lib/hexagram";

type DetailParams = {
  params: Promise<{ id: string }>;
};

const fallbackText = {
  judgment: "当前可先观察卦名、上下卦与关键词。",
  line: "可先观察此爻所在的位置、阴阳状态与上下关系。",
  image: "可先从上下卦、阴阳分布和关键词入手，观察这个卦呈现出的结构。",
  question: "这个卦让你最先注意到处境中的哪一种变化？",
  action: "写下一件能让问题更清楚的小事，并在今天完成。",
};

const linePlaces = ["初", "二", "三", "四", "五", "上"];

const detailNavigation = [
  { id: "reading-image", label: "象" },
  { id: "reading-text", label: "辞" },
  { id: "reading-principle", label: "理" },
  { id: "reading-application", label: "用" },
  { id: "reading-reflection", label: "问" },
  { id: "reading-action", label: "行" },
  { id: "transmitted-readings", label: "传" },
  { id: "line-readings", label: "六爻" },
  { id: "related-hexagrams", label: "关系" },
] as const;

function getHexagram(id: string) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId)) {
    return undefined;
  }

  return hexagramsById.get(parsedId);
}

function trigramLabel(trigram?: Trigram) {
  if (!trigram) {
    return "未定";
  }

  return `${trigram.chineseName} · ${trigramCopy[trigram.id].imageZh}`;
}

function linePosition(hexagram: Hexagram, index: number) {
  const existingPosition = hexagram.lineTexts?.[index]?.position;

  if (existingPosition) {
    return existingPosition;
  }

  if (index === 0) {
    return hexagram.lines[index] === 1 ? "初九" : "初六";
  }

  if (index === 5) {
    return hexagram.lines[index] === 1 ? "上九" : "上六";
  }

  return `${hexagram.lines[index] === 1 ? "九" : "六"}${linePlaces[index]}`;
}

function getRelatedHexagram(
  lines: HexagramLineTuple,
  relation: "invert" | "reverse" | "mutual",
) {
  const relatedLines =
    relation === "invert"
      ? invertHexagram(lines)
      : relation === "reverse"
        ? reverseHexagram(lines)
        : getMutualHexagram(lines);

  return {
    lines: relatedLines,
    hexagram: getHexagramByLines(relatedLines),
  };
}

function buildSections(
  hexagram: Hexagram,
  classical: HexagramClassicalText,
  upper?: Trigram,
  lower?: Trigram,
) {
  return [
    {
      id: "reading-image",
      title: "象",
      authoredLabel: "知易观察 · 产品原创",
      authoredBody:
        hexagram.imageObservation ??
        `上卦为${trigramLabel(upper)}，下卦为${trigramLabel(lower)}。${fallbackText.image}`,
      classical: {
        label: "传 · 大象",
        text: classical.imageText,
      },
    },
    {
      id: "reading-text",
      title: "辞",
      authoredLabel: "知易解读 · 产品原创",
      authoredBody: hexagram.judgmentPlain ?? fallbackText.judgment,
      classical: {
        label: "经 · 卦辞",
        text: classical.judgmentOriginal,
      },
    },
    {
      id: "reading-principle",
      title: "理",
      authoredLabel: "变化原则 · 产品原创",
      authoredBody:
        hexagram.coreMeaning ??
        `可从 ${hexagram.keywords.join("、")} 入手，观察时机、位置与关系如何相互影响。这个部分只提供反思线索，不作为确定性判断。`,
    },
    {
      id: "reading-application",
      title: "用",
      authoredLabel: "情境应用 · 产品原创",
      authoredBody:
        hexagram.application ??
        "应用时，先把卦象当作整理问题的结构：看哪里需要推进，哪里需要等待，哪里需要重新划清边界。",
    },
    {
      id: "reading-reflection",
      title: "问",
      authoredLabel: "选一问 · 产品原创",
      authoredBody:
        hexagram.reflectionQuestions?.length
          ? hexagram.reflectionQuestions
          : [fallbackText.question],
    },
    {
      id: "reading-action",
      title: "行",
      authoredLabel: "今日小行动 · 产品原创",
      authoredBody: hexagram.smallAction ?? fallbackText.action,
    },
  ];
}

function RelatedCard({
  currentHexagramId,
  label,
  description,
  related,
}: {
  currentHexagramId: number;
  label: string;
  description: string;
  related: {
    lines: HexagramLineTuple;
    hexagram?: Hexagram;
  };
}) {
  const pointsToCurrentHexagram = related.hexagram?.id === currentHexagramId;
  const content = (
    <article className="h-full rounded-sm border border-mist/70 bg-paper/75 p-4 transition hover:border-ink">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ui-copy text-xs text-vermilion">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            {related.hexagram?.chineseName ?? "未收录"}
          </h3>
        </div>
        <span className="text-3xl text-ink-soft" aria-hidden="true">
          {related.hexagram?.unicodeSymbol}
        </span>
      </div>
      <div className="mt-4 flex justify-center">
        <HexagramLines lines={related.lines} size="sm" />
      </div>
      <p className="mt-4 text-sm leading-6 text-ink-soft">{description}</p>
      {related.hexagram ? (
        <div className="ui-copy mt-4 flex flex-wrap gap-2">
          {related.hexagram.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="rounded-sm border border-mist/70 px-2 py-1 text-xs text-ink-soft"
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : null}
      {pointsToCurrentHexagram ? (
        <p className="ui-copy mt-4 border-t border-mist/55 pt-3 text-xs text-vermilion">
          此关系仍回到本卦
        </p>
      ) : null}
    </article>
  );

  if (!related.hexagram || pointsToCurrentHexagram) {
    return content;
  }

  return (
    <Link
      href={`/hexagrams/${related.hexagram.id}`}
      aria-label={`查看${label}：第 ${related.hexagram.id} 卦 ${related.hexagram.chineseName}`}
    >
      {content}
    </Link>
  );
}

function SequenceCard({
  direction,
  hexagram,
}: {
  direction: "previous" | "next";
  hexagram: Hexagram;
}) {
  const label = direction === "previous" ? "上一卦" : "下一卦";

  return (
    <Link
      href={`/hexagrams/${hexagram.id}`}
      rel={direction === "previous" ? "prev" : "next"}
      aria-label={`${label}：第 ${hexagram.id} 卦 ${hexagram.chineseName}`}
      className="group flex min-h-28 items-center justify-between gap-4 rounded-sm border border-mist/70 bg-paper/75 p-5 transition hover:border-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion"
    >
      {direction === "previous" ? (
        <span
          className="text-3xl text-ink-soft transition group-hover:text-ink"
          aria-hidden="true"
        >
          ←
        </span>
      ) : null}
      <div className={direction === "next" ? "text-right" : ""}>
        <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft">
          {label} · 第 {hexagram.id} 卦
        </p>
        <p className="mt-2 text-2xl font-semibold text-ink">
          {hexagram.chineseName}
        </p>
        <p className="ui-copy mt-1 text-xs uppercase tracking-[0.16em] text-ink-soft/75">
          {hexagram.name}
        </p>
      </div>
      {direction === "next" ? (
        <span
          className="text-3xl text-ink-soft transition group-hover:text-ink"
          aria-hidden="true"
        >
          →
        </span>
      ) : null}
    </Link>
  );
}

export function generateStaticParams() {
  return hexagrams.map((hexagram) => ({
    id: hexagram.id.toString(),
  }));
}

export async function generateMetadata({ params }: DetailParams): Promise<Metadata> {
  const { id } = await params;
  const hexagram = getHexagram(id);

  if (!hexagram) {
    return {
      title: "卦象未找到 / Zhiyi",
    };
  }

  return {
    title: `${hexagram.chineseName} / 第 ${hexagram.id} 卦 / Zhiyi`,
    description: hexagram.coreMeaning ?? hexagram.keywords.join("、"),
  };
}

export default async function HexagramDetailPage({ params }: DetailParams) {
  const { id } = await params;
  const hexagram = getHexagram(id);

  if (!hexagram) {
    notFound();
  }

  const upper = trigramsById.get(hexagram.upperTrigramId);
  const lower = trigramsById.get(hexagram.lowerTrigramId);
  const classical = getClassicalText(hexagram.id);
  const wings = getHexagramWings(hexagram.id);
  const sections = buildSections(hexagram, classical, upper, lower);
  const inverted = getRelatedHexagram(hexagram.lines, "invert");
  const reversed = getRelatedHexagram(hexagram.lines, "reverse");
  const mutual = getRelatedHexagram(hexagram.lines, "mutual");
  const previousHexagram = hexagramsById.get(hexagram.id - 1);
  const nextHexagram = hexagramsById.get(hexagram.id + 1);

  return (
    <main className="mx-auto w-full max-w-6xl pb-16">
      <div className="px-5 sm:px-8">
        <Link
          href="/hexagrams"
          className="sr-only ui-copy text-sm text-ink-soft transition hover:text-ink focus:not-sr-only focus:absolute focus:z-30 focus:bg-paper focus:p-3"
        >
          返回观象
        </Link>
      </div>

      <InteractiveHexagramHero
        hexagram={hexagram}
        classicalLineTexts={classical.lineTexts}
        smallImageTexts={wings.smallImageTexts}
        upperLabel={trigramLabel(upper)}
        lowerLabel={trigramLabel(lower)}
      />

      <nav
        aria-label="本卦页内导览"
        className="mx-5 mt-8 overflow-hidden border-y border-mist/65 py-4 sm:mx-8"
      >
        <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
          本页导览
        </p>
        <ol className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
          {detailNavigation.map((item) => (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                className="ui-copy flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-mist/70 bg-paper/70 px-3 text-sm text-ink-soft transition hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section className="mx-5 mt-12 grid gap-8 sm:mx-8 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-14">
        <aside>
          <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
            观卦六步
          </p>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            从所见之象出发，经由文字与原则，回到一个可以实践的动作。
          </p>
          <div className="ui-copy mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs text-ink-soft">
            {hexagram.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
          <dl className="ui-copy mt-6 space-y-3 border-t border-mist/65 pt-5 text-xs leading-5">
            <div>
              <dt className="text-ink-soft/70">产品原创</dt>
              <dd className="mt-1 text-ink">
                {authoredReviewLabel(hexagram.authoredReview)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-soft/70">经典原文</dt>
              <dd className="mt-1 text-ink">
                {classicalReviewLabel(classical)}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="divide-y divide-mist/65 border-y border-mist/65">
          {sections.map((section) => (
            <section
              key={section.title}
              id={section.id}
              className="scroll-mt-8 grid gap-3 py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-7"
            >
              <h2 className="text-3xl font-semibold text-ink">
                {section.title}
              </h2>
              <div className="max-w-3xl">
                {section.classical ? (
                  <ClassicalPassage
                    label={section.classical.label}
                    text={section.classical.text}
                  />
                ) : null}
                <div className={section.classical ? "mt-5" : ""}>
                  <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft/75">
                    {section.authoredLabel}
                  </p>
                  {Array.isArray(section.authoredBody) ? (
                    <ol className="mt-3 space-y-3 text-ink-soft">
                      {section.authoredBody.map((question, index) => (
                        <li
                          key={question}
                          className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 leading-8"
                        >
                          <span
                            className="ui-copy text-xs text-vermilion"
                            aria-hidden="true"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2 leading-8 text-ink-soft">
                      {section.authoredBody}
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section
        id="transmitted-readings"
        className="mx-5 mt-10 scroll-mt-8 border-y border-mist/65 py-8 sm:mx-8"
      >
        <div className="grid gap-7 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
              经传对读
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">彖传与文言</h2>
          </div>
          <div className="max-w-3xl">
            <ClassicalPassage label="传 · 彖" text={wings.tuanParagraphs} />
            {wings.wenyanParagraphs ? (
              <details className="group mt-7 border-t border-mist/65 pt-6">
                <summary className="ui-copy flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion">
                  <span>传 · 文言（{wings.wenyanParagraphs.length} 段）</span>
                  <span
                    className="text-vermilion transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    ＋
                  </span>
                </summary>
                <blockquote className="mt-5 space-y-4 text-lg leading-9 text-ink">
                  {wings.wenyanParagraphs.map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 18)}`}>{paragraph}</p>
                  ))}
                </blockquote>
              </details>
            ) : null}
            <p className="mt-7 text-sm leading-7 text-ink-soft">
              彖、象、文言与系辞等传统上合称“十翼”。本页只呈现与本卦直接对应的传文；其余各篇可在
              <Link
                href="/classics"
                className="mx-1 text-vermilion underline decoration-vermilion/35 underline-offset-4"
              >
                经传目录
              </Link>
              继续阅读。
            </p>
          </div>
        </div>
      </section>

      <section
        id="source-notes"
        className="mx-5 mt-10 scroll-mt-8 border-y border-mist/65 py-7 sm:mx-8"
      >
        <div className="grid gap-6 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
              版本与来源
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">原文从哪里来</h2>
          </div>
          <div className="max-w-3xl text-sm leading-7 text-ink-soft">
            <p>
              本页卦辞、六条爻辞与大象依{classicalSource.edition}录入；彖、小象
              {wings.wenyanParagraphs ? "与文言" : ""}依
              {classicalWingsSource.edition}录入。两组原文分别锁定固定版本，
              产品原创观察另行标示，不把现代解释写入古文。
            </p>
            <div className="ui-copy mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <a
                href={classical.revisionUrl}
                target="_blank"
                rel="noreferrer"
                className="text-vermilion underline decoration-vermilion/35 underline-offset-4 transition hover:decoration-vermilion"
              >
                {classicalRevisionLabel(classical)}
              </a>
              <a
                href={wings.revisionUrl}
                target="_blank"
                rel="noreferrer"
                className="text-vermilion underline decoration-vermilion/35 underline-offset-4 transition hover:decoration-vermilion"
              >
                传文固定版本 · oldid {wings.revisionId}
              </a>
              <a
                href={classicalSource.bibliographicScanUrl}
                target="_blank"
                rel="noreferrer"
                className="text-ink underline decoration-mist underline-offset-4 transition hover:decoration-ink"
              >
                查看历史底本入口
              </a>
              <a
                href={classicalSource.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="text-ink underline decoration-mist underline-offset-4 transition hover:decoration-ink"
              >
                CC BY-SA 4.0
              </a>
              <Link
                href="/classics"
                className="text-ink underline decoration-mist underline-offset-4 transition hover:decoration-ink"
              >
                查看完整经传目录
              </Link>
            </div>
            <p className="mt-4 text-xs leading-6 text-ink-soft/75">
              {classicalWingsSource.publicDomainStatement}
              来源已记录表示可以回到固定版本核对，不表示不同古籍版本之间的异文已经全部校定。
            </p>
          </div>
        </div>
      </section>

      <section
        id="line-readings"
        className="mx-5 mt-14 scroll-mt-8 border-t border-mist/65 pt-8 sm:mx-8"
      >
        <div className="max-w-2xl">
          <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
            逐爻而观
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">六爻纵览</h2>
          <p className="mt-3 leading-7 text-ink-soft">
            六个位置自下而上展开。这里的白话为本产品原创的位置观察，不替代经典原文或专业研究。
          </p>
        </div>
        <div className="mt-6 divide-y divide-mist/65 border-y border-mist/65">
          {Array.from({ length: 6 }, (_, index) => {
            const lineText = hexagram.lineTexts?.[index];
            const classicalLine = classical.lineTexts[index];
            const smallImage = wings.smallImageTexts[index];

            return (
              <article
                key={index}
                className="grid gap-3 py-6 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8"
              >
                <h3 className="text-2xl font-semibold text-ink">
                  {linePosition(hexagram, index)}
                </h3>
                <div>
                  <ClassicalPassage
                    label="经 · 爻辞"
                    text={classicalLine.original}
                    compact
                  />
                  <div className="mt-4 border-t border-mist/55 pt-4">
                    <ClassicalPassage
                      label="传 · 小象"
                      text={smallImage.original}
                      compact
                    />
                  </div>
                  <p className="ui-copy mt-4 text-xs tracking-[0.16em] text-ink-soft/75">
                    位置观察 · 产品原创
                  </p>
                  <p className="mt-2 leading-7 text-ink-soft">
                    {lineText?.plain ?? fallbackText.line}
                  </p>
                  {lineText?.reflection ? (
                    <p className="mt-3 text-sm leading-6 text-vermilion">
                      {lineText.reflection}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
        {classical.specialUseText ? (
          <aside className="mt-6 border-l-2 border-vermilion/55 bg-paper-deep/45 px-5 py-5">
            <ClassicalPassage
              label={`经 · ${classical.specialUseText.position}特殊用辞`}
              text={classical.specialUseText.original}
              compact
            />
            {wings.specialUseImageText ? (
              <div className="mt-4 border-t border-mist/55 pt-4">
                <ClassicalPassage
                  label={`传 · ${wings.specialUseImageText.position}之象`}
                  text={wings.specialUseImageText.original}
                  compact
                />
              </div>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              这是乾、坤特有的用辞，独立记录，不作为第七条物理爻。
            </p>
          </aside>
        ) : null}
      </section>

      <section
        id="related-hexagrams"
        className="mx-5 mt-10 scroll-mt-8 sm:mx-8"
      >
        <div className="mb-4">
          <p className="ui-copy text-xs font-medium tracking-[0.2em] text-vermilion">
            卦象关系
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">相关卦象</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <RelatedCard
            currentHexagramId={hexagram.id}
            label="错卦"
            description="阴阳互换，用来观察反面张力。"
            related={inverted}
          />
          <RelatedCard
            currentHexagramId={hexagram.id}
            label="综卦"
            description="上下翻转，用来观察位置互换后的另一面。"
            related={reversed}
          />
          <RelatedCard
            currentHexagramId={hexagram.id}
            label="互卦"
            description="取中间四爻重组，用来观察内部结构。"
            related={mutual}
          />
        </div>
      </section>

      <nav
        aria-label="卦序导航"
        className="mx-5 mt-14 border-t border-mist/65 pt-8 sm:mx-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
              卦序相承
            </p>
            <h2
              id="sequence-navigation-title"
              className="mt-2 text-2xl font-semibold text-ink"
            >
              按卦序继续阅读
            </h2>
          </div>
          <Link
            href="/hexagrams"
            className="ui-copy min-h-11 rounded-sm border border-mist px-4 py-3 text-sm text-ink-soft transition hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
          >
            返回六十四卦
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {previousHexagram ? (
            <SequenceCard direction="previous" hexagram={previousHexagram} />
          ) : (
            <div
              aria-label="已到卦序起点"
              className="flex min-h-28 items-center rounded-sm border border-dashed border-mist/70 px-5 text-sm text-ink-soft/70"
            >
              已到卦序起点
            </div>
          )}
          {nextHexagram ? (
            <SequenceCard direction="next" hexagram={nextHexagram} />
          ) : (
            <div
              aria-label="已到卦序终点"
              className="flex min-h-28 items-center justify-end rounded-sm border border-dashed border-mist/70 px-5 text-sm text-ink-soft/70"
            >
              已到卦序终点
            </div>
          )}
        </div>
      </nav>
    </main>
  );
}
