"use client";

import { useEffect } from "react";

/**
 * Page-wide interaction layer:
 * - reveals content and section stages as they enter the viewport
 * - fills the page-long flow rail with scroll progress
 * - adds tactile press feedback and a short route-transition pulse
 * - pauses the decorative loops of every section that is off screen
 */
export function RevealRoot() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const sections = document.querySelectorAll<HTMLElement>("main section");
    let revealObserver: IntersectionObserver | undefined;
    let sectionObserver: IntersectionObserver | undefined;
    let playObserver: IntersectionObserver | undefined;
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

      // Infinite animations keep costing style and paint work even when nobody can see them.
      playObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => entry.target.classList.toggle("is-offscreen", !entry.isIntersecting));
        },
        { rootMargin: "0px" },
      );
      sections.forEach((section) => playObserver?.observe(section));
    } else {
      items.forEach((element) => element.classList.add("is-in"));
      sections.forEach((section) => section.classList.add("section-visible"));
    }

    // A fast jump (End key, in-page link, scrollbar drag) can carry elements past the viewport
    // between two observer checks, so they never "intersect". Reveal anything already scrolled past.
    // Checked only after a jump or once scrolling settles: measuring every element per frame is costly.
    let pending = [...items, ...sections];
    let passTimer = 0;
    let lastY = window.scrollY;
    const revealPassed = () => {
      lastY = window.scrollY;
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
      window.clearTimeout(passTimer);
      if (Math.abs(window.scrollY - lastY) > window.innerHeight) revealPassed();
      else passTimer = window.setTimeout(revealPassed, 150);
    };
    window.addEventListener("scroll", onScrollPass, { passive: true });

    // Flow rail: fill up to the middle of the viewport, with a light at the tip. Geometry is
    // measured on resize only; each scroll frame just writes two transforms (no layout reads).
    const rail = document.querySelector<HTMLElement>(".flow-rail");
    const railFill = rail?.querySelector<HTMLElement>(".flow-rail-fill");
    const railHead = rail?.querySelector<HTMLElement>(".flow-rail-head");
    let railFrame = 0;
    let railTop = 0;
    let railHeight = 1;
    let railMoving = false;
    const measureRail = () => {
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      railTop = rect.top + window.scrollY;
      railHeight = Math.max(1, rect.height);
    };
    const updateRail = () => {
      railFrame = 0;
      if (!railFill || !railHead) return;
      const progress = Math.min(1, Math.max(0, (window.scrollY + window.innerHeight * 0.5 - railTop) / railHeight));
      railFill.style.transform = `scaleY(${progress.toFixed(4)})`;
      railHead.style.transform = `translateY(${(progress * railHeight).toFixed(1)}px)`;
      const moving = progress > 0 && progress < 1;
      if (moving !== railMoving) {
        railMoving = moving;
        rail?.classList.toggle("is-moving", moving);
      }
    };
    const onRailScroll = () => {
      if (!railFrame) railFrame = window.requestAnimationFrame(updateRail);
    };
    // Content above the rail changes height as images and fonts load.
    const railResize = new ResizeObserver(() => {
      measureRail();
      onRailScroll();
    });
    if (rail) {
      railResize.observe(document.body);
      window.addEventListener("scroll", onRailScroll, { passive: true });
    }

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

    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", clearPressed, { passive: true });
    document.addEventListener("pointercancel", clearPressed, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      revealObserver?.disconnect();
      sectionObserver?.disconnect();
      playObserver?.disconnect();
      window.clearTimeout(routeTimer);
      window.clearTimeout(passTimer);
      window.cancelAnimationFrame(railFrame);
      railResize.disconnect();
      window.removeEventListener("scroll", onRailScroll);
      window.removeEventListener("scroll", onScrollPass);
      document.documentElement.classList.remove("is-routing");
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", clearPressed);
      document.removeEventListener("pointercancel", clearPressed);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
