import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import {
  classicalTreatises,
  classicalWingsSource,
  getClassicalTreatise,
  isClassicalTreatiseSlug,
} from "../../../../data/classical-wings";

type TreatisePageParams = {
  params: Promise<{ slug: string }>;
};

function sourcePageAnchor(pageId: string, index: number) {
  const safeId = pageId
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `source-${safeId || index + 1}`;
}

function resolveTreatise(slug: string) {
  if (!isClassicalTreatiseSlug(slug)) {
    return undefined;
  }

  return getClassicalTreatise(slug);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return classicalTreatises.map((treatise) => ({ slug: treatise.slug }));
}

export async function generateMetadata({
  params,
}: TreatisePageParams): Promise<Metadata> {
  const { slug } = await params;
  const treatise = resolveTreatise(slug);

  if (!treatise) {
    return {
      title: "传文未找到",
    };
  }

  return {
    title: treatise.shortTitle,
    description: treatise.description,
  };
}

export default async function ClassicalTreatisePage({
  params,
}: TreatisePageParams) {
  const { slug } = await params;
  const treatise = resolveTreatise(slug);

  if (!treatise) {
    notFound();
  }

  const treatiseIndex = classicalTreatises.findIndex(
    (candidate) => candidate.slug === treatise.slug,
  );
  const previousTreatise = classicalTreatises[treatiseIndex - 1];
  const nextTreatise = classicalTreatises[treatiseIndex + 1];

  return (
    <main className="mx-auto w-full max-w-6xl pb-20">
      <div className="px-5 pt-6 sm:px-8">
        <Link
          href="/classics"
          className="ui-copy text-sm text-ink-soft transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
        >
          返回读经传
        </Link>
      </div>

      <PageHeading eyebrow="传 · 十翼" title={treatise.title}>
        <p>{treatise.description}</p>
      </PageHeading>

      <aside className="mx-5 border-y border-mist/70 py-6 sm:mx-8">
        <div className="grid gap-4 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12">
          <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
            阅读说明
          </p>
          <div className="max-w-3xl text-sm leading-7 text-ink-soft">
            <p>
              下列内容是传文原文，依本篇章节分段呈现；每个章节保留所据固定版本。
              它与六十四卦的经文、知易的产品原创解释分别标示。页面不提供现代译文，
              也不把一处版本记录表述为已定本。
            </p>
            <p className="mt-3 text-xs leading-6 text-ink-soft/75">
              来源：{classicalWingsSource.edition} ·
              {classicalWingsSource.transcriptionProvider}
            </p>
          </div>
        </div>
      </aside>

      <nav
        aria-label={`${treatise.shortTitle}篇内章节目录`}
        className="mx-5 mt-8 overflow-hidden border-b border-mist/65 pb-4 sm:mx-8"
      >
        <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
          本篇目录
        </p>
        <ol className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
          {treatise.pages.map((page, index) => (
            <li key={page.id} className="shrink-0">
              <a
                href={`#${sourcePageAnchor(page.id, index)}`}
                className="ui-copy flex min-h-11 items-center justify-center rounded-sm border border-mist/70 bg-paper/70 px-4 text-sm text-ink-soft transition hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
              >
                {page.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article
        aria-label={`${treatise.title}原文`}
        className="mx-5 mt-10 sm:mx-8"
      >
        <div className="divide-y divide-mist/70 border-y border-mist/70">
          {treatise.pages.map((page, pageIndex) => {
            const headingId = `${sourcePageAnchor(page.id, pageIndex)}-title`;

            return (
              <section
                key={page.id}
                id={sourcePageAnchor(page.id, pageIndex)}
                aria-labelledby={headingId}
                className="scroll-mt-8 grid gap-6 py-10 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12"
              >
                <header>
                  <p className="ui-copy text-xs tracking-[0.16em] text-vermilion">
                    {String(pageIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 id={headingId} className="mt-2 text-2xl font-semibold text-ink">
                    {page.label}
                  </h2>
                </header>

                <div className="max-w-3xl">
                  <div className="space-y-5 text-lg leading-9 text-ink">
                    {page.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={`${page.id}-${paragraphIndex}`}>{paragraph}</p>
                    ))}
                  </div>

                  <footer className="ui-copy mt-7 border-t border-mist/55 pt-4 text-xs leading-6 text-ink-soft">
                    <p>传文原文 · 固定版本已回读</p>
                    <a
                      href={page.revisionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-vermilion underline decoration-vermilion/35 underline-offset-4 transition hover:decoration-vermilion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
                    >
                      {page.pageTitle} · oldid {page.revisionId}
                    </a>
                  </footer>
                </div>
              </section>
            );
          })}
        </div>
      </article>

      <nav
        aria-label="传文篇章导航"
        className="mx-5 mt-14 border-t border-mist/70 pt-8 sm:mx-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
              篇章相承
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              继续读传
            </h2>
          </div>
          <Link
            href="/classics"
            className="ui-copy inline-flex min-h-11 items-center rounded-sm border border-mist px-4 text-sm text-ink-soft transition hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
          >
            返回篇目总览
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {previousTreatise ? (
            <Link
              href={`/classics/${previousTreatise.slug}`}
              rel="prev"
              aria-label={`上一篇：${previousTreatise.title}`}
              className="group min-h-28 rounded-sm border border-mist/70 bg-paper/70 p-5 transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion"
            >
              <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft">
                ← 上一篇
              </p>
              <p className="mt-3 text-2xl font-semibold text-ink">
                {previousTreatise.shortTitle}
              </p>
            </Link>
          ) : (
            <div className="flex min-h-28 items-center rounded-sm border border-dashed border-mist/70 p-5 text-sm text-ink-soft/70">
              已到传文阅读起点
            </div>
          )}

          {nextTreatise ? (
            <Link
              href={`/classics/${nextTreatise.slug}`}
              rel="next"
              aria-label={`下一篇：${nextTreatise.title}`}
              className="group min-h-28 rounded-sm border border-mist/70 bg-paper/70 p-5 text-right transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion"
            >
              <p className="ui-copy text-xs tracking-[0.16em] text-ink-soft">
                下一篇 →
              </p>
              <p className="mt-3 text-2xl font-semibold text-ink">
                {nextTreatise.shortTitle}
              </p>
            </Link>
          ) : (
            <div className="flex min-h-28 items-center justify-end rounded-sm border border-dashed border-mist/70 p-5 text-sm text-ink-soft/70">
              已到传文阅读终点
            </div>
          )}
        </div>
      </nav>
    </main>
  );
}
