'use client'

import { cn } from '../utils'
import { WORDMARK } from '../lib/brand'

/**
 * The Naivolabs wordmark.
 *
 * The brand name is ONE word. The accent is applied to the "labs" half with no
 * space between the halves, so the name never reads as "Naivo Labs". The
 * accessible name is always the full word, the split is presentational only.
 */
export default function Wordmark({
  as: Tag = 'span',
  className,
  accentClassName,
}: {
  as?: 'span' | 'div' | 'p'
  className?: string
  accentClassName?: string
}) {
  return (
    <Tag className={cn('tracking-[-0.02em] select-none', className)} style={{ fontFamily: 'var(--font-display)' }}>
      <span aria-hidden="true">
        {WORDMARK.head}
        <span className={cn(accentClassName)} style={{ color: 'var(--color-signal)', fontStyle: 'italic', fontWeight: 300 }}>{WORDMARK.tail}</span>
      </span>
      <span className="sr-only">Naivolabs</span>
    </Tag>
  )
}
