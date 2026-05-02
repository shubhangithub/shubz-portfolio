// @ts-nocheck
import React from 'react';
import { CtlaDistribution, Figure, GateSensitivity, PullQuote, ThresholdMethods } from '../legacy';

export function ThresholdEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        The slide came up at week six of the MFoCS.<span className="sidenote-number" style={{ color: p.accent }}>1</span> A scatter plot of single cells from a tumour sample, axes labelled CD4 and CD8. The clinician giving the talk circled a region with a laser pointer and called those cells "positive," like that settled the matter. What I wanted to ask — and didn't, because you learn quickly at Oxford that the second-year student is not the one who gets to question the consultant — was: <em>where, exactly, did you draw that line?</em>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> MFoCS thesis, Oxford · Lady Margaret Hall, 2024 — "Analysing and Advancing Automated Immune Biomarker Detection." Multiplex immunofluorescence data on tumour-associated immune populations.
        </span>
      </p>

      <p>That question became my thesis. Two tumour files from two distinct patients — one around 9,500 cells, the other around 5,500 — six immune markers per cell, and for each marker, a threshold that a pathologist had drawn by eye on a log-transformed intensity histogram. Move that line half a unit and the "positive" population shifts noticeably. Move it the other way and you import background noise. The biology hasn't changed. The category has.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§01</span>
        <span>Six markers, one panel</span>
      </h2>

      <p>The dataset was a multiplex immunofluorescence panel of six markers — CD66b, CD56, CD4, CTLA-4, CD8, and CD20 — measured on tumour-infiltrating lymphocytes from two distinct patients.<span className="sidenote-number" style={{ color: p.accent }}>2</span> Each cell is a 6-vector of fluorescence intensities. The clinical workflow is to drop a threshold per marker and read off proportions in each gate. CD66b marks neutrophils. CD4 and CD8 split helper from cytotoxic T cells. CD20 picks out B cells. CTLA-4 flags exhausted T cells. CD56 marks natural killer cells. Together, the six markers give you a rough picture of how the immune system is engaging the tumour.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> Two tumour files from distinct patients, selected after discarding files with spatial artefacts from slide scanning. Each accompanied by a pathologist's ground truth — thresholds set by expert review of histograms.
        </span>
      </p>

      <p>A cell sitting just inside the CD4+ gate and a cell sitting deep inside it count the same. The gate is binary. The biology is not. That gap is where the interesting problems live.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§02</span>
        <span>Four ways to draw a line</span>
      </h2>

      <p>The question I spent most of the summer on: can an algorithm draw the threshold as well as the pathologist? I tried four approaches, each with a different idea about what "the right place" means.</p>

      <p><strong>Otsu</strong> looks for a valley. It treats the intensity histogram as two classes and finds the threshold that maximises the between-class variance — the point where the two populations are most cleanly separated. It works beautifully on markers with a clear bimodal distribution. On anything else, it guesses.</p>

      <p><strong>IsoData</strong> iterates. Start with the mean intensity, split the data, recalculate each half's mean, set the threshold to the average of the two means, repeat until stable. It converges quickly and handles skewed distributions better than Otsu. It became the default thresholding method for later stages of the thesis — not because it won every marker, but because it lost gracefully on the ones it didn't win.</p>

      <p><strong>A modified Gaussian mixture model</strong> fits two bell curves to the distribution and sets the threshold where the curves cross.<span className="sidenote-number" style={{ color: p.accent }}>3</span> For markers like CD56, where the distribution has an awkward shoulder rather than a clean valley, the GMM outperformed everything else. I ended up writing a custom variant that handled cases where the standard fit returned more than two components — collapsing the extras into the nearest Gaussian before picking the crossing point.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> Standard GMM fits K Gaussians via expectation-maximisation. The threshold is the point where the posterior probabilities of the two components are equal. The custom modification handles the K &gt; 2 case by merging components before thresholding.
        </span>
      </p>

      <p><strong>Minimum cross-entropy</strong> takes an information-theoretic view: find the threshold that minimises the cross-entropy between the original histogram and a thresholded version of it. Elegant in theory. In practice, it was the most sensitive to distributional shape and the least stable across markers.</p>

      <Figure caption="Pick a marker to see where each method draws the line. On well-separated markers (CD66b), they converge. On ambiguous ones (CTLA-4), they scatter." palette={p}>
        <ThresholdMethods palette={p} />
      </Figure>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§03</span>
        <span>The marker that broke everything</span>
      </h2>

      <p>CTLA-4 broke every method I tried. Its expression distribution is not bimodal — it's flat, spread, ambiguous. There is no valley for Otsu to find. IsoData converges to a threshold that's stable but not particularly meaningful. The GMM fits two wide, overlapping Gaussians and picks a crossing point that's as much a coin flip as a classification. Minimum cross-entropy was worst of all.</p>

      <Figure caption="CD66b (left) has a clean valley — all methods agree within a narrow band. CTLA-4 (right) has no valley. The methods scatter across the distribution, each guessing differently." palette={p}>
        <CtlaDistribution palette={p} />
      </Figure>

      <p>The pathologist's threshold for CTLA-4 is the only stable anchor, and it's arrived at by looking at the histogram and making a judgement call.<span className="sidenote-number" style={{ color: p.accent }}>4</span> There's nothing wrong with that — it's how clinical immunology works, and it works. But it does mean that "automated detection" has a hard ceiling on this marker: you can automate the easy calls, and for the hard ones you're still relying on exactly the kind of expert judgement you were trying to replace.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> CTLA-4 is an immune checkpoint receptor — it down-regulates T-cell activation. Its expression is continuous and context-dependent, which is exactly why it resists binary gating. The biology is genuinely ambiguous, and the histogram reflects that.
        </span>
      </p>

      <PullQuote color={p.accent}>You can automate the easy calls. For the hard ones, you're still relying on the judgement you were trying to replace.</PullQuote>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§04</span>
        <span>What 0.11 units hides</span>
      </h2>

      <p>The number that stuck with me: move the CD4 gate from 4.39 to 4.50 — less than three percent of the intensity range — and the "positive" population shrinks visibly. The cells that vanish were sitting just inside the boundary. They weren't confidently positive; they were categorically positive, which is a different thing entirely.</p>

      <Figure caption="Drag the gate on a CD4-like distribution. The positive/negative split updates in real-time. Small moves in the threshold produce large swings in the population count." palette={p}>
        <GateSensitivity palette={p} />
      </Figure>

      <p>This isn't a failure of the methods. It's the nature of the problem. When the underlying distribution has cells clustering around the threshold — which it always does, because biological expression is continuous — any binary gate will be fragile at the boundary. The gate is not a measurement. It's a decision wearing a lab coat.</p>

      <p>IsoData was the most reliable method overall. The custom GMM earned its complexity for markers with awkward shoulders. Otsu was fine when the valley was clean and useless when it wasn't. Minimum cross-entropy was a good idea that didn't survive contact with real data. And CTLA-4 taught me that some markers simply resist automation — not because the algorithms are bad, but because the biology is genuinely ambiguous.</p>

      <PullQuote color={p.accent}>The gate is not a measurement. It's a decision wearing a lab coat.</PullQuote>

      <p>The companion essay — <em>Clustering with a conscience</em> — picks up where thresholding stops: what happens when you try to classify cells by their full six-marker profiles, not one marker at a time.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written from the King's Cross flat, on a Tuesday that felt like a Thursday.</p>
    </>
  );
}
