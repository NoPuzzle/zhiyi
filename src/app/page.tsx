import Link from "next/link";
import { hexagramsById } from "../../data/hexagrams";
import { ChangingHexagramView } from "@/components/hexagram/ChangingHexagramView";
import { HexagramCard } from "@/components/hexagram/HexagramCard";
import { HexagramAtmosphere } from "@/components/hexagram/HexagramAtmosphere";
import { HexagramLines } from "@/components/hexagram/HexagramLines";

const qian = hexagramsById.get(1);
const kun = hexagramsById.get(2);
const zhun = hexagramsById.get(3);

const entryLinks = [
  {
    href: "/learn",
    label: "学易",
    className: "bg-ink text-paper hover:bg-ink-soft",
  },
  {
    href: "/ask",
    label: "问卦",
    className:
      "border border-vermilion text-vermilion hover:bg-vermilion hover:text-paper",
  },
  {
    href: "/hexagrams",
    label: "观象",
    className: "border border-mist text-ink hover:border-ink",
  },
];

export default function Home() {
  if (!qian || !kun || !zhun) {
    throw new Error("Landing page demo hexagrams are missing.");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-84px)] w-full max-w-5xl flex-col px-5 pb-16 pt-8 sm:px-8">
      <section className="hexagram-hero relative isolate flex flex-1 flex-col items-center justify-center gap-9 overflow-hidden border-y border-mist/55 px-4 py-14 text-center sm:py-20">
        <HexagramAtmosphere
          upperTrigramId={zhun.upperTrigramId}
          lowerTrigramId={zhun.lowerTrigramId}
        />

        <div className="flex w-full justify-center text-ink">
          <HexagramLines
            lines={zhun.lines}
            movingLineIndexes={[1]}
            animated
            size="lg"
            label="知易首页卦象"
          />
        </div>

        <div>
          <p className="text-xl font-semibold text-ink">屯 · 云雷初生</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            下震为雷，上坎为水：万事初起，先在未定中辨清第一步。
          </p>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-6xl font-semibold tracking-normal text-ink sm:text-7xl">
            知易
          </h1>
          <p className="mt-5 text-2xl leading-9 text-ink">
            以象入易，以问观心
          </p>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-ink-soft sm:text-lg">
            用水墨动画学习《周易》，用卦象整理问题、理解变化。
          </p>
        </div>

        <div className="grid w-full max-w-sm gap-3 sm:max-w-xl sm:grid-cols-3">
          {entryLinks.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className={`ui-copy flex min-h-12 items-center justify-center rounded-sm px-5 text-base font-medium transition ${entry.className}`}
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-mist/70 pt-10">
        <div className="mb-6">
          <p className="ui-copy text-xs font-medium tracking-[0.22em] text-vermilion">
            卦象示例
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">观象</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <HexagramCard hexagram={qian} animated />
          <HexagramCard hexagram={kun} movingLineIndexes={[5]} animated />
          <ChangingHexagramView
            lines={qian.lines}
            movingLineIndexes={[0]}
            size="sm"
          />
        </div>
      </section>
    </main>
  );
}
