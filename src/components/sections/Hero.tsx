import type { Dictionary } from "@/content";

/** Lightweight editorial opening: strong hierarchy, no WebGL, canvas or continuous animation. */
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
          <StackBlueprint />
        </div>
      </div>
    </section>
  );
}

function StackBlueprint() {
  const layers = [
    { id: "01", tag: "INTERFACE", title: "אתרים ואפליקציות", copy: "ממשק מהיר, ברור ונגיש." },
    { id: "02", tag: "WORKFLOW", title: "מערכות ואוטומציות", copy: "תהליך עסקי שעובד מקצה לקצה." },
    { id: "03", tag: "INTELLIGENCE", title: "סוכנים ו-AI", copy: "ידע, כלים והרשאות תחת שליטה." },
    { id: "04", tag: "DATA", title: "API ומסדי נתונים", copy: "מקור אמת אחד לכל המערכת." },
    { id: "05", tag: "FOUNDATION", title: "ענן, אבטחה ותפעול", copy: "תשתית שמוכנה לפרודקשן." },
  ];

  return (
    <div className="v4-blueprint" aria-label="חמש שכבות המערכת ש-RockStack מתכננת ומפתחת">
      <div className="v4-blueprint-head" dir="ltr">
        <span>SYSTEM BLUEPRINT</span>
        <span>ROCKSTACK / 2026</span>
      </div>

      <div className="v4-blueprint-body">
        <div className="v4-blueprint-mark" dir="ltr" aria-hidden="true">
          <strong>RS</strong>
          <span>ONE STACK<br />ONE TEAM</span>
        </div>

        <ol className="v4-blueprint-layers">
          {layers.map((layer) => (
            <li key={layer.id}>
              <span className="v4-layer-index" dir="ltr">{layer.id}</span>
              <div>
                <small dir="ltr">{layer.tag}</small>
                <h2>{layer.title}</h2>
                <p>{layer.copy}</p>
              </div>
              <i aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>

      <div className="v4-blueprint-foot" dir="ltr">
        <span>DISCOVER</span>
        <i />
        <span>DESIGN</span>
        <i />
        <span>BUILD</span>
        <i />
        <span>OPERATE</span>
      </div>
    </div>
  );
}
