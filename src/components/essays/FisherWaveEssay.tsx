// @ts-nocheck
import { PullQuote } from '../essay/PullQuoteReact';
import { FisherFront } from '../diagrams/FisherFront';
import { WaveSpeedLaw } from '../diagrams/WaveSpeedLaw';

export function FisherWaveEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        In 1905, a Bohemian landowner imported five muskrats from North America because he liked the fur, and let all five loose in a pond on his estate to breed.<span className="sidenote-number" style={{ color: p.accent }}>1</span> Within twenty years his five rodents were millions, they'd taken a big chunk of central Europe, and the best part is they spread so evenly it looked rigged: an expanding circle whose edge crept outward by the same number of kilometres every single year.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> J. G. Skellam reconstructed the invasion from trapping records ("Random dispersal in theoretical populations," <em>Biometrika</em> 38, 1951). Plot the square root of the occupied area against time and you get a straight line — the fingerprint of a front moving at constant speed. The animal is <em>Ondatra zibethicus</em>; the release is pinned to the Colloredo-Mansfeld estate near Dobříš. Nobody consulted the muskrats.
        </span>
      </p>

      <figure style={{ margin: "2rem 0 2.4rem" }}>
        <img
          src="/thumbs/fisher-wave.jpg"
          alt="Coloured-pencil drawing of a muskrat sitting in grass"
          width={1161}
          height={727}
          loading="eager"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            border: `1px solid ${p.line}`,
            background: p.paper,
          }}
        />
        <figcaption style={{ marginTop: "0.55rem", fontFamily: "var(--f-mono)", fontSize: "0.72rem", lineHeight: 1.5, color: p.muted }}>
          Muskrat, 9 December 2016. Artwork by <cite style={{ color: p.ink, fontStyle: "normal" }}>Raghuveer Parthasarathy</cite>, University of Oregon.
        </figcaption>
      </figure>

      <p>A constant speed is suspicious. Nature almost never holds a steady rate — things accelerate, saturate, crash, or wobble. A straight line usually means something very simple is running the show underneath. R. A. Fisher wrote down what in 1937 — about three decades after the muskrats got loose and started proving it without him.</p>

      <p>Two ingredients, that's the whole model. Things wander at random — diffusion. And wherever they land they breed, fast at first, then easing off as the place fills up — the logistic term.</p>

      <p style={{ textAlign: "center", margin: "1.4rem 0", fontFamily: "var(--f-mono)", fontSize: "0.95rem", color: p.ink, padding: "0.9rem", border: `1px dashed ${p.line}`, background: `color-mix(in srgb, ${p.paper} 80%, ${p.ink})` }}>
        ∂u/∂t = D · ∂²u/∂x² &nbsp;+&nbsp; r · u(1 − u)
      </p>

      <p><em>u</em> is just a fraction between 0 and 1: how full a patch is, or — Fisher's actual question — how common a useful gene has got.<span className="sidenote-number" style={{ color: p.accent }}>2</span> He was doing evolution, not rodents. The muskrats didn't read the paper but happened to obey the same equation.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> "The wave of advance of advantageous genes," <em>Annals of Eugenics</em> 7 (1937), 355–369. Yes, that was the actual name of the journal. We'll come back to it.
        </span>
      </p>

      {/* interactive travelling-front figure */}
      <div style={{ margin: "2rem 0", padding: "0.8rem", border: `1px solid ${p.line}`, background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})` }}>
        <FisherFront palette={p} />
      </div>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>What the figure shows</span>
      </h2>

      <p>A travelling wave is a shape that moves without ever changing shape. Behind it the new thing has won (<em>u</em> → 1); ahead of it the old world carries on, oblivious (<em>u</em> → 0); the join between them just slides. The only real question sounds dull: how fast?</p>

      <p>Irritatingly, there's no single answer — a wave exists for every speed above a minimum, c* = 2√(rD). Then reality hands you one anyway. Start from a localised clump — invaders dumped on an empty map, one mutation in one place — and out of every speed it's allowed, the front picks the slowest.<span className="sidenote-number" style={{ color: p.accent }}>3</span> It could go faster. It doesn't.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> The speed is decided at the leading edge, where <em>u</em> is tiny and u(1 − u) ≈ ru. There the equation goes linear — u<sub>t</sub> = D·u<sub>xx</sub> + ru — and that linear tip travels at exactly 2√(rD). The crowded bulk behind it just keeps up. Fronts like this, where the sparse tip does the work and drags the rest along, are actually called "pulled."
        </span>
      </p>

      <p>So the whole result is c* = 2√(rD). Quadruple the growth rate and the wave only doubles — the square root gives with one hand and takes with the other. Same story for diffusion. In the figure, turning <em>r</em> up speeds the front and sharpens it at the same time, because the speed (2√(rD)) and the front's width (~√(D/r)) are hostage to the same two numbers.</p>

      {/* the wave-speed law */}
      <div style={{ margin: "2rem 0", padding: "0.8rem", border: `1px solid ${p.line}`, background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})` }}>
        <WaveSpeedLaw palette={p} />
      </div>

      <PullQuote color={p.accent}>The same operator Turing used last month to grow a pattern out of nothing, Fisher used to shove one across a continent.</PullQuote>

      <p>Skellam's muskrats are just this in two dimensions: the radius grows at c*, so √area comes out linear, so his plot is a straight line. The same shape turns up anywhere something breeds and spreads — Neolithic farming crawling across Europe at about a kilometre a year, tumours pushing into tissue, the leading edge of a fire.<span className="sidenote-number" style={{ color: p.accent }}>4</span> Cheerful list.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> Ammerman &amp; Cavalli-Sforza clocked the farming "wave of advance" at ~1 km/year (<em>Man</em> 6, 1971) — slow enough that it reads as people migrating, not the idea of farming outrunning the farmers. And a flame front is a reaction-diffusion wave for real: heat diffuses, fuel reacts. 
        </span>
      </p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>For R. A. Fisher</span>
      </h2>

      <p>You can't write about Fisher without a "but," so here it is early. He co-founded population genetics and more or less built modern statistics single-handed — every ANOVA, every maximum-likelihood anything, that's him. He also edited a journal called the <em>Annals of Eugenics</em> and published there on purpose, and his enthusiasm for eugenics was not some passing quirk of the era. I'm not going to tidy that into a footnote.<span className="sidenote-number" style={{ color: p.accent }}>5</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>5.</strong> The same year, three Moscow mathematicians — Kolmogorov, Petrovsky and Piskunov — wrote down the same equation independently and did the bit Fisher skipped: they <em>proved</em> localised starts converge to the minimum-speed wave. Fisher's version was a very good hunch. So it's Fisher–KPP — four names, one wave. Kolmogorov had already axiomatised probability itself a few years earlier (1933), because apparently one field wasn't enough.
        </span>
      </p>

      <p>This is a very cheap result. No fitted parameters, no simulation, no cluster — two things every living thing already does, spreading and breeding, producing a number you can check with a map and a calendar.</p>

      <p>Fisher died on 29 July 1962 in Adelaide, about as far from Cambridge as you can get without a boat and real commitment. The wave still carries his name — plus, in fairness, three he never met.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written in July, at a desk the muskrats have so far declined to reach.</p>
    </>
  );
}
