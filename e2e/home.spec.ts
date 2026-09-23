import { test, expect, type Page } from '@playwright/test'
import { seedConsent } from './consent'

/**
 * Homepage tests — the Naivolabs narrative in order: hero CTA above the fold,
 * the four-capability tab block, governance, measurement, the scroll-driven
 * deployment-pattern stack, principles marquee, positioning, deployment model,
 * pricing and FAQ.
 */

/** Jump directly to a section (Lenis smooth-scroll races with scrollIntoViewIfNeeded). */
async function scrollToSection(page: Page, selector: string) {
  const section = page.locator(selector).first()
  await section.evaluate((el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo(0, Math.max(0, y))
  })
  await expect(section).toBeVisible()
  return section
}

test('hero: primary CTA sits above the fold on desktop and mobile', async ({ page }) => {
  await seedConsent(page)

  for (const size of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size)
    await page.goto('/')

    const cta = page.getByRole('link', { name: 'Book a discovery call' }).first()
    await expect(cta, `hero CTA missing at ${size.width}×${size.height}`).toBeVisible()

    const box = await cta.boundingBox()
    expect(box, `no box for hero CTA at ${size.width}px`).not.toBeNull()
    expect(box!.y, `hero CTA above the viewport at ${size.width}px`).toBeGreaterThanOrEqual(0)
    expect(
      box!.y + box!.height,
      `hero CTA below the fold at ${size.width}×${size.height}`,
    ).toBeLessThanOrEqual(size.height)
  }
})

test('hero: headline splits white and Signal Violet lines', async ({ page }) => {
  await seedConsent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const h1 = page.getByRole('heading', { level: 1 })
  await expect(h1).toContainText('Put intelligence')
  await expect(h1).toContainText('to work.')
  await expect(h1.getByText('to work.', { exact: true })).toHaveCSS('color', 'rgb(112, 132, 255)')

  // The full idea is exposed to assistive tech as one sentence.
  await expect(h1.getByText('Put intelligence to work.', { exact: true })).toHaveCount(1)
})

test('hero: email capture validates, then hands off to the contact form', async ({ page }) => {
  await seedConsent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const email = page.getByLabel('Work email')
  const submit = page.getByRole('button', { name: 'Start a conversation' })

  // Empty → error state
  await submit.click()
  await expect(page.getByText('Enter a work email so we can reply.')).toBeVisible()
  await expect(email).toHaveAttribute('aria-invalid', 'true')

  // Invalid → different message
  await email.fill('not-an-email')
  await submit.click()
  await expect(page.getByText('That does not look like a valid email address.')).toBeVisible()

  // Valid → carries the address into the contact route
  await email.fill('jane@organization.org')
  await submit.click()
  await expect(page).toHaveURL(/\/contact\?email=jane%40organization\.org$/)
})

test('capabilities: four tabs switch the working system panel', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const section = await scrollToSection(page, 'section#capabilities')

  const tablist = page.getByRole('tablist', { name: 'Capabilities' })
  await expect(tablist).toBeVisible()
  for (const name of ['Converse', 'Understand', 'Act', 'Orchestrate']) {
    await expect(tablist.getByRole('tab', { name })).toBeVisible()
  }

  // Default panel — Converse, with its checklist and concrete systems.
  const panel = section.getByRole('tabpanel')
  await expect(panel).toContainText('Systems that communicate naturally with people.')
  await expect(panel.getByText('Voice agents', { exact: true })).toBeVisible()

  await tablist.getByRole('tab', { name: 'Understand' }).click()
  await expect(panel).toContainText('Systems that work with organizational information.')

  await tablist.getByRole('tab', { name: 'Act' }).click()
  await expect(panel).toContainText('Systems that perform defined tasks.')

  await tablist.getByRole('tab', { name: 'Orchestrate' }).click()
  await expect(panel).toContainText('Systems that connect intelligence to larger workflows.')
  await expect(panel.getByText('Governance', { exact: true })).toBeVisible()
})

test('home stays minimal: the deep sections live on the inner pages', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  // The brand's depth is one level down, not stacked on the landing page.
  for (const id of ['#governance', '#why-us', '#process', '#pricing', '#resources']) {
    await expect(page.locator(`section${id}`), `${id} should not be on the home page`).toHaveCount(0)
  }

  // The sections the home page does carry.
  for (const id of ['#home', '#capabilities', '#measurement', '#deployment-patterns', '#principles', '#blog', '#faq']) {
    await expect(page.locator(`section${id}`).first(), `${id} missing from the home page`).toBeVisible()
  }

  // A short, scannable page: 8 sections, nothing more.
  await expect(page.locator('section')).toHaveCount(8)
})

