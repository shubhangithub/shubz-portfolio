import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { COMPANION_COPY as COPY } from '../../data/notebook';
import { PIXEL_SCENES, PIXEL_COPY, type PixelScene } from '../../data/pixel';
import '../../styles/pixel-context.css';
export type { PixelScene } from '../../data/pixel';

import { useWorkbenchSound } from './WorkbenchSound';

type Mood = 'idle' | 'curious' | 'purring' | 'sleeping' | 'walking';
type CompanionState = {
  hidden: boolean; reduced: boolean;
  purring: boolean; pet: () => void; hide: (value: boolean) => void;
};
const CompanionContext = createContext<CompanionState | null>(null);
export function useCompanion() { return useContext(CompanionContext); }

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const sound=useWorkbenchSound();
  const [hidden,setHidden] = useState(false);
  const [reduced,setReduced] = useState(false);
  const [purring,setPurring] = useState(false);
  const [ready,setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(mq.matches);
    change(); mq.addEventListener('change',change);
    try { const saved=JSON.parse(sessionStorage.getItem('notebook-companion')||'{}'); setHidden(saved.hidden===true); } catch {}
    setReady(true);
    return () => { mq.removeEventListener('change',change); clearTimeout(timer.current); };
  },[]);
  useEffect(() => { if(ready) { try {sessionStorage.setItem('notebook-companion',JSON.stringify({hidden}));}catch{} } },[ready,hidden]);
  const pet = () => { sound.play('pet');setHidden(false);setPurring(true);clearTimeout(timer.current);timer.current=setTimeout(()=>setPurring(false),3000); };
  return <CompanionContext.Provider value={{hidden,reduced,purring,pet,hide:setHidden}}>{children}</CompanionContext.Provider>;
}

