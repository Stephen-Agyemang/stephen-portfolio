# Project feed screenshots

Each card's feed band shows `<id>.webp` from this folder, where `<id>` is the
project's `id` in `src/data/projects.js`. `Projects.jsx` picks them up with
`import.meta.glob`, so a file can land here without touching any code, and a
project with no file falls back to the `FEED_OFFLINE` placeholder instead of
breaking the build.

Expected files: `monica.webp`, `zork.webp`, `fridgejam.webp`,
`portfolio.webp`, `fintracker.webp`

## Why here and not `public/`

These used to live in `public/projects/` at fixed URLs, and each card
requested its screenshot before the file existed. On Firebase a missing file
doesn't 404 — the SPA rewrite answers with `index.html` — and Hosting sent
every `.webp` as `immutable` for a year. Browsers cached that HTML as the
screenshot and kept showing `FEED_OFFLINE` after the real file shipped
(FinTracker, Sep 2026). A file imported from here gets a content-hashed URL
instead: nothing requests it before it exists, and a new capture gets a new
URL. `firebase.json` now keeps `immutable` for the hashed files under
`/assets/` only.

## Capture specs

| | |
|---|---|
| Aspect | 16:9 — the band crops to this, anchored to the **top** of the image |
| Size | 1280×720 (2× of the 640px the card ever needs) |
| Format | WebP, quality ~80 — aim for under 90 KB each |
| Framing | Nav + hero. The band is 214px tall on a 380px card, so anything below the fold is wasted |

Convert a PNG capture with:

```bash
cwebp -q 80 -resize 1280 0 shot.png -o src/assets/projects/zork.webp
```

The band duotones every screenshot toward the project's theme colour at rest,
so source colour accuracy matters less than layout legibility — favour a
capture with clear large shapes over one dense with small text.
