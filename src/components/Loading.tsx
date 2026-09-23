'use client'

import { cn } from '../utils'

/**
 * Loading primitives.
 *
 * Three situations need a loading state on this site:
 *  1. A lazy-loaded route chunk is still downloading (RouteFallback).
 *  2. The CMS is configured and its content has not arrived yet (CardSkeleton,
 *     ListSkeleton, PatternSkeleton).
 *  3. A button has started an async action (ButtonSpinner).
 *
 * Every skeleton is decorative: the surrounding region carries the accessible
 * status text so screen readers announce "loading" once, not once per bar.
 */

/** Single shimmering block. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />
}

/** Inline spinner for buttons in a pending state. */
export function Spinner({ className }: { className?: string }) {
  return <span className={cn('spinner', className)} aria-hidden="true" />
}

/** Visually-hidden live region announcing a load in progress. */
export function LoadingAnnouncer({ label = 'Loading content' }: { label?: string }) {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {label}
    </p>
  )
}

/** Skeleton for a blog card (image band + title + meta lines). */
export function CardSkeleton() {
  return (
    <div className="rounded-[30px] bg-[#191919] border border-white/10 overflow-hidden">
      <Skeleton className="w-full aspect-[16/10] rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

/** Skeleton for a deployment-pattern card. */
export function PatternSkeleton() {
  return (
    <div className="rounded-[30px] bg-[#191919] border border-white/10 overflow-hidden grid grid-cols-1 md:grid-cols-2">
      <Skeleton className="w-full min-h-[240px] md:min-h-[380px] rounded-none" />
      <div className="p-8 md:p-12 space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}

/** A stack of card skeletons. */
export function ListSkeleton({ count = 3, variant = 'card' }: { count?: number; variant?: 'card' | 'pattern' }) {
  return (
    <div className="space-y-5" aria-busy="true">
      <LoadingAnnouncer />
      {Array.from({ length: count }).map((_, i) =>
        variant === 'pattern' ? <PatternSkeleton key={i} /> : <CardSkeleton key={i} />
      )}
    </div>
  )
}

/**
 * Fallback rendered while a lazy route chunk loads. Deliberately minimal: it
 * occupies the same top padding as a page shell so there is no layout jump
 * when the real page mounts (CLS budget).
 */
export default function RouteFallback() {
  return (
    <div className="pt-32" aria-busy="true">
      <LoadingAnnouncer label="Loading page" />
      <div className="max-w-[1200px] mx-auto px-6 space-y-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-12 w-[min(560px,90%)]" />
        <Skeleton className="h-4 w-[min(420px,80%)]" />
        <div className="grid lg:grid-cols-2 gap-12 pt-8">
          <div className="space-y-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <Skeleton className="h-64 w-full rounded-[20px]" />
        </div>
      </div>
    </div>
  )
}
