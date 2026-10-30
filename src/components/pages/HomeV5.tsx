import { FieldKit } from "../objects/FieldKit";
import { HomeWorkbench, BridgeNote } from "../objects/HomeWorkbench";
import "../../styles/field-studio.css";
import "../../styles/home-desk.css";
import "../../styles/home-workbench.css";
import React from "react";
import { NotebookShell, DeskScene, Spans, SectionLabel, type PageProps } from "../chrome/Notebook";
import { nbTheme } from "../../data/palette";
import { HERO_LINE_A, HERO_LINE_B, HOME_BUILDS, HOME_PINNED_SLUGS, HOME_PORTRAIT } from "../../data/home";
import { NOTEBOOK_COPY, GUIDE_COPY as GUIDE } from "../../data/notebook";
import { VISIBLE_POSTS, thumbUrlFor } from "../../data/posts";

export function HomeV5({ dark, toggleTheme }: PageProps) {
  const mode = dark ? "dark" : "light";
  const t = nbTheme(mode);
  const pinned = HOME_PINNED_SLUGS.map(slug => VISIBLE_POSTS.find(p => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return <NotebookShell mode={mode} current="home" onToggle={toggleTheme}>
    <main id="main" className="folio-main" tabIndex={-1}>
      <section className="home-intro" aria-labelledby="home-title">
        <div className="home-intro-copy"><div className="eyebrow"><span className="chapter">01</span>{NOTEBOOK_COPY.deskKicker}</div>
          <h1 id="home-title"><span>{NOTEBOOK_COPY.hello} </span><em>{NOTEBOOK_COPY.name}</em></h1>
          <p className="home-role"><Spans value={HERO_LINE_A} t={t}/>{" "}<Spans value={HERO_LINE_B} t={t}/></p>

          <div className="home-person home-person-desktop">
            <figure className="home-portrait"><img src={HOME_PORTRAIT.src} alt={HOME_PORTRAIT.alt} width="400" height="400"/></figure>
            <div><span className="home-person-name">{NOTEBOOK_COPY.brand}</span><span className="home-note">Working in London & San Francisco</span></div>
          </div>
        </div>
        <div className="home-scene-composition">
          <div className="home-person home-person-mobile">
            <figure className="home-portrait"><img src={HOME_PORTRAIT.src} alt={HOME_PORTRAIT.alt} width="400" height="400"/></figure>
            <div><span className="home-person-name">{NOTEBOOK_COPY.brand}</span><span className="home-note">Working in London & San Francisco</span></div>
          </div>
          <DeskScene/>
        </div>
      </section>
      <FieldKit t={t}/>
      <HomeWorkbench mode={mode} onTheme={toggleTheme}/>
      <BridgeNote/>
      <div className="home-columns home-parallel">
          <section className="folio-section"><SectionLabel n="ii" title={GUIDE.homeProjects} href="/builds/" link="projects & tools ↗"/><div className="build-rows">{HOME_BUILDS.map(b => <a href={b.url} className="build-row" key={b.name} target="_blank" rel="noreferrer" style={{ "--item-accent": t[b.c] } as React.CSSProperties}><div><strong>{b.name} ↗</strong><p>{b.blurb}</p></div><span>{b.year}</span></a>)}</div></section>
          <section className="folio-section"><SectionLabel n="iii" title={GUIDE.homeWriting} href="/writing/" link="all essays ↗"/>
            <ol className="writing-list">{pinned.map((post,i) => <li key={post.slug}><a href={`/${post.slug}/`} className="writing-item" style={{ "--item-accent": t[post.nbAccent || "blue"] } as React.CSSProperties}>
              <span className="item-number">0{i+1}</span><div><h3>{post.title}</h3><p>{post.dek}</p><span className="item-meta">{post.kicker.replace(/^Essay · /, "")} · {post.minutes} min read</span></div>{thumbUrlFor(post.slug) ? <img src={thumbUrlFor(post.slug)} alt="" loading="lazy"/> : <span/>}<span className="item-arrow">↗</span>
            </a></li>)}</ol>
          </section>
      </div>
    </main>
  </NotebookShell>;
}
