'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { aboutValues, team } from '../data/content'
import Seo, { breadcrumbLd } from '../lib/Seo'
import {
  DEFINITIONS,
  MISSION,
  PRINCIPLES,
  PURPOSE,
  SEGMENTS,
  SITE,
  VISION,
} from '../lib/brand'
import FAQ from '../components/FAQ'
import WhyUs from '../components/WhyUs'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-32">
      <Seo
        title="About Naivolabs"
        description="An applied AI systems company. We design, build and deploy governed AI systems that work inside real organizations. Built from Africa, for the world."
        path="/about"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: `About ${SITE.name}`,
            url: `${SITE.url}/about`,
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          },
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Hero */}
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          About us
        </motion.p>
        <motion.h1
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.08)}
          className="text-[clamp(40px,6vw,80px)] leading-[1.02] tracking-[-0.03em] max-w-[820px] mb-6"
        >
          Intelligence <span className="text-signal">at work.</span>
        </motion.h1>
        <motion.p
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[620px] leading-relaxed mb-10"
        >
          {DEFINITIONS.external}
        </motion.p>
        <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.2)} className="flex flex-wrap gap-4 items-center">
          <Link to="/contact" className="btn-primary px-7 py-3.5 text-sm">
            Book a discovery call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
          <Link to="/capabilities" className="btn-ghost px-7 py-3.5 text-sm">
            What we build
          </Link>
        </motion.div>

        {/* The brand tension, three honest contrasts */}
        <div className="grid sm:grid-cols-3 gap-4 mt-20">
          {[
            { k: 'Technical × Human', v: 'Serious technology explained through real human work.' },
            { k: 'African × Global', v: 'Clearly African in origin and capability, without being limited by geography.' },
            { k: 'Ambitious × Restrained', v: 'Large ambition, stated without exaggerated marketing.' },
          ].map((t, i) => (
            <motion.div
              key={t.k}
              initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}
              className="rounded-[24px] bg-[#191919] border border-white/10 p-6"
            >
              <p className="text-[15px] font-medium text-paper mb-2">{t.k}</p>
              <p className="text-sm text-fog leading-relaxed">{t.v}</p>
            </motion.div>
          ))}
        </div>

        {/* Purpose / mission / vision */}
        <div className="pt-24 grid lg:grid-cols-3 gap-4">
          {[
            { label: 'Purpose', body: PURPOSE },
            { label: 'Mission', body: MISSION },
            { label: 'Vision', body: VISION },
          ].map((block, i) => (
            <motion.div
              key={block.label}
              initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}
              className="rounded-[30px] bg-[#191919] border border-white/10 p-7"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-fog mb-5">{block.label}</p>
              <p className="font-display text-[19px] leading-snug text-paper">{block.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Why we exist */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Why we exist
          </motion.p>
          <motion.p
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.08)}
            className="font-display text-[clamp(24px,3.5vw,40px)] font-medium leading-snug tracking-[-0.02em] max-w-[900px]"
          >
            Organizations do not simply need more AI. They need AI connected to the work that matters, the calls
            that go unanswered, the information nobody can find, the requests that get lost between systems, the
            staff time spent repeating what a system could complete.
          </motion.p>
        </div>

        {/* Internal definition, the harder version */}
        <div className="pt-16">
          <motion.div
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()}
            className="rounded-[30px] border border-signal/30 bg-[#191919] p-8 sm:p-10 max-w-[900px]"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-fog mb-4">The internal version</p>
            <p className="font-display text-[clamp(20px,2.6vw,30px)] font-medium leading-snug text-paper">
              {DEFINITIONS.internal}
            </p>
            <p className="text-sm text-fog leading-relaxed mt-5">
              It allows us to build toward orchestration and infrastructure without asking a customer to
              understand our architecture to get value from it.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Our values
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
          >
            What we will not trade away.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
                className="card-dark rounded-[24px] p-7"
              >
                <div className="w-8 h-[3px] rounded-full bg-gradient-to-r from-[#405bff] to-[#7084ff] mb-6" />
                <h3 className="text-lg font-medium mb-3">{v.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Principles */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Brand principles
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[680px] mb-14"
          >
            Rules, not aspirations.
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.05)}
                className="flex items-start gap-4 rounded-[20px] bg-[#191919] border border-white/10 p-5"
              >
                <span className="font-mono text-xs text-signal mt-1 tabular-nums shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] text-ash leading-relaxed">{p.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Africa-to-world */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Built from Africa
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[760px] mb-8"
          >
            Origin, insight and capability, not a limitation.
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-12 max-w-[1000px]">
            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)} className="space-y-5">
              <p className="text-[17px] text-fog leading-relaxed">
                We build from Africa because it gives us an environment where technology has to work across real
                constraints: diverse languages, mobile-first communication, fragmented systems and organizational
                realities that do not match a Silicon Valley demo.
              </p>
              <p className="text-[17px] text-fog leading-relaxed">
                That experience makes us better at building resilient systems. It is why our voice work handles
                accent and language variation that off-the-shelf deployments miss, and why we design for
                infrastructure that is not always ideal.
              </p>
            </motion.div>

            <motion.div initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)} className="space-y-5">
              <p className="text-[17px] text-paper leading-relaxed">
                Our ambition is not &ldquo;AI for Africa&rdquo;. It is technology built from African realities
                that can work anywhere.
              </p>
              <p className="text-[17px] text-fog leading-relaxed">
                Organizations everywhere need better ways to serve people, use information and operate. The
                operating conditions we build under simply make us less forgiving of fragile systems.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Segments */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Who we serve
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-14"
          >
            The environments we go deep in.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEGMENTS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
                className="rounded-[24px] bg-[#191919] border border-white/10 p-6"
              >
                <h3 className="text-[17px] font-medium mb-3">{s.name}</h3>
                <p className="text-sm text-fog leading-relaxed">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="pt-24">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Our team
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-16"
          >
            Small, senior, and on the deployment.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.08)}
                className="rounded-[24px] bg-[#191919] border border-white/10 p-7"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#405bff] to-[#7084ff] text-white flex items-center justify-center text-lg font-medium mb-5">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="text-lg font-medium mb-1">{member.name}</h3>
                <p className="text-sm text-fog">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Where we sit, positioning belongs with the company story, not on the
          home page (which stays intentionally minimal). */}
      <WhyUs />

      <section className="relative">
        <div className="relative max-w-[1200px] mx-auto px-6">
          <FAQ />
        </div>
      </section>
    </>
  )
}
