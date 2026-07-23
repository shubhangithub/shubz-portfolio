// @ts-nocheck
/* eslint-disable */
/**
 * NowV5 — notebook-style current-focus page.
 *
 * §02 Right now → cat .threads → §03 Field journal (diary flip) → §04 Conditions
 * Right rail: cat .now mini-terminal + thread counts.
 *
 * Data: FOCUSES, JOURNAL, CONDITIONS all from src/data/now.ts.
 */
import React from "react";
import {
  FOCUSES, JOURNAL, JOURNAL_ARCHIVE, CONDITIONS,
  NOW_HERO_LINES, NOW_LEDE_PREFIX, NOW_LEDE_LINK_TEXT, NOW_LEDE_LINK_URL, NOW_LEDE_SUFFIX,
  NOW_MARGINALIA, NOW_LAST_UPDATED_LABEL, NOW_LAST_UPDATED_DATE,
  NOW_CADENCE_LABEL,
  type Span,
} from "../../data/now";
import { nbTheme, withAlpha } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBMarginalia, NBMiniTerm,
} from "../chrome/NB";

type NavFn = (page: string, slug?: string | null) => void;

const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
function shortDate(d: string): string {
  const [yr, mo] = (d || "").split("-");
  if (!mo || !yr) return d || "—";
  return `${MONTHS[Number(mo) - 1]} ${yr.slice(-2)}`;
}

function linkedFocusCopy(f, t) {
  if (!f.linkText || !f.linkUrl) return f.what;
  const linkAt = f.what.indexOf(f.linkText);
  if (linkAt < 0) return f.what;

  return (
    <>
      {f.what.slice(0, linkAt)}
      <a
        href={f.linkUrl}
        target="_blank"
        rel="noreferrer"
        title="View Shubz Sharma on Fable"
        style={{
          color: t[f.family] || t.ink,
          borderBottom: `1px solid ${withAlpha(t[f.family] || t.ink, "66")}`,
          textDecoration: "none",
        }}
      >
        {f.linkText}
      </a>
      {f.what.slice(linkAt + f.linkText.length)}
    </>
  );
}

function renderSpans(spans: Span[], t: any) {
  return spans.map((s, i) => {
    if (typeof s === "string") return s;
    return <em key={i} style={{ fontStyle: "italic", color: s.c ? t[s.c] : undefined }}>{s.em}</em>;
  });
}

