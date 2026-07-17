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
import { POSTS, findPost, thumbUrlFor } from "../../data/posts";
import { nbTheme, withAlpha } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  BluedotEssay, BluedotAssumptionsEssay, BluedotVocabularyEssay, BluedotCivilizationEssay, BluedotKillchainEssay,
  ConstraintClusterEssay, DraftEssay, FashionEssay, JayaEssay,
  MayEssay, SixEnginesEssay, ThresholdEssay, TuringEssay, ZXEssay, FisherWaveEssay, essayMeta,
} from "../legacy";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBThumb, NBThumbtack,
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
    case "fisher-wave":           return FisherWaveEssay;
    case "turing-morphogenesis":  return TuringEssay;
    case "bluedot-unit1":         return BluedotEssay;
    case "bluedot-assumptions":   return BluedotAssumptionsEssay;
    case "bluedot-vocabulary":    return BluedotVocabularyEssay;
    case "bluedot-civilization":  return BluedotCivilizationEssay;
    case "bluedot-killchain":     return BluedotKillchainEssay;
    case "zx-calculus":           return ZXEssay;
    default:                      return DraftEssay;
  }
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
// "2026-07-17" → "17 jul 2026"; "2026-07" → "jul 2026". Drives the essay's
// "last updated" stamp from the post's own date instead of a hard-coded one.
function fmtLong(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const mon = MONTHS[parseInt(m, 10) - 1] || "";
  return d ? `${parseInt(d, 10)} ${mon} ${y}` : `${mon} ${y}`;
}
// "2026-07-17" → "jul '26" for the compact meta-JSON block.
function fmtShort(iso?: string) {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  const mon = MONTHS[parseInt(m, 10) - 1] || "";
  return `${mon} '${y.slice(2)}`;
}

