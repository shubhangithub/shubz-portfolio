import { ABOUTFETCH_ROWS, type Span } from "./home";
import { JOURNAL_ENTRIES, FOCUSES } from "./now";
import { CONTACT_CHANNELS } from "./contact";
import { NOTEBOOK_NAV, PENS } from "./notebook";
import { VISIBLE_POSTS } from "./posts";
import {
  WORK_FEATURED_V5,
  WORK_BUILDS_LIST_V5,
  WORK_FULL_GROUPS,
  WORK_EVENTS_V5, toolSearchTerms,
} from "./work";
import type { NBAccentKey } from "./palette";
export const careerAnchor = (what: string) =>
  "ev-" +
  what
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const projectAnchor = (name: string) =>
  "project-" +
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const toolAnchor = (name: string) =>
  "tool-" +
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const plain = (value: Span[]) =>
  value
    .map((s) =>
      typeof s === "string"
        ? s
        : "em" in s
          ? s.em
          : "link" in s
            ? s.link
            : s.tag,
    )
    .join("");
const projects = [...WORK_FEATURED_V5, ...WORK_BUILDS_LIST_V5];
export type FieldEntry = {
  title: string;
  detail: string;
  href: string;
  kind: string;
  cat?: NBAccentKey;
  search: string;
};
export const FIELD_INDEX: FieldEntry[] = [
  ...NOTEBOOK_NAV.map((n) => ({
    title: n.label,
    detail: n.path,
    href: n.path,
    kind: "Page",
    search: n.label + " " + n.short,
  })),
  ...VISIBLE_POSTS.map((p) => ({
    title: p.title,
    detail: p.dek,
    href: `/${p.slug}/`,
    kind: "Published essay",
    cat: p.nbAccent,
    search: [
      p.title,
      p.dek,
      p.kicker,
      p.tag,
      PENS.find((n) => n.key === p.nbAccent)?.label,
    ].join(" "),
  })),
  ...projects.map((p) => ({
    title: p.name,
    detail: p.scope,
    href: `/builds/?project=${encodeURIComponent(p.name)}#${projectAnchor(p.name)}`,
    kind: "Project",
    cat: p.cat,
    search: [
      p.name,
      p.scope,
      p.blurb,
      PENS.find((n) => n.key === p.cat)?.label,
    ].join(" "),
  })),
  ...WORK_FULL_GROUPS.flatMap((g) =>
    g.items.map((name) => ({
      title: name,
      detail: g.group,
      href: `/builds/?topic=${g.cat}&tool=${encodeURIComponent(name)}#${toolAnchor(name)}`,
      kind: "Tool",
      cat: g.cat,
      search: toolSearchTerms(name) + " " + g.group,
    })),
  ),
  ...WORK_EVENTS_V5.map((e) => ({
    title: e.what,
    detail: `${e.year} · ${e.where}`,
    href: `/work/?entry=${encodeURIComponent(e.what)}#${careerAnchor(e.what)}`,
    kind: "Career & education",
    cat: e.cat,
    search: [e.what, e.year, e.where, e.note, e.track].join(" "),
  })),
  ...ABOUTFETCH_ROWS.map((r) => ({
    title: r.key,
    detail: plain(r.value),
    href: `/#profile-${encodeURIComponent(r.key)}`,
    kind: "About me",
    search: [r.key, plain(r.value), r.prose].join(" "),
  })),
  ...JOURNAL_ENTRIES.map((e, i) => ({
    title: e.date,
    detail: e.note,
    href: `/now/?entry=${i}#journal-entry-${i}`,
    kind: "Journal note",
    cat: e.family,
    search: [e.date, e.note].join(" "),
  })),
  ...FOCUSES.map((f, i) => ({
    title: f.kind,
    detail: f.what,
    href: `/now/#focus-${i}`,
    kind: "Current focus",
    cat: f.family,
    search: [f.kind, f.what, f.linkText || ""].join(" "),
  })),
  ...CONTACT_CHANNELS.map((c) => ({
    title: c.label,
    detail: c.handle,
    href: `/contact/#channel-${c.label.toLowerCase()}`,
    kind: "Contact channel",
    cat: c.c,
    search: [c.label, c.handle, c.note].join(" "),
  })),
];
export const SUBJECT_ATLAS = PENS.map((p) => ({
  ...p,
  essays: VISIBLE_POSTS.filter((e) => e.nbAccent === p.key && !e.draft).length,
  projects: projects.filter((e) => e.cat === p.key).length,
  tools: WORK_FULL_GROUPS.find((g) => g.cat === p.key)?.items.length || 0,
}));

/** Stable relevance tiers: a named record wins over a mention in its body. */
export function searchFieldIndex(query: string): FieldEntry[] {
  const phrase = query.trim().toLowerCase();
  if (!phrase) return FIELD_INDEX.filter((e) => e.kind === "Page");
  const words = phrase.split(/\s+/);
  return FIELD_INDEX.map((entry, index) => {
    const title = entry.title.toLowerCase();
    const haystack = [title, entry.detail, entry.search, entry.kind]
      .join(" ")
      .toLowerCase();
    if (!words.every((word) => haystack.includes(word)))
      return { entry, index, score: -1 };
    const score =
      title === phrase
        ? 5
        : title.startsWith(phrase)
          ? 4
          : title.includes(phrase)
            ? 3
            : words.every((word) => title.includes(word))
              ? 2
              : 1;
    return { entry, index, score };
  })
    .filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.entry);
}
