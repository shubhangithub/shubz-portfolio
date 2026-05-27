// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useIsMobile } from '../legacy';
import { ThemeToggle } from './ThemeToggle';

export function PreciseTopBar({ palette: p, label, dark, toggleTheme }) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const isMobile = useIsMobile();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  // mobile: stack to two rows — name + label, then time. Drop "GMT" tail.
  return (
    <div style={{ borderBottom: `1px solid ${p.line}`, position: "relative", zIndex: 5, fontFamily: "var(--f-ui)", fontSize: isMobile ? 11 : 12, color: p.muted, padding: isMobile ? "0.5rem 1rem" : "0.7rem 1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: "0.04em" }}>
      <span className="mono">Shubz SHARMA</span>
      {!isMobile && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, animation: "blip 2s ease-in-out infinite" }} />
          <span className="mono" style={{ color: p.ink }}>{label}</span>
        </span>
      )}
      <span style={{ display: "inline-flex", alignItems: "center", gap: isMobile ? 8 : 14 }}>
        {!isMobile && <span className="mono">v.2026.04 · {hh}:{mm}:{ss} GMT</span>}
        <ThemeToggle dark={dark} toggleTheme={toggleTheme} palette={p} />
      </span>
      <style>{`@keyframes blip { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
