import { test, expect } from './test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { seedConsent } from './consent'

/**
 * Axe-core accessibility suite (per playwright-best-practices/accessibility.md).
 * Runs in the desktop-chromium project (the mobile project's testMatch already
 * limits it to mobile.spec.ts). Covers every route, WCAG 2.0/2.1 A + AA.
 */

const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/capabilities', name: 'Capabilities' },
  { path: '/deployment-patterns', name: 'Deployment patterns' },
  { path: '/deployment-patterns/ai-voice-receptionist', name: 'Pattern: Voice Receptionist' },
  { path: '/deployment-patterns/institutional-knowledge-agent', name: 'Pattern: Knowledge Agent' },
  { path: '/deployment-patterns/service-request-routing', name: 'Pattern: Request Routing' },
  { path: '/deployment-patterns/document-intake', name: 'Pattern: Document Intake' },
  { path: '/blog', name: 'Insights' },
  { path: '/blog/from-demo-to-production-why-ai-pilots-stall', name: 'Post: Demo to Production' },
  { path: '/blog/getting-your-data-ai-ready-without-the-big-project', name: 'Post: Data AI-Ready' },
  { path: '/blog/your-tools-already-talk-you-don-t-have-to', name: 'Post: Tools Talk' },
  { path: '/blog/start-with-the-task-everyone-hates', name: 'Post: Task Everyone Hates' },
  { path: '/contact', name: 'Contact' },
  { path: '/privacy', name: 'Privacy policy' },
  { path: '/terms', name: 'Terms & conditions' },
  { path: '/ai-automation-nairobi', name: 'Nairobi' },
  { path: '/this-route-does-not-exist', name: '404' },
]

/**
 * There is no third-party embed on the site, and nothing is excluded from these
 * scans: everything axe reports is something this repository can fix. If an
 * embed is ever added again, exclude it by selector here and say why.
 */

/**
 * Scroll the full page so the hero's entrance sequence finishes and any
 * scroll-linked component settles. Below-fold content is present from first
 * paint (ADR-004), so the sweep is about animation state, not about making
 * content exist.
 *
 * Two determinism guards, both learned from intermittent failures where the scan
 * reported colour-contrast violations on elements that were mid-animation (a
 * half-faded element is blended against its background, so its measured contrast
 * is lower than the settled state a visitor ever sees):
 *
 * - The sweep is repeated until `body.scrollHeight` stops growing. Routes are
 *   lazy-loaded, so on a cold chunk fetch the first `scrollHeight` measurement
 *   can catch the Suspense skeleton and sweep only the first screen.
 * - Any reveal still at its hidden state afterwards is force-fired by scrolling
 *   it into view (reveals are `once: true`, so already-fired ones are
 *   unaffected), then the page is given time to settle at the top.
 *
 * Budget note: this runs before axe's own whole-page analysis and the test
 * timeout is 30s, so the loops stay few. Long pages (~13,000px) cost ~0.7s per
 * sweep and ~60ms per force-fired element; a heavier version of this helper
 * timed out on / and /about the first time it ran in the full suite.
 */
async function settleFullPage(page: Page) {
  await page.waitForLoadState('networkidle')

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8

    let previousHeight = -1
    for (let pass = 0; pass < 3; pass++) {
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 40))
      }
      if (document.body.scrollHeight === previousHeight) break
      previousHeight = document.body.scrollHeight
    }

    for (let pass = 0; pass < 2; pass++) {
      const hidden = Array.from(
        document.querySelectorAll<HTMLElement>('[style*="opacity"]'),
      ).filter((el) => getComputedStyle(el).opacity === '0')
      if (hidden.length === 0) break
      for (const el of hidden) {
        el.scrollIntoView({ block: 'center' })
        await new Promise((r) => setTimeout(r, 60))
      }
    }

    window.scrollTo(0, 0)
  })

  // The nav itself animates in (framer-motion, opacity 0 → 1); scanning during
  // that window blends every nav colour against the page behind it.
  await page.waitForTimeout(700)
}

for (const route of routes) {
  test(`a11y: ${route.name} has no WCAG A/AA violations`, async ({ page }) => {
    await seedConsent(page)
    await page.goto(route.path)
    await settleFullPage(page)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.html.slice(0, 240)),
    }))

    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
  })
}

test('a11y: the cookie banner (undecided) has no WCAG A/AA violations', async ({ page }) => {
  // No consent seeded: a fresh context is a first visit, so the banner renders.
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'Cookie consent' })
  await expect(banner).toBeVisible()
  // This scan covers the page behind the banner too, so it needs the same
  // settle as the per-route scans: the hero's entrance animations are still
  // running when the banner first paints, and scanning an element that is
  // mid-fade reports contrast the settled state does not have (observed on the
  // hero's "Start a conversation" button).
  await settleFullPage(page)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(
    results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html.slice(0, 200)) })),
  ).toEqual([])
})

test('a11y: focus is visible on the first tab stop and the skip link works', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  // The first tab stop is the skip-to-content link.
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toHaveText(/skip to content/i)

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})
