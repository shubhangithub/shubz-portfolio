// @ts-nocheck
/* eslint-disable */
/**
 * NowV5 — Port of design_handoff/now-page.jsx.
 *
 * Field journal: focuses (5 concurrent threads) → journal (newest first) →
 * conditions (mood/music/reading/drink cards). Right rail: cat .now
 * mini-terminal full habitat + telemetry JSON + thread counts.
 *
 * Data: FOCUSES, JOURNAL, CONDITIONS all from src/data/now.ts. No new
 * content invented here — pure styling layer.
 */
import React from "react";
import {
  FOCUSES, JOURNAL, CONDITIONS,
  NOW_HERO_LINES, NOW_LEDE_PREFIX, NOW_LEDE_LINK_TEXT, NOW_LEDE_LINK_URL, NOW_LEDE_SUFFIX,
  NOW_MARGINALIA, NOW_LAST_UPDATED_LABEL, NOW_LAST_UPDATED_DATE,
  NOW_TELEMETRY, NOW_CADENCE_LABEL,
  type Span,
} from "../../data/now";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBMarginalia, NBMiniTerm,
} from "../chrome/NB";

type NavFn = (page: string, slug?: string | null) => void;

// "2026-05" → "may 26"
const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
function shortDate(d: string): string {
  const [yr, mo] = (d || "").split("-");
  if (!mo || !yr) return d || "—";
  return `${MONTHS[Number(mo) - 1]} ${yr.slice(-2)}`;
}

// Inline span renderer (mirrors the helper in HomeV5).
function renderSpans(spans: Span[], t: any) {
  return spans.map((s, i) => {
    if (typeof s === "string") return s;
    return <em key={i} style={{ fontStyle: "italic", color: s.c ? t[s.c] : undefined }}>{s.em}</em>;
  });
}

