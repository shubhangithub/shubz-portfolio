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
export const NOW_LAST_UPDATED_DATE = "28 jun 2026";

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
  // Branching out post-grant → mixed
  { date: "2026-06", family: "orange", note: "Since the grant: started Google's cybersecurity certificate, a Procreate drawing course on Skillshare, reading a lot about agentic systems. Professionally quieter than usual, which is fine." },
  // BDI grant + Technical AI Safety course → AI safety
  { date: "2026-06", family: "blue",   note: "BDI grant came through. Starting BlueDot's Technical AI Safety course — mechanistic interpretability, RLHF, evaluations, AI control." },
  // BlueDot cohort close → AI safety
  { date: "2026-05", family: "blue",   note: "Wrapped BlueDot's AGI Strategy cohort. Good primer on the strategic frame around the technical work." },
  // Orion search rewrite → AI/ML (LLM eng)
  { date: "2026-05", family: "purple", note: "Rewriting Orion's search system — tool schemas, decision-tree prompts, fewshot disambiguation." },
  // fashion-web redesign → Markets
  { date: "2026-04", family: "ochre",  note: "Used Claude to redesign fashion-web. Broke more than I expected. Still putting it back together." },
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
