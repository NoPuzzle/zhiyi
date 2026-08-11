import { describe, expect, it } from "vitest";
import { getClassicalText } from "../data/classical-text";
import { hexagramsById } from "../data/hexagrams";
import {
  authoredReviewLabel,
  classicalReviewLabel,
  classicalRevisionLabel,
} from "../lib/content-provenance";

describe("content provenance labels", () => {
  it("distinguishes detailed drafts from first-pass reviewed product copy", () => {
    expect(
      authoredReviewLabel({
        status: "draft",
        recordedOn: "2026-08-09",
        note: "测试中的草稿状态。",
      }),
    ).toBe("详细草稿");
    expect(authoredReviewLabel(hexagramsById.get(1)!.authoredReview)).toBe(
      "首轮审校完成",
    );
    expect(authoredReviewLabel(hexagramsById.get(4)!.authoredReview)).toBe(
      "首轮审校完成",
    );
  });

  it("describes source-recorded classical text without overstating review", () => {
    const qian = getClassicalText(1);

    expect(classicalReviewLabel(qian)).toBe("固定版本已回读");
    expect(classicalRevisionLabel(qian)).toBe(
      `${qian.pageTitle} · oldid ${qian.revisionId}`,
    );
  });
});
