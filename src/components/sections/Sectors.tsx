import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Photo } from "@/components/ui/Photo";
import { SectorNames } from "./SectorNames";

export function Sectors({ dict }: { dict: Dictionary }) {
  const { sectors } = dict;
  return (
    <section id="sectors" aria-labelledby="sectors-title" className="frame section-y bg-night">
      <h2 id="sectors-title" data-reveal className="max-w-[20ch] text-title font-bold">
        {sectors.heading}
      </h2>
      <div className="mt-12 grid grid-cols-1 items-end gap-x-8 gap-y-10 lg:mt-16 lg:grid-cols-12">
        <p data-reveal style={{ "--i": 1 } as CSSProperties} className="max-w-[36ch] text-body lg:order-2 lg:col-span-4 lg:col-start-9">
          {sectors.lead}
        </p>
        <SectorNames names={sectors.names} label={sectors.heading} />
      </div>

      <div data-reveal className="mt-20 lg:mt-28">
        <Photo photo={sectors.photo} sizes="100vw" frameRatio={3} className="-mx-[var(--margin)] lg:mx-0" />
      </div>

      <div className="mt-14">
        <h3 className="text-small font-semibold text-stone">{sectors.logosLabel}</h3>
        <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <li
              key={i}
              className="grid aspect-[5/2] place-items-center rounded-[var(--radius-slab)] bg-basalt-raised text-small text-stone"
            >
              {sectors.logoPlaceholder}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
