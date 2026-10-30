# Design guidelines

Current UI authority · 29 October 2026

Read this before changing presentation or interaction. [AGENTS.md](./AGENTS.md)
remains the authority for voice, essay craft and factual integrity;
[DECISIONS-v5.md §14](./DECISIONS-v5.md#14-colour-system--10-canonical-topic-categories)
owns the ten-topic taxonomy and provenance colours. [EDITING.md](./EDITING.md)
maps content to source files. This document owns the current UI direction.
`DESIGN-v6.md` and historical sections of `PLAN-v6.md` record earlier proposals;
they must not override these accepted patterns. Explicit owner instructions
take precedence.

## One personal setting

The site is a saturated terminal workbench with a personal field notebook.
Its character comes from meaningful physical objects: the narrator and orange
notebook, Pixel, the illustrated About office, essay workbench, project sheets,
working sketchbook and contact letter. Keep those objects recognisable across
pages through common type, pen colours, fine rules, spacing and control shapes.
New creativity should help someone understand or use the actual material.

Home includes the original photographic portrait beside the introduction as
well as the illustrated narrator. The narrator and notebook sit close together
at their original illustrated scale. The cover uses circuit lines, neutral paper
and cyan details; leather textures no longer belong in the home illustration. Do not restore the sticky-note quote or
top author caption; retain the small footer caption and keep it clear of Pixel.

Use original SVG/CSS illustrations for editable object studies. Drawings may
illustrate a subject qualitatively; charts, documentary imagery, book covers
and claims about implementation require real sources. Keep labels visible
without hover. Avoid generic icon-card grids, diffuse pastel haze, unrelated
gradients, oversized introductions and decorative browser chrome.

## Colour, type and contrast

- Use the existing ten pens and neutral surface tokens from
  [`src/data/palette.ts`](./src/data/palette.ts). Literal values live there,
  never in a second palette in this document or page components. The neutral
  `control` token supplies functional outlines; `rule` supplies quieter seams.
  `control` is not an eleventh topic pen.
- Each record inherits one primary topic. An essay provenance link retains
  that essay's pen even inside another topic's container. A shared-topic link
  does not establish that a tool was used in a project.
- The **Shubz name uses the canonical yellow pen**: luminous yellow in dark
  mode and a readable gold in light mode. This brand treatment does not
  recolour the narrator's orange notebook or change topic assignments. The
  name stays yellow when a terminal pen command changes other personal accents.
- Dark mode uses clear deep surfaces and decisive electric ink. Light mode
  uses a cool grey desk, white paper and deeper, readable inks. Dark is the
  default on first visit. Remember an explicit light or dark choice locally
  and restore it before paint on every page. The toggle must still update
  the current page when browser storage is blocked. Test the actual composite colour
  after opacity, blending and hover styles, not just the base palette.
- Project contrast targets: normal text at least **4.5:1**, large text at least
  **3:1**, and meaningful control outlines/focus indicators at least **3:1**
  against adjacent surfaces. Decorative seams can be quieter. Colour must
  have a label or other cue when it conveys category, state or action.
- Use IBM Plex Sans (`--f-ui`) for headings, body, navigation and controls.
  Reserve JetBrains Mono (`--f-mono`) for commands, code and useful technical
  metadata. Build hierarchy with size, weight and spacing, not extra families.
  Keep small metadata readable; do not compress full descriptions into tiny mono.
  The live `.folio` aliases `--f-body` and `--f-display` to `--f-ui`; legacy
  serif declarations in `global.css` are not a direction to restore mixed fonts.

## Complete information, useful organisation

The complete index is the default at `/builds/`. All projects have a compact
recognisable summary and an illustrated fold-out with original description,
metrics and destinations. The pen register provides source-derived counts;
tools remain searchable in subject drawers with their provenance available.
The full network is an optional alternate view, not an entry barrier.

Home places the About office directly after the introduction. Eight labelled
objects select one attached information display within the scene. Group role
with previous work; research with funding and the research log; reading with
offline life. Preserve all twelve source fields, their contexts and original
profile hashes within those groups. London and San Francisco landmarks remain
quiet details: London is home; work spans both cities. Do not restore the long
biography or the separate table of twelve cards.

Writing includes only published essays. Never advertise drafts, their counts,
titles, links or placeholder pages anywhere: indexes, subject views, search,
network nodes, related/next links, feeds and direct routes all use the public
post collection. Keep unfinished source work locally without publishing it.
The Writing workbench uses numbered, illustrated essay slots and a reading
panel, joined by a measured topic-coloured trace that follows the selected
slot. Keep the common terminal surfaces, controls and fonts. Every title opens
directly; previews preserve filters, history and paperclips. Do not use book
covers or a scroll-driven animation for Writing.

Now retains all journal entries, focuses, conditions and actual reading data.
The five current activities and real reading shelf share one kinetic mobile:
labelled suspended objects and a book rack select a single notes panel. Preserve
all source descriptions, links and book metadata. Existing focus and reading
hashes select their matching objects; phone selection moves to the notes with a
return-to-objects control. Motion pauses offscreen and in hidden tabs, and follows reduced motion.
There is no visible motion setting on this artifact. The selected object has a
planet-like orbital ring; do not use an underline as its primary selection cue. Keep conditions in a compact strip.
The journal opens as a single bound page on phone and desktop, with layered page edges, a stitched spine
and a two-sided page turn. Visitors turn manually with Older/Newer buttons or
a horizontal swipe; page scrolling never selects an entry. Per-entry URLs,
initial HTML and print retain every note. Do not restore the redundant journal
intro, entry-count strip or dated-entry dropdown above it. Reduced motion
keeps manual navigation and swaps pages instantly. Vertical touch scrolling
remains native. Existing entry/page/year URLs and history still
select the original source note. The career Walk retains every source event,
including equal-date events, with a direct selector.

Do not restore the removed curated tour, shortlist the complete inventories,
or require a long sequence of clicks to discover omitted records. Preserve
source order and precision where meaningful. Use recorded places and dates;
derive counts from data rather than freezing today's totals into the UI.
Hidden and draft essays stay off all public surfaces.

## Controls, navigation and mobile

- Use clear content names in primary navigation. Physical metaphors belong
  in the objects and secondary labels, not as the only wayfinding cue.
- Error pages use the same shell, theme and typography, with useful return
  links and no falsely active primary navigation item.
- Prefer real links, native buttons, selects and disclosures. Give controls
  visible labels, keyboard operation, selected/expanded state and visible focus.
  Target at least 44px by 44px for standalone controls; disclosure rows and
  full-width actions need at least 44px height. Inline prose links remain prose.
- Keep useful content near the first phone fold. Compact shared mastheads and
  toolbars; let large open objects unfold vertically without clipping their
  controls or introducing hidden nested scrolling. Check widths down to 320px.
- Preserve exact record URLs, query/hash meaning, reload and Back/Forward.
  A record link opens its disclosure or selects its note and lands at a useful
  heading with header clearance. Tall sheets must not centre past their title.
- A disappearing Clear action returns focus to its search input. Local search
  clearing preserves a deliberate subject selection; actions clearing both
  must say so. Modal Find closes on Escape and same-page destination activation,
  restores focus appropriately and searches original records, not only pages.
- Keep an accessible text alternative to the network. Use roving node focus
  rather than putting hundreds of nodes into the ordinary Tab sequence.

The essay bookmark ruler follows the actual title, opening and rendered body
headings. Existing IDs survive; missing IDs receive slug/section anchors.
The desktop rail has a capped, scrollable list for short viewports; phones use
a labelled native selector. Jumps focus the section and retain shareable hashes.
Hash/history restoration waits until native browser scroll restoration finishes,
and leaves unrelated hashes alone. Its section indicator reflects position,
not estimated reading completion. Keep essay prose intact when extending navigation.

The paperclip tray saves projects and published essays locally in the visitor's
browser. Save buttons sit outside card links and expose their pressed state;
the selected Writing preview keeps Read and Save as separate controls.
Use source IDs, titles, topic colours and exact destinations; never store copied
record content or imply an account, sync service or network submission. Validate
stored IDs and ignore obsolete records. Storage events synchronise tabs in the
same browser; there is no cross-device service. When storage is unavailable,
the in-memory fallback lasts on the current page and the notice says so.
The native tray dialog has explicit remove/clear actions, Tab/Shift+Tab wrapping
and Escape closure. Closing returns focus to its trigger; following a same-page
record instead focuses that record's useful target.

## Motion and sound

The shared background grid drifts slowly and bends locally towards a fine
pointer. A faint cyan highlight follows the same crease. Phones use a slowly travelling
crease with a small decaying response
to scrolling; never capture touch gestures or request device orientation. Keep
the mesh behind content, pointer-transparent and low contrast, using the
existing cyan token. It must not move the content or introduce new accents.
There is no background-grid setting or stored pause state. Reduced motion
always renders a static grid and responds to preference changes. Hidden tabs stop the animation
loop. Use one viewport-sized canvas with a bounded backing store, at most
30 draws per second, and no per-frame React state. Preserve the CSS grid as
the no-JavaScript/canvas fallback.

The full network has bounded gentle community movement, hub pulses and damped
drag release. Preserve spatial context, attached edges and reliable hit targets;
held or focused targets remain usable. Provide Pause/Resume. Reduced motion
defaults to a static graph and responds to runtime preference changes. Stop
animation work offscreen and in hidden tabs. Use the existing imperative motion
hook; avoid per-frame React renders or continuous all-pairs physics.

Other motion should explain an object or interaction. Keep static content
available without animation gates. Essay figures render visibly in the initial
HTML and stay within the body column, leaving room beside the bookmark ruler
and sidenotes. Animate the diagram itself only when it explains the subject;
do not fade or slide the whole figure into view. Comparison panels stack when
their actual container is narrow; page-level overflow hiding is not a substitute
for fitting the content. Wrap diagram controls and keep explanations below
inherently wide matrices; the matrix may use a labelled, keyboard-focusable
horizontal scroll region with a visible instruction and sticky row labels.
Pixel retains rest/quiet controls and
keyboard/touch access; it must not chase over reading content.

Sound is off by default, explicitly enabled and locally remembered. Initialise
Web Audio only from a user gesture. Keep cues brief, quiet, bounded and
rate-limited; no typing, hover or automatic ambient soundtrack. Mute interrupts
active sound immediately, and Pixel quiet suppresses its cues. Unsupported audio
must not interfere with navigation. Reuse the shared sound API.

## Source and rendering boundaries

Content lives in `src/data/`; React page components render it. Keep new labels
in the relevant data module and preserve original field context, essay prose,
metrics, links and generated snapshots during UI work. Use `EDITING.md` for
the full source map rather than duplicating data in components.

The Astro/React architecture is current; AGENTS' single-file V4 mechanics are
historical. Shared chrome lives in `Notebook.tsx`; shared styles are in
`notebook.css` and `workbench.css`. Object-specific rules belong in scoped
styles such as `field-studio.css` and `project-folio.css`, not repeated global
overrides. `daylight.css` contains light-mode contrast refinements;
`reading-tools.css` scopes the paperclip tray and bookmark ruler. Reuse one
record renderer across complete and filtered views.

Preserve meaningful initial HTML and hydration-safe state. The dedicated
`/builds/network/` route serves its SVG in the initial response; default index
visitors must not load network physics. Keep legacy deep-link redirects and
canonical routes consistent. Round calculated SVG coordinates deterministically
to avoid server/browser floating-point hydration differences. Keep original art
masters and provenance when adding asset variants.

## Review before calling a UI change complete

These are implementation and review targets, not a blanket claim that every
legacy surface already satisfies them. Record any measured exceptions.

1. Capture matched before/after screenshots using the same route, data, theme,
   viewport and interaction state. Inspect the rendered images, including
   opened objects and lower sections, not only first folds.
2. Check desktop and phone in both themes, with responsive spot checks at
   320, 768 and 1024px. Check readable contrast, text bounds, images, touch
   targets and useful hierarchy.
3. Exercise real keyboard/touch flows, filters, disclosures, exact deep links,
   reload/history, modal focus, reduced motion and opt-in audio as applicable.
   Verify source-derived completeness instead of testing only the default DOM.
4. Inspect console warnings, hydration and request failures as well as page
   exceptions. Capture diagnostic state for intermittent failures; do not
   silently relabel them as harness issues.
5. Run appropriate checks and a plain Astro build for UI-only work. Avoid
   unnecessary feed/reading regeneration. Verify original data and essay bodies
   remain unchanged, and report limitations honestly.

Keep evidence outside production content unless the owner asks for a gallery.
Local review, committing and publishing are separate actions; do not publish
an unreviewed visual or prose change merely because its checks pass.

The home illustration uses a bounded 430px-wide composition to close the gap
between notebook and narrator. Keep the real portrait beside the introduction.
Do not add Substack links; essays open on this site. Torus is Infrastructure
(yellow); Orion retains Geospatial (teal).

### Topic consistency and network spacing

Assign colours to the work described, rather than to an employer's name or a
technology mentioned incidentally. Torus's physical-infrastructure engineering
uses Infrastructure yellow; Orion's spatial intelligence remains Geospatial
teal. The combined office Work object uses the current role's yellow while
Orion links retain teal. The Flipkart–Walmart sentiment/theme-extraction project
and its Best Paper journal entry use AI/ML purple, matching the career record.
Ambassador work uses Outreach orange. Oxford's maths/CS study uses Mathematics
magenta; the general FLAME CS degree uses Infrastructure yellow. Keep individual
provenance links coloured by their own source, even within a differently coloured
group. These are assignments to the existing ten pens, not palette additions.

The network's deterministic force layout fits the canvas aspect ratio with
margins for motion, and resolves final circle spacing after fitting. Its initial
layout targets a 12 SVG-unit gap between node bodies; degree still determines
node size. Keep the entire network visible at entry on phones and desktop, with
pan, zoom, focus and the accessible list available for dense local connections.

The current Torus role is **Founding Member of Technical Staff** (YC S26).
Use that title in visible records, metadata and the downloadable CV. Orion’s
historical Founding Engineer role is a separate source fact.

Contact includes the original portrait in a taped photo alongside the greeting,
plus the existing lecture photo. Other destinations are real, labelled envelope
links beneath a courier pigeon. Hover or keyboard focus moves the pigeon to
that destination; reduced motion disables the flight. Phones retain readable
links and a compact pigeon illustration. Email still opens the visitor’s mail
app; do not imply a message was sent or add a new delivery service.

The home introduction is one paragraph combining Oxford and current work; do
not restore the separate Oxford subheading or the three redundant hero links.
Below the office, the Notebook, Experiments and GitHub share a moving
carousel. Keep every panel mounted to preserve interaction state; inactive
panels are inert. Rotate every three seconds, including after tab selection.
Pause while focus is inside a slide, outside the viewport, in hidden tabs and
for reduced motion. Hovering does not pause. Keep the tabs and previous/next controls, without an Auto/Hold button. The LinkedIn note uses a quiet London–SF
bridge illustration; preserve the original post and source image. Projects and
essays sit side by side on desktop and stack on phones.

The career Walk opens at Torus unless an explicit entry URL selects another
record. An academic result is context, never a location heading. The Now date
stamp should read as stamped ink, and page-turn shadows follow the moving leaf.
Contact reuses the courier bird beside the portrait as well as in Personal Post;
keep the same drawing and reduced-motion behaviour in both places.

## Pixel across the notebook

Pixel is a small character beside the content, without repeated name/status
copy, panels or navigation CTAs. Object selection and page navigation belong to
the existing controls. A small ellipsis opens pet preferences only on request. Keep the original desk, Walk and terminal companion. Reading,
investigating and letter-carrying poses reuse the same articulated drawing.

Use a 58px corner companion beside relevant objects, never a fixed overlay or
an interrupting assistant. Context changes must not trigger live announcements,
new audio or invented facts. Only deliberate petting uses the existing opt-in
sound. Rest, quiet and hide are shared session preferences across all instances;
hiding leaves a discreet restore control. Reduce motion and suspend animation
when offscreen or in a hidden tab. Preserve links, history, focus and source content. Do not restore the
"Inspect the next object" or similar repeated assistant prompts.

## Research drawings behind the grid

The shared background layers quiet personal line drawings over the existing
pointer-creased grid: magenta mathematical connections, teal mapping contours,
yellow infrastructure traces, an ochre six-input recommendation motif and
orange London/SF silhouettes, plus a red biotech helix. These are qualitative illustrations, not live
telemetry or quantitative plots. Keep actual information in foreground content.

Use `ResearchBackdrop.tsx` and `research-backdrop.css`. Place detail mostly in
the outer margins, fade it towards the reading area, and inherit canonical pen
tokens in both themes. Motion is slow orbiting, contour drift and occasional
travelling line highlights. Never intercept clicks or add focusable decoration.
On phones retain all six drawings at smaller scales, with enough of each
inside the viewport to recognise it. Keep the centre mask quieter than the
edges, alongside the visible ambient grid crease; no device sensors. Reduced motion freezes the drawings and removes
travelling highlights; hidden tabs pause their animations. Print omits the layer.

Scroll progress through the actual page sections drives the backdrop drawings’
position, scale, rotation and connection highlights, with a short time-based
settling curve. It must reverse when scrolling back, work with touch scrolling,
and remain static with reduced motion. Do not hijack native scrolling.

The journal has one presentation: the page-turning book, with its page controls. Do not duplicate the entries in an all-notes disclosure underneath.

### Current-work object motion

The five activity objects share finite hover, keyboard-focus and selection feedback: committee nodes connect for Building; an underline and chart are drawn for Studying; an open-book leaf turns for Reading; the tablet draws a stroke for Drawing; microphone waves expand for Learning. Reading-rack bindings respond too, and selected books show the same page-turn study. Selecting an already-open object replays its short demonstration. Keep the detail illustration visible on phones. These demonstrations stop when the artifact leaves view, the document is hidden or reduced motion is enabled; they must not introduce repeating attention cues or change source text, links or hash navigation.

## Keep interface narration out of the way

Do not explain obvious layout behaviour in visible copy: ordering, overlapping
roles, selecting an object, opening an essay or choosing a destination. Headings,
objects and labelled controls should carry that meaning. Avoid introductory
instruction paragraphs and repeated counts. Retain accessible names, result counts
that change with filtering, and useful empty/error states.

The background drawings use 38% opacity in dark mode and 28% in light mode,
with the centre mask retaining reading contrast. Phones use 46%/33% drawing
opacity and 16%/12% grid opacity in dark/light modes respectively. Scroll movement includes larger
position/rotation/scale changes and a helix whose strands and connecting rungs
change together. Keep it qualitative, with no invented measurements.
Do not restore repeated subject-following CTAs on essays, Writing or career
entries; the main navigation and actual related content provide discovery.

The home notebook has two opaque cover faces. Its inside stays visible when
the cover turns past 90 degrees, and the open spread stays above the narrator
so every contents link remains usable. On phones shift the hinge inward.
Homepage Projects and Writing share a bottom edge on desktop, with project
rows distributing available height; stacked phone sections keep natural height.
Reading uses a page curl anchored to the illustrated diagonal spine rather than
rotating the whole SVG page in 3D; Studying keeps its binding still.

## Header and interface restraint

The shared header starts with a slim Mac-style window bar: decorative red,
yellow and green dots on the left, a centred technical page path, and sound
and light/dark icon buttons on the right. The dots are not window controls.
Keep both buttons at 44px touch targets with accessible names and visible
keyboard focus; the title truncates on narrow screens. Use SVG icons, not
font glyphs. Sound stays off until enabled. Remove visible RSS and full-screen terminal links from navigation,
footer, writing and search; the homepage terminal remains a carousel instrument.
The About office uses its objects directly, without a Find a field dropdown;
preserve existing deep links. UI buttons and descriptive project chips use
IBM Plex Sans at 13px, not monospace. Reserve mono for actual code, commands and
small technical metadata. Pixel may perch on existing artifacts, without new
status paragraphs, cards or calls to action.

The carousel experiment and GitHub calendar share a centred, bounded layout:
caption/link beside the visual on desktop, stacked on phones. Keep the Fisher
plot's native aspect ratio and readable calendar cells. The homepage has one Pixel beside the main desk; do not repeat him in the
office, carousel or recent letter. Preserve
mounted slides and terminal input; pause the experiment when its slide is hidden.

Form placeholders inherit the muted palette token in both themes. Keep search
result counts legible; on phones the Writing count shares the search row.
Career metadata stacks on narrow screens, with dates kept together and an
11px minimum label size.

The live reading shelf can gain books during deployment. On phones reserve
space beneath a shelf with three or more books so every title and author stays
clear of the selected detail panel; check the refreshed shelf before releasing.


## Mobile motion and composition

Keep canvas and drawings on an explicit zero stacking layer, with page content
above them; avoid negative fixed layers that can disappear on phone browsers.
The drawings drift between scroll gestures as well as responding to section
progress. Background loops stop in hidden tabs and for reduced motion.

The contact courier has five real perches on phones as well as desktop. It
visits them every 3.4 seconds while visible and idle, yielding to touch, hover
and keyboard focus. Keep native destination links; never require an extra tap
just to animate the bird. Reduced motion disables travel and flapping.

Sound supports standard and prefixed Web Audio, resumes interrupted contexts
from deliberate taps, and gives short feedback to buttons and disclosures.
Keep Pixel's quiet setting effective, avoid duplicate cues, and never trigger
sound from automatic object rotation or background/pigeon animation.

On phones the portrait and London/SF line belong to the notebook/avatar scene;
desktop retains the original identity placement. Writing previews open directly
under the selected essay on phones, with native reading links and a close/return
control, rather than requiring a jump beneath the entire list.

Office objects have varied sizes and the selected object carries an animated
halo in its own topic colour. Selection is single, with static state visible
when motion is reduced. Rotate the active object every nine seconds while the
scene is visible and idle. Allow fifteen seconds of rest after a deliberate
selection, and pause for focus, hover, expanded context and explicit deep links.
Automatic rotation must not move the viewport, change the URL or play sound.

## Office placement and inventory integrity

Education and Reading/offline are framed studies hung on the back wall. The
research notebook lies flat in the tabletop perspective; the chair stays clear.
Use the office-specific SVG studies instead of distorting shared Now objects.
The work monitor is larger than wall badges and pins, with labels and selected
auras remaining readable down to 320px.

Live experiments lists the interactive diagrams from published essays, using
the source essay’s topic and the same working component. Keep one instrument
open at a time, with its controls in normal document flow and its essay linked.
Unpublished essays and local review diagrams never enter this registry.

Group closely overlapping tools into one inventory and graph record; keep
legacy names as searchable aliases and resolve old tool links. A credential
such as DBS checking belongs in the biography/career, not the tools graph.
Use explicit project provenance where recorded; category membership alone is
not proof that a tool was used on that project. SVG/canvas is the site’s diagram
implementation; do not label it D3. Preserve all distinct projects and roles.

The contact pigeon faces its destination on every move, including reverse
selection and the automatic last-to-first return. Mirror the bird separately
from the travel and wing animations. Journal arrows and swipe remain available
without a visible paragraph explaining them.

## Personal imprint and quieter page chrome

The notebook mark contains an angular SS monogram and uses Shubz yellow in
header, footer and cover; the favicon carries the same imprint. Generic UI
highlights, selected navigation and decorative trim use yellow. Topic-specific
content retains its canonical pen, including orange for Outreach.

An article's full writing path appears once in the window bar. Metadata,
citation, sources and related essays use short headings, without repeating
the shell account or filename.

Now has one Reading rack containing the reading context and actual books,
not a second suspended Reading selector or Reading page jump. Preserve legacy
reading hashes. Current activities and journal share a continuous mounted
surface so the book feels part of the same scene.

## Copy density

Office summaries retain their links and facts. Context starts expanded and adds
only information absent from the summary; omit the disclosure when there is
nothing to add. Funding belongs in one Grants & awards row. Keep the full source
biography separately for data consumers. Default-open context must not disable
idle office rotation; deliberate interaction still gives visitors time to read.

Avoid repeating the selected activity heading in panel chrome. Reading lives
in the Now book rack, not again in its status strip. Preserve useful navigation
and cross-page context rather than deleting every recurring subject name.

## Selection halos, journal scale and reactions

Selected office halos sit above opaque study artwork, including Education,
Reading and Research, with no filled wash obscuring the illustration. Keep the
same pen-coloured orbit language across the objects; reduced motion retains a
static ring. The Now objects use restrained outlines rather than pale glows.
The bound journal is at most 980px wide, with a 440px desktop / 420px phone minimum
page height; longer entries expand naturally, and text and touch targets keep
their readable size. Keep page-turn shading, without a bright outer book glow.

The public source snapshot omits the production reaction service.

## Journal press links and background studies

Journal attachments belong to the entry data, never its array position. Torus
is Infrastructure/yellow. Its September 2026 entry refers to joining in July
and links to the September Forbes coverage; the preview is an original
illustrated press clipping, not a photograph or a Forbes screenshot.

The yellow notebook imprint now uses offset flowing S strokes, a small bookmark
and a quiet bound edge. Keep the shared mark and favicon in sync.

Nine background studies cover topology, terrain, infrastructure, cities,
recommendation paths, a helix, phase orbits, rowing and circuitry. Their outer
positions respond to scroll; signal dashes also travel during idle. Keep text
areas masked, controls unobstructed, off-tab work paused and reduced motion
static on both desktop and phones.

## Project purpose groups

The project catalogue groups every record under Work projects, Fun projects,
then Research. Purpose is explicit data in `work.ts`; it is separate from the
ten topic pens, which retain their colours. Search and subject filters retain
these groups and hide empty headings. The main browse choices are Work projects, Fun projects, Research, Essay
experiments and All tools; the default catalogue shows all project groups.
Purpose filters use shareable `group` URLs and restore on Back/Forward.
Essay experiments contains the interactive
essay figures, separate from projects and tools. Preserve existing project and
`view=lab` URLs, graph records and saved project IDs.

Primary navigation order is Home, Now, Timeline, Projects & tools, Writing,
Contact. Timeline retains `/work/`. Chapter numbers, notebook contents and
next-page links follow this order on desktop and mobile.

## Phone reading and page corners

Keep Now’s Mood, Music and Drink in one three-column strip on phones. The tea
illustration sits above Drink without taking a grid column. Miniature book titles
wrap within their covers and truncate with an ellipsis; the selected detail keeps
the full title. Education and Reading/offline use smaller wall frames clear of
the work monitor. Directly below “About me, in full”, a small hint invites visitors to tap the
laptop, books or other coloured objects. Do not place that hint in the notes panel.

Article sources and citations must remain available on phones, with Details
below the essay and a direct jump link above it. Never hide these for narrow widths.
Journal year tabs and the redundant current-entry link are removed; existing
year/entry URLs still resolve. A bottom-right corner lifts on hover or focus and
turns to the next older page on click/tap. Keep arrows, swipe, keyboard access and
instant navigation under reduced motion. Hide the forward corner at the last entry.

## Now’s phone composition

At widths up to 760px, use a mounted two-tier activity rack with four larger
object studies and a full-width reading shelf. Lay these out in normal grid
flow; do not shrink the desktop hanging-mobile coordinates onto a phone.
Keep selection orbits and meaningful object animation. Books sit on a visible
shelf, and notes attach directly beneath the rack. A selected book shows its own
details without repeating the general Reading paragraph; Reading remains a
separate selectable heading. Desktop keeps its hanging composition.

The phone introduction has a compact horizontal date stamp. Conditions use
three plain columns with fine separators, without three nested cards. Let the
journal use the available phone width with smaller outer margins, readable body
text and the existing page curl. Check 320, 390 and 430px in both themes.

## Shared journal book

The accepted phone journal is the desktop model too: one bound page with a
visible stitched left edge, layered paper and a bottom-right turning corner.
Desktop centres this same book at a maximum width of 720px. Do not restore the
separate oversized date/verso panel. Keep the phone composition unchanged,
preserve manual arrows/swipe, and animate the same full leaf on corner activation.
