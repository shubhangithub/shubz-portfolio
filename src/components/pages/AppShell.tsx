// @ts-nocheck
/**
 * AppShell — wraps a legacy page component with the dark-mode + navigation
 * state machine that used to live in the App() function in index.html. Lets
 * each Astro page render the right legacy page with proper SSR + hydration.
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
  // Dark-mode state. Pre-paint script in BaseLayout already sets
  // document.documentElement.dataset.theme = "dark" if needed; we read it
  // back here so SSR vs hydration agree once JS runs.
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
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

  // setCursorColor is a no-op shim — the cursor color is driven by the
  // CursorTracker component in the chrome, not by the page.
  const setCursorColor = useCallback(() => {}, []);

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