export function NowV5({
  dark,
  toggleTheme,
  onNavigate,
}: {
  dark: boolean;
  toggleTheme: () => void;
  onNavigate: NavFn;
}) {
  const mode: "light" | "dark" = dark ? "dark" : "light";
  const t = nbTheme(mode);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.background = t.paper;
    }
  }, [t.paper]);

  // V5 canonical: each FOCUS / CONDITION carries its own `family` (an
  // NBAccentKey) in src/data/now.ts. We resolve `family` → palette colour
  // here, so the data file is the single source of truth for which topic
  // each entry belongs to. Re-tag entries in now.ts to recolour them.

  // Build mini-term lines from JOURNAL. Each entry's date colour comes
  // from its `family` field in src/data/now.ts (the canonical topic).
  const miniLines = JOURNAL.map((j) => ({
    d: shortDate(j.date),
    c: t[j.family] || t.ink,
    txt: j.note,
  }));

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t} mode={mode} current="now"
      label="shubz — ~/now — vim"
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label={NOW_LAST_UPDATED_LABEL} date={NOW_LAST_UPDATED_DATE} accent={t.orange} />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            {/* Title prompt — accent on '%' = current-state Outreach orange. */}
            <NBPrompt t={t} cwd="~/now" cmd="watch -n 0 cat .now" comment="live" accent={t.orange} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "18ch",
            }}>
              {NOW_HERO_LINES.map((line, i) => (
                <React.Fragment key={i}>
                  {renderSpans(line, t)}
                  {i < NOW_HERO_LINES.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              {NOW_LEDE_PREFIX}<a href={NOW_LEDE_LINK_URL} target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66`, textDecoration: "none" }}>{NOW_LEDE_LINK_TEXT}</a>{NOW_LEDE_SUFFIX}
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={130} tilt={2.5} accent={t[NOW_MARGINALIA.accent]}>
                {NOW_MARGINALIA.lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < NOW_MARGINALIA.lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </NBMarginalia>
            )}
          </div>

          {/* §02 Right now */}
          {/* §02 Right now — section accent = orange (Outreach, current state). */}
          <NBPromptHead t={t} n="§02" command="jobs" comment={`${FOCUSES.length} concurrent threads`} title="Right now" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56, borderTop: `1px solid ${t.muted}55` }}>
            {FOCUSES.map((f, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "120px 1fr 70px",
                gap: isMobile ? 4 : 18, alignItems: "baseline",
                padding: "16px 0",
                borderBottom: `1px dashed ${t.muted}33`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t[f.family] || t.ink, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  ● {f.kind}
                </span>
                <span style={{ fontFamily: "var(--f-body)", fontSize: 16, color: t.ink, lineHeight: 1.55 }}>{f.what}</span>
                {!isMobile && (
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, textAlign: "right" }}>
                    {String(i + 1).padStart(2, "0")}/{String(FOCUSES.length).padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* §03 Field journal removed — the right-rail cat .now mini-term
              streams the same JOURNAL entries (from src/data/now.ts), so
              having it twice on /now was redundant. Mini-term still here. */}

          {/* §03 Conditions — section accent = orange (Outreach, personal/
              community state). Each condition card pulls its colour from
              its `family` field in src/data/now.ts. (Renumbered from §04
              after Field journal section was removed.) */}
          <NBPromptHead t={t} n="§03" command="uptime; weather; mood" title="Conditions" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: 12, marginBottom: 60,
          }}>
            {CONDITIONS.map((c, i) => {
              const cc = t[c.family] || t.ink;
              return (
              <div key={i} style={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${t.rule}`, background: t.paper2 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 10px", borderBottom: `1px dashed ${t.muted}33`,
                  fontFamily: "var(--f-mono)", fontSize: 10, color: cc, letterSpacing: "0.1em",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: cc }} />
                  {c.k.toUpperCase()}
                </div>
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 22, color: t.ink, lineHeight: 1.2 }}>{c.v}</div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, marginTop: 6 }}>{c.sub}</div>
                </div>
              </div>
              );
            })}
          </div>
        </main>

        {/* Right rail */}
        <aside>
          {/* Right-rail mini-term — both prompts use orange (current state). */}
          <NBPrompt t={t} cwd="~/now" cmd="cat .now" comment="autoplay" accent={t.orange} />
          <NBMiniTerm t={t} accent={t.orange} lines={miniLines} cwd="~/now" />

          <div style={{ marginTop: 28 }}>
            {/* Telemetry JSON = geospatial location data → teal. */}
            <NBPrompt t={t} cwd="~/now" cmd="telemetry --json" comment="london" accent={t.teal} />
            {/* Telemetry pre-block — data from NOW_TELEMETRY in now.ts.
                Keys + values get JSON syntax-highlighting colours (per
                DECISIONS-v5.md §14 exception for JSON syntax). */}
            <pre style={{
              background: t.paper2, border: `1px solid ${t.rule}`,
              padding: "12px 14px", borderRadius: 3,
              fontFamily: "var(--f-mono)", fontSize: 11, lineHeight: 1.8,
              color: t.softInk, margin: 0, whiteSpace: "pre-wrap",
            }}>{"{\n"}{Object.entries(NOW_TELEMETRY).map(([k, v], i, arr) => {
              const pad = " ".repeat(Math.max(0, 8 - k.length));
              return (
                <React.Fragment key={k}>
                  {"  "}<span style={{ color: t.blue }}>"{k}"</span>:{pad}<span style={{ color: t.ochre }}>"{v}"</span>{i < arr.length - 1 ? "," : ""}{"\n"}
                </React.Fragment>
              );
            })}{"}"}</pre>
          </div>

          <div style={{ marginTop: 28 }}>
            {/* .threads is meta-summary (counts) → Infra & craft (yellow). */}
            <NBPrompt t={t} cwd="~/now" cmd="cat .threads" comment="counts" accent={t.yellow} />
            <div style={{
              background: t.paper2, border: `1px solid ${t.rule}`,
              padding: "14px 16px", borderRadius: 3,
              fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
              color: t.softInk,
            }}>
              <div><span style={{ color: t.muted }}>focuses</span> <span style={{ color: t.ink }}>{FOCUSES.length}</span></div>
              <div><span style={{ color: t.muted }}>journal</span> <span style={{ color: t.ink }}>{JOURNAL.length} entries</span></div>
              <div><span style={{ color: t.muted }}>cadence</span> <span style={{ color: t.ink }}>{NOW_CADENCE_LABEL}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
