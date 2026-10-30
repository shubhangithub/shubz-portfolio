import { useEffect, useRef } from 'react';
import '../../styles/research-backdrop.css';

/** Qualitative drawings, not charts or claims about live research activity. */
export function ResearchBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const drawings = Array.from(layer.querySelectorAll<SVGElement>('.research-drawing'));
    let frame = 0, last = 0, current = 0, target = 0, elapsed = 0;
    let stops: number[] = [];
    const paint = () => {
      const phone = innerWidth < 700;
      drawings.forEach((drawing, i) => {
        const drift = elapsed / 1000;
        const phase = current * .95 + i * 1.3 + drift * .09;
        const direction = i % 2 ? -1 : 1;
        const x = reduced.matches ? 0 : Math.sin(phase) * (phone ? 18 : 60);
        const y = reduced.matches ? 0 : Math.sin(current * .7 + i + drift * .11) * (phone ? 36 : 125);
        const rotation = reduced.matches ? 0 : direction * (current * 21 + Math.sin(drift * .08 + i) * 5);
        const scale = reduced.matches ? 1 : 1 + Math.sin(phase) * .20;
        drawing.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
        drawing.querySelectorAll<SVGElement>('.research-signal').forEach(path => {
          path.style.strokeDashoffset = String(reduced.matches ? 0 : -current * 280 - elapsed * .022 - i * 100);
        });
      });
      const helixPhase = reduced.matches ? 0 : current * 2 + elapsed * .00012;
      layer.querySelectorAll<SVGElement>('.helix-strand').forEach((path,i) => {
        path.setAttribute('d', Array.from({length:61},(_,j) => `${j?'L':'M'}${80 + Math.sin(j / 60 * Math.PI * 4 + helixPhase + i * Math.PI) * 52} ${j*5+10}`).join(' '));
      });
      layer.querySelectorAll<SVGElement>('.helix-rung').forEach((rung,i) => {
        const x = Math.sin(i / 15 * Math.PI * 4 + helixPhase) * 52;
        rung.setAttribute('x1',String(80+x));rung.setAttribute('x2',String(80-x));
      });
      layer.dataset.scrollProgress = current.toFixed(3);
    };
    const tick = (now: number) => {
      frame = 0;
      if (document.hidden || reduced.matches) return;
      const delta = last ? now-last : 34;
      if(delta>=32){
        const dt=Math.min(delta,64);last=now;elapsed+=dt;
        current += (target-current)*(1-Math.exp(-dt/180));
        paint();
      }
      frame=requestAnimationFrame(tick);
    };
    const readScroll = () => {
      const y = Math.max(0, scrollY);
      let index = 0;
      while (index < stops.length - 2 && y >= stops[index + 1]) index++;
      target = index + Math.min(1, (y - stops[index]) / Math.max(1, stops[index + 1] - stops[index]));
      if (!frame && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const sections = Array.from(document.querySelectorAll('main section')).map(e => e.getBoundingClientRect().top + scrollY);
      stops = [0, ...sections.filter(y => y > 100 && y < max), max].sort((a,b) => a-b).filter((y,i,all) => i===0 || y-all[i-1]>80);
      if (stops.length < 2) stops = [0, max];
      readScroll();
    };
    const update = () => {
      layer.dataset.sleeping = String(document.hidden);
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (reduced.matches) { current = 0; paint(); }
      else readScroll();
    };
    const resize = new ResizeObserver(measure);
    const main = document.querySelector('main');
    if (main) resize.observe(main);
    measure(); update();
    document.addEventListener('visibilitychange', update);
    window.addEventListener('scroll', readScroll, {passive:true});
    window.addEventListener('resize', measure);
    reduced.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', measure);
      reduced.removeEventListener('change', update);
    };
  }, []);
  return <div ref={ref} className="research-backdrop" aria-hidden="true">
    <svg className="research-drawing research-topology" viewBox="0 0 360 360" fill="none">
      <g className="research-orbit">
        <ellipse cx="180" cy="180" rx="158" ry="65" transform="rotate(-32 180 180)"/>
        <ellipse cx="180" cy="180" rx="158" ry="65" transform="rotate(32 180 180)"/>
        <circle cx="180" cy="180" r="134" strokeDasharray="2 12"/>
      </g>
      <path d="M44 150 112 66 208 42 302 131 278 257 164 310 64 262Z M44 150 180 180 208 42 M112 66 180 180 302 131 M64 262 180 180 278 257 M164 310 180 180"/>
      {[[44,150],[112,66],[208,42],[302,131],[278,257],[164,310],[64,262],[180,180]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={i===7?9:4}/><circle className="research-node" cx={x} cy={y} r="2" style={{animationDelay:`${i*-1.7}s`}}/></g>)}
      <path className="research-signal" d="M64 262 180 180 208 42 302 131 180 180 164 310"/>
    </svg>
    <svg className="research-drawing research-terrain" viewBox="0 0 400 400" fill="none">
      <g className="research-contours">
        {[0,1,2,3,4,5].map(i=><path key={i} transform={`translate(200 200) scale(${(.25+i*.15).toFixed(3)})`} d="M-130-65C-110-145-5-100 65-145S180-20 135 55 75 95 20 140-130 135-145 55-155 15-130-65Z"/>)}
      </g>
      <path strokeDasharray="3 7" d="M32 320 100 250 155 270 220 166 282 182 366 50"/>
      <path className="research-signal" d="M32 320 100 250 155 270 220 166 282 182 366 50"/>
      <circle cx="220" cy="166" r="13"/><path d="M220 145V155M220 177V187M199 166H209M231 166H241"/>
      <path d="M34 40H75M54 20V61M328 337H368M348 317V358"/>
    </svg>
    <svg className="research-drawing research-infrastructure" viewBox="0 0 420 300" fill="none">
      <path d="M0 45H110L145 80H230V137H305L340 102H420M0 225H100L155 170H230M48 300V254L175 127V0M345 300V205H285V137M420 44H315V80H230"/>
      <path className="research-signal" d="M0 45H110L145 80H230V137H305L340 102H420M48 300V254L175 127V0"/>
      <rect x="210" y="115" width="40" height="44" rx="3"/><path d="M219 130H241M219 143H235"/>
      {[[110,45],[100,225],[345,205],[315,44],[175,80]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5"/>)}
      <g strokeDasharray="2 8"><path d="M0 62H102L137 97H193M362 300V188H302V154M65 300V260L192 133V0"/></g>
    </svg>
    <svg className="research-drawing research-songbook" viewBox="0 0 280 200" fill="none">
      {[25,55,85,115,145,175].map(y=><g key={y}><circle cx="30" cy={y} r="6"/><path d={`M36 ${y}C110 ${y} 110 100 174 100`}/></g>)}
      <circle cx="186" cy="100" r="12"/><path d="M198 100H244M237 93 244 100 237 107"/>
      <path className="research-signal" d="M36 55C110 55 110 100 174 100M198 100H244"/>
    </svg>
    <svg className="research-drawing research-helix" viewBox="0 0 160 320" fill="none">
      {[0,1].map(i=><path key={i} className="helix-strand" d={Array.from({length:61},(_,j)=>`${j?'L':'M'}${(80+Math.sin(j/60*Math.PI*4+i*Math.PI)*52).toFixed(3)} ${j*5+10}`).join(' ')}/>)}
      {Array.from({length:16},(_,i)=><line key={i} className="helix-rung" x1={(80+Math.sin(i/15*Math.PI*4)*52).toFixed(3)} x2={(80-Math.sin(i/15*Math.PI*4)*52).toFixed(3)} y1={i*20+10} y2={i*20+10} opacity=".6"/>)}
    </svg>
    <svg className="research-drawing research-phase" viewBox="0 0 240 240" fill="none">
      <path d="M20 120H220M120 20V220" strokeDasharray="2 8"/>
      <g className="research-phase-orbit"><ellipse cx="120" cy="120" rx="85" ry="43" transform="rotate(-35 120 120)"/><ellipse cx="120" cy="120" rx="62" ry="29" transform="rotate(-35 120 120)"/><circle cx="190" cy="71" r="4" fill="currentColor"/></g>
      <path className="research-signal" d="M35 120C35 40 190 40 205 120S50 200 35 120"/>
    </svg>
    <svg className="research-drawing research-boat" viewBox="0 0 300 180" fill="none">
      <path d="M45 90Q150 48 255 90Q150 132 45 90ZM70 90H230M105 74V106M150 68V112M195 74V106M105 90L55 32M150 90L200 148M195 90L245 32"/>
      <path d="M45 20L65 41L55 50L35 29ZM190 140L210 161L220 152L200 131ZM235 20L255 41L245 50L225 29"/>
      <path className="research-signal" d="M10 138Q50 126 90 138T170 138T250 138M5 153Q45 141 85 153T165 153T245 153"/>
    </svg>
    <svg className="research-drawing research-circuit" viewBox="0 0 300 200" fill="none">
      <path d="M10 45H70V100H130M10 155H70V100M170 100H235V40H290M235 100V160H290M150 20V75M150 125V180"/>
      <rect x="130" y="75" width="40" height="50" rx="3"/><circle cx="70" cy="100" r="5"/><circle cx="235" cy="100" r="5"/>
      <path className="research-signal" d="M10 45H70V100H235V160H290"/>
      <path d="M140 90H160M140 100H160M140 110H153"/>
    </svg>
    <svg className="research-drawing research-cities" viewBox="0 0 520 230" fill="none">
      <path d="M15 190H505M42 190V98H62V190M45 98V82L52 65 59 82V98M139 190V98H159V190M142 98V82L149 65 156 82V98M62 119H139M62 135H139M62 176 100 146 139 176M62 111Q101 164 139 111"/>
      <path d="M290 190V67H307V190M430 190V67H447V190M271 171Q290 128 299 83Q368 198 439 83Q465 143 495 166M271 171H495M322 114V171M344 139V171M368 148V171M391 139V171M414 115V171"/>
      <path d="M160 128C208 49 238 59 289 120" strokeDasharray="3 8"/>
      <path className="research-signal" d="M52 190V98H62V135H139V190M159 128C208 49 238 59 289 120L307 171H495"/>
      <path d="M17 209Q48 203 79 209T141 209T203 209T265 209T327 209T389 209T451 209T513 209"/>
    </svg>
  </div>;
}
