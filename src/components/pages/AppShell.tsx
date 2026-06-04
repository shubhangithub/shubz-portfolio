// @ts-nocheck
/**
 * AppShell — wraps a page component with the dark-mode + navigation state
 * machine that used to live in the App() function in index.html. Each Astro
 * page renders the right page component with SSR + hydration.
 *
 * V5 dispatch:
 *   - The constant USE_V5 below is the single switch. Flip to `false` to
 *     restore the entire site to V4 — no other file changes needed.
 *   - V4 imports stay in this file (unused when USE_V5 is true) so the
 *     revert path is one-line and risk-free.
 *
 * See DECISIONS-v5.md at repo root for the full reasoning + revert recipe.
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  HomeV4,
  WritingIndexV4,
  ArticleV4,
  WorkV4,
  NowV4,
  ContactV4,
  PALETTE_V4_LIGHT,
  PALETTE_V4_DARK,
} from "../legacy";

// V5 page components — additive; V4 above stays in place for instant revert.
import { HomeV5 } from "./HomeV5";
import { WritingIndexV5 } from "./WritingIndexV5";
import { WorkV5 } from "./WorkV5";
import { NowV5 } from "./NowV5";
import { ContactV5 } from "./ContactV5";
import { ArticleV5 } from "./ArticleV5";

/**
 * V5 switch. Flip to `false` to restore V4 site-wide. Single point of
 * reversal — no other file change required. See DECISIONS-v5.md for context.
 */
const USE_V5 = true;

type PageKey = "home" | "writing" | "essay" | "work" | "now" | "contact";

function urlFor(page: PageKey, slug?: string | null) {
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
  // Dark-mode state. Pre-paint script in BaseLayout sets dataset.theme = "dark"
  // synchronously before React loads. Read it in the lazy initializer so the
  // FIRST render already uses the correct palette — avoids the 600ms body
  // background transition from cream → navy that was visible in Safari.
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
      } catch (_) {}
      return next;
    });
  }, []);
  const palette = dark ? PALETTE_V4_DARK : PALETTE_V4_LIGHT;

  const navigate = useCallback((p: PageKey, s: string | null = null) => {
    if (typeof window === "undefined") return;
    window.location.href = urlFor(p, s);
  }, []);

  // setCursorColor is a V4 no-op shim — V5 doesn't use it, but V4 essay
  // components still expect the prop to exist.
  const setCursorColor = useCallback(() => {}, []);

  // ---------------------------------------------------------------------------
  // V5 dispatch
  // ---------------------------------------------------------------------------
  if (USE_V5) {
    const v5Props = { dark, toggleTheme, onNavigate: navigate };
    if (page === "writing") return <WritingIndexV5 {...v5Props} />;
    if (page === "essay")   return <ArticleV5 slug={slug || "jaya"} {...v5Props} />;
    if (page === "work")    return <WorkV5 {...v5Props} />;
    if (page === "now")     return <NowV5 {...v5Props} />;
    if (page === "contact") return <ContactV5 {...v5Props} />;
    return <HomeV5 {...v5Props} />;
  }

  // ---------------------------------------------------------------------------
  // V4 dispatch (kept for one-line revert)
  // ---------------------------------------------------------------------------
  const sharedProps = {
    palette,
    onNavigate: navigate,
    setCursorColor,
    dark,
    toggleTheme,
  };

  if (page === "writing") return <WritingIndexV4 {...sharedProps} />;
  if (page === "essay")
    return <ArticleV4 slug={slug || "jaya"} {...sharedProps} />;
  if (page === "work") return <WorkV4 {...sharedProps} />;
  if (page === "now") return <NowV4 {...sharedProps} />;
  if (page === "contact") return <ContactV4 {...sharedProps} />;
  return (
    <HomeV4
      onNavigate={navigate}
      setCursorColor={setCursorColor}
      dark={dark}
      toggleTheme={toggleTheme}
      palette={palette}
    />
  );
}
