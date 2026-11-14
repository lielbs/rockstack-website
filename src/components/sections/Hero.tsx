import type { Dictionary } from "@/content";
import { LayerStack } from "./LayerStack";

/** Editorial opening: the offer in words, and the logo as a stack of the layers we build (CSS 3D, no canvas). */
export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="v4-hero frame relative isolate min-h-[calc(100svh-var(--header-h))] overflow-hidden"
    >
      <div className="v4-hero-grid" aria-hidden="true" />

      <div className="relative z-10 grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 items-center gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
        <div className="v4-hero-copy lg:col-span-6">
          <div className="v4-kicker" dir="ltr">
            <span>RS / 01</span>
            <i aria-hidden="true" />
            <span>WEB · APPS · AUTOMATION · AI</span>
          </div>

          <h1 id="hero-title" className="v4-title mt-7">
            <span>{hero.lines[0]}</span>
            <span>{hero.lines[1]}</span>
          </h1>

          <p className="v4-lead mt-8 max-w-[45ch]">{hero.lead}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="v4-cta-primary">
              {hero.cta}
              <span aria-hidden="true">↖</span>
            </a>
            <a href="#lab" className="v4-cta-secondary">
              {hero.secondary}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <ul className="v4-proof mt-14">
            {hero.proof.map((item) => (
              <li key={item.code}>
                <b dir="ltr">{item.code}</b>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <LayerStack stack={hero.stack} />
        </div>
      </div>
    </section>
  );
}
