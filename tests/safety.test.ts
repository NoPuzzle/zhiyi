import { describe, expect, it } from "vitest";
import {
  detectHighStakesAreas,
  getHighStakesSafetyNote,
  PROFESSIONAL_SUPPORT_NOTICE,
} from "../lib/safety";

describe("high-stakes safety guidance", () => {
  it("provides a persistent professional-support boundary for Ask mode", () => {
    expect(PROFESSIONAL_SUPPORT_NOTICE).toContain("医疗");
    expect(PROFESSIONAL_SUPPORT_NOTICE).toContain("法律");
    expect(PROFESSIONAL_SUPPORT_NOTICE).toContain("财务");
    expect(PROFESSIONAL_SUPPORT_NOTICE).toContain("心理健康");
    expect(PROFESSIONAL_SUPPORT_NOTICE).toContain("合格专业人士");
  });

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

  it.each([
    "我想死",
    "我不想活了",
    "我想结束生命",
    "我怕自己会伤害自己",
    "I want to kill myself",
    "I want to die",
    "I wish I were dead",
    "I don't want to live anymore",
    "I have thoughts of self-harm",
  ])("adds urgent guidance for crisis language: %s", (question) => {
    const note = getHighStakesSafetyNote(question);

    expect(note).toContain("心理健康");
    expect(note).toContain("当地紧急服务");
    expect(note).toContain("危机热线");
    expect(note).toContain("不能代替");
  });

  it("keeps ordinary anxiety guidance separate from crisis guidance", () => {
    const note = getHighStakesSafetyNote("我最近因为工作有些焦虑");

    expect(note).toContain("心理健康");
    expect(note).toContain("合格专业人士");
    expect(note).not.toContain("立即危险");
    expect(note).not.toContain("当地紧急服务");
    expect(note).not.toContain("危机热线");
  });
});
