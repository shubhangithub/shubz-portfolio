import { PixelStation } from "../chrome/RoboCat";
import { ClipButton } from "../chrome/Paperclips";
import { essayClipId } from "../../data/paperclips";
import {
  WRITING_COPY,
  FILTER_COPY,
  PENS,
} from "../../data/notebook";
import { WRITING_DESK_COPY as COPY } from "../../data/writingDesk";
import React, { useEffect, useState, useRef } from "react";
import {
  NotebookShell,
  SectionLabel,
  type PageProps,
} from "../chrome/Notebook";
import { VISIBLE_POSTS, thumbUrlFor } from "../../data/posts";
import { nbTheme } from "../../data/palette";
import { useWorkbenchSound } from "../chrome/WorkbenchSound";
import { FeaturedEssay } from "../essay/FeaturedEssay";
import "../../styles/writing-light-table.css";

const essays = VISIBLE_POSTS.filter((p) => !p.draft);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-06-07" → "Jun 2026", for the list meta. */
function formatMonth(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1] ?? m} ${y}`;
}
function ReadingDesk({ t }: { t: ReturnType<typeof nbTheme> }) {
  const workspace = useRef<HTMLDivElement>(null);
  const [trace, setTrace] = useState("");
  const [mobile,setMobile]=useState(false),[previewOpen,setPreviewOpen]=useState(false);
  useEffect(()=>{const media=matchMedia('(max-width:760px)');const update=()=>setMobile(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  const search = useRef<HTMLInputElement>(null),
    preview = useRef<HTMLElement>(null);
  const [query, setQuery] = useState(""),
    [topic, setTopic] = useState("all"),
    [selected, setSelected] = useState(essays[0]?.slug || "");
  const sound = useWorkbenchSound();
  useEffect(()=>{const restore=()=>setPreviewOpen(new URLSearchParams(location.search).has('essay'));restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);},[]);
  const visible = essays.filter(
    (p) =>
      (topic === "all" || p.nbAccent === topic) &&
      `${p.title} ${p.dek} ${p.kicker}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const active = visible.find((p) => p.slug === selected) || visible[0];
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(location.search),
        slug = params.get("essay"),
        cat = params.get("topic");
      setSelected(
        slug && essays.some((p) => p.slug === slug)
          ? slug
          : essays[0]?.slug || "",
      );
      if (cat && PENS.some((p) => p.key === cat)) setTopic(cat);
      else setTopic("all");
      setQuery(params.get("q") || "");
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    const root = workspace.current;
    if (!root || !active) { setTrace(""); return; }
    const measure = () => {
      const source = root.querySelector<HTMLElement>('[data-selected="true"]');
      const target = preview.current;
      if (!source || !target || innerWidth <= 760) { setTrace(""); return; }
      const r = root.getBoundingClientRect(), a = source.getBoundingClientRect(), b = target.getBoundingClientRect();
      const x = a.right-r.left, y = a.top+a.height/2-r.top;
      const end = b.left-r.left, endY = b.top+36-r.top;
      const bend = end-17;
      setTrace(`M ${x} ${y} H ${bend} V ${endY} H ${end}`);
    };
    let frame = 0;
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure(); }); };
    const observer = new ResizeObserver(schedule); observer.observe(root);
    if (preview.current) observer.observe(preview.current);
    measure(); window.addEventListener('resize', schedule); window.addEventListener('scroll', schedule, { passive: true });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule); };
  }, [active?.slug, visible.length]);
  const updateURL = (slug: string, cat = topic, q = query) => {
    const url = new URL(location.href);
    url.searchParams.delete("draft");
    url.searchParams.set("essay", slug);
    if (cat === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", cat);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    history.pushState(null, "", url.pathname + url.search);
  };
  const choose = (slug: string, move = false) => {
    setSelected(slug);
    updateURL(slug);
    sound.play("pen");
    if (move && matchMedia("(max-width:760px)").matches)
      requestAnimationFrame(() => {
        preview.current?.focus({ preventScroll: true });
        preview.current?.scrollIntoView({
          block: "start",
          behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
            ? "instant"
            : "smooth",
        });
      });
  };
  const changeTopic = (cat: string) => {
    setTopic(cat);
    updateURL(selected, cat);
  };
  const renderPreview=()=>(active ? (
          <aside
            id="essay-preview"
            className="essay-preview"
            ref={preview}
            tabIndex={-1}
            style={
              {
                "--item-accent": t[active.nbAccent || "blue"],
              } as React.CSSProperties
            }
            aria-label={`${COPY.selected}: ${active.title}`}
          >
            <PixelStation scene="writing"/>
            <div className="preview-registration">
              <span>{COPY.selected}</span>
              <span>
                {String(essays.indexOf(active) + 1).padStart(2, "0")} /{" "}
                {essays.length}
              </span>
            </div>
            <div className="preview-art" key={active.slug}>
              {thumbUrlFor(active.slug) ? (
                <img src={thumbUrlFor(active.slug)} alt="" />
              ) : (
                <span aria-hidden="true">
                  §{String(essays.indexOf(active) + 1).padStart(2, "0")}
                </span>
              )}
              <i className="preview-corner" aria-hidden="true" />
            </div>
            <div className="preview-text">
              <span className="eyebrow">
                {active.kicker} · {active.minutes} min read
              </span>
              <h3>{active.title}</h3>
              <p>{active.dek}</p>
              <div className="preview-actions">
                <a href={`/${active.slug}/`}>{COPY.read} ↗</a>
                <ClipButton id={essayClipId(active.slug)} />
                <button
                  className="preview-return"
                  type="button"
                  onClick={() => {
                    setPreviewOpen(false);
                    const url = new URL(location.href);
                    url.searchParams.delete("essay");
                    history.pushState(null, "", url.pathname + url.search);
                    const button = document.querySelector<HTMLButtonElement>(
                      `[data-essay-preview="${active.slug}"]`,
                    );
                    button?.focus({ preventScroll: true });
                    button?.scrollIntoView({
                      block: "center",
                      behavior: matchMedia("(prefers-reduced-motion:reduce)")
                        .matches
                        ? "instant"
                        : "smooth",
                    });
                  }}
                >
                  {COPY.back} ↑
                </button>
              </div>
            </div>
          </aside>
        ) : (
          <p className="empty-drawer">{COPY.empty}</p>
        ));
  return (
    <section className="writing-index folio-section writing-light-table">
      <SectionLabel
        n="i"
        title={COPY.title}
        href="/rss.xml"
        link={WRITING_COPY.subscribe}
      />
      <div className="catalogue-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            ref={search}
            type="search"
            aria-label="Search essays"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              const url = new URL(location.href);
              if (value) url.searchParams.set("q", value);
              else url.searchParams.delete("q");
              history.replaceState(null, "", url.pathname + url.search);
            }}
            placeholder={WRITING_COPY.search}
          />
        </label>
        <span className="result-count" aria-live="polite">
          {visible.length} of {essays.length} essays
        </span>
        {(query || topic !== "all") && (
          <button
            className="filter-reset"
            onClick={() => {
              setQuery("");
              setTopic("all");
              updateURL(selected, "all", "");
              search.current?.focus();
            }}
          >
            {FILTER_COPY.reset} ×
          </button>
        )}
      </div>
      <div className="topic-filters">
        <button
          onClick={() => changeTopic("all")}
          aria-pressed={topic === "all"}
        >
          {WRITING_COPY.all}
        </button>
        {PENS.filter((p) => essays.some((e) => e.nbAccent === p.key)).map(
          (p) => (
            <button
              key={p.key}
              style={{ "--item-accent": t[p.key] } as React.CSSProperties}
              onClick={() => changeTopic(p.key)}
              aria-pressed={topic === p.key}
            >
              {p.label}
            </button>
          ),
        )}
      </div>
      <div className="reading-desk-workspace" ref={workspace} style={{'--active-ink': t[active?.nbAccent || 'blue']} as React.CSSProperties}>
        <svg className="essay-connection" aria-hidden="true"><path d={trace}/></svg>
        <ol className="essay-contact-sheet" aria-label={COPY.choose}>
          {visible.map((p, i) => (
            <li
              key={p.slug}
              className="essay-proof"
              data-series={p.series && visible[i - 1]?.series !== p.series ? `${p.series} · ${visible.filter((v) => v.series === p.series).length}` : undefined}
              data-selected={active?.slug === p.slug && (!mobile || previewOpen)}
              style={
                {
                  "--item-accent": t[p.nbAccent || "blue"],
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                className="essay-proof-image"
                data-essay-preview={p.slug}
                aria-label={`${COPY.preview}: ${p.title}`}
                aria-pressed={active?.slug === p.slug && (!mobile || previewOpen)}
                aria-controls={!mobile || previewOpen ? "essay-preview" : undefined}
                onClick={() => {setPreviewOpen(true);choose(p.slug, true);}}
              >
                {thumbUrlFor(p.slug) ? (
                  <img src={thumbUrlFor(p.slug)} alt="" loading="lazy" />
                ) : (
                  <span className="essay-proof-placeholder" aria-hidden="true">
                    §{String(essays.indexOf(p) + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="proof-index">
                  {String(essays.indexOf(p) + 1).padStart(2, "0")}
                </span>
                <span className="proof-preview-mark" aria-hidden="true">
                  ⌕
                </span>
              </button>
              <a className="essay-proof-title" href={`/${p.slug}/`}>
                {p.title}
                <span aria-hidden="true">↗</span>
              </a>
              <p className="essay-proof-dek">{p.dek}</p>
              <div className="essay-proof-meta">
                <span>{PENS.find((pen) => pen.key === p.nbAccent)?.label}</span>
                {p.publishedAt && <time dateTime={p.publishedAt}>{formatMonth(p.publishedAt)}</time>}
                <span>{p.minutes} min</span>
              </div>
              {mobile && previewOpen && active?.slug===p.slug && renderPreview()}
            </li>
          ))}
        </ol>
        {!mobile && renderPreview()}
        {mobile && !active && <p className="empty-drawer">{COPY.empty}</p>}
      </div>
    </section>
  );
}
export function WritingIndexV5({ dark, toggleTheme }: PageProps) {
  const t = nbTheme(dark ? "dark" : "light");
  return (
    <NotebookShell
      current="writing"
      mode={dark ? "dark" : "light"}
      onToggle={toggleTheme}
    >
      <main id="main" className="folio-main editorial-lightroom" tabIndex={-1}>
        <FeaturedEssay dark={dark} />
        <ReadingDesk t={t} />
      </main>
    </NotebookShell>
  );
}
