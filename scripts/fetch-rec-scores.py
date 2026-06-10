#!/usr/bin/env python3
"""
Fetch real per-engine similarity scores from the Taylor rec backend and
print the `songs` array for EnsembleConsensus.tsx.

Usage:
  python scripts/fetch-rec-scores.py
  python scripts/fetch-rec-scores.py --song "Cruel Summer" --api http://localhost:8000

The backend URL comes from the TAYLOR_API_URL env var, or --api flag, or
falls back to the Render deployment URL (set BASE_URL below once you know it).

Engine key mapping (API → diagram):
  transformer_lyrics  → lyrics
  vae_latent          → vae
  graph_node2vec      → graph
  neural_collaborative→ ncf
  contrastive_ssl     → ssl
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error

BASE_URL = os.environ.get("TAYLOR_API_URL", "http://localhost:8000")

ENGINE_MAP = {
    "lyrics_transformer": "lyrics",
    "vae_latent":         "vae",
    "graph_node2vec":     "graph",
    "ncf":                "ncf",
    "contrastive":        "ssl",
}

def fetch_compare(api_url: str, song_name: str, n: int) -> dict:
    url = f"{api_url.rstrip('/')}/api/compare"
    payload = json.dumps({
        "song_names": [song_name],
        "num_per_engine": n,
    }).encode()
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())

def build_songs_array(data: dict, top_n: int) -> list[dict]:
    # collect songs + scores from each engine
    per_song: dict[str, dict[str, float]] = {}
    engines_data = data.get("engines", {})

    for api_key, short_key in ENGINE_MAP.items():
        results = engines_data.get(api_key, {}).get("results", [])
        for r in results:
            title = r.get("name", "").strip()
            if not title:
                continue
            sim = float(r.get("similarity", 0))
            if title not in per_song:
                per_song[title] = {}
            per_song[title][short_key] = round(sim, 2)

    # fill missing engines with 0
    keys = list(ENGINE_MAP.values())
    for title in per_song:
        for k in keys:
            per_song[title].setdefault(k, 0.0)

    # rank by average score, take top_n
    ranked = sorted(
        per_song.items(),
        key=lambda kv: sum(kv[1].values()) / len(kv[1]),
        reverse=True,
    )[:top_n]

    return [{"title": title, "scores": scores} for title, scores in ranked]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--song", default="All Too Well", help="seed song name")
    parser.add_argument("--api",  default=BASE_URL,       help="backend base URL")
    parser.add_argument("--top",  type=int, default=6,    help="how many songs to output")
    parser.add_argument("--n",    type=int, default=10,   help="results per engine to fetch")
    args = parser.parse_args()

    print(f'-> querying {args.api}/api/compare for seed: "{args.song}"', file=sys.stderr)

    try:
        data = fetch_compare(args.api, args.song, args.n)
    except urllib.error.URLError as e:
        print(f"✗ request failed: {e}", file=sys.stderr)
        print(f"  Is the backend running at {args.api}?", file=sys.stderr)
        sys.exit(1)

    songs = build_songs_array(data, args.top)

    print("\n// Paste into EnsembleConsensus.tsx → songs array")
    print("const songs = React.useMemo(() => [")
    for s in songs:
        sc = s["scores"]
        print(
            f'  {{ title: {json.dumps(s["title"])}, '
            f'scores: {{ lyrics: {sc["lyrics"]}, vae: {sc["vae"]}, '
            f'graph: {sc["graph"]}, ncf: {sc["ncf"]}, ssl: {sc["ssl"]} }} }},'
        )
    print("], []);")

if __name__ == "__main__":
    main()
