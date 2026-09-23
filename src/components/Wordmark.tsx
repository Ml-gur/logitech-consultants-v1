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
    <Tag className={cn('tracking-[-0.02em] select-none', className)}>
      <span aria-hidden="true">
        {WORDMARK.head}
        <span className={cn('text-signal', accentClassName)}>{WORDMARK.tail}</span>
      </span>
      <span className="sr-only">Naivolabs</span>
    </Tag>
  )
}
