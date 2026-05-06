// @ts-nocheck
import React from 'react';
import { FeatureSelectionViz, Figure, JayaSwarm, PullQuote } from '../legacy';

export function JayaEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        The thing they don't tell you about a "parameter-free" optimizer is that it has no parameters because <em>you</em> haven't added them yet.<span className="sidenote-number" style={{ color: p.accent }}>1</span> JAYA — Sanskrit for victory, named by R. Venkata Rao in 2016 — needs only a population size and a stopping rule, and that minimalism is exactly what makes it interesting to break.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> "Parameter-free" almost always means "the parameters are baked in." It's a design choice you cannot tune, which is a parameter pretending to be a virtue.
        </span>
      </p>

      <p>In the summer of 2022 I was a research intern with Prof. Jayaraman Valadi at FLAME University, working on feature selection for protein-function identification with four other students.<span className="sidenote-number" style={{ color: p.accent }}>2</span> The task: given a dataset with hundreds of attributes per protein, find the small subset that carries maximum information — and discard the rest before the classifier overfits on noise. JAYA had a reputation for being good at this kind of stochastic search. We wanted to know if a couple of targeted modifications could push it further.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> The other four were Nandini Gandhi, Oom Rawat, Hrushikesh Bhosale, and Aamod Sane. The poster ended up listing all of us — feature-selection work isn't really a one-person sport.
        </span>
      </p>

      <PullQuote color={p.accent}>"Parameter-free" almost always means the parameters are baked in.</PullQuote>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§01</span>
        <span>JAYA, briefly</span>
      </h2>

      <p>JAYA's update rule fits in a tweet. For each candidate <span className="mono">x_i</span> in the population, you nudge it toward the current best <span className="mono">x_b</span> and away from the current worst <span className="mono">x_w</span>:</p>

      <p style={{ textAlign: "center", margin: "1.4rem 0", fontFamily: "var(--f-mono)", fontSize: "0.95rem", color: p.ink, padding: "0.8rem", border: `1px dashed ${p.line}`, background: `color-mix(in oklch, ${p.paper} 80%, ${p.ink})` }}>
        x_i' = x_i + r₁ (x_b − |x_i|) − r₂ (x_w − |x_i|)
      </p>

      <p>where <span className="mono">r₁</span> and <span className="mono">r₂</span> are uniform random in <span className="mono">[0,1]</span>. That's it. No inertia term. No crossover rate. No mutation rate. The only knobs are how many candidates and how long to run.<span className="sidenote-number" style={{ color: p.accent }}>3</span> This is an honestly good design.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> Compared with PSO (which needs an inertia weight, a cognitive coefficient, and a social coefficient) or GA (crossover rate, mutation rate, selection scheme), JAYA is dramatically less fiddly to set up. You can run it in twenty lines of Python.
        </span>
      </p>

      <p>It is also a design that throws away most of what genetic algorithms learned in the 1970s about searching combinatorial spaces. Crossover lets two candidates trade genes. Mutation prevents premature convergence on a local optimum. JAYA replaces both with "be more like the best, less like the worst," which is closer to gradient descent than evolution.</p>

      <Figure caption="A 14-candidate JAYA population on a smooth landscape. The cluster moves toward the marked optimum each generation; nothing else is doing the work." palette={p}>
        <JayaSwarm palette={p} />
      </Figure>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§02</span>
        <span>Two modifications</span>
      </h2>

      <p>Our modifications were aimed at two things the original JAYA doesn't account for when doing feature selection.</p>

      <p>First, <strong>the fitness function</strong>. Vanilla JAYA, used for feature selection, will happily score a 50-feature subset and a 5-feature subset on accuracy alone — and accuracy almost always rewards more features, at least until the classifier overfits and falls off the cliff. We defined a fitness function that characterises the trade-off between subset size and accuracy, so the algorithm is rewarded for finding smaller subsets that still classify well. This was the modification that did the most work.</p>

      <Figure caption="Feature selection as a trade-off: each dot is a candidate subset. x = how many features, y = how accurate. The dashed line is the fitness threshold — drag it to see which candidates survive. Over generations, the population drifts toward smaller, more accurate subsets." palette={p}>
        <FeatureSelectionViz palette={p} />
      </Figure>

      <p>Second, <strong>elitism</strong>: preserving the best individuals across iterations rather than letting them be overwritten by the stochastic update. Without it, a good solution found early can be lost to random drift in later generations. With it, the population has a floor — the best solution so far is always in the mix.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§03</span>
        <span>Three protein datasets</span>
      </h2>

      <p>We tested on three datasets, each posing a different feature-selection challenge:</p>

      <ol style={{ margin: "1.2rem 0", paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li><strong>Apolipoprotein identification</strong> — distinguishing apolipoproteins from other plasma proteins.</li>
        <li><strong>Cancer-related protein identification</strong> — proteins associated with tumour pathways.</li>
        <li><strong>Toxin protein identification</strong> — protein toxins versus non-toxic background.</li>
      </ol>

      <p>The classifier was a Random Forest, kept stable across runs so the differences would come from the feature selection, not the model. The result: the improved JAYA obtained improvements either in the size of the selected attribute subset, or in accuracy, or both — depending on the dataset.<span className="sidenote-number" style={{ color: p.accent }}>4</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> The wins were dataset-dependent, which is a way of saying <em>your mileage may vary</em> — and also that feature selection is always a conversation between the algorithm and the structure of the data it's searching.
        </span>
      </p>

      <p>We presented the work as poster PP-28 at INBIX'22, the Indian Conference on Bioinformatics, at VFSTR. The conclusion, as we wrote it: a simple algorithm like JAYA with an appropriate fitness function and preserved elite solutions can provide good performance in feature-selection tasks. That sentence is less exciting than it sounds, and more useful than it looks.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§04</span>
        <span>What "improved" means</span>
      </h2>

      <p>Three years on, I think the lesson isn't really about JAYA. It's about "parameter-free" as a claim. A parameter-free algorithm makes a strong design choice — to not expose certain knobs to the user — and that choice is itself a parameter, just one you can't tune. When the choice is right, the simplicity is a gift. When it's wrong, you spend time grafting the missing knobs back on, and the elegance was always borrowed.</p>

      <PullQuote color={p.accent}>The honest version is to say what your algorithm is committed to, and what it leaves open.</PullQuote>

      <p>The highest-leverage modification wasn't anything exotic — it was rewriting the objective. Re-asking <em>what</em> you're optimising for tends to outperform re-engineering <em>how</em>. The fitness function that penalises large subsets did more than any operator change could. Elitism kept the search honest. Together, they turned a parameter-free algorithm into a slightly-less-parameter-free algorithm that knew what it was looking for.</p>

      <p>The poster is still up at <a href="https://github.com/Shubzthub/inbix22" target="_blank" rel="noreferrer" className="link-underline" style={{ color: p.accent }}>github.com/Shubzthub/inbix22</a>.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written between two stops at the British Library, on a Wednesday.</p>
    </>
  );
}
