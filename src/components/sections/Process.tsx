import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Words } from "@/components/ui/Words";
import { Photo } from "@/components/ui/Photo";

/** Zigzag bottom edge for the paper slip: `teeth` triangles, `depth` px deep. */
function zigzag(teeth: number, depth: number): string {
  const points = ["0 0", "100% 0"];
  for (let i = teeth; i >= 0; i--) {
    const x = (i / teeth) * 100;
    const y = i % 2 === 0 ? "100%" : `calc(100% - ${depth}px)`;
    points.push(`${x.toFixed(3)}% ${y}`);
  }
  return `polygon(${points.join(", ")})`;
}

/** The process printed as a work order on a paper slip. */
export function Process({ dict }: { dict: Dictionary }) {
  const { process } = dict;
  return (
    <section id="process" aria-labelledby="process-title" className="on-dark frame section-y bg-slate text-ivory">
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="process-title" data-reveal="words" className="max-w-[14ch] text-title font-bold">
            <Words text={process.heading} />
          </h2>
          <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-6 max-w-[38ch] text-statement text-ivory">
            {process.intro}
          </p>
          <div data-reveal style={{ "--i": 2 } as CSSProperties} className="mt-12">
            <Photo photo={process.photo} sizes="(min-width: 1024px) 36vw, 100vw" frameRatio={3 / 2} />
          </div>
        </div>

        <div data-reveal style={{ "--i": 1 } as CSSProperties} className="lg:col-span-6 lg:col-start-7">
          <div className="slip-print">
          <div
            className="bg-ivory px-5 pb-12 pt-7 text-basalt sm:px-9 sm:pt-9"
            style={{ clipPath: zigzag(40, 10) }}
          >
            <table className="w-full border-collapse text-start">
              <caption className="mb-6 text-start">
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-statement font-bold">{process.ticketTitle}</span>
                  <span className="text-small text-slate">{process.ticketMeta}</span>
                </span>
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">שלב</th>
                  <th scope="col">{process.deliverableLabel}</th>
                </tr>
              </thead>
              <tbody>
                {process.stages.map((stage, n) => (
                  <tr
                    key={stage.name}
                    className="slip-row border-b-[3px] border-dotted border-stone align-top last:border-b-0"
                    style={{ "--n": n } as CSSProperties}
                  >
                    <th scope="row" className="py-5 pe-4 text-start font-normal">
                      <span className="flex items-center gap-2.5 font-bold">
                        <Tick n={n} />
                        {stage.name}
                      </span>
                      <span className="mt-1 block max-w-[34ch] text-small text-slate">{stage.text}</span>
                    </th>
                    <td className="py-5 text-end text-small font-semibold sm:whitespace-nowrap">{stage.deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p
              className="slip-row mt-4 bg-basalt px-5 py-4 font-semibold text-ivory"
              style={{ "--n": process.stages.length } as CSSProperties}
            >
              {process.result}
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A check mark that draws itself when its row is printed. */
function Tick({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 20 20" className="tick size-5 shrink-0" style={{ "--n": n } as CSSProperties} aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" rx="4" fill="#16191D" />
      <path d="M5.5 10.5l3 3 6-7" fill="none" stroke="#E8892B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
