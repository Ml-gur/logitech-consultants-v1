import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../utils'
import Wordmark from './Wordmark'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Deployment patterns', to: '/deployment-patterns' },
  { label: 'Insights', to: '/blog' },
  { label: 'About', to: '/about' },
]

/**
 * Site header.
 *
 * A floating bar rather than a full-bleed one: the wordmark sits left, the
 * links sit in a centred pill of their own, and the one action sits right. The
 * pill is absolutely centred, so the wordmark and the CTA can be different
 * widths without dragging the links off centre.
 *
 * The surfaces use the `ink` and `carbon` tokens, so they follow the theme with
 * no `dark:` branch, and gain a solid ground and a hairline once the page moves
 * — quieter and cheaper to render than a floating blurred pill following the
 * scroll. The CTA is outlined rather than filled: there is one solid fill per
 * screen, and on the home page it belongs to the hero.
 */
export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled ? 'border-b border-hairline bg-ink/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="relative mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-h-[44px] items-center py-2 text-[21px] leading-none text-paper sm:text-[23px]"
          aria-label="Naivolabs home"
        >
          <Wordmark />
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-pill border border-hairline bg-carbon/80 p-1 backdrop-blur-md lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[44px] items-center rounded-pill px-4 text-[14px] transition-colors duration-200',
                  isActive ? 'bg-veil-strong text-paper' : 'text-fog hover:text-paper'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link to="/contact" className="btn-ghost hidden px-5 py-2.5 text-[14px] lg:inline-flex">
            Book a discovery call
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ash transition-colors duration-200 hover:bg-veil hover:text-paper lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 8h18M3 16h18" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Mobile"
            className="border-t border-hairline bg-ink lg:hidden"
          >
            <div className="mx-auto max-w-[1200px] px-5 py-4 sm:px-6">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[52px] items-center justify-between text-[17px] transition-colors duration-200',
                      i < navLinks.length - 1 ? 'border-b border-hairline' : '',
                      isActive ? 'text-lime' : 'text-ash'
                    )
                  }
                >
                  {link.label}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate" aria-hidden>
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </NavLink>
              ))}

              <Link to="/contact" className="btn-primary mt-5 w-full px-6 py-3.5 text-[15px]">
                Book a discovery call
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
