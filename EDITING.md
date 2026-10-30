# EDITING.md — where to change what

This is the contributor cheat-sheet for editing the site. Every piece of
biographical record and essay has a canonical source. Page components in
`src/components/pages/` render the data files below; shared V6 labels live
in `src/data/notebook.ts`, while some interaction labels remain beside
their controls. The V6 rebuild is awaiting owner review on localhost.
Review prose locally before committing or publishing it.

Read [`design.md`](./design.md) for current UI guidelines before changing
presentation or interactions. `AGENTS.md` governs voice; `DECISIONS-v5.md §14`
governs topic assignments and provenance colours.

This file lives at repo root. The "edit this page →" footer link was
removed deliberately — it leaked dev tooling into the public chrome.
Use this doc instead.

---

## Quick map — page → file

| What you see on the site                          | File to edit                                                  |
|---------------------------------------------------|---------------------------------------------------------------|
| `/`            (homepage)                          | [`src/data/home.ts`](./src/data/home.ts)                       |
| `/writing/`    (essay index)                       | [`src/data/writing.ts`](./src/data/writing.ts) + [`src/data/posts.ts`](./src/data/posts.ts) |
| `/builds/`     (complete projects and tools)      | [`src/data/work.ts`](./src/data/work.ts) + `COLLECTION_COPY` / `EXHIBITS` in [`src/data/notebook.ts`](./src/data/notebook.ts) |
| `/tty/`        (full terminal)                    | [`src/data/notebook.ts`](./src/data/notebook.ts); commands in `chrome/Notebook.tsx` |
| Pixel companion labels / terminal responses       | `COMPANION_COPY` in [`src/data/notebook.ts`](./src/data/notebook.ts); behaviour in `chrome/RoboCat.tsx` |
| Standing author illustration                      | `NARRATOR_ART` in `chrome/NarratorSprite.tsx`; original art and walk strips stay preserved |
| Shared navigation / chapter furniture             | [`src/data/notebook.ts`](./src/data/notebook.ts) |
| `/work/`       (career, CV and appearances)                      | [`src/data/work.ts`](./src/data/work.ts)                       |
| `/now/`        (current focus, journal and reading)      | [`src/data/now.ts`](./src/data/now.ts)                         |
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

**Journal entries need a `brief`.** The home page's `cat .now`
mini-terminal shows at most the two latest entries, one line each, ten
words or fewer — those lines are the entries' `brief` fields. The full `note` is
what the /now field journal expands to. When adding a journal entry,
write both. The full journal uses `JOURNAL_ENTRIES`, combining `JOURNAL`
and `JOURNAL_ARCHIVE`, two entries per spread. Move older notes into the
archive rather than deleting them. The terminal keeps showing only the
two latest entries.

