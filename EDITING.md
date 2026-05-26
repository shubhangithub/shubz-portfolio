# EDITING.md — where to change what

This is the contributor cheat-sheet for editing the site. Every piece of
content has exactly one canonical location. The page components in
`src/components/pages/*V5.tsx` are pure renderers; **the words you read
on the site live in `src/data/<page>.ts`**. Edit the data file, push,
Vercel rebuilds, the change appears.

This file lives at repo root. The "edit this page →" footer link was
removed deliberately — it leaked dev tooling into the public chrome.
Use this doc instead.

---

## Quick map — page → file

| What you see on the site                          | File to edit                                                  |
|---------------------------------------------------|---------------------------------------------------------------|
| `/`            (homepage)                          | [`src/data/home.ts`](./src/data/home.ts)                       |
| `/writing/`    (essay index)                       | [`src/data/writing.ts`](./src/data/writing.ts) + [`src/data/posts.ts`](./src/data/posts.ts) |
| `/work/`       (annotated CV)                      | [`src/data/work.ts`](./src/data/work.ts)                       |
| `/now/`        (current focus, mini-terminal)      | [`src/data/now.ts`](./src/data/now.ts)                         |
| `/contact/`    (channels + compose form)           | [`src/data/contact.ts`](./src/data/contact.ts)                 |
| `/<essay-slug>/` (any essay body)                  | `src/components/essays/<Name>Essay.tsx`                        |
| Home "latest" row (LinkedIn + GitHub heatmap)      | [`src/data/social.ts`](./src/data/social.ts)                   |
| Polaroid thumbnails on essay rows                  | drop files in [`public/thumbs/<slug>.jpg`](./public/thumbs/) + register slug in `posts.ts` (`ESSAY_THUMB_SLUGS`) |
| Resume PDF                                         | replace [`public/uploads/Shubhangi-Sharma-Resume-…pdf`](./public/uploads/) |

---

## Cookbook — common edits

### Update what I'm doing on /now

Edit [`src/data/now.ts`](./src/data/now.ts). Both pages that show /now
content (the `/now/` page itself and the `cat .now` mini-terminal in
the homepage right rail) read from the **same arrays** — `FOCUSES`,
`JOURNAL`, `CONDITIONS`. Edit once, both surfaces update.

Each entry carries a `family` field that picks a colour from the 10
canonical topic palette (see [DECISIONS-v5.md §14](./DECISIONS-v5.md)).
For example, a journal entry tagged `family: "blue"` shows up in
AI-safety blue everywhere it appears.

### Add a new essay

1. Drop an entry in [`src/data/posts.ts`](./src/data/posts.ts) with
   `slug`, `title`, `dek`, `minutes`, `kicker`, `family`, `nbAccent`.
2. Create the essay body component at
   `src/components/essays/<Name>Essay.tsx`. Use one of the existing
   essays (e.g. `JayaEssay.tsx`) as a template.
3. Register the component in `src/components/legacy.tsx` (existing
   pattern; copy the line for an existing essay).
4. Add the slug to the dispatch in
   [`src/components/pages/ArticleV5.tsx`](./src/components/pages/ArticleV5.tsx)
   (`essayBodyFor` function).
5. Optional: add a thumbnail to `public/thumbs/<slug>.jpg` and append
   the slug to `ESSAY_THUMB_SLUGS` in `posts.ts`.

### Change a colour / pen

Don't introduce new accents. The site uses 10 canonical pens defined
in [`src/data/palette.ts`](./src/data/palette.ts). To recolour an essay,
flip its `nbAccent` field in `posts.ts` to a different key. The hero,
sidenote numbers, figure outlines, toolbox chip provenance — everything
re-tunes automatically.

The full mapping (which colour means which topic) is in
[DECISIONS-v5.md §14](./DECISIONS-v5.md). The pen-and-ink metaphor is
intentional; don't switch to a different colour system without reading
that section first.

### Update the CV PDF

The CV file lives at `public/uploads/Shubhangi-Sharma-Resume-<date>.pdf`.
The path is declared **once** as `CV_PDF` in
[`src/data/work.ts`](./src/data/work.ts) (line ~19) and imported wherever
it's used (work toolbox, home toolbox, footer "↗ open pdf" link, etc.).

**Easiest update — same filename:**

1. Drop the new PDF into `public/uploads/` with the existing filename
   (overwriting the old one).
2. Commit + push. Vercel rebuilds; every "↗ open pdf" link now serves
   the new file. No code edits needed.

**Update with a date-stamped filename (recommended for version trail):**

1. Drop the new PDF in `public/uploads/Shubhangi-Sharma-Resume-<YYYYMMDD>.pdf`.
2. Edit one line in [`src/data/work.ts`](./src/data/work.ts):
   ```ts
   export const CV_PDF = "/uploads/Shubhangi-Sharma-Resume-<YYYYMMDD>.pdf";
   ```
3. Optionally delete the old PDF from `public/uploads/` to avoid stale
   files in the deploy.

