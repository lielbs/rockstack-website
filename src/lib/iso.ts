/**
 * Isometric slab geometry. A slab is a box w × d × h (x, y, z) centred on the
 * vertical axis, resting at height z0. Only the three faces facing the viewer are drawn.
 */

export type SlabTone = "basalt" | "slateDeep" | "slate" | "stone" | "ivory" | "amber";

/** [top, left face, right face]: light from the upper left, so the right face is darkest. */
export const slabFaces: Record<SlabTone, [string, string, string]> = {
  basalt: ["#2C3138", "#16191D", "#0D0F12"],
  slateDeep: ["#4F5866", "#363D47", "#282E36"],
  slate: ["#677284", "#4A5361", "#3A414D"],
  stone: ["#C3C8CF", "#A3A9B2", "#878D97"],
  ivory: ["#FFFFFF", "#F4F2EE", "#D9D5CE"],
  amber: ["#F6A65A", "#E8892B", "#C26F1D"],
};

export type SlabSpec = { w: number; d: number; h: number; tone: SlabTone };

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

function project(x: number, y: number, z: number): string {
  const px = (x - y) * COS;
  const py = (x + y) * SIN - z;
  return `${px.toFixed(2)},${py.toFixed(2)}`;
}

export function slabPolygons({ w, d, h }: SlabSpec, z0: number) {
  const x = w / 2;
  const y = d / 2;
  const top = z0 + h;
  return {
    top: [project(-x, -y, top), project(x, -y, top), project(x, y, top), project(-x, y, top)].join(" "),
    right: [project(x, -y, z0), project(x, y, z0), project(x, y, top), project(x, -y, top)].join(" "),
    left: [project(-x, y, z0), project(x, y, z0), project(x, y, top), project(-x, y, top)].join(" "),
  };
}

/** Stacks slabs bottom-up with a fixed gap; returns each slab's base height. */
export function stackBases(slabs: SlabSpec[], gap: number): number[] {
  const bases: number[] = [];
  let z = 0;
  for (const s of slabs) {
    bases.push(z);
    z += s.h + gap;
  }
  return bases;
}

/** ViewBox that fits a stack, with padding. */
export function stackViewBox(slabs: SlabSpec[], gap: number, pad = 8): string {
  const maxW = Math.max(...slabs.map((s) => s.w));
  const maxD = Math.max(...slabs.map((s) => s.d));
  const height = slabs.reduce((sum, s) => sum + s.h, 0) + gap * (slabs.length - 1);
  const halfSpan = ((maxW + maxD) / 2) * COS;
  const minY = -(maxW + maxD) / 2 * SIN - height;
  const maxY = ((maxW + maxD) / 2) * SIN;
  return `${(-halfSpan - pad).toFixed(1)} ${(minY - pad).toFixed(1)} ${(halfSpan * 2 + pad * 2).toFixed(1)} ${(maxY - minY + pad * 2).toFixed(1)}`;
}
