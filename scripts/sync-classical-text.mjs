import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";

const outputPath = path.resolve("data/classical-text.json");
const shouldWrite = process.argv.includes("--write");
const runDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Hong_Kong",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const pageNames = [
  "乾",
  "坤",
  "屯",
  "蒙",
  "需",
  "訟",
  "師",
  "比",
  "小畜",
  "履",
  "泰",
  "否",
  "同人",
  "大有",
  "謙",
  "豫",
  "隨",
  "蠱",
  "臨",
  "觀",
  "噬嗑",
  "賁",
  "剝",
  "復",
  "無妄",
  "大畜",
  "頤",
  "大過",
  "坎",
  "離",
  "咸",
  "恒",
  "遯",
  "大壯",
  "晉",
  "明夷",
  "家人",
  "睽",
  "蹇",
  "解",
  "損",
  "益",
  "夬",
  "姤",
  "萃",
  "升",
  "困",
  "井",
  "革",
  "鼎",
  "震",
  "艮",
  "漸",
  "歸妹",
  "豐",
  "旅",
  "巽",
  "兌",
  "渙",
  "節",
  "中孚",
  "小過",
  "既濟",
  "未濟",
];
const linePattern = /^(初[九六]|[九六][二三四五]|上[九六]|用[九六])[：，、；]/;
const commentaryPattern = /^(?:\[疏\]|〖〖疏〗|【疏】|疏曰)/;
const extractionCorrections = [
  {
    id: 6,
    revisionId: 2404945,
    field: "line:九四",
    reason: "同一爻正文被注疏分隔为两个段落。",
    value: "不克訟。復即命渝，安貞吉。",
  },
  {
    id: 10,
    revisionId: 2404942,
    field: "judgmentOriginal",
    reason: "卦名“履”同时是卦辞正文的首字，不能按普通标题规则移除。",
    value: "履虎尾，不咥人，亨。",
  },
  {
    id: 14,
    revisionId: 2386341,
    field: "line:九二",
    reason: "同一爻正文被注疏分隔为两个段落。",
    value: "大車以載，有攸往，無咎。",
  },
  {
    id: 14,
    revisionId: 2386341,
    field: "line:九四",
    reason: "固定转写页把疏文接在同一 HTML 段落内。",
    value: "匪其彭，無咎。",
  },
  {
    id: 28,
    revisionId: 2692227,
    field: "imageText",
    reason: "固定转写页的大象使用无书名号的“象曰”，需避免误取初六小象。",
    value: "澤滅木，大過。君子以獨立不懼，遁世無悶。",
  },
  {
    id: 36,
    revisionId: 2772387,
    field: "imageText",
    reason: "大象正文被拆分为相邻段落。",
    value: "「明入地中，明夷」，君子以蒞眾，用晦而明。",
  },
  {
    id: 36,
    revisionId: 2772387,
    field: "line:六二",
    reason: "固定转写页的注释边界留下孤立开引号。",
    value: "明夷，夷於左股，用拯馬壯，吉。",
  },
  {
    id: 39,
    revisionId: 2404967,
    field: "line:六二",
    reason: "固定转写页的段落拼接产生重复句号。",
    value: "王臣蹇蹇，匪躬之故。",
  },
  {
    id: 48,
    revisionId: 2407709,
    field: "judgmentOriginal",
    reason: "固定转写页把一条无标签注释裸排在卦辞段落之间。",
    value: "改邑不改井，無喪無得，往來井井。汔至亦未繘井，羸其瓶，凶。",
  },
  {
    id: 49,
    revisionId: 2407710,
    field: "line:上六",
    reason: "同一爻正文被注疏分隔为两个段落。",
    value: "君子豹變，小人革面。征凶，居貞吉。",
  },
];

function volumeForHexagram(id) {
  if (id <= 4) return "01";
  if (id <= 16) return "02";
  if (id <= 30) return "03";
  if (id <= 42) return "04";
  if (id <= 54) return "05";
  return "06";
}

