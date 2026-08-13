'use client'

import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-paper">
      {/* Skip link — first tab stop (WCAG 2.4.1 bypass blocks) */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-5 focus:py-2.5 focus:rounded-[30px] focus:bg-carbon focus:text-paper focus:text-sm focus:font-medium focus:border focus:border-signal"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
