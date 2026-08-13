// Technical SEO audit per seo-specialist skill — crawlability, indexability,
// on-page elements, structure, content signals.
import { chromium } from '@playwright/test'

const chromiumLaunchOptions = {
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-gpu'],
}

const browser = await chromium.launch(chromiumLaunchOptions)
const base = 'http://localhost:4173'
const routes = ['/', '/about', '/case-studies', '/case-studies/etery', '/case-studies/genesy', '/case-studies/zenon', '/blog', '/blog/getting-your-data-ai-ready-without-the-big-project', '/blog/buy-build-or-wait-a-simpler-way-to-decide', '/blog/your-tools-already-talk-you-don-t-have-to', '/blog/start-with-the-task-everyone-hates', '/contact']

const findings = []
const report = {}

for (const path of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  const m = await page.evaluate(() => {
    const q = (s) => document.querySelector(s)
    const qa = (s) => Array.from(document.querySelectorAll(s))
    const text = (s) => q(s)?.textContent?.trim() || ''
    const title = text('title')
    const desc = q('meta[name="description"]')?.content || ''
    const canonical = q('link[rel="canonical"]')?.href || ''
    const ogTitle = q('meta[property="og:title"]')?.content || ''
    const ogDesc = q('meta[property="og:description"]')?.content || ''
    const ogImage = q('meta[property="og:image"]')?.content || ''
    const twitterCard = q('meta[name="twitter:card"]')?.content || ''
    const robots = q('meta[name="robots"]')?.content || ''
    const ldjson = qa('script[type="application/ld+json"]').map((s) => s.textContent)
    const h1s = qa('h1').map((h) => h.textContent.trim())
    const h2s = qa('h2').map((h) => h.textContent.trim()).slice(0, 6)
    const imgs = qa('img')
    // Only flag images with NO alt attribute at all — empty alt="" is the
    // correct a11y pattern for decorative images.
    const noAlt = imgs.filter((i) => !i.hasAttribute('alt')).length
    const internalLinks = qa('a[href]').filter((a) => a.href.startsWith(location.origin)).length
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim()
    return { title, desc, canonical, ogTitle, ogDesc, ogImage, twitterCard, robots, ldjson, h1s, h2s, noAlt, imgCount: imgs.length, internalLinks, wordCount: bodyText.split(' ').length }
  })

  report[path] = m
  if (!m.title) findings.push(`✗ ${path}: MISSING <title>`)
  else if (m.title.length > 60) findings.push(`✗ ${path}: title ${m.title.length} chars (>60): "${m.title.slice(0, 70)}"`)
  else if (m.title.length < 15) findings.push(`✗ ${path}: title too short (${m.title.length}): "${m.title}"`)
  if (!m.desc) findings.push(`✗ ${path}: MISSING meta description`)
  else if (m.desc.length > 165) findings.push(`✗ ${path}: description ${m.desc.length} chars (>165)`)
  if (!m.canonical) findings.push(`✗ ${path}: MISSING canonical`)
  if (!m.ogTitle) findings.push(`✗ ${path}: MISSING og:title`)
  if (!m.ogImage) findings.push(`✗ ${path}: MISSING og:image`)
  if (!m.twitterCard) findings.push(`✗ ${path}: MISSING twitter:card`)
  if (m.h1s.length !== 1) findings.push(`✗ ${path}: ${m.h1s.length} H1s (want 1): ${JSON.stringify(m.h1s.slice(0, 3))}`)
  if (m.noAlt > 0) findings.push(`✗ ${path}: ${m.noAlt}/${m.imgCount} images missing alt`)
  if (m.internalLinks < 5) findings.push(`✗ ${path}: only ${m.internalLinks} internal links`)
  if (m.ldjson.length === 0) findings.push(`✗ ${path}: NO JSON-LD structured data`)
  if (path === '/') {
    if (m.wordCount < 300) findings.push(`✗ ${path}: thin homepage content (${m.wordCount} words)`)
  }
  await page.close()
}

// robots.txt + sitemap
{
  const ctx = await browser.newContext()
  for (const f of ['robots.txt', 'sitemap.xml']) {
    const r = await ctx.request.get(`${base}/${f}`)
    if (r.ok()) {
      const body = (await r.text()).slice(0, 500)
      report[f] = body
      findings.push(`✓ ${f} exists (${r.status()})`)
    } else {
      findings.push(`✗ ${f} MISSING (${r.status()})`)
    }
  }
  await ctx.close()
}

console.log('=== SEO AUDIT ===')
for (const [path, m] of Object.entries(report)) {
  if (typeof m === 'string') { console.log(`\n[${path}]`); console.log(m); continue }
  console.log(`\n=== ${path} ===`)
  console.log(`  title: "${m.title}" (${m.title.length}c)`)
  console.log(`  desc: "${m.desc.slice(0, 90)}..." (${m.desc.length}c)`)
  console.log(`  canonical: ${m.canonical || 'MISSING'}`)
  console.log(`  og: ${m.ogTitle ? 'ok' : 'MISSING'} | og:image: ${m.ogImage || 'MISSING'} | twitter:card: ${m.twitterCard || 'MISSING'}`)
  console.log(`  h1: ${JSON.stringify(m.h1s)}`)
  console.log(`  h2s: ${JSON.stringify(m.h2s)}`)
  console.log(`  imgs: ${m.imgCount} (${m.noAlt} no alt) | internal links: ${m.internalLinks} | words: ${m.wordCount} | ld+json: ${m.ldjson.length}`)
}
console.log('\n=== FINDINGS ===')
console.log(findings.length ? findings.join('\n') : 'NO FINDINGS — all checks pass')
await browser.close()
process.exit(findings.filter((f) => f.startsWith('✗')).length ? 1 : 0)
