"use client";

import { useMemo, useState } from "react";
import { ChangingHexagramView } from "@/components/hexagram/ChangingHexagramView";
import { HexagramLines } from "@/components/hexagram/HexagramLines";
import { InkLine } from "@/components/hexagram/InkLine";
import type { Hexagram } from "../../../data/hexagrams";
import { getHighStakesSafetyNote } from "../../../lib/safety";
import {
  getChangedHexagram,
  getChangedLines,
  getHexagramByLines,
  getTrigramsFromHexagram,
  type HexagramLines as HexagramLineTuple,
  type MovingLineIndex,
} from "../../../lib/hexagram";

type QuestionTypeId =
  | "work"
  | "relationship"
  | "decision"
  | "emotion"
  | "learning"
  | "project"
  | "other";

type CastingMethod = "manual" | "random";
type LineKindId = "yin" | "yang" | "old_yin" | "old_yang";
type LineKindTuple = [
  LineKindId,
  LineKindId,
  LineKindId,
  LineKindId,
  LineKindId,
  LineKindId,
];

type ReadingResult = {
  id: number;
  question: string;
  questionType: QuestionTypeId;
  method: CastingMethod;
  lineKinds: LineKindTuple;
  originalLines: HexagramLineTuple;
  movingLineIndexes: MovingLineIndex[];
  changedLines: HexagramLineTuple;
  originalHexagram: Hexagram;
  changedHexagram: Hexagram;
  safetyNote?: string;
};

type InterpretationSection = {
  title: string;
  body: string;
};

const questionTypes: Array<{
  id: QuestionTypeId;
  label: string;
  application: string;
  reflection: string;
  action: string;
}> = [
  {
    id: "work",
    label: "事业",
    application:
      "放在事业问题中，这可以作为观察职责、节奏与协作边界的线索。",
    reflection: "现在最需要被澄清的是目标、责任，还是节奏？",
    action: "写下一个今天可以推进的工作动作，并限定在二十分钟内完成。",
  },
  {
    id: "relationship",
    label: "关系",
    application:
      "放在关系问题中，这可以帮助你观察互动中的位置、回应方式与未说清的期待。",
    reflection: "这段关系里，你正在期待对方理解什么？",
    action: "用一句不责备的话，表达一个具体需要或边界。",
  },
  {
    id: "decision",
    label: "选择",
    application:
      "放在选择问题中，这提示你先看条件是否成熟，再看哪一步最小且可回头。",
    reflection: "如果先不追求最终答案，下一步需要验证什么？",
    action: "列出两个可逆的小试验，并选一个今天开始。",
  },
  {
    id: "emotion",
    label: "情绪",
    application:
      "放在情绪问题中，这更适合用来辨认感受的来处，而不是急着压下或解释它。",
    reflection: "这个情绪最想保护你的哪一部分？",
    action: "给当下情绪命名，并记录它在身体里的一个具体位置。",
  },
  {
    id: "learning",
    label: "学习",
    application:
      "放在学习问题中，这可以提醒你观察基础、重复、反馈与时机。",
    reflection: "目前卡住的是理解、练习，还是反馈不足？",
    action: "选一个最小知识点，用十分钟复述或练习一次。",
  },
  {
    id: "project",
    label: "项目",
    application:
      "放在项目问题中，这可以帮助你看见结构、资源、阻塞点与下一步顺序。",
    reflection: "这个项目最先需要稳定的是范围、角色，还是交付节奏？",
    action: "更新一个项目清单：只保留下一步、负责人和完成标准。",
  },
  {
    id: "other",
    label: "其他",
    application:
      "放在这个问题中，可以先把卦象当作观察变化的框架，而不是结论。",
    reflection: "如果只看眼前变化，最明显的张力在哪里？",
    action: "写下一件可以让局面更清楚的小事，并在今天完成。",
  },
];

const lineKindCycle: LineKindId[] = ["yin", "yang", "old_yin", "old_yang"];
const initialManualLines: LineKindTuple = [
  "yin",
  "yin",
  "yin",
  "yin",
  "yin",
  "yin",
];

const lineKindMeta: Record<
  LineKindId,
  { label: string; value: number; moving: boolean; note: string }
> = {
  yin: { label: "阴", value: 0, moving: false, note: "少阴" },
  yang: { label: "阳", value: 1, moving: false, note: "少阳" },
  old_yin: { label: "老阴", value: 0, moving: true, note: "阴动为阳" },
  old_yang: { label: "老阳", value: 1, moving: true, note: "阳动为阴" },
};

const linePositionLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

function tupleFromLineKinds(lineKinds: LineKindTuple): HexagramLineTuple {
  return lineKinds.map((kind) => lineKindMeta[kind].value) as HexagramLineTuple;
}

function movingIndexesFromLineKinds(
  lineKinds: LineKindTuple,
): MovingLineIndex[] {
  return lineKinds
    .map((kind, index) => (lineKindMeta[kind].moving ? index : -1))
    .filter((index): index is MovingLineIndex => index >= 0 && index <= 5);
}

function castRandomLine(): LineKindId {
  const tosses =
    Number(Math.random() < 0.5) +
    Number(Math.random() < 0.5) +
    Number(Math.random() < 0.5);

  if (tosses === 0) {
    return "old_yin";
  }

  if (tosses === 3) {
    return "old_yang";
  }

  return tosses === 1 ? "yang" : "yin";
}

function createReadingResult({
  question,
  questionType,
  method,
  lineKinds,
}: {
  question: string;
  questionType: QuestionTypeId;
  method: CastingMethod;
  lineKinds: LineKindTuple;
}): ReadingResult {
  const originalLines = tupleFromLineKinds(lineKinds);
  const movingLineIndexes = movingIndexesFromLineKinds(lineKinds);
  const changedLines = getChangedLines(originalLines, movingLineIndexes);
  const originalHexagram = getHexagramByLines(originalLines);
  const changedHexagram = getChangedHexagram(originalLines, movingLineIndexes);

  if (!originalHexagram || !changedHexagram) {
    throw new Error("Unable to resolve hexagram from selected lines.");
  }

  return {
    id: Date.now(),
    question,
    questionType,
    method,
    lineKinds,
    originalLines,
    movingLineIndexes,
    changedLines,
    originalHexagram,
    changedHexagram,
    safetyNote: getHighStakesSafetyNote(question),
  };
}

function getQuestionType(id: QuestionTypeId) {
  return questionTypes.find((type) => type.id === id) ?? questionTypes[0];
}

function movingLineSummary(result: ReadingResult) {
  if (result.movingLineIndexes.length === 0) {
    return "无动爻，变卦与本卦相同。";
  }

  return result.movingLineIndexes
    .map((index) => {
      const text = result.originalHexagram.lineTexts?.[index];
      const position = text?.position ?? linePositionLabels[index];
      const kind = lineKindMeta[result.lineKinds[index]].note;

      return `${position}（${kind}）`;
    })
    .join("、");
}

function buildTextSection(result: ReadingResult) {
  const movingTexts = result.movingLineIndexes
    .map((index) => result.originalHexagram.lineTexts?.[index])
    .filter((lineText): lineText is NonNullable<typeof lineText> =>
      Boolean(lineText),
    )
    .map((lineText) => {
      const plain = lineText.plain ? `：${lineText.plain}` : "";
      return `${lineText.position}${plain}`;
    });

  if (movingTexts.length > 0) {
    return movingTexts.join("；");
  }

  return (
    result.originalHexagram.judgmentPlain ??
    result.originalHexagram.judgmentOriginal ??
    "V0.1 暂未收录完整卦辞，可先把卦名、上下卦和关键词作为观察线索。"
  );
}

function buildInterpretation(result: ReadingResult): InterpretationSection[] {
  const questionType = getQuestionType(result.questionType);
  const { upper, lower } = getTrigramsFromHexagram(result.originalLines);
  const changedText =
    result.movingLineIndexes.length > 0
      ? `动爻形成 ${result.changedHexagram.chineseName} 卦，可把“${result.changedHexagram.coreMeaning}”作为变化方向的另一层参考。`
      : "此卦无动爻，可先停留在本卦所呈现的结构中观察。";
  const firstReflection =
    result.originalHexagram.reflectionQuestions?.[0] ?? questionType.reflection;

  const sections: InterpretationSection[] = [
    {
      title: "象 / Image",
      body:
        result.originalHexagram.imageObservation ??
        `${result.originalHexagram.chineseName} 卦为上${upper.chineseName}下${lower.chineseName}。从卦象看，可以先观察 ${result.originalHexagram.keywords.join("、")} 这些线索。`,
    },
    {
      title: "辞 / Text",
      body: buildTextSection(result),
    },
    {
      title: "理 / Principle",
      body: `${result.originalHexagram.coreMeaning} 动爻为 ${movingLineSummary(result)} ${changedText} 这些内容用于观察位置、时机和变化幅度，不作为确定结论。`,
    },
    {
      title: "用 / Application",
      body: `${questionType.application} ${result.originalHexagram.application}`,
    },
    {
      title: "问 / Reflection",
      body: firstReflection,
    },
    {
      title: "行 / Small Action",
      body: result.originalHexagram.smallAction ?? questionType.action,
    },
  ];

  if (result.safetyNote) {
    sections.push({
      title: "安全提示 / Safety",
      body: result.safetyNote,
    });
  }

  return sections;
}

