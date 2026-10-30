import { WORK_FEATURED_V5, WORK_BUILDS_LIST_V5 } from "./work";
import { VISIBLE_POSTS } from "./posts";
import { projectAnchor } from "./discovery";
import type { NBAccentKey } from "./palette";
export type ClipRecord = {
  id: string;
  title: string;
  href: string;
  kind: string;
  pen: NBAccentKey;
};
export const projectClipId = (name: string) => `project:${projectAnchor(name)}`;
export const essayClipId = (slug: string) => `essay:${slug}`;
export const CLIP_RECORDS: ClipRecord[] = [
  ...[...WORK_FEATURED_V5, ...WORK_BUILDS_LIST_V5].map((p) => ({
    id: projectClipId(p.name),
    title: p.name,
    href: `/builds/?project=${encodeURIComponent(p.name)}#${projectAnchor(p.name)}`,
    kind: "Project",
    pen: p.cat,
  })),
  ...VISIBLE_POSTS.filter((p) => !p.draft).map((p) => ({
    id: essayClipId(p.slug),
    title: p.title,
    href: `/${p.slug}/`,
    kind: "Essay",
    pen: p.nbAccent || ("blue" as NBAccentKey),
  })),
];
export const CLIP_COPY = {
  trigger: "Clips",
  title: "The paperclip tray",
  description:
    "Projects and essays to return to. Saved in this browser, without an account.",
  save: "Clip for later",
  saved: "Clipped",
  remove: "Remove",
  clear: "Clear tray",
  close: "Close tray",
  empty: "Your tray is empty. Use “Clip for later” on a project or essay.",
  temporary:
    "Browser storage is unavailable. Your clips will last on this page.",
  ruler: "Bookmark ruler",
  section: "Essay section",
  opening: "Opening",
  header: "Title",
};
