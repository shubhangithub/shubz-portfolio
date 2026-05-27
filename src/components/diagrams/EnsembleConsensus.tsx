// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function EnsembleConsensus({ palette: p }) {
  const engineDefs = [
    { id: "lyrics", label: "Lyrics",       color: p.accent },
    { id: "vae",    label: "Audio VAE",    color: "#8B5A89" },
    { id: "graph",  label: "Graph",        color: "#5B7A4F" },
    { id: "ncf",    label: "Collab",       color: "#C68A4F" },
    { id: "ssl",    label: "SSL",          color: "#4F7A8B" },
  ];
  const [weights, setWeights] = React.useState({ lyrics: 0.30, vae: 0.20, graph: 0.20, ncf: 0.15, ssl: 0.15 });
  const [hover, setHover] = React.useState(null);

  // synthetic song scores per engine (deterministic)
  const songs = React.useMemo(() => {
    let s = 77;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return [
      { title: "All Too Well (10 Min)", scores: { lyrics: 0.92, vae: 0.55, graph: 0.78, ncf: 0.60, ssl: 0.45 } },
      { title: "August",               scores: { lyrics: 0.65, vae: 0.88, graph: 0.50, ncf: 0.72, ssl: 0.80 } },
      { title: "Anti-Hero",            scores: { lyrics: 0.40, vae: 0.70, graph: 0.85, ncf: 0.90, ssl: 0.55 } },
      { title: "Cardigan",             scores: { lyrics: 0.85, vae: 0.75, graph: 0.42, ncf: 0.35, ssl: 0.68 } },
      { title: "Cruel Summer",         scores: { lyrics: 0.50, vae: 0.82, graph: 0.65, ncf: 0.78, ssl: 0.90 } },
      { title: "Mirrorball",           scores: { lyrics: 0.78, vae: 0.60, graph: 0.30, ncf: 0.42, ssl: 0.72 } },
    ];
  }, []);

  // compute ensemble score for each song
  const ranked = songs.map(song => {
    const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
    const score = engineDefs.reduce((acc, e) => acc + (weights[e.id] / total) * song.scores[e.id], 0);
    // consensus boost: count engines with score > 0.6
    const surfaced = engineDefs.filter(e => song.scores[e.id] > 0.6).length;
    const boost = surfaced >= 2 ? 0.10 : 0;
    return { ...song, score: score + boost, surfaced };
  }).sort((a, b) => b.score - a.score);

  const sliderStyle = { width: "100%", height: 4 };

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
      <div>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Engine weights · drag to rebalance</div>
        {engineDefs.map(e => (
          <div key={e.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 10, color: p.muted, marginBottom: 2 }}>
              <span style={{ color: e.color }}>{e.label}</span>
              <span style={{ color: p.ink }}>{weights[e.id].toFixed(2)}</span>
            </div>
            <input type="range" min={0} max={0.5} step={0.01} value={weights[e.id]} onChange={ev => setWeights(w => ({ ...w, [e.id]: +ev.target.value }))} style={{ ...sliderStyle, accentColor: e.color }} />
          </div>
        ))}
        <div className="mono" style={{ fontSize: 9, color: p.muted, marginTop: 4 }}>final_score = Σ w_i · s_i + consensus_boost</div>
      </div>
      <div>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Ranking · updates live</div>
        {ranked.map((song, i) => {
          const isHov = hover === song.title;
          return (
            <div key={song.title} onMouseEnter={() => setHover(song.title)} onMouseLeave={() => setHover(null)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px solid ${p.line}`, cursor: "pointer", transition: "background 200ms", background: isHov ? `color-mix(in oklch, ${p.accent} 6%, transparent)` : "transparent" }}>
              <span className="mono" style={{ fontSize: 10, color: p.muted, width: 16 }}>{i + 1}</span>
              <span style={{ flex: 1, fontFamily: "var(--f-ui)", fontSize: 11, color: p.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</span>
              <span className="mono" style={{ fontSize: 10, color: p.accent }}>{song.score.toFixed(2)}</span>
            </div>
          );
        })}
        {hover && (() => {
          const song = songs.find(s => s.title === hover);
          if (!song) return null;
          return (
            <div style={{ marginTop: 8, fontSize: 10, color: p.muted, lineHeight: 1.5, fontFamily: "var(--f-ui)" }}>
              {engineDefs.map(e => (
                <span key={e.id} style={{ marginRight: 8 }}>
                  <span style={{ color: e.color }}>{e.label}</span>
                  <span className="mono" style={{ marginLeft: 3 }}>{song.scores[e.id].toFixed(2)}</span>
                </span>
              ))}
            </div>
          );
        })()}
        {!hover && <div style={{ marginTop: 8, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>Hover a song to see per-engine scores. Drag a weight to watch the ranking shift.</div>}
      </div>
    </div>
  );
}
