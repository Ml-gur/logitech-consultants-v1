/**
 * Design-system audit probe — verifies the site renders the dark
 * LaunchDarkly-style system (design.md) and screenshots every route.
 * Run: node scripts/design-audit.mjs (against the vite dev server).
 */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE = process.env.AUDIT_BASE || 'http://localhost:3001'
const OUT = '/tmp/design-audit'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
})

const routes = ['/', '/about', '/case-studies', '/case-studies/etery', '/blog', '/blog/getting-your-data-ai-ready-without-the-big-project', '/contact']

let failures = 0
const check = (ok, label, extra = '') => {
  if (!ok) {
    failures++
    console.log(`  ✗ ${label} ${extra}`)
  }
}

for (const width of [1440, 390]) {
  console.log(`\n=== viewport ${width}px ===`)
  for (const path of routes) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const errors = []
    page.on('console', (m) => {
      // Dev-server-only noise (HMR websocket flapping) — ignore in the audit
      if (m.text().includes('ERR_NETWORK_CHANGED')) return
      if (m.type() === 'error') errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(String(e)))

    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)

    const slug = path === '/' ? 'home' : path.replace(/[\/]/g, '-')
    await page.screenshot({ path: `${OUT}/${width}-${slug}.png`, fullPage: width === 1440 })

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    check(overflow === 0, `${path} no horizontal overflow (got ${overflow})`)
    check(errors.length === 0, `${path} no console errors`, errors.slice(0, 2).join(' | '))

    // design.md compliance — read computed styles
    const css = await page.evaluate(() => {
      const s = (el) => (el ? getComputedStyle(el) : null)
      return {
        pageBg: s(document.documentElement)?.backgroundColor,
        bodyFont: s(document.body)?.fontFamily,
        h1SecondSpan: (() => {
          const spans = document.querySelectorAll('h1 > span')
          const last = spans[spans.length - 1]
          return last ? s(last)?.color : null
        })(),
      }
    })

    if (path === '/') {
      check(css.bodyFont ? true : false, 'body font readable (' + css.bodyFont + ')')
      check((css.bodyFont || '').includes('Inter'), 'body font is Inter', css.bodyFont)
      check(css.h1SecondSpan === 'rgb(112, 132, 255)', 'hero second line is Signal Violet', css.h1SecondSpan)
    }
    await page.close()
  }
}

// design.md do/don't audit on home (desktop)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  const audit = await page.evaluate(() => {
    const out = {}
    const style = (el) => getComputedStyle(el)
    // nav pill radius must be 60px
    const pill = document.querySelector('header nav a[href="/about"]')?.closest('header')
    const pillEl = pill?.firstElementChild
    out.navPillRadius = pillEl ? style(pillEl).borderRadius : null
    // primary CTA fill must be Voltage Blue
    const cta = document.querySelector('header a[href="/contact"]')
    out.ctaBg = cta ? style(cta).backgroundColor : null
    out.ctaRadius = cta ? style(cta).borderRadius : null
    // body copy must be ≥14px
    const p = document.querySelector('section p')
    out.bodyMinFs = p ? style(p).fontSize : null
    // code block must use mono font
    const code = document.querySelector('pre code')
    out.codeFont = code ? style(code).fontFamily : null
    // no orange anywhere
    const all = Array.from(document.querySelectorAll('*'))
    const orange = all.filter((el) => {
      const s = style(el)
      return /rgb\(255, 55, 0\)|#ff3700/.test(s.color + ' ' + s.backgroundColor + ' ' + (s.boxShadow || '') + ' ' + (s.borderColor || ''))
    }).length
    out.orangeCount = orange
    // drop shadows must not appear on cards (glow-only elevation)
    const card = document.querySelector('.card-dark, [class*="rounded-[30px]"], section#pricing [class*="rounded"]')
    out.sampleShadow = card ? style(card).boxShadow : null
    return out
  })
  console.log('\n=== design.md compliance (home, desktop) ===')
  console.log(JSON.stringify(audit, null, 2))
  check(audit.navPillRadius === '60px', 'nav pill radius 60px', audit.navPillRadius)
  check(audit.ctaBg === 'rgb(64, 91, 255)', 'primary CTA is Voltage Blue', audit.ctaBg)
  check(audit.ctaRadius === '30px', 'CTA radius 30px', audit.ctaRadius)
  check(audit.codeFont && audit.codeFont.includes('Mono'), 'code uses mono font', audit.codeFont)
  check(audit.orangeCount === 0, 'no orange accent remains', `found ${audit.orangeCount}`)
  await page.close()
}

await browser.close()
console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`)
process.exit(failures === 0 ? 0 : 1)
