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
export const NOW_LAST_UPDATED_DATE = "4 jun 2026";

export const NOW_CADENCE_LABEL = "weekly-ish";

export type Focus = { kind: string; what: string; family: NBAccentKey };
export type JournalEntry = { date: string; note: string; family: NBAccentKey };
export type Condition = { k: string; v: string; sub: string; family: NBAccentKey };

// /now · "Right now" — five concurrent threads.
// CAP: 5 entries (same reason as JOURNAL — anything more clutters the layout).
export const FOCUSES: Focus[] = [
  // fashion-web (trend prediction + LMSR market) → fintech / ochre
  { kind: "Building",  family: "ochre",  what: "fashion-web. Composite trend signal across five live sources, an LMSR prediction market on top, Gemini for outfit-against-runway matching. Calibrating the house model." },
  // BlueDot AGI Strategy → AI safety
  { kind: "Studying",  family: "blue",   what: "BlueDot's AGI Strategy cohort, May into June. The strategic frame around the technical work I already do." },
  // AI safety reading list → AI safety
  { kind: "Reading",   family: "blue",   what: "AI safety: Betley on weird generalisation and inductive backdoors, Bengio's Scientist AI, Anthropic's Persona Selection Model, Nanda on pragmatic interpretability." },
  // This site / typography → Infrastructure
  { kind: "Refining",  family: "yellow", what: "This site, slowly. The fun is in the typography." },
  // BlueDot AGI Strategy cohort findings → AI safety
  { kind: "Writing",   family: "blue",   what: "Findings from the BlueDot AGI Strategy cohort. Also refining an essay on ZX-calculus — it needs more work before it's out." },
];

// /now · "Field journal" — newest first.
// CAP: 5 entries. The home `cat .now` mini-term and the /now journal list both
// render from this array; >5 overflows the layout. When adding a new entry,
// delete the oldest one in the same edit to maintain the cap.
export const JOURNAL: JournalEntry[] = [
  // BlueDot cohort + AI safety interest spike → AI safety (the cohort is wrapping
  // up; folding the "AI safety has become genuinely interesting" beat in here so
  // the journal stays at 5 entries — see feedback-now-journal-cap memory).
  { date: "2026-05", family: "blue",   note: "Wrapping up BlueDot's AGI Strategy cohort. AI safety is becoming genuinely interesting to me — the material moved more pieces around in my head than I expected." },
  // Orion search rewrite → AI/ML (LLM eng)
  { date: "2026-05", family: "purple", note: "Rewriting Orion's search system — tool schemas, decision-tree prompts, fewshot disambiguation. Three weeks in." },
  // fashion-web redesign → Markets (the product is markets)
  { date: "2026-04", family: "ochre",  note: "Used Claude to redesign fashion-web. Broke more than I expected. Still putting it back together." },
  // MInstP election → Physics
  { date: "2026-02", family: "prompt", note: "Elected MInstP. The certificate is small and unreasonably satisfying." },
  // Taylor rec second pass → Markets (recommendations)
  { date: "2025-12", family: "ochre",  note: "Second pass at the Taylor Swift recommender — ported from the R/Shiny original to Python (FastAPI) and TypeScript, six engines running in parallel. Learning a lot about how recommendation systems actually work when you try to make them good." },
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
