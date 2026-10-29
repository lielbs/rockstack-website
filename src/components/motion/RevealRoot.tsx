"use client";

import { useEffect } from "react";

/**
 * Page-wide interaction layer:
 * - reveals content and section stages as they enter the viewport
 * - fills the page-long flow rail with scroll progress
 * - drives pointer spotlights on interactive panels
 * - adds tactile press feedback and a short route-transition pulse
 */
export function RevealRoot() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const sections = document.querySelectorAll<HTMLElement>("main section");
    let revealObserver: IntersectionObserver | undefined;
    let sectionObserver: IntersectionObserver | undefined;
    let routeTimer = 0;

    sections.forEach((section, index) => {
      section.classList.add("section-stage");
      section.style.setProperty("--section-order", String(index));
    });

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              revealObserver?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      items.forEach((element) => revealObserver?.observe(element));

      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("section-visible");
              sectionObserver?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      sections.forEach((section) => sectionObserver?.observe(section));
    } else {
      items.forEach((element) => element.classList.add("is-in"));
      sections.forEach((section) => section.classList.add("section-visible"));
    }

    // A fast jump (End key, in-page link, scrollbar drag) can carry elements past the viewport
    // between two observer checks, so they never "intersect". Reveal anything already scrolled past.
    let pending = [...items, ...sections];
    let passFrame = 0;
    const revealPassed = () => {
      passFrame = 0;
      const line = window.innerHeight;
      pending = pending.filter((element) => {
        if (element.getBoundingClientRect().top >= line) return true;
        element.classList.add(element.matches("[data-reveal]") ? "is-in" : "section-visible");
        revealObserver?.unobserve(element);
        sectionObserver?.unobserve(element);
        return false;
      });
      if (!pending.length) window.removeEventListener("scroll", onScrollPass);
    };
    const onScrollPass = () => {
      if (!passFrame) passFrame = window.requestAnimationFrame(revealPassed);
    };
    window.addEventListener("scroll", onScrollPass, { passive: true });

    // Flow rail: fill up to the middle of the viewport, with a light at the tip.
    const rail = document.querySelector<HTMLElement>(".flow-rail");
    let railFrame = 0;
    const updateRail = () => {
      railFrame = 0;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - rect.top) / rect.height));
      rail.style.setProperty("--flow", progress.toFixed(4));
      rail.style.setProperty("--flow-y", `${(progress * rect.height).toFixed(1)}px`);
      rail.style.setProperty("--flow-on", progress > 0 && progress < 1 ? "1" : "0");
    };
    const onRailScroll = () => {
      if (!railFrame) railFrame = window.requestAnimationFrame(updateRail);
    };
    if (rail) {
      updateRail();
      window.addEventListener("scroll", onRailScroll, { passive: true });
      window.addEventListener("resize", onRailScroll, { passive: true });
    }

    const onMove = (event: PointerEvent) => {
      const panel = (event.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      panel.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    const clearPressed = () => {
      document.querySelectorAll(".interaction-pressed").forEach((element) => {
        element.classList.remove("interaction-pressed");
      });
    };

    const onDown = (event: PointerEvent) => {
      const control = (event.target as Element | null)?.closest<HTMLElement>(
        ".btn, .keycap, .v2-nav-link, .v2-header-cta, .v2-mobile-link, .v2-menu-trigger",
      );
      if (!control) return;
      control.classList.add("interaction-pressed");
      navigator.vibrate?.(8);
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      document.documentElement.classList.remove("is-routing");
      window.requestAnimationFrame(() => document.documentElement.classList.add("is-routing"));
      window.clearTimeout(routeTimer);
      routeTimer = window.setTimeout(() => document.documentElement.classList.remove("is-routing"), 760);
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", clearPressed, { passive: true });
    document.addEventListener("pointercancel", clearPressed, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      revealObserver?.disconnect();
      sectionObserver?.disconnect();
      window.clearTimeout(routeTimer);
      window.cancelAnimationFrame(passFrame);
      window.cancelAnimationFrame(railFrame);
      window.removeEventListener("scroll", onRailScroll);
      window.removeEventListener("resize", onRailScroll);
      window.removeEventListener("scroll", onScrollPass);
      document.documentElement.classList.remove("is-routing");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", clearPressed);
      document.removeEventListener("pointercancel", clearPressed);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
