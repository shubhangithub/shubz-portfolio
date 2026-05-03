// @ts-nocheck
/* eslint-disable */
/**
 * legacy.tsx — bulk-extracted from the old single-file index.html.
 * SSR-ready React app, lifted out so Astro can render real HTML for SEO.
 */
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// Essays were extracted into src/components/essays/<Name>.tsx for editability.
// They're imported here so the ArticleV4 dispatcher can still reference
// them by bare identifier, and re-exported so AppShell (and anyone else
// importing from '../legacy') keeps working transparently.
import { JayaEssay } from './essays/JayaEssay';
import { ThresholdEssay } from './essays/ThresholdEssay';
import { ConstraintClusterEssay } from './essays/ConstraintClusterEssay';
import { SixEnginesEssay } from './essays/SixEnginesEssay';
import { FashionEssay } from './essays/FashionEssay';
import { MayEssay } from './essays/MayEssay';
import { DraftEssay } from './essays/DraftEssay';
export { JayaEssay, ThresholdEssay, ConstraintClusterEssay, SixEnginesEssay, FashionEssay, MayEssay, DraftEssay };

// Diagrams were extracted into src/components/diagrams/<Name>.tsx.
// Imported here so cross-references inside legacy.tsx still resolve, and
// re-exported so external imports from '../legacy' keep working.
import { ConstraintEffect } from './diagrams/ConstraintEffect';
import { CtlaDistribution } from './diagrams/CtlaDistribution';
import { EnsembleConsensus } from './diagrams/EnsembleConsensus';
import { FeatureSelectionViz } from './diagrams/FeatureSelectionViz';
import { FourierMotif } from './diagrams/FourierMotif';
import { GateSensitivity } from './diagrams/GateSensitivity';
import { GradientDescentViz } from './diagrams/GradientDescentViz';
import { JayaSwarm } from './diagrams/JayaSwarm';
import { LMSRPriceCurve } from './diagrams/LMSRPriceCurve';
import { MethodRanking } from './diagrams/MethodRanking';
import { RecEngineSwarm } from './diagrams/RecEngineSwarm';
import { ThresholdMethods } from './diagrams/ThresholdMethods';
import { TrendSignalFlow } from './diagrams/TrendSignalFlow';
import { ViolationNetwork } from './diagrams/ViolationNetwork';
export { ConstraintEffect, CtlaDistribution, EnsembleConsensus, FeatureSelectionViz, FourierMotif, GateSensitivity, GradientDescentViz, JayaSwarm, LMSRPriceCurve, MethodRanking, RecEngineSwarm, ThresholdMethods, TrendSignalFlow, ViolationNetwork };





/* ===== components/motif.jsx ===== */

/* =======================================================================
   FourierMotif
   Live physics: a chain of rotating circles (epicycles) tracing a target
   shape. Visible trails. Pencil-stroke aesthetic, not CAD.
   Props:
     shape: "hex" | "orion" | "initials"
     size: px
     strokeColor
     trailColor
     density: N of circles (fewer = looser hand-drawn feel)
     speed: 0..1
     cursorReactive: bool  (nudges phase based on cursor distance)
     pausedWhileReading: bool
   ======================================================================= */

// --- target paths as signed-distance samples -> Fourier DFT coefficients ---
function samplePath(shape, N = 256) {
  const pts = [];
  if (shape === "hex") {
    // H3 hexagon (pointy-top) with gentle handwobble
    for (let i = 0; i < N; i++) {
      const t = i / N;
      // walk 6 edges
      const edge = Math.floor(t * 6);
      const u = (t * 6) - edge;
      const a1 = (edge / 6) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((edge + 1) / 6) * Math.PI * 2 - Math.PI / 2;
      const r = 1 + (Math.sin(t * Math.PI * 12) * 0.012); // subtle wobble
      const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
      const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
      pts.push({ x: x1 + (x2 - x1) * u, y: y1 + (y2 - y1) * u });
    }
  } else if (shape === "orion") {
    // Stylized Orion constellation as polyline segments (Betelgeuse, Bellatrix,
    // belt stars Alnitak/Alnilam/Mintaka, Saiph, Rigel). We trace a closed loop
    // through them with bezier-like interpolation for motif feel.
    const stars = [
      [0.55,-0.95],[-0.55,-0.85],[-0.55,-0.15],[-0.12,-0.05],[0.22,0.05],
      [0.55,0.15],[0.75,0.85],[-0.65,0.95],[-0.35,0.3],[0.38,0.35]
    ];
    for (let i = 0; i < N; i++) {
      const t = i / N * stars.length;
      const k = Math.floor(t) % stars.length;
      const nk = (k + 1) % stars.length;
      const u = t - Math.floor(t);
      const s = u * u * (3 - 2 * u); // smoothstep
      pts.push({
        x: stars[k][0] + (stars[nk][0] - stars[k][0]) * s,
        y: stars[k][1] + (stars[nk][1] - stars[k][1]) * s,
      });
    }
  } else if (shape === "initials") {
    // "SS" stylized single-stroke, walked along a figure-eight-ish path
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const a = t * Math.PI * 2;
      const r = 0.95;
      pts.push({
        x: r * Math.sin(a) * (1 - 0.35 * Math.cos(a * 2)),
        y: r * Math.sin(a * 2) * 0.7,
      });
    }
  } else {
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      pts.push({ x: Math.cos(a), y: Math.sin(a) });
    }
  }
  return pts;
}

function dft(samples) {
  const N = samples.length;
  const out = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += samples[n].x * Math.cos(phi) + samples[n].y * Math.sin(phi);
      im += samples[n].y * Math.cos(phi) - samples[n].x * Math.sin(phi);
    }
    re /= N; im /= N;
    const freq = k <= N / 2 ? k : k - N;
    const amp = Math.sqrt(re * re + im * im);
    const phase = Math.atan2(im, re);
    out.push({ freq, amp, phase });
  }
  out.sort((a, b) => b.amp - a.amp);
  return out;
}

// FourierMotif extracted to src/components/diagrams/FourierMotif.tsx



/* ===== components/gradient-descent.jsx ===== */
/* =======================================================================
   GradientDescentViz
   An interactive 2D loss-landscape with a ball that follows ∇f.

   Math:
     f(x, y) = sin(2.5x)·cos(2.5y) + 0.12(x² + y²)
     Multiple local minima on [-2.5, 2.5]².
     Ball follows −∇f with a fixed learning rate, leaving a trail.

   Interaction:
     Click anywhere on the canvas to restart from that position.
     The ball descends, converges, and waits for a new click.

   Visual:
     Heatmap of f rendered in accent colour at varying opacity
     (dark = valley, light = ridge). Quantised to eight bands for a
     contour-line effect. Trail in strokeColor; ball in accentColor.
     Readout at bottom: loss value, step count, convergence flag.
   ======================================================================= */

// useEffect/useRef/useState are imported by motif.jsx at top of bundle

// GradientDescentViz extracted to src/components/diagrams/GradientDescentViz.tsx




/* ===== components/seasonal.jsx ===== */
/* =======================================================================
   SeasonalSpecimen — a monthly rotating animated figure.
   Same visual language as the fourier motif and the gradient descent: single-stroke,
   accent-colored, math-driven motion. 12 themes, one per month.
   ======================================================================= */
export const SEASONAL_THEMES = [
  { id: "skating",   label: "Skating",       caption: "trochoid · wheel along a line",
    why: "January, when the rinks are full." },
  { id: "cellular",  label: "Cellular",      caption: "Wolfram rule 110 · 1-D automaton",
    why: "February, after Darwin's birthday — the smallest rules that look like life." },
  { id: "topology",  label: "Topology",      caption: "non-orientable surface · möbius",
    why: "March, around Pi Day. A surface with one side." },
  { id: "astronomy", label: "Astronomy",     caption: "Kepler orbit · e = 0.4",
    why: "April is Global Astronomy Month. An ellipse, with the sun off-centre." },
  { id: "lotkavolterra", label: "Predator–prey", caption: "Lotka–Volterra · α=1, δ=0.4",
    why: "May 22 is International Day for Biological Diversity. Predator and prey, locked in one closed loop — for Robert May." },
  { id: "fluids",    label: "Fluids",        caption: "Kármán vortex street · Re ≈ 100",
    why: "June, around World Oceans Day. Water past a column." },
  { id: "relativity",label: "Relativity",    caption: "light cone · Minkowski",
    why: "July, on the anniversary of Apollo 11. A light cone." },
  { id: "optics",    label: "Optics",        caption: "double-slit · path difference",
    why: "August, watching the Perseids. Two slits, one pattern." },
  { id: "crypto",    label: "Lattices",      caption: "LLL basis reduction",
    why: "September, Programmer's Day. Lattice basis reduction." },
  { id: "h3",        label: "H3 hexagons",   caption: "hex lattice · resolution 8",
    why: "October, Powers of Ten Day. Indexing the world on hexes." },
  { id: "quantum",   label: "Quantum",       caption: "interference of two stationary states",
    why: "November, around World Science Day. Two stationary states, beating." },
  { id: "neural",    label: "Latent space",  caption: "random walk in 2-D embedding",
    why: "December, taking stock. A random walk through latent space." },
];

export function SeasonalSpecimen({ width = 200, height = 180, accent = "#1F3DBF", ink = "#0F1320", muted = "#6E7488", line = "#D5D6DC", compact = false }) {
  // Show May (Lotka–Volterra) starting today; from May 1 onwards the natural
  // calendar month takes over.
  const month = Math.max(4, new Date().getMonth());
  const theme = SEASONAL_THEMES[month];
  const monthName = new Date(2026, month, 1).toLocaleString("en", { month: "long" });
  // Some months have a fully-interactive variant (sliders, drag, etc) — those
  // replace the standard SVG specimen entirely. Others fall back to a static
  // animated SVG via SPECIMEN_VARIANTS.
  const Interactive = INTERACTIVE_VARIANTS[theme.id];
  if (Interactive) {
    return <Interactive width={width} height={height} accent={accent} ink={ink} muted={muted} line={line} theme={theme} monthName={monthName} compact={compact} />;
  }
  return <StaticSpecimen width={width} height={height} accent={accent} ink={ink} muted={muted} line={line} theme={theme} monthName={monthName} />;
}

