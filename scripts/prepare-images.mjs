// Crops the source photographs, maps them onto the brand duotone (basalt → slate → ivory)
// and writes responsive WebP files into public/media.
// Sources: .taste-skill/source (Unsplash originals, see src/content/credits.ts).
// Usage: node scripts/prepare-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = ".taste-skill/source";
const OUT = "public/media";

/** Brand duotone stops: luminance 0..1 → colour. */
const STOPS = [
  [0, [0x16, 0x19, 0x1d]],
  [0.55, [0x4a, 0x53, 0x61]],
  [1, [0xf4, 0xf2, 0xee]],
];

/** crop: fractions of the source (x, y, w, h); widths: rendered sizes to emit. */
const jobs = [
  { id: "stepped", crop: [0, 0.05, 1, 0.95], widths: [640, 1080, 1600] },
  { id: "monolith", crop: [0, 0.08, 1, 0.84], widths: [800, 1400, 2400] },
  { id: "datacenter", crop: [0, 0, 1, 1], widths: [640, 1080, 1600] },
  { id: "blocks", crop: [0, 0.1, 1, 0.8], widths: [800, 1400, 2400] },
  { id: "grid", crop: [0, 0.18, 1, 0.5], widths: [800, 1400, 2400] },
  { id: "fins", crop: [0, 0.1, 1, 0.72], widths: [640, 1080, 1600] },
];

const lut = Array.from({ length: 256 }, (_, i) => {
  const v = i / 255;
  for (let s = 1; s < STOPS.length; s++) {
    const [a, ca] = STOPS[s - 1];
    const [b, cb] = STOPS[s];
    if (v <= b) {
      const t = (v - a) / (b - a);
      return ca.map((c, k) => Math.round(c + (cb[k] - c) * t));
    }
  }
  return STOPS.at(-1)[1];
});

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const input = path.join(SRC, `${job.id}.jpg`);
  const meta = await sharp(input).metadata();
  const [fx, fy, fw, fh] = job.crop;
  const region = {
    left: Math.round(fx * meta.width),
    top: Math.round(fy * meta.height),
    width: Math.round(fw * meta.width),
    height: Math.round(fh * meta.height),
  };
  for (const w of job.widths) {
    const { data, info } = await sharp(input)
      .extract(region)
      .resize({ width: w })
      .grayscale()
      .normalise()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const px = info.width * info.height;
    const rgb = Buffer.alloc(px * 3);
    for (let p = 0; p < px; p++) {
      const c = lut[data[p * info.channels]];
      rgb[p * 3] = c[0];
      rgb[p * 3 + 1] = c[1];
      rgb[p * 3 + 2] = c[2];
    }
    await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
      .webp({ quality: 76 })
      .toFile(path.join(OUT, `${job.id}-${w}.webp`));
  }
  console.log(`${job.id}: ${region.width}x${region.height}`);
}
