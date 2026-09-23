import type { Page } from '@playwright/test'
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  type ConsentCategories,
} from '../src/lib/cookieConsent'

/**
 * Cookie-consent helpers for the E2E suite.
 *
 * The banner is fixed to the bottom of the viewport until the visitor decides,
 * so it overlays the footer and anything else near the bottom of a capture.
 * Tests that are not about the banner call `seedConsent` before navigating so it
 * never renders at all.
 *
 * `seedConsent` writes through `addInitScript`, so the decision is re-applied
 * before the app's first script runs on every navigation in the test. There is
 * deliberately no inverse: an init script that cleared the key would also wipe a
 * decision the test itself made, so banner tests rely on Playwright's fresh
 * context (empty localStorage) instead.
 *
 * The key, the version and the category shape are imported from the app rather
 * than duplicated here. They are not just strings: `readConsent` rejects a
 * record whose `version` does not match, so a helper that wrote a record without
 * one would silently leave the banner rendering in every test that used it.
 */

export const ACCEPT_ALL: ConsentCategories = { necessary: true, analytics: true, marketing: true }
export const REJECT_ALL: ConsentCategories = { necessary: true, analytics: false, marketing: false }

/** Pre-seed a consent decision so the banner stays hidden. */
export async function seedConsent(page: Page, categories: ConsentCategories = REJECT_ALL) {
  const record = { ...categories, necessary: true, version: CONSENT_VERSION, decidedAt: new Date().toISOString() }
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key as string, value as string),
    [CONSENT_STORAGE_KEY, JSON.stringify(record)] as const,
  )
}

/** The raw stored record (or null) — used to assert the decision was persisted. */
export async function readStoredConsent(page: Page) {
  return page.evaluate((key) => window.localStorage.getItem(key), CONSENT_STORAGE_KEY)
}
