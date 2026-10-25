import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";

// Illustrative response times (ms) for 30 days: steady, then the night it breaks.
const series = [
  42, 44, 41, 46, 43, 45, 47, 44, 42, 48, 46, 45, 49, 47, 51, 48, 50, 53, 52, 55, 54, 58, 57, 61, 64, 70, 78, 92, 131, 196,
];

const W = 300;
const H = 110;
const MAX = 210;

function linePath(): string {
  return series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * W;
      const y = H - (v / MAX) * (H - 8);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** A small monitoring screen: the chart draws in, then the alerts of a bad night arrive. */
export function MonitorPanel({ monitor }: { monitor: Dictionary["belief"]["monitor"] }) {
  const line = linePath();
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  return (
    <figure data-ui className="rounded-[10px] bg-basalt-raised p-5 text-ivory sm:p-6" aria-label={monitor.title}>
      <div className="flex items-center justify-between gap-4">
        <figcaption className="text-small font-semibold">{monitor.title}</figcaption>
        <span className="rounded-full bg-night px-2.5 py-0.5 text-[0.8125rem] text-stone">{monitor.badge}</span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-small font-semibold text-amber">
        <span aria-hidden="true" className="status-ping inline-block size-2 rounded-full bg-amber" />
        {monitor.status}
      </p>

      <div className="mt-4" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#F4F2EE" strokeOpacity="0.06" strokeWidth="1" />
          ))}
          <path d={area} fill="#A3A9B2" fillOpacity="0.07" />
          <path d={line} pathLength={1} className="chart-line" fill="none" stroke="#A3A9B2" strokeWidth="2" strokeLinejoin="round" />
          <path
            d={`M${((series.length - 4) / (series.length - 1)) * W} 0 H${W} V${H} H${((series.length - 4) / (series.length - 1)) * W} Z`}
            fill="#E8892B"
            fillOpacity="0.08"
          />
        </svg>
      </div>
      <p className="mt-2 text-[0.8125rem] text-stone">{monitor.chartLabel}</p>

      <ul className="mt-5 space-y-2">
        {monitor.alerts.map((alert, n) => (
          <li
            key={alert.text}
            className="alert-row flex items-baseline gap-3 rounded-[6px] bg-night px-3.5 py-2.5 text-small"
            style={{ "--n": n } as CSSProperties}
          >
            <span className="latin shrink-0 tabular-nums text-stone" dir="ltr">
              {alert.time}
            </span>
            <span className="min-w-0 flex-1">{alert.text}</span>
            <span className="shrink-0 font-semibold text-amber">
              <bdi>{alert.value}</bdi>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
