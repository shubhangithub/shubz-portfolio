// @ts-nocheck
/**
 * NotebookRoss — compact threshold figure for the homepage rail. R₀ drifts
 * back and forth across 1 and the epidemic curve flips between dying out and
 * settling at an endemic level. The full interactive version lives in
 * RossThreshold (MosquitoThreshold).
 */
import React from "react";

export function NotebookRoss({
  w = 290,
  h = 210,
  ink,
  accent,
  paper,
  muted,
}: {
  w?: number;
  h?: number;
  ink: string;
  accent: string;
  paper: string;
  muted: string;
}) {
  const [r0, setR0] = React.useState(2.4);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setR0(2.4);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      // Drift R₀ between 0.55 and 2.75, crossing the threshold each cycle.
      const phase = ((now - start) / 9000) % 1;
      setR0(1.65 + 1.1 * Math.sin(phase * Math.PI * 2));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const W = 290;
  const H = 210;
  const left = 25;
  const right = 278;
  const top = 34;
  const base = 164;
  const span = right - left;
  const endemic = r0 > 1;
  const xStar = endemic ? 1 - 1 / r0 : 0;

  // SIS prevalence from a small seed: dx/dt = rec·x·(R₀(1−x) − 1).
  const REC = 0.05;
  const DAYS = 600;
  const points: string[] = [];
  let x = 0.02;
  for (let i = 0; i <= 72; i += 1) {
    const px = left + (i / 72) * span;
    const py = base - x * (base - top);
    points.push(`${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`);
    for (let s = 0; s < DAYS / 72; s += 1) {
      x = Math.max(0, Math.min(1, x + REC * x * (r0 * (1 - x) - 1)));
    }
  }

  const line = points.join(" ");
  const area = `${line} L${right} ${base} L${left} ${base} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="An epidemic curve that dies out when R nought is below one and settles at an endemic level above it"
      style={{ display: "block", width: w, height: h, maxWidth: "100%" }}
    >
      <rect width={W} height={H} fill={paper} />
      <text x={left} y={18} fontFamily="var(--f-display)" fontSize="13" fontStyle="italic" fill={ink}>
        the last mosquito
      </text>

      <line x1={left} y1={base} x2={right} y2={base} stroke={muted} strokeWidth="1" />
      <line x1={left} y1={top} x2={left} y2={base} stroke={muted} strokeWidth="1" opacity="0.55" />

      {endemic && (
        <line
          x1={left}
          y1={base - xStar * (base - top)}
          x2={right}
          y2={base - xStar * (base - top)}
          stroke={accent}
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.55"
        />
      )}

      <path d={area} fill={accent} opacity={endemic ? 0.14 : 0.05} />
      <path d={line} fill="none" stroke={endemic ? accent : muted} strokeWidth="2.2" />

      <text x={right - 4} y={top + 3} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8.5" fill={endemic ? accent : muted}>
        R₀ = {r0.toFixed(2)} · {endemic ? "endemic" : "dies out"}
      </text>
      <text x={left - 5} y={top + 3} textAnchor="end" fontFamily="var(--f-mono)" fontSize="7.5" fill={muted}>1</text>
      <text x={left - 5} y={base + 2} textAnchor="end" fontFamily="var(--f-mono)" fontSize="7.5" fill={muted}>0</text>

      <g transform={`translate(${W / 2}, 184)`}>
        <line x1="-45" y1="0" x2="45" y2="0" stroke={muted} strokeWidth="1" />
        <path d="M45 0 L38 -3 L38 3 Z" fill={muted} />
        <text x="0" y="16" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8.5" fill={ink}>
          R₀ = ma²bc / rμ · the switch is at 1
        </text>
      </g>
    </svg>
  );
}
