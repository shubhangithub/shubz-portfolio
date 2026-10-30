import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { FOCUSES, NOW_LAST_UPDATED_DATE } from '../../data/now';
import reading from '../../data/reading.generated.json';
import { FOCUS_OBJECTS } from '../../data/fieldKit';
import type { NBTheme } from '../../data/palette';
import { FieldObject } from '../objects/FieldObject';
import { useWorkbenchSound } from '../chrome/WorkbenchSound';
import '../../styles/now-artifact.css';

const COPY = {
 title:'Current work.', intro:'Open an object or book.',
 reading:'On the reading rack', back:'Back to the objects', source:'Open on Fable', snapshot:'Shelf snapshot',
};
const readingIndex = FOCUSES.findIndex(f=>f.kind==='Reading');
const activities = FOCUSES.map((f,i)=>({f,i})).filter(({i})=>i!==readingIndex);
const places = [[30,25],[70,25],[25,48],[75,48]];
export function NowArtifact({t}:{t:NBTheme}) {
 const [selection,setSelection]=useState('focus-0');
 const [reduced,setReduced]=useState(true),[visible,setVisible]=useState(false);
 const root=useRef<HTMLDivElement>(null),panel=useRef<HTMLDivElement>(null);
 const sound=useWorkbenchSound();
 const motions=useRef(new Set<Animation>()),motionFrame=useRef(0);
 const cancelMotion=()=>{cancelAnimationFrame(motionFrame.current);motions.current.forEach(a=>a.cancel());motions.current.clear();};
 useEffect(()=>{if(reduced||!visible)cancelMotion();return cancelMotion;},[reduced,visible]);
 const animateObject=(id:string,detail=false)=>{
  cancelMotion();
  if(reduced||!visible||document.hidden)return;
  const surfaces:Element[]=[];
  const button=root.current?.querySelector(`[data-now-object="${id}"]`);
  if(button)surfaces.push(button);
  if(detail){const article=document.getElementById(id);if(article)surfaces.push(article);}
  const play=(selector:string,frames:Keyframe[],duration=1000,stagger=0)=>{
   surfaces.forEach(surface=>surface.querySelectorAll(selector).forEach((node,i)=>{
    const animation=node.animate(frames,{duration,delay:i*stagger,easing:'cubic-bezier(.22,.7,.2,1)',iterations:1});
    motions.current.add(animation);animation.onfinish=()=>motions.current.delete(animation);
   }));
  };
  play('.field-committee-node',[{transform:'scale(1)',opacity:.55},{transform:'scale(1.14)',opacity:1,offset:.45},{transform:'scale(1)',opacity:1}],650,75);
  play('.field-committee-links,.field-committee-check',[{strokeDasharray:'100',strokeDashoffset:100},{strokeDasharray:'100',strokeDashoffset:0}],1050,100);
  play('.field-study-underline,.field-study-chart',[{strokeDasharray:'100',strokeDashoffset:100},{strokeDasharray:'100',strokeDashoffset:0}],950,180);
  // Fixed endpoints are the diagonal binding; only the free page edge curls.
  const flat='path("M144 92Q177 77 210 62Q221 100 232 139Q197 154 162 170Z")';
  play('.field-book-curl',[
   {d:flat},
   {d:'path("M144 92Q159 54 176 49Q204 83 198 123Q178 144 162 170Z")',offset:.35},
   {d:'path("M144 92Q126 57 114 69Q126 105 137 145Q153 150 162 170Z")',offset:.65},
   {d:flat}
  ],1400);
  play('.field-book-print',[{opacity:1},{opacity:0,offset:.2},{opacity:0,offset:.8},{opacity:1}],1400);
  play('.field-tablet-stroke',[{strokeDasharray:'100',strokeDashoffset:100},{strokeDasharray:'100',strokeDashoffset:0}],1100);
  play('.field-tablet-pen',[{transform:'translate(-20px, 10px)'},{transform:'translate(7px, -7px)',offset:.75},{transform:'translate(0, 0)'}],1100);
  play('.field-microphone-wave',[{opacity:.2,transform:'scale(.9)'},{opacity:1,transform:'scale(1.08)',offset:.55},{opacity:.65,transform:'scale(1)'}],850,160);
  play('.field-city-cable',[{strokeDasharray:'500',strokeDashoffset:500},{strokeDasharray:'500',strokeDashoffset:0}],1200);
  play('.rack-book-binding',[{transform:'scaleX(1)'},{transform:'scaleX(4)',offset:.45},{transform:'scaleX(1)'}],950);
 };
 const preview=(id:string)=>animateObject(id);

 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);
  let intersecting=false;const visibility=()=>setVisible(intersecting&&!document.hidden);
  const observer=new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;visibility();});if(root.current)observer.observe(root.current);
  document.addEventListener('visibilitychange',visibility);
  return()=>{media.removeEventListener('change',update);observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
 },[]);
 useEffect(()=>{
  let raf=0;
  const restore=()=>{
   const id=location.hash.slice(1);let next='';
   if(id==='reading-shelf')next=`focus-${FOCUSES.findIndex(f=>f.kind==='Reading')}`;
   else if(/^focus-\d+$/.test(id)&&Number(id.slice(6))<FOCUSES.length)next=id;
   else if(/^reading-book-\d+$/.test(id)&&Number(id.slice(13))<reading.books.length)next=id;
   else if(id==='current-work')next='focus-0';
   if(!next)return;setSelection(next);
   cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=requestAnimationFrame(()=>{const target=document.getElementById(id);target?.scrollIntoView({block:'start',behavior:'instant'});target?.focus({preventScroll:true});});});
  };restore();window.addEventListener('hashchange',restore);window.addEventListener('popstate',restore);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('hashchange',restore);window.removeEventListener('popstate',restore);};
 },[]);
 const choose=(id:string)=>{
  setSelection(id);const url=new URL(location.href);['entry','page','year'].forEach(k=>url.searchParams.delete(k));url.hash=id;
  if(url.href!==location.href)history.pushState(null,'',url.pathname+url.search+url.hash);
  sound.play('open');
  cancelAnimationFrame(motionFrame.current);motionFrame.current=requestAnimationFrame(()=>animateObject(id,true));
  if(matchMedia('(max-width:760px)').matches)requestAnimationFrame(()=>{panel.current?.focus({preventScroll:true});panel.current?.scrollIntoView({block:'start',behavior:reduced?'instant':'smooth'});});
 };
 const back=()=>{const target=root.current?.querySelector<HTMLButtonElement>(`[data-now-object="${selection}"]`);target?.focus({preventScroll:true});target?.scrollIntoView({block:'center',behavior:reduced?'instant':'smooth'});};
 const focusIndex=selection.startsWith('focus-')?Number(selection.slice(6)):-1;
 const bookIndex=selection.startsWith('reading-book-')?Number(selection.slice(13)):-1;
 const accent=focusIndex>=0?t[FOCUSES[focusIndex].family]:t[FOCUSES[readingIndex].family];
 return <div className="now-artifact" ref={root} style={{'--artifact-ink':accent} as CSSProperties} data-moving={!reduced&&visible||undefined}>
  <header className="now-artifact-heading"><div><span className="eyebrow">01 / {NOW_LAST_UPDATED_DATE}</span><h2 id="current-desk-title">{COPY.title}</h2></div></header>
  <div className="now-artifact-workspace">
   <div className="now-mobile-scene" role="group" aria-label="Current work and reading objects">
    <svg className="now-mobile-frame" viewBox="0 0 700 650" fill="none" aria-hidden="true">
     <defs><pattern id="now-rack-perforations" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1" fill="var(--nb-control)" opacity=".28"/></pattern></defs>
     <path d="M85 600V165Q85 60 195 60H519Q618 60 618 165V600Z" fill="url(#now-rack-perforations)"/>
     <g className="now-object-ledges" stroke="var(--nb-control)" fill="var(--nb-paper2)"><path d="M128 210H310L321 219H119Z M389 210H570L581 219H380Z M128 370H310L321 379H119Z M389 370H570L581 379H380Z"/><path d="M145 219V229M294 219V229M406 219V229M554 219V229M145 379V389M294 379V389M406 379V389M554 379V389"/></g>
     <path d="M70 601H641L601 627H109Z" fill="var(--nb-paper2)" stroke="var(--nb-control)"/><path d="M85 600V165Q85 60 195 60H519Q618 60 618 165V600" stroke="var(--nb-control)" strokeWidth="3"/>
     <g stroke="var(--nb-rule)"><path d="M119 468H580L609 557H96Z" fill="var(--nb-paper)"/><path d="M96 557V569H609V557M119 468V485M580 468V485"/></g>
     <path d="M73 600L60 619M637 600L650 619" stroke="var(--nb-control)" strokeWidth="5"/>
    </svg>
    {activities.map(({f,i},slot)=><button key={f.kind} className="now-focus-object" data-now-object={`focus-${i}`} style={{'--object-ink':t[f.family],'--object-x':`${places[slot][0]}%`,'--object-y':`${places[slot][1]}%`,'--object-delay':`${-i*1.7}s`} as CSSProperties} aria-pressed={selection===`focus-${i}`} aria-controls={`focus-${i}`} onPointerEnter={event=>{if(event.pointerType==='mouse')preview(`focus-${i}`);}} onFocus={event=>{if(event.currentTarget.matches(':focus-visible'))preview(`focus-${i}`);}} onClick={()=>choose(`focus-${i}`)}><FieldObject kind={FOCUS_OBJECTS[f.kind]||'notebook'}/><span>{f.kind}</span></button>)}
    <div className="now-reading-rack" id="reading-shelf" tabIndex={-1} aria-label={COPY.reading}>
     <button className="reading-rack-label" data-now-object={`focus-${readingIndex}`} aria-controls={`focus-${readingIndex}`} aria-pressed={focusIndex===readingIndex||bookIndex>=0} onClick={()=>choose(`focus-${readingIndex}`)}>Reading ↗</button>
     {reading.books.map((b,i)=><button key={b.title} data-now-object={`reading-book-${i}`} aria-controls={`reading-book-${i}`} aria-pressed={bookIndex===i} onPointerEnter={event=>{if(event.pointerType==='mouse')preview(`reading-book-${i}`);}} onFocus={event=>{if(event.currentTarget.matches(':focus-visible'))preview(`reading-book-${i}`);}} onClick={()=>choose(`reading-book-${i}`)}><span className="rack-book-binding" aria-hidden="true"/><span className="rack-book-title">{b.title}</span><small>{b.authors.join(', ')}</small></button>)}
    </div>
   </div>
   <div className="now-artifact-panel" ref={panel} tabIndex={-1} aria-label="Selected object's notes">
    {FOCUSES.map((f,i)=><article id={`focus-${i}`} tabIndex={-1} key={f.kind} hidden={focusIndex!==i&&!(i===readingIndex&&bookIndex>=0)} className="now-focus-detail"><FieldObject kind={FOCUS_OBJECTS[f.kind]||'notebook'} className="now-detail-study"/><h3>{f.kind}</h3><p>{f.what}</p>{f.linkUrl&&<a href={f.linkUrl} title={f.linkTitle}>{f.linkText} ↗</a>}</article>)}
    {reading.books.map((b,i)=><article id={`reading-book-${i}`} tabIndex={-1} key={b.title} hidden={bookIndex!==i} className="now-book-detail"><FieldObject kind="books" className="now-detail-study"/><span className="now-book-number">{String(i+1).padStart(2,'0')}</span><h3>{b.title}</h3><p>{b.authors.join(', ')}</p><a href={b.url||reading.source}>{COPY.source} ↗</a><small>{COPY.snapshot} · {reading.fetchedAt.slice(0,10)}</small></article>)}
    <button className="now-return-objects" onClick={back}>↑ {COPY.back}</button>
   </div>
  </div>
 </div>;
}
