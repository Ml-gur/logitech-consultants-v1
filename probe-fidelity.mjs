import { chromium } from '@playwright/test'

const ORIGINAL = 'https://aithor.framer.website/'
const CLONE = 'http://localhost:4173/'

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

  // 1) Hero headline
  out.hero = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    if (!h1) return { found: false }
    const cs = getComputedStyle(h1)
    const words = [...h1.querySelectorAll('span')].filter((s) => s.textContent.trim().length).map((s) => s.textContent.trim())
    return {
      text: h1.innerText.replace(/\s+/g, ' ').trim(),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily.split(',')[0],
      color: cs.color,
      lineHeight: cs.lineHeight,
      width: h1.getBoundingClientRect().width,
      left: h1.getBoundingClientRect().left,
      words: words.slice(0, 12),
    }
  })

  // 2) Process steps
  out.process = await page.evaluate(() => {
    const find = (m) => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let n
      while ((n = w.nextNode())) {
        if (n.textContent.replace(/\s+/g, ' ').trim().startsWith(m)) {
          let el = n.parentElement
          for (let i = 0; i < 8 && el; i++) {
            const r = el.getBoundingClientRect()
            if (r.width > window.innerWidth * 0.55 && r.height > 0) return r
            el = el.parentElement
          }
        }
      }
      return null
    }
    const r = find('004/ Our Process')
    const steps = []
    if (r) {
      const els = document.elementsFromPoint(720, r.top + 250)
      // collect step-like cards: text blocks with title + time
      const all = document.querySelectorAll('*')
      for (const el of all) {
        const rect = el.getBoundingClientRect()
        if (rect.width < 700 && rect.width > 300 && rect.height > 80 && rect.height < 400) {
          const txt = el.innerText || ''
          if (/Week|Automation|Discovery|Build|Scale|Operate/i.test(txt) && txt.length < 300) {
            const top = rect.top + window.scrollY
            const bg = getComputedStyle(el).backgroundColor
            steps.push({ title: txt.split('\n').slice(0, 3).join(' | ').slice(0, 90), top: Math.round(top), bg, h: Math.round(rect.height) })
          }
        }
      }
    }
    return { sectionTop: r ? Math.round(r.top + window.scrollY) : null, steps: steps.slice(0, 8) }
  })

  // 3) Pricing cards
  out.pricing = await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    let top = null
    while ((n = w.nextNode())) {
      if (n.textContent.replace(/\s+/g, ' ').trim().startsWith('008/ Our Pricing')) {
        let el = n.parentElement
        for (let i = 0; i < 8 && el; i++) {
          const r = el.getBoundingClientRect()
          if (r.width > window.innerWidth * 0.55 && r.height > 0) { top = r.top; break }
          el = el.parentElement
        }
        break
      }
    }
    if (top === null) return { found: false }
    const cards = []
    const els = [...document.querySelectorAll('*')].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 300 && r.width < 480 && r.top > top + 150 && r.top < top + 700 && r.height > 300 && r.height < 900
    })
    for (const el of els) {
      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim()
      if (/\$/.test(txt) && txt.length < 260) {
        const r = el.getBoundingClientRect()
        cards.push({ text: txt.slice(0, 120), top: Math.round(r.top + window.scrollY), h: Math.round(r.height), w: Math.round(r.width) })
      }
    }
    return { found: true, sectionTop: Math.round(top + window.scrollY), cards: cards.slice(0, 6) }
  })

  // 4) Case study + blog image sources
  out.images = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].map((i) => i.currentSrc || i.src).filter(Boolean)
    return imgs.slice(0, 20)
  })

  // 5) FAQ first question + heading
  out.faq = await page.evaluate(() => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    let top = null
    while ((n = w.nextNode())) {
      const t = n.textContent.replace(/\s+/g, ' ').trim()
      if (t.startsWith('009/ FAQs')) {
        let el = n.parentElement
        for (let i = 0; i < 8 && el; i++) {
          const r = el.getBoundingClientRect()
          if (r.width > window.innerWidth * 0.55 && r.height > 0) { top = r.top; break }
          el = el.parentElement
        }
        break
      }
    }
    const qs = [...document.querySelectorAll('*')].filter((el) => /^(0\d)\//.test((el.innerText || '').trim()))
    const questions = qs.slice(0, 8).map((el) => (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80))
    return { sectionTop: top === null ? null : Math.round(top + window.scrollY), questions }
  })

  await ctx.close()
  return out
}

const orig = await probe('original', ORIGINAL)
const clone = await probe('clone', CLONE)
console.log('================ ORIGINAL ================')
console.log(JSON.stringify(orig, null, 1))
console.log('================ CLONE ===================')
console.log(JSON.stringify(clone, null, 1))
await browser.close()
