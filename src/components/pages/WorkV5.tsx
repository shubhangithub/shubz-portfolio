// @ts-nocheck
/* eslint-disable */
/**
 * WorkV5 — redesigned /work page.
 * Lens bar + tabs (trajectory / builds / toolbox) + concurrency Gantt.
 * Content lives in src/data/work.ts; this file is a pure renderer.
 */
import React from "react";
import { POSTS } from "../../data/posts";
import { nbTheme, withAlpha } from "../../data/palette";
import { SITE_SHELL_USER } from "../../data/site";
import { useIsMobile } from "../../lib/hooks";
import { NBPageShell, NBLastUpdated, NBPrompt } from "../chrome/NB";
import {
  CV_PDF,
  WORK_HERO, WORK_LEDE_PARTS, WORK_MARGINALIA,
  WORK_LAST_UPDATED_LABEL, WORK_LAST_UPDATED_DATE,
  WORK_CV_STAT, WORK_BASED,
  WORK_EVENTS_V5, WORK_GANTT_LANES,
  WORK_FEATURED_V5, WORK_BUILDS_LIST_V5,
  WORK_CORE_CARDS, WORK_FULL_GROUPS,
} from "../../data/work";
import type { Span } from "../../data/home";

type NavFn = (page: string, slug?: string | null) => void;

const WK_CSS = `
@keyframes nb-work-scene-in {
  0%   { opacity: 0; transform: translateY(16px) scale(.992); }
  60%  { opacity: 1; }
  100% { opacity: 1; transform: none; }
}
@keyframes nb-work-curtain {
  0%   { transform: scaleX(1); }
  100% { transform: scaleX(0); }
}
`;

function renderSpans(spans: Span[], t: any) {
  return spans.map((s, i) => {
    if (typeof s === "string") return s;
    if ("em" in s) return <em key={i} style={{ fontStyle: "italic", color: s.c ? t[s.c] : undefined }}>{s.em}</em>;
    return <span key={i} style={{ color: s.c ? t[s.c] : undefined }}>{s.tag}</span>;
  });
}

const normL = (arr: string[]) => arr.map(x => x === "research" ? "ml" : x === "data" ? "eng" : x);

const TRACK_NAME: Record<string, string> = { engineering: "engineering", research: "research", study: "study", outreach: "outreach" };
const LENS_NAME: Record<string, string> = { ml: "AI/ML", eng: "engineering", community: "community" };

function makeChips(track: string, lenses: string[]) {
  const seen = new Set([track]);
  const chips: { label: string; kind: "track" | "lens" }[] = [{ label: TRACK_NAME[track] || track, kind: "track" }];
  normL(lenses).forEach(l => {
    const canon = l === "eng" ? "engineering" : l === "ml" ? "ai/ml" : l;
    const lab = LENS_NAME[l];
    if (lab && !seen.has(canon)) { seen.add(canon); chips.push({ label: lab, kind: "lens" }); }
  });
  return chips;
}

