import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { hexagramsById } from "../data/hexagrams";
import { HomeHexagramPreview } from "../src/components/hexagram/HomeHexagramPreview";

const visualLineOrder = [5, 4, 3, 2, 1, 0] as const;

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

function radioTags(html: string) {
  return [...html.matchAll(/<input\b[^>]*\btype="radio"[^>]*>/g)].map(
    (match) => match[0],
  );
}

function lineControlMarkups(html: string) {
  return [
    ...html.matchAll(
      /<label\b[^>]*>\s*<input\b[^>]*\btype="radio"[^>]*>[\s\S]*?<\/label>/g,
    ),
  ].map((match) => match[0]);
}

function radioGroupTag(html: string) {
  return [...html.matchAll(/<(?:div|fieldset)\b[^>]*>/g)]
    .map((match) => match[0])
    .find(
      (tag) =>
        tag.includes('role="radiogroup"') ||
        (tag.startsWith("<fieldset") && /aria-label="[^"]*爻/.test(tag)),
    );
}

function renderHomePreview() {
  const zhun = hexagramsById.get(3);

  if (!zhun) {
    throw new Error("Missing fixture hexagram 3");
  }

  return renderToStaticMarkup(
    <HomeHexagramPreview
      lines={zhun.lines}
      lineTexts={zhun.lineTexts ?? []}
      hexagramLabel="屯卦"
      movingLineIndex={1}
    />,
  );
}

describe("home-page line interaction contract", () => {
  it("renders all six home lines as a vertical radio group from top to bottom", () => {
    const html = renderHomePreview();
    const radios = radioTags(html);
    const group = radioGroupTag(html);

    expect(radios).toHaveLength(6);
    expect(group).toBeDefined();
    expect(attribute(group ?? "", "aria-label")).toMatch(/爻/);
    expect(attribute(group ?? "", "aria-orientation")).toBe("vertical");

    for (const [order, radio] of radios.entries()) {
      expect(attribute(radio, "data-line-index")).toBe(
        String(visualLineOrder[order]),
      );
      expect(attribute(radio, "aria-label")).toMatch(/查看|观察/);
    }

    expect(radios.filter((radio) => radio.includes(" checked"))).toHaveLength(
      1,
    );
  });

  it("gives every home line a 44px target and visible ink feedback layers", () => {
    const html = renderHomePreview();
    const controls = lineControlMarkups(html);

    expect(controls).toHaveLength(6);

    for (const control of controls) {
      expect(control).toMatch(/class="[^"]*\bmin-h-11\b[^"]*"/);
      expect(control).toMatch(/class="[^"]*\bhex-line-edge-bloom\b[^"]*"/);
      expect(control).toMatch(/class="[^"]*\bhex-line-core\b[^"]*"/);
      expect(control).toMatch(/class="[^"]*\bhex-line-texture\b[^"]*"/);
    }
  });

  it("connects each home line to an accessible feedback target", () => {
    const html = renderHomePreview();
    const radios = radioTags(html);
    const controlledIds = new Set<string>();

    expect(radios).toHaveLength(6);

    for (const radio of radios) {
      const controlledId = attribute(radio, "aria-controls");

      expect(controlledId).toBeDefined();
      expect(html).toContain(`id="${controlledId}"`);
      controlledIds.add(controlledId ?? "");
    }

    expect(controlledIds.size).toBeGreaterThanOrEqual(1);
    expect(html).toMatch(/role="status"[^>]*aria-live="polite"/);
  });
});
