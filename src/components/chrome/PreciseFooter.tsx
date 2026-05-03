// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function PreciseFooter({ palette: p, line = "Made in London." }) {
  return (
    <footer className="v4-grid" style={{ maxWidth: 1280, margin: "3rem auto 0", padding: "2rem 1.6rem 2.4rem", borderTop: `1px solid ${p.line}`, color: p.muted, fontFamily: "var(--f-ui)", fontSize: 12, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", letterSpacing: "0.02em" }}>
      <span style={{ gridColumn: "1 / span 6", fontStyle: "italic", fontFamily: "var(--f-body)", fontSize: 14, color: p.ink }}>{line}</span>
      <span className="mono" style={{ gridColumn: "7 / span 3", textAlign: "center" }}>
        <a href="/rss.xml" style={{ color: p.muted, textDecoration: "none" }} className="link-underline">RSS ↗</a>
      </span>
      <span className="mono" style={{ gridColumn: "10 / span 3", textAlign: "right" }}>© 2026 · last edit 2026.05.02</span>
    </footer>
  );
}
