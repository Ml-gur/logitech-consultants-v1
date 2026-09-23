'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Technology strip.
 *
 * This previously read "Trusted by teams shipping AI that works" and included
 * agricultural company wordmarks, which read as client logos. Naivolabs has no
 * published references yet and does not use unverified logo walls, so the strip
 * now states what it actually is: the platforms and tools we build on.
 *
 * Logos render as quiet white silhouettes (brightness-0 invert) at ~70%
 * opacity on the dark canvas, no boxes or borders (design.md Logo Strip).
 * Brand names are exposed to assistive tech via the visually-hidden list below.
 */
const logos = [
  { src: '/images/logos/claude.svg', name: 'Claude', width: 36, height: 36 },
  { src: '/images/logos/openai.svg', name: 'OpenAI', width: 36, height: 36 },
  { src: '/images/logos/langchain.svg', name: 'LangChain', width: 36, height: 36 },
  { src: '/images/logos/n8n.svg', name: 'n8n', width: 36, height: 36 },
  { src: '/images/logos/zapier.svg', name: 'Zapier', width: 36, height: 36 },
  { src: '/images/logos/docker.svg', name: 'Docker', width: 36, height: 36 },
  { src: '/images/logos/stripe.svg', name: 'Stripe', width: 36, height: 36 },
  { src: '/images/logos/notion.svg', name: 'Notion', width: 36, height: 36 },
  { src: '/images/logos/hubspot.svg', name: 'HubSpot', width: 36, height: 36 },
]

const brandNames = logos.map((l) => l.name)

export default function LogoMarquee() {
  const reduce = useReducedMotion()
  const items = [...logos, ...logos]

  return (
    <section className="relative overflow-hidden py-14 max-md:py-10 border-y border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 mb-8">
        <p className="text-center text-xs text-fog uppercase tracking-[0.14em]">
          We build on the platforms your organization already trusts
        </p>
        {/* Visually-hidden brand names for screen readers / SEO */}
        <p className="sr-only">{brandNames.join(', ')}</p>
      </div>

      <div className="relative">
        {/* Fade edges, midnight canvas */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0e0e0e] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0e0e0e] to-transparent z-10" />

        <motion.div
          className="flex items-center gap-16 w-max"
          animate={reduce ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: reduce ? 0 : Infinity }}
        >
          {[...items, ...items].map((logo, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center justify-center opacity-70 brightness-0 invert hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={logo.src}
                alt=""
                width={logo.width}
                height={logo.height}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="object-contain select-none"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
