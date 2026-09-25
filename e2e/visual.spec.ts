import { test, expect, Locator, Page } from '@playwright/test'
import { seedConsent } from './consent'

/**
 * Visual regression goldens (per playwright-best-practices/visual-regression.md).
 * Covers the key home-page sections (hero, capabilities, measurement,
 * deployment stack, principles, footer), the FAQ band where it actually lives
 * (/contact), and every route (full page). Runs in the desktop-chromium
 * project.
 *
 * Governance, positioning, the deployment model, insights and pricing are not
 * captured here as sections: the first three live on /capabilities and /about
 * and are covered by those route goldens, insights moved to /blog, and pricing
 * is not rendered.
 *
 * Determinism strategy:
 * - CSS animations/transitions (the marquees) are frozen by the global
 *   `animations: 'disabled'` screenshot option (playwright.config.ts).
 * - JS-driven framer-motion reveals are one-shot: we scroll the section (or the
 *   whole page) into view and wait for the springs to settle before capturing.
 * - Cookie consent is pre-seeded so the fixed banner never overlays a capture.
 * - Third-party/moving media is blocked rather than waited out: the vendor
 *   voice widget and the hero's looping MP4 (see the two aborts in the
 *   `beforeEach` below, each with its own note).
 *
 * Regenerate after an intentional visual change:
 *   npx playwright test e2e/visual.spec.ts --update-snapshots
 */

test.describe.configure({ mode: 'serial' })

/**
 * Never load the third-party voice widget (index.html) in a visual capture.
 *
 * It is a fixed overlay in the viewport's bottom-right corner, so it lands
 * inside almost every section and route capture. It loads from a vendor origin,
 * so whether it renders (and in what state) is not this repository's to
 * control: left in, the goldens assert the vendor's embed and flip pass/fail
 * depending on whether that origin answered (observed: two captures identical
 * except inside the widget's box, e.g. x 1257-1432 y 893-964). Blocking the
 * script is deterministic in every environment; the a11y suite excludes the
 * same embed for the same reason.
 *
 * (Hiding it by CSS instead is not enough: the widget injects its own
 * stylesheet and a button in a fixed container, and an `addInitScript` that
 * touches the DOM runs before `document.documentElement` exists.)
 */
test.beforeEach(async ({ page }) => {
  await page.route('**/*dograh*', (route) => route.abort())
  await page.route('**/*.mp4', (route) => route.abort())
})

/*
 * Why the `.mp4` abort above is there. The hero's ground is a looping 13.8 MB
 * MP4 on CloudFront (`VIDEO_SRC`, src/components/Hero.tsx). `animations:
 * 'disabled'` freezes CSS animations but not a *decoding video*, so a capture
 * landed on whatever frame happened to be on screen at that instant:
 * `home-hero.png` failed 36% of its pixels against a run seconds earlier, in the
 * same environment, with no source change. A golden of a moving plate asserts
 * nothing reproducible.
 *
 * Aborting the request removes the variable the same way the vendor-widget abort
 * does: the hero then paints its own `poster`, which is same-origin, static and
 * identical in every environment — the state a visitor sees at first paint, and
 * the state a `prefers-reduced-motion` visitor stays in (`preload="none"`, no
 * autoplay; see `useLoopingVideo`). What the hero goldens still assert is the
 * composition: the headline/subhead/action stack, its centring, the scrim, and
 * the band's height.
 */

/** Wait for font-display: swap repaints so text metrics/line heights are final. */
async function waitFonts(page: Page) {
  await page.evaluate(() => document.fonts.ready)
}

/**
 * Scroll a section into view and wait for one-shot reveals to settle. Hardened
 * against reveal-timing flakiness the same way settleReveals is: after
 * scrolling, force-fire any reveal still at its hidden state, so a heavy
 * section elsewhere on the page can't leave a below-fold section half-revealed
 * at capture time.
 */
