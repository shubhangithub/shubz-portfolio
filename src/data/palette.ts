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
// V5 — "Field notebook × terminal" palette. Per-essay accents pulled from a
// 10-colour reserve (each essay carries a key into this map via posts.ts).
// See AGENTS-v5.md (in design_handoff_v5_field_notebook/) for topic-family rules.
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

export function nbTheme(mode: "light" | "dark"): NBTheme {
  return mode === "dark" ? NB_DARK : NB_LIGHT;
}
