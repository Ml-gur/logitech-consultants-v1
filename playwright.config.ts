import { defineConfig, devices } from '@playwright/test'
import { chromiumLaunchOptions } from './e2e/chromium-options'

/**
 * Playwright E2E config for the Logitech Consultants (aithor-clone) site.
 * Uses the system Chromium binary (no browser download needed — see
 * README "Testing" section). Serves the production build via `vite preview`
 * on port 4173 — static files mean no cold-start compile races (the
 * `vite dev` on-demand compilation was intermittently flaky under parallel
 * workers; see e2e/global-setup.ts for the original diagnosis).
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Pin to 2 workers: the historically verified-green config (STATE.md notes
  // higher counts were flaky). The suite serves a static production build, so
  // route loads are deterministic; CI still runs single-worker.
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
