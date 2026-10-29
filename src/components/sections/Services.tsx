import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Words } from "@/components/ui/Words";
import { FlowMark } from "@/components/layout/FlowMark";

const order = [2, 0, 1, 3, 4];

/** Capabilities presented as a product-system bento grid, with AI leading the story. */
export function Services({ dict }: { dict: Dictionary }) {
  const { services } = dict;
  const groups = order.map((index) => services.groups[index]).filter(Boolean);

  return (
    <section id="services" aria-labelledby="services-title" className="ai-services frame section-y">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <FlowMark dict={dict} id="services" />
          <h2 id="services-title" data-reveal="words" className="mt-5 max-w-[14ch] text-title font-bold">
            <Words text={services.heading} />
          </h2>
        </div>
        <p data-reveal style={{ "--i": 1 } as CSSProperties} className="max-w-[42ch] self-end text-statement text-stone lg:col-span-5 lg:col-start-8">
          {services.intro}
        </p>
      </div>

      <div className="ai-bento mt-16 lg:mt-24">
        {groups.map((group, gi) => (
          <article
            key={group.latin}
            data-reveal
            data-spotlight
            style={{ "--i": gi } as CSSProperties}
            className={`ai-bento-card ai-bento-${gi + 1}`}
          >
            <div className="ai-card-top">
              <span className="ai-card-index" dir="ltr">0{gi + 1}</span>
              <span className="ai-card-signal" aria-hidden="true" />
              <span className="latin text-small text-stone" dir="ltr">{group.latin}</span>
            </div>
            <h3 className="mt-10 text-title font-bold">{group.name}</h3>
            <ul className="mt-8 space-y-5">
              {group.items.map((item) => (
                <li key={item.name} className="ai-service-row">
                  <span className="ai-service-icon" aria-hidden="true">↗</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.benefit}</small>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