async function settleSection(page: Page, section: Locator) {
  await waitFonts(page)
  await section.scrollIntoViewIfNeeded()
  // Force-fire reveals still at their hidden state (opacity 0 inline style).
  await page.evaluate(async () => {
    for (let pass = 0; pass < 4; pass++) {
      const hidden = Array.from(
        document.querySelectorAll<HTMLElement>('[style*="opacity"]'),
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
 * driven. A fast sweep races IO callback delivery, so the same golden flipped
 * pass/fail run-to-run. We sweep in fine steps (every element spends many
 * frames in view), then force-fire any element still at its initial hidden
 * state by scrolling it into view (reveals are once:true, so already-animated
 * elements are unaffected).
 *
 * Returns the number of elements still at opacity 0 AFTER the pass (elements
 * actually rendered — display:none subtrees like the closed mobile menu on
 * desktop are excluded). Route tests assert this is 0, so a reveal that ever
 * silently fails to fire fails the test loudly instead of re-capturing a
 * content-invisible golden.
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
    // Multi-pass: IO callbacks can deliver late under CPU contention.
    for (let pass = 0; pass < 4; pass++) {
      const hidden = Array.from(
        document.querySelectorAll<HTMLElement>('[style*="opacity"]'),
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
    return Array.from(document.querySelectorAll<HTMLElement>('[style*="opacity"]')).filter(
      (el) => getComputedStyle(el).opacity === '0' && rendered(el),
    ).length
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  // Let the last-fired springs finish before capture.
  await page.waitForTimeout(1500)
  return stillHidden
}

test('visual: home hero section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Hero entrance animations run up to ~1.9s after mount (word stagger +
  // delays) and toHaveScreenshot then fast-forwards the CSS keyframes to their
  // final state; the plate under them is the poster (the .mp4 abort above).
  await page.waitForTimeout(2500)
  await expect(page.locator('section#home')).toHaveScreenshot('home-hero.png', { maxDiffPixels: 500 })
})

test('visual: home capabilities section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const section = page.locator('section#capabilities').first()
  await settleSection(page, section)
  // Default tab (Converse) renders a static white product panel.
  await expect(section).toHaveScreenshot('home-capabilities.png', { maxDiffPixels: 500 })
})

test('visual: home measurement section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const section = page.locator('section#measurement').first()
  await settleSection(page, section)
  await expect(section).toHaveScreenshot('home-measurement.png', { maxDiffPixels: 500 })
})

test('visual: home principles section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // The principles band is the section holding the marquee of principle cards.
  const section = page.locator('section').filter({ hasText: 'Seven rules we do not bend.' }).first()
  await settleSection(page, section)
  await expect(section).toHaveScreenshot('home-principles.png', { maxDiffPixels: 500 })
})

// NOTE: the pricing section is hidden for now (see HomePage.tsx), so it has no
// golden. When the operator re-enables it, add a `home-pricing` capture here.
// Governance, positioning and the deployment model now live on /capabilities
// and /about, and are covered by those route goldens.

// The FAQ band is a sibling of the contact page shell, not part of the home
// page (see ContactPage.tsx). Capturing it at / used to resolve the same
// locator to nothing and time the test out.
test('visual: FAQ section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')
  const section = page.locator('section#faq').first()
  await settleSection(page, section)
  await expect(section).toHaveScreenshot('contact-faq.png', { maxDiffPixels: 500 })
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
    const stillHidden = await settleReveals(page)
    // Fail loudly if any rendered reveal never fired (see settleReveals note).
    expect(stillHidden, `${route.name}: ${stillHidden} reveal(s) never fired`).toBe(0)
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true })
  })
}

// Mobile-width goldens for the sections that have historically regressed on
// phones (hero CTA placement, tab-control overflow, the deployment stack,
// card gutters). Runs in the desktop project at a 390px viewport — the CSS
// breakpoints respond to width, so this catches responsive layout regressions
// deterministically.
test.describe('mobile widths', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('visual mobile: home hero', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await waitFonts(page)
    await page.waitForTimeout(2500)
    await expect(page.locator('section#home')).toHaveScreenshot('mobile-home-hero.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: home capabilities', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const section = page.locator('section#capabilities').first()
    await settleSection(page, section)
    await expect(section).toHaveScreenshot('mobile-home-capabilities.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: FAQ section', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    const section = page.locator('section#faq').first()
    await settleSection(page, section)
    await expect(section).toHaveScreenshot('mobile-contact-faq.png', { maxDiffPixels: 500 })
  })

  test('visual mobile: first deployment-pattern panel', async ({ page }) => {
    await seedConsent(page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const panel = page.locator('section#deployment-patterns .sticky').first()
    await settleSection(page, panel)
    await expect(panel).toHaveScreenshot('mobile-deployment-panel.png', { maxDiffPixels: 500 })
  })
})
