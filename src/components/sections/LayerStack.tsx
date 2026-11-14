"use client";

import { useState, type CSSProperties } from "react";
import type { Dictionary } from "@/content";

type Stack = Dictionary["hero"]["stack"];

// The logo mark's slabs (top to base), in units of --u. Widths keep the mark's 40 / 62 / 84 ratio.
const slabs = [
  { w: 40, d: 30, h: 7, tone: "amber" },
  { w: 62, d: 46, h: 8, tone: "stone" },
  { w: 84, d: 62, h: 9, tone: "ivory" },
] as const;

/**
 * The logo as a 3D object: three slabs, one per layer of a system. Pointing at, focusing or
 * tapping a layer lifts it and lists what it holds; the stack opens up as the hero scrolls away.
 * CSS 3D transforms only (composited); no pointer tracking and no script-driven frames.
 */
export function LayerStack({ stack }: { stack: Stack }) {
  const [active, setActive] = useState(0);
  const current = stack.layers[active];

  return (
    <div className="ls" role="group" aria-label={stack.label}>
      <div className="ls-scene">
        <div className="ls-floor" aria-hidden="true" />
        <div className="ls-iso">
          <i className="ls-shadow" aria-hidden="true" />
          {slabs.map((slab, i) => {
            const layer = stack.layers[i];
            const isActive = i === active;
            return (
              <div
                key={slab.tone}
                className={`ls-slab ls-${slab.tone}${isActive ? " is-active" : ""}`}
                style={{ "--w": slab.w, "--d": slab.d, "--h": slab.h, "--i": i } as CSSProperties}
              >
                <div className="ls-lift" onPointerEnter={() => setActive(i)}>
                  <i className="ls-glow" aria-hidden="true" />
                  <i className="ls-face ls-top" aria-hidden="true" />
                  <i className="ls-face ls-front" aria-hidden="true" />
                  <i className="ls-face ls-left" aria-hidden="true" />
                  <button
                    type="button"
                    className="ls-tag"
                    aria-pressed={isActive}
                    aria-controls="ls-detail"
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className="ls-tag-line" aria-hidden="true" />
                    <span className="ls-tag-body">
                      <b dir="ltr">{layer.code}</b>
                      <span>{layer.name}</span>
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="ls-detail" className="ls-detail" aria-live="polite">
        <div className="ls-detail-head">
          <span className={`ls-swatch ls-swatch-${slabs[active].tone}`} aria-hidden="true" />
          <b dir="ltr">{current.code}</b>
          <span className="ls-hint">{stack.hint}</span>
        </div>
        <ul>
          {current.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
