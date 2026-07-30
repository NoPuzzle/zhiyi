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
  judgmentOriginal?: string;
  judgmentPlain?: string;
  imageText?: string;
  imageObservation?: string;
  coreMeaning?: string;
  application?: string;
  keywords: string[];
  lineTexts?: {
    position: string;
    original?: string;
    plain?: string;
    reflection?: string;
  }[];
  reflectionQuestions?: string[];
  smallAction?: string;
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
  const lines = makeLines(hexagram.lowerTrigramId, hexagram.upperTrigramId);
  const contentPatch = hexagramContentPatches[hexagram.id];
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
    judgmentOriginal: "元亨利贞。",
    judgmentPlain:
      "乾象呈现持续而主动的力量。一个可能的读法是：此时适合保持清明、稳健与负责的行动，而不是急于证明自己。",
    imageText: "天行健，君子以自强不息。",
    imageObservation:
      "上下皆天，六爻纯阳，像开阔天穹中的力量持续运行。它强调的不是一味加速，而是让行动有方向、有节律，也知道何时收束。",
    coreMeaning:
      "刚健、创始、持续推进。乾提醒人观察行动的方向、节奏与承受力。",
    application:
      "面对需要主动承担的处境，可以先确认目标与边界，再把持续推进落实为一个可完成的步骤。",
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
    smallAction: "选定一件今天能够完成的小事，写下完成标准并开始第一步。",
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
    imageObservation:
      "上下皆地，六爻皆阴，像广阔地势安静承接万物。它让人看见容纳、照料和长期支持所形成的力量。",
    coreMeaning:
      "包容、承载、顺势而成。坤提醒人重视现实条件、协作关系与持续的照料。",
    application:
      "当局面需要稳定与支持时，可以先接住最真实的需求，再决定自己能够承担到什么范围。",
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
    smallAction: "为当前最需要支持的人或事项，完成一个具体而有限的照料动作。",
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
    imageObservation:
      "雷在水下发动，像新力量在未明的环境中寻找出口。声势已经出现，但路径仍需要整理。",
    coreMeaning:
      "初始、阻滞、整理。屯提醒人把混沌拆成线索，在困难开端中建立可执行的结构。",
    application:
      "面对刚开始又线索混杂的事情，可以先划清角色、顺序和最小可行动范围，而不是急着扩大。",
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
    smallAction: "列出当前最混乱的三件事，只为其中一件写出明确的下一步。",
  }),
  defineHexagram({
    id: 4,
    name: "Meng",
    chineseName: "蒙",
    upperTrigramId: "gen",
    lowerTrigramId: "kan",
    judgmentPlain:
      "蒙象呈现经验不足与方向未明。一个可能的读法是：先承认不知道，再通过清楚的问题、可靠的引导和反复练习建立基础。",
    coreMeaning:
      "启蒙、求教、建立边界。蒙提醒人在不熟悉的处境中保持诚实与学习秩序。",
    keywords: ["启蒙", "求学", "边界"],
    reflectionQuestions: [
      "你目前真正不明白的是什么？",
      "谁或什么资料可以提供可靠引导？",
      "今天可以验证的一个基础问题是什么？",
    ],
    smallAction: "写下一个具体问题，向可靠的人或资料求证，并记录得到的答案。",
  }),
  defineHexagram({
    id: 5,
    name: "Xu",
    chineseName: "需",
    upperTrigramId: "kan",
    lowerTrigramId: "qian",
    judgmentPlain:
      "需象呈现力量已有、条件未齐。一个可能的读法是：等待不是停滞，而是照料资源、辨认时机，避免在条件不足时强行推进。",
    coreMeaning:
      "等待、准备、保持力量。需提醒人区分耐心与拖延，在等待中完成必要准备。",
    keywords: ["等待", "滋养", "时机"],
    reflectionQuestions: [
      "目前缺少的是时间、信息，还是资源？",
      "等待期间有什么准备可以完成？",
      "什么信号出现时才适合继续推进？",
    ],
    smallAction: "列出继续推进前必须满足的一个条件，并完成一项相关准备。",
  }),
  defineHexagram({
    id: 6,
    name: "Song",
    chineseName: "讼",
    upperTrigramId: "qian",
    lowerTrigramId: "kan",
    judgmentPlain:
      "讼象呈现立场冲突与信任不足。一个可能的读法是：先澄清事实、目标和边界，减少情绪推动下的对抗升级。",
    coreMeaning:
      "分歧、争执、审慎止争。讼提醒人辨认争论的代价，并寻找更清楚的处理程序。",
    keywords: ["争讼", "分歧", "审慎"],
    reflectionQuestions: [
      "双方真正争执的是事实、利益，还是尊严？",
      "哪些内容需要第三方或书面记录来澄清？",
      "怎样的边界可以阻止冲突继续扩大？",
    ],
    smallAction: "把争议拆成事实、感受和诉求三栏，只确认其中一项可核实事实。",
  }),
  defineHexagram({
    id: 7,
    name: "Shi",
    chineseName: "师",
    upperTrigramId: "kun",
    lowerTrigramId: "kan",
    judgmentPlain:
      "师象呈现群体行动中的组织与风险。一个可能的读法是：目标越重要，越需要明确责任、纪律和照顾整体的带领方式。",
    coreMeaning:
      "组织、纪律、共同承担。师提醒人让行动服从清楚目标，而不是被声势或情绪带动。",
    keywords: ["组织", "纪律", "协作"],
    reflectionQuestions: [
      "团队是否对目标和完成标准有共同理解？",
      "谁应当承担决定与后果？",
      "当前最需要建立的协作规则是什么？",
    ],
    smallAction: "为当前协作补上一条明确规则，写清负责人、下一步和完成标准。",
  }),
  defineHexagram({
    id: 8,
    name: "Bi",
    chineseName: "比",
    upperTrigramId: "kan",
    lowerTrigramId: "kun",
    judgmentPlain:
      "比象呈现靠近、连接与相互支持。一个可能的读法是：关系需要共同原则和真诚信任，也需要看清自己为何加入。",
    coreMeaning:
      "亲近、结盟、建立信任。比提醒人选择可靠的连接，并在关系中保持清楚的位置。",
    keywords: ["亲比", "连接", "信任"],
    reflectionQuestions: [
      "你希望与谁建立更可靠的连接？",
      "这段连接建立在共同目标还是暂时需要上？",
      "你愿意为信任承担什么责任？",
    ],
    smallAction: "主动联系一位重要协作者，确认一个共同目标和彼此下一步。",
  }),
  defineHexagram({
    id: 9,
    name: "Xiao Chu",
    chineseName: "小畜",
    upperTrigramId: "xun",
    lowerTrigramId: "qian",
    judgmentPlain:
      "小畜象呈现力量受到轻微牵制，也在逐步积累。一个可能的读法是：暂时不求大幅突破，先把细节、习惯和资源收拢。",
    coreMeaning:
      "小幅积蓄、温和约束、渐进准备。小畜提醒人尊重尚未成熟的阶段。",
    keywords: ["小蓄", "涵养", "渐进"],
    reflectionQuestions: [
      "哪些小问题正在限制更大的推进？",
      "现在最值得积累的资源或能力是什么？",
      "怎样的小幅调整可以持续一周？",
    ],
    smallAction: "选择一个可重复的小习惯，今天完成第一次并安排下一次时间。",
  }),
  defineHexagram({
    id: 10,
    name: "Lu",
    chineseName: "履",
    upperTrigramId: "qian",
    lowerTrigramId: "dui",
    judgmentPlain:
      "履象呈现在规则与风险中谨慎前行。一个可能的读法是：行动并非不能继续，但需要尊重边界、礼序与每一步的后果。",
    coreMeaning:
      "践履、谨慎、合宜行动。履提醒人把原则落实到具体脚步，并留意所处关系中的力量差异。",
    keywords: ["履行", "谨慎", "礼"],
    reflectionQuestions: [
      "这一步可能触及谁的边界或责任？",
      "什么规则需要被认真遵守？",
      "怎样前进既坚定又不过度冒进？",
    ],
    smallAction: "在行动前确认一个关键边界，并把下一步缩小到可检查、可回退的范围。",
  }),
  defineHexagram({
    id: 11,
    name: "Tai",
    chineseName: "泰",
    upperTrigramId: "kun",
    lowerTrigramId: "qian",
    judgmentPlain:
      "泰象呈现天地之气相交、上下能够沟通。一个可能的读法是：顺畅来自持续往来与共同维护，也要留意通达之中已经出现的细小变化。",
    coreMeaning:
      "通达、交流、协同维护。泰提醒人在局面顺利时继续疏通关系、分配资源，并为变化预留余地。",
    keywords: ["通泰", "交流", "平衡"],
    reflectionQuestions: [
      "当前哪些关系或环节正在顺畅配合？",
      "这份顺利依靠什么条件维持？",
      "哪个细小变化值得现在就留意？",
    ],
    smallAction: "与一位关键协作者做一次十分钟确认，明确当前进展、一个隐患和下一步。",
  }),
  defineHexagram({
    id: 12,
    name: "Pi",
    chineseName: "否",
    upperTrigramId: "qian",
    lowerTrigramId: "kun",
    judgmentPlain:
      "否象呈现上下分离、信息与力量难以相通。一个可能的读法是：暂时不要用更大力气强推，先守住原则，辨认真正堵塞的位置。",
    coreMeaning:
      "闭塞、失联、守正待变。否提醒人在沟通无效时减少无谓消耗，同时保留重新连接的条件。",
    keywords: ["闭塞", "隔阂", "守正"],
    reflectionQuestions: [
      "阻碍来自信息不通、目标不同，还是信任不足？",
      "哪些原则需要守住，哪些做法可以暂停？",
      "什么迹象会说明局面开始松动？",
    ],
    smallAction: "选出一个堵塞环节，用一句话分别写清事实、影响和希望对方确认的事项。",
  }),
  defineHexagram({
    id: 13,
    name: "Tong Ren",
    chineseName: "同人",
    upperTrigramId: "qian",
    lowerTrigramId: "li",
    judgmentPlain:
      "同人象呈现光明在天之下，人因可见的共同方向而聚合。一个可能的读法是：合作宜建立在公开目标与真实差异上，而非只依靠熟悉或迎合。",
    coreMeaning:
      "求同、开放协作、容纳差异。同人提醒人把共同目标说清楚，也让不同位置的人能够参与。",
    keywords: ["同人", "共同", "开放"],
    reflectionQuestions: [
      "大家真正共享的目标是什么？",
      "哪些差异需要被坦诚表达而不是掩盖？",
      "谁尚未被纳入这次沟通或协作？",
    ],
    smallAction: "写下一句可检验的共同目标，请一位协作者确认或修正这句话。",
  }),
  defineHexagram({
    id: 14,
    name: "Da You",
    chineseName: "大有",
    upperTrigramId: "li",
    lowerTrigramId: "qian",
    judgmentPlain:
      "大有象呈现光明照见充足的力量与资源。一个可能的读法是：拥有越多，越需要清楚取舍、合宜使用，并承担资源带来的责任。",
    coreMeaning:
      "丰盛、能见度、善用所有。大有提醒人把能力与资源用于重要之处，不让占有遮住责任。",
    keywords: ["丰盛", "所有", "责任"],
    reflectionQuestions: [
      "你现在实际拥有而尚未善用的资源是什么？",
      "哪些成果需要与他人共享或归功？",
      "当前最值得投入资源的重点是哪一项？",
    ],
    smallAction: "列出三项现有资源，今天把其中一项明确分配给当前最高优先事项。",
  }),
  defineHexagram({
    id: 15,
    name: "Qian",
    chineseName: "谦",
    upperTrigramId: "kun",
    lowerTrigramId: "gen",
    judgmentPlain:
      "谦象呈现高山藏于地中，有所成而不必处处显露。一个可能的读法是：准确看待自己的长短，给他人和事实留下位置，行动会更稳妥。",
    coreMeaning:
      "谦逊、平衡、实事求是。谦不是否定自己，而是不过度抬高或压低自己，让贡献与责任相称。",
    keywords: ["谦逊", "节制", "低处"],
    reflectionQuestions: [
      "你是否高估或低估了自己的作用？",
      "哪一项成果需要承认他人的贡献？",
      "什么反馈能够帮助你校准判断？",
    ],
    smallAction: "向一位了解情况的人询问一条具体反馈，并据此调整一个细节。",
  }),
  defineHexagram({
    id: 16,
    name: "Yu",
    chineseName: "豫",
    upperTrigramId: "zhen",
    lowerTrigramId: "kun",
    judgmentPlain:
      "豫象呈现雷出地上，力量被唤起并形成响应。一个可能的读法是：热情可以带动行动，但需要准备、节奏和真实条件来承接。",
    coreMeaning:
      "振奋、预备、形成动能。豫提醒人让期待落到安排上，也留意情绪高涨是否遮住实际限制。",
    keywords: ["豫乐", "准备", "响应"],
    reflectionQuestions: [
      "这份期待由真实进展还是想象推动？",
      "要承接当前热情，还缺少什么准备？",
      "怎样的节奏能让动力持续而不过度消耗？",
    ],
    smallAction: "把最想推进的事项拆成一个二十分钟任务，并为它安排今天的具体时段。",
  }),
  defineHexagram({
    id: 17,
    name: "Sui",
    chineseName: "随",
    upperTrigramId: "dui",
    lowerTrigramId: "zhen",
    judgmentPlain:
      "随象呈现行动随情势而调整，也在回应关系与时机。一个可能的读法是：跟随并非失去主见，而是在守住核心原则时灵活改变方法。",
    coreMeaning:
      "随顺、响应、适时调整。随提醒人分辨主动适应与被动漂移，确认自己为何跟随。",
    keywords: ["随顺", "跟随", "调整"],
    reflectionQuestions: [
      "你正在跟随谁、什么趋势或哪种期待？",
      "哪些原则不应因适应环境而放弃？",
      "目前需要调整的是方向、方法，还是节奏？",
    ],
    smallAction: "在回应下一项外部请求前，先写下一条接受或拒绝它的判断标准。",
  }),
  defineHexagram({
    id: 18,
    name: "Gu",
    chineseName: "蛊",
    upperTrigramId: "gen",
    lowerTrigramId: "xun",
    judgmentPlain:
      "蛊象呈现积久的问题需要整理与修复。一个可能的读法是：与其只处理表面症状，不如追溯形成过程，承担能够承担的修正工作。",
    coreMeaning:
      "整治积弊、追溯原因、重新建立秩序。蛊提醒人修复问题而非归咎个人，并防止旧模式再次发生。",
    keywords: ["修弊", "更新", "清理"],
    reflectionQuestions: [
      "眼前问题是由哪些长期忽略累积而成？",
      "哪些旧做法已经不再适合现在？",
      "修复之后需要建立什么新规则？",
    ],
    smallAction: "选一个反复出现的小问题，记录它的一个成因，并完成一次对应的清理或修正。",
  }),
  defineHexagram({
    id: 19,
    name: "Lin",
    chineseName: "临",
    upperTrigramId: "kun",
    lowerTrigramId: "dui",
    judgmentPlain:
      "临象呈现力量逐渐靠近，新的责任与影响也随之增加。一个可能的读法是：主动接近真实情况，以关照和清楚边界带领成长。",
    coreMeaning:
      "临近、关照、增长中的责任。临提醒人在机会展开时亲自了解现场，也为阶段变化做好准备。",
    keywords: ["临近", "关照", "增长"],
    reflectionQuestions: [
      "什么人或情况需要你更直接地靠近了解？",
      "影响力增加后，你需要承担什么责任？",
      "当前的增长可能带来哪些新边界？",
    ],
    smallAction: "用十五分钟了解一位相关者的实际处境，只记录一个需求和一个可支持的下一步。",
  }),
  defineHexagram({
    id: 20,
    name: "Guan",
    chineseName: "观",
    upperTrigramId: "xun",
    lowerTrigramId: "kun",
    judgmentPlain:
      "观象呈现风行地上，细致观察使整体形势逐渐显明。一个可能的读法是：行动之前先看事实、关系和自身位置，也留意自己的表现如何影响他人。",
    coreMeaning:
      "观察、反观、以身示范。观提醒人放慢判断，从多个位置看见模式，再决定如何回应。",
    keywords: ["观察", "观照", "示范"],
    reflectionQuestions: [
      "你目前看到的是事实，还是已经加入了解释？",
      "换一个位置观察，会出现什么不同信息？",
      "你的行为正在向他人示范什么？",
    ],
    smallAction: "安静观察当前流程十分钟，不急于干预，并写下三个事实与一个待验证的判断。",
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
