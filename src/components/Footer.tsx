import { Link } from 'react-router-dom'
import { SITE } from '../lib/brand'
import { openCookieSettings } from '../lib/cookieConsent'
import Wordmark from './Wordmark'

const navLinks = [
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Deployment patterns', to: '/deployment-patterns' },
  { label: 'Insights', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const legalLinks = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms & conditions', to: '/terms' },
]

/**
 * Footer.
 *
 * Two things were removed here:
 *
 *   · A newsletter form. It had no backend and answered every valid address
 *     with "Subscribed", so it made a promise the system could not keep.
 *     Returning it means wiring a real provider first.
 *   · A column of four social links, all pointing at placeholder handles
 *     (x.com/naivolabs, linkedin.com/company/naivolabs, github.com/naivolabs,
 *     youtube.com/@naivolabs) that resolve to nothing. Four 404s in the footer
 *     of a company whose pitch is engineering rigour is the wrong signal. The
 *     column now carries the contact details, which are real, and the
 *     Organization structured data no longer claims profiles we do not own.
 */
export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-carbon text-ash">
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-14 sm:px-8 sm:pt-18">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Wordmark as="p" className="text-[22px] leading-none text-paper" />
            <p className="mt-3 max-w-[34ch] text-[13px] leading-relaxed text-fog">
              An applied AI systems company. We build governed systems that complete real work inside real
              organizations.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[13px] text-paper">Company</h2>
            <ul className="mt-4 flex flex-col">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="inline-flex min-h-11 items-center text-[14px] text-fog transition-colors duration-200 hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[13px] text-paper">Legal</h2>
            <ul className="mt-4 flex flex-col">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="inline-flex min-h-11 items-center text-[14px] text-fog transition-colors duration-200 hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="inline-flex min-h-11 items-center text-left text-[14px] text-fog transition-colors duration-200 hover:text-paper"
                >
                  Cookie preferences
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[13px] text-paper">Contact</h2>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex min-h-11 items-center text-[14px] text-fog transition-colors duration-200 hover:text-paper"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex min-h-11 items-center text-[14px] text-fog transition-colors duration-200 hover:text-paper"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="pt-1 text-[14px] leading-relaxed text-fog">{SITE.address.lines}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-fog">&copy; {new Date().getFullYear()} Naivolabs. All rights reserved.</p>
          <p className="text-[13px] text-fog">Built from Nairobi for organizations everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
