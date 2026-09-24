import { useEffect } from 'react'
import { SITE, absUrl } from './brand'

/**
 * Per-route SEO head manager (seo-specialist skill).
 *
 * Sets document.title, meta description, canonical, Open Graph, Twitter card
 * and JSON-LD structured data on every route change. This site is a
 * client-rendered Vite SPA (no SSR), so these tags are applied at runtime —
 * Googlebot renders JS and reads the final DOM. robots.txt / sitemap.xml live
 * in /public (static, served before the SPA fallback) and are generated from
 * the same route list, sourced from the SITE constants in ./brand.
 */

export { SITE }

interface SeoProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: string
  /** JSON-LD objects to inject for this route. */
  jsonLd?: object[]
  /** Keep the page out of search indexes (404 and other non-content routes). */
  noindex?: boolean
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertJsonLd(blocks: object[]) {
  // Remove previous route's JSON-LD scripts (marked with data-seo).
  document.head.querySelectorAll('script[data-seo="route"]').forEach((s) => s.remove())
  for (const block of blocks) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = 'route'
    script.textContent = JSON.stringify(block)
    document.head.appendChild(script)
  }
}

/**
 * SERP title budget: Google truncates around 60 characters. Combine
 * "Page | Naivolabs" when it fits; otherwise fall back to the page title
 * alone rather than shipping a truncated brand suffix.
 */
export function formatTitle(title: string): string {
  if (title === SITE.name) return title
  const combined = `${title} | ${SITE.name}`
  return combined.length <= 60 ? combined : title
}

export default function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  jsonLd = [],
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = formatTitle(title)
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', absUrl(path))
    setMeta('property', 'og:image', image ? absUrl(image) : absUrl(SITE.image))
    setMeta('property', 'og:site_name', SITE.name)
    setMeta('property', 'og:locale', SITE.locale)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image ? absUrl(image) : absUrl(SITE.image))
    upsertCanonical(absUrl(path))

    // Per-page robots directive (404 and utility routes must not be indexed).
    // Indexable routes restate the static index.html directive rather than
    // dropping the tag: removing it would also drop `max-image-preview:large`,
    // which is what lets Google show a large image alongside the result.
    if (noindex) setMeta('name', 'robots', 'noindex, follow')
    else setMeta('name', 'robots', 'index, follow, max-image-preview:large')

    if (jsonLd.length) upsertJsonLd(jsonLd)
  }, [title, description, path, image, type, jsonLd, noindex])

  return null
}

/** Build a BreadcrumbList JSON-LD block. */
export function breadcrumbLd(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  }
}

/**
 * Organization entity, the sitewide brand node, injected on the home page.
 *
 * `Organization` (rather than a single local-business type) is correct for an
 * applied AI systems company with a global audience; the Nairobi address and
 * areaServed stay attached as real, verifiable facts. `knowsAbout` states the
 * capability areas so answer engines can place the entity.
 */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absUrl('/favicon-512.png'),
    image: absUrl(SITE.image),
    slogan: SITE.essence,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: '2026',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
      postalCode: SITE.address.postalCode,
    },
    areaServed: [
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    knowsAbout: [
      'Applied AI systems',
      'Voice agents',
      'Conversational AI',
      'Knowledge retrieval systems',
      'Workflow automation',
      'AI governance and evaluation',
    ],
    // `sameAs` is omitted until a real profile exists — see SOCIAL in ./brand.
  }
}

/** Backwards-compatible alias, earlier revisions used a local-business node. */
export const siteLd = organizationLd

/** WebSite node with SearchAction, for sitelinks search box eligibility. */
export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  }
}

/** Service-level node for a capability area, used on the home page. */
export function serviceLd(name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
  }
}
