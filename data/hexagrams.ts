import { trigramsById } from "./trigrams";

export type Hexagram = {
  id: number;
  name: string;
  chineseName: string;
  unicodeSymbol?: string;
  upperTrigramId: string;
  lowerTrigramId: string;
  // Lines are stored from bottom to top. 1 = yang, 0 = yin.
  lines: [number, number, number, number, number, number];
  judgmentOriginal?: string;
  judgmentPlain?: string;
  imageText?: string;
  coreMeaning?: string;
  keywords: string[];
  lineTexts?: {
    position: string;
    original?: string;
    plain?: string;
    reflection?: string;
  }[];
  reflectionQuestions?: string[];
};

type HexagramLines = Hexagram["lines"];
type HexagramDraft = Omit<Hexagram, "lines" | "unicodeSymbol"> &
  Partial<Pick<Hexagram, "unicodeSymbol">>;

function hexagramSymbol(id: number) {
  return String.fromCodePoint(0x4dbf + id);
}

function getTrigramLines(id: string) {
  const trigram = trigramsById.get(id);

  if (!trigram) {
    throw new Error(`Unknown trigram id: ${id}`);
  }

  return trigram.binaryLines;
}

function makeLines(lowerTrigramId: string, upperTrigramId: string) {
  return [
    ...getTrigramLines(lowerTrigramId),
    ...getTrigramLines(upperTrigramId),
  ] as HexagramLines;
}

function defineHexagram(hexagram: HexagramDraft): Hexagram {
  return {
    ...hexagram,
    unicodeSymbol: hexagram.unicodeSymbol ?? hexagramSymbol(hexagram.id),
    lines: makeLines(hexagram.lowerTrigramId, hexagram.upperTrigramId),
  };
}