function pageTitleForHexagram(id, name) {
  return `周易正義/${volumeForHexagram(id)}${name}`;
}

function fixedRevisionUrl(pageTitle, revisionId) {
  return `https://zh.wikisource.org/w/index.php?title=${encodeURIComponent(pageTitle)}&oldid=${revisionId}`;
}

function decodeEntities(text) {
  return text
    .replace(/&#(x?[0-9a-f]+);/gi, (_, encoded) =>
      String.fromCodePoint(
        encoded[0].toLowerCase() === "x"
          ? Number.parseInt(encoded.slice(1), 16)
          : Number.parseInt(encoded, 10),
      ),
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "“")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function cleanHtml(html, removeAnnotations = true) {
  const withoutAnnotations = removeAnnotations
    ? html.replace(/<small\b[\s\S]*?<\/small>/g, "")
    : html;

  return decodeEntities(withoutAnnotations.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function extractClassicalText(
  id,
  name,
  pageTitle,
  revisionId,
  recordedOn,
  html,
) {
  const sectionStart = html.search(/<h2\b/);
  const paragraphHtml = [
    ...html.slice(sectionStart).matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g),
  ].map((match) => match[1]);
  const paragraphs = paragraphHtml
    .map((paragraph) => cleanHtml(paragraph))
    .filter(Boolean);
  const meaningful = paragraphs.filter(
    (paragraph) => !commentaryPattern.test(paragraph),
  );
  const judgmentStop = meaningful.findIndex(
    (paragraph) =>
      paragraph.startsWith("《彖》曰") || linePattern.test(paragraph),
  );
  let judgmentOriginal = meaningful
    .slice(0, judgmentStop < 0 ? 1 : judgmentStop)
    .join("")
    .replace(/^[^。]{1,12}下[^。]{1,12}上。/, "")
    .replace(/^(?:《[^》]+》|[\p{Script=Han}]{1,4})：/u, "");

  if (id === 1) {
    const qianWithAnnotation = cleanHtml(paragraphHtml[0], false);
    const qianJudgment = qianWithAnnotation.match(/乾：([^〈〉]+)/)?.[1];

    if (qianJudgment) {
      judgmentOriginal = qianJudgment;
    }
  }

  const imageIndex = paragraphs.findIndex((paragraph) =>
    paragraph.startsWith("《象》曰"),
  );
  const imageParts = [];

  if (imageIndex >= 0) {
    imageParts.push(paragraphs[imageIndex]);

    if (!/(?:君子|先王|後|后|上|大人)以/.test(paragraphs[imageIndex])) {
      for (let index = imageIndex + 1; index < paragraphs.length; index += 1) {
        const paragraph = paragraphs[index];

        if (commentaryPattern.test(paragraph)) continue;
        if (
          linePattern.test(paragraph) ||
          paragraph.startsWith("《文言》") ||
          paragraph.startsWith("《象》曰")
        ) {
          break;
        }

        imageParts.push(paragraph);

        if (/(?:君子|先王|後|后|上|大人)以/.test(paragraph)) break;
      }
    }
  }

  let imageText = imageParts.join("").replace(/^《象》曰：?/, "");
  const labeledPassages = meaningful
    .filter((paragraph) => linePattern.test(paragraph))
    .map((paragraph) => {
      const match = paragraph.match(linePattern);

      return {
        position: match[1],
        original: paragraph.slice(match[0].length).trim(),
      };
    });
  const lineTexts = labeledPassages
    .filter((passage) => !passage.position.startsWith("用"))
    .slice(0, 6);
  const specialUseText = labeledPassages.find((passage) =>
    passage.position.startsWith("用"),
  );

  for (const correction of extractionCorrections.filter(
    (candidate) => candidate.id === id,
  )) {
    if (correction.revisionId !== revisionId) {
      throw new Error(
        `${pageTitle} 已从提取修正锁定的 oldid ${correction.revisionId} 变为 ${revisionId}；请先人工复核修正。`,
      );
    }

    if (correction.field === "judgmentOriginal") {
      judgmentOriginal = correction.value;
      continue;
    }

    if (correction.field === "imageText") {
      imageText = correction.value;
      continue;
    }

    const position = correction.field.replace(/^line:/, "");
    const line = lineTexts.find((candidate) => candidate.position === position);

    if (!line) {
      throw new Error(`${pageTitle} 无法应用 ${correction.field} 提取修正。`);
    }

    line.original = correction.value;
  }

  if (!judgmentOriginal || !imageText || lineTexts.length !== 6) {
    throw new Error(
      `${pageTitle} 提取不完整：卦辞=${Boolean(judgmentOriginal)}，大象=${Boolean(imageText)}，爻辞=${lineTexts.length}`,
    );
  }

  return {
    id,
    name,
    pageTitle,
    revisionId,
    revisionUrl: fixedRevisionUrl(pageTitle, revisionId),
    review: {
      status: "source-recorded",
      recordedOn,
      method: "fixed-revision-readback",
    },
    judgmentOriginal,
    imageText,
    lineTexts,
    ...(specialUseText ? { specialUseText } : {}),
  };
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchJson(url) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Zhiyi/0.1 classical source verification https://github.com/NoPuzzle/zhiyi",
      },
    });

    if (response.ok) return response.json();

    if (response.status !== 429) {
      throw new Error(
        `维基文库请求失败 ${response.status}: ${await response.text()}`,
      );
    }

    await sleep(1_500 * (attempt + 1));
  }

  throw new Error("维基文库请求持续受限，请稍后重试。");
}

