import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CAPABILITIES } from '../lib/brand'

/**
 * What we build.
 *
 * This replaces a tabbed component that carried a 40-word paragraph, a
 * thirteen-tag pill cloud, a four-item checklist and a fabricated white "app"
 * screenshot for each of the four capabilities — roughly 1,600 words to say
 * four things.
 *
 * Here it is four rows: the name, one sentence, and the whole row is the link
 * to the depth on /capabilities. Nothing is hidden behind a tab, nothing is
 * invented, and the section is about 90 words.
 */
export default function Capabilities() {
  return (
    <section id="capabilities" className="border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <motion.h2
          className="max-w-[20ch] text-[clamp(30px,4.6vw,50px)] leading-[1.06]"
        >
          Four things a working system has to do.
        </motion.h2>

        <motion.p
          className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-fog"
        >
          Most AI projects stop at the first one. We build all four into the same system, in the order that
          gets work finished.
        </motion.p>

        <div className="mt-14 flex flex-col">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.id}
            >
              <Link
                to={`/capabilities#${cap.id}`}
                className="group grid gap-2 border-t border-hairline py-7 transition-colors duration-200 hover:border-lime-soft sm:py-8 md:grid-cols-[240px_1fr] md:items-baseline md:gap-10"
              >
                <span className="font-sans text-[clamp(26px,3.4vw,36px)] leading-none text-paper transition-colors duration-200 group-hover:text-lime">
                  {cap.name}
                </span>
                <span className="max-w-[62ch] text-[15px] leading-relaxed text-fog sm:text-[16px]">
                  {cap.headline}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10"
        >
          <Link to="/capabilities" className="link-quiet text-[15px]">
            How the four fit together
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