test('measurement: publishes the dimensions, not invented ROI figures', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const section = await scrollToSection(page, 'section#measurement')

  await expect(section.getByRole('heading', { name: /We agree what success means/ })).toBeVisible()
  await expect(section.getByText('Completion rate', { exact: true })).toBeVisible()
  await expect(section.getByText('Escalation accuracy', { exact: true })).toBeVisible()
  await expect(section.getByText('Cost per completed task', { exact: true })).toBeVisible()

  // No unverifiable stats anywhere in the section.
  const text = await section.innerText()
  expect(text).not.toMatch(/\d+% (ROI|faster|increase)/i)
})

test('deployment patterns: sticky, scroll-driven stack that scales as it is covered', async ({ page }) => {
  await seedConsent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  // `panels` are the sticky wrappers (what pins); `layers` are the transformed
  // children inside them (what recedes). The scale is applied to the layer, so
  // the recede assertion has to read the layer, not the wrapper.
  const panels = page.locator('section#deployment-patterns .sticky')
  const layers = page.locator('section#deployment-patterns .sticky > div')
  await expect(panels).toHaveCount(4)
  await expect(layers).toHaveCount(4)
  await expect(panels.first()).toHaveCSS('position', 'sticky')

  // Read the geometry from the browser: the pin line is where the stack's top
  // reaches --stack-base (96px at this width), and each panel owns an equal
  // slice of the remaining scroll distance. Deriving both beats guessing pixel
  // offsets, and it is what makes this assertion independent of copy length.
  const geo = await page.evaluate(() => {
    const first = document.querySelector('#deployment-patterns .sticky') as HTMLElement
    const container = first.parentElement as HTMLElement
    const rect = container.getBoundingClientRect()
    return {
      containerTop: rect.top + window.scrollY,
      scrollRange: rect.height - window.innerHeight,
      pinTop: parseFloat(getComputedStyle(first).top) || 96,
    }
  })
  expect(geo.scrollRange, 'the stack must be taller than the viewport to pin').toBeGreaterThan(0)

  const pinY = geo.containerTop - geo.pinTop
  await page.evaluate((y) => window.scrollTo(0, y), pinY)
  await page.waitForTimeout(500)
  const atPinPanel = await panels.first().boundingBox()
  const atPinLayer = await layers.first().boundingBox()

  // One full slice later the first panel has been covered: it is still pinned
  // (that is the stack) and it has scaled down (that is the recede).
  await page.evaluate((y) => window.scrollTo(0, y), pinY + geo.scrollRange / 4)
  await page.waitForTimeout(700)
  const coveredPanel = await panels.first().boundingBox()
  const coveredLayer = await layers.first().boundingBox()

  expect(atPinPanel, 'no box for the pinned panel').not.toBeNull()
  expect(coveredPanel, 'no box for the covered panel').not.toBeNull()
  expect(coveredPanel!.y, 'covered panel did not stay pinned').toBeGreaterThanOrEqual(-2)
  expect(coveredPanel!.y, 'covered panel did not stay pinned').toBeLessThanOrEqual(geo.pinTop + 4)
  expect(atPinLayer, 'no box for the pinned layer').not.toBeNull()
  expect(coveredLayer, 'no box for the covered layer').not.toBeNull()
  expect(coveredLayer!.width, 'covered layer did not scale down').toBeLessThan(atPinLayer!.width)

  // Every pattern is still reachable in the accessible reading order.
  const list = page.locator('section#deployment-patterns ol.sr-only li')
  await expect(list).toHaveCount(4)
  await expect(list.first()).toContainText('AI Voice Receptionist')
  await expect(list.last()).toContainText('Document Intake')
})

