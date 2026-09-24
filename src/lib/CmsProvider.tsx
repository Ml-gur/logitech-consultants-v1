import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { BlogPost, DeploymentPattern } from '../data/content'
import {
  cmsEnabled,
  fetchBlogPosts,
  fetchDeploymentPatterns,
  fetchContactInfo,
  fetchFaqs,
  staticDeploymentPatterns,
  staticContactInfo,
  staticFaqs,
  staticPosts,
  type ContactInfoData,
  type FaqItem,
} from './cms'

interface CmsState {
  blogPosts: BlogPost[]
  deploymentPatterns: DeploymentPattern[]
  contactInfo: ContactInfoData
  faqs: FaqItem[]
  /** True once live CMS content has been loaded (even if some fetches fell back). */
  cmsLoaded: boolean
  /** True when VITE_CMS_URL was configured at build time. */
  cmsEnabled: boolean
}

const initial: CmsState = {
  blogPosts: staticPosts,
  deploymentPatterns: staticDeploymentPatterns,
  contactInfo: staticContactInfo,
  faqs: staticFaqs,
  cmsLoaded: false,
  cmsEnabled,
}

const CmsContext = createContext<CmsState>(initial)

/** How long a sync result is considered fresh before another focus re-fetches. */
const SYNC_INTERVAL_MS = 30_000

/**
 * Loads live content from the Payload CMS and merges it over the bundled
 * fallbacks. Re-syncs when the tab regains focus (throttled, so switching back
 * and forth does not hammer the API), so an edit published in the admin panel
 * appears without a manual reload.
 *
 * Without VITE_CMS_URL this is a no-op and every consumer renders the bundled
 * data — the suite tests that path, so the static build is the covered one.
 */
export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>(initial)

  useEffect(() => {
    if (!cmsEnabled) return

    let cancelled = false
    let lastSync = 0

    const sync = async () => {
      const now = Date.now()
      if (now - lastSync < SYNC_INTERVAL_MS) return
      lastSync = now

      const [blogPosts, deploymentPatterns, contactInfo, faqs] = await Promise.all([
        fetchBlogPosts(),
        fetchDeploymentPatterns(),
        fetchContactInfo(),
        fetchFaqs(),
      ])
      if (cancelled) return
      setState({
        blogPosts,
        deploymentPatterns,
        contactInfo: contactInfo ?? staticContactInfo,
        faqs: faqs ?? staticFaqs,
        cmsLoaded: true,
        cmsEnabled,
      })
    }

    void sync()

    const onFocus = () => void sync()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void sync()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCms() {
  return useContext(CmsContext)
}
