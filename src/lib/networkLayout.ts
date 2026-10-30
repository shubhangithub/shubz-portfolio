/** Deterministic spring/charge layout. No orbit/ring placement and no invented edges. */
export type NetworkPoint={id:string;x:number;y:number;r:number};
export function networkLayout(ids:string[],links:{from:string;to:string}[],degrees:Map<string,number>):NetworkPoint[]{
 let seed=1729;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const nodes=ids.map(id=>({id,x:(random()-.5)*900,y:(random()-.5)*650,vx:0,vy:0,r:5+Math.sqrt(degrees.get(id)||1)*3.0}));
 const indices=new Map(ids.map((id,i)=>[id,i]));
 const edges=links.map(e=>[indices.get(e.from)!,indices.get(e.to)!]);
 for(let tick=0;tick<560;tick++){
  const alpha=Math.max(.025,1-tick/560);
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
   const a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy+.1,d=Math.sqrt(d2);
   const gap=a.r+b.r+13;
   const force=(850/d2+(d<gap?(gap-d)*.35:0))*alpha;
   const fx=dx/d*force,fy=dy/d*force;a.vx-=fx;a.vy-=fy;b.vx+=fx;b.vy+=fy;
  }
  for(const [i,j] of edges){const a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
   const hubLink=(degrees.get(a.id)||0)>8&&(degrees.get(b.id)||0)>8;
   const ideal=hubLink?190:78+a.r+b.r;
   const force=(d-ideal)*.028*alpha,fx=dx/d*force,fy=dy/d*force;
   // Higher-degree anchors move less, letting communities form around their hub.
   const wa=1/Math.sqrt(degrees.get(a.id)||1),wb=1/Math.sqrt(degrees.get(b.id)||1),sum=wa+wb;
   a.vx+=fx*wa/sum;a.vy+=fy*wa/sum;b.vx-=fx*wb/sum;b.vy-=fy*wb/sum;
  }
  for(const n of nodes){n.vx=(n.vx-n.x*.0008*alpha)*.82;n.vy=(n.vy-n.y*.0008*alpha)*.82;n.x+=Math.max(-12,Math.min(12,n.vx));n.y+=Math.max(-12,Math.min(12,n.vy));}
 }
 const minX=Math.min(...nodes.map(n=>n.x)),maxX=Math.max(...nodes.map(n=>n.x)),minY=Math.min(...nodes.map(n=>n.y)),maxY=Math.max(...nodes.map(n=>n.y));
 // Fit the force layout to the canvas aspect ratio instead of leaving broad
 // empty side bands around tall communities. Keep a margin for labels/motion.
 const scaleX=860/(maxX-minX),scaleY=600/(maxY-minY);
 const result=nodes.map(n=>({id:n.id,x:500+(n.x-(minX+maxX)/2)*scaleX,y:360+(n.y-(minY+maxY)/2)*scaleY,r:n.r}));
 // Normalisation changes centre spacing, not degree radii. Resolve the small
 // remaining overlaps in final SVG units without changing the graph topology.
 for(let pass=0;pass<80;pass++)for(let i=0;i<result.length;i++)for(let j=i+1;j<result.length;j++){
  const a=result[i],b=result[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001,gap=a.r+b.r+12;
  if(d<gap){const shift=(gap-d)/2+.01,ux=dx/d,uy=dy/d;a.x-=ux*shift;a.y-=uy*shift;b.x+=ux*shift;b.y+=uy*shift;}
 }
 return result;
}
