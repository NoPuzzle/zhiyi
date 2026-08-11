import {
  getAuthoredContentReview,
  type AuthoredContentReview,
} from "./content-reviews";
import { hexagramContentPatches } from "./hexagram-content";
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
  judgmentPlain?: string;
  imageObservation?: string;
  coreMeaning?: string;
  application?: string;
  authoredReview: AuthoredContentReview;
  keywords: string[];
  lineTexts?: {
    position: string;
    plain?: string;
    reflection?: string;
  }[];
  reflectionQuestions?: string[];
  smallAction?: string;
};

type HexagramLines = Hexagram["lines"];
type HexagramDraft = Omit<
  Hexagram,
  "lines" | "unicodeSymbol" | "authoredReview"
> &
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
  const lines = makeLines(hexagram.lowerTrigramId, hexagram.upperTrigramId);
  const contentPatch = hexagramContentPatches[hexagram.id];
  const authoredReview = getAuthoredContentReview(hexagram.id);
  const linePlaceLabels = ["初", "二", "三", "四", "五", "上"];
  const patchedLineTexts = contentPatch?.lineTexts.map((lineText, index) => {
    const lineValue = lines[index];
    const position =
      lineText.position ??
      (index === 0
        ? lineValue === 1
          ? "初九"
          : "初六"
        : index === 5
          ? lineValue === 1
            ? "上九"
            : "上六"
          : `${lineValue === 1 ? "九" : "六"}${linePlaceLabels[index]}`);

    return {
      ...lineText,
      position,
    };
  });

  return {
    ...hexagram,
    ...contentPatch,
    authoredReview,
    lineTexts: patchedLineTexts ?? hexagram.lineTexts,
    unicodeSymbol: hexagram.unicodeSymbol ?? hexagramSymbol(hexagram.id),
    lines,
  };
}

