'use client'

import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import CaseStudyRow from './CaseStudyRow'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'

export default function CaseStudies() {
  const { caseStudies } = useCms()

  return (
    <section id="case-studies" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <motion.p initial={revealInitial} whileInView={revealWhileInView} viewport={revealViewport} transition={springReveal()} className="section-label">
          Case Studies
        </motion.p>

        <motion.h2
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.06)}
          className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] max-w-[680px] mb-6"
        >
          Real business results.
        </motion.h2>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.1)}
          className="text-[17px] text-fog max-w-2xl mb-16"
        >
          A look at how we&rsquo;ve helped companies cut the busywork and ship measurable results in weeks.
        </motion.p>

        {/* Stacked full-width rows — each reveals on scroll and links to its case study page */}
        <div className="space-y-5">
          {caseStudies.map((c, i) => (
            <CaseStudyRow key={c.slug} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
