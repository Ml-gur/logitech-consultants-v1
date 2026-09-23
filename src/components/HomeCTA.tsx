import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SITE } from '../lib/brand'

/**
 * Closing call to action.
 *
 * One panel, one button. The gradient wash and the second competing CTA are
 * gone: a page should end by asking for the one thing it wants.
 */
export default function HomeCTA() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <motion.div
          className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16"
        >
          <div>
            <h2 className="max-w-[24ch] text-[clamp(30px,4.8vw,54px)] leading-[1.05]">
              Start with a real problem, not a demonstration.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-fog">
              A discovery call takes an hour. We will tell you what we can build, what we would measure, and
              what it would take to reach production — or that there is no case yet.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-start">
            <Link to="/contact" className="btn-primary w-full px-7 py-4 text-[15px] sm:w-auto">
              Book a discovery call
            </Link>
            <p className="text-[13px] text-fog">
              Or write to{' '}
              <a href={`mailto:${SITE.email}`} className="link-quiet">
                {SITE.email}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
