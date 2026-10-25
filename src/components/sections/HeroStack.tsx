"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IsoStack } from "@/components/brand/IsoStack";
import type { SlabSpec } from "@/lib/iso";
import type { SlabDef } from "@/components/three/stackScene";

// Same width ratios as the logo mark (84 / 62 / 40), in its dark-background colours.
const slabs: SlabSpec[] = [
  { w: 84, d: 62, h: 9, tone: "ivory" },
  { w: 62, d: 46, h: 8, tone: "stone" },
  { w: 40, d: 30, h: 7, tone: "amber" },
];

const slabs3d: SlabDef[] = [
  { w: 8.4, h: 0.95, d: 6.2, color: "#ECE8E1", roughness: 0.62, clearcoat: 0.15 },
  { w: 6.2, h: 0.85, d: 4.6, color: "#A3A9B2", roughness: 0.45, clearcoat: 0.3 },
  { w: 4.0, h: 0.75, d: 3.0, color: "#E8892B", roughness: 0.3, clearcoat: 0.75 },
];

/** Opening amount the stack settles into after landing, so the layer labels show. */
const REST = 0.22;

type Scene = ReturnType<typeof import("@/components/three/stackScene").createStackScene>;

/**
 * The logo as a three-slab object. A flat SVG render paints first (and is the fallback
 * without WebGL or JavaScript); the real-time 3D scene loads on the first interaction and
 * fades in over it. Both open into an exploded view on scroll and follow the pointer.
 */
export function HeroStack({ label, layers }: { label: string; layers: [string, string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [live3d, setLive3d] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: Scene | undefined;
    let disposed = false;
    let frame = 0;
    let rest = reduce ? REST : 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const progress = reduce ? 0 : Math.min(1, Math.max(0, (window.innerHeight * 0.35 - rect.top) / (rect.height * 1.2)));
      const value = rest + progress * (1 - rest);
      el.style.setProperty("--explode", value.toFixed(3));
      scene?.setExplode(value);
      labelRefs.current.forEach((l) => l && (l.style.opacity = String(Math.min(1, Math.max(0, value * 6 - 0.3)))));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const settle = window.setTimeout(() => {
      rest = REST;
      update();
    }, 1400);

    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = (e.clientY / window.innerHeight) * 2 - 1;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
      scene?.setPointer(px, py);
    };

    // Load the 3D scene only on hardware-accelerated WebGL, after the first interaction
    // (or a few seconds), so it never competes with the first paint. ?gl=force skips the checks.
    const force = new URLSearchParams(window.location.search).get("gl") === "force";
    const supportsGL = (() => {
      try {
        const gl = document.createElement("canvas").getContext("webgl2");
        if (!gl) return false;
        if (force) return true;
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
        return !/swiftshader|llvmpipe|software|basic render/i.test(name);
      } catch {
        return false;
      }
    })();
    let requested = false;
    const load = () => {
      if (requested || !supportsGL || disposed) return;
      requested = true;
      import("@/components/three/stackScene").then(({ createStackScene }) => {
        if (disposed) return;
        scene = createStackScene(canvas, {
          slabs: slabs3d,
          reducedMotion: reduce,
          onReady: () => setLive3d(true),
          onLabels: (pts) =>
            pts.forEach((p, i) => {
              const l = labelRefs.current[i];
              if (!l) return;
              // Keep the whole label inside the canvas when the stack turns toward the edge
              const x = Math.max(l.offsetWidth + 6, p.x);
              l.style.transform = `translate(${x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
            }),
        });
        update();
      });
    };
    const triggers = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;
    const onFirst = () => {
      triggers.forEach((t) => window.removeEventListener(t, onFirst));
      load();
    };
    triggers.forEach((t) => window.addEventListener(t, onFirst, { passive: true, once: true }));
    const fallback = window.setTimeout(load, force ? 300 : 6000);

    // Pause rendering while the hero is off screen
    const io = new IntersectionObserver(([entry]) => scene?.setRunning(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.clearTimeout(fallback);
      triggers.forEach((t) => window.removeEventListener(t, onFirst));
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={ref} className="hero-stack relative h-full w-full">
      {/* Flat render: first paint, and the fallback without WebGL */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${live3d ? "opacity-0" : "opacity-100"}`}
        aria-hidden={live3d}
      >
        <IsoStack
          slabs={slabs}
          gap={4.5}
          shadow
          labels={layers}
          title={live3d ? undefined : label}
          className="h-full max-h-full w-auto max-w-full overflow-visible"
          slabProps={(i) => ({
            className: "slab-explode",
            style: { "--layer": i } as CSSProperties,
          })}
          innerProps={(i) => ({
            className: "slab-drop",
            style: { "--delay": `${i * 240}ms` } as CSSProperties,
          })}
        />
      </div>

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full transition-opacity duration-700 ${live3d ? "opacity-100" : "opacity-0"}`}
        role="img"
        aria-label={label}
        aria-hidden={!live3d}
      />

      {/* Layer names that follow the 3D slabs */}
      <div className={`pointer-events-none absolute inset-0 ${live3d ? "" : "hidden"}`} aria-hidden="true">
        {layers.map((name, i) => (
          <span
            key={name}
            ref={(node) => {
              labelRefs.current[i] = node;
            }}
            className="absolute left-0 top-0 opacity-0 transition-opacity duration-300 will-change-transform"
            dir="rtl"
          >
            {/* RTL row: the dot sits on the slab edge, the name runs outward to its left */}
            <span className="flex -translate-x-full -translate-y-1/2 items-center gap-2 whitespace-nowrap text-small font-semibold text-ivory">
              <span className="size-1.5 rounded-full bg-amber" />
              <span className="h-px w-10 bg-stone/60" />
              {name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
