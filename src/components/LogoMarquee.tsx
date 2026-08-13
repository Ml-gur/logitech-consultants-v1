'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * "Trusted by teams" logo strip — infinite marquee. Logos render as quiet
 * white silhouettes (brightness-0 invert) at ~70% opacity on the dark canvas,
 * no boxes or borders (design.md Logo Strip).
 */
const logos = [
  { src: '/images/logos/claude.svg', width: 36, height: 36 },
  { src: '/images/logos/openai.svg', width: 36, height: 36 },
  { src: '/images/logos/langchain.svg', width: 36, height: 36 },
  { src: '/images/logos/n8n.svg', width: 36, height: 36 },
  { src: '/images/logos/zapier.svg', width: 36, height: 36 },
  { src: '/images/logos/docker.svg', width: 36, height: 36 },
  { src: '/images/logos/stripe.svg', width: 36, height: 36 },
  { src: '/images/logos/notion.svg', width: 36, height: 36 },
  { src: '/images/logos/hubspot.svg', width: 36, height: 36 },
  { src: '/images/logos/johndeere.svg', width: 36, height: 36 },
  { src: '/images/logos/bayer.svg', width: 40, height: 40 },
  { src: '/images/logos/basf.svg', width: 96, height: 34 },
  { src: '/images/logos/syngenta.svg', width: 100, height: 33 },
  { src: '/images/logos/corteva.svg', width: 148, height: 31 },
  { src: '/images/logos/cnh-industrial.svg', width: 100, height: 32 },
  { src: '/images/logos/nutrien.svg', width: 144, height: 33 },
  { src: '/images/logos/kubota.svg', width: 142, height: 32 },
]

const brandNames = [
  'Claude', 'OpenAI', 'LangChain', 'n8n', 'Zapier', 'Docker', 'Stripe', 'Notion', 'HubSpot',
  'John Deere', 'Bayer', 'BASF', 'Syngenta', 'Corteva', 'CNH Industrial', 'Nutrien', 'Kubota',
]

export default function LogoMarquee() {
  const reduce = useReducedMotion()
  const items = [...logos, ...logos, ...logos]

  return (
    <section className="relative overflow-hidden py-14 max-md:py-10 border-y border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 mb-8">
        <p className="text-center text-xs text-fog uppercase tracking-[0.14em]">
          Trusted by teams shipping AI that works
        </p>
        {/* Visually-hidden brand names for screen readers / SEO */}
        <p className="sr-only">{brandNames.join(', ')}</p>
      </div>

      <div className="relative">
        {/* Fade edges — midnight canvas */}
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
