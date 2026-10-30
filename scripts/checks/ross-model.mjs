import assert from 'node:assert/strict';
import {ROSS,reproduction,equilibrium,derivative,integrate,leverEquilibrium} from '../../src/lib/ross-model.mjs';
let seed=1897;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
for(let i=0;i<500;i++){
 const m=.5+7.5*random(),a=.15+.35*random();const p={b:.1+.3*random(),c:.1+.3*random(),r:.03+.05*random(),mu:.1+.2*random()};
 const eq=equilibrium(m,a,p);assert(derivative(eq,m,a,p).every(x=>Math.abs(x)<1e-14));
 const R=reproduction(m,a,p),lambda=(-(p.r+p.mu)+Math.sqrt((p.r-p.mu)**2+4*m*a*a*p.b*p.c))/2;
 assert.equal(lambda>0,R>1);
 if(Math.abs(R-1)>.25){const end=integrate(m,a,{days:2500,dt:.5,parameters:p}).at(-1);assert(Math.abs(end[0]-eq[0])<1e-6)}
}
for(const m of [.5,4,8])for(const a of [.15,.3,.5]){
 const fine=integrate(m,a,{dt:.25}),coarse=integrate(m,a,{dt:.5});assert(Math.abs(fine.at(-1)[0]-coarse.at(-1)[0])<1e-7);
 assert(coarse.every(s=>s.every(x=>x>=0&&x<=1)));
}
assert(Math.abs(reproduction(4,.3)-1.44)<1e-14);
assert(Math.abs(equilibrium(4,.3)[0]-.2528735632183908)<1e-14);
assert(Math.abs(100*(1-1/3)-66.66666666666667)<1e-12);
assert(Math.abs(100*(1-1/Math.sqrt(3))-42.26497308103742)<1e-12);
assert(3*(1-.42)**2>1);assert(3*(1-.43)**2<1);
for(let i=0;i<100;i++){const e=random()*.9;const m=3/(.3*.3*ROSS.b*ROSS.c/(ROSS.r*ROSS.mu));assert(Math.abs(equilibrium(m*(1-e),.3)[0]-leverEquilibrium(e))<1e-13);assert(Math.abs(equilibrium(m,.3*(1-e))[0]-leverEquilibrium(e,true))<1e-13)}
console.log('PASS:500 random equilibrium/stability checks, long-run integration, timestep convergence, both control curves and quoted thresholds.');
