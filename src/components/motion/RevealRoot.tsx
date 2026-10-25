"use client";

import { useEffect } from "react";

/**
 * Page-wide interaction layer, mounted once:
 * - one observer for every [data-reveal] element (they stay visible without JavaScript;
 *   the `.js` class set in <head> is what hides them before entry)
 * - pointer light on [data-spotlight] panels
 * - a short haptic tick when a key-style control is pressed (Android)
 */
export function RevealRoot() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      items.forEach((el) => io?.observe(el));
    } else {
      items.forEach((el) => el.classList.add("is-in"));
    }

    const onMove = (e: PointerEvent) => {
      const panel = (e.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      panel.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    const onDown = (e: PointerEvent) => {
      const key = (e.target as Element | null)?.closest(".btn, .keycap");
      if (!key) return;
      navigator.vibrate?.(8);
    };

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      io?.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);
  return null;
}
