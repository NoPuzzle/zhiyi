import { PageHeading } from "@/components/page-heading";
import { hexagrams } from "../../../data/hexagrams";
import { trigrams } from "../../../data/trigrams";
import { toHexagramSummary } from "../../../lib/hexagram-summary";
import { HexagramBrowser } from "./HexagramBrowser";

export default function HexagramsPage() {
  const summaries = hexagrams.map(toHexagramSummary);

  return (
    <main>
      <PageHeading eyebrow="六十四卦" title="观象">
        <p>
          浏览六十四卦，按卦名、拼音、关键词或上下卦筛选。每一卦都包含经典原文、
          原创六步解读、六爻观察与相关卦结构。
        </p>
      </PageHeading>

      <HexagramBrowser hexagrams={summaries} trigrams={trigrams} />
    </main>
  );
}
