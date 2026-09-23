import { test, expect, Page, Browser } from '@playwright/test'
import { seedConsent } from './consent'

/**
 * Lab performance budgets — Lighthouse-equivalent Web Vitals measured against
 * the production build served by the Playwright webServer (per
 * playwright-best-practices/performance-testing.md). Runs in the
 * desktop-chromium project. Budgets are Google's "good" Core Web Vitals
 * thresholds plus a resource/bundle budget (ADR-001 premium bar: <170kB gzip
 * JS for the entry chunk; the shared transfer budget is higher to allow the
 * below-the-fold lazy chunks).
 *
 * Notes:
 * - Tests in this file run serially so the two perf tests don't contend for
 *   CPU and inflate LCP/INP (measured: parallel runs added ~1s to LCP).
 * - LCP/CLS are read BEFORE the interaction phase — scrolling to the FAQ can
 *   reveal new content and emit new LCP entries, polluting the reading.
 */

// Serial (no self-contention) + retries: lab timing is sensitive to CPU load
// from other spec files (esp. the heavy full-page visual captures) sharing the
// worker pool, so a noisy run retries.
test.describe.configure({ mode: 'serial', retries: 3 })

const BUDGETS = {
  lcp: 2500, // ms — Lighthouse "good" LCP threshold
  inp: 200, // ms — Lighthouse "good" INP threshold
  cls: 0.1, // unitless — Lighthouse "good" CLS threshold
  ttfb: 600, // ms
  totalSize: 1.5 * 1024 * 1024, // 1.5MB total transfer
  jsSize: 500 * 1024, // 500KB JS transfer
  // 36: the technology strip renders 9 platform logos twice (18 image
  // requests), the blog grid renders 3 covers, and the deployment-pattern
  // stack renders 4 — all below the fold. The compressed webp assets keep the
  // total transfer budget the binding constraint.
  imageCount: 36,
}

const ROUTES = ['/', '/about', '/capabilities', '/deployment-patterns', '/blog', '/contact']

/** Install Web Vitals collectors (LCP, CLS, INP event-timing) on every load. */
async function installVitalsCollectors(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as {
      __perf: { lcp: number; cls: number; interactions: number[] }
    }
    w.__perf = { lcp: 0, cls: 0, interactions: [] }

    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      w.__perf.lcp = entries[entries.length - 1].startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShift[]) {
        if (!entry.hadRecentInput) w.__perf.cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })

    // durationThreshold 16ms captures every interaction that exceeds a frame
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEventTiming[]) {
        if (entry.interactionId > 0) w.__perf.interactions.push(entry.duration)
      }
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 })
  })
}

test('perf: home meets LCP / INP / CLS budgets', async ({ page }) => {
  await seedConsent(page)
  await installVitalsCollectors(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Let fonts/animations settle so LCP and CLS finalize
  await page.waitForTimeout(1200)

  // Read LCP + CLS BEFORE interactions (scrolling reveals new LCP candidates)
  const initial = await page.evaluate(
    () => (window as unknown as { __perf: { lcp: number; cls: number; interactions: number[] } }).__perf,
  )

  // Simulate real interactions to measure INP: FAQ accordion toggle (no nav).
  // Settle first: the long scroll fires one-shot reveal springs and the
  // scroll-driven stack transforms; a click landing mid-animation measures
  // scroll work instead of the interaction itself.
  await page.getByText('Need answers?').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1900)
  const faqBtn = page
    .getByRole('button', { name: /01\/ What does Naivolabs actually do\?/ })
    .first()
  await faqBtn.click()
  await page.waitForTimeout(250)
  await faqBtn.click()

  const after = await page.evaluate(
    () => (window as unknown as { __perf: { lcp: number; cls: number; interactions: number[] } }).__perf,
  )
  const inp = after.interactions.length ? Math.max(...after.interactions) : 0

  console.log(
    `[perf] home — LCP=${initial.lcp.toFixed(0)}ms CLS=${initial.cls.toFixed(3)} INP=${inp.toFixed(0)}ms`,
  )

  // Guards against vacuous passes: if no LCP/interaction was ever observed the
  // metric reads 0 and the budget assertion would pass without measuring.
  expect(initial.lcp, 'LCP was never measured').toBeGreaterThan(0)
  expect(after.interactions.length, 'no interactions were captured for INP').toBeGreaterThan(0)

  expect(initial.lcp, `LCP ${initial.lcp.toFixed(0)}ms exceeds ${BUDGETS.lcp}ms budget`).toBeLessThan(BUDGETS.lcp)
  expect(initial.cls, `CLS ${initial.cls.toFixed(3)} exceeds ${BUDGETS.cls} budget`).toBeLessThan(BUDGETS.cls)
  expect(inp, `INP ${inp.toFixed(0)}ms exceeds ${BUDGETS.inp}ms budget`).toBeLessThan(BUDGETS.inp)
})

test('perf: all routes stay within TTFB / total-size / JS / image budgets', async ({ browser }) => {
  for (const path of ROUTES) {
    // Fresh context per route = cold load with accurate transferSize (the
    // shared page cache zeroes transferSize on repeat visits).
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    await seedConsent(page)
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const m = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      return {
        ttfb: nav.responseStart - nav.requestStart,
        totalSize: resources.reduce((s, e) => s + (e.transferSize || 0), 0),
        jsSize: resources.filter((e) => e.initiatorType === 'script').reduce((s, e) => s + (e.transferSize || 0), 0),
        imageCount: resources.filter((e) => e.initiatorType === 'img').length,
        biggest: [...resources]
          .sort((a, b) => b.transferSize - a.transferSize)
          .slice(0, 3)
          .map((e) => ({ name: e.name.split('/').pop(), size: e.transferSize })),
      }
    })
    await context.close()

    console.log(
      `[perf] ${path} — TTFB=${m.ttfb}ms total=${(m.totalSize / 1024).toFixed(0)}kB JS=${(m.jsSize / 1024).toFixed(0)}kB imgs=${m.imageCount} biggest=${JSON.stringify(m.biggest)}`,
    )

    expect(m.ttfb, `TTFB ${m.ttfb}ms on ${path}`).toBeLessThan(BUDGETS.ttfb)
    expect(m.totalSize, `total ${(m.totalSize / 1024).toFixed(0)}kB on ${path}`).toBeLessThan(BUDGETS.totalSize)
    expect(m.jsSize, `JS ${(m.jsSize / 1024).toFixed(0)}kB on ${path}`).toBeLessThan(BUDGETS.jsSize)
    expect(m.imageCount, `${m.imageCount} images on ${path}`).toBeLessThanOrEqual(BUDGETS.imageCount)
  }
})
