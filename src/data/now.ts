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
export const NOW_LAST_UPDATED_DATE = "17 jul 2026";

export const NOW_CADENCE_LABEL = "weekly-ish";

export type Focus = { kind: string; what: string; family: NBAccentKey };
export type JournalEntry = { date: string; note: string; family: NBAccentKey };
export type Condition = { k: string; v: string; sub: string; family: NBAccentKey };

// /now · "Right now" — five concurrent threads.
// CAP: 5 entries (same reason as JOURNAL — anything more clutters the layout).
export const FOCUSES: Focus[] = [
  // BlueDot Technical AI Safety → AI safety
  { kind: "Studying",  family: "blue",   what: "BlueDot's Technical AI Safety course — mechanistic interpretability, RLHF, evaluations, AI control. Alongside the BDI-funded research." },
  // Agentic AI reading → AI/ML
  { kind: "Reading",   family: "purple", what: "Agentic systems — tool use, memory architectures, multi-agent coordination. The gap between demos and things that actually work reliably." },
  // Google cybersecurity cert → infra
  { kind: "Learning",  family: "yellow", what: "Google's cybersecurity certificate. Wanted a more formal grounding in what I've been picking up from the safety side." },
  // Procreate / drawing → outreach (personal, creative)
  { kind: "Drawing",   family: "orange", what: "Procreate course on Skillshare. Trying to get better at making things by hand. No particular goal, just enjoy it." },
  // fashion-web → fintech
  { kind: "Building",  family: "ochre",  what: "fashion-web, slowly. Calibrating the house model between other things." },
];

// /now · "Field journal" — newest first.
// CAP: 5 entries. The home `cat .now` mini-term and the /now journal list both
// render from this array; >5 overflows the layout. When adding a new entry,
// delete the oldest one in the same edit to maintain the cap.
export const JOURNAL: JournalEntry[] = [
  // InnovateHer outreach milestone + summer talks → outreach
  { date: "2026-07", family: "orange", note: "InnovateHer outreach passed 200+ students spoken to across UK schools — careers in tech, and the roles we don't have names for yet. Recent talks at the University of Liverpool Maths School, and back at FLAME on choice theory and grad school." },
  // Branching out post-grant → mixed
  { date: "2026-06", family: "orange", note: "Since the grant: started Google's cybersecurity certificate, a Procreate drawing course on Skillshare, reading a lot about agentic systems. Professionally quieter than usual, which is fine." },
  // BDI grant + Technical AI Safety course → AI safety
  { date: "2026-06", family: "blue",   note: "BDI grant came through. Starting BlueDot's Technical AI Safety course — mechanistic interpretability, RLHF, evaluations, AI control." },
  // BlueDot cohort close → AI safety
  { date: "2026-05", family: "blue",   note: "Wrapped BlueDot's AGI Strategy cohort. Good primer on the strategic frame around the technical work." },
  // Orion search rewrite → AI/ML (LLM eng)
  { date: "2026-05", family: "purple", note: "Rewriting Orion's search system — tool schemas, decision-tree prompts, fewshot disambiguation." },
];

// /now · "Field journal archive" — older entries, diary only (not home mini-term).
// Append to JOURNAL in the DiaryJournal component. Newest first.
export const JOURNAL_ARCHIVE: JournalEntry[] = [
  // fashion-web redesign → Markets (rolled out of the live JOURNAL, kept here)
  { date: "2026-04", family: "ochre",  note: "Used Claude to redesign fashion-web. Broke more than I expected. Still putting it back together." },
  // MInstP + Taylor rec second pass → late 2025
  { date: "2025-12", family: "ochre",  note: "Second pass at the Taylor Swift recommender — ported from the R/Shiny original to Python and TypeScript, six engines in parallel. Learning a lot about how recommendation systems actually work when you try to make them good." },
  // IEEE Best Paper → August 2025
  { date: "2025-08", family: "prompt", note: "Best Paper at IEEE ICCUBEA-2025. 1,240 submissions, 220 accepted. The Flipkart–Walmart NLP paper I co-authored with Prof. Chakraborty two years ago — surprised it landed the way it did." },
  // Orion promotion to Data & ML Engineer → late 2024
  { date: "2024-11", family: "teal",   note: "Moved from Data Engineer to Data & ML Engineer at Orion. Starting to own the ML side properly — anomaly detection over the H3 spatial indexing layer, confidence-weighted signal fusion." },
  // Oxford thesis submission → summer 2024
  { date: "2024-09", family: "red",    note: "Submitted the MFoCS thesis. Two problems in automated biomarker detection on multiplex immunofluorescence data from actual tumour samples. Glad it's done. Genuinely don't know how pathologists look at this stuff every day." },
  // Joined Orion → April 2024
  { date: "2024-04", family: "teal",   note: "Joined Orion as one of the first two hires. Building geospatial intelligence infrastructure from nothing. The problem space is genuinely interesting — high-volume multi-source data with hard latency constraints." },
];

// /now · "Conditions" tile
export const CONDITIONS: Condition[] = [
  // Drawing / creative mode → outreach (personal)
  { k: "Mood",    family: "orange", v: "drawing things",    sub: "on procreate" },
  // Music → outreach (personal)
  { k: "Music",   family: "orange", v: "tame impala",       sub: "currents, specifically" },
  // Reading agentic AI → AI/ML
  { k: "Reading", family: "purple", v: "agentic AI papers", sub: "and a novel, finally" },
  // Drink → outreach (personal)
  { k: "Drink",   family: "orange", v: "strawberry matcha", sub: "from blank street" },
];
