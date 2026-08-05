import { chromium } from '@playwright/test'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 390, height: 1200 }, deviceScaleFactor: 1 })
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await page.goto('https://aithor.framer.website/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    break
  } catch (e) { if (attempt === 3) throw e; await page.waitForTimeout(2000) }
}
await page.waitForTimeout(3000)
// scroll the "Our Services" label into view
await page.evaluate(() => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  while ((n = w.nextNode())) {
    const t = n.textContent.replace(/\s+/g, ' ').trim()
    if (t === '002/ Our Services' || t.includes('Our Services')) {
      const sec = n.parentElement?.closest('section')
      if (sec) { sec.scrollIntoView({ block: 'start' }); break }
    }
  }
})
await page.waitForTimeout(3000)

const info = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth
  const out = { vw, cards: [], sections: [] }
  // find service cards by titles, walking up to the largest card-like element
  const titles = ['Workflow Automations', 'Data & Integrations', 'Business Consulting']
  for (const t of titles) {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    while ((n = w.nextNode())) {
      if (n.textContent.trim() === t) {
        let el = n.parentElement
        const chain = []
        for (let i = 0; i < 10 && el; i++) {
          const r = el.getBoundingClientRect()
          const bg = getComputedStyle(el).backgroundColor
          chain.push({ tag: el.tagName, cls: (el.className?.toString?.() || '').slice(0, 40), W: Math.round(r.width), H: Math.round(r.height), bg })
          if (r.width > 250 && r.width < 500 && r.height > 200) {
            out.cards.push({ title: t, L: Math.round(r.left), R: Math.round(r.right), W: Math.round(r.width), H: Math.round(r.height), bg })
            break
          }
          el = el.parentElement
        }
        break
      }
    }
  }
  const seen = new Set()
  out.cards = out.cards.filter((c) => { const k = c.title + c.W + c.H; if (seen.has(k)) return false; seen.add(k); return true })
  return out
})
console.log('ORIGINAL at', info.vw)
for (const c of info.cards) console.log(`  ${c.title}: L=${c.L} R=${c.R} W=${c.W} H=${c.H} bg=${c.bg}`)
await page.screenshot({ path: '/tmp/orig-svc-full.png' })
await browser.close()
