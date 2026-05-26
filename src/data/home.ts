// home.ts — all editable copy for the homepage. The HomeV5 component is a
// pure renderer: it imports these constants and lays them out. Edit this
// file (via GitHub's "edit this page →" link in the site footer or
// locally) to change what shows up at `/`. No JSX changes needed for copy.
//
// Anything tied to the canonical 10-category colour system uses keys from
// NBAccentKey (see src/data/palette.ts + DECISIONS-v5.md §14).
//
// V5 architecture note: this file mirrors the pattern that
// src/data/now.ts already establishes — components are pure, content
// lives in `src/data/<page>.ts`.

import type { NBAccentKey } from "./palette";

// ---------------------------------------------------------------------------
// Inline-coloured prose. A line/paragraph is a list of `Span`s.
//   - plain string → renders as-is
//   - { em, c }    → italic display-serif span in the named accent
//   - { tag, c }   → coloured highlight (used in the bio paragraph)
// ---------------------------------------------------------------------------
export type Span =
  | string
  | { em: string; c?: NBAccentKey }
  | { tag: string; c?: NBAccentKey };

// ---------------------------------------------------------------------------
// HERO — multi-coloured H1, two visual lines
// ---------------------------------------------------------------------------
export const HERO_LINE_A: Span[] = [
  "Read ",
  { em: "maths", c: "magenta" },
  " and ",
  { em: "CS", c: "blue" },
  " at ",
  { em: "Oxford", c: "ochre" },
  ".",
];

export const HERO_LINE_B: Span[] = [
  "Currently building ",
  { em: "geospatial ML", c: "teal" },
  " at ",
  { em: "Orion", c: "teal" },
  ", easily ",
  { em: "distracted", c: "magenta" },
  " by other problems.",
];

// ---------------------------------------------------------------------------
// BIO PARAGRAPH (mixed italic + coloured tags)
// ---------------------------------------------------------------------------
export const BIO: Span[] = [
  "I'm a founding engineer at ",
  { em: "Orion", c: "teal" },
  ", where I build geospatial ML that pays attention to ",
  { em: "where" },
  " things happen, and how confidently. Before that I read maths (dabbled in some physics) at ",
  { em: "Oxford", c: "ochre" },
  " and computer science at ",
  { em: "FLAME", c: "ochre" },
  ". I am also, in inconvenient order: a ",
  { tag: "Thames rower", c: "orange" },
  " on Sundays, active in ",
  { tag: "STEM ed outreach", c: "orange" },
  ", a ",
  { tag: "hobby pianist", c: "orange" },
  ", a ",
  { tag: "fashion enthusiast", c: "ochre" },
  ", and very into ",
  { tag: "interactive diagrams", c: "magenta" },
  ".",
];

// ---------------------------------------------------------------------------
// MARGINALIA — rotated red-ink note next to the hero (desktop only)
// ---------------------------------------------------------------------------
export const HOME_MARGINALIA = {
  /** Lines render as <br/>-separated rows inside the marginalia. */
  lines: ["first solve it", "on paper.", "then in code."],
  accent: "yellow" as NBAccentKey,
};

// ---------------------------------------------------------------------------
// FOOTER under the toolbox — links to the full /work/#toolbox view
// ---------------------------------------------------------------------------
export const TOOLBOX_TEASER = "this is the teaser · the full taxonomy lives in";
export const TOOLBOX_TEASER_PATH = "./work/toolbox.md";

// ---------------------------------------------------------------------------
// §03 SELECTED BUILDS — currently-deployed projects
// ---------------------------------------------------------------------------
export type HomeBuild = {
  name: string;
  c: NBAccentKey;
  blurb: string;
  year: string;
  url: string;
};

