import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Words } from "@/components/ui/Words";
import { IsoStack } from "@/components/brand/IsoStack";
import type { SlabSpec } from "@/lib/iso";

const infraSlabs: SlabSpec[] = [
  { w: 84, d: 62, h: 9, tone: "ivory" },
  { w: 70, d: 52, h: 8, tone: "stoneLight" },
];
const devSlabs: SlabSpec[] = [
  { w: 56, d: 42, h: 8, tone: "slate" },
  { w: 40, d: 30, h: 7, tone: "amber" },
];

export function About({ dict }: { dict: Dictionary }) {
  const { about } = dict;
  return (
    <section id="about" aria-labelledby="about-title" className="frame section-y bg-basalt">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="about-title" data-reveal="words" className="max-w-[18ch] text-title font-bold">
            <Words text={about.heading} />
          </h2>
          <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-8 max-w-[52ch] text-statement">
            {about.text}
          </p>
        </div>
        <dl data-reveal style={{ "--i": 2 } as CSSProperties} className="grid grid-cols-2 gap-6 self-end sm:grid-cols-3 lg:col-span-4 lg:col-start-9 lg:grid-cols-1">
          {about.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-small text-stone">{fact.label}</dt>
              <dd className="mt-1 font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="mt-20 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-24">
        {about.partners.map((partner, i) => (
          <li
            key={partner.role}
            data-reveal
            data-spotlight
            style={{ "--i": i } as CSSProperties}
            className="flex flex-col rounded-[6px] bg-night p-7 sm:p-10"
          >
            {/* The lower layers for infrastructure, the upper layers for development */}
            <IsoStack
              slabs={i === 0 ? infraSlabs : devSlabs}
              gap={4}
              sheen
              className="h-20 w-auto self-start"
              slabProps={(j) => ({ className: "mini-slab", style: { "--layer": j } as CSSProperties })}
            />
            <h3 className="mt-8 text-statement font-bold">{partner.role}</h3>
            <ul className="mt-5 space-y-2.5 text-body text-stone">
              {partner.areas.map((area) => (
                <li key={area} className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="inline-block h-1 w-3 shrink-0 translate-y-[-0.3em] rounded-[1px] bg-amber" />
                  {area}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
