import { Link } from 'react-router-dom'
import type { DeploymentPattern } from '../data/content'
import { cn } from '../utils'

/**
 * One deployment pattern, as a full-width panel.
 *
 * The previous revision led each panel with a stock photograph of an office or
 * a data centre, then a row of letter-spaced uppercase pills naming the
 * capability actions. Neither carried information the reader could use — the
 * photograph was decoration and the pills restated a two-word fact in a louder
 * voice. Both are gone.
 *
 * What is left is the thing the panel exists to communicate: what we build,
 * the problem class it belongs to, and the dimensions the client agreed to be
 * measured on before launch. Never invented client metrics.
 */
export default function DeploymentCard({
  c,
  className,
  asLink = true,
}: {
  c: DeploymentPattern
  className?: string
  asLink?: boolean
}) {
  const measures = c.measures.slice(0, 2)

  const body = (
    <div className="grid gap-7 md:grid-cols-[1.15fr_1fr] md:gap-12">
      <div className="min-w-0">
        <p className="text-[12px] text-fog">{c.category}</p>

        <h3 className="mt-2 font-sans text-[clamp(24px,3.2vw,34px)] leading-[1.1] text-paper transition-colors duration-200 group-hover:text-lime">
          {c.name}
        </h3>

        <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-fog">{c.tagline}</p>

        <p className="mt-5 text-[13px] text-fog">
          Spans <span className="mx-0.5 text-ash">{c.stack.join(', ')}</span>
        </p>

        {asLink && (
          <span className="mt-7 inline-block text-[14px] text-paper underline decoration-hairline-strong decoration-1 underline-offset-4 transition-colors duration-200 group-hover:text-lime group-hover:decoration-lime-soft">
            See the pattern
          </span>
        )}
      </div>

      <div className="min-w-0 border-t border-hairline pt-5 md:border-t-0 md:border-l md:pl-12 md:pt-0">
        <p className="text-[12px] text-fog">What we measure</p>
        <dl className="mt-4 flex flex-col gap-4">
          {measures.map((m) => (
            <div key={m.metric}>
              <dt className="text-[15px] text-paper">{m.metric}</dt>
              <dd className="mt-0.5 max-w-[40ch] text-[13px] leading-snug text-fog">{m.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[12px] text-fog">{c.timeframe}</p>
      </div>
    </div>
  )

  const shell = cn(
    'group block border border-hairline bg-carbon p-7 transition-colors duration-300 hover:border-lime-soft sm:p-9 md:p-12',
    className
  )

  if (!asLink) return <div className={shell}>{body}</div>

  return (
    <Link to={`/deployment-patterns/${c.slug}`} className={shell}>
      {body}
    </Link>
  )
}
