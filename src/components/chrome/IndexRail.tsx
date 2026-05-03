// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function IndexRail({ palette: p, items, currentIdx, telemetry, scrollPct }) {
  return (
    <div style={{ paddingTop: "0.4rem", fontFamily: "var(--f-ui)", fontSize: 12, color: p.muted, lineHeight: 1.7, position: "sticky", top: "1.2rem" }}>
      <div className="caps" style={{ marginBottom: 8, letterSpacing: "0.1em" }}>Index</div>
      {items.map((it, i) => (
        <div key={i} style={{ color: i === currentIdx ? p.ink : p.muted }}>
          <span className="mono">0{i + 1}</span>&nbsp;&nbsp;{it}
        </div>
      ))}
      <div style={{ marginTop: 28, borderTop: `1px solid ${p.line}`, paddingTop: 14, fontSize: 11 }}>
        <div className="caps" style={{ color: p.muted, marginBottom: 8, letterSpacing: "0.1em" }}>Telemetry</div>
        <div className="mono" style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 4, color: p.ink }}>
          {telemetry.map(([k, v], i) => (
            <React.Fragment key={i}>
              <span style={{ color: p.muted }}>{k}</span><span>{v}</span>
            </React.Fragment>
          ))}
          <span style={{ color: p.muted }}>scroll</span><span>{String(scrollPct).padStart(3, "0")}%</span>
        </div>
      </div>
    </div>
  );
}
