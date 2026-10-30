// @ts-nocheck
/**
 * FeaturedEssay — the front door of /writing/. The page opens on a hand-picked
 * essay (POSTS[i].featured = 1), with its live figure beside the opening
 * paragraph; the other featured essays sit on tabs. The index follows below.
 */
import React, { useState } from "react";
import { VISIBLE_POSTS } from "../../data/posts";
import { PENS, WRITING_COPY } from "../../data/notebook";
import { nbTheme } from "../../data/palette";
import { ClipButton } from "../chrome/Paperclips";
import { essayClipId } from "../../data/paperclips";
import { featuredFigureFor } from "./FeaturedFigures";
import { Figure } from "./FigureReact";
import "../../styles/writing-front-door.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateLabel(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1] ?? m} ${y}`;
}

export const FEATURED_ESSAYS = VISIBLE_POSTS
  .filter((p) => !p.draft && typeof p.featured === "number")
  .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));

export function FeaturedEssay({ dark }: { dark: boolean }) {
  const [index, setIndex] = useState(0);
  if (!FEATURED_ESSAYS.length) return null;
  const post = FEATURED_ESSAYS[Math.min(index, FEATURED_ESSAYS.length - 1)];
  const mode = dark ? "dark" : "light";
  const t = nbTheme(mode);
  const accentKey = post.nbAccent || "blue";
  const palette = { paper: t.paper, ink: t.ink, muted: t.muted, line: t.rule, accent: t[accentKey], mode, accentKey };
  const figure = featuredFigureFor(post.slug);
  const number = String(VISIBLE_POSTS.indexOf(post) + 1).padStart(2, "0");
  const pen = PENS.find((p) => p.key === accentKey)?.label;
  return (
    <section
      className="front-door"
      aria-labelledby="front-door-title"
      style={{ "--item-accent": t[accentKey] } as React.CSSProperties}
    >
      <div className="front-door-topline">
        <div className="eyebrow"><span className="chapter">05</span>{WRITING_COPY.label}</div>
        <div className="front-door-tabs" role="tablist" aria-label="Featured essays">
          {FEATURED_ESSAYS.map((p, i) => (
            <button
              key={p.slug}
              role="tab"
              type="button"
              aria-selected={i === index}
              aria-controls="front-door-panel"
              onClick={() => setIndex(i)}
              style={{ "--tab-accent": t[p.nbAccent || "blue"] } as React.CSSProperties}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {p.title.replace(/ · [A-Z][a-z]+ '\d\d$/, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="front-door-stage" id="front-door-panel" role="tabpanel">
        <div className="front-door-text">
          <div className="front-door-kicker">
            <span className="front-door-rule" aria-hidden="true" />
            <span>{post.kicker}</span>
            <small>no.{number} · {post.minutes} min read{post.publishedAt ? ` · ${dateLabel(post.publishedAt)}` : ""}</small>
          </div>
          <h1 id="front-door-title">
            <a href={`/${post.slug}/`}>{post.title.replace(/ · [A-Z][a-z]+ '\d\d$/, "")}<span aria-hidden="true">.</span></a>
          </h1>
          <p className="front-door-dek">{post.dek}</p>
          {post.opening && <p className="front-door-opening drop-cap">{post.opening}</p>}
          <div className="front-door-actions">
            <a className="folio-button" href={`/${post.slug}/`}>
              Read the essay ↗<span>{post.minutes} min</span>
            </a>
            <ClipButton id={essayClipId(post.slug)} />
            <span className="front-door-meta">{pen}{post.series ? ` · ${post.series}` : ""}</span>
          </div>
        </div>

        {figure && (
          <div className="front-door-figure">
            <Figure caption={figure.caption} palette={palette}>
              {figure.render(palette)}
            </Figure>
          </div>
        )}
      </div>
    </section>
  );
}
