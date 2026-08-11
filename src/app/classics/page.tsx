import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import {
  classicalTreatises,
  classicalWingsGeneratedOn,
  classicalWingsSource,
} from "../../../data/classical-wings";

const treatiseCatalogUrl = (
  classicalWingsSource as typeof classicalWingsSource & {
    treatiseCatalogUrl: string;
  }
).treatiseCatalogUrl;

export const metadata: Metadata = {
  title: "读经传",
  description:
    "分清经、传与知易原创解读，按篇阅读彖、象、文言、系辞、说卦、序卦与杂卦。",
};

const wingStructure = [
  {
    number: "01–02",
    title: "彖上传、彖下传",
    description: "随六十四卦解释卦辞所呈现的义理、时位与卦象结构。",
  },
  {
    number: "03–04",
    title: "象上传、象下传",
    description: "包括逐卦大象与逐爻小象，分别观察整体之象与爻位之象。",
  },
  {
    number: "05",
    title: "文言传",
    description: "专论乾、坤两卦，分别收在乾卦与坤卦详情页中。",
  },
  {
    number: "06–07",
    title: "系辞上传、系辞下传",
    description: "从更广的层面讨论《易》的成书、象数、言意与变化之道。",
  },
  {
    number: "08",
    title: "说卦传",
    description: "集中说明八卦的德、象、方位与取象关系。",
  },
  {
    number: "09",
    title: "序卦传",
    description: "沿六十四卦次序说明各卦前后相承的一种理解。",
  },
  {
    number: "10",
    title: "杂卦传",
    description: "将卦象重新错综配对，从异同关系中呈现卦义。",
  },
] as const;

