// @ts-nocheck
/* eslint-disable */
/**
 * HomeV5 — pure renderer for the homepage.
 *
 * All text, lists, and per-essay accents live in `src/data/home.ts`.
 * The component reads from that file and lays everything out; editing
 * copy means editing that data file (or clicking the "edit this page →"
 * link in the page footer). No JSX changes required for content updates.
 *
 * V5 colour system: see DECISIONS-v5.md §14. Reversibility: this file is
 * additive — AppShell has a USE_V5 flag to fall back to HomeV4.
 */
import React from "react";
import { POSTS, thumbUrlFor } from "../../data/posts";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBThumbtack, NBThumb, NBMarginalia,
  NBMiniTerm,
} from "../chrome/NB";
import { NotebookLotka } from "../diagrams/NotebookLotka";
import {
  HERO_LINE_A, HERO_LINE_B, BIO, HOME_MARGINALIA,
  HOME_BUILDS, HOME_TOOLBOX, HOME_CONTACT_ROWS,
  HOME_FIG_LABEL, HOME_FIG_CAPTION, HOME_FIG_LINK_TEXT,
  HOME_PINNED_LABEL, HOME_PINNED_COMMENT, HOME_VIEW_ALL_TEXT,
  HOME_LAST_UPDATED_LABEL, HOME_LAST_UPDATED_DATE,
  HOME_CONTACT_HEADER, HOME_ANNOTATED_CV_LINK,
  HOME_TOOLBOX_SEE_ALL, TOOLBOX_TEASER, TOOLBOX_TEASER_PATH,
  type Span,
} from "../../data/home";

type NavFn = (page: string, slug?: string | null) => void;

// Inline span renderer. Plain strings render as-is; `em` spans become
// italic display-serif coloured fragments; `tag` spans are non-italic
// coloured fragments (used for keyword tags in the bio paragraph).
function renderSpans(spans: Span[], t: any) {
  return spans.map((s, i) => {
    if (typeof s === "string") return s;
    if ("em" in s) {
      return (
        <em
          key={i}
          style={{ fontStyle: "italic", color: s.c ? t[s.c] : undefined }}
        >{s.em}</em>
      );
    }
    return (
      <span key={i} style={{ color: s.c ? t[s.c] : undefined }}>{s.tag}</span>
    );
  });
}

