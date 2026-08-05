import { chromium } from '@playwright/test'
import { chromiumLaunchOptions } from './chromium-options'

/**
 * Global setup: warm the served app before any test runs.
 *
 * The suite serves the production build via `vite preview` (see
 * playwright.config.ts), so there is no on-demand compilation anymore. This
 * warm-up still pays for browser-level one-time costs (font loading, cache
 * priming, full render passes on every route) so the first test of each
 * worker starts against a settled page.
 *
 * Historical note: this was originally written because `vite dev` compiles
 * modules on demand, and parallel workers hitting a cold server produced
 * intermittent "element not found" failures that moved between runs
 * (documented in STATE.md as "flaky on server timing"). The dev server is
 * no longer used for E2E; the warm-up remains as cheap insurance.
 */
export default async function globalSetup() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173'
  const routes = [
    '/',
    '/about',
    '/case-studies',
    '/blog',
    '/contact',
    '/case-studies/etery',
    '/blog/getting-your-data-ai-ready-without-the-big-project',
  ]

  const browser = await chromium.launch(chromiumLaunchOptions)

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    for (const route of routes) {
      try {
        await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded' })
        // Allow scroll-reveal animations to run so IntersectionObserver work is
        // cached too (framer-motion whileInView state is per-visit, but this
        // exercises the full render path once).
        await page.waitForTimeout(150)
      } catch (err) {
        console.warn(`global-setup: warm-up failed for ${route}: ${err}`)
      }
    }
    await page.close()
  } finally {
    await browser.close()
  }
}
