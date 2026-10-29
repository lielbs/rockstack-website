/** A slow band of what we build, set very large; alternate words are drawn in outline. */
export function Marquee({ items }: { items: string[] }) {
  const run = (hidden: boolean) => (
    <ul className="marquee-run" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className={i % 2 ? "marquee-outline" : undefined}>
          {item}
          <span className="marquee-dot" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="תחומי עבודה" className="marquee overflow-hidden py-10 sm:py-14">
      <div className="marquee-track">
        {run(false)}
        {run(true)}
      </div>
    </section>
  );
}
