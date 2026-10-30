import { JournalReel } from "../journal/JournalReel";
import { NowArtifact } from "../objects/NowArtifact";
import {
  STUDIO_COPY as STUDIO,
} from "../../data/fieldKit";
import "../../styles/field-studio.css";
import {
  JOURNAL_COPY,
  PAGE_JUMPS,
  EDITORIAL_COPY as COPY,
} from "../../data/notebook";
import React, { useEffect, useState } from "react";
import {
  NotebookShell,
  PageHero,
  SectionLabel,
  Spans,
  type PageProps,
} from "../chrome/Notebook";
import { nbTheme } from "../../data/palette";
import {
  NOW_HERO_LINES,
  NOW_LEDE_PREFIX,
  NOW_LEDE_LINK_TEXT,
  NOW_LEDE_LINK_URL,
  NOW_LEDE_SUFFIX,
  NOW_LAST_UPDATED_DATE,
  JOURNAL_ENTRIES,
  CONDITIONS,
} from "../../data/now";

const years = Array.from(
  new Set(JOURNAL_ENTRIES.map((e) => e.date.slice(0, 4))),
);
export function NowV5({ dark, toggleTheme }: PageProps) {
  const t = nbTheme(dark ? "dark" : "light");
  const [selected, setSelected] = useState<number[]>([]);

  const moveTo = (id: string, focus = false) => {
    const target = document.getElementById(id);
    if (focus) target?.focus({ preventScroll: true });
    target?.scrollIntoView({
      block: "start",
      behavior:
        focus && !matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "smooth"
          : "instant",
    });
  };
  useEffect(() => {
    let frame = 0;
    const restore = (event?: Event) => {
      cancelAnimationFrame(frame);
      const params = new URLSearchParams(location.search);
      const raw = params.get("entry"),
        entry = raw !== null && /^\d+$/.test(raw) ? Number(raw) : -1;
      const page = Number(params.get("page")),
        year = params.get("year");
      let target = "";
      if (entry >= 0 && entry < JOURNAL_ENTRIES.length) {
        setSelected([entry]);
        target = `journal-entry-${entry}`;
      } else if (
        Number.isInteger(page) &&
        page >= 1 &&
        page <= Math.ceil(JOURNAL_ENTRIES.length / 2)
      ) {
        const first = (page - 1) * 2;
        setSelected(
          [first, first + 1].filter((i) => i < JOURNAL_ENTRIES.length),
        );
        target = `journal-entry-${first}`;
      } else if (year && years.includes(year)) {
        setSelected([JOURNAL_ENTRIES.findIndex(e => e.date.startsWith(year))]);
        target = `journal-year-${year}`;
      } else {
        setSelected([]);
        try {
          const hash = decodeURIComponent(location.hash.slice(1));
          if (PAGE_JUMPS.now.some((j) => j.href === `#${hash}`)) target = hash;
        } catch {}
      }
      if (target)
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            moveTo(target);
            if (event)
              document.getElementById(target)?.focus({ preventScroll: true });
          });
        });
    };
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", restore);
      window.removeEventListener("hashchange", restore);
    };
  }, []);
  const choose = (kind: "entry" | "year", value: string) => {
    const url = new URL(location.href);
    ["entry", "page", "year"].forEach((k) => url.searchParams.delete(k));
    url.searchParams.set(kind, value);
    const id =
      kind === "entry" ? `journal-entry-${value}` : `journal-year-${value}`;
    url.hash = id;
    history.pushState(null, "", url.pathname + url.search + url.hash);
    setSelected([kind === "entry" ? Number(value) : JOURNAL_ENTRIES.findIndex(e => e.date.startsWith(value))]);
    requestAnimationFrame(() => moveTo(id, true));
  };
  const jumpSection = (hash: string) => {
    const url = new URL(location.href);
    ["entry", "page", "year"].forEach((k) => url.searchParams.delete(k));
    url.hash = hash;
    if (url.href !== location.href)
      history.pushState(null, "", url.pathname + url.search + url.hash);
    setSelected([]);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    requestAnimationFrame(() => moveTo(hash.slice(1), true));
  };
  return (
    <NotebookShell
      current="now"
      mode={dark ? "dark" : "light"}
      onToggle={toggleTheme}
    >
      <main
        id="main"
        className="folio-main journal-studio illustrated-studio"
        tabIndex={-1}
      >
        <PageHero
          n="02"
          label={JOURNAL_COPY.label}
          title={
            <>
              {NOW_HERO_LINES.map((l, i) => (
                <React.Fragment key={i}>
                  <Spans value={l} t={t} />
                </React.Fragment>
              ))}
            </>
          }
          aside={
            <div className="date-stamp now-ink-stamp">
              <span>LAST WRITTEN</span>
              <strong>{NOW_LAST_UPDATED_DATE}</strong>
              <small>London / field journal</small>
            </div>
          }
        >
          <p>
            {NOW_LEDE_PREFIX}
            <a href={NOW_LEDE_LINK_URL}>{NOW_LEDE_LINK_TEXT}</a>
            {NOW_LEDE_SUFFIX}
          </p>
        </PageHero>
        <nav className="page-jumps" aria-label="On this page">
          {PAGE_JUMPS.now.map((j) => (
            <a
              key={j.href}
              href={j.href}
              onClick={(e) => {
                e.preventDefault();
                jumpSection(j.href);
              }}
            >
              {j.label} ↓
            </a>
          ))}
        </nav>
        <div className="now-continuum">
        <section
          id="current-work"
          tabIndex={-1}
          className="current-desk current-combined"
          aria-labelledby="current-desk-title"
        >
          <NowArtifact t={t} />
          <aside className="desk-conditions">
            <svg
              className="tea-study"
              viewBox="0 0 280 210"
              fill="none"
              aria-hidden="true"
            >
              <ellipse
                cx="130"
                cy="170"
                rx="100"
                ry="17"
                stroke="currentColor"
              />
              <path
                d="M58 84h142l-12 65q-9 31-59 31t-59-31L58 84ZM199 94h18c44 0 33 54-28 50M87 69c-20-20 25-26 5-48m38 48c-21-25 25-31 5-56m38 56c-17-16 23-25 7-43"
                stroke="currentColor"
                strokeWidth="2"
              />
              <ellipse cx="129" cy="85" rx="71" ry="12" stroke="currentColor" />
              <path d="m37 193 207-7" stroke="currentColor" strokeWidth="2" />
              <path d="M167 89v35l18 8v28h-31v-28l13-8" stroke="currentColor" />
              <text
                x="170"
                y="151"
                textAnchor="middle"
                fill="currentColor"
                stroke="none"
                fontSize="12"
              >
                S
              </text>
            </svg>
            <span className="eyebrow">{STUDIO.margin}</span>
            <dl className="conditions-grid">
              {CONDITIONS.filter(c => c.k !== "Reading").map((c) => (
                <div key={c.k}>
                  <dt>{c.k}</dt>
                  <dd style={{ color: t[c.family] }}>
                    {c.v}
                    <small>{c.sub}</small>
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>
        <section
          id="journal-notes"
          tabIndex={-1}
          className="journal-archive folio-section"
          aria-labelledby="journal-archive-title"
        >
          <SectionLabel n="ii" title={STUDIO.journal} />
          <h2 id="journal-archive-title" className="sr-only">{COPY.archive}</h2>
          <JournalReel t={t} selected={selected} onChoose={choose}/>
        </section>
        </div>
      </main>
    </NotebookShell>
  );
}
