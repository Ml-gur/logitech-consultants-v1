import { test, expect } from '@playwright/test'

/**
 * Site-wide tests: every route renders, nav works, headings are correct,
 * the site is rebranded to Logitech Consultants, and there are no console
 * errors or horizontal overflow on any route.
 */

const ROUTES = [
  { path: '/', heading: /Move at AI speed/i },
  { path: '/about', heading: /people behind your AI/i },
  { path: '/case-studies', heading: /Real problems, real outcomes/i },
  { path: '/blog', heading: /guides and playbooks/i },
  { path: '/contact', heading: /get in touch/i },
]

for (const { path, heading } of ROUTES) {
  test(`route ${path} renders with correct heading, no console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(String(err)))

    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

    // Heading may be in an h1 (subpages) or the page's h2-style heading
    const h1 = page.getByRole('heading', { level: 1 })
    if ((await h1.count()) > 0) {
      await expect(h1.first()).toContainText(heading)
    } else {
      await expect(page.getByText(heading).first()).toBeVisible()
    }

    // No horizontal overflow at desktop
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBe(0)

    expect(errors).toEqual([])
  })
}

test('nav links navigate to every section', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav).toBeVisible()

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Case Studies', path: '/case-studies' },
    { label: 'Blog', path: '/blog' },
  ]

  for (const { label, path } of links) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`\\${path}$`))
  }
})

test('site is rebranded to Logitech Consultants', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel(/Logitech Consultants home/)).toBeVisible()

  await page.goto('/about')
  await expect(page.getByText(/We founded Logitech Consultants in 2026/)).toBeVisible()

  await page.goto('/contact')
  await expect(page.getByText('hello@logitechconsultants.com')).toBeVisible()
})

test('no buy-template sticker anywhere', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/buy template/i)).toHaveCount(0)
})

test('case study detail + blog post routes render', async ({ page }) => {
  await page.goto('/case-studies/etery')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Etery/i)

  await page.goto('/blog/getting-your-data-ai-ready-without-the-big-project')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
