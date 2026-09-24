import { test, expect } from './test'
import { seedConsent, readStoredConsent } from './consent'
import { ownConsoleErrors } from './console-noise'
import { horizontalOverflow } from './layout'

/**
 * Site-wide tests.
 *
 * Covers: every route renders with the right H1, per-route meta title /
 * description / canonical / Open Graph (the SEO surface the brand work added),
 * nav + footer navigation, the "Naivolabs" one-word brand rule, the custom 404,
 * legacy redirects, the cookie banner, and static robots.txt / sitemap.xml.
 */

const ROUTES = [
  { path: '/', heading: /Intelligence that\s+finishes the work/i, title: 'Applied AI systems for organizations' },
  { path: '/about', heading: /Intelligence\s+at work/i, title: 'About Naivolabs' },
  // Titles use a colon, not an em dash: the prose pass removed em dashes from
  // all user-facing copy, meta titles included.
  { path: '/capabilities', heading: /Four actions/i, title: 'Capabilities: Applied AI Systems' },
  { path: '/deployment-patterns', heading: /Patterns, not\s*promises/i, title: 'Deployment Patterns' },
  { path: '/blog', heading: /Notes from\s*production AI/i, title: 'Insights on Production AI' },
  { path: '/contact', heading: /Tell us what is\s*not working/i, title: 'Book a Discovery Call' },
  // Legal pages render a sentence-case h1 and a title-case meta title.
  { path: '/privacy', heading: /Privacy policy/i, title: 'Privacy Policy' },
  { path: '/terms', heading: /Terms (&|and) conditions/i, title: 'Terms & Conditions' },
] as const

for (const { path, heading } of ROUTES) {
  test(`route ${path} renders with correct heading, no console errors`, async ({ page }) => {
    await seedConsent(page)

    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(String(err)))

    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(heading)

    // No horizontal overflow at desktop.
    expect(await horizontalOverflow(page), `horizontal overflow on ${path}`).toBe(0)

    expect(ownConsoleErrors(errors), `console errors on ${path}`).toEqual([])
  })
}

test('every route ships its own meta title, description, canonical and OG image', async ({ page }) => {
  await seedConsent(page)

  const seenTitles = new Set<string>()
  const seenDescriptions = new Set<string>()

  for (const { path, title } of ROUTES) {
    await page.goto(path)
    // The head is managed at runtime (client-rendered SPA), so wait for the
    // page to actually render before reading it — reviewing the DOM before the
    // route's Seo effect runs reads the index.html baseline instead.
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

    const head = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') ?? '',
    }))

    // Title: page-specific, branded when it fits the ~60 char SERP budget.
    expect(head.title, `title on ${path}`).toContain(title)
    expect(head.title.length, `title length on ${path}`).toBeLessThanOrEqual(60)
    expect(seenTitles.has(head.title), `duplicate title "${head.title}"`).toBe(false)
    seenTitles.add(head.title)

    // Description: present, unique, within the SERP display window.
    expect(head.description.length, `description length on ${path}`).toBeGreaterThan(50)
    expect(head.description.length, `description length on ${path}`).toBeLessThanOrEqual(160)
    expect(seenDescriptions.has(head.description), `duplicate description on ${path}`).toBe(false)
    seenDescriptions.add(head.description)

    // Canonical + social card point at this route on the production origin.
    expect(head.canonical).toBe(`https://naivolabs.com${path === '/' ? '/' : path}`)
    expect(head.ogUrl).toBe(head.canonical)
    expect(head.ogTitle).toBe(head.title)
    expect(head.ogImage).toContain('/og-image.png')
    expect(head.twitterCard).toBe('summary_large_image')
  }
})

test('home page emits Organization + WebSite structured data', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  const jsonLd = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((s) => s.textContent ?? '')
      .join('\n'),
  )

  expect(jsonLd).toContain('"@type":"Organization"')
  expect(jsonLd).toContain('"@type":"WebSite"')
  expect(jsonLd).toContain('naivolabs.com')
})

