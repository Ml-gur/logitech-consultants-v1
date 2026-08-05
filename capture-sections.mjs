import { chromium } from '@playwright/test'
import fs from 'node:fs'

const ORIGINAL = process.env.ORIGINAL_URL || 'https://aithor.framer.website/'
const CLONE = process.env.CLONE_URL || 'http://localhost:4173/'
const OUT = '/tmp/site-compare'
const VIEWPORT = { width: 1440, height: 900 }
const NAV_OFFSET = 76 // fixed nav height on both sites
const SETTLE_MS = 2200 // wait for scroll reveals to finish

fs.mkdirSync(`${OUT}/original`, { recursive: true })
fs.mkdirSync(`${OUT}/clone`, { recursive: true })

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})

const SECTIONS = [
  { id: 'hero', markers: [] },
  { id: 'services', markers: ['002/ Our Services'] },
  { id: 'benefits', markers: ['003/ Benefits'] },
  { id: 'process', markers: ['004/ Our Process'] },
  { id: 'case-studies', markers: ['005/ Case Studies'] },
  { id: 'why-us', markers: ['006/ Why Us'] },
  { id: 'testimonials', markers: ['007/ Our Clients'] },
  { id: 'metrics', markers: ['Average first-year ROI', 'Hours saved per month'] },
  { id: 'pricing', markers: ['008/ Our Pricing'] },
  { id: 'faq', markers: ['009/ FAQs'] },
  { id: 'blog', markers: ['010/ Blog', 'Guides and playbooks'] },
  { id: 'footer', markers: [] },
]

async function findMarkerTop(page, marker) {
  return page.evaluate((m) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node
    while ((node = walker.nextNode())) {
      const t = node.textContent.replace(/\s+/g, ' ').trim()
      if (!t.startsWith(m)) continue
      // Walk up from the label to a wide block container (the section).
      let el = node.parentElement
      for (let i = 0; i < 8 && el; i++) {
        const r = el.getBoundingClientRect()
        if (r.width > window.innerWidth * 0.55 && r.height > 0) {
          return { top: r.top + window.scrollY, height: r.height, width: r.width }
        }
        el = el.parentElement
      }
      return null
    }
    return null
  }, marker)
}

async function captureSite(name, url, results) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  })
  const page = await context.newPage()
  // Retry the load: the sandbox's route to Framer's CDNs is flaky
  // (net::ERR_NETWORK_CHANGED seen intermittently, see ADR-005 notes).
  let loaded = false
  for (let attempt = 1; attempt <= 4 && !loaded; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
      loaded = true
    } catch (err) {
      console.warn(`[${name}] goto attempt ${attempt} failed: ${err.message.split('\n')[0]}`)
      if (attempt < 4) await new Promise((r) => setTimeout(r, 3000 * attempt))
    }
  }
  if (!loaded) throw new Error(`could not load ${url}`)
  // give fonts + framer assets a chance; networkidle can hang on some CDNs
  await page.waitForTimeout(4000)

  // Dismiss cookie/consent banners if present (Framer sites)
  try {
    const accept = page.locator('button, a').filter({ hasText: /accept|allow|agree|got it/i }).first()
    if (await accept.isVisible({ timeout: 1500 }).catch(() => false)) {
      await accept.click({ timeout: 2000 }).catch(() => {})
      await page.waitForTimeout(800)
    }
  } catch {}

  const pageInfo = await page.evaluate(() => ({
    title: document.title,
    scrollHeight: document.documentElement.scrollHeight,
    innerWidth: window.innerWidth,
  }))
  results[name] = { ...pageInfo, sections: {} }

  for (const sec of SECTIONS) {
    let scrollY = null
    let matchedMarker = null
    if (sec.id === 'hero') {
      scrollY = 0
    } else if (sec.id === 'footer') {
      scrollY = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
    } else {
      for (const m of sec.markers) {
        const rect = await findMarkerTop(page, m)
        if (rect) {
          matchedMarker = m
          scrollY = Math.max(0, rect.top - NAV_OFFSET)
          break
        }
      }
    }
    if (scrollY === null) {
      results[name].sections[sec.id] = { captured: false, reason: 'marker not found' }
      continue
    }
    // Scroll in steps so scroll-linked reveals fire deterministically
    await page.evaluate((y) => {
      const step = 400
      let cur = 0
      const go = () => {
        cur = Math.min(cur + step, y)
        window.scrollTo(0, cur)
        if (cur < y) setTimeout(go, 40)
      }
      go()
    }, scrollY)
    await page.waitForTimeout(SETTLE_MS)
    // Wait for lazy-loaded images in the visible viewport to finish loading
    // (Framer sites lazy-load; a premature shot shows gray placeholders).
    await page
      .waitForFunction(
        () => {
          const imgs = [...document.querySelectorAll('img')]
          const visible = imgs.filter((i) => {
            const r = i.getBoundingClientRect()
            return r.top < window.innerHeight && r.bottom > 0
          })
          return visible.length === 0 || visible.every((i) => i.complete && i.naturalWidth > 0)
        },
        { timeout: 15000 }
      )
      .catch(() => {})
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/${name}/${sec.id}.png` })
    results[name].sections[sec.id] = {
      captured: true,
      scrollY: Math.round(scrollY),
      marker: matchedMarker,
      pageHeight: pageInfo.scrollHeight,
    }
  }

  // Full-page overview (scroll through the whole page to trigger lazy loads)
  await page.evaluate(async () => {
    const step = 700
    const total = document.documentElement.scrollHeight - window.innerHeight
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    await new Promise((r) => setTimeout(r, 2500))
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 800))
  })
  await page.screenshot({ path: `${OUT}/${name}/full-page.png`, fullPage: true })
  await context.close()
}

const results = {}
await captureSite('original', ORIGINAL, results)
await captureSite('clone', CLONE, results)
await browser.close()

fs.writeFileSync(`${OUT}/capture-meta.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
