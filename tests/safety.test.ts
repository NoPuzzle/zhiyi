import { describe, expect, it } from "vitest";
import {
  detectHighStakesAreas,
  getHighStakesSafetyNote,
} from "../lib/safety";

describe("high-stakes safety guidance", () => {
  it("does not add a note to an ordinary project reflection", () => {
    expect(getHighStakesSafetyNote("我该如何安排这个项目的下一步？")).toBeUndefined();
  });

  it("detects medical, legal, and financial contexts", () => {
    expect(detectHighStakesAreas("医生建议手术，我还涉及保险合同问题")).toEqual([
      "medical",
      "legal",
      "financial",
    ]);
  });

  it("adds urgent guidance for mental-health danger language", () => {
    const note = getHighStakesSafetyNote("我有自残的念头");

    expect(note).toContain("心理健康");
    expect(note).toContain("当地紧急服务");
    expect(note).toContain("不能代替");
  });
});
