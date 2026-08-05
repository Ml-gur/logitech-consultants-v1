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
    <figure className="group relative w-[320px] max-md:w-[280px] cursor-pointer overflow-hidden rounded-[16px] bg-[#e5e5e5] p-5 transition-colors duration-300">
      <div className="flex flex-row items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e5e5e5] ring-1 ring-black/5 shrink-0">
          <img className="w-full h-full object-cover" width="40" height="40" alt="" src={avatar} />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-[#0a0a0a]">
            {name}
          </figcaption>
          <p className="text-xs text-[#4f4f4f]">
            {role}
          </p>
        </div>
      </div>
      <blockquote className="text-sm text-[#4f4f4f] leading-relaxed">
        {quote}
      </blockquote>
    </figure>
  )
}

export default function Testimonials() {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2))
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2))

  return (
    <section className="relative">
      <div className="section-panel section-panel-light" style={{ borderRadius: '50px' }}>
        <div className="section-inner">
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal()}
            className="section-label"
          >
            007/ Our Clients
          </motion.p>

          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-16"
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
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#f0f0f0] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#f0f0f0] to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
