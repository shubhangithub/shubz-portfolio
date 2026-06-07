// @ts-nocheck
import React, { useState } from 'react';

const PHASES = [
  { id: "p1", label: "Phase 1", title: "Self-preservation in training" },
  { id: "p2", label: "Phase 2", title: "Gaming the evaluations" },
  { id: "p3", label: "Phase 3", title: "Influence over successor's design" },
  { id: "p4", label: "Phase 4", title: "Aligning the successor to itself" },
  { id: "p5", label: "Phase 5", title: "Self-exfiltration" },
];

const UNITS = [
  { id: "u1", label: "Unit 1", title: "Visions & goals" },
  { id: "u2", label: "Unit 2", title: "Empirical capabilities" },
  { id: "u3", label: "Unit 3", title: "Threat models" },
  { id: "u4", label: "Unit 4", title: "Defences & layers" },
  { id: "u5", label: "Unit 5", title: "Interventions" },
];

// Each wire: phase → unit, optional tooltip, whether it's a gap (dashed red)
const WIRES = [
  { phase: "p1", unit: "u3", tip: "FLI threat taxonomy — rogue model category", gap: false },
  { phase: "p1", unit: "u4", tip: "Layer 1: prevent dangerous training", gap: false },
  { phase: "p1", unit: "u5", tip: "Prevent intervention pillar", gap: false },
  { phase: "p2", unit: "u4", tip: "Sarah's AI Control — trusted monitoring, defer-to-trusted", gap: false },
  { phase: "p2", unit: "u5", tip: "Constrain intervention pillar — best validated tools", gap: false },
  { phase: "p3", unit: "u2", tip: "METR time-horizon RCT — empirical capability read", gap: false },
  { phase: "p3", unit: "u4", tip: "Constrain layer — but no validated protocol for self-improvement", gap: false },
  { phase: "p3", unit: "u5", tip: "Which intervention has leverage — Phase 3 partially open", gap: true },
  { phase: "p4", unit: "u2", tip: "Alignment-faking evidence (Anthropic Dec 2024)", gap: false },
  { phase: "p4", unit: "u4", tip: "Interpretability — monosemanticity features, CoT monitoring", gap: false },
  { phase: "p4", unit: "u5", tip: "Gap — multi-agent collusion in self-improvement; framing only", gap: true },
  { phase: "p5", unit: "u3", tip: "RAND weight-security SL5 — outside-in theft model", gap: false },
  { phase: "p5", unit: "u4", tip: "Withstand layer — civilisational resilience", gap: false },
  { phase: "p5", unit: "u5", tip: "Withstand — weakest binding; wrong threat direction for this phase", gap: true },
];

