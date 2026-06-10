// @ts-nocheck
import React from 'react';
import { Figure, PullQuote } from '../legacy';
import { VocabFan } from '../diagrams/VocabFan';
import { SemanticDrift } from '../diagrams/SemanticDrift';

export function BluedotVocabularyEssay({ palette: p }) {
  return (
    <>
      {/* ── LEDE ── */}
<p>
  Some disagreements feel substantive but are really about language. The AGI field has a lot of these — not because anyone is careless, but because the field built its vocabulary faster than its consensus.<span className="sidenote-number" style={{ color: p.accent }}>1</span> This essay tracks seven words through the readings and shows that each carries more than one meaning. 
  <span className="sidenote">
    <strong style={{ color: p.accent }}>1.</strong> Adam Jones's BlueDot piece <em>What is AI alignment?</em> opens by noting there is "no strict consensus" before cataloguing a spread of working definitions. Most of the others simply proceed inside their chosen dictionary without flagging it.
  </span>
</p>

      <Figure caption="Click any contested word to see how each course author defines it. The fan-out reveals that most AI debates are arguments about which dictionary is open." palette={p}>
        <VocabFan palette={p} />
      </Figure>

      {/* ── §01 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>Alignment</span>
      </h2>

      <p>Start with the word that has the most documented ambiguity. Adam Jones's BlueDot piece <em>What is AI alignment?</em> opens by noting there is "no strict consensus" and then catalogues a spread of working definitions — Jan Leike's "does the intended task as well as it could," Paul Christiano's "trying to do what H wants it to do," Richard Ngo's "pursue goals that match human values or interests," Ryan Greenblatt's narrow "ensure your models aren't scheming," Holden Karnofsky's "don't aim to bring down civilization," and several more. These are not refinements of one idea; they point at different objects. Christiano's is about <em>intent</em>. Greenblatt's is about <em>scheming</em>. Karnofsky's is about <em>catastrophe-avoidance</em>. Jones names the tension directly: a system that perfectly does what we intended could still be "aligned" and bad for us, because we are unreliable judges of our own long-term interest. When Unit 2 then asks "is alignment solved?", the honest answer is "which one?"</p>

      {/* ── §02 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>Coordination</span>
      </h2>

      <p>In Aschenbrenner the word means <em>alliance-formation</em> — democracies pooling compute and talent into one project, the Quebec Agreement as template. In the AI Treaty letter it means <em>treaty negotiation</em> — a compliance commission, verification, a CERN-for-AI-Safety. In Buterin it means something almost technical — <em>cryptographic multi-signature</em>, decision rules no single party can override, coordination as a property you build into the mechanism rather than negotiate between states. Three readings, one word, three referents: a coalition, a treaty, a smart contract. An argument about "whether coordination is feasible" is three arguments.</p>

      {/* ── §03 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§03</span>
        <span>Race</span>
      </h2>

      <p>This one is almost a Rorschach test. For Aschenbrenner the race is an <em>existential competition to be won</em> — losing to the CCP is the catastrophe, so you race harder and more securely. For Buterin the race is a <em>threat to defuse</em> — racing is the dynamic that produces the offence-favouring world d/acc exists to prevent. For the Treaty letter the race is a <em>dynamic to stop</em> outright. Notice that all three agree the race is real and dangerous. They disagree only on the verb: win it, defuse it, or halt it. The factual disagreement is small; the verb is everything.</p>

      <PullQuote color={p.accent}>Aschenbrenner wants to win the race, Buterin wants to defuse it, the Treaty letter wants to stop it. They are looking at the same track and arguing about the verb.</PullQuote>

      {/* ── §04 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§04</span>
        <span>Control</span>
      </h2>

      <p>Sarah's <em>Introduction to AI Control</em> uses the word in the Redwood sense: the <em>lab controls the model</em> — protocols that extract safety from a system even if it is scheming, with the original paper's blue team reaching 62% and rising toward ~92% safety depending on the protocol. Aschenbrenner uses "control" to mean the <em>government controls the lab</em> — nationalisation, SCIF-grade security, the state's hand on the wheel. Davidson's <em>AI-Enabled Coups</em> uses it in a third sense: <em>who controls whom</em> when an AI workforce is singularly loyal to one person. Same word, three levels of the stack: model, lab, polity. A sentence like "we need to maintain control" is unparseable until you say control of what, by whom.</p>

      {/* ── §05 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§05</span>
        <span>Safety</span>
      </h2>

      <p>The widest spread of all. In the alignment readings, safety is an <em>outcome property</em> of the model. In RAND's weight-security work it is a <em>security posture</em>. In Buterin and the "withstand" layer it is <em>civilisational resilience</em>. And in Sigal Samuel's Vox critique, "safety" is something close to <em>industry capture</em> — a word labs deploy to look responsible while structure erodes the commitment. The CAISI rebrand (June 2025) is the same fight over the same word at the level of the state: dropping "safety" from the institute's name was a deliberate semantic act, because everyone understood the word carried a whole worldview.<span className="sidenote-number" style={{ color: p.accent }}>2</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> The CAISI rebrand is an unusually clean example of semantic contestation made visible. When an institution removes a word from its name, it is not merely rebranding — it is participating in a definitional struggle over what that word means and who gets to mean it. The US Commerce Department's action in June 2025 registered, in bureaucratic form, the same argument Samuel was making in 2024.
        </span>
      </p>

      <Figure caption="The word 'safety' enters the course as one strand and exits as four. Hover each branch to see which reading holds that definition — and where the CAISI rebrand cuts the 'industry capture' strand." palette={p}>
        <SemanticDrift palette={p} />
      </Figure>

      {/* ── §06 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§06</span>
        <span>Capability</span>
      </h2>

      <p>For almost everyone capability is <em>scalar</em> — a height on a benchmark, a length on the METR horizon. For Chollet it is <em>situated</em> — skill-acquisition efficiency on novel problems, which is why a model can be 84.6% on ARC-AGI-2 and 0.37% on ARC-AGI-3 in the same season. Two people looking at Gemini 3 can both say "look how capable it is" and "look how incapable it is" and both be right, because the word is pointing at different quantities.<span className="sidenote-number" style={{ color: p.accent }}>3</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> Chollet's distinction between task-specific skill and general skill-acquisition efficiency is the cleanest operationalisation of "capability" in the literature. His point is not that benchmarks are bad but that they measure the wrong thing: a model optimised to achieve high scores on a fixed distribution of tasks is not demonstrating the kind of generalisation that matters for the AGI question.
        </span>
      </p>

      {/* ── §07 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§07</span>
        <span>AGI</span>
      </h2>

      <p>The most telling case is the word the course is named after. Amodei refuses the term entirely in <em>Machines of Loving Grace</em>, preferring a concrete "powerful AI" definition precisely to dodge the definitional swamp. Aschenbrenner deploys "AGI" freely and dates it. Adam Jones sidesteps to "transformative AI" / capability-and-generality language to avoid, in his words, the "endless space for arguments." Three authors, three strategies for the same word: refuse it, operationalise it, replace it.</p>

      {/* ── §08 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§08</span>
        <span>The pattern</span>
      </h2>

      <p>There is a pattern here, and it is not relativism. The words are not meaningless; they are <em>indexed</em>. Each is precise inside one author's system and slippery between systems. The practical move — the thing I started doing in cohort discussions once I noticed it — is to ask, before engaging any claim, "whose vocabulary am I in?" Once you fix the index, a surprising number of debates evaporate. "Is alignment solved?" → "Solved in Greenblatt's sense (not scheming), open in Christiano's (intent), and probably unsolvable in Karnofsky's (we don't know what we want)." That is not a dodge. It is the actual state of knowledge, and the single word was hiding it.</p>

      <PullQuote color={p.accent}>The words aren't vague. They're indexed. Fix the index and most of the fight turns out to be about which dictionary was open.</PullQuote>

      <p>The reason this matters beyond pedantry is that policy is written in these words. A treaty that says "ensure AI safety" inherits all four meanings at once and will be litigated into whichever one the litigant prefers. The most useful thing a strategist can do with this course is not to pick the right definition — there isn't one — but to refuse to let a single word smuggle a whole worldview past the reader unexamined. Specify whose dictionary you're in, and the argument finally becomes about the world instead of about the word.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written during the second week of BlueDot's AGI Strategy cohort, in London.</p>
    </>
  );
}
