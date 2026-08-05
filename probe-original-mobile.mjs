import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})

for (const width of [390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 844 } })
  try {
    await page.goto('https://aithor.framer.website/case-studies/etery', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })
    await page.waitForTimeout(2500)

    const data = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const out = { url: location.pathname, vw, sections: [] }

      // 1. Outcome metric cards — find cards with big numbers
      const bigNums = []
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const txt = (el.textContent || '').trim()
        if (!/^\d/.test(txt) || txt.length > 12) continue
        const r = el.getBoundingClientRect()
        const fs = parseFloat(getComputedStyle(el).fontSize)
        if (fs >= 20 && r.width > 0) {
          bigNums.push({ txt, fs, w: Math.round(r.width), x: Math.round(r.left) })
        }
      }
      out.sections.push({ name: 'big numbers', items: bigNums.slice(0, 8) })

      // 2. Document overflow + offenders
      out.docOverflow = document.documentElement.scrollWidth - vw
      const offenders = []
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0 || r.right <= vw) continue
        const cls = (el.className && String(el.className).slice(0, 50)) || ''
        if (/marquee|animate/.test(cls)) continue
        const text = (el.textContent || '').trim().slice(0, 40)
        offenders.push({ tag: el.tagName.toLowerCase(), cls, text, right: Math.round(r.right) })
      }
      const seen = new Map()
      for (const o of offenders) {
        const k = o.cls + '|' + o.text
        if (!seen.has(k) || o.right > seen.get(k).right) seen.set(k, o)
      }
      out.offenders = [...seen.values()].sort((a, b) => b.right - a.right).slice(0, 6)

      // 3. How many columns the metric grid uses — count same-height cards
      return out
    })

    console.log(`=== ORIGINAL etery @ ${width}px (${data.url}) ===`)
    console.log('doc overflow:', data.docOverflow)
    console.log('big numbers:', JSON.stringify(data.sections[0].items))
    console.log('offenders:', JSON.stringify(data.offenders))
  } catch (e) {
    console.log(`=== ORIGINAL etery @ ${width}px — FAILED: ${e.message.slice(0, 120)} ===`)
  }
  await page.close()
}

await browser.close()
