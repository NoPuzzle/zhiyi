import Link from "next/link";
import { HexagramLines } from "@/components/hexagram/HexagramLines";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-84px)] w-full max-w-3xl flex-col items-center justify-center px-5 pb-16 pt-8 text-center sm:px-8">
      <HexagramLines
        lines={[1, 0, 0, 0, 1, 0]}
        movingLineIndexes={[1]}
        size="lg"
        label="离线提示卦象"
      />

      <p className="ui-copy mt-10 text-xs font-medium uppercase tracking-[0.22em] text-vermilion">
        Offline
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-ink">暂时离线</h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-ink-soft">
        当前网络不可用。已缓存的页面仍可继续浏览；需要新内容时，请在恢复连接后再试。
      </p>
      <Link
        href="/"
        className="ui-copy mt-8 inline-flex min-h-11 items-center justify-center rounded-sm border border-ink px-5 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
      >
        返回首页
      </Link>
    </main>
  );
}
