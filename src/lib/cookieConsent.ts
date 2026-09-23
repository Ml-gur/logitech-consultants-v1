'use client'

/**
 * Cookie consent store.
 *
 * Keeps the consent decision in localStorage under a versioned key so a change
 * to the cookie policy can invalidate stale decisions. The banner reads this on
 * mount; the footer's "Cookie preferences" button dispatches
 * `CONSENT_OPEN_EVENT` to re-open the banner in preference mode.
 *
 * Nothing here assumes a browser: every entry point is guarded so the module
 * can be imported during SSR/prerender without throwing.
 */

export const CONSENT_STORAGE_KEY = 'naivolabs.cookie-consent.v1'
export const CONSENT_VERSION = 1
export const CONSENT_OPEN_EVENT = 'naivolabs:cookie-settings'
/** Fired after a decision is written, so analytics can be started or stopped. */
export const CONSENT_CHANGE_EVENT = 'naivolabs:cookie-consent'

export interface ConsentCategories {
  /** Always on, the site cannot function without them. */
  necessary: true
  analytics: boolean
  marketing: boolean
}

export interface ConsentRecord extends ConsentCategories {
  version: number
  /** ISO timestamp of the decision. */
  decidedAt: string
}

export const ACCEPT_ALL: ConsentCategories = { necessary: true, analytics: true, marketing: true }
export const REJECT_ALL: ConsentCategories = { necessary: true, analytics: false, marketing: false }

/** Read the stored decision, or null when the visitor has not decided yet. */
export function readConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentRecord
    if (parsed?.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    // Corrupt or unavailable storage (private mode, disabled cookies), treat
    // as undecided rather than crashing the app.
    return null
  }
}

export function writeConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    ...categories,
    necessary: true,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record))
    } catch {
      // Storage unavailable, the decision still applies for this page view.
    }
    window.dispatchEvent(new CustomEvent<ConsentRecord>(CONSENT_CHANGE_EVENT, { detail: record }))
  }
  return record
}

export function clearConsent() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    /* no-op */
  }
}

/** Re-open the banner in preference mode (used by the footer link). */
export function openCookieSettings() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}
