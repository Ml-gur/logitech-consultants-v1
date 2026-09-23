'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CAPABILITIES, SITE } from '../lib/brand'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    // Short delays keep the h1 (LCP element) painting fast
    transition: { delay: 0.15 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Hero() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Enter a work email so we can reply.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('That does not look like a valid email address.')
      return
    }
    setError('')
    navigate(`/contact?email=${encodeURIComponent(value)}`)
  }

  return (
    <section id="home" className="relative min-h-[92dvh] flex items-center overflow-hidden">
      {/* Ambient violet glow behind the hero block */}
      <div className="glow-violet-center inset-0" aria-hidden />

      <div className="relative w-full max-w-[1200px] mx-auto px-6 pt-32 pb-24 text-center">
        {/* Headline, line 1 white, line 2 Signal Violet (the signature) */}
        <h1 className="mb-8">
          <span className="sr-only">Put intelligence to work.</span>
          <span className="block font-display font-medium text-[clamp(42px,8vw,96px)] leading-[1.02] tracking-[-0.03em] text-paper">
            Put intelligence
          </span>
          <span className="block font-display font-medium text-[clamp(42px,8vw,96px)] leading-[1.02] tracking-[-0.03em] text-signal">
            to work.
          </span>
        </h1>

        {/* Subtext, the descriptive company definition */}
        <motion.p
          variants={fadeUp}
          custom={2}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          className="max-w-[620px] mx-auto text-[17px] sm:text-[18px] leading-relaxed text-ash mb-10"
        >
          Naivolabs designs, builds and deploys intelligent AI systems that help organizations serve people,
          use information and operate their workflows, governed, measured, and running in production.
        </motion.p>

        {/* Primary CTA block, deliberately above the fold on every viewport */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6"
        >
          <Link to="/contact" className="btn-primary px-8 py-4 text-sm">
            Book a discovery call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
          <Link to="/deployment-patterns" className="btn-ghost px-8 py-4 text-sm">
            See what we deploy
          </Link>
        </motion.div>

        {/* Secondary capture, email → contact, with an inline error state */}
        <motion.form
          variants={fadeUp}
          custom={4}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          onSubmit={submit}
          noValidate
          className={`w-full max-w-[600px] mx-auto rounded-[10px] bg-[#191919] border shadow-[0_0_40px_rgba(64,91,255,0.25)] p-1.5 flex items-center gap-2 ${
            error ? 'border-error' : 'border-white/10'
          }`}
        >
          <label htmlFor="hero-email" className="sr-only">
            Work email
          </label>
          <input
            id="hero-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'hero-email-error' : undefined}
            placeholder="you@organization.com"
            className="flex-1 min-w-0 bg-transparent px-5 py-3.5 text-white placeholder:text-[#58595b] focus:outline-none text-base"
          />
          <button
            type="submit"
            className="shrink-0 px-6 py-3 rounded-[30px] bg-[#405bff] text-white text-sm font-medium transition-colors duration-200 hover:bg-[#3351e6]"
          >
            Start a conversation
          </button>
        </motion.form>

        {error && (
          <p id="hero-email-error" role="alert" className="text-xs text-error mt-2.5">
            {error}
          </p>
        )}

        {/* Capability strip, the four actions, not a tool list */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
          className="mt-12"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-fog mb-4">Applied AI systems</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[13px] text-fog">
            <span className="text-fog/60" aria-hidden>//</span>
            {CAPABILITIES.map((cap, i) => (
              <span key={cap.id} className="flex items-center gap-3">
                <span className="uppercase tracking-[0.08em]">{cap.name}</span>
                {i < CAPABILITIES.length - 1 && <span className="text-smoke" aria-hidden>/</span>}
              </span>
            ))}
          </div>
          <p className="text-xs text-fog mt-6">
            {SITE.essence} Built from Africa for organizations everywhere.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
