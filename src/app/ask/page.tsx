import { PageHeading } from "@/components/page-heading";
import { AskMode } from "./AskMode";

export default function AskPage() {
  return (
    <main>
      <PageHeading eyebrow="观心" title="问卦">
        <p>
          写下一个真实问题，用卦象作为观察变化的结构。这里的解读只用于整理处境与自我反思，
          不作为确定性预言。
        </p>
      </PageHeading>

      <AskMode />
    </main>
  );
}
