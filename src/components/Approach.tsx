import { motion } from 'framer-motion'

/**
 * What you can hold us to.
 *
 * This replaces two home-page sections at once:
 *
 *   · a stat band reading "94% completion rate", "10× deployment velocity",
 *     "0 silent failures". Those figures were not measured anywhere — they were
 *     typed into the source. The company's own brand rule is evidence over
 *     claims, so the honest version of that section is the dimensions we agree
 *     to measure, stated as commitments rather than as results.
 *
 *   · seven "principle" cards, each stamped 01–07. They were not a sequence,
 *     and the numbers implied an order that did not exist.
 *
 * Three commitments, no numbering, no metrics we cannot defend.
 */
const commitments = [
  {
    title: 'We agree what success means before we build.',
    body: 'The target is set with you, instrumented on day one, and reported at the end whether or not it was met. Completion rate, escalation accuracy, answer groundedness, cost per completed task.',
  },
  {
    title: 'Governance is part of the system, not a document about it.',
    body: 'Role-scoped access, confidence thresholds, approval gates before anything with a financial effect, and an audit trail on every automated decision. Configuration you can read, versioned with the agent.',
  },
  {
    title: 'Every deployment leaves you with something reusable.',
    body: 'Templates, evaluation suites and integration adapters are kept, documented and handed over. The second system should be faster to build than the first, and it should be yours either way.',
  },
]

export default function Approach() {
  return (
    <section id="approach" className="border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <motion.h2
          className="max-w-[22ch] text-[clamp(30px,4.6vw,50px)] leading-[1.06]"
        >
          What you can hold us to.
        </motion.h2>

        <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {commitments.map((c, i) => (
            <motion.div
              key={c.title}
              className="border-t border-hairline pt-6"
            >
              <h3 className="font-sans text-[clamp(21px,2.3vw,25px)] leading-snug text-paper">
                {c.title}
              </h3>
              <p className="mt-4 max-w-[44ch] text-[14px] leading-relaxed text-fog">{c.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-14 max-w-[62ch] border-l border-lime-soft pl-5 text-[15px] leading-relaxed text-ash"
        >
          No invented ROI figures and no logo wall you have to squint at. Where a deployment misses its agreed
          target, we say so and either change the approach or stop.
        </motion.p>
      </div>
    </section>
  )
}