**Exception — the books.** The book clause in the "Reading" focus and
the Conditions "Reading" row are *not* hand-edited: they derive from
[`src/data/reading.generated.json`](./src/data/reading.generated.json),
which `npm run update:reading` pulls from the Currently Reading shelf on
[Fable](https://fable.co/fabler/shubz-sharma-375148102003). The script
also runs during `npm run build`, so every deploy refreshes it; update
the shelf on Fable, push anything, and the site follows. A failed fetch
keeps the previous JSON rather than breaking the build. The reading shelf
uses the supplied titles, authors and links; the generated feed currently
has no cover-image field, so the jackets are typeset locally.

### Add a new essay

1. Drop an entry in [`src/data/posts.ts`](./src/data/posts.ts) with
   `slug`, `title`, `dek`, `minutes`, `kicker`, `family`, `nbAccent`,
   `publishedAt` (shown as the month on /writing/), and `series` when the
   essay belongs to a labelled run (the AGI Strategy Course set, the monthly
   notes) — consecutive essays sharing a `series` are grouped under it.
   To put an essay on the /writing/ front door, give it `featured` (1 opens
   the page; 2 and 3 are the tabs) and `opening` (its first paragraph,
   verbatim, without sidenote markers), and add its hero figure to
   `src/components/essay/FeaturedFigures.tsx`.
2. Create the essay body component at
   `src/components/essays/<Name>Essay.tsx`. Use one of the existing
   essays (e.g. `JayaEssay.tsx`) as a template.
3. Add the component import and slug to the dispatch in
   [`src/components/pages/ArticleV5.tsx`](./src/components/pages/ArticleV5.tsx)
   (`essayBodyFor` function).
4. Add the slug to `ESSAYS` in
   [`scripts/export-markdown.js`](./scripts/export-markdown.js). Easy to
   miss, and skipping it fails the build — `npm run build` runs the RSS
   generator first, which throws `unknown slug: <slug>`.
5. If the essay has interactive figures, capture their PNGs before
   building: the RSS step needs a file per figure in
   `public/rss-figures/` and errors out without one.
   `npm run export:figures` points at production, where a new essay
   doesn't exist yet — so run the dev server and target that instead:
   ```sh
   node scripts/capture-figures.js <slug> --base http://localhost:4321
   ```
   Commit the resulting `public/rss-figures/<slug>-*.png`. Beware that a
   bare `npm run export:figures` re-renders *every* essay and leaves a
   dozen unrelated PNGs modified; `git checkout --` those before
   committing.
6. Optional: add a thumbnail to `public/thumbs/<slug>.jpg` and append
   the slug to `ESSAY_THUMB_SLUGS` in `posts.ts`.

Also worth adding an entry to `essayMeta()` in
[`src/lib/essay-meta.ts`](./src/lib/essay-meta.ts) — it supplies the
tag line under the title, the table of contents, and the source list.

### Add the monthly note (the mathematical-biology series)

A separate, recurring format from the long essays. One short "Note" per
month, each anchored to a date or person belonging to that month.

Published so far:

| Month     | Slug                   | Subject                          | Anchor                                  |
|-----------|------------------------|----------------------------------|-----------------------------------------|
| May '26   | `may-2026`             | Lotka–Volterra predator–prey     | Robert May; Biological Diversity Day (22 May) |
| June '26  | `turing-morphogenesis` | Reaction–diffusion patterning    | Turing's birthday (23 June 1912)        |
| July '26  | `fisher-wave`          | Fisher–KPP wave of advance       | muskrat spread                           |

House rules for the series:

- **Title ends `· <Month> '<yy>`**; `kicker` is `Note · Mathematical
  biology` (or `· Mathematical ecology`).
- **`family: "biotech"`, `nbAccent: "red"`** — the series is one colour.
  Even when the maths is the point, it stays red.
- **Short.** 4–8 minutes. These are notes, not the long essays.
- **One interactive figure**, usually from
  [`src/components/diagrams/Seasonal.tsx`](./src/components/diagrams/Seasonal.tsx),
  which takes a `theme` (`caption` + `why`) and a `monthName` prop. The
  `why` string is where the month's anchor gets stated.
- **Two `§` sections**: §01 on what the model/sliders teach, §02 on the
  person or date the month belongs to.
- **Closing line** follows the house pattern but names the month:
  `— written in May, in a flat that overlooks no wilderness at all.`
- `publishedAt` on the anniversary where one exists (June used Turing's
  birthday); `related` points at the sibling months.

**Update the homepage alongside a new monthly note.** The V6 sidebar
currently mounts `NotebookFisher` in `HomeV5.tsx`. Swap its import and
component, then update `MARGIN_EXPERIMENT` in `src/data/notebook.ts`
so the visible label and essay link follow it. Compact
`Notebook<Subject>` components live in `src/components/diagrams/`; use the
existing pattern of a small figure with one meaningful animated element.
Set the first `HOME_PINNED_SLUGS` entry in `src/data/home.ts` to the new
note's slug. The legacy `HOME_FIG_*` and shell-command labels are no longer
rendered by the V6 homepage.

Everything else follows the voice rules in
[`AGENTS.md`](./AGENTS.md) and the five wiring steps above.

### Update the "last updated" banner

One date for the whole site: `SITE_LAST_UPDATED_DATE` in
[`src/data/site.ts`](./src/data/site.ts). The shared footer and journal date stamp read it
(the per-page `*_LAST_UPDATED_DATE` constants are aliases). Bump it once
per editing session — format `"dd mmm yyyy"`, lowercase month. Don't
reintroduce per-page dates.

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
it's used, including the Work CV slip and collection provenance links.

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

Edit `WORK_EVENTS_V5` in [`src/data/work.ts`](./src/data/work.ts). Each
entry is `{ year, what, where, track, cat, big, lenses, note }`. The
`year` field is free-text (use what reads best: "Feb 2026", "Apr 2024 —",
"Jun — Sep 2023", "Sep 2022 — May 2023"). Reverse-chronological by recency.

The Walk includes every `WORK_EVENTS_V5` entry, ordered by
`ganttSpan(year, ganttFrom).start` with source order breaking equal-date ties.
Its year-grouped selector jumps directly to any entry; the slider, previous/
next, play and optional scroll-follow all traverse the same complete array.
Scroll-follow uses entry index so equal-date roles remain reachable. Source
dates retain their precision; `ganttFrom` places the BSc period at Aug 2019
while its original graduation label stays May 2023. City captions use only
explicit place text in the record; other entries use a neutral Field notes
scene. Exact `?entry=` links synchronise the Walk and annotated record,
including history; revealing a full record writes its link and focuses it.
The annotated record preserves track filters and every full note. The old
Gantt is not rendered; its grouping fields remain for compatibility.

If a new date format does not parse, extend `ganttEndpoint` in `work.ts`.
The three city drawings and sprite integration live in
`src/components/work/WalkScene.tsx`; saved character art is in
`public/art/sprites/`.

### Update selected work / builds

The collection at `/builds/` combines `WORK_FEATURED_V5` and
`WORK_BUILDS_LIST_V5` from `src/data/work.ts`. Entries retain `name`,
`cat`, `scope`, `url`, `essay`, `blurb`, `metrics`, and, for featured
projects, `private` / `deploy`. Category filters use the canonical ten
pens; search matches project names, descriptions, scopes and topics.
`WORK_PHOTOS` and `CONTACT_PHOTO` supply the three-photo contact sheet.
Projects render as expandable files rather than a wall of cards.

The two live exhibit labels and destinations are in `EXHIBITS` in
`src/data/notebook.ts`. `BuildsV6.tsx` maps these to the existing LMSR and
JAYA diagrams, imported only when the visitor opens a glass case.

### Add a skill chip

Edit `WORK_FULL_GROUPS` in `work.ts`: choose its canonical category and
append a skill name to `items`. The collection cabinet renders one drawer per category and search opens
matching drawers across the full inventory. `WORK_CORE_CARDS` supplies the
14 signature provenance records, attached to their matching tool rather
than repeated in a second grid. When the record title differs from the
inventory name, `CORE_TOOL_BINDINGS` in `notebook.ts` maps it to one item.
Unannotated items link to the shared `CV_PDF`. The homepage now has ten physical pens linking to collection
filters instead of a duplicate toolbox.

### Update LinkedIn / social row on home

Edit `SOCIAL_POSTS` in [`src/data/social.ts`](./src/data/social.ts).
Each entry is `{ date, platform, text, url, family? }`. Newest first.
LinkedIn doesn't expose a public RSS for personal profiles, so this is
manual; aim for ~weekly cadence.

### Change the GitHub username for the contribution graph

`GITHUB_USERNAME` in `src/data/social.ts`. `react-github-calendar` fetches
contributions from `github-contributions-api.jogruber.de` after client
mount. `HomeV5.tsx` retains the most recent six months and colours the
levels with the canonical yellow pen. A profile link remains available
if the service fails; there is no authentication requirement.

### Edit the hero H1 / bio paragraph / marginalia

Each page has these as exported constants in its data file:

- Home:    `NOTEBOOK_COPY` in `notebook.ts`; `HERO_LINE_A`, `HERO_LINE_B`, `BIO` in `home.ts`
- Writing: `WRITING_HERO`, `WRITING_LEDE`, `WRITING_MARGINALIA`
- Work:    `WALK_COPY` in `notebook.ts`; career events in `work.ts`
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
    work.ts            ← /work/ + /builds/ (profile, events, projects, tools, photos)
    notebook.ts        ← V6 navigation, pens, shared/page labels, exhibit metadata
    now.ts             ← /now/   (also drives the home mini-term)
    contact.ts         ← /contact/
    social.ts          ← home "latest" row
    posts.ts           ← per-essay metadata (slug, title, dek, family, accent, thumb registry)
    palette.ts         ← NB palette + theme helpers; rarely edited
  components/
    pages/             ← V5/V6 renderers + AppShell and ArticleAppShell
    essays/            ← per-essay TSX bodies (where prose lives)
    chrome/Notebook.tsx ← shared notebook shell, objects, terminal
    chrome/NarratorSprite.tsx ← day/night standing art + original walk strips
    chrome/RoboCat.tsx  ← SVG companion, accessible controls, session preferences
    chrome/NB.tsx      ← retained essay primitives; shared-shell adapter
    diagrams/          ← React/SVG/canvas diagrams used by essays
  lib/
    hooks.ts           ← shared React hooks
    usePageState.ts    ← hydration-safe theme + navigation state
    essay-meta.ts      ← TOC + sources per essay (right-rail data)
  pages/               ← Astro routes; notebook pages mount AppShell
    [slug].astro       ← essay route; SSR ArticleAppShell per visible slug
    og/[slug].svg.ts   ← OG card SVG, per-essay
  styles/global.css    ← base/essay styles, retained legacy scene CSS
  styles/notebook.css  ← V6 layout, physical objects, responsive/reduced-motion rules
  styles/workbench.css ← neon workbench, narrator and SVG companion states
public/
  thumbs/<slug>.jpg    ← polaroid thumbnails
  uploads/             ← resume PDF, other downloads
  favicon.{png,svg}    ← favicons
```

## When in doubt

If you're editing copy and can't tell where it lives: search
`src/data/` for a unique phrase from what you see on the page. The
data file will turn up. If it's not there, it's either in an essay
component (`src/components/essays/`), a page interaction, or shared chrome
(`src/components/chrome/Notebook.tsx` / `NB.tsx`) — but the chrome is rarely the right
place to edit content.

For colour or topic decisions, [DECISIONS-v5.md §14](./DECISIONS-v5.md)
is the source of truth.

For voice / diagram rules, [AGENTS.md](./AGENTS.md) is the source of
truth.


## Discovery: complete index, network and Find

`/builds/` defaults to all 13 projects. The curated tour and home shortcut
cards are removed. Legacy `?path=` / `?case=` / `?view=guide` URLs show the
complete index. `src/data/guide.ts` now contains only shared index/network
metadata and labels; it selects no content. The raw source arrays remain
authoritative.

The complete network is optional at `/builds/network/`. Its dedicated
`NetworkPage.tsx` island renders the actual SVG in the initial static response;
the default index keeps the network module and physics unloaded. `graph.ts` derives stable type-prefixed nodes from source records;
`NotebookGraph.tsx` adds a notebook root with ownership edges. All 196 nodes
and 230 membership/reference edges appear together. Only existing project or
core-tool essay references create dashed edges; layout proximity implies no
factual relationship. `networkLayout.ts` uses seeded spring/repulsion physics.
Selection/search retain spatial context, explicit type filters hide records,
and dragging, zooming, fit/reset and the accessible list remain available.
Old `?view=graph`, `?node=` and `?lens=` URLs on `/builds/` redirect in the head
to this stable entry, preserving query/hash and the higher priority of project,
tool, subject and explicit index destinations. Network selection history uses
`/builds/network/?node=<id>&lens=<type>`. Both static routes have intentional
canonical URLs; query variants canonicalise to their corresponding route.

`BuildsV6.tsx` also retains complete indexes at `?view=projects`, `?view=tools`
and `?view=lab`. `?topic=<pen>` combines records under their original category
assignments. One project renderer and one tool renderer serve all index modes.
Exact Find links and legacy `#catalogue` / `#tools` anchors remain supported.
`?view=lab&exhibit=market#exhibit-market` opens the working LMSR case directly.

`discovery.ts` projects all published essays, projects, tools, career
entries, twelve profile fields, journal notes, current focuses and contact
channels into Find. Empty search shows seven pages only. `searchFieldIndex`
ranks exact titles, title prefixes, title phrases, title-word matches and then
body-only matches, preserving source order for ties. Search includes original
full text, while result previews are compact. Each result opens its exact
original record; drafts and hidden posts are excluded. Do not import graph data here: graph uses the shared anchor helpers.

`FieldIndex.tsx` supplies the native dialog and Cmd/Ctrl K. Escape closes even
when a search input has text; closing restores focus. Subject-atlas counts
remain derived from the existing essay/project/tool categories. Index labels
live in `DISCOVERY_COPY` in `notebook.ts`.

Home preserves all twelve original context fields in the office scene,
with a direct About anchor. Now provides Current work / Journal / Reading
anchors; its last-written date remains visible on phones. Its current desk
combines all five focus notes and the real reading shelf in one kinetic mobile,
with source conditions below. The chronological journal
uses a manually turned journal, with every entry reachable through page and year controls.
`?entry=7` selects that exact note, `?year=2025` jumps to its year, and legacy
one-based `?page=7` selects note12 (the first of that former spread). History
restores these targets. Explicit top section jumps clear entry/page/year
parameters so refresh and Back/Forward return to the intended section.
Career controls precede the scene in both DOM and visual order. Existing
photographs remain with the Work record.

Writing presents every published essay on an illustrated light-table using its
existing thumbnail, original title/dek and subject pen. Search and topic
filters cover the complete published set; unfinished work is excluded. No editorial shortlist is applied. Reading on
Now uses source titles/authors and the saved Fable snapshot, not fabricated
cover art. New page furniture is in `EDITORIAL_COPY` in `notebook.ts`.

## Interaction sound

`WorkbenchSound.tsx` owns the shared Web Audio provider and short cue frequencies.
Use `useWorkbenchSound().play(cue)` inside a deliberate interaction handler, never
in a mount effect, timer or scroll listener. The default is muted; localStorage's
`notebook-sound` remembers only the user's on/off preference. Audio is quiet,
rate-limited and synthesised locally. Muting immediately silences active voices;
Pixel's quiet mode suppresses its own cue. No sound files are fetched.

### Interaction polish

Local project/tool searches keep the selected subject; Clear search restores focus to that input. Writing’s Reset filters clears both query and subject. Shared labels live in `FILTER_COPY` in `src/data/notebook.ts`. The contact letter focuses its handoff heading after folding and the preserved message after Edit.

### Network display motion

`src/lib/useNetworkMotion.ts` adds bounded display offsets to the seeded network
layout. It updates SVG nodes and their edge endpoints together without React
animation renders or repeated force simulation. Pause freezes the view; reduced
motion restores static coordinates. Hidden tabs and offscreen canvases stop the
animation loop. Keep these coordinates in sync with pointer drag origins.

### Illustrated field kit and studio sketchbook

`src/components/objects/FieldKit.tsx` presents all twelve `ABOUTFETCH_ROWS`
without changing their values, links or context prose. Objects toggle independent
native disclosures; profile fragments retain their original IDs. The full BIO
remains below the kit. `FieldObject.tsx` contains the original SVG pen studies;
`src/data/fieldKit.ts` maps fields/current focuses/year sketches to their objects.
The year-opening study links point to actual journal entries, not a new curated
subset. Sketches match their source date and a distinctive text marker, so
prepending notes preserves their destinations; new years or missing matches
render safely without a sketch. Update the marker only if that source note is
rewritten. The labelled field selector resolves all twelve source fields within eight objects and
uses the same profile hashes, disclosure state and history as direct links.

`src/styles/field-studio.css` scopes the kit, ring-bound current-work spread,
margin conditions and sewn journal pages. All fourteen journal notes remain in
DOM order, with the existing exact entry/year/legacy page URLs. Phone pages unfold
vertically. Reading titles/authors remain the saved Fable data; drawings are
illustrations, not fetched cover images or documentary artifacts.

### Illustrated project sheets

`src/data/projectStudies.ts` maps the thirteen original project names to
qualitative object studies and short captions. `ProjectStudy.tsx` renders their
SVGs at summary and open-sheet sizes; `src/styles/project-folio.css` scopes the
sheets, subject pen register and field-kit subject links. Keep the original
project descriptions, metrics and destinations in the work data. The same
project renderer serves the complete and subject-filtered indexes.

These drawings illustrate project subjects, not measured charts or additional
claims about their implementation. Pen-register totals derive from projects,
tools, published essays and career entries; accessible labels expose
the breakdown. “Follow this ink” links use each field object's existing pen
assignment and mean shared subject, not project provenance. Tall direct-linked
project sheets scroll to their title with header clearance; short targets
retain centred scrolling.

### Paperclips and essay bookmarks

`src/data/paperclips.ts` projects the original thirteen projects and published
posts into source IDs, titles, pens and exact links; hidden posts and drafts
are excluded. Labels live alongside this projection. `Paperclips.tsx` provides
the shared shell context, save buttons and native tray dialog. The browser key
`notebook-paperclips-v1` stores only validated IDs. Malformed or obsolete IDs
are ignored, inaccessible storage falls back to the current page, and storage
events synchronise other tabs. Never put save buttons inside a card anchor.
The Writing preview places a compact save control beside its Read link.
The portalled native dialog explicitly wraps Tab/Shift+Tab; closing returns
focus to the trigger, while same-page record activation focuses its destination.

`BookmarkRuler.tsx` reads the actual headings inside ArticleV5's `#essay-body`,
preserves any existing heading IDs and assigns stable slug/section IDs where
needed. It also includes the title and actual drop-cap opening. No essay text
is rewritten. Hash/history restoration uses cancelled/coalesced animation frames
after native scroll restoration and the article's initial reset; unrelated hashes
remain browser-owned. User jumps focus the target and respect reduced motion.
Desktop uses a capped scrollable section list; phone uses a labelled native
selector, with one ruler mounted at a time. `src/styles/reading-tools.css` scopes
both features.

### Not-found page

`src/pages/404.astro` renders the small `NotFound.tsx` island with the shared
NotebookShell, theme, Find and Clips. Its `not-found` navigation state marks
no primary link active. Existing explanation copy lives in `src/data/notFound.ts`;
the four published essay fallbacks come directly from `VISIBLE_POSTS` in their
existing order. `not-found.css` uses the shared pens, neutral tokens and UI font.

### Home desk and portrait

Home's original photograph is selected by `HOME_PORTRAIT` in `src/data/home.ts`.
`src/styles/home-desk.css` keeps its frame beside the introduction and brings
the notebook and narrator together in `DeskScene`. The sticky-note quote and
top author caption are removed. Keep the open-book close control in normal
flow and the footer caption clear of Pixel.

### Responsive essay figures

`FigureReact.tsx` renders figures immediately and keeps them inside the essay
column. Preserve the independent diagram controls when adjusting this wrapper.
`repo-evolution.css` stacks the repository comparison based on its container
width. `essay-responsive-diagrams.css` contains the assumptions matrix scroll
region and narrow phase layout. Matrix row buttons expose the same explanations
as hover. Diagram control rows wrap; intrinsic content must not widen the essay
column or rely on the page's overflow hiding. Original essay prose and diagram
data remain in their existing sources.

### Office scene and walk context

The About office sits directly after the home introduction. `FieldKit.tsx`,
`office-scene.css` and labels in `fieldKit.ts` own its composition. Its twelve fields
retain their original context; the long professional biography was removed at
the owner’s request. Keep London as home and London + San Francisco as the
current working locations. `WorkEventV5.location` supplies an explicit confirmed
location when available; the walk otherwise uses recognised cities or the
record’s original `where` context, never a “Field notes” location placeholder.

### Moving background grid

`src/components/chrome/WorkbenchGrid.tsx` owns the canvas, motion preference
shared through `NotebookShell` (no visible grid control or stored pause). Its scoped styles are in
`src/styles/workbench-grid.css`.
Use canonical palette tokens. Pointer deformation, phone scroll response,
the matching crease highlight, reduced-motion changes and hidden-tab suspension need
verification when changing the renderer. The canvas never handles touch input.

### Grouped office, public writing and journal timeline

The office groups role/previously, research/funded by/research log, and
reading/offline. Eight objects expose all twelve original field contexts;
`FieldKit.tsx` owns profile-hash restoration. Home no longer duplicates it.
`VISIBLE_POSTS` and `findPost` expose only published, non-hidden posts.
`isAvailableSiteLink` suppresses provenance links to unavailable essay routes.
Draft source stays local; there must be no public draft drawer, count or route.

`JournalReel.tsx`, `journal-reel.css` and `journalPresentation.ts` own the
manually turned journal. NowV5 retains entry/page/year URL handling. The book
uses a stitched spine and perspective page turn; arrows, horizontal swipes and
year links choose notes. The removed intro/dropdown toolbar stays removed;
There is no duplicate list below the book. Scrolling never changes the page. Reduced
motion swaps instantly; print and initial HTML expose all entries. Do not rewrite
journal prose as part of animation work.

Unpublished metadata is retained in `the private editorial inventory`, which must
not be imported into public client code. Publishing an entry means moving its
reviewed record into `posts.ts`, clearing its draft/hidden flag, adding its
article dispatcher case and removing its slug from `UNAVAILABLE_POST_SLUGS`.
This keeps draft titles and descriptions out of the shipped JavaScript too.

Writing’s essay workbench is in `WritingIndexV5.tsx` and
`writing-light-table.css`; `writingDesk.ts` supplies labels. The connection trace
is measured between the selected slot and reading panel. Preserve title links,
filter/history state, phone return focus and paperclip controls.

Contact’s portrait reuses `HOME_PORTRAIT`. `ContactPost.tsx` and
`contact-post.css` own the courier and envelope destinations, using the existing
`CONTACT_CHANNELS` URLs. Verify native links, keyboard focus, narrow screens and
reduced-motion flight behaviour when editing the scene.

`NowArtifact.tsx` and `now-artifact.css` own the combined current-activities and
reading mobile. Five source focuses and the generated book shelf select one
notes panel. `NowV5.jumpSection` dispatches hashchange after pushState so the
artifact's selected object matches reload and Back/Forward. Keep `focus-N`,
`reading-book-N`, `reading-shelf` and `current-work` destinations working.

`HomeWorkbench.tsx` and `home-workbench.css` own the home carousel and bridge
note. `HomeV5` keeps Oxford/current work in one paragraph and places project and
essay sections side by side. Carousel slides stay mounted and inactive slides
are inert; preserve typed terminal state and the GitHub fallback. The home book
cover is restyled in `home-desk.css`. `CourierBird` is shared between Contact's
portrait and its destination links. Now's motion has no visible toggle; retain
its reduced-motion, hidden-tab and offscreen suspension.

`PixelStation` in `RoboCat.tsx` is the reusable contextual companion. Scene copy
and poses live in `data/pixel.ts`, presentation in `pixel-context.css`. Each page
passes only its `scene`; do not add repeated status text or navigation CTAs. The existing
`CompanionProvider` shares rest/quiet/hide for the session; do not add per-page
settings or duplicate providers. Keep station updates out of aria-live regions.
When changing integrations, check cross-route preferences, focus
after hide/restore, reduced motion and desktop/phone bounds.

### Mobile release verification — 29 October 2026

Checked all eight published essays and seven main/explorer routes at 320, 390
and 430px in both themes, including top, middle and bottom scroll positions:
90 route/viewport/theme combinations without horizontal overflow or browser
exceptions. Touch checks cover notebook opening, carousel selection, all office
objects, current activities and books, journal buttons and swipes, graph pan and
selection, and the contact pigeon. Preserve these interactions on phones and
honour reduced motion without removing the objects or their information.
The production `npm run build` and Astro check pass. Screenshot and interaction
evidence is in Downloads/personal-site-evidence/2026-10-29/final-touch and
mobile-release.json. Previous production main (68bf003) is preserved remotely as
`backup/main-before-v6-2026-10-29` before this release.
The release reading sync added Meditations. A follow-up mobile shelf spacing
fix preserves full titles and authors above the detail panel with three books.

#
## Public snapshot

This repository contains published site content. Local editorial previews and
production reaction storage are omitted. See README.md for development.
