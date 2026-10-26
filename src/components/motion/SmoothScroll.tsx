"use client";

import { useEffect } from "react";

type LenisLike = {
  animatedScroll: number;
  destroy: () => void;
  scrollTo: (target: HTMLElement | number, options?: { immediate?: boolean }) => void;
};

/**
 * Weighted smooth scrolling (Lenis) on devices with a mouse or trackpad.
 * Touch keeps native scrolling, and reduced-motion users keep the browser default.
 *
 * In-page links are handled here instead of with Lenis' `anchors` option: that option does
 * not cancel the browser's own jump, and the two raced to different positions. Lenis already
 * subtracts the html `scroll-padding-top`, so sections land just below the sticky header.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let lenis: LenisLike | undefined;
    let cancelled = false;

    const onClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      // A native scroll right before the click (scrollbar, keyboard, find-in-page) can leave
      // Lenis' position a frame behind; resync so the target is measured from the real offset.
      if (Math.abs(lenis.animatedScroll - window.scrollY) > 1) lenis.scrollTo(window.scrollY, { immediate: true });
      lenis.scrollTo(target);
      if (location.hash !== hash) history.pushState(null, "", hash);
      // Keyboard activation (detail 0): move focus with the view, as a native jump would.
      if (event.detail === 0) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true });
      document.documentElement.classList.add("lenis");
      document.addEventListener("click", onClick);
    });
    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);
  return null;
}
