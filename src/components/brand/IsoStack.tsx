import type { CSSProperties } from "react";
import { slabFaces, slabPolygons, stackBases, stackViewBox, type SlabSpec } from "@/lib/iso";

type GroupProps = { className?: string; style?: CSSProperties; "data-on"?: string };

type Props = {
  slabs: SlabSpec[];
  gap?: number;
  className?: string;
  /** Per-slab attributes for the outer group (index 0 is the base). */
  slabProps?: (index: number) => GroupProps;
  /** Per-slab attributes for an inner group, so two transforms can be combined. */
  innerProps?: (index: number) => GroupProps;
  title?: string;
};

/** An isometric stack of stone slabs, drawn as flat-shaded SVG polygons. */
export function IsoStack({ slabs, gap = 6, className, slabProps, innerProps, title }: Props) {
  const bases = stackBases(slabs, gap);
  return (
    <svg
      viewBox={stackViewBox(slabs, gap)}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {slabs.map((slab, i) => {
        const poly = slabPolygons(slab, bases[i]);
        const [top, left, right] = slabFaces[slab.tone];
        return (
          <g key={i} {...slabProps?.(i)}>
            <g {...innerProps?.(i)}>
              <polygon points={poly.left} fill={left} stroke={left} strokeWidth="0.35" strokeLinejoin="round" />
              <polygon points={poly.right} fill={right} stroke={right} strokeWidth="0.35" strokeLinejoin="round" />
              <polygon points={poly.top} fill={top} stroke={top} strokeWidth="0.35" strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
