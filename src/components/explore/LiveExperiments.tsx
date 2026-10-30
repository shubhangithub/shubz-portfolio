import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {LIVE_EXPERIMENTS} from '../../data/experiments';
import type {NBTheme} from '../../data/palette';
import '../../styles/live-experiments.css';
const FisherFront=lazy(()=>import('../diagrams/FisherFront').then(m=>({default:m.FisherFront})));
const TuringRDFigure=lazy(()=>import('../essays/TuringEssay').then(m=>({default:m.TuringRDFigure})));
const Ecology=lazy(()=>import('../diagrams/Seasonal').then(m=>({default:({palette:p}:any)=><m.LotkaVolterra width={520} height={360} accent={p.accent} ink={p.ink} muted={p.muted} line={p.line} theme={{caption:'Lotka–Volterra · α=1, δ=0.4',why:''}} monthName='May'/>})));
const EnsembleConsensus=lazy(()=>import('../diagrams/EnsembleConsensus').then(m=>({default:m.EnsembleConsensus})));
const RecEngineSwarm=lazy(()=>import('../diagrams/RecEngineSwarm').then(m=>({default:m.RecEngineSwarm})));
const BottleneckMap=lazy(()=>import('../diagrams/BottleneckMap').then(m=>({default:m.BottleneckMap})));
const JaggedFrontier=lazy(()=>import('../diagrams/JaggedFrontier').then(m=>({default:m.JaggedFrontier})));
const ReadingCluster=lazy(()=>import('../diagrams/ReadingCluster').then(m=>({default:m.ReadingCluster})));
const WhoIsWe=lazy(()=>import('../diagrams/WhoIsWe').then(m=>({default:m.WhoIsWe})));
const AssumptionGrid=lazy(()=>import('../diagrams/AssumptionGrid').then(m=>({default:m.AssumptionGrid})));
const TimelineAnchors=lazy(()=>import('../diagrams/TimelineAnchors').then(m=>({default:m.TimelineAnchors})));
const IdeologyUnitGrid=lazy(()=>import('../diagrams/IdeologyUnitGrid').then(m=>({default:m.IdeologyUnitGrid})));
const DefencePillars=lazy(()=>import('../diagrams/DefencePillars').then(m=>({default:m.DefencePillars})));
const KillChainPhases=lazy(()=>import('../diagrams/KillChainPhases').then(m=>({default:m.KillChainPhases})));
const PhaseUnitWiring=lazy(()=>import('../diagrams/PhaseUnitWiring').then(m=>({default:m.PhaseUnitWiring})));
const MosquitoThreshold=lazy(()=>import('../diagrams/RossThreshold').then(m=>({default:m.MosquitoThreshold})));
const ControlLevers=lazy(()=>import('../diagrams/RossThreshold').then(m=>({default:m.ControlLevers})));
const QueueLedger=lazy(()=>import('../diagrams/SeptemberQueueDiagrams').then(m=>({default:m.QueueLedger})));
const QueueHeadroom=lazy(()=>import('../diagrams/SeptemberQueueDiagrams').then(m=>({default:m.QueueHeadroom})));
const DelayedCorrection=lazy(()=>import('../diagrams/OctoberFeedbackDiagrams').then(m=>({default:m.DelayedCorrection})));
const FeedbackPoles=lazy(()=>import('../diagrams/OctoberFeedbackDiagrams').then(m=>({default:m.FeedbackPoles})));
const diagrams:Record<string, React.ComponentType<any>> = {ross:MosquitoThreshold,"ross-controls":ControlLevers,"queue-ledger":QueueLedger,"queue-capacity":QueueHeadroom,"feedback-delay":DelayedCorrection,"feedback-roots":FeedbackPoles,fisher:FisherFront,turing:TuringRDFigure,ecology:Ecology,ensemble:EnsembleConsensus,engines:RecEngineSwarm,bottlenecks:BottleneckMap,frontier:JaggedFrontier,readings:ReadingCluster,actors:WhoIsWe,assumptions:AssumptionGrid,timelines:TimelineAnchors,ideologies:IdeologyUnitGrid,defence:DefencePillars,phases:KillChainPhases,wiring:PhaseUnitWiring};

export function LiveExperiments({t,mode}:{t:NBTheme;mode:"dark"|"light"}) {
 const [active,setActive]=useState<string|null>(null);
 const [visible,setVisible]=useState(true);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const restore=()=>{const id=new URLSearchParams(location.search).get('exhibit');setActive(LIVE_EXPERIMENTS.some(e=>e.id===id)?id:null);};restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[]);
 useEffect(()=>{const update=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 const choose=(id:string)=>{const next=active===id?null:id;setActive(next);const url=new URL(location.href);if(next)url.searchParams.set('exhibit',next);else url.searchParams.delete('exhibit');history.replaceState(null,'',url.pathname+url.search+url.hash);};
 return <section className="folio-section live-experiments" ref={root} aria-label="Essay experiments">
 <div className="experiment-register">{LIVE_EXPERIMENTS.map((e,i)=>{
 const Diagram=diagrams[e.id],open=active===e.id;
 return <article key={e.id} id={`exhibit-${e.id}`} className={open?'experiment-open':''} style={{'--item-accent':t[e.cat]} as React.CSSProperties}>
 <button className="experiment-selector" aria-expanded={open} aria-controls={`experiment-${e.id}`} onClick={()=>choose(e.id)}><span>{String(i+1).padStart(2,'0')}</span><strong>{e.title}</strong><span aria-hidden="true">{open?'−':'+'}</span></button>
 {open&&<div id={`experiment-${e.id}`} className="experiment-body"><p>{e.description}</p><div className="experiment-instrument">{visible&&<Suspense fallback={<p>Opening diagram…</p>}><Diagram palette={{mode,accentKey:e.cat,paper:t.paper2,ink:t.ink,muted:t.muted,line:t.rule,accent:t[e.cat]}}/></Suspense>}</div><a href={`/${e.slug}/`}>{e.essayTitle} ↗</a></div>}
 </article>})}</div></section>;
}
