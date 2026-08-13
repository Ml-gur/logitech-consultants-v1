'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const legalLinks = ['Privacy policy', 'Terms of service', '404 Page']

const socialLinks = ['X (Twitter)', 'LinkedIn', 'YouTube', 'Instagram']

export default function Footer() {
  return (
    <footer className="bg-[#191919] text-paper border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        {/* Newsletter — lives in the footer */}
        <motion.div
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-md">
            <h3 className="font-display text-[clamp(28px,3.5vw,40px)] font-medium leading-tight mb-2">
              Join 5K+ readers
            </h3>
            <p className="text-sm text-fog">
              Get 1 actionable AI tip every Saturday. All in under 4 minutes.
            </p>
          </div>

          <form
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="Enter your email"
              className="input-dark flex-1 px-5 py-3"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-[30px] bg-[#405bff] text-white text-sm font-medium transition-colors duration-200 hover:bg-[#3351e6]"
            >
              Subscribe
            </button>
          </form>
        </motion.div>

        <div className="border-t border-white/10 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand — text wordmark */}
          <div>
            <p className="font-display text-2xl font-medium tracking-[-0.02em] text-paper">
              Logitech<span className="text-signal">.</span> Consultants
            </p>
            <p className="text-sm text-fog mt-2 max-w-xs leading-relaxed">
              Strategy, automations, custom agents, and the support to keep them running.
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
                <li key={l}>
                  <a href="#" className="inline-block text-sm text-ash hover:text-paper transition-colors duration-200 py-3 -my-3 max-md:py-3.5 max-md:-my-3.5">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-fog uppercase tracking-[0.14em] mb-4">Socials</h4>
            <ul className="space-y-2">
              {socialLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="inline-block text-sm text-ash hover:text-paper transition-colors duration-200 py-3 -my-3 max-md:py-3.5 max-md:-my-3.5">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs text-fog">&copy; 2026 Logitech Consultants. All rights reserved.</p>
            <p className="text-xs text-fog">Designed by Samuel</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
