// Live smoke test against a deployed origin (default https://naivolabs.com).
//
// Read-only: it loads the public site, exercises client-side routing, reads the
// head the way a crawler does, fetches the share image and measures horizontal
// overflow at 390px. Run it after every release:
//
//   node scripts/live-smoke.mjs
//   LIVE_BASE=https://staging.naivolabs.com node scripts/live-smoke.mjs
import { chromium } from '@playwright/test'

const BASE = process.env.LIVE_BASE || 'https://naivolabs.com'
const EXEC = process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser'

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ['--no-sandbox', '--blink-settings=primaryHoverType=2'],
})

const results = []
const errors = []

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') {
    errors.push(`${m.type()}: ${m.text().slice(0, 300)}`)
  }
})
page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 300)}`))
page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url().slice(0, 120)} ${r.failure()?.errorText}`))

const res = await page.goto(BASE + '/', { waitUntil: 'load', timeout: 30000 })
results.push(`home status: ${res.status()}`)
await page.waitForTimeout(4000)

results.push(`#root children: ${await page.locator('#root').evaluate((el) => el.children.length).catch(() => 'no #root')}`)
results.push(`h1 count: ${await page.locator('h1').count()}`)
results.push(`body text length: ${(await page.locator('body').innerText().catch(() => '')).length}`)
results.push(`body text head: ${JSON.stringify((await page.locator('body').innerText().catch(() => '')).slice(0, 160))}`)
await page.screenshot({ path: '/tmp/live-home.png', fullPage: false })

const body = await page.locator('body').innerText().catch(() => '')
// Brand-name guard: the name is one word, and stale copy from earlier drafts
// must never reach production.
for (const bad of ['Naivo Labs', 'NaivoLabs', 'Naivo ', 'Logitech', 'AIthor']) {
  if (body.includes(bad)) results.push(`COPY PROBLEM: rendered copy contains "${bad}"`)
}

// Client-side routing (direct URL 404s until the SPA fallback is added).
try {
  const link = page.getByRole('link', { name: /about/i }).first()
  const dest = await link.getAttribute('href', { timeout: 8000 })
  await link.click({ timeout: 8000 })
  await page.waitForURL(/\/about/, { timeout: 15000 })
  // The route chunk is lazy-loaded; asserting before it mounts reads the
  // PREVIOUS page's head and body (an earlier version of this script did
  // exactly that and reported a missing h1 that was really still loading).
  await page.waitForSelector('h1', { timeout: 20000 })
  await page.waitForFunction(
    () => document.querySelector('link[rel="canonical"]')?.href.endsWith('/about'),
    { timeout: 20000 },
  )
  const about = await page.evaluate(() => ({
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    h1: document.querySelector('h1')?.innerText ?? '',
  }))
  results.push(`client route ${dest} -> ${new URL(page.url()).pathname}`)
  results.push(`  h1: ${JSON.stringify(about.h1)}`)
  results.push(`  title: ${about.title}`)
  results.push(`  canonical: ${about.canonical}`)
} catch (e) {
  results.push(`client routing NOT verified: ${String(e).slice(0, 160)}`)
}

// Social + search: what a JS-rendering crawler sees after the app boots, which
// is what Googlebot reads. The share image must be an absolute URL it can fetch.
const meta = await page.evaluate(() => {
  const get = (sel) => document.querySelector(sel)?.getAttribute('content') ?? null
  return {
    title: document.title,
    description: get('meta[name="description"]'),
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
    robots: get('meta[name="robots"]'),
    ogImage: get('meta[property="og:image"]'),
    ogImageAlt: get('meta[property="og:image:alt"]'),
    twitterCard: get('meta[name="twitter:card"]'),
    twitterImage: get('meta[name="twitter:image"]'),
    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
  }
})
results.push(`title (${meta.title.length} chars): ${meta.title}`)
results.push(`canonical: ${meta.canonical} | robots: ${meta.robots} | json-ld blocks: ${meta.jsonLd}`)
results.push(`og:image: ${meta.ogImage}`)
results.push(`og:image absolute + https: ${!!meta.ogImage && meta.ogImage.startsWith('https://')}`)
results.push(`twitter card: ${meta.twitterCard} | twitter:image matches og: ${meta.twitterImage === meta.ogImage}`)
results.push(`og:image:alt present: ${!!meta.ogImageAlt}`)
results.push(`description (${meta.description?.length ?? 0} chars)`)

if (meta.ogImage) {
  const r = await page.request.get(meta.ogImage)
  const type = r.headers()['content-type'] ?? ''
  const body = await r.body()
  // PNG magic bytes, so a 200 cannot be an HTML soft-404 masquerading as the card.
  const isPng = body.length > 8 && body[0] === 0x89 && body[1] === 0x50 && body[2] === 0x4e && body[3] === 0x47
  results.push(`share image fetch: ${r.status()} ${type} ${body.length} bytes, valid PNG: ${isPng}`)
}

// Mobile: no horizontal overflow anywhere.
try {
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true })
  await mobile.goto(BASE + '/', { waitUntil: 'load', timeout: 30000 })
  await mobile.waitForTimeout(3500)
  const ov = await mobile.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }))
  results.push(`mobile 390 scrollWidth=${ov.sw} innerWidth=${ov.iw} overflow=${ov.sw > ov.iw}`)
} catch (e) {
  results.push(`mobile check failed: ${String(e).slice(0, 160)}`)
}

console.log(results.join('\n'))
console.log(`\nerrors/warnings: ${errors.length}`)
errors.slice(0, 15).forEach((e) => console.log('  - ' + e))

await browser.close()
