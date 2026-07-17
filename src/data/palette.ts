// Site palette tokens. The site has two modes — cool ivory + cobalt (light)
// and midnight + cobalt (dark). Diagram components and chrome both pull from
// the active palette so colours stay consistent across light/dark switches.

export type Palette = {
  id: string;
  label: string;
  paper: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
};

export const PALETTE_LIGHT: Palette = {
  id: "cobalt",
  label: "cool ivory + cobalt",
  paper: "#F2F1EC",
  ink: "#0F1320",
  muted: "#6E7488",
  accent: "#1F3DBF",
  line: "#D5D6DC",
};

export const PALETTE_DARK: Palette = {
  id: "cobalt-dark",
  label: "midnight + cobalt",
  paper: "#0F1320",
  ink: "#E8E6E1",
  muted: "#8B8FA4",
  accent: "#6B8AFF",
  line: "#252A3A",
};

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
// V4's PALETTE_* above stays untouched — V4 pages still consume them.
// ============================================================================

export type NBAccentKey =
  | "prompt" | "red" | "blue" | "ochre" | "magenta"
  | "teal" | "purple" | "yellow" | "cyan" | "orange";

export type NBTheme = {
  paper: string; paper2: string; rule: string; chrome: string;
  ink: string; softInk: string; muted: string;
  bgCard: string;
  prompt: string; red: string; blue: string; ochre: string;
  magenta: string; teal: string; purple: string;
  yellow: string; cyan: string; orange: string;
};

export const NB_LIGHT: NBTheme = {
  paper: "#F3EEDB", paper2: "#FAF6E6", rule: "#E6DCBE", chrome: "#DEDCD3",
  ink: "#26222B", softInk: "#4A4458", muted: "#7F7869",
  bgCard: "rgba(255,255,255,0.4)",
  prompt: "#3F6E48", red: "#B83C3C", blue: "#2D4F8B", ochre: "#A86A2C",
  magenta: "#9E3A66", teal: "#2E6A6E", purple: "#5A4B7F",
  yellow: "#B58A1A", cyan: "#1F7382", orange: "#C2562A",
};

export const NB_DARK: NBTheme = {
  paper: "#0E131D", paper2: "#141A26", rule: "#1A2233", chrome: "#171B27",
  ink: "#F0E9D6", softInk: "#C5BCA6", muted: "#5C6478",
  bgCard: "rgba(255,255,255,0.025)",
  prompt: "#27C840", red: "#F08C7E", blue: "#7E94FF", ochre: "#FFC857",
  magenta: "#F49ABE", teal: "#6FBEC2", purple: "#B6A3DC",
  yellow: "#FFD37E", cyan: "#8FD9E0", orange: "#F0A176",
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
  paper: "var(--nb-paper)", paper2: "var(--nb-paper2)", rule: "var(--nb-rule)", chrome: "var(--nb-chrome)",
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
