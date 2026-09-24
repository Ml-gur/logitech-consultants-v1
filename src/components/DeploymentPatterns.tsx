import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../lib/CmsProvider'
import { ListSkeleton } from './Loading'

/**
 * Deployment patterns, home page.
 *
 * On /deployment-patterns these panels pin and stack as you scroll, which is
 * the right treatment for the page whose whole job is to walk through them. On
 * the home page it was a second scroll-driven set piece competing with the
 * hero, so it is reduced here to four quiet entries: name, what it is, what it
 * has to prove.
 */
export default function DeploymentPatterns() {
  const { deploymentPatterns: patterns, cmsEnabled, cmsLoaded } = useCms()

  return (
    <section id="deployment-patterns" className="border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <motion.h2
          className="max-w-[24ch] text-[clamp(30px,4.6vw,50px)] leading-[1.06]"
        >
          What we deploy, and what it has to prove.
        </motion.h2>

        <motion.p
          className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-fog"
        >
          Four classes of system we build, each with the measurements agreed before it goes live. We publish
          the pattern rather than a client logo, because the pattern is the part we can stand behind today.
        </motion.p>

        {cmsEnabled && !cmsLoaded && patterns.length === 0 ? (
          <div className="mt-14">
            <ListSkeleton count={2} variant="pattern" />
          </div>
        ) : (
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {patterns.map((p, i) => (
              <motion.article
                key={p.slug}
                className="border-t border-hairline pt-6"
              >
                <Link to={`/deployment-patterns/${p.slug}`} className="group block">
                  <p className="text-[12px] text-fog">{p.category}</p>
                  <h3 className="mt-2 font-sans text-[clamp(23px,2.6vw,28px)] leading-tight text-paper transition-colors duration-200 group-hover:text-lime">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-fog">{p.tagline}</p>
                  <p className="mt-4 text-[12px] text-fog">
                    Measured <span className="text-ash">{p.measures.slice(0, 2).map((m) => m.metric).join(', ')}</span>
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          className="mt-12"
        >
          <Link to="/deployment-patterns" className="link-quiet text-[15px]">
            All deployment patterns
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
