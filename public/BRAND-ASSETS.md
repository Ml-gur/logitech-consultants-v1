# Brand assets

These files are generated — do not edit them by hand.

```bash
node scripts/generate-brand-assets.mjs
```

That script renders them with headless Chromium using the same
self-hosted fonts and the same palette as the site, so they never drift
from the product. Re-run it after changing `public/favicon.svg` or the
colour tokens in `src/index.css`. It needs a Chromium binary (see the
E2E section of README.md), and ImageMagick to downscale the OG card.

| File | Used for |
|---|---|
| `favicon.svg` | modern browsers (hand-authored source) |
| `favicon.ico` | legacy browsers, feed readers, link-preview bots |
| `favicon-16/32/48.png` | browser tabs, bookmarks, and the .ico payloads |
| `favicon-180.png` | `apple-touch-icon` (opaque) |
| `favicon-192/512.png` | web manifest / Android install |
| `og-image.png` | Open Graph + Twitter card (1200x630) |
