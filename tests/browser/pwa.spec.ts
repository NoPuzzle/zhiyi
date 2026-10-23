import { expect, test, type Page } from "@playwright/test";

test.use({ serviceWorkers: "allow" });

async function waitForWorker(page: Page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL)).toBeTruthy();
}

async function expectOfflineHomeWorks(page: Page) {
  const target = page.locator('.hexagram-touch-line:has(input[data-line-index="4"])');
  await target.tap();
  await expect(page.locator('.hexagram-line-input[data-line-index="4"]')).toBeChecked();
  await expect(page.getByRole("status")).toContainText("第 5 爻");
  await expect(page.locator(".home-line-reading")).toContainText("九五");
  // A hydrated radio alone is not proof the offline stylesheet loaded.
  await expect(target).toHaveCSS("min-height", "44px");
}

async function expectOfflineAskWorks(page: Page) {
  await page.goto("ask/");
  await page.getByLabel("你的问题", { exact: true }).fill("我怎样安排下一步学习？");
  await page.getByRole("button", { name: "生成卦象", exact: true }).tap();
  await expect(page.getByRole("heading", { name: "坤 → 坤", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "修改问题与重新起卦", exact: true })).toBeVisible();
}

test("first installation can reload the home page offline with working styles and controls", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await waitForWorker(page);

  // The test server uses no-store so HTTP cache cannot hide missing SW assets.
  const session = await context.newCDPSession(page);
  await session.send("Network.clearBrowserCache");
  await session.detach();
  await context.setOffline(true);
  await page.reload();
  await expectOfflineHomeWorks(page);
  await expectOfflineAskWorks(page);
  expect(errors).toEqual([]);
});

test("a complete update waits for old pages, then retains offline interactivity", async ({ page, context }) => {
  await page.goto("./");
  await waitForWorker(page);
  const originalWorkerUrl = await page.evaluate(() => navigator.serviceWorker.controller!.scriptURL);
  const nextWorkerUrl = new URL(originalWorkerUrl);
  nextWorkerUrl.searchParams.set("v", `${nextWorkerUrl.searchParams.get("v")}-browser-update`);
  const nextUrl = nextWorkerUrl.href;
  const nextWorkerPromise = context.waitForEvent("serviceworker", {
    predicate: (worker) => worker.url() === nextUrl,
  });
  await page.evaluate((url) => navigator.serviceWorker.register(url, { updateViaCache: "none" }), nextUrl);
  const nextWorker = await nextWorkerPromise;
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.waiting?.scriptURL)).toBe(nextUrl);
  // The old document must not be claimed by a worker which has purged its cache.
  expect(await page.evaluate(() => navigator.serviceWorker.controller!.scriptURL)).toBe(originalWorkerUrl);
  await page.close();
  await expect.poll(() => nextWorker.evaluate(() => {
    const worker = globalThis as unknown as { registration: ServiceWorkerRegistration };
    return `${worker.registration.active?.scriptURL}:${worker.registration.active?.state}`;
  })).toBe(`${nextUrl}:activated`);

  await context.setOffline(true);
  const offlinePage = await context.newPage();
  const errors: string[] = [];
  offlinePage.on("pageerror", (error) => errors.push(error.message));
  await offlinePage.goto("./");
  expect(await offlinePage.evaluate(() => navigator.serviceWorker.controller!.scriptURL)).toBe(nextUrl);
  await expectOfflineHomeWorks(offlinePage);
  await expectOfflineAskWorks(offlinePage);
  expect(errors).toEqual([]);
});
