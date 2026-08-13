import { test, expect, Locator, Page } from '@playwright/test'

/**
 * Visual regression goldens (per playwright-best-practices/visual-regression.md).
 * Covers the key home-page sections (hero, services, testimonials, metrics,
 * pricing, FAQ, footer) and every route (full page). Runs in the
 * desktop-chromium project.
 *
 * Determinism strategy:
 * - CSS animations/transitions (the marquees) are frozen by the global
 *   `animations: 'disabled'` screenshot option (playwright.config.ts).
 * - JS-driven framer-motion reveals are one-shot: we scroll the section (or the
 *   whole page) into view and wait for the 0.7s springs / 1.6s count-ups to
 *   settle before capturing.
 *
 * Regenerate after an intentional visual change:
 *   npx playwright test e2e/visual.spec.ts --update-snapshots
 */

test.describe.configure({ mode: 'serial' })

/** Wait for font-display: swap repaints so text metrics/line heights are final. */
async function waitFonts(page: Page) {
  await page.evaluate(() => document.fonts.ready)
}

/**
 * Scroll a section into view and wait for one-shot reveals/count-ups to
 * settle. Hardened against reveal-timing flakiness the same way settleReveals
 * is: after scrolling, force-fire any reveal still at its hidden state, so a
 * heavy section elsewhere on the page can't leave a below-fold section
 * half-revealed at capture time.
 */
async function settleSection(page: Page, section: Locator) {
  await waitFonts(page)
  await section.scrollIntoViewIfNeeded()
  // Force-fire reveals still at their hidden state (opacity 0 inline style).
  await page.evaluate(async () => {
    for (let pass = 0; pass < 4; pass++) {
      const hidden = Array.from(
        document.querySelectorAll<HTMLElement>('[style*="opacity"]')
      ).filter((el) => getComputedStyle(el).opacity === '0')
      if (hidden.length === 0) break
      for (const el of hidden) {
        el.scrollIntoView({ block: 'center' })
        await new Promise((r) => setTimeout(r, 150))
      }
    }
  })
  // Back to the section under capture, then let the last springs finish.
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(2000)
}

/**
 * Scroll the whole page (fires every whileInView reveal) then wait to settle.
 *
 * Determinism note (2026-08-05): framer-motion reveals are IntersectionObserver
 * driven. The old fast sweep (720px jumps, 60ms dwell) raced IO callback
 * delivery: under CPU contention the callbacks fired and below-fold sections
 * appeared; under light load they didn't — so the same golden flipped pass/fail
 * run-to-run (measured: route-case-studies rows 2-3 appear with --workers=2,
 * stay hidden with --workers=1; all 8 golden-era captures recorded them hidden).
 * Now we sweep in fine steps (every element spends many frames in view), then
 * force-fire any element still at its initial hidden state by scrolling it into
 * view (reveals are once:true, so already-animated elements are unaffected).
 *
 * Returns the number of elements still at opacity 0 AFTER the pass (elements
 * actually rendered — display:none subtrees like the closed mobile menu on
 * desktop are excluded). Route tests assert this is 0, so a reveal that ever
 * silently fails to fire fails the test loudly instead of re-capturing a
 * content-invisible golden (the failure mode that produced stale goldens).
 */
async function settleReveals(page: Page): Promise<number> {
  await waitFonts(page)
  await page.evaluate(async () => {
    const step = 150
    const dwell = 50
    const maxY = document.body.scrollHeight
    for (let y = 0; y <= maxY; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, dwell))
    }
    // Force-fire any reveal still at its hidden state (opacity 0 inline style).
    // Multi-pass: IO callbacks can deliver late under CPU contention, so
    // re-collect until nothing is hidden (bounded; typically 1-2 passes).
    for (let pass = 0; pass < 4; pass++) {
      const hidden = Array.from(
        document.querySelectorAll<HTMLElement>('[style*="opacity"]')
      ).filter((el) => getComputedStyle(el).opacity === '0')
      if (hidden.length === 0) break
      for (const el of hidden) {
        el.scrollIntoView({ block: 'center' })
        await new Promise((r) => setTimeout(r, 150))
      }
    }
  })
  const stillHidden = await page.evaluate(() => {
    const rendered = (el: HTMLElement): boolean => {
      let n: HTMLElement | null = el
      while (n && n !== document.body) {
        if (getComputedStyle(n).display === 'none') return false
        n = n.parentElement
      }
      return true
    }
    return Array.from(
      document.querySelectorAll<HTMLElement>('[style*="opacity"]')
    ).filter((el) => getComputedStyle(el).opacity === '0' && rendered(el)).length
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  // Let the last-fired 0.7s springs finish before capture.
  await page.waitForTimeout(1500)
  return stillHidden
}

test('visual: home hero section', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Hero entrance animations run up to ~1.9s after mount (word stagger + delays)
  await page.waitForTimeout(2500)
  await expect(page.locator('section#home')).toHaveScreenshot('home-hero.png', { maxDiffPixels: 500 })
})

