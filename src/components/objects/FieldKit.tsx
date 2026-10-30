import React, { useEffect, useRef, useState } from "react";
import { ABOUTFETCH_ROWS, OFFICE_CONTEXT } from "../../data/home";
import {
  FIELD_OBJECTS,
  FIELD_GROUPS,
  FIELD_KIT_COPY as COPY,
} from "../../data/fieldKit";
import { CABINET_COPY, GUIDE_COPY } from "../../data/notebook";
import type { NBTheme } from "../../data/palette";
import { SectionLabel, Spans } from "../chrome/Notebook";
import { useWorkbenchSound } from "../chrome/WorkbenchSound";
import { FieldObject } from "./FieldObject";
import { OfficeStudy } from "./OfficeStudy";
import "../../styles/office-scene.css";

// Composition coordinates only: objects belong to the desk, shelves and pinboard.
const PLACES: Record<string, number[]> = {
  work: [56, 48, 42],
  research: [72, 64, 29],
  "open-source": [10, 25, 14],
  societies: [10, 44, 12],
  outreach: [10, 65, 15],
  making: [81, 84, 25],
  education: [30, 17, 20],
  away: [30, 37, 21],
};
function OfficeRoom() {
  return (
    <svg
      className="office-architecture"
      viewBox="0 0 760 720"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M16 102L148 18H742V568L628 706H16Z"
        fill="var(--nb-paper2)"
        stroke="var(--nb-rule)"
      />
      <path
        d="M16 102L148 18V532L16 646M148 532H742M16 646L628 706M148 532L628 706M258 532L682 652M390 532L719 608"
        stroke="var(--nb-rule)"
      />
      <g transform="translate(250 0) scale(.62 1)">
      <path
        d="M203 57H689V251H203Z M442 57V251 M203 229H689"
        fill="var(--nb-paper)"
        stroke="var(--nb-control)"
      />
      <g stroke="var(--nb-cyan)" strokeWidth="1.3" opacity=".45">
        <path d="M220 214H425M246 211V158H265V211M249 158V140L256 129L262 140V158M380 211V158H399V211M383 158V140L390 129L397 140V158M265 173H380M265 180H380M265 160Q322 224 380 160M265 200Q322 187 380 200" />
        <path d="M219 236Q253 229 288 236T425 236" />
      </g>
      <g stroke="var(--nb-yellow)" strokeWidth="1.3" opacity=".45">
        <path d="M459 212H675M493 212V133H503V212M631 212V133H641V212M503 145Q567 243 631 145M459 183Q479 176 493 145M641 145Q657 182 675 183M503 163V212M524 183V212M546 195V212M567 201V212M589 195V212M610 183V212M631 163V212" />
        <path d="M459 236Q497 229 535 236T675 236" />
      </g>
      </g>
      <path
        d="M31 123L125 66V438L31 491Z"
        fill="var(--nb-paper)"
        stroke="var(--nb-rule)"
      />
      <path
        d="M176 386L561 355L725 477L300 534L176 416Z"
        fill="var(--nb-paper)"
        stroke="var(--nb-control)"
        strokeWidth="1.5"
      />
      <path
        d="M176 416L300 550L725 493V477M203 444V592M698 497V614M300 550V658"
        stroke="var(--nb-rule)"
        strokeWidth="3"
      />
      <path
        d="M333 520Q368 493 405 520L433 600Q390 630 345 602Z"
        fill="var(--nb-paper2)"
        stroke="var(--nb-rule)"
      />
      <path
        d="M385 614V664M347 682L385 664L424 680M385 664V694"
        stroke="var(--nb-control)"
        strokeWidth="3"
      />
      <path
        d="M175 599H328V612H175M532 610H716V623H532"
        stroke="var(--nb-rule)"
      />
      <path
        d="M625 289V369M610 369H643M625 288L591 273L577 295H611Z"
        stroke="var(--nb-yellow)"
        strokeWidth="2"
      />
      <path
        d="M684 355V410M672 410H697M680 368C653 339 663 325 682 348M687 383C711 359 721 376 695 395"
        stroke="var(--nb-prompt)"
        strokeWidth="2"
      />
      <path
        d="M26 112H40M33 105V119M718 555H732M725 548V562"
        stroke="var(--nb-cyan)"
      />
    </svg>
  );
}
export function FieldKit({ t }: { t: NBTheme }) {
  const [groupId, setGroupId] = useState(FIELD_GROUPS[0].id);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => Object.fromEntries(Object.keys(OFFICE_CONTEXT).map(key => [key, true])));
  const [wire, setWire] = useState("");
  const [motion,setMotion]=useState(false),[manual,setManual]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[pinned,setPinned]=useState(false);
  const idleTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const restAuto=()=>{setManual(true);if(idleTimer.current)clearTimeout(idleTimer.current);idleTimer.current=setTimeout(()=>setManual(false),15000);};
  useEffect(()=>()=>{if(idleTimer.current)clearTimeout(idleTimer.current);},[]);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion:reduce)');let inView=false;
    const update=()=>setMotion(inView&&!document.hidden&&!media.matches);
    const observer=new IntersectionObserver(es=>{inView=es[0].intersectionRatio>=.3;update();},{threshold:.3});
    const scene=workspace.current?.querySelector('.office-stage');if(scene)observer.observe(scene);
    document.addEventListener('visibilitychange',update);media.addEventListener('change',update);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);media.removeEventListener('change',update);};
  },[]);
  useEffect(()=>{
    if(!motion||manual||hovered||focused||pinned)return;
    const timer=setInterval(()=>setGroupId(id=>FIELD_GROUPS[(FIELD_GROUPS.findIndex(g=>g.id===id)+1)%FIELD_GROUPS.length].id),9000);
    return()=>clearInterval(timer);
  },[motion,manual,hovered,focused,pinned]);
  const workspace = useRef<HTMLDivElement>(null),
    display = useRef<HTMLDivElement>(null);
  const sound = useWorkbenchSound();
  const group = FIELD_GROUPS.find((g) => g.id === groupId) || FIELD_GROUPS[0];
  useEffect(() => {
    let first = 0,
      second = 0;
    const restore = (event?: Event) => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      let hash = "";
      try {
        hash = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      if(hash.startsWith("profile-")||hash.startsWith("office-"))setPinned(true);
      const row = ABOUTFETCH_ROWS.find((r) => hash === `profile-${r.key}`);
      if (!row) {
        if (!FIELD_GROUPS.some((g) => hash === `office-${g.id}`))
          setGroupId(FIELD_GROUPS[0].id);
        return;
      }
      const targetGroup = FIELD_GROUPS.find((g) => g.keys.includes(row.key));
      if (!targetGroup) return;
      setGroupId(targetGroup.id);
      first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => {
          const target = document.getElementById(`profile-${row.key}`),
            detail = target?.querySelector("details");
          if (detail) detail.open = true;
          if (target) {
            if (event) target.focus({ preventScroll: true });
            target.scrollIntoView({ block: "start", behavior: "instant" });
          }
        });
      });
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("popstate", restore);
    };
  }, []);
  useEffect(() => {
    const root = workspace.current;
    if (!root) return;
    let frame = 0;
    const draw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const object = root.querySelector<HTMLElement>(
            `[data-office-group="${group.id}"]`,
          ),
          panel = display.current;
        if (!object || !panel) return;
        const r = root.getBoundingClientRect(),
          a = object.getBoundingClientRect(),
          b = panel.getBoundingClientRect();
        const x = a.left - r.left + a.width / 2,
          y = a.top - r.top + a.height / 2,
          tx = b.left - r.left,
          ty = b.top - r.top + 56;
        setWire(
          `M${x.toFixed(1)} ${y.toFixed(1)} H${(tx - 24).toFixed(1)} V${ty.toFixed(1)} H${tx.toFixed(1)}`,
        );
      });
    };
    const observer = new ResizeObserver(draw);
    observer.observe(root);
    draw();
    window.addEventListener("resize", draw);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", draw);
    };
  }, [group.id, expanded]);
  const select = (id: string) => {
    restAuto();setPinned(false);
    const next = FIELD_GROUPS.find((g) => g.id === id);
    if (!next) return;
    setGroupId(id);
    const url = new URL(location.href);
    url.hash = `office-${id}`;
    history.pushState(null, "", url.pathname + url.search + url.hash);
    sound.play("pen");
    if (window.matchMedia("(max-width: 760px)").matches) {
      requestAnimationFrame(() => {
        display.current?.focus({ preventScroll: true });
        display.current?.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant" : "smooth",
        });
      });
    }
  };
  const returnToObjects = () => {
    const target = workspace.current?.querySelector<HTMLButtonElement>(
      `[data-office-group="${group.id}"]`,
    );
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant" : "smooth",
    });
  };
  // Group-only history does not force a prose disclosure open.
  useEffect(() => {
    const restore = () => {
      const id = location.hash.replace("#office-", "");
      if (FIELD_GROUPS.some((g) => g.id === id)) {
        setGroupId(id);
      }
    };
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => {
      window.removeEventListener("popstate", restore);
      window.removeEventListener("hashchange", restore);
    };
  }, []);
  return (
    <section
      id="about"
      className="folio-section home-about home-field-kit office-kit"
    >
      <SectionLabel n="i" title={GUIDE_COPY.homeAbout} />
      <p className="office-explore-hint">{COPY.explore}</p>
      <div className="kit-registration">
        <span>{COPY.label}</span>

      </div>
      <div className="office-workspace" ref={workspace} data-office-motion={motion||undefined} onPointerEnter={e=>{if(e.pointerType==="mouse")setHovered(true);}} onPointerLeave={e=>{if(e.pointerType==="mouse")setHovered(false);}} onFocusCapture={e=>setFocused((e.target as Element).matches(":focus-visible")||!!(e.target as Element).closest(".office-display"))} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setFocused(false);}} onPointerDownCapture={restAuto}>
        <div className="office-stage" role="group" aria-label={COPY.scene}>
          <OfficeRoom />
          <div className="office-window-labels" aria-hidden="true">
            <span>London</span>
            <span>San Francisco</span>
          </div>
          {FIELD_GROUPS.map((g, i) => {
            const pos = PLACES[g.id];
            return (
              <button
                key={g.id}
                type="button"
                className={`office-object office-object-${g.object}`}
                data-office-group={g.id}
                style={
                  {
                    "--object-ink": t[g.pen],
                    "--object-x": `${pos[0]}%`,
                    "--object-y": `${pos[1]}%`,
                    "--object-width": `${pos[2]}%`,
                  } as React.CSSProperties
                }
                onClick={() => select(g.id)}
                aria-label={`${g.label}: ${COPY.display}`}
                aria-pressed={group.id === g.id}
                aria-controls={`office-panel-${g.id}`}
              >
                <svg className="office-object-aura" viewBox="0 0 220 150" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="110" cy="78" rx="99" ry="51"/></svg>
                {g.id === "research" || g.id === "education" || g.id === "away" ? <OfficeStudy kind={g.id}/> : <FieldObject kind={g.object} />}
                <span>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>
        <svg
          className="office-connection"
          aria-hidden="true"
          style={{ color: t[group.pen] }}
        >
          <path d={wire} />
        </svg>
        <div
          ref={display}
          tabIndex={-1}
          aria-label={`${group.label}: ${COPY.display}`}
          className="office-display"
          style={{ "--object-ink": t[group.pen] } as React.CSSProperties}
        >
          <div className="office-display-bar">
            <span>{COPY.display}</span>
            <span>
              {String(FIELD_GROUPS.indexOf(group) + 1).padStart(2, "0")} /{" "}
              {FIELD_GROUPS.length}
            </span>
          </div>
          {FIELD_GROUPS.map((g) => (
            <section
              key={g.id}
              id={`office-panel-${g.id}`}
              hidden={g.id !== group.id}
              aria-label={g.label}
            >
              <h3>{g.label}</h3>
              <dl className="about-ledger office-group-fields">
                {g.keys.map((key) => {
                  const row = ABOUTFETCH_ROWS.find((r) => r.key === key)!,
                    object = FIELD_OBJECTS[key];
                  return (
                    <div
                      key={key}
                      id={`profile-${key}`}
                      className="field-kit-item"
                      tabIndex={-1}
                      style={
                        { "--object-ink": t[object.pen] } as React.CSSProperties
                      }
                    >
                      <dt className={key === g.id || g.keys.length === 1 ? "field-key sr-only" : "field-key"}>{key === "funded by" ? "Grants & awards" : key}</dt>
                      <dd>
                        <Spans value={row.value} t={t} />
                        {OFFICE_CONTEXT[key] && <details
                          open={expanded[key] ?? true}
                          className="context-detail"
                          id={`kit-context-${key.replaceAll(" ", "-")}`}
                          onToggle={(e) => {
                            const open = e.currentTarget.open;
                            setExpanded((prev) => ({ ...prev, [key]: open }));
                          }}
                        >
                          <summary>{expanded[key] !== false ? "Context" : CABINET_COPY.contextExpand}</summary>
                          <p>{OFFICE_CONTEXT[key]}</p>

                        </details>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
          <nav className="office-display-controls" aria-label={COPY.scene}>
            <button
              type="button"
              aria-label={COPY.previous}
              onClick={() =>
                select(
                  FIELD_GROUPS[
                    (FIELD_GROUPS.indexOf(group) + FIELD_GROUPS.length - 1) %
                      FIELD_GROUPS.length
                  ].id,
                )
              }
            >
              ←
            </button>
            <span className="sr-only" aria-live="polite">{group.label}</span>
            <button
              type="button"
              aria-label={COPY.next}
              onClick={() =>
                select(
                  FIELD_GROUPS[
                    (FIELD_GROUPS.indexOf(group) + 1) % FIELD_GROUPS.length
                  ].id,
                )
              }
            >
              →
            </button>
          </nav>
          <button type="button" className="office-return" onClick={returnToObjects}>
            ↑ {COPY.back}
          </button>
        </div>
      </div>
    </section>
  );
}
