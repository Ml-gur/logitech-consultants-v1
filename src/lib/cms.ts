'use client'

/**
 * CMS API client.
 *
 * The site ships with the full static content bundled (see src/data/content.ts)
 * so it renders instantly and works with zero configuration. When
 * `VITE_CMS_URL` is set at build time (e.g. https://cms-logitech.vercel.app),
 * the site additionally fetches live content from the Payload CMS REST API and
 * swaps it in — edits published in the admin panel appear on the live site on
 * the next load, with no redeploy required.
 *
 * Every fetch is wrapped in a try/catch that falls back to the bundled static
 * data, so a CMS outage never breaks the site.
 */

import {
  blogPosts as staticPosts,
  caseStudies as staticCaseStudies,
  contactInfo as staticContactInfo,
  faqs as staticFaqs,
} from '../data/content'
import type { BlogPost, CaseStudy } from '../data/content'

export const CMS_URL = (import.meta.env.VITE_CMS_URL as string | undefined)?.replace(/\/+$/, '') ?? ''
export const cmsEnabled = CMS_URL.length > 0

export interface FaqItem {
  q: string
  a: string
}

export interface ContactInfoData {
  email: string
  phone: string
  address: string
}

// ---------------------------------------------------------------------------
// CMS → site shape mapping
// ---------------------------------------------------------------------------

interface CmsBlogPost {
  id: string
  title: string
  slug: string
  category: string
  date: string
  author: string
  role: string
  excerpt: string
  paragraphs: { text: string }[]
  image?: { url?: string } | string | null
}

function resolveImage(image: CmsBlogPost['image']): string {
  if (!image) return ''
  const url = typeof image === 'string' ? image : (image.url ?? '')
  if (!url) return ''
  // Media is served by the CMS (local dev: /api/media/file/…; Vercel Blob: absolute).
  if (url.startsWith('http')) return url
  return `${CMS_URL}${url}`
}

function mapPost(doc: CmsBlogPost): BlogPost {
  let image = resolveImage(doc.image)
  // The seed does not upload images to the CMS media library, so posts carry no
  // CMS image. Fall back to the bundled image for the same slug so known posts
  // render their photos even in CMS mode. New posts without any image render
  // the gradient placeholder (components handle the empty string).
  if (!image) {
    const staticPost = staticPosts.find((p) => p.slug === doc.slug)
    image = staticPost?.image ?? ''
  }
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    date: doc.date,
    image,
    author: doc.author,
    role: doc.role,
    excerpt: doc.excerpt,
    paragraphs: (doc.paragraphs ?? []).map((p) => p.text),
  }
}

// ---------------------------------------------------------------------------
// Case studies (same fallback pattern as blog posts)
// ---------------------------------------------------------------------------

interface CmsCaseStudy {
  id: string
  name: string
  slug: string
  category: string
  tagline: string
  year: string
  timeframe: string
  challenge: string
  build: string
  image?: { url?: string } | string | null
  outcome: { value: string; label: string }[]
  review: { quote: string; name: string; role: string }
  metric: { value: string; label: string }
}

function mapCaseStudy(doc: CmsCaseStudy): CaseStudy {
  let image = resolveImage(doc.image)
  // The seed does not upload images to the CMS media library — fall back to
  // the bundled image for the same slug so known case studies keep their
  // photos in CMS mode. New ones without an image render the placeholder.
  if (!image) {
    const staticCS = staticCaseStudies.find((c) => c.slug === doc.slug)
    image = staticCS?.image ?? ''
  }
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    image,
    tagline: doc.tagline,
    year: doc.year,
    timeframe: doc.timeframe,
    challenge: doc.challenge,
    build: doc.build,
    outcome: doc.outcome ?? [],
    review: doc.review ?? { quote: '', name: '', role: '' },
    metric: doc.metric ?? { value: '', label: '' },
  }
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  if (!cmsEnabled) return staticCaseStudies
  try {
    const data = await getJson<{ docs: CmsCaseStudy[] }>('/api/case-studies?limit=100&depth=1&sort=order')
    const docs = (data.docs ?? []).map(mapCaseStudy)
    return docs.length > 0 ? docs : staticCaseStudies
  } catch {
    return staticCaseStudies
  }
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function getJson<T>(path: string): Promise<T> {
  // Abort after 8s so a hanging CMS never blocks the static fallback swap.
  // no-store: the site must always reflect freshly published content — a
  // cached CMS response would silently serve stale data.
  const res = await fetch(`${CMS_URL}${path}`, {
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  if (!cmsEnabled) return staticPosts
  try {
    const data = await getJson<{ docs: CmsBlogPost[] }>('/api/blog-posts?limit=100&depth=1&sort=order')
    const posts = (data.docs ?? []).map(mapPost)
    return posts.length > 0 ? posts : staticPosts
  } catch {
    return staticPosts
  }
}

export async function fetchContactInfo(): Promise<ContactInfoData | null> {
  if (!cmsEnabled) return null
  try {
    const data = await getJson<ContactInfoData>('/api/globals/contact-info')
    return data && data.email ? data : null
  } catch {
    return null
  }
}

export async function fetchFaqs(): Promise<FaqItem[] | null> {
  if (!cmsEnabled) return null
  try {
    const data = await getJson<{ items: { q: string; a: string }[] }>('/api/globals/faqs')
    const items = (data.items ?? []).filter((f) => f.q && f.a)
    return items.length > 0 ? items : null
  } catch {
    return null
  }
}

/** POST a contact-form submission to the CMS. Returns true on success. */
export async function submitInquiry(input: {
  name: string
  email: string
  budget: string
  message: string
}): Promise<boolean> {
  if (!cmsEnabled) return false
  try {
    const res = await fetch(`${CMS_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch {
    return false
  }
}

// Static fallbacks, exported for the provider's initial state.
export { staticPosts, staticCaseStudies, staticContactInfo, staticFaqs }
