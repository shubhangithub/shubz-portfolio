// @ts-nocheck
import React, { useState } from 'react';

const DOMAINS = [
  {
    id: "bio",
    label: "Drug discovery",
    segs: [
      { key: "intel", label: "intelligence-bottlenecked", pct: 0.52, color: "#3A5AA8" },
      { key: "expt",  label: "experiment time",           pct: 0.28, color: "#C68A4F" },
      { key: "reg",   label: "regulatory / clinical",     pct: 0.14, color: "#B04040" },
      { key: "phys",  label: "physical constraints",      pct: 0.06, color: "#888" },
    ],
    note: "Target identification and mechanism generation are highly intelligence-bottlenecked. But clinical trials — the dominant cost in drug development — run on human biology, not compute.",
  },
  {
    id: "neuro",
    label: "Mental health",
    segs: [
      { key: "intel", label: "intelligence-bottlenecked", pct: 0.44, color: "#3A5AA8" },
      { key: "expt",  label: "measurement / diagnosis",   pct: 0.22, color: "#C68A4F" },
      { key: "reg",   label: "regulatory / clinical",     pct: 0.18, color: "#B04040" },
      { key: "soc",   label: "social / access",           pct: 0.16, color: "#4F7A50" },
    ],
    note: "Diagnosis and treatment personalisation have high intelligence returns. But access, stigma, and social determinants of health are not intelligence problems — they require political and social change.",
  },
  {
    id: "dev",
    label: "Economic development",
    segs: [
      { key: "intel", label: "intelligence-bottlenecked", pct: 0.28, color: "#3A5AA8" },
      { key: "inst",  label: "institutional quality",     pct: 0.34, color: "#7A4F8A" },
      { key: "soc",   label: "social / political",        pct: 0.24, color: "#4F7A50" },
      { key: "inf",   label: "infrastructure",            pct: 0.14, color: "#888" },
    ],
    note: "Amodei is notably less confident here. Most development economists trace the growth gap to institutions and governance, not knowledge deficits — which are not straightforwardly intelligence problems.",
  },
  {
    id: "geo",
    label: "Geopolitics",
    segs: [
      { key: "intel", label: "intelligence-bottlenecked", pct: 0.30, color: "#3A5AA8" },
      { key: "pol",   label: "political / incentive",     pct: 0.42, color: "#B04040" },
      { key: "hist",  label: "historical / structural",   pct: 0.20, color: "#7A4F8A" },
      { key: "info",  label: "information / coordination",pct: 0.08, color: "#C68A4F" },
    ],
    note: "AI can improve decision-making at the margin. But geopolitical outcomes depend on incentive structures, domestic politics, and historical grievances — none of which get solved by more intelligence.",
  },
  {
    id: "work",
    label: "Work & meaning",
    segs: [
      { key: "intel", label: "intelligence-bottlenecked", pct: 0.20, color: "#3A5AA8" },
      { key: "cult",  label: "cultural / social",         pct: 0.36, color: "#4F7A50" },
      { key: "pol",   label: "policy / redistribution",   pct: 0.28, color: "#B04040" },
      { key: "psy",   label: "psychological",             pct: 0.16, color: "#7A4F8A" },
    ],
    note: "The least intelligence-bottlenecked domain. Even Amodei admits uncertainty here. Questions about what makes work meaningful are not resolved by access to more intelligence — they're the kind Bregman was gesturing at.",
  },
];

export function BottleneckMap({ palette: p }) {
  const [hovered, setHovered] = useState(null);
  const hov = DOMAINS.find(d => d.id === hovered);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      {/* bar chart */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 9, color: p.muted, marginBottom: 10 }}>
          <span>0%</span>
          <span>← fraction of bottleneck →</span>
          <span>100%</span>
        </div>
        {DOMAINS.map(d => {
          const isHov = d.id === hovered;
          return (
            <div key={d.id}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ marginBottom: 12, cursor: "pointer" }}
            >
              <div style={{ fontFamily: "var(--f-ui)", fontSize: 11, color: isHov ? p.ink : p.muted, marginBottom: 4, transition: "color 200ms", fontWeight: isHov ? 600 : 400 }}>
                {d.label}
              </div>
              <div style={{ display: "flex", height: 14, borderRadius: 2, overflow: "hidden", border: isHov ? `1px solid ${p.accent}` : `1px solid ${p.line}`, transition: "border-color 200ms" }}>
                {d.segs.map(s => (
                  <div key={s.key}
                    title={`${s.label}: ${Math.round(s.pct * 100)}%`}
                    style={{ width: `${s.pct * 100}%`, background: s.color, opacity: isHov ? 0.85 : 0.5, transition: "opacity 200ms, width 400ms var(--ease-out)" }}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {/* legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem", marginTop: 8 }}>
          {[
            { color: "#3A5AA8", label: "intelligence" },
            { color: "#C68A4F", label: "time / experiment" },
            { color: "#B04040", label: "regulatory / political" },
            { color: "#4F7A50", label: "social / cultural" },
            { color: "#7A4F8A", label: "structural / historical" },
            { color: "#888",    label: "physical / other" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--f-ui)", fontSize: 9, color: p.muted }}>
              <div style={{ width: 8, height: 8, background: l.color, opacity: 0.7, borderRadius: 1 }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* detail */}
      <div style={{
        minHeight: 100,
        fontFamily: "var(--f-ui)", fontSize: 11, lineHeight: 1.58,
        color: hov ? p.ink : p.muted,
        padding: "0.6rem 0.7rem",
        border: `1px solid ${p.line}`,
        background: `color-mix(in oklch, ${p.paper} 88%, ${p.ink})`,
        borderRadius: 3,
        transition: "color 180ms",
      }}>
        {hov
          ? <>
              <strong style={{ color: p.accent, display: "block", marginBottom: 4 }}>{hov.label}</strong>
              <div style={{ marginBottom: 8, display: "flex", flexWrap: "wrap", gap: "3px 8px" }}>
                {hov.segs.map(s => (
                  <span key={s.key} className="mono" style={{ fontSize: 9, color: s.color }}>
                    {s.label} {Math.round(s.pct * 100)}%
                  </span>
                ))}
              </div>
              {hov.note}
            </>
          : "Hover a domain to see how much of its progress is intelligence-bottlenecked versus constrained by time, regulatory systems, or social dynamics."
        }
      </div>
    </div>
  );
}
