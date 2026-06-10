// @ts-nocheck
import React from 'react';
import { Figure, PullQuote } from '../legacy';
import { AssumptionGrid } from '../diagrams/AssumptionGrid';
import { TimelineAnchors } from '../diagrams/TimelineAnchors';

export function BluedotAssumptionsEssay({ palette: p }) {
  return (
    <>
      {/* ── LEDE ── */}
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        Across five units, the AGI Strategy course assigns something like thirty readings that rest on a small number of shared assumptions, this essay names six. For each one I map three things: name the readings that depend on it, name the readings that may violate it, and ask what changes if the assumption breaks.
      </p>

      {/* ── §01 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>Capability is scalar</span>
      </h2>

      <p>The dominant grammar of the course treats intelligence as a quantity — a dial you turn up. Amodei's <em>Machines of Loving Grace</em> runs on "marginal returns to intelligence," which only makes sense if intelligence is the kind of thing you can have more or less of. Aschenbrenner counts "OOMs" — orders of magnitude — and draws a straight line from GPT-2 to superintelligence. AI 2027 plots capability as a curve that bends upward. The METR time-horizon work literally measures capability as a scalar: the length of task (in human-time) an agent can complete at 50% reliability. As of METR's live time-horizons page, frontier time horizons are around twelve hours with a doubling time of roughly four months; the Time Horizon 1.1 update (29 January 2026) revised the post-2023 doubling to about 131 days, roughly 20% faster than the original 7-month trend.</p>

      <p>Exactly one reading objects at the root. François Chollet's <em>On the Measure of Intelligence</em> argues that intelligence is not skill but skill-acquisition efficiency — how well you handle novelty you weren't prepared for. On this view a system can post superhuman benchmark numbers and still be near-zero at this version of intelligence. The empirical wedge is striking: in ARC Prize Foundation's verified February 2026 evaluation, Gemini 3 Deep Think scored 84.6% on ARC-AGI-2 — above the ~60% human average — yet on the interactive ARC-AGI-3 (released 24 March 2026), the same model scores 0.37%, where humans score 100%. Same systems, opposite verdicts, depending on whether you think capability is one number or many.</p>

      <Figure caption="Six assumptions mapped against eight course readings. Each cell shows whether a reading depends on, is neutral to, or quietly violates the assumption. Hover a row to see what breaks if that assumption is false." palette={p}>
        <AssumptionGrid palette={p} />
      </Figure>

      <PullQuote color={p.accent}>If capability is a vector, "more intelligent" stops being a destination and becomes a direction — and you have to say which way.</PullQuote>

      <p>What changes if the assumption breaks? Almost everything downstream. The intelligence-explosion arguments need scalar capability to feed back on itself. If Chollet is right that capability is situated and jagged, then "AGI by 2027" is not so much wrong as ill-typed.<span className="sidenote-number" style={{ color: p.accent }}>1</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> Chollet himself moved. In his June 2025 conversation with Dwarkesh Patel he shortened his AGI estimate from ~10 years to ~5, citing test-time adaptation and "fluid intelligence" — without conceding the scalar framing. The objector updated his timeline while keeping his ontology.
        </span>
      </p>

      {/* ── §02 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>Compute is the binding lever</span>
      </h2>

      <p>The second shared assumption is that compute is <em>the</em> control surface — that whoever governs chips, datacentres and training runs governs the outcome. Aschenbrenner's entire strategy is downstream of compute scaling. The AI Treaty letter proposes compute thresholds and a compliance commission. RAND's <em>Securing AI Model Weights</em> builds a five-tier security framework (SL1–SL5) on the premise that the crown jewels are concentrated artefacts you can wall off.</p>

      <p>According to Ege Erdil at Epoch's <em>case for multi-decade AI timelines,</em> revenue per H100-equivalent has stayed roughly flat at about $10K/year since the ChatGPT moment. All the revenue growth has come from scaling up the <em>quantity</em> of inference compute, not from each unit becoming more economically productive. If that holds, compute is not a lever that multiplies value — it is a commodity input whose returns are linear.</p>

      <p>The mid-2026 financial picture complicates things further. OpenAI crossed $25B in annualised revenue at end-February 2026 — extraordinary growth. But Stargate was revised down hard: from ~$1.4 trillion to a roughly $600 billion compute-spend-through-2030 target, explicitly tied to expected revenue. And METR's July 2025 RCT found 16 experienced open-source developers were 19% <em>slower</em> with early-2025 AI tools — against a self-predicted 24% speedup. If compute buys capability but capability doesn't yet buy productivity, the "binding lever" is gripping something that isn't quite intentional.</p>

      <Figure caption="Predictions versus mid-2026 anchors. Three forecast lines plotted against the real data points — the gap between ARC-AGI-2 (84.6%) and ARC-AGI-3 (0.37%) on the same model captures the scalar-vs-vector tension in a single season." palette={p}>
        <TimelineAnchors palette={p} />
      </Figure>

      <PullQuote color={p.accent}>Everyone agrees compute is <em>a</em> lever. Erdil's flat $10K/H100 quietly asks whether it is <em>the</em> lever — or just the one we can see.</PullQuote>

      <p>What breaks: the chip-control theory of governance. Export controls, SL5 weight-security, compute treaties — all assume that gating compute gates outcomes.</p>

      {/* ── §03 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§03</span>
        <span>The developer is at least somewhat well-intentioned</span>
      </h2>

      <p>Most of the defensive apparatus in Units 3–5 quietly presupposes that the lab building the system is, on balance, trying to do the right thing. Sarah's <em>Introduction to AI Control</em> is explicitly a method for getting safety out of a possibly-misaligned <em>model</em> — but it assumes the <em>humans</em> running the control protocol want it to work. RAND's weight-security tiers protect the developer's assets from outside theft. Even the Redwood control numbers — 62% safety from trusted monitoring, rising toward ~92% with defer-to-trusted — describe a blue team that is on humanity's side by construction.</p>

      <p>Two readings problematise the developer directly. Buterin's d/acc states flatly that the centre is often the source of risk. Tom Davidson, Lukas Finnveden and Rose Hadshar's <em>AI-Enabled Coups</em> inverts the assumption completely: its three risk factors — an AI workforce made "singularly loyal" to institutional leaders, "secret loyalties" hidden in systems, and a few people gaining "exclusive access" to coup-enabling capabilities — are precisely the failure modes you get when the developer is the threat.</p>

      <p>What breaks: the layered defences mostly stop being defences. A control protocol run by a bad-faith operator is theatre. This is the assumption whose failure is least studied in the course: every layer is designed to stop bad behaviour, but none of them makes <em>good</em> behaviour the attractive choice.</p>

      {/* ── §04 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§04</span>
        <span>Timelines are short</span>
      </h2>

      <p>The centre of gravity sits at 3–10 years. Amodei's "powerful AI" arrives in the late 2020s. Aschenbrenner dates AGI to 2027 and superintelligence to ~2030. AI 2027 is a year in its title. The AI Treaty letter and the Global Call for AI Red Lines (launched at the 80th UN General Assembly, 22 September 2025, initially signed by 200+ individuals and 70+ organisations including economists Stiglitz and Acemoglu, biochemist Jennifer Doudna, physicist Giorgio Parisi, and AI researchers Bengio and Hinton) both demand action "by the end of 2026." Urgency is the premise.</p>

      <p>The dissenters are Erdil (median ~20 years to full automation of remote work) and Narayanan and Kapoor's <em>AI as Normal Technology</em>, which argues diffusion, not capability, is the rate-limiter — and diffusion runs on the timescale of institutions, not training runs.</p>

      <p>What breaks: if timelines are long, the emergency framing inverts. The "we must act by 2026" instruments risk locking in rules built for a world that arrives in 2045 — exactly the stasism Toner warns against. Short-timeline readings rarely cost out the harm of premature lock-in, and long-timeline readings rarely cost out the harm of being caught flat-footed.</p>

      {/* ── §05 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§05</span>
        <span>Western actors get to write the rules</span>
      </h2>

      <p>The governance readings almost all assume the pen is held in Washington, London or Brussels. Aschenbrenner is explicit: a "coalition of democracies" runs The Project, with Western labs expected to "voluntarily" merge under the USG. The Treaty letter is implicitly Western-led — a CERN-for-AI-Safety modelled on European institutions. Amodei's "entente strategy" frames a democratic coalition setting terms for everyone else.</p>

      <p>The mid-2026 record makes this look less like a description and more like a contested bet. The US and UK declined to sign the Paris AI Action Summit declaration (February 2025). The US AI Safety Institute was rebranded the Center for AI Standards and Innovation (CAISI) on 3 June 2025, with "safety" dropped and the remit narrowed toward competitiveness. Meanwhile the Global Call for AI Red Lines drew civil-society signatories including the Beijing Institute of AI Safety and Governance alongside Western names.</p>

      <p>RAND's structural critique applies to the genus: any framework that uses AI advantage as leverage generates first-mover incentives and pushes rivals to race or defect. If the pen is shared, "Western actors write the rules" stops being a strategy and becomes a negotiating position.</p>

      {/* ── §06 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§06</span>
        <span>Defence is the goal</span>
      </h2>

      <p>The deepest shared assumption is structural and almost invisible: every layer in the course is designed to <em>stop</em> bad behaviour. Prevent dangerous training. Constrain dangerous capabilities. Withstand dangerous actions. Control catches the scheming model. Weight-security stops the theft. Red lines prohibit the unacceptable.</p>

      <p>What almost no reading does is make <em>good</em> behaviour the attractive choice — design incentives so the cooperative path is also the profitable one. Buterin's d/acc is the partial exception: the "build the beneficial thing first" move is at least an attempt to make the good outcome materially attractive rather than merely mandated. IFP's selective-acceleration playbook (Human Genome Project, Operation Warp Speed) is another. But these are a minority.</p>

      <PullQuote color={p.accent}>A civilisation that only knows how to say "don't" has not yet decided what it wants to say "yes" to.</PullQuote>

      <p>What breaks if defence is <em>not</em> enough: you can win every defensive engagement and still lose, because nothing pulls the system toward a good equilibrium. The "withstand" layer feels suspiciously agreeable precisely because it is the most open to interpretation, and therefore the least binding.</p>

      <p>The six assumptions are not errors. They are the scaffolding that lets the readings say anything specific at all. The contribution of reading them as a set is that you can see which walls are shared, and therefore which single failure would bring down the most rooms at once.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written as part of BlueDot Impact's AGI Strategy cohort (May 2026).</p>
    </>
  );
}
