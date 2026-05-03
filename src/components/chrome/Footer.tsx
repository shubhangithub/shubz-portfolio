// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function Footer({ palette, line }) {
  const p = palette;
  return (
    <footer style={{ borderTop: `1px solid ${p.line}`, padding: "2.4rem 2.2rem 3rem", maxWidth: 1240, margin: "4rem auto 0", color: p.muted, fontFamily: "var(--f-ui)", fontSize: 13, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1.2rem", position: "relative", zIndex: 2 }}>
      <span style={{ fontStyle: "italic", fontFamily: "var(--f-body)" }}>{line}</span>
      <span className="mono">© Shubz Sharma — set in Fraunces &amp; Source Serif</span>
    </footer>
  );
}