export default function ClassicsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl pb-20">
      <PageHeading eyebrow="周易经传" title="读经传">
        <p>
          从六十四卦的经文出发，再读历来合称「十翼」的传文。这里保留原文层次与固定来源，
          不把后出的解释写成经文，也不把知易的原创观察冒充古文。
        </p>
      </PageHeading>

      <section
        aria-labelledby="content-layers-title"
        className="mx-5 border-y border-mist/70 py-8 sm:mx-8"
      >
        <div className="max-w-3xl">
          <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
            阅读边界
          </p>
          <h2
            id="content-layers-title"
            className="mt-3 text-3xl font-semibold text-ink"
          >
            三层内容，彼此不混写
          </h2>
        </div>
        <dl className="mt-7 grid gap-6 md:grid-cols-3">
          <div className="border-t border-mist/70 pt-5">
            <dt className="text-xl font-semibold text-ink">经</dt>
            <dd className="mt-3 leading-7 text-ink-soft">
              卦辞、六爻爻辞，以及乾、坤的用九与用六，是六十四卦阅读的经文主体。
            </dd>
          </div>
          <div className="border-t border-mist/70 pt-5">
            <dt className="text-xl font-semibold text-ink">传</dt>
            <dd className="mt-3 leading-7 text-ink-soft">
              彖、象、文言、系辞、说卦、序卦与杂卦，作为传文独立标示与阅读。
            </dd>
          </div>
          <div className="border-t border-mist/70 pt-5">
            <dt className="text-xl font-semibold text-ink">知易原创</dt>
            <dd className="mt-3 leading-7 text-ink-soft">
              象、辞、理、用、问、行是本产品的学习与反思结构，不是古籍原文或现代译本。
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="ten-wings-title"
        className="mx-5 mt-14 sm:mx-8"
      >
        <div className="max-w-3xl">
          <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
            十翼结构
          </p>
          <h2 id="ten-wings-title" className="mt-3 text-3xl font-semibold text-ink">
            十篇传文怎样组成
          </h2>
          <p className="mt-4 leading-8 text-ink-soft">
            彖、象与系辞各分上下两篇，再加文言、说卦、序卦、杂卦，共计十篇。
            页面按内容与六十四卦的关系，分为「随卦阅读」与「通篇阅读」。
          </p>
        </div>

        <ol className="mt-7 divide-y divide-mist/70 border-y border-mist/70">
          {wingStructure.map((wing) => (
            <li
              key={wing.number}
              className="grid gap-2 py-5 sm:grid-cols-[5rem_12rem_minmax(0,1fr)] sm:gap-6"
            >
              <span className="ui-copy text-xs tracking-[0.16em] text-vermilion">
                {wing.number}
              </span>
              <span className="text-lg font-semibold text-ink">{wing.title}</span>
              <span className="leading-7 text-ink-soft">{wing.description}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="hexagram-wings-title"
        className="mx-5 mt-14 border-y border-mist/70 py-8 sm:mx-8"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
              随卦阅读
            </p>
            <h2
              id="hexagram-wings-title"
              className="mt-3 text-3xl font-semibold text-ink"
            >
              彖、象与文言
            </h2>
            <p className="mt-4 leading-8 text-ink-soft">
              每一卦的详情页把卦辞与彖传、大象并列，并让六条爻辞分别对应六条小象。
              文言专属于乾、坤，仍放回两卦的具体语境中阅读。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hexagrams"
              className="ui-copy inline-flex min-h-11 items-center rounded-sm bg-ink px-5 text-sm font-medium text-paper transition hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
            >
              进入六十四卦
            </Link>
            <Link
              href="/hexagrams/1"
              className="ui-copy inline-flex min-h-11 items-center rounded-sm border border-mist px-5 text-sm text-ink transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
            >
              读乾卦
            </Link>
            <Link
              href="/hexagrams/2"
              className="ui-copy inline-flex min-h-11 items-center rounded-sm border border-mist px-5 text-sm text-ink transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
            >
              读坤卦
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="treatises-title"
        className="mx-5 mt-14 sm:mx-8"
      >
        <div className="max-w-3xl">
          <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
            通篇阅读
          </p>
          <h2 id="treatises-title" className="mt-3 text-3xl font-semibold text-ink">
            五部传文
          </h2>
          <p className="mt-4 leading-8 text-ink-soft">
            每一篇按篇内章节分段，保留章节位置与固定版本链接。可逐篇慢读，不必一次读完。
          </p>
        </div>

        <div className="mt-7 divide-y divide-mist/70 border-y border-mist/70">
          {classicalTreatises.map((treatise, index) => (
            <Link
              key={treatise.slug}
              href={`/classics/${treatise.slug}`}
              className="group grid min-h-28 gap-3 py-6 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion sm:grid-cols-[4rem_12rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
              aria-label={`阅读${treatise.title}`}
            >
              <span className="ui-copy text-xs tracking-[0.16em] text-vermilion">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-2xl font-semibold text-ink">
                {treatise.shortTitle}
              </span>
              <span className="leading-7 text-ink-soft">
                {treatise.description}
              </span>
              <span
                className="text-2xl text-ink-soft transition group-hover:translate-x-1 group-hover:text-ink"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="mx-5 mt-14 border-l-2 border-vermilion/55 bg-paper-deep/45 px-5 py-6 sm:mx-8 sm:px-7">
        <p className="ui-copy text-xs tracking-[0.18em] text-vermilion">
          版本与来源
        </p>
        <p className="mt-3 max-w-3xl leading-8 text-ink-soft">
          本区原文依{classicalWingsSource.edition}的
          {classicalWingsSource.transcriptionProvider}转写页录入；各篇内章节均保留其固定
          oldid。来源已记录表示能够回读核对，不表示不同古籍版本之间的异文已经全部校定。
        </p>
        <div className="ui-copy mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <a
            href={classicalWingsSource.catalogUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-mist underline-offset-4 hover:decoration-ink"
          >
            查看《周易》目录
          </a>
          <a
            href={treatiseCatalogUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-mist underline-offset-4 hover:decoration-ink"
          >
            查看《易传》目录
          </a>
          <a
            href={classicalWingsSource.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-mist underline-offset-4 hover:decoration-ink"
          >
            CC BY-SA 4.0
          </a>
          <span className="text-ink-soft">数据记录于 {classicalWingsGeneratedOn}</span>
        </div>
      </aside>
    </main>
  );
}
