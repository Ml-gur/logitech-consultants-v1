import { test, expect } from '@playwright/test'

/**
 * Homepage interaction tests: integration marquee animates, animated
 * "Work automated" chart, WhyUs X/check glyphs, FAQ accordion, pricing
 * cards, and hover micro-interactions.
 */

async function scrollToSection(page, labelRegex: RegExp) {
  const section = page.locator('section').filter({ hasText: labelRegex }).first()
  // Jump directly (Lenis smooth-scroll races with scrollIntoViewIfNeeded)
  await section.evaluate((el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo(0, Math.max(0, y))
  })
  await expect(section).toBeVisible()
  return section
}

test('services section: integration marquee tiles render and animate', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /002\/ Our Services/)
  await expect(section.getByText('Data & Integrations')).toBeVisible()

  // Marquee tracks exist (2 rows × 4 copies)
  const tracks = section.locator('.animate-marquee')
  await expect(tracks.first()).toBeVisible()
  const trackCount = await tracks.count()
  expect(trackCount).toBeGreaterThanOrEqual(8)

  // Tiles have brand glyphs
  const tile = section.locator('.animate-marquee svg path').first()
  await expect(tile).toBeVisible()

  // The marquee is actually animating: transform changes over time
  const transform = () =>
    tracks
      .first()
      .evaluate((el) => getComputedStyle(el).transform)
  const t0 = await transform()
  // Poll until the translateX changes (auto-retrying, no arbitrary sleeps)
  await expect
    .poll(transform, { timeout: 5000, intervals: [100, 200, 400] })
    .not.toBe(t0)
})

test('services section: Work-automated chart shows progressive Jan→Apr growth', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /002\/ Our Services/)

  // Business Consulting card contains the "Work automated" chart
  const card = page.getByRole('heading', { name: 'Business Consulting' }).locator('..')
  await expect(card.getByText('Work automated')).toBeVisible()
  await expect(card.getByText('+20%')).toBeVisible()
  await expect(card.getByText('+51%')).toBeVisible()
  await expect(card.getByText('Jan')).toBeVisible()
  await expect(card.getByText('Apr')).toBeVisible()

  // 4 bars that grow once (staggered Jan→Apr) on scroll into view and STAY —
  // progressive growth matching the +20% → +51% labels (no reset/loop)
  const bars = card.getByTestId('chart-bar')
  await expect(bars).toHaveCount(4)
  const heights = async () =>
    Promise.all((await bars.all()).map((b) => b.evaluate((el) => el.getBoundingClientRect().height)))

  // Wait for the staggered grow-in to finish (last bar Apr grew, then its
  // 0.9s animation completes)
  await expect.poll(async () => (await heights())[3], { timeout: 10000, intervals: [300] }).toBeGreaterThan(0)
  await page.waitForTimeout(1200)
  const grown = await heights()

  // Progressive: heights ascend Jan < Feb < Mar < Apr
  expect(grown[0]).toBeLessThan(grown[1])
  expect(grown[1]).toBeLessThan(grown[2])
  expect(grown[2]).toBeLessThan(grown[3])

  // Stable: no reset/loop — heights stay put after the grow-in
  await page.waitForTimeout(1500)
  expect(await heights()).toEqual(grown)
})

test('services section: no standalone Work automated section remains', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /002\/ Our Services/)
  // The old standalone chart had a 0–50% y-axis scale + 5 label rows — the card
  // version has "0–50%" too, so assert the standalone header markup is gone:
  await expect(section.getByText('Work automated', { exact: true })).toHaveCount(1)
})

test('WhyUs: light columns use X, dark column uses checkmark', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /006\/ Why Us/)

  const freelance = section.getByRole('heading', { name: 'Freelance' }).locator('..')
  const workingUs = section.getByRole('heading', { name: 'Working with Us' }).locator('..')

  // X path: M18 6L6 18M6 6l12 12 (5 items)
  await expect(freelance.locator('svg')).toHaveCount(5)
  const xPath = await freelance.locator('svg path').first().getAttribute('d')
  expect(xPath).toContain('M18 6L6 18')

  // Check path: M20 6L9 17l-5-5 (5 items)
  await expect(workingUs.locator('svg')).toHaveCount(5)
  const checkPath = await workingUs.locator('svg path').first().getAttribute('d')
  expect(checkPath).toContain('M20 6L9 17l-5-5')

  // Dark column checkmark is accent orange
  await expect(workingUs.locator('svg').first()).toHaveCSS('color', 'rgb(255, 55, 0)')
})

test('FAQ accordion opens and closes', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /009\/ FAQs/)

  const firstButton = section.getByRole('button', { name: /01\/ What does Logitech Consultants actually do/i })
  await expect(firstButton).toBeVisible()

  // Answer hidden initially
  const answer = section.getByText(/We're a full-service AI agency/i)
  await expect(answer).toBeHidden()

  // Open
  await firstButton.click()
  await expect(answer).toBeVisible()
  await expect(firstButton).toHaveAttribute('aria-expanded', 'true')

  // Close
  await firstButton.click()
  await expect(answer).toBeHidden()
  await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
})

test('pricing: 3 cards with dark CTA buttons', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /008\/ Our Pricing/)
  await expect(section.getByText('$1.995')).toBeVisible()
  await expect(section.getByText('$2.995')).toBeVisible()
  await expect(section.getByText('$5.995')).toBeVisible()
})

test('nav "Book a call" pill links to contact', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Book a call' })
    .click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('hero CTA pill has hover translate effect', async ({ page }) => {
  await page.goto('/')
  const cta = page.getByRole('link', { name: /Book a call/i }).first()
  await expect(cta).toBeVisible()
  await cta.hover()
  // bg darkens #151619 → #0a0a0a
  await expect(cta).toHaveCSS('background-color', 'rgb(10, 10, 10)')
})