test('visual: home services section', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const services = page.locator('section').filter({ hasText: 'Our Services' }).first()
  await settleSection(page, services)
  // Default tab (Workflow Automations) shows a static white product panel —
  // no infinite illustrations to mask in the default state.
  await expect(services).toHaveScreenshot('home-services.png', { maxDiffPixels: 500 })
})

test('visual: home testimonials section', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const testimonials = page.locator('section').filter({ hasText: 'What our clients say' }).first()
  await settleSection(page, testimonials)
  await expect(testimonials).toHaveScreenshot('home-testimonials.png', { maxDiffPixels: 500 })
})

test('visual: home metrics section', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const metrics = page.locator('section').filter({ hasText: 'Client retention rate' }).first()
  await settleSection(page, metrics)
  await expect(metrics).toHaveScreenshot('home-metrics.png', { maxDiffPixels: 500 })
})

test('visual: home pricing section', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const pricing = page.locator('section').filter({ hasText: 'Pricing that scales with you' }).first()
  await settleSection(page, pricing)
  await expect(pricing).toHaveScreenshot('home-pricing.png', { maxDiffPixels: 500 })
})

test('visual: home FAQ section', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const faq = page.locator('section').filter({ hasText: 'Need answers?' }).first()
  await settleSection(page, faq)
  await expect(faq).toHaveScreenshot('home-faq.png', { maxDiffPixels: 500 })
})

test('visual: home footer', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await settleSection(page, page.locator('footer'))
  await expect(page.locator('footer')).toHaveScreenshot('home-footer.png', { maxDiffPixels: 500 })
})

const routes = [
  { path: '/about', name: 'route-about' },
  { path: '/case-studies', name: 'route-case-studies' },
  { path: '/blog', name: 'route-blog' },
  { path: '/contact', name: 'route-contact' },
  { path: '/case-studies/etery', name: 'route-case-study-etery' },
  { path: '/blog/getting-your-data-ai-ready-without-the-big-project', name: 'route-blog-post' },
]

for (const route of routes) {
  test(`visual: ${route.name} full page`, async ({ page }) => {
    await page.goto(route.path)
    await page.waitForLoadState('networkidle')
    const stillHidden = await settleReveals(page)
    // Fail loudly if any rendered reveal never fired (see settleReveals note).
    expect(stillHidden, `${route.name}: ${stillHidden} reveal(s) never fired`).toBe(0)
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true })
  })
}

// Mobile-width goldens for the sections that have historically regressed on
// phones (services card overflow, card gutter). Runs in the desktop project at
// a 390px viewport — the CSS breakpoints respond to width, so this catches
// responsive layout regressions deterministically.
test.describe('mobile widths', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('visual mobile: home hero', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await waitFonts(page)
    await page.waitForTimeout(2500)
    await expect(page.locator('section#home')).toHaveScreenshot('mobile-home-hero.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: home services', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const services = page.locator('section').filter({ hasText: 'Our Services' }).first()
    await settleSection(page, services)
    await expect(services).toHaveScreenshot('mobile-home-services.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: home FAQ', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const faq = page.locator('section').filter({ hasText: 'Need answers?' }).first()
    await settleSection(page, faq)
    await expect(faq).toHaveScreenshot('mobile-home-faq.png', { maxDiffPixels: 500 })
  })
})
