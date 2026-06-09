// @ts-nocheck
import React from 'react';
import { Figure, PullQuote } from '../legacy';
import { IdeologyUnitGrid } from '../diagrams/IdeologyUnitGrid';
import { DefencePillars } from '../diagrams/DefencePillars';

export function BluedotCivilizationEssay({ palette: p }) {
  return (
    <>
      {/* ── LEDE ── */}
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        Most of the course argues about scale by arguing about which actor to watch. Is the danger the <em>model</em> (will it scheme?), the <em>lab</em> (will it cut corners?), or the <em>state</em> (will it race?)? These are the three default units of analysis, and nearly every reading picks one. But there is a fourth unit, chosen by a small, ideologically scattered cluster of readings that otherwise have nothing in common — and once you see it, it reorganises the whole corpus. The unit is the <em>civilisation</em>: the distributed, multi-agent, institution-and-infrastructure system that no single model, lab or government contains. This is the optimistic essay, and its argument is that the civilisation frame is the course's most underrated idea precisely because the readings that hold it don't know they're holding it together.
      </p>

      {/* ── §01 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>The Toner→Chollet move, stretched</span>
      </h2>

      <p>In my Unit 2 essay I traced a move from Helen Toner to François Chollet: Toner asks us to stop arguing about end-states and attend to dynamism — the plural, revisable, feedback-rich system — and Chollet relocates intelligence from the brain to something larger. Chollet's <em>On the Measure of Intelligence</em> makes a claim that sounds technical but is really about units: intelligence is not a property of an isolated mind, it is <em>civilisation-level</em>. A lone genius raised by wolves invents nothing; the capability we call "human intelligence" is mostly the accumulated, externalised, socially-transmitted scaffold the individual is plugged into. The intelligence explosion can't run away inside one box because most of the relevant intelligence was never in the box.</p>

      <p>This sits on a deep academic tradition the course gestures at without naming: Clark and Chalmers' <em>The Extended Mind</em> (1998) and Otto's notebook, where cognition provably extends past the skull; Hutchins' <em>Cognition in the Wild</em> (1995), where a Navy ship's navigation is performed by no single sailor but by the whole sociotechnical assembly; Henrich's <em>The Secret of Our Success</em>, where human capability is cultural transmission, not raw brainpower; Hayek's <em>The Use of Knowledge in Society</em> (1945), where the relevant intelligence is distributed across a price system no planner holds in one head. Chollet is the course's representative of a much older idea: the unit of cognition is the civilisation, not the node.</p>

      {/* ── §02 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>Four readings, one unit, four ideologies</span>
      </h2>

      <p>Here is the striking part. Three other readings, in three other units, make structurally the same move — and they sit at four corners of the ideological map.</p>

      <ul style={{ margin: "1.2rem 0", paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li><strong>Chollet (Unit 2)</strong> is a <em>capabilities skeptic</em>: intelligence is civilisation-level, so don't expect a brain-in-a-box to foom.</li>
        <li><strong>Buterin (Unit 4)</strong> is <em>safety-defensive</em>: in d/acc, defence is civilisation-level, not lab-level. You don't make one model safe; you make the <em>whole system</em> resilient so that no single actor's failure is catastrophic. The centre, he insists, is often the source of risk.</li>
        <li><strong>Solarpunk (Unit 1)</strong> is <em>progressive-aesthetic</em>: it imagines civilisation-level <em>positive visions</em> — what a flourishing, sustainable, distributed society actually looks like, rather than which model to constrain.</li>
        <li><strong>BlueDot's "withstand" layer (Unit 5)</strong> is <em>pedagogical</em>: its biosecurity and cybersecurity hardening, crisis-response systems, critical-infrastructure resilience — all explicitly civilisation-level capabilities.</li>
      </ul>

      <p>A capabilities skeptic, a crypto-defensive technologist, a progressive aesthetic movement, and a safety curriculum. They agree on nothing about AI's trajectory. They converge, without coordination, on the same answer to the question "what should we be looking at?" That convergence-across-ideologies is the signal worth attending to.</p>

      <Figure caption="Fourteen course readings plotted by ideology (x) and unit of analysis (y). The civilization cluster spans the full ideology range — a capabilities skeptic, a crypto technologist, a progressive aesthetic, and a safety syllabus converge on the same unit without coordinating." palette={p}>
        <IdeologyUnitGrid palette={p} />
      </Figure>

      {/* ── §03 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§03</span>
        <span>Sorting the course by unit of analysis</span>
      </h2>

      <p>Lay the readings out by implicit unit and the corpus reorganises:</p>

      <ul style={{ margin: "1.2rem 0", paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li><strong>Model as unit:</strong> Sarah's AI Control, the alignment readings (Jones, the scheming/alignment-faking literature), interpretability. The question is: is <em>this system</em> safe?</li>
        <li><strong>Lab as unit:</strong> RAND's weight-security tiers, Samuel's Vox critique, the internal-governance readings. The question is: will <em>this organisation</em> hold the line?</li>
        <li><strong>State as unit:</strong> Aschenbrenner's Project, RAND's MAIM critique, the entente strategy, much of the treaty discourse. The question is: will <em>this nation</em> win or coordinate?</li>
        <li><strong>Civilisation as unit:</strong> Chollet, Buterin, Solarpunk, the "withstand" layer — and arguably Narayanan &amp; Kapoor's <em>AI as Normal Technology</em>, whose diffusion-limited view is implicitly about how a whole society absorbs a general-purpose technology.</li>
      </ul>

      <p>The model/lab/state cluster contains most of the course's defensive machinery. The civilisation cluster contains most of its optimism. That is not a coincidence: defence against a <em>thing</em> tends to focus on the thing, while a positive vision needs a canvas big enough to paint a future on.</p>

      {/* ── §04 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§04</span>
        <span>What shifts when civilisation is the unit</span>
      </h2>

      <p>The policy implications genuinely change. If the model is the unit, you invest in alignment and control. If the lab is the unit, you invest in governance and weight-security. If the state is the unit, you invest in compute controls and treaties. But if the <em>civilisation</em> is the unit, the highest-leverage interventions are different in kind:</p>

      <p><strong>Resilience over prevention.</strong> You can't prevent every dangerous capability, but you can make the society that meets it harder to knock over. Buterin's Balvi-funded portfolio is the concrete instance — verifiable open-source vaccines, the germicidal-UV and clean-indoor-air work, pandemic early-detection via wastewater. The bet is that <em>defensive</em> capability, widely distributed, beats <em>offensive</em> capability concentrated.</p>

      <Figure caption="Buterin's four d/acc pillars with concrete mid-2026 instances from the Balvi portfolio and d/acc events. Toggle 'concentrated ↔ distributed' to see how each intervention scores on the power-distribution axis." palette={p}>
        <DefencePillars palette={p} />
      </Figure>

      <p><strong>Distribution over concentration.</strong> The civilisation frame treats concentration of power as a first-class risk (Toner's framing, Buterin's "centre is the source of risk," Davidson's coup risk factors). The intervention is to spread capability and verification, not to build one trusted fortress.</p>

      <p><strong>Differential acceleration over pause.</strong> You don't stop the whole frontier; you build the beneficial, defence-favouring pieces first. This is IFP's selective-acceleration playbook (Human Genome Project, Operation Warp Speed) wearing civilisational clothes.</p>

      <p>The empirical anchors that make this frame credible are exactly the ones the optimists cite: AlphaProteo (DeepMind, September 2024) designing protein binders where 88% of candidate molecules bound successfully in wet-lab testing; AlphaFold 3 (<em>Nature</em>, May 2024) and the 2024 Nobel Prize in Chemistry; AlphaEvolve (DeepMind, May 2025) returning a roughly 1% reduction in Gemini's own training time. These are civilisation-level capabilities — they accrue to the whole research ecosystem, not to one model's autonomy.</p>

      {/* ── §05 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§05</span>
        <span>The honest tensions</span>
      </h2>

      <p>This is a diagnostic essay, so the frame's weaknesses belong on the page. First, "civilisation" is the vaguest unit, and vagueness is where accountability goes to die — the same property that made a cohort observation suspicious of the "withstand" layer (most agreeable because most open to interpretation) applies to the whole frame. A resilience agenda with no owner is a wish. Second, the civilisation frame can be a way of <em>avoiding</em> the hard model-level question: if the system schemes and self-exfiltrates faster than any societal defence can react, civilisational resilience is irrelevant. Third, distribution cuts both ways: spreading capability spreads offensive capability too — exactly the bio-proliferation worry in Unit 3.</p>

      {/* ── §06 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§06</span>
        <span>Why the frame is worth keeping anyway</span>
      </h2>

      <p>The reason to elevate the civilisation frame is not that it wins. It is that it is the only frame in the course that can hold a <em>positive</em> goal. Model-safety, lab-governance and state-competition are all defensive units — they can tell you what to stop, not what to build toward. Civilisation is the only unit big enough to contain Solarpunk's question: not "how do we avoid catastrophe?" but "what is the flourishing we are avoiding catastrophe <em>for</em>?"</p>

      <PullQuote color={p.accent}>A capabilities skeptic, a crypto technologist, a progressive aesthetic, and a safety syllabus walked into the same frame — and none of them noticed the others were already there.</PullQuote>

      <PullQuote color={p.accent}>Model, lab and state can only tell you what to stop. Civilisation is the only unit big enough to tell you what to build.</PullQuote>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written during BlueDot's AGI Strategy cohort, somewhere between the model and the civilisation it is embedded in.</p>
    </>
  );
}
