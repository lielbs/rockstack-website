// Generates the logo used in the Gmail signatures of contact@ and support@.
//   public/email/signature-logo.png   440×112 (shown at 220×56), dark tile so it reads in light and dark mail clients
// Usage: node scripts/generate-email-signature.mjs   (needs Playwright + a local Chrome, and network for Google Fonts)
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const mark = `
  <rect x="30" y="14" width="40" height="17" rx="4" fill="#E8892B"/>
  <rect x="18" y="37" width="62" height="19" rx="4" fill="#A3A9B2"/>
  <rect x="6" y="62" width="84" height="22" rx="4" fill="#F4F2EE"/>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{background:transparent}
  .tile{width:220px;height:56px;border-radius:10px;background:#16191D;display:flex;align-items:center;gap:10px;padding:0 16px;font-family:'Space Grotesk',sans-serif}
  svg{width:32px;height:32px;flex:none}
  .word{font-size:25px;letter-spacing:-.02em;line-height:1;color:#F4F2EE}
  .word b{font-weight:700}.word span{font-weight:400;color:#A3A9B2}
</style></head><body>
  <div class="tile"><svg viewBox="0 0 96 96">${mark}</svg><div class="word"><b>Rock</b><span>Stack</span></div></div>
</body></html>`;

await mkdir("public/email", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.locator(".tile").screenshot({ path: "public/email/signature-logo.png", omitBackground: true });
await browser.close();
console.log("wrote public/email/signature-logo.png");
