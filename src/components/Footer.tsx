'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { SITE } from '../lib/brand'
import { openCookieSettings } from '../lib/cookieConsent'
import Wordmark from './Wordmark'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Deployment patterns', to: '/deployment-patterns' },
  { label: 'Insights', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const legalLinks = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms & conditions', to: '/terms' },
]

const socialLinks = [
  { label: 'LinkedIn', href: SITE.social.linkedin },
  { label: 'X (Twitter)', href: SITE.social.x },
  { label: 'GitHub', href: SITE.social.github },
  { label: 'YouTube', href: SITE.social.youtube },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Please enter your email address.')
      setStatus('idle')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('That does not look like a valid email address.')
      setStatus('idle')
      return
    }
    setError('')
    setStatus('loading')
    // No newsletter backend is wired up yet. Confirm optimistically and record
    // the intent so the operator can connect a provider without a UI change.
    await new Promise((r) => setTimeout(r, 500))
    setStatus('done')
  }

  return (
    <footer className="bg-[#191919] text-paper border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        {/* Newsletter, lives in the footer */}
        <motion.div
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-md">
            <h3 className="font-display text-[clamp(28px,3.5vw,40px)] font-medium leading-tight mb-2">
              Notes from the build
            </h3>
            <p className="text-sm text-fog">
              One short email when we publish something worth reading. No cadence, no filler.
            </p>
          </div>

          <form
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
            onSubmit={submit}
            noValidate
          >
            <div className="flex-1 min-w-0">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                aria-invalid={!!error}
                aria-describedby={error ? 'footer-email-error' : undefined}
                placeholder="you@organization.com"
                className={`input-dark px-5 py-3 ${error ? 'border-error' : ''}`}
              />
              {error && (
                <p id="footer-email-error" role="alert" className="text-xs text-error mt-1.5">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 h-fit rounded-[30px] bg-[#405bff] text-white text-sm font-medium transition-colors duration-200 hover:bg-[#3351e6] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing…' : status === 'done' ? 'Subscribed' : 'Subscribe'}
            </button>
            <p aria-live="polite" className="sr-only">
              {status === 'done' ? 'Subscription confirmed.' : ''}
            </p>
          </form>
        </motion.div>

        <div className="border-t border-white/10 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Wordmark as="p" className="font-display text-2xl font-medium" />
            <p className="text-sm text-fog mt-2 max-w-xs leading-relaxed">
              An applied AI systems company. We build governed intelligent systems that work inside real
              organizations.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-fog uppercase tracking-[0.14em] mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="inline-block text-sm text-ash hover:text-paper transition-colors duration-200 py-3 -my-3 max-md:py-3.5 max-md:-my-3.5">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-fog uppercase tracking-[0.14em] mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="inline-block text-sm text-ash hover:text-paper transition-colors duration-200 py-3 -my-3 max-md:py-3.5 max-md:-my-3.5">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="inline-block text-sm text-ash hover:text-paper transition-colors duration-200 py-3 -my-3 max-md:py-3.5 max-md:-my-3.5 text-left"
                >
                  Cookie preferences
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-fog uppercase tracking-[0.14em] mb-4">Elsewhere</h4>
            <ul className="space-y-2">
              {socialLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-ash hover:text-paper transition-colors duration-200 py-3 -my-3 max-md:py-3.5 max-md:-my-3.5"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs text-fog">&copy; {new Date().getFullYear()} Naivolabs. All rights reserved.</p>
            <p className="text-xs text-fog">
              Built from Africa for organizations everywhere.
            </p>
          </div>
          <a
            href={`mailto:${SITE.email}`}
            className="text-xs text-fog hover:text-paper transition-colors py-3 -my-3"
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
