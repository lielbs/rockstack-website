import { useId, type CSSProperties } from "react";
import { slabFaces, slabPolygons, stackBases, stackViewBox, type SlabSpec, type SlabTone } from "@/lib/iso";

type GroupProps = { className?: string; style?: CSSProperties; "data-on"?: string };

type Props = {
  slabs: SlabSpec[];
  gap?: number;
  className?: string;
  /** Per-slab attributes for the outer group (index 0 is the base). */
  slabProps?: (index: number) => GroupProps;
  /** Per-slab attributes for an inner group, so two transforms can be combined. */
  innerProps?: (index: number) => GroupProps;
  /** Soft contact shadow on the floor under the base slab. */
  shadow?: boolean;
  title?: string;
};

/** An isometric stack of stone slabs, rendered with lit faces and a fine edge highlight. */
export function IsoStack({ slabs, gap = 6, className, slabProps, innerProps, shadow = false, title }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const bases = stackBases(slabs, gap);
  const tones = Array.from(new Set(slabs.map((s) => s.tone)));
  const id = (tone: SlabTone, face: string) => `${uid}-${tone}-${face}`;
  const floorPad = shadow ? 10 : 0;

  return (
    <svg
      viewBox={stackViewBox(slabs, gap, 8, floorPad)}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        {tones.map((tone) => {
          const [t1, t2, l1, l2, r1, r2] = slabFaces[tone];
          return (
            <g key={tone}>
              <linearGradient id={id(tone, "t")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={t1} />
                <stop offset="1" stopColor={t2} />
              </linearGradient>
              <linearGradient id={id(tone, "l")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={l1} />
                <stop offset="1" stopColor={l2} />
              </linearGradient>
              <linearGradient id={id(tone, "r")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={r1} />
                <stop offset="1" stopColor={r2} />
              </linearGradient>
            </g>
          );
        })}
        {shadow ? (
          <filter id={`${uid}-shadow`} x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        ) : null}
      </defs>

      {shadow ? (
        <polygon
          className="iso-shadow"
          points={slabPolygons(slabs[0], -2).floor}
          fill="#000"
          opacity="0.7"
          filter={`url(#${uid}-shadow)`}
          transform="translate(0 4) scale(1.04)"
        />
      ) : null}

      {slabs.map((slab, i) => {
        const poly = slabPolygons(slab, bases[i]);
        return (
          <g key={i} {...slabProps?.(i)}>
            <g {...innerProps?.(i)}>
              <polygon points={poly.left} fill={`url(#${id(slab.tone, "l")})`} />
              <polygon points={poly.right} fill={`url(#${id(slab.tone, "r")})`} />
              <polygon points={poly.top} fill={`url(#${id(slab.tone, "t")})`} />
              <polyline points={poly.rim} fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="0.45" strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
