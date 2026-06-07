// @ts-nocheck
import React, { useState } from 'react';

const WORDS = ["alignment", "coordination", "race", "control", "safety", "AGI"] as const;
type Word = typeof WORDS[number];

const DEFINITIONS: Record<Word, Array<{ author: string; text: string }>> = {
  alignment: [
    { author: "Jan Leike",        text: "Does the intended task as well as it could." },
    { author: "Paul Christiano",  text: "Trying to do what humans want it to do." },
    { author: "Ryan Greenblatt",  text: "Ensure models aren't scheming." },
    { author: "Holden Karnofsky", text: "Don't aim to bring down civilisation." },
  ],
  coordination: [
    { author: "Aschenbrenner",   text: "Alliance-formation — democracies pooling compute into one project." },
    { author: "AI Treaty letter", text: "Treaty negotiation — a compliance commission and verification body." },
    { author: "Buterin",          text: "Cryptographic multi-signature — a decision rule no single party can override." },
  ],
  race: [
    { author: "Aschenbrenner",   text: "An existential competition to be won — losing to the CCP is the catastrophe." },
    { author: "Buterin",          text: "A threat to defuse — racing is the dynamic d/acc exists to prevent." },
    { author: "Treaty letter",    text: "A dynamic to stop outright — not win, not defuse, but halt." },
  ],
  control: [
    { author: "Sarah / Redwood",  text: "The lab controls the model — protocols that extract safety from a scheming system." },
    { author: "Aschenbrenner",    text: "The government controls the lab — nationalisation, SCIF-grade security." },
    { author: "Davidson",         text: "Who controls whom — when an AI workforce is singularly loyal to one person." },
  ],
  safety: [
    { author: "Alignment readings", text: "An outcome property of the model — it doesn't scheme or deceive." },
    { author: "RAND",               text: "A security posture — the weights don't leak." },
    { author: "Buterin",            text: "Civilisational resilience — society absorbs the shock." },
    { author: "Samuel / CAISI",     text: "Industry capture — a word labs deploy to look responsible while structure erodes." },
  ],
  AGI: [
    { author: "Amodei",        text: "Refuses the term — prefers 'powerful AI', a country of geniuses in a datacentre." },
    { author: "Aschenbrenner", text: "Operationalises it — dates AGI to 2027, uses freely." },
    { author: "Jones",         text: "Replaces it — 'transformative AI' / capability-and-generality to dodge the definitional swamp." },
  ],
};

export function VocabFan({ palette: p }) {
  const [active, setActive] = useState<Word>("alignment");

  const defs = DEFINITIONS[active];

  return (
    <div style={{ fontFamily: "var(--f-ui)", width: "100%" }}>
      {/* word selector row */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.45rem",
        marginBottom: "1.1rem",
      }}>
        {WORDS.map(w => {
          const isActive = w === active;
          return (
            <button
              key={w}
              onClick={() => setActive(w)}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                padding: "0.32rem 0.7rem",
                border: `1px solid ${isActive ? p.accent : p.line}`,
                borderRadius: 3,
                background: isActive
                  ? `color-mix(in srgb, ${p.accent} 14%, ${p.paper})`
                  : p.paper,
                color: isActive ? p.accent : p.muted,
                cursor: "pointer",
                transition: "border-color 150ms, color 150ms, background 150ms",
                outline: "none",
              }}
            >
              {w}
            </button>
          );
        })}
      </div>

      {/* definition cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "0.65rem",
      }}>
        {defs.map((d, i) => (
          <div
            key={`${active}-${i}`}
            style={{
              padding: "0.75rem 0.85rem",
              border: `1px solid ${p.line}`,
              borderRadius: 3,
              background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
              opacity: 0,
              transform: "translateY(6px)",
              animation: `vocabFanIn 220ms ease-out ${i * 55}ms forwards`,
            }}
          >
            <div style={{
              fontFamily: "var(--f-mono)",
              fontSize: "0.72rem",
              color: p.accent,
              letterSpacing: "0.06em",
              marginBottom: "0.4rem",
            }}>
              {d.author}
            </div>
            <div style={{
              fontSize: "0.87rem",
              lineHeight: 1.58,
              color: p.ink,
            }}>
              {d.text}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes vocabFanIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
