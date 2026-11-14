"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Dictionary } from "@/content";

type Stack = Dictionary["hero"]["stack"];

// The logo mark's slabs (top to base), in units of --u. Widths keep the mark's 40 / 62 / 84 ratio.
const slabs = [
  { w: 40, d: 30, h: 7, tone: "amber" },
  { w: 62, d: 46, h: 8, tone: "stone" },
  { w: 84, d: 62, h: 9, tone: "ivory" },
] as const;

/**
 * The logo as a 3D object: three slabs, one per layer of a system. It turns toward the pointer,
 * lifts the layer you point at or focus, and opens up as the hero scrolls away.
 * Built from CSS 3D transforms only, so every frame is composited; the pointer loop runs
 * only while the stack is still catching up with the pointer.
 */
export function LayerStack({ stack }: { stack: Stack }) {
  const [active, setActive] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const tilt = tiltRef.current;
    const area = scene?.closest("section");
    if (!scene || !tilt || !area) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rect = scene.getBoundingClientRect();
    let frame = 0;
    const target = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };

    const step = () => {
      now.x += (target.x - now.x) * 0.08;
      now.y += (target.y - now.y) * 0.08;
      tilt.style.transform = `rotateX(${now.x.toFixed(2)}deg) rotateY(${now.y.toFixed(2)}deg)`;
      frame = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.02 ? requestAnimationFrame(step) : 0;
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onEnter = () => {
      rect = scene.getBoundingClientRect();
    };
    const onMove = (event: PointerEvent) => {
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      target.y = Math.max(-1, Math.min(1, nx)) * 10;
      target.x = Math.max(-1, Math.min(1, ny)) * -7;
      run();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      run();
    };

    area.addEventListener("pointerenter", onEnter);
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onEnter);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener("pointerenter", onEnter);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onEnter);
    };
  }, []);

  const current = stack.layers[active];

  return (
    <div className="ls" role="group" aria-label={stack.label}>
      <div ref={sceneRef} className="ls-scene">
        <div className="ls-floor" aria-hidden="true" />
        <div ref={tiltRef} className="ls-tilt">
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
                  <div className="ls-bob">
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
                        onPointerEnter={() => setActive(i)}
                      >
                        <span className="ls-tag-line" aria-hidden="true" />
                        <span className="ls-tag-body">
                          <b dir="ltr">{layer.code}</b>
                          <span>{layer.name}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
