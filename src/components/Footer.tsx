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

const socialLinks = ['X(twitter)', 'Linkedin', 'You Tube', 'Instagram']

export default function Footer() {
  return (
    <footer className="bg-[#e5e5e5] text-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-10 max-md:px-4 pt-16 pb-10">
        {/* Newsletter — lives in the footer on the original */}
        <motion.div
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-md">
            <h3 className="font-['Halant'] text-[clamp(28px,3.5vw,40px)] font-semibold leading-tight mb-2">
              Join 5K+ Readers
            </h3>
            <p className="text-sm text-[#4f4f4f]">
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
              className="flex-1 px-5 py-3 rounded-[50px] bg-white/70 border border-black/10 text-sm text-[#0a0a0a] placeholder:text-[#4f4f4f] focus:outline-none focus:border-[#ff3700] focus:ring-2 focus:ring-[#ff3700]/25 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-[50px] bg-[#0a0a0a] text-[#f0f0f0] text-sm font-medium transition-colors duration-200 hover:bg-[#151619]"
            >
              Subscribe
            </button>
          </form>
        </motion.div>

        <div className="border-t border-black/10 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand — text wordmark (image logo removed, 2026-08-10) */}
          <div>
            <p className="font-['Halant'] text-2xl font-semibold tracking-[-0.02em] text-[#0a0a0a]">
              Logitech<span className="text-[#ff3700]">.</span> Consultants
            </p>
            <p className="text-xs text-[#4f4f4f] mt-2 max-w-xs">
              Strategy, automations, custom agents, and the support to keep them running.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#4f4f4f] uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="inline-block text-sm text-[#0a0a0a] hover:text-[#4f4f4f] transition-colors duration-200 max-md:py-3.5 max-md:-my-3.5">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#4f4f4f] uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="inline-block text-sm text-[#0a0a0a] hover:text-[#4f4f4f] transition-colors duration-200 max-md:py-3.5 max-md:-my-3.5">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[#4f4f4f] uppercase tracking-wider mb-4">Socials</h4>
            <ul className="space-y-2">
              {socialLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="inline-block text-sm text-[#0a0a0a] hover:text-[#4f4f4f] transition-colors duration-200 max-md:py-3.5 max-md:-my-3.5">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs text-[#4f4f4f]">&copy; 2026 Logitech Consultants. All rights reserved.</p>
            <p className="text-xs text-[#4f4f4f]">Designed By Samuel</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
