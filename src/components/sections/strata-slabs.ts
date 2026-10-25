import type { Dictionary } from "@/content";
import type { LayerId } from "@/content/types";
import type { SlabSpec } from "@/lib/iso";

const slabByLayer: Record<LayerId, SlabSpec> = {
  infra: { w: 100, d: 72, h: 8.5, tone: "ivory" },
  security: { w: 86, d: 62, h: 8, tone: "stoneLight" },
  systems: { w: 72, d: 52, h: 7.5, tone: "stone" },
  apps: { w: 58, d: 42, h: 7, tone: "slate" },
  ai: { w: 44, d: 32, h: 6.5, tone: "amber" },
};

export function strataSlabs(layers: Dictionary["strata"]["layers"]): SlabSpec[] {
  return layers.map((l) => slabByLayer[l.id]);
}
