import { canonicalToolName } from "../../data/work";
import { PixelStation } from "../chrome/RoboCat";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GRAPH_NODES, GRAPH_EDGES, GRAPH_KINDS, GRAPH_COPY as COPY, type GraphNode, type NodeKind } from '../../data/graph';
import { networkLayout, type NetworkPoint } from '../../lib/networkLayout';
import { useNetworkMotion } from '../../lib/useNetworkMotion';
import { useWorkbenchSound } from '../chrome/WorkbenchSound';
const root:GraphNode={id:'notebook:root',label:'Shubz / notebook',kind:'page',note:'The projects, writing and personal records in this notebook.',href:'/'};
const nodes=[root,...GRAPH_NODES];
const hubs=GRAPH_NODES.filter(n=>n.kind==='subject'||n.kind==='page');
const edges=[...GRAPH_EDGES,...hubs.map(n=>({from:root.id,to:n.id,kind:'notebook' as const}))];
const byId=new Map(nodes.map(n=>[n.id,n]));
const degrees=new Map(nodes.map(n=>[n.id,edges.filter(e=>e.from===n.id||e.to===n.id).length]));
const initial=networkLayout(nodes.map(n=>n.id),edges,degrees);
const ink=(n:GraphNode)=>n.cat?`var(--nb-${n.cat})`:'var(--nb-softInk)';
const kindLabel=(kind:NodeKind)=>({subject:'Subject',page:'Page hub',project:'Project',essay:'Published essay',tool:'Tool',career:'Career entry',profile:'About me',journal:'Journal note',focus:'Current focus',contact:'Contact channel'}[kind]);
type Camera={x:number;y:number;k:number};
type Drag={type:'pan'|'node';id?:string;startX:number;startY:number;x:number;y:number;moved:boolean};
export function NotebookGraph(){
 const [positions,setPositions]=useState<NetworkPoint[]>(initial);
 const [camera,setCamera]=useState<Camera>({x:0,y:0,k:1});
 const [selected,setSelected]=useState<string|null>(null);
 const [focusedNode,setFocusedNode]=useState(root.id);
 const [lens,setLens]=useState<NodeKind|'all'>('all');
 const [query,setQuery]=useState('');
 const [labels,setLabels]=useState<'auto'|'all'|'none'>('auto');
 const [hover,setHover]=useState<string|null>(null);
 const svg=useRef<SVGSVGElement>(null);
 const drag=useRef<Drag|null>(null);
 const pointers=useRef(new Map<number,{x:number;y:number}>());
 const pinch=useRef<{distance:number;camera:Camera;centre:{x:number;y:number}}|null>(null);
 const motion=useNetworkMotion(svg,positions,[hover,selected].filter(Boolean).join("|"),drag);
 const sound=useWorkbenchSound();
 const current=selected?byId.get(selected):undefined;
 const pmap=useMemo(()=>new Map(positions.map(n=>[n.id,n])),[positions]);
 const related=useMemo(()=>edges.filter(e=>e.from===selected||e.to===selected),[selected]);
 const neighbours=useMemo(()=>new Set(related.flatMap(e=>[e.from,e.to])),[related]);
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const matches=nodes.filter(n=>terms.length&&terms.every(t=>(n.label+' '+n.note+' '+(n.meta||'')+' '+kindLabel(n.kind)).toLowerCase().includes(t)));
 const matchIds=new Set(matches.map(n=>n.id));
 const shown=nodes.filter(n=>lens==='all'||n.kind===lens||n.kind==='subject'||n.kind==='page');
 const shownIds=new Set(shown.map(n=>n.id));
 const tabNode=shownIds.has(focusedNode)?focusedNode:shown[0]?.id;
 useEffect(()=>{setFocusedNode(previous=>shown.some(n=>n.id===previous)?previous:shown[0]?.id||root.id);},[lens]);
 const shownEdges=edges.filter(e=>shownIds.has(e.from)&&shownIds.has(e.to));
 const textNodes=shown.filter(n=>!terms.length||matchIds.has(n.id));
 const labelPlacements=new Map<string,{x:number;y:number;anchor:'start'|'end'|'middle';size:number}>();
 // Labels avoid other labels AND the node discs, so a hub's name is never
 // drawn through its neighbours.
 const boxes:{x:number;y:number;w:number;h:number}[]=shown.map(n=>{const p=pmap.get(n.id);return p?{x:p.x-p.r,y:p.y-p.r,w:p.r*2,h:p.r*2}:null;}).filter((b):b is {x:number;y:number;w:number;h:number}=>!!b);
 const priority=(n:GraphNode)=>n.id===selected?100:n.id===hover?90:matchIds.has(n.id)?80:n.kind==='subject'||n.kind==='page'?70:degrees.get(n.id)||0;
 [...shown].sort((a,b)=>priority(b)-priority(a)).forEach(n=>{
  const wanted=labels==='all'||labels==='auto'&&(n.kind==='subject'||n.kind==='page'||(degrees.get(n.id)||0)>=3||camera.k>1.65||n.id===selected||neighbours.has(n.id)||matchIds.has(n.id)||hover===n.id);
  if(!wanted)return;const p=pmap.get(n.id)!;const size=(n.kind==='subject'||n.kind==='page'?15:12)/Math.pow(camera.k,.3);
  const title=(n.label.length>40?n.label.slice(0,38)+'…':n.label);const w=title.length*size*.52,h=size*1.25;
  const options=[{x:p.r+5,y:4,anchor:'start' as const},{x:-p.r-5,y:4,anchor:'end' as const},{x:0,y:-p.r-7,anchor:'middle' as const},{x:0,y:p.r+size+5,anchor:'middle' as const},{x:p.r+5,y:-size,anchor:'start' as const},{x:0,y:p.r+size*2+10,anchor:'middle' as const}];
  let picked=options[0],best=Infinity;
  for(const o of options){const b={x:p.x+o.x-(o.anchor==='end'?w:o.anchor==='middle'?w/2:0),y:p.y+o.y-h,w,h};const overlap=boxes.filter(a=>a.x<b.x+b.w+4&&a.x+a.w+4>b.x&&a.y<b.y+b.h+3&&a.y+a.h+3>b.y).length;if(overlap<best){best=overlap;picked=o;}if(!overlap)break;}
  if(best&&labels==='auto'&&priority(n)<70)return;
  labelPlacements.set(n.id,{...picked,size});boxes.push({x:p.x+picked.x-(picked.anchor==='end'?w:picked.anchor==='middle'?w/2:0),y:p.y+picked.y-h,w,h});
 });
 const fit=(ids?:string[])=>{
  const ps=ids?.length?positions.filter(n=>ids.includes(n.id)):positions;
  const x0=Math.min(...ps.map(n=>n.x-n.r))-65,x1=Math.max(...ps.map(n=>n.x+n.r))+65,y0=Math.min(...ps.map(n=>n.y-n.r))-55,y1=Math.max(...ps.map(n=>n.y+n.r))+55;
  const k=Math.min(3,Math.max(.35,Math.min(1000/(x1-x0),720/(y1-y0))));setCamera({k,x:500-(x0+x1)/2*k,y:360-(y0+y1)/2*k});
 };
 useEffect(()=>{const restore=()=>{const params=new URLSearchParams(location.search),rawId=params.get('node'),id=rawId?.startsWith('tool:')?'tool:'+canonicalToolName(rawId.slice(5)):rawId;setSelected(id&&byId.has(id)?id:null);const type=params.get('lens');setLens(GRAPH_KINDS.some(k=>k.key===type)?type as NodeKind|'all':'all');setQuery('');};restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);},[]);
 const save=(id:string|null,type:NodeKind|'all')=>{const p=new URLSearchParams();if(id)p.set('node',id);if(type!=='all')p.set('lens',type);history.pushState(null,'','/builds/network/'+(p.size?'?'+p.toString():''));};
 const choose=(id:string|null)=>{setSelected(id);if(id)setFocusedNode(id);save(id,lens);sound.play('step');};
 const changeLens=(type:NodeKind|'all')=>{setLens(type);save(selected,type);};
 const point=(clientX:number,clientY:number)=>{const el=svg.current;if(!el)return{x:0,y:0};const p=el.createSVGPoint();p.x=clientX;p.y=clientY;const transformed=p.matrixTransform(el.getScreenCTM()?.inverse());return{x:transformed.x,y:transformed.y};};
 const zoomAt=(factor:number,anchor={x:500,y:360})=>setCamera(c=>{const k=Math.max(.3,Math.min(8,c.k*factor)),ratio=k/c.k;return{k,x:anchor.x-(anchor.x-c.x)*ratio,y:anchor.y-(anchor.y-c.y)*ratio};});
 useEffect(()=>{const element=svg.current;if(!element)return;const wheel=(e:WheelEvent)=>{e.preventDefault();zoomAt(Math.exp(-e.deltaY*.0015),point(e.clientX,e.clientY));};element.addEventListener('wheel',wheel,{passive:false});return()=>element.removeEventListener('wheel',wheel);},[]);
 const focusMatches=()=>{if(!matches.length)return;fit(matches.map(n=>n.id));if(matches.length===1)choose(matches[0].id);};
 const down=(e:React.PointerEvent<SVGSVGElement>)=>{
  const p=point(e.clientX,e.clientY);pointers.current.set(e.pointerId,p);e.currentTarget.setPointerCapture(e.pointerId);
  if(pointers.current.size===2){const [a,b]=[...pointers.current.values()];pinch.current={distance:Math.hypot(a.x-b.x,a.y-b.y),camera,centre:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}};drag.current=null;return;}
  const id=(e.target as Element).closest('[data-graph-node]')?.getAttribute('data-graph-node');
  const n=id?motion.effective.current.get(id):undefined;drag.current={type:n?'node':'pan',id:id||undefined,startX:p.x,startY:p.y,x:n?n.x:camera.x,y:n?n.y:camera.y,moved:false};
 };
 const move=(e:React.PointerEvent<SVGSVGElement>)=>{
  if(!pointers.current.has(e.pointerId))return;const p=point(e.clientX,e.clientY);pointers.current.set(e.pointerId,p);
  if(pinch.current&&pointers.current.size===2){const [a,b]=[...pointers.current.values()],start=pinch.current,k=Math.max(.3,Math.min(8,start.camera.k*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,start.distance))),ratio=k/start.camera.k;setCamera({k,x:(a.x+b.x)/2-(start.centre.x-start.camera.x)*ratio,y:(a.y+b.y)/2-(start.centre.y-start.camera.y)*ratio});return;}
  const d=drag.current;if(!d)return;const dx=p.x-d.startX,dy=p.y-d.startY;if(Math.hypot(dx,dy)>4)d.moved=true;
  if(d.type==='pan')setCamera(c=>({...c,x:d.x+dx,y:d.y+dy}));else setPositions(ps=>ps.map(n=>n.id===d.id?{...n,x:d.x+dx/camera.k-motion.offset(n.id).x,y:d.y+dy/camera.k-motion.offset(n.id).y}:n));
 };
 const up=(e:React.PointerEvent<SVGSVGElement>)=>{const d=drag.current;if(d?.type==='node'&&!d.moved&&d.id)choose(d.id);if(d?.type==='node'&&d.moved&&d.id)motion.release(d.id);pointers.current.delete(e.pointerId);drag.current=null;if(pointers.current.size<2)pinch.current=null;};
 const keyboard=(e:React.KeyboardEvent)=>{
  const target=e.target as Element;const id=target.closest('[data-graph-node]')?.getAttribute('data-graph-node');
  if((e.key==='Enter'||e.key===' ')&&id){e.preventDefault();choose(id);return;}
  if(e.key==='+'||e.key==='='){e.preventDefault();zoomAt(1.25);return;}if(e.key==='-'){e.preventDefault();zoomAt(.8);return;}if(e.key==='Home'){e.preventDefault();fit();return;}
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();
  if(id){const ns=Array.from(svg.current?.querySelectorAll<SVGGElement>('[data-graph-node]')||[]),i=ns.findIndex(n=>n.getAttribute('data-graph-node')===id);ns[(i+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+ns.length)%ns.length]?.focus();}
  else setCamera(c=>({...c,x:c.x+(e.key==='ArrowLeft'?35:e.key==='ArrowRight'?-35:0),y:c.y+(e.key==='ArrowUp'?35:e.key==='ArrowDown'?-35:0)}));
 };
 return <section className="network-explorer" aria-label="Full connected network of the notebook">
  <PixelStation scene="network"/>
  <div className="network-searchbar"><label><span aria-hidden="true">⌕</span><span className="sr-only">{COPY.search}</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')focusMatches();}} placeholder="Search the whole network…"/></label><button onClick={focusMatches} disabled={!matches.length}>Focus {terms.length?matches.length+' matches':'matches'}</button><button onClick={()=>{setQuery('');setLens('all');setSelected(null);save(null,'all');fit();}}>Whole network ↗</button></div>
  <div className="network-workspace">
   <aside className="network-sidebar" aria-label="Network filters and selected record">
    <div className="network-stat"><strong>{shown.length}</strong> nodes <span>/</span> <strong>{shownEdges.length}</strong> connections</div>
    <div className="network-appearance"><label>Type<select value={lens} onChange={e=>changeLens(e.target.value as NodeKind|'all')}>{GRAPH_KINDS.map(k=><option key={k.key} value={k.key}>{k.label}</option>)}</select></label><label>Labels<select value={labels} onChange={e=>setLabels(e.target.value as typeof labels)}><option value="auto">By zoom & selection</option><option value="all">All labels</option><option value="none">Hide labels</option></select></label></div>
    <div className="network-legend"><span><i/>Colour = subject</span><span><b/>Size = connections</span><span>Solid lines = membership</span><span>Dashed arrows = essay references</span></div>
    <div className="network-inspector" aria-live="polite" style={{'--node-ink':current?ink(current):'var(--nb-cyan)'} as React.CSSProperties}>
     <span className="eyebrow">{current?kindLabel(current.kind):'SELECT ANY NODE'}</span><h2>{current?.label||'One connected notebook.'}</h2>{current?.meta&&<p className="network-meta">{current.meta}</p>}<p className="network-note">{current?.note||'All the records are here together. Follow the coloured communities, or search for a name and focus its connections.'}</p>
     {current&&<a className="network-open" href={current.href}>Open {current.kind==='subject'?'subject in list view':'record'} ↗</a>}{current?.sourceHref&&<a className="network-source" href={current.sourceHref}>Original link ↗</a>}
     {current&&<div className="network-neighbours"><h3>{related.length} connections</h3>{related.map(e=>{const n=byId.get(e.from===current.id?e.to:e.from)!;return <button key={n.id+e.kind} onClick={()=>choose(n.id)}><i style={{background:ink(n)}}/>{n.label}<small>{e.kind==='reference'?'essay reference':e.kind==='notebook'?'in this notebook':e.kind+' membership'}</small></button>;})}</div>}
    </div>
   </aside>
   <div className="network-stage">
    <div className="network-stage-bar"><span>NOTEBOOK · FORCE-DIRECTED NETWORK</span><span>{terms.length?matches.length+' search matches':selected?'Selection highlighted · full network retained':'drag to rearrange · wheel to zoom · click to select'}</span></div>
    <svg ref={svg} className="network-canvas" viewBox="0 0 1000 720" role="group" aria-label="Full network. Drag nodes to rearrange; drag background to pan. Wheel or pinch to zoom. Tab and arrows navigate nodes; Enter selects; Home fits the graph." tabIndex={0} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={e=>{pointers.current.delete(e.pointerId);drag.current=null;pinch.current=null;}} onKeyDown={keyboard}>
     <defs><pattern id="network-grid" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="var(--nb-rule)"/></pattern><marker id="network-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L5 3L0 6" fill="none" stroke="var(--nb-softInk)"/></marker></defs><rect width="1000" height="720" fill="url(#network-grid)"/>
     <g className="network-camera" transform={`translate(${camera.x} ${camera.y}) scale(${camera.k})`}>
      <g className="network-edges">{shownEdges.map((e,i)=>{const a=pmap.get(e.from)!,b=pmap.get(e.to)!,na=byId.get(e.from)!,nb=byId.get(e.to)!,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;const active=!selected||e.from===selected||e.to===selected;return <line key={i} data-edge-kind={e.kind} data-edge-from={e.from} data-edge-to={e.to} x1={a.x+dx/d*a.r} y1={a.y+dy/d*a.r} x2={b.x-dx/d*(b.r+3)} y2={b.y-dy/d*(b.r+3)} stroke={e.kind==='reference'?'var(--nb-softInk)':ink(na.cat?na:nb)} strokeWidth={e.kind==='reference'?1.6:.8} opacity={active?(e.kind==='reference'?.7:.42):.12} strokeDasharray={e.kind==='reference'?'4 3':undefined} markerEnd={e.kind==='reference'?'url(#network-arrow)':undefined}/>;})}</g>
      {shown.map(n=>{const p=pmap.get(n.id)!,hit=n.id===selected,matched=matchIds.has(n.id),connected=neighbours.has(n.id);const dim=n.id!==hover&&(terms.length?!matched:!!selected&&!connected);const placement=labelPlacements.get(n.id);return <g key={n.id} className={`network-node ${hit?'network-node-selected':''}`} data-graph-node={n.id} role="button" tabIndex={n.id===tabNode?0:-1} aria-label={`${kindLabel(n.kind)}: ${n.label}. ${degrees.get(n.id)} connections.`} aria-pressed={hit} transform={`translate(${p.x} ${p.y})`} opacity={dim?.22:1} onClick={e=>{if(e.detail===0)choose(n.id);}} onMouseEnter={()=>setHover(n.id)} onMouseLeave={()=>setHover(null)} onFocus={()=>{setHover(n.id);setFocusedNode(n.id);}} onBlur={()=>setHover(null)} style={{'--node-ink':ink(n)} as React.CSSProperties}>
       <title>{kindLabel(n.kind)}: {n.label}</title>{(n.kind==='subject'||n.kind==='page')&&<circle className="network-node-halo" r={p.r+5} fill="var(--node-ink)" opacity=".13"/>}<circle className="network-node-hit" r={Math.max(12,p.r+5)}/><circle className="network-node-body" r={p.r}/>{(hit||matched)&&<circle className="network-node-ring" r={p.r+5}/>}
       {placement&&<text className="network-node-label" x={placement.x} y={placement.y} textAnchor={placement.anchor} fontSize={placement.size}>{n.label.length>40?n.label.slice(0,38)+'…':n.label}</text>}
      </g>;})}
     </g>
    </svg>
    <div className="network-controls"><span>Drag nodes or canvas · scroll / pinch to zoom</span><div><button className="network-motion-toggle" onClick={motion.toggle} disabled={motion.reduced} aria-pressed={!motion.paused&&!motion.reduced}>{motion.reduced?COPY.motionReduced:motion.paused?COPY.motionResume:COPY.motionPause}</button><button aria-label="Zoom out" onClick={()=>zoomAt(.8)}>−</button><span>{Math.round(camera.k*100)}%</span><button aria-label="Zoom in" onClick={()=>zoomAt(1.25)}>+</button><button onClick={()=>fit()}>Fit network</button><button onClick={()=>{setPositions(initial);setCamera({x:0,y:0,k:1});}}>Reset layout</button></div></div>
    {current&&<div className="network-mobile-preview" style={{'--node-ink':ink(current)} as React.CSSProperties}><div><small>{kindLabel(current.kind)}</small><strong>{current.label}</strong></div><a href={current.href}>Open record ↗</a></div>}
   </div>
  </div>
  <details className="network-text-list"><summary>Accessible node list · {textNodes.length} matching nodes</summary><ul>{textNodes.map(n=><li key={n.id}><button onClick={()=>{choose(n.id);fit([n.id,...edges.filter(e=>e.from===n.id||e.to===n.id).map(e=>e.from===n.id?e.to:e.from)]);}}>{n.label}<small>{kindLabel(n.kind)}</small></button><a href={n.href}>Open record ↗</a></li>)}</ul></details>
 </section>;
}
