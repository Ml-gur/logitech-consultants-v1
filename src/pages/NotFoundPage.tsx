'use client'

import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
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
  const reduce = useReducedMotion()

  return (
    <section className="relative min-h-[80dvh] flex items-center pt-32 pb-24">
      <Seo
        title="Page not found (404)"
        description="That page does not exist on naivolabs.com. Jump back to the homepage, our capabilities, or the deployment patterns we build."
        path={pathname}
        noindex
      />

      {/* Ambient glow, consistent with the hero */}
      <div className="glow-violet-center inset-0" aria-hidden />

      <div className="relative shell">
        <div className="max-w-[720px]">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="section-label"
          >
            Error 404
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-heading-band-lg leading-[1.02] tracking-[-0.03em] mb-6"
          >
            Nothing here.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[18px] text-fog leading-relaxed mb-4"
          >
            The page you asked for does not exist. It may have moved, or the link may have a typo.
          </motion.p>

          {pathname && pathname !== '/' && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="font-mono text-[13px] text-fog mb-10 break-all"
            >
              Requested: {pathname}
            </motion.p>
          )}

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link to="/" className="btn-primary px-7 py-3.5 text-sm">
              Back to home
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-ghost px-7 py-3.5 text-sm">
              Contact us
            </Link>
          </motion.div>
        </div>

        {/* Useful destinations */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((d, i) => (
            <motion.div
              key={d.to}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 + i * 0.06 }}
              className="min-w-0"
            >
              <Link
                to={d.to}
                className="group flex flex-col h-full rounded-[24px] bg-raised border border-white/10 p-6 transition-colors duration-300 hover:border-signal/40"
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
                    className="text-slate transition-all duration-300 group-hover:text-signal group-hover:translate-x-1"
                    aria-hidden
                  >
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </div>
                <p className="text-sm text-fog leading-relaxed">{d.detail}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
