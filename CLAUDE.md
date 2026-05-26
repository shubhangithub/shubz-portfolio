# CLAUDE.md

See [`AGENTS.md`](./AGENTS.md) for the canonical design + voice guidelines.

This file exists so Claude Code picks up the rules automatically. The actual
content lives in `AGENTS.md` (cross-vendor convention — Cursor, Aider, Copilot,
and Claude Code all read it).

**V5 colour system (mandatory read before any styling work):**
See [`DECISIONS-v5.md`](./DECISIONS-v5.md) §14. The site uses **10 canonical
topic categories**, each owning one of the 10 NB pens defined in
[`src/data/palette.ts`](./src/data/palette.ts). Every essay, project, skill,
chip, or new piece of content must roll up to exactly one of those ten:

1. AI safety (blue) · 2. AI/ML (purple) ·
3. Mathematics (magenta) · 4. Physics (prompt-green) · 5. Biotech (red) ·
6. Geospatial (teal) · 7. fintech (ochre) ·
8. Hardware (cyan) · 9. Infrastructure (yellow) ·
10. Outreach (orange)

The colour is the internal taxonomy. Sub-topics roll up — e.g. an essay
on "ecology" or "immunology" both colour as biotech red; "category theory"
and "graph theory" both colour as math magenta. When adding anything new,
pick the primary meta-topic, set `POSTS[i].family + nbAccent` for essays,
or the parent group's `primary` for toolbox chips. Don't invent new accents.

**Editing page text — data-file pattern (V5):**

Each page's copy lives in `src/data/<page>.ts`:

- `src/data/home.ts`      → /
- `src/data/writing.ts`   → /writing/
- `src/data/work.ts`      → /work/        (biggest: events, builds, toolbox, speaking)
- `src/data/now.ts`       → /now/         (focuses, journal, conditions + hero)
- `src/data/contact.ts`   → /contact/
- `src/data/social.ts`    → home "latest" row + GitHub graph username
- `src/data/posts.ts`     → essay metadata + thumbnail index

The page components in `src/components/pages/*V5.tsx` are pure renderers
that import constants from these data files. **To change copy:** edit the
data file. Don't touch the TSX unless you're changing layout.

**Full contributor guide:** [`EDITING.md`](./EDITING.md) at repo root —
detailed map of every editable surface, common cookbook tasks (adding an
essay, swapping a thumbnail, updating /now content, etc.), and the
codebase anatomy. Point new contributors at that file; it replaces the
old in-footer "edit this page →" link (removed to keep the public chrome
clean).

**TL;DR for Claude:**

- Read `AGENTS.md` + `DECISIONS-v5.md §14` before any styling or content work.
- Read the existing `JayaEssay` end-to-end before writing any new essay.
- Two custom diagrams per essay, palette-token colours only (per-essay accent).
- Drop-cap lede, mono `§` section numbers, `<PullQuote>`, sidenotes, italic
  place-stamped closing line.
- British English. No LLM-default phrasings ("leverage," "robust," "delve,"
  "tapestry," etc.).
- Site is Astro + React islands (post-`astro-migration`). New work goes in
  `src/components/pages/*V5.tsx`; V4 stays in place behind a `USE_V5` flag
  in `AppShell.tsx` for one-line revert.
- Adding an essay touches: diagram components, `<Slug>Essay`, `essayMeta()`,
  `POSTS` (with `family` + `nbAccent`), `ArticleV5` dispatcher. All five.
- New skill / project / role goes in the relevant `WORK_TOOLBOX` group in
  `WorkV5.tsx` (and optionally `HOME_TOOLBOX` for prominent ones).

If the rules in `AGENTS.md` / `DECISIONS-v5.md` and a user request conflict,
surface the conflict to the user before proceeding.
