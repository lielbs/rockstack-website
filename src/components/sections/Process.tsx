import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Words } from "@/components/ui/Words";

/** Delivery pipeline: clear, technical and intentionally free of decorative metaphors. */
export function Process({ dict }: { dict: Dictionary }) {
  const { process } = dict;

  return (
    <section id="process" aria-labelledby="process-title" className="ai-process on-dark frame section-y bg-basalt text-ivory">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="ai-section-kicker" dir="ltr">DELIVERY PIPELINE / 02</p>
          <h2 id="process-title" data-reveal="words" className="mt-5 max-w-[13ch] text-title font-bold">
            <Words text={process.heading} />
          </h2>
          <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-7 max-w-[40ch] text-statement text-stone">
            {process.intro}
          </p>
        </div>

        <ol className="ai-pipeline lg:col-span-7 lg:col-start-6">
          {process.stages.map((stage, index) => (
            <li key={stage.name} data-reveal style={{ "--i": index } as CSSProperties} className="ai-pipeline-step">
              <div className="ai-step-number" dir="ltr">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="text-statement font-bold">{stage.name}</h3>
                <p className="mt-2 max-w-[45ch] text-body text-stone">{stage.text}</p>
                <p className="ai-deliverable mt-5">
                  <span aria-hidden="true">✓</span>
                  {stage.deliverable}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div data-reveal className="ai-process-result mt-14 lg:mt-20">
        <span className="ai-status-dot" aria-hidden="true" />
        <strong dir="ltr">READY FOR PRODUCTION</strong>
        <p>{process.result}</p>
      </div>
    </section>
  );
}
