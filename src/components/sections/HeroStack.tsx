"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { IsoStack } from "@/components/brand/IsoStack";
import type { SlabSpec } from "@/lib/iso";

// Same width ratios as the logo mark (84 / 62 / 40), in its dark-background colours.
const slabs: SlabSpec[] = [
  { w: 84, d: 62, h: 9, tone: "ivory" },
  { w: 62, d: 46, h: 8, tone: "stone" },
  { w: 40, d: 30, h: 7, tone: "amber" },
];

/**
 * The logo as a three-slab monument. Slabs settle on load (CSS), then open into an
 * exploded view as the hero scrolls away, so the layers read as separate parts.
 */
export function HeroStack({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height * 1.1)));
      el.style.setProperty("--explode", progress.toFixed(3));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="hero-stack relative flex h-full w-full items-center justify-center">
      <IsoStack
        slabs={slabs}
        gap={4.5}
        shadow
        title={label}
        className="h-full max-h-full w-auto max-w-full overflow-visible"
        slabProps={(i) => ({
          className: "slab-explode",
          style: { "--layer": i } as CSSProperties,
        })}
        innerProps={(i) => ({
          className: "slab-drop",
          style: { "--delay": `${i * 240}ms` } as CSSProperties,
        })}
      />
    </div>
  );
}
