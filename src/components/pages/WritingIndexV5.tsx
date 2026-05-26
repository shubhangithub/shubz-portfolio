// @ts-nocheck
/* eslint-disable */
/**
 * WritingIndexV5 — Port of design_handoff/writing-page.jsx.
 *
 * Filter chips by tag → featured pick (top essay) → all-essays list with
 * tilted polaroid thumbs → working-notes terminal table. Right rail: topics
 * count, colour-key explainer, drafts pre block.
 *
 * Data: POSTS (src/data/posts.ts) drives essays. Working notes are inlined
 * (net-new V5 content; no existing data source). Filtering is local state.
 */
import React from "react";
import { POSTS, thumbUrlFor } from "../../data/posts";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBThumbtack, NBThumb,
  NBMarginalia, NBDiagramPlaceholder,
} from "../chrome/NB";

type NavFn = (page: string, slug?: string | null) => void;

const WORKING_NOTES = [
  { t: "AI Safety Fundamentals",                            d: "2023-05", k: "note" },
  { t: "GNSS Water-Vapour estimation (BSc honours, FLAME)", d: "2023-05", k: "thesis note" },
  { t: "Feynman's path integral: propagators and pictures", d: "2025-08", k: "note" },
];

const DRAFTS = [
  "zx-calculus-ii.draft.mdx",
  "geospatial-vs-temporal.draft.mdx",
];

