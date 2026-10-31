import { PixelStation } from "../chrome/RoboCat";
import { useEffect, useRef, useState } from 'react';
import { JOURNAL_ENTRIES } from '../../data/now';
import { JOURNAL_REEL_COPY as COPY } from '../../data/journalPresentation';
import { PENS } from '../../data/notebook';
import type { NBTheme } from '../../data/palette';
import '../../styles/journal-reel.css';

export function JournalReel({ t, selected, onChoose }: {
  t: NBTheme; selected: number[];
  onChoose: (kind: 'entry' | 'year', value: string) => void;
}) {
  const active = selected[0] ?? 0;
  const [enhanced, setEnhanced] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [turn, setTurn] = useState<{from:number; direction:'forward'|'backward'}|null>(null);
  const previous = useRef(active);
  const touch = useRef<{x:number;y:number}|null>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update); setEnhanced(true);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const from = previous.current;
    previous.current = active;
    if (from === active || reduced) { setTurn(null); return; }
    setTurn({from, direction:active > from ? 'forward':'backward'});
    const timer = window.setTimeout(() => setTurn(null), 760);
    return () => window.clearTimeout(timer);
  }, [active, reduced]);
  const entry = JOURNAL_ENTRIES[active];
  const turningEntry = turn ? JOURNAL_ENTRIES[turn.direction === "backward" ? active : turn.from] : entry;
  const book = enhanced;
  const step = (direction:number) => {
    const next = active + direction;
    if (next >= 0 && next < JOURNAL_ENTRIES.length) onChoose('entry',String(next));
  };
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthOf = (iso: string) => { const [y, m] = iso.split('-'); return `${months[Number(m) - 1] ?? m} ${y}`; };
  return <div className="journal-reel" data-book={book || undefined} style={{'--reel-ink':t[entry.family]} as React.CSSProperties}>
    {/* Desktop: every entry beside the open page, so the journal is a spread
        rather than a lone leaf; the page itself carries the date. */}
    <nav className="journal-index" aria-label="All journal entries">
      {(() => {
        const year = (e: typeof JOURNAL_ENTRIES[number]) => e.date.slice(0, 4);
        const latest = year(JOURNAL_ENTRIES[0]);
        const item = (e: typeof JOURNAL_ENTRIES[number], i: number) => <li key={i}>
          <button type="button" aria-current={active === i ? 'true' : undefined} onClick={() => onChoose('entry', String(i))} style={{'--item-accent':t[e.family]} as React.CSSProperties}>
            <span className="journal-index-date">{monthOf(e.date)}</span>
            <span className="journal-index-brief">{e.brief || e.note.split(/(?<=[.!?])\s/)[0]}</span>
            <small>{PENS.find(p => p.key === e.family)?.label}</small>
          </button>
        </li>;
        const current = JOURNAL_ENTRIES.map((e, i) => [e, i] as const).filter(([e]) => year(e) === latest);
        const earlier = JOURNAL_ENTRIES.map((e, i) => [e, i] as const).filter(([e]) => year(e) !== latest);
        const activeIsEarlier = earlier.some(([, i]) => i === active);
        return <>
          <ol>{current.map(([e, i]) => item(e, i))}</ol>
          {earlier.length > 0 && <details className="journal-index-earlier" open={activeIsEarlier || undefined}>
            <summary>Earlier · {earlier.length} {earlier.length === 1 ? 'entry' : 'entries'} · {year(earlier[earlier.length - 1][0])}–{year(earlier[0][0])}</summary>
            <ol>{earlier.map(([e, i]) => item(e, i))}</ol>
          </details>}
        </>;
      })()}
    </nav>
    <div className="journal-open-page">
    <div className="journal-time-rail">
      <span className="journal-frame-count" aria-live="polite">{COPY.page} {active+1} / {JOURNAL_ENTRIES.length}</span>
      <div className="journal-reel-controls"><button aria-label={COPY.previous} disabled={active===0} onClick={()=>step(-1)}>← <span>{COPY.newer}</span></button><button aria-label={COPY.next} disabled={active===JOURNAL_ENTRIES.length-1} onClick={()=>step(1)}><span>{COPY.older}</span> →</button></div>
    </div>
    <div className="journal-bound-book" onTouchStart={e=>{if(!book || (e.target as Element).closest('a,button,select'))return;const p=e.touches[0];touch.current={x:p.clientX,y:p.clientY};}} onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start)return;const p=e.changedTouches[0],dx=p.clientX-start.x,dy=p.clientY-start.y;if(Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.5)step(dx<0?1:-1);}}>
      {book && <aside className="journal-verso" aria-hidden="true">
        <span className="journal-bookplate">{COPY.bookplate}</span>
        <div className="journal-date-study"><span>{entry.date.slice(0,4)}</span><strong>{entry.date.slice(5)}</strong></div>
        <div className="journal-stitch"/>
        <span className="journal-page-foot">{COPY.hand}</span>
      </aside>}
      <div className="journal-leaves">
        {JOURNAL_ENTRIES.map((e,i)=><article key={i} hidden={book && active!==i} className="journal-memory" id={`journal-entry-${i}`} tabIndex={-1} style={{'--item-accent':t[e.family]} as React.CSSProperties}>
          {JOURNAL_ENTRIES.findIndex(n=>n.date.slice(0,4)===e.date.slice(0,4))===i && <span id={`journal-year-${e.date.slice(0,4)}`} tabIndex={-1}/>}
          <header><span>{PENS.find(p=>p.key===e.family)?.label}</span><span>{String(i+1).padStart(2,'0')}</span></header>
          <time dateTime={e.date}>{e.date}</time>
          {e.artifact && (e.artifact.href
            ? <a className="journal-memory-artifact" href={e.artifact.href}><img src={e.artifact.image} alt={e.artifact.alt} loading="lazy"/><span>{e.artifact.label}</span></a>
            : <div className="journal-memory-artifact"><img src={e.artifact.image} alt={e.artifact.alt} loading="lazy"/><span>{e.artifact.label}</span></div>)}
          <p>{e.note}</p>

        </article>)}
        {book && active > 0 && <button className="journal-page-corner journal-page-corner-back" aria-label={COPY.previous} onClick={()=>step(-1)}><span aria-hidden="true"/></button>}
        {book && active < JOURNAL_ENTRIES.length - 1 && <button className="journal-page-corner journal-page-corner-next" aria-label={COPY.next} onClick={()=>step(1)}><span aria-hidden="true"/></button>}
        {book && turn && <div className={`journal-turning-leaf turn-${turn.direction}`} key={`${active}-${turn.from}`} aria-hidden="true">
          <div className="journal-leaf-front" style={{'--item-accent':t[turningEntry.family]} as React.CSSProperties}><small>{COPY.record}</small><strong>{turningEntry.date}</strong><p>{turningEntry.note}</p></div>
          <div className="journal-leaf-back"><span>{COPY.bookplate}</span></div>
        </div>}
      </div>
    </div>
    </div>
    <PixelStation scene="journal"/>

  </div>;
}
