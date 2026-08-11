"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HexagramLines } from "@/components/hexagram/HexagramLines";
import { InkLine } from "@/components/hexagram/InkLine";
import { trigramCopy } from "../../../data/trigram-copy";
import { trigrams, trigramsById, type Trigram } from "../../../data/trigrams";
import {
  getChangedLines,
  getHexagramByLines,
  getMutualHexagram,
  invertHexagram,
  reverseHexagram,
  type HexagramLines as HexagramLineTuple,
  type MovingLineIndex,
  type TrigramLines,
} from "../../../lib/hexagram";

type RelationId = "invert" | "reverse" | "mutual";
type MovingDemo = "old_yin" | "old_yang";

const positionNotes = [
  {
    label: "初",
    note: "开始处。事情刚发生，力量还在底层。",
  },
  {
    label: "二",
    note: "进入内部。适合看基础、学习和承接。",
  },
  {
    label: "三",
    note: "下卦边界。容易有压力，也接近转折。",
  },
  {
    label: "四",
    note: "进入上卦。开始接触外部结构或更高位置。",
  },
  {
    label: "五",
    note: "中正之位。常用来观察主导、责任和清明。",
  },
  {
    label: "上",
    note: "末端处。看完成、过度、收束或转化。",
  },
];

const relationCopy: Record<
  RelationId,
  {
    label: string;
    title: string;
    description: string;
  }
> = {
  invert: {
    label: "错卦",
    title: "阴阳相错",
    description: "每一爻阴阳互换，用来观察同一处境的反面张力。",
  },
  reverse: {
    label: "综卦",
    title: "上下翻转",
    description: "把卦倒过来看，用来观察位置互换后的另一面。",
  },
  mutual: {
    label: "互卦",
    title: "取中成象",
    description: "取中间四爻重组成卦，用来观察事情内部的结构。",
  },
};

function asHexagramLines(lines: number[]): HexagramLineTuple {
  return lines.slice(0, 6) as HexagramLineTuple;
}

function getTrigramByLines(lines: TrigramLines) {
  return trigrams.find((trigram) => trigram.binaryLines.join("") === lines.join(""));
}

function makeHexagramLines(lowerId: string, upperId: string): HexagramLineTuple {
  const lower = trigramsById.get(lowerId);
  const upper = trigramsById.get(upperId);

  if (!lower || !upper) {
    return [1, 1, 1, 1, 1, 1];
  }

  return asHexagramLines([...lower.binaryLines, ...upper.binaryLines]);
}

function getRelationLines(lines: HexagramLineTuple, relation: RelationId) {
  if (relation === "invert") {
    return invertHexagram(lines);
  }

  if (relation === "reverse") {
    return reverseHexagram(lines);
  }

  return getMutualHexagram(lines);
}

function TrigramVisual({
  trigram,
  animated = false,
}: {
  trigram: Trigram;
  animated?: boolean;
}) {
  return (
    <div
      className="flex w-28 flex-col-reverse gap-2"
      role="img"
      aria-label={`${trigram.chineseName}卦`}
    >
      {trigram.binaryLines.map((line, index) => (
        <InkLine
          key={`${trigram.id}-${index}-${line}`}
          line={line}
          size="sm"
          seed={index}
          animated={animated}
          delayMs={index * 120}
        />
      ))}
    </div>
  );
}

function RelatedLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="ui-copy inline-flex min-h-10 items-center justify-center rounded-sm border border-mist px-4 text-sm font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
    >
      {children}
    </Link>
  );
}

function LearningSection({
  number,
  title,
  summary,
  children,
  action,
}: {
  number: string;
  title: string;
  summary: string;
  children: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 rounded-sm border border-mist/70 bg-paper/75 p-5 md:grid-cols-[0.92fr_1.08fr] md:items-center md:p-6">
      <div className="order-1 flex min-h-56 items-center justify-center rounded-sm border border-mist/60 bg-paper-deep/45 p-5">
        {children}
      </div>

      <div className="order-2">
        <p className="ui-copy text-xs font-medium uppercase tracking-[0.2em] text-vermilion">
          {number}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-ink">{title}</h2>
        <p className="mt-4 text-base leading-8 text-ink-soft">{summary}</p>
        <div className="mt-5">{action}</div>
      </div>
    </section>
  );
}

function ToggleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`ui-copy min-h-10 rounded-sm border px-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion ${
        active
          ? "border-vermilion text-vermilion"
          : "border-mist text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function LearnMode() {
  const [yinYangLine, setYinYangLine] = useState(1);
  const [buildingTrigram, setBuildingTrigram] = useState<TrigramLines>([
    1, 0, 0,
  ]);
  const [selectedTrigramId, setSelectedTrigramId] = useState("zhen");
  const [lowerTrigramId, setLowerTrigramId] = useState("zhen");
  const [upperTrigramId, setUpperTrigramId] = useState("kan");
  const [selectedPosition, setSelectedPosition] = useState<MovingLineIndex>(0);
  const [movingDemo, setMovingDemo] = useState<MovingDemo>("old_yang");
  const [relation, setRelation] = useState<RelationId>("invert");

  const builtTrigram = getTrigramByLines(buildingTrigram);
  const selectedTrigram = trigramsById.get(selectedTrigramId) ?? trigrams[0];
  const hexagramLines = makeHexagramLines(lowerTrigramId, upperTrigramId);
  const composedHexagram = getHexagramByLines(hexagramLines);
  const movingLines = useMemo<HexagramLineTuple>(
    () =>
      movingDemo === "old_yang"
        ? [1, 1, 1, 1, 1, 1]
        : [0, 0, 0, 0, 0, 0],
    [movingDemo],
  );
  const movingIndexes: MovingLineIndex[] = [0];
  const changedMovingLines = getChangedLines(movingLines, movingIndexes);
  const changedMovingHexagram = getHexagramByLines(changedMovingLines);
  const relationBase = makeHexagramLines("zhen", "kan");
  const relationLines = getRelationLines(relationBase, relation);
  const relationBaseHexagram = getHexagramByLines(relationBase);
  const relationHexagram = getHexagramByLines(relationLines);

  function toggleBuildingLine(index: number) {
    setBuildingTrigram((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? (line === 1 ? 0 : 1) : line,
      ) as TrigramLines,
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-5 px-5 pb-16 sm:px-8">
      <LearningSection
        number="01"
        title="阴阳"
        summary="阳爻是一条连续的线，偏向主动、推进、显现；阴爻中间断开，偏向承接、蓄养、回应。这里不是好坏之分，而是两种状态。"
        action={
          <div className="flex flex-wrap gap-2">
            <ToggleButton
              active={yinYangLine === 1}
              onClick={() => setYinYangLine(1)}
            >
              看阳爻
            </ToggleButton>
            <ToggleButton
              active={yinYangLine === 0}
              onClick={() => setYinYangLine(0)}
            >
              看阴爻
            </ToggleButton>
            <RelatedLink href="/ask">用一爻开始提问</RelatedLink>
          </div>
        }
      >
        <div
          className="w-full max-w-xs text-center"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <InkLine line={yinYangLine} size="lg" animated seed={0} />
          <p className="mt-6 text-3xl font-semibold text-ink">
            {yinYangLine === 1 ? "阳" : "阴"}
          </p>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {yinYangLine === 1
              ? "一气贯通，像一个清楚的行动。"
              : "中间留白，像一种接纳与等待。"}
          </p>
        </div>
      </LearningSection>

      <LearningSection
        number="02"
        title="三爻成卦"
        summary="三条线叠在一起，就形成一个三画卦。读的时候从下往上看：下面是开始和根基，上面是显现和结果。"
        action={
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {buildingTrigram.map((line, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleBuildingLine(index)}
                  aria-pressed={line === 1}
                  className="ui-copy min-h-10 rounded-sm border border-mist px-3 text-sm text-ink-soft transition hover:border-vermilion hover:text-vermilion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
                >
                  {positionNotes[index].label} · {line === 1 ? "阳" : "阴"}
                </button>
              ))}
            </div>
            <RelatedLink href="/hexagrams">去看六十四卦</RelatedLink>
          </div>
        }
      >
        <div
          className="text-center"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <TrigramVisual
            trigram={{
              ...(builtTrigram ?? trigrams[0]),
              binaryLines: buildingTrigram,
            }}
            animated
          />
          <p className="mt-6 text-3xl font-semibold text-ink">
            {builtTrigram?.chineseName ?? "未定"}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {builtTrigram
              ? `${trigramCopy[builtTrigram.id].imageZh} · ${trigramCopy[builtTrigram.id].keywordsZh.join("、")}`
              : "继续调整三爻"}
          </p>
        </div>
      </LearningSection>

      <LearningSection
        number="03"
        title="八卦之象"
        summary="八卦不是固定答案，而是八种观察方式。每一卦都有自然图像，也有一组可用于反思的关键词。"
        action={
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {trigrams.map((trigram) => (
                <button
                  key={trigram.id}
                  type="button"
                  onClick={() => setSelectedTrigramId(trigram.id)}
                  aria-pressed={selectedTrigramId === trigram.id}
                  className={`rounded-sm border px-3 py-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion ${
                    selectedTrigramId === trigram.id
                      ? "border-vermilion text-vermilion"
                      : "border-mist text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  <span className="block text-xl">{trigram.chineseName}</span>
                  <span className="ui-copy text-xs">
                    {trigramCopy[trigram.id].imageZh}
                  </span>
                </button>
              ))}
            </div>
            <RelatedLink href="/hexagrams">浏览卦象</RelatedLink>
          </div>
        }
      >
        <div className="w-full">
          <div
            className="flex flex-col items-center text-center"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <TrigramVisual trigram={selectedTrigram} animated />
            <p className="mt-5 text-4xl font-semibold text-ink">
              {selectedTrigram.chineseName}
            </p>
            <p className="mt-2 text-lg text-ink-soft">
              {trigramCopy[selectedTrigram.id].imageZh}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-ink-soft">
              {trigramCopy[selectedTrigram.id].hint}
            </p>
          </div>
        </div>
      </LearningSection>

      <LearningSection
        number="04"
        title="六爻成卦"
        summary="一个六画卦由下卦和上卦组成。下卦像事情的基础，上卦像外部环境或进一步展开。"
        action={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="ui-copy text-sm text-ink-soft">
                下卦
                <select
                  value={lowerTrigramId}
                  onChange={(event) => setLowerTrigramId(event.target.value)}
                  className="mt-2 min-h-10 w-full rounded-sm border border-mist bg-paper px-3 text-ink outline-none focus:border-vermilion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
                >
                  {trigrams.map((trigram) => (
                    <option key={trigram.id} value={trigram.id}>
                      {trigram.chineseName} · {trigramCopy[trigram.id].imageZh}
                    </option>
                  ))}
                </select>
              </label>
              <label className="ui-copy text-sm text-ink-soft">
                上卦
                <select
                  value={upperTrigramId}
                  onChange={(event) => setUpperTrigramId(event.target.value)}
                  className="mt-2 min-h-10 w-full rounded-sm border border-mist bg-paper px-3 text-ink outline-none focus:border-vermilion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
                >
                  {trigrams.map((trigram) => (
                    <option key={trigram.id} value={trigram.id}>
                      {trigram.chineseName} · {trigramCopy[trigram.id].imageZh}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <RelatedLink href={`/hexagrams/${composedHexagram?.id ?? 3}`}>
              查看这个卦
            </RelatedLink>
          </div>
        }
      >
        <div
          className="text-center"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <HexagramLines
            lines={hexagramLines}
            animated
            size="md"
            label="上下卦组合成六爻"
          />
          <p className="mt-6 text-3xl font-semibold text-ink">
            {composedHexagram?.chineseName ?? "未定"}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            下{trigramsById.get(lowerTrigramId)?.chineseName} · 上
            {trigramsById.get(upperTrigramId)?.chineseName}
          </p>
        </div>
      </LearningSection>

      <LearningSection
        number="05"
        title="爻位"
        summary="六爻也可以看成一个过程：从初到上，像事情从开始、进入、临界、展开、主位，到收束。"
        action={
          <div className="grid grid-cols-3 gap-2">
            {positionNotes.map((position, index) => (
              <ToggleButton
                key={position.label}
                active={selectedPosition === index}
                onClick={() => setSelectedPosition(index as MovingLineIndex)}
              >
                {position.label}
              </ToggleButton>
            ))}
          </div>
        }
      >
        <div
          className="text-center"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <HexagramLines
            lines={[1, 1, 1, 1, 1, 1]}
            movingLineIndexes={[selectedPosition]}
            animated
            size="md"
            label="爻位示意"
          />
          <p className="mt-6 text-3xl font-semibold text-ink">
            {positionNotes[selectedPosition].label}爻
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">
            {positionNotes[selectedPosition].note}
          </p>
        </div>
      </LearningSection>

      <LearningSection
        number="06"
        title="动爻与变卦"
        summary="老阴、老阳是会变化的爻。老阳由阳变阴，老阴由阴变阳；变化后形成变卦，用来观察趋势的另一面。"
        action={
          <div className="flex flex-wrap gap-2">
            <ToggleButton
              active={movingDemo === "old_yang"}
              onClick={() => setMovingDemo("old_yang")}
            >
              老阳变阴
            </ToggleButton>
            <ToggleButton
              active={movingDemo === "old_yin"}
              onClick={() => setMovingDemo("old_yin")}
            >
              老阴变阳
            </ToggleButton>
            <RelatedLink href="/ask">去问一卦</RelatedLink>
          </div>
        }
      >
        <div
          className="w-full"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col items-center">
              <p className="ui-copy mb-4 text-xs text-ink-soft">本卦</p>
              <HexagramLines
                lines={movingLines}
                movingLineIndexes={movingIndexes}
                animated
                size="sm"
                label="动爻本卦"
              />
            </div>
            <span className="ui-copy flex h-8 w-8 items-center justify-center rounded-full border border-mist text-vermilion">
              →
            </span>
            <div className="flex flex-col items-center">
              <p className="ui-copy mb-4 text-xs text-ink-soft">变卦</p>
              <HexagramLines
                lines={changedMovingLines}
                movingLineIndexes={movingIndexes}
                animated
                size="sm"
                transitionFromLines={movingLines}
                label="动爻变卦"
              />
            </div>
          </div>
          <p className="mt-6 text-center text-sm leading-6 text-ink-soft">
            {movingDemo === "old_yang"
              ? `老阳动，${changedMovingHexagram?.chineseName ?? "变卦"}出现为参考。`
              : `老阴动，${changedMovingHexagram?.chineseName ?? "变卦"}出现为参考。`}
          </p>
        </div>
      </LearningSection>

      <LearningSection
        number="07"
        title="错卦、综卦、互卦"
        summary="同一个卦可以从不同关系再看一遍：错卦看反面张力，综卦看翻转位置，互卦看内部结构。"
        action={
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(relationCopy) as RelationId[]).map((id) => (
                <ToggleButton
                  key={id}
                  active={relation === id}
                  onClick={() => setRelation(id)}
                >
                  {relationCopy[id].label}
                </ToggleButton>
              ))}
            </div>
            <RelatedLink href="/hexagrams/3">以屯卦为例</RelatedLink>
          </div>
        }
      >
        <div
          className="w-full"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col items-center">
              <p className="ui-copy mb-4 text-xs text-ink-soft">
                {relationBaseHexagram?.chineseName ?? "本卦"}
              </p>
              <HexagramLines lines={relationBase} animated size="sm" />
            </div>
            <span className="ui-copy flex h-8 w-8 items-center justify-center rounded-full border border-mist text-vermilion">
              →
            </span>
            <div className="flex flex-col items-center">
              <p className="ui-copy mb-4 text-xs text-ink-soft">
                {relationHexagram?.chineseName ?? relationCopy[relation].label}
              </p>
              <HexagramLines
                lines={relationLines}
                animated
                size="sm"
                transitionFromLines={relationBase}
              />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-2xl font-semibold text-ink">
              {relationCopy[relation].title}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {relationCopy[relation].description}
            </p>
          </div>
        </div>
      </LearningSection>
    </section>
  );
}
