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
 */
const explicitPath = process.env.PLAYWRIGHT_CHROMIUM_PATH

export const chromiumLaunchOptions = {
  ...(explicitPath ? { executablePath: explicitPath } : {}),
  args: ['--no-sandbox', '--disable-gpu'],
}
