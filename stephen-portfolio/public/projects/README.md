# Project feed screenshots

Dropped in here and referenced by `image` in `src/data/projects.js` as
`/projects/<id>.webp`. These are served as-is by Vite — no import, no hashing —
so a file can land here without touching any code, and a missing one falls
back to the `FEED_OFFLINE` placeholder instead of breaking the build.

Expected files: `monica.webp`, `zork.webp`, `fridgejam.webp`,
`portfolio.webp`, `fintracker.webp`

## Capture specs

| | |
|---|---|
| Aspect | 16:9 — the band crops to this, anchored to the **top** of the image |
| Size | 1280×720 (2× of the 640px the card ever needs) |
| Format | WebP, quality ~80 — aim for under 90 KB each |
| Framing | Nav + hero. The band is 214px tall on a 380px card, so anything below the fold is wasted |

Convert a PNG capture with:

```bash
cwebp -q 80 -resize 1280 0 shot.png -o public/projects/zork.webp
```

The band duotones every screenshot toward the project's theme colour at rest,
so source colour accuracy matters less than layout legibility — favour a
capture with clear large shapes over one dense with small text.
