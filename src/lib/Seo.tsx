'use client'

import { useEffect } from 'react'

/**
 * Per-route SEO head manager (seo-specialist skill).
 *
 * Sets document.title, meta description, canonical, Open Graph, and JSON-LD
 * structured data on every route change. This site is a client-rendered Vite
 * SPA (no SSR), so these tags are applied at runtime — Googlebot renders JS
 * and reads the final DOM. robots.txt / sitemap.xml live in /public (static,
 * served before the SPA fallback) and are generated from the same route list.
 */

export const SITE = {
  name: 'Logitech Consultants',
  url: 'https://logitechconsultants.com',
  description:
    'AI automation agency: we find where AI creates real value, build the automations and agents to capture it, and make sure they keep working long after the engagement ends.',
  image: '/og-image.png',
  twitter: '@logitechconsult',
}

interface SeoProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: string
  /** JSON-LD objects to inject for this route. */
  jsonLd?: object[]
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

export default function Seo({ title, description, path = '/', image, type = 'website', jsonLd = [] }: SeoProps) {
  useEffect(() => {
    // Keep the title ≤ ~60 chars for SERP display: drop the brand suffix if
    // combining would exceed the limit (the brand still appears in the
    // canonical URL and homepage).
    const combined = title === SITE.name ? title : `${title} | ${SITE.name}`
    const fullTitle = combined.length <= 60 ? combined : title
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', SITE.url + path)
    setMeta('property', 'og:image', SITE.url + (image || SITE.image))
    setMeta('property', 'og:site_name', SITE.name)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', SITE.url + (image || SITE.image))
    upsertCanonical(SITE.url + path)
    if (jsonLd.length) upsertJsonLd(jsonLd)
  }, [title, description, path, image, type, jsonLd])

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
      item: SITE.url + c.path,
    })),
  }
}

/**
 * ProfessionalService entity — injected on the home page.
 *
 * Local-business structured data (deep-research priority #4): type
 * ProfessionalService is the agency-correct schema type, with address, geo,
 * opening hours, and the Nairobi/Kenya areaServed that anchors regional
 * relevance for local + AI-answer ranking.
 */
export function siteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    logo: SITE.url + '/favicon-64.png',
    email: 'hello@logitechconsultants.com',
    telephone: '+254112292847',
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '51 Lenana Road',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
      postalCode: '00100',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.2864,
      longitude: 36.7812,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    areaServed: [
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'Country', name: 'Kenya' },
    ],
    priceRange: '$$',
    sameAs: [],
  }
}
