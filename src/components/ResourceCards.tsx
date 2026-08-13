'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const resources = [
  {
    title: 'Read the case studies',
    subtext: 'Real problems, real outcomes — metrics from shipped engagements.',
    to: '/case-studies',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 15l3-4 3 3 5-7" />
      </svg>
    ),
  },
  {
    title: 'Browse the blog',
    subtext: 'Guides and playbooks on automation, data, and AI strategy.',
    to: '/blog',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: 'Book a discovery call',
    subtext: 'A free 20-minute call. We map where AI creates value for you.',
    to: '/contact',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
]

export default function ResourceCards() {
  return (
    <section id="resources" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label text-center"
        >
          Resources
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.06)}
          className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] text-center max-w-[640px] mx-auto mb-16"
        >
          Everything you need to get started.
        </motion.h2>

        {/* 3-column resource grid — carbon cards, icon top-left, arrow right */}
        <div className="grid md:grid-cols-3 gap-4">
          {resources.map((r, i) => (
            <motion.div
              key={r.title}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.08)}
              className="min-w-0"
            >
              <Link
                to={r.to}
                className="group flex flex-col h-full rounded-[30px] bg-[#191919] border border-white/10 p-8 transition-colors duration-300 hover:border-signal/40 hover:shadow-[0_0_32px_rgba(112,132,255,0.19)]"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-signal">{r.icon}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate transition-all duration-300 group-hover:text-signal group-hover:translate-x-1"
                    aria-hidden
                  >
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-paper mb-2">{r.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{r.subtext}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
