"use client";

import { useEffect } from "react";

/**
 * Weighted smooth scrolling (Lenis) on devices with a mouse or trackpad.
 * Touch keeps native scrolling, and reduced-motion users keep the browser default.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let lenis: { destroy: () => void } | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -80 }, smoothWheel: true });
      document.documentElement.classList.add("lenis");
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);
  return null;
}
