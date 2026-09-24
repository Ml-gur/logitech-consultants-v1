import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Product', to: '/capabilities' },
  { label: 'Case studies', to: '/deployment-patterns' },
  { label: 'Contact', to: '/contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  useEffect(() => {
    const close = () => { if (window.innerWidth > 720) setOpen(false) }
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <header className="hero-nav">
      <Link to="/" className="hero-logo" aria-label="Naivolabs home">
        <img src="/favicon-512.png" alt="" width="52" height="52" />
      </Link>
      <nav className="hero-desktop-nav" aria-label="Primary navigation">
        <div className="hero-nav-pill">
          {links.map((link) => <NavLink key={link.label} to={link.to} end={link.to === '/'}>{link.label}</NavLink>)}
        </div>
        <Link to="/contact" className="hero-sign-in">Sign in</Link>
      </nav>
      <button className={`hero-menu-button${open ? ' is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
        <span /><span /><span />
      </button>
      {open && <div className="hero-mobile-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}
      <nav id="mobile-menu" className={`hero-mobile-menu${open ? ' is-open' : ''}`} aria-label="Mobile navigation" hidden={!open}>
        {links.map((link) => <NavLink key={link.label} to={link.to} end={link.to === '/'}>{link.label}</NavLink>)}
        <Link to="/contact" className="hero-mobile-sign-in">Sign in</Link>
      </nav>
    </header>
  )
}
                         
