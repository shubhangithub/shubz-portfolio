# personal-site

Shubhangi Sharma — personal site. Single-file HTML/CSS/JS prototype.

## Structure

```
.
├── index.html    # the entire site (HTML + inline CSS + inline React/JSX)
├── assets/       # portrait
└── uploads/      # CV PDF
```

## Local preview

Just open `index.html` in a browser, or:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Vercel auto-detects this as a static site — no build step needed. `index.html` is served at `/`.

## Notes

JSX is compiled in the browser via `@babel/standalone`. Fine for a prototype; a future iteration could pre-compile and ship plain JS for a smaller, faster payload.

## Design language

The site has a deliberate voice and a specific set of conventions for essays
and custom SVG diagrams. Anyone (human or agent) editing prose, adding an
essay, or building a new diagram must read [`AGENTS.md`](./AGENTS.md) first.
`CLAUDE.md` redirects to the same file.
