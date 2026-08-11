import {
  access,
  readFile,
  readdir,
  stat,
} from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("out");
const repositoryName = (process.env.GITHUB_REPOSITORY ?? "NoPuzzle/zhiyi")
  .split("/")
  .at(-1);
const expectedBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? `/${repositoryName}`;
const trigramIds = ["qian", "dui", "li", "zhen", "xun", "kan", "gen", "kun"];
const classicalTreatiseSlugs = [
  "xici-shang",
  "xici-xia",
  "shuogua",
  "xugua",
  "zagua",
];
const requiredRoutes = [
  "",
  "learn",
  "ask",
  "hexagrams",
  "classics",
  ...classicalTreatiseSlugs.map((slug) => `classics/${slug}`),
  "offline",
];
const errors = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function outputPathForUrl(rawUrl, htmlFile) {
  if (
    !rawUrl ||
    rawUrl.startsWith("#") ||
    /^(?:data|mailto|tel|https?):/i.test(rawUrl)
  ) {
    return undefined;
  }

  let pathname;

  try {
    const htmlRoute = `/${path
      .relative(outputDirectory, htmlFile)
      .replaceAll(path.sep, "/")
      .replace(/index\.html$/, "")}`;
    const parsedUrl = new URL(
      rawUrl,
      `https://example.test${expectedBasePath}${htmlRoute}`,
    );

    if (parsedUrl.origin !== "https://example.test") {
      return undefined;
    }

    pathname = parsedUrl.pathname;
  } catch {
    return undefined;
  }

  if (expectedBasePath) {
    if (pathname.startsWith(`${expectedBasePath}/`)) {
      pathname = pathname.slice(expectedBasePath.length);
    } else if (pathname === expectedBasePath) {
      pathname = "/";
    } else if (pathname.startsWith("/")) {
      return path.join(
        outputDirectory,
        "__outside-base-path__",
        pathname.replace(/^\/+/, ""),
      );
    }
  }

  const decodedPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  return path.join(outputDirectory, decodedPath);
}

async function resolvesToExportedFile(filePath) {
  if (await exists(filePath)) {
    const fileStats = await stat(filePath);

    if (fileStats.isFile()) {
      return true;
    }
  }

  return exists(path.join(filePath, "index.html"));
}

for (const route of requiredRoutes) {
  const routeFile = path.join(outputDirectory, route, "index.html");

  if (!(await exists(routeFile))) {
    errors.push(`缺少页面：${path.relative(outputDirectory, routeFile)}`);
  }
}

for (let id = 1; id <= 64; id += 1) {
  const detailFile = path.join(
    outputDirectory,
    "hexagrams",
    String(id),
    "index.html",
  );

  if (!(await exists(detailFile))) {
    errors.push(`缺少卦象详情页：hexagrams/${id}/index.html`);
    continue;
  }

  const detailHtml = await readFile(detailFile, "utf8");

  if (!detailHtml.includes("本页导览")) {
    errors.push(`卦象详情页 ${id} 缺少页内阅读导览`);
  }

  if (!detailHtml.includes("选一问")) {
    errors.push(`卦象详情页 ${id} 未完整呈现反思问题`);
  }

  if (!detailHtml.includes("按卦序继续阅读")) {
    errors.push(`卦象详情页 ${id} 缺少卦序导航`);
  }

  if (!detailHtml.includes("传 · 彖")) {
    errors.push(`卦象详情页 ${id} 缺少彖传`);
  }

  if (!detailHtml.includes("传 · 小象")) {
    errors.push(`卦象详情页 ${id} 缺少小象`);
  }

  if ((id === 1 || id === 2) && !detailHtml.includes("传 · 文言")) {
    errors.push(`卦象详情页 ${id} 缺少文言`);
  }

  if (id > 2 && detailHtml.includes("传 · 文言")) {
    errors.push(`卦象详情页 ${id} 不应出现乾坤专属文言`);
  }
}

