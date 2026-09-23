/**
 * The band under the hero.
 *
 * One continuous row of short statements about what every system ships with.
 * Not a client-logo wall: the brand publishes no named references without a
 * client's written approval, so the band carries what we can stand behind
 * rather than marks we do not own.
 *
 * The track holds the same list twice and translates by exactly -50%, which
 * makes the loop seamless with no gap and no measurement in JS. The second copy
 * is `aria-hidden`, so a screen reader hears the list once. It pauses on hover
 * (src/index.css) and stops entirely under `prefers-reduced-motion`.
 */

const ITEMS = [
  'Voice and messaging agents',
  'Retrieval grounded in your own sources',
  'Tasks completed, not described',
  'Approval gates before anything irreversible',
  'An audit trail on every automated decision',
  'Evaluation suites that catch regressions',
  'Deployed into your systems of record',
  'Measured against targets agreed before launch',
]

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
      // The duplicate copy exists only for the loop.
      {...(hidden ? {} : {})}
    >
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap text-[14px] text-ash">
          <span className="mx-6 h-1 w-1 shrink-0 rounded-full bg-lime sm:mx-8" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function TrustStrip() {
  return (
    <section aria-label="What every system ships with" className="border-y border-hairline bg-carbon">
      <div className="marquee py-5">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  )
}
