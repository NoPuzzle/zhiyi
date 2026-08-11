"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChangingHexagramView } from "@/components/hexagram/ChangingHexagramView";
import { HexagramLines } from "@/components/hexagram/HexagramLines";
import { InkLine } from "@/components/hexagram/InkLine";
import { withBasePath } from "@/lib/base-path";
import type { Hexagram } from "../../../data/hexagrams";
import {
  getHighStakesSafetyNote,
  PROFESSIONAL_SUPPORT_NOTICE,
} from "../../../lib/safety";
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
  classical?: Array<{
    label: string;
    text: string | string[];
  }>;
};

type ClassicalReadingAsset = {
  schemaVersion: 1;
  id: number;
  name: string;
  revisionUrl: string;
  jing: {
    judgmentOriginal: string;
    lineTexts: Array<{ position: string; original: string }>;
  };
  zhuan: {
    tuanParagraphs: string[];
    greatImageText: string;
    smallImageTexts: Array<{ position: string; original: string }>;
  };
};

const readingSteps = [
  { id: 1, label: "写问题" },
  { id: 2, label: "起卦" },
  { id: 3, label: "观变化" },
] as const;

const interpretationSectionIds: Record<string, string> = {
  象: "image",
  辞: "text",
  理: "principle",
  用: "application",
  问: "reflection",
  行: "action",
  安全提示: "safety",
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
    "可先把卦名、上下卦和关键词作为观察线索。"
  );
}

