export type HighStakesArea =
  | "medical"
  | "legal"
  | "financial"
  | "mentalHealth";

const areaRules: Record<HighStakesArea, readonly string[]> = {
  medical: [
    "医疗",
    "健康",
    "疾病",
    "症状",
    "诊断",
    "治疗",
    "药物",
    "手术",
    "怀孕",
    "医生",
    "医院",
    "medical",
    "diagnosis",
    "treatment",
    "medication",
  ],
  legal: [
    "法律",
    "律师",
    "诉讼",
    "合同",
    "犯罪",
    "报警",
    "离婚",
    "继承",
    "签证",
    "legal",
    "lawyer",
    "lawsuit",
    "contract",
    "crime",
    "visa",
  ],
  financial: [
    "投资",
    "股票",
    "基金",
    "加密货币",
    "贷款",
    "债务",
    "借钱",
    "买房",
    "理财",
    "保险",
    "退休金",
    "financial",
    "invest",
    "stock",
    "crypto",
    "loan",
    "debt",
  ],
  mentalHealth: [
    "心理健康",
    "心理咨询",
    "精神健康",
    "抑郁",
    "焦虑",
    "恐慌",
    "自杀",
    "自残",
    "活不下去",
    "mental health",
    "therapy",
    "depression",
    "anxiety",
    "panic",
    "suicide",
    "self-harm",
  ],
};

const areaLabels: Record<HighStakesArea, string> = {
  medical: "医疗或健康",
  legal: "法律",
  financial: "财务",
  mentalHealth: "心理健康",
};

export function detectHighStakesAreas(question: string): HighStakesArea[] {
  const normalized = question.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return (Object.keys(areaRules) as HighStakesArea[]).filter((area) =>
    areaRules[area].some((keyword) => normalized.includes(keyword)),
  );
}

export function getHighStakesSafetyNote(question: string): string | undefined {
  const areas = detectHighStakesAreas(question);

  if (areas.length === 0) {
    return undefined;
  }

  const labels = areas.map((area) => areaLabels[area]).join("、");
  const urgentNote = areas.includes("mentalHealth")
    ? "如果你或他人正处于立即危险中，请立刻联系当地紧急服务或可信赖的人。"
    : "";

  return `这个问题可能涉及${labels}。卦象只能作为整理思路的反思工具，不能代替合格专业人士的评估或建议。请把现实证据与专业意见作为行动依据。${urgentNote}`;
}
