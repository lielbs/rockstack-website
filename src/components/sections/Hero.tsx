import type { Dictionary } from "@/content";

/** Cinematic opening with a continuously active AI systems map. */
export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="v2-hero frame relative isolate min-h-[calc(100svh-var(--header-h))] overflow-hidden"
    >
      <div className="v2-noise" aria-hidden="true" />
      <div className="v2-beam v2-beam-a" aria-hidden="true" />
      <div className="v2-beam v2-beam-b" aria-hidden="true" />

      <div className="relative z-10 grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 items-center gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
        <div className="lg:col-span-6">
          <div className="v2-kicker" dir="ltr">
            <span className="v2-live" />
            <span>ROCKSTACK / WEB · APPS · AUTOMATION · AI</span>
          </div>

          <h1 id="hero-title" className="v2-title mt-7">
            <span>{hero.lines[0]}</span>
            <span className="v2-title-accent">{hero.lines[1]}</span>
          </h1>

          <p className="v2-lead mt-8 max-w-[45ch]">{hero.lead}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="v2-cta-primary">
              {hero.cta}
              <span aria-hidden="true">↖</span>
            </a>
            <a href="#lab" className="v2-cta-secondary">
              {hero.secondary}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <ul className="v2-proof mt-14">
            {hero.proof.map((item) => (
              <li key={item.code}>
                <b dir="ltr">{item.code}</b>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SystemMap />
        </div>
      </div>

      <div className="v2-scroll-cue" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <i />
      </div>
    </section>
  );
}

function SystemMap() {
  const connections = [
    "M320 260 C245 165 175 150 94 115",
    "M320 260 C405 175 485 162 558 120",
    "M320 260 C225 275 165 326 86 376",
    "M320 260 C412 282 486 327 564 382",
    "M320 260 C315 170 320 100 320 48",
    "M320 260 C318 352 320 410 320 472",
  ];

  const nodes = [
    { x: 94, y: 115, label: "WEB" },
    { x: 558, y: 120, label: "DATA" },
    { x: 86, y: 376, label: "APP" },
    { x: 564, y: 382, label: "API" },
    { x: 320, y: 48, label: "AI" },
    { x: 320, y: 472, label: "OPS" },
  ];

  return (
    <div className="v2-system" aria-label="מפת מערכת: אתר, אפליקציה, API, נתונים, AI ותפעול שמחוברים לליבה אחת">
      <div className="v2-system-bar">
        <span className="v2-system-dots" aria-hidden="true"><i /><i /><i /></span>
        <span dir="ltr">SYSTEM MAP</span>
        <span className="v2-system-state" dir="ltr">● RUNNING</span>
      </div>

      <div className="v2-map">
        <div className="v2-map-grid" aria-hidden="true" />
        <svg viewBox="0 0 640 520" role="img" aria-hidden="true">
          <defs>
            <radialGradient id="core-fill">
              <stop offset="0" stopColor="#182738" />
              <stop offset="1" stopColor="#0b1017" />
            </radialGradient>
            <linearGradient id="line-flow" x1="0" x2="1">
              <stop offset="0" stopColor="#7df3ff" stopOpacity=".15" />
              <stop offset=".5" stopColor="#9d8cff" stopOpacity=".9" />
              <stop offset="1" stopColor="#ff9a3d" stopOpacity=".15" />
            </linearGradient>
            <filter id="v2-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <circle cx="320" cy="260" r="154" className="v2-orbit v2-orbit-outer" />
          <circle cx="320" cy="260" r="110" className="v2-orbit v2-orbit-inner" />

          {connections.map((d, i) => (
            <g key={d}>
              <path d={d} className="v2-link-base" />
              <path d={d} className="v2-link-flow" style={{ "--delay": `${i * -0.48}s` } as React.CSSProperties} />
            </g>
          ))}

          <g className="v2-core" filter="url(#v2-glow)">
            <circle cx="320" cy="260" r="72" fill="url(#core-fill)" />
            <circle cx="320" cy="260" r="72" className="v2-core-ring" />
            <circle cx="320" cy="260" r="51" className="v2-core-ring v2-core-ring-two" />
            <text x="320" y="253" textAnchor="middle" className="v2-core-title">RS</text>
            <text x="320" y="278" textAnchor="middle" className="v2-core-sub">STACK</text>
          </g>

          {nodes.map((node, i) => (
            <g key={node.label} className="v2-map-node" style={{ "--n": i } as React.CSSProperties}>
              <circle cx={node.x} cy={node.y} r="27" className="v2-node-halo" />
              <circle cx={node.x} cy={node.y} r="20" className="v2-node-disc" />
              <text x={node.x} y={node.y + 4} textAnchor="middle">{node.label}</text>
            </g>
          ))}
        </svg>

        <div className="v2-float-card v2-float-top" dir="ltr">
          <i />
          <span><b>AGENT</b><small>processing context</small></span>
          <em>84%</em>
        </div>
        <div className="v2-float-card v2-float-bottom" dir="ltr">
          <i />
          <span><b>PRODUCTION</b><small>all systems operational</small></span>
          <em>LIVE</em>
        </div>
      </div>

      <div className="v2-system-footer" dir="ltr">
        <span>DISCOVER</span><i />
        <span>DESIGN</span><i />
        <span>BUILD</span><i />
        <span>OPERATE</span>
      </div>
    </div>
  );
}
