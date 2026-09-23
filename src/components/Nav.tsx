'use client'

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils'
import Wordmark from './Wordmark'

const navLinks = [
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Deployments', to: '/deployment-patterns' },
  { label: 'Insights', to: '/blog' },
  { label: 'About', to: '/about' },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
      style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
    >
      <div className="px-3 sm:px-5">
        {/* Floating nav pill */}
        <div
          className="nav-pill mx-auto max-w-[1100px] rounded-full flex items-center justify-between transition-all duration-300"
          style={{
            height: '60px',
            paddingLeft: '12px',
            paddingRight: '12px',
            background: scrolled ? 'rgba(18,18,26,0.92)' : 'rgba(18,18,26,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: scrolled
              ? '1px solid rgba(255,255,255,0.12)'
              : '1px solid rgba(255,255,255,0.07)',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* Wordmark */}
          <Link
            to="/"
            className="flex items-center min-h-[44px] px-2"
            aria-label="Naivolabs home"
          >
            <Wordmark className="font-display text-[18px] sm:text-[20px] font-medium leading-none" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'relative text-[13px] font-medium py-3 px-4 rounded-full transition-colors duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-[var(--color-ash)] hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute left-4 right-4 -bottom-0.5 h-px rounded-full"
                        style={{ background: 'var(--color-signal)' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <Link
              to="/contact"
              className="ml-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white text-[13px] font-medium transition-all duration-200"
              style={{ background: 'var(--color-voltage)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-voltage-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-voltage)')}
            >
              Book a call
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center rounded-full transition-colors duration-200"
            style={{ width: '44px', height: '44px', color: 'var(--color-ash)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen
                ? <path d="M18 6L6 18M6 6l12 12" />
                : <path d="M3 8h18M3 16h18" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute inset-x-0 mt-2 px-3 sm:px-5"
          >
            <nav
              className="mx-auto max-w-[1100px] rounded-[24px] flex flex-col overflow-hidden"
              style={{
                background: 'rgba(18,18,26,0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}
              aria-label="Mobile"
            >
              {/* Nav links */}
              <div className="px-4 py-3">
                {navLinks.map((link, i) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between py-4 text-[15px] font-medium transition-colors duration-200',
                        i < navLinks.length - 1 ? 'border-b' : '',
                        isActive ? 'text-white' : 'text-[var(--color-ash)] hover:text-white'
                      )
                    }
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    {link.label}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-signal)', opacity: 0.7 }}>
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </NavLink>
                ))}
              </div>

              {/* CTA row */}
              <div className="px-4 pt-2 pb-4">
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-white text-[14px] font-medium transition-all duration-200"
                  style={{ background: 'var(--color-voltage)' }}
                >
                  Book a discovery call
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
