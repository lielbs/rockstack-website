export function SkipLink({ label, href = "#main" }: { label: string; href?: string }) {
  return (
    <a
      href={href}
      className="btn btn-primary btn-compact fixed start-4 top-4 z-50 -translate-y-[200%] focus-visible:translate-y-0"
    >
      {label}
    </a>
  );
}