export function WorkV5({ dark, toggleTheme, onNavigate }: {
  dark: boolean;
  toggleTheme: () => void;
  onNavigate: NavFn;
}) {
  const mode = dark ? "dark" : "light";
  const t = nbTheme(mode);
  const isMobile = useIsMobile();

  const [lens, setLens] = React.useState("all");
  const [tab, setTab] = React.useState("trajectory");
  const [hover, setHover] = React.useState<{ key: string; label: string } | null>(null);
  const [selBar, setSelBar] = React.useState<{ key: string; label: string; match: string[] } | null>(null);
  const [selLane, setSelLane] = React.useState<string | null>(null);
  const [listOpen, setListOpen] = React.useState(false);
  const [buildsOpen, setBuildsOpen] = React.useState(false);
  const [fullOpen, setFullOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof document !== "undefined") document.body.style.background = t.paper;
  }, [t.paper]);

  const isDimmed = (lenses: string[]) => lens !== "all" && !normL(lenses).includes(lens);

  const essayBySlug = React.useMemo(() => {
    const map: Record<string, { title: string; c: string }> = {};
    for (const p of POSTS) { map[p.slug] = { title: p.title, c: t[p.nbAccent || "blue"] }; }
    return map;
  }, [t]);

  // Gantt selection → which events to list
  const laneLabel: Record<string, string> = { engineering: "eng", research: "research", study: "study", outreach: "outreach" };
  let shown = WORK_EVENTS_V5;
  let listVisible = false;
  let selActive = false;
  let selCaption = "";
  if (selBar) {
    shown = WORK_EVENTS_V5.filter(e => (selBar.match || []).some(m => e.what.includes(m)));
    listVisible = true; selActive = true; selCaption = selBar.label;
  } else if (selLane) {
    shown = WORK_EVENTS_V5.filter(e => e.track === selLane);
    listVisible = true; selActive = true; selCaption = (laneLabel[selLane] || selLane) + " — " + shown.length + " entries";
  } else if (listOpen) {
    shown = WORK_EVENTS_V5; listVisible = true;
  }

  const ganttCaption = hover
    ? "▸ " + hover.label
    : selBar ? "▸ " + selBar.label + " — listed below"
    : selLane ? "▸ " + (laneLabel[selLane] || selLane) + " isolated — listed below"
    : "hover a bar for detail · click a bar or lane to list it below";

  const lensBtn = (active: boolean) => ({
    cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 11, padding: "4px 11px", borderRadius: 3,
    border: active ? `1px solid ${t.ink}` : `1px dashed ${t.muted}`,
    color: active ? t.ink : t.softInk,
    background: active ? `${withAlpha(t.yellow, "24")}` : "transparent",
  });

  const tabBtn = (active: boolean) => ({
    cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 12, padding: "10px 16px", border: "none",
    borderBottom: active ? `2px solid ${t.yellow}` : "2px solid transparent",
    background: "transparent", color: active ? t.ink : t.muted, marginBottom: -1,
  });

  const discBtn = {
    cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 11, padding: "7px 13px",
    borderRadius: 3, border: `1px dashed ${t.muted}`, color: t.softInk, background: "transparent",
  };

  const sceneStyle = {
    animation: "nb-work-scene-in .5s cubic-bezier(.22,.61,.36,1) both",
    position: "relative" as const,
    minHeight: 440,
  };

  const curtainStyle = (color: string) => ({
    position: "absolute" as const, left: 0, right: 0, top: 0, height: 2,
    background: `linear-gradient(90deg,${color},transparent)`,
    transformOrigin: "left",
    animation: "nb-work-curtain .6s cubic-bezier(.5,0,.2,1) both",
    zIndex: 3, pointerEvents: "none" as const,
  });

  const promptLine = (cmd: string, comment: string) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontFamily: "var(--f-mono)", fontSize: 13, flexWrap: "wrap" as const, marginBottom: 16 }}>
      <span style={{ color: t.prompt }}>{SITE_SHELL_USER}</span>
      <span style={{ color: t.muted }}>~/work</span>
      <span style={{ color: t.yellow }}>%</span>
      <span style={{ color: t.ink }}>{cmd}</span>
      <span style={{ color: t.muted }}>{comment}</span>
    </div>
  );

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: WK_CSS }} />
      <NBPageShell t={t} mode={mode} current="work" label="shubz — ~/work — vim" onNavigate={onNavigate as any} onToggle={toggleTheme}>
        <NBLastUpdated t={t} label={WORK_LAST_UPDATED_LABEL} date={WORK_LAST_UPDATED_DATE} accent={t.yellow} cwd="~/work" cmd="cat ./cv.md" comment="annotated · chronological reverse" />

        <div style={{ padding: PAGE_PAD, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 36 : 56 }}>
          <main id="main" tabIndex={-1}>

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 26, position: "relative" }}>
              <h1 style={{ fontFamily: "var(--f-display)", fontVariationSettings: '"opsz" 144, "SOFT" 50', fontWeight: 400, fontSize: isMobile ? "clamp(2.2rem,9vw,3.2rem)" : "clamp(2.4rem,6vw,4.8rem)", lineHeight: 1.0, letterSpacing: "-0.02em", margin: 0, color: t.ink, maxWidth: "18ch" }}>
                {renderSpans(WORK_HERO, t)}
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: t.softInk, maxWidth: "28ch", marginTop: 22, marginBottom: 0 }}>
                {WORK_LEDE_PARTS.before}
                <a href={CV_PDF} target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}` }}>{WORK_LEDE_PARTS.pdfLink}</a>
                {WORK_LEDE_PARTS.after}
              </p>
              {!isMobile && (
                <div style={{ position: "absolute", right: 0, bottom: 22, width: 158, borderLeft: `1.5px solid ${t.yellow}`, paddingLeft: 14, fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 15, lineHeight: 1.4, color: t.softInk, transform: "rotate(-3deg)", transformOrigin: "left bottom" }}>
                  for the more traditional CV,{" "}
                  <a href={CV_PDF} target="_blank" rel="noreferrer" style={{ color: t.yellow, borderBottom: `1px solid ${t.yellow}`, textDecoration: "none" }}>download here</a>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 14, color: t.yellow, marginTop: 6, fontStyle: "normal" }}>→</div>
                </div>
              )}
            </div>

            {/* ── LENS BAR ─────────────────────────────────────────────── */}
            <div style={{ marginBottom: 30 }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, letterSpacing: "0.08em", marginBottom: 9 }}>VIEW THROUGH A LENS — what are you here for?</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {([["all","everything"],["ml","AI/ML"],["eng","engineering"],["community","community"]] as const).map(([k, l]) => (
                  <button key={k} onClick={() => {
                    setLens(k);
                    if (k !== "all" && !listOpen && !selBar && !selLane) setListOpen(true);
                  }} style={lensBtn(lens === k)}>{l}</button>
                ))}
              </div>
            </div>

            {/* ── INNER TABS ───────────────────────────────────────────── */}
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap" as const, borderBottom: `1px solid ${t.rule}`, marginBottom: 28 }}>
              {([["trajectory","§02 · trajectory"],["builds","§03 · builds"],["toolbox","§04 · toolbox"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} style={tabBtn(tab === k)}>{l}</button>
              ))}
            </div>

            {/* ── §02 TRAJECTORY ───────────────────────────────────────── */}
            {tab === "trajectory" && (
              <div style={sceneStyle}>
                <div style={curtainStyle(t.yellow)} />
                {promptLine("git log --since=2019 --graph", "# four tracks, often concurrent")}

                {/* Concurrency Gantt */}
                <div style={{ border: `1px solid ${t.rule}`, background: t.paper2, borderRadius: 3, padding: "16px 18px 12px", marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" as const, marginBottom: 3 }}>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, letterSpacing: "0.05em" }}>CONCURRENCY · click a bar or lane to list below</span>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.prompt }}>● 4 tracks live now</span>
                  </div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.softInk, minHeight: 15, marginBottom: 11 }}>{ganttCaption}</div>

                  {WORK_GANTT_LANES.map(L => {
                    const laneDimmed = selLane && selLane !== L.key;
                    return (
                      <div
                        key={L.key}
                        onClick={() => { setSelLane(selLane === L.key ? null : L.key); setSelBar(null); setListOpen(false); }}
                        style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 10, alignItems: "center", height: 24, cursor: "pointer", opacity: laneDimmed ? 0.22 : 1, transition: "opacity .2s", marginBottom: 4 }}
                      >
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: t[L.color] }}>{L.label}</div>
                        <div style={{ position: "relative" as const, height: 16 }}>
                          <div style={{ position: "absolute" as const, left: 0, right: 0, top: 7, height: 1, background: t.rule }} />
                          <div style={{ position: "absolute" as const, left: "98.6%", top: -5, bottom: -5, borderLeft: `1px dashed ${withAlpha(t.prompt, "8C")}`, zIndex: 2 }} />
                          {L.bars.map((bar, bi) => {
                            const bKey = L.key + "-" + bi;
                            const barDim = lens !== "all" && !normL(bar.lenses).includes(lens);
                            const isH = hover?.key === bKey;
                            const isSel = selBar?.key === bKey;
                            const baseOp = bar.faded ? 0.78 : 1;
                            return (
                              <div
                                key={bKey}
                                onMouseEnter={() => setHover({ key: bKey, label: bar.label })}
                                onMouseLeave={() => setHover(null)}
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelBar(selBar?.key === bKey ? null : { key: bKey, label: bar.label, match: bar.match || [] });
                                  setSelLane(null); setListOpen(false);
                                }}
                                style={{
                                  position: "absolute" as const,
                                  left: bar.left + "%", width: bar.w + "%",
                                  top: bar.top, height: bar.h,
                                  background: t[bar.cat], borderRadius: 5,
                                  opacity: baseOp * (barDim ? 0.14 : 1),
                                  cursor: "pointer", transition: "opacity .15s, box-shadow .15s",
                                  zIndex: (isH || isSel) ? 5 : 1,
                                  boxShadow: (isH || isSel) ? `0 0 0 1.5px ${t.ink}` : "none",
                                  ...(bar.big ? { display: "flex", alignItems: "center", paddingLeft: 7, color: "#fff", fontFamily: "var(--f-mono)", fontSize: 9, overflow: "hidden" } : {}),
                                }}
                              >{bar.name || ""}</div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Year axis */}
                  <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 10, marginTop: 8 }}>
                    <div />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 9, color: t.muted }}>
                      {["2019","2020","2021","2022","2023","2024","2025","2026"].map(y => <span key={y}>{y}</span>)}
                    </div>
                  </div>
                  {/* Geography band */}
                  <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 10, marginTop: 6 }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: t.muted, textAlign: "right" as const }}>where</div>
                    <div style={{ display: "flex", height: 4, borderRadius: 3, overflow: "hidden" }}>
                      <div title="Bangalore · Hyderabad" style={{ width: "32%", background: t.orange, opacity: 0.4 }} />
                      <div title="Pune · FLAME"           style={{ width: "26%", background: t.magenta, opacity: 0.4 }} />
                      <div title="Oxford"                  style={{ width: "13%", background: t.blue, opacity: 0.5 }} />
                      <div title="London"                  style={{ width: "29%", background: t.teal, opacity: 0.5 }} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 10, marginTop: 3 }}>
                    <div />
                    <div style={{ display: "flex", fontFamily: "var(--f-mono)", fontSize: 8.5, color: t.muted }}>
                      <span style={{ width: "32%" }}>Bangalore</span>
                      <span style={{ width: "26%" }}>Pune · FLAME</span>
                      <span style={{ width: "13%" }}>Oxford</span>
                      <span style={{ width: "29%" }}>London</span>
                    </div>
                  </div>
                </div>

                {/* Expand / clear controls */}
                <div style={{ marginTop: 18, marginBottom: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const }}>
                  <button
                    onClick={() => { setListOpen(!listOpen); setSelLane(null); setSelBar(null); }}
                    style={discBtn}
                  >{listOpen ? "— collapse" : `↓ expand all ${WORK_EVENTS_V5.length} entries, with notes`}</button>
                  {selActive && (
                    <>
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.yellow }}>{selCaption}</span>
                      <button onClick={() => { setSelLane(null); setSelBar(null); setListOpen(false); }} style={{ cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, padding: "3px 9px", borderRadius: 3, border: `1px solid ${t.muted}`, color: t.softInk, background: "transparent" }}>clear ✕</button>
                    </>
                  )}
                </div>

                {/* Events list */}
                {listVisible && (
                  <div style={{ marginBottom: 8 }}>
                    {shown.map((ev, i) => {
                      const accent = t[ev.cat];
                      const dim = isDimmed(ev.lenses);
                      const chips = makeChips(ev.track, ev.lenses);
                      return (
                        <div key={i} style={{ opacity: dim ? 0.3 : 1, transition: "opacity .2s" }}>
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "120px 1fr", gap: 18, padding: "13px 0", borderBottom: `1px solid ${t.rule}`, alignItems: "start" }}>
                            <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: accent }}>{ev.year}</div>
                            <div>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" as const }}>
                                <span style={{ fontFamily: "var(--f-body)", fontSize: ev.big ? 16.5 : 16, color: t.ink, lineHeight: 1.3, fontWeight: ev.big ? 500 : 400 }}>{ev.what}</span>
                                {chips.map((cp, ci) => (
                                  <span key={ci} style={cp.kind === "track" ? {
                                    fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.04em", textTransform: "uppercase" as const, padding: "1px 7px", borderRadius: 2, whiteSpace: "nowrap" as const,
                                    color: accent, border: `1px solid ${withAlpha(accent, "72")}`, background: `${withAlpha(accent, "1E")}`,
                                  } : {
                                    fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.04em", textTransform: "uppercase" as const, padding: "1px 7px", borderRadius: 2, whiteSpace: "nowrap" as const,
                                    color: t.muted, border: `1px dashed ${t.muted}`, background: "transparent",
                                  }}>{cp.label}</span>
                                ))}
                              </div>
                              <div style={{ fontSize: 13.5, color: t.softInk, fontStyle: "italic", lineHeight: 1.55, marginTop: 5, maxWidth: "64ch" }}>{ev.note}</div>
                              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, marginTop: 5 }}>{ev.where}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── §03 BUILDS ───────────────────────────────────────────── */}
            {tab === "builds" && (
              <div style={sceneStyle}>
                <div style={curtainStyle(t.yellow)} />
                {promptLine("ls -la ./builds/", "# 2 featured · 8 more")}

                {/* Featured cards */}
                <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
                  {WORK_FEATURED_V5.map(b => {
                    const accent = t[b.cat];
                    const dim = isDimmed(b.lenses);
                    const linkedEssay = b.essay ? essayBySlug[b.essay] : null;
                    return (
                      <div key={b.name} style={{ opacity: dim ? 0.3 : 1, transition: "opacity .2s" }}>
                        <div style={{ border: `2px solid ${t.ink}`, borderRadius: 4, background: t.bgCard, overflow: "hidden", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr" }}>
                          {/* Thumbnail / proprietary panel */}
                          <div style={{ borderRight: isMobile ? "none" : `1px solid ${t.rule}`, borderBottom: isMobile ? `1px solid ${t.rule}` : "none", minHeight: 130, position: "relative", background: `repeating-linear-gradient(135deg,${withAlpha(accent, "26")} 0,${withAlpha(accent, "26")} 2px,transparent 2px,transparent 8px),${withAlpha(accent, "0F")}` }}>
                            <span style={{ position: "absolute", top: 10, left: 12, fontFamily: "var(--f-mono)", fontSize: 9, color: accent, opacity: 0.85 }}>★ featured</span>
                            {b.private && (
                              <span style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, textAlign: "center", padding: "0 16px" }}>
                                <span style={{ fontSize: 22, color: accent, opacity: 0.75, lineHeight: 1 }}>▦</span>
                                <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: accent, letterSpacing: "0.06em" }}>proprietary</span>
                                <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: t.muted }}>in production · no public demo</span>
                              </span>
                            )}
                          </div>
                          {/* Details */}
                          <div style={{ padding: "15px 18px" }}>
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const }}>
                              <div style={{ fontFamily: "var(--f-display)", fontVariationSettings: '"opsz" 144', fontSize: 23, color: accent, lineHeight: 1.15 }}>
                                {b.name}
                                {b.url && <a href={b.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontFamily: "var(--f-mono)", color: accent, textDecoration: "none" }}> ↗</a>}
                              </div>
                              <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: t.muted }}>{b.deploy}</span>
                            </div>
                            <div style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 14.5, color: t.softInk, marginTop: 6, lineHeight: 1.5, maxWidth: "58ch" }}>{b.blurb}</div>
                            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginTop: 10 }}>
                              {b.metrics.map(m => (
                                <span key={m} style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: accent, border: `1px solid ${withAlpha(accent, "59")}`, background: `${withAlpha(accent, "17")}`, padding: "2px 8px", borderRadius: 2 }}>{m}</span>
                              ))}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 11, flexWrap: "wrap" as const }}>
                              <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: accent, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{b.scope}</span>
                              {linkedEssay && (
                                <a href={`/${b.essay}/`} onClick={e => { e.preventDefault(); onNavigate("essay", b.essay); }} style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: linkedEssay.c, borderBottom: `1px solid ${linkedEssay.c}72`, textDecoration: "none" }}>↗ written up: {linkedEssay.title}</a>
                              )}
                              {b.private && (
                                <a href="mailto:hello@shubzsharma.com?subject=Orion%20walkthrough" style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: accent, borderBottom: `1px solid ${withAlpha(accent, "72")}`, textDecoration: "none" }}>↗ ask for a walkthrough</a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Builds disclosure */}
                <div style={{ marginTop: 16, marginBottom: 8 }}>
                  <button onClick={() => setBuildsOpen(!buildsOpen)} style={discBtn}>
                    {buildsOpen ? "— collapse" : `↓ ${WORK_BUILDS_LIST_V5.length} more builds`}
                  </button>
                </div>
                {buildsOpen && (
                  <div style={{ marginBottom: 8 }}>
                    {WORK_BUILDS_LIST_V5.map((b, i) => {
                      const accent = t[b.cat];
                      const dim = isDimmed(b.lenses);
                      const linkedEssay = b.essay ? essayBySlug[b.essay] : null;
                      return (
                        <div key={b.name} style={{ opacity: dim ? 0.3 : 1, transition: "opacity .2s" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "baseline", padding: "16px 0", borderBottom: `1px dashed ${withAlpha(t.muted, "66")}` }}>
                            <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted }}>{String(i + 3).padStart(2, "0")}</span>
                            <div>
                              <div style={{ fontFamily: "var(--f-display)", fontVariationSettings: '"opsz" 144', fontSize: 21, color: accent, lineHeight: 1.2 }}>
                                {b.name}
                                {b.url && <a href={b.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: "var(--f-mono)", color: accent, textDecoration: "none" }}> ↗</a>}
                              </div>
                              <div style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 14, color: t.softInk, marginTop: 5, maxWidth: "62ch", lineHeight: 1.5 }}>{b.blurb}</div>
                              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginTop: 8 }}>
                                {b.metrics.map(m => (
                                  <span key={m} style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: accent, border: `1px solid ${withAlpha(accent, "52")}`, background: `${withAlpha(accent, "14")}`, padding: "2px 7px", borderRadius: 2 }}>{m}</span>
                                ))}
                              </div>
                              {linkedEssay && (
                                <div style={{ marginTop: 8, fontFamily: "var(--f-mono)", fontSize: 10.5 }}>
                                  <a href={`/${b.essay}/`} onClick={e => { e.preventDefault(); onNavigate("essay", b.essay); }} style={{ color: linkedEssay.c, borderBottom: `1px solid ${linkedEssay.c}72`, textDecoration: "none" }}>↗ written up: {linkedEssay.title}</a>
                                </div>
                              )}
                            </div>
                            <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: accent, textTransform: "uppercase" as const, letterSpacing: "0.08em", textAlign: "right" as const }}>{b.scope}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── §04 TOOLBOX ──────────────────────────────────────────── */}
            {tab === "toolbox" && (
              <div id="toolbox" style={{ ...sceneStyle, scrollMarginTop: 80 }}>
                <div style={curtainStyle(t.yellow)} />
                {promptLine("cat ./toolbox.md", "# signature tools · proficiency + provenance")}

                {/* Core 14 cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 11, marginBottom: 18 }}>
                  {WORK_CORE_CARDS.map(c => {
                    const accent = t[c.cat];
                    const dim = isDimmed(c.lenses);
                    const essayCl = c.essayCat ? t[c.essayCat] : (c.essay ? (essayBySlug[c.essay]?.c || accent) : accent);
                    const isExternal = c.href.startsWith("http") || c.href.endsWith(".pdf");
                    return (
                      <div key={c.name} style={{ opacity: dim ? 0.3 : 1, transition: "opacity .2s" }}>
                        <div style={{ border: `1px solid ${withAlpha(accent, "59")}`, borderLeft: `3px solid ${accent}`, borderRadius: 2, background: t.paper2, padding: "11px 13px", height: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, textTransform: "uppercase" as const, letterSpacing: "0.09em", color: accent }}>{c.group}</span>
                            <span style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, color: t.muted }}>{c.count}</span>
                          </div>
                          <div style={{ fontFamily: "var(--f-body)", fontSize: 15.5, color: t.ink, marginTop: 5, lineHeight: 1.25 }}>{c.name}</div>
                          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: accent, marginTop: 6, letterSpacing: "0.04em" }}>{c.tier}</div>
                          <a
                            href={c.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            onClick={c.essay ? e => { e.preventDefault(); onNavigate("essay", c.essay); } : undefined}
                            style={{ display: "inline-block", marginTop: 7, fontFamily: "var(--f-mono)", fontSize: 10, color: essayCl, borderBottom: `1px solid ${essayCl}72`, textDecoration: "none" }}
                          >↗ {c.link}</a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Full taxonomy disclosure */}
                <div style={{ marginTop: 4, marginBottom: 10 }}>
                  <button onClick={() => setFullOpen(!fullOpen)} style={discBtn}>
                    {fullOpen ? "— collapse the full taxonomy" : "↓ full taxonomy — 10 domains, every tool"}
                  </button>
                </div>
                {fullOpen && (
                  <div style={{ border: `1px solid ${t.rule}`, borderRadius: 3, padding: "18px 22px", background: t.paper2, marginBottom: 14 }}>
                    {WORK_FULL_GROUPS.map((g, gi, arr) => {
                      const accent = t[g.cat];
                      return (
                        <div key={g.group} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "130px 1fr", gap: isMobile ? "6px" : "10px 22px", paddingBottom: 13, marginBottom: gi < arr.length - 1 ? 13 : 0, borderBottom: gi < arr.length - 1 ? `1px dashed ${withAlpha(t.muted, "66")}` : "none", alignItems: "start" }}>
                          <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 17, color: accent, paddingTop: 3 }}>{g.group}.</div>
                          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 7 }}>
                            {g.items.map(it => (
                              <span key={it} style={{ fontFamily: "var(--f-body)", fontSize: 13.5, color: t.ink, background: t.paper, border: `1px solid ${withAlpha(accent, "47")}`, borderLeft: `3px solid ${accent}`, borderRadius: 2, padding: "4px 9px" }}>{it}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <a href={CV_PDF} target="_blank" rel="noreferrer" style={{ display: "inline-block", fontFamily: "var(--f-mono)", fontSize: 11, color: t.blue, borderBottom: `1px solid ${t.blue}`, textDecoration: "none", marginBottom: 18 }}>↗ the same toolbox, on the CV</a>
              </div>
            )}

          </main>

          {/* ── RIGHT RAIL ───────────────────────────────────────────────── */}
          <aside>
            <div style={{ position: "sticky", top: 16 }}>
              {/* Tip */}
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, lineHeight: 2, marginBottom: 22 }}>
                <div style={{ color: t.muted, marginBottom: 4 }}>./tip</div>
                <div style={{ color: t.softInk }}>use the <span style={{ color: t.yellow }}>lens</span> + <span style={{ color: t.yellow }}>tabs</span> above to filter what you see.</div>
              </div>

              {/* CV stat */}
              <NBPrompt t={t} cwd="~/work" cmd="stat cv.pdf" accent={t.yellow} />
              <div style={{ background: t.paper2, border: `1px solid ${t.rule}`, padding: "13px 15px", borderRadius: 3, marginBottom: 22, fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8, color: t.softInk }}>
                <div style={{ color: t.muted }}>Shubhangi-Sharma-Resume.pdf</div>
                <div><span style={{ color: t.muted }}>span</span> <span style={{ color: t.ink }}>{WORK_CV_STAT.span}</span></div>
                <div><span style={{ color: t.muted }}>updated</span> <span style={{ color: t.ink }}>{WORK_CV_STAT.updatedDisplay}</span></div>
                <div style={{ marginTop: 7 }}>
                  <a href={CV_PDF} target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${withAlpha(t.blue, "66")}`, textDecoration: "none" }}>↗ open the conventional pdf</a>
                </div>
              </div>

              {/* Based */}
              <NBPrompt t={t} cwd="~/work" cmd="cat ./based.md" accent={t.teal} />
              <div style={{ background: t.paper2, border: `1px solid ${t.rule}`, padding: "13px 15px", borderRadius: 3, fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8, color: t.softInk }}>
                <div><span style={{ color: t.muted }}>city</span> london, uk</div>
                <div><span style={{ color: t.muted }}>tz</span> {WORK_BASED.tz}</div>
                <div><span style={{ color: t.muted }}>calls</span> {WORK_BASED.calls}</div>
              </div>
            </div>
          </aside>
        </div>
      </NBPageShell>
    </>
  );
}
