import { test, expect } from './test'
import type { Page } from '@playwright/test'
import { seedConsent } from './consent'

/**
 * Homepage tests — the Naivolabs narrative in order: hero, four capabilities,
 * four deployment patterns, three commitments, one call to action.
 *
 * These replaced a suite written against a seven-section page that carried a
 * tabbed capability block, a fabricated metrics band and seven numbered
 * "principle" cards. The assertions below describe the page that exists now.
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

/**
 * The accent as the browser resolves it, read from the live `--color-brass`
 * token. Asserting a hardcoded hex here made the test depend on which theme the
 * suite happens to run in — the light accent is deliberately deeper than the
 * dark one, so `rgb(216, 166, 68)` was only ever right in dark mode.
 */
async function accentRgb(page: Page): Promise<string> {
  return page.evaluate(() => {
    const probe = document.createElement('span')
    probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-lime').trim()
    document.body.appendChild(probe)
    const rgb = getComputedStyle(probe).color
    probe.remove()
    return rgb
  })
}

test('hero: primary CTA sits above the fold on desktop and mobile', async ({ page }) => {
  await seedConsent(page)

  for (const size of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
    { width: 360, height: 640 },
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

test('hero: one statement, in one face and one colour', async ({ page }) => {
  await seedConsent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const h1 = page.getByRole('heading', { level: 1 })
  await expect(h1).toContainText('Intelligence that')
  await expect(h1).toContainText('finishes the work.')

  // Set in the site's one face. There is no display serif: hierarchy is size
  // and weight, and a second face would fight the accent for attention.
  const family = await h1.evaluate((el) => getComputedStyle(el).fontFamily)
  expect(family.toLowerCase()).toContain('inter')

  // The headline is one colour. A single tinted word inside a headline is the
  // most common generated-page tell, so it is asserted against.
  const colours = await h1.evaluate((el) =>
    Array.from(el.querySelectorAll('*')).map((n) => getComputedStyle(n as Element).color),
  )
  const own = await h1.evaluate((el) => getComputedStyle(el).color)
  expect(new Set([own, ...colours]).size, 'headline is more than one colour').toBe(1)
})

/**
 * The hero is the page's one full-bleed screen, and the band along its bottom
 * edge is where a site of this kind usually starts inventing things: client
 * marks it does not have, an uptime figure nobody published, a completion rate
 * nobody measured. This asserts the honest version — facts that can be checked
 * against the rest of the site — and that the band arrives at them.
 */
test('hero: one screen, a band of defensible numbers, no client logos', async ({ page }) => {
  await seedConsent(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const hero = page.locator('section#hero')
  const box = await hero.boundingBox()
  console.log(`[hero] 1440x900 — height ${box?.height}`)
  expect(box!.height, 'the hero should be the first screen, not a fragment of it').toBeGreaterThanOrEqual(
    880,
  )

  // The four cells, in order: the published first-deployment window, the ten
  // stages of the deployment model, the six dimensions we measure, and the
  // number of benchmarks we have made up.
  await expect(hero.locator('dd')).toHaveText(['4–8 wks', '10', '6', '0'])
  await expect(hero.locator('dt')).toHaveText([
    'To a first production deployment',
    'Stages, discovery to product',
    'Dimensions we measure',
    'Benchmarks we invented',
  ])

  // The row above it names where we build, not who we claim to have worked for.
  await expect(hero.getByText('Applied AI systems, built in Nairobi')).toBeVisible()

  const text = await hero.innerText()
  expect(text, 'an unqualified rate is a claim we cannot support').not.toMatch(/\d+(\.\d+)?\s*%/)
  expect(text, 'no client names in the hero').not.toMatch(/Microsoft|Amazon|Google|Trusted by/i)
  // Nothing illustrative: the marks are drawn, and a logo wall is not evidence.
  await expect(hero.locator('img')).toHaveCount(0)
})

/**
 * The band is the point of a full-bleed opener: if it falls below the fold, the
 * first screen is a headline and the section may as well be a banner. It has to
 * land inside the viewport at laptop and phone widths.
 */
test('hero: the band lands on the first screen at laptop and phone widths', async ({ page }) => {
  await seedConsent(page)

  for (const size of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size)
    await page.goto('/')

    const band = await page.locator('section#hero dl').boundingBox()
    const bottom = band!.y + band!.height
    console.log(`[hero] ${size.width}x${size.height} — band bottom ${Math.round(bottom)}`)

    expect(bottom, `band below the fold at ${size.width}x${size.height}`).toBeLessThanOrEqual(
      size.height,
    )
  }
})

test('hero: asks for one thing, and has no competing capture form', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  const hero = page.locator('section#hero')
  await expect(hero.getByRole('link', { name: 'Book a discovery call' })).toBeVisible()
  await expect(hero.getByRole('link', { name: 'See what we deploy' })).toBeVisible()

  // The email capture that used to sit here duplicated the contact form and
  // navigated away with a query param. It is gone.
  await expect(hero.locator('input[type="email"]')).toHaveCount(0)
})

test('home stays minimal: five sections, the depth lives on the inner pages', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  // Sections that were removed from the landing page.
  for (const id of ['#measurement', '#principles', '#pricing', '#faq', '#governance', '#process', '#why-us']) {
    await expect(page.locator(`section${id}`), `${id} should not be on the home page`).toHaveCount(0)
  }

  for (const id of ['#hero', '#capabilities', '#deployment-patterns', '#approach']) {
    await expect(page.locator(`section${id}`).first(), `${id} missing from the home page`).toBeVisible()
  }

  await expect(page.locator('section')).toHaveCount(5)
})

test('capabilities: four rows, each one a link to its depth', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const section = await scrollToSection(page, 'section#capabilities')

  // No tab control any more — the four are all readable at once.
  await expect(section.getByRole('tablist')).toHaveCount(0)

  for (const [name, headline] of [
    ['Converse', 'Systems that communicate naturally with people.'],
    ['Understand', 'Systems that work with organizational information.'],
    ['Act', 'Systems that perform defined tasks.'],
    ['Orchestrate', 'Systems that connect intelligence to larger workflows.'],
  ] as const) {
    const row = section.getByRole('link', { name: new RegExp(`^${name}`) })
    await expect(row).toBeVisible()
    await expect(row).toContainText(headline)
    await expect(row).toHaveAttribute('href', new RegExp(`/capabilities#${name.toLowerCase()}$`))
  }
})

