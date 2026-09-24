/**
 * Launch options shared by the Playwright config and the global-setup warm-up,
 * so the two cannot drift.
 *
 * By default this uses **Playwright's own bundled Chromium**, which is what
 * `npx playwright install chromium` provides. That is deliberate: visual goldens
 * are sensitive to the browser build, so letting each machine pick whatever
 * browser happens to be on its PATH is how a suite starts failing on one
 * developer's laptop and nowhere else.
 *
 * Set `PLAYWRIGHT_CHROMIUM_PATH` to use a system browser instead — useful on a
 * runner that already ships one, or when debugging against a real Chrome.
 *
 * `--no-sandbox` is required because CI containers and root users cannot use the
 * Chromium sandbox; `--disable-gpu` keeps headless rendering off the GPU, which
 * is absent or emulated on most runners.
 *
 * The two text-rendering flags are what make a golden portable between the
 * machine that records it and the machine that checks it. FreeType's hinting
 * and LCD subpixel filtering both follow the host's font configuration, so the
 * same font at the same size lands its glyph edges on different pixels on two
 * machines — a per-glyph difference that no diff threshold can absorb, because
 * it is concentrated exactly on the pixels that carry the type. With hinting
 * off and grayscale anti-aliasing the rasterisation is a function of the font
 * file alone, and `scripts/generate-brand-assets.mjs` already renders its output
 * with hinting off for the same reason.
 */
const explicitPath = process.env.PLAYWRIGHT_CHROMIUM_PATH

export const chromiumLaunchOptions = {
  ...(explicitPath ? { executablePath: explicitPath } : {}),
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none', '--disable-lcd-text'],
}
