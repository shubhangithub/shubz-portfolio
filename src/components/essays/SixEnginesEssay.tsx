// @ts-nocheck
import React from 'react';
import { EnsembleConsensus, Figure, PullQuote, RecEngineSwarm } from '../legacy';

export function SixEnginesEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        I am, mortifyingly, the kind of Taylor Swift listener who has opinions about which 2019 demos should have stayed unreleased.<span className="sidenote-number" style={{ color: p.accent }}>1</span> So when I built a recommender for her catalogue I was the worst possible audience: any model that surfaced something obvious would feel patronising, and any model that surfaced something stupid would feel personal.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> The original Lover demos. Don't @ me.
        </span>
      </p>

      <p>The constraint, then, was: build something whose <em>recommendations themselves</em> would be the test. If I rolled it out to friends and they said "yeah, that one too," good. If they said "why this," bad. The architecture had to earn that, not the other way around.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§01</span>
        <span>Six engines, one query</span>
      </h2>

      <p>I ended up with six recommendation models, each looking at a different facet of a song. Five base engines plus an ensemble that learned how to weight them.</p>

      <ol style={{ margin: "1.2rem 0", paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li><strong>Lyrics-Transformer.</strong> Sentence-BERT embeddings over Genius-scraped lyrics. Cosine similarity in the 384-D embedding space.</li>
        <li><strong>Audio VAE.</strong> A variational autoencoder over Spotify audio features, compressed to a 16-dimensional latent.<span className="sidenote-number" style={{ color: p.accent }}>2</span> Distance in latent space picks up sonic neighbours.</li>
        <li><strong>Graph node2vec.</strong> Build a song-co-listen graph, run node2vec for 64-D embeddings, retrieve nearest neighbours.</li>
        <li><strong>Neural Collab Filtering.</strong> Classic two-tower model on user-song interactions.</li>
        <li><strong>Contrastive SSL.</strong> Self-supervised pretext: same song, two augmentations of its audio, pull together; different songs, push apart.</li>
        <li><strong>Ensemble.</strong> Weighted blend of the five, with a consensus boost for songs surfaced by ≥2 engines.</li>
      </ol>

     

      <Figure caption="A query song q routes to six engines; each surfaces ~3 candidates. Songs touched by multiple engines (filled) get a consensus boost in the final ranking." palette={p}>
        <RecEngineSwarm palette={p} />
      </Figure>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02</span>
        <span>The dataset that made it tractable</span>
      </h2>

      <p>The engines run on Taylor's full discography — every era, including Vault tracks — with editorial bridges to neighbouring artists.<span className="sidenote-number" style={{ color: p.accent }}>3</span> The bridges are metadata, not embeddings: the six engines compute similarity within Taylor's catalogue, and the editorial layer maps outward to artists who share lyrical or sonic DNA. 
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> Editorial bridges to Kacey Musgraves, Maggie Rogers, Olivia Rodrigo, Gracie Abrams, Lana Del Rey, HAIM, Phoebe Bridgers, Carly Rae Jepsen, Paramore, and others. The mapping is hand-curated — each bridge has a reason.
        </span>
      </p>

      <p>The original was an R/Shiny app I'd written in 2023 — pretty, slow, single-user. The rebuild is a TypeScript + Next.js frontend on Vercel with a FastAPI backend on Render, serving real recommendations in under 200ms.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§02b</span>
        <span>Why the ensemble works</span>
      </h2>

      <p>Each engine has a failure mode that the others compensate for. Lyrics-only will surface "songs that mention rain" when you wanted "songs that <em>feel like</em> rain." Audio-only will surface acoustic ballads when you wanted lyrical heartbreak. Collaborative filtering will surface whatever's popular this week. The ensemble is less a fusion of strengths than an averaging-out of weaknesses.</p>

      <Figure caption="Final score is a fixed-weight blend with a small consensus boost for cross-engine agreement. The weights are tuned by leave-one-out on a small held-out playlist." palette={p}>
        <EnsembleConsensus palette={p} />
      </Figure>

      <PullQuote color={p.accent}>The ensemble is less a fusion of strengths than an averaging-out of weaknesses.</PullQuote>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: "#28CA41", letterSpacing: "0.1em" }}>§03</span>
        <span>What the demo actually feels like</span>
      </h2>

      <p>Type a song. Six engines return their picks in parallel. The UI shows you the ensemble's top 10, but lets you toggle "show me what each engine thought" so you can see the disagreements. The disagreements are fun! The lyrics engine wants you to listen to <em>The Manuscript</em>; the audio VAE thinks you'd rather have <em>You're On Your Own, Kid</em>; the graph engine sends you somewhere else.</p>

      <p>The site is at <a href="https://shubz-taylor-recommendation-engine.vercel.app" target="_blank" rel="noreferrer" className="link-underline" style={{ color: p.accent }}>shubz-taylor-recommendation-engine.vercel.app</a>. Bring your own opinions about the Lover demos.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written on the train back from a Tortoise live show.</p>
    </>
  );
}
