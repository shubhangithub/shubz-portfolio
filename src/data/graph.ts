import {TOOL_PROJECT_SOURCES} from "./toolSources";
// Edges mean recorded category membership, page membership or an explicit
// project/tool essay reference. Layout distance never creates a relationship.
import { PENS, CORE_TOOL_BINDINGS } from './notebook';
import { VISIBLE_POSTS, isAvailableSiteLink } from './posts';
import { WORK_FEATURED_V5, WORK_BUILDS_LIST_V5, WORK_FULL_GROUPS, WORK_CORE_CARDS, WORK_EVENTS_V5, CV_PDF, toolSearchTerms } from './work';
import { ABOUTFETCH_ROWS, type Span } from './home';
import { CONTACT_CHANNELS } from './contact';
import { JOURNAL_ENTRIES, FOCUSES } from './now';
import { careerAnchor, projectAnchor, toolAnchor } from './discovery';
import type { NBAccentKey } from './palette';
export type NodeKind='subject'|'page'|'project'|'essay'|'tool'|'career'|'profile'|'journal'|'focus'|'contact';
export type GraphNode={id:string;label:string;kind:NodeKind;cat?:NBAccentKey;note:string;href:string;meta?:string;sourceHref?:string};
export type GraphEdge={from:string;to:string;kind:'subject'|'page'|'reference'};
const plain=(value:Span[])=>value.map(s=>typeof s==='string'?s:'em' in s?s.em:'link' in s?s.link:s.tag).join('');
const projects=[...WORK_FEATURED_V5,...WORK_BUILDS_LIST_V5];
export const GRAPH_NODES:GraphNode[]=[
 ...PENS.map(p=>({id:'subject:'+p.key,label:p.label,kind:'subject' as const,cat:p.key,note:'Records filed under '+p.label+'. Connections use the existing subject assignments.',href:`/builds/?topic=${p.key}`})),
 {id:'page:about',label:'About me',kind:'page',note:'Work, research and life, arranged in eight connected objects.',href:'/#about'},
 {id:'page:contact',label:'Contact',kind:'page',note:'Five existing ways to get in touch or follow along.',href:'/contact/'},
 {id:'page:journal',label:'Now & journal',kind:'page',note:'Current threads and the complete field journal.',href:'/now/'},
 ...projects.map(p=>({id:'project:'+p.name,label:p.name,kind:'project' as const,cat:p.cat,note:p.blurb,meta:p.scope,href:`/builds/?project=${encodeURIComponent(p.name)}#${projectAnchor(p.name)}`,sourceHref:p.url||undefined})),
 ...VISIBLE_POSTS.map(p=>({id:'essay:'+p.slug,label:p.title,kind:'essay' as NodeKind,cat:p.nbAccent,note:p.dek,meta:`${p.minutes} min read`,href:`/${p.slug}/`})),
 ...WORK_FULL_GROUPS.flatMap(g=>g.items.map(name=>{const core=WORK_CORE_CARDS.find(c=>c.cat===g.cat&&(CORE_TOOL_BINDINGS[c.name]||c.name)===name);return {id:'tool:'+name,label:name,kind:'tool' as const,cat:g.cat,note:core?`${core.name}. ${core.group} · ${core.count} · ${core.tier}. ${isAvailableSiteLink(core.href)?core.link:''}.`:toolSearchTerms(name)+' · '+g.group+(TOOL_PROJECT_SOURCES[name]?' · '+TOOL_PROJECT_SOURCES[name].name:''),meta:core?.tier,href:`/builds/?topic=${g.cat}&tool=${encodeURIComponent(name)}#${toolAnchor(name)}`,sourceHref:isAvailableSiteLink(core?.href)?core.href:TOOL_PROJECT_SOURCES[name]?.href||CV_PDF};})),
 ...WORK_EVENTS_V5.map(e=>({id:'career:'+e.what,label:e.what,kind:'career' as const,cat:e.cat,note:e.note,meta:e.year+' · '+e.where,href:`/work/?entry=${encodeURIComponent(e.what)}#${careerAnchor(e.what)}`})),
 ...ABOUTFETCH_ROWS.map(r=>({id:'profile:'+r.key,label:r.key,kind:'profile' as const,note:r.prose,meta:plain(r.value),href:`/#profile-${encodeURIComponent(r.key)}`})),
 ...FOCUSES.map((f,i)=>({id:'focus:'+i,label:f.kind,kind:'focus' as const,cat:f.family,note:f.what,href:`/now/#focus-${i}`,sourceHref:f.linkUrl})),
 ...CONTACT_CHANNELS.map(c=>({id:'contact:'+c.label,label:c.label,kind:'contact' as const,cat:c.c,note:c.note,meta:c.handle,href:`/contact/#channel-${c.label.toLowerCase()}`,sourceHref:c.href})),
 ...JOURNAL_ENTRIES.map((e,i)=>({id:'journal:'+i,label:e.date,kind:'journal' as const,cat:e.family,note:e.note,meta:e.note.slice(0,75),href:`/now/?entry=${i}#journal-entry-${i}`})),
];
const known=new Set(GRAPH_NODES.map(n=>n.id));
export const GRAPH_EDGES:GraphEdge[]=[
 ...GRAPH_NODES.filter(n=>n.cat&&n.kind!=='subject').map(n=>({from:'subject:'+n.cat,to:n.id,kind:'subject' as const})),
 ...ABOUTFETCH_ROWS.map(r=>({from:'page:about',to:'profile:'+r.key,kind:'page' as const})),
 ...FOCUSES.map((_,i)=>({from:'page:journal',to:'focus:'+i,kind:'page' as const})),
 ...CONTACT_CHANNELS.map(c=>({from:'page:contact',to:'contact:'+c.label,kind:'page' as const})),
 ...JOURNAL_ENTRIES.map((_,i)=>({from:'page:journal',to:'journal:'+i,kind:'page' as const})),
 ...projects.filter(p=>p.essay&&known.has('essay:'+p.essay)).map(p=>({from:'project:'+p.name,to:'essay:'+p.essay,kind:'reference' as const})),
 ...WORK_CORE_CARDS.filter(c=>c.essay&&known.has('essay:'+c.essay)).map(c=>({from:'tool:'+(CORE_TOOL_BINDINGS[c.name]||c.name),to:'essay:'+c.essay,kind:'reference' as const})),
];
export const GRAPH_KINDS:{key:NodeKind|'all';label:string}[]=[{key:'all',label:'All types'},{key:'project',label:'Projects'},{key:'essay',label:'Essays'},{key:'tool',label:'Tools'},{key:'career',label:'Career'},{key:'profile',label:'About'},{key:'journal',label:'Journal'},{key:'focus',label:'Now'},{key:'contact',label:'Contact'}];
export const GRAPH_COPY={
 motionPause:"Pause motion",motionResume:"Resume motion",motionReduced:"Motion reduced",
 title:'A map of the notebook.',intro:'Pick a subject. Follow a connection. Open the thing that interests you.',
 overview:'Whole map',search:'Find a node',placeholder:'Search every project, essay, tool, career note…',
 reset:'Reset view',zoomIn:'Zoom in',zoomOut:'Zoom out',list:'List view',graph:'Node map',
 hint:'Drag empty space to pan · + / − to zoom · Tab to a node, Enter to explore',
 mobileHint:'Drag to pan · use + / − to zoom · tap a node to explore',
 legend:'Lines: subject or page membership. Dashed arrows: an existing project/tool → essay reference.',
 empty:'No records match this lens. Choose another type or return to the whole map.',
 open:'Open this record',source:'Original link',neighbours:'Connected records',
 overviewNote:'Ten subjects connect the work and writing. About, Journal and Contact are page hubs. Open any hub to see its records.',
 accessible:'Text list of matching records',next:'Next nodes',previous:'Previous nodes',
};
