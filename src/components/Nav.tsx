'use client'

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../utils'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'AI in Nairobi', to: '/ai-automation-nairobi' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 inset-x-0 z-50 px-4"
    >
      {/* Floating nav pill — 60px radius, Carbon fill, 1px white-alpha border */}
      <div className="mx-auto max-w-[1100px] rounded-[60px] bg-[#191919] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.45)] px-3 sm:px-5 h-14 sm:h-16 flex items-center justify-between">
        {/* Text wordmark — violet dot replaces the old orange mark */}
        <Link to="/" className="flex items-center min-h-[44px] pl-2 sm:pl-3" aria-label="Logitech Consultants home">
          <span className="font-display text-[18px] sm:text-[20px] font-medium leading-none tracking-[-0.02em] text-paper select-none">
            Logitech<span className="text-signal">.</span>
            <span className="hidden sm:inline">{" "}Consultants</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative text-sm py-[12px] px-4 rounded-full transition-colors duration-200',
                  isActive ? 'text-paper' : 'text-ash hover:text-paper'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cn(
                      'absolute left-4 right-4 -bottom-0.5 h-px origin-left bg-signal transition-transform duration-300 ease-out',
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}

          <Link
            to="/contact"
            className="ml-3 inline-flex items-center gap-2 px-5 py-3 rounded-[30px] bg-[#405bff] text-white text-sm font-medium transition-colors duration-200 hover:bg-[#3351e6]"
          >
            Get a demo
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-full text-ash hover:text-paper hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — carbon dropdown matching the pill */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden mx-auto max-w-[1100px]"
      >
        <nav
          className="mt-2 rounded-[30px] bg-[#191919] border border-white/10 px-4 py-4 flex flex-col"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between py-3.5 text-sm border-b border-white/5 transition-colors',
                  isActive ? 'text-paper' : 'text-ash hover:text-paper'
                )
              }
            >
              {link.label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-signal">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </NavLink>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[30px] bg-[#405bff] text-white text-sm font-medium"
            >
              Get a demo
            </Link>
          </div>
        </nav>
      </motion.div>
    </motion.header>
  )
}
