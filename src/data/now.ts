// Weekly-ish snapshot content. Edit this file (and only this file) when the
// /now page or the home-page ticker drift. Used by:
//   - src/components/pages/NowV4.tsx     (focuses, journal, conditions)
//   - src/components/pages/HomeV4.tsx    (journal ticker — latest 3 entries)

export type Focus = { kind: string; what: string };
export type JournalEntry = { date: string; note: string };
export type Condition = { k: string; v: string; sub: string };

// /now · "Right now" — five concurrent threads
export const FOCUSES: Focus[] = [
  { kind: "Building",  what: "Orion's search system. Rewriting tool schemas, system prompts with decision trees, fewshot disambiguation. Three weeks of rewrites; the results finally stopped feeling stochastic." },
  { kind: "Studying",  what: "BlueDot's AGI Strategy cohort, May into June. The strategic frame around the technical work I already do." },
  { kind: "Reading",   what: "AI safety: Betley on weird generalisation and inductive backdoors, Bengio's Scientist AI, Anthropic's Persona Selection Model, Nanda on pragmatic interpretability." },
  { kind: "Refining",  what: "This site, slowly. The fun is in the typography." },
  { kind: "Writing",   what: "A second ZX-calculus essay." },
];

// /now · "Field journal" — newest first
export const JOURNAL: JournalEntry[] = [
  { date: "2026-05", note: "Started BlueDot's AGI Strategy cohort. Pre-reading has already moved more pieces around in my head than I expected." },
  { date: "2026-05", note: "Rewriting Orion's search system — tool schemas, decision-tree prompts, fewshot disambiguation. Three weeks in. The results finally stopped feeling stochastic." },
  { date: "2026-04", note: "Used Claude to redesign fashion-web. Broke more than I expected. Still putting it back together." },
  { date: "2026-02", note: "Elected MInstP. The certificate is small and unreasonably satisfying." },
  { date: "2025-12", note: "Built a second pass at the Taylor Swift recommender — six engines, Python and TypeScript. Learning a lot about how recommendation systems actually work when you try to make them good." },
  { date: "2025-08", note: "\"Decoding Flipkart-Walmart Merger\" picks up Best Paper at IEEE ICCUBEA-2025. Four years from data scrape to award. Yay!" },
];

// /now · "Conditions" tile
export const CONDITIONS: Condition[] = [
  { k: "Mood",    v: "study-mode",         sub: "rare and protected" },
  { k: "Music",   v: "Tame Impala",         sub: "Currents, specifically" },
  { k: "Reading", v: "AI Safety papers",   sub: "allegedly also a novel" },
  { k: "Drink",   v: "strawberry matcha",  sub: "from blank street" },
];
