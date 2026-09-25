'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFINITIONS, SITE } from '../lib/brand'

/**
 * Hero: the single-viewport statement.
 *
 * This is the one place on the site that is a *statement* rather than a band
 * inside an argument, so it fills the first viewport with a looping video and
 * stacks one composition on a centred axis: headline → subhead → two actions.
 * Three elements, and the whole screen is the composition.
 *
 * Type and content are the site's, not the hero's own. The headline is the
 * site display face (`--font-display`, the same face every heading uses), the
 * body copy is `--font-sans`, and every string comes from `src/lib/brand.ts`:
 * the headline from `SITE.brandIdea` and the subhead from
 * `DEFINITIONS.descriptive`. Nothing here is hero-local copy, so the first
 * screen cannot drift from what the rest of the site claims.
 *
 * History, because it explains the shape. A mocked "Live deployment" panel used
 * to float beside the headline, spending 440px of the widest band describing a
 * system nobody had bought before the visitor was told what the offer was; it
 * was removed and the copy column re-centred. A later pass rebuilt the band
 * from an unrelated single-viewport template, a retro dot-matrix display face
 * and an icon font from two more CDNs, a "Trusted by 2000+ Enterprises" badge
 * over three invented client marks, and four invented runtime figures (120ms,
 * 99.99% uptime); the faces never loaded under the site's own CSP
 * (`font-src 'self' data:`), and the claims broke the brand rule that governs
 * every other page. A third pass then kept two more inherited elements:
 *
 *   1. An eyebrow, `Applied AI systems · Nairobi`. That is a locale strip with
 *      a middle dot, the shape every agency portfolio uses to signal "we are a
 *      studio, somewhere". It also spent a third of the vertical budget before
 *      the headline while telling the visitor nothing the subhead does not.
 *   2. A capability strip pinned to the bottom of the viewport, `Intelligence
 *      at work. / Converse / Understand / Act / Orchestrate`. It read as a
 *      second navigation but none of it was a link, and the same four actions
 *      open the very next band, so the first screen was spending its last line
 *      on a table of contents for a page the visitor had not started.
 *
 * Both are gone. What is left is the offer, one sentence about the offer, and
 * the two things a visitor can do about it: three elements, centred on the
 * viewport's own axis rather than on the space left over after a header and a
 * footer strip. This is also why the band carries no top offset for the
 * floating nav: centring in the full viewport is what keeps the composition
 * balanced at every width, and the nav is an overlay that the centred block
 * clears by construction (checked at 320 through 1920 wide, and at 740×360).
 *
 * The values below are hero-local on purpose, the composition is the only
 * place on the site that is a statement, so it must not leak into the shared
 * band rhythm or the shared scale.
 */

/** Exact looping background plate. Hero-local because the home hero is its
 *  only consumer.
 *
 *  It is 13.8 MB, so the plate is the one request on this page that can decide
 *  how the first screen looks. Three things keep that from being a black box:
 *  the `media-src` directive in `deploy/nginx-security-headers.conf` allows
 *  this host (without it `default-src 'self'` blocks the video outright), the
 *  poster below paints the plate's own first frame before a byte of video
 *  arrives, and reduced-motion users never start the download at all. */
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4'

/** One frame of the plate, same-origin, so the hero is never empty. */
const VIDEO_POSTER = '/images/hero-poster.jpg'

/**
 * Whether the plate should loop.
 *
 * A decorative background that never stops moving is the classic motion trigger,
 * and the site's own rule is to respect `prefers-reduced-motion`. There is no
 * way to honour that in CSS for a video, so the element itself is switched:
 * with the setting on, the poster stays and the video is not fetched
 * (`preload="none"`), which also spares the 13.8 MB.
 */
function useLoopingVideo(): boolean {
  const [loops, setLoops] = useState(() =>
    typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setLoops(!query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return loops
}

/**
 * The brand idea, set on the two lines it was written for: "Put intelligence" /
 * "to work.", with the second line carrying the Signal Violet accent the site
 * uses for the qualifying half of a heading (see HomeCTA and Wordmark).
 *
 * The lines are derived from `SITE.brandIdea` rather than retyped, so the
 * promise has one source; if the copy is ever reworded without the " to "
 * break, the tail is empty and the headline renders as the single line it now
 * is instead of as a broken fragment.
 */
function headlineLines(idea: string): { lead: string; tail: string } {
  const at = idea.indexOf(' to ')
  if (at === -1) return { lead: idea, tail: '' }
  return { lead: idea.slice(0, at), tail: idea.slice(at + 1) }
}

const HEADLINE = headlineLines(SITE.brandIdea)

export default function Hero() {
  const loops = useLoopingVideo()

  return (
    // `bg-midnight`, not `bg-black`: the video's own frame is the ground, and
    // under it (poster still loading, a blocked `media-src`, reduced motion)
    // the band has to fall back to the site's canvas rather than to #000000.
    // Pure black was the one surface on the site outside the token set, and it
    // read as a hole punched in a page whose canvas is #080810.
    <section id="home" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-midnight">
      {/* Ground: one looping plate behind everything, plus the scrim that keeps
          the type readable on a bright frame. The poster sits under the video,
          so the first frame is the plate rather than the canvas black. */}
      <video
        className="hero-video"
        poster={VIDEO_POSTER}
        autoPlay={loops}
        loop={loops}
        muted
        playsInline
        preload={loops ? 'auto' : 'none'}
        aria-hidden
        tabIndex={-1}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="hero-scrim" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col px-[clamp(14px,3vw,32px)] py-[clamp(16px,2.4vh,28px)]">
        {/* The statement, centred on the axis and on the viewport's own
            vertical centre, so it stays balanced whether the band is 360px or
            1080px tall. No vertical padding of its own: the band above owns the
            nav clearance, and counting it in both places is what used to push
            the composition off a landscape phone. */}
        <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col items-center justify-center text-center">
          <h1 className="hero-headline hero-anim" style={{ '--d': '0.06s' } as CSSProperties}>
            <span className="block">{HEADLINE.lead}</span>
            {HEADLINE.tail && (
              <>
                {/* The space is real text, not a layout gap: the two lines are
                    separate blocks, and without it the h1's text content reads
                    "Put intelligenceto work." to anything that does not lay the
                    page out (screen readers, search crawlers, copy-paste). */}
                {' '}
                <span className="hero-headline-accent block">{HEADLINE.tail}</span>
              </>
            )}
          </h1>

          <p className="hero-sub hero-anim" style={{ '--d': '0.18s' } as CSSProperties}>
            {DEFINITIONS.descriptive}
          </p>

          {/* One filled primary, one outlined ghost, the site's action pair. */}
          <div className="hero-actions hero-anim" style={{ '--d': '0.3s' } as CSSProperties}>
            <Link to="/contact" className="btn-primary hero-action">
              Book a discovery call
            </Link>
            <Link to="/deployment-patterns" className="btn-ghost hero-action">
              See what we deploy
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
