import type { Dictionary } from "@/content";

/**
 * Chapter label that sits on the page-long flow rail: a numbered node that lights up when its
 * section comes into view, so the sections read as one connected story instead of slides.
 */
export function FlowMark({ dict, id, className = "" }: { dict: Dictionary; id: string; className?: string }) {
  const index = dict.chapters.findIndex((chapter) => chapter.id === id);
  if (index < 0) return null;
  return (
    <p className={`flow-mark ${className}`}>
      <span className="flow-mark-index" dir="ltr">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flow-mark-label">{dict.chapters[index].label}</span>
    </p>
  );
}

/** The thread itself. RevealRoot fills it as the visitor scrolls. */
export function FlowRail() {
  return (
    <div className="flow-rail" aria-hidden="true">
      <i className="flow-rail-fill" />
      <i className="flow-rail-head" />
    </div>
  );
}
