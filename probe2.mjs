import { chromium } from '@playwright/test'

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})

async function probe(name, url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForTimeout(3000)
  const out = {}

  // Image load states
  out.images = await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('img')]
    const result = []
    for (const img of imgs) {
      const src = img.currentSrc || img.src
      // scroll image into view to force lazy load
      try { img.scrollIntoView({ block: 'center' }) } catch {}
      await new Promise((r) => setTimeout(r, 250))
      result.push({
        src: (src || '').split('?')[0].split('/').pop(),
        loaded: img.complete && img.naturalWidth > 0,
        nw: img.naturalWidth,
        nh: img.naturalHeight,
        w: img.getBoundingClientRect().width,
      })
    }
    return result
  })

  // Pricing: find '$1.995' card
  out.pricing = await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    while ((n = w.nextNode())) {
      if (n.textContent.trim().includes('$1.995')) {
        let el = n.parentElement
        const chain = []
        for (let i = 0; i < 10 && el; i++) {
          const r = el.getBoundingClientRect()
          if (r.width > 250 && r.width < 600 && r.height > 300 && r.height < 900) {
            const cs = getComputedStyle(el)
            const sample = (dx, dy) => {
              const e = document.elementFromPoint(r.left + r.width * dx, r.top + r.height * dy)
              return e ? getComputedStyle(e).backgroundColor : null
            }
            chain.push({
              top: Math.round(r.top + window.scrollY),
              h: Math.round(r.height),
              w: Math.round(r.width),
              radius: cs.borderRadius,
              bg: cs.backgroundColor,
              bgTop: sample(0.5, 0.06),
              bgMid: sample(0.5, 0.55),
              bgBottom: sample(0.5, 0.95),
            })
          }
          el = el.parentElement
        }
        return { text: n.parentElement.parentElement?.innerText?.slice(0, 200), chain }
      }
    }
    return { notFound: true }
  })

  // Process: find 'Weeks' step text and walk up
  out.process = await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    const steps = []
    while ((n = w.nextNode())) {
      const t = n.textContent.replace(/\s+/g, ' ').trim()
      if (/^Weeks \d/.test(t) || t === 'Ongoing') {
        let el = n.parentElement
        for (let i = 0; i < 8 && el; i++) {
          const r = el.getBoundingClientRect()
          if (r.width > 350 && r.width < 900 && r.height > 100 && r.height < 400) {
            const bg = getComputedStyle(el).backgroundColor
            const cs = getComputedStyle(el)
            steps.push({
              text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90),
              top: Math.round(r.top + window.scrollY),
              h: Math.round(r.height),
              w: Math.round(r.width),
              bg,
              radius: cs.borderRadius,
            })
            break
          }
          el = el.parentElement
        }
      }
    }
    return steps
  })

  // FAQ heading box + rows
  out.faq = await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((e) => /Need answers/i.test(e.innerText || ''))
    const qs = [...document.querySelectorAll('*')].filter((el) => /^0\d\/ /.test((el.innerText || '').trim()) && el.children.length === 0)
    const qr = qs.slice(0, 3).map((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return { text: el.innerText.trim().slice(0, 60), top: Math.round(r.top + window.scrollY), size: cs.fontSize, weight: cs.fontWeight, color: cs.color }
    })
    const hr = h ? h.getBoundingClientRect() : null
    return {
      heading: h ? { text: h.innerText.trim(), top: Math.round(hr.top + window.scrollY), size: getComputedStyle(h).fontSize } : null,
      qs: qr,
    }
  })

  await ctx.close()
  return out
}

const orig = await probe('original', 'https://aithor.framer.website/')
console.log('================ ORIGINAL ================')
console.log(JSON.stringify(orig, null, 1))
await browser.close()
