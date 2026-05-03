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

import { SeasonalSpecimen, StaticSpecimen, LotkaVolterra, SPECIMEN_VARIANTS, INTERACTIVE_VARIANTS } from './diagrams/Seasonal';
export { SeasonalSpecimen, StaticSpecimen, LotkaVolterra, SPECIMEN_VARIANTS, INTERACTIVE_VARIANTS };

// Chrome extracted into src/components/chrome/<Name>.tsx

// Pages extracted into src/components/pages/<Name>.tsx
import { ArticleV4 } from './pages/ArticleV4';
import { ContactV4 } from './pages/ContactV4';
import { FeaturedPrecise } from './pages/FeaturedPrecise';
import { HomeV4 } from './pages/HomeV4';
import { NowV4 } from './pages/NowV4';
import { PreciseEssayRow } from './pages/PreciseEssayRow';
import { WorkV4 } from './pages/WorkV4';
import { WritingIndexV4 } from './pages/WritingIndexV4';
export { ArticleV4, ContactV4, FeaturedPrecise, HomeV4, NowV4, PreciseEssayRow, WorkV4, WritingIndexV4 };
import { Footer } from './chrome/Footer';
import { IndexRail } from './chrome/IndexRail';
import { PreciseFooter } from './chrome/PreciseFooter';
import { PreciseNav } from './chrome/PreciseNav';
import { PreciseTopBar } from './chrome/PreciseTopBar';
import { ThemeToggle } from './chrome/ThemeToggle';
export { Footer, IndexRail, PreciseFooter, PreciseNav, PreciseTopBar, ThemeToggle };





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

// SeasonalSpecimen extracted to src/components/diagrams/Seasonal.tsx

// StaticSpecimen extracted to src/components/diagrams/Seasonal.tsx

// Lotka–Volterra predator–prey: phase-space loop + time-series strip + live
// sliders for predation (β) and predator mortality (γ). May only.
// LotkaVolterra extracted to src/components/diagrams/Seasonal.tsx

// SPECIMEN_VARIANTS extracted to src/components/diagrams/Seasonal.tsx

// INTERACTIVE_VARIANTS extracted to src/components/diagrams/Seasonal.tsx



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



// Footer extracted to src/components/chrome/Footer.tsx

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

// HomeV4 extracted to src/components/pages/HomeV4.tsx




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

// ThemeToggle extracted to src/components/chrome/ThemeToggle.tsx

// PreciseTopBar extracted to src/components/chrome/PreciseTopBar.tsx

// PreciseNav extracted to src/components/chrome/PreciseNav.tsx

// IndexRail extracted to src/components/chrome/IndexRail.tsx

// PreciseFooter extracted to src/components/chrome/PreciseFooter.tsx

export function usePreciseScroll() {
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

export function useIsMobile(breakpoint = 768) {
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

export function useIsTouch() {
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

export function useViewportSize() {
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

export function useCursorCoords() {
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

export function useTelemetry() {
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

export function cursorTelemetry({ x, y }) {
  return ["cursor", `${String(x).padStart(4, "0")}, ${String(y).padStart(4, "0")}`];
}

// ---------- WRITING INDEX (V4) ----------

// WritingIndexV4 extracted to src/components/pages/WritingIndexV4.tsx

// FeaturedPrecise extracted to src/components/pages/FeaturedPrecise.tsx

// PreciseEssayRow extracted to src/components/pages/PreciseEssayRow.tsx

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

export function essayMeta(slug) {
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

// ArticleV4 extracted to src/components/pages/ArticleV4.tsx

// ---------- WORK — annotated CV ----------

// WorkV4 extracted to src/components/pages/WorkV4.tsx

// ---------- NOW — field journal ----------

// NowV4 extracted to src/components/pages/NowV4.tsx

// ---------- CONTACT ----------

// ContactV4 extracted to src/components/pages/ContactV4.tsx

export function inputStyle(p) {
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

