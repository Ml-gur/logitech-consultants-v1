'use client'

import { motion } from 'framer-motion'
import { MEASUREMENT_DIMENSIONS } from '../lib/brand'
import { revealInitial, revealWhileInView, revealViewport, springReveal } from '../motion'
import { BAND_CONTENT, Band, SectionHeader } from './Section'

/**
 * Measurement: what success is defined as, before anything is built.
 *
 * This band used to open with a row of four large figures, `94% completion`,
 * `< 3s to first answer`, `10× deployment velocity`, `0 silent failures`,
 * sitting directly under the lede that says "No invented ROI figures." The four
 * numbers were invented, none had a measurement behind it, and the labels read
 * as results rather than as targets, so the band contradicted itself in the
 * first thing a visitor read and broke the brand rule that governs every other
 * page: no outcome metric without evidence. They are gone.
 *
 * What is left is the honest version of the same claim: the six dimensions
 * every deployment is instrumented against, sourced from
 * `MEASUREMENT_DIMENSIONS` in `src/lib/brand.ts` rather than retyped here. The
 * local copy that used to live in this file had already drifted from the
 * canonical one ("checked against an evaluation set" had gone missing), which
 * is what a second source of truth for the same six strings always does. It
 * also meant the same metric name rendered twice in one band, an invented
 * figure above and a real dimension below, which is what made the section
 * ambiguous to read and to test.
 *
 * The band's job is order, not decoration: what we measure, then why each one
 * matters, then the note about what happens when a target is missed.
 */
export default function Metrics() {
  return (
    // No rule above this band: it is the second half of the same movement as
    // Capabilities ("what we build", then "how we prove it"), so interval alone
    // separates the two. The page's two hairlines mark its two real register
    // changes: before Principles, and before the closing ask.
    //
    // `loose`: the movement changes here — the page stops describing what it
    // builds and starts describing how it proves it. That seam is the widest on
    // the page and has no hairline to announce it, which is exactly why it is
    // the one that needs the air.
    //
    // No label either. The heading is the claim and the lede is the qualifier,
    // so a third line above them only delays the sentence (see the eyebrow
    // budget in HomePage.tsx).
    <Band id="measurement" tone="loose">
      <SectionHeader
        title={
          <>
            We agree what success means{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-signal)' }}>
              before
            </em>{' '}
            we build.
          </>
        }
        lede="No invented ROI figures. Every deployment is instrumented against these six dimensions before the first user touches the system, with the target agreed in writing. Where we miss, we say so."
      />

      {/* The six dimensions. Two columns up to lg and three beyond, which fills
          both grids exactly: six items never leave a hole, and each card is a
          plain data row rather than a third undifferentiated feature tile. */}
      <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${BAND_CONTENT}`}>
        {MEASUREMENT_DIMENSIONS.map((d, i) => (
          <motion.div
            key={d.metric}
            initial={revealInitial}
            whileInView={revealWhileInView}
            viewport={revealViewport}
            transition={springReveal(i * 0.05)}
            className="flex gap-4 rounded-[16px] p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-1 rounded-full shrink-0 mt-1"
              style={{
                background: 'linear-gradient(to bottom, var(--color-voltage), var(--color-signal))',
                minHeight: '40px',
              }}
              aria-hidden
            />
            <div>
              <div className="text-[13px] font-medium text-paper mb-1">{d.metric}</div>
              <div className="text-[12px] leading-relaxed text-fog">{d.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={revealInitial}
        whileInView={revealWhileInView}
        viewport={revealViewport}
        transition={springReveal(0.14)}
        className="text-[13px] mt-10 max-w-[66ch]"
        // `fog`, not `slate`. The site's own ADR-008 rules that small text on a
        // dark surface uses ash or fog "never slate for small text", and this
        // aside was the exception: #6d6d7a at 13px on Midnight measures 3.9:1,
        // under the 4.5:1 floor. Fog measures 7.1:1 and is still the quieter of
        // the two text tokens, so the note keeps its rank.
        style={{ color: 'var(--color-fog)', borderLeft: '2px solid var(--color-graphite)', paddingLeft: '16px' }}
      >
        Where a deployment does not meet its agreed target, we say so and either change the
        approach or stop. Publishing only the wins would make this page worthless.
      </motion.p>
    </Band>
  )
}
