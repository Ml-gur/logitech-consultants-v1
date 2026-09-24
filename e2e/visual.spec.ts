import { test, expect } from './test'
import type { Locator, Page } from '@playwright/test'
import { seedConsent } from './consent'

/**
 * Visual regression goldens.
 *
 * Covers the home-page sections (hero, capabilities, deployment patterns,
 * commitments, footer), the FAQ on /capabilities, every route as a full-page
 * capture, and a set of 390px mobile-width captures for the sections that have
 * historically regressed on phones.
 *
 * Determinism strategy:
 * - CSS animations and transitions are frozen by the global `animations:
 *   'disabled'` screenshot option (playwright.config.ts).
 * - Fonts are waited on before any capture (./fonts) so text metrics are final:
 *   a capture taken mid-swap records the fallback face's line breaks.
 * - Cookie consent is pre-seeded so the fixed banner never overlays a capture.
 *
 * There is no longer any scroll-reveal to wait for. Sections used to fade in
 * from `opacity: 0`, which this file had to force-fire before every capture; the
 * site now renders its content from first paint (src/motion.ts), so the only
 * motion left to settle is the hero's page-load sequence.
 *
 * Regenerate after an intentional visual change:
 *   npm run test:e2e:visual:update
 */

test.describe.configure({ mode: 'serial' })

/**
 * Scroll a section into view and let the hero's load sequence and any
 * scroll-linked transform finish before it is captured.
 */
async function settleSection(page: Page, section: Locator) {
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(2000)
}

/**
 * Freeze the hero's background loop on its first frame.
 *
 * `animations: 'disabled'` stops CSS animations and transitions. It does not
 * stop a video, so a hero captured while the clip runs pins whichever frame
 * happened to be on screen — a different one on every run, on every machine.
 * The clip is decoration; the plate and the type over it are the design, so the
 * capture waits for the element to exist and then holds it at t=0.
 */
async function freezeLoop(page: Page) {
  await page
    .waitForFunction(() => !!document.querySelector('video.hero-video'), null, { timeout: 4000 })
    .catch(() => null)

  await page.evaluate(async () => {
    const video = document.querySelector<HTMLVideoElement>('video.hero-video')
    if (!video) return
    video.pause()
    video.currentTime = 0
    if (video.readyState >= 2) return
    await new Promise<void>((resolve) => {
      video.addEventListener('seeked', () => resolve(), { once: true })
      window.setTimeout(resolve, 1500)
    })
  })
}

/**
 * Walk the whole page before a full-page capture.
 *
 * The sweep runs in steps rather than one jump so every position gets frames in
 * view: the deployment stack is bound to scroll position, and a single jump can
 * leave it captured mid-transform.
 */
async function settlePage(page: Page) {
  await page.evaluate(async () => {
    const maxY = document.body.scrollHeight
    for (let y = 0; y <= maxY; y += 150) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1500)
}

test('visual: home hero section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Hero entrance animations run up to ~1.9s after mount (word stagger + delays)
  await page.waitForTimeout(2500)
  await freezeLoop(page)
  await expect(page.locator('section#hero')).toHaveScreenshot('home-hero.png', { maxDiffPixels: 500 })
})

test('visual: home capabilities section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const section = page.locator('section#capabilities').first()
  await settleSection(page, section)
  await expect(section).toHaveScreenshot('home-capabilities.png', { maxDiffPixels: 500 })
})

test('visual: home commitments section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const section = page.locator('section#approach').first()
  await settleSection(page, section)
  await expect(section).toHaveScreenshot('home-approach.png', { maxDiffPixels: 500 })
})

test('visual: home deployment-pattern grid', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const section = page.locator('section#deployment-patterns').first()
  await settleSection(page, section)
  await expect(section).toHaveScreenshot('home-patterns.png', { maxDiffPixels: 500 })
})

// Governance, positioning and the deployment model live on /capabilities and
// /about and are covered by those route goldens.

test('visual: FAQ on the capabilities page', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/capabilities')
  await page.waitForLoadState('networkidle')
  const section = page.locator('section#faq').first()
  await settleSection(page, section)
  await expect(section).toHaveScreenshot('capabilities-faq.png', { maxDiffPixels: 500 })
})

test('visual: home footer', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await settleSection(page, page.locator('footer'))
  await expect(page.locator('footer')).toHaveScreenshot('home-footer.png', { maxDiffPixels: 500 })
})

const routes = [
  { path: '/about', name: 'route-about' },
  { path: '/capabilities', name: 'route-capabilities' },
  { path: '/deployment-patterns', name: 'route-deployment-patterns' },
  { path: '/deployment-patterns/ai-voice-receptionist', name: 'route-pattern-voice-receptionist' },
  { path: '/blog', name: 'route-insights' },
  { path: '/blog/from-demo-to-production-why-ai-pilots-stall', name: 'route-insight-post' },
  { path: '/contact', name: 'route-contact' },
  { path: '/privacy', name: 'route-privacy' },
  { path: '/terms', name: 'route-terms' },
  { path: '/this-route-does-not-exist', name: 'route-404' },
]

for (const route of routes) {
  test(`visual: ${route.name} full page`, async ({ page }) => {
    await seedConsent(page)
    await page.goto(route.path)
    await page.waitForLoadState('networkidle')
    await settlePage(page)
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true })
  })
}

// Mobile-width goldens for the sections that have historically regressed on
// phones (hero CTA placement, horizontal overflow, the deployment stack, card
// gutters). Runs in the desktop project at a 390px viewport: the CSS
// breakpoints respond to width, so this catches responsive layout regressions
// deterministically without a device emulator.
test.describe('mobile widths', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('visual mobile: home hero', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2500)
    await freezeLoop(page)
    await expect(page.locator('section#hero')).toHaveScreenshot('mobile-home-hero.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: home capabilities', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const section = page.locator('section#capabilities').first()
    await settleSection(page, section)
    await expect(section).toHaveScreenshot('mobile-home-capabilities.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: FAQ on the capabilities page', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/capabilities')
    await page.waitForLoadState('networkidle')
    const section = page.locator('section#faq').first()
    await settleSection(page, section)
    await expect(section).toHaveScreenshot('mobile-capabilities-faq.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: first deployment-pattern panel', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/deployment-patterns')
    await page.waitForLoadState('networkidle')
    // The pinned layer of the first panel in src/components/DeploymentStack.tsx.
    // There is no `#deployment-patterns` section on this route — that id belongs
    // to the home-page grid — so this selected nothing until it was corrected.
    const panel = page.locator('div.sticky').first()
    await settleSection(page, panel)
    await expect(panel).toHaveScreenshot('mobile-deployment-panel.png', { maxDiffPixels: 500 })
  })
})
