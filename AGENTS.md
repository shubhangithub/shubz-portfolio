# AGENTS.md — design + voice guidelines

Read this **before** editing `index.html`. These rules are not optional. The
site has a tight, deliberate voice; pattern-matching from a generic blog-post
prior will produce writing that's ejected on review.

This file is the canonical source. `CLAUDE.md` redirects here. Cursor, Aider,
Copilot, and Claude Code agents all pick up `AGENTS.md` automatically.

---

## 1. Voice — what every essay must do

These are non-negotiable. Violating any of them means the draft will be sent
back.

- **First-person, conversational, lightly self-deprecating.** "I" not "we"
  unless collaboration is genuine and named. Match the register of the JAYA
  essay (search for `function JayaEssay` in `index.html`) — read the whole
  thing before drafting anything new.
- **Drop-cap lede.** First paragraph uses `className="drop-cap"`, sets the
  scene with a vivid concrete detail, contains at least one numbered sidenote.
- **Specific over general.** "341 Taylor songs + 460 cross-artist" beats
  "a few hundred songs." If a number, name, or place exists, use it.
- **Pull-quotes earn their place.** 1–2 `<PullQuote color={p.accent}>` per
  essay, each anchoring a section's argument. Never decorative.
- **Sidenotes for asides, not exposition.** 3–5 numbered sidenotes per essay.
  Use them for footnoted detail, dry asides, citations. Don't bury main-line
  argument in them.
- **Closing line, italic, em-dashed, place-stamped.** Pattern:
  `— written between two stops at the British Library, on a Wednesday.`
  Set place + time + mood. One short line. Always.
- **British English.** "optimisation," "behaviour," "colour," "centre."
- **No "leverage," "robust," "synergy," "delve," "tapestry," "in today's
  fast-paced world," or any other LLM-default phrasing.** If a sentence
  could appear in a generic Substack, rewrite it.

---

## 2. Voice — micro-conventions

- **Hedge with confidence, not weakness.** "I think the lesson isn't really
  about JAYA" is fine; "It might possibly be the case that…" is not.
- **Em-dashes are allowed and welcome** — but earn each one.
- **No bullet lists for prose.** Bullet lists belong to: numbered procedure
  steps (§02 in JAYA), enumerated engines/sources (§01 in six-engines /
  fashion), and reference lists. Argument flows in paragraphs.
- **Code/formula blocks** are centred, `var(--f-mono)`, dashed border, light
  paper background. See JAYA §01 for the exact pattern.
- **Don't hedge dates or places.** "October 2022, at VFSTR." Not "around
  late 2022, somewhere in India."

---

## 3. Custom diagrams — every essay needs them

**Two diagrams per essay** unless one truly doesn't earn its keep. Never
zero.

- **PascalCase function components**, defined above all `*Essay` components
  in the V4 section of `index.html`.
- **Take `{ palette: p }` as their only required prop.** Use only palette
  tokens: `p.accent`, `p.ink`, `p.muted`, `p.line`, `p.paper`. Never hard-code
  colours that aren't already in palette extensions (e.g., the muted
  earth tones used in `BiomarkerScatter` for distinct cluster classes).
- **Wrap diagrams in `<Figure caption="…" palette={p}>`** in the essay body.
- **Animate when motion adds meaning, not when it adds decoration.** Use
  `React.useState` + `setInterval` at 60–90 ms tick. Provide a Reset/Run
  control if state drifts.
- **Two-column hover-pattern** for diagrams with a legend: `gridTemplateColumns:
  "2fr 1fr"`, diagram left, legend right, shared hover state highlights both.
- **Typography:** mono (`var(--f-mono)`) for axis ticks and small labels;
  UI sans (`var(--f-ui)`) for legend entries; ink for primary text, muted
  for secondary.
- **Transitions:** `240ms var(--ease-out)`.
- **viewBox** + `width: "100%"` so they scale.

