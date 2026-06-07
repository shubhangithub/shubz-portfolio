// @ts-nocheck
import React, { useState } from 'react';

const PILLARS = [
  {
    id: "bio",
    name: "Bio defence",
    dotColor: "#C94040",
    examples: [
      { text: "Verifiable open-source vaccines — Balvi-funded mRNA platform documentation", distributed: true },
      { text: "Germicidal UV and clean indoor air — d/acc event showcase (2025–26)", distributed: true },
      { text: "Wastewater pathogen detection — open-source analysis pipeline", distributed: true },
    ],
  },
  {
    id: "cyber",
    name: "Cyber defence",
    dotColor: "#3A82C4",
    examples: [
      { text: "Open-source security tooling — community-auditable hardening", distributed: true },
      { text: "Distributed intrusion detection — no single chokepoint", distributed: true },
      { text: "Community-based vulnerability disclosure — coordinated CVE reporting", distributed: false },
    ],
  },
  {
    id: "info",
    name: "Info defence",
    dotColor: "#C9A030",
    examples: [
      { text: "Community Notes — decentralised fact-checking on social platforms", distributed: true },
      { text: "Prediction markets — calibrated crowd-sourced forecasting", distributed: true },
      { text: "Open-source news analysis tools — shared infrastructure for provenance", distributed: true },
    ],
  },
  {
    id: "social",
    name: "Social defence",
    dotColor: "#4F8A5A",
    examples: [
      { text: "Plurality / quadratic funding — Gitcoin and Balvi grants experiments", distributed: true },
      { text: "Decentralised identity — EAS attestations, no registry monopoly", distributed: true },
      { text: "Open governance coordination — Pol.is, RxC, d/acc org tooling", distributed: true },
    ],
  },
];

export function DefencePillars({ palette: p }) {
  const [showConcentrated, setShowConcentrated] = useState(false);

  const cardBg = `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`;

  return (
    <div>
      {/* toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
        <button
          onClick={() => setShowConcentrated(false)}
          style={{
            padding: "3px 10px",
            fontFamily: "var(--f-mono, monospace)",
            fontSize: 10,
            letterSpacing: "0.06em",
            border: `1px solid ${p.line}`,
            borderRadius: 2,
            background: !showConcentrated ? p.accent : "transparent",
            color: !showConcentrated ? p.paper : p.muted,
            cursor: "pointer",
            transition: "background 180ms, color 180ms",
          }}
        >distributed</button>
        <span style={{ fontFamily: "var(--f-mono, monospace)", fontSize: 10, color: p.muted }}>↔</span>
        <button
          onClick={() => setShowConcentrated(true)}
          style={{
            padding: "3px 10px",
            fontFamily: "var(--f-mono, monospace)",
            fontSize: 10,
            letterSpacing: "0.06em",
            border: `1px solid ${p.line}`,
            borderRadius: 2,
            background: showConcentrated ? p.accent : "transparent",
            color: showConcentrated ? p.paper : p.muted,
            cursor: "pointer",
            transition: "background 180ms, color 180ms",
          }}
        >concentrated</button>
        <span style={{ fontFamily: "var(--f-ui, sans-serif)", fontSize: 10, color: p.muted, marginLeft: 4 }}>
          — highlighting {showConcentrated ? "single-actor" : "many-actor"} examples
        </span>
      </div>

      {/* 2×2 grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "0.75rem",
      }}>
        {PILLARS.map(pillar => (
          <div
            key={pillar.id}
            style={{
              border: `1px solid ${p.line}`,
              background: cardBg,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {/* card header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.45rem 0.7rem",
              background: `color-mix(in srgb, ${p.paper} 78%, ${p.ink})`,
              borderBottom: `1px solid ${p.line}`,
            }}>
              <div style={{
                width: 8, height: 8,
                borderRadius: "50%",
                background: pillar.dotColor,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--f-mono, monospace)",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: pillar.dotColor,
                textTransform: "uppercase",
              }}>{pillar.name}</span>
            </div>

            {/* examples */}
            <ul style={{
              margin: 0,
              padding: "0.5rem 0.7rem 0.6rem 1.2rem",
              listStyle: "disc",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}>
              {pillar.examples.map((ex, i) => {
                const isHighlighted = showConcentrated
                  ? !ex.distributed   // highlight concentrated (single-actor)
                  : ex.distributed;   // highlight distributed (many-actor)
                return (
                  <li
                    key={i}
                    style={{
                      fontFamily: "var(--f-ui, sans-serif)",
                      fontSize: "0.78rem",
                      lineHeight: 1.5,
                      color: isHighlighted ? p.ink : p.muted,
                      transition: "color 200ms",
                    }}
                  >
                    {ex.text}
                    {!ex.distributed && (
                      <span style={{
                        marginLeft: 5,
                        fontFamily: "var(--f-mono, monospace)",
                        fontSize: 9,
                        color: isHighlighted ? pillar.dotColor : p.muted,
                        opacity: 0.7,
                        transition: "color 200ms",
                      }}>[concentrated]</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
