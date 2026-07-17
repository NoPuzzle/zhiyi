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
    </main>
  );
}
