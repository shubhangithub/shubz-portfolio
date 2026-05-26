// @ts-nocheck
/* eslint-disable */
/**
 * ArticleV5 — Wraps the existing essay components in V5 "field notebook"
 * chrome. Essay BODIES (BluedotEssay, JayaEssay, ZXEssay, …) are unchanged
 * — V5 only restyles the surrounding hero, meta, and rail.
 *
 * Palette adapter: essay components consume V4's flat `{ accent, ink, paper,
 * line, muted }` shape. V5 synthesises that from the NB theme + the per-essay
 * accent key (Post.nbAccent → NB_LIGHT/DARK[key]). This means zero changes
 * to essay TSX files — content is preserved 100%.
 *
 * Reversibility: this file imports from `../legacy`. Removing the V5 dispatch
 * in AppShell restores the original V4 article rendering.
 */
import React from "react";
import { POSTS, findPost } from "../../data/posts";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  BluedotEssay, ConstraintClusterEssay, DraftEssay, FashionEssay, JayaEssay,
  MayEssay, SixEnginesEssay, ThresholdEssay, ZXEssay, essayMeta,
} from "../legacy";
import {
  NBPageShell, NBLastUpdated, NBPrompt,
} from "../chrome/NB";

type NavFn = (page: string, slug?: string | null) => void;

function essayBodyFor(slug: string) {
  switch (slug) {
    case "jaya":                  return JayaEssay;
    case "threshold-gate":        return ThresholdEssay;
    case "constraint-clustering": return ConstraintClusterEssay;
    case "six-engines":           return SixEnginesEssay;
    case "fashion-trends":        return FashionEssay;
    case "may-2026":              return MayEssay;
    case "bluedot-unit1":         return BluedotEssay;
    case "zx-calculus":           return ZXEssay;
    default:                      return DraftEssay;
  }
}

