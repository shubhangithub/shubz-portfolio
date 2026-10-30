import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DISCOVERY_COPY as COPY } from '../../data/notebook';

type Cue = 'open' | 'close' | 'terminal' | 'pen' | 'pet' | 'step';
type SoundState = { enabled: boolean; available: boolean; toggle: () => void; play: (cue: Cue) => void };
const SoundContext = createContext<SoundState>({enabled:false,available:true,toggle:()=>{},play:()=>{}});
export const useWorkbenchSound = () => useContext(SoundContext);
// Short signatures share a quiet sine/triangle voice; no samples or ambient loops.
const audioConstructor = () => window.AudioContext || (window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
const NOTES: Record<Cue,number[]> = {
  open:[330,495], close:[330,247], terminal:[440,660,880],
  pen:[740,990], pet:[180,240,210], step:[280,350],
};
export function WorkbenchSoundProvider({children}:{children:React.ReactNode}) {
  const [enabled,setEnabled]=useState(false);
  const [available,setAvailable]=useState(true);
  const enabledRef=useRef(false);
  const context=useRef<AudioContext>();
  const output=useRef<GainNode>();
  const last=useRef(0);
  const active=useRef(new Set<OscillatorNode>());
  useEffect(()=>{
    setAvailable(typeof audioConstructor()==='function');
    try {enabledRef.current=localStorage.getItem('notebook-sound')==='on';setEnabled(enabledRef.current);}catch{}
    return ()=>{active.current.forEach(o=>{try{o.stop();}catch{}});void context.current?.close().catch(()=>{});};
  },[]);
  const silence=useCallback(()=>{
    if(context.current&&output.current) output.current.gain.setValueAtTime(0,context.current.currentTime);
    active.current.forEach(o=>{try{o.stop();}catch{}});active.current.clear();
  },[]);
  const play=useCallback((cue:Cue)=>{
    if(!enabledRef.current||typeof audioConstructor()!=='function'||document.visibilityState!=='visible')return;
    const now=performance.now();if(now-last.current<110)return;last.current=now;
    try {
      // This function is invoked by deliberate controls, never a mount/timer effect.
      const Constructor=audioConstructor()!;
      const ctx=context.current??(context.current=new Constructor());
      if(!output.current){output.current=ctx.createGain();output.current.connect(ctx.destination);}
      const master=output.current;
      const schedule=()=>{
        if(!enabledRef.current||ctx.state!=='running')return;
        master.gain.setValueAtTime(.32,ctx.currentTime);
        NOTES[cue].forEach((frequency,i)=>{
          const osc=ctx.createOscillator(),gain=ctx.createGain();
          const start=ctx.currentTime+i*.045,end=start+.105;
          osc.type=cue==='pet'?'triangle':'sine';osc.frequency.setValueAtTime(frequency,start);
          gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.3,start+.009);gain.gain.exponentialRampToValueAtTime(.001,end);
          osc.connect(gain);gain.connect(master);active.current.add(osc);
          osc.onended=()=>{active.current.delete(osc);osc.disconnect();gain.disconnect();};
          osc.start(start);osc.stop(end+.01);
        });
      };
      // Safari can return an interrupted context after leaving the app.
      // Resume synchronously from this trusted tap, before scheduling the cue.
      if(ctx.state!=='running')void ctx.resume().then(schedule).catch(()=>{});else schedule();
    }catch{setAvailable(false);enabledRef.current=false;setEnabled(false);}
  },[]);
  const toggle=()=>{
    const next=!enabledRef.current;enabledRef.current=next;setEnabled(next);
    try{localStorage.setItem('notebook-sound',next?'on':'off');}catch{}
    if(next){last.current=0;play('open');}else silence();
  };
  useEffect(()=>{const hide=()=>{if(document.hidden)silence();};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide);},[silence]);
  return <SoundContext.Provider value={{enabled,available,toggle,play}}>{children}</SoundContext.Provider>;
}
export function SoundToggle({compact=false}:{compact?:boolean}){
  const sound=useWorkbenchSound();
  return <button className={`workbench-sound${compact?" sound-compact":""}`} aria-label={sound.available?(sound.enabled?"Mute site sounds":"Enable site sounds"):COPY.soundUnavailable} type="button" aria-pressed={sound.enabled} disabled={!sound.available} title={sound.available?COPY.soundHint:COPY.soundUnavailable} onClick={sound.toggle}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/>{sound.enabled?<><path d="M16 8q4 4 0 8M19 5q7 7 0 14"/></>:<path d="m17 9 5 6m0-6-5 6"/>}</svg>{!compact&&(sound.available?(sound.enabled?COPY.soundOn:COPY.soundOff):COPY.soundUnavailable)}</button>;
}
/** Native disclosure feedback is captured before the browser toggles it. */
export function SoundSurface({children}:{children:React.ReactNode}){
  const sound=useWorkbenchSound();
  return <div className="sound-surface" onClickCapture={e=>{
    const target=e.target as Element;
    if(target.closest('.workbench-sound,.companion,.pixel-station'))return;
    const summary=target.closest('summary');
    if(summary&&!target.closest('a')){sound.play((summary.parentElement as HTMLDetailsElement).open?'close':'open');return;}
    const control=target.closest('button,input[type="checkbox"]');
    if(control&&!control.hasAttribute('disabled')&&control.getAttribute('aria-disabled')!=='true')sound.play('pen');
  }}>{children}</div>;
}