// The public footer no longer carries an "edit this page" link; see
// EDITING.md at repo root for where to edit each page.

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
  // The colour values are var(--nb-*) references — fine for CSS and SVG, but
  // canvas drawing can't resolve them, so `mode` + `accentKey` ride along and
  // canvas consumers (TuringEssay) look up literals via nbLiteral(mode).
  const essayPalette = {
    paper: t.paper,
    ink: t.ink,
    muted: t.muted,
    line: t.rule,
    accent,
    mode,
    accentKey,
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
      <NBLastUpdated t={t} label={`ESSAY · ${kicker.toUpperCase()} · NO.${pin}`} date={fmtLong(post.updatedAt || post.publishedAt)} accent={accent} />

      {/* HERO — outer container caps at 1380px so the body grid below
          doesn't sprawl on ultra-wide displays. Centred. The hero itself
          spans this max-width; the H1 + dek still cap typographically. */}
      <div style={{ padding: PAGE_PAD, maxWidth: 1380, margin: "0 auto" }}>
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
            fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.8rem, 7vw, 5.6rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            margin: 0, color: t.ink,
            maxWidth: isMobile ? "100%" : "14ch",
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

      {/* BODY + LEFT-RAIL + RIGHT-RAIL — 3-column layout on desktop.
            Left:   TOC + meta JSON   (sticky)
            Middle: article body      (caps at 62ch for readable line-length)
            Right:  cite + sources    (sticky) + "↤ all essays"
          Outer container caps at 1380px so columns sit close together on
          wide displays (otherwise the 62ch middle leaves big empty gaps
          inside its 1fr cell). Mobile stacks single-column. */}
      <div style={{
        padding: isMobile ? "0 20px" : "0 48px",
        maxWidth: isMobile ? "100%" : 1380,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "220px minmax(0, 1fr) 240px",
        gap: isMobile ? 36 : 36,
        position: "relative",
      }}>
        {/* LEFT RAIL — TOC + meta JSON. Sticky on desktop, scrolls above
            article on mobile. */}
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

              {/* Essay meta JSON = meta-info about the essay → Infra & craft (yellow). */}
              <NBPrompt t={t} cwd={`~/writing/${post.slug}`} cmd="cat .meta" accent={t.yellow} />
              <pre style={{
                background: t.paper2, border: `1px solid ${t.rule}`,
                padding: "10px 12px", borderRadius: 3,
                fontFamily: "var(--f-mono)", fontSize: 10.5, lineHeight: 1.8,
                color: t.softInk, margin: 0, whiteSpace: "pre-wrap",
              }}>{`{
  `}<span style={{ color: t.blue }}>"family"</span>{`:    `}<span style={{ color: t.ochre }}>{`"${post.family || "—"}"`}</span>{`,
  `}<span style={{ color: t.blue }}>"reading"</span>{`:   `}<span style={{ color: t.ochre }}>{`"${post.minutes} min"`}</span>{`,
  `}<span style={{ color: t.blue }}>"sidenotes"</span>{`: `}<span style={{ color: t.ochre }}>{`"${meta.sidenotes || 0}"`}</span>{`,
  `}<span style={{ color: t.blue }}>"updated"</span>{`:   `}<span style={{ color: t.ochre }}>{`"${fmtShort(post.updatedAt || post.publishedAt)}"`}</span>{`
}`}</pre>
            </div>
          </aside>
        )}

        {/* MIDDLE — essay body. Capped at 62ch for readable line-length;
            margin: 0 auto centres it inside the (wider) middle column. */}
        <article style={{
          fontFamily: "var(--f-body)",
          fontSize: isMobile ? "1.08rem" : "1.12rem",
          lineHeight: 1.72,
          color: t.ink,
          maxWidth: "62ch",
          margin: "0 auto",
          width: "100%",
        }}>
          <Body palette={essayPalette} />

          {/* Related — driven by `post.related` slug list in posts.ts. Hidden if empty. */}
          {post.related && post.related.length > 0 && (() => {
            const relatedPosts = post.related
              .map((s: string) => findPost(s))
              .filter((p: any) => p && p.slug !== post.slug);
            if (relatedPosts.length === 0) return null;
            return (
              <section style={{ marginTop: 48, paddingTop: 26, borderTop: `1px solid ${withAlpha(t.muted, "55")}` }}>
                <NBPrompt t={t} cwd={`~/writing/${post.slug}`} cmd="ls ../related/" comment={`${relatedPosts.length} essays`} accent={t.yellow} />
                <h2 className="sr-only">Related essays</h2>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : `repeat(${Math.min(relatedPosts.length, 3)}, 1fr)`,
                  gap: 16,
                  marginTop: 14,
                }}>
                  {relatedPosts.map((rp: any) => {
                    const accent = t[rp.nbAccent || "blue"];
                    return (
                      <a key={rp.slug}
                        href={`/${rp.slug}/`}
                        onClick={(e) => { e.preventDefault(); onNavigate("essay", rp.slug); }}
                        style={{
                          padding: 14, border: `1px solid ${withAlpha(t.muted, "55")}`, background: t.paper2,
                          textDecoration: "none", color: "inherit",
                          display: "flex", flexDirection: "column", gap: 8,
                        }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <NBThumbtack color={accent} ink={t.ink} size={12} />
                          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: accent, letterSpacing: "0.06em" }}>
                            {rp.kicker.replace(/^(Essay|Note)\s*·\s*/i, "").toLowerCase()}
                          </span>
                        </div>
                        <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 18, color: accent, lineHeight: 1.2 }}>
                          {rp.title}
                        </div>
                        <div style={{ fontFamily: "var(--f-body)", fontSize: 13, color: t.softInk, lineHeight: 1.5 }}>
                          {rp.dek}
                        </div>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, marginTop: "auto" }}>
                          {rp.minutes} min · ↗ read
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* Prev / next */}
          {(prev || next) && (
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18,
              marginTop: 48, paddingTop: 26, borderTop: `1px solid ${withAlpha(t.muted, "55")}`,
            }}>
              {prev ? (
                <a href={`/${prev.slug}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", prev.slug); }} style={{
                  padding: 16, border: `1px solid ${withAlpha(t.muted, "55")}`,
                  background: t.paper2, textDecoration: "none", color: "inherit",
                }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, letterSpacing: "0.08em", marginBottom: 4 }}>← PREVIOUS</div>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 18, color: prevAccent, fontStyle: "italic" }}>{prev.title}</div>
                </a>
              ) : <span />}
              {next ? (
                <a href={`/${next.slug}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", next.slug); }} style={{
                  padding: 16, border: `1px solid ${withAlpha(t.muted, "55")}`,
                  background: t.paper2, textAlign: "right" as any, textDecoration: "none", color: "inherit",
                }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: t.muted, letterSpacing: "0.08em", marginBottom: 4 }}>NEXT →</div>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 18, color: nextAccent, fontStyle: "italic" }}>{next.title}</div>
                </a>
              ) : <span />}
            </div>
          )}
        </article>

        {/* RIGHT RAIL — cite block + sources + "↤ all essays". Sticky on
            desktop, scrolls below article on mobile. */}
        {!isMobile && (
          <aside style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: 24 }}>
              {/* CITE — how to reference this essay. */}
              <NBPrompt t={t} cwd={`~/writing/${post.slug}`} cmd="cat .cite" accent={t.yellow} />
              <div style={{
                background: t.paper2, border: `1px solid ${t.rule}`,
                padding: "10px 12px", borderRadius: 3,
                fontFamily: "var(--f-mono)", fontSize: 10.5, lineHeight: 1.7,
                color: t.softInk, marginBottom: 28,
              }}>
                Sharma, S. (2026).<br/>
                <em>{post.title}</em>.<br/>
                <span style={{ color: t.muted }}>shubzsharma.com/{post.slug}</span>
              </div>

              {/* SOURCES — references for this essay. Data in
                  src/lib/essay-meta.ts under sources[slug]. Add new
                  citations there; they show up here automatically. */}
              {meta.sources && meta.sources.length > 0 && (
                <>
                  <NBPrompt t={t} cwd={`~/writing/${post.slug}`} cmd="cat .sources" comment={`${meta.sources.length} refs`} accent={t.yellow} />
                  <div style={{
                    background: t.paper2, border: `1px solid ${t.rule}`,
                    padding: "10px 12px", borderRadius: 3,
                    fontFamily: "var(--f-mono)", fontSize: 10.5, lineHeight: 1.7,
                    color: t.softInk, marginBottom: 28,
                  }}>
                    {meta.sources.map((pair: [string, string], i: number) => (
                      <div key={i} style={{ marginBottom: 6, color: t.ink }}>
                        <span>{pair[0]}</span><em style={{ color: t.softInk }}>{pair[1]}</em>
                      </div>
                    ))}
                  </div>
                </>
              )}

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
