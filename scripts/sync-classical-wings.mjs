import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";

const outputPath = path.resolve("data/classical-wings.json");
const classicalTextPath = path.resolve("data/classical-text.json");
const shouldWrite = process.argv.includes("--write");
const runDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Hong_Kong",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const contaminationPattern =
  /(?:\[(?:疏|注)\]|〖+疏〗|【疏】|(?:正義|正义|疏|注|案)曰|王弼|韓康伯|韩康伯|孔穎達|孔颖达|{{|}})/;
const extractionCorrections = [];

// This list is the reviewed source manifest. Both normal verification and
// --write read these exact revisions; changing a source revision therefore
// requires an intentional code diff before the generated dataset can move.
const hexagramRevisionIds = [
  2404991, 2404999, 2527353, 2601829, 2405039, 2405032, 2405011, 2405022,
  2405006, 2494097, 2106138, 2106139, 2106140, 2494004, 2106142, 2106143,
  2497157, 2106145, 2106146, 2106147, 2404997, 2405035, 2404994, 2497162,
  2527352, 2405001, 2405042, 2405002, 2502716, 2528049, 2404996, 2530043,
  2405037, 2531745, 2584802, 2531747, 2405005, 2531978, 2405036, 2405031,
  2405014, 2405025, 2405003, 2437487, 2535017, 2404995, 2502714, 2404992,
  2674393, 2106200, 2560429, 2405028, 2560535, 2511521, 2560608, 2560781,
  2441563, 2404993, 2405023, 2405027, 2404990, 2405007, 2572417, 2405020,
];

const treatiseDefinitions = [
  {
    slug: "xici-shang",
    title: "繫辭上傳",
    shortTitle: "系辞上",
    description: "从天地、象数、言意与变化等层面展开《易》的整体结构。",
    pageTitle: "易傳/繫辭上",
    revisionId: 2611140,
    expectedSections: 12,
  },
  {
    slug: "xici-xia",
    title: "繫辭下傳",
    shortTitle: "系辞下",
    description: "继续讨论制器、爻位、变通与读《易》时的观察方法。",
    pageTitle: "易傳/繫辭下",
    revisionId: 2611136,
    expectedSections: 9,
  },
  {
    slug: "shuogua",
    title: "說卦傳",
    shortTitle: "说卦",
    description: "说明八卦的德、象、方位、亲属与万物取象。",
    pageTitle: "易傳/說卦",
    revisionId: 2614055,
    expectedSections: 11,
  },
  {
    slug: "xugua",
    title: "序卦傳",
    shortTitle: "序卦",
    description: "依六十四卦次序，呈现前后相承的一种传统理解。",
    pageTitle: "易傳/序卦",
    revisionId: 2611127,
    expectedSections: 1,
    combineSections: true,
  },
  {
    slug: "zagua",
    title: "雜卦傳",
    shortTitle: "杂卦",
    description: "重新错综六十四卦，从相对与相类关系中简要举义。",
    pageTitle: "易傳/雜卦",
    revisionId: 2611129,
    expectedSections: 1,
    includeHeadings: ["一篇"],
  },
];

function fixedRevisionUrl(pageTitle, revisionId) {
  return `https://zh.wikisource.org/w/index.php?title=${encodeURIComponent(pageTitle)}&oldid=${revisionId}`;
}

