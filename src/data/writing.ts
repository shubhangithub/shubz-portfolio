// writing.ts — editable copy for /writing. The WritingIndexV5 component
// reads from this file. Edit copy here; click "edit this page →" in the
// site footer to open this file in GitHub's web editor.

import type { NBAccentKey } from "./palette";
import type { Span } from "./home";

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
export const WRITING_HERO: Span[] = [
  "An essay ",
  { em: "garden", c: "yellow" },
  ", growing ",
  { em: "slowly", c: "yellow" },
  ".",
];

export const WRITING_LEDE =
  "Thinking on the projects I actually built. Some pieces are finished; some are still arguing with themselves.";

export const WRITING_MARGINALIA = {
  lines: ["with lots of", "interactive diagrams,", "obviously."],
  accent: "yellow" as NBAccentKey,
};

export const WRITING_LAST_UPDATED_LABEL = "WRITING · THE GARDEN";
export const WRITING_LAST_UPDATED_DATE = "26 may 2026";

// ---------------------------------------------------------------------------
// DRAFTS — filenames shown in the right-rail "ls -la *.draft.mdx" block
// ---------------------------------------------------------------------------
export const WRITING_DRAFTS = [
  "zx-calculus-ii.draft.mdx",
  "geospatial-vs-temporal.draft.mdx",
];
