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

/** Opening amount the stack settles into after landing, so the layer labels show. */
const REST = 0.22;

/**
 * The logo as a three-slab object. Slabs settle on load, part slightly so each layer
 * is named, open further into an exploded view on scroll, and follow the pointer.
 */
export function HeroStack({ label, layers }: { label: string; layers: [string, string, string] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let rest = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - rect.top) / (rect.height * 1.2)));
      el.style.setProperty("--explode", (rest + progress * (1 - rest)).toFixed(3));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const settle = window.setTimeout(() => {
      rest = REST;
      update();
    }, 1300);

    // Pointer parallax on devices with a fine pointer
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      el.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={ref} className="hero-stack relative flex h-full w-full items-center justify-center">
      <IsoStack
        slabs={slabs}
        gap={4.5}
        shadow
        pulses
        sheen
        labels={layers}
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
