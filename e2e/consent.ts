import type { Page } from '@playwright/test'

/**
 * Cookie-consent helpers for the E2E suite.
 *
 * The consent banner is fixed to the bottom of the viewport until the visitor
 * decides, which makes it overlay the footer (and anything else near the bottom
 * of a capture). Tests that are not about the banner call `seedConsent` before
 * navigating so the banner never renders.
 *
 * `seedConsent` writes through `addInitScript`, so the decision is re-applied
 * before the app's first script runs on every navigation in the test. Note the
 * inverse is deliberately NOT provided: an init script that cleared the key
 * would also wipe a decision the test itself made, so banner tests simply rely
 * on Playwright's fresh context (empty localStorage).
 */

const STORAGE_KEY = 'naivolabs.cookie-consent.v1'

export const REJECT_ALL = { necessary: true, analytics: false, marketing: false, version: 1 }

/** Pre-seed a consent decision so the banner stays hidden. */
export async function seedConsent(
  page: Page,
  categories: { necessary: true; analytics: boolean; marketing: boolean } = REJECT_ALL,
) {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key as string, value as string),
    [STORAGE_KEY, JSON.stringify({ ...categories, decidedAt: new Date().toISOString() })] as const,
  )
}

/** The raw stored record (or null) — used to assert the decision was persisted. */
export async function readStoredConsent(page: Page) {
  return page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY)
}
