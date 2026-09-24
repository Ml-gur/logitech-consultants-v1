import { Link } from 'react-router-dom'
import { CAPABILITIES } from '../lib/brand'

/**
 * What we build.
 *
 * Two columns, one idea each. The left column is the claim and the work it
 * describes; the right column is the four actions as hairline rows, each one a
 * link straight to its depth on /capabilities, closed by the single action that
 * asks for more. Nothing is hidden behind a tab, nothing is invented, and the
 * whole section is about 90 words.
 *
 * This replaces a tabbed component that carried a 40-word paragraph, a
 * thirteen-tag pill cloud, a four-item checklist and a fabricated white "app"
 * screenshot for each of the four capabilities — roughly 1,600 words to say
 * four things.
 *
 * The media panel is the reference direction's one image in a section: the
 * point is that four separate systems are what a working one has to be, so the
 * panel shows the joining of them rather than another diagram. It is lazy and
 * carries no alt text, because it repeats the heading rather than adding to it.
 */
export default function Capabilities() {
  return (
    <section id="capabilities" className="border-t border-hairline">
      <div className="shell section">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div>
            <h2 className="max-w-[18ch] text-[clamp(32px,4.8vw,56px)] leading-[1.04]">
              Four things a working system has to do.
            </h2>

            <p className="mt-6 max-w-[44ch] text-[16px] leading-relaxed text-fog">
              Most AI projects stop at the first one. We build all four into the same system, in the order
              that gets work finished.
            </p>

            <div className="mt-10 overflow-hidden rounded-card border border-hairline">
              <img
                src="/images/integrations.webp"
                alt=""
                width={960}
                height={538}
                loading="lazy"
                decoding="async"
                className="h-[200px] w-full object-cover sm:h-[280px] lg:h-[320px]"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <ul className="flex flex-col">
              {CAPABILITIES.map((cap) => (
                <li key={cap.id} className="border-t border-hairline last:border-b">
                  <Link
                    to={`/capabilities#${cap.id}`}
                    className="group flex min-h-[64px] items-start gap-4 py-6"
                  >
                    <span
                      aria-hidden
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-lime transition-transform duration-200 group-hover:scale-150"
                    />
                    <span className="flex flex-col gap-1.5">
                      <span className="text-[clamp(19px,2vw,22px)] leading-none text-paper transition-colors duration-200 group-hover:text-lime">
                        {cap.name}
                      </span>
                      <span className="max-w-[42ch] text-[15px] leading-relaxed text-fog">
                        {cap.headline}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* One action for the section, and it is not a second filled button:
                on this page the solid fill belongs to the hero. */}
            <Link to="/capabilities" className="btn-ghost mt-8 w-full px-6 py-4 text-[15px]">
              How the four fit together
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
