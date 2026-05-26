# AGENTS.md — design + voice guidelines

Read this **before** any styling or content work. These rules are not
optional. The site has a tight, deliberate voice; pattern-matching from a
generic blog-post prior will produce writing that's ejected on review.

This file is the canonical source. `CLAUDE.md` redirects here. Cursor, Aider,
Copilot, and Claude Code agents all pick up `AGENTS.md` automatically.

> **V5 colour system (canonical, must read before assigning colours).**
> The site uses **10 meta-topic categories**, each owning one of 10 NB pens.
> Every essay, project, skill, chip, or new piece of content rolls up to
> exactly one category and inherits its pen colour. Full table + slotting
> rules + per-essay accent map in [`DECISIONS-v5.md §14`](./DECISIONS-v5.md).
> Don't invent new accents; pick from the 10.

> **Architecture note.** §6 below references `index.html` and a single-file
> architecture — that was the V4 state before the `astro-migration` branch.
> Main is now Astro + React islands; the V5 redesign lives in
> `src/components/pages/*V5.tsx`, gated by `USE_V5` in `AppShell.tsx` for a
> one-line revert. Voice + diagram rules below still apply universally; the
> file-shape rules in §6 are V4 history.

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

## 9. Anti-AI writing — research-backed rules (apply to every essay)

These are derived from documented Claude/LLM stylistic tells. Violating them
doesn't break anything technically, but the writing will read as machine-made.

### Punctuation budget

- **Em-dashes (—): max 2 per section.** If a comma or full stop works, use
  that. Never use em-dashes as a default connective. Never open and close an
  aside with em-dashes when parentheses would be quieter. The JAYA lede has
  exactly one; that is the ceiling, not the floor.
- **Semicolons (;): max 1–2 per paragraph, and never in the "X is Y; Z is W"
  paired-clause construction.** That pattern reads as fabricated balance. Write
  two sentences or use a comma + conjunction instead.
- **Colons introducing lists: only when the list genuinely can't flow as prose.**
  "Three things: A, B, C" is fine. A colon kicking off a paragraph-long
  explanation is not.

### Sentence patterns to never use

- **"Not X. It's Y." / "Not X, but Y."** Delete the negation entirely.
  Say what it IS, not what it isn't first. This construction is a Claude
  signature and it reads as rhetorical throat-clearing.
- **Parallel matched short sentences: "In A it does X. In B it does Y."**
  Feels manufactured. Merge into one longer sentence with a subordinate clause
  or a conjunction.
- **"X. But Y." as a theatrical pause.** "The room is small. But that is how
  it starts." — the capital-B But is a stage direction. Either connect with a
  comma, or write the thought as a single sentence without the stop.
- **Anaphoric kickers: "True of X. True of Y. True of Z."** Sounds like a
  speech, not an essay. Compress into a single clause.
- **Standalone declarative kickers: "The room is small." / "The gap is real."**
  A one-sentence paragraph whose only job is to be followed by an explanation.
  Start with the explanation instead; you don't need to announce it.
- **Neat reversal: "You stop doing X and start doing Y."** / "X becomes Y."
  These are the single most identifiable Claude sentence-level tells. If a
  sentence is a perfect mirror of itself, rewrite it.
- **Parallel triplets as default.** Don't always group in threes. Two items
  is fine. Four or five is fine. Three feels performative.
- **Symmetrical conclusions that recap the sections.** Real argument doesn't
  resolve cleanly. Don't write the conclusion that perfectly mirrors the intro.

### The writer's voice: long sentences

**Shubz writes long sentences.** When a thought is complex, let the sentence
be complex — subordinate clauses, multiple conditions, a delayed main verb.
Do not chop a long thought into three short "impact" fragments. Short punchy
sentences should be earned by what surrounds them, not used as a structural
default. A sentence that runs 60+ words is fine if it earns every word.

### Quick audit checklist before committing any essay

1. Count em-dashes per section: more than 2 → cut.
2. Search for semicolons: is any of them in a "X; Y" parallel? → rewrite.
3. Search for "Not X." followed by "It's Y." → delete the negation sentence.
4. Search for three consecutive short sentences (under 10 words each) → merge.
5. Search for the word "becomes" → is it a mirror reversal? → rewrite.
6. Read the final paragraph aloud: does it recap everything that came before?
   → cut half of it.

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