test('principles: all seven rules are readable at once, with nothing auto-scrolling', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const section = await scrollToSection(page, 'section#principles')

  await expect(section.getByRole('heading', { name: 'Seven rules we do not bend.' })).toBeVisible()

  // The whole set is rendered — seven cards, not a moving window of them.
  const cards = section.locator('figure').filter({ hasText: 'Naivolabs principle' })
  await expect(cards).toHaveCount(7)

  // Every rule is visible without waiting for anything to scroll past.
  for (const rule of [
    'Never make a claim we cannot support',
    'Start with a real problem, not a fashionable technology',
    'Deploy before declaring success',
    'Measure what matters',
    'Human oversight stays where the stakes require it',
    'Custom work should create reusable technology',
    'Platform ambitions follow proven demand',
  ]) {
    await expect(section.getByText(rule, { exact: true })).toBeVisible()
  }

  // No marquee track anywhere in this section, and nothing drifts over time.
  await expect(section.locator('.animate-marquee')).toHaveCount(0)
  const positions = async () =>
    Promise.all(
      (await cards.all()).map((c) => c.evaluate((el) => el.getBoundingClientRect().x)),
    )
  const first = await positions()
  await page.waitForTimeout(1200)
  expect(await positions()).toEqual(first)
})

test('hub pages carry the depth: positioning on /about, governance + model on /capabilities', async ({ page }) => {
  await seedConsent(page)

  await page.goto('/about')
  await expect(
    page.locator('section#why-us').getByRole('heading', { name: 'Between the platform and the work.' }),
  ).toBeVisible()

  await page.goto('/capabilities')
  await expect(
    page.locator('section#governance').getByRole('heading', { name: 'Governance you can read.' }),
  ).toBeVisible()
  await expect(
    page.locator('section#process').getByRole('heading', { name: 'From real work to reusable product.' }),
  ).toBeVisible()
})

test('positioning: Naivolabs column is the accent one', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/about')
  const section = await scrollToSection(page, 'section#why-us')

  const platforms = section.getByRole('heading', { name: 'Global AI platforms' }).locator('..')
  const agencies = section.getByRole('heading', { name: 'Generic AI agencies' }).locator('..')
  const naivolabs = section.getByRole('heading', { name: 'Naivolabs', exact: true }).locator('..')

  // Alternatives are marked with an X…
  await expect(platforms.locator('svg')).toHaveCount(5)
  expect(await platforms.locator('svg path').first().getAttribute('d')).toContain('M18 6L6 18')
  expect(await agencies.locator('svg path').first().getAttribute('d')).toContain('M18 6L6 18')

  // …and our column with a Signal Violet checkmark.
  await expect(naivolabs.locator('svg')).toHaveCount(5)
  expect(await naivolabs.locator('svg path').first().getAttribute('d')).toContain('M20 6L9 17l-5-5')
  await expect(naivolabs.locator('svg').first()).toHaveCSS('color', 'rgb(112, 132, 255)')
})

test('deployment model: the ten-stage process and flywheel principle render', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/capabilities')
  const section = await scrollToSection(page, 'section#process')

  await expect(section.getByRole('heading', { name: 'From real work to reusable product.' })).toBeVisible()
  await expect(
    section.getByText('Every deployment should make the next one better.', { exact: true }),
  ).toBeVisible()
  await expect(section.getByText('Operating principle')).toBeVisible()
})

test('pricing: the section is hidden for now', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  // The component is kept in the tree but not rendered until the operator
  // re-enables it — no price figures anywhere on the public page.
  await expect(page.locator('section#pricing')).toHaveCount(0)
  await expect(page.getByText('$1,995')).toHaveCount(0)
  await expect(page.getByText('Engagement models, not packages.')).toHaveCount(0)
})



test('FAQ accordion opens and closes', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const section = await scrollToSection(page, 'section#faq')

  const firstButton = section.getByRole('button', { name: /01\/ What does Naivolabs actually do\?/ })
  await expect(firstButton).toBeVisible()

  const answer = section.getByText(/We are an applied AI systems company/i)
  await expect(answer).toBeHidden()

  await firstButton.click()
  await expect(answer).toBeVisible()
  await expect(firstButton).toHaveAttribute('aria-expanded', 'true')

  await firstButton.click()
  await expect(answer).toBeHidden()
  await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
})

test('footer newsletter validates and confirms', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const footer = page.locator('footer')

  await footer.getByRole('button', { name: 'Subscribe' }).click()
  await expect(footer.getByText('Please enter your email address.')).toBeVisible()

  await footer.getByLabel('Email address').fill('nope')
  await footer.getByRole('button', { name: 'Subscribe' }).click()
  await expect(footer.getByText('That does not look like a valid email address.')).toBeVisible()

  await footer.getByLabel('Email address').fill('reader@organization.org')
  await footer.getByRole('button', { name: 'Subscribe' }).click()
  await expect(footer.getByRole('button', { name: 'Subscribed' })).toBeVisible()
})
