import { CatCompanion } from "../chrome/RoboCat";
import { TTY_COPY } from "../../data/notebook";
import { useState } from 'react';
import { NotebookShell, NotebookTerminal, type PageProps } from '../chrome/Notebook';
import { NOTEBOOK_NAV } from '../../data/notebook';
export function TtyV6({dark,toggleTheme}:PageProps) {
 const [map,setMap]=useState(false);
 return <NotebookShell current="tty" mode={dark?'dark':'light'} onToggle={toggleTheme}><main id="main" className="folio-main tty-desk" tabIndex={-1}><div className="tty-heading"><span className="eyebrow"><span className="chapter chapter-side">{TTY_COPY.chip}</span>{TTY_COPY.label}</span><h1>{TTY_COPY.title}<br/><em>{TTY_COPY.titleEm}</em></h1><p>Try <code>help</code>, follow a path, or choose a different pen.</p></div><NotebookTerminal full onTheme={toggleTheme}/><CatCompanion placement="terminal"/><section className="tty-map"><button className="text-button" aria-expanded={map} onClick={()=>setMap(!map)}>{map?'fold away the map':'unfold the notebook map'} {map?'↶':'↳'}</button>{map&&<nav aria-label="Notebook map">{NOTEBOOK_NAV.map(n=><a href={n.path} key={n.key}><span>{n.act}</span><strong>{n.label}</strong><code>{n.path}</code><span>↗</span></a>)}</nav>}</section></main></NotebookShell>;
}
