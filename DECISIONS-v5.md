# DECISIONS — V5 "Field notebook × terminal" port

Record of what I chose and why while porting the V5 design (handoff
bundle in `design_handoff_v5_field_notebook/` outside the repo) into the
existing Astro + React-islands codebase. Read this before reviewing the
diff — it explains intent, not just code.

Branch: `v5-field-notebook` (off `origin/main` at commit `e117f3d`).

---

## 1. Reversibility — the most important decision

**Single-line revert.** `src/components/pages/AppShell.tsx` has a `USE_V5`
constant at the top. Flip to `false` → the entire site falls back to V4.
No other file change needed.

Why this matters:
- All V4 files (`HomeV4.tsx`, `WritingIndexV4.tsx`, …, `legacy.tsx`,
  V4 chrome, V4 palette tokens) are **untouched**.
- All V5 work is **additive** — new files in `src/components/chrome/NB.tsx`,
  `src/components/pages/*V5.tsx`, plus appended-only edits to three files
  (`palette.ts`, `posts.ts`, `global.css`).
- If V5 breaks production, the rollback is one prop flip and a re-deploy.
- Once V5 is signed off and we want to drop V4 entirely, that's a separate
  PR that deletes the V4 files. Doing it in one commit would make rollback
  much harder.

---

## 2. What's preserved vs. what changed

> User instruction: *"don't erase my data, these are only style guides."*

**Preserved verbatim:**
- All essay bodies (`src/components/essays/*Essay.tsx`) — zero changes.
  V5 wraps them in new chrome via a palette adapter (§4).
- All MDX content (`src/content/essays/*.mdx`) — untouched.
- All `/data/now.ts` content (FOCUSES, JOURNAL, CONDITIONS) — NowV5 reads
  the same arrays.
- All `/data/posts.ts` essay entries — new fields added (§3), but no
  existing field removed or changed.
- All V4 chrome and page components — left in place for rollback.
- The Astro layout (`BaseLayout.astro`), routing (`src/pages/*.astro`),
  diagrams (`src/components/diagrams/*`), and `setCursorColor`/cursor
  tracker — unchanged.

**Net-new content I authored** (called out so you can swap with your own copy):
- Home toolbox chip-grid items (Languages / Methods / Studios / Off-keyboard
  in `HomeV5.tsx`). The design handoff specified the shape; I picked the
  individual rows from the V5 prototype's data.
- Home builds card (`HomeV5.tsx`, `HOME_BUILDS` array) — three current
  deployed projects with one-liner blurbs.
- Writing index "working notes" rows (`WritingIndexV5.tsx`,
  `WORKING_NOTES`). Three example rows from the V5 prototype's data.
- Writing index drafts list (`WritingIndexV5.tsx`, `DRAFTS`). Two example
  draft filenames; swap with real ones.
- Marginalia copy ("first solve it on paper. then in code." on Home;
  "every essay has a hand-coded diagram. no D3." on Writing; etc.). All
  from the V5 prototype.
- Last-updated stamp date (`26 may 2026` everywhere). Hardcoded — should
  be wired to a real "last touched" timestamp eventually.
- Telemetry JSON pre-block in NowV5 (London lat/lon). Static values.
- PGP fingerprint section in `ContactV5.tsx` — **omitted**. The V5
  prototype showed a placeholder fingerprint; rather than invent one,
  I dropped the block entirely. Re-add when you have a real key.

---

## 3. Data model — `posts.ts` extension

Per the V5 spec, each essay carries a **topic family** + a per-essay accent
key. The V4 single-cobalt `accent` field needed to be replaced — but V4 is
still running, so I added new optional fields instead of swapping:

```ts
type Post = {
  // ... existing V4 fields untouched ...
  family?: "ai" | "quantum" | "bio" | "optim" | "markets" | "ml" | "ecology" | "physics";
  nbAccent?: NBAccentKey;  // → resolves against NB_LIGHT / NB_DARK in palette.ts
};
```

Slug → accent mapping (from the V5 spec's topic-family table):

| Slug                      | Family    | nbAccent   |
|---------------------------|-----------|------------|
| `bluedot-unit1`           | ai        | `blue`     |
| `zx-calculus`             | quantum   | `prompt`   |
| `jaya`                    | optim     | `orange`   |
| `fashion-trends`          | markets   | `ochre`    |
| `threshold-gate`          | bio       | `magenta`  |
| `constraint-clustering`   | bio       | `red`      |
| `six-engines`             | ml        | `purple`   |
| `may-2026`                | ecology   | `teal`     |

`threshold-gate` and `constraint-clustering` are both `bio` — magenta and
red per the V5 spec's "two essays in a family → use sibling shade" rule.

If you add a new essay later: pick a `family`, assign the family's primary
colour as `nbAccent`. Only fall back to a sibling shade when the family
already has two adjacent essays in the same primary colour.

---

## 4. Palette adapter for unchanged essay bodies

Essay TSX components (`JayaEssay.tsx`, etc.) expect the V4 palette shape:
`{ accent, ink, paper, line, muted }`. Rather than rewrite them, `ArticleV5`
synthesises that shape from the NB theme + the essay's `nbAccent`:

```ts
const essayPalette = {
  paper: t.paper,
  ink: t.ink,
  muted: t.muted,
  line: t.rule,       // V4's "line" → NB's "rule"
  accent,             // = t[post.nbAccent]
};
<Body palette={essayPalette} />
```

This means **every essay's chrome (figures, pull quotes, sidenote numbers,
inline code blocks) automatically picks up the per-essay accent** without
touching essay source. Zero churn on essay files.

