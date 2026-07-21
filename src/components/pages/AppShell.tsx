/**
 * AppShell — wraps a page component with the dark-mode + navigation state that
 * each Astro page needs, then renders the matching page with SSR + hydration.
 *
 * The theme is resolved from data-theme (set by the pre-paint script in
 * BaseLayout before React loads) so the first render already uses the right
 * palette — no cream→navy flash. See DECISIONS-v5.md.
 */
import { useCallback, useState } from "react";

import { HomeV5 } from "./HomeV5";
import { WritingIndexV5 } from "./WritingIndexV5";
import { WorkV5 } from "./WorkV5";
import { NowV5 } from "./NowV5";
import { ContactV5 } from "./ContactV5";
import { ArticleV5 } from "./ArticleV5";

type PageKey = "home" | "writing" | "essay" | "work" | "now" | "contact";

function urlFor(page: string, slug?: string | null) {
  if (page === "essay" && slug) return `/${slug}/`;
  if (page === "home") return "/";
  return `/${page}/`;
}

export default function AppShell({
  page,
  slug,
}: {
  page: PageKey;
  slug?: string | null;
}) {
  // Pre-paint script in BaseLayout sets dataset.theme before React loads; read
  // it in the lazy initializer so the first render already matches.
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false; // SSR fallback
    return document.documentElement.dataset.theme === "dark";
  });
  const toggleTheme = useCallback(() => {
    setDark((d) => {
      const next = !d;
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
        document.documentElement.dataset.theme = next ? "dark" : "";
      } catch {}
      return next;
    });
  }, []);

  const navigate = useCallback((p: string, s: string | null = null) => {
    if (typeof window === "undefined") return;
    window.location.href = urlFor(p, s);
  }, []);

  const props = { dark, toggleTheme, onNavigate: navigate };
  if (page === "writing") return <WritingIndexV5 {...props} />;
  if (page === "essay")   return <ArticleV5 slug={slug || "jaya"} {...props} />;
  if (page === "work")    return <WorkV5 {...props} />;
  if (page === "now")     return <NowV5 {...props} />;
  if (page === "contact") return <ContactV5 {...props} />;
  return <HomeV5 {...props} />;
}