async function fetchRenderedPage(pageTitle, revisionId) {
  const apiUrl = new URL("https://zh.wikisource.org/w/api.php");
  const parameters = revisionId
    ? {
        action: "parse",
        oldid: String(revisionId),
        prop: "text|revid",
        variant: "zh-hant",
        format: "json",
        formatversion: "2",
        maxlag: "5",
      }
    : {
        action: "parse",
        page: pageTitle,
        prop: "text|revid",
        variant: "zh-hant",
        format: "json",
        formatversion: "2",
        maxlag: "5",
      };

  for (const [key, value] of Object.entries(parameters)) {
    apiUrl.searchParams.set(key, value);
  }

  const payload = await fetchJson(apiUrl);

  if (!payload.parse?.text || !payload.parse.revid) {
    throw new Error(
      `${pageTitle} 无法读取：${JSON.stringify(payload.error ?? payload)}`,
    );
  }

  return payload.parse;
}

function comparableRecord(record) {
  return {
    id: record.id,
    name: record.name,
    pageTitle: record.pageTitle,
    revisionId: record.revisionId,
    judgmentOriginal: record.judgmentOriginal,
    imageText: record.imageText,
    lineTexts: record.lineTexts,
    specialUseText: record.specialUseText,
  };
}

async function fetchAllRecords(existingRecords) {
  const records = [];
  const existingById = new Map(
    existingRecords?.map((record) => [record.id, record]) ?? [],
  );

  for (let index = 0; index < pageNames.length; index += 1) {
    const id = index + 1;
    const name = pageNames[index];
    const pageTitle = pageTitleForHexagram(id, name);
    const stored = existingById.get(id);

    if (!shouldWrite && !stored) {
      throw new Error(`本地经典数据缺少第 ${id} 卦，拒绝回退到最新页面。`);
    }

    const rendered = await fetchRenderedPage(
      pageTitle,
      shouldWrite ? undefined : stored?.revisionId,
    );
    const extracted = extractClassicalText(
      id,
      name,
      pageTitle,
      rendered.revid,
      shouldWrite ? runDate : stored.review.recordedOn,
      rendered.text,
    );

    records.push(extracted);
    process.stdout.write(
      `\r经典原文回读 ${String(id).padStart(2, "0")}/64 · ${name} · oldid=${rendered.revid}`,
    );
    await sleep(220);
  }

  process.stdout.write("\n");
  return records;
}

