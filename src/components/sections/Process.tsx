import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { FlowMark } from "@/components/layout/FlowMark";

/** A connected delivery sequence inspired by liquid tags, implemented with static HTML/CSS. */
export function Process({ dict }: { dict: Dictionary }) {
  const { process } = dict;

  return (
    <section id="process" aria-labelledby="process-title" className="v5-process">
      <div className="frame section-y">
        <div className="v5-process-intro">
          <div>
            <FlowMark dict={dict} id="process" />
            <h2 id="process-title" data-reveal="words" className="v5-process-title">
              {process.heading}
            </h2>
          </div>
          <p data-reveal style={{ "--i": 1 } as CSSProperties} className="v5-process-lead">
            {process.intro}
          </p>
        </div>

        <ol className="v5-process-chain">
          {process.stages.map((stage, index) => (
            <li
              key={stage.name}
              data-reveal
              style={{ "--i": index } as CSSProperties}
              className="v5-process-step"
            >
              <div className="v5-process-step-head">
                <span dir="ltr">{String(index + 1).padStart(2, "0")}</span>
                <small dir="ltr">{index === process.stages.length - 1 ? "LIVE" : "PHASE"}</small>
              </div>
              <h3>{stage.name}</h3>
              <p>{stage.text}</p>
              <div className="v5-process-output">
                <i aria-hidden="true">✓</i>
                <span>{stage.deliverable}</span>
              </div>
            </li>
          ))}
        </ol>

        <div data-reveal className="v5-process-result">
          <div dir="ltr"><i aria-hidden="true" /> READY FOR PRODUCTION</div>
          <p>{process.result}</p>
        </div>
      </div>
    </section>
  );
}