export function HomeV5({
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

  // Pin first 3 essays from POSTS. Each gets its theme-resolved accent
  // + a shortened kicker for the row metadata line.
  const pinned = POSTS.slice(0, 3).map((post, i) => {
    const accentKey = post.nbAccent || "blue";
    const c = t[accentKey];
    const kicker = (post.kicker || "").replace(/^(Essay|Note)\s*·\s*/i, "").toLowerCase();
    return { ...post, c, kicker, pin: String(i + 1).padStart(2, "0") };
  });

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t}
      mode={mode}
      current="home"
      label="shubz — ~/home — vim · vol.04"
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label={HOME_LAST_UPDATED_LABEL} date={HOME_LAST_UPDATED_DATE} accent={t.yellow} />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* TITLE PAGE — hero H1 + bio + marginalia. All copy lives in
              src/data/home.ts (HERO_LINE_A, HERO_LINE_B, BIO, HOME_MARGINALIA). */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            <NBPrompt t={t} cwd="~/home" cmd="cat ./about.md" comment="who, what, where" accent={t.orange} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.6rem, 6vw, 5.2rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0,
              color: t.ink,
              maxWidth: "16ch",
            }}>
              {renderSpans(HERO_LINE_A, t)}<br />
              {renderSpans(HERO_LINE_B, t)}
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              {renderSpans(BIO, t)}
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={120} right={-10} accent={t[HOME_MARGINALIA.accent]}>
                {HOME_MARGINALIA.lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < HOME_MARGINALIA.lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </NBMarginalia>
            )}
          </div>

          {/* §02 PINNED WRITING — first 3 from POSTS. */}
          <NBPrompt t={t} cmd="ls ./writing/pinned/" comment={HOME_PINNED_COMMENT} accent={t.yellow} />
          <div className="caps" style={{ fontFamily: "var(--f-ui)", color: t.muted, fontSize: 11, marginBottom: 14, letterSpacing: "0.16em", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <span><span style={{ color: t.prompt }}>§02</span>&nbsp;&nbsp;{HOME_PINNED_LABEL.replace(/^§02\s*/, "")}</span>
            <a href="/writing/" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} style={{ color: t.blue, fontFamily: "var(--f-mono)", textDecoration: "none" }}>{HOME_VIEW_ALL_TEXT(POSTS.length)}</a>
          </div>
          <ol style={{ listStyle: "none", padding: 0, margin: "0 0 44px" }}>
            {pinned.map((e, i, arr) => (
              <li key={e.slug} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "auto 1fr auto" : "auto 1fr auto auto",
                gap: isMobile ? 14 : 22,
                alignItems: "center",
                padding: "22px 0",
                borderBottom: i === arr.length - 1 ? "none" : `1px dashed ${t.muted}66`,
                transform: i % 2 ? "translateX(0)" : "translateX(2px)",
              }}>
                <NBThumbtack color={e.c} ink={t.ink} size={18} />
                <a href={`/${e.slug}/`} onClick={(ev) => { ev.preventDefault(); onNavigate("essay", e.slug); }} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <span style={{ fontFamily: "var(--f-display)", fontSize: isMobile ? 24 : 32, color: e.c, fontVariationSettings: '"opsz" 144, "SOFT" 50', lineHeight: 1.1, display: "block" }}>{e.title}</span>
                  <span style={{ display: "block", fontFamily: "var(--f-body)", fontStyle: "italic", color: t.softInk, fontSize: 15, marginTop: 6, maxWidth: "44ch", lineHeight: 1.5 }}>
                    {e.dek}
                  </span>
                  <span style={{ display: "block", fontFamily: "var(--f-mono)", color: t.muted, fontSize: 11, marginTop: 8 }}>
                    no.{e.pin} · {e.kicker} · {e.minutes}m
                  </span>
                </a>
                {!isMobile && (
                  <NBThumb t={t} accent={e.c} label={e.kicker.split(/[\s&]+/)[0]} tilt={i % 2 === 0 ? -2 : 2.2} w={130} h={96} src={thumbUrlFor(e.slug)} />
                )}
                <a href={`/${e.slug}/`} onClick={(ev) => { ev.preventDefault(); onNavigate("essay", e.slug); }} style={{ fontFamily: "var(--f-mono)", color: e.c, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}>↗ read</a>
              </li>
            ))}
          </ol>

          {/* §03 BUILDS — HOME_BUILDS list. */}
          <NBPrompt t={t} cmd="cat ./builds.md" comment="selected" accent={t.orange} />
          <div style={{
            border: `2px solid ${t.ink}`,
            padding: isMobile ? "14px 16px" : "18px 22px",
            marginBottom: 12,
            background: t.bgCard,
            position: "relative",
          }}>
            {HOME_BUILDS.map((b, i, arr) => (
              <a key={b.name} href={b.url} target="_blank" rel="noreferrer" style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr auto" : "240px 1fr auto",
                gap: 18,
                padding: "10px 0",
                borderBottom: i === arr.length - 1 ? "none" : `1px dashed ${t.muted}66`,
                textDecoration: "none",
                alignItems: "baseline",
              }}>
                <span style={{ fontFamily: "var(--f-mono)", color: t[b.c], fontWeight: 500, fontSize: 14 }}>
                  ./{b.name} <span style={{ opacity: 0.6 }}>↗</span>
                </span>
                {!isMobile && (
                  <span style={{ fontFamily: "var(--f-body)", fontStyle: "italic", color: t.softInk, fontSize: 16 }}>{b.blurb}</span>
                )}
                <span style={{ fontFamily: "var(--f-mono)", color: t.muted, fontSize: 12 }}>{b.year}</span>
                {isMobile && (
                  <span style={{ gridColumn: "1 / -1", fontFamily: "var(--f-body)", fontStyle: "italic", color: t.softInk, fontSize: 14, marginTop: -4 }}>{b.blurb}</span>
                )}
              </a>
            ))}
          </div>
          <div style={{ marginBottom: 44, textAlign: "right" }}>
            <a href="/work/" onClick={(e) => { e.preventDefault(); onNavigate("work"); }} style={{ fontFamily: "var(--f-mono)", color: t.orange, fontSize: 11, textDecoration: "none", letterSpacing: "0.08em" }}>{HOME_ANNOTATED_CV_LINK}</a>
          </div>

          {/* §04 TOOLBOX — condensed teaser. Full taxonomy on /work#toolbox. */}
          <NBPrompt t={t} cmd="cat ./toolbox.md" comment="what built what" accent={t.yellow} />
          <div style={{
            border: `2px solid ${t.ink}`,
            padding: isMobile ? "18px 16px" : "22px 26px 26px",
            background: t.bgCard,
            marginBottom: 60,
            position: "relative",
          }}>
            {HOME_TOOLBOX.map((g, gi, arr) => {
              const groupColor = t[g.primary] || t.blue;
              return (
              <div key={g.group} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "140px 1fr",
                gap: isMobile ? "8px" : "12px 24px",
                paddingBottom: 18,
                marginBottom: 18,
                borderBottom: gi === arr.length - 1 ? "none" : `1px dashed ${t.muted}55`,
                alignItems: "start",
              }}>
                <div style={{
                  fontFamily: "var(--f-display)",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: groupColor,
                  paddingTop: 6,
                }}>{g.group}.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {g.items.map(it => (
                    <span key={it.name} style={{
                      display: "inline-flex", flexDirection: "column", gap: 2,
                      padding: "7px 14px 8px",
                      background: t.paper2,
                      border: `1px solid ${groupColor}44`,
                      borderLeft: `3px solid ${groupColor}`,
                      borderRadius: 2,
                      maxWidth: "100%",
                    }}>
                      <span style={{ fontFamily: "var(--f-body)", fontSize: 15, color: t.ink, lineHeight: 1.2 }}>
                        {it.name}
                      </span>
                      {it.links.map((l, li) => {
                        const essayMatch = l.href.match(/^\/([^\/]+)\/$/);
                        const post = essayMatch ? POSTS.find(p => p.slug === essayMatch[1]) : null;
                        const linkColor = post ? t[post.nbAccent || "blue"] : groupColor;
                        const isExternal = /^https?:/.test(l.href);
                        const isInternal = l.href.startsWith("/") && !l.href.startsWith("/uploads/");
                        return (
                          <a
                            key={li}
                            href={l.href}
                            target={isExternal || l.href.endsWith(".pdf") ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            onClick={post ? (e) => { e.preventDefault(); onNavigate("essay", post.slug); }
                              : isInternal && l.href === "/work/" ? (e) => { e.preventDefault(); onNavigate("work"); }
                              : isInternal && l.href === "/" ? (e) => { e.preventDefault(); onNavigate("home"); }
                              : undefined}
                            style={{
                              fontFamily: "var(--f-mono)", fontSize: 10.5, color: linkColor,
                              letterSpacing: "0.02em", textDecoration: "none",
                            }}
                          >↗ {l.label}</a>
                        );
                      })}
                    </span>
                  ))}
                </div>
              </div>
              );
            })}
            <div style={{
              marginTop: 6, paddingTop: 14,
              borderTop: `1px dashed ${t.muted}55`,
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, gap: 12, flexWrap: "wrap",
            }}>
              <span>{TOOLBOX_TEASER} <span style={{ color: t.softInk }}>{TOOLBOX_TEASER_PATH}</span></span>
              <a href="/work/#toolbox" style={{
                color: t.purple,
                textDecoration: "none",
                borderBottom: `1px solid ${t.purple}66`,
                paddingBottom: 1,
              }}>{HOME_TOOLBOX_SEE_ALL}</a>
            </div>
          </div>
        </main>

        {/* RIGHT RAIL — cat .now + Lotka figure + contact slip. */}
        <aside>
          <NBPrompt t={t} cwd="~/home" cmd="cat .now" comment="live · autoplay" accent={t.orange} />
          <NBMiniTerm t={t} accent={t.orange} />

          <div style={{ marginTop: 28 }}>
            <NBPrompt t={t} cwd="~/figures" cmd="./figures/may.sh" accent={t.red} />
            <div style={{
              border: `2px solid ${t.ink}`,
              padding: 16,
              background: t.bgCard,
              position: "relative",
              overflow: "hidden",
            }}>
              <NBThumbtack color={t.red} ink={t.ink} />
              <span style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 16, color: t.ink }}>{HOME_FIG_LABEL}</span>
              <div style={{ marginTop: 10 }}>
                <NotebookLotka w={isMobile ? 240 : 290} h={isMobile ? 174 : 210} ink={t.ink} accent={t.red} paper={t.paper} muted={t.muted} />
              </div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span>{HOME_FIG_CAPTION}</span>
                <a href="/may-2026/" onClick={(e) => { e.preventDefault(); onNavigate("essay", "may-2026"); }} style={{ color: t.red, textDecoration: "none" }}>{HOME_FIG_LINK_TEXT}</a>
              </div>
            </div>
          </div>

          {/* Contact slip — orange (communication/outreach). */}
          <div style={{
            marginTop: 28,
            padding: "14px 18px",
            border: `2px solid ${t.orange}`,
            borderRadius: 2,
            transform: "rotate(0.5deg)",
            background: t.bgCard,
          }}>
            <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", color: t.orange, fontSize: 18, marginBottom: 6 }}>{HOME_CONTACT_HEADER}</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: t.softInk, display: "grid", gap: 4 }}>
              {HOME_CONTACT_ROWS.map((row, i) => {
                const isMail = row.href.startsWith("mailto:");
                const isExternal = /^https?:/.test(row.href);
                const isContactPage = row.href === "/contact/";
                return (
                  <a
                    key={i}
                    href={row.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    onClick={isContactPage ? (e) => { e.preventDefault(); onNavigate("contact"); } : undefined}
                    style={{ color: t.ink, textDecoration: "none" }}
                  >
                    <span style={{ color: t.orange }}>↗</span> {row.label}{row.handle ? <> · <span style={{ color: t.muted }}>{row.handle}</span></> : null}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