function expectedHexagramSource(coreRecord) {
  const pageName = coreRecord.name === "無妄" ? "无妄" : coreRecord.name;
  const revisionId = hexagramRevisionIds[coreRecord.id - 1];

  if (!revisionId) {
    throw new Error(`第 ${coreRecord.id} 卦缺少经审核的传文 oldid。`);
  }

  return {
    pageTitle: `周易/${pageName}`,
    revisionId,
  };
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

function sectionBody(wikitext, label, nextLabel) {
  const startPattern = new RegExp(`\\*'''${label}曰[：:]?'''`);
  const startMatch = wikitext.match(startPattern);

  if (!startMatch || startMatch.index === undefined) return undefined;

  const start = startMatch.index + startMatch[0].length;
  const remainder = wikitext.slice(start);
  const endPattern = nextLabel
    ? new RegExp(`\\*'''${nextLabel}曰[：:]?'''`)
    : undefined;
  const endMatch = endPattern?.exec(remainder);

  return remainder.slice(0, endMatch?.index ?? remainder.length);
}

function bulletEntries(wikitext) {
  const entries = [];

  for (const rawLine of wikitext.split("\n")) {
    if (/^\s*\*:\s*$/.test(rawLine)) continue;

    const bullet = rawLine.match(/^\s*\*(?:\*+|#)\s*(.*)$/);

    if (bullet) {
      const cleaned = cleanWikitext(bullet[1]);
      if (cleaned) entries.push(cleaned);
      continue;
    }

    const continuation = cleanWikitext(rawLine);
    if (continuation && entries.length > 0) {
      entries[entries.length - 1] = `${entries.at(-1)} ${continuation}`;
    }
  }

  return entries;
}

function extractHexagramWings(
  coreRecord,
  pageTitle,
  revisionId,
  recordedOn,
  wikitext,
) {
  const tuanParagraphs = bulletEntries(
    sectionBody(wikitext, "彖", "象") ?? "",
  );
  const imageEntries = bulletEntries(
    sectionBody(wikitext, "象", "文言") ?? "",
  );
  const wenyanBody = sectionBody(wikitext, "文言");
  const wenyanParagraphs = wenyanBody
    ? bulletEntries(wenyanBody)
    : undefined;
  const smallImageOriginals = imageEntries.slice(1, 7);
  const smallImageTexts = coreRecord.lineTexts.map((line, index) => ({
    position: line.position,
    original: smallImageOriginals[index] ?? "",
  }));
  const usePosition = coreRecord.specialUseText?.position;
  const specialUseImageText = usePosition
    ? {
        position: usePosition,
        original: imageEntries[7] ?? "",
      }
    : undefined;

  if (
    tuanParagraphs.length === 0 ||
    imageEntries.length !== (usePosition ? 8 : 7) ||
    smallImageTexts.some((line) => !line.original) ||
    (usePosition && !specialUseImageText?.original) ||
    ((coreRecord.id === 1 || coreRecord.id === 2) !==
      Boolean(wenyanParagraphs?.length))
  ) {
    throw new Error(
      `${pageTitle} 传文提取不完整：彖=${tuanParagraphs.length}，象=${imageEntries.length}，小象=${smallImageTexts.filter((line) => line.original).length}/6，文言=${wenyanParagraphs?.length ?? 0}。`,
    );
  }

  return {
    id: coreRecord.id,
    name: coreRecord.name,
    pageTitle,
    revisionId,
    revisionUrl: fixedRevisionUrl(pageTitle, revisionId),
    review: {
      status: "source-recorded",
      recordedOn,
      method: "fixed-revision-readback",
    },
    tuanParagraphs,
    smallImageTexts,
    ...(specialUseImageText ? { specialUseImageText } : {}),
    ...(wenyanParagraphs ? { wenyanParagraphs } : {}),
  };
}

function splitTopLevelPipes(text) {
  const parts = [];
  let start = 0;
  let templateDepth = 0;
  let linkDepth = 0;

  for (let index = 0; index < text.length; index += 1) {
    const pair = text.slice(index, index + 2);

    if (pair === "{{") {
      templateDepth += 1;
      index += 1;
    } else if (pair === "}}") {
      templateDepth -= 1;
      index += 1;
    } else if (pair === "[[") {
      linkDepth += 1;
      index += 1;
    } else if (pair === "]]" && linkDepth > 0) {
      linkDepth -= 1;
      index += 1;
    } else if (text[index] === "|" && templateDepth === 0 && linkDepth === 0) {
      parts.push(text.slice(start, index));
      start = index + 1;
    }
  }

  parts.push(text.slice(start));
  return parts;
}

function replaceTemplates(wikitext) {
  let text = wikitext;
  const templatePattern = /{{([^{}]*)}}/g;
  let passes = 0;

  while (text.includes("{{") && passes < 50) {
    let changed = false;
    text = text.replace(templatePattern, (whole, inner) => {
      changed = true;
      const parts = splitTopLevelPipes(inner);
      const name = parts.shift()?.trim().toLowerCase() ?? "";
      const positional = parts.filter((part) => !/^\s*[^=]+\s*=/.test(part));

      if (["header", "*", "批", "note", "注", "gap"].includes(name)) return "";
      if (name === "!") return "|";
      if (["yw", "+", "異體字", "异体字", "sic", "nowrap"].includes(name)) {
        return positional[0] ?? "";
      }
      if (name === "ruby") return positional[0] ?? "";

      throw new Error(`固定来源出现未审核模板：${name || whole.slice(0, 40)}`);
    });

    if (!changed) break;
    passes += 1;
  }

  return text;
}

function cleanWikitext(wikitext) {
  return decodeEntities(
    replaceTemplates(wikitext)
      .replace(/-\{(?:[A-Z]+\|)?([^{}]+)}-/gi, "$1")
      .replace(/<!--([\s\S]*?)-->/g, "")
      .replace(/<ref\b[\s\S]*?<\/ref>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/\[\[(?:File|Image):[^\]]+]]/gi, "")
      .replace(/\[\[[^\]|]+\|([^\]]+)]]/g, "$1")
      .replace(/\[\[([^\]]+)]]/g, "$1")
      .replace(/'{2,5}/g, "")
      .replace(/^\s*=+|=+\s*$/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractTreatiseSections(definition, wikitext) {
  const headingMatches = [
    ...wikitext.matchAll(/^==\s*([^=\n]+?)\s*==\s*$/gm),
  ];
  let sections = headingMatches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = headingMatches[index + 1]?.index ?? wikitext.length;
    const paragraphs = wikitext
      .slice(start, end)
      .split(/\n\s*\n|\n(?=\s*:)/)
      .map((block) => block.replace(/^\s*:+\s*/gm, ""))
      .map(cleanWikitext)
      .filter(Boolean);

    return {
      label: match[1].trim(),
      paragraphs,
    };
  });

  if (definition.includeHeadings) {
    sections = sections.filter((section) =>
      definition.includeHeadings.includes(section.label),
    );
  }

  if (definition.combineSections) {
    sections = [
      {
        label: "全文（上、下篇）",
        paragraphs: sections.flatMap((section) => section.paragraphs),
      },
    ];
  }

  if (
    sections.length !== definition.expectedSections ||
    sections.some(
      (section) =>
        section.paragraphs.length === 0 || section.paragraphs.some((text) => !text),
    )
  ) {
    throw new Error(
      `${definition.slug} 章节提取不完整：${sections.length}/${definition.expectedSections}。`,
    );
  }

  return sections;
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchJson(url) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Zhiyi/0.1 classical wings verification https://github.com/NoPuzzle/zhiyi",
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

async function fetchParsedRevision(pageTitle, revisionId, prop) {
  const apiUrl = new URL("https://zh.wikisource.org/w/api.php");
  const parameters = {
    action: "parse",
    ...(revisionId
      ? { oldid: String(revisionId) }
      : { page: pageTitle }),
    prop: `${prop}|revid`,
    variant: "zh-hant",
    format: "json",
    formatversion: "2",
    maxlag: "5",
  };

  for (const [key, value] of Object.entries(parameters)) {
    apiUrl.searchParams.set(key, value);
  }

  const payload = await fetchJson(apiUrl);

  if (
    !payload.parse?.[prop] ||
    !payload.parse.revid ||
    (revisionId && payload.parse.revid !== revisionId)
  ) {
    throw new Error(
      `${pageTitle}${revisionId ? ` oldid=${revisionId}` : ""} 无法回读。`,
    );
  }

  return payload.parse;
}

async function fetchHexagramRecords(coreDataset, storedDataset) {
  const storedById = new Map(
    storedDataset?.hexagrams.map((record) => [record.id, record]) ?? [],
  );
  const records = [];

  for (const coreRecord of coreDataset.records) {
    const stored = storedById.get(coreRecord.id);
    const expectedSource = expectedHexagramSource(coreRecord);

    if (!shouldWrite && !stored) {
      throw new Error(`十翼数据缺少第 ${coreRecord.id} 卦固定版本。`);
    }

    if (
      stored &&
      (stored.pageTitle !== expectedSource.pageTitle ||
        stored.revisionId !== expectedSource.revisionId)
    ) {
      throw new Error(`第 ${coreRecord.id} 卦传文来源与审核清单不一致。`);
    }

    const rendered = await fetchParsedRevision(
      expectedSource.pageTitle,
      expectedSource.revisionId,
      "wikitext",
    );
    const record = extractHexagramWings(
      coreRecord,
      expectedSource.pageTitle,
      rendered.revid,
      shouldWrite ? runDate : stored?.review.recordedOn,
      rendered.wikitext,
    );

    records.push(record);
    process.stdout.write(
      `\r十翼逐卦回读 ${String(record.id).padStart(2, "0")}/64 · ${record.name}`,
    );
    await sleep(180);
  }

  process.stdout.write("\n");
  return records;
}

async function fetchTreatises(storedDataset) {
  const storedBySlug = new Map(
    storedDataset?.treatises.map((treatise) => [treatise.slug, treatise]) ?? [],
  );
  const treatises = [];
  let completed = 0;

  for (const definition of treatiseDefinitions) {
    const storedPages = new Map(
      storedBySlug.get(definition.slug)?.pages.map((page) => [page.id, page]) ?? [],
    );
    const parsed = await fetchParsedRevision(
      definition.pageTitle,
      definition.revisionId,
      "wikitext",
    );
    const sections = extractTreatiseSections(definition, parsed.wikitext);
    const pages = sections.map((section, index) => {
      const id = `${definition.slug}-${index + 1}`;
      const stored = storedPages.get(id);

      return {
        id,
        label: section.label,
        pageTitle: definition.pageTitle,
        revisionId: definition.revisionId,
        revisionUrl: fixedRevisionUrl(
          definition.pageTitle,
          definition.revisionId,
        ),
        review: {
          status: "source-recorded",
          recordedOn: shouldWrite ? runDate : stored?.review.recordedOn,
          method: "fixed-revision-readback",
        },
        paragraphs: section.paragraphs,
      };
    });

    completed += 1;
    process.stdout.write(
      `\r十翼通论回读 ${completed}/5 · ${definition.pageTitle}`,
    );
    await sleep(180);

    treatises.push({
      slug: definition.slug,
      title: definition.title,
      shortTitle: definition.shortTitle,
      description: definition.description,
      pages,
    });
  }

  process.stdout.write("\n");
  return treatises;
}

function createSource(accessDate) {
  return {
    id: "zhouyi-yizhuan-wikisource",
    work: "《周易》經傳",
    edition:
      "逐卦傳文依中文維基文庫《周易》獨立卦頁；五部通論依《易傳》獨立轉寫頁",
    transcriptionProvider: "中文維基文庫",
    catalogUrl: "https://zh.wikisource.org/wiki/周易",
    treatiseCatalogUrl: "https://zh.wikisource.org/wiki/易傳",
    bibliographicScanUrl: "https://ctext.org/library.pl?if=gb&res=77712",
    publicDomainStatement:
      "古籍原文屬公有領域；中文維基文庫轉寫頁面依 CC BY-SA 4.0 提供。",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    accessDate,
    textPolicy:
      "逐卦從《周易》獨立卦頁收錄彖、小象與乾坤文言；通論從《易傳》獨立頁收錄繫辭上下、說卦、序卦與雜卦；不混入歷代注疏，保留各固定版本字形與標點。",
    verificationPolicy:
      "逐頁鎖定中文維基文庫 oldid 並回讀；來源已記錄不等於完成校勘學定本，也不解決傳文作者歸屬問題。",
    structuralCrossCheck: {
      provider: "Kanripo",
      repository: "https://github.com/kanripo/KR1a0001",
      commit: "8284adbf9e3435d713180e24f05bf75f8b7d1d96",
      purpose: "僅核對十翼篇目與傳文結構完整性，不作唯一底本。",
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

function validateDataset(dataset, coreDataset) {
  if (dataset.schemaVersion !== 1) throw new Error("十翼数据 schemaVersion 无效。");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataset.generatedOn)) {
    throw new Error("十翼数据生成日期无效。");
  }
  if (!isDeepStrictEqual(dataset.source, createSource(dataset.source.accessDate))) {
    throw new Error("十翼来源元数据与同步脚本不一致。");
  }
  if (dataset.generatedOn !== dataset.source.accessDate) {
    throw new Error("十翼数据生成日期与来源访问日期不一致。");
  }
  if (dataset.hexagrams.length !== 64 || new Set(dataset.hexagrams.map((record) => record.id)).size !== 64) {
    throw new Error("十翼逐卦记录必须恰有 64 个唯一 ID。");
  }

  const wenyanIds = dataset.hexagrams
    .filter((record) => record.wenyanParagraphs?.length)
    .map((record) => record.id);
  const specialUseIds = dataset.hexagrams
    .filter((record) => record.specialUseImageText)
    .map((record) => record.id);

  if (!isDeepStrictEqual(wenyanIds, [1, 2])) {
    throw new Error("文言必须且只能对应乾、坤两卦。");
  }
  if (!isDeepStrictEqual(specialUseIds, [1, 2])) {
    throw new Error("用九、用六之象必须且只能对应乾、坤两卦。");
  }

  for (const record of dataset.hexagrams) {
    const core = coreDataset.records.find((candidate) => candidate.id === record.id);
    const expectedSource = core ? expectedHexagramSource(core) : undefined;

    if (
      !core ||
      record.pageTitle !== expectedSource.pageTitle ||
      record.revisionId !== expectedSource.revisionId ||
      !Number.isInteger(record.revisionId) ||
      record.revisionId <= 0 ||
      record.revisionUrl !== fixedRevisionUrl(record.pageTitle, record.revisionId)
    ) {
      throw new Error(`第 ${record.id} 卦传文缺少有效的独立固定版本。`);
    }
    if (
      record.tuanParagraphs.length === 0 ||
      record.tuanParagraphs.some((paragraph) => !paragraph.trim())
    ) {
      throw new Error(`第 ${record.id} 卦彖传为空。`);
    }
    if (record.smallImageTexts.length !== 6) {
      throw new Error(`第 ${record.id} 卦小象数量不是 6。`);
    }
    if (
      !isDeepStrictEqual(
        record.smallImageTexts.map((line) => line.position),
        core.lineTexts.map((line) => line.position),
      )
    ) {
      throw new Error(`第 ${record.id} 卦小象爻位与经文顺序不一致。`);
    }
  }

  const expectedPageCounts = new Map([
    ["xici-shang", 12], ["xici-xia", 9], ["shuogua", 11],
    ["xugua", 1], ["zagua", 1],
  ]);

  if (
    dataset.treatises.length !== 5 ||
    new Set(dataset.treatises.map((treatise) => treatise.slug)).size !== 5
  ) {
    throw new Error("十翼通论必须恰有五篇唯一记录。");
  }

  for (const treatise of dataset.treatises) {
    const definition = treatiseDefinitions.find(
      (candidate) => candidate.slug === treatise.slug,
    );

    if (
      !definition ||
      treatise.pages.length !== expectedPageCounts.get(treatise.slug) ||
      new Set(treatise.pages.map((page) => page.id)).size !==
        treatise.pages.length
    ) {
      throw new Error(`${treatise.slug} 篇内章节数量或标识不符。`);
    }
    for (const page of treatise.pages) {
      if (
        page.pageTitle !== definition.pageTitle ||
        page.revisionId !== definition.revisionId ||
        page.revisionUrl !== fixedRevisionUrl(page.pageTitle, page.revisionId) ||
        page.paragraphs.length === 0 ||
        page.paragraphs.some((paragraph) => !paragraph.trim())
      ) {
        throw new Error(`${page.pageTitle} 固定 URL 与 oldid 不一致。`);
      }
    }
  }

  const allTexts = [
    ...dataset.hexagrams.flatMap((record) => [
      ...record.tuanParagraphs,
      ...record.smallImageTexts.map((line) => line.original),
      record.specialUseImageText?.original,
      ...(record.wenyanParagraphs ?? []),
    ]),
    ...dataset.treatises.flatMap((treatise) =>
      treatise.pages.flatMap((page) => page.paragraphs),
    ),
  ].filter(Boolean);

  for (const text of allTexts) {
    if (contaminationPattern.test(text)) {
      throw new Error(`十翼正文疑似含注疏或模板污染：${text.slice(0, 80)}`);
    }
  }
}

const coreDataset = JSON.parse(await readFile(classicalTextPath, "utf8"));
const storedDataset = shouldWrite
  ? undefined
  : JSON.parse(await readFile(outputPath, "utf8"));

if (storedDataset) validateDataset(storedDataset, coreDataset);

const [hexagrams, treatises] = await Promise.all([
  fetchHexagramRecords(coreDataset, storedDataset),
  fetchTreatises(storedDataset),
]);
const generatedDataset = {
  schemaVersion: 1,
  generatedOn: shouldWrite ? runDate : storedDataset.generatedOn,
  source: createSource(shouldWrite ? runDate : storedDataset.source.accessDate),
  hexagrams,
  treatises,
};

validateDataset(generatedDataset, coreDataset);

if (shouldWrite) {
  await writeFile(outputPath, `${JSON.stringify(generatedDataset, null, 2)}\n`, "utf8");
  console.log("已写入 data/classical-wings.json。 ");
} else if (!isDeepStrictEqual(storedDataset, generatedDataset)) {
  throw new Error("十翼数据与固定来源回读不一致。");
} else {
  console.log(
    "十翼来源校验通过 · 64 彖 · 384 小象 · 文言 2 · 通论章节 12/9/11/1/1",
  );
}