for (let id = 1; id <= 64; id += 1) {
  const readingAsset = path.join(
    outputDirectory,
    "classical-readings",
    `${id}.json`,
  );

  if (!(await exists(readingAsset))) {
    errors.push(`缺少问卦经传静态资产：classical-readings/${id}.json`);
  }
}

for (const slug of classicalTreatiseSlugs) {
  const treatisePath = path.join(
    outputDirectory,
    "classics",
    slug,
    "index.html",
  );

  if (!(await exists(treatisePath))) {
    continue;
  }

  const treatiseHtml = await readFile(treatisePath, "utf8");

  if (!treatiseHtml.includes("固定版本")) {
    errors.push(`经传阅读页 ${slug} 缺少固定版本来源说明`);
  }
}

for (const requiredFile of [
  "manifest.webmanifest",
  "sw.js",
  "icons/apple-touch-icon.png",
  "icons/zhiyi-icon-192.png",
  "icons/zhiyi-icon-512.png",
]) {
  if (!(await exists(path.join(outputDirectory, requiredFile)))) {
    errors.push(`缺少静态文件：${requiredFile}`);
  }
}

for (const trigramId of trigramIds) {
  for (const asset of [
    `${trigramId}.jpg`,
    `${trigramId}-640.avif`,
    `${trigramId}-1024.avif`,
    `${trigramId}-640.webp`,
    `${trigramId}-1024.webp`,
  ]) {
    if (!(await exists(path.join(outputDirectory, "atmospheres", asset)))) {
      errors.push(`缺少水墨背景：atmospheres/${asset}`);
    }
  }
}

for (const asset of ["line-reading-fold.avif", "line-reading-fold.webp"]) {
  if (!(await exists(path.join(outputDirectory, "atmospheres", asset)))) {
    errors.push(`缺少爻位阅卷底纹：atmospheres/${asset}`);
  }
}

const manifestPath = path.join(outputDirectory, "manifest.webmanifest");

if (await exists(manifestPath)) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const expectedScope = `${expectedBasePath}/`;

  if (manifest.start_url !== expectedScope) {
    errors.push(
      `manifest start_url 应为 ${expectedScope}，实际为 ${manifest.start_url}`,
    );
  }

  if (manifest.scope !== expectedScope) {
    errors.push(`manifest scope 应为 ${expectedScope}，实际为 ${manifest.scope}`);
  }
}

const exportedFiles = await collectFiles(outputDirectory);
const htmlFiles = exportedFiles.filter((file) => file.endsWith(".html"));
const attributePattern = /\b(?:href|src)=["']([^"'<>]+)["']/g;
const srcSetPattern = /\bsrcset=["']([^"'<>]+)["']/gi;

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const references = [];

  for (const match of html.matchAll(attributePattern)) {
    references.push(match[1]);
  }

  for (const match of html.matchAll(srcSetPattern)) {
    for (const candidate of match[1].split(",")) {
      references.push(candidate.trim().split(/\s+/)[0]);
    }
  }

  for (const reference of references) {
    const resolvedPath = outputPathForUrl(reference, htmlFile);

    if (resolvedPath && !(await resolvesToExportedFile(resolvedPath))) {
      errors.push(
        `${path.relative(outputDirectory, htmlFile)} 引用了缺失文件：${reference}`,
      );
    }
  }
}

const browserHtmlPath = path.join(outputDirectory, "hexagrams", "index.html");
const browserHtmlBytes = (await stat(browserHtmlPath)).size;
const browserHtmlBudget = 220_000;

if (browserHtmlBytes > browserHtmlBudget) {
  errors.push(
    `卦象浏览页 HTML 为 ${browserHtmlBytes} bytes，超过 ${browserHtmlBudget} bytes 预算`,
  );
}

if (errors.length > 0) {
  console.error(`GitHub Pages 校验失败（${errors.length} 项）：`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  [
    "GitHub Pages 校验通过",
    `basePath=${expectedBasePath}`,
    `HTML=${htmlFiles.length}`,
    "卦象详情页=64",
    "水墨响应式资源=40",
    "爻位阅卷底纹=2",
    `卦象浏览页=${browserHtmlBytes} bytes`,
  ].join(" · "),
);
