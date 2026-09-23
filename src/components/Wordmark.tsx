import { cn } from '../utils'
import { WORDMARK } from '../lib/brand'

/**
 * The Naivolabs wordmark.
 *
 * The name is ONE word, so the two halves are set with no space between them
 * and the accessible name is always the full word — the split is presentational
 * only. The suffix carries the accent; it is not italicised, because a single
 * italicised word inside a logotype is a borrowed mannerism, not a decision.
 */
export default function Wordmark({
  as: Tag = 'span',
  className,
}: {
  as?: 'span' | 'div' | 'p'
  className?: string
}) {
  return (
    <Tag
      className={cn('tracking-[-0.01em] select-none', className)}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <span aria-hidden="true">
        {WORDMARK.head}
        <span style={{ color: 'var(--color-lime)' }}>{WORDMARK.tail}</span>
      </span>
      <span className="sr-only">Naivolabs</span>
    </Tag>
  )
}
