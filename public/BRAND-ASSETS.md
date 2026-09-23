# Brand assets

These files are generated — do not edit them by hand.

```bash
node scripts/generate-brand-assets.mjs
```

That script renders them with headless Chromium using the same Inter
files and the same palette as the site, so they never drift from the
product. Re-run it after changing `public/favicon.svg` or the colour
tokens in `src/index.css`.

| File | Used for |
|---|---|
| `favicon.svg` | modern browsers (hand-authored source) |
| `favicon-16/32/48.png` | browser tabs, bookmarks |
| `favicon-180.png` | `apple-touch-icon` (opaque) |
| `favicon-192/512.png` | web manifest / Android install |
| `og-image.png` | Open Graph + Twitter card (1200x630) |
