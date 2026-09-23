'use client'

/**
 * CMS API client.
 *
 * The site ships with the full static content bundled (see src/data/content.ts)
 * so it renders instantly and works with zero configuration. When
 * `VITE_CMS_URL` is set at build time (e.g. https://cms-logitech.vercel.app),
 * the site additionally fetches live content from the Payload CMS REST API and
 * swaps it in, edits published in the admin panel appear on the live site on
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
import type { BlogPost, CaseStudy, DeploymentPattern } from '../data/content'

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
// Deployment patterns (same fallback pattern as blog posts)
// ---------------------------------------------------------------------------

/**
 * CMS shape for a deployment pattern.
 *
 * The collection was historically the "case studies" collection with a
 * challenge/build/outcome/review field set. Those legacy fields are still
 * accepted here (challenge → problem, build → approach, outcome → measures)
 * so an un-migrated CMS instance keeps rendering, while the newer field names
 * are preferred when present. `review` is intentionally dropped: fabricated
 * testimonials are not rendered anywhere on the site.
 */
interface CmsDeploymentPattern {
  id: string
  name: string
  slug: string
  category: string
  tagline: string
  timeframe?: string
  status?: string
  stack?: string[]
  image?: { url?: string } | string | null
  problem?: string
  approach?: string
  integrations?: { item?: string }[] | string[]
  measures?: { metric?: string; detail?: string }[]
  governance?: { control?: string }[] | string[]
  // Legacy field names from the case-studies schema
  challenge?: string
  build?: string
  outcome?: { value: string; label: string }[]
}

/** Accept both `[{ item }]` (Payload array field) and `['x']` shapes. */
function toStringList(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return input
    .map((entry) => {
      if (typeof entry === 'string') return entry
      if (entry && typeof entry === 'object') {
        const o = entry as Record<string, unknown>
        return (o.item ?? o.control ?? o.value) as string | undefined
      }
      return undefined
    })
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
}

function mapDeploymentPattern(doc: CmsDeploymentPattern): DeploymentPattern {
  let image = resolveImage(doc.image)
  // The seed does not upload images to the CMS media library, fall back to
  // the bundled image for the same slug so known patterns keep their photos in
  // CMS mode. New ones without an image render the placeholder.
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
    timeframe: doc.timeframe ?? 'Scoped per engagement',
    stack: toStringList(doc.stack),
    problem: doc.problem ?? doc.challenge ?? '',
    approach: doc.approach ?? doc.build ?? '',
    integrations: toStringList(doc.integrations),
    measures:
      doc.measures && doc.measures.length > 0
        ? doc.measures
            .filter((m) => m?.metric)
            .map((m) => ({ metric: m.metric as string, detail: m.detail ?? '' }))
        : (doc.outcome ?? []).map((o) => ({ metric: o.label, detail: o.value })),
    governance: toStringList(doc.governance),
  }
}

export async function fetchCaseStudies(): Promise<DeploymentPattern[]> {
  if (!cmsEnabled) return staticCaseStudies
  try {
    const data = await getJson<{ docs: CmsDeploymentPattern[] }>(
      '/api/deployment-patterns?limit=100&depth=1&sort=order'
    )
    const docs = (data.docs ?? []).map(mapDeploymentPattern)
    return docs.length > 0 ? docs : staticCaseStudies
  } catch {
    // The collection may still be named `case-studies` on an older CMS
    // instance, fall back to it before giving up on live content.
    try {
      const data = await getJson<{ docs: CmsDeploymentPattern[] }>(
        '/api/case-studies?limit=100&depth=1&sort=order'
      )
      const docs = (data.docs ?? []).map(mapDeploymentPattern)
      return docs.length > 0 ? docs : staticCaseStudies
    } catch {
      return staticCaseStudies
    }
  }
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function getJson<T>(path: string): Promise<T> {
  // Abort after 8s so a hanging CMS never blocks the static fallback swap.
  // no-store: the site must always reflect freshly published content, a
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

/**
 * Where contact-form submissions are delivered.
 *
 * Two destinations, chosen at build time (Vite inlines both):
 *
 *   1. `VITE_INQUIRY_ENDPOINT` — POST the JSON body to this URL. This is the
 *      seam for an email provider: point it at a serverless function (Vercel,
 *      Cloudflare Worker) that holds the provider's secret key and sends the
 *      mail, or at a form-endpoint service that accepts a public key.
 *   2. `VITE_CMS_URL` — POST to the self-hosted CMS at /api/inquiries, which
 *      both sends nothing and stores the inquiry.
 *
 * If neither is set the submission is refused and the form shows its email
 * fallback. It never reports success for a message that went nowhere.
 *
 * A PRIVATE API KEY MUST NEVER GO HERE. Everything in this file is compiled
 * into a public JavaScript bundle; `VITE_INQUIRY_ACCESS_KEY` is only for
 * services that are designed around a public, origin-restricted key.
 */
export const INQUIRY_ENDPOINT =
  (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined)?.trim() ?? ''

/** Public access key for form-endpoint services. Never a private API key. */
const INQUIRY_ACCESS_KEY =
  (import.meta.env.VITE_INQUIRY_ACCESS_KEY as string | undefined)?.trim() ?? ''

/** POST a contact-form submission. Returns true only on a confirmed delivery. */
export async function submitInquiry(input: {
  name: string
  email: string
  budget: string
  message: string
}): Promise<boolean> {
  const toCms = !INQUIRY_ENDPOINT && cmsEnabled
  const endpoint = INQUIRY_ENDPOINT || (toCms ? `${CMS_URL}/api/inquiries` : '')
  if (!endpoint) return false

  // The CMS path keeps its exact original body; the access key is only added
  // when a third-party endpoint asked for one.
  const body = !toCms && INQUIRY_ACCESS_KEY ? { ...input, access_key: INQUIRY_ACCESS_KEY } : input

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch {
    return false
  }
}

// Static fallbacks, exported for the provider's initial state.
export { staticPosts, staticCaseStudies, staticContactInfo, staticFaqs }
