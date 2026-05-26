// @ts-nocheck
/* eslint-disable */
/**
 * WorkV5 — Port of design_handoff/work-page.jsx.
 *
 * Annotated CV: trajectory timeline → selected builds (with essay
 * provenance links) → toolbox chip grid → speaking & STEM outreach.
 * Right rail: cv.pdf stat block, open-to.md, based.md.
 *
 * Content lifted verbatim from WorkV4.tsx (events, builds, speaking) so the
 * existing curated prose is preserved — V5 only changes the chrome.
 */
import React from "react";
import { POSTS } from "../../data/posts";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBMarginalia,
} from "../chrome/NB";
import {
  CV_PDF, PERSONAL_SITE_REPO,
  WORK_HERO, WORK_LEDE_PARTS, WORK_MARGINALIA,
  WORK_LAST_UPDATED_LABEL, WORK_LAST_UPDATED_DATE,
  WORK_EVENTS, WORK_BUILDS, WORK_TOOLBOX, WORK_SPEAKING,
  WORK_CV_STAT, WORK_BASED,
} from "../../data/work";
import type { Span } from "../../data/home";

type NavFn = (page: string, slug?: string | null) => void;

function renderSpans(spans: Span[], t: any) {
  return spans.map((s, i) => {
    if (typeof s === "string") return s;
    if ("em" in s) {
      return <em key={i} style={{ fontStyle: "italic", color: s.c ? t[s.c] : undefined }}>{s.em}</em>;
    }
    return <span key={i} style={{ color: s.c ? t[s.c] : undefined }}>{s.tag}</span>;
  });
}