export const hexagrams: Hexagram[] = [
  defineHexagram({
    id: 1,
    name: "Qian",
    chineseName: "乾",
    upperTrigramId: "qian",
    lowerTrigramId: "qian",
    judgmentPlain:
      "乾象呈现持续而主动的力量。一个可能的读法是：此时适合保持清明、稳健与负责的行动，而不是急于证明自己。",
    imageObservation:
      "上下皆天，六爻纯阳，像开阔天穹中的力量持续运行。它强调的不是一味加速，而是让行动有方向、有节律，也知道何时收束。",
    coreMeaning:
      "刚健、创始、持续推进。乾提醒人观察行动的方向、节奏与承受力。",
    application:
      "面对需要主动承担的处境，可以先确认方向与分寸，再把持续推进落实为一个今天能做完的步骤。",
    keywords: ["主动", "刚健", "持续", "创始"],
    lineTexts: [
      {
        position: "初九",
        plain: "力量还在积蓄，暂时不必急着显露。",
        reflection: "哪些准备还没有完成？",
      },
      {
        position: "九二",
        plain: "能力开始进入可见处，适合向可靠的人请益。",
        reflection: "谁能帮助你看清方向？",
      },
      {
        position: "九三",
        plain: "推进之中需要自省，勤勉之外也要看见风险。",
        reflection: "你正在忽略哪一个警讯？",
      },
      {
        position: "九四",
        plain: "处在可进可退的位置，先观察时机再行动。",
        reflection: "现在更需要跃起，还是继续蓄势？",
      },
      {
        position: "九五",
        plain: "力量处在高位，适合承担更清楚的责任。",
        reflection: "你的影响力应当服务于什么？",
      },
      {
        position: "上九",
        plain: "过度上行可能带来失衡，强盛时更要知道收束。",
        reflection: "哪里已经从坚定变成了过度？",
      },
    ],
    reflectionQuestions: [
      "这件事真正需要你主动承担的部分是什么？",
      "行动之前，哪些边界需要先确认？",
      "今天可以完成的一个小推进是什么？",
    ],
    smallAction: "选定一件今天能够完成的小事，写下最小成果并开始第一步。",
  }),
  defineHexagram({
    id: 2,
    name: "Kun",
    chineseName: "坤",
    upperTrigramId: "kun",
    lowerTrigramId: "kun",
    judgmentPlain:
      "坤象呈现承载与顺应。一个可能的读法是：此时不必抢先定义一切，先稳定位置、接住现实，再选择合适的跟进方式。",
    imageObservation:
      "上下皆地，六爻皆阴，像广阔地势安静承接万物。它让人看见容纳、照料和长期支持所形成的力量。",
    coreMeaning:
      "包容、承载、顺势而成。坤提醒人重视现实条件、彼此关系与持续的照料。",
    application:
      "当局面需要稳定与支持时，可以先接住最真实的需要，再决定自己能照料到哪里。",
    keywords: ["承载", "顺势", "包容", "相助"],
    lineTexts: [
      {
        position: "初六",
        plain: "细小迹象值得留意，变化往往从不显眼处开始。",
        reflection: "你已经看到哪些早期信号？",
      },
      {
        position: "六二",
        plain: "稳定、端正、宽厚，本身就是一种力量。",
        reflection: "怎样做可以更简单、更正直？",
      },
      {
        position: "六三",
        plain: "才能可以先收在内里，把事情完成比突出自己更重要。",
        reflection: "你是否愿意先把成果交给整体？",
      },
      {
        position: "六四",
        plain: "暂时收口、减少表达，可能有助于避免不必要的牵动。",
        reflection: "现在什么话可以先不说？",
      },
      {
        position: "六五",
        plain: "处在中正的位置，温和而可靠的承担会带来稳定。",
        reflection: "你可以怎样把照料落到具体处？",
      },
      {
        position: "上六",
        plain: "柔顺走到极端也会变成冲突，需要辨认边界。",
        reflection: "哪里已经从包容变成了消耗？",
      },
    ],
    reflectionQuestions: [
      "这件事需要你承载什么，而不是立刻改变什么？",
      "哪些人或现有条件可以成为支撑？",
      "今天可以完成的一个照料动作是什么？",
    ],
    smallAction: "为当前最需要支持的人或事项，完成一个具体而有限的照料动作。",
  }),
  defineHexagram({
    id: 3,
    name: "Zhun",
    chineseName: "屯",
    upperTrigramId: "kan",
    lowerTrigramId: "zhen",
    judgmentPlain:
      "屯象呈现初生时的混乱与阻力。一个可能的读法是：事情刚开始时不宜急着远行，先建立秩序、分清各自位置、让根基站稳。",
    imageObservation:
      "雷在水下发动，像新力量在未明的环境中寻找出口。声势已经出现，但路径仍需要整理。",
    coreMeaning:
      "初始、阻滞、整理。屯提醒人把混沌拆成线索，在困难开端中建立可以依循的次序。",
    application:
      "面对刚开始又线索混杂的事情，可以先划清位置、先后和最小行动范围，而不是急着扩大。",
    keywords: ["初始", "困难", "整理", "建构"],
    lineTexts: [
      {
        position: "初九",
        plain: "开端徘徊不一定是失败，先稳定位置更重要。",
        reflection: "你需要先建立哪一个基本支点？",
      },
      {
        position: "六二",
        plain: "阻滞中可能有误会，先分辨来意，再决定是否回应。",
        reflection: "眼前的阻力是真威胁，还是尚未理解的关系？",
      },
      {
        position: "六三",
        plain: "缺少向导时盲目前进，容易进入更复杂的处境。",
        reflection: "你是否在没有足够信息时追逐目标？",
      },
      {
        position: "六四",
        plain: "愿意求助与连接，可能让停滞重新移动。",
        reflection: "谁是你可以主动沟通的人？",
      },
      {
        position: "九五",
        plain: "力量受阻时，先处理小范围的稳定，不宜立刻放大。",
        reflection: "哪一个小问题先解决，会让局面松动？",
      },
      {
        position: "上六",
        plain: "长期停滞会带来消耗，需要承认情绪并重新选择路径。",
        reflection: "你是否需要停下来重新整理，而不是继续硬撑？",
      },
    ],
    reflectionQuestions: [
      "这件事目前最混乱的部分是什么？",
      "哪个位置、先后或边界需要先被明确？",
      "今天可以完成的一个整理动作是什么？",
    ],
    smallAction: "列出当前最混乱的三件事，只为其中一件写出明确的下一步。",
  }),
  defineHexagram({
    id: 4,
    name: "Meng",
    chineseName: "蒙",
    upperTrigramId: "gen",
    lowerTrigramId: "kan",
    judgmentPlain:
      "蒙呈现路径尚未成形的学习阶段。一个可能的读法是：先把“不知道”说清，接受合宜引导，再用亲手练习检验理解。",
    coreMeaning:
      "在未知中学习，也学习如何求教。蒙提醒人诚实辨认空白，为探索划定范围，并保留修正的余地。",
    keywords: ["启蒙", "求教", "练习"],
    reflectionQuestions: [
      "眼前最需要弄懂的一个基础概念是什么？",
      "你依据什么判断某个引导值得信任？",
      "哪一次小练习可以检验你的理解？",
    ],
    smallAction:
      "用十分钟为一个尚未弄清的概念写三句解释，再查一个可靠来源核对。",
  }),
  defineHexagram({
    id: 5,
    name: "Xu",
    chineseName: "需",
    upperTrigramId: "kan",
    lowerTrigramId: "qian",
    judgmentPlain:
      "需呈现力量已经聚起、条件仍在成熟。一个可能的读法是：等待不是空白，而是辨认启动信号、保存体力，并完成尚可做的准备。",
    coreMeaning:
      "在未成熟时保持力量。需提醒人既不催促时机，也不把等待变成无期限拖延。",
    keywords: ["等待", "滋养", "时机"],
    reflectionQuestions: [
      "眼前仍在成熟的是时间、信息，还是体力？",
      "等待期间，哪一种力量最需要被照料？",
      "什么可观察的信号出现后，你才准备出发？",
    ],
    smallAction:
      "为一件暂缓事项写下一个可观察的启动信号，并做十分钟相关准备。",
  }),
  defineHexagram({
    id: 6,
    name: "Song",
    chineseName: "讼",
    upperTrigramId: "qian",
    lowerTrigramId: "kan",
    judgmentPlain:
      "讼呈现两种方向彼此拉开，分歧逐渐显形。一个可能的读法是：先把事实、利益与感受分开，并判断继续争执是否仍有意义。",
    coreMeaning:
      "让冲突从胜负回到事实、程序与代价。讼提醒人既要表达立场，也要知道何时停下。",
    keywords: ["分歧", "澄清", "止争"],
    reflectionQuestions: [
      "哪一项事实是双方都能核验的？",
      "这场争执中，你最想保护的是利益、关系还是尊严？",
      "什么条件出现时，你愿意暂停或请第三方介入？",
    ],
    smallAction:
      "在一张纸上各写一项事实、感受和诉求，只向对方核对其中的事实。",
  }),
  defineHexagram({
    id: 7,
    name: "Shi",
    chineseName: "师",
    upperTrigramId: "kun",
    lowerTrigramId: "kan",
    judgmentPlain:
      "师呈现水藏地中，众多力量等待被引导。一个可能的读法是：共同承担需要清楚目的与节度，也需要照看每个人真实承受的压力。",
    coreMeaning:
      "汇聚众力，也约束力量的使用。师提醒带领者贴近现场，让承担、权限与后果彼此相称。",
    keywords: ["众力", "节度", "承担"],
    reflectionQuestions: [
      "众人为何要一起行动？",
      "谁最接近现场，又承担了多少压力？",
      "在哪一种情况下，停下比继续更负责？",
    ],
    smallAction:
      "为眼前的共同事情写下一句目的，以及一句“出现什么情况就停下”，请参与的人看看是否一致。",
  }),
  defineHexagram({
    id: 8,
    name: "Bi",
    chineseName: "比",
    upperTrigramId: "kan",
    lowerTrigramId: "kun",
    judgmentPlain:
      "比呈现水在地上汇流，关系沿共同去处逐渐靠近。一个可能的读法是：亲近来自可兑现的信任，也来自愿意让彼此保有选择。",
    coreMeaning:
      "辨认为何靠近，并以真实回应维持连接。比提醒人既不勉强结伴，也不把信任停在口头。",
    keywords: ["亲近", "回应", "信任"],
    reflectionQuestions: [
      "你想靠近这段关系的真实原因是什么？",
      "这段关系中的信任建立在什么经历上？",
      "怎样的距离能同时容纳亲近与自主？",
    ],
    smallAction:
      "联系一位想继续同行的人，只确认彼此愿意共同承担的一件小事。",
  }),
  defineHexagram({
    id: 9,
    name: "Xiao Chu",
    chineseName: "小畜",
    upperTrigramId: "xun",
    lowerTrigramId: "qian",
    judgmentPlain:
      "小畜呈现风在天上轻轻收拢云气，力量尚未落成大雨。一个可能的读法是：先积少成多，让习惯、信用或余量在细处逐渐成形。",
    coreMeaning:
      "以柔和约束保存力量。小畜提醒人尊重尚未成熟的阶段，也留意何时已经积得足够。",
    keywords: ["积蓄", "涵养", "收束"],
    reflectionQuestions: [
      "眼前哪一点轻微牵制值得先被看见？",
      "什么小份量的积累最可能持续？",
      "如果暂时收手，你最担心失去什么？",
    ],
    smallAction:
      "选择一个两分钟可开始的小习惯，今天做一次，并标出明天接续的时间。",
  }),
  defineHexagram({
    id: 10,
    name: "Lu",
    chineseName: "履",
    upperTrigramId: "qian",
    lowerTrigramId: "dui",
    judgmentPlain:
      "履呈现泽在天之下、脚步靠近强大力量。一个可能的读法是：行动仍可继续，但每一步都需要辨认位置、影响与退路。",
    coreMeaning:
      "把原则落实为脚下分寸。履提醒人在力量不对等或后果较大的处境中，保持清醒而不僵住。",
    keywords: ["践履", "分寸", "谨慎"],
    reflectionQuestions: [
      "你即将迈出的这一步可能影响谁？",
      "哪些反馈说明应继续、放慢或停下？",
      "你准备如何为这一步保留退路？",
    ],
    smallAction:
      "在迈出下一步前，写下一个让你停下来重新查看的信号；一旦出现，就先暂停。",
  }),
  defineHexagram({
    id: 11,
    name: "Tai",
    chineseName: "泰",
    upperTrigramId: "kun",
    lowerTrigramId: "qian",
    judgmentPlain:
      "泰让人看见天地相交、上下有来有往。顺畅并非静止不变；继续照看联系，也留意节奏转向的细微信号，可能让通达维持得更久。",
    coreMeaning:
      "通达来自有来有往，也需要在顺境中照看关系与变化。",
    keywords: ["通达", "往来", "调和"],
    reflectionQuestions: [
      "眼下哪些人或事正在有来有往？",
      "这份顺畅最依赖哪一个容易被忽略的条件？",
      "你已经看见什么由盛转变的微小信号？",
    ],
    smallAction:
      "找一位与你同行的人，用十分钟互相说出目前最顺的一处、最担心卡住的一处，以及各自下一步。",
  }),
  defineHexagram({
    id: 12,
    name: "Pi",
    chineseName: "否",
    upperTrigramId: "qian",
    lowerTrigramId: "kun",
    judgmentPlain:
      "否让人看见天地背离、上下难以往来。与其加力强推，不如先守住要紧之处，辨清堵点，并为日后重连留一条路。",
    coreMeaning:
      "闭塞时先停止无效用力，守住原则，并保存再次沟通的可能。",
    keywords: ["闭塞", "守正", "转机"],
    reflectionQuestions: [
      "阻碍来自信息不通、目标不同，还是信任不足？",
      "哪些原则需要守住，哪些做法可以暂停？",
      "哪一个具体迹象会说明局面开始松动？",
    ],
    smallAction:
      "把一个堵点写成“我看到……；我想确认……”两句话，今天向最相关的一人说清。",
  }),
  defineHexagram({
    id: 13,
    name: "Tong Ren",
    chineseName: "同人",
    upperTrigramId: "qian",
    lowerTrigramId: "li",
    judgmentPlain:
      "同人让人看见光明升入开阔之处，人因看清共同方向而靠近。同行若能说清所求，也容得下真实差异，可能比只在熟人之间求同更稳。",
    coreMeaning:
      "共同并非抹去差异，而是在坦诚可见的方向上同行。",
    keywords: ["同行", "坦诚", "开放"],
    reflectionQuestions: [
      "大家真正共享的目标是什么？",
      "哪些差异需要被坦诚表达而不是掩盖？",
      "还有谁会受到这件事影响，却没有机会说话？",
    ],
    smallAction:
      "把你们想一起完成的事写成一句不超过二十字的话，请同行的一人用自己的话复述。",
  }),
  defineHexagram({
    id: 14,
    name: "Da You",
    chineseName: "大有",
    upperTrigramId: "li",
    lowerTrigramId: "qian",
    judgmentPlain:
      "大有让人看见光在高处，已有的能力与条件都更醒目。拥有增多时，值得先问它们该用在哪里，以及自己愿意承担什么责任。",
    coreMeaning:
      "丰盛不只关乎占有，也关乎看清用途、分寸和责任。",
    keywords: ["丰盛", "善用", "责任"],
    reflectionQuestions: [
      "你已经拥有、却还没有真正用上的是什么？",
      "哪些成果需要分享，也需要承认他人的贡献？",
      "眼下哪件事最值得你用上这些条件？",
    ],
    smallAction:
      "写下手边三样可用条件，例如时间、能力或帮助；选一样在今天用于最要紧的一件事，并立即安排十分钟。",
  }),
  defineHexagram({
    id: 15,
    name: "Qian",
    chineseName: "谦",
    upperTrigramId: "kun",
    lowerTrigramId: "gen",
    judgmentPlain:
      "谦让人看见山藏地中，有所成而不必处处显露。较稳妥的做法，是如实看待自己的贡献与局限，也给他人和事实留下位置。",
    coreMeaning:
      "谦逊不是压低自己，而是如实看见长短，让表达、贡献与责任彼此相称。",
    keywords: ["谦逊", "相称", "平衡"],
    reflectionQuestions: [
      "你是否高估或低估了自己的作用？",
      "哪一项成果需要承认他人的贡献？",
      "什么反馈能够帮助你修正判断？",
    ],
    smallAction:
      "请一位了解此事的人指出一个你可能高估或低估自己的地方，今天据此改一处做法。",
  }),
  defineHexagram({
    id: 16,
    name: "Yu",
    chineseName: "豫",
    upperTrigramId: "zhen",
    lowerTrigramId: "kun",
    judgmentPlain:
      "雷声穿出大地，沉睡的力量开始回应。豫邀请人借振奋起步，也查看准备是否跟得上，不让期待独自跑在前面。",
    coreMeaning:
      "振奋需要承接：热情能打开开端，持续则依靠合宜节奏与现实回应。",
    keywords: ["振奋", "预备", "响应"],
    reflectionQuestions: [
      "你看到哪些已经发生的进展，哪些还只是期待？",
      "要让这股热情真正开始，还要补好哪一项准备？",
      "兴奋过去以后，什么做法仍能让你继续？",
    ],
    smallAction:
      "今天为最想推进的事留出二十分钟，只完成第一个看得见的步骤。",
  }),
  defineHexagram({
    id: 17,
    name: "Sui",
    chineseName: "随",
    upperTrigramId: "dui",
    lowerTrigramId: "zhen",
    judgmentPlain:
      "雷在泽下发动，湖面随之回应。随可以理解为：不把自己交给潮流，而是在原则未失时选择值得响应的方向、改变走法。",
    coreMeaning:
      "响应、选择所随、随时调整。灵活若带着自觉，便不等于把方向交给一时气氛。",
    keywords: ["响应", "跟随", "调整"],
    reflectionQuestions: [
      "你正在跟随谁、什么趋势或哪种期待？",
      "哪些原则不应因适应环境而放弃？",
      "眼下什么需要跟着改变，什么必须留下？",
    ],
    smallAction:
      "下一次准备答应别人时，先停十秒，确认它是否符合你要守住的一条原则，再回应。",
  }),
  defineHexagram({
    id: 18,
    name: "Gu",
    chineseName: "蛊",
    upperTrigramId: "gen",
    lowerTrigramId: "xun",
    judgmentPlain:
      "风入山下，积滞之处渐被显出。蛊邀请人沿着痕迹看看问题如何形成，先修自己能够触及的一处，而不是只责怪留下问题的人。",
    coreMeaning:
      "清理积累、追看来路、更新做法。重点不在找人归罪，而在不让旧习照原样延续。",
    keywords: ["积弊", "修复", "更新"],
    reflectionQuestions: [
      "眼前问题是由哪些长期忽略累积而成？",
      "哪些旧做法已经不再适合现在？",
      "修好这一处以后，哪一种日常做法也要随之改变？",
    ],
    smallAction:
      "选一个反复出现的小麻烦，找出最容易改变的一项诱因，并在今天把它移除。",
  }),
  defineHexagram({
    id: 19,
    name: "Lin",
    chineseName: "临",
    upperTrigramId: "kun",
    lowerTrigramId: "dui",
    judgmentPlain:
      "泽水来到地边，彼此已近到可以感受和回应。临邀请人亲自靠近、认真照看，也在热度与增长中保留分寸。",
    coreMeaning:
      "靠近、照看、来往中的分寸。走到近处，才能知道实际需要；真正照看也包括承认自己的限度。",
    keywords: ["临近", "照看", "分寸"],
    reflectionQuestions: [
      "哪件事只有走近一点，才看得清真实处境？",
      "靠近以后，你愿意实际承担什么，又需要在哪里说明限度？",
      "如果这股上升势头转缓，你希望保住什么？",
    ],
    smallAction:
      "今天找一位与你有关的人聊十五分钟，先听完对方的近况，再确认你能帮上的一件小事。",
  }),
  defineHexagram({
    id: 20,
    name: "Guan",
    chineseName: "观",
    upperTrigramId: "xun",
    lowerTrigramId: "kun",
    judgmentPlain:
      "风过大地，许多细小变化连成了可见的形势。观邀请人先分清所见与解释，也留意自己的言行正如何被别人看见。",
    coreMeaning:
      "细看、反观、以身作则。先分清所见和解释，再决定如何回应；自己的行为也始终在被看见。",
    keywords: ["观察", "反观", "示范"],
    reflectionQuestions: [
      "你目前看到的是事实，还是已经加入了解释？",
      "如果站到另一个人的位置，你会多看见什么？",
      "别人从你的日常做法里，会读到什么？",
    ],
    smallAction:
      "选一件正在发生的事，安静看十分钟；只写三条亲眼所见，暂不解释原因。",
  }),
  defineHexagram({
    id: 21,
    name: "Shi He",
    chineseName: "噬嗑",
    upperTrigramId: "li",
    lowerTrigramId: "zhen",
    keywords: ["明辨", "清障", "咬合"],
  }),
  defineHexagram({
    id: 22,
    name: "Bi",
    chineseName: "贲",
    upperTrigramId: "gen",
    lowerTrigramId: "li",
    keywords: ["文质", "显明", "素朴"],
  }),
  defineHexagram({
    id: 23,
    name: "Bo",
    chineseName: "剥",
    upperTrigramId: "gen",
    lowerTrigramId: "kun",
    keywords: ["剥落", "止损", "守根"],
  }),
  defineHexagram({
    id: 24,
    name: "Fu",
    chineseName: "复",
    upperTrigramId: "kun",
    lowerTrigramId: "zhen",
    keywords: ["回返", "复苏", "节律"],
  }),
  defineHexagram({
    id: 25,
    name: "Wu Wang",
    chineseName: "无妄",
    upperTrigramId: "qian",
    lowerTrigramId: "zhen",
    keywords: ["真实", "不妄", "清醒"],
  }),
  defineHexagram({
    id: 26,
    name: "Da Chu",
    chineseName: "大畜",
    upperTrigramId: "gen",
    lowerTrigramId: "qian",
    keywords: ["蓄养", "磨炼", "知止"],
  }),
  defineHexagram({
    id: 27,
    name: "Yi",
    chineseName: "颐",
    upperTrigramId: "gen",
    lowerTrigramId: "zhen",
    keywords: ["滋养", "节制", "慎言"],
  }),
  defineHexagram({
    id: 28,
    name: "Da Guo",
    chineseName: "大过",
    upperTrigramId: "dui",
    lowerTrigramId: "xun",
    keywords: ["重压", "承重", "变通"],
  }),
  defineHexagram({
    id: 29,
    name: "Kan",
    chineseName: "坎",
    upperTrigramId: "kan",
    lowerTrigramId: "kan",
    keywords: ["险阻", "守心", "习练"],
  }),
  defineHexagram({
    id: 30,
    name: "Li",
    chineseName: "离",
    upperTrigramId: "li",
    lowerTrigramId: "li",
    keywords: ["明辨", "依附", "续明"],
  }),
  defineHexagram({
    id: 31,
    name: "Xian",
    chineseName: "咸",
    upperTrigramId: "dui",
    lowerTrigramId: "gen",
    keywords: ["感应", "互悦", "分寸"],
  }),
  defineHexagram({
    id: 32,
    name: "Heng",
    chineseName: "恒",
    upperTrigramId: "zhen",
    lowerTrigramId: "xun",
    keywords: ["恒常", "节律", "守向"],
  }),
  defineHexagram({
    id: 33,
    name: "Dun",
    chineseName: "遁",
    upperTrigramId: "qian",
    lowerTrigramId: "gen",
    keywords: ["退守", "保全", "从容"],
  }),
  defineHexagram({
    id: 34,
    name: "Da Zhuang",
    chineseName: "大壮",
    upperTrigramId: "zhen",
    lowerTrigramId: "qian",
    keywords: ["强健", "节制", "正用"],
  }),
  defineHexagram({
    id: 35,
    name: "Jin",
    chineseName: "晋",
    upperTrigramId: "li",
    lowerTrigramId: "kun",
    keywords: ["进展", "显明", "谦和"],
  }),
  defineHexagram({
    id: 36,
    name: "Ming Yi",
    chineseName: "明夷",
    upperTrigramId: "kun",
    lowerTrigramId: "li",
    keywords: ["藏明", "自护", "守正"],
  }),
  defineHexagram({
    id: 37,
    name: "Jia Ren",
    chineseName: "家人",
    upperTrigramId: "xun",
    lowerTrigramId: "li",
    keywords: ["家道", "照料", "身教"],
  }),
  defineHexagram({
    id: 38,
    name: "Kui",
    chineseName: "睽",
    upperTrigramId: "li",
    lowerTrigramId: "dui",
    keywords: ["分歧", "辨异", "求同"],
  }),
  defineHexagram({
    id: 39,
    name: "Jian",
    chineseName: "蹇",
    upperTrigramId: "kan",
    lowerTrigramId: "gen",
    keywords: ["阻难", "回转", "求助"],
  }),
  defineHexagram({
    id: 40,
    name: "Xie",
    chineseName: "解",
    upperTrigramId: "zhen",
    lowerTrigramId: "kan",
    keywords: ["解除", "收尾", "舒展"],
  }),
  defineHexagram({
    id: 41,
    name: "Sun",
    chineseName: "损",
    upperTrigramId: "gen",
    lowerTrigramId: "dui",
    keywords: ["减损", "取舍", "节用"],
  }),
  defineHexagram({
    id: 42,
    name: "Yi",
    chineseName: "益",
    upperTrigramId: "xun",
    lowerTrigramId: "zhen",
    keywords: ["增益", "分享", "共长"],
  }),
  defineHexagram({
    id: 43,
    name: "Guai",
    chineseName: "夬",
    upperTrigramId: "dui",
    lowerTrigramId: "qian",
    keywords: ["决断", "坦白", "边界"],
  }),
  defineHexagram({
    id: 44,
    name: "Gou",
    chineseName: "姤",
    upperTrigramId: "qian",
    lowerTrigramId: "xun",
    keywords: ["相遇", "警觉", "分寸"],
  }),
  defineHexagram({
    id: 45,
    name: "Cui",
    chineseName: "萃",
    upperTrigramId: "dui",
    lowerTrigramId: "kun",
    keywords: ["聚集", "共心", "照料"],
  }),
  defineHexagram({
    id: 46,
    name: "Sheng",
    chineseName: "升",
    upperTrigramId: "kun",
    lowerTrigramId: "xun",
    keywords: ["积累", "生长", "次第"],
  }),
  defineHexagram({
    id: 47,
    name: "Kun",
    chineseName: "困",
    upperTrigramId: "dui",
    lowerTrigramId: "kan",
    keywords: ["困顿", "守心", "求助"],
  }),
  defineHexagram({
    id: 48,
    name: "Jing",
    chineseName: "井",
    upperTrigramId: "kan",
    lowerTrigramId: "xun",
    keywords: ["滋养", "维护", "共享"],
  }),
  defineHexagram({
    id: 49,
    name: "Ge",
    chineseName: "革",
    upperTrigramId: "dui",
    lowerTrigramId: "li",
    keywords: ["更新", "时机", "信任"],
  }),
  defineHexagram({
    id: 50,
    name: "Ding",
    chineseName: "鼎",
    upperTrigramId: "li",
    lowerTrigramId: "xun",
    keywords: ["转化", "火候", "滋养"],
  }),
  defineHexagram({
    id: 51,
    name: "Zhen",
    chineseName: "震",
    upperTrigramId: "zhen",
    lowerTrigramId: "zhen",
    keywords: ["惊醒", "安定", "行动"],
  }),
  defineHexagram({
    id: 52,
    name: "Gen",
    chineseName: "艮",
    upperTrigramId: "gen",
    lowerTrigramId: "gen",
    keywords: ["止息", "边界", "安住"],
  }),
  defineHexagram({
    id: 53,
    name: "Jian",
    chineseName: "渐",
    upperTrigramId: "xun",
    lowerTrigramId: "gen",
    keywords: ["渐进", "次第", "成熟"],
  }),
  defineHexagram({
    id: 54,
    name: "Gui Mei",
    chineseName: "归妹",
    upperTrigramId: "zhen",
    lowerTrigramId: "dui",
    keywords: ["关系", "位置", "分寸"],
  }),
  defineHexagram({
    id: 55,
    name: "Feng",
    chineseName: "丰",
    upperTrigramId: "zhen",
    lowerTrigramId: "li",
    keywords: ["丰盛", "清明", "收束"],
  }),
  defineHexagram({
    id: 56,
    name: "Lu",
    chineseName: "旅",
    upperTrigramId: "li",
    lowerTrigramId: "gen",
    keywords: ["过渡", "安顿", "守礼"],
  }),
  defineHexagram({
    id: 57,
    name: "Xun",
    chineseName: "巽",
    upperTrigramId: "xun",
    lowerTrigramId: "xun",
    keywords: ["柔入", "持续", "定向"],
  }),
  defineHexagram({
    id: 58,
    name: "Dui",
    chineseName: "兑",
    upperTrigramId: "dui",
    lowerTrigramId: "dui",
    keywords: ["喜悦", "真诚", "倾听"],
  }),
  defineHexagram({
    id: 59,
    name: "Huan",
    chineseName: "涣",
    upperTrigramId: "xun",
    lowerTrigramId: "kan",
    keywords: ["松动", "疏通", "重连"],
  }),
  defineHexagram({
    id: 60,
    name: "Jie",
    chineseName: "节",
    upperTrigramId: "kan",
    lowerTrigramId: "dui",
    keywords: ["界限", "尺度", "节制"],
  }),
  defineHexagram({
    id: 61,
    name: "Zhong Fu",
    chineseName: "中孚",
    upperTrigramId: "xun",
    lowerTrigramId: "dui",
    keywords: ["诚信", "兑现", "信任"],
  }),
  defineHexagram({
    id: 62,
    name: "Xiao Guo",
    chineseName: "小过",
    upperTrigramId: "zhen",
    lowerTrigramId: "gen",
    keywords: ["细察", "小步", "分寸"],
  }),
  defineHexagram({
    id: 63,
    name: "Ji Ji",
    chineseName: "既济",
    upperTrigramId: "kan",
    lowerTrigramId: "li",
    keywords: ["完成", "守成", "警觉"],
  }),
  defineHexagram({
    id: 64,
    name: "Wei Ji",
    chineseName: "未济",
    upperTrigramId: "li",
    lowerTrigramId: "kan",
    keywords: ["未成", "过渡", "耐心"],
  }),
];

export const hexagramsById = new Map(
  hexagrams.map((hexagram) => [hexagram.id, hexagram]),
);