export function StaticSpecimen({ width, height, accent, ink, muted, line, theme, monthName }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf, lastT = 0;
    const loop = (now) => {
      if (now - lastT > 33) { lastT = now; setTick(t => (t + 1) % 100000); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const Variant = SPECIMEN_VARIANTS[theme.id] || SPECIMEN_VARIANTS.quantum;
  return (
    <div style={{ position: "relative", width, fontFamily: "var(--f-ui)", fontSize: 11, color: muted }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }} role="img" aria-label={`${theme.label} specimen`}>
        <Variant w={width} h={height} t={tick} accent={accent} ink={ink} muted={muted} line={line} />
      </svg>
      <div className="mono" style={{ marginTop: 6, color: muted, fontSize: 10, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: ink }}>fig.01 — {theme.caption}</span>
        <span>{monthName.toLowerCase()}</span>
      </div>
      <div style={{ marginTop: 8, fontFamily: "var(--f-body)", fontSize: 12, color: muted, fontStyle: "italic", lineHeight: 1.5 }}>
        {theme.why}
      </div>
    </div>
  );
}

// Lotka–Volterra predator–prey: phase-space loop + time-series strip + live
// sliders for predation (β) and predator mortality (γ). May only.
export function LotkaVolterra({ width, height, accent, ink, muted, line, theme, monthName, compact = false }) {
  const isMobile = (typeof useIsMobile === "function") ? useIsMobile() : (typeof window !== "undefined" && window.innerWidth <= 768);
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

export const SPECIMEN_VARIANTS = {
  quantum: ({ w, h, t, accent, muted, line }) => {
    const N = 70, tau = t * 0.05, pts = [];
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1);
      const re = Math.sin(Math.PI * x) * Math.cos(tau) + Math.sin(2 * Math.PI * x) * Math.cos(4 * tau);
      const im = -Math.sin(Math.PI * x) * Math.sin(tau) - Math.sin(2 * Math.PI * x) * Math.sin(4 * tau);
      pts.push({ x: 18 + x * (w - 36), y: h - 28 - (re*re + im*im) * (h - 56) / 2 });
    }
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    return (<g><line x1={18} x2={w-18} y1={h-28} y2={h-28} stroke={line} strokeWidth="0.6"/><line x1={18} x2={18} y1={18} y2={h-28} stroke={line} strokeWidth="0.6"/><text x={22} y={24} fontSize="9" fontFamily="var(--f-mono)" fill={muted}>|ψ(x,t)|²</text><path d={path} fill="none" stroke={accent} strokeWidth="1.4"/></g>);
  },
  topology: ({ w, h, t, accent, ink, muted }) => {
    const cx = w/2, cy = h/2 - 6, R = Math.min(w,h) * 0.30, rot = t * 0.012, lines = [];
    for (let i = 0; i < 36; i++) {
      const u = (i/36) * Math.PI * 2, inner = [];
      for (let v = -1; v <= 1; v += 2) {
        const x3 = (R + v*10*Math.cos(u/2)) * Math.cos(u + rot);
        const y3 = (R + v*10*Math.cos(u/2)) * Math.sin(u + rot);
        const z3 = v*10*Math.sin(u/2);
        inner.push({ x: cx + x3 + z3*0.3, y: cy + y3*0.5 - z3*0.4 });
      }
      lines.push(inner);
    }
    const M = 70, edge = [];
    for (let i = 0; i <= M; i++) {
      const u = (i/M) * Math.PI * 4;
      const x3 = (R + 10*Math.cos(u/2)) * Math.cos(u + rot);
      const y3 = (R + 10*Math.cos(u/2)) * Math.sin(u + rot);
      const z3 = 10*Math.sin(u/2);
      edge.push(`${i === 0 ? "M" : "L"} ${(cx+x3+z3*0.3).toFixed(1)} ${(cy+y3*0.5-z3*0.4).toFixed(1)}`);
    }
    return (<g>{lines.map((seg, i) => <line key={i} x1={seg[0].x} y1={seg[0].y} x2={seg[1].x} y2={seg[1].y} stroke={i%4===0?accent:muted} strokeWidth={i%4===0?"1.1":"0.55"} strokeOpacity={i%4===0?1:0.5}/>)}<path d={edge.join(" ")} fill="none" stroke={ink} strokeWidth="1"/></g>);
  },
  skating: ({ w, h, t, accent, ink, muted, line }) => {
    const r = 22, b = 12, phase = t * 0.04, ground = h - 26, N = 180, pts = [];
    for (let i = 0; i < N; i++) {
      const θ = (i/N) * Math.PI * 4 + phase * 0.3;
      pts.push({ x: 8 + (r*θ - b*Math.sin(θ)) * 0.42, y: ground - (r - b*Math.cos(θ)) });
    }
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const θ0 = phase * 0.3 + Math.PI * 2;
    const wx = 8 + (r*θ0 - b*Math.sin(θ0)) * 0.42;
    return (<g><line x1={0} x2={w} y1={ground} y2={ground} stroke={line} strokeWidth="0.6"/><path d={path} fill="none" stroke={accent} strokeWidth="1.2" strokeOpacity="0.7"/><circle cx={wx} cy={ground - r*0.42} r={r*0.42} fill="none" stroke={ink} strokeWidth="1"/><circle cx={wx} cy={ground - r*0.42} r="1.4" fill={accent}/><rect x={wx-7} y={ground - r*0.42 - 12} width="14" height="5" fill="none" stroke={muted} strokeWidth="0.7"/></g>);
  },
  astronomy: ({ w, h, t, accent, ink, muted, line }) => {
    const cx = w/2, cy = h/2 - 4, a = Math.min(w,h)*0.30, e = 0.4, b = a*Math.sqrt(1 - e*e);
    const orb = [];
    for (let i = 0; i <= 100; i++) {
      const θ = (i/100) * Math.PI * 2;
      orb.push(`${i === 0 ? "M" : "L"} ${(cx + a*Math.cos(θ) - a*e).toFixed(1)} ${(cy + b*Math.sin(θ)).toFixed(1)}`);
    }
    const Mθ = t * 0.012;
    let E = Mθ;
    for (let k = 0; k < 5; k++) E = E - (E - e*Math.sin(E) - Mθ) / (1 - e*Math.cos(E));
    const px = cx + a*(Math.cos(E) - e), py = cy + b*Math.sin(E);
    return (<g>{[[16,16],[w-16,16],[16,h-16],[w-16,h-16]].map(([x,y], i) => (<g key={i}><line x1={x + (i%2 ? -7 : 7)} y1={y} x2={x} y2={y} stroke={muted} strokeWidth="0.7"/><line x1={x} y1={y + (i<2 ? 7 : -7)} x2={x} y2={y} stroke={muted} strokeWidth="0.7"/></g>))}<line x1={cx-4} y1={cy} x2={cx+4} y2={cy} stroke={line} strokeWidth="0.5"/><line x1={cx} y1={cy-4} x2={cx} y2={cy+4} stroke={line} strokeWidth="0.5"/><path d={orb.join(" ")} fill="none" stroke={muted} strokeWidth="0.8" strokeDasharray="2 3"/><circle cx={cx - a*e} cy={cy} r="3" fill={ink}/><circle cx={px} cy={py} r="2.4" fill={accent}/><line x1={cx - a*e} y1={cy} x2={px} y2={py} stroke={accent} strokeWidth="0.6" strokeOpacity="0.4"/></g>);
  },
  cellular: ({ w, h, t, accent, ink, muted }) => {
    const cellW = 4, cellH = 4;
    const cols = Math.floor((w - 16) / cellW), rows = Math.floor((h - 28) / cellH);
    const generation = Math.floor(t / 4);
    let row = new Array(cols).fill(0);
    row[Math.floor(cols/2)] = 1;
    const all = [row];
    for (let r = 0; r < rows + generation; r++) {
      const next = new Array(cols).fill(0);
      for (let c = 0; c < cols; c++) {
        const idx = (row[(c-1+cols)%cols] << 2) | (row[c] << 1) | row[(c+1)%cols];
        next[c] = (110 >> idx) & 1;
      }
      all.push(next); row = next;
    }
    const visible = all.slice(-rows), cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (visible[r][c]) cells.push(<rect key={r*cols+c} x={8 + c*cellW} y={18 + r*cellH} width={cellW-0.5} height={cellH-0.5} fill={r > rows-4 ? accent : ink} fillOpacity={r > rows-4 ? 1 : 0.85}/>);
    }
    return (<g>{cells}<text x={w-12} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">rule 110</text></g>);
  },
  fluids: ({ w, h, t, accent, ink, muted, line }) => {
    const cy = h/2 - 4, obstacleX = 32, N = 7, vortices = [];
    for (let i = 0; i < N; i++) {
      const phase = t * 0.02 - i * 1.4;
      const age = (phase * 12) % (w - obstacleX - 14);
      const sign = i % 2 === 0 ? 1 : -1;
      vortices.push({ x: obstacleX + age + obstacleX, y: cy + sign*12, sign, age });
    }
    return (<g>{[0.2,0.4,0.6,0.8].map((f, i) => <line key={i} x1={4} x2={obstacleX-3} y1={h*f} y2={h*f} stroke={line} strokeWidth="0.5"/>)}<circle cx={obstacleX} cy={cy} r="5" fill="none" stroke={ink} strokeWidth="1"/>{vortices.map((v, i) => {
      const sp = [];
      for (let k = 0; k < 22; k++) {
        const θ = (k/22) * Math.PI * 2.4 * v.sign;
        const r = 1 + k * 0.16;
        sp.push(`${k === 0 ? "M" : "L"} ${(v.x + r*Math.cos(θ)).toFixed(1)} ${(v.y + r*Math.sin(θ)).toFixed(1)}`);
      }
      return <path key={i} d={sp.join(" ")} fill="none" stroke={i%2===0 ? accent : muted} strokeWidth="0.8" strokeOpacity={Math.max(0.15, 1 - v.age/(w - obstacleX))}/>;
    })}</g>);
  },
  chaos: ({ w, h, t, accent, ink, muted }) => {
    if (!SPECIMEN_VARIANTS.chaos.state) SPECIMEN_VARIANTS.chaos.state = { x: 0.1, y: 0, z: 0, trail: [] };
    const s = SPECIMEN_VARIANTS.chaos.state, dt = 0.008;
    for (let k = 0; k < 4; k++) {
      const dx = 10*(s.y - s.x), dy = s.x*(28 - s.z) - s.y, dz = s.x*s.y - (8/3)*s.z;
      s.x += dx*dt; s.y += dy*dt; s.z += dz*dt;
      s.trail.push({ x: s.x, z: s.z });
      if (s.trail.length > 500) s.trail.shift();
    }
    const cx = w/2, cy = h/2 + 6, scale = Math.min(w,h)/55;
    const path = s.trail.map((p, i) => `${i === 0 ? "M" : "L"} ${(cx + p.x*scale).toFixed(1)} ${(cy - (p.z - 25)*scale*0.85).toFixed(1)}`).join(" ");
    const head = s.trail[s.trail.length - 1] || { x: 0, z: 25 };
    return (<g><path d={path} fill="none" stroke={accent} strokeWidth="0.7" strokeOpacity="0.65"/><circle cx={cx + head.x*scale} cy={cy - (head.z - 25)*scale*0.85} r="1.8" fill={ink}/><text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">Lorenz</text></g>);
  },
  h3: ({ w, h, t, accent, muted, line }) => {
    const r = 12, cols = 8, rows = 5, xStep = r * Math.sqrt(3), yStep = r * 1.5;
    const xOff = (w - cols*xStep) / 2 + xStep/2, yOff = (h - rows*yStep) / 2 - 4;
    const focusIdx = Math.floor(t * 0.04) % (cols * rows), hexes = [];
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const cx = xOff + col*xStep + (row % 2 ? xStep/2 : 0), cy = yOff + row*yStep, pts = [];
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI / 3) - Math.PI/2;
        pts.push(`${(cx + r*Math.cos(a)).toFixed(1)},${(cy + r*Math.sin(a)).toFixed(1)}`);
      }
      const idx = row*cols + col, isFocus = idx === focusIdx;
      hexes.push(<polygon key={idx} points={pts.join(" ")} fill={isFocus ? accent : "none"} fillOpacity={isFocus ? 0.18 : 0} stroke={isFocus ? accent : line} strokeWidth={isFocus ? "1.4" : "0.6"}/>);
    }
    return (<g>{hexes}<text x={w-6} y={h-6} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">res 8</text></g>);
  },
  neural: ({ w, h, t, ink, accent, line, muted }) => {
    if (!SPECIMEN_VARIANTS.neural.state) SPECIMEN_VARIANTS.neural.state = { trail: [{ x: 0.5, y: 0.5 }] };
    const s = SPECIMEN_VARIANTS.neural.state;
    const noiseX = Math.sin(t*0.03)*0.3 + Math.sin(t*0.011 + 1.3)*0.2;
    const noiseY = Math.cos(t*0.025)*0.3 + Math.cos(t*0.013 + 0.7)*0.2;
    const last = s.trail[s.trail.length - 1];
    const nx = Math.max(0.05, Math.min(0.95, last.x + (noiseX - last.x + 0.5) * 0.04));
    const ny = Math.max(0.05, Math.min(0.95, last.y + (noiseY - last.y + 0.5) * 0.04));
    if (t % 2 === 0) s.trail.push({ x: nx, y: ny });
    if (s.trail.length > 180) s.trail.shift();
    const grid = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) grid.push({ x: 0.1 + i*0.2, y: 0.18 + j*0.2 });
    return (<g>{grid.map((g, i) => <circle key={i} cx={g.x*w} cy={g.y*h} r="1.2" fill={line}/>)}<path d={s.trail.map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x*w).toFixed(1)} ${(p.y*h).toFixed(1)}`).join(" ")} fill="none" stroke={accent} strokeWidth="0.8" strokeOpacity="0.6"/><circle cx={nx*w} cy={ny*h} r="2.4" fill={ink}/><text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">z ∈ ℝ²</text></g>);
  },
  optics: ({ w, h, t, accent, ink, muted, line }) => {
    const srcX = 12, slitX = 42, slitGap = 16, screenX = w - 18;
    const lambda = 6 + 2*Math.sin(t*0.01), N = 50, pts = [];
    for (let i = 0; i < N; i++) {
      const y = 16 + i*((h - 36) / (N - 1));
      const d1 = Math.hypot(screenX - slitX, y - (h/2 - slitGap/2));
      const d2 = Math.hypot(screenX - slitX, y - (h/2 + slitGap/2));
      const phase = 2*Math.PI*(d1 - d2)/lambda + t*0.04;
      pts.push({ y, I: (1 + Math.cos(phase))/2 });
    }
    return (<g><circle cx={srcX} cy={h/2} r="2" fill={accent}/><line x1={slitX} y1={16} x2={slitX} y2={h/2 - slitGap/2} stroke={ink} strokeWidth="1"/><line x1={slitX} y1={h/2 + slitGap/2} x2={slitX} y2={h-16} stroke={ink} strokeWidth="1"/><line x1={screenX} y1={16} x2={screenX} y2={h-16} stroke={line} strokeWidth="0.8"/>{pts.map((p, i) => <line key={i} x1={screenX} y1={p.y} x2={screenX + 12*p.I} y2={p.y} stroke={accent} strokeWidth="1.2"/>)}<text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">2-slit</text></g>);
  },
  crypto: ({ w, h, t, accent, ink, muted }) => {
    const cx = w/2, cy = h/2 - 4, phase = (Math.sin(t*0.012) + 1)/2;
    const a = 22, b = 18, k = 18 * (1 - phase), dots = [];
    for (let i = -3; i <= 3; i++) for (let j = -2; j <= 2; j++) {
      dots.push({ x: cx + i*a + j*k, y: cy + j*b, focus: i === 0 && j === 0 });
    }
    return (<g>{dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.focus ? 2.4 : 1.4} fill={d.focus ? ink : muted}/>)}<defs><marker id="cArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 8 5 L 0 10 z" fill={accent}/></marker></defs><line x1={cx} y1={cy} x2={cx + a} y2={cy} stroke={accent} strokeWidth="1.2" markerEnd="url(#cArr)"/><line x1={cx} y1={cy} x2={cx + k} y2={cy + b} stroke={accent} strokeWidth="1.2" markerEnd="url(#cArr)"/><text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">LLL</text></g>);
  },
  relativity: ({ w, h, t, accent, ink, muted, line }) => {
    const cx = w/2, cy = h/2 + 6, len = Math.min(w,h) * 0.32;
    const eventY = cy - (t*0.4) % (len*1.6) + len*0.3;
    return (<g><line x1={cx} y1={cy-len} x2={cx} y2={cy+len} stroke={line} strokeWidth="0.6"/><line x1={cx-len} y1={cy} x2={cx+len} y2={cy} stroke={line} strokeWidth="0.6"/><text x={cx+4} y={cy-len+4} fontSize="9" fontFamily="var(--f-mono)" fill={muted}>ct</text><line x1={cx} y1={cy} x2={cx-len} y2={cy-len} stroke={accent} strokeWidth="1"/><line x1={cx} y1={cy} x2={cx+len} y2={cy-len} stroke={accent} strokeWidth="1"/><line x1={cx} y1={cy} x2={cx-len} y2={cy+len} stroke={muted} strokeWidth="0.7" strokeDasharray="2 3"/><line x1={cx} y1={cy} x2={cx+len} y2={cy+len} stroke={muted} strokeWidth="0.7" strokeDasharray="2 3"/><line x1={cx+4} y1={cy-len} x2={cx-4} y2={cy+len} stroke={ink} strokeWidth="1"/><circle cx={cx + (eventY-cy)/len * -4} cy={eventY} r="2.2" fill={ink}/><text x={w-6} y={h-6} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">Minkowski</text></g>);
  },
};

export const INTERACTIVE_VARIANTS = {
  lotkavolterra: LotkaVolterra,
};



/* ===== components/primitives.jsx ===== */
// hook destructuring done locally in each component below

/* =======================================================================
   Shared primitives used across all variations
   ======================================================================= */

// Custom cursor - small warm dot, scales near interactive elements, morphs to I-beam over prose
export function CustomCursor({ color = "#B85C3C" }) {
  const dotRef = useRef(null);
  const [mode, setMode] = useState("default"); // default | link | text | hidden
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    if ("ontouchstart" in window) return; // desktop only
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function onMove(e) {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) { setMode("default"); return; }
      const interactive = el.closest("a, button, [role='button'], input, textarea, select, label");
      const prose = el.closest(".prose, p, h1, h2, h3, li, blockquote");
      if (interactive) setMode("link");
      else if (prose) setMode("text");
      else setMode("default");
    }
    function tick() {
      const lag = reduced ? 1 : 0.22;
      pos.current.x += (target.current.x - pos.current.x) * lag;
      pos.current.y += (target.current.y - pos.current.y) * lag;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  const size = mode === "link" ? 22 : mode === "text" ? 2 : 10;
  const width = mode === "text" ? 2 : size;
  const height = mode === "text" ? 22 : size;

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width, height,
        marginLeft: -width / 2, marginTop: -height / 2,
        background: color,
        borderRadius: mode === "text" ? 0 : "50%",
        mixBlendMode: "multiply",
        pointerEvents: "none",
        zIndex: 9999,
        transition: "width 240ms var(--ease-spring), height 240ms var(--ease-spring), border-radius 240ms var(--ease-out), background 180ms ease, opacity 180ms",
      }}
    />
  );
}

// Letter-by-letter reveal on mount (once per session)
export function LetterReveal({ children, className = "", delay = 0, stagger = 28, as: Tag = "span" }) {
  const text = typeof children === "string" ? children : "";
  // Split on regular spaces so spaces between words stay breakable for line-wrap.
  // Letters within each word still animate individually with the staggered delay.
  const words = text.split(" ");
  let charIdx = 0;
  return (
    <Tag className={`letter-reveal ${className}`} aria-label={text}>
      {words.map((word, w) => (
        <React.Fragment key={w}>
          {w > 0 ? " " : null}
          {word.split("").map((ch) => {
            const i = charIdx++;
            return (
              <span
                key={i}
                aria-hidden="true"
                style={{ animationDelay: `${delay + i * stagger}ms` }}
              >
                {ch}
              </span>
            );
          })}
        </React.Fragment>
      ))}
    </Tag>
  );
}


// Reading ruler (proportional bar) - appears during article scroll
export function ReadingRuler({ color = "currentColor", enabled = true }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);
  if (!enabled) return null;
  return (
    <div aria-hidden="true" style={{ position: "fixed", left: 24, top: 24, bottom: 24, width: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 80, pointerEvents: "none", opacity: progress > 0.01 ? 1 : 0, transition: "opacity 320ms var(--ease-out)" }}>
      {Array.from({ length: 22 }).map((_, i) => {
        const k = i / 21;
        const active = k <= progress;
        return <div key={i} style={{ width: active ? 14 : 7, height: 1, background: color, opacity: active ? 0.9 : 0.25, transition: "width 220ms var(--ease-out), opacity 220ms" }} />;
      })}
    </div>
  );
}




/* ===== components/shared.jsx ===== */



export function Footer({ palette, line }) {
  const p = palette;
  return (
    <footer style={{ borderTop: `1px solid ${p.line}`, padding: "2.4rem 2.2rem 3rem", maxWidth: 1240, margin: "4rem auto 0", color: p.muted, fontFamily: "var(--f-ui)", fontSize: 13, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1.2rem", position: "relative", zIndex: 2 }}>
      <span style={{ fontStyle: "italic", fontFamily: "var(--f-body)" }}>{line}</span>
      <span className="mono">© Shubz Sharma — set in Fraunces &amp; Source Serif</span>
    </footer>
  );
}

export const POSTS = [
  {
    slug: "jaya",
    title: "JAYA, improved",
    kicker: "Essay · Optimisation & Bioinformatics",
    dek: "Improving a parameter-free optimiser with a fitness trade-off and elitism.",
    minutes: 12,
    illustration: "hex",
    cardBg: "#E5E8F0",
    accent: "#1F3DBF",
  },
  {
    slug: "fashion-trends",
    title: "Pricing the next scarf",
    kicker: "Essay · Forecasting & Markets",
    dek: "Five-source forecasting and an LMSR prediction market on fashion micro-trends.",
    minutes: 9,
    illustration: "wave",
    cardBg: "#ECEAE3",
    accent: "#1F3DBF",
  },
  {
    slug: "threshold-gate",
    title: "Positive by how much",
    kicker: "Essay · Computational biology",
    dek: "Four automated methods replicating a pathologist's threshold on immune cell data.",
    minutes: 9,
    illustration: "hex",
    cardBg: "#EFEEE7",
    accent: "#1F3DBF",
  },
  {
    slug: "constraint-clustering",
    title: "Cells that can't exist",
    kicker: "Essay · Computational biology",
    dek: "A standard clustering algorithm, plus nine immunology constraints.",
    minutes: 10,
    illustration: "hex",
    cardBg: "#EDE9E4",
    accent: "#1F3DBF",
  },
  {
    slug: "six-engines",
    title: "Six engines for one songbook",
    kicker: "Essay · Recommendation",
    dek: "Five base models plus an ensemble on Taylor's full catalogue.",
    minutes: 7,
    illustration: "wave",
    cardBg: "#EBE8EE",
    accent: "#1F3DBF",
  },
  {
    slug: "merger-themes",
    title: "What the merger said",
    kicker: "Essay · NLP & M&A",
    dek: "Theme extraction and sentiment mining on the Flipkart-Walmart merger.",
    minutes: 9,
    illustration: "wave",
    cardBg: "#EFE8E5",
    accent: "#1F3DBF",
  },
  {
    slug: "may-2026",
    title: "Predator and prey, on a closed loop",
    kicker: "Note · Mathematical ecology",
    dek: "The May figure: Lotka–Volterra, drawn for Robert May.",
    minutes: 4,
    illustration: "wave",
    cardBg: "#E8EEF0",
    accent: "#1F3DBF",
  },
];


/* ===== components/home-v4.jsx ===== */

/* =======================================================================
   V4 — "Rauno-precise"
   Cool, obsessively detailed · whitespace tuned · micro-interactions on load
   ======================================================================= */

export const PALETTE_V4_LIGHT = {
  id: "cobalt",
  label: "cool ivory + cobalt",
  paper: "#F2F1EC",
  ink: "#0F1320",
  muted: "#6E7488",
  accent: "#1F3DBF",
  line: "#D5D6DC",
};

export const PALETTE_V4_DARK = {
  id: "cobalt-dark",
  label: "midnight + cobalt",
  paper: "#0F1320",
  ink: "#E8E6E1",
  muted: "#8B8FA4",
  accent: "#6B8AFF",
  line: "#252A3A",
};

export const PALETTE_V4 = PALETTE_V4_LIGHT;

export function HomeV4({ onNavigate, setCursorColor, dark, toggleTheme, palette }) {
  const { useEffect, useState, useRef } = React;
  const p = palette || PALETTE_V4;

  useEffect(() => {
    setCursorColor(p.accent);
    document.body.style.background = p.paper;
  }, []);

  // ticker
  const [tickerIdx, setTickerIdx] = useState(0);
  const ticker = ["~/london", "~/orion · founding-eng", "~/oxford-mfocs", "~/minstp · 2026"];
  useEffect(() => {
    const id = setInterval(() => setTickerIdx(i => (i + 1) % ticker.length), 2400);
    return () => clearInterval(id);
  }, []);

  // live cursor coords + scroll % for instrument margin (throttled)
  const telemetryRow = useTelemetry(); // ['cursor', 'x,y'] desktop · ['viewport', 'WxH'] touch
  const scrollPct = usePreciseScroll();
  const isMobile = useIsMobile();

  // gradient descent state for status copy
  // gdState removed — specimens moved to /now

  // local time tick
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      {/* fixed-grid baseline (desktop only — looks noisy on mobile) */}
      {!isMobile && (
        <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      )}

      {/* top precision bar */}
      <div style={{ borderBottom: `1px solid ${p.line}`, position: "relative", zIndex: 5, fontFamily: "var(--f-ui)", fontSize: isMobile ? 11 : 12, color: p.muted, padding: isMobile ? "0.5rem 1rem" : "0.7rem 1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: "0.04em" }}>
        <span className="mono">Shubz SHARMA</span>
        {!isMobile && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, animation: "blip 2s ease-in-out infinite" }} />
            <span className="mono" style={{ color: p.ink }}>{ticker[tickerIdx]}</span>
          </span>
        )}
        <span style={{ display: "inline-flex", alignItems: "center", gap: isMobile ? 8 : 14 }}>
          {!isMobile && <span className="mono">v.2026.04 · {hh}:{mm}:{ss} GMT</span>}
          <ThemeToggle dark={dark} toggleTheme={toggleTheme} palette={p} />
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} style={{ display: "inline-block", width: 26, height: 26, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${p.line}`, flexShrink: 0, transition: "border-color 240ms var(--ease-out)" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = p.accent} onMouseLeave={(e) => e.currentTarget.style.borderColor = p.line}>
            <img src="assets/portrait.png" alt="Contact" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </a>
        </span>
        <style>{`@keyframes blip { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      </div>

      <PreciseNav palette={p} current="home" onNavigate={onNavigate} />

      {/* HERO — 12-col on desktop · single-column stack on mobile */}
      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "1.2rem 1rem 1.6rem" : "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>

          {/* col 1-2 — shared IndexRail (matches every other page's rail) */}
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Recent writing", "Selected builds", "Now ticker"]}
              telemetry={[telemetryRow, ["page", "home"], ["essays", `${POSTS.filter(x => x.slug !== "merger-themes").length} polished`], ["builds", "03"]]}
              scrollPct={scrollPct} />
          </div>

          {/* col 3-9 — portrait + display + lede (or full width on mobile) */}
          <div style={{ gridColumn: isMobile ? "1" : "3 / span 10" }}>
            {/* circle portrait — above title, angled left */}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} style={{ display: "inline-block", width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, borderRadius: "50%", overflow: "hidden", border: `2px solid ${p.line}`, marginBottom: isMobile ? "0.8rem" : "1rem", transform: "rotate(-6deg)", transition: "border-color 240ms var(--ease-out), transform 300ms var(--ease-out)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = p.accent; e.currentTarget.style.transform = "rotate(0deg)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = p.line; e.currentTarget.style.transform = "rotate(-6deg)"; }}>
              <img src="assets/portrait.png" alt="Shubz — click for contact" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </a>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontFamily: "var(--f-ui)", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§01</span>
              Home · the front door
            </div>

            {/* === HERO HARMONISE TRY · 2026-04-29 ============================
                To REVERT to the previous look:
                  1. Delete the two NEW-* blocks below.
                  2. Uncomment the OLD-H1 block (remove the surrounding /‍* and *‍/).
                  3. Uncomment the inner lede paragraph further down (look for OLD-LEDE).
                ============================================================== */}

            {/* OLD-H1 (kept commented for easy revert)
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={22}>Read </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={140}>maths and CS</LetterReveal></span>
              <LetterReveal stagger={22} delay={400}> at Oxford. Currently building geospatial ML at Orion, easily </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={1900}>distracted</LetterReveal></span>
              <LetterReveal stagger={22} delay={2160}> by other problems.</LetterReveal>
            </h1>
            */}

            {/* NEW-H1 — three lines, italic accent at the end (matches the other pages' rhythm) */}
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={22}>Read </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={140}>maths and CS</LetterReveal></span>
              <LetterReveal stagger={22} delay={400}> at Oxford.</LetterReveal>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={22} delay={760}>Currently building geospatial ML at Orion,</LetterReveal>
              </span>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={22} delay={1500}>easily </LetterReveal>
                <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={1900}>distracted</LetterReveal></span>
                <LetterReveal stagger={22} delay={2160}> by other problems.</LetterReveal>
              </span>
            </h1>

            {/* NEW-LEDE — pulled into the standard 54ch slot directly under the h1 */}
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              I'm a founding engineer at <em>Orion</em>, where I build geospatial ML that pays attention to <em>where</em> things happen, and how confidently. Before that I read maths (dabbled in some physics) at Oxford and computer science at FLAME. I am also, in inconvenient order: a Thames rower on Sundays, active in STEM ed outreach, a hobby pianist, a fashion enthusiast, and very into interactive diagrams.
            </p>

            {/* fig.01 — compact square (phase loop only). Full interactive figure lives in the May essay. */}
            <div style={{ marginTop: isMobile ? "1.8rem" : "2rem", width: isMobile ? 240 : 280 }}>
              <SeasonalSpecimen
                width={isMobile ? 240 : 280}
                height={isMobile ? 240 : 280}
                accent={p.accent}
                ink={p.ink}
                muted={p.muted}
                line={p.line}
                compact={true}
              />
              <div className="mono" style={{ marginTop: 8, fontSize: 10, color: p.muted, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span style={{ color: p.ink }}>fig.01 — predator–prey · may</span>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("essay", "may-2026"); }} className="link-underline" style={{ color: p.accent, fontSize: 10 }}>see the math →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WRITING + BUILDS — side by side */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "1.6rem 1rem 2rem" : "2rem 1.6rem 2.4rem", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap: isMobile ? "2rem" : "2.4rem", alignItems: "start" }}>
          {/* LEFT — essays */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.2rem" }}>
              <h2 className="display" style={{ fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
                <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>02</span>
                Recent writing
              </h2>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>all essays →</a>
            </div>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {POSTS.filter(x => x.slug !== "merger-themes").slice(0, 4).reverse().map((post, i) => (
                <a key={post.slug} href="#" onClick={(e) => { e.preventDefault(); onNavigate("essay", post.slug); }}
                   className="v4-stack-row"
                   style={{ display: "grid", gridTemplateColumns: "36px 1fr 56px", gap: "1rem", alignItems: "baseline", padding: "1rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="link-underline" style={{ fontFamily: "var(--f-body)", fontSize: "1rem" }}>{post.title}</span>
                    <div style={{ fontSize: "0.85rem", color: p.muted, marginTop: 3, fontStyle: "italic", lineHeight: 1.5, maxWidth: "50ch" }}>{post.dek}</div>
                  </div>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{post.minutes}m</span>
                </a>
              ))}
            </div>
          </div>
          {/* RIGHT — builds */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.2rem" }}>
              <h2 className="display" style={{ fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
                <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
                Selected builds
              </h2>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("work"); }} className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>annotated cv →</a>
            </div>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {[
                { name: "fashion-web", role: "ML trend intelligence + LMSR exchange", year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
                { name: "taylor-rec-engine", role: "six recommendation engines", year: "2026", url: "https://shubz-taylor-recommendation-engine.vercel.app" },
                { name: "platypus-learn", role: "AI learning platform", year: "2025 —", url: "https://platypus-learn.vercel.app" },
              ].map((b, i) => (
                <a key={i} href={b.url} target="_blank" rel="noreferrer"
                   className="v4-stack-row"
                   style={{ display: "grid", gridTemplateColumns: "36px 1fr 64px", gap: "1rem", alignItems: "baseline", padding: "1rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="link-underline mono" style={{ color: p.accent, fontSize: 12 }}>{b.name} ↗</span>
                    <div style={{ fontSize: "0.85rem", color: p.muted, marginTop: 3, fontStyle: "italic", lineHeight: 1.5 }}>{b.role}</div>
                  </div>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{b.year}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOW — horizontal ticker */}
      {(() => {
        const nowItems = [
          { kind: "FOUNDING", what: "Orion — geospatial ML over H3 indexing, confidence weighting at every join" },
          { kind: "SHIPPING", what: "fashion-web — five-source trend pipeline, LMSR exchange, Gemini CV" },
          { kind: "WRITING", what: "Drafting the next essay — the argument is half-formed, the diagrams are the fun part" },
          { kind: "READING", what: "Papers on calibration, a novel I won't name yet, optimization surveys" },
          { kind: "BUILDING", what: "shubz-taylor-rec-engine — six engines, all slightly wrong in interesting ways" },
        ];
        const tickerContent = [...nowItems, ...nowItems].map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", paddingRight: isMobile ? "1.6rem" : "2.4rem" }}>
            <span className="mono" style={{ color: p.accent, fontSize: isMobile ? 9 : 10, letterSpacing: "0.12em" }}>{item.kind}</span>
            <span style={{ color: p.ink, fontSize: isMobile ? 11 : 13, fontFamily: "var(--f-ui)" }}>{item.what}</span>
            <span style={{ color: p.muted, fontSize: 11 }}>·</span>
          </span>
        ));
        return (
          <section style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}`, overflow: "hidden", cursor: "pointer" }}
                   onClick={(e) => { e.preventDefault(); onNavigate("now"); }}>
            <div style={{ display: "flex", alignItems: "center", padding: "0.9rem 0" }}>
              <div style={{ display: "inline-flex", alignItems: "center", animation: "now-ticker 40s linear infinite", whiteSpace: "nowrap" }}>
                {tickerContent}
              </div>
            </div>
            <style>{`@keyframes now-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: isMobile ? 40 : 80, background: `linear-gradient(to right, ${p.paper}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: isMobile ? 40 : 80, background: `linear-gradient(to left, ${p.paper}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onNavigate("now"); }} className="mono link-underline" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 2, fontSize: 10, color: p.accent, background: p.paper, padding: "2px 8px" }}>/now →</a>
          </section>
        );
      })()}

      </main>

      <Footer palette={p} line="Made in London." />
    </div>
  );
}




// PullQuote + Figure: shared essay primitives used by the V4 essays below.
export function PullQuote({ children, color }) {
  return (
    <blockquote style={{ margin: "3rem -2rem", padding: "1rem 2rem", borderLeft: `2px solid ${color}`, fontFamily: "var(--f-display)", fontSize: "1.95rem", lineHeight: 1.2, fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 320', color: "inherit", textWrap: "balance" }}>
      {children}
    </blockquote>
  );
}

export function Figure({ children, caption, palette }) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <figure ref={ref} className="v4-figure" style={{ margin: "2.4rem -3rem", transform: on ? "translateY(0)" : "translateY(20px)", opacity: on ? 1 : 0, transition: "all 720ms var(--ease-out)" }}>
      <div style={{ background: "rgba(0,0,0,0.025)", padding: "1.4rem", border: `1px solid ${palette.line}` }}>
        {children}
      </div>
      <figcaption style={{ marginLeft: "1.4rem" }}>{caption}</figcaption>
    </figure>
  );
}


/* ===== components/v4-precise-pages.jsx ===== */

/* =======================================================================
   V4 — "Rauno-precise" sub-pages
   Writing index, Article, Work (annotated CV), Now (field journal), Contact
   Shared chrome: precision top bar · 12-col grid · index rail w/ telemetry
   ======================================================================= */

// ---------- shared chrome ----------

export function ThemeToggle({ dark, toggleTheme, palette: p }) {
  if (!toggleTheme) return null;
  return (
    <button onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={{ all: "unset", cursor: "pointer", width: 36, height: 20, borderRadius: 10, background: dark ? p.accent : p.line, position: "relative", display: "inline-block", flexShrink: 0, transition: "background 300ms var(--ease-out)", verticalAlign: "middle" }}>
      <span style={{ position: "absolute", top: 2, left: dark ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: dark ? p.paper : "#fff", transition: "left 300ms var(--ease-out)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>
        {dark ? "☀" : "☾"}
      </span>
    </button>
  );
}

export function PreciseTopBar({ palette: p, label, dark, toggleTheme }) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const isMobile = useIsMobile();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  // mobile: stack to two rows — name + label, then time. Drop "GMT" tail.
  return (
    <div style={{ borderBottom: `1px solid ${p.line}`, position: "relative", zIndex: 5, fontFamily: "var(--f-ui)", fontSize: isMobile ? 11 : 12, color: p.muted, padding: isMobile ? "0.5rem 1rem" : "0.7rem 1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: "0.04em" }}>
      <span className="mono">Shubz SHARMA</span>
      {!isMobile && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, animation: "blip 2s ease-in-out infinite" }} />
          <span className="mono" style={{ color: p.ink }}>{label}</span>
        </span>
      )}
      <span style={{ display: "inline-flex", alignItems: "center", gap: isMobile ? 8 : 14 }}>
        {!isMobile && <span className="mono">v.2026.04 · {hh}:{mm}:{ss} GMT</span>}
        <ThemeToggle dark={dark} toggleTheme={toggleTheme} palette={p} />
      </span>
      <style>{`@keyframes blip { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}

export function PreciseNav({ palette: p, current, onNavigate }) {
  const items = [["Home", "home"], ["Writing", "writing"], ["Work", "work"], ["Now", "now"], ["Contact", "contact"]];
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <nav style={{ position: "relative", zIndex: 5, padding: "0.9rem 1rem 0.6rem", maxWidth: 1280, margin: "0 auto", fontFamily: "var(--f-ui)", fontSize: 13, borderBottom: `1px dashed ${p.line}` }}>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: p.ink, marginBottom: "0.7rem" }}>
          <span style={{ width: 16, height: 16, display: "inline-block", color: p.accent }}>
            <svg viewBox="0 0 22 22"><text x="11" y="12" dominantBaseline="central" textAnchor="middle" fontFamily="Fraunces,Georgia,serif" fontSize="13" fontWeight="400" fontStyle="italic" fill="currentColor">SS</text></svg>
          </span>
          <span style={{ fontFamily: "var(--f-display)", fontSize: 15, letterSpacing: "-0.01em", fontWeight: 380 }}>Shubz Sharma</span>
        </a>
        <div style={{ display: "flex", gap: "1.4rem", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", paddingBottom: 2, marginRight: "-1rem", paddingRight: "1rem" }}>
          {items.map(([label, key], i) => (
            <a key={key} href="#" onClick={(e) => { e.preventDefault(); onNavigate(key); }}
               className="link-underline"
               style={{ color: current === key ? p.accent : p.ink, display: "inline-flex", alignItems: "baseline", gap: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
              <span className="mono" style={{ fontSize: 10, color: p.muted }}>0{i + 1}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    );
  }
  return (
    <nav style={{ position: "relative", zIndex: 5, padding: "1.2rem 1.6rem 1.4rem", maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "center", fontFamily: "var(--f-ui)", fontSize: 13, borderBottom: `1px dashed ${p.line}` }}>
      <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} style={{ gridColumn: "1 / span 3", display: "inline-flex", alignItems: "center", gap: "0.55rem", color: p.ink }}>
        <span style={{ width: 18, height: 18, display: "inline-block", color: p.accent }}>
          <svg viewBox="0 0 22 22"><text x="11" y="12" dominantBaseline="central" textAnchor="middle" fontFamily="Fraunces,Georgia,serif" fontSize="13" fontWeight="400" fontStyle="italic" fill="currentColor">SS</text></svg>
        </span>
        <span style={{ fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: "-0.01em", fontWeight: 380 }}>Shubz Sharma</span>
      </a>
      <div style={{ gridColumn: "5 / span 8", display: "flex", gap: "1.8rem", justifyContent: "flex-end" }}>
        {items.map(([label, key], i) => (
          <a key={key} href="#" onClick={(e) => { e.preventDefault(); onNavigate(key); }}
             className="link-underline"
             style={{ color: current === key ? p.accent : p.ink, display: "inline-flex", alignItems: "baseline", gap: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: p.muted }}>0{i + 1}</span>
            <span>{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export function IndexRail({ palette: p, items, currentIdx, telemetry, scrollPct }) {
  return (
    <div style={{ paddingTop: "0.4rem", fontFamily: "var(--f-ui)", fontSize: 12, color: p.muted, lineHeight: 1.7, position: "sticky", top: "1.2rem" }}>
      <div className="caps" style={{ marginBottom: 8, letterSpacing: "0.1em" }}>Index</div>
      {items.map((it, i) => (
        <div key={i} style={{ color: i === currentIdx ? p.ink : p.muted }}>
          <span className="mono">0{i + 1}</span>&nbsp;&nbsp;{it}
        </div>
      ))}
      <div style={{ marginTop: 28, borderTop: `1px solid ${p.line}`, paddingTop: 14, fontSize: 11 }}>
        <div className="caps" style={{ color: p.muted, marginBottom: 8, letterSpacing: "0.1em" }}>Telemetry</div>
        <div className="mono" style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 4, color: p.ink }}>
          {telemetry.map(([k, v], i) => (
            <React.Fragment key={i}>
              <span style={{ color: p.muted }}>{k}</span><span>{v}</span>
            </React.Fragment>
          ))}
          <span style={{ color: p.muted }}>scroll</span><span>{String(scrollPct).padStart(3, "0")}%</span>
        </div>
      </div>
    </div>
  );
}

export function PreciseFooter({ palette: p, line = "Made in London." }) {
  return (
    <footer className="v4-grid" style={{ maxWidth: 1280, margin: "3rem auto 0", padding: "2rem 1.6rem 2.4rem", borderTop: `1px solid ${p.line}`, color: p.muted, fontFamily: "var(--f-ui)", fontSize: 12, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", letterSpacing: "0.02em" }}>
      <span style={{ gridColumn: "1 / span 6", fontStyle: "italic", fontFamily: "var(--f-body)", fontSize: 14, color: p.ink }}>{line}</span>
      <span className="mono" style={{ gridColumn: "7 / span 3", textAlign: "center" }}>
        <a href="/rss.xml" style={{ color: p.muted, textDecoration: "none" }} className="link-underline">RSS ↗</a>
      </span>
      <span className="mono" style={{ gridColumn: "10 / span 3", textAlign: "right" }}>© 2026 · last edit 2026.05.02</span>
    </footer>
  );
}

function usePreciseScroll() {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const onS = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", onS, { passive: true });
    onS();
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return pct;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(() => typeof window !== "undefined" && window.innerWidth <= breakpoint);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [breakpoint]);
  return isMobile;
}

function useIsTouch() {
  const [isTouch, setIsTouch] = React.useState(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(hover: none)");
    const onChange = (e) => setIsTouch(e.matches);
    setIsTouch(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return isTouch;
}

function useViewportSize() {
  const [size, setSize] = React.useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof window !== "undefined" ? window.innerHeight : 0,
  }));
  React.useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function useCursorCoords() {
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 100) return; // 10Hz
      last = now;
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return coords;
}

function useTelemetry() {
  // returns the [label, value] tuple to slot into IndexRail telemetry.
  // desktop → live cursor coords; touch → live viewport WxH (always fresh, no fake 0,0).
  const isTouch = useIsTouch();
  const coords = useCursorCoords();
  const viewport = useViewportSize();
  if (isTouch) {
    return ["viewport", `${String(viewport.w).padStart(4, "0")}×${String(viewport.h).padStart(4, "0")}`];
  }
  return ["cursor", `${String(coords.x).padStart(4, "0")}, ${String(coords.y).padStart(4, "0")}`];
}

function cursorTelemetry({ x, y }) {
  return ["cursor", `${String(x).padStart(4, "0")}, ${String(y).padStart(4, "0")}`];
}

// ---------- WRITING INDEX (V4) ----------

export function WritingIndexV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  // earlier writing — real academic publications & posters
  const notes = [
    ["AI Safety Fundamentals", "2023-05", "Essay"],
    ["GNSS Water-Vapour estimation via ML (BSc honours thesis, FLAME)", "2023-05", "thesis note"],
    ["Explainable AI: Decoding protein sequences (research note)", "2023-04", "note"],
    ["Techniques to derive cloud information", "2022-01", "note"],
  ];

  // tag chips
  const tags = ["all", "optimization", "biology", "ml", "geospatial", "nlp"];
  const [activeTag, setActiveTag] = React.useState("all");

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />

      <PreciseTopBar palette={p} label="~/writing" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="writing" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>

          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Lede + count", "Featured", "All essays", "Earlier notes", "Subscribe"]}
              telemetry={[telemetryRow, ["page", "writing"], ["essays", String(POSTS.length).padStart(2, "0")], ["notes", "06"]]}
              scrollPct={scrollPct} />
          </div>

          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontFamily: "var(--f-ui)", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§02</span>
              The Garden · essays, notes, half-formed ideas
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>An essay garden,</LetterReveal>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={520}>growing </LetterReveal>
                <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={920}>slowly.</LetterReveal></span>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              Thinking about my projects, findings, interesting questions, machine learning, and the small obsessions in between. Some pieces are finished; some are still arguing with themselves.
            </p>
          </div>

          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <div className="mono" style={{ fontSize: 11, color: p.muted, lineHeight: 1.8 }}>
              <div style={{ color: p.ink }}>fig.01 — topics</div>
              {tags.filter(t => t !== "all").map(t => (
                <div key={t} style={{ cursor: "pointer", color: activeTag === t ? p.accent : p.muted }} onClick={() => setActiveTag(t)}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* tag bar */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "baseline" }}>
          <span className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Filter</span>
          <div style={{ gridColumn: "3 / span 9", display: "flex", gap: 6, flexWrap: "wrap", fontFamily: "var(--f-ui)", fontSize: 12 }}>
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                style={{ all: "unset", cursor: "pointer", padding: "4px 10px", border: `1px solid ${activeTag === t ? p.ink : p.line}`, color: activeTag === t ? p.ink : p.muted, background: activeTag === t ? `color-mix(in oklch, ${p.paper} 70%, white)` : "transparent", letterSpacing: "0.04em" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* featured */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2.4rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
            Featured
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>currently · {POSTS[0].slug}</span>
        </div>
        <FeaturedPrecise post={POSTS[0]} palette={p} onNavigate={onNavigate} />
      </section>

      {/* full list */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2.4rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>04</span>
            All essays
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>{POSTS.length} entries</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            {POSTS.map((post, i) => <PreciseEssayRow key={post.slug} post={post} palette={p} onNavigate={onNavigate} index={i} total={POSTS.length} />)}
          </div>
        </div>
      </section>

      {/* earlier notes */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2.4rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>05</span>
            Working notes
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>private until linked</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {notes.map(([t, d, k], i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="v4-stack-row"
                  style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 80px", gap: "1.2rem", alignItems: "baseline", padding: "0.8rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="link-underline" style={{ fontFamily: "var(--f-body)", fontSize: "1rem" }}>{t}</span>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{d}</span>
                  <span className="mono caps" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em", textAlign: "right" }}>{k}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* subscribe */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Subscribe</div>
          <div style={{ gridColumn: "3 / span 6" }}>
            <div className="display" style={{ fontSize: "1.4rem", fontWeight: 380, lineHeight: 1.3, color: p.ink }}>
              An <em style={{ color: p.accent }}>occasional</em> letter — about one essay per month, no extra noise.
            </div>
            <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: "1.2rem", display: "flex", gap: 0, maxWidth: 460, borderBottom: `1px solid ${p.ink}` }}>
              <input type="email" placeholder="you@somewhere.com" style={{ flex: 1, padding: "0.6rem 0", border: "none", outline: "none", background: "transparent", fontFamily: "var(--f-body)", fontSize: "1rem", color: p.ink }} />
              <button type="submit" className="mono" style={{ all: "unset", cursor: "pointer", padding: "0.6rem 0.4rem", color: p.accent, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Subscribe →</button>
            </form>
            <div style={{ marginTop: "0.8rem", fontFamily: "var(--f-ui)", fontSize: 12, color: p.muted }}>
              Or follow via <a href="/rss.xml" className="link-underline mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.08em" }}>RSS ↗</a> — works with Substack imports, Feedly, NetNewsWire, etc.
            </div>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Writing is my preferred mode of yapping." />
    </div>
  );
}

export function FeaturedPrecise({ post, palette: p, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" className="v4-grid" onClick={(e) => { e.preventDefault(); onNavigate("essay", post.slug); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", padding: "1.6rem 0", borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}`, color: p.ink, alignItems: "start" }}>
      <span className="mono" style={{ gridColumn: "1 / span 2", color: p.muted, fontSize: 11 }}>fig.{String(1).padStart(2, "0")}<br/>featured</span>
      <div style={{ gridColumn: "3 / span 6" }}>
        <div className="caps mono" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em", marginBottom: 12 }}>{post.kicker}</div>
        <h3 className="display" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", margin: 0, fontWeight: 360, lineHeight: 1, color: hover ? p.accent : p.ink, transition: "color 320ms var(--ease-out)" }}>
          {post.title}
          <span style={{ display: "inline-block", marginLeft: 14, transform: hover ? "translateX(10px)" : "translateX(0)", transition: "transform 380ms var(--ease-spring)", color: p.accent, fontSize: "0.6em", verticalAlign: "0.1em" }}>↗</span>
        </h3>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: p.muted, margin: "1rem 0 0", maxWidth: "52ch" }}>{post.dek}</p>
        <div className="mono" style={{ marginTop: 18, fontSize: 11, color: p.muted, display: "flex", gap: 18 }}>
          <span>read · {post.minutes} min</span>
          <span>est. {Math.round(post.minutes * 240)} words</span>
          <span>last revised · 2026.04</span>
        </div>
      </div>
      <div style={{ gridColumn: "10 / span 3", border: `1px solid ${p.line}`, padding: "0.8rem", aspectRatio: "1 / 1", display: "grid", placeItems: "center", background: `color-mix(in oklch, ${p.paper} 85%, white)` }}>
        <FourierMotif shape={post.illustration === "skate" ? "skate" : (post.illustration === "protocol" ? "wave" : "hex")} size={180} density={hover ? 30 : 18} strokeColor={p.accent} trailColor={`color-mix(in oklch, ${p.accent} 50%, transparent)`} epicycleColor={`color-mix(in oklch, ${p.ink} 8%, transparent)`} />
      </div>
    </a>
  );
}

export function PreciseEssayRow({ post, palette: p, onNavigate, index, total }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("essay", post.slug); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="v4-stack-row"
       style={{ display: "grid", gridTemplateColumns: "60px 1fr 200px 60px", gap: "1.4rem", alignItems: "baseline", padding: "1.4rem 0", borderTop: `1px solid ${p.line}`, color: p.ink, position: "relative" }}>
      <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      <div>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 6 }}>{post.kicker}</div>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "baseline" }}>
          <h3 className="display" style={{ fontSize: "1.55rem", margin: 0, fontWeight: 380, color: hover ? p.accent : p.ink, transition: "color 240ms var(--ease-out)" }}>{post.title}</h3>
          <span style={{ display: "inline-block", transform: hover ? "translateX(8px)" : "translateX(0)", transition: "transform 380ms var(--ease-spring)", color: p.accent, fontFamily: "var(--f-ui)" }}>↗</span>
        </div>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.55, color: p.muted, margin: "0.5rem 0 0", maxWidth: "62ch" }}>{post.dek}</p>
      </div>
      <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>2026.04</span>
      <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{post.minutes}m</span>
    </a>
  );
}

// ---------- ARTICLE (V4) ----------

// ---- custom SVG diagrams (one per topic, sometimes two) ----

// JayaSwarm extracted to src/components/diagrams/JayaSwarm.tsx

// FeatureSelectionViz extracted to src/components/diagrams/FeatureSelectionViz.tsx

// ThresholdMethods extracted to src/components/diagrams/ThresholdMethods.tsx

// CtlaDistribution extracted to src/components/diagrams/CtlaDistribution.tsx

// GateSensitivity extracted to src/components/diagrams/GateSensitivity.tsx

// ViolationNetwork extracted to src/components/diagrams/ViolationNetwork.tsx

// ConstraintEffect extracted to src/components/diagrams/ConstraintEffect.tsx

// MethodRanking extracted to src/components/diagrams/MethodRanking.tsx

// RecEngineSwarm extracted to src/components/diagrams/RecEngineSwarm.tsx

// EnsembleConsensus extracted to src/components/diagrams/EnsembleConsensus.tsx

// TrendSignalFlow extracted to src/components/diagrams/TrendSignalFlow.tsx

// LMSRPriceCurve extracted to src/components/diagrams/LMSRPriceCurve.tsx

// JayaEssay extracted to src/components/essays/JayaEssay.tsx

// ThresholdEssay extracted to src/components/essays/ThresholdEssay.tsx

// ConstraintClusterEssay extracted to src/components/essays/ConstraintClusterEssay.tsx

// SixEnginesEssay extracted to src/components/essays/SixEnginesEssay.tsx

// FashionEssay extracted to src/components/essays/FashionEssay.tsx

// MayEssay extracted to src/components/essays/MayEssay.tsx

// DraftEssay extracted to src/components/essays/DraftEssay.tsx

function essayMeta(slug) {
  const meta = {
    "jaya": {
      tags: "optimisation, feature selection, bioinformatics",
      toc: ["Header", "Lede", "JAYA, briefly", "Two modifications", "Three protein datasets", "What improved means"],
      sources: [
        ['[1] Rao, R. V. (2016). ', '"Jaya: A simple and new optimization algorithm." Int. J. Industrial Engineering Computations.'],
        ['[2] Gandhi, N., Sharma, S., Rawat, O., Bhosale, H., Sane, A., & Jayaraman, V. K. (2022). ', '"Improved Jaya algorithm for identification of protein functions." Poster PP-28, INBIX\'22, VFSTR.'],
        ['[3] ', "github.com/Shubzthub/inbix22"],
      ],
      sidenotes: 4,
    },
    "threshold-gate": {
      tags: "computational biology, thresholding",
      toc: ["Header", "Lede", "Six markers, one panel", "Four ways to draw a line", "The marker that broke everything", "What 0.11 units hides"],
      sources: [
        ['[1] Otsu, N. (1979). ', '"A threshold selection method from gray-level histograms." IEEE Trans. Systems, Man, and Cybernetics.'],
        ['[2] Sharma, S. (2024). ', "Analysing and Advancing Automated Immune Biomarker Detection. MFoCS thesis, Oxford · Lady Margaret Hall."],
        ['[3] Wilson, C. M., et al. (2021). ', '"Challenges and opportunities in the statistical analysis of multiplex immunofluorescence data." Cancers 13(12).'],
      ],
      sidenotes: 4,
    },
    "constraint-clustering": {
      tags: "computational biology, clustering",
      toc: ["Header", "Lede", "Why not just threshold?", "What the textbook misses", "Teaching the distance metric", "The honest result"],
      sources: [
        ['[1] Ng, A., Jordan, M., & Weiss, Y. (2001). ', '"On spectral clustering: Analysis and an algorithm." NIPS 14.'],
        ['[2] Ward, J. H. (1963). ', '"Hierarchical grouping to optimize an objective function." J. American Statistical Association.'],
        ['[3] Sharma, S. (2024). ', "Analysing and Advancing Automated Immune Biomarker Detection. MFoCS thesis, Oxford · Lady Margaret Hall."],
        ['[4] Wagstaff, K. L. (2011). ', '"Constrained clustering." Encyclopedia of Machine Learning, Springer.'],
      ],
      sidenotes: 5,
    },
    "merger-themes": {
      tags: "nlp, m&a",
      toc: ["Header", "Draft in progress"],
      sources: [],
      sidenotes: 0,
    },
    "may-2026": {
      tags: "mathematical ecology, ODE, predator–prey",
      toc: ["Header", "Lede", "What the sliders teach", "For Robert May"],
      sources: [
        ['[1] Lotka, A. J. (1925). ', '"Elements of Physical Biology." Williams & Wilkins.'],
        ['[2] Volterra, V. (1926). ', '"Variazioni e fluttuazioni del numero d\'individui in specie animali conviventi." Mem. R. Acc. Lincei.'],
        ['[3] May, R. M. (1976). ', '"Simple mathematical models with very complicated dynamics." Nature 261.'],
      ],
      sidenotes: 4,
    },
    "six-engines": {
      tags: "recommendation, music",
      toc: ["Header", "Lede", "Six engines, one query", "The dataset that made it tractable", "Why the ensemble works", "What the demo actually feels like"],
      sources: [
        ['[1] Mikolov, T., et al. (2013). ', "Efficient estimation of word representations in vector space."],
        ['[2] Grover, A., & Leskovec, J. (2016). ', "node2vec: Scalable feature learning for networks. KDD."],
        ['[3] He, X., et al. (2017). ', "Neural Collaborative Filtering. WWW."],
        ['[4] ', "shubz-taylor-recommendation-engine.vercel.app · Taylor's full discography + editorial bridges."],
      ],
      sidenotes: 3,
    },
    "fashion-trends": {
      tags: "forecasting, computer vision, LMSR",
      toc: ["Header", "Lede", "Five signals, one composite", "The Trend Exchange", "What the camera sees", "What I'm optimising for"],
      sources: [
        ['[1] Hanson, R. (2003). ', '"Combinatorial Information Market Design." Information Systems Frontiers.'],
        ['[2] ', "fashion-web-psi.vercel.app — live platform, Next.js / Vercel edge / LMSR exchange."],
        ['[3] ', "Google Trends (trendspyg), Bluesky firehose, Pinterest, Reddit, YouTube — five-source ingestion pipeline."],
        ['[4] ', "Gemini 2.5 Flash — garment detection, colour palette extraction, runway matching."],
      ],
      sidenotes: 3,
    },
  };
  return meta[slug] || meta["jaya"];
}

export function ArticleV4({ slug, palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, [slug]);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();
  const post = POSTS.find(x => x.slug === slug) || POSTS[0];

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.18 }} />
      <ReadingRuler color={p.accent} />
      <PreciseTopBar palette={p} label={`~/writing/${slug}`} dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="writing" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      {/* metadata strip — compact 2 rows on mobile, full 12-col on desktop */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "1rem 1rem 0" : "1.4rem 1.6rem 0", position: "relative", zIndex: 2, fontFamily: "var(--f-ui)", fontSize: 12 }}>
        {isMobile ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", color: p.muted, paddingBottom: "0.6rem", borderBottom: `1px dashed ${p.line}`, gap: "0.6rem" }}>
            <span className="mono" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>essay · {post.minutes} min · ~{Math.round(post.minutes * 240)} words</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} className="link-underline" style={{ color: p.accent, whiteSpace: "nowrap" }}>↤ index</a>
          </div>
        ) : (
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", color: p.muted, paddingBottom: "0.8rem", borderBottom: `1px dashed ${p.line}` }}>
          <span style={{ gridColumn: "1 / span 2" }} className="mono">essay · 01 of 03</span>
          <span style={{ gridColumn: "3 / span 3" }}>{post.kicker}</span>
          <span style={{ gridColumn: "6 / span 2" }}>April 2026</span>
          <span style={{ gridColumn: "8 / span 2" }} className="mono">~{Math.round(post.minutes * 240)} words · {post.minutes} min</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} style={{ gridColumn: "10 / span 3", textAlign: "right", color: p.accent }} className="link-underline">↤ back to index</a>
        </div>
        )}
      </section>

      {/* HEADER — 12-col, asymmetric */}
      <header style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "end" }}>
          <div style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, lineHeight: 1.7 }}>
            <div className="caps mono" style={{ marginBottom: 8 }}>fig.01</div>
            <div>title</div>
            <div style={{ color: p.ink }}>{post.title.toLowerCase()}</div>
            <div style={{ marginTop: 12 }}>kind</div>
            <div style={{ color: p.ink }}>standalone essay</div>
            <div style={{ marginTop: 12 }}>tags</div>
            <div style={{ color: p.ink }}>{essayMeta(post.slug).tags}</div>
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <h1 className="display" style={{ fontSize: "clamp(4rem, 9vw, 8rem)", margin: 0, fontWeight: 360, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
              <LetterReveal stagger={32}>{post.title}</LetterReveal>
            </h1>
            <p style={{ fontSize: "1.35rem", lineHeight: 1.5, marginTop: "1.6rem", maxWidth: "44ch", color: p.muted, fontStyle: "italic", fontFamily: "var(--f-display)", fontWeight: 360 }}>
              {post.dek}
            </p>
          </div>
          <div style={{ gridColumn: "10 / span 3", paddingBottom: "0.6rem" }}>
            <div style={{ border: `1px solid ${p.line}`, padding: "0.8rem", aspectRatio: "1 / 1", display: "grid", placeItems: "center", background: `color-mix(in oklch, ${p.paper} 85%, white)` }}>
              <FourierMotif shape={post.illustration === "wave" ? "wave" : "hex"} size={200} density={26} strokeColor={p.accent} trailColor={`color-mix(in oklch, ${p.accent} 50%, transparent)`} epicycleColor={`color-mix(in oklch, ${p.ink} 8%, transparent)`} />
            </div>
            <div className="mono" style={{ marginTop: 10, color: p.muted, fontSize: 10, display: "flex", justifyContent: "space-between" }}>
              <span>fig.02 — fourier({post.illustration || "hex"})</span>
              <span>26 epi.</span>
            </div>
          </div>
        </div>
      </header>

      {/* author strip */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "1.4rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}`, fontFamily: "var(--f-ui)", fontSize: 13, color: p.muted, alignItems: "baseline" }}>
          <span style={{ gridColumn: "1 / span 2" }} className="caps mono">By</span>
          <span style={{ gridColumn: "3 / span 5", color: p.ink }}>Shubz Sharma · founding-eng @ Orion · London</span>
          <span style={{ gridColumn: "8 / span 2" }} className="mono">first published · 2026.04.18</span>
          <span style={{ gridColumn: "10 / span 3", textAlign: "right" }} className="mono">last revised · 2026.04.25</span>
        </div>
      </section>

      {/* BODY — proper 12-col, body in 7, telemetry in left rail */}
      <article className="prose" style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 4rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>

          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={1}
              items={essayMeta(post.slug).toc}
              telemetry={[telemetryRow, ["essay", `${String(POSTS.findIndex(x => x.slug === post.slug) + 1).padStart(2, "0")}/${String(POSTS.length).padStart(2, "0")}`], ["read", `${post.minutes} min`], ["sidenotes", String(essayMeta(post.slug).sidenotes).padStart(2, "0")]]}
              scrollPct={scrollPct} />
          </div>

          <div style={{ gridColumn: "3 / span 7" }}>
            {(() => {
              switch (post.slug) {
                case "jaya": return <JayaEssay palette={p} />;
                case "threshold-gate": return <ThresholdEssay palette={p} />;
                case "constraint-clustering": return <ConstraintClusterEssay palette={p} />;
                case "six-engines": return <SixEnginesEssay palette={p} />;
                case "fashion-trends": return <FashionEssay palette={p} />;
                case "may-2026": return <MayEssay palette={p} />;
                default: return <DraftEssay post={post} palette={p} onNavigate={onNavigate} />;
              }
            })()}
          </div>

          {/* right rail on desktop · "Endnotes" block at the bottom on mobile */}
          <aside style={{ gridColumn: isMobile ? "1 / -1" : "11 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, lineHeight: 1.7, position: isMobile ? "static" : "sticky", top: "1.2rem", marginTop: isMobile ? "2.4rem" : 0, paddingTop: isMobile ? "1.6rem" : 0, borderTop: isMobile ? `1px solid ${p.line}` : "none" }}>
            {isMobile && (
              <div className="caps" style={{ color: p.muted, marginBottom: 18, letterSpacing: "0.14em", fontSize: 11 }}>Endnotes</div>
            )}
            <div className="caps mono" style={{ marginBottom: 8, letterSpacing: "0.12em" }}>Cite as</div>
            <div className="mono" style={{ color: p.ink, fontSize: isMobile ? 11 : 10, lineHeight: 1.6 }}>
              Sharma, S. (2026).<br/>
              <em>{post.title}</em>.<br/>
              shubzsharma.com/{post.slug}
            </div>
            {essayMeta(post.slug).sources.length > 0 && (
              <>
                <div className="caps mono" style={{ marginTop: 22, marginBottom: 8, letterSpacing: "0.12em" }}>Sources</div>
                <div className="mono" style={{ color: p.ink, fontSize: isMobile ? 11 : 10, lineHeight: 1.6 }}>
                  {essayMeta(post.slug).sources.map(([prefix, body], i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      <span>{prefix}</span><em>{body}</em>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="caps mono" style={{ marginTop: 22, marginBottom: 8, letterSpacing: "0.12em" }}>Share</div>
            <div className="mono" style={{ fontSize: isMobile ? 11 : 10, display: "flex", flexDirection: isMobile ? "row" : "column", gap: isMobile ? "1rem" : 0 }}>
              <a href="#" className="link-underline" style={{ color: p.accent }}>copy permalink</a>
              {!isMobile && <br/>}
              <a href="#" className="link-underline" style={{ color: p.accent }}>email this</a>
            </div>
          </aside>
        </div>
      </article>

      {/* read next */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.6rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Read next</div>
          <div style={{ gridColumn: "3 / span 9" }}>
            {POSTS.filter(x => x.slug !== slug).map((other, i) => (
              <PreciseEssayRow key={other.slug} post={other} palette={p} onNavigate={onNavigate} index={i} total={POSTS.length - 1} />
            ))}
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Diagrams are usually interactive. Opinions, if you ask nicely." />
    </div>
  );
}

// ---------- WORK — annotated CV ----------

export function WorkV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  const events = [
    { year: "2026 —", what: "Elected MInstP, Member of the Institute of Physics", where: "London · Feb 2026", note: "Professional body for physics in the UK and Ireland. Elected route." },
    { year: "2025 —", what: "Founding engineer, Orion", where: "London", note: "Geospatial intelligence over H3 indexing. Built the data infrastructure for high-volume, multi-source intelligence streams; ML pipelines for anomaly detection and intelligent filtering; backend services in Python and Golang. Previously: Data & ML Engineer (Nov 2024 – Aug 2025); Data Engineer, part-time (Apr 2024 – Nov 2024)." },
    { year: "2025", what: "Best Paper Award · IEEE ICCUBEA-2025", where: "co-author · Aug 2025", note: "\"Decoding Flipkart-Walmart Merger: An Empirical Analysis of News using Theme Extraction, Sentiment Mining, for Indian M&A Insights.\" 1240 submissions, 220 selected, one Best Paper." },
    { year: "2024", what: "MFoCS · Mathematical Foundations of Computer Science", where: "Oxford · Lady Margaret Hall", note: "Thesis: \"Analysing and Advancing Automated Immune Biomarker Detection.\" Modules included Geometric Deep Learning, Computational Game Theory, Quantum Information." },
    { year: "2023", what: "ML Engineering Intern, Natter", where: "London", note: "Built models for bullying, mental-distress, and spam detection on social text. A user-matching recommender on top." },
    { year: "2023", what: "BSc (Hons) Computer Science", where: "FLAME University", note: "CGPA 8.53/10. Dean's Roll of Honour: Rank 41 → Rank 24 → Rank 3 across years." },
    { year: "2022", what: "Research intern · JAYA algorithm + protein function ID", where: "Prof. Jayaraman Valadi", note: "Improved the JAYA optimizer with a fitness trade-off and elitism for feature selection on protein identification datasets. Poster PP-28 at INBIX'22 (VFSTR)." },
    { year: "2021", what: "Data Analyst & Researcher, Centre for Knowledge Alternatives", where: "Pune", note: "Cultural mapping of Kolhapur district for the Discover India Project. Tableau, government datasets, sector reports." },
    { year: "2020", what: "Co-founder, UnisphereCo", where: "Hyderabad", note: "Online platform for the undergraduate-application process — mentors from 50+ universities, 200+ attendees per session." },
    { year: "2019", what: "Founder, PrintedCraft", where: "Bangalore", note: "Personalised printing — built a python connector to a cloud product DB for real-time promotions." },
  ];

  const builds = [
    { name: "Orion intelligence platform", scope: "founding-eng", role: "data infra, ML pipelines, backend services in Python + Golang", year: "2025 —" },
    { name: "fashion-web — ML trend intelligence + LMSR exchange", scope: "deployed · solo", role: "Next.js / TS / Vercel edge / Neon Postgres — five-source ingestion (Google Trends, Bluesky firehose, Pinterest, Reddit, YouTube), Holt smoothing forecasts, LMSR prediction market (b=100) with StyleCoins, Gemini 2.5 Flash CV for garment detection + runway matching, Brier-scored house predictions, hundreds of tracked terms", year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
    { name: "platypus-learn — AI learning platform", scope: "deployed · solo", role: "Next.js / Supabase / Resend — ingests PDFs and YouTube, generates courses with Claude, weekly goals dashboard", year: "2025 —", url: "https://platypus-learn.vercel.app" },
    { name: "shubz-taylor-rec-engine", scope: "open", role: "six engines (Sentence-BERT lyrics, audio VAE 384→16D, graph node2vec 64D, neural collab filtering, contrastive SSL, weighted ensemble) on Taylor's full discography + editorial bridges · Next.js 14 + FastAPI · TS rebuild of the R/Shiny original", year: "2026", url: "https://shubz-taylor-recommendation-engine.vercel.app" },
    { name: "inbix22 — improved JAYA", scope: "open", role: "feature-selection variants for protein function ID; fitness trade-off + elitism", year: "2022", url: "https://github.com/Shubzthub/inbix22" },
    { name: "MFoCS thesis: immune biomarkers", scope: "academic", role: "consensus clustering (Birch + Agglomerative + Spectral) on 6-marker flow cytometry · CTLA4 surface-marker recovery at F1 = 0.70", year: "2024" },
    { name: "Flipkart-Walmart merger NLP", scope: "academic", role: "theme extraction + sentiment mining — SpaCy, NLTK, Gensim, TextBlob", year: "2024" },
    { name: "GNSS water-vapour ML", scope: "honours thesis", role: "regression models vs traditional linear baselines", year: "2023" },
    { name: "Nand2Tetris — 16-bit computer from gates up", scope: "coursework", role: "all 13 projects: HDL, assembly, VM, compiler, OS", year: "2022" },
    { name: "IoT Weather Bot", scope: "side", role: "C++ on a microcontroller, ThingSpeak, web dashboard", year: "2021" },
    { name: "Cipher program", scope: "side", role: "Python + NumPy five-layer encryptor with key schedule", year: "2021" },
    { name: "this site", scope: "open", role: "single-file HTML / CSS / inline React", year: "2026", url: "https://github.com/Shubzthub/personal-site" },
  ];

  const speaking = [
    { event: "Indian Conference on Bioinformatics", talk: "Improved JAYA algorithm for protein function ID (poster)", year: "2022" },
    { event: "IEEE ICCUBEA-2025", talk: "Decoding Flipkart-Walmart Merger (Best Paper, co-author)", year: "2025" },
    { event: "InnovateHer", talk: "STEM Ambassador — running sessions for under-represented students in tech", year: "2025 —" },
    { event: "\"I'm a... Programme\"", talk: "Science communicator, CS & Mathematics", year: "2025 —" },
  ];

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      <PreciseTopBar palette={p} label="~/work" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="work" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Trajectory", "Selected work", "Speaking", "Tooling", "Get in touch"]}
              telemetry={[telemetryRow, ["page", "work"], ["entries", String(events.length).padStart(2, "0")], ["builds", String(builds.length).padStart(2, "0")]]}
              scrollPct={scrollPct} />
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§03</span>
              Work · CV · annotated, in chronological reverse
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>Things I've </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={520}>built </LetterReveal></span>
              <LetterReveal stagger={26} delay={820}>and almost</LetterReveal>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={1120}>finished.</LetterReveal>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              The CV with marginalia. Each entry has a footnote — what I actually did, what I would change, what I learned. Available in <a href="uploads/Shubz-Sharma-Resume-20260211.pdf" target="_blank" className="link-underline" style={{ color: p.accent }}>PDF</a> for the more conventional version.
            </p>
          </div>
          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <div className="mono" style={{ fontSize: 11, color: p.muted, lineHeight: 1.8 }}>
              <div style={{ color: p.ink }}>fig.01 — record</div>
              <div>entries&nbsp;&nbsp;&nbsp;{events.length}</div>
              <div>span&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 — now</div>
              <div>updated&nbsp;{new Date().toISOString().slice(0, 10)}</div>
              <div style={{ marginTop: 12 }}>
                <a href="uploads/Shubz-Sharma-Resume-20260211.pdf" target="_blank" className="link-underline" style={{ color: p.accent }}>cv.pdf ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* trajectory */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>02</span>
            Trajectory
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>2019 — present</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {events.map((e, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "100px 1fr 200px", gap: isMobile ? "0.3rem" : "1.6rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline" }}>
                  <div style={{ display: isMobile ? "flex" : "contents", justifyContent: "space-between", alignItems: "baseline", gap: "0.8rem" }}>
                    <span className="mono" style={{ color: p.accent, fontSize: 12 }}>{e.year}</span>
                    {isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{e.where}</span>}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--f-body)", fontSize: "1.05rem", color: p.ink }}>{e.what}</div>
                    {e.note && <div style={{ fontSize: "0.92rem", color: p.muted, marginTop: 4, fontStyle: "italic", maxWidth: "60ch" }}>{e.note}</div>}
                  </div>
                  {!isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{e.where}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* selected work */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
            Selected work
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>open · internal · founding</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {builds.map((b, i) => isMobile ? (
                <a key={i}
                   href={b.url || "#"}
                   target={b.url ? "_blank" : undefined}
                   rel={b.url ? "noreferrer" : undefined}
                   onClick={(e) => { if (!b.url) e.preventDefault(); }}
                   style={{ display: "block", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="mono caps" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em" }}>{b.scope}</span>
                  </div>
                  <div className={b.url ? "link-underline" : ""} style={{ fontFamily: "var(--f-body)", fontSize: "1.05rem" }}>
                    {b.name}
                    {b.url && <span style={{ color: p.accent, marginLeft: 8, fontSize: "0.85em" }}>↗</span>}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: p.muted, marginTop: 4 }}>{b.role}</div>
                  <div className="mono" style={{ color: p.muted, fontSize: 11, marginTop: 6 }}>{b.year}</div>
                </a>
              ) : (
                <a key={i}
                   href={b.url || "#"}
                   target={b.url ? "_blank" : undefined}
                   rel={b.url ? "noreferrer" : undefined}
                   onClick={(e) => { if (!b.url) e.preventDefault(); }}
                   style={{ display: "grid", gridTemplateColumns: "60px 1fr 160px 80px", gap: "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline", color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className={b.url ? "link-underline" : ""} style={{ fontFamily: "var(--f-body)", fontSize: "1.05rem" }}>
                      {b.name}
                      {b.url && <span style={{ color: p.accent, marginLeft: 8, fontSize: "0.85em" }}>↗</span>}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: p.muted, marginTop: 4 }}>{b.role}</div>
                  </div>
                  <span className="mono caps" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em" }}>{b.scope}</span>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{b.year}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* speaking */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>04</span>
            Speaking
          </h2>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {speaking.map((s, i) => (
                <div key={i} className="v4-stack-row" style={{ display: "grid", gridTemplateColumns: "200px 1fr 80px", gap: "1.4rem", padding: "0.9rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline", color: p.ink, fontFamily: "var(--f-body)", fontSize: "1rem" }}>
                  <span className="mono caps" style={{ color: p.muted, fontSize: 11, letterSpacing: "0.08em" }}>{s.event}</span>
                  <span style={{ fontStyle: "italic" }}>{s.talk}</span>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{s.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* contact CTA */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Get in touch</div>
          <div style={{ gridColumn: "3 / span 6" }}>
            <div className="display" style={{ fontSize: "1.6rem", fontWeight: 380, lineHeight: 1.3, color: p.ink }}>
              Open to <em style={{ color: p.accent }}>collaboration</em> on geospatial ML, AI safety, computational biology, STEM education outreach, or anything that crosses these.
            </div>
            <div style={{ marginTop: 18 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} className="link-underline" style={{ color: p.accent, fontFamily: "var(--f-ui)", fontSize: 14 }}>get in touch →</a>
            </div>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Always a work in progress." />
    </div>
  );
}

// ---------- NOW — field journal ----------

export function NowV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  const focuses = [
    { kind: "Building", what: "Orion's geospatial intelligence platform — intelligent real-time risk analysis." },
    { kind: "Shipping", what: "fashion-web — predicting fashion trends, complete with a LMSR exchange with StyleCoins. Live at fashion-web-psi.vercel.app." },
    { kind: "Writing",  what: "Drafting the next essay. Collecting my old work." },
    { kind: "Re-building", what: "shubz-taylor-rec-engine — six recommendation engines for one songbook. From a UG course; I keep finding new things to try." },
    { kind: "Reading",  what: "AI safety fundamentals for Bluedot's AGI Strategy cohort, ZX-Calculus (again), and Claude hacks." },
  ];

  const journal = [
    { date: "2026-04", note: "fashion-web's data pipeline finally feels complete — Reddit, Bluesky, YouTube, editorial, all flowing into one composite trend score with Holt-Winters on top. Now I can stop building and start watching what it predicts." },
    { date: "2026-02", note: "Elected MInstP. The certificate is small and unreasonably satisfying." },
    { date: "2025-12", note: "Started a second pass at the Taylor Swift recommender — TypeScript this time, six engines, all of them slightly wrong in interesting ways." },
    { date: "2025-08", note: "\"Decoding Flipkart-Walmart Merger\" picks up the Best Paper Award at IEEE ICCUBEA-2025. Co-authored with Prof. Chakraborty; four years from data scrape to award." },
    { date: "2025-08", note: "Promoted to Founding Engineer at Orion. The job description got shorter and the work got broader." },
  ];

  // weather/london mock telemetry
  const localTime = new Date();
  const tempC = 11 + Math.round((Math.sin(localTime.getDate() / 5)) * 2);
  const rainPct = 30 + Math.round(Math.cos(localTime.getDate() / 3) * 20);

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      <PreciseTopBar palette={p} label="~/now" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="now" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Right now", "Field journal", "Conditions"]}
              telemetry={[telemetryRow, ["page", "now"], ["entries", String(journal.length).padStart(2, "0")], ["focuses", String(focuses.length).padStart(2, "0")]]}
              scrollPct={scrollPct} />
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§04</span>
              Now · field journal · updated weekly-ish
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>What I'm </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={420}>actually</LetterReveal></span>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={760}>doing this week.</LetterReveal>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              What I'm doing <a className="link-underline" style={{ color: p.accent }} href="https://nownownow.com/about" target="_blank" rel="noreferrer">/now</a>. What's on my plate, what I'm reading, where my attention is going.
            </p>
          </div>
          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <div className="mono" style={{ fontSize: 11, color: p.muted, lineHeight: 1.8 }}>
              <div style={{ color: p.ink }}>fig.01 — london</div>
              <div>lat&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;51.51°N</div>
              <div>lon&nbsp;&nbsp;&nbsp;&nbsp;-0.13°W</div>
              <div>temp&nbsp;&nbsp;&nbsp;{tempC}°C</div>
              <div>rain&nbsp;&nbsp;&nbsp;{rainPct}%</div>
              <div>updated&nbsp;{new Date().toISOString().slice(0, 10)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* right now */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>02</span>
            Right now
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>five concurrent threads</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {focuses.map((f, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "120px 1fr 60px", gap: isMobile ? "0.3rem" : "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline" }}>
                  <div style={{ display: isMobile ? "flex" : "contents", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>{f.kind}</span>
                    {isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11 }}>0{i + 1}/0{focuses.length}</span>}
                  </div>
                  <span style={{ fontFamily: "var(--f-body)", fontSize: "1.02rem", color: p.ink, lineHeight: 1.55 }}>{f.what}</span>
                  {!isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>0{i + 1}/0{focuses.length}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* field journal */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
            Field journal
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>shortest entry · 1 line</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {journal.map((j, i) => (
                <div key={i} className="v4-stack-row" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline" }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 12 }}>{j.date}</span>
                  <span style={{ fontFamily: "var(--f-body)", fontSize: "1rem", color: p.ink, lineHeight: 1.6 }}>{j.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* conditions */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Conditions</div>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.6rem", fontFamily: "var(--f-ui)", fontSize: 13 }}>
              {[
                ["Mood", "study-mode", "rare and protected"],
                ["Music", "Caroline Polachek", "depending on the hour"],
                ["Reading", "AI Safety papers", "and one quiet novel"],
                ["Drink", "strawberry matcha", "from blank street"],
              ].map(([k, v, sub], i) => (
                <div key={i}>
                  <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.12em" }}>{k}</div>
                  <div style={{ marginTop: 6, color: p.ink, fontFamily: "var(--f-display)", fontSize: "1.4rem", fontWeight: 380, fontStyle: "italic" }}>{v}</div>
                  <div style={{ color: p.muted, fontSize: 11, marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="A snapshot, not a profile." />
    </div>
  );
}

// ---------- CONTACT ----------

export function ContactV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  const channels = [
    { label: "Email",    handle: "hello@shubzsharma.com",        note: "Best — read once a day in the morning.",                href: "mailto:hello@shubzsharma.com" },
    { label: "GitHub",   handle: "github.com/Shubzthub",     note: "Repos not yet public.", href: "https://github.com/Shubzthub" },
    { label: "LinkedIn", handle: "linkedin.com/in/Shubzthub",note: "Conventional channel; checked weekly-ish.",             href: "https://www.linkedin.com/in/Shubz-s-sharma/" },
  ];

  const policy = [
    ["Will read",          "anything about optimization, computational biology, geospatial ML, music recommendation, or science communication"],
    ["Available for",      "collaboration on research, projects, mentorship (both ways!)"],
    ["Based",              "London — happy on calls in any reasonable timezone"],
  ];

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      <PreciseTopBar palette={p} label="~/contact" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="contact" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Channels", "Preferences", "Compose"]}
              telemetry={[telemetryRow, ["page", "contact"], ["channels", String(channels.length).padStart(2, "0")], ["based", "london"]]}
              scrollPct={scrollPct} />
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§05</span>
              Contact 
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>Say </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={320}>hello.</LetterReveal></span>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={620}>I read everything</LetterReveal>
                <span style={{ display: "block" }}>
                  <LetterReveal stagger={26} delay={1080}>eventually.</LetterReveal>
                </span>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              I prefer email. If you're writing about computational biology, geospatial ML, or music recommendations, you will get a longer reply than you expect.
            </p>
          </div>
          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <div className="mono" style={{ fontSize: 11, color: p.muted, lineHeight: 1.8 }}>
              <div style={{ color: p.ink }}>fig.01 — protocol</div>
              <div>preferred&nbsp;email</div>
              <div>cadence&nbsp;&nbsp;&nbsp;daily</div>
              <div>reply&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;≤72h</div>
              <div>noise&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;low</div>
            </div>
          </div>
        </div>
      </section>

      {/* channels */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>02</span>
            Channels
          </h2>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {channels.map((c, i) => (
                <a key={i} href={c.href} onClick={(e) => { if (c.href === "#") e.preventDefault(); }} className="v4-stack-row" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 60px", gap: "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline", color: p.ink }}>
                  <span className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>{c.label}</span>
                  <span className="mono link-underline" style={{ fontSize: 13 }}>{c.handle}</span>
                  <span style={{ fontFamily: "var(--f-body)", fontSize: "0.95rem", color: p.muted, fontStyle: "italic" }}>{c.note}</span>
                  <span className="mono" style={{ color: p.accent, fontSize: 11, textAlign: "right" }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* policy */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
            Preferences
          </h2>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {policy.map(([k, v], i) => (
                <div key={i} className="v4-stack-row" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.4rem", padding: "1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline" }}>
                  <span className="caps mono" style={{ color: p.muted, fontSize: 11, letterSpacing: "0.1em" }}>{k}</span>
                  <span style={{ fontFamily: "var(--f-body)", fontSize: "1rem", color: p.ink }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* compose box */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>04</span>
            Compose
          </h2>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginTop: "1rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <form onSubmit={(e) => e.preventDefault()} style={{ border: `1px solid ${p.line}`, padding: "1.4rem", background: `color-mix(in oklch, ${p.paper} 85%, white)`, fontFamily: "var(--f-ui)" }}>
              <div className="mono caps" style={{ color: p.muted, fontSize: 11, letterSpacing: "0.12em", marginBottom: 12, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1rem" }}>
                <span>To: hello@shubzsharma.com</span>
                <span></span>
                <span style={{ color: p.accent }}>● ready</span>
              </div>
              <div style={{ display: "grid", gap: "0.7rem", fontFamily: "var(--f-body)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center", borderBottom: `1px solid ${p.line}`, paddingBottom: 8 }}>
                  <span className="mono caps" style={{ color: p.muted, fontSize: 11 }}>From</span>
                  <input placeholder="your name & email" style={inputStyle(p)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center", borderBottom: `1px solid ${p.line}`, paddingBottom: 8 }}>
                  <span className="mono caps" style={{ color: p.muted, fontSize: 11 }}>Subject</span>
                  <input placeholder="what this is about" style={inputStyle(p)} />
                </div>
                <div style={{ paddingTop: 6 }}>
                  <textarea rows="6" placeholder="Don't begin with 'quick question'." style={{ ...inputStyle(p), width: "100%", resize: "vertical", lineHeight: 1.6 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <span className="mono" style={{ fontSize: 11, color: p.muted }}>encryption · plaintext · spam-screened by hand</span>
                  <button type="submit" style={{ all: "unset", cursor: "pointer", padding: "0.55rem 1rem", border: `1px solid ${p.ink}`, color: p.paper, background: p.ink, fontFamily: "var(--f-ui)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Send →</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Hello back, in time." />
    </div>
  );
}

function inputStyle(p) {
  return { all: "unset", flex: 1, padding: "4px 0", fontFamily: "var(--f-body)", fontSize: "1rem", color: p.ink, width: "100%", outline: "none" };
}



/* ===== components/app.jsx ===== */

// useState, useEffect are in scope from motif.jsx

export function App() {
  const [route, setRoute] = useState({ page: "home", slug: null });
  const [dark, setDark] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
    }
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const toggleTheme = () => setDark(d => { const next = !d; localStorage.setItem("theme", next ? "dark" : "light"); return next; });
  const p = dark ? PALETTE_V4_DARK : PALETTE_V4_LIGHT;
  const [cursorColor, setCursorColor] = useState(p.accent);
  useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; }, [dark]);

  function navigate(page, slug = null) {
    if (document.startViewTransition) {
      document.startViewTransition(() => setRoute({ page, slug }));
    } else {
      setRoute({ page, slug });
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 10);
  }

  const sharedProps = { palette: p, onNavigate: navigate, setCursorColor, dark, toggleTheme };

  let page;
  if (route.page === "writing") page = <WritingIndexV4 {...sharedProps} />;
  else if (route.page === "essay") page = <ArticleV4 slug={route.slug || "jaya"} {...sharedProps} />;
  else if (route.page === "work") page = <WorkV4 {...sharedProps} />;
  else if (route.page === "now") page = <NowV4 {...sharedProps} />;
  else if (route.page === "contact") page = <ContactV4 {...sharedProps} />;
  else page = <HomeV4 onNavigate={navigate} setCursorColor={setCursorColor} dark={dark} toggleTheme={toggleTheme} palette={p} />;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <CustomCursor color={cursorColor} />
      {page}
    </>
  );
}

