"use client";

import { useEffect, useState } from "react";
import { IsoStack } from "@/components/brand/IsoStack";
import type { Dictionary } from "@/content";
import { strataSlabs } from "./strata-slabs";

/** Sticky stack beside the layer list; counts the layers whose top has passed the reading line. */
export function StrataStack({ layers }: { layers: Dictionary["strata"]["layers"] }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("#strata [data-layer]"));
    let frame = 0;
    const update = () => {
      const line = window.innerHeight * 0.62;
      setCount(blocks.filter((el) => el.getBoundingClientRect().top < line).length);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = layers[Math.max(0, count - 1)];

  return (
    <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center pt-[var(--header-h)]">
      <IsoStack
        slabs={strataSlabs(layers)}
        gap={4}
        sheen
        pulses
        title={layers.map((l) => l.name).join(", ")}
        className="h-auto w-full max-w-[34rem] overflow-visible"
        slabProps={(i) => ({ className: "strata-slab", "data-on": String(i < count) })}
      />
      <p className="mt-8 flex h-7 items-baseline gap-2 text-small font-semibold text-stone" aria-live="polite">
        {count > 0 ? (
          <>
            <span>{current.name}</span>
            <span className="latin font-normal" dir="ltr">
              {current.latin}
            </span>
          </>
        ) : null}
      </p>
    </div>
  );
}
