'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    // Short delays keep the h1 (LCP element) painting fast
    transition: { delay: 0.15 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const stackChips = ['n8n', 'Claude', 'OpenAI', 'Zapier', 'Notion', 'HubSpot']

export default function Hero() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // Email capture → contact page (prefill can be wired later)
    navigate(`/contact${email ? `?email=${encodeURIComponent(email)}` : ''}`)
  }

  return (
    <section id="home" className="relative min-h-[92dvh] flex items-center overflow-hidden">
      {/* Ambient violet glow behind the hero block */}
      <div className="glow-violet-center inset-0" aria-hidden />

      <div className="relative w-full max-w-[1200px] mx-auto px-6 pt-32 pb-24 text-center">
        {/* Availability badge — pill tag with Signal Violet border */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          className="flex justify-center mb-10"
        >
          <span className="tag-pill px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(112,132,255,0.9)]" aria-hidden />
            2 slots available this month
          </span>
        </motion.div>

        {/* Headline — line 1 white, line 2 Signal Violet (the signature) */}
        <h1 className="mb-8">
          <span className="sr-only">Move at AI speed. Stay in control.</span>
          <span className="block font-display font-medium text-[clamp(44px,8vw,96px)] leading-[1.02] tracking-[-0.03em] text-paper">
            Move at AI speed.
          </span>
          <span className="block font-display font-medium text-[clamp(44px,8vw,96px)] leading-[1.02] tracking-[-0.03em] text-signal">
            Stay in control.
          </span>
        </h1>

        {/* Subtext — 18px, Ash, centered, max-w 560 */}
        <motion.p
          variants={fadeUp}
          custom={2}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          className="max-w-[560px] mx-auto text-[18px] leading-relaxed text-ash mb-12"
        >
          Strategy, automations, custom agents, and the support to keep them running, all from one team.
        </motion.p>

        {/* Hero form input — Carbon composite with Voltage Blue button + glow halo */}
        <motion.form
          variants={fadeUp}
          custom={3}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          onSubmit={submit}
          className="w-full max-w-[600px] mx-auto rounded-[10px] bg-[#191919] border border-white/10 shadow-[0_0_40px_rgba(64,91,255,0.25)] p-1.5 flex items-center gap-2"
        >
          <label htmlFor="hero-email" className="sr-only">
            Work email
          </label>
          <input
            id="hero-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 min-w-0 bg-transparent px-5 py-3.5 text-white placeholder:text-[#58595b] focus:outline-none text-base"
          />
          <button
            type="submit"
            className="shrink-0 px-6 py-3 rounded-[30px] bg-[#405bff] text-white text-sm font-medium transition-colors duration-200 hover:bg-[#3351e6]"
          >
            Get started
          </button>
        </motion.form>

        {/* Secondary ghost CTA + mono stack chips */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          className="mt-6 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/case-studies"
            className="btn-ghost px-6 py-3 text-sm"
          >
            See our work
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={5}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[13px] text-fog"
        >
          <span className="text-fog/60" aria-hidden>//</span>
          {stackChips.map((chip, i) => (
            <span key={chip} className="flex items-center gap-3">
              {chip}
              {i < stackChips.length - 1 && <span className="text-smoke" aria-hidden>/</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
