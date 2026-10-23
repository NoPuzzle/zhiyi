import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getClassicalText } from "../data/classical-text";
import { getHexagramWings } from "../data/classical-wings";
import { hexagramsById, type Hexagram } from "../data/hexagrams";
import { InteractiveHexagramHero } from "../src/components/hexagram/InteractiveHexagramHero";

vi.mock("../src/components/hexagram/HexagramAtmosphere", () => ({
  HexagramAtmosphere: () => null,
}));

vi.mock("../src/components/hexagram/FolioWash", () => ({
  FolioWash: () => null,
}));

const placeLabels = ["初", "二", "三", "四", "五", "上"];
const visualLineOrder = [5, 4, 3, 2, 1, 0] as const;
const globalStyles = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);

function expectedLinePosition(hexagram: Hexagram, index: number) {
  const line = hexagram.lines[index];

  if (index === 0) {
    return line === 1 ? "初九" : "初六";
  }

  if (index === 5) {
    return line === 1 ? "上九" : "上六";
  }

  return `${line === 1 ? "九" : "六"}${placeLabels[index]}`;
}

function renderHexagram(id: number) {
  const hexagram = hexagramsById.get(id);

  if (!hexagram) {
    throw new Error(`Missing fixture hexagram ${id}`);
  }

  const classical = getClassicalText(id);
  const wings = getHexagramWings(id);

  return {
    classical,
    hexagram,
    html: renderToStaticMarkup(
      <InteractiveHexagramHero
        hexagram={hexagram}
        classicalLineTexts={classical.lineTexts}
        smallImageTexts={wings.smallImageTexts}
        upperLabel="上卦测试"
        lowerLabel="下卦测试"
      />,
    ),
    wings,
  };
}

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

function radioTags(html: string) {
  return [...html.matchAll(/<input\b[^>]*\btype="radio"[^>]*>/g)].map(
    (match) => ({ offset: match.index, tag: match[0] }),
  );
}

function radioGroupTag(html: string) {
  return [...html.matchAll(/<(?:div|fieldset)\b[^>]*>/g)]
    .map((match) => match[0])
    .find(
      (tag) =>
        tag.includes('role="radiogroup"') ||
        (tag.startsWith("<fieldset") &&
          tag.includes('aria-label="选择一爻观察"')),
    );
}

function lineControlMarkups(html: string) {
  return [
    ...html.matchAll(
      /<label\b[^>]*\bclass="[^"]*\bhexagram-touch-line\b[^"]*"[^>]*>[\s\S]*?<\/label>/g,
    ),
  ].map((match) => match[0]);
}

function blockAfter(source: string, marker: string) {
  const markerIndex = source.indexOf(marker);
  const openingBrace = source.indexOf("{", markerIndex);

  if (markerIndex === -1 || openingBrace === -1) {
    return "";
  }

  let depth = 1;

  for (let index = openingBrace + 1; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(openingBrace + 1, index);
      }
    }
  }

  return "";
}

function readingMarkup(html: string, id: number, index: number) {
  const readingId = `hexagram-${id}-line-${index}-reading`;
  const match = html.match(
    new RegExp(`<article\\b[^>]*\\bid="${readingId}"[^>]*>([\\s\\S]*?)<\\/article>`),
  );

  expect(match, `${readingId} should exist`).not.toBeNull();
  return match?.[1] ?? "";
}

