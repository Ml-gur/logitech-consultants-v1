'use client'

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../utils'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Blog', to: '/blog' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#f0f0f0]',
        scrolled ? 'border-b border-black/[0.06]' : 'border-b border-transparent'
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 h-[76px] flex items-center justify-between">
        {/* Logo — operator-provided lockup, 3x retina asset (public/images/logitech-logo.png) */}
        <Link to="/" className="flex items-center min-h-[44px]" aria-label="Logitech Consultants home">
          <img
            src="/images/logitech-logo.png"
            alt=""
            width={128}
            height={132}
            className="h-[32px] sm:h-[36px] w-auto select-none"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative text-sm py-[12px] transition-colors duration-200',
                  isActive ? 'text-[#0a0a0a]' : 'text-[#4f4f4f] hover:text-[#0a0a0a]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      'absolute left-0 -bottom-0.5 h-px w-full origin-left bg-[#ff3700] transition-transform duration-300 ease-out',
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-[12px] rounded-[50px] bg-[#151619] text-[#f0f0f0] text-sm font-medium transition-all duration-200 hover:bg-[#0a0a0a] hover:-translate-y-0.5"
          >
            Book a call
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-[#0a0a0a] hover:bg-black/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden bg-[#f0f0f0] border-t border-black/[0.06]"
      >
        <nav className="px-4 py-4 flex flex-col" aria-label="Mobile">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between py-3.5 text-sm border-b border-black/5 transition-colors',
                  isActive ? 'text-[#0a0a0a]' : 'text-[#4f4f4f] hover:text-[#0a0a0a]'
                )
              }
            >
              {link.label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </NavLink>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[50px] bg-[#151619] text-[#f0f0f0] text-sm font-medium"
            >
              Book a call
            </Link>
          </div>
        </nav>
      </motion.div>
    </motion.header>
  )
}
