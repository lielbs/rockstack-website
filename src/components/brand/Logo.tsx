type Tone = "light" | "dark";

const layers: Record<Tone, [string, string, string]> = {
  // [top, middle, base]
  light: ["#E8892B", "#4A5361", "#16191D"],
  dark: ["#E8892B", "#A3A9B2", "#F4F2EE"],
};

/** The Strata mark: three stacked slabs. Geometry is fixed by the brand guide. */
export function LogoMark({ tone = "light", className }: { tone?: Tone; className?: string }) {
  const [top, mid, base] = layers[tone];
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false" className={className}>
      <rect x="30" y="14" width="40" height="17" rx="4" fill={top} />
      <rect x="18" y="37" width="62" height="19" rx="4" fill={mid} />
      <rect x="6" y="62" width="84" height="22" rx="4" fill={base} />
    </svg>
  );
}

/** Mark + wordmark. Always LTR, even inside the RTL page. */
export function Logo({
  tone = "light",
  className = "",
  markClassName = "size-10",
  textClassName = "text-[1.65rem]",
}: {
  tone?: Tone;
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  const rock = tone === "light" ? "text-basalt" : "text-ivory";
  const stack = tone === "light" ? "text-slate" : "text-stone";
  return (
    <span dir="ltr" translate="no" className={`inline-flex items-center gap-[0.35em] ${className}`}>
      <LogoMark tone={tone} className={markClassName} />
      <span className={`latin leading-none tracking-[-0.02em] ${textClassName}`}>
        <span className={`font-bold ${rock}`}>Rock</span>
        <span className={`font-normal ${stack}`}>Stack</span>
      </span>
    </span>
  );
}
