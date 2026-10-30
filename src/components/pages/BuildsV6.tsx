import {TOOL_PROJECT_SOURCES} from "../../data/toolSources";
import {LIVE_EXPERIMENTS} from "../../data/experiments";
import {LiveExperiments} from "../explore/LiveExperiments";
import { PixelStation } from "../chrome/RoboCat";
import { ClipButton } from "../chrome/Paperclips";
import { projectClipId } from "../../data/paperclips";
import { ProjectStudy } from "../objects/ProjectStudy";
import {
  PROJECT_STUDIES,
  PROJECT_STUDY_COPY as SHEET,
} from "../../data/projectStudies";
import "../../styles/project-folio.css";
import React, { lazy, Suspense, useEffect, useState, useRef } from "react";
import {
  NotebookShell,
  SectionLabel,
  type PageProps,
} from "../chrome/Notebook";
import { nbTheme, type NBAccentKey } from "../../data/palette";
import {
  FILTER_COPY,
  PENS,
  COLLECTION_COPY as COPY,
  CABINET_COPY as CAB,
  CORE_TOOL_BINDINGS,
  GUIDE_COPY as GUIDE,
} from "../../data/notebook";
import {
  PROJECT_GROUPS,
  WORK_FEATURED_V5,
  WORK_BUILDS_LIST_V5,
  WORK_CORE_CARDS,
  WORK_FULL_GROUPS,
  WORK_EVENTS_V5,
  CV_PDF, canonicalToolName, toolSearchTerms,
} from "../../data/work";
import { DISCOVERY_COPY as DISCOVERY } from "../../data/guide";
const NotebookGraph = lazy(() =>
  import("../explore/NotebookGraph").then((m) => ({
    default: m.NotebookGraph,
  })),
);
import { GRAPH_COPY } from "../../data/graph";
import { careerAnchor, SUBJECT_ATLAS } from "../../data/discovery";
import { VISIBLE_POSTS, isAvailableSiteLink } from "../../data/posts";
import { projectAnchor, toolAnchor } from "../../data/discovery";
export function BuildsV6({
  dark,
  toggleTheme,
  initialView = "projects",
  network,
}: PageProps & {
  initialView?: "projects" | "graph";
  network?: React.ReactNode;
}) {
  const t = nbTheme(dark ? "dark" : "light");
  const [topic, setTopic] = useState("all");
  const [projectGroup, setProjectGroup] = useState("all");
  const [view, setView] = useState<
    "graph" | "projects" | "tools" | "lab" | "subject"
  >(initialView);
  const projectSearch = useRef<HTMLInputElement>(null);
  const toolSearch = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [toolsQuery, setToolsQuery] = useState("");
  const [drawers, setDrawers] = useState<string[]>([]);
  const [targetTool, setTargetTool] = useState<string | null>(null);
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(location.search),
        q = params.get("topic");
      const valid = PENS.some((p) => p.key === q),
        project = params.get("project"),
        rawTool = params.get("tool"),
        tool = rawTool ? canonicalToolName(rawTool) : null;
      const group = params.get("group");
      setProjectGroup(!project && !valid && PROJECT_GROUPS.some(g => g.key === group) ? group! : "all");
      setTargetTool(tool);
      setTopic(valid ? q! : "all");
      setDrawers(valid ? [q!] : []);
      setQuery("");
      setToolsQuery("");
      setView(
        project
          ? "projects"
          : tool
            ? "tools"
            : valid
              ? "subject"
              : params.get("view") === "lab"
                ? "lab"
                : params.get("view") === "tools" || location.hash === "#tools"
                  ? "tools"
                  : params.get("view") === "projects" ||
                      location.hash === "#catalogue"
                    ? "projects"
                    : params.get("view") === "graph" ||
                        params.has("node") ||
                        params.has("lens") ||
                        location.pathname.replace(/\/+$/, "") ===
                          "/builds/network"
                      ? "graph"
                      : "projects",
      );
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (project) {
            const entry = document.getElementById(projectAnchor(project));
            if (entry instanceof HTMLDetailsElement) entry.open = true;
          }
          const target = tool ? `#${toolAnchor(tool)}` : location.hash;
          if (target) {
            try {
              const element = document.getElementById(
                decodeURIComponent(target.slice(1)),
              );
              if (element) {
                const bounds = element.getBoundingClientRect();
                if (bounds.height > window.innerHeight - 125)
                  window.scrollTo({
                    top: Math.max(0, window.scrollY + bounds.top - 125),
                    behavior: "instant",
                  });
                else
                  element.scrollIntoView({
                    block: "center",
                    behavior: "instant",
                  });
              }
            } catch {}
          }
        }),
      );
    };
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => {
      window.removeEventListener("popstate", restore);
      window.removeEventListener("hashchange", restore);
    };
  }, []);
  const showPanel = () =>
    requestAnimationFrame(() => {
      const panel = document.getElementById("workspace-panel");
      if (panel && panel.getBoundingClientRect().top < 100)
        panel.scrollIntoView({ block: "start", behavior: "instant" });
    });
  const chooseTopic = (key: string) => {
    setProjectGroup("all");
    setTopic(key);
    setToolsQuery("");
    setQuery("");
    setView(key === "all" ? "projects" : "subject");
    setDrawers(key === "all" ? [] : [key]);
    history.pushState(
      null,
      "",
      key === "all" ? "/builds/?view=projects" : `/builds/?topic=${key}`,
    );
    showPanel();
  };
  const chooseView = (next: "graph" | "projects" | "tools" | "lab") => {
    if (next === "graph" && initialView !== "graph") {
      location.assign("/builds/network/");
      return;
    }
    setProjectGroup("all");
    setView(next);
    setTopic("all");
    setQuery("");
    setToolsQuery("");
    setDrawers([]);
    history.pushState(
      null,
      "",
      next === "projects"
        ? "/builds/"
        : next === "graph"
          ? "/builds/network/"
          : `/builds/?view=${next}`,
    );
    showPanel();
  };
  const chooseProjectGroup = (key: string) => {
    chooseView("projects");
    setProjectGroup(key);
    history.replaceState(null, "", `/builds/?group=${key}`);
  };
  const coreFor = (name: string, cat: NBAccentKey) =>
    WORK_CORE_CARDS.find(
      (c) => c.cat === cat && (CORE_TOOL_BINDINGS[c.name] || c.name) === name,
    );
  const allProjects = [...WORK_FEATURED_V5, ...WORK_BUILDS_LIST_V5];
  const projects = allProjects.filter(
    (p) =>
      (projectGroup === "all" || p.group === projectGroup) &&
      (topic === "all" || p.cat === topic) &&
      `${p.name} ${p.blurb} ${p.scope} ${PENS.find((x) => x.key === p.cat)?.label}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const groups = WORK_FULL_GROUPS.filter(
    (g) => topic === "all" || g.cat === topic,
  )
    .map((g) => ({
      ...g,
      tools: g.items.filter((name) => {
        const c = coreFor(name, g.cat);
        return `${toolSearchTerms(name)} ${g.group} ${c?.name || ""} ${c?.tier || ""} ${c?.link || ""}`
          .toLowerCase()
          .includes(toolsQuery.toLowerCase());
      }),
    }))
    .filter((g) => g.tools.length > 0);
  const count = groups.reduce((n, g) => n + g.tools.length, 0);
  const subject = PENS.find((p) => p.key === topic);
  const writing = VISIBLE_POSTS.filter((p) => p.nbAccent === topic);
  const career = WORK_EVENTS_V5.filter((e) => e.cat === topic);
  const projectSection = () => (
    <section id="catalogue" className="folio-section">
      <SectionLabel n="01" title={CAB.projects} />
      {projectGroup !== "all" && <button className="text-button" onClick={() => chooseView("projects")}>{GUIDE.projects} ↗</button>}
      <div className="catalogue-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            ref={projectSearch}
            type="search"
            aria-label="Search projects"
            placeholder="Search the project catalogue…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <span className="result-count" aria-live="polite">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
        {query && (
          <button
            className="filter-reset"
            onClick={() => {
              setQuery("");
              projectSearch.current?.focus();
            }}
          >
            {FILTER_COPY.clear} ×
          </button>
        )}
      </div>

      <div className="project-index project-folio-index">
        {PROJECT_GROUPS.map((group) => {
          const entries = projects.filter(p => p.group === group.key);
          if (!entries.length) return null;
          return <section className="project-purpose-group" key={group.key} aria-labelledby={`project-group-${group.key}`}>
          <h3 id={`project-group-${group.key}`} className="project-purpose-heading">{group.label}<span>{entries.length}</span></h3>
          {entries.map((p) => (
          <details
            className="project-file"
            id={projectAnchor(p.name)}
            key={p.name}
            style={{ "--item-accent": t[p.cat] } as React.CSSProperties}
          >
            <summary>
              <span className="project-thumbnail">
                <ProjectStudy
                  kind={PROJECT_STUDIES[p.name]?.kind || "site"}
                  compact
                />
              </span>
              <span className="project-number">
                {String(allProjects.indexOf(p) + 1).padStart(2, "0")}
              </span>
              <span className="project-title">
                {p.name}
                <small>{p.scope}</small>
              </span>
              <span className="project-subject">
                {PENS.find((x) => x.key === p.cat)?.label}
              </span>
              <span className="project-expand" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="project-file-body">
              <figure className="project-sheet-study">
                <div className="sheet-registration">
                  <span>{SHEET.sheet}</span>
                  <span>
                    {String(allProjects.indexOf(p) + 1).padStart(2, "0")}
                  </span>
                </div>
                <ProjectStudy kind={PROJECT_STUDIES[p.name]?.kind || "site"} />
                <figcaption>
                  <span>{SHEET.sketch}</span>
                  {PROJECT_STUDIES[p.name]?.caption || p.name}
                </figcaption>
              </figure>
              <p>{p.blurb}</p>
              <div className="project-sheet-actions">
                <ClipButton id={projectClipId(p.name)} />
                <div className="project-metrics">
                  {p.metrics.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
                <div className="project-links">
                  {p.essay && isAvailableSiteLink(`/${p.essay}/`) && (
                    <a href={`/${p.essay}/`}>
                      {COPY.publishedNotes}
                    </a>
                  )}
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer">
                      project ↗
                    </a>
                  )}
                  {"private" in p && p.private === true && (
                    <a href="mailto:hello@shubzsharma.com?subject=Project%20walkthrough">
                      ask for a walkthrough ↗
                    </a>
                  )}
                  {!p.url && (!p.essay || !isAvailableSiteLink(`/${p.essay}/`)) && <a href={CV_PDF}>on the CV ↗</a>}
                </div>
              </div>
            </div>
          </details>
        ))}
        </section>;
        })}
      </div>
      {!projects.length && (
        <p className="empty-drawer">
          {topic === "all" ? CAB.noProjects : GUIDE.noProjects}
          {!query && topic !== "all" && (
            <button
              className="filter-reset"
              onClick={() => chooseView("projects")}
            >
              {FILTER_COPY.allProjects} ↗
            </button>
          )}
        </p>
      )}
    </section>
  );
  const toolsSection = () => (
    <section id="tools" className="folio-section cabinet-section">
      <SectionLabel n="03" title={CAB.title} />
      <p className="collection-guidance">{CAB.intro}</p>
      <div className="cabinet-top">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            ref={toolSearch}
            type="search"
            aria-label="Search tools"
            placeholder={
              topic === "all" ? CAB.search : FILTER_COPY.subjectTools
            }
            value={toolsQuery}
            onChange={(e) => {
              setToolsQuery(e.target.value);
              setDrawers(
                e.target.value ? WORK_FULL_GROUPS.map((g) => g.cat) : [],
              );
            }}
          />
        </label>
        <span className="result-count" aria-live="polite">
          {count} {count === 1 ? "tool" : "tools"} / {groups.length}{" "}
          {groups.length === 1 ? "drawer" : "drawers"}
        </span>
        {toolsQuery && (
          <button
            className="filter-reset"
            onClick={() => {
              setToolsQuery("");
              setDrawers(topic === "all" ? [] : [topic]);
              toolSearch.current?.focus();
            }}
          >
            {FILTER_COPY.clear} ×
          </button>
        )}
        {topic !== "all" && (
          <button className="text-button" onClick={() => chooseView("tools")}>
            Show all subjects ↗
          </button>
        )}
      </div>
      <div className="tools-cabinet">
        {groups.map((g) => {
          const groupIndex = WORK_FULL_GROUPS.findIndex((x) => x.cat === g.cat);
          const isOpen = drawers.includes(g.cat);
          return (
            <details
              key={g.cat}
              className="cabinet-drawer"
              data-topic={g.cat}
              open={isOpen}
              onToggle={(e) => {
                const open = e.currentTarget.open;
                setDrawers((d) =>
                  open
                    ? d.includes(g.cat)
                      ? d
                      : [...d, g.cat]
                    : d.filter((k) => k !== g.cat),
                );
              }}
              style={{ "--item-accent": t[g.cat] } as React.CSSProperties}
            >
              <summary>
                <span className="drawer-index">
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                <span className="drawer-label">
                  <strong>{g.group}</strong>
                  <small>
                    {g.tools.length} {g.tools.length === 1 ? "tool" : "tools"}
                    {WORK_CORE_CARDS.some((c) => c.cat === g.cat)
                      ? " · provenance notes inside"
                      : ""}
                  </small>
                </span>
                <span className="cabinet-pull" aria-hidden="true" />
                <span className="drawer-state" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </summary>
              <div className="cabinet-tray">
                <div className="tray-header">
                  <span>{g.group} / inventory</span>
                  <span>
                    {g.tools.length} {g.tools.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <ul className="inventory-list">
                  {g.tools.map((name) => {
                    const core = coreFor(name, g.cat), source = TOOL_PROJECT_SOURCES[name];
                    const essay =
                      core?.essay &&
                      VISIBLE_POSTS.find((p) => p.slug === core.essay);
                    return (
                      <li
                        className="inventory-tool"
                        id={toolAnchor(name)}
                        data-core={core ? "true" : undefined}
                        key={name}
                      >
                        {core ? (
                          <details
                            className="tool-provenance"
                            open={targetTool === name || undefined}
                          >
                            <summary>
                              <span>{name}</span>
                              <small>{core.tier}</small>
                              <b aria-hidden="true">+</b>
                            </summary>
                            <div className="provenance-note">
                              <span className="eyebrow">{CAB.provenance}</span>
                              {core.name !== name && (
                                <strong>{core.name}</strong>
                              )}
                              <p>
                                {core.group} · {core.count} · {core.tier}
                              </p>
                              {isAvailableSiteLink(core.href) && <a
                                href={core.href}
                                style={{
                                  color: essay
                                    ? t[essay.nbAccent || g.cat]
                                    : t[g.cat],
                                }}
                              >
                                {core.link}
                                ↗
                              </a>}
                            </div>
                          </details>
                        ) : (
                          <div className={`inventory-basic${source ? " inventory-with-source" : ""}`}>
                            <span>{name}</span>
                            <a href={source?.href || CV_PDF} style={source ? {color:t[source.cat]} : undefined} aria-label={`${name}: ${source?.name || CAB.cv}`}>
                              {source ? source.name : "CV"} ↗
                            </a>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          );
        })}
      </div>
      {!groups.length && <p className="empty-drawer">{CAB.noTools}</p>}
      <div className="cabinet-base">
        <strong>{CAB.total}</strong>
        <span>{WORK_FULL_GROUPS.length} subjects</span>
        <span>
          {WORK_FULL_GROUPS.reduce((n, g) => n + g.items.length, 0)} tools
        </span>
        <span>{WORK_CORE_CARDS.length} provenance notes</span>
        <a href={CV_PDF}>the conventional CV ↗</a>
      </div>
    </section>
  );
  const labSection = () => <LiveExperiments t={t} mode={dark?"dark":"light"}/>;
  return (
    <NotebookShell
      current="builds"
      mode={dark ? "dark" : "light"}
      onToggle={toggleTheme}
    >
      <main
        id="main"
        className={`folio-main guide-main ${view === "graph" ? "guide-graph" : ""}`}
        tabIndex={-1}
      >
        <header className="guide-header">
          <div>
            <span className="eyebrow">04 / {GUIDE.label}</span>
            <h1>
              {view === "graph" ? GRAPH_COPY.title : DISCOVERY.indexTitle}
            </h1>
          </div>
        </header>
        {view!=="graph"&&<PixelStation scene="collection"/>}
        <div className="explore-presentation" aria-label="Exploration view">
          <button
            aria-pressed={view !== "graph"}
            onClick={() => chooseView("projects")}
          >
            {DISCOVERY.index}
          </button>
          <button
            aria-pressed={view === "graph"}
            onClick={() => chooseView("graph")}
          >
            {DISCOVERY.network}
          </button>
        </div>
        {view === "graph" ? (
          network || (
            <Suspense
              fallback={
                <p className="network-loading" role="status">
                  Opening the network…
                </p>
              }
            >
              <NotebookGraph />
            </Suspense>
          )
        ) : (
          <div className="guide-workspace">
            <nav className="guide-rail" aria-label="Explore the work">
              <div className="guide-modes">
                {PROJECT_GROUPS.map(group => <button key={group.key}
                  aria-pressed={view === "projects" && projectGroup === group.key}
                  onClick={() => chooseProjectGroup(group.key)}>
                  <span>↗</span>{group.label}<span>{allProjects.filter(p => p.group === group.key).length}</span>
                </button>)}
                {(["lab", "tools"] as const).map(v => <button key={v}
                  aria-pressed={view === v && topic === "all"} onClick={() => chooseView(v)}>
                  <span>{v === "tools" ? "⌘" : "◉"}</span>{GUIDE[v]}
                  <span>{v === "tools" ? WORK_FULL_GROUPS.reduce((n,g) => n + g.items.length, 0) : LIVE_EXPERIMENTS.length}</span>
                </button>)}
              </div>
              <span className="eyebrow guide-rail-label">{SHEET.register}</span>
              <label className="guide-topic-picker">
                <span>{GUIDE.subjects}</span>
                <select
                  value={topic}
                  onChange={(e) => chooseTopic(e.target.value)}
                >
                  <option value="all">Choose a subject…</option>
                  {PENS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="guide-subjects pen-register">
                {SUBJECT_ATLAS.map((p, i) => {
                  const careers = WORK_EVENTS_V5.filter(
                    (e) => e.cat === p.key,
                  ).length;
                  const description = `${p.label}: ${p.projects} projects, ${p.tools} tools, ${p.essays} published essays, ${careers} career entries`;
                  return (
                    <button
                      key={p.key}
                      title={description}
                      aria-label={description}
                      aria-pressed={topic === p.key}
                      onClick={() => chooseTopic(p.key)}
                      style={
                        { "--item-accent": t[p.key] } as React.CSSProperties
                      }
                    >
                      <span className="register-pen" aria-hidden="true">
                        <i />
                        <b />
                      </span>
                      <span className="register-label">
                        <strong>{p.label}</strong>
                        <small>
                          {p.projects + p.tools + p.essays + careers}{" "}
                          records
                        </small>
                      </span>
                      <span className="register-number" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
              <a className="guide-cv" href={CV_PDF}>
                The conventional CV ↗
              </a>
            </nav>
            <div id="workspace-panel" className="guide-panel">
              {view === "subject" && subject && (
                <header
                  id="subject-overview"
                  className="thread-header"
                  style={
                    { "--item-accent": t[subject.key] } as React.CSSProperties
                  }
                >
                  <span className="eyebrow">
                    SUBJECT /{" "}
                    {String(PENS.indexOf(subject) + 1).padStart(2, "0")}
                  </span>
                  <h2>{subject.label}</h2>
                  <p>{GUIDE.subjectIntro}</p>
                  <div>
                    <span>
                      {projects.length}{" "}
                      {projects.length === 1 ? "project" : "projects"}
                    </span>
                    <span>
                      {writing.filter((p) => !p.draft).length} published{" "}
                      {writing.filter((p) => !p.draft).length === 1
                        ? "essay"
                        : "essays"}
                    </span>
                    <span>
                      {count} {count === 1 ? "tool" : "tools"}
                    </span>
                    <span>
                      {career.length} career{" "}
                      {career.length === 1 ? "entry" : "entries"}
                    </span>
                  </div>
                </header>
              )}
              {(view === "projects" || view === "subject") && projectSection()}
              {view === "subject" && (
                <section className="thread-writing folio-section">
                  <SectionLabel n="02" title={GUIDE.writing} />
                  <div className="thread-essays">
                    {writing.map((p) => (
                      <a
                        href={`/${p.slug}/`}
                        key={p.slug}
                        style={
                          {
                            "--item-accent": t[p.nbAccent || "blue"],
                          } as React.CSSProperties
                        }
                      >
                        <span className="eyebrow">
                          {`Published essay · ${p.minutes} min`}
                        </span>
                        <h3>{p.title}</h3>
                        <p>{p.dek}</p>
                        <span className="text-link">
                          Read the essay ↗
                        </span>
                      </a>
                    ))}
                  </div>
                  {!writing.length && (
                    <p className="empty-drawer">{GUIDE.noWriting}</p>
                  )}
                </section>
              )}
              {(view === "tools" || view === "subject") && toolsSection()}
              {view === "subject" && career.length > 0 && (
                <section className="thread-career folio-section">
                  <SectionLabel n="04" title={GUIDE.career} />
                  <div>
                    {career.map((e) => (
                      <a
                        key={e.what}
                        href={`/work/?entry=${encodeURIComponent(e.what)}#${careerAnchor(e.what)}`}
                      >
                        <span>{e.year}</span>
                        <strong>{e.what}</strong>
                        <small>{e.where}</small>
                        <b aria-hidden="true">↗</b>
                      </a>
                    ))}
                  </div>
                </section>
              )}
              {view === "lab" && labSection()}
            </div>
          </div>
        )}
      </main>
    </NotebookShell>
  );
}
