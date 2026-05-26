// @ts-nocheck
/* eslint-disable */
/**
 * HomeV5 — Field-notebook home. Port of design_handoff/home-notebook.jsx.
 *
 * Layout: mac-chrome shell → last-updated stamp → main+aside grid.
 *   main:  hero (multi-coloured H1 + bio + marginalia) → §02 pinned writing
 *          → §03 builds → §04 toolbox chip grid
 *   aside: cat .now mini-term → Lotka figure → contact slip
 *
 * Content: pinned-writing list reads from src/data/posts.ts (first 3).
 *   Toolbox + builds are inlined here (net-new content per V5 spec; not in
 *   existing /data). NB_NOW_LOG sources from src/data/now.ts (JOURNAL).
 *
 * Reversibility: this file is additive. AppShell still has HomeV4 wired
 *   and can flip back with a one-line edit.
 */
import React from "react";
import { POSTS } from "../../data/posts";
import { nbTheme, NB_LIGHT, NB_DARK } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBThumbtack, NBThumb, NBMarginalia,
  NBMiniTerm,
} from "../chrome/NB";
import { NotebookLotka } from "../diagrams/NotebookLotka";

type NavFn = (page: string, slug?: string | null) => void;

const HOME_BUILDS = [
  { name: "fashion-web",         c: "ochre",  blurb: "ML trend intelligence + LMSR exchange.",                year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
  { name: "taylor-rec-engine",   c: "purple", blurb: "Six recommendation engines on one songbook.",           year: "2026",   url: "https://shubz-taylor-recommendation-engine.vercel.app" },
  { name: "platypus-learn",      c: "blue",   blurb: "AI learning platform — PDFs and YouTube → courses.",   year: "2025 —", url: "https://platypus-learn.vercel.app" },
];

// Toolbox v2 — category-driven colour. Each group has a `primary` accent
// key; every chip in that group shares it for the left border. Each link
// has a real href (essay route, project URL, GitHub repo, or CV PDF as
// fallback for CV-only entries). When the href is an essay path, the link
// text picks up that essay's accent — chip carries provenance without
// scrambling the visual grouping.
//
// Skills sourced from final_CV.pdf plus Orion stack from existing prose.
// Home version is curated — top picks per category; the full taxonomy
// lives on /work.
const CV_PDF = "/uploads/Shubhangi-Sharma-Resume-20260211.pdf";

type ChipLink = { label: string; href: string };
type ToolGroup = { group: string; primary: string; items: { name: string; links: ChipLink[] }[] };

const HOME_TOOLBOX: ToolGroup[] = [
  { group: "Languages", primary: "blue", items: [
    { name: "Python",     links: [{ label: "jaya", href: "/jaya/" }, { label: "six engines", href: "/six-engines/" }] },
    { name: "TypeScript", links: [{ label: "this site", href: "https://github.com/shubhangithub/personal-site" }, { label: "fashion-web", href: "https://fashion-web-psi.vercel.app" }] },
    { name: "Rust · Golang", links: [{ label: "orion · /work", href: "/work/" }] },
    { name: "R",          links: [{ label: "taylor rec (original) · CV", href: CV_PDF }] },
  ] },
  { group: "Tools", primary: "teal", items: [
    { name: "Astro · React islands",       links: [{ label: "this site repo", href: "https://github.com/shubhangithub/personal-site" }] },
    { name: "Next.js · Supabase · Resend", links: [{ label: "platypus-learn", href: "https://platypus-learn.vercel.app" }] },
    { name: "AWS · EC2 · S3",              links: [{ label: "jobsforher backend · CV", href: CV_PDF }] },
    { name: "ETL · data pipelines",        links: [{ label: "orion · /work", href: "/work/" }] },
  ] },
  { group: "Libraries", primary: "orange", items: [
    { name: "NumPy · SciPy · Pandas", links: [{ label: "jaya", href: "/jaya/" }] },
    { name: "PyTorch · scikit-learn", links: [{ label: "positive by how much", href: "/threshold-gate/" }] },
    { name: "SpaCy · NLTK · Gensim",  links: [{ label: "merger NLP · CV", href: CV_PDF }] },
    { name: "statsmodels · Holt-Winters", links: [{ label: "fashion-web composite", href: "https://fashion-web-psi.vercel.app" }] },
  ] },
  { group: "ML / Data", primary: "purple", items: [
    { name: "Anomaly detection · H3",       links: [{ label: "orion · /work", href: "/work/" }] },
    { name: "Recommendation systems",       links: [{ label: "six engines", href: "/six-engines/" }] },
    { name: "Time-series · forecasting",    links: [{ label: "fashion-web", href: "https://fashion-web-psi.vercel.app" }] },
    { name: "LMSR markets",                 links: [{ label: "pricing the next scarf", href: "/fashion-trends/" }] },
    { name: "Feature selection (JAYA)",     links: [{ label: "jaya, improved", href: "/jaya/" }] },
  ] },
  { group: "AI / LLM tooling", primary: "yellow", items: [
    { name: "Claude API · Anthropic SDK",        links: [{ label: "platypus-learn · fashion-web redesign", href: "https://platypus-learn.vercel.app" }] },
    { name: "Prompt engineering · few-shot",     links: [{ label: "orion search · /now", href: "/now/" }] },
    { name: "Gemini API (2.5 Flash)",            links: [{ label: "fashion-web outfit photos", href: "https://fashion-web-psi.vercel.app" }] },
    { name: "AI safety / alignment",             links: [{ label: "bluedot AGI cohort · bending the curve", href: "/bluedot-unit1/" }] },
  ] },
  { group: "Physics", primary: "cyan", items: [
    { name: "Quantum Information",        links: [{ label: "two colours and a Hadamard", href: "/zx-calculus/" }] },
    { name: "GNSS atmospheric modelling", links: [{ label: "honours thesis · CV", href: CV_PDF }] },
    { name: "Lotka–Volterra dynamics",    links: [{ label: "predator and prey", href: "/may-2026/" }] },
  ] },
  { group: "Mathematics", primary: "magenta", items: [
    { name: "Computational Game Theory", links: [{ label: "Oxford MFoCS · CV", href: CV_PDF }] },
    { name: "Geometric Deep Learning",   links: [{ label: "Oxford MFoCS · CV", href: CV_PDF }] },
    { name: "Category Theory",           links: [{ label: "Oxford MFoCS · CV", href: CV_PDF }] },
    { name: "Cryptography · number theory", links: [{ label: "cipher program · CV", href: CV_PDF }] },
  ] },
  { group: "Other areas", primary: "ochre", items: [
    { name: "UI / UX",                   links: [{ label: "this site", href: "/" }] },
    { name: "Compiler · VM design",      links: [{ label: "Nand2Tetris · /work", href: "/work/" }] },
    { name: "Bioinformatics",            links: [{ label: "jaya · proteins", href: "/jaya/" }] },
  ] },
  { group: "Soft skills", primary: "prompt", items: [
    { name: "Team leadership",                    links: [{ label: "Dotslash (10+) · Kolhapur · Council · CV", href: CV_PDF }] },
    { name: "Mentoring under-represented kids",   links: [{ label: "Stemmettes · InnovateHer", href: "/work/" }] },
    { name: "Research writing · papers",          links: [{ label: "IEEE Best Paper · INBIX'22 · /work", href: "/work/" }] },
    { name: "DBS-checked (UK)",                   links: [{ label: "cleared for under-18s · /work", href: "/work/" }] },
  ] },
];

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

  // Pin first 3 essays from POSTS (bluedot-unit1, zx-calculus, jaya by default
  // — most-featured, V5 spec ordering). Strip "Essay · " / "Note · " prefix
  // from kicker for the row metadata line.
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
      <NBLastUpdated t={t} label="NOTEBOOK" date="26 may 2026" />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title page */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            <NBPrompt t={t} cwd="~/home" cmd="cat ./about.md" comment="who, what, where" accent={t.prompt} />
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
              Read <em style={{ color: t.prompt, fontStyle: "italic" }}>maths</em> and{" "}
              <em style={{ color: t.blue, fontStyle: "italic" }}>CS</em> at{" "}
              <em style={{ color: t.ochre, fontStyle: "italic" }}>Oxford</em>.<br />
              Currently building{" "}
              <em style={{ color: t.orange, fontStyle: "italic" }}>geospatial ML</em>{" "}at{" "}
              <em style={{ color: t.teal, fontStyle: "italic" }}>Orion</em>, easily{" "}
              <em style={{ color: t.magenta, fontStyle: "italic" }}>distracted</em>{" "}by other problems.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              I'm a founding engineer at <span style={{ color: t.teal, fontStyle: "italic" }}>Orion</span>, where I build geospatial ML that pays attention to <em>where</em> things happen, and how confidently. Before that I read maths (dabbled in some physics) at <span style={{ color: t.ochre, fontStyle: "italic" }}>Oxford</span> and computer science at <span style={{ color: t.ochre, fontStyle: "italic" }}>FLAME</span>. I am also, in inconvenient order: a <span style={{ color: t.teal }}>Thames rower</span> on Sundays, active in <span style={{ color: t.prompt }}>STEM ed outreach</span>, a <span style={{ color: t.purple }}>hobby pianist</span>, a <span style={{ color: t.ochre }}>fashion enthusiast</span>, and very into <span style={{ color: t.magenta }}>interactive diagrams</span>.
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={120} right={-10}>
                first solve it<br />on paper.<br />then in code.
              </NBMarginalia>
            )}
          </div>

          {/* §02 Pinned writing */}
          <NBPrompt t={t} cmd="ls ./writing/pinned/" comment="3 open on the desk" accent={t.blue} />
          <div className="caps" style={{ fontFamily: "var(--f-ui)", color: t.muted, fontSize: 11, marginBottom: 14, letterSpacing: "0.16em", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <span><span style={{ color: t.prompt }}>§02</span>&nbsp;&nbsp;PINNED · FEATURED WRITING</span>
            <a href="/writing/" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} style={{ color: t.blue, fontFamily: "var(--f-mono)", textDecoration: "none" }}>all {POSTS.length} essays →</a>
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
                  <NBThumb t={t} accent={e.c} label={e.kicker.split(/[\s&]+/)[0]} tilt={i % 2 === 0 ? -2 : 2.2} w={130} h={96} />
                )}
                <a href={`/${e.slug}/`} onClick={(ev) => { ev.preventDefault(); onNavigate("essay", e.slug); }} style={{ fontFamily: "var(--f-mono)", color: e.c, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap" }}>↗ read</a>
              </li>
            ))}
          </ol>

          {/* §03 Builds */}
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
            <a href="/work/" onClick={(e) => { e.preventDefault(); onNavigate("work"); }} style={{ fontFamily: "var(--f-mono)", color: t.orange, fontSize: 11, textDecoration: "none", letterSpacing: "0.08em" }}>annotated cv →</a>
          </div>

          {/* §04 Toolbox */}
          <NBPrompt t={t} cmd="cat ./toolbox.md" comment="what built what" accent={t.purple} />
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
                        // Resolve link colour: essay route → essay's accent;
                        // anything else → category primary.
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
          </div>
        </main>

        {/* Right rail */}
        <aside>
          <NBPrompt t={t} cwd="~/home" cmd="cat .now" comment="live · autoplay" accent={t.prompt} />
          <NBMiniTerm t={t} accent={t.blue} />

          {/* Figure — Lotka size adapts so it never overflows narrow phones
              (canvas dims are imperatively set so we compute w/h up-front
              rather than relying on CSS scaling). */}
          <div style={{ marginTop: 28 }}>
            <NBPrompt t={t} cwd="~/figures" cmd="./figures/may.sh" accent={t.teal} />
            <div style={{
              border: `2px solid ${t.ink}`,
              padding: 16,
              background: t.bgCard,
              position: "relative",
              overflow: "hidden",
            }}>
              <NBThumbtack color={t.teal} ink={t.ink} />
              <span style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 16, color: t.ink }}>fig. 01 — predator/prey</span>
              <div style={{ marginTop: 10 }}>
                <NotebookLotka w={isMobile ? 240 : 290} h={isMobile ? 174 : 210} ink={t.ink} accent={t.teal} paper={t.paper} muted={t.muted} />
              </div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span>lotka–volterra · may '26</span>
                <a href="/may-2026/" onClick={(e) => { e.preventDefault(); onNavigate("essay", "may-2026"); }} style={{ color: t.teal, textDecoration: "none" }}>see the math →</a>
              </div>
            </div>
          </div>

          {/* Contact slip */}
          <div style={{
            marginTop: 28,
            padding: "14px 18px",
            border: `2px solid ${t.blue}`,
            borderRadius: 2,
            transform: "rotate(0.5deg)",
            background: t.bgCard,
          }}>
            <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", color: t.blue, fontSize: 18, marginBottom: 6 }}>contact —</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: t.softInk, display: "grid", gap: 4 }}>
              <a href="https://github.com/Shubzthub" target="_blank" rel="noreferrer" style={{ color: t.ink, textDecoration: "none" }}><span style={{ color: t.blue }}>↗</span> github · <span style={{ color: t.muted }}>Shubzthub</span></a>
              <a href="https://www.linkedin.com/in/Shubz-s-sharma/" target="_blank" rel="noreferrer" style={{ color: t.ink, textDecoration: "none" }}><span style={{ color: t.blue }}>↗</span> linkedin · <span style={{ color: t.muted }}>Shubz-s-sharma</span></a>
              <a href="mailto:hello@shubzsharma.com" style={{ color: t.ink, textDecoration: "none" }}><span style={{ color: t.blue }}>↗</span> email · <span style={{ color: t.muted }}>hello@shubzsharma.com</span></a>
              <a href="/contact/" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} style={{ color: t.ink, textDecoration: "none" }}><span style={{ color: t.blue }}>↗</span> /contact</a>
            </div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
