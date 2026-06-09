// @ts-nocheck
import React, { useState } from 'react';

const READINGS = [
  { id: "chollet",     label: "Chollet",           x: -0.75, y:  0.72, cluster: "civilization", unit: "civilization" },
  { id: "buterin",     label: "Buterin",            x:  0.30, y:  0.85, cluster: "civilization", unit: "civilization" },
  { id: "solarpunk",   label: "Solarpunk",          x: -0.20, y:  0.95, cluster: "civilization", unit: "civilization" },
  { id: "bluedot",     label: "BlueDot withstand",  x: -0.05, y:  0.80, cluster: "civilization", unit: "civilization" },
  { id: "narayanan",   label: "Narayanan & Kapoor", x: -0.55, y:  0.45, cluster: "civilization", unit: "civilization" },
  { id: "sarah",       label: "Sarah / Redwood",    x:  0.45, y: -0.80, cluster: "model",        unit: "model"        },
  { id: "jones",       label: "Jones · alignment",  x:  0.10, y: -0.65, cluster: "model",        unit: "model"        },
  { id: "rand",        label: "RAND · weights",     x: -0.15, y: -0.25, cluster: "lab",          unit: "lab"          },
  { id: "samuel",      label: "Samuel · Vox",       x: -0.60, y: -0.35, cluster: "lab",          unit: "lab"          },
  { id: "aschenbrenner",label:"Aschenbrenner",      x:  0.80, y: -0.15, cluster: "state",        unit: "state"        },
  { id: "amodei",      label: "Amodei",             x:  0.65, y:  0.20, cluster: "state",        unit: "state"        },
  { id: "davidson",    label: "Davidson · Coups",   x: -0.35, y: -0.05, cluster: "state",        unit: "state"        },
];

const CLUSTER_COLORS = {
  civilization: "#E07940",  // warm orange accent
  model:        "#3A82C4",  // cool blue
  lab:          "#4F8A5A",  // muted green
  state:        "#7D52A8",  // muted purple/violet
};

const CLUSTER_LABELS = {
  civilization: "civilization",
  model:        "model",
  lab:          "lab",
  state:        "state",
};

// Y-axis band labels from bottom to top
const Y_BANDS = [
  { label: "model",        y: -0.85 },
  { label: "lab",         y: -0.30 },
  { label: "state",       y:  0.20 },
  { label: "civilization", y:  0.75 },
];

export function IdeologyUnitGrid({ palette: p }) {
  const [hovered, setHovered] = useState(null);

  const W = 540, H = 420, PAD = 56;

  const toX = (v) => PAD + ((v + 1) / 2) * (W - 2 * PAD);
  const toY = (v) => (H - PAD) - ((v + 1) / 2) * (H - 2 * PAD);

  const hov = READINGS.find(r => r.id === hovered);

  // Bounding box for civilization cluster highlight
  const civReadings = READINGS.filter(r => r.cluster === "civilization");
  const civXs = civReadings.map(r => toX(r.x));
  const civYs = civReadings.map(r => toY(r.y));
  const civMinX = Math.min(...civXs) - 20;
  const civMaxX = Math.max(...civXs) + 20;
  const civMinY = Math.min(...civYs) - 16;
  const civMaxY = Math.max(...civYs) + 16;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem", alignItems: "start" }}>
      {/* scatter */}
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
          {/* civilization cluster highlight region */}
          <rect
            x={civMinX} y={civMinY}
            width={civMaxX - civMinX} height={civMaxY - civMinY}
            fill={CLUSTER_COLORS.civilization}
            fillOpacity="0.08"
            stroke={CLUSTER_COLORS.civilization}
            strokeWidth="1"
            strokeDasharray="4 3"
            strokeOpacity="0.35"
            rx="6"
          />

          {/* grid lines */}
          <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke={p.line} strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
          <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke={p.line} strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />

          {/* X axis labels */}
          <text x={PAD + 2} y={H - PAD + 18} fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>← capabilities-skeptic</text>
          <text x={W - PAD - 2} y={H - PAD + 18} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>accelerationist →</text>

          {/* Y axis band labels */}
          {Y_BANDS.map(band => (
            <text
              key={band.label}
              x={PAD - 6}
              y={toY(band.y) + 3}
              textAnchor="end"
              fontFamily="var(--f-mono)"
              fontSize="8"
              fill={CLUSTER_COLORS[band.label] || p.muted}
              opacity="0.75"
            >{band.label}</text>
          ))}

          {/* Y axis title */}
          <text
            x={12} y={H / 2}
            textAnchor="middle"
            fontFamily="var(--f-mono)"
            fontSize="8"
            fill={p.muted}
            transform={`rotate(-90, 12, ${H / 2})`}
          >unit of analysis</text>

          {/* readings */}
          {READINGS.map(r => {
            const cx = toX(r.x);
            const cy = toY(r.y);
            const isHov = r.id === hovered;
            const col = CLUSTER_COLORS[r.cluster];
            return (
              <g key={r.id}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx} cy={cy}
                  r={isHov ? 9 : 6.5}
                  fill={col}
                  fillOpacity={isHov ? 0.82 : 0.34}
                  stroke={col}
                  strokeWidth={isHov ? 1.5 : 0.9}
                  style={{ transition: "r 200ms var(--ease-out, ease-out), fill-opacity 200ms" }}
                />
                <text
                  x={cx} y={cy - 11}
                  textAnchor="middle"
                  fontFamily="var(--f-ui, sans-serif)"
                  fontSize="8.5"
                  fill={isHov ? col : p.muted}
                  fontWeight={isHov ? "600" : "400"}
                  style={{ transition: "fill 200ms" }}
                >{r.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* detail panel + legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <div style={{
          minHeight: 72,
          fontFamily: "var(--f-ui, sans-serif)",
          fontSize: 11,
          lineHeight: 1.55,
          color: hov ? p.ink : p.muted,
          padding: "0.6rem 0.7rem",
          border: `1px solid ${p.line}`,
          background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
          borderRadius: 3,
          transition: "color 180ms",
        }}>
          {hov ? (
            <>
              <strong style={{ color: CLUSTER_COLORS[hov.cluster], display: "block", marginBottom: 4 }}>
                {hov.label}
              </strong>
              <span style={{ color: p.muted, fontFamily: "var(--f-mono, monospace)", fontSize: 10 }}>
                unit of analysis:
              </span>{" "}
              <span style={{ color: CLUSTER_COLORS[hov.cluster] }}>{hov.unit}</span>
            </>
          ) : (
            "Hover a reading to see its unit of analysis."
          )}
        </div>

        {/* legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(CLUSTER_LABELS).map(([k, label]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--f-ui, sans-serif)", fontSize: 10, color: p.muted }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: CLUSTER_COLORS[k], opacity: 0.75, flexShrink: 0 }} />
              {label}
              {k === "civilization" && (
                <span style={{ marginLeft: 2, color: CLUSTER_COLORS.civilization, opacity: 0.7, fontSize: 9 }}>(highlighted)</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
