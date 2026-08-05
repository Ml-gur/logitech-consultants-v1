import { chromium } from '@playwright/test'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })

for (const width of [320, 360, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 })
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(2000)
  await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    while ((n = w.nextNode())) {
      if (n.textContent.trim().startsWith('002/')) { n.parentElement.closest('section')?.scrollIntoView({ block: 'start' }); break }
    }
  })
  await page.waitForTimeout(2000)

  const info = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const svc = [...document.querySelectorAll('section')].find((s) => s.textContent?.includes('Our Services'))
    const out = { vw, cards: [] }
    if (!svc) return out
    // find the grid
    const grid = svc.querySelector('.grid')
    for (const card of grid.querySelectorAll(':scope > div')) {
      const r = card.getBoundingClientRect()
      const cls = (card.className?.toString?.() || '')
      if (r.width > 100 && cls.includes('rounded-[20px]')) {
        // measure illustration container (first child) vs card
        const ill = card.querySelector('div')?.getBoundingClientRect()
        const title = card.querySelector('h3')?.getBoundingClientRect()
        out.cards.push({
          L: Math.round(r.left), R: Math.round(r.right), W: Math.round(r.width),
          illW: ill ? Math.round(ill.width) : null,
          titleText: (card.querySelector('h3')?.textContent || '').slice(0, 24),
          descW: title ? Math.round(title.width) : null,
          pad: cls.match(/p-\[(\d+)px\]/)?.[1] || '?',
        })
      }
    }
    // check for any element inside services that overflows the card right edge
    out.internalOverflow = []
    for (const card of grid.querySelectorAll(':scope > div')) {
      const cr = card.getBoundingClientRect()
      for (const el of card.querySelectorAll('*')) {
        const r = el.getBoundingClientRect()
        if (r.right > cr.right + 1 && r.width > 0 && r.height > 0) {
          out.internalOverflow.push({
            tag: el.tagName,
            cls: (el.className?.toString?.() || '').slice(0, 45),
            cardR: Math.round(cr.right),
            elR: Math.round(r.right),
            W: Math.round(r.width),
          })
        }
      }
    }
    // dedupe internal overflow
    const seen = new Set()
    out.internalOverflow = out.internalOverflow.filter((o) => {
      const k = o.cls + '|' + o.elR
      if (seen.has(k)) return false
      seen.add(k)
      return true
    }).slice(0, 10)
    return out
  })

  console.log(`\n===== width ${width} =====`)
  for (const c of info.cards) console.log(`  card "${c.titleText}" L=${c.L} R=${c.R} W=${c.W} pad=${c.pad} illW=${c.illW} titleW=${c.descW}`)
  if (info.internalOverflow.length) {
    console.log('  INTERNAL OVERFLOW (content past card edge):')
    for (const o of info.internalOverflow) console.log(`    ${o.tag} "${o.cls}" cardR=${o.cardR} elR=${o.elR} W=${o.W}`)
  } else {
    console.log('  no internal overflow')
  }
  await page.screenshot({ path: `/tmp/svc-mobile-${width}.png` })
  await page.close()
}
await browser.close()
