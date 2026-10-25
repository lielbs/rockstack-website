"use client";

import { useEffect, useState } from "react";

/** Sector names set as a poster; one is lit at a time. With reduced motion all stay in full ink. */
export function SectorNames({ names, label }: { names: string[]; label: string }) {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setLit((n) => (n + 1) % names.length), 2000);
    return () => window.clearInterval(id);
  }, [names.length]);

  return (
    <ul className="lg:order-1 lg:col-span-8" aria-label={label}>
      {names.map((name, i) => (
        <li
          key={name}
          className={`text-title font-bold leading-[1.12] transition-colors duration-500 ${
            i === lit ? "text-ivory" : "text-stone-ink motion-reduce:text-ivory"
          }`}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
