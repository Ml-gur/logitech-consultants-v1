import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Axe-core accessibility suite (per playwright-best-practices/accessibility.md).
 * Runs in the desktop-chromium project (the mobile project's testMatch already
 * limits it to mobile.spec.ts). Covers every route, WCAG 2.0/2.1 A + AA.
 */

const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/case-studies', name: 'Case Studies' },
  { path: '/case-studies/etery', name: 'Case Study: Etery' },
  { path: '/case-studies/genesy', name: 'Case Study: Genesy' },
  { path: '/case-studies/zenon', name: 'Case Study: Zenon' },
  { path: '/blog', name: 'Blog' },
  { path: '/blog/getting-your-data-ai-ready-without-the-big-project', name: 'Blog: Data AI-Ready' },
  { path: '/blog/buy-build-or-wait-a-simpler-way-to-decide', name: 'Blog: Buy, Build, Wait' },
  { path: '/blog/your-tools-already-talk-you-don-t-have-to', name: 'Blog: Tools Talk' },
  { path: '/blog/start-with-the-task-everyone-hates', name: 'Blog: Task Everyone Hates' },
  { path: '/contact', name: 'Contact' },
]

/**
 * Scroll the full page so framer-motion `whileInView` reveals fire — otherwise
 * below-fold content sits at opacity 0 and is invisible to the scan. Also lets
 * the count-up / marquee animations settle.
 */
async function settleFullPage(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1000)
}

for (const route of routes) {
  test(`a11y: ${route.name} has no WCAG A/AA violations`, async ({ page }) => {
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
