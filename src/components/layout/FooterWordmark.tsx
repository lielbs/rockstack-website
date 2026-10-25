"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/brand/Logo";

/** The name returns at full width; it grows from 0.94 to 1 as the footer arrives. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh * 0.25)));
      el.style.transform = `scale(${(0.94 + progress * 0.06).toFixed(4)})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} dir="ltr" translate="no" aria-hidden="true" className="flex origin-bottom items-end gap-[2.2vw] will-change-transform">
      <LogoMark tone="dark" className="w-[15vw] shrink-0" />
      <span className="latin whitespace-nowrap text-[15.6vw] leading-[0.74] tracking-[-0.04em]">
        <span className="font-bold text-ivory">Rock</span>
        <span className="font-normal text-stone">Stack</span>
      </span>
    </div>
  );
}
