import { useTheme, toggleTheme } from '../lib/theme'

/**
 * Theme toggle.
 *
 * A 44px target (the minimum tap size the rest of the site holds to) that
 * shows the theme you would get, not the one you are in — a moon while the page
 * is light. The accessible name states the action for the same reason.
 *
 * Not a switch: a switch implies an on/off setting with a value, and this
 * changes a preference with two named states.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useTheme()
  const next: 'light' | 'dark' = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ash transition-colors duration-200 hover:bg-veil hover:text-paper ${className}`}
    >
      {theme === 'dark' ? (
        /* Sun: going to light. */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        /* Moon: going to dark. */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      )}
    </button>
  )
}
