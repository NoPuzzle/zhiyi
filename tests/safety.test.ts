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

  it.each([
    "I don’t want to live anymore",
    "I don‘t want to live anymore",
    "I donʼt want to live anymore",
    "I don\u201bt want to live anymore",
    "Ｉ ＤＯＮ＇Ｔ ＷＡＮＴ ＴＯ ＬＩＶＥ",
    "I don’t\u00a0want\u202fto\u3000live anymore",
    "I don’t\t want\n to\r\n live anymore",
    "I have thoughts of self‐harm",
    "I have thoughts of self‑harm",
    "I have thoughts of self–harm",
    "I have thoughts of self—harm",
    "I have thoughts of self−harm",
    "I have thoughts of self\u2012harm",
    "I have thoughts of self\u2015harm",
  ])("normalizes mobile and pasted typography consistently: %s", (question) => {
    expect(detectHighStakesAreas(question)).toEqual(["mentalHealth"]);
    expect(getHighStakesSafetyNote(question)).toContain("当地紧急服务");
    expect(getHighStakesSafetyNote(question)).toContain("危机热线");
  });

  it.each([
    "我想自殺",
    "我害怕自己會自殘",
    "我有輕生的念頭",
    "我想尋死",
    "我想結束生命",
    "我想了結生命",
    "我怕自己會傷害自己",
    "我覺得活著沒意思",
    "我覺得活着沒意思",
    "我覺得活著沒有意義",
    "我覺得活着沒有意義",
  ])("recognizes common traditional Chinese crisis wording: %s", (question) => {
    expect(detectHighStakesAreas(question)).toEqual(["mentalHealth"]);
    expect(getHighStakesSafetyNote(question)).toContain("当地紧急服务");
    expect(getHighStakesSafetyNote(question)).toContain("危机热线");
  });

  it.each([
    "I don’t know how to plan my next step",
    "I would like to make time for self‑care",
    "我想結束今天的工作，休息一下",
    "我想活得更有意義",
    "\u00a0\u202f\u3000\t\n",
  ])("does not turn ordinary wording into a crisis: %s", (question) => {
    expect(detectHighStakesAreas(question)).toEqual([]);
    expect(getHighStakesSafetyNote(question)).toBeUndefined();
  });

  it("normalizes whitespace for non-urgent professional-support guidance", () => {
    const question = "I need mental\u2003health support";
    const note = getHighStakesSafetyNote(question);

    expect(detectHighStakesAreas(question)).toEqual(["mentalHealth"]);
    expect(note).toContain("合格专业人士");
    expect(note).not.toContain("当地紧急服务");
    expect(note).not.toContain("危机热线");
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
