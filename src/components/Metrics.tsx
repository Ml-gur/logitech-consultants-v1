'use client'

import { motion } from 'framer-motion'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { MEASUREMENT_DIMENSIONS } from '../lib/brand'

/**
 * "What we measure".
 *
 * This section previously displayed invented agency statistics (average ROI,
 * client retention). The brand is built on evidence over claims, so it now
 * states the dimensions every deployment is instrumented against, targets
 * agreed before launch and reported against afterwards. Real outcome figures
 * replace this framing once there are engagements to publish.
 */
export default function Metrics() {
  return (
    <section id="measurement" className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 py-24 max-md:py-16">
        <div className="max-w-[760px] mb-14">
          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal()}
            className="section-label"
          >
            Measurement
          </motion.p>

          <motion.h2
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.06)}
            className="text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.02em] mb-6"
          >
            We agree what success means before we build.
          </motion.h2>

          <motion.p
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(0.1)}
            className="text-[17px] text-fog leading-relaxed"
          >
            You will not find invented ROI figures on this page. What we can tell you is exactly which
            dimensions every deployment is instrumented against, and that the targets for them are agreed with
            you before the first user touches the system.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEASUREMENT_DIMENSIONS.map((m, i) => (
            <motion.div
              key={m.metric}
              initial={revealInitial}
              whileInView={revealWhileInView}
              viewport={revealViewport}
              transition={springReveal(i * 0.06)}
              className="card-dark rounded-[30px] p-6 max-md:p-5 flex flex-col"
            >
              {/* Highlighter segments, 1 violet + 3 hairline */}
              <div className="flex gap-1.5 mb-6">
                <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-[#405bff] to-[#7084ff]" />
                {[0, 1, 2].map((s) => (
                  <div key={s} className="h-2 flex-1 rounded-full bg-white/10" />
                ))}
              </div>

              <h3 className="text-[17px] font-medium text-paper mb-2.5">{m.metric}</h3>
              <p className="text-sm text-fog leading-relaxed">{m.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={revealInitial}
          whileInView={revealWhileInView}
          viewport={revealViewport}
          transition={springReveal(0.12)}
          className="text-sm text-fog mt-8 max-w-[620px]"
        >
          Where a deployment does not meet its agreed target, we say so and either change the approach or stop.
          Publishing only the wins would make the rest of this page worthless.
        </motion.p>
      </div>
    </section>
  )
}
