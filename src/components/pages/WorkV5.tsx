import { WALK_COPY, CABINET_COPY as CAB } from "../../data/notebook";
import React, { useEffect, useState } from "react";
import {
  NotebookShell,
  PageHero,
  SectionLabel,
  Photo,
  type PageProps,
} from "../chrome/Notebook";
import { nbTheme } from "../../data/palette";
import {
  WORK_EVENTS_V5,
  WORK_PHOTOS,
  CV_PDF,
} from "../../data/work";
import { CONTACT_PHOTO } from "../../data/contact";
import { WalkScene, evId } from "../work/WalkScene";

export function WorkV5({ dark, toggleTheme }: PageProps) {
  const t = nbTheme(dark ? "dark" : "light");
  const [track, setTrack] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    let frame = 0;
    const restore = () => {
      const what = new URLSearchParams(location.search).get("entry");
      if (what && WORK_EVENTS_V5.some((e) => e.what === what)) {
        setTrack("all");
        setOpen(what);
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() =>
            document
              .getElementById(evId(what))
              ?.scrollIntoView({ block: "center", behavior: "instant" }),
          );
        });
      } else setOpen(null);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", restore);
    };
  }, []);
  const photos = [...WORK_PHOTOS, CONTACT_PHOTO];
  const tracks = ["all", "engineering", "research", "study", "outreach"];
  const events = WORK_EVENTS_V5.filter(
    (e) => track === "all" || e.track === track,
  );
  const reveal = (what: string) => {
    setTrack("all");
    setOpen(what);
    const url = new URL(location.href);
    url.searchParams.set("entry", what);
    url.hash = evId(what);
    if (url.href !== location.href)
      history.pushState(null, "", url.pathname + url.search + url.hash);
    requestAnimationFrame(() => {
      const entry = document.getElementById(evId(what));
      entry?.querySelector("summary")?.focus({ preventScroll: true });
      entry?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
    });
  };
  return (
    <NotebookShell
      current="work"
      mode={dark ? "dark" : "light"}
      onToggle={toggleTheme}
    >
      <main id="main" className="folio-main" tabIndex={-1}>
        <PageHero
          n="03"
          label={WALK_COPY.label}
          title={
            <>
              {WALK_COPY.title}
              <br />
              <em>{WALK_COPY.titleEm}</em>
            </>
          }
          aside={
            <a
              href={CV_PDF}
              className="cv-slip"
              target="_blank"
              rel="noreferrer"
            >
              <span className="eyebrow">{WALK_COPY.conventional}</span>
              <span>
                {WALK_COPY.cv} <b>↗</b>
              </span>
              <small>{WALK_COPY.pdf}</small>
            </a>
          }
        >
          <p>{WALK_COPY.lede}</p>
        </PageHero>
        <WalkScene
          t={t}
          dark={dark}
          selectedEvent={open}
          onSelectEvent={reveal}
        />
        <section id="record" className="folio-section career-record">
          <SectionLabel
            n="i"
            title={WALK_COPY.record}
            href="/builds/"
            link={WALK_COPY.projects}
          />
          <div className="topic-filters" aria-label="Filter career entries">
            {tracks.map((s) => (
              <button
                key={s}
                aria-pressed={track === s}
                onClick={() => setTrack(s)}
              >
                {s === "all" ? "All threads" : s}
              </button>
            ))}
          </div>
          <p className="result-count" aria-live="polite">
            {events.length} entries
          </p>
          <div className="career-list">
            {events.map((e) => (
              <details
                key={e.what}
                id={evId(e.what)}
                className={`career-entry ${e.big ? "career-featured" : ""}`}
                open={open === e.what}
                onToggle={(event) => {
                  if (event.currentTarget.open) setOpen(e.what);
                  else
                    setOpen((current) => (current === e.what ? null : current));
                }}
                style={{ "--item-accent": t[e.cat] } as React.CSSProperties}
              >
                <summary>
                  <span className="career-date">{e.year}</span>
                  <span className="career-dot" />
                  <span>
                    <strong>{e.what}</strong>
                    <small>{e.where}</small>
                    {e.big && <span className="career-lead">{e.note.split(/(?<=[.!?])\s/)[0]}</span>}
                  </span>
                  <span className="career-track">{e.track}</span>
                  <span className="career-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{e.note}</p>

              </details>
            ))}
          </div>
        </section>
        <section className="folio-section contact-sheet-section">
          <SectionLabel n="ii" title={CAB.photographs} />
          <p className="collection-guidance">{CAB.photoHint}</p>
          <div className="photo-contact-sheet">
            {photos.map((p, i) => (
              <div className="contact-sheet-frame" key={p.src}>
                <div className="frame-registration">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.cat === "teal" ? "GEOSPATIAL" : "OUTREACH"}</span>
                  <span>↗</span>
                </div>
                <Photo {...p} tilt={0} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </NotebookShell>
  );
}
