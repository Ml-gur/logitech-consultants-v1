#!/usr/bin/env node
/**
 * Build-time prerender (SEO fix #1 from docs/research/seo-ranking-strategy-deep-research.md).
 *
 * The site is a client-rendered SPA: every route serves the same empty
 * index.html shell until JS executes. Google renders JS, but only on a
 * second-wave render queue, and Bing / social / AI crawlers largely don't
 * render JS at all. This script captures the *settled, post-hydration* DOM for
 * every crawlable route and writes it as a real static HTML file:
 *
 *   dist/index.html                  (route "/")
 *   dist/about/index.html            (route "/about")
 *   dist/case-studies/etery/index.html ...
 *
 * Because the capture happens in a real browser, the result is exactly what a
 * crawler sees after JS runs: visible content (reveals fired), per-route
 * title/description/canonical/OG, and injected JSON-LD — none of which a
 * server-side renderToString of this app could produce (reveals start at
 * opacity 0; Seo.tsx writes tags in useEffect).
 *
 * Determinism:
 * - Emulates prefers-reduced-motion: reduce so the hero / logo marquee /
 *   metrics render at their final state immediately (they gate on
 *   useReducedMotion). The whileInView reveals still animate, so we run the
 *   same scroll-sweep + force-fire settle the visual E2E spec uses.
 * - Verifies each captured page: non-empty <title>, canonical, JSON-LD, real
 *   content in #root, and zero reveals still hidden — failing loudly instead
 *   of silently shipping a broken page.
 *
 * Routes come from public/sitemap.xml (single source of truth for crawlable
 * pages). New pages added to the app must be added to the sitemap too.
 *
 * Usage (wired as `npm run build:prerender`):
 *   npm run build && node scripts/prerender.mjs
 */

import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium as playwright } from 'playwright-core'
import chromium from '@sparticuz/chromium'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sitemapPath = resolve(root, 'public/sitemap.xml')
const distPath = resolve(root, 'dist')
const port = process.env.PRERENDER_PORT || '4174'
const baseURL = `http://localhost:${port}`

/** Parse crawlable paths from the sitemap (single source of truth). */
function routesFromSitemap() {
  const xml = readFileSync(sitemapPath, 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  return locs.map((loc) => new URL(loc).pathname)
}

/** Same settle as e2e/visual.spec.ts: sweep + force-fire hidden reveals. */
async function settleReveals(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(async () => {
    const step = 150
    const dwell = 50
    const maxY = document.body.scrollHeight
    for (let y = 0; y <= maxY; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, dwell))
    }
    for (let pass = 0; pass < 4; pass++) {
      const hidden = Array.from(
        document.querySelectorAll('[style*="opacity"]')
      ).filter((el) => getComputedStyle(el).opacity === '0')
      if (hidden.length === 0) break
      for (const el of hidden) {
        el.scrollIntoView({ block: 'center' })
        await new Promise((r) => setTimeout(r, 150))
      }
    }
  })
  const stillHidden = await page.evaluate(() => {
    const rendered = (el) => {
      let n = el
      while (n && n !== document.body) {
        if (getComputedStyle(n).display === 'none') return false
        n = n.parentElement
      }
      return true
    }
    return Array.from(document.querySelectorAll('[style*="opacity"]')).filter(
      (el) => getComputedStyle(el).opacity === '0' && rendered(el)
    ).length
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  // Let the last-fired 0.7s springs finish before capture.
  await page.waitForTimeout(1500)
  return stillHidden
}

/** Choose a chromium binary: env → system → playwright-managed. */
async function launchBrowser() {
  if (process.env.VERCEL) {
    const executablePath = await chromium.executablePath()
    return await playwright.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-gpu'],
      executablePath,
      headless: true,
    })
  }

  const candidates = [process.env.PLAYWRIGHT_CHROMIUM_PATH, '/usr/bin/chromium-browser']
  for (const exe of candidates) {
    if (exe) {
      try {
        return await playwright.launch({ executablePath: exe, args: ['--no-sandbox', '--disable-gpu'] })
      } catch {
        // fall through to the next candidate
      }
    }
  }
  // Playwright's own downloaded chromium (npx playwright install chromium).
  return playwright.launch()
}

function startPreview() {
  const child = spawn('npx', ['vite', 'preview', '--port', port, '--strictPort'], {
    cwd: root,
    stdio: 'ignore',
    detached: false,
  })
  return child
}

async function waitForServer(timeoutMs = 30_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(baseURL)
      if (res.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`preview server did not start on ${baseURL} within ${timeoutMs}ms`)
}

async function main() {
  const routes = routesFromSitemap()
  console.log(`Prerendering ${routes.length} routes from sitemap.xml`)

  const preview = startPreview()
  let browser
  try {
    await waitForServer()
    browser = await launchBrowser()
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()

    const failures = []
    for (const route of routes) {
      await page.goto(baseURL + route, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400) // hero entrance / nav pill settle
      const stillHidden = await settleReveals(page)

      // --- Verification (fail loudly, never ship a broken page) ---
      const check = await page.evaluate(() => {
        const title = document.title
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
        const jsonLd = document.querySelectorAll('script[type="application/ld+json"]').length
        const rootChildren = document.querySelector('#root')?.children.length || 0
        return { title, canonical, jsonLd, rootChildren }
      })

      const problems = []
      if (stillHidden > 0) problems.push(`${stillHidden} reveal(s) never fired`)
      if (!check.title) problems.push('empty <title>')
      if (!check.canonical) problems.push('missing canonical')
      if (check.jsonLd === 0) problems.push('no JSON-LD')
      if (check.rootChildren === 0) problems.push('empty #root (no content rendered)')
      if (problems.length) {
        failures.push({ route, problems, title: check.title, canonical: check.canonical })
        console.error(`  ✗ ${route}: ${problems.join('; ')}`)
        continue
      }

      // --- Write dist/<route>/index.html ---
      const html = await page.content()
      const out = route === '/' ? resolve(distPath, 'index.html') : resolve(distPath, route.slice(1), 'index.html')
      mkdirSync(dirname(out), { recursive: true })
      writeFileSync(out, html)
      console.log(`  ✓ ${route} → ${out.replace(root + '/', '')} (title: ${check.title})`)
    }

    if (failures.length) {
      console.error(`\nPrerender FAILED for ${failures.length} route(s):`)
      for (const f of failures) console.error(`  - ${f.route}: ${f.problems.join('; ')}`)
      process.exitCode = 1
    } else {
      console.log(`\nPrerender complete: ${routes.length}/${routes.length} routes written`)
    }
  } finally {
    if (browser) await browser.close()
    preview.kill('SIGTERM')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
