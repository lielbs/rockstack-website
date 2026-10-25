import type { Dictionary } from "@/content";
import type { NeedId } from "@/content/types";
import { buildStack, slabStyles } from "./stack";

export function StaticStack({ builder, selected }: { builder: Dictionary["contact"]["builder"]; selected: NeedId[] }) {
  return (
    <StackFrame builder={builder} hasPicks={selected.length > 0}>
      {buildStack(builder, selected).map((slab) => (
        <li
          key={slab.key}
          style={{ width: `${slab.width}%` }}
          className={`rounded-[var(--radius-slab)] px-4 py-2.5 text-center text-small font-semibold ${slabStyles[slab.kind]}`}
        >
          {slab.label}
        </li>
      ))}
    </StackFrame>
  );
}

export function StackFrame({
  builder,
  hasPicks,
  children,
}: {
  builder: Dictionary["contact"]["builder"];
  hasPicks: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="self-start text-small font-semibold text-stone">{builder.stackTitle}</h3>
      <ul className="mt-6 flex w-full flex-col items-center gap-1.5" aria-live="polite">
        {children}
      </ul>
      <p className="mt-6 self-start text-small text-stone">{hasPicks ? builder.foundationNote : builder.stackEmpty}</p>
    </div>
  );
}
