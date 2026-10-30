// @ts-nocheck
// Two illustrative figures for the local August review. Shared RK4 arithmetic
// is checked by scripts/checks/ross-model.mjs; parameters are not fitted data.
import React from "react";
function usePlotLabels(){
 const ref=React.useRef(null),[size,setSize]=React.useState(16);
 React.useEffect(()=>{const node=ref.current;if(!node)return;const update=()=>setSize(Math.max(16,12*460/Math.max(200,node.getBoundingClientRect().width)));const observer=new ResizeObserver(update);observer.observe(node);update();return()=>observer.disconnect()},[]);
 return {ref,size};
}

import { ROSS, reproduction, equilibrium, integrate, leverEquilibrium } from '../../lib/ross-model.mjs';
const {b:B,c:C,r:REC,mu:MU}=ROSS;
const r0Of = reproduction;
const endemicOf = (r0,a) => r0>1?(r0-1)/(r0+a*C/MU):0;

export function MosquitoThreshold({ palette: p }) {
  const labels=usePlotLabels();
  const [m, setM] = React.useState(4.0); // mosquitoes per person
  const [a, setA] = React.useState(0.3); // bites per mosquito per day

  const r0 = r0Of(m, a);
  const xStar = endemicOf(r0, a);
  const mCrit = (REC * MU) / (a * a * B * C); // critical mosquito density
  const endemic = r0 > 1;

  const traj = React.useMemo(() => integrate(m,a).map(state=>state[0]), [m,a]);

  const W = 460;
  const H = 250;
  const left = 60;
  const right = W - 12;
  const top = 30;
  const base = 206;
  const span = right - left;
  const tx = (i) => left + (i / (traj.length - 1)) * span;
  const ty = (v) => base - v * (base - top);

  const path = traj
    .map((v, i) => `${i ? "L" : "M"}${tx(i).toFixed(1)} ${ty(v).toFixed(1)}`)
    .join(" ");
  const area = `${path} L${right} ${base} L${left} ${base} Z`;

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg ref={labels.ref}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Malaria prevalence over 600 days. With ${m.toFixed(1)} mosquitoes per person biting ${a.toFixed(2)} times a day, round-trip multiplier is ${r0.toFixed(2)}, so the infection ${endemic ? `settles at an endemic level of ${(xStar * 100).toFixed(0)} per cent` : "dies out"}.`}
        style={{ width: "100%", height: "auto", userSelect: "none", "--ross-label-size": `${labels.size}px` }}
      >
        {/* axes */}
        <line x1={left} y1={base} x2={right} y2={base} stroke={p.muted} strokeWidth="1" />
        <line x1={left} y1={top} x2={left} y2={base} stroke={p.muted} strokeWidth="1" opacity="0.5" />
        <text x={left - 5} y={top + 4} textAnchor="end" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted}>100%</text>
        <text x={left - 5} y={base} textAnchor="end" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted}>0</text>
        <text x={left - 44} y={(top + base) / 2} textAnchor="middle" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted} transform={`rotate(-90 ${left - 44} ${(top + base) / 2})`}>infected</text>
        <text x={right} y={base + 22} textAnchor="end" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted}>600 days →</text>

        {/* endemic plateau */}
        {endemic && (
          <g>
            <line x1={left} y1={ty(xStar)} x2={right} y2={ty(xStar)} stroke={p.accent} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x={right - 2} y={ty(xStar) - 5} textAnchor="end" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.accent}>
              endemic x* = {(xStar * 100).toFixed(0)}%
            </text>
          </g>
        )}

        <path d={area} fill={p.accent} opacity={endemic ? 0.14 : 0.05} />
        <path d={path} fill="none" stroke={endemic ? p.accent : p.muted} strokeWidth="2" />

        {/* verdict */}
        <text x={left + 6} y={top + 12} fontFamily="var(--f-mono)" fontSize={labels.size} fill={endemic ? p.accent : p.muted}>
          {endemic ? "R > 1 · persists" : "R ≤ 1 · fades"}
        </text>
      </svg>

      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 12, letterSpacing: "0.1em", marginBottom: 8 }}>Mosquitoes per person · m</div>
        <input
          type="range" min={0.5} max={8} step={0.1} value={m}
          onChange={(e) => setM(parseFloat(e.target.value))}
          aria-label="mosquitoes per person"
          style={{ width: "100%", accentColor: p.accent, cursor: "ew-resize" }}
        />
        <div className="caps mono" style={{ color: p.muted, fontSize: 12, letterSpacing: "0.1em", margin: "10px 0 8px" }}>Bites per day · a</div>
        <input
          type="range" min={0.15} max={0.5} step={0.01} value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
          aria-label="biting rate"
          style={{ width: "100%", accentColor: p.accent, cursor: "ew-resize" }}
        />

        <div className="mono" style={{ borderTop: `1px solid ${p.line}`, marginTop: 10, paddingTop: 10, fontSize: 12, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 6, color: p.ink }}>
          <span style={{ color: p.muted }}>R</span>
          <span style={{ color: endemic ? p.accent : p.muted }}>{r0.toFixed(2)}</span>
          <span style={{ color: p.muted }}>critical m*</span>
          <span>{mCrit < 50 ? mCrit.toFixed(2) : "—"}</span>
          <span style={{ color: p.muted }}>endemic x*</span>
          <span>{endemic ? `${(xStar * 100).toFixed(0)}%` : "0 (long-run limit)"}</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: p.muted, lineHeight: 1.5 }}>
          The dashed equilibrium is a long-run limit. Close to R = 1, 600 days may not be enough to reach it. Rates: b = c = 0.2; r = 0.05/day; μ = 0.2/day.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function ControlLevers({ palette: p }) {
  const labels=usePlotLabels();
  const [effort, setEffort] = React.useState(0.3);
  const [focus, setFocus] = React.useState(null);
  const R0_BASE = 3;
  const K = 0.3; // a·c/μ at the default biting rate

  const xstar = (r0,k=K) => (r0 > 1 ? (r0 - 1) / (r0 + k) : 0);
  const sprayR0 = (e) => R0_BASE * (1 - e);
  const netsR0 = (e) => R0_BASE * (1 - e) * (1 - e);

  const W = 460;
  const H = 250;
  const left = 60;
  const right = W - 12;
  const top = 20;
  const base = 200;
  const span = right - left;
  const eMax = 0.9;
  const yMax = 0.62;
  const ex = (e) => left + (e / eMax) * span;
  const ey = (v) => base - (v / yMax) * (base - top);

  const curve = (fn,bites=false) => {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const e = (i / 120) * eMax;
      pts.push(`${i ? "L" : "M"}${ex(e).toFixed(1)} ${ey(xstar(fn(e),K*(bites?1-e:1))).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Effort at which each lever reaches R = 1.
  const sprayCut = 1 - 1 / R0_BASE;
  const netsCut = 1 - 1 / Math.sqrt(R0_BASE);

  const sprayNow = leverEquilibrium(effort);
  const netsNow = leverEquilibrium(effort,true);

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg ref={labels.ref}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Two control levers against parameter reduction. Cutting mosquito numbers reaches elimination at ${(sprayCut * 100).toFixed(1)} per cent reduction; cutting bites reaches it at ${(netsCut * 100).toFixed(1)} per cent, because round-trip multiplier depends on the square of the biting rate.`}
        style={{ width: "100%", height: "auto", userSelect: "none", "--ross-label-size": `${labels.size}px` }}
      >
        <line x1={left} y1={base} x2={right} y2={base} stroke={p.muted} strokeWidth="1" />
        <line x1={left} y1={top} x2={left} y2={base} stroke={p.muted} strokeWidth="1" opacity="0.5" />
        <text x={left - 5} y={top + 4} textAnchor="end" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted}>62%</text>
        <text x={left - 5} y={base} textAnchor="end" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted}>0</text>
        <text x={left - 44} y={(top + base) / 2} textAnchor="middle" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted} transform={`rotate(-90 ${left - 44} ${(top + base) / 2})`}>endemic x*</text>
        <text x={right} y={base + 22} textAnchor="end" fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted}>reduction →</text>

        {/* elimination markers */}
        <line x1={ex(netsCut)} y1={top} x2={ex(netsCut)} y2={base} stroke={p.accent} strokeWidth="1" strokeDasharray="2 3" opacity="0.55" />
        <text x={ex(netsCut) + 3} y={top + 10} fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.accent}>{(netsCut * 100).toFixed(1)}%</text>
        <line x1={ex(sprayCut)} y1={top} x2={ex(sprayCut)} y2={base} stroke={p.muted} strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
        <text x={ex(sprayCut) + 3} y={top + 22} fontFamily="var(--f-mono)" fontSize={labels.size} fill={p.muted}>{(sprayCut * 100).toFixed(1)}%</text>

        {/* the two curves */}
        <path d={curve(sprayR0)} onPointerEnter={()=>setFocus("density")} onPointerLeave={()=>setFocus(null)} fill="none" stroke={p.muted} strokeWidth={focus==="density"?4:2} opacity={focus==="bites"?.35:1}/>
        <path d={curve(netsR0,true)} onPointerEnter={()=>setFocus("bites")} onPointerLeave={()=>setFocus(null)} fill="none" stroke={p.accent} strokeWidth={focus==="bites"?4:2} opacity={focus==="density"?.35:1}/>

        {/* live markers */}
        <circle cx={ex(effort)} cy={ey(sprayNow)} r={3.5} fill={p.paper} stroke={p.muted} strokeWidth="1.5" />
        <circle cx={ex(effort)} cy={ey(netsNow)} r={3.5} fill={p.paper} stroke={p.accent} strokeWidth="1.5" />


      </svg>

      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>{[['density','Density · R ∝ m'],['bites','Biting · R ∝ a²']].map(([id,label])=><button type="button" key={id} aria-pressed={focus===id} onClick={()=>setFocus(focus===id?null:id)} onMouseEnter={()=>setFocus(id)} onMouseLeave={()=>setFocus(null)} onFocus={()=>setFocus(id)} onBlur={()=>setFocus(null)} style={{fontFamily:'var(--f-ui)',fontSize:12,padding:'8px',color:id==="bites"?p.accent:p.muted,background:p.paper,border:`1px solid ${focus===id?p.accent:p.line}`}}>{label}</button>)}</div><div className="caps mono" style={{ color: p.muted, fontSize: 12, letterSpacing: "0.1em", marginBottom: 8 }}>Parameter reduction</div>
        <input
          type="range" min={0} max={0.9} step={0.01} value={effort}
          onChange={(e) => setEffort(parseFloat(e.target.value))}
          aria-label="parameter reduction"
          style={{ width: "100%", accentColor: p.accent, cursor: "ew-resize" }}
        />
        <div className="mono" style={{ borderTop: `1px solid ${p.line}`, marginTop: 10, paddingTop: 10, fontSize: 12, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 6, color: p.ink }}>
          <span style={{ color: p.muted }}>reduction</span><span>{(effort * 100).toFixed(0)}%</span>
          <span style={{ color: p.muted }}>cut numbers</span>
          <span>{sprayNow > 0 ? `${(sprayNow * 100).toFixed(0)}%` : "0% limit"}</span>
          <span style={{ color: p.accent }}>cut bites</span>
          <span style={{ color: p.accent }}>{netsNow > 0 ? `${(netsNow * 100).toFixed(0)}%` : "0% limit"}</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: p.muted, lineHeight: 1.5 }}>
          Same baseline R = 3, same axis. The biting-rate curve reaches one at {(netsCut * 100).toFixed(1)}% because the biting rate is squared. This compares parameters, not intervention costs.
        </div>
      </div>
    </div>
  );
}
