// writing.ts — editable copy for /writing. The WritingIndexV5 component
// reads from this file. Edit copy here; the page updates automatically.

import type { NBAccentKey } from "./palette";
import { SITE_LAST_UPDATED_DATE } from "./site";
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
  "Thinking on the projects I actually built.";

export const WRITING_MARGINALIA = {
  lines: ["with lots of", "interactive diagrams,", "obviously."],
  accent: "yellow" as NBAccentKey,
};

export const WRITING_LAST_UPDATED_LABEL = "WRITING · THE GARDEN";
export const WRITING_LAST_UPDATED_DATE = SITE_LAST_UPDATED_DATE;
