# shubzsharma.com

Shubz Sharma — personal site. Astro + React islands.

## Structure

```
.
├── astro.config.mjs           # Astro config (React + MDX + sitemap)
├── package.json               # deps + scripts
├── public/                    # static assets served as-is
│   ├── assets/portrait.png
│   ├── og/default.svg         # default Open Graph card
│   ├── robots.txt
│   └── uploads/               # CV PDF, etc.
├── scripts/                   # cross-post tooling
│   ├── export-markdown.js     # essay → .md (NB: needs porting after MDX migration)
│   └── capture-figures.js     # diagram screenshots via Puppeteer
├── src/
│   ├── components/
│   │   ├── legacy.tsx         # bulk-extracted React app (essays + diagrams + chrome)
│   │   └── pages/AppShell.tsx # routes the legacy app via {page, slug} props
│   ├── data/                  # palette, posts, seasonal — typed TS modules
│   ├── layouts/BaseLayout.astro  # head, meta, OG, canonical, JSON-LD
│   ├── pages/                 # one Astro page per route
│   │   ├── index.astro        # /
│   │   ├── writing.astro      # /writing/
│   │   ├── work.astro         # /work/
│   │   ├── now.astro          # /now/
│   │   ├── contact.astro      # /contact/
│   │   └── [slug].astro       # /<essay>/  (one per POSTS entry)
│   └── styles/global.css      # site-wide CSS (palette vars, base, responsive)
└── .github/workflows/         # cross-post export action
```

## Local development

```sh
npm install
npm run dev               # localhost:4321
npm run build             # static dist/
npm run preview           # serve dist/ locally
```

## Deploy

Vercel auto-detects Astro from `package.json` + `astro.config.mjs`. Push to
`main` → preview/production deploy. No further config needed.

## Cross-post tooling

```sh
npm run export:md         # exported/<slug>.md per essay
npm run export:figures    # exported/figures/<slug>-NN.png (Puppeteer)
npm run export:all        # both
```

A GitHub Action (`.github/workflows/export-essays.yml`) wraps the same
commands and uploads the result as a downloadable artifact.

## Design language

Voice and conventions live in [`AGENTS.md`](./AGENTS.md). Anyone (human or
agent) editing prose, adding an essay, or building a new diagram should read
it first. `CLAUDE.md` redirects to the same file.

## Migration notes

- `src/components/legacy.tsx` is the bulk-extracted React app from the old
  single-file `index.html`. It SSRs cleanly through Astro's React integration
  so the static HTML at each route contains the real prose (good for SEO).
  Hydration via `client:load` on `<AppShell />` keeps everything interactive.
- Phase 2: split `legacy.tsx` into proper `src/components/{chrome,diagrams,
  pages}/*.tsx` modules and convert each essay to MDX in
  `src/content/essays/`. Tracked in TODO.