function buildInterpretation(
  result: ReadingResult,
  classicalReadings: Map<number, ClassicalReadingAsset>,
): InterpretationSection[] {
  const questionType = getQuestionType(result.questionType);
  const { upper, lower } = getTrigramsFromHexagram(result.originalLines);
  const originalClassical = classicalReadings.get(result.originalHexagram.id);
  const changedClassical = classicalReadings.get(result.changedHexagram.id);
  const changedText =
    result.movingLineIndexes.length > 0
      ? `动爻形成 ${result.changedHexagram.chineseName} 卦，可把“${result.changedHexagram.coreMeaning}”作为变化方向的另一层参考。`
      : "此卦无动爻，可先停留在本卦所呈现的结构中观察。";
  const firstReflection =
    result.originalHexagram.reflectionQuestions?.[0] ?? questionType.reflection;

  const sections: InterpretationSection[] = [
    {
      title: "象",
      classical: originalClassical
        ? [
            {
              label: "传 · 大象",
              text: originalClassical.zhuan.greatImageText,
            },
          ]
        : undefined,
      body:
        result.originalHexagram.imageObservation ??
        `${result.originalHexagram.chineseName} 卦为上${upper.chineseName}下${lower.chineseName}。从卦象看，可以先观察 ${result.originalHexagram.keywords.join("、")} 这些线索。`,
    },
    {
      title: "辞",
      classical: originalClassical
        ? [
            {
              label: "经 · 本卦卦辞",
              text: originalClassical.jing.judgmentOriginal,
            },
            {
              label: "传 · 本卦彖传",
              text: originalClassical.zhuan.tuanParagraphs,
            },
            ...result.movingLineIndexes.flatMap((index) => {
              const line = originalClassical.jing.lineTexts[index];
              const smallImage = originalClassical.zhuan.smallImageTexts[index];

              return [
                {
                  label: `经 · ${line.position}爻辞`,
                  text: line.original,
                },
                {
                  label: `传 · ${smallImage.position}小象`,
                  text: smallImage.original,
                },
              ];
            }),
          ]
        : undefined,
      body: buildTextSection(result),
    },
    {
      title: "理",
      classical:
        changedClassical &&
        result.changedHexagram.id !== result.originalHexagram.id
          ? [
              {
                label: `经 · 变卦${changedClassical.name}卦辞`,
                text: changedClassical.jing.judgmentOriginal,
              },
              {
                label: `传 · 变卦${changedClassical.name}彖传`,
                text: changedClassical.zhuan.tuanParagraphs,
              },
            ]
          : undefined,
      body: `${result.originalHexagram.coreMeaning} 动爻为 ${movingLineSummary(result)} ${changedText} 这些内容用于观察位置、时机和变化幅度，不作为确定结论。`,
    },
    {
      title: "用",
      body: `${questionType.application} ${result.originalHexagram.application}`,
    },
    {
      title: "问",
      body: firstReflection,
    },
  ];

  if (result.safetyNote) {
    sections.push({
      title: "安全提示",
      body: result.safetyNote,
    });
  }

  sections.push({
    title: "行",
    body: result.originalHexagram.smallAction ?? questionType.action,
  });

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
      aria-pressed={active}
      className={`ui-copy min-h-11 rounded-sm border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion ${
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
  const [setupOpen, setSetupOpen] = useState(true);
  const [classicalReadings, setClassicalReadings] = useState(
    new Map<number, ClassicalReadingAsset>(),
  );
  const [classicalStatus, setClassicalStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const shouldRestoreQuestionFocusRef = useRef(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const canCast = question.trim().length > 0;
  const manualPreviewLines = tupleFromLineKinds(manualLines);
  const manualMovingIndexes = movingIndexesFromLineKinds(manualLines);
  const interpretation = useMemo(
    () => (result ? buildInterpretation(result, classicalReadings) : []),
    [classicalReadings, result],
  );
  const currentStep = result && !setupOpen ? 3 : canCast ? 2 : 1;

  useEffect(() => {
    if (!result) {
      return;
    }

    const controller = new AbortController();
    const ids = Array.from(
      new Set([result.originalHexagram.id, result.changedHexagram.id]),
    );

    Promise.all(
      ids.map(async (id) => {
        const response = await fetch(
          withBasePath(`/classical-readings/${id}.json`),
          {
            cache: "force-cache",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`经传静态资产读取失败：${response.status}`);
        }

        const payload = (await response.json()) as ClassicalReadingAsset;

        if (
          payload.schemaVersion !== 1 ||
          payload.id !== id ||
          payload.jing.lineTexts.length !== 6 ||
          payload.zhuan.smallImageTexts.length !== 6
        ) {
          throw new Error(`第 ${id} 卦经传静态资产结构不完整。`);
        }

        return [id, payload] as const;
      }),
    )
      .then((entries) => {
        setClassicalReadings(new Map(entries));
        setClassicalStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setClassicalReadings(new Map());
        setClassicalStatus("error");
      });

    return () => controller.abort();
  }, [result]);

  useEffect(() => {
    if (!result || setupOpen) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    resultHeadingRef.current?.focus({ preventScroll: true });
    resultHeadingRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [result, setupOpen]);

  useEffect(() => {
    if (!setupOpen || !shouldRestoreQuestionFocusRef.current) {
      return;
    }

    questionRef.current?.focus();
    shouldRestoreQuestionFocusRef.current = false;
  }, [setupOpen]);

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

    const nextResult = createReadingResult({
      question: question.trim(),
      questionType,
      method: nextMethod,
      lineKinds: nextLineKinds,
    });

    setMessage("");
    setClassicalReadings(new Map());
    setClassicalStatus("loading");
    setResult(nextResult);
    setSetupOpen(false);
  }

  function randomCast() {
    const randomLines = Array.from({ length: 6 }, castRandomLine) as LineKindTuple;
    setManualLines(randomLines);
    castWithLines(randomLines, "random");
  }

  function reopenSetup() {
    shouldRestoreQuestionFocusRef.current = true;
    setSetupOpen(true);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
      <ol
        className="grid grid-cols-3 gap-2 rounded-sm border border-mist/70 bg-paper/70 p-2 sm:gap-4 sm:p-3"
        aria-label="问卦进度"
      >
        {readingSteps.map((step) => {
          const active = step.id === currentStep;
          const complete = step.id < currentStep;

          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className={`ui-copy flex min-h-12 items-center gap-2 rounded-sm px-2 text-sm transition sm:px-4 ${
                active
                  ? "bg-ink text-paper"
                  : complete
                    ? "bg-paper-deep/70 text-ink"
                    : "text-ink-soft"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs ${
                  active
                    ? "border-paper/45"
                    : complete
                      ? "border-vermilion text-vermilion"
                      : "border-mist"
                }`}
                aria-hidden="true"
              >
                {complete ? "✓" : step.id}
              </span>
              <span>{step.label}</span>
            </li>
          );
        })}
      </ol>

      <aside
        aria-label="专业支持说明"
        className="mt-4 border-l-2 border-vermilion/45 bg-paper-deep/35 px-4 py-3 text-sm leading-6 text-ink-soft"
      >
        {PROFESSIONAL_SUPPORT_NOTICE}
      </aside>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-5">
          {setupOpen || !result ? (
            <>
              <div
                id="ask-setup"
                className="rounded-sm border border-mist/70 bg-paper/75 p-5"
              >
                <label
                  htmlFor="question"
                  className="ui-copy text-sm font-medium text-ink"
                >
                  你的问题
                </label>
                <textarea
                  id="question"
                  ref={questionRef}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="ui-copy mt-3 min-h-32 w-full resize-none rounded-sm border border-mist bg-paper-deep/55 p-4 text-base leading-7 text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-vermilion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
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
                        aria-pressed={questionType === type.id}
                        className={`ui-copy min-h-10 rounded-sm border px-3 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion ${
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
                      手动成卦
                    </MethodButton>
                    <MethodButton
                      active={method === "random"}
                      onClick={() => setMethod("random")}
                    >
                      随机起卦
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
                        <h2 className="text-2xl font-semibold text-ink">
                          手动成卦
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-ink-soft">
                          点击每一爻循环：阴、阳、老阴、老阳。数据顺序为自下而上。
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setManualLines(initialManualLines)}
                        className="ui-copy rounded-sm border border-mist px-3 py-2 text-xs text-ink-soft transition hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
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
                              className="grid grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] items-center gap-3 rounded-sm border border-mist/70 bg-paper-deep/35 px-3 py-2 text-left transition hover:border-ink focus:border-vermilion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
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
                                  meta.moving
                                    ? "text-vermilion"
                                    : "text-ink-soft"
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
                      className="ui-copy mt-6 min-h-12 w-full rounded-sm bg-vermilion px-5 text-base font-medium text-paper transition hover:bg-[#962f26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion disabled:cursor-not-allowed disabled:bg-wash disabled:text-ink-soft"
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
                      className="ui-copy mt-6 min-h-12 w-full rounded-sm bg-vermilion px-5 text-base font-medium text-paper transition hover:bg-[#962f26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion disabled:cursor-not-allowed disabled:bg-wash disabled:text-ink-soft"
                    >
                      随机生成六爻
                    </button>
                  </>
                )}

                {message ? (
                  <p className="mt-4 text-sm leading-6 text-vermilion">
                    {message}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <aside className="rounded-sm border border-mist/70 bg-paper/75 p-5 lg:sticky lg:top-24">
              <p className="ui-copy text-xs tracking-[0.16em] text-vermilion">
                本次所问
              </p>
              <p className="mt-3 leading-7 text-ink">{result.question}</p>
              <p className="ui-copy mt-4 text-sm text-ink-soft">
                {getQuestionType(result.questionType).label} ·{" "}
                {result.method === "manual" ? "手动成卦" : "随机起卦"}
              </p>
              <button
                type="button"
                onClick={reopenSetup}
                aria-controls="ask-setup"
                aria-expanded={setupOpen}
                className="ui-copy mt-6 min-h-11 w-full rounded-sm border border-ink px-4 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
              >
                修改问题与重新起卦
              </button>
              <a
                href="#reading-action"
                className="ui-copy mt-3 flex min-h-11 items-center justify-center rounded-sm text-sm text-vermilion underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
              >
                直达这一卦的「行」
              </a>
            </aside>
          )}
        </div>

        <div className="space-y-5">
        {result ? (
          <>
            <div className="rounded-sm border border-mist/70 bg-paper/75 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="ui-copy text-xs font-medium tracking-[0.18em] text-vermilion">
                    观卦结果
                  </p>
                  <h2
                    ref={resultHeadingRef}
                    tabIndex={-1}
                    className="mt-2 scroll-mt-24 text-2xl font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-vermilion/55"
                  >
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
              <p
                className="ui-copy mt-3 text-xs leading-5 text-ink-soft"
                role="status"
                aria-live="polite"
              >
                {classicalStatus === "loading"
                  ? "正在从本地静态资料载入本卦与变卦经传……"
                  : classicalStatus === "ready"
                    ? "已载入卦辞、彖传、大象及对应动爻的小象。"
                    : classicalStatus === "error"
                      ? "经传资料暂未载入；产品原创反思仍可正常使用。"
                      : ""}
              </p>

              <nav
                className="ui-copy mt-5 flex flex-wrap gap-x-4 gap-y-2 border-y border-mist/70 py-3 text-sm"
                aria-label="解释章节"
              >
                {interpretation.map((section) => (
                  <a
                    key={section.title}
                    href={`#reading-${interpretationSectionIds[section.title]}`}
                    className={
                      section.title === "行"
                        ? "text-vermilion underline-offset-4 hover:underline"
                        : "text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                    }
                  >
                    {section.title}
                  </a>
                ))}
              </nav>

              <div className="mt-2">
                {interpretation.map((section) => {
                  const isAction = section.title === "行";
                  const isSafety = section.title === "安全提示";

                  return (
                    <section
                      key={section.title}
                      id={`reading-${interpretationSectionIds[section.title]}`}
                      className={`scroll-mt-24 border-b p-4 sm:p-5 ${
                        isAction
                          ? "mt-4 rounded-sm border-transparent bg-ink text-paper"
                          : isSafety
                            ? "mt-4 rounded-sm border border-vermilion/35 bg-vermilion/[0.04]"
                            : "border-mist/70"
                      }`}
                    >
                      <h3
                        className={`text-xl font-semibold ${
                          isAction ? "text-paper" : "text-ink"
                        }`}
                      >
                        {section.title}
                        {isAction ? (
                          <span className="ui-copy ml-3 text-xs font-normal tracking-[0.12em] text-paper/60">
                            一步即可
                          </span>
                        ) : null}
                      </h3>
                      {section.classical?.length ? (
                        <div className="mt-4 space-y-4 border-y border-mist/60 py-4">
                          {section.classical.map((passage) => (
                            <div key={passage.label}>
                              <p className="ui-copy text-xs tracking-[0.14em] text-ink-soft/75">
                                {passage.label}
                              </p>
                              <blockquote className="mt-2 text-lg leading-8 text-ink">
                                {Array.isArray(passage.text) ? (
                                  <div className="space-y-2">
                                    {passage.text.map((paragraph, index) => (
                                      <p
                                        key={`${index}-${paragraph.slice(0, 16)}`}
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                  </div>
                                ) : (
                                  passage.text
                                )}
                              </blockquote>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {section.classical?.length ? (
                        <p className="ui-copy mt-4 text-xs tracking-[0.14em] text-ink-soft/75">
                          知易解读 · 产品原创
                        </p>
                      ) : null}
                      <p
                        className={`mt-2 leading-7 ${
                          isAction ? "text-paper/80" : "text-ink-soft"
                        }`}
                      >
                        {section.body}
                      </p>
                    </section>
                  );
                })}
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
              写下问题，选择类型和起卦方式。生成后会显示本卦、动爻、变卦与「象、辞、理、用、问、行」六段反思。
            </p>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
