'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { BlogPost, CaseStudy } from '../data/content'
import {
  cmsEnabled,
  fetchBlogPosts,
  fetchCaseStudies,
  fetchContactInfo,
  fetchFaqs,
  staticCaseStudies,
  staticContactInfo,
  staticFaqs,
  staticPosts,
  type ContactInfoData,
  type FaqItem,
} from './cms'

interface CmsState {
  blogPosts: BlogPost[]
  caseStudies: CaseStudy[]
  contactInfo: ContactInfoData
  faqs: FaqItem[]
  /** True once live CMS content has been loaded (even if some fetches fell back). */
  cmsLoaded: boolean
  /** True when VITE_CMS_URL was configured at build time. */
  cmsEnabled: boolean
}

const initial: CmsState = {
  blogPosts: staticPosts,
  caseStudies: staticCaseStudies,
  contactInfo: staticContactInfo,
  faqs: staticFaqs,
  cmsLoaded: false,
  cmsEnabled,
}

const CmsContext = createContext<CmsState>(initial)

/**
 * Loads live content from the Payload CMS and merges it over the bundled
 * static fallbacks. Re-fetches whenever the window regains focus (throttled to
 * once per 30s) so an edit published in the admin panel shows up on the site
 * without a manual reload. Without VITE_CMS_URL this is a no-op and the site
 * renders entirely from the bundled data (identical to before the CMS existed).
 */
export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>(initial)

  useEffect(() => {
    if (!cmsEnabled) return

    let cancelled = false
    let lastSync = 0

    const sync = async () => {
      const now = Date.now()
      if (now - lastSync < 30_000) return
      lastSync = now

      const [posts, caseStudies, contactInfo, faqs] = await Promise.all([
        fetchBlogPosts(),
        fetchCaseStudies(),
        fetchContactInfo(),
        fetchFaqs(),
      ])
      if (cancelled) return
      setState({
        blogPosts: posts,
        caseStudies,
        contactInfo: contactInfo ?? staticContactInfo,
        faqs: faqs ?? staticFaqs,
        cmsLoaded: true,
        cmsEnabled,
      })
    }

    void sync()

    const onFocus = () => void sync()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void sync()
    })

    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  return <CmsContext.Provider value={state}>{children}</CmsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCms() {
  return useContext(CmsContext)
}
