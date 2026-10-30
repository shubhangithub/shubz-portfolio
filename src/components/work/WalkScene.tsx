import { useWorkbenchSound } from "../chrome/WorkbenchSound";
import { NarratorSprite } from "../chrome/NarratorSprite";
import { CatCompanion } from "../chrome/RoboCat";
import { WALK_COPY } from "../../data/notebook";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { WORK_EVENTS_V5, ganttSpan, type WorkEventV5 } from "../../data/work";
import type { NBTheme } from "../../data/palette";

export const evId = (what: string) =>
  "ev-" +
  what
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const cityFor = (event: WorkEventV5) => {
  if (event.location) return event.location;
  if (/^CGPA\b/.test(event.where)) return WALK_COPY.educationResults;
  const source = `${event.where} ${event.what}`;
  return (
    ["Oxford", "London", "Pune", "Bangalore", "Hyderabad"].find((city) =>
      new RegExp(`\\b${city}\\b`, "i").test(source),
    ) || event.where
  );
};

// The landmarks share the same ink, line weight and paper as the notebook.
// No canvas or image fetch is needed; the character is the owner's saved art.
function CityDrawing({ city }: { city: string }) {
  return (
    <svg
      className="walk-city"
      viewBox="0 0 620 300"
      fill="none"
      aria-hidden="true"
    >
      <g className="walk-city-far" stroke="currentColor" strokeWidth="1">
        <path d="M0 260V184h34v-32h26v66h35v-96h20v-21h18v21h15v106h37v-70h25v-22h20v22h24v102h23V174h25v-23h22v23h19v61h35V106h27v-14h16v14h26v117h28v-65h22v-25h17v25h28v83h30V173h20v-26h29v26h20v87h31V198h35v62h40" />
      </g>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        {city === "Pune" && (
          <>
            <path d="M70 260V181h26v-30h20v30h21v-43h19v43h29v-30h21v30h27v79M70 199h163M85 215h133M96 260v-26q13-25 25 0v26M162 260v-26q13-25 25 0v26M89 176v-17m126 17v-17M131 181v-29l15-12 15 12v29" />
            <path d="M310 260V201h105v59M300 201l62-48 63 48M335 260v-36h53v36M350 182v-24m23 24v-24" />
            <path d="M470 260v-91h22v-15h22v15h22v91M481 185h45M481 205h45M481 225h45" />
          </>
        )}
        {city === "Oxford" && (
          <>
            <path d="M204 260v-80h126v80M190 180h154M215 180v-23q-1-37 52-47 53 10 52 47v23M267 110V89m-9 0h18M204 198h126M221 198v62m23-62v62m23-62v62m23-62v62m23-62v62M194 260h146" />
            <path d="M55 260V140l16-18 16 18v120M63 128V72l8-30 8 30v56M46 153h50M455 260V140h65v120M465 140V94l9-35 9 35v46M494 140V89l9-43 9 43v51M445 164h85M471 260v-48q15-26 30 0v48" />
          </>
        )}
        {city === "London" && (
          <>
            <path d="M58 260V153h35v107M52 153l23-24 24 24M63 134V75l12-32 12 32v59M63 177h24M64 214h22" />
            <circle cx="75" cy="178" r="9" />
            <path d="M75 178v-6m0 6h5M170 260l44-190 44 190M205 111v149m20-149v149M390 260l66-93 65 93M456 167v93" />
            <circle cx="456" cy="164" r="73" />
            <g strokeWidth=".7">
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * Math.PI) / 6;
                return (
                  <path
                    key={i}
                    d={`M456 164L${456 + 73 * Math.cos(a)} ${164 + 73 * Math.sin(a)}`}
                  />
                );
              })}
            </g>
          </>
        )}
      </g>
      <path d="M0 261h620M0 273h620" stroke="currentColor" strokeWidth="1" />
      <path
        d="M32 285h52m44 0h52m44 0h52m44 0h52m44 0h52m44 0h52m44 0h52"
        stroke="currentColor"
        strokeWidth=".6"
        opacity=".4"
      />
    </svg>
  );
}

