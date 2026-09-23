import { defineConfig, devices } from '@playwright/test'
import { chromiumLaunchOptions } from './e2e/chromium-options'

/**
 * Playwright E2E config for naivolabs.com.
 *
 * The suite runs against the production build, served statically on port 4173,
 * rather than the dev server. `vite dev` compiles routes on demand, which raced
 * under parallel workers and produced failures that did not reproduce against a
 * real build. The trade-off is a build per run; `reuseExistingServer: false`
 * guarantees it is never a stale one.
 *
 * Chromium: the launch options in e2e/chromium-options.ts point at a system
 * binary so no browser download is needed. Set `PLAYWRIGHT_CHROMIUM_PATH` to
 * override, or run `npx playwright install chromium` on a machine that does not
 * have one.
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Two workers locally, one under CI. The specs are independent, but the
  // performance budgets are sensitive to CPU contention, so a shared runner
  // measures one route at a time.
  workers: process.env.CI ? 1 : 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: {
    timeout: 6_000,
    // Visual regression (e2e/visual.spec.ts): freeze CSS animations/transitions
    // before capture (JS-driven framer-motion animations are handled in the
    // spec via waits + masks). Content-page tolerance for anti-aliasing noise.
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },

  use: {
    baseURL: 'http://localhost:4173',
    // System Chromium (shared with the global-setup warm-up).
    launchOptions: chromiumLaunchOptions,
    // The site is dark-first, so the suite runs the dark theme by default and
    // exercises the resting state. Without this, Chromium's default light
    // preference would resolve every run to the light inversion and the
    // canonical design would never be the one under test. Set
    // PW_COLOR_SCHEME=light to run the same suite against the inversion.
    colorScheme: process.env.PW_COLOR_SCHEME === 'light' ? 'light' : 'dark',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
        // Tailwind hovers are hover:hover-gated; keep mobile taps faithful
        hasTouch: true,
      },
      testMatch: /mobile\.spec\.ts/,
    },
  ],

  webServer: {
    // Build first, then serve the static production build (no dev-server
    // on-demand compilation, so route loads are deterministic).
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    // Never reuse: with a build step, a lingering preview server on 4173
    // would silently serve a STALE build. Always rebuild fresh.
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
