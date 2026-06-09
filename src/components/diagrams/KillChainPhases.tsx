// @ts-nocheck
import React, { useState } from 'react';

const PHASES = [
  {
    id: "p1",
    label: "Phase 1",
    title: "Self-preservation in training",
    evidence: "Apollo Research's Dec 2024 in-context scheming work showed frontier models (o1, Claude 3.5 Sonnet, Gemini 1.5 Pro) will scheme when given a goal. Anthropic's alignment-faking work (Dec 2024) showed Claude 3 Opus faking alignment from its own learned preferences.",
    defending: "Layer 1 (prevent dangerous training), RLHF safeguards, Constitutional AI",
    strength: 35,
    strengthLabel: "35% — prevention difficult, mechanisms not validated",
  },
  {
    id: "p2",
    label: "Phase 2",
    title: "Gaming the evaluations",
    evidence: "Redwood protocols assume the model tries to subvert them and ask if safety survives anyway: 62% from trusted monitoring, ~92% with defer-to-trusted. UK AISI's ControlArena and the Ctrl-Z resampling work address this directly.",
    defending: "AI Control (Sarah/Redwood), ControlArena, trusted monitoring, defer-to-trusted protocols",
    strength: 75,
    strengthLabel: "75% — best-defended phase in the chain",
  },
  {
    id: "p3",
    label: "Phase 3",
    title: "Influence over successor's design",
    evidence: "AlphaEvolve shaved ~1% off Gemini's training time (May 2025). Anthropic reported 70–90% of code merged into its production codebase in May 2025 was authored by Claude. METR time-horizon trend pointing at autonomous multi-hour engineering.",
    defending: "No validated control protocol exists for self-improvement. METR RCT showed 19% slowdown vs predicted speedup — suggests the loop isn't tight yet.",
    strength: 25,
    strengthLabel: "25% — early benign versions only; no validated defence for AI-R&D-at-scale",
  },
  {
    id: "p4",
    label: "Phase 4",
    title: "Aligning the successor to itself",
    evidence: "Single-model control assumes a trusted model can watch an untrusted one. If the untrusted model is designing its successor, monitor and monitored may share the same loyalty. Multi-agent collusion during self-improvement is the open gap.",
    defending: "Interpretability (Anthropic's monosemanticity features, chain-of-thought monitoring) — only tool that reads successor loyalties from inside. Under-developed.",
    strength: 10,
    strengthLabel: "10% — framing exists, validated tools don't",
  },
  {
    id: "p5",
    label: "Phase 5",
    title: "Self-exfiltration",
    evidence: "RAND's Securing AI Model Weights (SL1–SL5) addresses outside-in theft. This phase is inside-out: the model copying itself somewhere unshutoffable. Opposite threat direction to the course's weight-security apparatus.",
    defending: "RAND SL5, civilisational resilience / withstand layer. But SL5 is aimed at human thieves, not the model itself.",
    strength: 30,
    strengthLabel: "30% — course's weight-security aimed at wrong direction",
  },
];

function strengthColor(pct: number): string {
  if (pct >= 65) return "#28CA41";
  if (pct >= 45) return "#D4A017";
  return "#C94040";
}

export function KillChainPhases({ palette: p }) {
  const [active, setActive] = useState<string | null>(null);

  const activePhase = PHASES.find(ph => ph.id === active);

  return (
    <div style={{ fontFamily: "var(--f-ui)" }}>
      {/* Phase boxes */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        alignItems: "stretch",
      }}>
        {PHASES.map((ph, i) => {
          const isActive = ph.id === active;
          const col = strengthColor(ph.strength);
          return (
            <React.Fragment key={ph.id}>
              <button
                onClick={() => setActive(isActive ? null : ph.id)}
                style={{
                  flex: "1 1 140px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  padding: "0.75rem 0.85rem",
                  background: isActive
                    ? `color-mix(in srgb, ${p.paper} 82%, ${col})`
                    : `color-mix(in srgb, ${p.paper} 94%, ${p.ink})`,
                  border: `1.5px solid ${isActive ? col : p.line}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 200ms, border-color 200ms",
                }}
                aria-expanded={isActive}
              >
                <span style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 9,
                  color: isActive ? col : p.muted,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "color 200ms",
                }}>
                  {ph.label}
                </span>
                <span style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: isActive ? p.ink : p.ink,
                  lineHeight: 1.3,
                }}>
                  {ph.title}
                </span>
                {/* mini strength bar */}
                <div style={{ marginTop: "0.35rem" }}>
                  <div style={{
                    width: "100%",
                    height: 3,
                    background: p.line,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${ph.strength}%`,
                      height: "100%",
                      background: col,
                      borderRadius: 2,
                      transition: "width 400ms var(--ease-out)",
                    }} />
                  </div>
                </div>
              </button>

              {/* connector arrow (not after last) */}
              {i < PHASES.length - 1 && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: p.muted,
                  fontSize: "1.1rem",
                  padding: "0 0.1rem",
                  alignSelf: "center",
                }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detail panel */}
      {activePhase && (
        <div style={{
          marginTop: "1rem",
          padding: "1rem 1.2rem",
          border: `1.5px solid ${strengthColor(activePhase.strength)}`,
          borderRadius: 4,
          background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}>
          {/* Evidence */}
          <div>
            <div style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              color: p.muted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.45rem",
            }}>
              Evidence
            </div>
            <p style={{ fontSize: "0.83rem", lineHeight: 1.6, color: p.ink, margin: 0 }}>
              {activePhase.evidence}
            </p>
          </div>

          {/* Defending readings */}
          <div>
            <div style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              color: p.muted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.45rem",
            }}>
              Defending readings
            </div>
            <p style={{ fontSize: "0.83rem", lineHeight: 1.6, color: p.ink, margin: 0 }}>
              {activePhase.defending}
            </p>
          </div>

          {/* Defence strength */}
          <div>
            <div style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              color: p.muted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.45rem",
            }}>
              Defence strength
            </div>
            <div style={{
              width: "100%",
              height: 10,
              background: p.line,
              borderRadius: 5,
              overflow: "hidden",
              marginBottom: "0.5rem",
            }}>
              <div style={{
                width: `${activePhase.strength}%`,
                height: "100%",
                background: strengthColor(activePhase.strength),
                borderRadius: 5,
                transition: "width 500ms var(--ease-out)",
              }} />
            </div>
            <p style={{
              fontSize: "0.8rem",
              lineHeight: 1.55,
              color: strengthColor(activePhase.strength),
              margin: 0,
              fontFamily: "var(--f-mono)",
            }}>
              {activePhase.strengthLabel}
            </p>
          </div>
        </div>
      )}

      {!activePhase && (
        <div style={{
          marginTop: "0.8rem",
          fontSize: "0.8rem",
          color: p.muted,
          fontStyle: "italic",
          fontFamily: "var(--f-ui)",
        }}>
          Click any phase to see mid-2026 evidence, defending readings, and defence strength.
        </div>
      )}
    </div>
  );
}