export function WritingIndexV5({
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

  // Decorate posts with theme-resolved accent + shortened kicker for chips.
  const essays = POSTS.map((p, i) => {
    const accentKey = p.nbAccent || "blue";
    const c = t[accentKey];
    const kicker = (p.kicker || "").replace(/^(Essay|Note)\s*·\s*/i, "").toLowerCase();
    return { ...p, c, kicker, pin: String(i + 1).padStart(2, "0") };
  });

  const tags = ["all", ...Array.from(new Set(essays.map((e) => e.kicker)))];
  const [active, setActive] = React.useState<string>("all");
  const visible = active === "all" ? essays : essays.filter((e) => e.kicker === active);
  const featured = essays[0];
  const rest = visible.filter((e) => e.slug !== featured.slug);

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t} mode={mode} current="writing"
      label="shubz — ~/writing — vim"
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label="WRITING · THE GARDEN" date="26 may 2026" accent={t.yellow} />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            {/* Writing index header → Infra & craft (yellow, essay craft). */}
            <NBPrompt t={t} cwd="~/writing" cmd="cat ./README.md" comment="essays · notes · half-formed ideas" accent={t.yellow} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "18ch",
            }}>
              {/* V5 canonical: writing is essay-craft → Infra & craft (yellow). */}
              An essay <em style={{ color: t.yellow, fontStyle: "italic" }}>garden</em>, growing{" "}
              <em style={{ color: t.yellow, fontStyle: "italic" }}>slowly</em>.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              Long-form thinking on the projects I actually built. Each essay carries its own colour — pulled from the subject it argues with. Some pieces are finished; some are still arguing with themselves.
            </p>
            {!isMobile && (
              /* Marginalia about diagram-craft → Infrastructure & craft (yellow). */
              <NBMarginalia t={t} top={120} tilt={-2.4} accent={t.yellow}>
                every essay has<br/>a hand-coded<br/>diagram. no D3.
              </NBMarginalia>
            )}
          </div>

          {/* Filter strip */}
          <div style={{ marginBottom: 26 }}>
            {/* Filter chips section → Infra & craft (yellow, organizing essays). */}
            <NBPrompt t={t} cmd={`grep -l '${active}' *.mdx`} comment={`${visible.length} of ${essays.length}`} accent={t.yellow} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.map((tag) => {
                const isActive = tag === active;
                return (
                  <button
                    key={tag}
                    onClick={() => setActive(tag)}
                    style={{
                      all: "unset", cursor: "pointer",
                      padding: "5px 12px",
                      border: `1px solid ${isActive ? t.prompt : t.muted}66`,
                      color: isActive ? t.prompt : t.muted,
                      background: isActive ? `${t.prompt}10` : "transparent",
                      fontFamily: "var(--f-mono)", fontSize: 11,
                      letterSpacing: "0.04em", borderRadius: 2,
                    }}
                  >
                    {tag}{isActive && " ●"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured */}
          {(active === "all" || active === featured.kicker) && (
            <div style={{ marginBottom: 44 }}>
              <NBPromptHead t={t} n="§02" command="cat ./featured.md" comment={featured.slug} title="Featured" accent={featured.c} level={22} />
              <a href={`/${featured.slug}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", featured.slug); }} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr",
                gap: 0,
                background: t.paper2,
                border: `2px solid ${t.ink}`,
                position: "relative",
                minHeight: 280,
                textDecoration: "none",
                color: "inherit",
              }}>
                <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
                  <div>
                    <NBThumbtack color={featured.c} ink={t.ink} size={16} />
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: featured.c, letterSpacing: "0.04em" }}>
                      no.{featured.pin} · {featured.kicker}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--f-display)", fontVariationSettings: '"opsz" 144, "SOFT" 50', fontWeight: 400, fontSize: isMobile ? 30 : 42, color: featured.c, lineHeight: 1.05, margin: 0, maxWidth: "16ch" }}>
                      {featured.title}
                    </h3>
                    <p style={{ fontFamily: "var(--f-body)", fontStyle: "italic", color: t.softInk, fontSize: 16, marginTop: 14, maxWidth: "44ch", lineHeight: 1.5 }}>
                      {featured.dek}
                    </p>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, marginTop: 16, display: "flex", gap: 18 }}>
                      <span>{featured.minutes} min read</span>
                      <span style={{ color: featured.c }}>↗ read</span>
                    </div>
                  </div>
                </div>
                {!isMobile && (
                  thumbUrlFor(featured.slug) ? (
                    <div style={{
                      position: "relative",
                      overflow: "hidden",
                      borderLeft: `1px solid ${featured.c}55`,
                    }}>
                      <img
                        src={thumbUrlFor(featured.slug)}
                        alt={featured.title}
                        style={{
                          width: "100%", height: "100%",
                          objectFit: "cover", display: "block",
                        }}
                      />
                    </div>
                  ) : (
                    <NBDiagramPlaceholder t={t} accent={featured.c} h={"100%"} label={featured.kicker} />
                  )
                )}
              </a>
            </div>
          )}

          {/* All essays */}
          {/* §03 All essays listing → Infra & craft (yellow). */}
          <NBPromptHead t={t} n="§03" command="ls ./essays/" title="All essays" accent={t.yellow} level={22} comment={`${visible.length} listed`} />
          <ol style={{ listStyle: "none", padding: 0, margin: "0 0 44px" }}>
            {rest.map((e, i, arr) => (
              <li key={e.slug} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "auto 1fr auto" : "auto 1fr auto auto",
                gap: isMobile ? 14 : 22,
                alignItems: "center",
                padding: "20px 0",
                borderBottom: i === arr.length - 1 ? "none" : `1px dashed ${t.muted}66`,
              }}>
                <NBThumbtack color={e.c} ink={t.ink} size={16} />
                <a href={`/${e.slug}/`} onClick={(ev) => { ev.preventDefault(); onNavigate("essay", e.slug); }} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <span style={{ fontFamily: "var(--f-display)", fontSize: isMobile ? 20 : 26, color: e.c, fontVariationSettings: '"opsz" 144, "SOFT" 50', lineHeight: 1.1, display: "block" }}>{e.title}</span>
                  <span style={{ display: "block", fontFamily: "var(--f-body)", fontStyle: "italic", color: t.softInk, fontSize: 14, marginTop: 4, maxWidth: "52ch", lineHeight: 1.5 }}>
                    {e.dek}
                  </span>
                  <span style={{ display: "block", fontFamily: "var(--f-mono)", color: t.muted, fontSize: 11, marginTop: 6 }}>
                    no.{e.pin} · {e.kicker} · {e.minutes}m
                  </span>
                </a>
                {!isMobile && (
                  <NBThumb t={t} accent={e.c} label={e.kicker.split(/[\s&]+/)[0]} tilt={i % 2 === 0 ? -1.8 : 2} w={110} h={82} src={thumbUrlFor(e.slug)} />
                )}
                <a href={`/${e.slug}/`} onClick={(ev) => { ev.preventDefault(); onNavigate("essay", e.slug); }} style={{ fontFamily: "var(--f-mono)", color: e.c, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}>↗ read</a>
              </li>
            ))}
          </ol>

          {/* Working notes */}
          <NBPromptHead t={t} n="§04" command="ls -la ./notes/" comment="working · private until linked" title="Working notes" accent={t.muted} level={22} />
          <div style={{
            border: `1px solid ${t.rule}`,
            background: t.paper2,
            padding: "12px 14px",
            fontFamily: "var(--f-mono)",
            fontSize: 12, lineHeight: 1.8,
            marginBottom: 60,
          }}>
            {WORKING_NOTES.map((n, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "24px 1fr auto" : "32px 1fr 100px 90px",
                gap: 12,
                padding: "4px 0",
                borderBottom: i === WORKING_NOTES.length - 1 ? "none" : `1px dashed ${t.muted}33`,
                color: t.ink,
              }}>
                <span style={{ color: t.muted }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 14, color: t.softInk }}>{n.t}</span>
                {!isMobile && <span style={{ color: t.muted }}>{n.d}</span>}
                <span style={{ color: t.ochre, textAlign: "right" }}>↗ {n.k}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Right rail */}
        <aside>
          {/* Topic counts in right rail = meta-summary → Infra & craft (yellow). */}
          <NBPrompt t={t} cwd="~/writing" cmd="cat .topics" comment="counts" accent={t.yellow} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 12,
          }}>
            {tags.filter((tag) => tag !== "all").map((tag) => {
              const count = essays.filter((e) => e.kicker === tag).length;
              const ess = essays.find((e) => e.kicker === tag);
              const isActive = tag === active;
              return (
                <div key={tag} onClick={() => setActive(tag)} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "5px 0", borderBottom: `1px dashed ${t.muted}33`,
                  color: isActive ? ess!.c : t.softInk, cursor: "pointer",
                }}>
                  <span><span style={{ color: ess!.c, marginRight: 6 }}>■</span>{tag}</span>
                  <span style={{ color: t.muted }}>{count}</span>
                </div>
              );
            })}
          </div>

          <NBPrompt t={t} cwd="~/writing" cmd="ls -la *.draft.mdx" comment="in progress" accent={t.red} />
          <pre style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "12px 14px",
            fontFamily: "var(--f-mono)", fontSize: 11, lineHeight: 1.7,
            color: t.softInk, borderRadius: 3, margin: 0,
            whiteSpace: "pre-wrap",
          }}>
            <span style={{ color: t.muted }}>{DRAFTS.length} drafts</span>{"\n"}
            {DRAFTS.map((d, i) => (
              <span key={i}>
                <span style={{ color: t.prompt }}>-rw-</span> {d}{"\n"}
              </span>
            ))}
          </pre>
        </aside>
      </div>
    </NBPageShell>
  );
}
