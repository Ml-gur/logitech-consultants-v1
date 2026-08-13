'use client'

import { motion } from 'framer-motion'
import Marquee from './Marquee'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

const testimonials = [
  {
    quote: '\u201CLogitech Consultants killed two of our pet projects and saved us a fortune. Honest advice we couldn\u2019t get internally.\u201D',
    name: 'Lucas Bennett',
    role: 'CEO & Founder',
    avatar: '/images/74bgmTCLhG1vjdwC6jrte1Upppk.webp',
  },
  {
    quote: '\u201CEvery recommendation tied back to a real number on the P&L. Strategic, reliable, and genuinely tailored to us.\u201D',
    name: 'Benjamin Daul',
    role: 'Head of Engineering',
    avatar: '/images/u2w7SaaM0N5ieDRzqCOPmRhPOc.webp',
  },
  {
    quote: '\u201COur team now runs the playbooks on their own. That\u2019s the kind of partner that builds capability, not dependency.\u201D',
    name: 'Emma Collins',
    role: 'Head of Content',
    avatar: '/images/IMZdofzqqJ3H2GANrvn50i2D9qo.webp',
  },
  {
    quote: '\u201CThe pilot was live and measurable before we expected a proposal. Fast, focused, and refreshingly free of buzzwords.\u201D',
    name: 'Amy Louise',
    role: 'Customer Success Manager',
    avatar: '/images/h2VDy0wqXRFwGZ8MhoVaQt4qHME.webp',
  },
  {
    quote: '\u201CWe had a roadmap in weeks, not months of meetings. Finally an AI partner that thinks in outcomes.\u201D',
    name: 'Michael Torres',
    role: 'Head of Operations',
    avatar: '/images/segnJi5cGsCMhvZ3MZQnn4lCk5w.webp',
  },
  {
    quote: '\u201CThey showed us where AI actually fit our workflow, not just where it sounded impressive. Clear, practical, worth every cent.\u201D',
    name: 'Olivia Reed',
    role: 'Marketing Director',
    avatar: '/images/YA3AGELH6hUZToUz17fZAzd0yo.webp',
  },
]

function ReviewCard({ quote, name, role, avatar }: (typeof testimonials)[number]) {
  return (
    <figure className="group relative w-[320px] max-md:w-[280px] overflow-hidden rounded-[20px] bg-[#191919] border border-white/10 p-5 transition-colors duration-300 hover:border-signal/40">
      <svg
        className="w-5 h-5 text-signal/40 mb-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.545 6.068 5.982 8.789 5.982 11H10v10H0z" />
      </svg>
      <blockquote className="text-sm text-fog leading-relaxed mb-6">
        {quote}
      </blockquote>
      <div className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
          <img className="w-full h-full object-cover" width="40" height="40" alt="" src={avatar} />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-paper">
            {name}
          </figcaption>
          <p className="text-xs text-fog">
            {role}
          </p>
        </div>
      </div>
    </figure>
  )
}

export default function Testimonials() {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2))
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2))

  return (
    <section className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label"
        >
          Testimonials
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
        >
          What our clients say.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.6 }}
          className="relative flex w-full flex-col items-center justify-center overflow-hidden"
        >
          <Marquee pauseOnHover className="[--duration:35s] [--gap:16px]">
            {firstRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="mt-6 [--duration:35s] [--gap:16px]">
            {secondRow.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </Marquee>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0e0e0e] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0e0e0e] to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