Reference implementations to read before writing a new diagram:
`EdgeDiagram`, `FourierFigure` (V1 examples), `JayaSwarm`, `BiomarkerScatter`,
`ConsensusGrid`, `RecEngineSwarm`, `EnsembleConsensus`, `TrendSignalFlow`,
`LMSRPriceCurve` (V4 examples).

---

## 4. Adding a new essay — mechanical checklist

Strictly in this order. Skip a step and the essay won't render or will fall
through to `DraftEssay`.

1. **Write 1–2 custom diagram components** in `index.html`, placed
   immediately above all `*Essay` components in the V4 section. Each takes
   `{ palette: p }`.
2. **Write the `<Slug>Essay` component**, placed in the same V4 section
   before `function DraftEssay`. Use the JAYA / Biomarkers / Six-engines /
   Fashion essays as templates.
3. **Add a slug entry to `essayMeta()`** (the function in V4 section). Required
   keys:
   - `tags` — short comma-separated string
   - `toc` — array of section names matching the essay's structure (the
     header itself counts as the first entry)
   - `sources` — array of `[citation-prefix, rest]` tuples
   - `sidenotes` — integer count of numbered sidenotes in the essay
4. **Add `case "<slug>": return <SlugEssay palette={p} />;`** to the dispatcher
   in `ArticleV4` (search for `switch (post.slug)`).
5. **Add a `POSTS` entry** with: `slug`, `title`, `kicker` (format
   `"Essay · <Topic Area>"`), `dek` (one sentence, specific), `minutes`
   (rough estimate), `illustration` (`"hex"` or `"wave"`), `cardBg` (very
   light tint), `accent: "#1F3DBF"`.
6. **Reorder `POSTS`** so polished essays appear before drafts.
7. **Sanity-check** by opening `index.html` and clicking through to the new
   essay. Verify diagrams render, sidenotes expand, palette switching works.

---

## 5. Marking an essay as a draft

If the essay isn't ready, leave it routing to `DraftEssay` (the default in
the dispatcher). The card will appear in the index, but the body will show
the "in the drawer" placeholder. Do **not** ship a half-written essay
under the polished path.

---

## 6. File-shape rules

- **Single-file HTML, no build step.** JSX is compiled in-browser via
  `@babel/standalone`. Don't introduce a bundler, npm install, or split into
  modules without explicit owner sign-off.
- **Sections are versioned.** V1, V2, V4 each have their own component sets.
  New work goes in V4. Don't edit V1/V2 essays unless asked.
- **Window-globals exports.** Each section ends with
  `Object.assign(window, { … });` listing components other sections need.
  Keep this pattern.
- **Palette tokens are the only colour source.** Don't introduce hex
  literals in essay bodies; pull from `p` instead.

---

## 7. Things that should never happen

- Writing an essay without first reading `JayaEssay` end-to-end.
- Adding a generic "Building on this work…" or "Looking forward…" closing
  paragraph. The italic place-stamped line is the closing.
- Using `<table>` for layout (or anywhere, really).
- Adding `<Figure>` decoration without a real diagram inside it.
- Inventing biographical facts. If unsure, ask. Specifically: the
  Oxford MFoCS thesis is **2024**, not 2025; supervisor lab and exact
  patient cohort details should not be invented.
- Adding a build step.
- Pushing without owner review on prose changes (mechanical changes are
  fine).

---

## 8. Voice exemplar — read this if you read nothing else

The first paragraph of the JAYA essay:

> The thing they don't tell you about a "parameter-free" optimizer is that
> it has no parameters because *you* haven't added them yet. JAYA — Sanskrit
> for victory, named by R. Venkata Rao in 2016 — needs only a population
> size and a stopping rule, and that minimalism is exactly what makes it
> interesting to break.

Why it works: opens with a quiet contrarian claim; establishes a specific
factual anchor (name, year, naming origin); ends on a forward motion ("makes
it interesting to break"). Fifty-six words; no filler.

If your opening paragraph doesn't pass this test, rewrite it.
