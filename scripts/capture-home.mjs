import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const view of [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({
    viewport: { width: view.width, height: view.height },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:4175", { waitUntil: "networkidle" });
  await page.screenshot({ path: `artifacts/home-${view.name}.png`, fullPage: true });
  await page.close();
}

await browser.close();
