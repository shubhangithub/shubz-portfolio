// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';

export function ReadingRuler({ color = "currentColor", enabled = true }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);
  if (!enabled) return null;
  return (
    <div aria-hidden="true" style={{ position: "fixed", left: 24, top: 24, bottom: 24, width: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 80, pointerEvents: "none", opacity: progress > 0.01 ? 1 : 0, transition: "opacity 320ms var(--ease-out)" }}>
      {Array.from({ length: 22 }).map((_, i) => {
        const k = i / 21;
        const active = k <= progress;
        return <div key={i} style={{ width: active ? 14 : 7, height: 1, background: color, opacity: active ? 0.9 : 0.25, transition: "width 220ms var(--ease-out), opacity 220ms" }} />;
      })}
    </div>
  );
}
