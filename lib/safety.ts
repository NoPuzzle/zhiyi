export type HighStakesArea =
  | "medical"
  | "legal"
  | "financial"
  | "mentalHealth";

export const PROFESSIONAL_SUPPORT_NOTICE =
  "如果问题涉及医疗、法律、财务或心理健康，请把卦象只作为整理思路的参考，并寻求相应合格专业人士的评估与支持。";

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
    "mental health",
    "therapy",
    "depression",
    "anxiety",
    "panic",
  ],
};

const mentalHealthCrisisRules = [
  "自杀",
  "自殺",
  "自残",
  "自殘",
  "轻生",
  "輕生",
  "寻死",
  "尋死",
  "想死",
  "不想活",
  "活不下去",
  "结束生命",
  "結束生命",
  "了结生命",
  "了結生命",
  "伤害自己",
  "傷害自己",
  "割腕",
  "一死了之",
  "活着没意思",
  "活著沒意思",
  "活着沒意思",
  "活着没有意义",
  "活著沒有意義",
  "活着沒有意義",
  "suicide",
  "suicidal",
  "self-harm",
  "self harm",
  "kill myself",
  "end my life",
  "end it all",
  "take my own life",
  "don't want to live",
  "do not want to live",
  "not worth living",
  "hurt myself",
  "harm myself",
  "want to die",
  "wish i were dead",
  "better off dead",
  "no reason to live",
  "ending my life",
] as const;

const areaLabels: Record<HighStakesArea, string> = {
  medical: "医疗或健康",
  legal: "法律",
  financial: "财务",
  mentalHealth: "心理健康",
};

function normalizeSafetyQuestion(question: string): string {
  // Normalize input typography only; this remains bounded keyword matching,
  // not a diagnosis or a broader interpretation of the user's intent.
  return question
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u201b\u02bc]/g, "'")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function hasMentalHealthCrisis(normalizedQuestion: string) {
  return mentalHealthCrisisRules.some((keyword) =>
    normalizedQuestion.includes(keyword),
  );
}

export function detectHighStakesAreas(question: string): HighStakesArea[] {
  const normalized = normalizeSafetyQuestion(question);

  if (!normalized) {
    return [];
  }

  const mentalHealthCrisis = hasMentalHealthCrisis(normalized);

  return (Object.keys(areaRules) as HighStakesArea[]).filter(
    (area) =>
      areaRules[area].some((keyword) => normalized.includes(keyword)) ||
      (area === "mentalHealth" && mentalHealthCrisis),
  );
}

export function getHighStakesSafetyNote(question: string): string | undefined {
  const normalized = normalizeSafetyQuestion(question);
  const areas = detectHighStakesAreas(question);

  if (areas.length === 0) {
    return undefined;
  }

  const labels = areas.map((area) => areaLabels[area]).join("、");
  const isMentalHealthCrisis = hasMentalHealthCrisis(normalized);
  const urgentNote = isMentalHealthCrisis
    ? "如果你或他人正有伤害自己或结束生命的念头，或正处于立即危险中，请立即联系当地紧急服务、危机热线或可信赖的人，不要独自承担。"
    : "";

  return `这个问题可能涉及${labels}。卦象只能作为整理思路的反思工具，不能代替合格专业人士的评估或建议。请把现实证据与专业意见作为行动依据。${urgentNote}`;
}
