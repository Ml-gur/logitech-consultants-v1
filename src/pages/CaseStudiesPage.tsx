'use client'

import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import Seo, { breadcrumbLd } from '../lib/Seo'
import CaseStudyRow from '../components/CaseStudyRow'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function CaseStudiesPage() {
  const { caseStudies } = useCms()

  return (
    <section className="relative pt-32">
      <Seo
        title="Case Studies"
        description="Real AI automation outcomes: how we cut support tickets, sped up lead routing, and scaled content teams — with the numbers to prove it."
        path="/case-studies"
        jsonLd={[
          breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Case Studies', path: '/case-studies' }]),
        ]}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal()}
          className="section-label"
        >
          Case studies
        </motion.p>

        <motion.h1
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.08)}
          className="text-[clamp(36px,6vw,72px)] leading-[1.02] tracking-[-0.03em] max-w-[760px] mb-6"
        >
          Real problems, <span className="text-signal">real outcomes.</span>
        </motion.h1>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.14)}
          className="text-[18px] text-fog max-w-2xl mb-16"
        >
          A look at how we&rsquo;ve helped companies cut the busywork and ship measurable results in weeks.
        </motion.p>

        <div className="space-y-5">
          {caseStudies.map((c, i) => (
            <CaseStudyRow key={c.slug} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
