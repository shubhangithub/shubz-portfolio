// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useIsMobile } from '../legacy';

export function PreciseNav({ palette: p, current, onNavigate }) {
  const items = [["Home", "home"], ["Now", "now"], ["Work", "work"], ["Writing", "writing"], ["Contact", "contact"]];
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <nav style={{ position: "relative", zIndex: 5, padding: "0.9rem 1rem 0.6rem", maxWidth: 1280, margin: "0 auto", fontFamily: "var(--f-ui)", fontSize: 13, borderBottom: `1px dashed ${p.line}` }}>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: p.ink, marginBottom: "0.7rem" }}>
          <span style={{ width: 16, height: 16, display: "inline-block", color: p.accent }}>
            <svg viewBox="0 0 22 22"><text x="11" y="12" dominantBaseline="central" textAnchor="middle" fontFamily="Fraunces,Georgia,serif" fontSize="13" fontWeight="400" fontStyle="italic" fill="currentColor">SS</text></svg>
          </span>
          <span style={{ fontFamily: "var(--f-display)", fontSize: 15, letterSpacing: "-0.01em", fontWeight: 380 }}>Shubz Sharma</span>
        </a>
        <div style={{ display: "flex", gap: "1.4rem", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", paddingBottom: 2, marginRight: "-1rem", paddingRight: "1rem" }}>
          {items.map(([label, key], i) => (
            <a key={key} href="#" onClick={(e) => { e.preventDefault(); onNavigate(key); }}
               className="link-underline"
               style={{ color: current === key ? p.accent : p.ink, display: "inline-flex", alignItems: "baseline", gap: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
              <span className="mono" style={{ fontSize: 10, color: p.muted }}>0{i + 1}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    );
  }
  return (
    <nav style={{ position: "relative", zIndex: 5, padding: "1.2rem 1.6rem 1.4rem", maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "center", fontFamily: "var(--f-ui)", fontSize: 13, borderBottom: `1px dashed ${p.line}` }}>
      <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} style={{ gridColumn: "1 / span 3", display: "inline-flex", alignItems: "center", gap: "0.55rem", color: p.ink }}>
        <span style={{ width: 18, height: 18, display: "inline-block", color: p.accent }}>
          <svg viewBox="0 0 22 22"><text x="11" y="12" dominantBaseline="central" textAnchor="middle" fontFamily="Fraunces,Georgia,serif" fontSize="13" fontWeight="400" fontStyle="italic" fill="currentColor">SS</text></svg>
        </span>
        <span style={{ fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: "-0.01em", fontWeight: 380 }}>Shubz Sharma</span>
      </a>
      <div style={{ gridColumn: "5 / span 8", display: "flex", gap: "1.8rem", justifyContent: "flex-end" }}>
        {items.map(([label, key], i) => (
          <a key={key} href="#" onClick={(e) => { e.preventDefault(); onNavigate(key); }}
             className="link-underline"
             style={{ color: current === key ? p.accent : p.ink, display: "inline-flex", alignItems: "baseline", gap: 6 }}>
            <span className="mono" style={{ fontSize: 10, color: p.muted }}>0{i + 1}</span>
            <span>{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
