# shubzsharma.com

Personal site. Astro + React islands. V5 "field notebook × terminal"
design system.

---

## Editing content (start here)

**[`EDITING.md`](./EDITING.md)** — the contributor cheat-sheet. It maps
every visible piece of the site to the file you'd edit to change it
(home page → `src/data/home.ts`, essays → `src/components/essays/*.tsx`,
etc.). Common tasks (add an essay, swap a thumbnail, update /now,
change a category colour) have step-by-step recipes there.

**Quick map:**

| Page on the site                              | File to edit                            |
|-----------------------------------------------|------------------------------------------|
| `/` homepage                                   | [`src/data/home.ts`](./src/data/home.ts)     |
| `/writing/` essay index                        | [`src/data/writing.ts`](./src/data/writing.ts) + [`src/data/posts.ts`](./src/data/posts.ts) |
| `/work/` annotated CV                          | [`src/data/work.ts`](./src/data/work.ts)     |
| `/now/` current focus + journal                | [`src/data/now.ts`](./src/data/now.ts)       |
| `/contact/` channels + compose form            | [`src/data/contact.ts`](./src/data/contact.ts) |
| `/<essay-slug>/` essay body                    | `src/components/essays/<Name>Essay.tsx` |
| Home "latest" row (LinkedIn / GH heatmap)      | [`src/data/social.ts`](./src/data/social.ts) |
| Polaroid thumbnails                            | `public/thumbs/<slug>.jpg` + register in `posts.ts` |
| Resume PDF                                     | `public/uploads/Shubhangi-Sharma-Resume-…pdf` |

Page components in `src/components/pages/*V5.tsx` are pure renderers —
they import from the `src/data/*.ts` files. **Edit the data file**;
the page picks the change up automatically.

---

## Documentation map

- **[`EDITING.md`](./EDITING.md)** — how to edit any piece of content
  (recipes + quick-map table). The contributor-facing entry point.
- **[`AGENTS.md`](./AGENTS.md)** — voice + diagram rules. Read before
  writing prose. British English, drop-cap lede, sidenotes, place-stamped
  closing line, "no LLM-default phrasings," etc. Cross-vendor convention
  for AI agents (Claude Code, Cursor, Aider, Copilot).
- **[`CLAUDE.md`](./CLAUDE.md)** — Claude-specific intro that points at
  the other three docs. Mostly redirects to `AGENTS.md` for voice and
  `DECISIONS-v5.md` for the colour system.
- **[`DECISIONS-v5.md`](./DECISIONS-v5.md)** — canonical reference for
  the V5 design system. The 10 topic categories + colour mapping +
  per-page accent rules. Read §14 before introducing any new colour or topic.

---

## Local development

```sh
npm install
npm run dev               # localhost:4321
npm run build             # static dist/
npm run preview           # serve dist/ locally
npm run typecheck         # astro check (TS + JSX)
```

---

## Deploy

Vercel auto-detects Astro from `package.json` + `astro.config.mjs`. Push
to `main` → production deploy. Push to any other branch → preview
deploy at `personal-site-git-<branch>-…vercel.app`.

If a Vercel deploy fails with "commit author email not valid," ensure
your git `user.email` is one of the emails linked to the GitHub account
that owns the repo (Settings → Emails). The repo expects
`shubhangixsharma@gmail.com`.

---

## Cross-post tooling

```sh
npm run export:md         # exported/<slug>.md per essay
npm run export:figures    # exported/figures/<slug>-NN.png (Puppeteer)
npm run export:all        # both
```

`.github/workflows/export-essays.yml` wraps the same commands and
uploads the result as a downloadable artefact.

---

## Architecture (one paragraph)

Astro pages in `src/pages/*.astro` are thin layout wrappers. Each mounts
a single React island (`<AppShell page="…">`) defined in
`src/components/pages/AppShell.tsx`. AppShell dispatches to per-page
React components (`HomeV5`, `WritingIndexV5`, `WorkV5`, `NowV5`,
`ContactV5`, `ArticleV5`). Those components are pure renderers — they
import content from `src/data/<page>.ts` and chrome primitives from
`src/components/chrome/NB.tsx`. ArticleV5 dispatches essay slugs to the
matching component in `src/components/essays/`; essays import their figures
and primitives directly.

---

## V5 colour system (one paragraph)

The site uses **10 canonical topic categories**, each owning one of 10
NB pens. Every essay, project, skill, and chip rolls up to exactly one
category and inherits its pen colour:

1. AI safety (blue) · 2. AI/ML (purple) · 3. Mathematics (magenta) ·
4. Physics (prompt-green) · 5. Biotech (red) · 6. Geospatial (teal) ·
7. fintech (ochre) · 8. Hardware (cyan) · 9. Infrastructure (yellow) ·
10. Outreach (orange).

Full rules in [`DECISIONS-v5.md §14`](./DECISIONS-v5.md). Don't invent
new accents; reuse one of the ten.