export function WalkScene({
  t,
  onSelectEvent,
  selectedEvent,
}: {
  t: NBTheme;
  selectedEvent?: string | null;
  dark?: boolean;
  isMobile?: boolean;
  onSelectEvent?: (what: string) => void;
}) {
  const sound = useWorkbenchSound();
  const moments = useMemo(
    () =>
      WORK_EVENTS_V5.map((e, sourceIndex) => ({
        event: e,
        time: ganttSpan(e.year, e.ganttFrom).start,
        sourceIndex,
      })).sort((a, b) => a.time - b.time || a.sourceIndex - b.sourceIndex),
    [],
  );
  const defaultIndex = Math.max(0, moments.findIndex(m => m.event.track === "engineering" && m.event.what.endsWith("· Torus")));
  const [index, setIndex] = useState(defaultIndex);
  const [walking, setWalking] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [scrollMode, setScrollMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) {
        setPlaying(false);
        setScrollMode(false);
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const root = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const next = selectedEvent ? moments.findIndex((m) => m.event.what === selectedEvent) : defaultIndex;
    if (next >= 0) {
      setIndex(next);
      setPlaying(false);
      setScrollMode(false);
    }
  }, [selectedEvent, moments, defaultIndex]);
  const moment = moments[index];
  const start = moments[0].time,
    end = moments[moments.length - 1].time;
  const progress = (moment.time - start) / (end - start);
  const city = cityFor(moment.event);
  const years = Array.from(new Set(moments.map((m) => Math.floor(m.time))));
  const select = (next: number) => {
    if (next !== index) sound.play("step");
    setIndex(next);
    setWalking(!reducedMotion);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWalking(false), 650);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!playing || reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= moments.length - 1) {
          setPlaying(false);
          return i;
        }
        setWalking(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setWalking(false), 650);
        return i + 1;
      });
    }, 3600);
    return () => clearInterval(id);
  }, [playing, moments.length, reducedMotion]);
  useEffect(() => {
    if (!scrollMode) return;
    let frame = 0;
    const move = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!root.current) return;
        const r = root.current.getBoundingClientRect();
        const travel = r.height - window.innerHeight + 120;
        const f = Math.max(0, Math.min(1, (120 - r.top) / Math.max(1, travel)));
        setIndex(Math.round(f * (moments.length - 1)));
      });
    };
    window.addEventListener("scroll", move, { passive: true });
    move();
    return () => {
      window.removeEventListener("scroll", move);
      cancelAnimationFrame(frame);
    };
  }, [scrollMode, start, end, moments]);
  const event: WorkEventV5 = moment.event;
  return (
    <section
      ref={root}
      className={`walk-wrapper ${scrollMode ? "walk-scroll-mode" : ""}`}
      aria-label="Interactive career walk"
    >
      <div
        className="walk-frame"
        style={{ "--walk-ink": t[event.cat] } as React.CSSProperties}
      >
        <div className="walk-topline">
          <span className="eyebrow">
            {WALK_COPY.complete} / {index + 1} of {moments.length}
          </span>
          <span>
            {city} <i>·</i> <span className="walk-topline-date">{event.year}</span>
          </span>
        </div>
        <div className="walk-route-picker">
          <label htmlFor="walk-entry">{WALK_COPY.jump}</label>
          <select
            id="walk-entry"
            value={index}
            disabled={scrollMode}
            onChange={(e) => {
              setPlaying(false);
              select(Number(e.target.value));
            }}
          >
            {years.map((year) => (
              <optgroup key={year} label={String(year)}>
                {moments.map((m, i) =>
                  Math.floor(m.time) === year ? (
                    <option key={m.event.what} value={i}>
                      {m.event.ganttFrom ? `${m.event.ganttFrom} → ` : ""}
                      {m.event.year} · {m.event.what}
                    </option>
                  ) : null,
                )}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="walk-route-marks" aria-hidden="true">
          {moments.map((m, i) => (
            <span
              key={m.event.what}
              data-current={i === index || undefined}
              style={{ "--mark-ink": t[m.event.cat] } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="walk-controls">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              select(Math.max(0, index - 1));
            }}
            disabled={index === 0 || scrollMode}
            aria-label="Previous career moment"
          >
            ←
          </button>
          <div className="walk-scale">
            <label className="sr-only" htmlFor="walk-year">
              Move through career entries
            </label>
            <input
              id="walk-year"
              type="range"
              min={0}
              max={moments.length - 1}
              step={1}
              value={index}
              aria-valuetext={`${event.year}: ${event.what}`}
              disabled={scrollMode}
              onChange={(e) => {
                setPlaying(false);
                select(Number(e.target.value));
              }}
            />
            <div className="walk-year-labels">
              <span>{moments[0].event.ganttFrom || moments[0].event.year}</span>
              <span>
                {index + 1} / {moments.length}
              </span>
              <span>{moments[moments.length - 1].event.year}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              select(Math.min(moments.length - 1, index + 1));
            }}
            disabled={index === moments.length - 1 || scrollMode}
            aria-label="Next career moment"
          >
            →
          </button>
        </div>
        <div className="walk-stage">
          <div className="walk-world">
            <div className="walk-city-label" key={city}>
              {city}
              <span>
                the walk / {String(index + 1).padStart(2, "0")} of{" "}
                {moments.length}
              </span>
            </div>
            <CityDrawing city={city} />
            <div
              className="walk-character"
              style={{ left: `${16 + progress * 25}%` }}
            >
              <NarratorSprite walking={walking} walkCycle decorative />
            </div>
            <div
              className="walk-companion"
              style={{ "--walk-progress": progress } as React.CSSProperties}
            >
              <CatCompanion placement="trail" walking={walking} />
            </div>
          </div>
          <article className="walk-moment" key={event.what}>
            <span className="eyebrow" style={{ color: t[event.cat] }}>
              {event.track} · {event.year}
            </span>
            <h2>{event.what}</h2>
            <span className="walk-where">{event.where}</span>
            <p>{event.note}</p>
            <button
              className="text-button"
              onClick={() => onSelectEvent?.(event.what)}
            >
              {WALK_COPY.fullEntry}
            </button>
          </article>
        </div>
        <div className="walk-bottomline">
          <button
            className="text-button"
            disabled={reducedMotion}
            onClick={() => {
              if (!playing && index === moments.length - 1) select(0);
              setPlaying(!playing);
              setScrollMode(false);
            }}
            aria-pressed={playing}
          >
            {playing ? WALK_COPY.pause : WALK_COPY.play} {playing ? "Ⅱ" : "▷"}
          </button>
          <button
            className="text-button"
            disabled={reducedMotion}
            onClick={() => {
              setScrollMode(!scrollMode);
              setPlaying(false);
            }}
            aria-pressed={scrollMode}
          >
            {scrollMode ? WALK_COPY.slider : WALK_COPY.scroll} ↳
          </button>
          <a href="#record" className="text-link">
            {WALK_COPY.skip}
          </a>
        </div>
        <span className="sr-only" aria-live="polite">
          {city}. {event.year}. {event.what}.
        </span>
      </div>
    </section>
  );
}
