"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/content";

export function Header({ dict }: { dict: Dictionary }) {
  const [compact, setCompact] = useState(false);
  const [activeHref, setActiveHref] = useState("#top");
  const [pressedHref, setPressedHref] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setCompact(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const hrefs = ["#top", ...dict.nav.items.map((item) => item.href), "#contact"];
    const sections = hrefs
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!("IntersectionObserver" in window)) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        });

        const current = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (current) setActiveHref(`#${current[0]}`);
      },
      { rootMargin: "-18% 0px -58% 0px", threshold: [0.05, 0.2, 0.45, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [dict.nav.items]);

  useEffect(
    () => () => {
      if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current);
    },
    [],
  );

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();
  const navigate = (href: string) => {
    setActiveHref(href);
    setPressedHref(href);
    closeMenu();
    if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current);
    pressTimerRef.current = window.setTimeout(() => setPressedHref(null), 560);
  };

  return (
    <header className={`v2-site-header frame sticky top-0 z-40 ${compact ? "is-compact" : ""}`}>
      <div className="v2-route-progress" aria-hidden="true" />
      <div className="v2-header-shell">
        <a
          href="#top"
          aria-label={dict.a11y.home}
          onClick={() => navigate("#top")}
          className="v2-brand-link shrink-0 rounded-sm"
        >
          <Logo
            tone="dark"
            markClassName={`transition-[width,height] duration-300 ${compact ? "size-8" : "size-9 md:size-10"}`}
            textClassName={`transition-[font-size] duration-300 ${compact ? "text-[1.35rem]" : "text-[1.45rem] md:text-[1.65rem]"}`}
          />
        </a>

        <nav aria-label="ראשי" className="hidden lg:block">
          <ul className="v2-nav">
            {dict.nav.items.map((item, index) => {
              const active = activeHref === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => navigate(item.href)}
                    aria-current={active ? "location" : undefined}
                    className={`v2-nav-link ${active ? "is-active" : ""} ${pressedHref === item.href ? "is-pressed" : ""}`}
                  >
                    <span className="v2-nav-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.label}</span>
                    <i aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={() => navigate("#contact")}
            className={`v2-header-cta hidden sm:inline-flex ${activeHref === "#contact" ? "is-active" : ""}`}
          >
            <span>{dict.nav.cta}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 10h10M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            type="button"
            onClick={openMenu}
            aria-label={dict.a11y.menuOpen}
            aria-haspopup="dialog"
            className="v2-menu-trigger lg:hidden"
          >
            <span aria-hidden="true">MENU</span>
            <svg viewBox="0 0 24 24" className="menu-icon size-5" aria-hidden="true">
              <rect x="7" y="5" width="10" height="2" rx="1" fill="#7ee5ff" />
              <rect x="5" y="11" width="14" height="2" rx="1" fill="currentColor" />
              <rect x="3" y="17" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="תפריט"
        className="v2-menu-dialog on-dark m-0 h-dvh max-h-none w-full max-w-none p-0 text-ivory backdrop:bg-black/70 open:flex"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="v2-menu-panel frame flex w-full flex-col overscroll-contain py-5">
          <div className="flex items-center justify-between">
            <Logo tone="dark" markClassName="size-9" textClassName="text-[1.45rem]" />
            <button type="button" onClick={closeMenu} aria-label={dict.a11y.menuClose} className="v2-menu-close">
              <span>CLOSE</span>
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="ראשי, נייד" className="mt-14 flex-1">
            <ul className="v2-mobile-nav">
              {dict.nav.items.map((item, index) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => navigate(item.href)}
                    aria-current={activeHref === item.href ? "location" : undefined}
                    className={`v2-mobile-link ${activeHref === item.href ? "is-active" : ""}`}
                  >
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>{item.label}</span>
                    <b aria-hidden="true">↙</b>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#contact" onClick={() => navigate("#contact")} className="v2-mobile-cta">
            <span>{dict.nav.cta}</span>
            <b aria-hidden="true">↙</b>
          </a>
          <p className="mt-8 text-small text-stone">
            <span className="latin" dir="ltr" translate="no">{dict.descriptor}</span>
          </p>
        </div>
      </dialog>
    </header>
  );
}
