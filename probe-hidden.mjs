import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:4173/about', { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  const step = 150, dwell = 50
  const maxY = document.body.scrollHeight
  for (let y = 0; y <= maxY; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, dwell))
  }
  const hidden = Array.from(document.querySelectorAll('[style*="opacity"]'))
    .filter((el) => getComputedStyle(el).opacity === '0')
  for (const el of hidden) {
    el.scrollIntoView({ block: 'center' })
    await new Promise((r) => setTimeout(r, 120))
  }
})
const info = await page.evaluate(() => {
  const rendered = (el) => {
    let n = el
    while (n && n !== document.body) {
      if (getComputedStyle(n).display === 'none') return false
      n = n.parentElement
    }
    return true
  }
  return Array.from(document.querySelectorAll('[style*="opacity"]'))
    .filter((el) => getComputedStyle(el).opacity === '0' && rendered(el))
    .map((el) => {
      const r = el.getBoundingClientRect()
      const scrollY = window.scrollY
      return {
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 80),
        text: (el.textContent || '').trim().slice(0, 60),
        absY: Math.round(r.top + scrollY),
        absH: Math.round(r.height),
        docH: document.body.scrollHeight,
        style: el.getAttribute('style'),
      }
    })
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
