// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { FourierMotif } from '../legacy';

export function FeaturedPrecise({ post, palette: p, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" className="v4-grid" onClick={(e) => { e.preventDefault(); onNavigate("essay", post.slug); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", padding: "1.6rem 0", borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}`, color: p.ink, alignItems: "start" }}>
      <span className="mono" style={{ gridColumn: "1 / span 2", color: p.muted, fontSize: 11 }}>fig.{String(1).padStart(2, "0")}<br/>featured</span>
      <div style={{ gridColumn: "3 / span 6" }}>
        <div className="caps mono" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em", marginBottom: 12 }}>{post.kicker}</div>
        <h3 className="display" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", margin: 0, fontWeight: 360, lineHeight: 1, color: hover ? p.accent : p.ink, transition: "color 320ms var(--ease-out)" }}>
          {post.title}
          <span style={{ display: "inline-block", marginLeft: 14, transform: hover ? "translateX(10px)" : "translateX(0)", transition: "transform 380ms var(--ease-spring)", color: p.accent, fontSize: "0.6em", verticalAlign: "0.1em" }}>↗</span>
        </h3>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: p.muted, margin: "1rem 0 0", maxWidth: "52ch" }}>{post.dek}</p>
        <div className="mono" style={{ marginTop: 18, fontSize: 11, color: p.muted, display: "flex", gap: 18 }}>
          <span>read · {post.minutes} min</span>
          <span>est. {Math.round(post.minutes * 240)} words</span>
          <span>last revised · 2026.04</span>
        </div>
      </div>
      <div style={{ gridColumn: "10 / span 3", border: `1px solid ${p.line}`, padding: "0.8rem", aspectRatio: "1 / 1", display: "grid", placeItems: "center", background: `color-mix(in oklch, ${p.paper} 85%, ${p.ink})` }}>
        <FourierMotif shape={post.illustration === "skate" ? "skate" : (post.illustration === "protocol" ? "wave" : "hex")} size={180} density={hover ? 30 : 18} strokeColor={p.accent} trailColor={`color-mix(in oklch, ${p.accent} 50%, transparent)`} epicycleColor={`color-mix(in oklch, ${p.ink} 8%, transparent)`} />
      </div>
    </a>
  );
}
