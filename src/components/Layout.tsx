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
    <div className="min-h-screen bg-[#f0f0f0]">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
