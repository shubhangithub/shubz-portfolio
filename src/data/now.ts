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
  { date: "2026-05", note: "Rewriting Orion's search system — tool schemas, decision-tree prompts, fewshot disambiguation. Three weeks in. The results finally stopped feeling stochastic." },
  { date: "2026-04", note: "fashion-web's data pipeline finally feels complete — Reddit, Bluesky, YouTube, editorial, all flowing into one composite trend score with Holt-Winters on top. Now I can stop building and start watching what it predicts." },
  { date: "2026-02", note: "Elected MInstP. The certificate is small and unreasonably satisfying." },
  { date: "2025-12", note: "Started a second pass at the Taylor Swift recommender — TypeScript this time, six engines, all of them slightly wrong in interesting ways." },
  { date: "2025-08", note: "\"Decoding Flipkart-Walmart Merger\" picks up the Best Paper Award at IEEE ICCUBEA-2025. Four years from data scrape to award." },
  { date: "2025-08", note: "Promoted to Founding Engineer at Orion. The job description got shorter and the work got broader." },
];

// /now · "Conditions" tile
export const CONDITIONS: Condition[] = [
  { k: "Mood",    v: "study-mode",         sub: "rare and protected" },
  { k: "Music",   v: "Caroline Polachek",  sub: "depending on the hour" },
  { k: "Reading", v: "AI Safety papers",   sub: "and one quiet novel" },
  { k: "Drink",   v: "strawberry matcha",  sub: "from blank street" },
];
