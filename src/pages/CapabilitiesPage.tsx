'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo, { breadcrumbLd, serviceLd } from '../lib/Seo'
import { CAPABILITIES, DIFFERENTIATORS, SEGMENTS } from '../lib/brand'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import FAQ from '../components/FAQ'
import Governance from '../components/Governance'
import Process from '../components/Process'

export default function CapabilitiesPage() {
  return (
    <>
      <section className="relative pt-32">
      <Seo
        title="Capabilities: Applied AI Systems"
        description="Four capabilities, one working system: converse, understand, act and orchestrate. What each means in practice and the controls that come with it."
        path="/capabilities"
        jsonLd={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Capabilities', path: '/capabilities' },
          ]),
          ...CAPABILITIES.map((c) => serviceLd(c.name, c.description)),
        ]}
      />
      <div className="relative shell">
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          Capabilities
        </motion.p>

        <motion.h1
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.08)}
          className="text-heading-band-lg leading-[1.02] tracking-[-0.03em] max-w-[820px] mb-6"
        >
          Four actions. One <span className="text-signal">working system.</span>
        </motion.h1>

        <motion.p
          initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-[640px] mb-20"
        >
          Naivolabs is not about chatbots, or voice, or agents, or automation as separate products. Those are
          capabilities. What we build is intelligence connected to the work that matters, and the layers below
          describe how that fits together.
        </motion.p>

        {/* The four capabilities, in depth */}
        <div className="space-y-6">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.id}
              id={cap.id}
              initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
              className="rounded-[30px] bg-raised border border-white/10 p-7 sm:p-10 scroll-mt-28"
            >
              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-mono text-sm text-signal tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-heading-feature font-medium leading-tight tracking-[-0.02em]">
                      {cap.name}
                    </h2>
                  </div>
                  <p className="text-[17px] text-paper leading-relaxed mb-5">{cap.headline}</p>
                  <p className="text-[16px] text-fog leading-relaxed mb-8">{cap.description}</p>

                  <p className="text-[11px] uppercase tracking-[0.14em] text-fog mb-3">Systems</p>
                  <div className="flex flex-wrap gap-2">
                    {cap.systems.map((s) => (
                      <span key={s} className="rounded-[30px] border border-white/12 text-fog text-[12px] px-3 py-1.5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-fog mb-5">What good looks like</p>
                  <ul className="space-y-4">
                    {cap.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 shrink-0 text-signal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span className="text-[16px] leading-relaxed text-ash">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The layer diagram */}
        <div className="pt-[var(--band-y)]">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            How the layers stack
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-heading-band max-w-[720px] mb-14"
          >
            Orchestration sits above action, which sits above understanding.
          </motion.h2>

          <motion.div
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)}
            className="rounded-[30px] bg-raised border border-white/10 p-7 sm:p-12"
          >
            <div className="mx-auto max-w-[560px] space-y-3">
              {[...CAPABILITIES].reverse().map((cap, i) => (
                <div
                  key={cap.id}
                  className="rounded-[16px] border px-5 py-4 flex items-center justify-between gap-4"
                  style={{
                    borderColor: `rgba(112,132,255,${0.4 - i * 0.09})`,
                    background: `rgba(112,132,255,${0.09 - i * 0.02})`,
                    marginLeft: `${i * 18}px`,
                    marginRight: `${i * 18}px`,
                  }}
                >
                  <span className="text-[15px] font-medium text-paper uppercase tracking-[0.1em]">{cap.name}</span>
                  <span className="font-mono text-[11px] text-fog">{cap.systems.length} systems</span>
                </div>
              ))}
              <div className="rounded-[16px] bg-white px-5 py-4 text-center">
                <span className="text-[15px] font-medium text-[#111111] uppercase tracking-[0.1em]">
                  Real organizations
                </span>
              </div>
            </div>
            <p className="text-sm text-fog text-center mt-8 max-w-[560px] mx-auto">
              People, information, software and workflows. The system connects them. That connection is the
              product, not any single layer.
            </p>
          </motion.div>
        </div>

        {/* Differentiators */}
        <div className="pt-[var(--band-y)]">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            What makes it different
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-heading-band max-w-[680px] mb-14"
          >
            Differentiation is a combination, not a feature.
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIFFERENTIATORS.map((d, i) => (
              <motion.div
                key={d.title}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
                className="card-dark rounded-[24px] p-7"
              >
                <div className="w-8 h-[3px] rounded-full bg-gradient-to-r from-[#405bff] to-[#7084ff] mb-6" />
                <h3 className="text-lg font-medium mb-3">{d.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{d.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Who we build for */}
        <div className="pt-[var(--band-y)]">
          <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
            Who we build for
          </motion.p>
          <motion.h2
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.06)}
            className="text-heading-band max-w-[720px] mb-6"
          >
            Depth in a few environments beats breadth in none.
          </motion.h2>
          <motion.p
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.1)}
            className="text-[17px] text-fog max-w-[620px] mb-14"
          >
            We will eventually serve many industries. Early on we go deep in a small number of organizational
            environments where the interaction volume is high, the information is fragmented and the buyer is
            identifiable.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEGMENTS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(i * 0.06)}
                className="rounded-[24px] bg-raised border border-white/10 p-7"
              >
                <h3 className="text-lg font-medium mb-3">{s.name}</h3>
                <p className="text-sm text-fog leading-relaxed">{s.detail}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal(0.12)}
            className="mt-12 flex flex-wrap gap-4"
          >
            <Link to="/deployment-patterns" className="btn-primary px-7 py-3.5 text-sm">
              See the deployment patterns
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-ghost px-7 py-3.5 text-sm">
              Book a discovery call
            </Link>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Governance and the ten-stage deployment model live here rather than on
          the home page: the home page stays minimal, and anyone reading this
          far is exactly the reader who wants the controls and the process. */}
      <Governance />
      <Process />

      <FAQ />
    </>
  )
}
