// @ts-nocheck
import React from 'react';
import { useIsMobile } from '../../lib/hooks';

// LotkaVolterra
export function LotkaVolterra({ width, height, accent, ink, muted, line, theme, monthName, compact = false }) {
  const isMobile = useIsMobile();
  const ALPHA = 1.0, DELTA = 0.4;          // fixed
  const [beta, setBeta] = React.useState(0.4);
  const [gamma, setGamma] = React.useState(1.0);
  const stateRef = React.useRef({ x: 1.5, y: 0.8, trail: [], series: [] });
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf, lastFrame = 0, lastRender = 0;
    const dt = 0.02;
    const loop = (now) => {
      if (now - lastFrame > 16) {
        lastFrame = now;
        const s = stateRef.current;
        // Two RK4 sub-steps per visible frame for smoother integration
        for (let k = 0; k < 2; k++) {
          const dx = ALPHA * s.x - beta * s.x * s.y;
          const dy = DELTA * s.x * s.y - gamma * s.y;
          s.x = Math.max(0.02, Math.min(6, s.x + dx * dt));
          s.y = Math.max(0.02, Math.min(5.5, s.y + dy * dt));
        }
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 240) s.trail.shift();
        s.series.push({ x: s.x, y: s.y });
        if (s.series.length > 110) s.series.shift();
        // Throttle React re-renders to ~30Hz
        if (now - lastRender > 33) {
          lastRender = now;
          setTick(t => (t + 1) % 100000);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [beta, gamma]);

  const reset = () => {
    stateRef.current = { x: 1.5, y: 0.8, trail: [], series: [] };
    setTick(t => t + 1);
  };

  // Layout slices of the SVG canvas — sized to fill the box's natural dimensions
  // on desktop (the box stretches to match the lede column ≈ 460px). No JS
  // measurement, no feedback loop — just generous intrinsic values.
  // compact mode: square phase plot only (no series strip, no sliders/why-line below)
  const phaseH = compact ? width : (isMobile ? 180 : 250);
  const seriesH = compact ? 0 : (isMobile ? 0 : 42);
  const padX = 12;
  const xMax = 6, yMax = 6.5;
  const px = (x) => padX + (x / xMax) * (width - padX * 2);
  const py = (y) => phaseH - 18 - (y / yMax) * (phaseH - 30);
  const sx = (i) => padX + (i / 110) * (width - padX * 2);
  const sy = (v) => phaseH + seriesH - 4 - (v / 5) * (seriesH - 10);

  const s = stateRef.current;
  const trailPath = s.trail.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x).toFixed(1)} ${py(p.y).toFixed(1)}`).join(" ");
  const head = s.trail.length ? s.trail[s.trail.length - 1] : { x: 1.5, y: 0.8 };
  const eqX = gamma / DELTA;
  const eqY = ALPHA / beta;
  const seriesPrey = s.series.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(i).toFixed(1)} ${sy(p.x).toFixed(1)}`).join(" ");
  const seriesPred = s.series.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(i).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");

  return (
    <div style={{ position: "relative", width: "100%", fontFamily: "var(--f-ui)", fontSize: 11, color: muted }}>
      <svg width="100%" height={phaseH + seriesH} viewBox={`0 0 ${width} ${phaseH + seriesH}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }} role="img" aria-label="Lotka–Volterra predator–prey loop">
        {/* axes */}
        <line x1={padX} y1={phaseH - 18} x2={width - padX} y2={phaseH - 18} stroke={line} strokeWidth="0.6" />
        <line x1={padX} y1={12} x2={padX} y2={phaseH - 18} stroke={line} strokeWidth="0.6" />
        <text x={width - padX - 2} y={phaseH - 6} textAnchor="end" fontSize="9" fontFamily="var(--f-mono)" fill={muted}>prey →</text>
        <text x={padX + 4} y={16} fontSize="9" fontFamily="var(--f-mono)" fill={muted}>predator ↑</text>
        {/* equilibrium crosshair */}
        {eqX < xMax && eqY < yMax && (
          <g opacity="0.55">
            <line x1={px(eqX) - 4} y1={py(eqY)} x2={px(eqX) + 4} y2={py(eqY)} stroke={muted} strokeWidth="0.6" />
            <line x1={px(eqX)} y1={py(eqY) - 4} x2={px(eqX)} y2={py(eqY) + 4} stroke={muted} strokeWidth="0.6" />
            <text x={px(eqX) + 6} y={py(eqY) + 3} fontSize="8" fontFamily="var(--f-mono)" fill={muted}>eq</text>
          </g>
        )}
        {/* trail (the loop) */}
        <path d={trailPath} fill="none" stroke={accent} strokeWidth="1.1" strokeOpacity="0.75" />
        {/* current point */}
        <circle cx={px(head.x)} cy={py(head.y)} r="3.4" fill={accent} stroke={`color-mix(in oklch, ${accent} 50%, white)`} strokeWidth="1" />
        {/* time-series strip */}
        {seriesH > 0 && (
          <g transform={`translate(0, ${phaseH})`}>
            <line x1={padX} y1={seriesH - 4} x2={width - padX} y2={seriesH - 4} stroke={line} strokeWidth="0.4" />
            <path d={seriesPrey} fill="none" stroke={accent} strokeWidth="0.9" strokeOpacity="0.85" />
            <path d={seriesPred} fill="none" stroke={ink} strokeWidth="0.9" strokeOpacity="0.6" strokeDasharray="2 2" />
            <text x={width - padX - 2} y={11} textAnchor="end" fontSize="8" fontFamily="var(--f-mono)" fill={muted}>— prey · - predator</text>
          </g>
        )}
      </svg>

      {!compact && (
        <>
          {/* sliders + reset */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "2px 0.5rem", alignItems: "center", marginTop: 6, fontSize: 10, fontFamily: "var(--f-mono)", color: muted }}>
            <span>predation β</span>
            <input type="range" min="0.25" max="0.6" step="0.01" value={beta} onChange={e => setBeta(+e.target.value)} style={{ width: "100%", accentColor: accent, height: 18 }} />
            <span style={{ color: ink, minWidth: 28, textAlign: "right" }}>{beta.toFixed(2)}</span>
            <span>fox death γ</span>
            <input type="range" min="0.6" max="1.5" step="0.01" value={gamma} onChange={e => setGamma(+e.target.value)} style={{ width: "100%", accentColor: accent, height: 18 }} />
            <span style={{ color: ink, minWidth: 28, textAlign: "right" }}>{gamma.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
            <button onClick={reset} style={{ all: "unset", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, padding: "2px 8px", border: `1px solid ${line}`, color: accent, letterSpacing: "0.06em" }}>RESET</button>
            <span className="mono" style={{ fontSize: 9, color: muted }}>{monthName.toLowerCase()}</span>
          </div>

          <div className="mono" style={{ marginTop: 6, color: muted, fontSize: 10 }}>
            <span style={{ color: ink }}>fig.01 — {theme.caption}</span>
          </div>
          <div style={{ marginTop: 4, fontFamily: "var(--f-body)", fontSize: 12, color: muted, fontStyle: "italic", lineHeight: 1.45 }}>
            {theme.why}
          </div>
        </>
      )}
    </div>
  );
}
