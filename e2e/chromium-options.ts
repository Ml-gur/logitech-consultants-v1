/**
 * Shared system-Chromium launch options for Playwright config and the
 * global-setup warm-up. Single source of truth so the two can't drift.
 * Uses the system Chromium (`/usr/bin/chromium-browser`) — no browser
 * download required (see README "Testing").
 */
export const chromiumLaunchOptions = {
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
}
