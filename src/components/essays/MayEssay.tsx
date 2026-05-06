// @ts-nocheck
import React from 'react';
import { LotkaVolterra, PullQuote, SEASONAL_THEMES } from '../legacy';

export function MayEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        During the First World War, fishing in the Adriatic more or less stopped.<span className="sidenote-number" style={{ color: p.accent }}>1</span> When it resumed, the marine biologist Umberto D'Ancona noticed something odd in the catch records from Fiume, Trieste, and Venice: the proportion of predator fish — sharks, rays, the things with teeth — had gone <em>up</em> during the war years, not down. Fewer boats, more predators. He couldn't explain it with the data alone, so he asked his father-in-law, the mathematician Vito Volterra, to try.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> Alfred Lotka arrived at the same equations a year earlier (1925, "Elements of Physical Biology"), working from autocatalytic chemistry rather than fisheries. Volterra published independently in 1926. Both names stuck. Lotka wasn't thrilled.
        </span>
      </p>

      <p>Volterra wrote two equations. They describe a system in which prey grow exponentially when left alone, predators die exponentially when they can't eat, and every encounter between the two has a chance of converting a prey into a predator. That's all. No territory, no seasons, no disease — just growth, death, and the rate at which one becomes the other.</p>

      <p style={{ textAlign: "center", margin: "1.4rem 0", fontFamily: "var(--f-mono)", fontSize: "0.95rem", color: p.ink, padding: "0.8rem", border: `1px dashed ${p.line}`, background: `color-mix(in oklch, ${p.paper} 80%, ${p.ink})` }}>
        dx/dt = αx − βxy &nbsp;&nbsp;&nbsp; dy/dt = δxy − γy
      </p>

      <p>The remarkable thing is what these two lines produce: a closed orbit in the phase plane. Prey rise, predators follow, prey crash, predators starve, prey recover — and the cycle repeats exactly, forever. The populations chase each other around a loop that never settles and never breaks.</p>

      {/* full interactive figure — locked to May */}
      <div style={{ margin: "2rem 0", padding: "0.8rem", border: `1px solid ${p.line}`, background: `color-mix(in oklch, ${p.paper} 88%, ${p.ink})` }}>
        <LotkaVolterra
          width={520}
          height={360}
          accent={p.accent}
          ink={p.ink}
          muted={p.muted}
          line={p.line}
          theme={SEASONAL_THEMES[4]}
          monthName="May"
        />
      </div>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§01</span>
        <span>What the sliders teach</span>
      </h2>

      <p>Drag β — the predation rate — upward, and predators eat more per encounter. The orbit tightens. The equilibrium shifts. Prey spend less time at their peak before the crash arrives. Drag γ — predator mortality — upward, and predators die faster between meals. The equilibrium prey population rises; the equilibrium predator population falls.</p>

      <p>This is Volterra's answer to D'Ancona's fishery puzzle. Fishing is, mathematically, an increase in predator mortality γ. When fishing stopped during the war, γ dropped — and the equilibrium shifted toward more predators and fewer prey.<span className="sidenote-number" style={{ color: p.accent }}>2</span> The proportion of predator fish in the catch went up not despite the boats being gone, but because of it. The loop explains the paradox.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> The system has a conserved quantity: V(x,y) = δx − γ ln(x) + βy − α ln(y). Its level curves are the closed orbits. Same structure as a Hamiltonian in classical mechanics — the system is conservative, and energy is neither created nor destroyed.
        </span>
      </p>

      <p>The catch — and there is always a catch with models this clean — is that those closed orbits are structurally unstable. Any perturbation breaks the exact closure. Add a hard winter, a disease, a fishing boat with a schedule, and the orbit drifts. The ninety years of lynx and snowshoe hare pelts from the Hudson Bay Company (1845–1935) show cycles of eight to eleven years, but they're not closed loops.<span className="sidenote-number" style={{ color: p.accent }}>3</span> They spiral. They shift. The model is a starting point, not a destination.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> The lynx-hare data has a further wrinkle: lynx peaks sometimes <em>lead</em> hare peaks, which the Lotka–Volterra model cannot produce. Real ecology is messier than two equations — vegetation cycles, parasites, and starvation thresholds all play roles the model ignores.
        </span>
      </p>

      <PullQuote color={p.accent}>The model is a starting point, not a destination — but you have to start somewhere, and Volterra started with a question from his son-in-law about fish.</PullQuote>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§02</span>
        <span>For Robert May</span>
      </h2>

      <p>Robert May took models like this one and asked a different question: not "do the orbits close?" but "what happens when they don't?" His 1976 paper in <em>Nature</em> — "Simple mathematical models with very complicated dynamics" — showed that even the one-dimensional logistic map, the simplest possible population model, can produce chaos.<span className="sidenote-number" style={{ color: p.accent }}>4</span> Period-doubling cascades. Apparent randomness from a deterministic rule. The paper changed how ecologists, physicists, and mathematicians think about complexity. It is one of the most cited papers in the history of science.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> The logistic map: x<sub>n+1</sub> = rx<sub>n</sub>(1 − x<sub>n</sub>). For r &lt; 3 it converges to a fixed point. For r ≈ 3.57 it goes chaotic. The route from order to chaos follows a universal constant — Feigenbaum's δ ≈ 4.669 — that appears in systems far removed from ecology.
        </span>
      </p>

      <p>May was an Australian physicist who became arguably the most important theoretical ecologist of the twentieth century. Chief Scientific Adviser to the UK government. President of the Royal Society. Baron May of Oxford. He died on 28 April 2020, aged eighty-four.</p>

      <p>The figure on this page runs every May. May 22 is the International Day for Biological Diversity — the Convention on Biological Diversity text was finalised in Nairobi on that date in 1992, then opened for signature at the Rio Earth Summit a fortnight later. The loop keeps running. The populations keep chasing each other. And somewhere in the model, between the prey that rise and the predators that follow, there is still something worth watching: the moment just before the crash, when the numbers say <em>this cannot last</em> and the system says <em>watch me</em>.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written the week the loop came back around, in a flat that overlooks no wilderness at all.</p>
    </>
  );
}
