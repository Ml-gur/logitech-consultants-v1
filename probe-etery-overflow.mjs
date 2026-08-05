import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})

const widths = [320, 390]

for (const slug of ['etery', 'genesy', 'zenon']) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 844 } })
    await page.goto(`http://localhost:4173/case-studies/${slug}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1200)

    const clipped = await page.evaluate(() => {
      const out = []
      for (const el of Array.from(document.querySelectorAll('*'))) {
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
          const cls = (el.className && String(el.className).slice(0, 70)) || ''
          const text = (el.textContent || '').trim().slice(0, 60)
          const r = el.getBoundingClientRect()
          out.push({
            tag: el.tagName.toLowerCase(),
            cls,
            text,
            clientW: el.clientWidth,
            scrollW: el.scrollWidth,
            overflowX: getComputedStyle(el).overflowX,
            left: Math.round(r.left),
            right: Math.round(r.right),
            vw: document.documentElement.clientWidth,
          })
        }
      }
      // De-dupe nested (keep the smallest/leaf)
      const seen = new Set()
      return out
        .filter((o) => {
          const key = o.cls + '|' + o.text
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        .slice(0, 8)
    })

    console.log(`=== ${slug} @ ${width}px ===`)
    if (!clipped.length) console.log('  no text clipping')
    for (const c of clipped) {
      console.log(
        `  <${c.tag}> [${c.cls}] "${c.text}" clientW=${c.clientW} scrollW=${c.scrollW} overflowX=${c.overflowX} L=${c.left} R=${c.right}/vw=${c.vw}`
      )
    }
    await page.close()
  }
}

await browser.close()
