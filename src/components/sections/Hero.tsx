import type { Dictionary } from "@/content";
import { HeroStack } from "./HeroStack";

export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict;
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="frame relative flex min-h-[calc(100svh-var(--header-h))] flex-col pb-8 pt-[clamp(2rem,6vh,5rem)] md:pb-10"
    >
      <h1 id="hero-title" className="text-display font-extrabold">
        <span className="block whitespace-nowrap">{hero.lines[0]}</span>
        <span className="block whitespace-nowrap">{hero.lines[1]}</span>
      </h1>

      <div className="mt-8 grid flex-1 grid-cols-1 items-end gap-x-8 gap-y-10 md:mt-12 md:grid-cols-12">
        <div className="md:col-span-5 md:self-start">
          <p className="max-w-[38ch] text-statement text-basalt">{hero.lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#contact" className="btn btn-primary">
              {hero.cta}
            </a>
            <a href="#strata" className="link-quiet group inline-flex items-center gap-2 font-semibold">
              {hero.secondary}
              <ArrowDown />
            </a>
          </div>
        </div>

        <div className="h-[clamp(13rem,42svh,30rem)] md:col-span-7 md:col-start-6">
          <HeroStack label="שלוש שכבות של סלע: בסיס כהה, שכבת ביניים ושכבה עליונה בכתום" />
        </div>
      </div>

      <p className="mt-8 text-small text-slate">
        <span className="latin tracking-[0.02em]" dir="ltr" translate="no">
          {dict.descriptor}
        </span>
      </p>
    </section>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true">
      <path d="M10 3v13M4.5 10.5 10 16l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
