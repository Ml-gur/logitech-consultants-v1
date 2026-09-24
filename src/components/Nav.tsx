import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../utils'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Deployment patterns', to: '/deployment-patterns' },
  { label: 'Insights', to: '/blog' },
  { label: 'About', to: '/about' },
]

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Site header.
 *
 * One floating bar in three parts: the brand mark as a real circular button on
 * the left, the links in a pill of their own, absolutely centred so a wider
 * mark or action cannot drag them off centre, and the page's action on the
 * right. The pill is the system's one inverted surface — a `paper` fill with
 * the paper-side tone pair for its labels (`src/index.css`), which is white on
 * the near-black canvas and black in the light inversion, with no `dark:`
 * branch anywhere in the markup.
 *
 * The links carry the reference direction's active mark: three small dots under
 * the current page, so "where am I" is answered by a mark rather than by a
 * second background. It is drawn from `[aria-current='page']`, which NavLink
 * already sets, so the mark cannot fall out of step with the route.
 *
 * On phones the whole bar collapses to the mark, the theme control and a 48px
 * burger; the menu is a paper sheet over a blurred scrim, with the same links,
 * the same action, and the same dots.
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

    // Hold the page still behind the sheet. Lenis drives the scroll in the
    // normal case, but the sheet is fixed and the page behind it should not
    // move under a thumb that misses a link.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
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
        scrolled ? 'border-b border-hairline bg-ink/85 backdrop-blur-md' : 'border-b border-transparent',
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="relative mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
        {/* The mark. A circular paper button with the brand glyph scaled inside
            it, so the circle's size is the button's size and the glyph can be
            re-scaled without touching it. The accessible name is the link's, so
            the image itself is decorative. */}
        <Link
          to="/"
          aria-label="Naivolabs home"
          className="nav-mark shrink-0"
        >
          <img
            src="/favicon.svg"
            alt=""
            width={52}
            height={52}
            className="h-[72%] w-[72%] object-contain"
          />
        </Link>

        <nav
          className="nav-pill absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link to="/contact" className="nav-action hidden lg:inline-flex">
            Book a discovery call
          </Link>
          <button
            type="button"
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-200 lg:hidden',
              mobileOpen ? 'bg-paper text-on-paper' : 'bg-carbon text-paper hover:bg-smoke',
            )}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-[18px] w-[18px]" aria-hidden>
              <span
                className={cn(
                  'absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-300',
                  mobileOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-200',
                  mobileOpen ? 'opacity-0' : 'opacity-100',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-300',
                  mobileOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.nav
              key="sheet"
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: EASE }}
              aria-label="Mobile"
              className="fixed inset-x-4 top-[84px] z-50 rounded-[28px] bg-paper px-[18px] pb-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] lg:hidden"
            >
              <ul>
                {navLinks.map((link) => (
                  <li key={link.to} className="border-b border-on-paper/10 last:border-b-0">
                    <NavLink to={link.to} className="nav-link flex min-h-[52px] w-full text-[17px]">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <Link to="/contact" className="btn-primary mt-4 w-full px-6 py-3.5 text-[15px]">
                Book a discovery call
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