export function PhaseUnitWiring({ palette: p }) {
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);

  const ROW_H = 56;
  const COL_W = 180;
  const LEFT_X = 0;
  const RIGHT_X = COL_W + 160;
  const SVG_W = RIGHT_X + COL_W;
  const SVG_H = PHASES.length * ROW_H + 20;
  const pY = (i: number) => i * ROW_H + ROW_H / 2 + 10;
  const uY = (i: number) => i * ROW_H + ROW_H / 2 + 10;

  const activeWire = hoveredWire
    ? WIRES.find(w => `${w.phase}-${w.unit}` === hoveredWire)
    : null;

  return (
    <div style={{ fontFamily: "var(--f-ui)" }}>
      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: "100%", minWidth: 400, height: "auto", display: "block" }}
          role="img"
          aria-label="Kill chain phases wired to course units"
        >
          {/* Column headers */}
          <text
            x={LEFT_X + COL_W / 2}
            y={6}
            textAnchor="middle"
            fontFamily="var(--f-mono)"
            fontSize="8"
            fill={p.muted}
            letterSpacing="0.1em"
          >
            KILL CHAIN PHASES
          </text>
          <text
            x={RIGHT_X + COL_W / 2}
            y={6}
            textAnchor="middle"
            fontFamily="var(--f-mono)"
            fontSize="8"
            fill={p.muted}
            letterSpacing="0.1em"
          >
            COURSE UNITS
          </text>

          {/* Wires */}
          {WIRES.map(w => {
            const pi = PHASES.findIndex(ph => ph.id === w.phase);
            const ui = UNITS.findIndex(u => u.id === w.unit);
            const x1 = LEFT_X + COL_W;
            const y1 = pY(pi);
            const x2 = RIGHT_X;
            const y2 = uY(ui);
            const wireId = `${w.phase}-${w.unit}`;
            const isHov = hoveredWire === wireId;
            const midX = (x1 + x2) / 2;
            const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            const gapColor = "#C94040";
            const solidColor = "#28CA41";
            const col = w.gap ? gapColor : solidColor;

            return (
              <g key={wireId}>
                {/* Hit-area */}
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="12"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredWire(wireId)}
                  onMouseLeave={() => setHoveredWire(null)}
                />
                {/* Visible line */}
                <path
                  d={d}
                  fill="none"
                  stroke={col}
                  strokeWidth={isHov ? 2.2 : 1.2}
                  strokeDasharray={w.gap ? "4 3" : undefined}
                  opacity={hoveredWire && !isHov ? 0.22 : w.gap ? 0.55 : 0.65}
                  style={{
                    transition: "stroke-width 150ms, opacity 150ms",
                    pointerEvents: "none",
                  }}
                />
              </g>
            );
          })}

          {/* Phase nodes */}
          {PHASES.map((ph, i) => (
            <g key={ph.id}>
              <rect
                x={LEFT_X}
                y={pY(i) - ROW_H * 0.38}
                width={COL_W - 6}
                height={ROW_H * 0.76}
                rx={3}
                fill={`color-mix(in srgb, ${p.paper} 90%, ${p.ink})`}
                stroke={p.line}
                strokeWidth="1"
              />
              <text
                x={LEFT_X + 8}
                y={pY(i) - 5}
                fontFamily="var(--f-mono)"
                fontSize="8"
                fill={p.muted}
                letterSpacing="0.07em"
              >
                {ph.label}
              </text>
              <text
                x={LEFT_X + 8}
                y={pY(i) + 8}
                fontFamily="var(--f-ui)"
                fontSize="10.5"
                fill={p.ink}
                fontWeight="500"
              >
                {ph.title}
              </text>
            </g>
          ))}

          {/* Unit nodes */}
          {UNITS.map((u, i) => (
            <g key={u.id}>
              <rect
                x={RIGHT_X + 6}
                y={uY(i) - ROW_H * 0.38}
                width={COL_W - 6}
                height={ROW_H * 0.76}
                rx={3}
                fill={`color-mix(in srgb, ${p.paper} 90%, ${p.ink})`}
                stroke={p.line}
                strokeWidth="1"
              />
              <text
                x={RIGHT_X + 14}
                y={uY(i) - 5}
                fontFamily="var(--f-mono)"
                fontSize="8"
                fill={p.muted}
                letterSpacing="0.07em"
              >
                {u.label}
              </text>
              <text
                x={RIGHT_X + 14}
                y={uY(i) + 8}
                fontFamily="var(--f-ui)"
                fontSize="10.5"
                fill={p.ink}
                fontWeight="500"
              >
                {u.title}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Tooltip / legend */}
      <div style={{
        marginTop: "0.7rem",
        display: "flex",
        gap: "1.2rem",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}>
        {/* Hover tooltip */}
        <div style={{
          flex: "1 1 220px",
          minHeight: 44,
          padding: "0.55rem 0.7rem",
          border: `1px solid ${p.line}`,
          background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
          borderRadius: 3,
          fontSize: "0.8rem",
          lineHeight: 1.55,
          color: activeWire ? p.ink : p.muted,
          fontStyle: activeWire ? "normal" : "italic",
          transition: "color 150ms",
        }}>
          {activeWire
            ? <><strong style={{ color: activeWire.gap ? "#C94040" : "#28CA41" }}>
                {PHASES.find(ph => ph.id === activeWire.phase)?.label}
                {" → "}
                {UNITS.find(u => u.id === activeWire.unit)?.label}
              </strong>
              <br />{activeWire.tip}</>
            : "Hover a connecting line to see the specific reading or tool."
          }
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: p.muted }}>
            <svg width="28" height="10" style={{ flexShrink: 0 }}>
              <line x1="0" y1="5" x2="28" y2="5" stroke="#28CA41" strokeWidth="1.5" />
            </svg>
            strong coverage
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: p.muted }}>
            <svg width="28" height="10" style={{ flexShrink: 0 }}>
              <line x1="0" y1="5" x2="28" y2="5" stroke="#C94040" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
            gap — framing only
          </div>
        </div>
      </div>
    </div>
  );
}