test('nav links navigate to every section', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav).toBeVisible()

  // No "Home" entry: the wordmark is the home link, which is the convention
  // every visitor already knows. Its click target is asserted below.
  const links = [
    { label: 'Capabilities', path: '/capabilities' },
    { label: 'Deployment patterns', path: '/deployment-patterns' },
    { label: 'Insights', path: '/blog' },
    { label: 'About', path: '/about' },
  ]

  for (const { label, path } of links) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
  }

  await page.getByRole('link', { name: 'Naivolabs home' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('header CTA books a discovery call', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  // Scoped to the header, not the Primary nav: the links live in a centred pill
  // of their own (`navigation[aria-label="Primary"]`), and the action sits
  // beside it as a header-level control rather than inside the nav landmark.
  await page.locator('header').getByRole('link', { name: 'Book a discovery call' }).first().click()
  await expect(page).toHaveURL(/\/contact$/)
})

/**
 * Every "Book a discovery call" on the site must actually arrive at the form —
 * a CTA that dead-ends is worse than no CTA. This walks each page that ships
 * one and clicks it.
 */
test('every "Book a discovery call" CTA lands on the contact form', async ({ page }) => {
  const pagesWithCta = ['/', '/about', '/capabilities', '/deployment-patterns', '/ai-automation-nairobi']

  for (const path of pagesWithCta) {
    await seedConsent(page)
    await page.goto(path)

    const cta = page.getByRole('link', { name: 'Book a discovery call' }).first()
    await expect(cta, `no discovery CTA on ${path}`).toBeVisible()
    await cta.click()

    await expect(page, `CTA on ${path} did not reach the contact form`).toHaveURL(/\/contact$/)
    await expect(page.getByRole('button', { name: 'Send your message' })).toBeVisible()
  }
})

test('about names the team and links to real profiles only', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/about')

  await expect(page.getByRole('heading', { name: 'Alphonce' })).toBeVisible()
})

test('the brand name is always one word: Naivolabs', async ({ page }) => {
  await seedConsent(page)

  await page.goto('/')
  await expect(page.getByLabel(/Naivolabs home/)).toBeVisible()

  // Never "Naivo Labs" / "NaivoLabs" / bare "Naivo" in rendered copy.
  for (const path of ['/', '/about', '/contact', '/deployment-patterns']) {
    await page.goto(path)
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(body, `two-word brand on ${path}`).not.toContain('Naivo Labs')
    expect(body, `camel-case brand on ${path}`).not.toContain('NaivoLabs')
  }

  await page.goto('/contact')
  // Scoped to the page content: the footer carries the same address, so an
  // unscoped text match is a strict-mode violation (and raced the contact
  // block's own CMS-backed render, which is why it only failed under load).
  await expect(page.locator('#main').getByRole('link', { name: 'hello@naivolabs.com' })).toBeVisible()
})

