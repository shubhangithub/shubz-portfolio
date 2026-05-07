// @ts-nocheck
import React from 'react';
import { BottleneckMap, Figure, JaggedFrontier, PullQuote, ReadingCluster, WhoIsWe } from '../legacy';

export function BluedotEssay({ palette: p }) {
  return (
    <>
      {/* ── LEDE ── */}
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        Throughout 'Machines of Loving Grace,' Dario Amodei's October 2024 essay on what powerful AI might produce, the word 'we' does three distinct jobs simultaneously, without announcing which one it's doing.<span className="sidenote-number" style={{ color: p.accent }}>1</span> 'We will be able to cure most infectious diseases' is one scope. 'We will need to fight for this outcome against those who would concentrate power' is another. The lab's own voice — bounded and specific — is a third. The gap between the civilisational 'we' and the actual room where AI decisions get made is the unit's central question, and is not named directly.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> The three 'we' referents appear sometimes within paragraphs of each other: lab-we (bounded, specific to the organisation), civilisational-we ('we will cure most infectious diseases'), and rhetorical-we ('we will need to fight for this outcome'). Amodei's introduction explicitly flags the risk of AI lab CEOs sounding grandiose — the flag and the usage coexist, which is itself an interesting feature of the essay.
        </span>
      </p>

      <p>This essay is an attempt to answer one question: what would it actually take to shape AI's future toward the good outcome? BlueDot Impact's AGI Strategy cohort assigned nine readings to that question. Taken together, they are not a debate so much as a set of partial answers to the same problem. I'll work through six constraints, in order. Each one makes the answer harder and more specific. The last one is: who, exactly, is the 'we' in all of this?</p>

      {/* ── §01 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§01</span>
        <span>The prize</span>
      </h2>

      <p>Start with what makes the question worth asking. 'Machines of Loving Grace' is the most expansive, carefully-argued optimistic vision any frontier lab author has published. Its central claim is if alignment is solved, powerful AI compresses decades of progress in biology, mental health, economic development, and geopolitics into a much shorter window. Not 'AI will be useful' — that's already true — but something structurally different: a 'country of geniuses in a datacenter,' running, in his projection, at ten to a hundred times human speed, taking on the problems that have resisted human intelligence for generations.</p>

      <p>The framework Amodei uses to make this claim is the most useful analytical tool in any of the unit's readings. He calls it marginal returns to intelligence: for any task, ask how much faster it would go with vastly more intelligence, holding everything else constant. The answer varies wildly by domain. Writing code is highly intelligence-bottlenecked since almost all the constraints are cognitive, and better reasoning produces better code almost directly. Drug discovery is intelligence-bottlenecked in its early stages (hypothesis generation, target identification, experimental design) but time-bottlenecked in its later stages, where Phase I, II, and III trials run on human biology that cannot be parallelised beyond the population that is willing to participate. Building democratic institutions is barely intelligence-bottlenecked at all. We know quite well what good institutions look like, so the bottleneck is political will, historical contingency, and coordination problems that accumulate over decades.</p>

      <p>This distinction — between intelligence bottlenecks and everything else — is a good tool for evaluating the grand claims. 'AI will transform biology' needs to be evaluated differently from 'AI will transform geopolitics,' because biology and geopolitics are differently bottlenecked. 'AI will double human lifespan' hits the clinical-trial constraint almost immediately, since no amount of intelligence shortens the time it takes to run a ten-year longevity trial, because the biology is the experiment and it runs in real time.<span className="sidenote-number" style={{ color: p.accent }}>2</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> Amodei acknowledges the experiment-time and clinical-trial constraints and then claims 10x compression in 5–10 years anyway, via massive parallelism. The essay doesn't show why parallelism overcomes the serial dependencies he just named. The framework is better than the conclusion it generates — which is a reason to use the framework, not a reason to dismiss the vision.
        </span>
      </p>

      <Figure caption="Five domains of AI impact, broken down by bottleneck type. The blue fraction is where more intelligence would directly accelerate progress. The remainder — experiment time, regulatory systems, social dynamics, political structures — is less intelligence-sensitive. Hover to read the detail for each domain." palette={p}>
        <BottleneckMap palette={p} />
      </Figure>

      <p>The diagram is a way of taking the vision seriously enough to ask which parts of it are actually delivered by more intelligence and which parts require different inputs entirely. Drug discovery and mental health are heavily intelligence-bottlenecked in their early stages — real wins, real acceleration. Economic development and geopolitics are mostly not. The honest version of the prize is domain-specific: powerful AI delivers a lot in some areas and little in others, depending on what is actually in the way. That's what makes the claim worth taking seriously rather than dismissing it or swallowing it whole. The prize is real. Now the question is what stands between here and there.</p>

      {/* ── §02 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§02</span>
        <span>The structural obstacle</span>
      </h2>

      <p>The first thing standing between here and the prize is a fact about markets: pure commercial incentives cannot produce a net good AI outcome. IFP names it explicitly — beneficial AI applications are undersupplied by markets. Defensive technologies receive roughly 2% of AI research investment and about $100 million a year globally. The other readings imply it: Toner supports transparency regimes and third-party audits that markets don't generate; RAND assumes state-level coordination as its baseline; Amodei treats market forces as background to be steered from outside. Even the most market-friendly voice in the unit closes his essay by calling for collective decisions about 'broad bounds' — admitting, without quite naming it, that the market won't set them.</p>

      <p>The visible debate in AI circles — optimists versus pessimists, accelerationists versus doomers, tends to obscure this near-consensus. Both sides agree that market incentives alone won't deliver the prize. The actual disagreement is about who should fill the gap, through what mechanism, and on what timeline. For this, the unit contains five competing answers:</p>

      <ol style={{ margin: "1.2rem 0", paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li><strong>The US government as strategic actor</strong> (IFP, Amodei): use supply-chain dominance, R&amp;D funding, and export controls to shape which capabilities are built first and who gets access.</li>
        <li><strong>Multilateral dialogue</strong> (RAND): build institutional channels between great powers to manage AI competition without triggering the instabilities that arms-race logic produces.</li>
        <li><strong>External regulation with real teeth</strong> (Samuel): change the incentive structure across the whole industry; taxation, liability, and legislative instruments rather than voluntary commitments.</li>
        <li><strong>Reformed internal governance</strong> (Altman, implicitly): labs themselves can develop governance structures — benefit corporations, long-term benefit trusts, internal safety boards, that resist market pressure over time.</li>
        <li><strong>Emergent, decentralised dynamism</strong> (Toner): resist the urge to pick an end-state; build the conditions under which many actors, many approaches, and many feedback loops compete, and no single one locks the outcome in.</li>
      </ol>

      <p> A multilateral dialogue can coexist with domestic regulation and reformed lab governance. But they compete for political bandwidth, institutional energy, and the authority to set the terms — and there is a deeper problem underneath, which Samuel names more precisely than the others. The structural pressure on safety-first commitments isn't a product of bad intentions. It's a product of competitive dynamics, capital dependency, and regulatory ambiguity, which are forces that operate regardless of what a given lab believes or says. Any governance answer that relies on voluntary commitment has to explain why the structure won't erode it.</p>

      <PullQuote color={p.accent}>The honest question isn't 'why does market pressure win?' It's 'what institutional design is strong enough to resist it?'</PullQuote>

      <p>Samuel's piece is most valuable not as a critique of any specific actor but as a problem specification: what institutional form allows a safety-first lab to remain safety-first under market conditions that weren't designed to support it? She reaches toward 'government regulation' without specifying which instrument, at which level of government, with what enforcement mechanism. That vagueness is the essay's weakness. But the question is exactly right. Knowing the obstacle is different from having a mechanism. Here's the most concrete one in the unit.</p>

      {/* ── §03 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§03</span>
        <span>What shaping actually looks like</span>
      </h2>

      <p>The Institute for Progress's contribution is partly about the market-failure diagnosis, but its most original argument is about path dependence. The same general AI capabilities can be channelled toward defence or offence, toward beneficial or harmful ends, depending on what gets built first and what infrastructure accumulates around it. The order of capability development matters as much as the eventual capability set.</p>

      <PullQuote color={p.accent}>The order of capability development matters as much as the eventual capability set.</PullQuote>

      <p>This reframing is important because the question isn't whether AI is good or bad in the abstract, the question is: given that powerful AI is coming, which capabilities should arrive first? The answer depends on the 'jagged frontier,' which is the observation that AI advances unevenly across domains. It has advanced enormously in language and code generation, considerably in protein structure prediction; less so in reasoning about physical systems, relatively little in autonomous multi-day task completion in complex real-world environments. At any given moment, the frontier is jagged, and the shape of that edge determines what is and isn't possible to shape. Combine this with the marginal-returns framework from §01 and you get a specific policy agenda: accelerate in domains that are intelligence-bottlenecked and defensively oriented, and proceed cautiously in domains that are intelligence-bottlenecked and offensively oriented. Cybersecurity is roughly symmetric where AI can help defence about as much as offence. Biology is not: at the frontier, AI-assisted biodesign poses near-term offensive risks that biodefence infrastructure isn't yet equipped to match.</p>

      <p>IFP names three historical playbooks for how this kind of deliberate shaping has been done before:</p>

      <ol style={{ margin: "1.2rem 0", paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li><strong>Nonproliferation</strong> (nuclear weapons): restrict access to dangerous capabilities from the outset via export controls and international treaty regimes. In AI terms: compute and chip export controls, chokepoints the US holds via TSMC's reliance on US-origin tools and IP, and ASML's EUV scanners — though ASML is Dutch, so meaningful export controls require Dutch and Japanese coordination.</li>
        <li><strong>Selective acceleration</strong> (Human Genome Project): public investment in a specific beneficial application, built ahead of and to a higher standard than private alternatives would produce. In AI terms: AI-assisted drug discovery, pandemic preparedness, climate modelling.</li>
        <li><strong>Defensive acceleration</strong> (Operation Warp Speed): crash programme to build defensive capabilities before an offensive threat has time to mature. In AI terms: AI-assisted cybersecurity, interpretability research, biodefence.</li>
      </ol>

      <Figure caption="Two scenarios for AI capability development over 2025–2030. Defence-first: interpretability, cyber-defence, and benign-use biology are prioritised. Capability-first: dual-use and offensive capabilities race ahead. Toggle between scenarios to see which domains cross the safety threshold in each path." palette={p}>
        <JaggedFrontier palette={p} />
      </Figure>

      <p>The key is the historical specificity. IFP isn't arguing from first principles that shaping is possible, it's showing the US has done it before, in three different modes, with different instruments. The case studies drag the 'can we shape this?' question out of pure hypothetical and into documented precedent. The limiting assumption that 'US shaping' and 'good shaping' are the same thing is left mostly implicit. The mechanisms IFP wants: compute restrictions, supply-chain leverage, export controls. All of these concentrate decision-making authority in whichever executive branch is in office. The governance of the shaping mechanism is its own open problem. The mechanism works domestically. The international version is harder.</p>

      {/* ── §04 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§04</span>
        <span>The international complication</span>
      </h2>

      <p>The RAND paper is the most technically disciplined piece in the unit. It targets MAIM — Mutual Assured AI Malfunction — the proposal that states should deter AI monopoly bids via the credible threat of preventive infrastructure sabotage. RAND endorses the two less aggressive pillars of the underlying proposal (nonproliferation and managed competition) and attacks only the third. The attack is surgical.</p>

      <p>MAD — Mutual Assured Destruction — worked as nuclear deterrence because a disarming first strike was made infeasible by survivable second-strike capability: submarine-launched missiles, hardened silos, dispersed bombers that no first strike could reliably destroy. The stability came from the <em>inability</em> to destroy an opponent's retaliatory capacity, not from a threat to try. MAIM inverts this logic: it asks states to develop first-strike capabilities and use the threat of deploying them as deterrent. That is preventive war doctrine, not MAD — a distinction with a bad historical record.<span className="sidenote-number" style={{ color: p.accent }}>3</span> There is also a technical problem: 'AI infrastructure' has no clean trigger point. A nuclear launch is a discrete event. There is no equivalent threshold that would clearly activate a MAIM response, which means every actor is guessing at the other side's red lines, and guessing wrong means catastrophe.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> RAND also notes that AI development is distributed across cloud providers, research institutions, and hardware manufacturers in ways that make comprehensive sabotage technically unavailable short of actions that would look like acts of war. The kill switch MAIM assumes does not exist in the form required — and trying to build one would itself be destabilising.
        </span>
      </p>

      <p>Three papers later in the same unit, Amodei proposes an 'entente strategy': the democratic coalition should leverage its AI advantage to set global terms — offering AI benefits to countries that accept the coalition's norms, withholding from those that don't. He frames this via 'Atoms for Peace,' a carrot-heavy programme from a different Cold War. The framing is different from MAIM: carrots before sticks, coalition-building rather than sabotage threat, more cooperative in tone. But RAND's structural critique — that any framework using AI advantage as geopolitical leverage generates first-mover incentives and pushes rival development underground — applies to the genus, not just to the most aggressive species. Both proposals require the democratic coalition to maintain a decisive enough lead that rivals comply; both create pressure for rivals to race before that threshold is crossed. The two papers never engage each other. They are on the same reading unit, responding to the same underlying problem, with proposals that are closer in structure than their framing suggests.</p>

      <Figure caption="Nine readings plotted by primary diagnosis (structural problem ← → prescriptive vision) and temperament (risk-first ↓ ↑ upside-first). The clusters that don't talk to each other — shaping/inevitability top-right versus risk/restraint bottom-left — are the ones whose proposals interact most directly. Hover to see each reading's core thesis." palette={p}>
        <ReadingCluster palette={p} />
      </Figure>

      <p>The diagram makes visible something the unit leaves implicit: the readings that are most in tension with each other are precisely the ones that don't engage each other. The optimism cluster (top-right) and the risk cluster (bottom-left) are structured responses to the same question — how to get from here to the prize — and they'd sharpen each other considerably if put in direct dialogue. A unit worth arguing with itself would have flagged that proximity. Even with the mechanism from §03 and an approach to the geopolitics, there is still the question of what future we are actually aiming for.</p>

      {/* ── §05 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§05</span>
        <span>What kind of future, exactly?</span>
      </h2>

      <p>Rutger Bregman's chapter from <em>Utopia for Realists</em> looks like the odd one out in this unit. It is about whether affluent societies can still imagine a better future — not about AI strategy specifically. But it has the sharpest analytical frame in the unit for reading the vision essays — and for understanding why the geopolitical complications in §04 are harder than they look.</p>

      <p>Blueprint utopias are rigid. They have an endpoint, a destination, a specific vision of what the good society looks like. Communism was a blueprint utopia — not because the vision was entirely wrong, but because the blueprint mode led to treating any deviation from the plan as heresy and any obstacle as evidence of sabotage. Blueprint utopias fail in a specific way: the map doesn't match the territory once you arrive, and the project of arriving tends to justify means that corrode the ends it was meant to serve.</p>

      <p>Guidepost utopias are directional without being prescriptive. Thomas More's original <em>Utopia</em> was a guidepost: a critique of the present dressed as a picture of somewhere else. The Enlightenment was a guidepost project — more freedom, more reason, less arbitrary authority — without specifying exactly what the free, rational society looked like. The direction matters; the specific endpoint doesn't, and locking it in too tightly is its own kind of error.</p>

      <p>Most AI strategy writing tends toward blueprint mode, and the most ambitious essays tend toward it most. 'Theory of victory' thinking — Toner's term for the habit — is blueprint thinking: there's an endgame, and the strategy is the path to that endgame. The most expansive vision essays in this unit offer detailed predictions across five domains: named outcomes, specific timescales, named geopolitical end-states, closing literary references to famous fictional utopias. These are rich destinations, and the vision is compelling on its own terms. The blueprint quality isn't a flaw in itself — destinations are motivating. But it does mean that when the path changes, the vision needs to update, and blueprint mode makes updating harder. Specific predictions get locked in. Revisions feel like retreats. And as §04 showed, the geopolitical path is very likely to change.</p>

      <p>Toner's essay is the most self-consciously guidepost voice in the unit. She imports Virginia Postrel's dynamism-versus-stasism framework and applies it to AI governance: dynamist approaches act on local knowledge, maintain competitive feedback, and produce nested revisable rule structures; stasist approaches centralise control, fix outcomes, and resist deviation. The framework is useful for sorting governance proposals — you can use it to rule out the Bostrom-style 'ubiquitous real-time worldwide surveillance' solutions, which are stasist and whose costs in non-catastrophic worlds are real. You can't use it, on its own, to select among dynamist alternatives.<span className="sidenote-number" style={{ color: p.accent }}>4</span> What Toner's frame does is ensure that the mechanism from §03 and the geopolitical approach from §04 stay adaptive — that the shaping strategy updates as the frontier jagged edge moves. A guidepost says which direction is forward. Having established what the prize is, what the obstacle is, what the mechanism is, and what the international complication is — the last question is: who, actually, is the 'we' doing all of this?
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> Toner is honest about this: the essay explicitly says she doesn't have solutions, just a better frame for the debate. That's admirable and also limits the essay's practical reach. A frame that rules out bad options without selecting among good ones is valuable — but the unit needs at least one paper that gets to the institutional specifics, and none of them quite do.
        </span>
      </p>

      {/* ── §06 ── */}
      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§06</span>
        <span>Who is "we"?</span>
      </h2>

      <p>The diagram below is a map of the current state, not a criticism of it.</p>

      <Figure caption="When these essays use 'we', the referent shifts across four nested scopes. The innermost ring is where most decisions currently get made. The outermost ring is the implied subject of the most ambitious predictions — 'we will cure most diseases,' 'we will end poverty.' Hover each ring to see what 'we' means at that level." palette={p}>
        <WhoIsWe palette={p} />
      </Figure>

      <p>The room is small. When a technology is new enough, decisions happen before the governance infrastructure exists to broaden them. That is true of nuclear — for its first decade, essentially every consequential decision was made by a handful of physicists, generals, and one president. True of the internet — its architecture was set by a community of hundreds before billions were using it. True of biotech — the recombinant DNA debates of the 1970s happened in a room that excluded almost everyone whose life would be shaped by the outcome. The smallness of the room is not unusual. It is how it starts.</p>

      <p>What the diagram makes visible is the gap between the innermost and outermost rings — the gap between the actual decision-makers and the implied subjects of the civilisational predictions. That gap is not permanent. It is the governance problem in spatial form, and it is closeable by deliberate institutional design. The question is not whether the room is small now — it is — but what gets built to widen it, on what timeline, and whether the building happens before or after the most consequential decisions are made.<span className="sidenote-number" style={{ color: p.accent }}>5</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>5.</strong> Toner's concentration-of-power framing is the most careful treatment of this in the unit. She names it as a first-class existential risk distinct from misalignment — a world where AI is aligned but controlled by a narrow group is not a good outcome even if the group has good intentions. The institutional question is: what structures make power concentration less likely as capability increases? None of the nine readings fully answers this.
        </span>
      </p>

      <p>Nine readings. What I actually think, having read them all: the marginal-returns framework is the unit's most durable contribution — it lets you stop arguing about whether AI is transformative in the abstract and start asking domain-specific questions about bottlenecks. RAND's critique lands harder than anyone in the optimism cluster seems to notice. The two papers that should have argued with each other didn't. Bregman's blueprint/guidepost distinction is the right diagnostic for why most AI strategy writing feels simultaneously ambitious and somehow unserious. And the IFP playbooks are encouraging precisely because they're not theoretical — they're historical. Shaping has worked before. Whether it will work here depends on whether the institutions doing the shaping exist yet.</p>

      <p>And the 'we' is small. The bottleneck isn't ideas — this unit is full of good ones. It's the organisations that make safety commitments sticky, that get governance in place before the capability arrives, that hold the plural competition Toner describes together without letting it slide into the instability RAND warns against. The safety labs, policy institutes, international bodies, and cohort programmes being built now — BlueDot's among them — are the first serious attempt to close that gap. They're early. That's the point.</p>

      {/* ── CREDITS ── */}
      <div style={{ marginTop: "3rem", padding: "1.2rem 1.4rem", border: `1px solid ${p.line}`, background: `color-mix(in oklch, ${p.paper} 88%, ${p.ink})`, borderRadius: 3 }}>
        <div className="caps mono" style={{ fontSize: 10, color: p.muted, letterSpacing: "0.1em", marginBottom: "0.8rem" }}>Acknowledgements &amp; readings</div>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: p.muted, margin: "0 0 0.7rem" }}>
          This essay was written as part of <strong style={{ color: p.ink }}>BlueDot Impact's AGI Strategy cohort</strong> (2026). The synthesis is my own; any errors in characterising the readings are mine. I am grateful to the cohort facilitators and fellow participants whose discussions sharpened several of the arguments here.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 1.2rem" }}>
          {[
            ["RAND",    "Rehman, Mueller & Mazarr — 'Seeking Stability in the Competition for AI Advantage'"],
            ["Vox",     "Sigal Samuel — 'It's Practically Impossible to Run a Big AI Company Ethically'"],
            ["Toner",   "Helen Toner — 'In Search of a Dynamist Vision for Safe Superhuman AI'"],
            ["IFP",     "Fist, Burga & Hwang — 'Preparing for Launch'"],
            ["Bregman", "Rutger Bregman — Utopia for Realists, Ch. 1"],
            ["Amodei",  "Dario Amodei — 'Machines of Loving Grace' (2024)"],
            ["Altman",  "Sam Altman — 'The Gentle Singularity' (2025)"],
            ["Altman",  "Sam Altman — 'The Intelligence Age' (2024)"],
            ["Krook",   "Joshua Krook — 'Solarpunk: A Vision for a Sustainable Future'"],
          ].map(([auth, title], i) => (
            <div key={i} style={{ fontSize: "0.8rem", lineHeight: 1.5, color: p.muted }}>
              <span style={{ color: p.accent, fontFamily: "var(--f-mono)", fontSize: "0.75rem", marginRight: 6 }}>{auth}</span>
              {title}
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written during the first week of BlueDot's AGI Strategy cohort, in London.</p>
    </>
  );
}
