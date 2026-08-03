'use client'

import type { ReactNode } from 'react'
import { cn } from '../utils'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
  children?: ReactNode
}

/**
 * Infinite marquee — API-compatible with the MagicUI Marquee component
 * (https://magicui.design/docs/components/marquee).
 * Animates via CSS keyframes so it can be paused on hover and disabled
 * under prefers-reduced-motion.
 */
export default function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical && 'flex-col',
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]'
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
