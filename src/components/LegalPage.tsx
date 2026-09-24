import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import Seo, { breadcrumbLd } from '../lib/Seo'
import { SITE } from '../lib/brand'

export interface LegalSection {
  id: string
  heading: string
  body: ReactNode
}

/**
 * Shared shell for the privacy policy and terms pages.
 *
 * Both are long-form legal text, so the layout optimises for reading: a
 * single measured column, a sticky table of contents on desktop, and anchor
 * links on every section so a clause can be cited directly.
 */
export default function LegalPage({
  title,
  metaTitle,
  metaDescription,
  path,
  updated,
  summary,
  sections,
}: {
  title: string
  metaTitle: string
  metaDescription: string
  path: string
  updated: string
  summary: string
  sections: LegalSection[]
}) {
  return (
    <section className="relative pt-32">
      <Seo
        title={metaTitle}
        description={metaDescription}
        path={path}
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: title, path },
          ]),
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
        <p className="section-label">Legal</p>
        <h1 className="text-[clamp(36px,5.5vw,64px)] leading-[1.05] tracking-[-0.03em] max-w-[720px] mb-5">
          {title}
        </h1>
        <p className="text-[17px] text-fog max-w-[640px] leading-relaxed mb-3">{summary}</p>
        <p className="text-sm text-fog mb-14">Last updated: {updated}</p>

        <div className="grid lg:grid-cols-[220px_1fr] gap-12 lg:gap-16 pb-8">
          {/* Table of contents */}
          <nav aria-label="On this page" className="lg:sticky lg:top-28 h-fit order-2 lg:order-1">
            <p className="text-[13px] font-medium text-fog mb-4">On this page</p>
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block text-sm text-ash hover:text-paper transition-colors py-1.5"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Body */}
          <div className="order-1 lg:order-2 max-w-[720px] min-w-0 space-y-12">
            {sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-[22px] sm:text-[26px] font-medium mb-4">{s.heading}</h2>
                <div className="space-y-4 text-[16px] leading-relaxed text-fog [&_a]:text-lime [&_a]:underline [&_a]:underline-offset-2 [&_li]:leading-relaxed [&_strong]:text-paper [&_strong]:font-medium">
                  {s.body}
                </div>
              </div>
            ))}

            <div className="rounded-panel bg-carbon border border-hairline p-6">
              <p className="text-sm text-fog leading-relaxed">
                Questions about this document? Write to{' '}
                <a href={`mailto:${SITE.email}`} className="text-lime underline underline-offset-2">
                  {SITE.email}
                </a>{' '}
                or see the{' '}
                <Link to="/contact" className="text-lime underline underline-offset-2">
                  contact page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
