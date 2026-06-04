// @ts-nocheck
/* eslint-disable */
/**
 * legacy.tsx — bulk-extracted from the old single-file index.html.
 * SSR-ready React app, lifted out so Astro can render real HTML for SEO.
 */
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// === Phase-2 splits: hooks, interactives, essay primitives, helpers ===
// All re-imported here so the App / AppShell / cross-references inside legacy
// resolve transparently, and re-exported so external imports keep working.
import { usePreciseScroll, useIsMobile, useIsTouch, useViewportSize, useCursorCoords, useTelemetry, cursorTelemetry } from '../lib/hooks';
import { samplePath, dft } from '../lib/fourier';
import { essayMeta, inputStyle } from '../lib/essay-meta';
import { CustomCursor } from './interactive/CustomCursor';
import { LetterReveal } from './interactive/LetterReveal';
import { ReadingRuler } from './interactive/ReadingRuler';
import { PullQuote } from './essay/PullQuoteReact';
import { Figure } from './essay/FigureReact';
export {
  usePreciseScroll, useIsMobile, useIsTouch, useViewportSize, useCursorCoords, useTelemetry, cursorTelemetry,
  samplePath, dft,
  essayMeta, inputStyle,
  CustomCursor, LetterReveal, ReadingRuler,
  PullQuote, Figure,
};


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
import { TuringEssay } from './essays/TuringEssay';
import { BluedotEssay } from './essays/BluedotEssay';
import { ZXEssay } from './essays/ZXEssay';
import { DraftEssay } from './essays/DraftEssay';
export { JayaEssay, ThresholdEssay, ConstraintClusterEssay, SixEnginesEssay, FashionEssay, MayEssay, TuringEssay, BluedotEssay, ZXEssay, DraftEssay };

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
import { BottleneckMap } from './diagrams/BottleneckMap';
import { SpiderFusion } from './diagrams/SpiderFusion';
import { ZXRewrite } from './diagrams/ZXRewrite';
import { JaggedFrontier } from './diagrams/JaggedFrontier';
import { ReadingCluster } from './diagrams/ReadingCluster';
import { WhoIsWe } from './diagrams/WhoIsWe';
export { BottleneckMap, ConstraintEffect, SpiderFusion, ZXRewrite, CtlaDistribution, EnsembleConsensus, FeatureSelectionViz, FourierMotif, GateSensitivity, GradientDescentViz, JaggedFrontier, JayaSwarm, LMSRPriceCurve, MethodRanking, ReadingCluster, RecEngineSwarm, ThresholdMethods, TrendSignalFlow, ViolationNetwork, WhoIsWe };

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
import { TerminalPanel } from './chrome/TerminalPanel';
export { TerminalPanel };
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
// samplePath extracted to src/lib/fourier.ts

// dft extracted to src/lib/fourier.ts

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
// CustomCursor extracted to src/components/interactive/CustomCursor.tsx

// Letter-by-letter reveal on mount (once per session)
// LetterReveal extracted to src/components/interactive/LetterReveal.tsx


// Reading ruler (proportional bar) - appears during article scroll
// ReadingRuler extracted to src/components/interactive/ReadingRuler.tsx




/* ===== components/shared.jsx ===== */



// Footer extracted to src/components/chrome/Footer.tsx

// POSTS is the single source of truth — defined in src/data/posts.ts
import { POSTS, findPost } from '../data/posts';
export { POSTS, findPost };


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
// PullQuote extracted to src/components/essay/PullQuoteReact.tsx

// Figure extracted to src/components/essay/FigureReact.tsx


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

// usePreciseScroll extracted to src/lib/hooks.ts

// useIsMobile extracted to src/lib/hooks.ts

// useIsTouch extracted to src/lib/hooks.ts

// useViewportSize extracted to src/lib/hooks.ts

// useCursorCoords extracted to src/lib/hooks.ts

// useTelemetry extracted to src/lib/hooks.ts

// cursorTelemetry extracted to src/lib/hooks.ts

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

// essayMeta extracted to src/lib/essay-meta.ts

// ArticleV4 extracted to src/components/pages/ArticleV4.tsx

// ---------- WORK — annotated CV ----------

// WorkV4 extracted to src/components/pages/WorkV4.tsx

// ---------- NOW — field journal ----------

// NowV4 extracted to src/components/pages/NowV4.tsx

// ---------- CONTACT ----------

// ContactV4 extracted to src/components/pages/ContactV4.tsx

// inputStyle extracted to src/lib/essay-meta.ts



/* ===== components/app.jsx ===== */

// useState, useEffect are in scope from motif.jsx

export function App() {
  const [route, setRoute] = useState({ page: "home", slug: null });
  const [dark, setDark] = useState(() => {
    // Default to dark; only switch to light if the user explicitly chose it.
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
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