export function WorkV5({
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

  // Map slug → theme-resolved accent, for provenance link colours.
  const essayBySlug = React.useMemo(() => {
    const map: Record<string, { title: string; c: string }> = {};
    for (const p of POSTS) {
      const key = p.nbAccent || "blue";
      map[p.slug] = { title: p.title, c: t[key] };
    }
    return map;
  }, [t]);

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t} mode={mode} current="work"
      label="shubz — ~/work — vim"
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label={WORK_LAST_UPDATED_LABEL} date={WORK_LAST_UPDATED_DATE} accent={t.yellow} />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            {/* CV header = body-of-work meta → Infra & craft (yellow). */}
            <NBPrompt t={t} cwd="~/work" cmd="cat ./cv.md" comment="annotated · chronological reverse" accent={t.yellow} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "18ch",
            }}>
              {renderSpans(WORK_HERO, t)}
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              {WORK_LEDE_PARTS.before}
              <a href={CV_PDF} target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66` }}>{WORK_LEDE_PARTS.pdfLink}</a>
              {WORK_LEDE_PARTS.after}
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={120} tilt={-1.8} accent={t[WORK_MARGINALIA.accent]}>
                {WORK_MARGINALIA.lines.map((line, i) => {
                  const isLastWithLink = WORK_MARGINALIA.seeHereHref && i === WORK_MARGINALIA.lines.length - 1;
                  return (
                    <React.Fragment key={i}>
                      {isLastWithLink ? (
                        <a
                          href={WORK_MARGINALIA.seeHereHref}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "inherit", textDecoration: "none", borderBottom: `1px solid currentColor`, paddingBottom: 1, pointerEvents: "auto" }}
                        >{line}</a>
                      ) : line}
                      {i < WORK_MARGINALIA.lines.length - 1 && <br />}
                    </React.Fragment>
                  );
                })}
              </NBMarginalia>
            )}
          </div>

          {/* §02 Trajectory — alternating left/right timeline around a
              central vertical rule on desktop; single-column stack on
              mobile. Each entry has its dot anchored on the centre line.
              Current job (index 0) keeps the prompt-green dot ("active"
              universal status); past entries use the muted ring. */}
          <NBPromptHead t={t} n="§02" command="git log --since=2019 --reverse | tac" comment="2019 → present" title="Trajectory" accent={t.yellow} level={isMobile ? 22 : 28} />
          {!isMobile ? (
            <div style={{ position: "relative", marginBottom: 56, paddingTop: 8 }}>
              {/* Central spine */}
              <div style={{ position: "absolute", left: "50%", top: 8, bottom: 8, width: 2, background: t.rule, transform: "translateX(-1px)" }} />
              {WORK_EVENTS.map((e, i) => {
                const onLeft = i % 2 === 0;
                const isCurrent = i === 0;
                return (
                  <div key={i} style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, paddingBottom: 28, alignItems: "start" }}>
                    {/* Dot on the spine */}
                    <div style={{
                      position: "absolute", left: "50%", top: 6,
                      width: 14, height: 14, borderRadius: 999,
                      background: t.paper, border: `3px solid ${isCurrent ? t.prompt : t.muted}`,
                      transform: "translateX(-7px)", zIndex: 1,
                    }} />
                    {/* Left cell */}
                    <div style={{ paddingRight: 36, textAlign: "right" }}>
                      {onLeft ? (
                        <>
                          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: isCurrent ? t.prompt : t.yellow }}>{e.year}</div>
                          <div style={{ fontFamily: "var(--f-body)", fontSize: 17, color: t.ink, lineHeight: 1.3, marginTop: 4 }}>{e.what}</div>
                          {e.note && <div style={{ fontSize: 14, color: t.softInk, marginTop: 4, fontStyle: "italic", lineHeight: 1.55, marginLeft: "auto", maxWidth: "44ch" }}>{e.note}</div>}
                          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, marginTop: 6 }}>{e.where}</div>
                        </>
                      ) : null}
                    </div>
                    {/* Right cell */}
                    <div style={{ paddingLeft: 36, textAlign: "left" }}>
                      {!onLeft ? (
                        <>
                          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: isCurrent ? t.prompt : t.yellow }}>{e.year}</div>
                          <div style={{ fontFamily: "var(--f-body)", fontSize: 17, color: t.ink, lineHeight: 1.3, marginTop: 4 }}>{e.what}</div>
                          {e.note && <div style={{ fontSize: 14, color: t.softInk, marginTop: 4, fontStyle: "italic", lineHeight: 1.55, maxWidth: "44ch" }}>{e.note}</div>}
                          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, marginTop: 6 }}>{e.where}</div>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Mobile: single column, dots on the left, classic timeline. */
            <div style={{ position: "relative", paddingLeft: 24, marginBottom: 56 }}>
              <div style={{ position: "absolute", left: 6, top: 8, bottom: 8, width: 2, background: t.rule }} />
              {WORK_EVENTS.map((e, i) => (
                <div key={i} style={{ position: "relative", paddingBottom: 22 }}>
                  <div style={{
                    position: "absolute", left: -24, top: 6,
                    width: 14, height: 14, borderRadius: 999,
                    background: t.paper, border: `3px solid ${i === 0 ? t.prompt : t.muted}`,
                  }} />
                  <div>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: i === 0 ? t.prompt : t.yellow }}>{e.year}</div>
                    <div style={{ fontFamily: "var(--f-body)", fontSize: 15, color: t.ink, lineHeight: 1.3, marginTop: 4 }}>{e.what}</div>
                    {e.note && <div style={{ fontSize: 14, color: t.softInk, marginTop: 4, fontStyle: "italic", lineHeight: 1.55 }}>{e.note}</div>}
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, marginTop: 4 }}>{e.where}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* §03 Selected builds */}
          {/* §03 Selected builds = body of work → Infra & craft (yellow). */}
          <NBPromptHead t={t} n="§03" command="ls -la ./builds/" comment="selected · open · founding" title="Selected work" accent={t.yellow} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56 }}>
            {WORK_BUILDS.map((b, i, arr) => {
              const linkedEssay = b.essay ? essayBySlug[b.essay] : null;
              const tagColor = t[b.c] || t.blue;
              return (
                <a key={b.name} href={b.url || "#"} target={b.url ? "_blank" : undefined} rel={b.url ? "noreferrer" : undefined} style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "auto 1fr" : "auto 1fr auto auto",
                  gap: isMobile ? 14 : 20, alignItems: "baseline",
                  padding: "20px 0",
                  borderBottom: i === arr.length - 1 ? "none" : `1px dashed ${t.muted}55`,
                  color: t.ink, textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, width: 28 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "var(--f-display)", fontVariationSettings: '"opsz" 144, "SOFT" 50',
                      fontSize: 22, color: tagColor, lineHeight: 1.2,
                    }}>
                      {b.name} {b.url && <span style={{ fontSize: 14, fontFamily: "var(--f-mono)" }}>↗</span>}
                    </div>
                    <div style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 15, color: t.softInk, marginTop: 4, maxWidth: "60ch", lineHeight: 1.5 }}>
                      {b.blurb}
                    </div>
                    {linkedEssay && (
                      <div style={{ marginTop: 8, fontFamily: "var(--f-mono)", fontSize: 11 }}>
                        <span style={{ color: t.muted }}>written up: </span>
                        <a href={`/${b.essay}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", b.essay); }} style={{
                          color: linkedEssay.c,
                          borderBottom: `1px solid ${linkedEssay.c}66`,
                          paddingBottom: 1,
                          textDecoration: "none",
                        }}>↗ {linkedEssay.title}</a>
                      </div>
                    )}
                    {isMobile && (
                      <div style={{ marginTop: 8, display: "flex", gap: 12, fontFamily: "var(--f-mono)", fontSize: 10 }}>
                        <span style={{ color: tagColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{b.scope}</span>
                        <span style={{ color: t.muted, marginLeft: "auto" }}>{b.year}</span>
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: tagColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{b.scope}</span>
                  )}
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: "right" }}>{b.year}</span>
                  )}
                </a>
              );
            })}
          </div>

          {/* §04 Toolbox — id="toolbox" so HomeV5's "see all skills →" link
              can deep-link straight to this section via /work/#toolbox. */}
          <div id="toolbox" style={{ scrollMarginTop: 80 }}>
          {/* §04 Toolbox = meta-aggregate of skills → Infra & craft (yellow). */}
          <NBPromptHead t={t} n="§04" command="cat ./toolbox.md" comment="what built what" title="Toolbox" accent={t.yellow} level={isMobile ? 22 : 28} />
          <div style={{ border: `2px solid ${t.ink}`, padding: isMobile ? "18px 16px" : "22px 26px", background: t.bgCard, marginBottom: 56 }}>
            {WORK_TOOLBOX.map((g, gi, arr) => {
              const groupColor = t[g.primary] || t.blue;
              return (
              <div key={g.group} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "140px 1fr",
                gap: isMobile ? "8px" : "12px 24px",
                paddingBottom: 18, marginBottom: 18,
                borderBottom: gi === arr.length - 1 ? "none" : `1px dashed ${t.muted}55`,
                alignItems: "start",
              }}>
                <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 18, color: groupColor, paddingTop: 6 }}>
                  {g.group}.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {g.items.map((it) => (
                    <span key={it.name} style={{
                      display: "inline-flex", flexDirection: "column", gap: 4,
                      padding: "8px 14px 10px",
                      background: t.paper2,
                      border: `1px solid ${groupColor}44`,
                      borderLeft: `3px solid ${groupColor}`,
                      borderRadius: 2,
                      minWidth: isMobile ? 0 : 200,
                      maxWidth: "100%",
                    }}>
                      <span style={{ fontFamily: "var(--f-body)", fontSize: 15, color: t.ink, lineHeight: 1.2 }}>{it.name}</span>
                      <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {it.links.map((l, j) => {
                          // Resolve link colour: essay route → essay's accent;
                          // anything else → category primary.
                          const essayMatch = l.href.match(/^\/([^\/]+)\/$/);
                          const post = essayMatch ? POSTS.find((p) => p.slug === essayMatch[1]) : null;
                          const linkColor = post ? t[post.nbAccent || "blue"] : groupColor;
                          const isExternal = /^https?:/.test(l.href);
                          const isInSiteRoute = l.href.startsWith("/") && !l.href.startsWith("/uploads/");
                          const navHandler = post
                            ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("essay", post.slug); }
                            : isInSiteRoute && l.href === "/work/"
                              ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("work"); }
                              : isInSiteRoute && l.href === "/writing/"
                                ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("writing"); }
                                : isInSiteRoute && l.href === "/"
                                  ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("home"); }
                                  : undefined;
                          return (
                            <a
                              key={j}
                              href={l.href}
                              target={isExternal || l.href.endsWith(".pdf") ? "_blank" : undefined}
                              rel={isExternal ? "noreferrer" : undefined}
                              onClick={navHandler}
                              style={{
                                fontFamily: "var(--f-mono)", fontSize: 10.5, color: linkColor,
                                letterSpacing: "0.02em",
                                borderBottom: `1px solid ${linkColor}44`,
                                alignSelf: "flex-start",
                                textDecoration: "none",
                              }}
                            >↗ {l.label}</a>
                          );
                        })}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
          </div>{/* /#toolbox */}

          {/* §05 Speaking — V5 canonical: outreach/community/teaching = orange. */}
          <NBPromptHead t={t} n="§05" command="cat ./speaking.md" title="Speaking & STEM outreach" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 60, borderTop: `1px solid ${t.muted}55` }}>
            {WORK_SPEAKING.map((s, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr 80px",
                gap: isMobile ? 4 : 18, alignItems: "baseline",
                padding: "14px 0",
                borderBottom: `1px solid ${t.muted}33`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.orange, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.event}</span>
                <span style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 15, color: t.softInk }}>{s.talk}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: isMobile ? "left" : "right" }}>{s.year}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Right rail */}
        <aside>
          {/* CV PDF stat block in right rail = meta → Infra & craft (yellow). */}
          <NBPrompt t={t} cwd="~/work" cmd="stat cv.pdf" accent={t.yellow} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
            color: t.softInk,
          }}>
            <div style={{ color: t.muted }}>{WORK_CV_STAT.filename}</div>
            <div><span style={{ color: t.muted }}>entries</span> <span style={{ color: t.ink }}>{WORK_EVENTS.length}</span></div>
            <div><span style={{ color: t.muted }}>span</span> <span style={{ color: t.ink }}>{WORK_CV_STAT.span}</span></div>
            <div><span style={{ color: t.muted }}>updated</span> <span style={{ color: t.ink }}>{WORK_CV_STAT.updatedDisplay}</span></div>
            <div style={{ marginTop: 6, color: t.muted }}>includes</div>
            <div style={{ paddingLeft: 10 }}>
              {WORK_CV_STAT.sections.map((s, i) => (
                <div key={i} style={{ color: t.softInk }}>· {s}</div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <a href={CV_PDF} target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66`, textDecoration: "none" }}>{WORK_CV_STAT.openText}</a>
            </div>
          </div>

          {/* Open-to block moved to /contact (it's a communication
              preference, not a CV item). See CONTACT_OPEN_TO. */}

          {/* Location/timezone block → Geospatial (teal). */}
          <NBPrompt t={t} cwd="~/work" cmd="cat ./based.md" accent={t.teal} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
            color: t.softInk,
          }}>
            <div><span style={{ color: t.muted }}>city</span> london, uk</div>
            <div><span style={{ color: t.muted }}>tz</span> {WORK_BASED.tz}</div>
            <div><span style={{ color: t.muted }}>calls</span> {WORK_BASED.calls}</div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
