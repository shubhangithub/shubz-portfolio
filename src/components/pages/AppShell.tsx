/**
 * AppShell — wraps a page component with the dark-mode + navigation state that
 * each Astro page needs, then renders the matching page with SSR + hydration.
 *
 * The theme is resolved from data-theme (set by the pre-paint script in
 * BaseLayout before React loads) so the first render already uses the right
 * palette — no cream→navy flash. See DECISIONS-v5.md.
 */
import { usePageState } from "../../lib/usePageState";

import { HomeV5 } from "./HomeV5";
import { WritingIndexV5 } from "./WritingIndexV5";
import { WorkV5 } from "./WorkV5";
import { NowV5 } from "./NowV5";
import { ContactV5 } from "./ContactV5";
import { BuildsV6 } from "./BuildsV6";
import { TtyV6 } from "./TtyV6";

type PageKey = "home" | "writing" | "work" | "now" | "contact" | "builds" | "tty";

export default function AppShell({
  page,
}: {
  page: PageKey;
}) {
  const props = usePageState();
  if (page === "builds") return <BuildsV6 {...props} />;
  if (page === "tty") return <TtyV6 {...props} />;
  if (page === "writing") return <WritingIndexV5 {...props} />;
  if (page === "work")    return <WorkV5 {...props} />;
  if (page === "now")     return <NowV5 {...props} />;
  if (page === "contact") return <ContactV5 {...props} />;
  return <HomeV5 {...props} />;
}
