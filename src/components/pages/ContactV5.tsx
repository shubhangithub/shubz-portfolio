import { PixelStation } from "../chrome/RoboCat";
import { ContactPost, CourierBird } from "../objects/ContactPost";
import { HOME_PORTRAIT } from "../../data/home";
import { LETTER_COPY } from "../../data/notebook";
import React, { useState, useRef, useEffect } from "react";
import {
  NotebookShell,
  PageHero,
  SectionLabel,
  Spans,
  Photo,
  type PageProps,
} from "../chrome/Notebook";
import { nbTheme } from "../../data/palette";
import {
  CONTACT_HERO_LINES,
  CONTACT_LEDE,
  CONTACT_COMPOSE as COPY,
  CONTACT_OPEN_TO,
  CONTACT_PHOTO,
} from "../../data/contact";

export function ContactV5({ dark, toggleTheme }: PageProps) {
  const t = nbTheme(dark ? "dark" : "light");
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [folded, setFolded] = useState(false);
  const envelopeHeading = useRef<HTMLHeadingElement>(null);
  const messageField = useRef<HTMLTextAreaElement>(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (!interacted.current) return;
    const frame = requestAnimationFrame(() => {
      const target = folded ? envelopeHeading.current : messageField.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        block: "center",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [folded]);
  const mailto = `mailto:${COPY.toAddress}?subject=${encodeURIComponent(subject.trim() || COPY.defaultSubject)}&body=${encodeURIComponent(message + (from.trim() ? `\n\nFrom: ${from.trim()}` : ""))}`;
  const compose = (e: React.FormEvent) => {
    e.preventDefault();
    interacted.current = true;
    setFolded(true);
    window.location.href = mailto;
  };
  return (
    <NotebookShell
      current="contact"
      mode={dark ? "dark" : "light"}
      onToggle={toggleTheme}
    >
      <main id="main" className="folio-main" tabIndex={-1}>
        <PageHero
          n="06"
          label={LETTER_COPY.label}
          title={
            <>
              {CONTACT_HERO_LINES.map((l, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  <Spans value={l} t={t} />
                </React.Fragment>
              ))}
            </>
          }
          aside={
            <figure className="contact-portrait">
              <svg className="contact-greeting-bird" viewBox="-75 0 150 170" fill="none" aria-hidden="true"><CourierBird/></svg>
              <img src={HOME_PORTRAIT.src} alt={HOME_PORTRAIT.alt} width="400" height="400"/>
              <figcaption><span>Shubz Sharma</span><span>London</span></figcaption>
            </figure>
          }
        >
          <p>
            <Spans value={CONTACT_LEDE} t={t} />
          </p>
        </PageHero>
        <div className="contact-grid">
          <section className="letter-section">
            <SectionLabel n="i" title={LETTER_COPY.compose} />
            <PixelStation scene="contact"/>

            <div className={`letter-object ${folded ? "letter-folded" : ""}`}>
              <form className="letter-paper" onSubmit={compose} hidden={folded}>
                <div className="letter-to">
                  <span>{COPY.toLabel}</span>
                  <a href={`mailto:${COPY.toAddress}`}>{COPY.toAddress}</a>
                </div>
                <label className="letter-field">
                  <span>From</span>
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder={COPY.fromPlaceholder}
                    autoComplete="name"
                  />
                </label>
                <label className="letter-field">
                  <span>Subject</span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={COPY.subjectPlaceholder}
                  />
                </label>
                <label className="letter-message">
                  <span className="sr-only">Your message</span>
                  <textarea
                    ref={messageField}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
                    placeholder={COPY.bodyPlaceholder}
                    required
                  />
                </label>
                <div className="letter-actions">
                  <span>{COPY.footerNote}</span>
                  <button type="submit" className="folio-button">
                    {LETTER_COPY.open}
                  </button>
                </div>
              </form>
              {folded && (
                <div className="envelope-result">
                  <div className="envelope" aria-hidden="true">
                    <div className="envelope-flap" />
                    <div className="envelope-address">
                      <span>For Shubz</span>
                      <small>{COPY.toAddress}</small>
                    </div>
                    <span className="envelope-seal">S</span>
                  </div>
                  <div className="envelope-status" role="status">
                    <h2 ref={envelopeHeading} tabIndex={-1}>
                      {LETTER_COPY.handedOff}
                    </h2>
                    <p>{LETTER_COPY.ready}</p>
                    <div>
                      <a className="folio-button" href={mailto}>
                        {LETTER_COPY.open}
                      </a>
                      <button
                        className="text-button"
                        onClick={() => setFolded(false)}
                      >
                        {LETTER_COPY.edit}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <aside className="contact-aside">
            <div className="contact-open">
              <span className="eyebrow">Open to</span>
              <ul>
                {CONTACT_OPEN_TO.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <Photo {...CONTACT_PHOTO} />
          </aside>
        </div>
        <section className="folio-section">
          <SectionLabel n="ii" title={LETTER_COPY.elsewhere} />
          <ContactPost t={t}/>
        </section>
      </main>
    </NotebookShell>
  );
}
