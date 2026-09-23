import { chromium } from '@playwright/test'
import { chromiumLaunchOptions } from './chromium-options'

/**
 * Global setup: warm the served app before any test runs.
 *
 * The suite serves the production build via `vite preview` (see
 * playwright.config.ts), so there is no on-demand compilation. This warm-up
 * pays for browser-level one-time costs (font loading, cache priming, full
 * render passes on every route) so the first test of each worker starts
 * against a settled page.
 *
 * The route list mirrors the real route table (src/main.tsx) — update it when
 * routes are added so the first worker never pays the cold cost mid-test.
 */
export default async function globalSetup() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173'
  const routes = [
    '/',
    '/about',
    '/capabilities',
    '/deployment-patterns',
    '/deployment-patterns/ai-voice-receptionist',
    '/blog',
    '/blog/from-demo-to-production-why-ai-pilots-stall',
    '/contact',
    '/privacy',
    '/terms',
    '/ai-automation-nairobi',
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
