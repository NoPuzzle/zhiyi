import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";

const shouldWrite = process.argv.includes("--write");
const classicalTextPath = path.resolve("data/classical-text.json");
const classicalWingsPath = path.resolve("data/classical-wings.json");
const outputDirectory = path.resolve("public/classical-readings");

const [classicalText, classicalWings] = await Promise.all([
  readFile(classicalTextPath, "utf8").then(JSON.parse),
  readFile(classicalWingsPath, "utf8").then(JSON.parse),
]);

function buildAsset(id) {
  const jing = classicalText.records.find((record) => record.id === id);
  const zhuan = classicalWings.hexagrams.find((record) => record.id === id);

  if (!jing || !zhuan) {
    throw new Error(`第 ${id} 卦缺少经文或传文，无法生成问卦静态资产。`);
  }

  return {
    schemaVersion: 1,
    generatedOn: classicalWings.generatedOn,
    id,
    name: jing.name,
    revisionUrl: jing.revisionUrl,
    jing: {
      judgmentOriginal: jing.judgmentOriginal,
      lineTexts: jing.lineTexts,
      ...(jing.specialUseText ? { specialUseText: jing.specialUseText } : {}),
    },
    zhuan: {
      tuanParagraphs: zhuan.tuanParagraphs,
      greatImageText: jing.imageText,
      smallImageTexts: zhuan.smallImageTexts,
      ...(zhuan.specialUseImageText
        ? { specialUseImageText: zhuan.specialUseImageText }
        : {}),
    },
  };
}

const expectedAssets = Array.from({ length: 64 }, (_, index) =>
  buildAsset(index + 1),
);

if (shouldWrite) {
  await mkdir(outputDirectory, { recursive: true });

  await Promise.all(
    expectedAssets.map((asset) =>
      writeFile(
        path.join(outputDirectory, `${asset.id}.json`),
        `${JSON.stringify(asset, null, 2)}\n`,
        "utf8",
      ),
    ),
  );

  console.log("已写入 64 份按卦加载的经传静态资产。");
} else {
  const errors = [];

  for (const expected of expectedAssets) {
    const assetPath = path.join(outputDirectory, `${expected.id}.json`);
    let stored;

    try {
      stored = JSON.parse(await readFile(assetPath, "utf8"));
    } catch (error) {
      errors.push(`第 ${expected.id} 卦静态资产无法读取：${error.message}`);
      continue;
    }

    if (!isDeepStrictEqual(stored, expected)) {
      errors.push(`第 ${expected.id} 卦静态资产与来源数据不一致。`);
    }
  }

  if (errors.length > 0) {
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("问卦经传静态资产校验通过 · 64/64");
}
