import { chromium } from '@playwright/test'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await page.goto('https://aithor.framer.website/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    break
  } catch (e) {
    if (attempt === 3) throw e
    await page.waitForTimeout(2000)
  }
}
await page.waitForTimeout(3000)
// scroll to services section
await page.evaluate(() => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  while ((n = w.nextNode())) {
    if (n.textContent.trim().includes('Our Services') && n.textContent.trim().length < 40) {
      n.parentElement?.closest('section')?.scrollIntoView({ block: 'start' })
      break
    }
  }
})
await page.waitForTimeout(2500)

const info = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth
  const out = { vw, cards: [] }
  // find text "Workflow Automations" and walk up to the card
  const titles = ['Workflow Automations', 'Data & Integrations', 'Business Consulting']
  for (const t of titles) {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    while ((n = w.nextNode())) {
      if (n.textContent.trim() === t) {
        let el = n.parentElement
        for (let i = 0; i < 8 && el; i++) {
          const r = el.getBoundingClientRect()
          if (r.width > 200 && r.width < 500 && r.height > 100) {
            out.cards.push({
              title: t,
              L: Math.round(r.left), R: Math.round(r.right), W: Math.round(r.width),
              T: Math.round(r.top), H: Math.round(r.height),
            })
            break
          }
          el = el.parentElement
        }
        break
      }
    }
  }
  // dedupe
  const seen = new Set()
  out.cards = out.cards.filter((c) => {
    const k = c.title + '|' + c.W + '|' + c.H
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  return out
})
console.log('ORIGINAL services at', info.vw)
for (const c of info.cards) console.log(`  ${c.title}: L=${c.L} R=${c.R} W=${c.W} H=${c.H}`)
await page.screenshot({ path: '/tmp/orig-svc-mobile.png' })
await browser.close()