describe("InteractiveHexagramHero line-reading contract", () => {
  it("renders six vertical radios from the top line down to the bottom line", () => {
    const { hexagram, html } = renderHexagram(3);
    const radios = radioTags(html);
    const group = radioGroupTag(html);
    const legend = html.match(/<legend\b[^>]*>([^<]+)<\/legend>/)?.[1];

    expect(radios).toHaveLength(6);
    expect(group).toBeDefined();
    expect(attribute(group ?? "", "aria-label") ?? legend).toMatch(/选择一爻/);
    expect(attribute(group ?? "", "aria-orientation")).toBe("vertical");
    expect([...html.matchAll(/role="status"/g)]).toHaveLength(1);
    expect(html).toContain("aria-live=\"polite\"");

    for (const [order, radio] of radios.entries()) {
      const index = visualLineOrder[order];
      const position = expectedLinePosition(hexagram, index);
      const readingId = `hexagram-${hexagram.id}-line-${index}-reading`;

      expect(attribute(radio.tag, "data-line-index")).toBe(String(index));
      expect(attribute(radio.tag, "value")).toBe(String(index));
      expect(attribute(radio.tag, "aria-label")).toBe(`查看${position}`);
      expect(attribute(radio.tag, "aria-controls")).toBe(readingId);
      expect(html).toContain(`id="${readingId}"`);
    }
  });

  it("gives every interactive line distinct ink edge, core, and texture layers", () => {
    const { html } = renderHexagram(3);
    const controls = lineControlMarkups(html);

    expect(controls).toHaveLength(6);

    for (const control of controls) {
      expect(control).toMatch(
        /class="[^"]*\bhex-line-edge-bloom\b[^"]*"/,
      );
      expect(control).toMatch(/class="[^"]*\bhex-line-core\b[^"]*"/);
      expect(control).toMatch(
        /class="[^"]*\bhex-line-texture\b[^"]*"/,
      );
    }
  });

  it("connects edge bloom to pointer, keyboard, selection, and reduced-motion states", () => {
    const normalizedStyles = globalStyles.replace(/\s+/g, " ");

    expect(normalizedStyles).toContain(
      ".hexagram-touch-line:hover .hex-line-edge-bloom",
    );
    expect(normalizedStyles).toContain(
      ".hexagram-touch-line:has(.hexagram-line-input:focus-visible) .hex-line-edge-bloom",
    );
    expect(normalizedStyles).toContain(
      ".hexagram-touch-line:has(.hexagram-line-input:checked) .hex-line-edge-bloom",
    );
    expect(normalizedStyles).toContain(
      ".hexagram-touch-line:active .hex-line-edge-bloom",
    );

    const reducedMotion = blockAfter(
      globalStyles,
      "@media (prefers-reduced-motion: reduce)",
    );
    const reducedBloomDeclarations = blockAfter(
      reducedMotion,
      ".hex-line-edge-bloom",
    );

    expect(reducedBloomDeclarations).toMatch(/animation:\s*none/);
    expect(reducedBloomDeclarations).toMatch(/transition:\s*none/);
  });

  it("crossfades readings instead of hard-switching their display state", () => {
    const readingDeclarations = blockAfter(
      globalStyles,
      ".hexagram-line-reading {",
    );
    const selectorSupport = blockAfter(
      globalStyles,
      "@supports selector(.hexagram-selector:has(.hexagram-line-input:checked))",
    );
    const activeReadingDeclarations = blockAfter(
      globalStyles,
      '.hexagram-line-reading[data-active="true"]',
    );
    const normalizedSupport = selectorSupport.replace(/\s+/g, " ");
    const enabledMotion = blockAfter(
      globalStyles,
      "@media (prefers-reduced-motion: no-preference)",
    );

    expect(readingDeclarations).not.toMatch(/display:\s*none/);
    expect(readingDeclarations).toMatch(/display:\s*grid/);
    expect(readingDeclarations).toMatch(/opacity:\s*0/);
    expect(readingDeclarations).toMatch(/visibility:\s*hidden/);
    expect(readingDeclarations).toMatch(/transition:/);
    expect(readingDeclarations).toContain("var(--reading-exit-transition, none)");
    expect(activeReadingDeclarations).toContain("var(--reading-enter-transition, none)");
    expect(normalizedSupport).toContain("var(--reading-enter-transition, none)");
    expect(enabledMotion).toMatch(/opacity\s+\d/);
    expect(enabledMotion).toMatch(/transform\s+\d/);
    expect(enabledMotion).toMatch(/visibility\s+\d/);
    expect(activeReadingDeclarations).toMatch(/opacity:\s*1/);
    expect(activeReadingDeclarations).toMatch(/visibility:\s*visible/);

    expect(normalizedSupport).not.toMatch(/display:\s*(?:none|grid)/);
    expect(normalizedSupport).toMatch(/opacity:\s*1/);
    expect(normalizedSupport).toMatch(/visibility:\s*visible/);
  });

  it("removes line and reading transitions for reduced-motion users", () => {
    const reducedMotion = blockAfter(
      globalStyles,
      "@media (prefers-reduced-motion: reduce)",
    );
    const reducedLineDeclarations = blockAfter(
      reducedMotion,
      ".hexagram-touch-line,",
    );
    const reducedReadingDeclarations = blockAfter(
      reducedMotion,
      ".hexagram-line-reading {",
    );
    const normalizedReducedMotion = reducedMotion.replace(/\s+/g, " ");

    expect(reducedLineDeclarations).toMatch(/transition:\s*none/);
    expect(reducedReadingDeclarations).toMatch(/transition:\s*none/);
    expect(normalizedReducedMotion).toMatch(
      /\.hexagram-line-reading \{ animation:\s*none;/,
    );
  });

  it("places all six readings in the folio stage between the upper and lower trigrams", () => {
    const { hexagram, html } = renderHexagram(3);
    const radios = radioTags(html);
    const indexThreeRadio = radios.find(
      ({ tag }) => attribute(tag, "data-line-index") === "3",
    );
    const indexTwoRadio = radios.find(
      ({ tag }) => attribute(tag, "data-line-index") === "2",
    );

    expect(indexThreeRadio).toBeDefined();
    expect(indexTwoRadio).toBeDefined();
    expect(indexThreeRadio!.offset).toBeLessThan(indexTwoRadio!.offset);

    for (const index of visualLineOrder) {
      const readingId = `hexagram-${hexagram.id}-line-${index}-reading`;
      const readingOffset = html.indexOf(`id="${readingId}"`);

      expect(
        readingOffset,
        `${readingId} should follow the upper trigram's final radio`,
      ).toBeGreaterThan(indexThreeRadio!.offset);
      expect(
        readingOffset,
        `${readingId} should precede the lower trigram's first radio`,
      ).toBeLessThan(indexTwoRadio!.offset);
    }
  });

  it("keeps Jing, Small Image, and the product-authored layer in every reading", () => {
    const { classical, hexagram, html, wings } = renderHexagram(3);

    for (let index = 0; index < 6; index += 1) {
      const reading = readingMarkup(html, hexagram.id, index);

      expect(reading).toContain("经 · 爻辞");
      expect(reading).toContain(classical.lineTexts[index].original);
      expect(reading).toContain("传 · 小象");
      expect(reading).toContain(wings.smallImageTexts[index].original);
      expect(reading).toContain("位置观察 · 产品原创");
      expect(reading).toContain(hexagram.lineTexts?.[index]?.plain);
    }
  });

  it("defaults only Qian to line two and every other hexagram to its first line", () => {
    for (let id = 1; id <= 64; id += 1) {
      const { html } = renderHexagram(id);
      const radios = radioTags(html);
      const checkedRadios = radios.filter(({ tag }) => tag.includes(" checked"));
      const visibleReadings = [
        ...html.matchAll(
          /<article\b[^>]*\bdata-active="true"[^>]*\baria-hidden="false"[^>]*>/g,
        ),
      ];
      const hiddenReadings = [
        ...html.matchAll(
          /<article\b[^>]*\bdata-active="false"[^>]*\baria-hidden="true"[^>]*>/g,
        ),
      ];

      expect(checkedRadios, `hexagram ${id} checked radio`).toHaveLength(1);
      expect(visibleReadings, `hexagram ${id} active reading`).toHaveLength(1);
      expect(hiddenReadings, `hexagram ${id} hidden readings`).toHaveLength(5);
      expect(attribute(checkedRadios[0].tag, "data-line-index")).toBe(
        id === 1 ? "1" : "0",
      );
    }
  });
});
