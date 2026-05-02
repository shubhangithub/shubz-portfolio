// @ts-nocheck
import React from 'react';
import { Figure, LMSRPriceCurve, PullQuote, TrendSignalFlow } from '../legacy';

export function FashionEssay({ palette: p }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        Fashion forecasting is what you call it when you're respectable.<span className="sidenote-number" style={{ color: p.accent }}>1</span> What it actually is, most weeks, is someone arguing about whether barrel-leg jeans survive the autumn. The instinct is real. The methodology is improvised. I built a platform to make the instinct legible — to the person having it, and to anyone willing to put virtual money on it.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>1.</strong> "Trend" sits oddly in this sentence. The industry word; carrying both "what's in" and "what's measurable." A platform should be able to handle both.
        </span>
      </p>

      <p>The thing I've built is an ML-powered trend intelligence platform — part computer vision, part forecasting pipeline, part trading simulator. Upload an outfit photo and it tells you what you're wearing, what collection it's closest to, and what the colour palette says. Browse runway breakdowns from Prada to Miu Miu. Track hundreds of trend terms across categories. Then, if you're feeling brave, trade on them with virtual currency and see if your instincts beat the model's.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§01</span>
        <span>Five signals, one composite</span>
      </h2>

      <p>The forecasting half of the platform reads from five data sources and merges them into a composite trend score per term:</p>

      <ol style={{ margin: "1.2rem 0", paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li>Google Trends search volume (via trendspyg) — the broadest signal, noisiest at the long tail. 25% weight.</li>
        <li>Bluesky firehose — real-time social mentions, completely open, no rate limits. 25% weight.</li>
        <li>Pinterest trend endpoints — what's being saved and pinned in fashion categories. 20% weight.</li>
        <li>Reddit — social mentions from fashion subreddits (r/fashion, r/femalefashionadvice, r/streetwear). 15% weight.</li>
        <li>YouTube Data API — video counts and view velocity for fashion content. 15% weight.</li>
      </ol>

      <p>None of these is reliable on its own. Search volume spikes on a single celebrity sighting; Reddit threads over-index on whatever's contrarian this week; Bluesky is growing but the fashion community is still thin; Pinterest skews aspirational. <em>Together</em>, fed into a Holt exponential smoothing model, they're tolerable.<span className="sidenote-number" style={{ color: p.accent }}>2</span>
        <span className="sidenote">
          <strong style={{ color: p.accent }}>2.</strong> Holt smoothing gives a baseline level and a velocity term — is this trend rising, flat, or fading? No seasonality modelling yet; the data isn't deep enough for that. 250-odd fashion terms tracked across colours, silhouettes, aesthetics, and fabrics.
        </span>
      </p>

      <Figure caption="Five source signals merge into a composite, then a 30-day forecast extends past 'now'. Each lane is independently noisy; the composite smooths out single-source spikes." palette={p}>
        <TrendSignalFlow palette={p} />
      </Figure>

      <PullQuote color={p.accent}>None of these is reliable on its own. Together, they're tolerable.</PullQuote>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§02</span>
        <span>The Trend Exchange</span>
      </h2>

      <p>A forecast is a number. A trade is a number with skin in the game — even when the skin is virtual. The platform's Trend Exchange gives you S$1,000 in StyleCoins and lets you go long on trends you think are rising or short on trends you think are fading. Your portfolio tracks P&L in real time against the model's own house predictions.</p>

      <p>The pricing mechanism is LMSR — Hanson's logarithmic market scoring rule.<span className="sidenote-number" style={{ color: p.accent }}>3</span> Same maths as Manifold Markets. The advantage is automatic liquidity: even with a single trader, the market quotes a price. As you buy YES shares on "barrel-leg jeans," the price rises; the more you buy, the steeper it gets. The liquidity parameter <span className="mono">b</span> controls how much a given trade moves the market.
        <span className="sidenote">
          <strong style={{ color: p.accent }}>3.</strong> Hanson, R. (2003). "Combinatorial Information Market Design." The cost function is C(q) = b · log(Σ exp(q_i / b)). The platform uses b = 100, which means a 10-share buy on a 50/50 market moves the price about 5 points. Virtual currency, real accountability.
        </span>
      </p>

      <Figure caption="LMSR price for a YES share rises as net YES position grows. Steeper around p = 0.5, asymptotic at the bounds. b = 100 controls how much the price moves per unit volume." palette={p}>
        <LMSRPriceCurve palette={p} />
      </Figure>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§03</span>
        <span>What the camera sees</span>
      </h2>

      <p>The feature I didn't plan to build but that ended up being the most fun: upload a photo of an outfit, and the platform breaks it down. Gemini Flash detects individual garments, classifies the style, extracts the colour palette, and matches what you're wearing against runway collections from eight major houses — Prada, Chanel, Saint Laurent, Gucci, Miu Miu, and three more. The Runway Decoder page does the same in reverse: browse a collection and see its colour distributions and silhouette breakdowns, cross-referenced against real-time search data.</p>

      <p>Computer vision on fashion data is more interesting than it sounds, because the categories are soft. A "barrel-leg jean" and a "wide-leg trouser" overlap in silhouette but not in cultural signal. The model has to learn that the distinction matters — and that it shifts every season.</p>

      <h2 className="display" style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "3rem", marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="mono" style={{ fontSize: 12, color: p.muted, letterSpacing: "0.1em" }}>§04</span>
        <span>What I'm optimising for</span>
      </h2>

      <p>Calibration, mostly. A trend platform that says "this will be big" 100 times wants the things it predicted to actually be big roughly 70 times when its confidence says 0.7, 30 times when its confidence says 0.3. The platform tracks this with Brier scores — public, falsifiable, with target dates. That's the only honest measure. Everything else — engagement, trades-on-platform, "feels right" — is downstream.</p>

      <PullQuote color={p.accent}>Calibration, mostly.</PullQuote>

      <p>The platform is live at <a href="https://fashion-web-psi.vercel.app" target="_blank" rel="noreferrer" className="link-underline" style={{ color: p.accent }}>fashion-web-psi.vercel.app</a>. Next.js, serverless, deployed on Vercel's edge. The fashion calendar is unforgiving, the data is sparse, and the categories are soft — but there's something genuinely interesting about trying to make quantitative what an industry has always priced in private.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— written between meetings, on a stolen Friday afternoon.</p>
    </>
  );
}
