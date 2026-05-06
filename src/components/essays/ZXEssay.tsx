// @ts-nocheck
import React from 'react';
import { Figure, PullQuote, SpiderFusion, ZXRewrite } from '../legacy';

export function ZXEssay({ palette: p }) {
  return (
    <>
      {/* ── LEDE ── */}
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        The thing that bothered me about quantum circuits — long before I had the vocabulary for what was bothering me — was that you could follow every gate and still not understand why the protocol worked.<span className="sidenote-number" style={{ color: p.accent }}>1</span> Quantum teleportation is the clearest example. Hadamard. CNOT. Measure. Classically communicate. Apply corrections. The sequence is correct. It is also almost entirely opaque: the circuit doesn't show you the structure that makes entanglement usable in that particular way. It shows you that it works. The reason lives somewhere behind the notation.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> I read mathematics at Oxford and picked up quantum mechanics from the side. The formalism was clear; the intuition took longer. ZX-calculus was the first notation that made me feel like the intuition and the formalism were pointing at the same thing.
        </span>
      </p>

      <p>ZX-calculus is a graphical language for quantum computation developed by Bob Coecke and Ross Duncan at Oxford, starting around 2008. The idea is to represent quantum maps not as sequences of matrix operations but as diagrams — coloured nodes connected by wires — and then to reason about those diagrams by applying rewrite rules. What makes it unusual is that the rewriting is complete: any true equation between quantum maps can be derived from a small set of local rewrites on diagrams. You stop computing and start reasoning with pictures.</p>

      <p>I have been reading the ZX-calculus on and off for a while now, and the thing I want to do here is explain why the notation is interesting even before you use it for anything practical. The basic objects are worth understanding on their own terms.</p>

      {/* ── §01 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§01</span>
        <span>What circuits hide</span>
      </h2>

      <p>The standard quantum circuit diagram puts qubits on horizontal wires and gates on those wires, left-to-right in time. It is a genuinely good notation for computation: you can read off the gate sequence, verify unitarity, count resources. What it does not do particularly well is expose <em>causal structure</em> — the reason a protocol works, as opposed to the sequence of operations that implements it.</p>

      <p>Consider the CNOT gate: control qubit on the top wire, target qubit on the bottom wire. In the circuit picture it looks like a control dot connected by a vertical line to an XOR circle. It flips the target qubit if and only if the control is |1⟩. That description is operational. What it doesn't immediately convey is the asymmetry between how CNOT acts on the computational basis (Z basis) and how it acts on the Hadamard basis (X basis). In the Z basis it copies the control. In the X basis it copies the target. The gate has a symmetry the circuit notation doesn't show.</p>

      <p>The ZX-calculus makes that symmetry visible by construction. Each gate decomposes into coloured nodes — called spiders — that correspond directly to copying operations in specific bases. Once you draw the ZX diagram of CNOT, the Z/X symmetry is immediate: it's in the colours.</p>

      {/* ── §02 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§02</span>
        <span>Spiders</span>
      </h2>

      <p>There are two generators. The <strong>Z-spider</strong> (drawn green) with <span className="mono">n</span> input wires, <span className="mono">m</span> output wires, and a phase <span className="mono">α</span> represents the linear map:</p>

      <p style={{ textAlign: "center", margin: "1.4rem 0", fontFamily: "var(--f-mono)", fontSize: "0.9rem", color: p.ink, padding: "0.8rem 1rem", border: `1px dashed ${p.line}`, background: `color-mix(in oklch, ${p.paper} 80%, ${p.ink})` }}>
        |0⟩<sup>⊗m</sup>⟨0|<sup>⊗n</sup> + e<sup>iα</sup>|1⟩<sup>⊗m</sup>⟨1|<sup>⊗n</sup>
      </p>

      <p>The <strong>X-spider</strong> (drawn red) is the same construction in the Hadamard-conjugate basis — |+⟩ and |−⟩ instead of |0⟩ and |1⟩. When the phase is zero, both spiders are classical copying maps: the Z-spider copies the computational basis; the X-spider copies the Hadamard basis. When the phase is π, the Z-spider becomes a Pauli-Z gate and the X-spider becomes Pauli-X (a NOT gate).<span className="sidenote-number" style={{ color: p.accent }}>2</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> More precisely: a Z-spider with one input, one output, and phase α is the gate diag(1, e<sup>iα</sup>) — the phase gate R<sub>z</sub>(α). At α = 0 it's the identity. At α = π it's Z. The arity (number of wires) and the phase together determine which map you're describing.
        </span>
      </p>

      <p>Wires are qubits. Bending a wire backward turns an input into an output (the "cup" and "cap" morphisms from compact closed categories — ZX-calculus is genuinely a categorical object, not just a diagrammatic convention). The language is compositional: you can stack diagrams side by side for tensor product and connect them end-to-end for sequential composition, just as with circuit diagrams.</p>

      <p>The first rule to learn — and the one that everything else builds on — is spider fusion.</p>

      <PullQuote color={p.accent}>Two spiders of the same colour connected by a wire are one spider. Phases add.</PullQuote>

      <Figure caption="Two Z-spiders (green) connected by a wire. Set the phases α and β with the sliders, then click 'fuse' to see them collapse into a single spider with phase α + β. This is the spider fusion rule — the most-used rewrite in the calculus." palette={p}>
        <SpiderFusion palette={p} />
      </Figure>

      <p>Fusion is both visually obvious (two nodes sharing a wire become one node) and algebraically correct: you can verify it by multiplying out the matrices. The payoff of the graphical approach is that you stop reaching for matrices. Reasoning about quantum maps becomes reasoning about pictures.</p>

      {/* ── §03 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§03</span>
        <span>Three rules</span>
      </h2>

      <p>Beyond fusion, there are two other rules that do most of the work in practice.</p>

      <p><strong>The Hadamard rule</strong>: a Hadamard gate on a wire converts a Z-spider into an X-spider and vice versa. Hadamard is depicted as a yellow square on a wire. Pushing a Hadamard through a spider changes its colour. This is why the Z/X symmetry of CNOT is visible in ZX: CNOT decomposes into a green spider controlling a red spider, and Hadamard at either end can swap which is which.</p>

      <p><strong>The bialgebra rule</strong>: a green spider copying a red spider is equal — as a linear map — to a red spider copying a green spider. This rule is what gives the calculus its power for reasoning about entanglement. It underlies why CNOT has the Z/X symmetry I described earlier, and it's the key step in the ZX proof of quantum teleportation.<span className="sidenote-number" style={{ color: p.accent }}>3</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> "Bialgebra" is the name because it encodes the coherence between two Frobenius algebras — one for each colour. The Frobenius algebra structure is why spiders behave like "copying and deleting" operations, which is exactly the structure that classical information processing uses. The bialgebra rule says the two Frobenius algebras interact coherently — and that coherence is what makes them quantum rather than classical.
        </span>
      </p>

      <Figure caption="Three views of the Bell state preparation (H + CNOT on |00⟩). The circuit view shows the gate sequence. The ZX view shows why it creates entanglement: a Z-spider copied into an X-spider. The bialgebra view shows the key rewrite rule underlying both the CNOT symmetry and the teleportation proof." palette={p}>
        <ZXRewrite palette={p} />
      </Figure>

      <p>These three rules — fusion, Hadamard colour-change, and bialgebra — plus a few smaller housekeeping rules are sufficient to prove all equations between <em>Clifford</em> quantum circuits: circuits that use only Hadamard, CNOT, and the phase gate S. The Clifford group is the stabiliser formalism, and ZX is complete for it.</p>

      {/* ── §04 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§04</span>
        <span>Why teleportation is obvious</span>
      </h2>

      <p>In the circuit picture, quantum teleportation is a sequence: share a Bell pair; Alice applies CNOT and Hadamard; Alice measures; send two classical bits; Bob applies corrections. Five steps, and the reason the corrections work requires tracking what the measurements do to the remaining qubit's state through the formalism.</p>

      <p>In ZX, the proof is essentially one rewrite. You draw the protocol as a diagram — the Bell pair preparation, the entangled measurements, the classical corrections — and then you apply the bialgebra rule to the middle of the diagram. The measurement nodes and the correction nodes cancel. What remains is a single wire connecting Alice's input state to Bob's output: the teleportation has happened, and the diagram makes clear that it was always going to happen because the structure of the Bell pair and the structure of the measurement were designed to be each other's adjoint.</p>

      <p>This is the sense in which ZX makes the reason visible, not just the sequence. The circuit told you that teleportation works. The diagram tells you <em>why</em>: it's because the measurement in the entangled basis is, up to local operations, the inverse of the Bell pair preparation. The protocol cancels with its own adjoint. No state is sent. The quantum channel is already there; the measurement wires it up.</p>

      <PullQuote color={p.accent}>The circuit tells you teleportation works. The diagram tells you why: it cancels with its own adjoint.</PullQuote>

      {/* ── §05 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§05</span>
        <span>Completeness and what comes after</span>
      </h2>

      <p>Completeness for Clifford circuits was proved around 2014. Full completeness for all quantum maps — meaning any equation between arbitrary quantum circuits is provable from ZX rewrites — was established in 2017-18, with contributions from Jeandel, Perdrix, Vilmart and others. This is a strong result: it means ZX-calculus is not a convenient shorthand for a subset of quantum mechanics but a complete formal language for all of it.<span className="sidenote-number" style={{ color: p.accent }}>4</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> Full completeness required adding the Euler decomposition of the Hadamard as an explicit axiom, and handling the scalar factors (global phases and normalisations) carefully. The scalar-free version is cleaner; the scalar-tracked version is more pedantic but necessary for proving that two circuits implement exactly the same unitary, not just the same unitary up to phase.
        </span>
      </p>

      <p>The practical consequence is circuit optimisation. The most expensive non-Clifford gate in most near-term quantum computers is the T gate (a π/8 phase rotation). Reducing the T-count of a circuit — the number of T gates — directly reduces the error budget. ZX-calculus, via the software library PyZX (developed by Kissinger and van de Wetering), can automate T-count reduction by applying a sequence of rewrites that simplify the ZX diagram of a circuit without changing what it computes. The reductions can be substantial: circuits that look irreducible in the gate model often simplify dramatically in ZX.</p>

      <p>Beyond optimisation: ZX has been used to reason about measurement-based quantum computation (MBQC), where the resource states and measurement patterns translate directly into ZX diagrams. It is also a natural language for quantum error correction — the stabiliser codes are essentially Clifford objects, and ZX is complete for those. Coecke's broader programme of categorical quantum mechanics, of which ZX is one realisation, has also found applications in natural language processing (via DisCoCat) and in the foundations of quantum gravity.</p>

      <p>I am not yet at the point where I reach for ZX-calculus as a working tool rather than a reading pleasure. But I think the notation has taught me something that the circuit model didn't: there is a difference between being able to follow a quantum protocol and understanding its structure. The circuit is a recipe. The ZX diagram is closer to an explanation.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written between sessions reading Coecke and Kissinger's textbook, on a Thursday evening in London.</p>
    </>
  );
}
