import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { LearnMode } from "./LearnMode";

export default function LearnPage() {
  return (
    <main>
      <PageHeading eyebrow="Learn" title="学易">
        <p>
          从一条阴阳线开始，逐步看到三爻、八卦、六爻、动爻与卦象关系。
          这里先用简明图像建立直觉。
        </p>
      </PageHeading>

      <LearnMode />

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
        <div className="grid gap-5 border-y border-mist/70 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="ui-copy text-xs tracking-[0.2em] text-vermilion">
              继续读原典
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">
              从卦象进入《周易》经传
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink-soft">
              阅读六十四卦的卦爻辞、彖传、大小象与乾坤文言，也可按篇进入系辞、说卦、序卦和杂卦。
            </p>
          </div>
          <Link
            href="/classics"
            className="ui-copy inline-flex min-h-11 items-center justify-center rounded-sm border border-ink px-5 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
          >
            打开经传目录
          </Link>
        </div>
      </section>
    </main>
  );
}
