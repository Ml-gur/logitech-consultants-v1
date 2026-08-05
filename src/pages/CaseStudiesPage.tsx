'use client'

import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import CaseStudyRow from '../components/CaseStudyRow'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function CaseStudiesPage() {
  const { caseStudies } = useCms()

  return (
    <section className="relative pt-[76px]">
      <div className="section-panel section-panel-dark rounded-[50px]">
        <div className="section-inner">
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal()}
            className="section-label"
          >
            005/ Case Studies
          </motion.p>

          <motion.h1
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.08)}
            className="font-['Halant'] text-[clamp(36px,5vw,64px)] font-semibold leading-tight tracking-tight text-[#0a0a0a] mb-6"
          >
            Real problems, real outcomes.
          </motion.h1>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.14)}
            className="text-base text-[#4f4f4f] max-w-2xl mb-16"
          >
            A look at how we&rsquo;ve helped companies cut the busywork and ship measurable results in weeks.
          </motion.p>

          <div className="space-y-4">
            {caseStudies.map((c, i) => (
              <CaseStudyRow key={c.slug} c={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
