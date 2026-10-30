// Deliberately uncalibrated two-population model, without incubation or importation.
export const ROSS = {b: .2, c: .2, r: .05, mu: .2};
export function reproduction(m,a,{b,c,r,mu}=ROSS){return m*a*a*b*c/(r*mu)}
export function equilibrium(m,a,p=ROSS){const R=reproduction(m,a,p);const x=R>1?(R-1)/(R+a*p.c/p.mu):0;return [x,a*p.c*x/(a*p.c*x+p.mu)]}
export function derivative([x,y],m,a,{b,c,r,mu}=ROSS){return [a*b*m*y*(1-x)-r*x,a*c*x*(1-y)-mu*y]}
export function integrate(m,a,{days=600,dt=.5,initial=[.02,0],parameters=ROSS}={}){
 let state=[...initial];const out=[state];
 for(let t=0;t<Math.round(days/dt);t++){
  const f=s=>derivative(s,m,a,parameters), add=(s,k,h)=>s.map((v,i)=>v+h*k[i]);
  const k1=f(state),k2=f(add(state,k1,dt/2)),k3=f(add(state,k2,dt/2)),k4=f(add(state,k3,dt));
  state=state.map((v,i)=>v+dt*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);out.push(state);
 }return out;
}
export function leverEquilibrium(reduction,bites=false){const R=3*(bites?(1-reduction)**2:1-reduction),K=.3*(bites?1-reduction:1);return R>1?(R-1)/(R+K):0}