// V5 canonical: each build's `c` = its primary topic.
//   fashion-web        → ochre  (markets / predictions / fintech)
//   taylor-rec-engine  → ochre  (recommendations roll up to markets)
//   platypus-learn     → purple (ML technical research — LLM-driven learning)
export const HOME_BUILDS: HomeBuild[] = [
  { name: "fashion-web",        c: "ochre",  blurb: "ML trend intelligence + LMSR exchange.",                year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
  { name: "taylor-rec-engine",  c: "ochre",  blurb: "Six recommendation engines on one songbook.",            year: "2026",   url: "https://shubz-taylor-recommendation-engine.vercel.app" },
  { name: "platypus-learn",     c: "purple", blurb: "AI learning platform — PDFs and YouTube → courses.",    year: "2025 —", url: "https://platypus-learn.vercel.app" },
];

// ---------------------------------------------------------------------------
// §04 TOOLBOX — condensed teaser. The full taxonomy with provenance lives
// on /work under §04 (see src/data/work.ts WORK_TOOLBOX).
// ---------------------------------------------------------------------------
export type ChipLink = { label: string; href: string };
export type ToolItem = { name: string; links: ChipLink[] };
export type ToolGroup = { group: string; primary: NBAccentKey; items: ToolItem[] };

const CV_PDF = "/uploads/Shubhangi-Sharma-Resume-20260211.pdf";

export const HOME_TOOLBOX: ToolGroup[] = [
  { group: "AI safety & alignment", primary: "blue", items: [
    { name: "AI alignment research", links: [{ label: "a unit on bending the curve", href: "/bluedot-unit1/" }] },
    { name: "AI ethics & governance", links: [{ label: "bluedot AGI cohort · /now", href: "/now/" }] },
  ] },
  { group: "ML technical research", primary: "purple", items: [
    { name: "Python",                     links: [{ label: "jaya, threshold, six engines", href: "/jaya/" }] },
    { name: "Claude API · Anthropic SDK", links: [{ label: "platypus-learn", href: "https://platypus-learn.vercel.app" }] },
    { name: "Prompt engineering · few-shot", links: [{ label: "orion search · /now", href: "/now/" }] },
  ] },
  { group: "Mathematics", primary: "magenta", items: [
    { name: "Computational Game Theory", links: [{ label: "Oxford MFoCS · CV", href: CV_PDF }] },
    { name: "Category Theory",           links: [{ label: "Oxford MFoCS · CV", href: CV_PDF }] },
  ] },
  { group: "Physics", primary: "prompt", items: [
    { name: "Quantum Information",        links: [{ label: "two colours and a Hadamard", href: "/zx-calculus/" }] },
    { name: "GNSS atmospheric modelling", links: [{ label: "honours thesis · CV", href: CV_PDF }] },
  ] },
  { group: "Biotech", primary: "red", items: [
    { name: "Bioinformatics",         links: [{ label: "jaya · proteins", href: "/jaya/" }] },
    { name: "Lotka–Volterra dynamics", links: [{ label: "predator and prey", href: "/may-2026/" }] },
  ] },
  { group: "Geospatial", primary: "teal", items: [
    { name: "Rust · Golang",               links: [{ label: "orion · /work", href: "/work/" }] },
    { name: "Geospatial ML · H3 indexing", links: [{ label: "orion · /work", href: "/work/" }] },
  ] },
  { group: "Markets, predictions & fintech", primary: "ochre", items: [
    { name: "LMSR prediction markets", links: [{ label: "pricing the next scarf", href: "/fashion-trends/" }] },
    { name: "Recommendation systems",  links: [{ label: "six engines", href: "/six-engines/" }] },
  ] },
  { group: "Hardware", primary: "cyan", items: [
    { name: "C++ · embedded", links: [{ label: "IoT weather bot · CV", href: CV_PDF }] },
    { name: "Compiler · HDL", links: [{ label: "Nand2Tetris · /work", href: "/work/" }] },
  ] },
  { group: "Infrastructure & craft", primary: "yellow", items: [
    { name: "Astro · React islands", links: [{ label: "this site", href: "https://github.com/shubhangithub/personal-site" }] },
    { name: "Next.js · Supabase",    links: [{ label: "platypus-learn", href: "https://platypus-learn.vercel.app" }] },
    { name: "UI / UX",               links: [{ label: "this site", href: "/" }] },
  ] },
  { group: "Outreach, community & teaching", primary: "orange", items: [
    { name: "Team leadership",                  links: [{ label: "Dotslash · Kolhapur · Council · CV", href: CV_PDF }] },
    { name: "Mentoring under-represented kids", links: [{ label: "Stemmettes · InnovateHer", href: "/work/" }] },
    { name: "DBS-checked (UK)",                 links: [{ label: "cleared for under-18s · /work", href: "/work/" }] },
  ] },
];

// ---------------------------------------------------------------------------
// CONTACT SLIP — right-rail card. Each row is one channel.
// ---------------------------------------------------------------------------
export type ContactRow = { label: string; handle?: string; href: string };

export const HOME_CONTACT_ROWS: ContactRow[] = [
  { label: "github",   handle: "Shubzthub",          href: "https://github.com/Shubzthub" },
  { label: "linkedin", handle: "Shubz-s-sharma",     href: "https://www.linkedin.com/in/Shubz-s-sharma/" },
  { label: "email",    handle: "hello@shubzsharma.com", href: "mailto:hello@shubzsharma.com" },
  { label: "/contact", href: "/contact/" },
];

// ---------------------------------------------------------------------------
// MISC strings shown around the home page (small, but here for easy edit)
// ---------------------------------------------------------------------------
export const HOME_FIG_LABEL = "fig. 01 — predator/prey";
export const HOME_FIG_CAPTION = "lotka–volterra · may '26";
export const HOME_FIG_LINK_TEXT = "see the math →";

export const HOME_PINNED_LABEL = "§02  PINNED · FEATURED WRITING";
export const HOME_PINNED_COMMENT = "3 open on the desk";
export const HOME_VIEW_ALL_TEXT = (count: number) => `all ${count} essays →`;

export const HOME_LAST_UPDATED_LABEL = "NOTEBOOK";
export const HOME_LAST_UPDATED_DATE = "26 may 2026";

export const HOME_CONTACT_HEADER = "contact —";
export const HOME_ANNOTATED_CV_LINK = "annotated cv →";
export const HOME_TOOLBOX_SEE_ALL = "see all skills + provenance →";
