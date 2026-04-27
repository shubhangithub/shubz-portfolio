# CLAUDE.md

See [`AGENTS.md`](./AGENTS.md) for the canonical design + voice guidelines.

This file exists so Claude Code picks up the rules automatically. The actual
content lives in `AGENTS.md` (cross-vendor convention — Cursor, Aider, Copilot,
and Claude Code all read it).

**TL;DR for Claude:**

- Read `AGENTS.md` before touching `index.html`.
- Read the existing `JayaEssay` end-to-end before writing any new essay.
- Two custom SVG diagrams per essay, palette-token colours only.
- Drop-cap lede, mono `§` section numbers, `<PullQuote>`, sidenotes, italic
  place-stamped closing line.
- British English. No LLM-default phrasings ("leverage," "robust," "delve,"
  "tapestry," etc.).
- Single-file HTML, no build step. New work goes in the V4 section.
- Adding an essay touches: diagram components, `<Slug>Essay`, `essayMeta()`,
  `ArticleV4` dispatcher, `POSTS`. All five. In that order.

If the rules in `AGENTS.md` and a user request conflict, surface the conflict
to the user before proceeding.