export function ArticleV5({
  slug,
  dark,
  toggleTheme,
  onNavigate,
}: {
  slug: string;
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
      window.scrollTo(0, 0);
    }
  }, [slug, t.paper]);

  const post = findPost(slug) || POSTS[0];
  const accentKey = post.nbAccent || "blue";
  const accent = t[accentKey];

  // Adapter palette — essay TSX components expect this V4 shape. Keys map
  // cleanly: paper/ink stay, line→rule, muted→muted, accent→per-essay colour.
  const essayPalette = {
    paper: t.paper,
    ink: t.ink,
    muted: t.muted,
    line: t.rule,
    accent,
  };

  const Body = essayBodyFor(post.slug);
  const meta = (typeof essayMeta === "function") ? essayMeta(post.slug) : { tags: "", toc: [], sources: [], sidenotes: 0 };

  // Prev / next essays for the bottom navigator.
  const idx = POSTS.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? POSTS[idx - 1] : null;
  const next = idx >= 0 && idx < POSTS.length - 1 ? POSTS[idx + 1] : null;
  const prevAccent = prev ? t[prev.nbAccent || "blue"] : t.muted;
  const nextAccent = next ? t[next.nbAccent || "blue"] : t.muted;

  // Pin / kicker — strip "Essay · " prefix.
  const kicker = (post.kicker || "").replace(/^(Essay|Note)\s*·\s*/i, "");
  const pin = String((idx >= 0 ? idx : 0) + 1).padStart(2, "0");

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t} mode={mode} current="essay"
      label={`shubz — ~/writing/${post.slug}.mdx — vim`}
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label={`ESSAY · ${kicker.toUpperCase()} · NO.${pin}`} date="26 may 2026" />

      {/* HERO */}
      <div style={{ padding: PAGE_PAD, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 36, position: "relative" }}>
          <NBPrompt t={t} cwd={`~/writing/${post.slug}`} cmd="cat ./meta.json" comment="essay header" accent={accent} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22, marginTop: 18, gap: 12, flexWrap: "wrap" }}>
            <div className="caps" style={{ fontFamily: "var(--f-ui)", color: accent, fontSize: 12, letterSpacing: "0.16em", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 26, height: 1, background: accent }} />
              ESSAY · {kicker.toUpperCase()}
            </div>
            <div style={{ fontFamily: "var(--f-mono)", color: t.muted, fontSize: 11, textAlign: "right", lineHeight: 1.7 }}>
              <div>no.{pin} · {post.minutes} min read</div>
              <div style={{ color: accent }}>./{post.slug}.mdx</div>
            </div>
          </div>
          <h1 style={{
            fontFamily: "var(--f-display)",
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
            fontWeight: 400,
            fontSize: isMobile ? "clamp(2.4rem, 10vw, 3.6rem)" : "clamp(2.8rem, 7vw, 5.6rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            margin: 0, color: t.ink, maxWidth: "14ch",
          }}>
            {post.title}.
          </h1>
          <p style={{
            fontFamily: "var(--f-display)", fontStyle: "italic",
            fontSize: isMobile ? 18 : 22, lineHeight: 1.4, color: t.softInk,
            marginTop: 22, maxWidth: "44ch",
          }}>
            {post.dek}
          </p>
        </div>
      </div>

      {/* BODY + RAIL */}
      <div style={{
        padding: isMobile ? "0 20px" : "0 64px",
        maxWidth: 1100, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 280px",
        gap: isMobile ? 36 : 56,
        position: "relative",
      }}>
        {/* Essay body — palette adapter passes V4-shaped object to the
            unmodified essay component. Sidenote CSS lives in global.css. */}
        <article style={{
          fontFamily: "var(--f-body)",
          fontSize: isMobile ? "1.08rem" : "1.12rem",
          lineHeight: 1.72,
          color: t.ink,
          maxWidth: "62ch",
        }}>
          <Body palette={essayPalette} />

          {/* Prev / next */}
          {(prev || next) && (
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18,
              marginTop: 48, paddingTop: 26, borderTop: `1px solid ${t.muted}55`,
            }}>
              {prev ? (
                <a href={`/${prev.slug}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", prev.slug); }} style={{
                  padding: 16, border: `1px solid ${t.muted}55`,
                  background: t.paper2, textDecoration: "none", color: "inherit",
                }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, letterSpacing: "0.08em", marginBottom: 4 }}>← PREVIOUS</div>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 18, color: prevAccent, fontStyle: "italic" }}>{prev.title}</div>
                </a>
              ) : <span />}
              {next ? (
                <a href={`/${next.slug}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", next.slug); }} style={{
                  padding: 16, border: `1px solid ${t.muted}55`,
                  background: t.paper2, textAlign: "right" as any, textDecoration: "none", color: "inherit",
                }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, letterSpacing: "0.08em", marginBottom: 4 }}>NEXT →</div>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 18, color: nextAccent, fontStyle: "italic" }}>{next.title}</div>
                </a>
              ) : <span />}
            </div>
          )}
        </article>

        {/* Right rail — TOC + meta JSON + back link. Sticky on desktop. */}
        {!isMobile && (
          <aside style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: 24 }}>
              {meta.toc && meta.toc.length > 1 && (
                <>
                  <NBPrompt t={t} cwd={`~/writing/${post.slug}`} cmd="grep '^##' ." comment="toc" accent={accent} />
                  <div style={{
                    background: t.paper2, border: `1px solid ${t.rule}`,
                    padding: "12px 14px", borderRadius: 3,
                    fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.9,
                    marginBottom: 28,
                  }}>
                    {meta.toc.slice(1).map((entry: string, i: number) => (
                      <div key={i} style={{ color: i === 0 ? accent : t.softInk }}>
                        §{String(i + 1).padStart(2, "0")} · {entry}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <NBPrompt t={t} cwd={`~/writing/${post.slug}`} cmd="cat .meta" accent={t.ochre} />
              <pre style={{
                background: t.paper2, border: `1px solid ${t.rule}`,
                padding: "10px 12px", borderRadius: 3,
                fontFamily: "var(--f-mono)", fontSize: 10.5, lineHeight: 1.8,
                color: t.softInk, margin: 0, marginBottom: 28, whiteSpace: "pre-wrap",
              }}>{`{
  `}<span style={{ color: t.blue }}>"family"</span>{`:    `}<span style={{ color: t.ochre }}>{`"${post.family || "—"}"`}</span>{`,
  `}<span style={{ color: t.blue }}>"reading"</span>{`:   `}<span style={{ color: t.ochre }}>{`"${post.minutes} min"`}</span>{`,
  `}<span style={{ color: t.blue }}>"sidenotes"</span>{`: `}<span style={{ color: t.ochre }}>{`"${meta.sidenotes || 0}"`}</span>{`,
  `}<span style={{ color: t.blue }}>"updated"</span>{`:   `}<span style={{ color: t.ochre }}>"may '26"</span>{`
}`}</pre>

              <a href="/writing/" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} style={{
                display: "inline-block",
                fontFamily: "var(--f-mono)", fontSize: 11, color: accent,
                textDecoration: "none", letterSpacing: "0.08em",
              }}>↤ all essays</a>
            </div>
          </aside>
        )}
      </div>

      <div style={{ height: 40 }} />
    </NBPageShell>
  );
}
