import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HexagramLines } from "@/components/hexagram/HexagramLines";
import { trigramCopy } from "../../../../data/trigram-copy";
import { hexagrams, hexagramsById, type Hexagram } from "../../../../data/hexagrams";
import { trigramsById, type Trigram } from "../../../../data/trigrams";
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
  judgment: "此卦的卦辞与白话解释将在后续版本中补全。当前可先观察卦名、上下卦与关键词。",
  line: "暂未收录此爻的原文与白话说明。可先观察它所在的位置、阴阳状态与上下关系。",
  image: "可先从上下卦、阴阳分布和关键词入手，观察这个卦呈现出的结构。",
  question: "这个卦让你最先注意到处境中的哪一种变化？",
  action: "写下一件能让问题更清楚的小事，并在今天完成。",
};

const linePlaces = ["初", "二", "三", "四", "五", "上"];

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

function buildSections(hexagram: Hexagram, upper?: Trigram, lower?: Trigram) {
  return [
    {
      title: "象",
      body:
        hexagram.coreMeaning ??
        `上卦为${trigramLabel(upper)}，下卦为${trigramLabel(lower)}。${fallbackText.image}`,
    },
    {
      title: "辞",
      body:
        [hexagram.judgmentOriginal, hexagram.judgmentPlain]
          .filter(Boolean)
          .join(" ") || fallbackText.judgment,
    },
    {
      title: "理",
      body: `可从 ${hexagram.keywords.join("、")} 入手，观察时机、位置与关系如何相互影响。这个部分只提供反思线索，不作为确定性判断。`,
    },
    {
      title: "用",
      body: "应用时，先把卦象当作整理问题的结构：看哪里需要推进，哪里需要等待，哪里需要重新划清边界。",
    },
    {
      title: "问",
      body: hexagram.reflectionQuestions?.[0] ?? fallbackText.question,
    },
    {
      title: "行",
      body: hexagram.smallAction ?? fallbackText.action,
    },
  ];
}

function RelatedCard({
  label,
  description,
  related,
}: {
  label: string;
  description: string;
  related: {
    lines: HexagramLineTuple;
    hexagram?: Hexagram;
  };
}) {
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
    </article>
  );

  if (!related.hexagram) {
    return content;
  }

  return <Link href={`/hexagrams/${related.hexagram.id}`}>{content}</Link>;
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
  const sections = buildSections(hexagram, upper, lower);
  const inverted = getRelatedHexagram(hexagram.lines, "invert");
  const reversed = getRelatedHexagram(hexagram.lines, "reverse");
  const mutual = getRelatedHexagram(hexagram.lines, "mutual");

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <Link
        href="/hexagrams"
        className="ui-copy text-sm text-ink-soft transition hover:text-ink"
      >
        返回观象
      </Link>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-sm border border-mist/70 bg-paper-deep/55 px-6 py-10 text-center text-ink">
          <div className="flex justify-center">
            <HexagramLines
              lines={hexagram.lines}
              animated
              size="lg"
              label={`${hexagram.chineseName}卦大图`}
            />
          </div>

          <p className="ui-copy mt-8 text-sm text-vermilion">
            第 {hexagram.id} 卦
          </p>
          <div className="mt-2 flex items-baseline justify-center gap-3">
            <h1 className="text-5xl font-semibold text-ink">
              {hexagram.chineseName}
            </h1>
            <span className="text-4xl text-ink-soft" aria-hidden="true">
              {hexagram.unicodeSymbol}
            </span>
          </div>
          <p className="ui-copy mt-3 text-sm uppercase tracking-[0.18em] text-ink-soft">
            {hexagram.name}
          </p>

          <div className="ui-copy mt-8 grid grid-cols-2 gap-3 text-left text-sm">
            <div className="rounded-sm border border-mist/70 bg-paper/55 p-4">
              <span className="block text-xs uppercase tracking-[0.16em] text-ink-soft/75">
                上卦
              </span>
              <strong className="mt-2 block text-lg text-ink">
                {trigramLabel(upper)}
              </strong>
              <span className="mt-2 block leading-6 text-ink-soft">
                {upper ? trigramCopy[upper.id].explanation : "资料待补"}
              </span>
            </div>
            <div className="rounded-sm border border-mist/70 bg-paper/55 p-4">
              <span className="block text-xs uppercase tracking-[0.16em] text-ink-soft/75">
                下卦
              </span>
              <strong className="mt-2 block text-lg text-ink">
                {trigramLabel(lower)}
              </strong>
              <span className="mt-2 block leading-6 text-ink-soft">
                {lower ? trigramCopy[lower.id].explanation : "资料待补"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {hexagram.keywords.map((keyword) => (
              <span
                key={keyword}
                className="ui-copy rounded-sm border border-mist/70 bg-paper/45 px-2.5 py-1 text-xs text-ink-soft"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-sm border border-mist/70 bg-paper/75 p-5"
            >
              <h2 className="text-2xl font-semibold text-ink">
                {section.title}
              </h2>
              <p className="mt-3 leading-8 text-ink-soft">{section.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-sm border border-mist/70 bg-paper/75 p-5">
        <h2 className="text-2xl font-semibold text-ink">六爻</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => {
            const lineText = hexagram.lineTexts?.[index];

            return (
              <article
                key={index}
                className="rounded-sm border border-mist/70 bg-paper-deep/30 p-4"
              >
                <h3 className="text-xl font-semibold text-ink">
                  {linePosition(hexagram, index)}
                </h3>
                <p className="mt-2 leading-7 text-ink-soft">
                  {lineText?.original ?? fallbackText.line}
                </p>
                {lineText?.plain ? (
                  <p className="mt-2 leading-7 text-ink-soft">
                    {lineText.plain}
                  </p>
                ) : null}
                {lineText?.reflection ? (
                  <p className="mt-3 text-sm leading-6 text-vermilion">
                    {lineText.reflection}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4">
          <p className="ui-copy text-xs font-medium uppercase tracking-[0.2em] text-vermilion">
            Related
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">相关卦象</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <RelatedCard
            label="错卦"
            description="阴阳互换，用来观察反面张力。"
            related={inverted}
          />
          <RelatedCard
            label="综卦"
            description="上下翻转，用来观察位置互换后的另一面。"
            related={reversed}
          />
          <RelatedCard
            label="互卦"
            description="取中间四爻重组，用来观察内部结构。"
            related={mutual}
          />
        </div>
      </section>
    </main>
  );
}
