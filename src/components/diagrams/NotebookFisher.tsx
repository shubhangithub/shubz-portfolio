// @ts-nocheck
/**
 * NotebookFisher — compact Fisher–KPP travelling-wave figure for the
 * homepage rail. The full interactive version lives in FisherFront.
 */
import React from "react";

export function NotebookFisher({
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
  const [front, setFront] = React.useState(0.34);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFront(0.54);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setFront(0.08 + (((now - start) / 7200) % 1) * 0.92);
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
  const frontX = left + front * span;
  const frontWidth = 15;
  const points: string[] = [];

  for (let i = 0; i <= 72; i += 1) {
    const x = left + (i / 72) * span;
    const u = 1 / (1 + Math.exp((x - frontX) / frontWidth));
    const y = base - u * (base - top);
    points.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  const line = points.join(" ");
  const area = `${line} L${right} ${base} L${left} ${base} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="A Fisher–KPP travelling wave advancing from left to right"
      style={{ display: "block", width: w, height: h, maxWidth: "100%" }}
    >
      <rect width={W} height={H} fill={paper} />
      <text x={left} y={18} fontFamily="var(--f-display)" fontSize="13" fontStyle="italic" fill={ink}>
        the wave of advance
      </text>

      <line x1={left} y1={base} x2={right} y2={base} stroke={muted} strokeWidth="1" />
      <line x1={left} y1={top} x2={left} y2={base} stroke={muted} strokeWidth="1" opacity="0.55" />
      <path d={area} fill={accent} opacity="0.14" />
      <path d={line} fill="none" stroke={accent} strokeWidth="2.2" />
      <circle
        cx={frontX}
        cy={base - 0.5 * (base - top)}
        r="3.2"
        fill={paper}
        stroke={accent}
        strokeWidth="1.5"
      />

      <text x={left + 5} y={base - 7} fontFamily="var(--f-mono)" fontSize="8" fill={accent}>u → 1</text>
      <text x={right - 4} y={base - 7} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={muted}>u → 0</text>
      <text x={left - 5} y={top + 3} textAnchor="end" fontFamily="var(--f-mono)" fontSize="7.5" fill={muted}>1</text>
      <text x={left - 5} y={base + 2} textAnchor="end" fontFamily="var(--f-mono)" fontSize="7.5" fill={muted}>0</text>

      <g transform={`translate(${W / 2}, 184)`}>
        <line x1="-45" y1="0" x2="45" y2="0" stroke={muted} strokeWidth="1" />
        <path d="M45 0 L38 -3 L38 3 Z" fill={muted} />
        <text x="0" y="16" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8.5" fill={ink}>
          c* = 2√(rD)
        </text>
      </g>
    </svg>
  );
}