export const hexagrams: Hexagram[] = [
  defineHexagram({
    id: 1,
    name: "Qian",
    chineseName: "乾",
    upperTrigramId: "qian",
    lowerTrigramId: "qian",
    judgmentOriginal: "元亨利贞。",
    judgmentPlain:
      "乾象呈现持续而主动的力量。一个可能的读法是：此时适合保持清明、稳健与负责的行动，而不是急于证明自己。",
    imageText: "天行健，君子以自强不息。",
    coreMeaning:
      "刚健、创始、持续推进。乾提醒人观察行动的方向、节奏与承受力。",
    keywords: ["主动", "刚健", "持续", "创始"],
    lineTexts: [
      {
        position: "初九",
        original: "潜龙勿用。",
        plain: "力量还在积蓄，暂时不必急着显露。",
        reflection: "哪些准备还没有完成？",
      },
      {
        position: "九二",
        original: "见龙在田，利见大人。",
        plain: "能力开始进入可见处，适合向可靠的人请益。",
        reflection: "谁能帮助你校准方向？",
      },
      {
        position: "九三",
        original: "君子终日乾乾，夕惕若厉，无咎。",
        plain: "推进之中需要自省，勤勉之外也要看见风险。",
        reflection: "你正在忽略哪一个警讯？",
      },
      {
        position: "九四",
        original: "或跃在渊，无咎。",
        plain: "处在可进可退的位置，先观察时机再行动。",
        reflection: "现在更需要跃起，还是继续蓄势？",
      },
      {
        position: "九五",
        original: "飞龙在天，利见大人。",
        plain: "力量处在高位，适合承担更清楚的责任。",
        reflection: "你的影响力应当服务于什么？",
      },
      {
        position: "上九",
        original: "亢龙有悔。",
        plain: "过度上行可能带来失衡，强盛时更要知道收束。",
        reflection: "哪里已经从坚定变成了过度？",
      },
    ],
    reflectionQuestions: [
      "这件事真正需要你主动承担的部分是什么？",
      "行动之前，哪些边界需要先确认？",
      "今天可以完成的一个小推进是什么？",
    ],
  }),
  defineHexagram({
    id: 2,
    name: "Kun",
    chineseName: "坤",
    upperTrigramId: "kun",
    lowerTrigramId: "kun",
    judgmentOriginal:
      "元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。",
    judgmentPlain:
      "坤象呈现承载与顺应。一个可能的读法是：此时不必抢先定义一切，先稳定位置、接住现实，再选择合适的跟进方式。",
    imageText: "地势坤，君子以厚德载物。",
    coreMeaning:
      "包容、承载、顺势而成。坤提醒人重视现实条件、协作关系与持续的照料。",
    keywords: ["承载", "顺势", "包容", "协作"],
    lineTexts: [
      {
        position: "初六",
        original: "履霜，坚冰至。",
        plain: "细小迹象值得留意，变化往往从不显眼处开始。",
        reflection: "你已经看到哪些早期信号？",
      },
      {
        position: "六二",
        original: "直方大，不习无不利。",
        plain: "稳定、端正、宽厚，本身就是一种力量。",
        reflection: "怎样做可以更简单、更正直？",
      },
      {
        position: "六三",
        original: "含章可贞。或从王事，无成有终。",
        plain: "才能可以先收在内里，把事情完成比突出自己更重要。",
        reflection: "你是否愿意先把成果交给整体？",
      },
      {
        position: "六四",
        original: "括囊，无咎无誉。",
        plain: "暂时收口、减少表达，可能有助于避免不必要的牵动。",
        reflection: "现在什么话可以先不说？",
      },
      {
        position: "六五",
        original: "黄裳，元吉。",
        plain: "处在中正的位置，温和而可靠的承担会带来稳定。",
        reflection: "你可以怎样把照料落到具体处？",
      },
      {
        position: "上六",
        original: "龙战于野，其血玄黄。",
        plain: "柔顺走到极端也会变成冲突，需要辨认边界。",
        reflection: "哪里已经从包容变成了消耗？",
      },
    ],
    reflectionQuestions: [
      "这件事需要你承载什么，而不是立刻改变什么？",
      "哪些关系或资源可以成为支撑？",
      "今天可以完成的一个照料动作是什么？",
    ],
  }),
  defineHexagram({
    id: 3,
    name: "Zhun",
    chineseName: "屯",
    upperTrigramId: "kan",
    lowerTrigramId: "zhen",
    judgmentOriginal: "元亨利贞。勿用有攸往，利建侯。",
    judgmentPlain:
      "屯象呈现初生时的混乱与阻力。一个可能的读法是：事情刚开始时不宜急着远行，先建立秩序、分清角色、让根基站稳。",
    imageText: "云雷，屯；君子以经纶。",
    coreMeaning:
      "初始、阻滞、整理。屯提醒人把混沌拆成线索，在困难开端中建立可执行的结构。",
    keywords: ["初始", "困难", "整理", "建构"],
    lineTexts: [
      {
        position: "初九",
        original: "磐桓；利居贞，利建侯。",
        plain: "开端徘徊不一定是失败，先稳定位置更重要。",
        reflection: "你需要先建立哪一个基本支点？",
      },
      {
        position: "六二",
        original: "屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字。",
        plain: "阻滞中可能有误会，先分辨来意，再决定是否回应。",
        reflection: "眼前的阻力是真威胁，还是尚未理解的关系？",
      },
      {
        position: "六三",
        original: "即鹿无虞，惟入于林中，君子几不如舍，往吝。",
        plain: "缺少向导时盲目前进，容易进入更复杂的处境。",
        reflection: "你是否在没有足够信息时追逐目标？",
      },
      {
        position: "六四",
        original: "乘马班如，求婚媾，往吉，无不利。",
        plain: "愿意求助与连接，可能让停滞重新移动。",
        reflection: "谁是你可以主动沟通的人？",
      },
      {
        position: "九五",
        original: "屯其膏，小贞吉，大贞凶。",
        plain: "资源被卡住时，先处理小范围的稳定，不宜立刻放大。",
        reflection: "哪一个小问题先解决，会让局面松动？",
      },
      {
        position: "上六",
        original: "乘马班如，泣血涟如。",
        plain: "长期停滞会带来消耗，需要承认情绪并重新选择路径。",
        reflection: "你是否需要停下来重新整理，而不是继续硬撑？",
      },
    ],
    reflectionQuestions: [
      "这件事目前最混乱的部分是什么？",
      "哪个角色、步骤或边界需要先被明确？",
      "今天可以完成的一个整理动作是什么？",
    ],
  }),
  defineHexagram({
    id: 4,
    name: "Meng",
    chineseName: "蒙",
    upperTrigramId: "gen",
    lowerTrigramId: "kan",
    keywords: ["启蒙", "求学", "边界"],
  }),
  defineHexagram({
    id: 5,
    name: "Xu",
    chineseName: "需",
    upperTrigramId: "kan",
    lowerTrigramId: "qian",
    keywords: ["等待", "滋养", "时机"],
  }),
  defineHexagram({
    id: 6,
    name: "Song",
    chineseName: "讼",
    upperTrigramId: "qian",
    lowerTrigramId: "kan",
    keywords: ["争讼", "分歧", "审慎"],
  }),
  defineHexagram({
    id: 7,
    name: "Shi",
    chineseName: "师",
    upperTrigramId: "kun",
    lowerTrigramId: "kan",
    keywords: ["组织", "纪律", "协作"],
  }),
  defineHexagram({
    id: 8,
    name: "Bi",
    chineseName: "比",
    upperTrigramId: "kan",
    lowerTrigramId: "kun",
    keywords: ["亲比", "连接", "信任"],
  }),
  defineHexagram({
    id: 9,
    name: "Xiao Chu",
    chineseName: "小畜",
    upperTrigramId: "xun",
    lowerTrigramId: "qian",
    keywords: ["小蓄", "涵养", "渐进"],
  }),
  defineHexagram({
    id: 10,
    name: "Lu",
    chineseName: "履",
    upperTrigramId: "qian",
    lowerTrigramId: "dui",
    keywords: ["履行", "谨慎", "礼"],
  }),
  defineHexagram({
    id: 11,
    name: "Tai",
    chineseName: "泰",
    upperTrigramId: "kun",
    lowerTrigramId: "qian",
    keywords: ["通泰", "交流", "平衡"],
  }),
  defineHexagram({
    id: 12,
    name: "Pi",
    chineseName: "否",
    upperTrigramId: "qian",
    lowerTrigramId: "kun",
    keywords: ["闭塞", "隔阂", "守正"],
  }),
  defineHexagram({
    id: 13,
    name: "Tong Ren",
    chineseName: "同人",
    upperTrigramId: "qian",
    lowerTrigramId: "li",
    keywords: ["同人", "共同", "开放"],
  }),
  defineHexagram({
    id: 14,
    name: "Da You",
    chineseName: "大有",
    upperTrigramId: "li",
    lowerTrigramId: "qian",
    keywords: ["丰盛", "所有", "责任"],
  }),
  defineHexagram({
    id: 15,
    name: "Qian",
    chineseName: "谦",
    upperTrigramId: "kun",
    lowerTrigramId: "gen",
    keywords: ["谦逊", "节制", "低处"],
  }),
  defineHexagram({
    id: 16,
    name: "Yu",
    chineseName: "豫",
    upperTrigramId: "zhen",
    lowerTrigramId: "kun",
    keywords: ["豫乐", "准备", "响应"],
  }),
  defineHexagram({
    id: 17,
    name: "Sui",
    chineseName: "随",
    upperTrigramId: "dui",
    lowerTrigramId: "zhen",
    keywords: ["随顺", "跟随", "调整"],
  }),
  defineHexagram({
    id: 18,
    name: "Gu",
    chineseName: "蛊",
    upperTrigramId: "gen",
    lowerTrigramId: "xun",
    keywords: ["修弊", "更新", "清理"],
  }),
  defineHexagram({
    id: 19,
    name: "Lin",
    chineseName: "临",
    upperTrigramId: "kun",
    lowerTrigramId: "dui",
    keywords: ["临近", "关照", "增长"],
  }),
  defineHexagram({
    id: 20,
    name: "Guan",
    chineseName: "观",
    upperTrigramId: "xun",
    lowerTrigramId: "kun",
    keywords: ["观察", "观照", "示范"],
  }),
  defineHexagram({
    id: 21,
    name: "Shi He",
    chineseName: "噬嗑",
    upperTrigramId: "li",
    lowerTrigramId: "zhen",
    keywords: ["决断", "咬合", "规则"],
  }),
  defineHexagram({
    id: 22,
    name: "Bi",
    chineseName: "贲",
    upperTrigramId: "gen",
    lowerTrigramId: "li",
    keywords: ["修饰", "文采", "适度"],
  }),
  defineHexagram({
    id: 23,
    name: "Bo",
    chineseName: "剥",
    upperTrigramId: "gen",
    lowerTrigramId: "kun",
    keywords: ["剥落", "消减", "止损"],
  }),
  defineHexagram({
    id: 24,
    name: "Fu",
    chineseName: "复",
    upperTrigramId: "kun",
    lowerTrigramId: "zhen",
    keywords: ["返回", "复苏", "循环"],
  }),
  defineHexagram({
    id: 25,
    name: "Wu Wang",
    chineseName: "无妄",
    upperTrigramId: "qian",
    lowerTrigramId: "zhen",
    keywords: ["无妄", "真诚", "自然"],
  }),
  defineHexagram({
    id: 26,
    name: "Da Chu",
    chineseName: "大畜",
    upperTrigramId: "gen",
    lowerTrigramId: "qian",
    keywords: ["蓄积", "制止", "培养"],
  }),
  defineHexagram({
    id: 27,
    name: "Yi",
    chineseName: "颐",
    upperTrigramId: "gen",
    lowerTrigramId: "zhen",
    keywords: ["滋养", "言行", "自养"],
  }),
  defineHexagram({
    id: 28,
    name: "Da Guo",
    chineseName: "大过",
    upperTrigramId: "dui",
    lowerTrigramId: "xun",
    keywords: ["过重", "承担", "非常"],
  }),
  defineHexagram({
    id: 29,
    name: "Kan",
    chineseName: "坎",
    upperTrigramId: "kan",
    lowerTrigramId: "kan",
    keywords: ["险陷", "练习", "守心"],
  }),
  defineHexagram({
    id: 30,
    name: "Li",
    chineseName: "离",
    upperTrigramId: "li",
    lowerTrigramId: "li",
    keywords: ["光明", "依附", "清晰"],
  }),
  defineHexagram({
    id: 31,
    name: "Xian",
    chineseName: "咸",
    upperTrigramId: "dui",
    lowerTrigramId: "gen",
    keywords: ["感应", "互相", "柔和"],
  }),
  defineHexagram({
    id: 32,
    name: "Heng",
    chineseName: "恒",
    upperTrigramId: "zhen",
    lowerTrigramId: "xun",
    keywords: ["恒常", "持续", "关系"],
  }),
  defineHexagram({
    id: 33,
    name: "Dun",
    chineseName: "遁",
    upperTrigramId: "qian",
    lowerTrigramId: "gen",
    keywords: ["退避", "保全", "距离"],
  }),
  defineHexagram({
    id: 34,
    name: "Da Zhuang",
    chineseName: "大壮",
    upperTrigramId: "zhen",
    lowerTrigramId: "qian",
    keywords: ["大壮", "力量", "节制"],
  }),
  defineHexagram({
    id: 35,
    name: "Jin",
    chineseName: "晋",
    upperTrigramId: "li",
    lowerTrigramId: "kun",
    keywords: ["晋升", "显明", "推进"],
  }),
  defineHexagram({
    id: 36,
    name: "Ming Yi",
    chineseName: "明夷",
    upperTrigramId: "kun",
    lowerTrigramId: "li",
    keywords: ["明伤", "隐藏", "守护"],
  }),
  defineHexagram({
    id: 37,
    name: "Jia Ren",
    chineseName: "家人",
    upperTrigramId: "xun",
    lowerTrigramId: "li",
    keywords: ["家人", "秩序", "内在"],
  }),
  defineHexagram({
    id: 38,
    name: "Kui",
    chineseName: "睽",
    upperTrigramId: "li",
    lowerTrigramId: "dui",
    keywords: ["分歧", "异同", "对照"],
  }),
  defineHexagram({
    id: 39,
    name: "Jian",
    chineseName: "蹇",
    upperTrigramId: "kan",
    lowerTrigramId: "gen",
    keywords: ["蹇难", "阻滞", "转向"],
  }),
  defineHexagram({
    id: 40,
    name: "Xie",
    chineseName: "解",
    upperTrigramId: "zhen",
    lowerTrigramId: "kan",
    keywords: ["解除", "释放", "缓解"],
  }),
  defineHexagram({
    id: 41,
    name: "Sun",
    chineseName: "损",
    upperTrigramId: "gen",
    lowerTrigramId: "dui",
    keywords: ["减损", "取舍", "真诚"],
  }),
  defineHexagram({
    id: 42,
    name: "Yi",
    chineseName: "益",
    upperTrigramId: "xun",
    lowerTrigramId: "zhen",
    keywords: ["增益", "帮助", "成长"],
  }),
  defineHexagram({
    id: 43,
    name: "Guai",
    chineseName: "夬",
    upperTrigramId: "dui",
    lowerTrigramId: "qian",
    keywords: ["决断", "表达", "去除"],
  }),
  defineHexagram({
    id: 44,
    name: "Gou",
    chineseName: "姤",
    upperTrigramId: "qian",
    lowerTrigramId: "xun",
    keywords: ["相遇", "诱发", "警觉"],
  }),
  defineHexagram({
    id: 45,
    name: "Cui",
    chineseName: "萃",
    upperTrigramId: "dui",
    lowerTrigramId: "kun",
    keywords: ["聚集", "凝聚", "共同"],
  }),
  defineHexagram({
    id: 46,
    name: "Sheng",
    chineseName: "升",
    upperTrigramId: "kun",
    lowerTrigramId: "xun",
    keywords: ["上升", "积累", "生长"],
  }),
  defineHexagram({
    id: 47,
    name: "Kun",
    chineseName: "困",
    upperTrigramId: "dui",
    lowerTrigramId: "kan",
    keywords: ["困顿", "限制", "守志"],
  }),
  defineHexagram({
    id: 48,
    name: "Jing",
    chineseName: "井",
    upperTrigramId: "kan",
    lowerTrigramId: "xun",
    keywords: ["井养", "资源", "持续"],
  }),
  defineHexagram({
    id: 49,
    name: "Ge",
    chineseName: "革",
    upperTrigramId: "dui",
    lowerTrigramId: "li",
    keywords: ["变革", "更新", "时机"],
  }),
  defineHexagram({
    id: 50,
    name: "Ding",
    chineseName: "鼎",
    upperTrigramId: "li",
    lowerTrigramId: "xun",
    keywords: ["鼎新", "承载", "转化"],
  }),
  defineHexagram({
    id: 51,
    name: "Zhen",
    chineseName: "震",
    upperTrigramId: "zhen",
    lowerTrigramId: "zhen",
    keywords: ["震动", "惊醒", "行动"],
  }),
  defineHexagram({
    id: 52,
    name: "Gen",
    chineseName: "艮",
    upperTrigramId: "gen",
    lowerTrigramId: "gen",
    keywords: ["止息", "稳定", "边界"],
  }),
  defineHexagram({
    id: 53,
    name: "Jian",
    chineseName: "渐",
    upperTrigramId: "xun",
    lowerTrigramId: "gen",
    keywords: ["渐进", "成长", "次第"],
  }),
  defineHexagram({
    id: 54,
    name: "Gui Mei",
    chineseName: "归妹",
    upperTrigramId: "zhen",
    lowerTrigramId: "dui",
    keywords: ["归妹", "关系", "位置"],
  }),
  defineHexagram({
    id: 55,
    name: "Feng",
    chineseName: "丰",
    upperTrigramId: "zhen",
    lowerTrigramId: "li",
    keywords: ["丰盛", "明盛", "盛极"],
  }),
  defineHexagram({
    id: 56,
    name: "Lu",
    chineseName: "旅",
    upperTrigramId: "li",
    lowerTrigramId: "gen",
    keywords: ["旅居", "暂处", "谨慎"],
  }),
  defineHexagram({
    id: 57,
    name: "Xun",
    chineseName: "巽",
    upperTrigramId: "xun",
    lowerTrigramId: "xun",
    keywords: ["入微", "顺入", "渗透"],
  }),
  defineHexagram({
    id: 58,
    name: "Dui",
    chineseName: "兑",
    upperTrigramId: "dui",
    lowerTrigramId: "dui",
    keywords: ["悦泽", "沟通", "开放"],
  }),
  defineHexagram({
    id: 59,
    name: "Huan",
    chineseName: "涣",
    upperTrigramId: "xun",
    lowerTrigramId: "kan",
    keywords: ["涣散", "解开", "流动"],
  }),
  defineHexagram({
    id: 60,
    name: "Jie",
    chineseName: "节",
    upperTrigramId: "kan",
    lowerTrigramId: "dui",
    keywords: ["节制", "界限", "制度"],
  }),
  defineHexagram({
    id: 61,
    name: "Zhong Fu",
    chineseName: "中孚",
    upperTrigramId: "xun",
    lowerTrigramId: "dui",
    keywords: ["中孚", "信实", "内诚"],
  }),
  defineHexagram({
    id: 62,
    name: "Xiao Guo",
    chineseName: "小过",
    upperTrigramId: "zhen",
    lowerTrigramId: "gen",
    keywords: ["小过", "谨小", "过度"],
  }),
  defineHexagram({
    id: 63,
    name: "Ji Ji",
    chineseName: "既济",
    upperTrigramId: "kan",
    lowerTrigramId: "li",
    keywords: ["既济", "完成", "调整"],
  }),
  defineHexagram({
    id: 64,
    name: "Wei Ji",
    chineseName: "未济",
    upperTrigramId: "li",
    lowerTrigramId: "kan",
    keywords: ["未济", "未成", "过渡"],
  }),
];

export const hexagramsById = new Map(
  hexagrams.map((hexagram) => [hexagram.id, hexagram]),
);
