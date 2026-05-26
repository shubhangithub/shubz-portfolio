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
import { FOCUSES, JOURNAL, CONDITIONS } from "../../data/now";
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

  const focusColours = [t.prompt, t.ochre, t.blue, t.magenta, t.teal];
  const condColours = [t.cyan, t.ochre, t.prompt, t.magenta];

  // Build mini-term lines from JOURNAL with cycling accent.
  const journalAccents = ["prompt", "teal", "ochre", "magenta", "purple", "red"];
  const miniLines = JOURNAL.map((j: any, i: number) => ({
    d: shortDate(j.date),
    c: t[journalAccents[i % journalAccents.length]] || t.ink,
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
      <NBLastUpdated t={t} label="NOW · WEEKLY-ISH SNAPSHOT" date="26 may 2026" />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            <NBPrompt t={t} cwd="~/now" cmd="watch -n 0 cat .now" comment="live" accent={t.prompt} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "18ch",
            }}>
              What I'm <em style={{ color: t.prompt, fontStyle: "italic" }}>actually</em>{" "}
              <em style={{ color: t.ochre, fontStyle: "italic" }}>doing</em> this week.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              The <a href="https://nownownow.com/about" target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66`, textDecoration: "none" }}>/now</a> convention — what's on my plate, what I'm reading, where my attention is going. A snapshot, not a profile. Updated whenever I notice it has drifted.
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={130} tilt={2.5}>
                the rule: only<br/>five things at<br/>once. anything<br/>more is fiction.
              </NBMarginalia>
            )}
          </div>

          {/* §02 Right now */}
          <NBPromptHead t={t} n="§02" command="jobs" comment={`${FOCUSES.length} concurrent threads`} title="Right now" accent={t.ochre} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56, borderTop: `1px solid ${t.muted}55` }}>
            {FOCUSES.map((f, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "120px 1fr 70px",
                gap: isMobile ? 4 : 18, alignItems: "baseline",
                padding: "16px 0",
                borderBottom: `1px dashed ${t.muted}33`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: focusColours[i % focusColours.length], textTransform: "uppercase", letterSpacing: "0.08em" }}>
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

          {/* §03 Field journal */}
          <NBPromptHead t={t} n="§03" command="tail -n 60 ./journal.log" comment="newest first" title="Field journal" accent={t.magenta} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56, borderTop: `1px solid ${t.muted}55` }}>
            {JOURNAL.map((j, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "90px 1fr",
                gap: isMobile ? 4 : 18, alignItems: "baseline",
                padding: "12px 0",
                borderBottom: `1px dashed ${t.muted}33`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: t[journalAccents[i % journalAccents.length]] || t.ink }}>{shortDate(j.date)}</span>
                <span style={{ fontFamily: "var(--f-body)", fontSize: 15, color: t.softInk, lineHeight: 1.55, fontStyle: "italic" }}>{j.note}</span>
              </div>
            ))}
          </div>

          {/* §04 Conditions */}
          <NBPromptHead t={t} n="§04" command="uptime; weather; mood" title="Conditions" accent={t.cyan} level={isMobile ? 22 : 28} />
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: 12, marginBottom: 60,
          }}>
            {CONDITIONS.map((c, i) => (
              <div key={i} style={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${t.rule}`, background: t.paper2 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 10px", borderBottom: `1px dashed ${t.muted}33`,
                  fontFamily: "var(--f-mono)", fontSize: 10, color: condColours[i % condColours.length], letterSpacing: "0.1em",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: condColours[i % condColours.length] }} />
                  {c.k.toUpperCase()}
                </div>
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 22, color: t.ink, lineHeight: 1.2 }}>{c.v}</div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, marginTop: 6 }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right rail */}
        <aside>
          <NBPrompt t={t} cwd="~/now" cmd="cat .now" comment="autoplay" accent={t.prompt} />
          <NBMiniTerm t={t} accent={t.blue} lines={miniLines} cwd="~/now" />

          <div style={{ marginTop: 28 }}>
            <NBPrompt t={t} cwd="~/now" cmd="telemetry --json" comment="london" accent={t.cyan} />
            <pre style={{
              background: t.paper2, border: `1px solid ${t.rule}`,
              padding: "12px 14px", borderRadius: 3,
              fontFamily: "var(--f-mono)", fontSize: 11, lineHeight: 1.8,
              color: t.softInk, margin: 0, whiteSpace: "pre-wrap",
            }}>{`{
  `}<span style={{ color: t.blue }}>"city"</span>{`:    `}<span style={{ color: t.ochre }}>"London"</span>{`,
  `}<span style={{ color: t.blue }}>"lat"</span>{`:     `}<span style={{ color: t.ochre }}>"51.51°N"</span>{`,
  `}<span style={{ color: t.blue }}>"lon"</span>{`:     `}<span style={{ color: t.ochre }}>"-0.13°W"</span>{`,
  `}<span style={{ color: t.blue }}>"tz"</span>{`:      `}<span style={{ color: t.ochre }}>"Europe/London"</span>{`,
  `}<span style={{ color: t.blue }}>"updated"</span>{`: `}<span style={{ color: t.ochre }}>"26/05/2026"</span>{`
}`}</pre>
          </div>

          <div style={{ marginTop: 28 }}>
            <NBPrompt t={t} cwd="~/now" cmd="cat .threads" comment="counts" accent={t.purple} />
            <div style={{
              background: t.paper2, border: `1px solid ${t.rule}`,
              padding: "14px 16px", borderRadius: 3,
              fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
              color: t.softInk,
            }}>
              <div><span style={{ color: t.muted }}>focuses</span> <span style={{ color: t.ink }}>{FOCUSES.length}</span></div>
              <div><span style={{ color: t.muted }}>journal</span> <span style={{ color: t.ink }}>{JOURNAL.length} entries</span></div>
              <div><span style={{ color: t.muted }}>cadence</span> <span style={{ color: t.ink }}>weekly-ish</span></div>
            </div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
