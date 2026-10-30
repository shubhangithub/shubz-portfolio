import { useState, useEffect, useRef } from 'react';
import { CONTACT_CHANNELS } from '../../data/contact';
import type { NBTheme } from '../../data/palette';
import '../../styles/contact-post.css';

/** A courier moves along the same numbered perches as the real destinations. */
export function ContactPost({ t }: { t: NBTheme }) {
  const [{perch, direction}, setFlight] = useState({perch:0, direction:1});
  const setPerch=(next:number)=>setFlight(previous=>({perch:next,direction:next===previous.perch?previous.direction:next>previous.perch?1:-1}));
  const [compact, setCompact] = useState(false);
  const scene=useRef<HTMLDivElement>(null), pauseUntil=useRef(0);
  const visit=(i:number)=>{pauseUntil.current=performance.now()+8000;setPerch(i);};
  useEffect(()=>{
    const node=scene.current;if(!node)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover)');
    let visible=false;
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{threshold:.15});observer.observe(node);
    const timer=window.setInterval(()=>{
      if(!visible||document.hidden||reduced.matches||performance.now()<pauseUntil.current||node.contains(document.activeElement)||(fine.matches&&node.matches(':hover')))return;
      setFlight(previous=>{const next=(previous.perch+1)%CONTACT_CHANNELS.length;return {perch:next,direction:next>previous.perch?1:-1};});
    },3400);
    return()=>{observer.disconnect();clearInterval(timer);};
  },[]);
  useEffect(() => {
    const media = matchMedia('(max-width:700px)');
    const update = () => setCompact(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <div ref={scene} className="contact-post contact-channels" style={{'--post-ink':t[CONTACT_CHANNELS[perch].c]} as React.CSSProperties}>
    <div className="post-route"><span>PERSONAL POST</span></div>
    <svg className="pigeon-wire" viewBox={compact ? "0 0 360 170" : "0 0 1000 170"} fill="none" aria-hidden="true">
      <path className="post-wire" d={compact?"M20 138Q180 155 340 138":"M20 138Q500 155 980 138"}/>
      {CONTACT_CHANNELS.map((c,i)=><g className="post-route-mark" key={c.label} style={{color:t[c.c]}}><path d={`M${compact?44+i*68:100+i*200} 143v25`} stroke="currentColor"/><circle cx={compact?44+i*68:100+i*200} cy="143" r="3" fill="currentColor"/><text x={compact?44+i*68:100+i*200} y="165" textAnchor="middle">{String(i+1).padStart(2,'0')}</text></g>)}
      <g className="courier-position" style={{transform:`translate(${compact ? 44+perch*68 : 100+perch*200}px, 0px)`}}>
        <g transform={compact?"translate(0 45) scale(.65)":undefined}><g className="courier-facing" transform={`scale(${direction} 1)`}><CourierBird flightKey={perch}/></g></g>
      </g>
    </svg>
    <nav className="post-destinations" aria-label="Other ways to find me">
      {CONTACT_CHANNELS.map((c,i)=><a id={`channel-${c.label.toLowerCase()}`} key={c.label} href={c.href} className="post-envelope" onPointerEnter={e=>{if(e.pointerType!=="touch")visit(i)}} onPointerDown={()=>visit(i)} onFocus={()=>visit(i)} style={{'--item-accent':t[c.c]} as React.CSSProperties}>
        <span className="post-envelope-flap" aria-hidden="true"/>
        <span className="post-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
        <span className="post-service">{c.label}<span aria-hidden="true">↗</span></span>
        <span className="post-address">{c.handle}</span>
        <span className="post-note">{c.note}</span>
      </a>)}
    </nav>
  </div>;
}

export function CourierBird({flightKey=0}:{flightKey?:number}) {return (<g className="courier-pigeon" key={flightKey}>
          <path d="m-26 116-38 9 14-30 36 4" fill="var(--nb-paper2)" stroke="var(--nb-cyan)" strokeWidth="2"/>
          <path d="M-37 100c-5-24 13-37 29-38 2-27 16-36 32-29 17 7 18 25 8 38 6 17 0 44-22 54-18 8-42-1-47-25Z" fill="var(--nb-paper2)" stroke="var(--nb-cyan)" strokeWidth="2"/>
          <path d="m33 48 16 8-16 5" fill="var(--nb-yellow)"/>
          <circle cx="22" cy="46" r="3" fill="var(--nb-ink)"/>
          <path d="M4 71q15 9 27 0" stroke="var(--nb-purple)" strokeWidth="5"/>
          <path className="courier-wing" d="M-23 79q31-14 36 18-12 25-39 13-9-13 3-31Z" fill="var(--nb-paper)" stroke="var(--nb-cyan)" strokeWidth="2"/>
          <path d="m-8 125-3 17m19-17 4 17m-29 0h14m8 0h15" stroke="var(--nb-yellow)" strokeWidth="2"/>
          <path d="m-3 87 24-3 3 18-24 3Z" fill="var(--nb-paper2)" stroke="var(--post-ink)"/><path d="m-3 87 14 9 10-12" stroke="var(--post-ink)"/>
        </g>);}
