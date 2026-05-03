// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function PreciseEssayRow({ post, palette: p, onNavigate, index, total }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("essay", post.slug); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="v4-stack-row"
       style={{ display: "grid", gridTemplateColumns: "60px 1fr 200px 60px", gap: "1.4rem", alignItems: "baseline", padding: "1.4rem 0", borderTop: `1px solid ${p.line}`, color: p.ink, position: "relative" }}>
      <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      <div>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 6 }}>{post.kicker}</div>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "baseline" }}>
          <h3 className="display" style={{ fontSize: "1.55rem", margin: 0, fontWeight: 380, color: hover ? p.accent : p.ink, transition: "color 240ms var(--ease-out)" }}>{post.title}</h3>
          <span style={{ display: "inline-block", transform: hover ? "translateX(8px)" : "translateX(0)", transition: "transform 380ms var(--ease-spring)", color: p.accent, fontFamily: "var(--f-ui)" }}>↗</span>
        </div>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.55, color: p.muted, margin: "0.5rem 0 0", maxWidth: "62ch" }}>{post.dek}</p>
      </div>
      <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>2026.04</span>
      <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{post.minutes}m</span>
    </a>
  );
}
