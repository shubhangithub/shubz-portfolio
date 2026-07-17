// @ts-nocheck
// FisherFront — the Fisher–KPP travelling wave. A logistic front sweeps
// left→right across a 1-D domain: behind it the advantageous allele has
// fixed (u→1), ahead of it the old population still holds (u→0). Drag the
// growth-rate slider and watch the front do two things at once — move
// faster AND sharpen, because the minimum speed c* = 2√(rD) and the front
// width ~ √(D/r) are both set by the same r and D.
import React from "react";

export function FisherFront({ palette: p }) {
  const D = 1; // diffusion held fixed; r is the knob
  const [r, setR] = React.useState(1.0); // growth rate, 0.25 … 2.5
  const reduced = React.useRef(false);
  const [frontPx, setFrontPx] = React.useState(0.28); // front centre, fraction of width
  const rafRef = React.useRef(0);
  const tRef = React.useRef(0);

  React.useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Animate the front position. Speed on screen is proportional to c* = 2√(rD).
  React.useEffect(() => {
    if (reduced.current) { setFrontPx(0.5); return; }
    let last = null;
    const step = (ts) => {
      if (last == null) last = ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      const c = 2 * Math.sqrt(r * D); // the KPP minimum speed
      tRef.current += dt * c * 0.12; // 0.12 = px-fraction per unit c per second
      // sweep from left edge, reset once the front clears the right edge
      const pos = 0.06 + (tRef.current % 1.02);
      setFrontPx(pos);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [r]);

  const c = 2 * Math.sqrt(r * D);
  // Front half-width in domain units ~ √(D/r); map to a pixel width.
  const widthFrac = Math.sqrt(D / r);

  const W = 460, H = 250;
  const left = 30, right = W - 14, top = 20, base = 176;
  const span = right - left;
  const wPx = Math.max(6, widthFrac * 26); // steepness in px

  // u(x) = 1 / (1 + exp((x − front)/w)) — 1 behind the front, 0 ahead.
  const N = 90;
  const fx = left + frontPx * span;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = left + (i / N) * span;
    const u = 1 / (1 + Math.exp((x - fx) / wPx));
    const y = base - u * (base - top);
    pts.push([x, y]);
  }
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${right} ${base} L${left} ${base} Z`;

  // Leading-edge band: where u is small (the "pulled" tip that sets the speed).
  const edgeX = fx + 1.1 * wPx;

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
           aria-label={`A logistic travelling wave moving left to right. Growth rate r = ${r.toFixed(2)}; minimum wave speed c = 2 times the square root of r times D, currently ${c.toFixed(2)}. Higher r makes the front both faster and steeper.`}
           style={{ width: "100%", height: 250, userSelect: "none" }}>
        {/* baseline + frame */}
        <line x1={left} y1={base} x2={right} y2={base} stroke={p.muted} strokeWidth="1" />
        <line x1={left} y1={top} x2={left} y2={base} stroke={p.muted} strokeWidth="1" opacity="0.5" />
        <text x={left - 4} y={top + 4} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>1</text>
        <text x={left - 4} y={base} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>0</text>
        <text x={left - 20} y={(top + base) / 2} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted} transform={`rotate(-90 ${left - 20} ${(top + base) / 2})`}>u(x)</text>

        {/* invaded region fill under the curve */}
        <path d={area} fill={p.accent} opacity="0.14" />
        {/* the front profile */}
        <path d={line} fill="none" stroke={p.accent} strokeWidth="2" />

        {/* leading-edge marker — the small-u tip that "pulls" the wave */}
        {edgeX < right && (
          <g>
            <line x1={edgeX} y1={top} x2={edgeX} y2={base} stroke={p.muted} strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
            <text x={Math.min(edgeX + 4, right - 2)} y={top + 10} fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>leading edge</text>
          </g>
        )}
        {/* u = 0.5 crossing marker on the front */}
        <circle cx={fx} cy={base - 0.5 * (base - top)} r={3.5} fill={p.paper} stroke={p.accent} strokeWidth="1.5" />

        {/* direction arrow */}
        <g transform={`translate(${left + span * 0.5}, ${base + 20})`}>
          <line x1={-40} y1={0} x2={40} y2={0} stroke={p.muted} strokeWidth="1" />
          <path d="M40 0 L33 -3 L33 3 Z" fill={p.muted} />
          <text x={0} y={-6} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>front advances at c = 2√(rD)</text>
        </g>
        <text x={left + 2} y={base - 6} fontFamily="var(--f-mono)" fontSize="9" fill={p.accent}>invaded · u→1</text>
        <text x={right - 2} y={base - 6} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>not yet · u→0</text>
      </svg>

      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Growth rate · drag r</div>
        <input
          type="range" min={0.25} max={2.5} step={0.05} value={r}
          onChange={(e) => setR(parseFloat(e.target.value))}
          aria-label="growth rate r"
          style={{ width: "100%", accentColor: p.accent, cursor: "ew-resize" }}
        />
        <div className="mono" style={{ borderTop: `1px solid ${p.line}`, marginTop: 10, paddingTop: 10, fontSize: 10, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 6, color: p.ink }}>
          <span style={{ color: p.muted }}>r</span><span>{r.toFixed(2)}</span>
          <span style={{ color: p.muted }}>D</span><span>{D.toFixed(2)} (fixed)</span>
          <span style={{ color: p.muted }}>c = 2√(rD)</span><span style={{ color: p.accent }}>{c.toFixed(2)}</span>
          <span style={{ color: p.muted }}>front width</span><span>~ √(D/r) = {widthFrac.toFixed(2)}</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>Turn r up: the front moves faster and sharpens at the same time. Both are set by the same two numbers.</div>
      </div>
    </div>
  );
}