/** A small articulated machine: body, sensor face, ears, tail and four feet. */
export function RoboCatDrawing({ mood = 'idle', prop }: { mood?: Mood; prop?: 'book' | 'lens' | 'letter' | 'clip' }) {
  return <svg className={`robo-cat-art cat-${mood}`} viewBox="0 0 180 150" fill="none" aria-hidden="true">
    <ellipse className="cat-shadow" cx="90" cy="132" rx="57" ry="7"/>
    <g className="cat-tail"><path d="M125 103C152 108 163 88 151 77C140 66 149 49 160 53"/><path className="cat-tail-light" d="M151 77C140 66 149 49 160 53"/><circle cx="160" cy="53" r="4"/></g>
    <g className="cat-body">
      <path className="cat-shell" d="M59 76C49 91 48 110 58 121C78 130 110 127 125 113C132 98 119 78 108 75Z"/>
      <path className="cat-seam" d="M63 85C78 91 98 92 116 85M69 91L66 114M114 93L117 110"/>
      <path className="cat-belly" d="M76 94H105L109 114Q91 125 73 114Z"/>
      <path className="cat-charge" d="M86 99H99L92 105H99L85 115L89 107H82Z"/>
      <g className="cat-leg cat-leg-back"><path d="M110 108L122 126H137Q143 134 133 135H115L102 117"/><circle cx="110" cy="113" r="4"/></g>
      <g className="cat-leg cat-leg-front"><path d="M64 108L56 127H45Q39 135 49 135H67L77 115"/><circle cx="65" cy="114" r="4"/></g>
      <g className="cat-paw"><path d="M84 117L82 131H96L99 118"/><path d="M82 131H97"/></g>
    </g>
    <g className="cat-head">
      <path className="cat-ear cat-ear-left" d="M54 57L49 22Q51 17 55 21L78 40"/>
      <path className="cat-ear cat-ear-right" d="M101 40L125 21Q130 18 130 24L125 61"/>
      <path className="cat-ear-inner" d="M58 47L56 30L69 42M112 43L123 31L120 49"/>
      <path className="cat-shell" d="M52 51Q87 30 123 50L133 76Q128 96 91 98Q54 98 45 78Z"/>
      <path className="cat-face" d="M58 57Q89 43 118 57L124 75Q115 88 91 88Q67 89 54 75Z"/>
      <g className="cat-eyes"><path className="cat-eye-open" d="M68 65V73M109 65V73"/><path className="cat-eye-happy" d="M63 71Q69 61 75 71M102 71Q109 61 116 71"/><path className="cat-eye-sleep" d="M64 72H75M103 72H115"/></g>
      <path className="cat-mouth" d="M85 78L90 82L95 78"/>
      <path className="cat-whiskers" d="M50 73L35 70M49 80L35 83M130 73L145 69M130 80L145 83"/>
      <circle className="cat-rivet" cx="53" cy="61" r="2"/><circle className="cat-rivet" cx="125" cy="61" r="2"/>
      <path className="cat-antenna" d="M90 37V28"/><circle className="cat-signal" cx="90" cy="25" r="3"/>
    </g>
    {prop === 'book' && <g className="pixel-prop pixel-prop-book">
      <path d="M57 104Q75 98 91 106Q109 97 128 103L124 136Q107 131 91 139Q76 132 59 136Z" fill="var(--nb-paper2)"/>
      <path d="M91 106V139M65 111L82 113M65 117L82 119M101 112L118 109M101 118L117 115"/>
      <path className="pixel-prop-paw" d="M54 116Q62 109 68 115L66 122H56M119 117Q127 108 132 115L130 123H121"/>
      <path d="M108 102V117L113 113L117 116V101" stroke="var(--nb-yellow)"/>
    </g>}
    {prop === 'lens' && <g className="pixel-prop pixel-prop-lens">
      <circle cx="139" cy="100" r="16" fill="var(--nb-paper2)"/><circle cx="139" cy="100" r="11"/>
      <path d="M128 112L116 127" strokeWidth="6"/><path d="M128 112L116 127" stroke="var(--nb-purple)" strokeWidth="2"/>
      <path d="M134 95Q139 91 145 96" opacity=".6"/><path className="pixel-prop-paw" d="M112 117Q118 112 123 119L120 125H111Z"/>
    </g>}
    {prop === 'letter' && <g className="pixel-prop pixel-prop-letter">
      <path d="M57 103L125 98L129 132L61 137Z" fill="var(--nb-paper2)"/><path d="M57 103L94 122L125 98M61 137L83 116M129 132L105 115"/>
      <circle cx="94" cy="121" r="5" fill="var(--nb-yellow)" stroke="var(--nb-yellow)"/>
      <path className="pixel-prop-paw" d="M52 114Q60 106 65 115L64 123H54M121 110Q129 103 134 112L132 121H123"/>
    </g>}
    {prop === 'clip' && <g className="pixel-prop pixel-prop-clip">
      <path d="M118 96l-16 18a7 7 0 0 0 10 10l20-22a12 12 0 0 0-17-17l-22 24a17 17 0 0 0 24 24l16-18" stroke="var(--nb-yellow)" strokeWidth="2.2" fill="none"/>
      <path className="pixel-prop-paw" d="M108 118Q114 112 120 118L118 126H110Z"/>
    </g>}
    <g className="cat-hearts"><path d="M27 43C18 33 24 27 29 32C34 25 42 32 34 39L27 43Z"/><path d="M144 25C137 18 142 13 147 17C151 12 156 18 151 22L144 25Z"/></g>
    <g className="cat-zzz"><path d="M136 38h10l-10 10h10M149 20h14l-14 14h14"/></g>
  </svg>;
}


/** True for a moment after a clip is saved anywhere on the page: Pixel
 *  carries it to the tray. Dispatched by the paperclip context. */
function useClipCarry() {
  const [carrying, setCarrying] = useState(false);
  useEffect(() => {
    let timer = 0;
    const carry = () => { setCarrying(true); window.clearTimeout(timer); timer = window.setTimeout(() => setCarrying(false), 1800); };
    window.addEventListener('notebook:clipped', carry);
    return () => { window.removeEventListener('notebook:clipped', carry); window.clearTimeout(timer); };
  }, []);
  return carrying;
}

