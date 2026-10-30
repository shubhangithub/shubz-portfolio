// Explicit links supported by the project descriptions; topic membership alone
// never claims a tool was used in a project.
import {WORK_FEATURED_V5, WORK_BUILDS_LIST_V5} from './work';
import {projectAnchor} from './discovery';
const projects=[...WORK_FEATURED_V5,...WORK_BUILDS_LIST_V5];
const bindings:Record<string,string>={
 'Prompt engineering · few-shot · decision trees':'Orion intelligence platform',
 'Geospatial ML · H3 indexing':'Orion intelligence platform',
 'Anomaly detection':'Orion intelligence platform',
 'Confidence-weighted fusion':'Orion intelligence platform',
 'ETL · data pipelines':'Orion intelligence platform',
 'Gemini API':'fashion-web',
 'Time-series forecasting · Holt-Winters':'fashion-web',
 'Calibration · Brier scoring':'fashion-web',
 'Constrained · spectral clustering':'MFoCS thesis · immune biomarkers',
 'Automated thresholding':'MFoCS thesis · immune biomarkers',
 'Image processing (multiplex IF)':'MFoCS thesis · immune biomarkers',
 'Feature selection':'JAYA protein feature selection',
 'Sentiment + theme extraction':'Flipkart–Walmart merger NLP',
 'GNSS atmospheric modelling':'GNSS water-vapour ML',
 'Ensemble methods':'Taylor Swift recommendation engine',
 'FastAPI':'Taylor Swift recommendation engine',
 'R':'Taylor Swift rec engine — R/Shiny',
 'IoT · microcontrollers · ThingSpeak':'IoT weather bot',
 'Compiler · VM design':'Nand2Tetris — 16-bit computer',
 'HDL · gate-level design':'Nand2Tetris — 16-bit computer',
 'Cryptography · number theory':'layered cipher',
 'Next.js · Supabase · Resend':'platypus-learn',
 'SVG · canvas diagrams':'this site',
};
export const TOOL_PROJECT_SOURCES=Object.fromEntries(Object.entries(bindings).flatMap(([tool,name])=>{
 const project=projects.find(p=>p.name===name);
 return project?[[tool,{name,cat:project.cat,href:`/builds/?project=${encodeURIComponent(name)}#${projectAnchor(name)}`}]]:[];
})) as Record<string,{name:string;cat:typeof projects[number]['cat'];href:string}>;
