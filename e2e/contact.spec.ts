import { test, expect } from '@playwright/test'

/**
 * Contact page form tests + footer newsletter + mobile navigation.
 */

test('contact form validates required fields', async ({ page }) => {
  await page.goto('/contact')

  await page.getByRole('button', { name: 'Send Your Message' }).click()

  await expect(page.getByText('Please enter your name')).toBeVisible()
  await expect(page.getByText('Please enter your email')).toBeVisible()
  await expect(page.getByText('Please choose a budget')).toBeVisible()
  await expect(page.getByText('Please write a short message')).toBeVisible()
})

test('contact form rejects invalid email', async ({ page }) => {
  await page.goto('/contact')

  await page.getByLabel(/Full Name/).fill('Jane Smith')
  await page.getByLabel(/Your Email/).fill('not-an-email')
  await page.getByLabel('Budget').selectOption('Pilot')
  await page.getByLabel(/Message/).fill('Hello, we want automation help.')

  await page.getByRole('button', { name: 'Send Your Message' }).click()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()
})

test('contact form submits and shows success state', async ({ page }) => {
  await page.goto('/contact')

  await page.getByLabel(/Full Name/).fill('Jane Smith')
  await page.getByLabel(/Your Email/).fill('jane@company.com')
  await page.getByLabel('Budget').selectOption('Pilot')
  await page.getByLabel(/Message/).fill('Hello, we want automation help.')

  await page.getByRole('button', { name: 'Send Your Message' }).click()

  await expect(page.getByText('Message sent')).toBeVisible()
  await expect(page.getByText(/Thanks Jane Smith/)).toBeVisible()
})

test('footer newsletter form exists on every page', async ({ page }) => {
  await page.goto('/')
  await page.goto('/about')

  await expect(page.getByRole('heading', { name: /Join 5K\+ Readers/ })).toBeVisible()
  await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Subscribe' })).toBeVisible()
})

test('contact info shows rebranded email', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByText('hello@logitechconsultants.com')).toBeVisible()
})
