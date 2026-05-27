// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';

export function CustomCursor({ color = "#B85C3C" }) {
  const dotRef = useRef(null);
  const [mode, setMode] = useState("default"); // default | link | text | hidden
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    if ("ontouchstart" in window) return; // desktop only
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function onMove(e) {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) { setMode("default"); return; }
      const interactive = el.closest("a, button, [role='button'], input, textarea, select, label");
      const prose = el.closest(".prose, p, h1, h2, h3, li, blockquote");
      if (interactive) setMode("link");
      else if (prose) setMode("text");
      else setMode("default");
    }
    function tick() {
      const lag = reduced ? 1 : 0.22;
      pos.current.x += (target.current.x - pos.current.x) * lag;
      pos.current.y += (target.current.y - pos.current.y) * lag;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  const size = mode === "link" ? 22 : mode === "text" ? 2 : 10;
  const width = mode === "text" ? 2 : size;
  const height = mode === "text" ? 22 : size;

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width, height,
        marginLeft: -width / 2, marginTop: -height / 2,
        background: color,
        borderRadius: mode === "text" ? 0 : "50%",
        mixBlendMode: "multiply",
        pointerEvents: "none",
        zIndex: 9999,
        transition: "width 240ms var(--ease-spring), height 240ms var(--ease-spring), border-radius 240ms var(--ease-out), background 180ms ease, opacity 180ms",
      }}
    />
  );
}
