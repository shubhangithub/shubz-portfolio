// @ts-nocheck
import React from 'react';
import { Figure, PullQuote } from '../legacy';

// ---------------------------------------------------------------------------
// Gray-Scott reaction-diffusion simulation — essay interactive figure.
// Larger grid than the home-page NotebookRD; F and k are tuneable live.
// ---------------------------------------------------------------------------

const GW = 130, GH = 90;
const DU = 0.16, DV = 0.08;
const STEPS = 4;

const PRESETS = [
  { name: "spots",   F: 0.035, k: 0.065 },
  { name: "stripes", F: 0.022, k: 0.051 },
  { name: "worms",   F: 0.026, k: 0.055 },
  { name: "chaos",   F: 0.010, k: 0.047 },
];

function parseHex(h) {
  if (h && h[0] === "#" && h.length >= 7)
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  return [20, 20, 20];
}

function makeGrid() {
  const u = new Float32Array(GW * GH).fill(1);
  const v = new Float32Array(GW * GH);
  const seeds = [
    [GW/2, GH/2], [GW/4, GH/4], [3*GW/4, GH/4],
    [GW/4, 3*GH/4], [3*GW/4, 3*GH/4],
    [GW/2, GH/4], [GW/2, 3*GH/4],
    [GW/4, GH/2], [3*GW/4, GH/2],
  ];
  seeds.forEach(([sx, sy]) => {
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const ix = ((Math.floor(sx)+dx+GW)%GW) + ((Math.floor(sy)+dy+GH)%GH)*GW;
        u[ix] = 0.5 + (Math.random()-0.5)*0.1;
        v[ix] = 0.25 + (Math.random()-0.5)*0.05;
      }
    }
  });
  return { u, v, nu: new Float32Array(GW*GH), nv: new Float32Array(GW*GH) };
}

