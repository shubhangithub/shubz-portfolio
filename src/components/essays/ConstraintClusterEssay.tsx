// @ts-nocheck
import React from 'react';
import { ConstraintEffect, Figure, MethodRanking, PullQuote, ViolationNetwork } from '../legacy';

export function ConstraintClusterEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        The first time I ran a standard clustering algorithm on the tumour data, it returned a cluster of cells that were simultaneously CD66b-positive and CD4-positive.<span className="sidenote-number" style={{ color: p.accent }}>1</span> Neutrophils that are also helper T cells. That doesn't happen in biology — CD66b is a granulocyte marker and CD4 is a lymphocyte marker, and a cell is one or the other, not both. The algorithm didn't know that. It saw two intensities that happened to be high and grouped them together, because statistically, they looked close.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> This is the second essay from my MFoCS thesis (Oxford, 2024). The first — <em>Where the gate falls</em> — covers the thresholding problem: where to draw the line on a single marker. This one is about what happens when you try to classify cells by all six markers at once.
        </span>
      </p>

      <p>The thresholding essay ended with a question: what happens when you stop classifying one marker at a time and try to see the full six-dimensional profile? Clustering is the answer. It's also where everything gets harder, because the algorithms don't know immunology and the immunologists don't write clustering algorithms.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>Why not just threshold?</span>
      </h2>

      <p>Thresholding treats each marker independently. You draw a gate on CD4, another on CD8, another on CD66b, and classify each cell by its binary profile — the vector of which markers it's above-threshold for. It works, and for most of the clinical workflow it's enough.</p>

      <p>But it misses relationships. A cell expressing both CD4 and CTLA-4 is a regulatory T cell in a specific activation state — that combination means something different from the sum of its parts.<span className="sidenote-number" style={{ color: p.accent }}>2</span> Clustering in six-dimensional marker space lets you find these profiles without pre-specifying what to look for. The idea is that the structure is already in the data; you just need an algorithm that can see it.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> CD4+CTLA-4+ cells are often regulatory T cells showing immune checkpoint activity — they're suppressing the immune response rather than helping it. The co-expression pattern is the signal, not either marker alone.
        </span>
      </p>

      <p>The problem is that "see it" means very different things to different algorithms.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>What the textbook misses</span>
      </h2>

      <p>I ran seven clustering algorithms on the same data. The results were instructive in the way that a tour of failure modes usually is.</p>

      <p>KMeans assumes clusters are spherical and roughly equal-sized. Immune cell populations are neither. HDBSCAN is density-based and good at finding arbitrarily shaped clusters, but it labelled too many cells as noise — cells that the pathologist would have confidently assigned. Mean-Shift was sensitive to its bandwidth parameter; a small change would either merge everything into two clusters or fragment into dozens. Affinity Propagation and BIRCH each had their strengths but shared a common weakness: they had no concept of biological plausibility.</p>

      <p>The most consistent performer, to my surprise, was agglomerative clustering — the simplest hierarchical method. Bottom-up merging, Ward's linkage, nothing fancy. It didn't know immunology either, but it happened to respect the local density structure of the data well enough to produce biologically sensible clusters most of the time.</p>

      <p>The gap between "most of the time" and "all of the time" is where the interesting work lives. Every standard method occasionally produced clusters containing biologically impossible co-expression patterns — cells that no pathologist would group together.</p>

      <Figure caption="Six markers, six nodes. Red edges are pairs that cannot co-express (neutrophil markers on lymphocytes). Amber edges are pairs that rarely co-express. A standard clustering algorithm doesn't see any of this." palette={p}>
        <ViolationNetwork palette={p} />
      </Figure>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§03</span>
        <span>Teaching the distance metric</span>
      </h2>

      <p>The idea that became the novel contribution of the thesis was this: if you know that certain marker pairs can't co-express, encode that knowledge directly into the clustering algorithm.<span className="sidenote-number" style={{ color: p.accent }}>3</span> Not as a post-hoc filter — not "run the clustering and then throw away the impossible results" — but as a structural constraint that shapes how the algorithm measures similarity between cells in the first place.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> The approach draws on constrained clustering (Wagstaff, 2011) and spectral methods (Ng, Jordan, and Weiss, 2001). The specific combination — co-expression penalties embedded in the similarity matrix of a spectral clustering step — is, as far as I could find, new to this application.
        </span>
      </p>

      <p>I built a penalty system with two tiers. "Cannot-link" constraints: CD66b and CD4 should never appear together in the same cell, so if two cells both express these markers, push them apart in similarity space. "Less-likely-to-link" constraints: CD4 and CD8 co-expression is rare but not impossible, so apply a lighter penalty. These penalties modify the similarity matrix before spectral clustering even begins — the algorithm sees a landscape where biologically impossible neighbours are further apart than the raw intensities suggest.</p>

      <p>On top of this, I added a variance-based protection for the "no marker" cluster — the large population of cells expressing nothing above threshold.<span className="sidenote-number" style={{ color: p.accent }}>4</span> These cells are homogeneous and quiet; standard algorithms would sometimes merge them with an active population simply because the merge happened to minimise some global objective. The penalty ensured that merging the "no marker" cluster with a high-variance neighbour was expensive, preserving its integrity.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>4.</strong> The "no marker" cluster is often the largest single population in a tumour sample — cells the immune system hasn't engaged, or cells whose markers are below the detection threshold. Losing it to a merge destroys the baseline.
        </span>
      </p>

      <Figure caption="Toggle between standard and constraint-aware clustering. In the standard view, the dashed ring marks biologically impossible cells merged into the wrong cluster. The constraint-aware view separates them." palette={p}>
        <ConstraintEffect palette={p} />
      </Figure>

      <PullQuote color={p.accent}>The algorithm sees a landscape where biologically impossible neighbours are further apart than the raw intensities suggest.</PullQuote>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§04</span>
        <span>The honest result</span>
      </h2>

      <p>The constraint-aware pipeline beat most of the textbook methods. It did not beat plain agglomerative clustering.</p>

      <Figure caption="Relative performance of seven methods plus our approach. Scale is relative, not absolute. Our method sits second — ahead of the textbooks, behind the simplest hierarchy." palette={p}>
        <MethodRanking palette={p} />
      </Figure>

      <p>That result deserves an honest reading. The novel algorithm introduces a pipeline with multiple stages — outlier detection, constraint penalties, variance protection, post-clustering refinement — and each stage has its own parameters.<span className="sidenote-number" style={{ color: p.accent }}>5</span> Nine user-defined knobs in total. Finding the right combination for a specific dataset requires extensive tuning, and I didn't solve that problem in the scope of the thesis. The parameter space we created is its own problem.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>5.</strong> Outlier contamination thresholds (2), constraint penalty weights (2), penalty damping (1), RBF kernel scale (1), variance threshold (1), variance ratio (1), target cluster count (1). Each influences the result; the interactions are not independent.
        </span>
      </p>

      <p>Agglomerative clustering, by contrast, has one meaningful choice: the linkage criterion. Ward's linkage, the standard choice, happened to work well on this data. No constraints, no penalties, no pipeline. Sometimes the simplest method wins because it has the fewest ways to be wrong.</p>

      <PullQuote color={p.accent}>Sometimes the simplest method wins because it has the fewest ways to be wrong.</PullQuote>

      <p>I think the contribution isn't the ranking. It's the idea that domain knowledge — "these markers can't co-express" — can be encoded structurally, not just used as a post-hoc filter. The approach beat five of seven standard methods, and on the biological plausibility of individual clusters, it was arguably the best. The overall metric didn't reflect that because metrics reward getting everything approximately right, not getting the hard cases exactly right.</p>

      <p>The thesis sits in the Oxford repository. The approach — constraints in the similarity matrix, variance-based cluster protection, staged outlier handling — is general enough for other mIF panels with different marker sets. Whether it's worth the parameter-tuning tax depends on how much you care about the hard cases.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written from the Lady Margaret Hall library, the week after submission.</p>
    </>
  );
}