function createSource(accessDate) {
  return {
    id: "wuying-zhouyi-zhengyi-wikisource",
    work: "《周易正義》",
    edition: "《武英殿十三經注疏》本《周易正義》",
    transcriptionProvider: "中文維基文庫",
    catalogUrl: "https://zh.wikisource.org/wiki/周易正義",
    bibliographicScanUrl: "https://ctext.org/library.pl?if=gb&res=77712",
    publicDomainStatement:
      "古籍原文屬公有領域；中文維基文庫轉寫頁面依 CC BY-SA 4.0 提供。",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    accessDate,
    textPolicy:
      "只收錄卦辭、大象與六條爻辭；保留固定版本字形與標點，不靜默合併異文。",
    verificationPolicy:
      "每卦鎖定維基文庫 oldid 並逐頁回讀；結構另與公開機器文本核對。來源已記錄不等於完成校勘學定本。",
    structuralCrossCheck: {
      provider: "Kanripo",
      repository: "https://github.com/kanripo/KR1a0001",
      commit: "8284adbf9e3435d713180e24f05bf75f8b7d1d96",
      purpose: "僅核對 64 卦、384 爻與用九用六的結構完整性，不作唯一底本。",
    },
    extractionCorrections: extractionCorrections.map(
      ({ id, revisionId, field, reason }) => ({
        id,
        revisionId,
        field,
        reason,
      }),
    ),
  };
}

function validateStoredDataset(dataset) {
  if (dataset.schemaVersion !== 1) {
    throw new Error(`不支持的经典数据 schemaVersion：${dataset.schemaVersion}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataset.generatedOn)) {
    throw new Error("经典数据缺少有效的 generatedOn 日期。");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataset.source?.accessDate ?? "")) {
    throw new Error("经典数据缺少有效的来源访问日期。");
  }

  if (dataset.generatedOn !== dataset.source.accessDate) {
    throw new Error("经典数据生成日期与来源访问日期不一致。");
  }

  if (!isDeepStrictEqual(dataset.source, createSource(dataset.source.accessDate))) {
    throw new Error("经典数据的来源元数据与同步脚本不一致。");
  }

  if (!Array.isArray(dataset.records) || dataset.records.length !== 64) {
    throw new Error(`经典数据必须恰有 64 卦，当前为 ${dataset.records?.length ?? 0}。`);
  }

  const ids = dataset.records.map((record) => record.id);

  if (new Set(ids).size !== 64) {
    throw new Error("经典数据存在重复卦 ID。");
  }

  for (let id = 1; id <= 64; id += 1) {
    const record = dataset.records.find((candidate) => candidate.id === id);

    if (!record) {
      throw new Error(`经典数据缺少第 ${id} 卦。`);
    }

    if (!Number.isInteger(record.revisionId) || record.revisionId <= 0) {
      throw new Error(`第 ${id} 卦缺少有效的固定 oldid。`);
    }

    if (record.revisionUrl !== fixedRevisionUrl(record.pageTitle, record.revisionId)) {
      throw new Error(`第 ${id} 卦的固定版本 URL 与 oldid 不一致。`);
    }
  }
}

if (shouldWrite) {
  const records = await fetchAllRecords();
  const dataset = {
    schemaVersion: 1,
    generatedOn: runDate,
    source: createSource(runDate),
    records,
  };

  await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(`已写入 ${path.relative(process.cwd(), outputPath)}：64 卦。`);
} else {
  const dataset = JSON.parse(await readFile(outputPath, "utf8"));
  validateStoredDataset(dataset);
  const extracted = await fetchAllRecords(dataset.records);
  const errors = [];

  for (const stored of dataset.records) {
    const current = extracted.find((record) => record.id === stored.id);

    if (
      !isDeepStrictEqual(comparableRecord(stored), comparableRecord(current))
    ) {
      errors.push(`第 ${stored.id} 卦 ${stored.name} 与固定版本回读不一致。`);
    }
  }

  if (errors.length > 0) {
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(
    "经典来源校验通过 · 64 卦辞 · 64 大象 · 384 爻辞 · 用九/用六 2 条",
  );
}
