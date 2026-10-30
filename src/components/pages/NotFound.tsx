import { NotebookShell } from "../chrome/Notebook";
import { VISIBLE_POSTS } from "../../data/posts";
import { NOT_FOUND_COPY as COPY } from "../../data/notFound";
import { usePageState } from "../../lib/usePageState";
import type { CSSProperties } from "react";
import "../../styles/not-found.css";

// Preserve the existing four published fallbacks and their source ordering.
const recent = VISIBLE_POSTS.filter((post) => !post.draft).slice(0, 4);
export default function NotFound() {
  const { dark, toggleTheme } = usePageState();
  return (
    <NotebookShell
      current="not-found"
      mode={dark ? "dark" : "light"}
      onToggle={toggleTheme}
    >
      <main id="main" className="not-found-page" tabIndex={-1}>
        <header>
          <p className="eyebrow">{COPY.label}</p>
          <h1>{COPY.title}</h1>
          <p>{COPY.explanation}</p>
          <nav className="not-found-exits" aria-label="Find another page">
            <a className="folio-button" href="/">
              {COPY.home} ↗
            </a>
            <a className="folio-button secondary" href="/writing/">
              {COPY.writing} ↗
            </a>
          </nav>
        </header>
        <ol className="not-found-essays">
          {recent.map((post, i) => (
            <li key={post.slug}>
              <a
                href={`/${post.slug}/`}
                style={
                  {
                    "--record-pen": `var(--nb-${post.nbAccent || "blue"})`,
                  } as CSSProperties
                }
              >
                <span className="not-found-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2>{post.title}</h2>
                  <p>{post.dek}</p>
                </div>
                <span className="not-found-time">
                  {post.minutes}m <span aria-hidden="true">↗</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <p className="not-found-closing">
          {COPY.closing} <a href="/">{COPY.homeInline}</a>.
        </p>
      </main>
    </NotebookShell>
  );
}
