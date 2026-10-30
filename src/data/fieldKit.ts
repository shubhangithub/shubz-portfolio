import type { NBAccentKey } from "./palette";
export type FieldObjectKind =
  | "terminal"
  | "notebook"
  | "envelope"
  | "patch"
  | "pins"
  | "badge"
  | "board"
  | "books"
  | "card"
  | "map"
  | "san-francisco"
  | "folio"
  | "oar"
  | "committee"
  | "course"
  | "tablet"
  | "microphone"
  | "recommender";
export const FIELD_OBJECTS: Record<
  string,
  { object: FieldObjectKind; pen: NBAccentKey; label: string }
> = {
  role: { object: "terminal", pen: "yellow", label: "The engineering terminal" },
  research: { object: "notebook", pen: "blue", label: "The research notebook" },
  "funded by": { object: "envelope", pen: "blue", label: "The grant envelope" },
  oss: { object: "patch", pen: "yellow", label: "The open-source patch" },
  bodies: { object: "pins", pen: "prompt", label: "The society pins" },
  ambassador: { object: "badge", pen: "orange", label: "The outreach badge" },
  makes: { object: "board", pen: "cyan", label: "The maker’s board" },
  reading: { object: "books", pen: "orange", label: "The reading stack" },
  education: { object: "card", pen: "magenta", label: "The university card" },
  previously: { object: "map", pen: "teal", label: "The map roll" },
  "research log": { object: "folio", pen: "red", label: "The lab folio" },
  offline: { object: "oar", pen: "orange", label: "The oar" },
};
export const FIELD_GROUPS = [
  {
    id: "work",
    label: "Work",
    keys: ["role", "previously"],
    object: "terminal",
    pen: "yellow",
  },
  {
    id: "research",
    label: "Research",
    keys: ["research", "funded by", "research log"],
    object: "notebook",
    pen: "blue",
  },
  {
    id: "open-source",
    label: "Open source",
    keys: ["oss"],
    object: "patch",
    pen: "yellow",
  },
  {
    id: "societies",
    label: "Societies",
    keys: ["bodies"],
    object: "pins",
    pen: "prompt",
  },
  {
    id: "outreach",
    label: "Ambassador",
    keys: ["ambassador"],
    object: "badge",
    pen: "orange",
  },
  {
    id: "making",
    label: "Making",
    keys: ["makes"],
    object: "board",
    pen: "cyan",
  },
  {
    id: "education",
    label: "Education",
    keys: ["education"],
    object: "card",
    pen: "magenta",
  },
  {
    id: "away",
    label: "Reading & offline",
    keys: ["reading", "offline"],
    object: "books",
    pen: "orange",
  },
] satisfies {
  id: string;
  label: string;
  keys: string[];
  object: FieldObjectKind;
  pen: NBAccentKey;
}[];
export const FIELD_KIT_COPY = {
  label: "SHUBZ / DIGITAL OFFICE",
  intro: "Pick an object. Its notes open here.",
  scene: "Objects in a digital office",
  sceneHint: "One connected desk",
  context: "Open the context for",
  jump: "Find a field",
  choose: "Choose a field",
  full: "Read the full introduction",
  display: "Attached notes",
  explore: "Tap the laptop, books or other coloured objects to explore.",
  previous: "Previous object",
  next: "Next object",
  back: "Back to objects",
};
export const STUDIO_COPY = {
  label: "SHUBZ / OPEN SKETCHBOOK",
  work: "Five things on the desk",
  margin: "Notes in the margin",
  journal: "Pages from the journal",
  reading: "Books within reach",
  context: "A snapshot of the work, study and things beside them.",
  date: "Last written",
  stitch: "FIELD NOTES",
  thread: "THREAD",
  archive: "All entries, newest first.",
};
export const FOCUS_OBJECTS: Record<string, FieldObjectKind> = {
  Building: "terminal",
  Research: "committee",
  Evaluating: "course",
  Studying: "course",
  Reading: "books",
  Drawing: "tablet",
  "Exploring SF": "san-francisco",
  Learning: "microphone",
};

export const JOURNAL_STUDIES: Record<
  string,
  { object: FieldObjectKind; date: string; marker: string; label: string }
> = {
  "2026": {
    object: "tablet",
    date: "2026-06",
    marker: "Procreate drawing course",
    label: "Drawing / Procreate",
  },
  "2025": {
    object: "recommender",
    date: "2025-12",
    marker: "Second pass at the Taylor Swift recommender",
    label: "Six engines / the recommender",
  },
  "2024": {
    object: "folio",
    date: "2024-09",
    marker: "Submitted the MFoCS thesis",
    label: "Biomarkers / the thesis",
  },
};

/** Resolve the original source note after insertions; absent/new years need no sketch. */
export function journalStudyFor(
  year: string,
  entries: readonly { date: string; note: string }[],
) {
  const study = JOURNAL_STUDIES[year];
  if (!study) return null;
  const entry = entries.findIndex(
    (e) => e.date === study.date && e.note.includes(study.marker),
  );
  return entry < 0 ? null : { ...study, entry };
}