function MethodButton({
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
      className={`ui-copy min-h-11 rounded-sm border px-4 text-sm font-medium transition ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-mist text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function AskMode() {
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState<QuestionTypeId>("work");
  const [method, setMethod] = useState<CastingMethod>("manual");
  const [manualLines, setManualLines] =
    useState<LineKindTuple>(initialManualLines);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [message, setMessage] = useState("");

  const canCast = question.trim().length > 0;
  const manualPreviewLines = tupleFromLineKinds(manualLines);
  const manualMovingIndexes = movingIndexesFromLineKinds(manualLines);
  const interpretation = useMemo(
    () => (result ? buildInterpretation(result) : []),
    [result],
  );

  function cycleLine(index: number) {
    setManualLines((current) =>
      current.map((kind, lineIndex) => {
        if (lineIndex !== index) {
          return kind;
        }

        const nextIndex = (lineKindCycle.indexOf(kind) + 1) % lineKindCycle.length;
        return lineKindCycle[nextIndex];
      }) as LineKindTuple,
    );
  }

  function castWithLines(nextLineKinds: LineKindTuple, nextMethod: CastingMethod) {
    if (!canCast) {
      setMessage("请先写下一个问题，再生成卦象。");
      return;
    }

    setMessage("");
    setResult(
      createReadingResult({
        question: question.trim(),
        questionType,
        method: nextMethod,
        lineKinds: nextLineKinds,
      }),
    );
  }

  function randomCast() {
    const randomLines = Array.from({ length: 6 }, castRandomLine) as LineKindTuple;
    setManualLines(randomLines);
    castWithLines(randomLines, "random");
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 pb-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-5">
        <div className="rounded-sm border border-mist/70 bg-paper/75 p-5">
          <label
            htmlFor="question"
            className="ui-copy text-sm font-medium text-ink"
          >
            你的问题
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="ui-copy mt-3 min-h-32 w-full resize-none rounded-sm border border-mist bg-paper-deep/55 p-4 text-base leading-7 text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-vermilion"
            placeholder="例如：我现在该如何理解这个选择？"
          />

          <div className="mt-5">
            <p className="ui-copy text-sm font-medium text-ink">问题类型</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {questionTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setQuestionType(type.id)}
                  className={`ui-copy min-h-10 rounded-sm border px-3 text-sm transition ${
                    questionType === type.id
                      ? "border-vermilion text-vermilion"
                      : "border-mist text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="ui-copy text-sm font-medium text-ink">起卦方式</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MethodButton
                active={method === "manual"}
                onClick={() => setMethod("manual")}
              >
                Manual build
              </MethodButton>
              <MethodButton
                active={method === "random"}
                onClick={() => setMethod("random")}
              >
                Random cast
              </MethodButton>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-ink-soft">
            本页仅使用本地静态规则，不调用外部 AI API，也不会把问题保存到服务器。
          </p>
        </div>

        <div className="rounded-sm border border-mist/70 bg-paper/75 p-5">
          {method === "manual" ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">手动成卦</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    点击每一爻循环：阴、阳、老阴、老阳。数据顺序为自下而上。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setManualLines(initialManualLines)}
                  className="ui-copy rounded-sm border border-mist px-3 py-2 text-xs text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  重置
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="flex w-full max-w-sm flex-col-reverse gap-2">
                  {manualLines.map((kind, index) => {
                    const meta = lineKindMeta[kind];

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => cycleLine(index)}
                        className="grid grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] items-center gap-3 rounded-sm border border-mist/70 bg-paper-deep/35 px-3 py-2 text-left transition hover:border-ink focus:border-vermilion focus:outline-none"
                      >
                        <span className="ui-copy text-xs text-ink-soft">
                          {linePositionLabels[index]}
                        </span>
                        <InkLine
                          line={meta.value}
                          moving={meta.moving}
                          size="sm"
                          seed={index}
                        />
                        <span
                          className={`ui-copy text-right text-xs ${
                            meta.moving ? "text-vermilion" : "text-ink-soft"
                          }`}
                        >
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => castWithLines(manualLines, "manual")}
                disabled={!canCast}
                className="ui-copy mt-6 min-h-12 w-full rounded-sm bg-vermilion px-5 text-base font-medium text-paper transition hover:bg-[#962f26] disabled:cursor-not-allowed disabled:bg-wash disabled:text-ink-soft"
              >
                生成卦象
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-ink">随机起卦</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                随机生成六爻，顺序仍为自下而上。老阴、老阳会作为动爻显示。
              </p>
              <div className="mt-6 flex justify-center rounded-sm border border-mist/70 bg-paper-deep/35 py-8">
                <HexagramLines
                  lines={manualPreviewLines}
                  movingLineIndexes={manualMovingIndexes}
                  size="md"
                  label="随机起卦预览"
                />
              </div>
              <button
                type="button"
                onClick={randomCast}
                disabled={!canCast}
                className="ui-copy mt-6 min-h-12 w-full rounded-sm bg-vermilion px-5 text-base font-medium text-paper transition hover:bg-[#962f26] disabled:cursor-not-allowed disabled:bg-wash disabled:text-ink-soft"
              >
                随机生成六爻
              </button>
            </>
          )}

          {message ? (
            <p className="mt-4 text-sm leading-6 text-vermilion">{message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-5">
        {result ? (
          <>
            <div className="rounded-sm border border-mist/70 bg-paper/75 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="ui-copy text-xs font-medium uppercase tracking-[0.18em] text-vermilion">
                    Reading
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">
                    {result.originalHexagram.chineseName} →{" "}
                    {result.changedHexagram.chineseName}
                  </h2>
                </div>
                <span className="ui-copy rounded-sm border border-mist px-3 py-1.5 text-xs text-ink-soft">
                  {getQuestionType(result.questionType).label} ·{" "}
                  {result.method === "manual" ? "手动" : "随机"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-ink-soft">
                问题：{result.question}
              </p>

              <div className="mt-6">
                <ChangingHexagramView
                  key={result.id}
                  lines={result.originalLines}
                  movingLineIndexes={result.movingLineIndexes}
                  size="sm"
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-sm border border-mist/70 bg-paper-deep/35 p-4">
                  <p className="ui-copy text-xs text-ink-soft">本卦</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">
                    {result.originalHexagram.chineseName}
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">
                    {result.originalHexagram.keywords.join("、")}
                  </p>
                </div>
                <div className="rounded-sm border border-mist/70 bg-paper-deep/35 p-4">
                  <p className="ui-copy text-xs text-ink-soft">动爻</p>
                  <p className="mt-2 text-base leading-7 text-vermilion">
                    {movingLineSummary(result)}
                  </p>
                </div>
                <div className="rounded-sm border border-mist/70 bg-paper-deep/35 p-4">
                  <p className="ui-copy text-xs text-ink-soft">变卦</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">
                    {result.changedHexagram.chineseName}
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">
                    {result.changedHexagram.keywords.join("、")}
                  </p>
                </div>
              </div>
            </div>

            <section className="rounded-sm border border-mist/70 bg-paper/75 p-5">
              <h2 className="text-2xl font-semibold text-ink">简要解释</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                以下为 V0.1 静态规则生成的反思结构，只提供一种观察角度。
              </p>

              <div className="mt-5 space-y-3">
                {interpretation.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-sm border border-mist/70 bg-paper-deep/30 p-4"
                  >
                    <h3 className="text-xl font-semibold text-ink">
                      {section.title}
                    </h3>
                    <p className="mt-2 leading-7 text-ink-soft">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="flex min-h-[520px] flex-col items-center justify-center rounded-sm border border-mist/70 bg-paper-deep/55 px-6 py-10 text-center text-ink">
            <HexagramLines
              lines={manualPreviewLines}
              movingLineIndexes={manualMovingIndexes}
              size="lg"
              label="问卦预览"
            />
            <h2 className="mt-8 text-2xl font-semibold text-ink">等待成卦</h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-ink-soft">
              写下问题，选择类型和起卦方式。生成后会显示本卦、动爻、变卦与六段式反思。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
