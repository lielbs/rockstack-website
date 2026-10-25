import type { Dictionary } from "@/content";
import type { NeedId } from "@/content/types";

export type PreviewSlab = { key: string; label: string; kind: "need" | "require" | "base"; width: number };

export const slabStyles: Record<PreviewSlab["kind"], string> = {
  need: "bg-amber text-basalt",
  require: "bg-stone text-basalt",
  base: "bg-ivory text-basalt",
};

/** Top of the stack first: the picked services, what they need underneath, the foundation last. */
export function buildStack(builder: Dictionary["contact"]["builder"], selected: NeedId[]): PreviewSlab[] {
  const picked = builder.needs.filter((n) => selected.includes(n.id));
  const requires = Array.from(new Set(picked.flatMap((n) => n.requires)));
  const rows = [
    ...picked.map((n) => ({ key: `need-${n.id}`, label: n.label, kind: "need" as const })),
    ...requires.map((r) => ({ key: `req-${r}`, label: r, kind: "require" as const })),
    { key: "base", label: builder.base, kind: "base" as const },
  ];
  return rows.map((row, i) => ({ ...row, width: 56 + (44 * (i + 1)) / rows.length }));
}
