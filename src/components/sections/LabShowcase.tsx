import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { FlowMark } from "@/components/layout/FlowMark";

const posters = [
  {
    index: "01",
    eyebrow: "DIGITAL PRODUCTS",
    title: "BUILD",
    hebrew: "אתרים ואפליקציות",
    text: "ממשקים מדויקים ומהירים, מחוברים למערכות העסק ומוכנים לצמוח.",
    meta: ["WEB", "MOBILE", "UX/UI"],
    tone: "night",
    mark: "portal",
  },
  {
    index: "02",
    eyebrow: "INTELLIGENT WORKFLOWS",
    title: "AUTOMATE",
    hebrew: "AI ואוטומציות",
    text: "סוכנים, בוטים ותהליכים שמבינים מידע, מפעילים כלים ומורידים עבודה ידנית.",
    meta: ["AGENTS", "APIs", "WORKFLOWS"],
    tone: "amber",
    mark: "signal",
  },
  {
    index: "03",
    eyebrow: "RELIABLE FOUNDATIONS",
    title: "OPERATE",
    hebrew: "מערכות, ענן ותשתיות",
    text: "הקוד, הנתונים, האבטחה והניטור מתוכננים יחד — כדי שהמערכת תחזיק בפרודקשן.",
    meta: ["CLOUD", "SECURITY", "DATA"],
    tone: "ivory",
    mark: "stack",
  },
] as const;

/** Poster-led capability showcase. The examples describe project types, not client claims. */
export function LabShowcase({ dict }: { dict: Dictionary }) {
  return (
    <section id="lab" aria-labelledby="lab-title" className="v5-lab frame section-y">
      <div className="v5-lab-intro">
        <div>
          <FlowMark dict={dict} id="lab" />
          <h2 id="lab-title" data-reveal="words" className="v5-section-title">
            לא רק לפתח מוצר.
            <span>לבנות את כל המערכת שמחזיקה אותו.</span>
          </h2>
        </div>
        <p data-reveal style={{ "--i": 1 } as CSSProperties} className="v5-section-lead">
          RockStack מחברת עיצוב, פיתוח, AI ותשתיות לשפה אחת. כל שכבה נראית מצוין בפני עצמה — ועובדת טוב יותר כחלק ממערכת שלמה.
        </p>
      </div>

      <div className="v5-poster-grid">
        {posters.map((poster, index) => (
          <article
            key={poster.title}
            data-reveal
            style={{ "--i": index } as CSSProperties}
            className={`v5-poster v5-poster-${poster.tone}`}
          >
            <header className="v5-poster-head" dir="ltr">
              <span>{poster.index}</span>
              <b>{poster.eyebrow}</b>
              <i />
              <em>RS</em>
            </header>

            <PatternMark variant={poster.mark} />

            <div className="v5-poster-copy">
              <p dir="ltr">{poster.title}</p>
              <h3>{poster.hebrew}</h3>
              <div className="v5-poster-reveal">
                <span>{poster.text}</span>
                <ul dir="ltr">
                  {poster.meta.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="v5-lab-note">שלושה תחומי ביצוע, צוות אחד ואחריות אחת — מהרעיון ועד מערכת יציבה באוויר.</p>
    </section>
  );
}

function PatternMark({ variant }: { variant: "portal" | "signal" | "stack" }) {
  const dots = Array.from({ length: 49 });

  return (
    <div className={`v5-pattern v5-pattern-${variant}`} aria-hidden="true">
      {dots.map((_, index) => <i key={index} style={{ "--d": index } as CSSProperties} />)}
      <span />
    </div>
  );
}
