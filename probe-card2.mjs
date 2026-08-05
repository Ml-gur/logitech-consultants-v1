import { chromium } from '@playwright/test'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {})
await page.waitForTimeout(2000)
// scroll so card 2's marquee is centered in viewport
await page.evaluate(() => {
  const t = [...document.querySelectorAll('div')].find((d) => d.textContent?.includes('Data & Integrations'))
  t && t.scrollIntoView({ block: 'center' })
})
await page.waitForTimeout(2500)

const info = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth
  // find the IntegrationMarquee root (has animate-marquee children)
  const marquee = [...document.querySelectorAll('div')].find((d) => d.querySelector('.animate-marquee') && d.className?.toString?.().includes('h-[190px]'))
  const m = marquee ? marquee.getBoundingClientRect() : null
  // the LogoRow wrappers (overflow-hidden)
  const rows = []
  if (marquee) {
    for (const el of marquee.querySelectorAll('div.overflow-hidden')) {
      const r = el.getBoundingClientRect()
      rows.push({ L: Math.round(r.left), R: Math.round(r.right), W: Math.round(r.width) })
    }
  }
  // card rect
  let card = null
  if (marquee) {
    let el = marquee.parentElement
    for (let i = 0; i < 5 && el; i++) {
      const r = el.getBoundingClientRect()
      if (r.width > 200 && r.width < 500) { card = { L: Math.round(r.left), R: Math.round(r.right), W: Math.round(r.width) }; break }
      el = el.parentElement
    }
  }
  return { vw, marquee: m ? { L: Math.round(m.left), R: Math.round(m.right), W: Math.round(m.width) } : null, rows, card }
})
console.log('viewport', info.vw)
console.log('card:', info.card)
console.log('marquee root:', info.marquee)
for (const r of info.rows) console.log('logo row wrapper:', r)

await page.screenshot({ path: '/tmp/card2-marquee.png' })
await browser.close()
