'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CAPABILITIES, SITE } from '../lib/brand'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** Live-looking status panel that floats in the hero */
function StatusPanel() {
  const metrics = [
    { label: 'Completion rate', value: '94%', delta: '+6pp', up: true },
    { label: 'Time to answer', value: '< 3s', delta: 'all hours', up: true },
    { label: 'Hours returned', value: '1,240', delta: 'this quarter', up: true },
  ]
  const events = [
    { time: '09:41', text: 'Voice call resolved · Booking confirmed', ok: true },
    { time: '09:38', text: 'Knowledge query answered · Source cited', ok: true },
    { time: '09:35', text: 'Request routed to compliance team', ok: true },
    { time: '09:31', text: 'Escalation triggered · Agent handed off', ok: false },
  ]
  return (
    <div
      className="relative rounded-[24px] overflow-hidden"
      style={{
        background: 'rgba(18,18,26,0.85)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9898a8]">
            Live deployment
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#52525f]">Nairobi · Active</span>
      </div>

      {/* Metric row */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', divideColor: 'rgba(255,255,255,0.06)' }}
      >
        {metrics.map((m) => (
          <div key={m.label} className="px-4 py-4" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              className="font-display text-[22px] font-medium leading-none mb-1"
              style={{ color: '#f0f0f8' }}
            >
              {m.value}
            </div>
            <div className="text-[10px] text-[#6d6d7a] mb-1">{m.label}</div>
            <div
              className="font-mono text-[10px]"
              style={{ color: m.up ? '#10b981' : '#ff8b8b' }}
            >
              {m.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Event log */}
      <div className="px-5 py-4 space-y-3">
        {events.map((ev) => (
          <div key={ev.time + ev.text} className="flex items-start gap-3">
            <span className="font-mono text-[10px] text-[#52525f] mt-0.5 shrink-0 tabular-nums">
              {ev.time}
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: ev.ok ? '#10b981' : '#7c91ff' }}
            />
            <span className="text-[11px] text-[#9898a8] leading-snug">{ev.text}</span>
          </div>
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(18,18,26,0.9), transparent)' }}
      />
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) { setError('Enter a work email so we can reply.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError('That does not look like a valid email.'); return }
    setError('')
    navigate(`/contact?email=${encodeURIComponent(value)}`)
  }

  return (
    <section id="home" className="relative overflow-hidden" style={{ minHeight: '96dvh', display: 'flex', alignItems: 'center' }}>

      {/* Deep layered background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61,85,240,0.2) 0%, transparent 70%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(124,145,255,0.07) 0%, transparent 60%)'
        }} />
        {/* Right-side glow for panel */}
        <div className="absolute inset-0 hidden lg:block" style={{
          background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(61,85,240,0.12) 0%, transparent 65%)'
        }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(124,145,255,0.4) 30%, rgba(124,145,255,0.6) 50%, rgba(124,145,255,0.4) 70%, transparent 100%)'
        }} />
      </div>

      <div className="relative w-full max-w-[1200px] mx-auto px-5 sm:px-8 pt-28 pb-20 landscape:pt-20 landscape:pb-14 md:pt-36 md:pb-28">

        <div className="grid lg:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-center">

          {/* Left: copy */}
          <motion.div
            variants={reduce ? undefined : stagger}
            initial={reduce ? false : 'hidden'}
            animate={reduce ? undefined : 'visible'}
          >
            {/* Eyebrow */}
            <motion.div variants={reduce ? undefined : item} className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="h-px w-8 sm:w-12" style={{ background: 'var(--color-signal)' }} />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-fog)' }}>
                Applied AI Systems · Nairobi
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={reduce ? undefined : item} className="mb-6 sm:mb-8">
              <span
                className="block"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 'clamp(44px, 7.5vw, 96px)',
                  lineHeight: 1.0,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-paper)',
                }}
              >
                Put intelligence
              </span>
              <span
                className="block"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(44px, 7.5vw, 96px)',
                  lineHeight: 1.0,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-signal)',
                }}
              >
                to work.
              </span>
            </motion.h1>

            {/* Subtext — concise on mobile */}
            <motion.p
              variants={reduce ? undefined : item}
              className="text-[16px] sm:text-[17px] leading-relaxed mb-8 sm:mb-10 max-w-[520px]"
              style={{ color: 'var(--color-ash)' }}
            >
              Governed AI systems that complete real work inside real organizations — measured, audited, and running in production.
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={reduce ? undefined : item}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 sm:mb-10"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-[14px] font-medium rounded-full text-white transition-all duration-200"
                style={{ background: 'var(--color-voltage)', minHeight: '52px' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-voltage-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-voltage)')}
              >
                Book a discovery call
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
              <Link
                to="/deployment-patterns"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-[14px] font-medium rounded-full transition-all duration-200"
                style={{ border: '1px solid rgba(124,145,255,0.35)', color: 'var(--color-signal)', minHeight: '52px' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,145,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(124,145,255,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(124,145,255,0.35)' }}
              >
                See what we deploy
              </Link>
            </motion.div>

            {/* Email capture */}
            <motion.form
              variants={reduce ? undefined : item}
              onSubmit={submit}
              noValidate
              className="w-full max-w-[520px]"
            >
              <div
                className="flex items-center gap-2 p-1.5 rounded-full"
                style={{
                  background: 'var(--color-carbon)',
                  border: error ? '1px solid var(--color-error)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 0 40px rgba(61,85,240,0.2)',
                }}
              >
                <label htmlFor="hero-email" className="sr-only">Work email</label>
                <input
                  id="hero-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (error) setError('') }}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'hero-email-error' : undefined}
                  placeholder="you@organization.com"
                  className="flex-1 min-w-0 bg-transparent px-5 py-3 text-white placeholder:text-[var(--color-steel)] focus:outline-none text-[15px]"
                />
                <button
                  type="submit"
                  className="shrink-0 px-5 sm:px-6 py-3 rounded-full text-white text-[13px] font-medium transition-all duration-200 whitespace-nowrap"
                  style={{ background: 'var(--color-voltage)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-voltage-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-voltage)')}
                >
                  Start a conversation
                </button>
              </div>
              {error && (
                <p id="hero-email-error" role="alert" className="text-xs mt-2 pl-5" style={{ color: 'var(--color-error)' }}>
                  {error}
                </p>
              )}
            </motion.form>
          </motion.div>

          {/* Right: live deployment panel — desktop only */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, x: 0, y: 0, transition: { delay: 0.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
            className="hidden lg:block"
          >
            <StatusPanel />
          </motion.div>
        </div>

        {/* Capability strip */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1, transition: { delay: 0.9, duration: 0.6 } }}
          className="mt-16 sm:mt-20 landscape:mt-10 pt-8 sm:pt-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-slate)' }}>
              {SITE.essence}
            </span>
            <span style={{ color: 'var(--color-smoke)' }} aria-hidden>—</span>
            {CAPABILITIES.map((cap, i) => (
              <span key={cap.id} className="flex items-center gap-3">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.1em]"
                  style={{ color: 'var(--color-fog)' }}
                >
                  {cap.name}
                </span>
                {i < CAPABILITIES.length - 1 && (
                  <span style={{ color: 'var(--color-graphite)' }} aria-hidden>/</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
