// Site palette tokens. The live palette is the V5 "field notebook × terminal"
// system below (NB_LIGHT / NB_DARK / nbTheme). The old flat V4 Palette was
// removed with the V4 app.

// ============================================================================
// V5 — "Field notebook × terminal" palette + 10 canonical topic categories.
//
// The site's colour system: 10 pens, each a META-TOPIC. Every essay, chip,
// project, or skill picks a category by primary topic-affinity, and gets
// that category's pen colour. Specific subtopics roll up to the umbrella
// (e.g. an essay tagged "ecology" or "immunology" both colour as biotech red;
// a "category theory" topic and "graph theory" topic both colour as math
// magenta). Full reasoning + per-chip placement rules in DECISIONS-v5.md §14.
//
// CANONICAL 10 (`<NBAccentKey>` below = pen, comment = meta-topic):
//   blue    → AI safety                                  (bluedot · alignment · ethics · governance)
//   purple  → AI/ML    (classical ML · NLP · LLM eng · optim)
//   magenta → Mathematics                                 (game/cat/graph theory · complexity · GDL · crypto)
//   prompt  → Physics                                     (quantum · ZX · atmospheric · GNSS · satellite)
//   red     → Biotech                                     (biology · ecology · bioinformatics · biomarkers)
//   teal    → Geospatial                                  (geospatial ML · GIS · H3 · mapping)
//   ochre   → fintech                                     (LMSR · time-series · recommendations · forecasting)
//   cyan    → Hardware                                    (IoT · embedded · HDL · compiler/VM · sensors)
//   yellow  → Infrastructure                              (data arch · UI/UX · web stack · cloud · DevOps)
//   orange  → Outreach                                    (mentoring · leadership · STEM-ed · comms · founding)
//
// ============================================================================

export type NBAccentKey =
  | "prompt" | "red" | "blue" | "ochre" | "magenta"
  | "teal" | "purple" | "yellow" | "cyan" | "orange";

export type NBTheme = {
  paper: string; paper2: string; rule: string; control: string; chrome: string;
  ink: string; softInk: string; muted: string;
  bgCard: string;
  prompt: string; red: string; blue: string; ochre: string;
  magenta: string; teal: string; purple: string;
  yellow: string; cyan: string; orange: string;
};

export const NB_LIGHT: NBTheme = {
  paper: "#E9EDF2", paper2: "#FFFFFF", rule: "#A5AFBE", control: "#64748B", chrome: "#D8DFE8",
  ink: "#101827", softInk: "#273449", muted: "#475569",
  bgCard: "rgba(255,255,255,0.7)",
  prompt: "#006B35", red: "#B11D32", blue: "#1646C8", ochre: "#835000",
  magenta: "#991069", teal: "#00665F", purple: "#652BB8",
  yellow: "#806000", cyan: "#005D83", orange: "#A8360A",
};

export const NB_DARK: NBTheme = {
  paper: "#080C14", paper2: "#101827", rule: "#243247", control: "#8B9BB4", chrome: "#0D1420",
  ink: "#F2F5FC", softInk: "#CED6E6", muted: "#8B9BB4",
  bgCard: "rgba(255,255,255,0.025)",
  prompt: "#18EE79", red: "#FF435B", blue: "#4E82FF", ochre: "#FFAA00",
  magenta: "#FF36C4", teal: "#00D7AD", purple: "#B15CFF",
  yellow: "#F2D21B", cyan: "#00CFFF", orange: "#FF702B",
};

// ---------------------------------------------------------------------------
// CSS-variable-backed theme. Same keys as NB_LIGHT/NB_DARK, but every value
// is a var(--nb-*) reference. BaseLayout.astro emits the matching
// :root { --nb-* } / :root[data-theme="dark"] { --nb-* } blocks (generated
// from NB_LIGHT/NB_DARK above, so this file stays the single source of
// truth). Because the pre-paint script sets data-theme before first paint,
// SSR HTML styled with these vars is theme-correct at paint zero — no
// light→dark flash while React hydrates.
//
// Two consumers must NOT use these vars and take nbLiteral() instead:
//   1. Canvas drawing (ctx.fillStyle / parseHex can't resolve var()).
//   2. Anything that string-appends a hex alpha — use withAlpha() below.
// ---------------------------------------------------------------------------
export const NB_VARS: NBTheme = {
  paper: "var(--nb-paper)", paper2: "var(--nb-paper2)", rule: "var(--nb-rule)", control: "var(--nb-control)", chrome: "var(--nb-chrome)",
  ink: "var(--nb-ink)", softInk: "var(--nb-softInk)", muted: "var(--nb-muted)",
  bgCard: "var(--nb-bgCard)",
  prompt: "var(--nb-prompt)", red: "var(--nb-red)", blue: "var(--nb-blue)", ochre: "var(--nb-ochre)",
  magenta: "var(--nb-magenta)", teal: "var(--nb-teal)", purple: "var(--nb-purple)",
  yellow: "var(--nb-yellow)", cyan: "var(--nb-cyan)", orange: "var(--nb-orange)",
};

/**
 * Theme accessor used by all V5 pages. Returns the CSS-variable-backed
 * palette regardless of mode — the browser resolves the actual colours
 * from data-theme at paint time. The `mode` param is kept for API
 * compatibility (and for call sites that also need nbLiteral(mode)).
 */
export function nbTheme(_mode: "light" | "dark"): NBTheme {
  return NB_VARS;
}

/** Literal hex palette — for canvas drawing and libraries that can't
 *  resolve var() references. Everything else should use nbTheme(). */
export function nbLiteral(mode: "light" | "dark"): NBTheme {
  return mode === "dark" ? NB_DARK : NB_LIGHT;
}

/**
 * Alpha-composite a theme colour. Replaces the `${t.ink}22` hex-append
 * idiom, which silently breaks on var() references. `hexAlpha` is the
 * same two-digit hex byte the old idiom used ("00"–"ff").
 */
export function withAlpha(color: string, hexAlpha: string): string {
  const pct = Math.round((parseInt(hexAlpha, 16) / 255) * 1000) / 10;
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}
