import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await page.goto('https://aithor.framer.website/', { waitUntil: 'domcontentloaded', timeout: 60_000 })
await page.waitForTimeout(3000)

const out = await page.evaluate(async () => {
  const res = { caseRows: [], blogPosts: [], pricingBadge: null, pricingPeriod: null, pricingText: null }

  // ---- Case studies: find section, list row titles + images ----
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  while ((n = w.nextNode())) {
    const t = n.textContent.replace(/\s+/g, ' ').trim()
    if (t.startsWith('005/ Case Studies')) {
      let el = n.parentElement
      for (let i = 0; i < 10 && el; i++) {
        const r = el.getBoundingClientRect()
        if (r.width > window.innerWidth * 0.55 && r.height > 0) {
          // walk the section: collect heading-ish texts and images
          const secEl = el
          const imgs = [...secEl.querySelectorAll('img')].map((img) => (img.currentSrc || img.src).split('?')[0].split('/').pop())
          // row titles: large-ish text nodes unique to rows
          const texts = [...secEl.querySelectorAll('h2, h3, div, span')]
            .filter((e) => e.children.length === 0 && (e.innerText || '').trim().length > 2 && (e.innerText || '').trim().length < 40)
            .map((e) => ({ t: e.innerText.replace(/\s+/g, ' ').trim(), y: Math.round(e.getBoundingClientRect().top + window.scrollY) }))
          // de-dupe consecutive same-y
          const seen = new Set()
          const uniq = texts.filter((x) => {
            const k = `${x.y}:${x.t}`
            if (seen.has(k)) return false
            seen.add(k)
            return true
          })
          res.caseRows = { imgs: imgs.slice(0, 6), texts: uniq.slice(0, 24) }
          break
        }
        el = el.parentElement
      }
      break
    }
  }

  // ---- Blog section: post titles + images ----
  const w2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while ((n = w2.nextNode())) {
    const t = n.textContent.replace(/\s+/g, ' ').trim()
    if (/Blog|Guides and playbooks/i.test(t) && t.length < 60) {
      let el = n.parentElement
      for (let i = 0; i < 8 && el; i++) {
        const r = el.getBoundingClientRect()
        if (r.width > window.innerWidth * 0.55 && r.height > 0) {
          const imgs = [...el.querySelectorAll('img')].map((img) => (img.currentSrc || img.src).split('?')[0].split('/').pop())
          const titles = [...el.querySelectorAll('h2, h3')].filter((e) => e.children.length === 0).map((e) => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 70))
          res.blogPosts = { imgs: imgs.slice(0, 6), titles: titles.slice(0, 8) }
          break
        }
        el = el.parentElement
      }
      break
    }
  }

  // ---- Pricing badge/period casing ----
  const w3 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while ((n = w3.nextNode())) {
    const t = n.textContent.replace(/\s+/g, ' ').trim()
    if (/per project|PER PROJECT/i.test(t) && t.length < 20) {
      const el = n.parentElement
      const cs = getComputedStyle(el)
      res.pricingBadge = { text: t, textTransform: cs.textTransform, size: cs.fontSize }
      break
    }
  }
  const w4 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while ((n = w4.nextNode())) {
    const t = n.textContent.replace(/\s+/g, ' ').trim()
    if (/monthly/i.test(t) && t.length < 20) {
      const el = n.parentElement
      res.pricingPeriod = { text: t, textTransform: getComputedStyle(el).textTransform }
      break
    }
  }

  return res
})

console.log(JSON.stringify(out, null, 1))
await browser.close()
