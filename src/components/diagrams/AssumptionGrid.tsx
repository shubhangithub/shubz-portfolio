// @ts-nocheck
import React, { useState } from 'react';

const ASSUMPTIONS = [
  {
    id: "scalar",
    label: "Capability is scalar",
    breaks: "Intelligence-explosion arguments need a single scalar axis. If capability is a vector, 'more intelligent' stops being a destination.",
  },
  {
    id: "compute",
    label: "Compute is the binding lever",
    breaks: "The chip-control theory of governance. Export controls and weight-security treaties are aimed slightly off-target if the binding bottleneck is elsewhere.",
  },
  {
    id: "wellintentioned",
    label: "The developer is well-intentioned",
    breaks: "The layered defences stop being defences. A control protocol run by a bad-faith operator is theatre.",
  },
  {
    id: "timelines",
    label: "Timelines are short (3–10 years)",
    breaks: "Emergency framing inverts. Rules built for 2027 may lock in constraints that fit 2045 badly — Toner's stasism risk.",
  },
  {
    id: "western",
    label: "Western actors write the rules",
    breaks: "Entente and treaty proposals both require a decisive, durable Western lead. Without it they become a negotiating position, not a strategy.",
  },
  {
    id: "defence",
    label: "Defence is the goal",
    breaks: "You can win every defensive engagement and still lose — nothing pulls the system toward a good equilibrium.",
  },
];

const READINGS = [
  "Aschenbrenner",
  "Chollet",
  "Erdil",
  "AI 2027",
  "RAND",
  "Buterin",
  "Davidson",
  "Amodei",
];

// D = depends, V = violates, N = neutral
type Cell = "D" | "V" | "N";

const GRID: Cell[][] = [
  // Aschenbrenner, Chollet, Erdil, AI2027, RAND, Buterin, Davidson, Amodei
  ["D", "V", "N", "D", "N", "N", "N", "D"], // scalar
  ["D", "N", "V", "D", "N", "N", "N", "D"], // compute
  ["N", "N", "N", "N", "D", "V", "V", "D"], // well-intentioned
  ["D", "V", "V", "D", "N", "N", "N", "D"], // timelines
  ["D", "N", "N", "N", "D", "V", "N", "D"], // western
  ["D", "N", "N", "D", "D", "N", "D", "D"], // defence
];

function cellSymbol(v: Cell) {
  if (v === "D") return "●";
  if (v === "V") return "✗";
  return "◐";
}

export function AssumptionGrid({ palette: p }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const cellColor = (v: Cell, isRowHovered: boolean) => {
    if (v === "D") return isRowHovered ? p.accent : `color-mix(in srgb, ${p.accent} 70%, transparent)`;
    if (v === "V") return "#C44";
    return p.muted;
  };

  const assumption = hoveredRow !== null ? ASSUMPTIONS[hoveredRow] : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.8rem", alignItems: "start", overflowX: "auto" }}>
      {/* grid */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontFamily: "var(--f-ui)", fontSize: 11, width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: 170, textAlign: "left", padding: "0 0.5rem 0.5rem 0", color: p.muted, fontWeight: 400, fontSize: 10, letterSpacing: "0.06em" }}>ASSUMPTION</th>
              {READINGS.map((r, i) => (
                <th key={i} style={{
                  padding: "0 4px 0.5rem",
                  color: p.muted,
                  fontWeight: 400,
                  fontSize: 9,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  verticalAlign: "bottom",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  height: 72,
                }}>
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ASSUMPTIONS.map((a, ri) => {
              const isHov = hoveredRow === ri;
              return (
                <tr
                  key={a.id}
                  onMouseEnter={() => setHoveredRow(ri)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    cursor: "pointer",
                    background: isHov ? `color-mix(in srgb, ${p.paper} 80%, ${p.ink})` : "transparent",
                    transition: "background 150ms",
                  }}
                >
                  <td style={{
                    padding: "0.38rem 0.5rem 0.38rem 0",
                    color: isHov ? p.ink : p.muted,
                    fontWeight: isHov ? 600 : 400,
                    fontSize: 11,
                    whiteSpace: "nowrap",
                    borderBottom: `1px solid ${p.line}`,
                    transition: "color 150ms",
                  }}>
                    {a.label}
                  </td>
                  {GRID[ri].map((v, ci) => (
                    <td key={ci} style={{
                      textAlign: "center",
                      padding: "0.38rem 4px",
                      borderBottom: `1px solid ${p.line}`,
                      fontSize: v === "V" ? 11 : 14,
                      color: cellColor(v, isHov),
                      fontWeight: v === "D" && isHov ? 700 : 400,
                      transition: "color 150ms",
                      lineHeight: 1,
                    }}>
                      {cellSymbol(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* legend */}
        <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.7rem", fontFamily: "var(--f-ui)", fontSize: 10, color: p.muted }}>
          <span><span style={{ color: p.accent }}>●</span> depends on</span>
          <span><span style={{ color: p.muted }}>◐</span> neutral</span>
          <span><span style={{ color: "#C44" }}>✗</span> violates</span>
        </div>
      </div>

      {/* detail panel */}
      <div style={{
        minWidth: 200,
        maxWidth: 240,
        minHeight: 100,
        padding: "0.7rem 0.8rem",
        border: `1px solid ${p.line}`,
        background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
        borderRadius: 3,
        fontFamily: "var(--f-ui)",
        fontSize: 11,
        lineHeight: 1.6,
        color: assumption ? p.ink : p.muted,
        transition: "color 180ms",
      }}>
        {assumption ? (
          <>
            <strong style={{ color: p.accent, display: "block", marginBottom: 5, fontSize: 11 }}>
              If false:
            </strong>
            <strong style={{ color: p.ink, display: "block", marginBottom: 6, fontSize: 11 }}>
              {assumption.label}
            </strong>
            {assumption.breaks}
          </>
        ) : (
          "Hover a row to see what breaks if that assumption is false."
        )}
      </div>
    </div>
  );
}
