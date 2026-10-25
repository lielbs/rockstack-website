/**
 * Isometric slab geometry. A slab is a box w × d × h (x, y, z) centred on the
 * vertical axis, resting at height z0. Only the three faces facing the viewer are drawn.
 */

export type SlabTone = "basalt" | "slateDeep" | "slate" | "stone" | "stoneLight" | "ivory" | "amber";

/**
 * Lit face colours, light from the upper left and behind:
 * [top far, top near, left top, left bottom, right top, right bottom].
 */
export const slabFaces: Record<SlabTone, [string, string, string, string, string, string]> = {
  basalt: ["#3a4049", "#2a2f36", "#1d2126", "#15181c", "#121417", "#0b0d0f"],
  slateDeep: ["#606a7a", "#4d5664", "#3f4652", "#343a44", "#2d333c", "#22272e"],
  slate: ["#7d889a", "#646e7f", "#525b6a", "#434a57", "#3a414d", "#2c323b"],
  stone: ["#d6dae0", "#b9bec6", "#a3a9b2", "#8b919a", "#7e848e", "#686e78"],
  stoneLight: ["#eceef1", "#d3d7dc", "#c1c6cd", "#a9aeb6", "#989da6", "#80858e"],
  ivory: ["#ffffff", "#efece6", "#e5e1da", "#cdc8c0", "#b8b3ab", "#9f9a92"],
  amber: ["#ffc684", "#f5a352", "#e8892b", "#d0761d", "#c26f1d", "#a35b13"],
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
    /** The three top edges nearest the viewer, for a fine chamfer highlight. */
    rim: [project(-x, y, top), project(x, y, top), project(x, -y, top)].join(" "),
    /** Footprint on the floor, for the contact shadow. */
    floor: [project(-x, -y, z0), project(x, -y, z0), project(x, y, z0), project(-x, y, z0)].join(" "),
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

/** ViewBox that fits a stack, with padding (extra room below for the floor shadow). */
export function stackViewBox(slabs: SlabSpec[], gap: number, pad = 8, floor = 0): string {
  const maxW = Math.max(...slabs.map((s) => s.w));
  const maxD = Math.max(...slabs.map((s) => s.d));
  const height = slabs.reduce((sum, s) => sum + s.h, 0) + gap * (slabs.length - 1);
  const halfSpan = ((maxW + maxD) / 2) * COS;
  const minY = (-(maxW + maxD) / 2) * SIN - height;
  const maxY = ((maxW + maxD) / 2) * SIN + floor;
  return `${(-halfSpan - pad - floor).toFixed(1)} ${(minY - pad).toFixed(1)} ${(halfSpan * 2 + (pad + floor) * 2).toFixed(1)} ${(maxY - minY + pad * 2).toFixed(1)}`;
}
