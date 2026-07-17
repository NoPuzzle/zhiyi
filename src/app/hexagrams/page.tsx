import { PageHeading } from "@/components/page-heading";
import { hexagrams } from "../../../data/hexagrams";
import { trigrams } from "../../../data/trigrams";
import { HexagramBrowser } from "./HexagramBrowser";

export default function HexagramsPage() {
  return (
    <main>
      <PageHeading eyebrow="Images" title="观象">
        <p>
          浏览六十四卦，按卦名、拼音、关键词或上下卦筛选。这里先以结构化资料为主，
          详细解释会逐步补全。
        </p>
      </PageHeading>

      <HexagramBrowser hexagrams={hexagrams} trigrams={trigrams} />
    </main>
  );
}