test('capabilities: every anchor row lands on its own block on /capabilities', async ({ page }) => {
  await seedConsent(page)

  for (const id of ['converse', 'understand', 'act', 'orchestrate']) {
    await page.goto(`/capabilities#${id}`)
    await expect(page.locator(`[id="${id}"]`)).toBeVisible()
  }
})

test('deployment patterns: four entries, each naming what it has to prove', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const section = await scrollToSection(page, 'section#deployment-patterns')

  for (const name of [
    'AI Voice Receptionist',
    'Institutional Knowledge Agent',
    'Service Request Routing',
    'Document Intake & Processing',
  ]) {
    await expect(section.getByRole('heading', { name, level: 3 })).toBeVisible()
  }

  // Each entry states the measurement dimensions, not a client metric.
  await expect(section.getByText('Measured').first()).toBeVisible()

  // The scroll-driven stack lives on /deployment-patterns, not here.
  await expect(page.locator('section#deployment-patterns .sticky')).toHaveCount(0)
})

test('commitments: three promises, and no invented statistics', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const section = await scrollToSection(page, 'section#approach')

  await expect(section.getByRole('heading', { name: 'What you can hold us to.' })).toBeVisible()
  await expect(
    section.getByRole('heading', { name: 'We agree what success means before we build.' }),
  ).toBeVisible()
  await expect(
    section.getByRole('heading', { name: 'Governance is part of the system, not a document about it.' }),
  ).toBeVisible()
  await expect(
    section.getByRole('heading', { name: 'Every deployment leaves you with something reusable.' }),
  ).toBeVisible()

  // The band it replaced claimed "94% completion rate", "10× deployment
  // velocity" and "0 silent failures". None of those were measured.
  const text = await section.innerText()
  expect(text).not.toMatch(/\d+\s*%/)
  expect(text).not.toMatch(/10×/)
  expect(text).not.toMatch(/94/)
})

test('the page ends by asking for one thing', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  // Three, all the same action under the same name: the header's, the hero's
  // and the closing band's. The header CTA used to read "Book a call", which
  // made one action two different things on the same screen.
  const ctas = page.getByRole('link', { name: 'Book a discovery call' })
  await expect(ctas).toHaveCount(3)
  await ctas.last().click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByRole('button', { name: 'Send your message' })).toBeVisible()
})

test('FAQ accordion opens and closes', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/capabilities')
  const section = await scrollToSection(page, 'section#faq')

  // Questions carry no "01/" prefix — the list is not a sequence.
  const firstButton = section.getByRole('button', { name: 'What does Naivolabs actually do?' })
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

test('footer carries real destinations only', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')
  const footer = page.locator('footer')

  // Real contact details, not placeholder handles.
  await expect(footer.getByRole('link', { name: 'hello@naivolabs.com' })).toBeVisible()
  await expect(footer.getByRole('link', { name: '+254 112 292 847' })).toBeVisible()
  await expect(footer.getByText('51 Lenana Road, Nairobi, 00100, Kenya')).toBeVisible()

  // Every external link resolves to something the company owns. The four
  // placeholder social URLs that used to be here are gone.
  const external = await footer.locator('a[href^="http"]').count()
  expect(external, 'footer links off-site').toBe(0)

  // The newsletter form had no backend and answered every address with
  // "Subscribed". It is gone.
  await expect(footer.getByRole('button', { name: /Subscribe/ })).toHaveCount(0)
})

test('hub pages carry the depth: positioning on /about, governance + model on /capabilities', async ({
  page,
}) => {
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

test('positioning: the Naivolabs column is the accent one', async ({ page }) => {
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

  // …and our column with a brass checkmark, in the live accent colour rather
  // than a hex that only matches one theme.
  await expect(naivolabs.locator('svg')).toHaveCount(5)
  expect(await naivolabs.locator('svg path').first().getAttribute('d')).toContain('M20 6L9 17l-5-5')
  await expect(naivolabs.locator('svg').first()).toHaveCSS('color', await accentRgb(page))
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

test('no pricing figures are published anywhere on the public page', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/')

  await expect(page.locator('section#pricing')).toHaveCount(0)
  await expect(page.getByText('$1,995')).toHaveCount(0)
  await expect(page.getByText('Engagement models, not packages.')).toHaveCount(0)
})