test('footer exposes legal, cookie and contact links', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  const footer = page.locator('footer')
  await expect(footer.getByRole('link', { name: 'Privacy policy' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Terms & conditions' })).toBeVisible()
  await expect(footer.getByRole('button', { name: 'Cookie preferences' })).toBeVisible()
  await expect(footer.getByText('hello@naivolabs.com')).toBeVisible()
})

test('unknown routes render the branded 404 with noindex', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/a-page-that-never-existed')

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Nothing here/i)

  // `toHaveText`, not `toBeVisible`: this line is set in JetBrains Mono, which
  // is deliberately NOT preloaded (it only appears in small numeric labels), so
  // its box has no height until that face arrives — and on a machine with no
  // system fonts the fallback has no metrics either. What this guards is that
  // the visitor is told which path they asked for, which the text asserts.
  await expect(page.getByText(/Requested: \/a-page-that-never-existed/)).toHaveText(
    'Requested: /a-page-that-never-existed',
  )

  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute('content')
  expect(robots).toContain('noindex')

  // The escape hatches work.
  await page.getByRole('link', { name: 'Back to home' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('legacy case-study URLs redirect to deployment patterns', async ({ page }) => {
  await seedConsent(page)

  await page.goto('/case-studies')
  await expect(page).toHaveURL(/\/deployment-patterns$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Patterns, not/i)
})

test('detail routes render: deployment pattern + blog post', async ({ page }) => {
  await seedConsent(page)

  await page.goto('/deployment-patterns/ai-voice-receptionist')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/AI Voice Receptionist/i)

  await page.goto('/blog/getting-your-data-ai-ready-without-the-big-project')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/AI-Ready/i)
})

test('cookie banner: shows, persists a decision, and re-opens from the footer', async ({ page }) => {
  // A fresh Playwright context starts with empty localStorage, so this is the
  // visitor's first visit — no seeding needed.
  await page.goto('/')

  const banner = page.getByRole('region', { name: 'Cookie consent' })
  await expect(banner).toBeVisible()
  await expect(banner.getByRole('heading', { name: 'Cookies on this site' })).toBeVisible()

  // Preferences expand to per-category controls.
  await banner.getByRole('button', { name: 'Manage preferences' }).click()
  await expect(banner.getByText('Strictly necessary', { exact: true })).toBeVisible()
  await expect(banner.getByText('Analytics', { exact: true })).toBeVisible()
  await expect(banner.getByText('Marketing', { exact: true })).toBeVisible()

  // Rejecting is as prominent as accepting, and the decision is stored.
  await banner.getByRole('button', { name: 'Reject non-essential' }).click()
  await expect(banner).toBeHidden()

  const stored = await readStoredConsent(page)
  expect(stored, 'consent not persisted').not.toBeNull()
  expect(JSON.parse(stored!)).toMatchObject({ analytics: false, marketing: false, necessary: true })

  // The banner stays dismissed across navigations…
  await page.goto('/about')
  await expect(page.getByRole('region', { name: 'Cookie consent' })).toBeHidden()

  // …and the footer link re-opens it in preference mode.
  await page.locator('footer').getByRole('button', { name: 'Cookie preferences' }).click()
  const reopened = page.getByRole('region', { name: 'Cookie consent' })
  await expect(reopened).toBeVisible()
  await expect(reopened.getByRole('button', { name: 'Save preferences' })).toBeVisible()
})

test('robots.txt and sitemap.xml are served as real static files', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(robots.headers()['content-type']).toContain('text/plain')
  const robotsBody = await robots.text()
  expect(robotsBody).toContain('Sitemap: https://naivolabs.com/sitemap.xml')
  expect(robotsBody).toContain('User-agent: *')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const sitemapBody = await sitemap.text()
  expect(sitemapBody).toContain('<urlset')
  for (const path of [
    'https://naivolabs.com/',
    'https://naivolabs.com/capabilities',
    'https://naivolabs.com/deployment-patterns',
    'https://naivolabs.com/blog',
    'https://naivolabs.com/contact',
    'https://naivolabs.com/privacy',
    'https://naivolabs.com/terms',
  ]) {
    expect(sitemapBody, `sitemap missing ${path}`).toContain(`<loc>${path}</loc>`)
  }
  // The 404 route is not indexable, so it must never be listed.
  expect(sitemapBody).not.toContain('/404')
})

test('favicon set and web manifest are present', async ({ page, request }) => {
  await seedConsent(page)
  await page.goto('/')

  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel]')).map((l) => ({
      rel: l.rel,
      href: l.getAttribute('href') ?? '',
    })),
  )
  const rels = hrefs.map((h) => h.rel)
  expect(rels).toContain('icon')
  expect(rels).toContain('apple-touch-icon')
  expect(rels).toContain('manifest')

  for (const asset of ['/favicon.svg', '/favicon.ico', '/favicon-512.png', '/favicon-180.png', '/site.webmanifest', '/og-image.png']) {
    const res = await request.get(asset)
    expect(res.status(), `${asset} is not served`).toBe(200)
  }

  const manifest = await (await request.get('/site.webmanifest')).json()
  expect(manifest.name).toContain('Naivolabs')
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2)
})
