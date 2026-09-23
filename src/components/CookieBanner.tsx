import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ACCEPT_ALL,
  CONSENT_OPEN_EVENT,
  REJECT_ALL,
  readConsent,
  writeConsent,
  type ConsentCategories,
} from '../lib/cookieConsent'

/**
 * Cookie consent banner.
 *
 * Shown until the visitor makes a decision. "Accept all" and "Reject
 * non-essential" are offered at the same prominence (no dark patterns), and
 * preferences can be revisited at any time from the footer. Focus is moved to
 * the banner when it opens so keyboard and screen-reader users notice it.
 */
export default function CookieBanner() {
  const [decided, setDecided] = useState(true) // assume decided until localStorage is read, avoiding a flash
  const [showDetails, setShowDetails] = useState(false)
  const [prefs, setPrefs] = useState<ConsentCategories>(REJECT_ALL)
  const regionRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Read the stored decision on mount (client only).
  useEffect(() => {
    const stored = readConsent()
    if (stored) {
      setPrefs({ necessary: true, analytics: stored.analytics, marketing: stored.marketing })
      setDecided(true)
    } else {
      setDecided(false)
    }
  }, [])

  // The footer's "Cookie preferences" button re-opens the banner.
  useEffect(() => {
    const open = () => {
      // Always start from "decided" so re-opening shows the live preference
      // state rather than overwriting it with defaults.
      const stored = readConsent()
      if (stored) setPrefs({ necessary: true, analytics: stored.analytics, marketing: stored.marketing })
      setDecided(false)
      setShowDetails(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, open)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open)
  }, [])

  // Move focus into the banner when it appears.
  useEffect(() => {
    if (!decided) regionRef.current?.focus()
  }, [decided])

  const decide = useCallback((categories: ConsentCategories) => {
    writeConsent(categories)
    setDecided(true)
    setShowDetails(false)
  }, [])

  return (
    <AnimatePresence>
      {!decided && (
        <motion.div
          initial={reduce ? { opacity: 1 } : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4"
        >
          <div
            ref={regionRef}
            role="region"
            aria-label="Cookie consent"
            tabIndex={-1}
            className="mx-auto max-w-[1100px] rounded-panel bg-carbon border border-hairline shadow-lift p-5 sm:p-6 outline-none"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-medium text-paper mb-2">Cookies on this site</h2>
                <p className="text-sm text-fog leading-relaxed">
                  We use strictly necessary cookies to run the site. With your permission we would also like to
                  use analytics cookies to understand which pages are useful. We do not sell data. Read the{' '}
                  <Link to="/privacy" className="text-lime underline underline-offset-2 hover:text-paper">
                    privacy policy
                  </Link>
                  .
                </p>

                <AnimatePresence initial={false}>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <fieldset className="mt-4 space-y-3">
                        <legend className="sr-only">Cookie categories</legend>

                        <label className="flex items-start gap-3 text-sm text-ash">
                          <input
                            type="checkbox"
                            checked
                            disabled
                            className="mt-1 w-4 h-4 accent-lime"
                            aria-describedby="cookie-necessary-help"
                          />
                          <span>
                            <span className="text-paper font-medium">Strictly necessary</span>
                            <span id="cookie-necessary-help" className="block text-fog">
                              Required for the site to load and stay secure. Always on.
                            </span>
                          </span>
                        </label>

                        <label className="flex items-start gap-3 text-sm text-ash cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prefs.analytics}
                            onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                            className="mt-1 w-4 h-4 accent-lime"
                          />
                          <span>
                            <span className="text-paper font-medium">Analytics</span>
                            <span className="block text-fog">
                              Aggregated, anonymised page measurements. Helps us fix what is not working.
                            </span>
                          </span>
                        </label>

                        <label className="flex items-start gap-3 text-sm text-ash cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prefs.marketing}
                            onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                            className="mt-1 w-4 h-4 accent-lime"
                          />
                          <span>
                            <span className="text-paper font-medium">Marketing</span>
                            <span className="block text-fog">
                              Used to measure campaigns. Currently unused on this site.
                            </span>
                          </span>
                        </label>
                      </fieldset>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 lg:w-[200px]">
                <button
                  type="button"
                  onClick={() => decide(ACCEPT_ALL)}
                  className="btn-primary px-6 py-3 text-sm w-full"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => decide(REJECT_ALL)}
                  className="btn-ghost px-6 py-3 text-sm w-full"
                >
                  Reject non-essential
                </button>
                {showDetails ? (
                  <button
                    type="button"
                    onClick={() => decide(prefs)}
                    className="btn-ghost px-6 py-3 text-sm w-full"
                  >
                    Save preferences
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="text-sm text-ash hover:text-paper transition-colors py-3 px-2"
                  >
                    Manage preferences
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
