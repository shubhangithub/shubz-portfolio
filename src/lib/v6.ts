// v6.ts — runtime for the V6 motion grammar (DESIGN-v6.md §4).
//
// Reveal contract: components mark elements with `data-reveal` (values:
// "rise" | "develop" | "inkdraw" | "stamp"; optional `data-reveal-delay`,
// ms). Nothing is hidden until JS runs — observeReveals() adds the hidden
// class and an IntersectionObserver adds .v6-in as elements enter. No-JS
// visitors and prefers-reduced-motion users simply see everything.

import { useEffect, useState } from "react";

const CLASS_FOR: Record<string, string> = {
  rise: "v6-reveal",
  develop: "v6-develop",
  inkdraw: "v6-inkdraw",
  stamp: "v6-stamp",
};

let io: IntersectionObserver | null = null;

function observer(): IntersectionObserver {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("v6-in");
            io!.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return io;
}

/** Wire every un-wired [data-reveal] element on the page. Idempotent —
 *  safe to call again after client-side navigation or late mounts. */
export function observeReveals(root: ParentNode = document): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-v6-wired])");
  els.forEach((el) => {
    el.dataset.v6Wired = "1";
    const cls = CLASS_FOR[el.dataset.reveal || "rise"] || "v6-reveal";
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty("--v6-delay", `${delay}ms`);
    // Already fully above the fold? Reveal immediately with no transition
    // jank on first paint of content the visitor is looking at.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.7 && window.scrollY < 40) {
      el.classList.add(cls, "v6-in");
      return;
    }
    el.classList.add(cls);
    observer().observe(el);
  });
}

/** Page-level hook: wire reveals on mount and after each React commit of a
 *  navigation (the V5 shell soft-navigates). */
export function useV6Reveals(dep?: unknown): void {
  useEffect(() => {
    observeReveals();
  }, [dep]);
}

/** Hide-on-scroll-down, return-on-scroll-up for the sticky header. */
export function useHeaderHidden(threshold = 96): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        // Ignore sub-pixel jitter; always show near the top.
        if (Math.abs(delta) > 4) {
          if (y < threshold) setHidden(false);
          else setHidden(delta > 0);
          lastY = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);
  return hidden;
}

export type HudSection = { id: string; label: string };

/** Collect [data-hud] sections and track which one the reader is in.
 *  Returns the sections (for rendering the HUD) and the active id. */
export function useHudSections(dep?: unknown): {
  sections: HudSection[];
  active: string;
  visible: boolean;
} {
  const [sections, setSections] = useState<HudSection[]>([]);
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-hud]"));
    setSections(els.map((el) => ({ id: el.id, label: el.dataset.hud || el.id })));
    if (els.length < 2) return;

    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.33;
      let current = "";
      for (const el of els) {
        if (el.offsetTop <= probe) current = el.id;
      }
      setActive(current);
      const nearEnd =
        window.scrollY + window.innerHeight >
        document.documentElement.scrollHeight - 220;
      setVisible(window.scrollY > window.innerHeight * 0.5 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dep]);

  return { sections, active, visible };
}