function TuringRDFigure({ palette: p }) {
  const W = 520, H = 360;
  const [activePreset, setActivePreset] = React.useState("spots");
  const [sliderF, setSliderF] = React.useState(0.035);
  const [sliderK, setSliderK] = React.useState(0.065);

  const canvasRef  = React.useRef(null);
  const stateRef   = React.useRef(null);
  const paramsRef  = React.useRef({ F: 0.035, k: 0.065 });

  // Sync params ref + reinit grid whenever F/k change
  React.useEffect(() => {
    paramsRef.current = { F: sliderF, k: sliderK };
    stateRef.current  = makeGrid();
  }, [sliderF, sliderK]);

  // Animation loop — restarts only when palette changes
  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width  = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const [pr, pg, pb] = parseHex(p.paper);
    const [ar, ag, ab] = parseHex(p.accent);

    stateRef.current = makeGrid();

    const off = document.createElement("canvas");
    off.width = GW; off.height = GH;
    const oc  = off.getContext("2d");
    const img = oc.createImageData(GW, GH);

    function step() {
      const { u, v, nu, nv } = stateRef.current;
      const { F, k } = paramsRef.current;
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          const i  = x + y*GW;
          const xp = (x+1)%GW, xm = (x-1+GW)%GW;
          const yp = (y+1)%GH, ym = (y-1+GH)%GH;
          const lu = u[xp+y*GW]+u[xm+y*GW]+u[x+yp*GW]+u[x+ym*GW]-4*u[i];
          const lv = v[xp+y*GW]+v[xm+y*GW]+v[x+yp*GW]+v[x+ym*GW]-4*v[i];
          const uvv = u[i]*v[i]*v[i];
          nu[i] = Math.max(0, Math.min(1, u[i]+DU*lu-uvv+F*(1-u[i])));
          nv[i] = Math.max(0, Math.min(1, v[i]+DV*lv+uvv-(F+k)*v[i]));
        }
      }
      stateRef.current.u.set(nu);
      stateRef.current.v.set(nv);
    }

    function render() {
      const { v } = stateRef.current;
      for (let i = 0; i < GW*GH; i++) {
        const t = Math.min(v[i]*5, 1);
        const j = i*4;
        img.data[j]   = Math.round(pr+(ar-pr)*t);
        img.data[j+1] = Math.round(pg+(ag-pg)*t);
        img.data[j+2] = Math.round(pb+(ab-pb)*t);
        img.data[j+3] = 255;
      }
      oc.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, W, H);
    }

    let raf = 0;
    function loop() {
      for (let s = 0; s < STEPS; s++) step();
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.paper, p.accent, p.ink, p.muted]);

  function applyPreset(preset) {
    setActivePreset(preset.name);
    setSliderF(preset.F);
    setSliderK(preset.k);
  }

  const sliderStyle = {
    width: "100%", accentColor: p.accent, cursor: "pointer",
    background: "transparent", outline: "none",
  };
  const labelStyle = {
    fontFamily: "var(--f-mono)", fontSize: 11, color: p.muted,
    display: "flex", justifyContent: "space-between", marginBottom: 4,
  };

  return (
    <div>
      {/* simulation canvas */}
      <canvas
        ref={canvasRef}
        width={W} height={H}
        style={{ width: W, height: H, display: "block", maxWidth: "100%" }}
      />

      {/* controls */}
      <div style={{
        marginTop: 12, padding: "0.9rem 1rem",
        border: `1px solid ${p.line}`,
        background: `color-mix(in oklch, ${p.paper} 85%, ${p.ink})`,
        display: "grid", gap: "0.8rem",
      }}>
        {/* preset buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontFamily: "var(--f-ui)", fontSize: 11 }}>
          <span style={{ color: p.muted, fontFamily: "var(--f-mono)", alignSelf: "center", marginRight: 4 }}>regime →</span>
          {PRESETS.map(preset => (
            <button key={preset.name} onClick={() => applyPreset(preset)} style={{
              all: "unset", cursor: "pointer",
              padding: "3px 10px",
              border: `1px solid ${activePreset === preset.name ? p.accent : p.line}`,
              color: activePreset === preset.name ? p.accent : p.muted,
              background: activePreset === preset.name ? `color-mix(in oklch, ${p.paper} 80%, ${p.accent})` : "transparent",
              letterSpacing: "0.06em", transition: "all 160ms",
            }}>
              {preset.name}
            </button>
          ))}
        </div>

        {/* F slider */}
        <div>
          <div style={labelStyle}>
            <span>F — feed rate</span>
            <span style={{ color: p.ink }}>{sliderF.toFixed(3)}</span>
          </div>
          <input type="range" min="0.010" max="0.060" step="0.001"
            value={sliderF} onChange={e => { setSliderF(+e.target.value); setActivePreset("custom"); }}
            style={sliderStyle}
          />
        </div>

        {/* k slider */}
        <div>
          <div style={labelStyle}>
            <span>k — kill rate</span>
            <span style={{ color: p.ink }}>{sliderK.toFixed(3)}</span>
          </div>
          <input type="range" min="0.040" max="0.075" step="0.001"
            value={sliderK} onChange={e => { setSliderK(+e.target.value); setActivePreset("custom"); }}
            style={sliderStyle}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Essay body
// ---------------------------------------------------------------------------

export function TuringEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        In 1951, Alan Turing wrote to the zoologist J.Z. Young that he was working on a mathematical theory of embryonic development.<span className="sidenote-number" style={{ color: p.accent }}>1</span> Not the mathematics of neurons or of machines — he had done those — but the mathematics of how a fertilised egg, which is roughly spherically symmetric, becomes an organism that is not. Head at one end, tail at the other, limbs in the right places. Something breaks the symmetry. Turing wanted to know where the instruction comes from.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> Letter to J.Z. Young, 8 February 1951. The morphogenesis paper was submitted to the Royal Society the same year and published on 14 August 1952: "The Chemical Basis of Morphogenesis," Phil. Trans. R. Soc. Lond. B 237(641):37–72. It was his last major mathematical publication.
        </span>
      </p>

      <p>His answer was two equations. Two chemical substances — he called them morphogens — diffuse through tissue and react with each other. Under most conditions this produces nothing interesting: any small deviation from a uniform concentration smooths out, because diffusion is a smoothing process. But Turing showed that if one morphogen diffuses sufficiently faster than the other, the uniform state becomes unstable. Perturbations amplify instead of decaying. A pattern appears from a system that had none.</p>

      <p>The counterintuitive part is that the instability is caused by diffusion. The process that normally erases gradients is, under the right conditions, what creates them.</p>

      <p style={{ textAlign: "center", margin: "1.4rem 0", fontFamily: "var(--f-mono)", fontSize: "0.95rem", color: p.ink, padding: "0.8rem", border: `1px dashed ${p.line}`, background: `color-mix(in oklch, ${p.paper} 80%, ${p.ink})` }}>
        ∂u/∂t = D<sub>u</sub>∇²u + f(u,v) &nbsp;&nbsp;&nbsp; ∂v/∂t = D<sub>v</sub>∇²v + g(u,v)
      </p>

      <p>Two morphogens, u and v — Turing's own variables were X and Y; u and v are modern notation.<span className="sidenote-number" style={{ color: p.accent }}>2</span> Each diffuses (the ∇² terms) and each reacts with the other (f and g). The reaction kinetics make one morphogen locally self-amplifying and the other suppress it from a distance. The vocabulary of activator and inhibitor for those two roles came later, from Gierer and Meinhardt in 1972.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> Turing used linear reaction kinetics in the 1952 paper, which permits negative concentrations — physically impossible. He acknowledged this and set it aside. Gierer and Meinhardt (1972, <em>Kybernetik</em> 12:30–39) independently developed the activator–inhibitor formalism with nonlinear kinetics; a referee pointed out the connection to Turing's work after the fact.
        </span>
      </p>

      {/* interactive figure */}
      <div style={{ margin: "2rem 0" }}>
        <div style={{ padding: "0.8rem", border: `1px solid ${p.line}`, background: `color-mix(in oklch, ${p.paper} 88%, ${p.ink})` }}>
          <TuringRDFigure palette={p} />
        </div>
        <div className="mono" style={{ marginTop: 8, fontSize: 10, color: p.muted, display: "flex", justifyContent: "space-between" }}>
          <span>fig.01 — Gray–Scott reaction-diffusion · v-field concentration</span>
          <span>D<sub>u</sub>=0.16 · D<sub>v</sub>=0.08</span>
        </div>
      </div>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>What the figure shows</span>
      </h2>

      <p>The simulation above runs the Gray–Scott model — a reaction-diffusion system published by Peter Gray and Stephen Scott in 1983 and 1984, different from Turing's original but well-studied and computationally tractable.<span className="sidenote-number" style={{ color: p.accent }}>3</span> The parameters F and k control the feed rate (how fast the substrate u is replenished from a reservoir) and the kill rate (how fast the autocatalytic species v decays). Small changes produce qualitatively different patterns.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> Gray, P. & Scott, S.K. (1983). <em>Chem. Eng. Sci.</em> 38(1):29–43; (1984) 39(6):1087–1097. The parameter zoo was mapped by Pearson (1993, <em>Science</em> 261:189–192). Not all Gray–Scott patterns arise via Turing instability — some regimes involve bistability and front propagation rather than diffusion-driven instability of a homogeneous state.
        </span>
      </p>

      <p>The four presets sample distinct regimes: spots (F=0.035, k=0.065) settle into a hexagonal array; stripes (F=0.022, k=0.051) produce parallel bands; worms (F=0.026, k=0.055) give branching filaments; chaos (F=0.010, k=0.047) produces no stable structure. In all cases the pattern emerges from a nearly uniform initial state plus a small perturbation. Move the F and k sliders and watch the regime shift — the spot-to-stripe transition is particularly clean and happens over a narrow parameter range.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>The condition</span>
      </h2>

      <p>Turing's result is sometimes stated as a guideline: the inhibitor should diffuse faster than the activator. It is not a guideline. In a two-species system with diagonal diffusion, it is a mathematical requirement.</p>

      <p>The analysis runs as follows: linearise around the homogeneous steady state, then examine what happens to a small spatial perturbation of wave-number k. This produces a dispersion relation — a function h(k²) — and Turing instability requires h(k²) to be negative for some k. Working through the algebra, this forces a condition on the diffusion ratio d = D<sub>v</sub>/D<sub>u</sub>: d must exceed a critical value d<sub>c</sub> that depends on the reaction kinetics. That critical ratio is strictly greater than 1. So D<sub>v</sub> &gt; D<sub>u</sub> is necessary, not a rule of thumb.<span className="sidenote-number" style={{ color: p.accent }}>4</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> In full: four conditions on the Jacobian J of the reaction kinetics must hold simultaneously — (C1) tr(J) &lt; 0 and (C2) det(J) &gt; 0 ensure the steady state is stable without diffusion; (C3) D<sub>v</sub>·f<sub>u</sub> + D<sub>u</sub>·g<sub>v</sub> &gt; 0 and (C4) (D<sub>v</sub>·f<sub>u</sub> + D<sub>u</sub>·g<sub>v</sub>)² &gt; 4·D<sub>u</sub>·D<sub>v</sub>·det(J) together ensure instability at some spatial wavelength. Condition C3 with the activator–inhibitor sign pattern requires D<sub>v</sub>/D<sub>u</sub> &gt; |g<sub>v</sub>|/f<sub>u</sub> &gt; 1 strictly. Cross-diffusion (where each species moves in response to the other's gradient) can relax this requirement, but that is a different class of system.
        </span>
      </p>

      <p>The intuition: the activator amplifies itself locally. The inhibitor responds to the activator, but because it diffuses faster it carries the suppression signal to neighbouring regions before the activation can propagate there. Local activation, long-range inhibition. The spatial wavelength of the resulting pattern is set by the ratio D<sub>v</sub>/D<sub>u</sub> and the reaction rates — which is why Hox gene expression, by tuning those rates, can change digit spacing without changing the underlying mechanism.</p>

      <PullQuote color={p.accent}>The process that normally erases gradients is, under the right conditions, what creates them.</PullQuote>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§03</span>
        <span>Does it actually happen</span>
      </h2>

      <p>Turing predicted the mechanism but had no experimental system to test it. The first laboratory confirmation came 38 years after the paper was published.</p>

      <p>In 1990, Castets, Dulos, Boissonade, and De Kepper demonstrated stationary Turing-type patterns in the chlorite–iodide–malonic acid (CIMA) reaction in a gel.<span className="sidenote-number" style={{ color: p.accent }}>5</span> Not a biological system — a chemical one. The critical ingredient was starch in the gel, which bound to iodide and slowed the activator's effective diffusion rate, creating the diffusion ratio the instability requires. The first Turing pattern in a real experiment was essentially an engineered diffusion asymmetry.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>5.</strong> Castets, V., Dulos, E., Boissonade, J. & De Kepper, P. (1990). "Experimental evidence of a sustained standing Turing-type nonequilibrium chemical pattern." <em>Phys. Rev. Lett.</em> 64(24):2953–2956.
        </span>
      </p>

      <p>Biology took longer. In 1995 Kondo and Asai showed that the stripe patterns on the marine angelfish <em>Pomacanthus</em> rearrange in ways qualitatively consistent with a Turing mechanism — the spatial dynamics matched the model's predictions, but the molecular pair was not identified.<span className="sidenote-number" style={{ color: p.accent }}>6</span> The stronger claim came in 2009, when Nakamasu and colleagues showed that two pigment cell types in zebrafish — melanophores and xanthophores — interact in a way that satisfies the Turing conditions directly: short-range activation, long-range inhibition, measured in living tissue.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>6.</strong> Kondo, S. & Asai, R. (1995). "A reaction-diffusion wave on the skin of the marine angelfish <em>Pomacanthus</em>." <em>Nature</em> 376:765–768. The stronger cellular evidence: Nakamasu, A., Takahashi, G., Kanbe, A. & Kondo, S. (2009). <em>PNAS</em> 106(21):8429–8434.
        </span>
      </p>

      <p>In 2006 Sick and colleagues identified WNT and DKK as a Turing pair — in hair follicle spacing in mice, where WNT (activator) and DKK (inhibitor) set the distance between follicles.<span className="sidenote-number" style={{ color: p.accent }}>7</span> Digit patterning required separate work: Sheth et al. (2012) showed Hox genes tune the wavelength of a Turing-type mechanism in developing limb buds, and Raspopovic et al. (2014) identified BMP, Sox9, and WNT as the molecular Turing network controlling digit number and spacing.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>7.</strong> Sick, S., Reinker, S., Timmer, J. & Schlake, T. (2006). "WNT and DKK determine hair follicle spacing through a reaction-diffusion mechanism." <em>Science</em> 314(5804):1447–1450. Digit papers: Sheth, R. et al. (2012). <em>Science</em> 338:1476–1480; Raspopovic, J., Marcon, L., Russo, L. & Sharpe, J. (2014). <em>Science</em> 345:566–570.
        </span>
      </p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§04</span>
        <span>For Alan Turing</span>
      </h2>

      <p>Alan Turing was born on 23 June 1912 at a nursing home on Warrington Crescent in Maida Vale, London. The morphogenesis paper was submitted to the Royal Society in November 1951 and published the following August — the same year he was convicted of gross indecency and sentenced to chemical castration. He died on 7 June 1954 at his home in Wilmslow, Cheshire. He was 41. Cyanide poisoning was confirmed at the post-mortem. A half-eaten apple was found beside the body; it was never tested.</p>

      <p>The morphogenesis paper was largely ignored for two decades. It belongs to a category of work that is only obvious in retrospect: Turing had the mechanism right, but the experimental tools to identify morphogen pairs in any specific organism did not yet exist, and the broader mathematical biology community was small. Castets' chemical confirmation arrived 38 years after the paper was submitted. The cellular mechanism in zebrafish came 57 years after it. Both are recent enough that researchers who read the 1952 paper as undergraduates lived to see it confirmed in living tissue.</p>

      <p>The pattern the figure runs on is one Turing described from a system of equations on a typewriter in a rented house, before anyone had a way to check whether it was real.</p>

      <p>This figure runs every June.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written on his birthday, in London, where he was born.</p>
    </>
  );
}
