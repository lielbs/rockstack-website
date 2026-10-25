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
  /** One label per slab, drawn to the side with a leader line (class "explode-label"). */
  labels?: string[];
  /** Amber data pulses running along each slab's front edges. */
  pulses?: boolean;
  /** A slow band of light passing over the slabs. */
  sheen?: boolean;
  title?: string;
};

const COS = Math.cos(Math.PI / 6);
const LABEL_PAD = 78;

/** An isometric stack of stone slabs, rendered with lit faces and a fine edge highlight. */
export function IsoStack({
  slabs,
  gap = 6,
  className,
  slabProps,
  innerProps,
  shadow = false,
  labels,
  pulses = false,
  sheen = false,
  title,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const bases = stackBases(slabs, gap);
  const tones = Array.from(new Set(slabs.map((s) => s.tone)));
  const id = (tone: SlabTone, face: string) => `${uid}-${tone}-${face}`;
  const floorPad = shadow ? 10 : 0;

  let viewBox = stackViewBox(slabs, gap, 8, floorPad);
  const maxSpan = (Math.max(...slabs.map((s) => s.w)) + Math.max(...slabs.map((s) => s.d))) / 2;
  if (labels) {
    const [x, y, w, h] = viewBox.split(" ").map(Number);
    viewBox = `${(x - LABEL_PAD).toFixed(1)} ${y} ${(w + LABEL_PAD).toFixed(1)} ${h}`;
  }

  return (
    <svg
      viewBox={viewBox}
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
        {sheen ? (
          <linearGradient id={`${uid}-sheen`} gradientUnits="userSpaceOnUse" x1="-30" y1="-40" x2="10" y2="20">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-140 0; -140 0; 160 0"
              keyTimes="0; 0.55; 1"
              dur="7s"
              repeatCount="indefinite"
            />
          </linearGradient>
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
        const [a, b, c] = poly.rim.split(" ");
        const cornerX = (-(slab.w + slab.d) / 2) * COS;
        const midY = ((slab.d - slab.w) / 2) * 0.5 - (bases[i] + slab.h / 2);
        const labelX = -maxSpan * COS - 10;
        return (
          <g key={i} {...slabProps?.(i)}>
            <g {...innerProps?.(i)}>
              <polygon points={poly.left} fill={`url(#${id(slab.tone, "l")})`} />
              <polygon points={poly.right} fill={`url(#${id(slab.tone, "r")})`} />
              <polygon points={poly.top} fill={`url(#${id(slab.tone, "t")})`} />
              {sheen ? <polygon className="iso-motion" points={poly.top} fill={`url(#${uid}-sheen)`} /> : null}
              <polyline points={poly.rim} fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="0.45" strokeLinejoin="round" />
              {pulses ? (
                <circle className="iso-motion" r="1.1" fill="#E8892B">
                  <animateMotion
                    dur={`${3.4 + i * 0.9}s`}
                    begin={`${1.2 + i * 0.5}s`}
                    repeatCount="indefinite"
                    path={`M${a} L${b} L${c}`}
                    keyPoints="0;1;0"
                    keyTimes="0;0.5;1"
                    calcMode="linear"
                  />
                </circle>
              ) : null}
            </g>
            {labels?.[i] ? (
              <g className="explode-label">
                <line x1={cornerX - 2} y1={midY} x2={labelX + 2} y2={midY} stroke="#A3A9B2" strokeWidth="0.35" strokeDasharray="1 1.2" />
                <circle cx={cornerX - 2} cy={midY} r="0.9" fill="#E8892B" />
                <text
                  x={labelX}
                  y={midY + 2.6}
                  direction="rtl"
                  textAnchor="start"
                  fontSize="7.4"
                  fontWeight="600"
                  fill="#F4F2EE"
                  style={{ fontFamily: "var(--font-heebo), sans-serif" }}
                >
                  {labels[i]}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
