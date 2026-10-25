// Generates the share image and app icons from the brand mark.
//   public/og.png             1200Ã—630 Open Graph / Twitter card (rendered in Chrome for correct RTL)
//   src/app/apple-icon.png    180Ã—180
//   src/app/favicon.ico       32Ã—32 (PNG inside an ICO container)
// Usage: node scripts/generate-brand-assets.mjs   (needs Playwright + a local Chrome, and network for Google Fonts)
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { chromium } from "playwright";

const mark = (top, mid, base) => `
  <rect x="30" y="14" width="40" height="17" rx="4" fill="${top}"/>
  <rect x="18" y="37" width="62" height="19" rx="4" fill="${mid}"/>
  <rect x="6" y="62" width="84" height="22" rx="4" fill="${base}"/>`;

const iconSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="22" fill="#16191D"/>
  <g transform="translate(14 14) scale(0.7083)">${mark("#E8892B", "#A3A9B2", "#F4F2EE")}</g>
</svg>`;

// Apple touch icon: full-bleed square (iOS rounds it itself).
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#16191D"/>
  <g transform="translate(16 16) scale(0.6667)">${mark("#E8892B", "#A3A9B2", "#F4F2EE")}</g>
</svg>`;

await sharp(Buffer.from(appleSvg)).png().toFile("src/app/apple-icon.png");

const png32 = await sharp(Buffer.from(iconSvg(32))).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // planes
header.writeUInt16LE(32, 12); // bpp
header.writeUInt32LE(png32.length, 14); // size
header.writeUInt32LE(22, 18); // offset
await writeFile("src/app/favicon.ico", Buffer.concat([header, png32]));

const ogHtml = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700&family=Space+Grotesk:wght@400;700&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#0D0F12;color:#F4F2EE;font-family:'Space Grotesk','Heebo',sans-serif;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
  .logo{display:flex;align-items:center;gap:14px;direction:ltr;align-self:flex-end}
  .logo svg{width:64px;height:64px}
  .word{font-size:46px;letter-spacing:-.02em;line-height:1}
  .word b{font-weight:700}.word span{font-weight:400;color:#A3A9B2}
  h1{font-family:'Heebo';font-weight:700;font-size:92px;line-height:1.02;letter-spacing:-.03em}h1 span{color:#A3A9B2}
  p{font-size:26px;color:#A3A9B2;direction:ltr;text-align:right}
  .band{position:absolute;inset-inline:0;bottom:0;height:18px;background:#F4F2EE}
  .band i{position:absolute;bottom:18px;left:72px;width:220px;height:12px;background:#E8892B;border-radius:3px 3px 0 0}
</style></head><body>
  <div class="logo"><svg viewBox="0 0 96 96">${mark("#E8892B", "#A3A9B2", "#F4F2EE")}</svg><div class="word"><b>Rock</b><span>Stack</span></div></div>
  <h1>×”×ª×•×›× ×” ×©×œ×›×,<br><span>×•×”×©×¨×ª×™× ×©×ž×ª×—×ª×™×”.</span></h1>
  <p>Software Â· Infrastructure Â· AI</p>
  <div class="band"><i></i></div>
</body></html>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(ogHtml, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("wrote public/og.png, src/app/apple-icon.png, src/app/favicon.ico");
