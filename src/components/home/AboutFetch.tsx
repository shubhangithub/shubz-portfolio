// @ts-nocheck
/**
 * AboutFetch — the bio as a neofetch-style panel (V6, home Act I).
 *
 * The prose BIO wall becomes twelve key–value rows, one claim each,
 * pen-coloured, typing themselves in on load. Hovering (or tapping) a row
 * expands the original BIO sentence beneath it — the prose survives as the
 * detail layer — and "read as prose" swaps the whole panel for the
 * original paragraph. Copy lives in src/data/home.ts (ABOUTFETCH_ROWS).
 */
import React from "react";
import { withAlpha } from "../../data/palette";
import { SITE_SHELL_USER } from "../../data/site";
import { ABOUTFETCH_ROWS, ABOUTFETCH_CMD, ABOUTFETCH_PROSE_TOGGLE, BIO, type Span } from "../../data/home";

function spans(list: Span[], t: any) {
  return list.map((s, i) => {
    if (typeof s === "string") return s;
    if ("em" in s) return <em key={i} style={{ color: s.c ? t[s.c] : undefined }}>{s.em}</em>;
    if ("link" in s) {
      return (
        <a key={i} href={s.href} target={s.href.startsWith("/") ? undefined : "_blank"} rel="noreferrer"
          style={{ color: s.c ? t[s.c] : t.blue, textDecoration: "none", borderBottom: `1px solid ${withAlpha(s.c ? t[s.c] : t.blue, "55")}` }}
        >{s.link}</a>
      );
    }
    return <span key={i} style={{ color: s.c ? t[s.c] : undefined }}>{s.tag}</span>;
  });
}

export function AboutFetch({ t, isMobile }: { t: any; isMobile: boolean }) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const [prose, setProse] = React.useState(false);
  const shown = pinned ?? open;

  return (
    <div data-reveal="rise" style={{
      border: `2px solid ${t.ink}`,
      background: t.bgCard ?? t.paper2,
      padding: isMobile ? "14px 16px 16px" : "16px 22px 18px",
      marginBottom: 44,
      position: "relative",
    }}>
      <style>{`
        @keyframes af-type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        .af-row { animation: af-type 300ms var(--v6-ease) both; }
        .af-row:hover .af-key { color: ${t.ink}; }
        @media (prefers-reduced-motion: reduce) { .af-row { animation: none; } }
      `}</style>

      {/* prompt line */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontFamily: "var(--f-mono)", fontSize: 13, marginBottom: 14, flexWrap: "wrap" }}>
        <span style={{ color: t.prompt }}>{SITE_SHELL_USER}</span>
        <span style={{ color: t.muted }}>~/home</span>
        <span style={{ color: t.yellow }}>%</span>
        <span style={{ color: t.ink }}>{ABOUTFETCH_CMD}</span>
        <span style={{ flex: 1 }} />
        <button
          onClick={() => setProse(!prose)}
          style={{ all: "unset", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10.5, color: t.muted, borderBottom: `1px dashed ${t.muted}` }}
        >{prose ? ABOUTFETCH_PROSE_TOGGLE[1] : ABOUTFETCH_PROSE_TOGGLE[0]}</button>
      </div>

      {prose ? (
        <p style={{ fontSize: isMobile ? 15.5 : 16.5, lineHeight: 1.65, color: t.softInk, margin: 0, maxWidth: "72ch", fontFamily: "var(--f-body)" }}>
          {spans(BIO, t)}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "132px 1fr", gap: isMobile ? 12 : 22, alignItems: "end" }}>
          {!isMobile && (
            <div style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.28))", paddingBottom: 2 }}>
              <img src="/art/sprites/day-stand.png" alt="Illustrated Shubz waving, holding her orange notebook"
                className="v6-sprite" style={{ width: "100%", maxWidth: 126, display: "block", margin: "0 auto" }} />
            </div>
          )}
          <div>
            {ABOUTFETCH_ROWS.map((row, i) => {
              const isOpen = shown === row.key;
              return (
                <div key={row.key} className="af-row" style={{ animationDelay: `${180 + i * 95}ms` }}
                  onMouseEnter={() => setOpen(row.key)}
                  onMouseLeave={() => setOpen(null)}
                  onClick={() => setPinned(pinned === row.key ? null : row.key)}
                >
                  <div style={{
                    display: "grid", gridTemplateColumns: isMobile ? "92px 1fr" : "104px 1fr", gap: 12,
                    padding: "3.5px 0", cursor: "default", alignItems: "baseline",
                  }}>
                    <span className="af-key" style={{
                      fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.05em",
                      color: t.muted, whiteSpace: "nowrap", transition: "color 160ms var(--v6-ease)",
                    }}>{row.key}</span>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: isMobile ? 12 : 12.5, lineHeight: 1.55, color: t.softInk }}>
                      {spans(row.value, t)}
                    </span>
                  </div>
                  <div style={{
                    overflow: "hidden",
                    maxHeight: isOpen ? 120 : 0, opacity: isOpen ? 1 : 0,
                    transition: "max-height 260ms var(--v6-ease), opacity 200ms var(--v6-ease)",
                  }}>
                    <p style={{
                      margin: "2px 0 8px", marginLeft: isMobile ? 0 : 116,
                      fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 13.5,
                      lineHeight: 1.55, color: t.softInk, maxWidth: "58ch",
                      borderLeft: `2px solid ${t.yellow}`, paddingLeft: 10,
                    }}>{row.prose}</p>
                  </div>
                </div>
              );
            })}
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, marginTop: 10 }}>
              # hover a line for the full sentence
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
