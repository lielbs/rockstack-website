import type { Dictionary } from "@/content";

const terminalRows = [
  ["01", "interface", "web · apps · product"],
  ["02", "intelligence", "agents · automation · ai"],
  ["03", "systems", "api · data · workflows"],
  ["04", "foundation", "cloud · security · ops"],
] as const;

const slices = [
  { word: "RO", tone: "ink" },
  { word: "CK", tone: "ivory" },
  { word: "ST", tone: "amber" },
  { word: "ACK", tone: "ink" },
  { word: "BU", tone: "ivory" },
  { word: "ILD", tone: "ink" },
  { word: "SH", tone: "amber" },
  { word: "IP", tone: "ivory" },
] as const;

/** Reference-led editorial opening: fragmented type reveals the engineered system beneath. */
export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section id="top" aria-labelledby="hero-title" className="v5-hero">
      <div className="v5-hero-grid" aria-hidden="true" />

      <div className="frame v5-hero-layout">
        <div className="v5-hero-copy">
          <div className="v5-kicker" dir="ltr">
            <span>ROCKSTACK / DIGITAL SYSTEMS</span>
            <i aria-hidden="true" />
            <span>EST. 2026</span>
          </div>

          <h1 id="hero-title" className="v5-title">
            <span>{hero.lines[0]}</span>
            <span>{hero.lines[1]}</span>
          </h1>

          <p className="v5-lead">{hero.lead}</p>

          <div className="v5-actions">
            <a href="#contact" className="v5-button v5-button-primary">
              <span>{hero.cta}</span>
              <b aria-hidden="true">↖</b>
            </a>
            <a href="#lab" className="v5-button v5-button-quiet">
              <span>{hero.secondary}</span>
              <b aria-hidden="true">↓</b>
            </a>
          </div>

          <ul className="v5-proof">
            {hero.proof.map((item) => (
              <li key={item.code}>
                <b dir="ltr">{item.code}</b>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <SystemSlice />
      </div>

      <div className="frame v5-hero-index" dir="ltr" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <i />
        <span>01 — 09</span>
      </div>
    </section>
  );
}

function SystemSlice() {
  return (
    <div className="v5-slice-wrap">
      <div
        className="v5-slice-poster"
        tabIndex={0}
        role="img"
        aria-label="פוסטר אינטראקטיבי שמציג את שכבות המערכת של RockStack; במעבר או במיקוד נחשפת שכבת הקוד"
      >
        <div className="v5-terminal" dir="ltr" aria-hidden="true">
          <div className="v5-terminal-head">
            <span><i /><i /><i /></span>
            <b>rockstack.system.ts</b>
            <em>PRODUCTION READY</em>
          </div>
          <div className="v5-terminal-body">
            <p><span>const</span> system = <b>await</b> RockStack.build&#40;&#123;</p>
            {terminalRows.map(([index, key, value]) => (
              <p key={key} className="v5-code-row">
                <small>{index}</small>
                <strong>{key}:</strong>
                <em>&quot;{value}&quot;,</em>
              </p>
            ))}
            <p>&#125;&#41;;</p>
            <p className="v5-code-status"><span>●</span> deploy.status = &quot;ready&quot;;</p>
          </div>
        </div>

        <div className="v5-slices" aria-hidden="true">
          {slices.map((slice, index) => (
            <span key={index} className={`v5-slice v5-slice-${slice.tone}`}>
              <b>{slice.word}</b>
              <small>{String(index + 1).padStart(2, "0")}</small>
            </span>
          ))}
        </div>

        <div className="v5-slice-caption" dir="ltr" aria-hidden="true">
          <span>MOVE / FOCUS TO REVEAL THE SYSTEM</span>
          <span>WEB · AI · DATA · OPS</span>
        </div>
      </div>
    </div>
  );
}