// Diary flip component — inline since it's /now-specific.
function DiaryJournal({ entries, t, isMobile }: { entries: any[], t: any, isMobile: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [displayIdx, setDisplayIdx] = React.useState(0);
  const [dir, setDir] = React.useState<"fwd" | "back">("fwd");
  const [phase, setPhase] = React.useState<"idle" | "exiting" | "entering">("idle");

  const current = entries[displayIdx];

  function go(next: number, d: "fwd" | "back") {
    if (phase !== "idle") return;
    setDir(d);
    setPhase("exiting");
    setTimeout(() => {
      setDisplayIdx(next);
      setIdx(next);
      setPhase("entering");
      setTimeout(() => setPhase("idle"), 260);
    }, 180);
  }

  let pageAnim = "none";
  if (phase === "exiting") pageAnim = dir === "fwd" ? "nbFlipOut 180ms cubic-bezier(0.4,0,1,1) both" : "nbFlipOutBack 180ms cubic-bezier(0.4,0,1,1) both";
  if (phase === "entering") pageAnim = dir === "fwd" ? "nbFlipIn 260ms cubic-bezier(0,0,0.2,1) both" : "nbFlipInBack 260ms cubic-bezier(0,0,0.2,1) both";

  if (!open) {
    return (
      <div
        onClick={() => setOpen(true)}
        style={{
          border: `1px solid ${t.rule}`,
          borderRadius: 3,
          cursor: "pointer",
          background: t.paper2,
          overflow: "hidden",
          transition: "border-color 200ms",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = withAlpha(t.orange, "99"); }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.rule; }}
      >
        {/* Cover header */}
        <div style={{
          background: `color-mix(in oklch, ${t.ink} 8%, transparent)`,
          borderBottom: `1px solid ${t.rule}`,
          padding: "7px 14px",
          display: "flex", alignItems: "center", gap: 7,
        }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5F57", display: "inline-block", flexShrink: 0 }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FFBD2E", display: "inline-block", flexShrink: 0 }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28CA41", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, marginLeft: 4 }}>~/now/journal.md</span>
        </div>
        {/* Cover body */}
        <div style={{ padding: "20px 22px 22px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 50', fontSize: 26, color: t.ink, lineHeight: 1 }}>
              field journal
            </div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, marginTop: 8, letterSpacing: "0.05em" }}>
              {entries.length} entries · 2024 — now
            </div>
          </div>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.orange, flexShrink: 0 }}>
            open →
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes nbFlipOut     { from { transform: perspective(1100px) rotateY(0deg)   translateZ(0);   opacity: 1; } to { transform: perspective(1100px) rotateY(-72deg) translateZ(8px); opacity: 0; } }
        @keyframes nbFlipIn      { from { transform: perspective(1100px) rotateY(72deg)  translateZ(8px); opacity: 0; } to { transform: perspective(1100px) rotateY(0deg)   translateZ(0);   opacity: 1; } }
        @keyframes nbFlipOutBack { from { transform: perspective(1100px) rotateY(0deg)   translateZ(0);   opacity: 1; } to { transform: perspective(1100px) rotateY(72deg)  translateZ(8px); opacity: 0; } }
        @keyframes nbFlipInBack  { from { transform: perspective(1100px) rotateY(-72deg) translateZ(8px); opacity: 0; } to { transform: perspective(1100px) rotateY(0deg)   translateZ(0);   opacity: 1; } }
      `}</style>
      <div style={{
        border: `1px solid ${t.rule}`,
        borderRadius: 3,
        overflow: "hidden",
        background: t.paper2,
      }}>
        {/* Header */}
        <div style={{
          background: `color-mix(in oklch, ${t.ink} 8%, transparent)`,
          borderBottom: `1px solid ${t.rule}`,
          padding: "7px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5F57", display: "inline-block", flexShrink: 0 }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FFBD2E", display: "inline-block", flexShrink: 0 }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28CA41", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, marginLeft: 4 }}>~/now/journal.md</span>
          </div>
          <button
            onClick={() => { setOpen(false); setIdx(0); setDisplayIdx(0); setPhase("idle"); }}
            style={{ all: "unset", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted }}
          >
            × close
          </button>
        </div>

        {/* Page — animation applied here, content swaps mid-flip */}
        <div style={{
          animation: pageAnim,
          transformOrigin: "center center",
          willChange: "transform, opacity",
          padding: isMobile ? "22px 18px 26px" : "28px 26px 30px",
          minHeight: 170,
          position: "relative",
          backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${withAlpha(t.muted, "1a")} 28px)`,
          backgroundSize: "100% 28px",
          backgroundPosition: "0 32px",
        }}>
          {/* Date */}
          <div style={{
            fontFamily: "var(--f-mono)", fontSize: 11,
            color: t[current.family] || t.ink,
            letterSpacing: "0.08em",
            marginBottom: 18,
            display: "flex", alignItems: "center", gap: 7,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t[current.family] || t.ink, display: "inline-block", flexShrink: 0 }} />
            {shortDate(current.date)}
          </div>
          {/* Entry text — italic like handwriting */}
          <p style={{
            fontFamily: "var(--f-body)",
            fontStyle: "italic",
            fontSize: isMobile ? 15 : 16,
            color: t.ink,
            lineHeight: 1.75,
            margin: 0,
            maxWidth: "50ch",
          }}>
            {current.note}
          </p>
          {/* Folded page corner */}
          <div style={{
            position: "absolute", bottom: 0, right: 0,
            width: 0, height: 0,
            borderStyle: "solid",
            borderWidth: "0 0 22px 22px",
            borderColor: `transparent transparent ${t.paper} transparent`,
            filter: `drop-shadow(-2px -2px 3px ${withAlpha(t.ink, "22")})`,
          }} />
        </div>

        {/* Navigation */}
        <div style={{
          borderTop: `1px solid ${t.rule}`,
          padding: "10px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: `color-mix(in oklch, ${t.ink} 4%, transparent)`,
        }}>
          <button
            onClick={() => idx > 0 && go(idx - 1, "back")}
            style={{
              all: "unset",
              cursor: idx === 0 || phase !== "idle" ? "default" : "pointer",
              fontFamily: "var(--f-mono)", fontSize: 11,
              color: idx === 0 ? `${withAlpha(t.muted, "44")}` : t.muted,
              transition: "color 150ms",
            }}
          >
            ← newer
          </button>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted }}>
            {idx + 1} / {entries.length}
          </span>
          <button
            onClick={() => idx < entries.length - 1 && go(idx + 1, "fwd")}
            style={{
              all: "unset",
              cursor: idx === entries.length - 1 || phase !== "idle" ? "default" : "pointer",
              fontFamily: "var(--f-mono)", fontSize: 11,
              color: idx === entries.length - 1 ? `${withAlpha(t.muted, "44")}` : t.muted,
              transition: "color 150ms",
            }}
          >
            older →
          </button>
        </div>
      </div>
    </>
  );
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
      <NBLastUpdated t={t} label={NOW_LAST_UPDATED_LABEL} date={NOW_LAST_UPDATED_DATE} accent={t.orange} cwd="~/now" cmd="watch -n 0 cat .now" comment="live" />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
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
              {NOW_LEDE_PREFIX}<a href={NOW_LEDE_LINK_URL} target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${withAlpha(t.blue, "66")}`, textDecoration: "none" }}>{NOW_LEDE_LINK_TEXT}</a>{NOW_LEDE_SUFFIX}
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
          <NBPromptHead t={t} n="§02" command="jobs" comment={`${FOCUSES.length} concurrent threads`} title="Right now" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 44, borderTop: `1px solid ${withAlpha(t.muted, "55")}` }}>
            {FOCUSES.map((f, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "120px 1fr 70px",
                gap: isMobile ? 4 : 18, alignItems: "baseline",
                padding: "16px 0",
                borderBottom: `1px dashed ${withAlpha(t.muted, "33")}`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t[f.family] || t.ink, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  ● {f.kind}
                </span>
                <span style={{ fontFamily: "var(--f-body)", fontSize: 16, color: t.ink, lineHeight: 1.55 }}>{linkedFocusCopy(f, t)}</span>
                {!isMobile && (
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, textAlign: "right" }}>
                    {String(i + 1).padStart(2, "0")}/{String(FOCUSES.length).padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* cat .threads — thread counts before the diary */}
          <NBPrompt t={t} cwd="~/now" cmd="cat .threads" comment="counts" accent={t.yellow} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "12px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
            color: t.softInk,
          }}>
            <div><span style={{ color: t.muted }}>focuses</span> <span style={{ color: t.ink }}>{FOCUSES.length}</span></div>
            <div><span style={{ color: t.muted }}>journal</span> <span style={{ color: t.ink }}>{JOURNAL.length} entries</span></div>
            <div><span style={{ color: t.muted }}>cadence</span> <span style={{ color: t.ink }}>{NOW_CADENCE_LABEL}</span></div>
          </div>

          {/* §03 Field journal — diary flip */}
          <NBPromptHead t={t} n="§03" command="cat journal.md" comment="newest first" title="Field journal" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 44 }}>
            <DiaryJournal entries={[...JOURNAL, ...JOURNAL_ARCHIVE]} t={t} isMobile={isMobile} />
          </div>

          {/* §04 Conditions */}
          <NBPromptHead t={t} n="§04" command="uptime; weather; mood" title="Conditions" accent={t.orange} level={isMobile ? 22 : 28} />
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
                    padding: "6px 10px", borderBottom: `1px dashed ${withAlpha(t.muted, "33")}`,
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
          <NBPrompt t={t} cwd="~/now" cmd="cat .now" comment="autoplay" accent={t.orange} />
          <NBMiniTerm t={t} accent={t.orange} lines={miniLines} cwd="~/now" />

          <div style={{ marginTop: 28 }}>
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
