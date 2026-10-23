import { expect, test, type Page } from "@playwright/test";

const visualOrder = [5, 4, 3, 2, 1, 0];

function lineControl(page: Page, index: number) {
  return page.locator(`.hexagram-touch-line:has(input[data-line-index="${index}"])`);
}

async function expectSelectedReading(page: Page, index: number) {
  const input = page.locator(`.hexagram-line-input[data-line-index="${index}"]`);
  await expect(input).toBeChecked();
  const readingId = await input.getAttribute("aria-controls");
  expect(readingId).not.toBeNull();
  const reading = page.locator(`[id="${readingId}"]`);
  await expect(reading).toHaveAttribute("aria-hidden", "false");
  await expect(reading).toHaveAttribute("data-active", "true");
  await expect(reading).toHaveCSS("visibility", "visible");
  await expect(reading).toHaveCSS("opacity", "1");
  await expect(page.locator('.hexagram-line-reading[aria-hidden="false"]')).toHaveCount(1);
  await expect(page.locator('.hexagram-line-reading[aria-hidden="true"]')).toHaveCount(5);
  await expect(page.getByRole("status")).toContainText(`第 ${index + 1} 爻`);
  return reading;
}

async function readingControlCollisions(page: Page, allReadings = false) {
  return page.evaluate((includeHidden) => {
    const readings = [...document.querySelectorAll<HTMLElement>(
      includeHidden ? ".hexagram-line-reading" : '.hexagram-line-reading[aria-hidden="false"]',
    )];
    const controls = [...document.querySelectorAll<HTMLElement>(".hexagram-touch-line")];
    return readings.flatMap((reading) => {
      const readingBox = reading.getBoundingClientRect();
      return controls.flatMap((control) => {
        const controlBox = control.getBoundingClientRect();
        const intersects =
          Math.min(readingBox.right, controlBox.right) - Math.max(readingBox.left, controlBox.left) > 0.5 &&
          Math.min(readingBox.bottom, controlBox.bottom) - Math.max(readingBox.top, controlBox.top) > 0.5;
        return intersects ? [{
          reading: reading.dataset.lineIndex,
          control: control.querySelector<HTMLInputElement>("input")?.dataset.lineIndex,
          readingTop: readingBox.top,
          readingBottom: readingBox.bottom,
          controlTop: controlBox.top,
          controlBottom: controlBox.bottom,
        }] : [];
      });
    });
  }, allReadings);
}

for (const width of [360, 390]) {
  test(`屯卦 ${width}px: six touch targets keep long readings clear and accessible`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("hexagrams/3/");
    await expect(page.locator(".hexagram-line-input")).toHaveCount(6);

    for (const index of visualOrder) {
      const control = lineControl(page, index);
      await expect(control).toBeVisible();
      expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      await control.tap();
      const reading = await expectSelectedReading(page, index);
      expect(await readingControlCollisions(page), `line ${index + 1} overlaps a touch target`).toEqual([]);

      // The last original observation was previously under another line target,
      // especially for the long 六二 and 六三 readings.
      await reading.locator(".hexagram-folio-copy section").last().locator("p").last().tap();
      await expectSelectedReading(page, index);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
}

test("all 64 mobile folios reserve space for every reading without touching line controls", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 360, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (let id = 1; id <= 64; id += 1) {
    await page.goto(`hexagrams/${id}/`);
    await expect(page.locator(".hexagram-line-reading")).toHaveCount(6);
    await page.evaluate(() => document.fonts.ready);
    // All six articles share a grid cell; their boxes reserve the longest
    // passage even when hidden. Checking all boxes also guards the crossfade.
    expect(await readingControlCollisions(page, true), `hexagram ${id}`).toEqual([]);
  }
});

test("reduced motion disables selected, unselected and pressed-line transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("hexagrams/3/");
  await lineControl(page, 1).tap();
  await expectSelectedReading(page, 1);
  await lineControl(page, 2).tap();

  const readings = await page.locator(".hexagram-line-reading").evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return {
      active: element.getAttribute("data-active") === "true",
      duration: style.transitionDuration,
      delay: style.transitionDelay,
      opacity: style.opacity,
      visibility: style.visibility,
    };
  }));
  for (const reading of readings) {
    expect(reading.duration.split(",").every((duration) => parseFloat(duration) === 0)).toBe(true);
    expect(reading.delay.split(",").every((delay) => parseFloat(delay) === 0)).toBe(true);
    expect(reading.opacity).toBe(reading.active ? "1" : "0");
    expect(reading.visibility).toBe(reading.active ? "visible" : "hidden");
  }

  const selectedControl = lineControl(page, 2);
  await selectedControl.scrollIntoViewIfNeeded();
  const box = await selectedControl.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  try {
    expect(await selectedControl.evaluate((element) => element.matches(":active"))).toBe(true);
    const edge = selectedControl.locator(".hex-line-edge-bloom");
    await expect(edge).toHaveCSS("transform", "none");
    await expect(edge).toHaveCSS("transition-duration", "0s");
  } finally {
    await page.mouse.up();
  }
});

test("home page supports all six touch selections", async ({ page }) => {
  await page.goto("./");
  for (const index of visualOrder) {
    await lineControl(page, index).tap();
    const input = page.locator(`.hexagram-line-input[data-line-index="${index}"]`);
    await expect(input).toBeChecked();
    const readingId = await input.getAttribute("aria-controls");
    const position = (await input.getAttribute("aria-label"))!.replace(/^查看/, "");
    await expect(page.locator(`[id="${readingId}"]`)).toHaveAccessibleName(`${position}观察`);
    await expect(page.locator(".home-line-reading")).toContainText(position);
    await expect(page.getByRole("status")).toContainText(`第 ${index + 1} 爻`);
  }
});

test("arrow keys follow visual top-to-bottom order and wrap", async ({ page }) => {
  await page.goto("hexagrams/1/");
  await lineControl(page, 5).tap();
  const top = page.locator('.hexagram-line-input[data-line-index="5"]');
  await top.focus();
  for (const index of [4, 3, 2, 1, 0, 5]) {
    await page.keyboard.press("ArrowDown");
    await expectSelectedReading(page, index);
    await expect(page.locator(`.hexagram-line-input[data-line-index="${index}"]`)).toBeFocused();
  }
  await page.keyboard.press("ArrowUp");
  await expectSelectedReading(page, 0);
});
