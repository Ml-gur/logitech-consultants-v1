import { test, expect } from '@playwright/test'

/**
 * Homepage interaction tests: tabbed service section (white panels),
 * integration marquee animates, animated "Work automated" chart, WhyUs
 * X/check glyphs, FAQ accordion, pricing cards, and hover micro-interactions.
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

test('services: segmented tabs switch panels and the white product panel renders', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /Our Services/)

  // Three tabs present
  await expect(section.getByRole('tab', { name: 'Workflow Automations' })).toBeVisible()
  await expect(section.getByRole('tab', { name: 'Data & Integrations' })).toBeVisible()
  await expect(section.getByRole('tab', { name: 'Business Consulting' })).toBeVisible()

  // Default panel is Workflow Automations with its checklist
  const panel = section.getByRole('tabpanel')
  await expect(panel).toContainText('Let the repetitive work run itself.')

  // Switching tabs swaps the panel content
  await section.getByRole('tab', { name: 'Data & Integrations' }).click()
  await expect(panel).toContainText('Your data, wired and AI-ready.')

  await section.getByRole('tab', { name: 'Business Consulting' }).click()
  await expect(panel).toContainText('AI that pays for itself.')
})

test('services: integration marquee tiles render and animate', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /Our Services/)
  await section.getByRole('tab', { name: 'Data & Integrations' }).click()

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
  await expect
    .poll(transform, { timeout: 5000, intervals: [100, 200, 400] })
    .not.toBe(t0)
})

test('services: Work-automated chart shows progressive Jan→Apr growth', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /Our Services/)
  await section.getByRole('tab', { name: 'Business Consulting' }).click()

  // Business Consulting panel contains the "Work automated" chart (exact
  // matches — the checklist copy also mentions the same figures)
  const panel = section.getByRole('tabpanel')
  await expect(panel.getByText('Work automated', { exact: true })).toBeVisible()
  await expect(panel.getByText('+20%', { exact: true })).toBeVisible()
  await expect(panel.getByText('+51%', { exact: true })).toBeVisible()
  await expect(panel.getByText('Jan', { exact: true })).toBeVisible()
  await expect(panel.getByText('Apr', { exact: true })).toBeVisible()

  // 4 bars that grow once (staggered Jan→Apr) on scroll into view and STAY
  const bars = panel.getByTestId('chart-bar')
  await expect(bars).toHaveCount(4)
  const heights = async () =>
    Promise.all((await bars.all()).map((b) => b.evaluate((el) => el.getBoundingClientRect().height)))

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

test('services: no standalone Work automated section remains', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /Our Services/)
  await section.getByRole('tab', { name: 'Business Consulting' }).click()
  // The chart exists exactly once, inside the consulting tab panel
  await expect(section.getByText('Work automated', { exact: true })).toHaveCount(1)
})

test('WhyUs: light columns use X, dark column uses violet checkmark', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /Why Us/)

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

  // Featured column checkmark is Signal Violet
  await expect(workingUs.locator('svg').first()).toHaveCSS('color', 'rgb(112, 132, 255)')
})

test('FAQ accordion opens and closes', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /Need answers\?/)

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

test('pricing: 3 cards with prices and CTAs', async ({ page }) => {
  await page.goto('/')
  const section = await scrollToSection(page, /Pricing that scales with you/)
  await expect(section.getByText('$1.995')).toBeVisible()
  await expect(section.getByText('$2.995')).toBeVisible()
  await expect(section.getByText('$5.995')).toBeVisible()
  // Featured tier carries the Voltage Blue CTA
  await expect(section.getByRole('link', { name: 'Book a call' }).nth(1)).toHaveCSS('background-color', 'rgb(64, 91, 255)')
})

test('nav "Get a demo" pill links to contact', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Get a demo' })
    .click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('hero "Get started" button hovers to deeper Voltage Blue', async ({ page }) => {
  await page.goto('/')
  const cta = page.getByRole('button', { name: 'Get started', exact: true })
  await expect(cta).toBeVisible()
  await cta.hover()
  // Voltage Blue #405bff → deeper #3351e6 on hover
  await expect(cta).toHaveCSS('background-color', 'rgb(51, 81, 230)')
})

test('hero headline splits white and Signal Violet lines', async ({ page }) => {
  await page.goto('/')
  const h1 = page.getByRole('heading', { level: 1 })
  await expect(h1).toContainText('Move at AI speed.')
  await expect(h1).toContainText('Stay in control.')
  // Second line carries the violet accent
  await expect(h1.getByText('Stay in control.', { exact: true })).toHaveCSS('color', 'rgb(112, 132, 255)')
})
