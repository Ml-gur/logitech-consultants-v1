'use client'

import { motion, useReducedMotion } from 'framer-motion'

const logos = [
  { src: '/images/Sy5KWX2qzve6uVKx4PA8RCd4A.svg', width: 124 },
  { src: '/images/ThiPMi5yUjVdKo6t4N9wLOgcQ.svg', width: 168 },
]

export default function LogoMarquee() {
  const reduce = useReducedMotion()
  const items = [...logos, ...logos, ...logos]

  return (
    <section className="relative overflow-hidden bg-[#f0f0f0] py-14 max-md:py-10">
      <div className="max-w-[1400px] mx-auto px-10 max-md:px-4 mb-8">
        <p className="text-xs text-[#4f4f4f] uppercase tracking-[0.15em]">
          Trusted by teams shipping AI that works
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f0f0f0] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f0f0f0] to-transparent z-10" />

        <motion.div
          className="flex items-center gap-16 w-max"
          animate={reduce ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: reduce ? 0 : Infinity }}
        >
          {[...items, ...items].map((logo, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center justify-center opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt=""
                width={logo.width}
                height={logo.width / 4}
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
