"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/content";

export function Header({ dict }: { dict: Dictionary }) {
  const [compact, setCompact] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  return (
    <header
      className={`frame sticky top-0 z-40 bg-ivory transition-[padding] duration-300 ${
        compact ? "py-2.5" : "py-4 md:py-5"
      }`}
    >
      <div className="flex items-center justify-between gap-6">
        <a href="#top" aria-label={dict.a11y.home} className="shrink-0 rounded-sm">
          <Logo
            markClassName={`transition-[width,height] duration-300 ${compact ? "size-8" : "size-9 md:size-10"}`}
            textClassName={`transition-[font-size] duration-300 ${compact ? "text-[1.35rem]" : "text-[1.45rem] md:text-[1.65rem]"}`}
          />
        </a>

        <nav aria-label="ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-small font-medium">
            {dict.nav.items.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-quiet py-2 text-slate no-underline hover:text-basalt">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#contact" className={`btn btn-primary ${compact ? "min-h-11" : ""} hidden sm:inline-flex`}>
            {dict.nav.cta}
          </a>
          <button
            type="button"
            onClick={openMenu}
            aria-label={dict.a11y.menuOpen}
            aria-haspopup="dialog"
            className="grid size-12 place-items-center rounded-[var(--radius-slab)] bg-basalt text-ivory transition-colors hover:bg-slate lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              <rect x="7" y="5" width="10" height="3" rx="1" fill="#E8892B" />
              <rect x="5" y="10.5" width="14" height="3" rx="1" fill="currentColor" />
              <rect x="3" y="16" width="18" height="3" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="תפריט"
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-basalt p-0 text-ivory backdrop:bg-basalt/60 open:flex"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="frame flex w-full flex-col overscroll-contain py-4">
          <div className="flex items-center justify-between">
            <Logo tone="dark" markClassName="size-9" textClassName="text-[1.45rem]" />
            <button
              type="button"
              onClick={closeMenu}
              aria-label={dict.a11y.menuClose}
              className="grid size-12 place-items-center rounded-[var(--radius-slab)] bg-basalt-raised text-ivory transition-colors hover:bg-slate"
            >
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="ראשי, נייד" className="mt-14 flex-1">
            <ul className="flex flex-col gap-2">
              {dict.nav.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className="block py-2 text-title font-bold transition-colors hover:text-amber"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#contact" onClick={closeMenu} className="btn btn-primary mb-6 w-full">
            {dict.nav.cta}
          </a>
          <p className="text-small text-stone">
            <span className="latin" dir="ltr" translate="no">
              {dict.descriptor}
            </span>
          </p>
        </div>
      </dialog>
    </header>
  );
}
