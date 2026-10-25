import type { Dictionary } from "@/content";
import { HeroStack } from "./HeroStack";

/** First screen: the promise in two lines, then the logo slabs as a lit product render. */
export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict;
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="hero-light frame relative isolate grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 content-center items-center gap-x-8 gap-y-6 overflow-hidden bg-night py-[clamp(1.5rem,5vh,5rem)] lg:gap-y-10 text-center lg:grid-cols-12 lg:text-start"
    >
      <div className="flex flex-col items-center lg:col-span-6 lg:items-start">
        <h1 id="hero-title" className="hero-title text-display font-bold">
          <span className="block whitespace-nowrap">{hero.lines[0]}</span>
          <span className="block whitespace-nowrap text-stone">{hero.lines[1]}</span>
        </h1>
        <p className="mt-6 max-w-[40ch] text-statement text-stone md:mt-8">{hero.lead}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
          <a href="#contact" className="btn btn-primary">
            {hero.cta}
          </a>
          <a href="#strata" className="btn btn-ghost mb-3">
            {hero.secondary}
            <span className="ghost-icon" aria-hidden="true">
              <ArrowDown />
            </span>
          </a>
        </div>
        <p className="mt-10 text-small text-stone lg:mt-14">
          <span className="latin tracking-[0.04em]" dir="ltr" translate="no">
            {dict.descriptor}
          </span>
        </p>
      </div>

      <div className="order-first h-[clamp(12rem,30svh,20rem)] w-full lg:order-none lg:col-span-6 lg:h-[min(66svh,40rem)]">
        <HeroStack label="שלוש שכבות: תשתית ואבטחה בבסיס, מערכות ונתונים באמצע, אפליקציות ו-AI למעלה" layers={hero.layers} />
      </div>
    </section>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
      <path d="M10 3v13M4.5 10.5 10 16l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
