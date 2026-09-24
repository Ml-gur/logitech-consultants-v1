'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { PRINCIPLES } from '../lib/brand'

const CLOSING_INDEX = PRINCIPLES.length - 1

function PrincipleCard({ title, index }: { title: string; index: number }) {
  const closing = index === CLOSING_INDEX

  return (
    <figure
      className={`group relative flex h-full flex-col rounded-[20px] p-6 sm:p-7 transition-all duration-300 ${
        closing ? 'lg:flex-row lg:items-center lg:gap-10 lg:py-10' : ''
      }`}
      style={{
        background: 'var(--color-carbon)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.28)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(255,255,255,0.1)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      <p
        className={`font-mono text-[11px] tracking-[0.12em] ${closing ? 'lg:mb-0 mb-5' : 'mb-5'}`}
        style={{ color: 'var(--color-signal)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      <blockquote
        className={`leading-relaxed ${
          closing
            ? 'lg:flex-1 text-[18px] lg:text-[22px] lg:leading-snug'
            : 'text-[14px] sm:text-[15px]'
        }`}
        style={{
          fontFamily: closing ? 'var(--font-display)' : 'var(--font-sans)',
          fontWeight: closing ? 300 : 400,
          fontStyle: closing ? 'italic' : 'normal',
          color: 'var(--color-ash)',
        }}
      >
        {title}
      </blockquote>

      <figcaption
        className={`mt-5 pt-4 text-[10px] uppercase tracking-[0.16em] ${
          closing
            ? 'lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-8 lg:shrink-0'
            : ''
        }`}
        style={{
          borderTop: closing ? undefined : '1px solid rgba(255,255,255,0.06)',
          borderLeft: closing ? '1px solid rgba(255,255,255,0.06)' : undefined,
          color: 'var(--color-slate)',
        }}
      >
        Naivolabs principle
      </figcaption>
    </figure>
  )
}

export default function Principles() {
  return (
    <section id="principles" className="relative">
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start mb-12 sm:mb-16">
          <div>
            <motion.p
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal()}
              className="section-label"
            >
              How we work
            </motion.p>

            <motion.h2
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(0.06)}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Seven rules we do{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-signal)' }}>
                not
              </em>{' '}
              bend.
            </motion.h2>
          </div>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="text-[16px] sm:text-[17px] leading-relaxed self-end"
            style={{ color: 'var(--color-fog)' }}
          >
            When there is a reference customer to name, this is where it will go. Until then,
            here is what you can hold us to.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.title}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(Math.min(i, 5) * 0.05)}
              className={i === CLOSING_INDEX ? 'sm:col-span-2 lg:col-span-3' : ''}
            >
              <PrincipleCard title={p.title} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
