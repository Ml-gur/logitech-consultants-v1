import { Link, useLocation } from 'react-router-dom'
import Seo from '../lib/Seo'

/**
 * Custom 404.
 *
 * Design intent: the visitor is already lost, so the page does one job —
 * get them back to something useful in a single click. It names the path they
 * asked for (so a mistyped URL is obvious), offers the four real destinations,
 * and is explicitly `noindex, follow` so soft-404s never enter the index while
 * link equity still flows through to the pages below.
 */

const destinations = [
  { label: 'Home', to: '/', detail: 'Start from the beginning.' },
  { label: 'Capabilities', to: '/capabilities', detail: 'Converse, understand, act, orchestrate.' },
  { label: 'Deployment patterns', to: '/deployment-patterns', detail: 'What we actually build and measure.' },
  { label: 'Contact', to: '/contact', detail: 'Talk to a person instead.' },
]

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <section className="relative min-h-[80dvh] flex items-center pt-32 pb-24">
      <Seo
        title="Page not found (404)"
        description="That page does not exist on naivolabs.com. Jump back to the homepage, our capabilities, or the deployment patterns we build."
        path={pathname}
        noindex
      />

      <div className="relative w-full max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="max-w-[720px]">
          <p className="section-label">Error 404</p>

          <h1 className="text-[clamp(40px,7vw,84px)] leading-[1.02] tracking-[-0.025em] mb-6">
            Nothing here.
          </h1>

          <p className="text-[18px] text-fog leading-relaxed mb-4">
            The page you asked for does not exist. It may have moved, or the link may have a typo.
          </p>

          {pathname && pathname !== '/' && (
            <p className="font-mono text-[13px] text-fog mb-10 break-all">Requested: {pathname}</p>
          )}

          <div className="flex flex-wrap gap-4 mb-16">
            <Link to="/" className="btn-primary px-7 py-3.5 text-sm">
              Back to home
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-ghost px-7 py-3.5 text-sm">
              Contact us
            </Link>
          </div>
        </div>

        {/* Useful destinations */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((d) => (
            <div key={d.to} className="min-w-0">
              <Link
                to={d.to}
                className="group flex flex-col h-full rounded-panel bg-carbon border border-hairline p-6 transition-colors duration-300 hover:border-lime-soft"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-paper">{d.label}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate transition-all duration-300 group-hover:text-lime group-hover:translate-x-1"
                    aria-hidden
                  >
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </div>
                <p className="text-sm text-fog leading-relaxed">{d.detail}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