---

## 5. Pinned essays on the home page

V5 design pins three essays at the top of Home. I went with `POSTS.slice(0, 3)`
— first three in the POSTS array, currently `bluedot-unit1`, `zx-calculus`,
`jaya`. Matches the V5 prototype's `nbEssays` ordering.

If you want a different pinning rule (e.g. "newest 3", "editor's pick"),
the `pinned` variable in `HomeV5.tsx` is two lines — easy to swap to
`POSTS.slice(-3).reverse()` or to a hardcoded slug list.

---

## 6. Polaroid thumbnails

V5 spec calls for real PNGs at `public/thumbs/<slug>.png`. None exist yet
(per spec — "user will supply"). `NBThumb` falls back to a striped
accent-coloured placeholder with a 3-letter mono label.

When you drop in real PNGs:
- pass `src={`/thumbs/${slug}.png`}` from `HomeV5` and `WritingIndexV5`
- the striped placeholder vanishes automatically

I didn't add the `src` prop to the existing thumb usages because the PNGs
aren't there yet — would produce 404s in browser dev tools.

---

## 7. Mode toggle wiring

V5 chrome has no explicit theme switcher — the `light · 100×42` /
`dark · 100×42` label in the mac chrome doubles as a click target. I wired
that label to `toggleTheme` so the existing pre-paint script + localStorage
plumbing in `BaseLayout.astro` keep working. No regression to the existing
dark-mode flow.

---

## 8. Mobile responsiveness

V5 is a desktop-first design (1440×2300 canvas in the handoff). I added a
single mobile breakpoint via the existing `useIsMobile()` hook (768px). On
mobile each page:
- collapses the right rail under the main column
- shrinks the H1 via `clamp()`
- replaces fixed-width 12-col grids with single-column stacks
- horizontally scrolls the tab strip if it overflows
- hides the marginalia (positioned absolute on desktop; doesn't fit narrow)
- drops the polaroid thumbnails next to essay rows (would be too wide)
- shrinks per-build "where" / "year" metadata into stacked lines

The mobile pass is "good enough"; not a from-scratch mobile design. If you
want a tighter mobile pass, list it as a follow-up.

---

## 9. Tab strip — current page detection

V5 tabs are `~/home`, `~/writing`, `~/work`, `~/now`, `~/contact`. The
essay page uses `current="essay"` but the tab strip highlights `~/writing`
in that case (since essays live under `/writing/<slug>/` logically even
though Astro routes them as `/<slug>/`).

---

## 10. NB primitives bundled in one file

`src/components/chrome/NB.tsx` contains all 12 V5 primitives — `NBPageShell`,
`NBMacChrome`, `NBTabStrip`, `NBLastUpdated`, `NBPrompt`, `NBPromptHead`,
`NBBlinker`, `NBThumbtack`, `NBThumb`, `NBMarginalia`, `NBStatusFooter`,
`NBMiniTerm`, `NBDiagramPlaceholder`.

The existing convention is one-component-per-file. I deviated because:
- The handoff structures it the same way (`nb-shared.jsx` is a single bundle)
- The primitives reference each other (NBPageShell calls NBMacChrome,
  NBTabStrip, NBStatusFooter) — keeping them adjacent reduces import noise
- Reversibility benefit: one file to delete on rollback

If review prefers per-file, splitting is a mechanical refactor.

---

## 11. AGENTS.md / CLAUDE.md

The V5 handoff included a draft AGENTS-v5.md that supersedes V4's rules in
several places (per-essay accent vs site-wide cobalt; shell prompts above
section headings; marginalia; etc.). I did **not** update the in-repo
`AGENTS.md` or `CLAUDE.md` yet — both still reference `index.html` (the
pre-Astro state). Suggested follow-up: apply the V5 patch to AGENTS.md
once V5 is signed off, and add Astro-aware guidance.

---

## 12. What I did NOT do

- Did not delete any V4 component, palette, or data field.
- Did not add real polaroid PNGs (none provided).
- Did not invent biographical content, project names, dates, or citations.
- Did not push the branch to remote, did not merge to main. Per user
  instruction: "keep it in a branch and local, not push to main / merge to
  main until i ask."
- Did not modify `BaseLayout.astro`, the OG image route, RSS feed,
  capture-figures script, or any of the existing diagrams.
- Did not add a PGP fingerprint to ContactV5 (no real key available).

---

## 13. How to revert

```bash
# Full revert (one line)
# In src/components/pages/AppShell.tsx, change:
const USE_V5 = true;   →   const USE_V5 = false;
```

Commit + push → site reverts to V4. V5 files stay in the tree but unused.
If you want them gone too: `git rm src/components/chrome/NB.tsx
src/components/diagrams/NotebookLotka.tsx src/components/pages/*V5.tsx
DECISIONS-v5.md` and revert the additive edits to `palette.ts`, `posts.ts`,
`global.css`.

---

## 14. How to verify locally

```bash
cd /Users/shubzpersonal2/.superset/worktrees/personal-site/v5-field-notebook
npm install
npm run dev
# → http://localhost:4321/
```

Open `/`, `/writing/`, `/work/`, `/now/`, `/contact/`, and any essay slug
(e.g. `/jaya/`). Click the `light · 100×42` chip in the mac chrome to
toggle dark mode. Click any tab to navigate.

If something looks wrong: flip `USE_V5 = false` in `AppShell.tsx` to
confirm V4 still works (sanity check that nothing was inadvertently
broken).
