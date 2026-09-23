import { test, expect } from './test'
import { seedConsent } from './consent'

/**
 * Contact page: the inquiry form's happy path, every error state, the error
 * summary, the loading state, plus the contact cards and the FAQ block that
 * lives below the form.
 */

test('contact form validates every required field', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')

  await page.getByRole('button', { name: 'Send your message' }).click()

  await expect(page.getByText('Please enter your name.')).toBeVisible()
  await expect(page.getByText('Please enter your email address.')).toBeVisible()
  await expect(page.getByText('Please choose what you are interested in.')).toBeVisible()
  await expect(page.getByText('Please tell us briefly what you are trying to solve.')).toBeVisible()

  // Fields are marked invalid for assistive tech, and focus moves to the first
  // one so keyboard users land on the problem.
  await expect(page.getByLabel(/Full name/i)).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByLabel(/Full name/i)).toBeFocused()
})

test('contact form rejects an invalid email', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')

  await page.getByLabel(/Full name/i).fill('Jane Smith')
  await page.getByLabel(/Work email/i).fill('not-an-email')
  await page.getByLabel(/Where you are/i).selectOption('Pilot deployment')
  await page.getByLabel(/What are you trying to solve/i).fill('We need help routing service requests.')

  await page.getByRole('button', { name: 'Send your message' }).click()
  await expect(
    page.getByText('Enter a valid email address, for example jane@organization.org.'),
  ).toBeVisible()
})

test('contact form rejects a message that is too short', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')

  await page.getByLabel(/Full name/i).fill('Jane Smith')
  await page.getByLabel(/Work email/i).fill('jane@organization.org')
  await page.getByLabel(/Where you are/i).selectOption('Not sure yet')
  await page.getByLabel(/What are you trying to solve/i).fill('Too short')

  await page.getByRole('button', { name: 'Send your message' }).click()
  await expect(page.getByText(/20 characters or more/)).toBeVisible()
})

test('contact form error clears as soon as the visitor starts fixing it', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')

  await page.getByRole('button', { name: 'Send your message' }).click()
  await expect(page.getByText('Please enter your name.')).toBeVisible()

  await page.getByLabel(/Full name/i).fill('J')
  await expect(page.getByText('Please enter your name.')).toBeHidden()
})

test('contact form submits, shows the loading state, then a success panel', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')

  await page.getByLabel(/Full name/i).fill('Jane Smith')
  await page.getByLabel(/Work email/i).fill('jane@organization.org')
  await page.getByLabel(/Organization/i).fill('Example Chamber')
  await page.getByLabel(/Where you are/i).selectOption('Partner (ongoing)')
  await page
    .getByLabel(/What are you trying to solve/i)
    .fill('Member calls go unanswered after hours and requests are misrouted.')

  const submit = page.getByRole('button', { name: /Send your message|Sending/ })
  await submit.click()

  // The button enters a real pending state while the request is in flight.
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()

  await expect(page.getByRole('heading', { name: 'Message sent' })).toBeVisible()
  await expect(page.getByText(/Thanks Jane Smith/)).toBeVisible()

  // Starting over resets the form.
  await page.getByRole('button', { name: 'Send another message' }).click()
  await expect(page.getByRole('button', { name: 'Send your message' })).toBeVisible()
  await expect(page.getByLabel(/Full name/i)).toHaveValue('')
})

test('contact cards show the Naivolabs details, and the FAQ block renders below', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')

  // Scoped to the page body — the footer repeats the email address.
  const main = page.locator('#main')
  await expect(main.getByText('hello@naivolabs.com')).toBeVisible()
  await expect(main.getByText('+254112292847')).toBeVisible()
  await expect(main.getByText('51 Lenana Road, Nairobi, 00100, Kenya')).toBeVisible()
  await expect(main.getByText(/east africa time/i)).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Need answers?' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'What does Naivolabs actually do?' })).toBeVisible()
})

test('contact form prefills an email and interest passed in the link', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact?email=jane%40organization.org')

  await expect(page.getByLabel(/Work email/i)).toHaveValue('jane@organization.org')
  await expect(page.getByText(/We carried your email across/i)).toBeVisible()

  // The note is a hand-off explanation, not a permanent banner.
  await page.getByLabel(/Full name/i).fill('Jane')
  await expect(page.getByText(/We carried your email across/i)).toBeHidden()

  // A junk value is ignored rather than pasted into the field.
  await page.goto('/contact?email=not-an-email')
  await expect(page.getByLabel(/Work email/i)).toHaveValue('')
  await expect(page.getByText(/We carried your email across/i)).toHaveCount(0)
})

test('privacy policy is linked from the form', async ({ page }) => {
  await seedConsent(page)
  await page.goto('/contact')

  await page.getByRole('link', { name: 'privacy policy' }).first().click()
  await expect(page).toHaveURL(/\/privacy$/)
})
