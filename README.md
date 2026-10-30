# Shubz Sharma — portfolio

Public source snapshot of [shubzsharma.com](https://shubzsharma.com).
Astro and React, with an illustrated notebook, interactive essays, a connected
project graph and a shared terminal-inspired design.

## Run locally

Use Node.js 22 or 24.

```sh
npm ci
npm run dev
npm run typecheck
npm run build
```

The dev server runs at http://localhost:4321. The build produces a static site.
No production credentials are required. Reading data is included as a snapshot;
`npm run update:reading` refreshes it explicitly.

## What's here

- Home, Now, Timeline, Projects & tools, Writing and Contact.
- Work projects, Fun projects, Research, Essay experiments and All tools.
- Published essays, custom interactive diagrams and numeric verification scripts.
- Responsive navigation, dark/light themes, optional sound and reduced-motion support.
- Local paperclip saves, project search and an optional graph view.

Content lives in `src/data`; pages and visual objects live in `src/components`.
See [design.md](design.md) for UI guidelines, [AGENTS.md](AGENTS.md) for voice,
[DECISIONS-v5.md](DECISIONS-v5.md#14-colour-system--10-canonical-topic-categories)
for topic colours and [EDITING.md](EDITING.md) for content editing.

## Public snapshot boundaries

This is a reviewed source snapshot, not the private development repository's
history. Credentials, local data, private editorial previews, unpublished essay
bodies and production reaction-storage implementation are excluded. The reaction
component is intentionally inactive in this copy. Torus and other work projects
are described at the public product level; their source code is not included.

Images retain their original attribution. Credits for the three recent essay
covers are in `public/thumbs/monthly-credits.json` and the essays' source lists.
Third-party assets keep their original rights; publication here does not grant
a blanket licence to photographs, illustrations or personal writing.