export function CatCompanion({ placement = 'desk', walking = false, compact = false }: {
  placement?: 'desk' | 'trail' | 'terminal'; walking?: boolean; compact?: boolean;
}) {
  const pet = useCompanion();
  const [curious,setCurious] = useState(false);
  const [inspecting,setInspecting] = useState(false);
  const carrying = useClipCarry();
  if(!pet) return null;
  const mood:Mood = pet.purring ? 'purring' : walking ? 'walking' : curious || carrying ? 'curious' : 'idle';
  return <div className={`companion companion-${placement} ${compact?'companion-compact':''} ${pet.hidden?'companion-hidden':''} ${inspecting?'companion-inspecting':''}`} data-quiet={pet.reduced ? 'true':'false'}>
    {pet.hidden ? <button className="companion-restore" onClick={()=>pet.hide(false)}>{COPY.show} ↗</button> : <>
      <button className="companion-pet" aria-label={COPY.pet} onClick={()=>{pet.pet();setInspecting(!inspecting);}} onMouseEnter={()=>setCurious(true)} onMouseLeave={()=>setCurious(false)} onFocus={()=>setCurious(true)} onBlur={()=>setCurious(false)}><RoboCatDrawing mood={mood} prop={carrying ? 'clip' : undefined}/></button>
      <div className="companion-console"><span className="companion-name">{COPY.name}<small>PX–01</small></span><p className="companion-status" role="status" aria-live="polite">{carrying ? COPY.carrying : COPY[mood]}</p><div className="companion-controls"><button onClick={()=>pet.hide(true)} aria-label={COPY.hide}>×</button></div></div>
    </>}
  </div>;
}

export type PixelStationProps = {
  scene: PixelScene;
};

/** A small companion beside the content; page navigation stays with the objects. */
export function PixelStation({ scene }: PixelStationProps) {
  const pet = useCompanion();
  const station = useRef<HTMLDivElement>(null);
  const avatar = useRef<HTMLButtonElement>(null);
  const restore = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [curious, setCurious] = useState(false);
  const carrying = useClipCarry();
  useEffect(() => {
    let intersecting = false;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(entries => {
      intersecting = entries[0].isIntersecting;
      update();
    });
    if (station.current) observer.observe(station.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  if (!pet) return null;
  const context = PIXEL_SCENES[scene];
  const still = pet.reduced || !visible;
  const mood: Mood = pet.purring ? 'purring' : curious ? 'curious' : 'idle';
  const hide = () => { pet.hide(true); requestAnimationFrame(() => restore.current?.focus()); };
  const show = () => { pet.hide(false); requestAnimationFrame(() => avatar.current?.focus()); };
  return <div ref={station} className={`pixel-station pixel-station-${scene}`} data-pose={context.pose} data-still={still || undefined} data-quiet={pet.reduced ? 'true' : 'false'} data-hidden={pet.hidden || undefined} aria-label={`${PIXEL_COPY.name} · ${context.label}`}>
    {pet.hidden ? <button ref={restore} className="pixel-station-restore" onClick={show}>{COPY.show} ↗</button> : <>
      <button ref={avatar} className="pixel-station-avatar" aria-label={COPY.pet} onClick={pet.pet} onMouseEnter={()=>setCurious(true)} onMouseLeave={()=>setCurious(false)} onFocus={()=>setCurious(true)} onBlur={()=>setCurious(false)}>
        <RoboCatDrawing mood={carrying ? 'curious' : mood} prop={carrying ? 'clip' : context.pose === 'reading' ? 'book' : context.pose === 'carrying' ? 'letter' : 'lens'}/>
      </button>
        <details className="pixel-station-settings">
          <summary aria-label={PIXEL_COPY.settings}>···</summary>
          <div className="pixel-station-controls">
            <button onClick={pet.pet}>{COPY.pet}</button>


            <button onClick={hide}>{COPY.hide}</button>
          </div>
        </details>
    </>}
  </div>;

}
