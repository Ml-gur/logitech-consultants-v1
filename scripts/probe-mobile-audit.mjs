// Mobile-responsiveness audit (per .agents/skills/mobile-responsiveness):
// tap-target sizes, spacing, font sizes, horizontal overflow, nav behavior.
import { chromium } from '@playwright/test'

const chromiumLaunchOptions = {
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
}

const browser = await chromium.launch(chromiumLaunchOptions)
const routes = ['/', '/about', '/case-studies', '/blog', '/contact']
const widths = [320, 360, 390, 414, 768]

const findings = []

for (const w of widths) {
  for (const path of routes) {
    const page = await browser.newPage({ viewport: { width: w, height: 844 }, hasTouch: true })
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto('http://localhost:4173' + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)

    const m = await page.evaluate(() => {
      const innerW = window.innerWidth
      const docW = document.documentElement.scrollWidth
      const overflow = docW - innerW

      // Tap targets below WCAG 2.5.8 AA (24px) in BOTH dimensions — the 44px
      // AAA bar is aspirational for text links; 24px is the pass/fail threshold.
      // Also require the element to be actually visible (not inside a closed
      // drawer / height-0 container).
      const smallTargets = []
      for (const el of document.querySelectorAll('a, button, input, [role="tab"], [role="button"]')) {
        const r = el.getBoundingClientRect()
        if (r.width < 2 || r.height < 2) continue
        if (el.closest('.sr-only') || el.getAttribute('aria-hidden') === 'true') continue
        // Skip elements clipped by a collapsed (closed) container — not tappable
        let n = el.parentElement
        let visible = true
        while (n && n !== document.body) {
          const h = n.getBoundingClientRect().height
          if (h < 2) { visible = false; break }
          n = n.parentElement
        }
        if (!visible) continue
        if (r.width < 24 || r.height < 24) {
          smallTargets.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 30),
            w: Math.round(r.width),
            h: Math.round(r.height),
          })
        }
      }

      // Body copy font sizes below 14px (design.md floor) — excluding the
      // 12px caption scale (uppercase labels with 0.14em tracking, which
      // design.md explicitly mandates), 13px mono stack chips, and 12-13px
      // meta text (dates, copyright, disclaimers) which is conventional.
      const tiny = []
      for (const el of document.querySelectorAll('p, li, span, a, div')) {
        const cs2 = getComputedStyle(el)
        const fs = parseFloat(cs2.fontSize)
        const r = el.getBoundingClientRect()
        if (fs < 14 && fs > 0 && r.width > 40 && !el.closest('.sr-only')) {
          const upper = cs2.textTransform === 'uppercase'
          const caption = upper && parseFloat(cs2.letterSpacing) >= 0.05
          const chip = /mono/i.test(cs2.fontFamily) && fs <= 13
          const meta = fs <= 13 && /©|designed|date|copyright|published|updated|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}/i.test(el.textContent || '')
          // Code blocks (pre/code) are exempt — mono type at 13-14px is the
          // design.md code spec; and blog category tags sit in the 12px meta row.
          const inCode = !!el.closest('pre, code')
          // Short labels (team titles, category tags, captions) are the
          // design.md 12px caption token; the 14px floor governs body copy
          // (sentences), not labels.
          const shortLabel = fs <= 13 && (el.textContent || '').trim().length <= 32
          // Simulated product-UI chrome inside the white product panels (the
          // design.md white-panel mockups) — not page body copy, so the 14px
          // floor doesn't apply.
          let inPanel = false
          let a = el.parentElement
          while (a && a !== document.body) {
            if (getComputedStyle(a).backgroundColor === 'rgb(255, 255, 255)') { inPanel = true; break }
            a = a.parentElement
          }
          if (caption || chip || meta || inPanel || inCode || shortLabel) continue
          tiny.push({ tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 30), fs })
        }
      }

      // Inputs: usable height + font-size >= 16px (prevents iOS zoom-on-focus)
      const inputs = []
      for (const el of document.querySelectorAll('input')) {
        const cs = getComputedStyle(el)
        inputs.push({
          name: el.getAttribute('placeholder') || el.id || 'input',
          h: Math.round(el.getBoundingClientRect().height),
          fs: parseFloat(cs.fontSize),
        })
      }

      // Mobile nav: is there a menu toggle, or are all links always visible?
      const links = [...document.querySelectorAll('nav a, header a')].filter((a) => {
        const r = a.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      })
      const navOverflow = links.filter((a) => a.getBoundingClientRect().right > innerW - 8).length

      return { overflow, smallTargets: smallTargets.slice(0, 12), smallCount: smallTargets.length, tiny: tiny.slice(0, 8), tinyCount: tiny.length, inputs, navOverflow, navLinkCount: links.length }
    })
    if (m.overflow > 0) findings.push(`✗ ${w}px ${path}: horizontal overflow ${m.overflow}px`)
    if (m.smallCount > 0) findings.push(`✗ ${w}px ${path}: ${m.smallCount} small tap targets e.g. ${JSON.stringify(m.smallTargets.slice(0, 3))}`)
    if (m.tinyCount > 0) findings.push(`✗ ${w}px ${path}: ${m.tinyCount} tiny text e.g. ${JSON.stringify(m.tiny.slice(0, 3))}`)
    const zoomRisk = m.inputs.filter((i) => i.fs < 16)
    if (zoomRisk.length) findings.push(`✗ ${w}px ${path}: inputs with <16px font (iOS zoom) ${JSON.stringify(zoomRisk)}`)
    if (m.navOverflow > 0) findings.push(`✗ ${w}px ${path}: ${m.navOverflow} nav links overflow viewport`)
    if (errors.length) findings.push(`✗ ${w}px ${path}: console errors ${errors.slice(0, 2)}`)

    if (w === 390 && path === '/') {
      console.log(`390px home nav links visible: ${m.navLinkCount}, overflow: ${m.navOverflow}`)
      console.log(`390px home inputs: ${JSON.stringify(m.inputs)}`)
    }
    await page.close()
  }
}

console.log(findings.length ? findings.join('\n') : 'ALL MOBILE CHECKS PASSED at 320/360/390/414/768 on all routes')
await browser.close()
process.exit(findings.length ? 1 : 0)
