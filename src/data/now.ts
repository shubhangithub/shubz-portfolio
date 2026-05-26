// Weekly-ish snapshot content. Edit this file (and only this file) when the
// /now page or the home-page ticker drift. Used by:
//   - src/components/pages/NowV5.tsx   (focuses, journal, conditions, hero)
//   - src/components/pages/HomeV5.tsx  (journal ticker → mini-term)
//   - V4 pages (legacy) still read FOCUSES / JOURNAL / CONDITIONS.
//
// V5 colour rule: each entry carries a `family` pointing at one of the 10
// canonical NB palette keys (see palette.ts + DECISIONS-v5.md §14). The
// page components resolve `family` → `t[family]` to colour rows. Adding a
// new entry: pick the meta-topic, set `family`, rest is automatic.

import type { NBAccentKey } from "./palette";

// ---------------------------------------------------------------------------
// HERO — /now page hero H1 + lede paragraph
// ---------------------------------------------------------------------------
export type Span = string | { em: string; c?: NBAccentKey };

export const NOW_HERO_LINES: Span[][] = [
  [
    "What I'm ",
    { em: "actually", c: "orange" },
    " ",
    { em: "doing", c: "orange" },
    " this week.",
  ],
];

export const NOW_LEDE_PREFIX = "The ";
export const NOW_LEDE_LINK_TEXT = "/now";
export const NOW_LEDE_LINK_URL = "https://nownownow.com/about";
export const NOW_LEDE_SUFFIX =
  " convention — what's on my plate, what I'm reading, where my attention is going. A snapshot, not a profile. Updated whenever I notice it has drifted.";

export const NOW_MARGINALIA = {
  lines: ["the rule: only", "five things at", "once. anything", "more is fiction."],
  accent: "orange" as NBAccentKey,
};

export const NOW_LAST_UPDATED_LABEL = "NOW · WEEKLY-ISH SNAPSHOT";
export const NOW_LAST_UPDATED_DATE = "26 may 2026";

// ---------------------------------------------------------------------------
// TELEMETRY — right-rail JSON pretty-print of where I am
// ---------------------------------------------------------------------------
export const NOW_TELEMETRY = {
  city: "London",
  tz: "Europe/London",
  updated: "26/05/2026",
};

export const NOW_CADENCE_LABEL = "weekly-ish";

export type Focus = { kind: string; what: string; family: NBAccentKey };
export type JournalEntry = { date: string; note: string; family: NBAccentKey };
export type Condition = { k: string; v: string; sub: string; family: NBAccentKey };

// /now · "Right now" — five concurrent threads
export const FOCUSES: Focus[] = [
  // Orion search (LLM eng / tool schemas / few-shot) → AI/ML
  { kind: "Building",  family: "purple", what: "Orion's search system. Rewriting tool schemas, system prompts with decision trees, fewshot disambiguation. Three weeks of rewrites; the results finally stopped feeling stochastic." },
  // BlueDot AGI Strategy → AI safety
  { kind: "Studying",  family: "blue",   what: "BlueDot's AGI Strategy cohort, May into June. The strategic frame around the technical work I already do." },
  // AI safety reading list → AI safety
  { kind: "Reading",   family: "blue",   what: "AI safety: Betley on weird generalisation and inductive backdoors, Bengio's Scientist AI, Anthropic's Persona Selection Model, Nanda on pragmatic interpretability." },
  // This site / typography → Infrastructure
  { kind: "Refining",  family: "yellow", what: "This site, slowly. The fun is in the typography." },
  // ZX-calculus essay → Physics
  { kind: "Writing",   family: "prompt", what: "A second ZX-calculus essay." },
];

// /now · "Field journal" — newest first
export const JOURNAL: JournalEntry[] = [
  // BlueDot cohort → AI safety
  { date: "2026-05", family: "blue",   note: "Started BlueDot's AGI Strategy cohort. Pre-reading has already moved more pieces around in my head than I expected." },
  // Orion search rewrite → AI/ML (LLM eng)
  { date: "2026-05", family: "purple", note: "Rewriting Orion's search system — tool schemas, decision-tree prompts, fewshot disambiguation. Three weeks in. The results finally stopped feeling stochastic." },
  // fashion-web redesign → Markets (the product is markets)
  { date: "2026-04", family: "ochre",  note: "Used Claude to redesign fashion-web. Broke more than I expected. Still putting it back together." },
  // MInstP election → Physics
  { date: "2026-02", family: "prompt", note: "Elected MInstP. The certificate is small and unreasonably satisfying." },
  // Taylor rec second pass → Markets (recommendations)
  { date: "2025-12", family: "ochre",  note: "Built a second pass at the Taylor Swift recommender — six engines, Python and TypeScript. Learning a lot about how recommendation systems actually work when you try to make them good." },
];

// /now · "Conditions" tile
export const CONDITIONS: Condition[] = [
  // Study-mode → AI safety (BlueDot study)
  { k: "Mood",    family: "blue",   v: "study-mode",        sub: "rare and protected" },
  // Music → Outreach (personal/community)
  { k: "Music",   family: "orange", v: "tame impala",       sub: "currents, specifically" },
  // Reading AI safety papers → AI safety
  { k: "Reading", family: "blue",   v: "ai safety papers",  sub: "allegedly also a novel" },
  // Drink → Outreach (personal)
  { k: "Drink",   family: "orange", v: "strawberry matcha", sub: "from blank street" },
];
