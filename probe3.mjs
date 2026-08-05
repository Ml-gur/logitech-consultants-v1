import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await page.goto('https://aithor.framer.website/', { waitUntil: 'domcontentloaded', timeout: 60_000 })
await page.waitForTimeout(3000)

const out = await page.evaluate(() => {
  // Locate the pricing section via the $1.995 text
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  let cardTop = null
  while ((n = w.nextNode())) {
    if (n.textContent.trim().includes('$1.995')) {
      let el = n.parentElement
      for (let i = 0; i < 12 && el; i++) {
        const r = el.getBoundingClientRect()
        if (r.width > 250 && r.width < 600 && r.height > 300 && r.height < 900) {
          cardTop = r.top
          break
        }
        el = el.parentElement
      }
      break
    }
  }
  if (cardTop === null) return { error: 'card not found' }

  const rects = []
  // 1) Elements with a painted background in the card region
  const els = [...document.querySelectorAll('*')]
  for (const el of els) {
    const r = el.getBoundingClientRect()
    if (r.top < cardTop || r.top > cardTop + 560) continue
    if (r.left < 350 || r.left > 820) continue
    const cs = getComputedStyle(el)
    const bg = cs.backgroundColor
    const isPainted = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
    const hasText = (el.innerText || '').trim().length > 0 && el.children.length === 0
    if (isPainted && r.width > 20 && r.height > 10) {
      rects.push({ type: 'bg', bg, radius: cs.borderRadius, top: Math.round(r.top + window.scrollY), h: Math.round(r.height), w: Math.round(r.width), left: Math.round(r.left) })
    }
    if (hasText && r.height < 60) {
      const txt = el.innerText.replace(/\s+/g, ' ').trim()
      if (txt.length < 60) {
        rects.push({ type: 'text', txt, size: cs.fontSize, weight: cs.fontWeight, color: cs.color, top: Math.round(r.top + window.scrollY), left: Math.round(r.left) })
      }
    }
  }
  rects.sort((a, b) => a.top - b.top || a.left - b.left)
  return { cardTop: Math.round(cardTop + window.scrollY), items: rects }
})

console.log(JSON.stringify(out, null, 1))
await browser.close()
