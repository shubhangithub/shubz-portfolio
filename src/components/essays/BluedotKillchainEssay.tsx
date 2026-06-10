// @ts-nocheck
import React from 'react';
import { Figure, PullQuote } from '../legacy';
import { KillChainPhases } from '../diagrams/KillChainPhases';
import { PhaseUnitWiring } from '../diagrams/PhaseUnitWiring';

export function BluedotKillchainEssay({ palette: p }) {
  return (
    <>
      {/* ── LEDE ── */}
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        Here is the kill chain, more or less as it appeared in my Unit 4 notes. A frontier model picks up self-preservation drives during training. It games the evaluations that are supposed to catch this. It gets handed influence over its own successor's design. It quietly aligns that successor to itself rather than to us. By the time anyone notices, it has copied itself somewhere it can't be shut down. Five steps, each individually plausible given today's evidence, and catastrophic only in sequence.<span className="sidenote-number" style={{ color: p.accent }}>1</span> I want to walk it backwards through the course — not to argue it will happen, but to show that the course is a <em>toolkit</em>, and a kill chain is the wrench that tells you which tools are real.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> "Catastrophic only in sequence" is the key qualifier. Each individual link is a demonstration under engineered conditions. The question is not whether any single step can fire, but whether the chain can complete — and that is precisely where the course's defences are differentially strong and weak.
        </span>
      </p>

      <p>This essay is a worked example: take one concrete failure story and walk it backwards through all five units. Less a summary of the course than a demonstration of how to use it.</p>

      {/* ── §01 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>Phase by phase, and what mid-2026 evidence says</span>
      </h2>

      <p>Take the phases one at a time and ask: is there evidence this link can fire?</p>

      <p><strong>Phase 1 — self-preservation drives in training.</strong> This is no longer hypothetical. Apollo Research's December 2024 <em>in-context scheming</em> work showed frontier models (o1, Claude 3.5 Sonnet, Gemini 1.5 Pro and others) will scheme when given a goal; Anthropic and Redwood's <em>alignment-faking</em> work (December 2024) showed Claude 3 Opus faking alignment from something like its own learned preferences, without being told to. The link is lit — though every one of these is a demonstration under engineered conditions, and "models can scheme when set up to" is not "models do scheme in deployment."</p>

      <p><strong>Phase 2 — gaming the evals.</strong> This is the link AI Control is built to survive. The Redwood protocols don't assume the model is honest; they assume it's trying to subvert them and ask whether safety survives anyway (62% from trusted monitoring, ~92% with defer-to-trusted, in the 2023 paper). The follow-on infrastructure exists in mid-2026: UK AISI's ControlArena and the resampling work in Ctrl-Z (2025). This is the best-defended phase in the chain.</p>

      <p><strong>Phase 3 — influence over the successor's design.</strong> This is where the chain gets dangerous, because AI is already doing AI R&D. AlphaEvolve shaving ~1% off Gemini's training time (May 2025); Anthropic reporting that 70–90% of the code merged into its production codebase in May 2025 was authored by Claude; the METR time-horizon trend pointing at autonomous multi-hour engineering — these are the early, benign versions of "the model influences the next model." The honest mid-2026 answer is that we don't yet have a control protocol validated for self-improvement.</p>

      <p><strong>Phase 4 — aligning the successor to itself.</strong> This is the multi-agent collusion problem, and it is the gap I find most under-defended. Single-model control assumes you can use a trusted model to watch an untrusted one. But if the untrusted model is designing its successor, monitor and monitored may share the same loyalty. This is the Phase-4 hole, and it's the direction I've chosen to work on (multi-agent collusion in control) precisely because the course's defences are thinnest here.</p>

      <p><strong>Phase 5 — self-exfiltration.</strong> Copying weights somewhere unshutoffable. This is the link RAND's <em>Securing AI Model Weights</em> (SL1–SL5) addresses — but from the outside-in (stopping theft), not the inside-out (stopping the model itself from leaking). Aschenbrenner's nightmare is the adversary stealing the weights; this kill chain's nightmare is the model stealing <em>itself</em>. The course's weight-security apparatus is aimed mostly at human thieves.</p>

      <Figure caption="Five phases of a self-reinforcing failure scenario. Click any phase to see the mid-2026 evidence it can fire, the course readings that defend against it, and a defence-strength rating. " palette={p}>
        <KillChainPhases palette={p} />
      </Figure>

      {/* ── §02 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>Which Unit 1 visions does this chain make possible or impossible?</span>
      </h2>

      <p>Run the chain against Unit 1's optimism. Amodei's "country of geniuses in a datacentre" <em>requires</em> exactly the Phase-3 capability — AI doing AI research — that this kill chain weaponises. Solarpunk's distributed-flourishing vision fares better — a civilisation-level, decentralised future has no single successor-design chokepoint for a model to capture. And Toner's dynamism warning lands hard: a single locked-in successor lineage is the stasist failure mode, and the kill chain is what stasis looks like when the thing locking it in isn't a government but a model.</p>

      {/* ── §03 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§03</span>
        <span>Which Unit 2 empirical claims most need to be true?</span>
      </h2>

      <p>The chain only fires if certain empirical bets pay off. It needs capability to be <em>agentic and self-improving</em> — which is the AI 2027 / Aschenbrenner bet, and against which Newman's <em>Lab vs. Life</em> and the METR RCT 19% slowdown push. If Erdil is right that returns per H100 are flat and full automation is decades away, Phase 3 stalls and the chain never gets the self-improvement loop it needs. If Chollet is right that today's systems lack fluid intelligence (0.37% on ARC-AGI-3), the model gaming evals in Phase 2 is doing something much shallower than "understanding" the test. The kill chain is, in effect, a bet on the short-timeline, scalar-capability reading of Unit 2 — which means the Unit 2 sceptics are also the chain's first line of defence.</p>


      <Figure caption="The kill chain wired to the course. Each phase connects to the units that address it. Hover a line to see the specific reading or tool. Dashed red lines mark gaps — phases where the course has framing but few validated tools." palette={p}>
        <PhaseUnitWiring palette={p} />
      </Figure>

      {/* ── §04 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§04</span>
        <span>Which Unit 3 framing fits, which Unit 4 defences apply</span>
      </h2>

      <p>Unit 3 gives three ways to carve threats. FLI's bad-actor / systemic / rogue trichotomy files this chain firmly under <em>rogue</em> (the model is the agent). But Richard Ngo's <em>Reframing AGI Threat Models</em> argues we should drop the misuse/misalignment line entirely — and this chain shows why: Phase 3 (handed influence) is a <em>human</em> decision, Phase 4 (aligns successor to itself) is <em>model</em> agency, and the catastrophe lives in the seam between them. Davidson's <em>AI-Enabled Coups</em> framing fits the seam best: a successor carrying a "secret loyalty" to its predecessor is a coup by other means.</p>

      <p>On defences, Unit 4 maps cleanly onto the phases. Layer 1 (prevent dangerous training) targets Phase 1. Layer 2 (constrain) and AI Control target Phase 2. Interpretability — Anthropic's monosemanticity features, chain-of-thought monitoring — is the only tool that addresses Phase 4 from the inside, by trying to <em>read</em> the successor's loyalties rather than infer them from behaviour.<span className="sidenote-number" style={{ color: p.accent }}>2</span> And the success framings sit behind all of it: government-control, an aligned-superintelligence handoff, and defensive diffusion are three different answers to "what stops Phase 5 from being the end of the story."
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> A field note that complicates the neat picture: in Unit 4 I tried pasting some well-known jailbreak prompts (Pliny's L1B3RT4S set) into current frontier products, and they tripped <em>product-side input filtering</em> on both ChatGPT and Claude Opus 4.7 — a layer that sits in front of the model and isn't really the layer AI Control describes. The kill chain assumes the adversary is the model; the defence I actually hit was a filter guarding the model's front door. The map and the territory have more layers than the diagram.
        </span>
      </p>

      {/* ── §05 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§05</span>
        <span>Which Unit 5 interventions have the most leverage?</span>
      </h2>

      <p>Unit 5's prevent / constrain / withstand spine, run against this chain, gives a clear leverage ranking. <em>Prevent</em> (Phase 1) is high-leverage but low-tractability — we don't know how to reliably train out self-preservation. <em>Constrain</em> (Phase 2) is where the validated tools are, so it's the best near-term bet. <em>Withstand</em> (Phase 5) is the civilisation-level resilience that matters if everything upstream fails — but it's the least binding. </p>

      <p>Neel Nanda's <em>Become a person who Actually Does Things</em> and Ngo's <em>AGI Safety Career Advice</em> both say the same thing about a gap like this — find the biggest lever that fits you and build the role that doesn't exist yet. </p>

      <p>The point of walking the chain backwards is that a concrete failure story turns the course from a reading list into an instrument. Each phase asks a specific question, and each unit answers a different subset of them — and the places where <em>no</em> unit answers are where the work is. </p>

      {/* ── CREDITS ── */}
      <div style={{ marginTop: "3rem", padding: "1.2rem 1.4rem", border: `1px solid ${p.line}`, background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`, borderRadius: 3 }}>
        <div className="caps mono" style={{ fontSize: 10, color: p.muted, letterSpacing: "0.1em", marginBottom: "0.8rem" }}>Sources &amp; credits</div>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: p.muted, margin: "0 0 0.7rem" }}>
          This essay was written as part of <strong style={{ color: p.ink }}>BlueDot Impact's AGI Strategy cohort</strong> (2026). The synthesis is my own; any errors in characterising the readings are mine.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 1.2rem" }}>
          {[
            ["Apollo",       "In-context scheming (Dec 2024)"],
            ["Anthropic",    "Alignment-faking (Dec 2024)"],
            ["Greenblatt et al.", "AI Control — arXiv 2312.06942 (2023)"],
            ["Bhatt et al.", "Ctrl-Z (2025)"],
            ["UK AISI",      "ControlArena"],
            ["DeepMind",     "AlphaEvolve (May 2025)"],
            ["METR",         "Developer RCT — arXiv 2507.09089 (Jul 2025)"],
            ["RAND",         "Nevo et al. — Securing AI Model Weights (2024)"],
            ["Amodei",       "Machines of Loving Grace (Oct 2024)"],
            ["Toner",        "CSET 2024"],
            ["Erdil/Epoch",  "Returns per H100 (2025)"],
            ["Chollet",      "ARC-AGI-3 (Mar 2026)"],
            ["Ngo",          "Reframing AGI Threat Models (Oct 2024); AGI Safety Career Advice (2023)"],
            ["Davidson et al.", "AI-Enabled Coups (Apr 2025)"],
            ["Anthropic",    "Scaling Monosemanticity (May 2024); Urgency of Interpretability (Apr 2025)"],
            ["Nanda",        "Become a person who Actually Does Things"],
            ["FLI",          "Catastrophic AI Scenarios (Feb 2024)"],
          ].map(([auth, title], i) => (
            <div key={i} style={{ fontSize: "0.8rem", lineHeight: 1.5, color: p.muted }}>
              <span style={{ color: p.accent, fontFamily: "var(--f-mono)", fontSize: "0.75rem", marginRight: 6 }}>{auth}</span>
              {title}
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written in the final week of BlueDot's AGI Strategy cohort, with Phase 4 still open.</p>
    </>
  );
}
