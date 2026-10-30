#!/usr/bin/env node

// Pull the "Currently Reading" list from Fable (fable.co) into
// src/data/reading.generated.json. now.ts derives the /now "Reading" focus
// line and the Conditions "Reading" row from that file, so the site tracks
// the Fable shelf without hand-edits. Run via `npm run update:reading`;
// it also runs as part of `npm run build`, so every deploy refreshes it.
//
// Fable has no official public API; these are the endpoints its own web app
// calls, which are readable without auth for public profiles. If the fetch
// fails for any reason the existing JSON is kept and the script exits 0,
// so a Fable outage can never break a build.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const OUTPUT_PATH = path.join(ROOT, "src/data/reading.generated.json");

const FABLE_USERNAME = "shubz-sharma-375148102003";
const API = "https://api.fable.co/api";
const HEADERS = { "User-Agent": "shubzsharma.com reading-list sync" };

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function main() {
  const user = await getJson(`${API}/usernames/${FABLE_USERNAME}`);
  if (!user.id) throw new Error("no user id in usernames response");

  const lists = await getJson(
    `${API}/v2/users/${user.id}/book_lists/?limit=50&offset=0`,
  );
  const current = (lists.results ?? []).find(
    (list) => list.name === "Currently Reading",
  );
  if (!current) throw new Error('no "Currently Reading" list on the profile');

  const shelf = await getJson(
    `${API}/v2/users/${user.id}/book_lists/${current.id}/books?limit=20`,
  );
  const books = (shelf.results ?? [])
    .map(({ book }) => ({
      title: book?.title,
      authors: (book?.authors ?? []).map((author) => author.name).filter(Boolean),
      url: book?.url ?? null,
    }))
    .filter((book) => book.title);

  // Skip the write when the shelf hasn't changed, so re-runs don't churn
  // the file's fetchedAt for no reason.
  if (fs.existsSync(OUTPUT_PATH)) {
    const previous = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
    if (JSON.stringify(previous.books) === JSON.stringify(books)) {
      console.log(`✓ reading list unchanged (${books.length} book(s))`);
      return;
    }
  }

  const payload = {
    source: `https://fable.co/fabler/${FABLE_USERNAME}`,
    fetchedAt: new Date().toISOString(),
    books,
  };
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `✓ reading list: ${books.length} book(s) — ${books.map((b) => b.title).join(" · ")}`,
  );
}

main().catch((error) => {
  const existing = fs.existsSync(OUTPUT_PATH);
  console.warn(
    `⚠ Fable fetch failed (${error.message}); ${
      existing
        ? "keeping the existing reading.generated.json"
        : "writing an empty one"
    }.`,
  );
  if (!existing) {
    fs.writeFileSync(
      OUTPUT_PATH,
      `${JSON.stringify(
        {
          source: `https://fable.co/fabler/${FABLE_USERNAME}`,
          fetchedAt: null,
          books: [],
        },
        null,
        2,
      )}\n`,
    );
  }
});
