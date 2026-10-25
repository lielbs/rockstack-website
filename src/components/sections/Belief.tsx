import type { Dictionary } from "@/content";
import { MonitorPanel } from "./MonitorPanel";

export function Belief({ dict }: { dict: Dictionary }) {
  const { belief } = dict;
  return (
    <section id="belief" aria-labelledby="belief-title" className="on-dark grain frame section-y bg-basalt text-ivory">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="belief-title" data-reveal="mask" className="max-w-[18ch] text-title font-bold">
            {belief.heading}
          </h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-8 max-w-[44ch] text-statement text-ivory">
            {belief.statement}
          </p>

          <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            <div data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <h3 className="text-small font-semibold text-stone">{belief.quickTitle}</h3>
              <ul className="mt-5 space-y-3 text-body text-stone">
                {belief.quick.map((item) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="inline-block h-1 w-3 shrink-0 translate-y-[-0.3em] rounded-[1px] bg-slate" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal style={{ "--i": 3 } as React.CSSProperties}>
              <h3 className="text-small font-semibold text-ivory">{belief.slowTitle}</h3>
              <ul className="mt-5 space-y-3 text-body font-semibold text-ivory">
                {belief.slow.map((item) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="inline-block h-1.5 w-5 shrink-0 translate-y-[-0.25em] rounded-[1px] bg-amber" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p data-reveal className="mt-16 max-w-[30ch] text-statement font-semibold text-ivory">
            {belief.close}
          </p>
        </div>

        <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-28">
            <MonitorPanel monitor={belief.monitor} />
          </div>
        </div>
      </div>
    </section>
  );
}
