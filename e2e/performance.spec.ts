import { test, expect } from './test'
import type { Page } from '@playwright/test'
import { seedConsent } from './consent'

/**
 * Lab performance budgets — Lighthouse-equivalent Core Web Vitals measured
 * against the production build served by the Playwright webServer.
 *
 * Budgets are Google's "good" Core Web Vitals thresholds, plus a
 * resource/bundle budget for a static marketing site. They are deliberately
 * loose enough not to flake on a shared runner and tight enough to catch a
 * regression: an accidental dependency, a hero image, or a font that stops
 * being preloaded all push one of these numbers.
 *
 * Notes:
 * - These tests run serially so they do not contend for CPU and inflate LCP/INP
 *   (measured: running them in parallel added roughly a second to LCP).
 * - LCP and CLS are read BEFORE the interaction phase. Scrolling can reveal new
 *   LCP candidates and emit further layout-shift entries, which would pollute
 *   the reading with work that happened after the metric had settled.
 */

test.describe.configure({ mode: 'serial', retries: 3 })

const BUDGETS = {
  lcp: 2500, // ms — Google "good" LCP
  inp: 200, // ms — Google "good" INP
  cls: 0.1, // unitless — Google "good" CLS
  ttfb: 600, // ms
  totalSize: 1.5 * 1024 * 1024, // 1.5 MB total transfer per route
  jsSize: 500 * 1024, // 500 KB JS transfer (entry chunk budget is far below this)
  // Images are content, so the count is per-route: the home page renders the
  // four deployment-pattern cards, /blog renders the post covers. A route that
  // suddenly loads dozens of images means something decorative crept back in.
  imageCount: 16,
}

const ROUTES = ['/', '/about', '/capabilities', '/deployment-patterns', '/blog', '/contact']

/** Route-level metrics read from the navigation + resource timings. */
interface RouteMetrics {
  ttfb: number
  totalSize: number
  jsSize: number
  imageCount: number
}

/**
 * Install Web Vitals collectors (LCP, CLS, INP event-timing) on every load.
 *
 * The entry shapes below are declared locally rather than taken from lib.dom:
 * `LayoutShift` and `durationThreshold` are not in the standard typings (the
 * latter is a Chromium extension), so relying on them means the suite only
 * compiles against whichever browser type definitions happen to be current.
 */
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

interface EventTimingEntry extends PerformanceEntry {
  interactionId: number
  duration: number
}

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
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) w.__perf.cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })

    // durationThreshold 16ms captures every interaction that exceeds a frame.
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as EventTimingEntry[]) {
        if (entry.interactionId > 0) w.__perf.interactions.push(entry.duration)
      }
    }).observe({
      type: 'event',
      buffered: true,
      durationThreshold: 16,
    } as PerformanceObserverInit)
  })
}

async function readVitals(page: Page) {
  return page.evaluate(
    () =>
      (window as unknown as { __perf: { lcp: number; cls: number; interactions: number[] } })
        .__perf,
  )
}

async function readRouteMetrics(page: Page): Promise<RouteMetrics> {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return {
      ttfb: nav.responseStart - nav.requestStart,
      totalSize: resources.reduce((sum, e) => sum + (e.transferSize || 0), 0),
      jsSize: resources
        .filter((e) => e.initiatorType === 'script')
        .reduce((sum, e) => sum + (e.transferSize || 0), 0),
      imageCount: resources.filter((e) => e.initiatorType === 'img').length,
    }
  })
}

test('perf: the home page meets the LCP and CLS budgets', async ({ page }) => {
  await seedConsent(page)
  await installVitalsCollectors(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Let fonts and the hero's entrance sequence finish so LCP and CLS finalize.
  await page.waitForTimeout(1200)

  const vitals = await readVitals(page)
  console.log(`[perf] home — LCP=${vitals.lcp.toFixed(0)}ms CLS=${vitals.cls.toFixed(3)}`)

  // Guard against a vacuous pass: if no LCP entry was observed the metric reads
  // 0 and both assertions below would succeed without measuring anything.
  expect(vitals.lcp, 'LCP was never measured').toBeGreaterThan(0)

  expect(vitals.lcp, `LCP ${vitals.lcp.toFixed(0)}ms exceeds ${BUDGETS.lcp}ms`).toBeLessThan(
    BUDGETS.lcp,
  )
  expect(vitals.cls, `CLS ${vitals.cls.toFixed(3)} exceeds ${BUDGETS.cls}`).toBeLessThan(BUDGETS.cls)
})

test('perf: the FAQ accordion responds within the INP budget', async ({ page }) => {
  // INP is measured on /capabilities because the home page is deliberately
  // link-only — its controls navigate, which would end the measurement. The FAQ
  // accordion is the site's most-used interactive control.
  await seedConsent(page)
  await installVitalsCollectors(page)
  await page.goto('/capabilities')
  await page.waitForLoadState('networkidle')

  const faqButton = page.getByRole('button', { name: 'What does Naivolabs actually do?' })
  await faqButton.scrollIntoViewIfNeeded()
  // Settle first: a click landing mid-scroll measures the scroll work rather
  // than the interaction itself.
  await page.waitForTimeout(1500)

  await faqButton.click()
  await faqButton.click()
  await page.waitForTimeout(250)

  const { interactions } = await readVitals(page)
  const inp = interactions.length ? Math.max(...interactions) : 0
  console.log(`[perf] capabilities — INP=${inp.toFixed(0)}ms over ${interactions.length} events`)

  expect(interactions.length, 'no interactions were captured for INP').toBeGreaterThan(0)
  expect(inp, `INP ${inp.toFixed(0)}ms exceeds ${BUDGETS.inp}ms`).toBeLessThan(BUDGETS.inp)
})

test('perf: every route stays within the TTFB / transfer / JS / image budgets', async ({
  browser,
}) => {
  for (const path of ROUTES) {
    // A fresh context per route is a cold load with an accurate transferSize;
    // the shared page cache zeroes transferSize on a repeat visit.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    await seedConsent(page)
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const m = await readRouteMetrics(page)
    const biggest = await page.evaluate(() =>
      (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .sort((a, b) => b.transferSize - a.transferSize)
        .slice(0, 3)
        .map((e) => ({ name: e.name.split('/').pop(), size: e.transferSize })),
    )
    await context.close()

    console.log(
      `[perf] ${path} — TTFB=${m.ttfb}ms total=${(m.totalSize / 1024).toFixed(0)}kB JS=${(
        m.jsSize / 1024
      ).toFixed(0)}kB imgs=${m.imageCount} biggest=${JSON.stringify(biggest)}`,
    )

    expect(m.ttfb, `TTFB ${m.ttfb}ms on ${path}`).toBeLessThan(BUDGETS.ttfb)
    expect(m.totalSize, `total ${(m.totalSize / 1024).toFixed(0)}kB on ${path}`).toBeLessThan(
      BUDGETS.totalSize,
    )
    expect(m.jsSize, `JS ${(m.jsSize / 1024).toFixed(0)}kB on ${path}`).toBeLessThan(BUDGETS.jsSize)
    expect(m.imageCount, `${m.imageCount} images on ${path}`).toBeLessThanOrEqual(
      BUDGETS.imageCount,
    )
  }
})
