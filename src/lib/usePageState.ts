import { useCallback, useState, useEffect } from "react";

function urlFor(page: string, slug?: string | null) {
 if (page === "essay" && slug) return `/${slug}/`;
 return page === "home" ? "/" : `/${page}/`;
}

export function usePageState() {
  // Dark SSR default; the pre-paint script restores an explicit saved choice.
  const [dark, setDark] = useState(true);
  useEffect(() => { setDark(document.documentElement.dataset.theme === "dark"); }, []);
  const toggleTheme = useCallback(() => {
    setDark((d) => {
      const next = !d;
      try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
      // Changing the current page must work even when persistence is blocked.
      document.documentElement.dataset.theme = next ? "dark" : "";
      document.documentElement.style.setProperty("--page-bg", "var(--nb-paper)");
      return next;
    });
  }, []);

  const navigate = useCallback((p: string, s: string | null = null) => {
    if (typeof window === "undefined") return;
    window.location.href = urlFor(p, s);
  }, []);

  return { dark, toggleTheme, onNavigate: navigate };
}