Don't forget: **never** add a second `CV_PDF` declaration anywhere. If
you're tempted to hardcode the path in a new file, `import { CV_PDF }
from "./work"` instead — keeps the single source of truth intact.

### Update the CV trajectory

Edit `WORK_EVENTS` in [`src/data/work.ts`](./src/data/work.ts). Each
entry is `{ year, what, where, note }`. The `year` field is free-text
(use what reads best: "Feb 2026", "Apr 2024 —", "Jun – Sep 2023",
"Sep 2020 – May 2023"). Reverse-chronological by recency.

The §02 Trajectory section renders these as an alternating left/right
timeline around a central rule on desktop, single-column on mobile.

### Update selected work / builds

Edit `WORK_BUILDS` in `work.ts`. Each entry:

- `name`        — build name
- `c`           — `NBAccentKey` (the canonical topic colour)
- `scope`       — small-caps tag ("founding-eng", "deployed · solo", etc.)
- `year`        — display string
- `essay`       — slug of the related essay if any (drives provenance link)
- `url`         — external URL (project deploy, GitHub repo)
- `blurb`       — italic description

### Add a skill chip

Edit `WORK_TOOLBOX` in `work.ts`. Locate the right group (Languages /
Tools / Libraries / ML-Data / AI-LLM / Math / Physics / Biotech /
Geospatial / Hardware / Infra / Outreach), append a `{ name, links: […]
}` entry. Each link is `{ label, href }`.

Home's compact toolbox is in `HOME_TOOLBOX` in
[`src/data/home.ts`](./src/data/home.ts) — keep that to 2-3 chips per
category; the full taxonomy lives on /work.

### Update LinkedIn / social row on home

Edit `SOCIAL_POSTS` in [`src/data/social.ts`](./src/data/social.ts).
Each entry is `{ date, platform, text, url, family? }`. Newest first.
LinkedIn doesn't expose a public RSS for personal profiles, so this is
manual; aim for ~weekly cadence.

### Change the GitHub username for the contribution graph

`GITHUB_USERNAME` in `src/data/social.ts`. The graph is fetched at
render time from `ghchart.rshah.org/<accent-hex>/<username>`. Free, no
auth required.

### Edit the hero H1 / bio paragraph / marginalia

Each page has these as exported constants in its data file:

- Home:    `HERO_LINE_A`, `HERO_LINE_B`, `BIO`, `HOME_MARGINALIA`
- Writing: `WRITING_HERO`, `WRITING_LEDE`, `WRITING_MARGINALIA`
- Work:    `WORK_HERO`, `WORK_LEDE_PARTS`, `WORK_MARGINALIA`
- Now:     `NOW_HERO_LINES`, lede pieces, `NOW_MARGINALIA`
- Contact: `CONTACT_HERO_LINES`, `CONTACT_LEDE`, `CONTACT_MARGINALIA`

These use a small `Span` type (defined in `home.ts`, imported by all
pages) for inline-coloured runs of prose. A span is either:

- a plain `"string"` → renders as-is
- `{ em: "word", c: "magenta" }` → italic display-serif fragment in the
  named colour
- `{ tag: "word", c: "ochre" }` → non-italic coloured fragment

Edit the array, the prose updates.

---

## Anatomy of the codebase

Top-level files you might read but rarely edit:

- [`AGENTS.md`](./AGENTS.md)            — voice + diagram rules. Read before writing prose.
- [`CLAUDE.md`](./CLAUDE.md)            — AI-assistant-facing summary; points at this file + AGENTS + DECISIONS.
- [`DECISIONS-v5.md`](./DECISIONS-v5.md) — colour-system canonical reference (10 topic categories, link rules, accent flips, exceptions).
- [`README.md`](./README.md)            — the public README.

Source layout:

```
src/
  data/                ← edit this folder to change copy
    home.ts            ← /
    writing.ts         ← /writing/
    work.ts            ← /work/  (largest — events, builds, toolbox, speaking)
    now.ts             ← /now/   (also drives the home mini-term)
    contact.ts         ← /contact/
    social.ts          ← home "latest" row
    posts.ts           ← per-essay metadata (slug, title, dek, family, accent, thumb registry)
    palette.ts         ← NB palette + theme helpers; rarely edited
  components/
    pages/             ← *V5.tsx pure renderers + AppShell dispatch
    essays/            ← per-essay TSX bodies (where prose lives)
    chrome/NB.tsx      ← V5 chrome primitives (mac chrome, tabs, prompts, mini-term, etc.)
    diagrams/          ← React/SVG/canvas diagrams used by essays
    interactive/       ← cursor, ruler, letter-reveal — shared interactives
    legacy.tsx         ← re-export hub bridging V4 + V5
  lib/
    hooks.ts           ← shared React hooks (useIsMobile, telemetry, etc.)
    essay-meta.ts      ← TOC + sources per essay (right-rail data)
  pages/               ← Astro routes; each mounts <AppShell page="…">
    [slug].astro       ← essay route, static-generated per POSTS slug
    og/[slug].svg.ts   ← OG card SVG, per-essay
  styles/global.css    ← global CSS (V4 + V5 styles, graph-paper bg, keyframes)
public/
  thumbs/<slug>.jpg    ← polaroid thumbnails
  uploads/             ← resume PDF, other downloads
  favicon.{png,svg}    ← favicons
```

---

## Reversibility

V5 is gated behind a single constant. To roll back the entire site to
the V4 look (legacy single-cobalt palette, no field-notebook chrome):

```ts
// src/components/pages/AppShell.tsx
const USE_V5 = true;   →   const USE_V5 = false;
```

Commit + push, Vercel rebuilds, site reverts. V5 files stay in the tree
but unused.

---

## When in doubt

If you're editing copy and can't tell where it lives: search
`src/data/` for a unique phrase from what you see on the page. The
data file will turn up. If it's not there, it's either in an essay
component (`src/components/essays/`) or in NB chrome
(`src/components/chrome/NB.tsx`) — but the chrome is rarely the right
place to edit content.

For colour or topic decisions, [DECISIONS-v5.md §14](./DECISIONS-v5.md)
is the source of truth.

For voice / diagram rules, [AGENTS.md](./AGENTS.md) is the source of
truth.
