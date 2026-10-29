import type { CSSProperties } from "react";
import { IsoStack } from "@/components/brand/IsoStack";
import type { Dictionary } from "@/content";
import { Words } from "@/components/ui/Words";
import { FlowMark } from "@/components/layout/FlowMark";
import { strataSlabs } from "./strata-slabs";
import { StrataStack } from "./StrataStack";

/** The page's scroll story: one slab lands for each layer the reader reaches (StrataStack). */
export function Strata({ dict }: { dict: Dictionary }) {
  const { strata } = dict;
  const slabs = strataSlabs(strata.layers);

  return (
    <section id="strata" aria-labelledby="strata-title" className="frame section-y">
      <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <FlowMark dict={dict} id="strata" className="mb-6" />
          <h2 id="strata-title" data-reveal="words" className="text-title font-bold">
            <Words text={strata.heading} />
          </h2>
          <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-6 max-w-[46ch] text-statement">
            {strata.intro}
          </p>

          <ol className="mt-6 lg:mt-0">
            {strata.layers.map((layer, i) => (
              <li key={layer.id} data-layer data-reveal className="flex flex-col justify-center py-12 lg:min-h-[62svh] lg:py-10">
                {/* Phones: the stack so far, drawn beside each layer instead of a sticky overlay */}
                <IsoStack
                  slabs={slabs.slice(0, i + 1)}
                  gap={4}
                  className="mb-6 h-32 w-auto self-end lg:hidden"
                  slabProps={(j) => ({ className: "mini-slab", style: { "--layer": j } as CSSProperties })}
                />
                <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-title font-bold">{layer.name}</span>
                  <span className="latin text-small text-stone" dir="ltr">
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
          <StrataStack layers={strata.layers} />
        </div>
      </div>
    </section>
  );
}
