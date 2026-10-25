import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { LogoMark } from "@/components/brand/Logo";

export function About({ dict }: { dict: Dictionary }) {
  const { about } = dict;
  return (
    <section id="about" aria-labelledby="about-title" className="frame section-y bg-basalt">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="about-title" data-reveal className="max-w-[18ch] text-title font-bold">
            {about.heading}
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

      <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:mt-24">
        {about.founders.map((founder, i) => (
          <li key={i} data-reveal style={{ "--i": i } as CSSProperties} className="grid grid-cols-[8rem_1fr] gap-6 sm:grid-cols-[11rem_1fr]">
            {/* Placeholder frame for the founder's portrait */}
            <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[var(--radius-slab)] bg-night text-center">
              <LogoMark tone="dark" className="w-1/2 opacity-25" />
              <span className="absolute inset-x-2 bottom-3 text-small text-stone">{founder.photoLabel}</span>
            </div>
            <div className="self-center">
              <h3 className="text-statement font-bold">{founder.name}</h3>
              <p className="mt-1 font-semibold text-stone">{founder.role}</p>
              <p className="mt-4 max-w-[44ch] text-body">{founder.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
