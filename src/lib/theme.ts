import { useSyncExternalStore } from 'react'

/**
 * Theme runtime.
 *
 * The site is dark-first. The dark half of the token set (src/index.css,
 * `html.dark`) is the resting state and the one the design is drawn from;
 * light is the inversion a visitor can ask for. The OS preference only wins
 * when it explicitly reports itself as light.
 *
 * Resolution order:
 *   1. the visitor's stored choice, if they have made one;
 *   2. otherwise the operating system, if it asks for light;
 *   3. otherwise dark.
 *
 * An inline script in index.html runs the same resolution before first paint,
 * so a light-mode visitor never sees a dark flash. That means the class on
 * `<html>` — not localStorage — is the authoritative starting state, and
 * `readTheme` reads it first.
 *
 * State lives in a module-level store and is consumed with
 * `useSyncExternalStore`, so the toggle and anything else that needs the theme
 * stay in sync without a context provider and without duplicating state.
 */

export type Theme = 'light' | 'dark'

/** Key shared with the inline script in index.html. Change both together. */
const STORAGE_KEY = 'naivolabs.theme'

/** The canvas colour per theme, kept in step with `--color-ink`. */
const THEME_COLOR: Record<Theme, string> = {
  light: '#fbfcf5',
  dark: '#0e100f',
}

/**
 * The OS setting that flips the default. Chromium reports no preference and a
 * light preference through the same query, so `matches` false means dark —
 * which is exactly the resting state we want.
 */
const LIGHT_QUERY = '(prefers-color-scheme: light)'

let current: Theme | null = null
const listeners = new Set<() => void>()

function systemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark'
  return window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark'
}

function storedTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    // Safari in private mode throws on access. An unreadable preference is
    // simply "no preference".
    return null
  }
}

/** The active theme. Safe to call during render. */
export function readTheme(): Theme {
  if (current) return current

  if (typeof document !== 'undefined') {
    // The inline script has already applied a theme, so trust the DOM. Dark is
    // the resting state, so its absence means light rather than the reverse.
    current = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    return current
  }

  current = storedTheme() ?? systemTheme()
  return current
}

function emit() {
  for (const listener of listeners) listener()
}

/** Apply a theme to the document without persisting it. */
function apply(theme: Theme) {
  current = theme
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  // Inline so the UA canvas (scrollbars, form controls, the area behind the
  // document) follows before the stylesheet resolves.
  root.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLOR[theme])
  emit()
}

/** Switch theme and remember the choice. */
export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Persisting is best-effort; the theme still applies for this page view.
  }
  apply(theme)
}

export function toggleTheme(): Theme {
  const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Subscribe to the OS setting, but only while the visitor has not chosen. */
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const media = window.matchMedia(LIGHT_QUERY)
  const onSystemChange = () => {
    if (storedTheme() === null) apply(systemTheme())
  }
  media.addEventListener?.('change', onSystemChange)
}

/** The active theme, and re-renders the caller when it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => 'dark' as Theme)
}
