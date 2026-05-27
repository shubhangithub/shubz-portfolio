// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function ViolationNetwork({ palette: p }) {
  const [active, setActive] = React.useState(null); // clicked node
  const [pulseKey, setPulseKey] = React.useState(0); // reset pulse animation
  const nodes = [
    { id: "CD66b",  angle: -90  },
    { id: "CD56",   angle: -30  },
    { id: "CD8",    angle: 30   },
    { id: "CD20",   angle: 90   },
    { id: "CTLA-4", angle: 150  },
    { id: "CD4",    angle: 210  },
  ];
  const cannotLink = [
    ["CD66b", "CD4"], ["CD66b", "CD8"], ["CD66b", "CD20"], ["CD56", "CD20"],
  ];
  const lessLikely = [
    ["CD4", "CD8"], ["CD66b", "CD56"],
  ];
  const W = 420, H = 300;
  const cx = W / 2, cy = H / 2, radius = 95;
  const pos = Object.fromEntries(nodes.map(n => [n.id, {
    x: cx + Math.cos(n.angle * Math.PI / 180) * radius,
    y: cy + Math.sin(n.angle * Math.PI / 180) * radius,
  }]));

  const isInvolved = (nodeId) => {
    if (!active) return false;
    return cannotLink.some(([a, b]) => (a === active || b === active) && (a === nodeId || b === nodeId))
        || lessLikely.some(([a, b]) => (a === active || b === active) && (a === nodeId || b === nodeId));
  };

  const handleClick = (id) => {
    setActive(prev => prev === id ? null : id);
    setPulseKey(k => k + 1);
  };

  // edge-tracing pulse: animated circle travelling along constraint edges from the active node
  const pulseEdges = React.useMemo(() => {
    if (!active) return [];
    const edges = [];
    cannotLink.forEach(([a, b]) => {
      if (a === active || b === active) {
        const from = a === active ? a : b;
        const to = a === active ? b : a;
        edges.push({ from, to, type: "cannot", color: "#C2452A" });
      }
    });
    lessLikely.forEach(([a, b]) => {
      if (a === active || b === active) {
        const from = a === active ? a : b;
        const to = a === active ? b : a;
        edges.push({ from, to, type: "less", color: "#C68A4F" });
      }
    });
    return edges;
  }, [active]);

  // pulse animation keyframes (injected once)
  const pulseStyle = `@keyframes vn-pulse { 0% { offset-distance: 0%; opacity: 1; } 80% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }`;

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 280 }}>
        <style>{pulseStyle}</style>
        {cannotLink.map(([a, b], i) => {
          const pa = pos[a], pb = pos[b];
          const isActive = active && (active === a || active === b);
          return <line key={`c${i}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#C2452A" strokeWidth={isActive ? 2.4 : 1.4} opacity={isActive ? 0.9 : 0.35} style={{ transition: "all 240ms var(--ease-out)" }} />;
        })}
        {lessLikely.map(([a, b], i) => {
          const pa = pos[a], pb = pos[b];
          const isActive = active && (active === a || active === b);
          return <line key={`l${i}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#C68A4F" strokeWidth={isActive ? 2.4 : 1.4} strokeDasharray="5 4" opacity={isActive ? 0.9 : 0.35} style={{ transition: "all 240ms var(--ease-out)" }} />;
        })}
        {/* animated pulse dots along edges from active node */}
        {pulseEdges.map((edge, i) => {
          const pa = pos[edge.from], pb = pos[edge.to];
          const pathD = `M ${pa.x} ${pa.y} L ${pb.x} ${pb.y}`;
          return (
            <g key={`pulse-${pulseKey}-${i}`}>
              <path id={`vn-path-${pulseKey}-${i}`} d={pathD} fill="none" stroke="none" />
              <circle r="5" fill={edge.color} opacity="0" style={{ offsetPath: `path("${pathD}")`, animation: `vn-pulse 500ms ${i * 120}ms ease-out forwards` }} />
              <circle r="3" fill={edge.color} opacity="0" style={{ offsetPath: `path("${pathD}")`, animation: `vn-pulse 500ms ${i * 120 + 100}ms ease-out forwards` }} />
            </g>
          );
        })}
        {nodes.map(n => {
          const pt = pos[n.id];
          const isActive = active === n.id;
          const involved = isInvolved(n.id);
          return (
            <g key={n.id} onClick={() => handleClick(n.id)} onMouseEnter={() => !active && setActive(n.id)} onMouseLeave={() => !active && setActive(null)} style={{ cursor: "pointer" }}>
              <circle cx={pt.x} cy={pt.y} r={isActive ? 24 : 20} fill={p.paper} stroke={isActive ? p.accent : involved ? p.ink : p.muted} strokeWidth={isActive ? 2.4 : 1.2} style={{ transition: "all 240ms var(--ease-out)" }} />
              {isActive && <circle cx={pt.x} cy={pt.y} r={28} fill="none" stroke={p.accent} strokeWidth="1" opacity="0.3" style={{ transition: "all 240ms var(--ease-out)" }} />}
              <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9" fill={isActive ? p.accent : p.ink} style={{ pointerEvents: "none" }}>{n.id}</text>
            </g>
          );
        })}
        <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={p.muted}>{active ? `${active} constraints` : "click a marker"}</text>
      </svg>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Constraint types</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
          <span style={{ width: 16, height: 2, background: "#C2452A", display: "inline-block" }} />
          <span style={{ fontSize: 11, color: p.ink }}>cannot co-express</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
          <span style={{ width: 16, height: 2, background: "#C68A4F", display: "inline-block", borderBottom: "1px dashed #C68A4F" }} />
          <span style={{ fontSize: 11, color: p.ink }}>unlikely to co-express</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>
          {active
            ? `${active}: ${cannotLink.filter(([a,b]) => a===active||b===active).length} cannot-link, ${lessLikely.filter(([a,b]) => a===active||b===active).length} less-likely. Click again to deselect.`
            : "Click a marker to see its constraints animate. CD66b has the most — neutrophils can't be lymphocytes."}
        </div>
      </div>
    </div>
  );
}
