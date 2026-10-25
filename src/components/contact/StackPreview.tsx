"use client";

import { AnimatePresence, LazyMotion, m, useReducedMotion } from "motion/react";
import type { Dictionary } from "@/content";
import type { NeedId } from "@/content/types";
import { buildStack, slabStyles } from "./stack";
import { StackFrame } from "./StaticStack";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Animated stack (Motion). Loaded only when the contact section comes near the viewport;
 * StaticStack renders the same rows until then and without JavaScript.
 */
export default function StackPreview({ builder, selected }: { builder: Dictionary["contact"]["builder"]; selected: NeedId[] }) {
  const reduce = useReducedMotion();
  const slabs = buildStack(builder, selected);
  return (
    <LazyMotion features={loadFeatures} strict>
      <StackFrame builder={builder} hasPicks={selected.length > 0}>
        <AnimatePresence initial={false} mode="popLayout">
          {slabs.map((slab) => (
            <m.li
              key={slab.key}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, transition: { duration: 0.18 } }}
              transition={{ type: "tween", ease: [0.55, 0, 0.9, 0.45], duration: 0.42 }}
              style={{ width: `${slab.width}%` }}
              className={`rounded-[var(--radius-slab)] px-4 py-2.5 text-center text-small font-semibold ${slabStyles[slab.kind]}`}
            >
              {slab.label}
            </m.li>
          ))}
        </AnimatePresence>
      </StackFrame>
    </LazyMotion>
  );
}
