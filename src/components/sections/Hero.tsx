import type { Dictionary } from "@/content";
import { HeroStack } from "./HeroStack";

/** High-signal opening: product promise, live system canvas and clear conversion path. */
export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="ai-hero frame relative isolate min-h-[calc(100svh-var(--header-h))] overflow-hidden bg-night py-[clamp(3rem,7vh,6rem)]"
    >
      <div className="ai-grid" aria-hidden="true" />
      <div className="relative z-10 grid min-h-[calc(100svh-var(--header-h)-6rem)] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col items-start text-start lg:col-span-6">
          <p className="ai-eyebrow" dir="ltr">
            <span className="ai-status-dot" />
            AI-NATIVE DIGITAL STUDIO
          </p>

          <h1 id="hero-title" className="hero-title mt-7 text-display font-bold">
            <span className="block">{hero.lines[0]}</span>
            <span className="ai-gradient-text block">{hero.lines[1]}</span>
          </h1>

          <p className="mt-7 max-w-[46ch] text-statement text-stone md:mt-9">{hero.lead}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#contact" className="ai-button ai-button-primary">
              <span>{hero.cta}</span>
              <ArrowUpLeft />
            </a>
            <a href="#services" className="ai-button ai-button-quiet">
              {hero.secondary}
              <span className="ai-arrow" aria-hidden="true">↓</span>
            </a>
          </div>

          <ul className="ai-capabilities mt-12" aria-label="תחומי התמחות">
            <li><span>01</span> AI Agents</li>
            <li><span>02</span> Web Products</li>
            <li><span>03</span> Automation</li>
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="ai-console">
            <div className="ai-console-head">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span /><span /><span />
              </div>
              <p dir="ltr">ROCKSTACK / BUILD SYSTEM</p>
              <p className="ai-online" dir="ltr">● ONLINE</p>
            </div>

            <div className="ai-stage">
              <div className="ai-stage-orbit" aria-hidden="true" />
              <HeroStack
                label="מערכת דיגיטלית שלמה: תשתית ואבטחה בבסיס, מערכות ונתונים באמצע, אפליקציות ו-AI למעלה"
                layers={hero.layers}
              />
              <div className="ai-node ai-node-one" aria-hidden="true"><b>AI</b><small>reasoning</small></div>
              <div className="ai-node ai-node-two" aria-hidden="true"><b>API</b><small>connected</small></div>
              <div className="ai-node ai-node-three" aria-hidden="true"><b>WEB</b><small>deployed</small></div>
            </div>

            <div className="ai-console-log" aria-hidden="true">
              <p><span>01</span><b>product.architecture</b><em>ready</em></p>
              <p><span>02</span><b>ai.workflow</b><em>connected</em></p>
              <p><span>03</span><b>production.release</b><em>stable</em></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowUpLeft() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
      <path d="M15.5 15.5 5 5m0 0h8M5 5v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
