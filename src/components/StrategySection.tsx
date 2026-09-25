import { Link } from 'react-router-dom'

const principles = [
  ['01', 'Start with the work', 'We map the real workflow before recommending a system.'],
  ['02', 'Agree the measure', 'Every deployment begins with a definition of what working means.'],
  ['03', 'Keep people in control', 'Approval gates, escalation paths and audit trails are part of the build.'],
  ['04', 'Earn the next step', 'Paid discovery becomes a scoped pilot, then a measured production system.'],
]

export default function StrategySection() {
  return (
    <section id="how-we-work" className="strategy-section" aria-labelledby="strategy-title">
      <div className="strategy-section__intro">
        <div>
          <p className="section-label">A better starting point</p>
          <h2 id="strategy-title">Not a demo.<br /><em>A working system.</em></h2>
        </div>
        <p className="strategy-section__lede">
          Naivolabs helps organizations move from a real operational problem to a governed system that can be measured in production.
        </p>
      </div>

      <div className="strategy-section__grid">
        {principles.map(([number, title, description]) => (
          <article key={number} className="strategy-card">
            <span className="strategy-card__number">{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="strategy-section__footer">
        <p>Paid discovery is credited to the pilot. If the case cannot be measured, we will say so.</p>
        <Link to="/contact" className="text-link">Book a scoping conversation <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  )
}
