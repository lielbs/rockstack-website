import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Photo } from "@/components/ui/Photo";

export function Difference({ dict }: { dict: Dictionary }) {
  const { difference } = dict;
  return (
    <section id="difference" aria-labelledby="difference-title" className="frame section-y bg-basalt">
      <h2 id="difference-title" data-reveal className="max-w-[16ch] text-title font-bold">
        {difference.heading}
      </h2>

      <div className="mt-14 grid grid-cols-1 items-center gap-x-8 gap-y-12 lg:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 data-reveal className="text-statement font-bold">
            {difference.lead.title}
          </h3>
          <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-3 max-w-[32ch] text-statement">

            {difference.lead.text}
          </p>
          <p data-reveal style={{ "--i": 2 } as CSSProperties} className="mt-6 max-w-[48ch] text-body">
            {difference.lead.note}
          </p>
        </div>
        <div data-reveal style={{ "--i": 2 } as CSSProperties} className="lg:col-span-4 lg:col-start-9">
          <Photo photo={difference.photo} sizes="(min-width: 1024px) 30vw, 100vw" frameRatio={4 / 5} />
        </div>
      </div>

      <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
        {difference.points.map((point, i) => (
          <li key={point.title} data-reveal style={{ "--i": i } as CSSProperties}>
            <span aria-hidden="true" className="block h-1.5 w-10 rounded-[1px] bg-amber" />
            <h3 className="mt-6 text-body font-bold">{point.title}</h3>
            <p className="mt-3 max-w-[34ch] text-body">{point.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
