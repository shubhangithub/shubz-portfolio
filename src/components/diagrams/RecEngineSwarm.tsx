// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function RecEngineSwarm({ palette: p }) {
  const W = 480, H = 320;
  const cx = W / 2, cy = H / 2;
  const engines = [
    { id: "lyrics", label: "Lyrics-Transformer",  short: "LYR", angle: -90, color: p.accent },
    { id: "vae",    label: "Audio VAE (384→16D)", short: "VAE", angle: -30, color: "#8B5A89" },
    { id: "graph",  label: "Graph node2vec",      short: "GRP", angle: 30,  color: "#5B7A4F" },
    { id: "ncf",    label: "Neural Collab",       short: "NCF", angle: 90,  color: "#C68A4F" },
    { id: "ssl",    label: "Contrastive SSL",     short: "SSL", angle: 150, color: "#4F7A8B" },
    { id: "ens",    label: "Ensemble (weighted)", short: "ENS", angle: 210, color: p.ink },
  ];
  const [enabled, setEnabled] = React.useState(() => Object.fromEntries(engines.map(e => [e.id, true])));
  const [hover, setHover] = React.useState(null); // song idx or null
  const radius = 110;

  const titles = [
    "All Too Well (10 Min)", "Cruel Summer", "August", "Cardigan", "Anti-Hero",
    "Mirrorball", "Style", "Out of the Woods", "Champagne Problems", "The 1",
    "Daylight", "Exile", "Willow", "Lavender Haze",
  ];

  const songs = React.useMemo(() => {
    let s = 13;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const out = [];
    for (let i = 0; i < titles.length; i++) {
      const a = r() * Math.PI * 2;
      out.push({
        x: cx + Math.cos(a) * (radius + 50 + r() * 30),
        y: cy + Math.sin(a) * (radius + 40 + r() * 30),
        title: titles[i],
      });
    }
    return out;
  }, [cx, cy]);

  // each engine connects deterministically to a fixed subset of songs
  const linksByEngine = React.useMemo(() => Object.fromEntries(engines.map((e, ei) => {
    const set = new Set();
    for (let k = 0; k < 5; k++) set.add((ei * 3 + k * 2 + 1) % songs.length);
    return [e.id, [...set]];
  })), [songs.length]);

  // votes per song = count of currently-enabled engines that surface it
  const votes = songs.map((_, idx) => engines.reduce((acc, e) => acc + (enabled[e.id] && linksByEngine[e.id].includes(idx) ? 1 : 0), 0));

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 300, background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`, border: `1px solid ${p.line}` }}>
          {engines.map(e => {
            if (!enabled[e.id]) return null;
            const ex = cx + Math.cos(e.angle * Math.PI / 180) * radius;
            const ey = cy + Math.sin(e.angle * Math.PI / 180) * radius;
            return (
              <g key={e.id} style={{ transition: "opacity 240ms" }}>
                {linksByEngine[e.id].map((sIdx, j) => (
                  <line key={j} x1={ex} y1={ey} x2={songs[sIdx].x} y2={songs[sIdx].y} stroke={e.color} strokeWidth={votes[sIdx] >= 2 ? 1.4 : 0.6} strokeOpacity={hover === sIdx ? 0.9 : 0.45} />
                ))}
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="14" fill={p.paper} stroke={p.ink} strokeWidth="1.5" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9" fill={p.ink}>q</text>
          {engines.map(e => {
            const ex = cx + Math.cos(e.angle * Math.PI / 180) * radius;
            const ey = cy + Math.sin(e.angle * Math.PI / 180) * radius;
            const on = enabled[e.id];
            return (
              <g key={e.id} onClick={() => setEnabled(s => ({ ...s, [e.id]: !s[e.id] }))} style={{ cursor: "pointer", opacity: on ? 1 : 0.3, transition: "opacity 220ms" }}>
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={p.muted} strokeOpacity={0.25} />
                <circle cx={ex} cy={ey} r="14" fill={on ? p.paper : "transparent"} stroke={e.color} strokeWidth="1.6" />
                <text x={ex} y={ey + 3} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill={e.color}>{e.short}</text>
              </g>
            );
          })}
          {songs.map((s, i) => votes[i] === 0 ? null : (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <circle cx={s.x} cy={s.y} r={votes[i] >= 2 ? 4.5 : 3} fill={votes[i] >= 2 ? p.accent : p.muted} opacity={hover === i ? 1 : 0.85} />
              {hover === i && <circle cx={s.x} cy={s.y} r={9} fill="none" stroke={p.accent} strokeWidth="1" strokeOpacity="0.6" />}
            </g>
          ))}
        </svg>
        <div className="mono" style={{ position: "absolute", left: 8, bottom: 8, fontSize: 10, color: hover === null ? p.muted : p.ink, padding: "2px 6px", background: `color-mix(in srgb, ${p.paper} 92%, ${p.ink})`, border: `1px solid ${p.line}`, minWidth: 180 }}>
          {hover === null ? "hover a song · click an engine to toggle" : `♪ ${songs[hover].title} · ${votes[hover]}/${engines.filter(e => enabled[e.id]).length} surfaced`}
        </div>
      </div>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Engines · click to toggle</div>
        {engines.map(e => (
          <div key={e.id} onClick={() => setEnabled(s => ({ ...s, [e.id]: !s[e.id] }))} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", cursor: "pointer", color: enabled[e.id] ? p.ink : p.muted, transition: "color 220ms" }}>
            <span style={{ width: 12, height: 12, border: `1px solid ${e.color}`, background: enabled[e.id] ? e.color : "transparent", flexShrink: 0, position: "relative" }} />
            <span style={{ flex: 1, fontSize: 11, textDecoration: enabled[e.id] ? "none" : "line-through" }}>{e.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 10, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>Filled songs = surfaced by ≥2 enabled engines. Toggle one off and the consensus shifts.</div>
      </div>
    </div>
  );
}
