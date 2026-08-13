'use client'

/**
 * Dual-row infinite logo marquee for the "Data & Integrations" service card.
 * Faithful to the original site (measured live): light #e5e5e5 panel, tiles
 * #e5e5e5 with #f0f0f0 inner chips, dark icons, row 1 scrolls RIGHT and row 2
 * scrolls LEFT (measured directions), 35s linear, hover scale, edge fades to
 * the panel color. Brand glyphs are inline SVGs — this lucide-react version
 * ships no brand icons, so the lucide imports from the operator's snippet are
 * inlined here.
 */

/* ---------- Icon glyphs (stroke-based like lucide, viewBox 0 0 24 24) ---------- */

type Glyph = (props: { className?: string }) => React.ReactElement

function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function HubSpot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.8 10.2a2.8 2.8 0 0 0-2.02.86l-4.58-3.57a2.82 2.82 0 0 0 .15-.9 2.82 2.82 0 1 0-5.64 0c0 .31.05.62.15.9L3.92 10.2a2.82 2.82 0 1 0 1.7 1.83l2.84-2.22c.26.11.54.18.84.18a2.8 2.8 0 0 0 1.95-.78l4.57 3.56a2.82 2.82 0 1 0 3.08-2.57zM12 4a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 12 4zM4 14a1.2 1.2 0 1 1 0-2.4A1.2 1.2 0 0 1 4 14zm14.8-1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
    </svg>
  )
}

function Figma({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v2h3a3 3 0 1 0 0-6zM9 7h3v3a3 3 0 1 1-3-3zM9 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 12a3 3 0 1 1 0 6h-3v-3a3 3 0 0 1 3-3z" />
    </svg>
  )
}

function Zapier({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10.5 2h3v7.5l5.3-5.3 2.12 2.12-5.3 5.3H23v3h-7.38l5.3 5.3-2.12 2.12-5.3-5.3V22h-3v-7.38l-5.3 5.3-2.12-2.12 5.3-5.3H2v-3h7.38l-5.3-5.3 2.12-2.12 5.3 5.3V2z" />
    </svg>
  )
}

function Slack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.958 8.834a2.528 2.528 0 0 1 2.52-2.521 2.528 2.528 0 0 1 2.522 2.521 2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.167 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.167 18.958a2.528 2.528 0 0 1 2.521 2.52 2.528 2.528 0 0 1-2.521 2.522 2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zM15.167 17.688a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.167a2.528 2.528 0 0 1-2.522 2.521h-6.312z" />
    </svg>
  )
}

function Trello({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <rect x="6.5" y="7" width="4" height="7" rx="1" fill="currentColor" stroke="none" />
      <rect x="13" y="7" width="4" height="4" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Twitter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z" />
    </svg>
  )
}

function Youtube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function Twitch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  )
}

function Chrome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
      <path d="M21 12h-6M12 21v-6M3 12h6M12 3v6" strokeLinecap="round" />
    </svg>
  )
}

function Claude({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z" />
      <path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8L19.8 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function Codepen({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="m12 2 10 6.5v7L12 22 2 15.5v-7L12 2zm0 2.311L4.5 9.522v.001L12 15l7.5-5.477V9.522L12 4.311zM3.5 12.215v1.87L9.25 18.2v-1.87zm17 0-5.75 4.115v1.87l5.75-4.115z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function N8n({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="5" cy="12" r="3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="7" r="3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="17" r="3" fill="currentColor" stroke="none" />
      <path d="M8 12h3.5a3 3 0 0 0 3-3V7M11.5 12a3 3 0 0 0 3 3v2" />
    </svg>
  )
}

function Dribbble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5 7.5c3.5 4.7 6.4 7.3 11.5 8.8M19.5 9.5c-3.8-1.8-7.6-2.1-12.2-1M8.5 4.8c2.8 3.5 4.6 7.6 5.4 12.9" strokeLinecap="round" />
    </svg>
  )
}

function Framer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 0h16v8h-8v8H4V0zm0 16h8v8H4v-8z" />
    </svg>
  )
}

function Gitlab({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="m12.017 21.751-5.78-4.413-4.603-7.238a1.3 1.3 0 0 1-.088-1.02l1.654-5.09a.615.615 0 0 1 1.155-.02l2.236 6.798h8.895l2.236-6.798a.615.615 0 0 1 1.155.02l1.654 5.09a1.3 1.3 0 0 1-.088 1.02l-4.603 7.238-5.78 4.413z" />
    </svg>
  )
}

function Hexagon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}

function Layers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83zM22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  )
}

/* ---------- Rows (exact order from the operator's snippet) ---------- */

const ROW1: Glyph[] = [Github, HubSpot, Figma, Zapier, Slack, Trello, Twitter, Youtube, Twitch]
const ROW2: Glyph[] = [Chrome, Claude, Codepen, N8n, Dribbble, Framer, Gitlab, Hexagon, Layers]

function Logo({ Icon }: { Icon: Glyph }) {
  return (
    <div className="h-11 w-11 shrink-0 rounded-[15px] bg-[#f4f4f6] border border-black/10 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer">
      <div className="h-9 w-9 rounded-[10px] bg-white flex items-center justify-center">
        <Icon className="h-5 w-5 text-zinc-600" />
      </div>
    </div>
  )
}

function LogoRow({ icons, reverse = false }: { icons: Glyph[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden relative w-full max-w-full">
      {/* Seamless loop — repeat the set ×4; each copy animates its own width
          (calc(-100% - gap)) so the loop never jumps (same pattern as Marquee) */}
      <div className="group flex w-full max-w-full min-w-0 [--duration:35s] [--gap:12px] [gap:var(--gap)]">
        {Array.from({ length: 4 }).map((_, r) => (
          <div
            key={r}
            className={`flex shrink-0 justify-around [gap:var(--gap)] animate-marquee group-hover:[animation-play-state:paused] ${reverse ? '[animation-direction:reverse]' : ''}`}
          >
            {icons.map((Icon, i) => (
              <Logo key={i} Icon={Icon} />
            ))}
          </div>
        ))}
      </div>
      {/* Edge fades — match the white product panel */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  )
}

export default function IntegrationMarquee() {
  return (
    <div className="h-full rounded-[12px] bg-white p-3 flex flex-col justify-center gap-3 overflow-hidden">
      <LogoRow icons={ROW1} reverse />
      <LogoRow icons={ROW2} />
    </div>
  )
}
