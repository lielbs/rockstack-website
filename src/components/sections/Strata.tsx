"use client";

import { useEffect, useRef, useState } from "react";
import { IsoStack } from "@/components/brand/IsoStack";
import type { Dictionary } from "@/content";
import type { LayerId } from "@/content/types";
import type { SlabSpec } from "@/lib/iso";

const slabByLayer: Record<LayerId, SlabSpec> = {
  infra: { w: 100, d: 72, h: 8.5, tone: "basalt" },
  security: { w: 86, d: 62, h: 8, tone: "slateDeep" },
  systems: { w: 72, d: 52, h: 7.5, tone: "slate" },
  apps: { w: 58, d: 42, h: 7, tone: "stone" },
  ai: { w: 44, d: 32, h: 6.5, tone: "amber" },
};

/** The page's scroll story: one slab lands for each layer the reader reaches. */
export function Strata({ dict }: { dict: Dictionary }) {
  const { strata } = dict;
  const [count, setCount] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const line = window.innerHeight * 0.62;
      const reached = blocks.current.filter((el) => el && el.getBoundingClientRect().top < line).length;
      setCount(reached);
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

  const slabs = strata.layers.map((l) => slabByLayer[l.id]);
  const current = strata.layers[Math.max(0, count - 1)];

  return (
    <section id="strata" aria-labelledby="strata-title" className="frame section-y bg-ivory">
      <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="strata-title" data-reveal className="text-title font-bold">
            {strata.heading}
          </h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[46ch] text-statement">
            {strata.intro}
          </p>

          <ol className="mt-6 lg:mt-0">
            {strata.layers.map((layer, i) => (
              <li
                key={layer.id}
                ref={(el) => {
                  blocks.current[i] = el;
                }}
                data-reveal
                className="flex flex-col justify-center py-12 lg:min-h-[62svh] lg:py-10"
              >
                {/* Phones: the stack so far, drawn beside each layer instead of a sticky overlay */}
                <IsoStack slabs={slabs.slice(0, i + 1)} gap={4} className="mb-6 h-28 w-auto self-end lg:hidden" />
                <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-title font-bold">{layer.name}</span>
                  <span className="latin text-small text-slate" dir="ltr">
                    {layer.latin}
                  </span>
                </h3>
                <p className="mt-5 max-w-[40ch] text-statement">{layer.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop: one sticky stack that grows as each layer is reached */}
        <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
          <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center pt-[var(--header-h)]">
            <IsoStack
              slabs={slabs}
              gap={4}
              title={strata.layers.map((l) => l.name).join(", ")}
              className="h-auto w-full max-w-[34rem] overflow-visible"
              slabProps={(i) => ({ className: "strata-slab", "data-on": String(i < count) })}
            />
            <p className="mt-8 flex h-7 items-baseline gap-2 text-small font-semibold text-slate" aria-live="polite">
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
        </div>
      </div>
    </section>
  );
}
