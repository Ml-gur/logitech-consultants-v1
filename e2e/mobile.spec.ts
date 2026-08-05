import { test, expect } from '@playwright/test'

/**
 * Mobile tests (Pixel 7 project): hamburger menu, no horizontal overflow,
 * 44px touch targets, and core sections render on a small screen.
 */

test('mobile: hamburger menu opens, navigates, closes', async ({ page }) => {
  await page.goto('/')

  const toggle = page.getByRole('button', { name: 'Open menu' })
  await expect(toggle).toBeVisible()
  await toggle.click()

  // aria-label flips to "Close menu" when open
  const closeToggle = page.getByRole('button', { name: 'Close menu' })
  await expect(closeToggle).toBeVisible()
  await expect(closeToggle).toHaveAttribute('aria-expanded', 'true')

  const menu = page.getByRole('navigation', { name: 'Mobile' })
  await expect(menu).toBeVisible()

  await menu.getByRole('link', { name: 'Blog', exact: true }).click()
  await expect(page).toHaveURL(/\/blog$/)
  // Menu closes on navigation
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
})

test('mobile: no horizontal overflow at 390px on all routes', async ({ page }) => {
  for (const path of ['/', '/about', '/case-studies', '/blog', '/contact']) {
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow, `overflow on ${path}`).toBe(0)
  }
})

test('mobile: no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  await page.goto('/')
  await page.waitForTimeout(1500)
  expect(errors).toEqual([])
})

test('mobile: services cards fit the viewport at every common width', async ({ page }) => {
  // Regression guard for the reported issue: services cards overflowing the
  // right edge on mobile. Verifies card bounds + document overflow across
  // phones (320-412), tablets (768) and small desktops (1024).
  for (const width of [320, 360, 390, 412, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.getByText('002/ Our Services').scrollIntoViewIfNeeded()

    const section = page.locator('section').filter({ hasText: /002\/ Our Services/ }).first()
    const cards = section.locator('.grid > div')
    expect(await cards.count(), `card count at ${width}px`).toBe(3)

    const bounds = await cards.evaluateAll((els) =>
      els.map((c) => {
        const r = c.getBoundingClientRect()
        return { left: Math.round(r.left), right: Math.round(r.right) }
      })
    )
    for (const b of bounds) {
      expect(b.left, `left edge at ${width}px`).toBeGreaterThanOrEqual(0)
      expect(b.right, `right edge at ${width}px`).toBeLessThanOrEqual(width)
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow, `doc overflow at ${width}px`).toBe(0)
  }
})

test('mobile: services cards are near full-bleed like the original', async ({ page }) => {
  // Original site at 390px: cards sit at 20px side margins (W=350). The clone
  // must match — not sit at 30px margins (W=330) like before.
  await page.goto('/')
  await page.getByText('002/ Our Services').scrollIntoViewIfNeeded()

  const section = page.locator('section').filter({ hasText: /002\/ Our Services/ }).first()
  const box = await section.locator('.grid > div').first().boundingBox()
  expect(box).not.toBeNull()
  // 20px gutter + tolerance for rounding
  expect(box!.x).toBeGreaterThanOrEqual(16)
  expect(box!.x).toBeLessThanOrEqual(24)
})

test('mobile: services cards stack and marquee renders', async ({ page }) => {
  await page.goto('/')
  await page.getByText('002/ Our Services').scrollIntoViewIfNeeded()

  const section = page.locator('section').filter({ hasText: /002\/ Our Services/ }).first()
  // All three cards visible in a single column on mobile
  await expect(section.getByText('Workflow Automations')).toBeVisible()
  await expect(section.getByText('Data & Integrations')).toBeVisible()
  await expect(section.getByText('Business Consulting')).toBeVisible()
  // Marquee animates on mobile too
  const tracks = section.locator('.animate-marquee')
  expect(await tracks.count()).toBeGreaterThanOrEqual(8)
})

test('mobile: nav links and CTA are at least 44px tall', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()

  const blog = page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Blog', exact: true })
  const box = await blog.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.height).toBeGreaterThanOrEqual(44)

  const cta = page
    .getByRole('navigation', { name: 'Mobile' })
    .getByRole('link', { name: 'Book a call' })
  const ctaBox = await cta.boundingBox()
  expect(ctaBox).not.toBeNull()
  expect(ctaBox!.height).toBeGreaterThanOrEqual(44)
})

test('mobile: FAQ accordion works on touch', async ({ page }) => {
  await page.goto('/')
  await page.getByText('009/ FAQs').scrollIntoViewIfNeeded()

  const firstButton = page
    .getByRole('button', { name: /01\/ What does Logitech Consultants actually do/i })
    .first()
  await expect(firstButton).toBeVisible()
  await firstButton.tap()
  await expect(page.getByText(/We're a full-service AI agency/i)).toBeVisible()
})
