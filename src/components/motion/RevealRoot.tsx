"use client";

import { useEffect } from "react";

/**
 * Page-wide interaction layer:
 * - reveals content and section stages as they enter the viewport
 * - drives pointer spotlights on interactive panels
 * - adds tactile press feedback and a short route-transition pulse
 */
export function RevealRoot() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const sections = document.querySelectorAll<HTMLElement>("main > section");
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
