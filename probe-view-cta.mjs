import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})

const widths = [320, 360, 390, 414, 430, 768, 1024, 1440]
const routes = ['/case-studies/etery', '/case-studies', '/']

for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 844 } })
    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1200)
    await page.evaluate(() => {
      const rows = document.querySelectorAll('a[href^="/case-studies/"]')
      if (rows.length) rows[rows.length - 1].scrollIntoView({ block: 'center' })
    })
    await page.waitForTimeout(900)

    const data = await page.evaluate(() => {
      const out = []
      for (const el of Array.from(document.querySelectorAll('a[href^="/case-studies/"]'))) {
        const cta = Array.from(el.querySelectorAll('*')).find(
          (n) => (n.textContent || '').trim() === 'View case study'
        )
        if (!cta) continue
        const er = cta.getBoundingClientRect()
        const cardR = el.getBoundingClientRect()
        const vw = document.documentElement.clientWidth
        // The text span (last child) — the word(s) actually rendered
        const span = cta.firstChild
        const sr = span && span.nodeType === 3 ? cta.getBoundingClientRect() : null
        out.push({
          href: el.getAttribute('href'),
          cta: { l: Math.round(er.left), r: Math.round(er.right), w: Math.round(er.width) },
          card: { l: Math.round(cardR.left), r: Math.round(cardR.right), w: Math.round(cardR.width) },
          clipped: er.right > cardR.right + 1 || er.right > vw,
          overflowHidden: getComputedStyle(el).overflow,
        })
      }
      return out
    })
    const bad = data.filter((d) => d.clipped)
    const flag = bad.length ? '*** CLIPPED ***' : 'ok'
    console.log(`${flag} ${route} @ ${width}px: ${data.map((d) => `${d.href.replace('/case-studies/', '')}[ctaR=${d.cta.r}/cardR=${d.card.r}]`).join(' ')}`)
    if (bad.length) console.log('   ' + JSON.stringify(bad))
    await page.close()
  }
}

// Save a screenshot at 390 of the etery detail 'More Case Studies' for the record
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:4173/case-studies/etery', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1200)
await page.evaluate(() => {
  const rows = document.querySelectorAll('a[href^="/case-studies/"]')
  if (rows.length) rows[rows.length - 1].scrollIntoView({ block: 'center' })
})
await page.waitForTimeout(1200)
await page.screenshot({ path: '/tmp/etery-rows-390.png' })
await page.close()
console.log('screenshot saved: /tmp/etery-rows-390.png')

await browser.close()
