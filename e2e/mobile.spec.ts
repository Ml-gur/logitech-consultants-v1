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

test('mobile: services tab control fits the viewport at every common width', async ({ page }) => {
  for (const width of [320, 360, 390, 412, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const section = page.locator('section').filter({ hasText: /Our Services/ }).first()
    await section.scrollIntoViewIfNeeded()

    const tablist = section.getByRole('tablist')
    await expect(tablist, `tablist visible at ${width}px`).toBeVisible()
    const box = await tablist.boundingBox()
    expect(box, `tablist box at ${width}px`).not.toBeNull()
    expect(box!.x, `tablist left edge at ${width}px`).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width, `tablist right edge at ${width}px`).toBeLessThanOrEqual(width + 1)

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow, `doc overflow at ${width}px`).toBe(0)
  }
})

test('mobile: all three service tabs render and panels switch on tap', async ({ page }) => {
  await page.goto('/')
  const section = page.locator('section').filter({ hasText: /Our Services/ }).first()
  await section.scrollIntoViewIfNeeded()

  await expect(section.getByRole('tab', { name: 'Workflow Automations' })).toBeVisible()
  await expect(section.getByRole('tab', { name: 'Data & Integrations' })).toBeVisible()
  await expect(section.getByRole('tab', { name: 'Business Consulting' })).toBeVisible()

  // Marquee animates on mobile too — switch to the Data tab (the panel
  // mounts after the tab-switch transition, so assert with auto-retry)
  await section.getByRole('tab', { name: 'Data & Integrations' }).tap()
  await expect(section.locator('.animate-marquee').first()).toBeVisible()
  await expect
    .poll(async () => (await section.locator('.animate-marquee').count()) >= 8)
    .toBe(true)
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
    .getByRole('link', { name: 'Get a demo' })
  const ctaBox = await cta.boundingBox()
  expect(ctaBox).not.toBeNull()
  expect(ctaBox!.height).toBeGreaterThanOrEqual(44)
})

test('mobile: FAQ accordion works on touch', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Need answers?').scrollIntoViewIfNeeded()

  const firstButton = page
    .getByRole('button', { name: /01\/ What does Logitech Consultants actually do/i })
    .first()
  await expect(firstButton).toBeVisible()
  await firstButton.tap()
  await expect(page.getByText(/We're a full-service AI agency/i)).toBeVisible()
})
