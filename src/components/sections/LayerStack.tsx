"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Dictionary } from "@/content";

type Stack = Dictionary["hero"]["stack"];
type GL = "pending" | "on" | "off";
type Scene = ReturnType<typeof import("@/components/three/stackGL").createStackGL>;

// The logo mark's slabs (top to base), in units of --u. Widths keep the mark's 40 / 62 / 84 ratio.
const slabs = [
  { w: 40, d: 30, h: 7, tone: "amber" },
  { w: 62, d: 46, h: 8, tone: "stone" },
  { w: 84, d: 62, h: 9, tone: "ivory" },
] as const;

/** True when this device should get the WebGL scene (checked before downloading it). */
function canRunGL() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * The logo as a 3D object: three slabs, one per layer of a system. Pointing at, focusing or
 * tapping a layer lifts it and lists what it holds.
 *
 * Capable devices get the WebGL scene (loaded after the page has painted): the slabs are drawn
 * as a blueprint, printed into solid material, and turn toward the pointer over a field of dots.
 * Everyone else, and anyone who prefers reduced motion, gets the same stack in CSS 3D.
 */
export function LayerStack({ stack }: { stack: Stack }) {
  const [active, setActive] = useState(0);
  const [gl, setGl] = useState<GL>("pending");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const anchors = useRef<{ x: number; y: number }[]>([]);
  const current = stack.layers[active];

  useEffect(() => {
    const canvas = canvasRef.current;
    const area = canvas?.closest("section");
    if (!canvas || !area) return;
    let cancelled = false;
    let idle = 0;

    const boot = async () => {
      try {
        const mod = await import("@/components/three/stackGL");
        if (cancelled) return;
        sceneRef.current = mod.createStackGL(canvas, {
          area,
          onReady: () => setGl("on"),
          onHover: (i) => setActive(i),
          onAnchors: (points) => {
            // The callout column is fixed; each leader line stretches back to its slab's corner.
            // Only transforms are written, and only when a corner has actually moved.
            const col = canvas.clientWidth * 0.7;
            points.forEach((p, i) => {
              const tag = tagRefs.current[i];
              const prev = anchors.current[i];
              if (!tag || (prev && Math.abs(prev.x - p.x) < 0.3 && Math.abs(prev.y - p.y) < 0.3)) return;
              anchors.current[i] = p;
              tag.style.transform = `translate3d(${col.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
              const line = tag.firstElementChild as HTMLElement | null;
              if (line) line.style.transform = `scaleX(${Math.max(0, col - p.x).toFixed(1)})`;
            });
          },
        });
      } catch (err) {
        console.warn("[hero] WebGL stack unavailable", err);
        if (!cancelled) setGl("off");
      }
    };

    // Weak devices and reduced motion never download the scene; others wait until the browser is idle.
    if (!canRunGL()) {
      idle = globalThis.setTimeout(() => setGl("off"), 0) as unknown as number;
    } else if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(() => void boot(), { timeout: 1500 });
    } else {
      idle = globalThis.setTimeout(() => void boot(), 300) as unknown as number;
    }

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      globalThis.clearTimeout(idle);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setActive(active);
  }, [active]);

  return (
    <div className="ls" role="group" aria-label={stack.label} data-gl={gl}>
      <div className="ls-scene">
        <div className="ls-floor" aria-hidden="true" />
        <canvas ref={canvasRef} className="ls-canvas" aria-hidden="true" />

        {/* CSS 3D stack: the fallback, and what shows before the scene is ready */}
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

        {/* Callouts for the WebGL scene, placed every frame at each slab's corner */}
        <div className="ls-gl-tags">
          {slabs.map((slab, i) => {
            const layer = stack.layers[i];
            return (
              <button
                key={slab.tone}
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                type="button"
                className={`ls-tag ls-gl-tag ls-${slab.tone}`}
                aria-pressed={i === active}
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
