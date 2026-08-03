# ADR-001: Hand-coded React + Vite + Tailwind v4 SPA as a faithful clone of aithor.framer.website

## Status
Accepted

## Date
2026-08-03

## Context
The operator asked for an **exact replica** of `aithor.framer.website` — a commercial Framer
template ("AIthor · AI Agency Template" by Marso Angelov, sold on the Framer Marketplace) —
including fonts, components, layout geometry, animations, and interactions. The original is a
marketing site for an AI-automation agency: hero, logo strip, services, benefits, process, case
studies, testimonials marquee, metrics, pricing, FAQ, blog, footer, plus a multi-page structure
(about, case studies + detail pages, blog + post pages, contact).

Key constraints:

- **Fidelity over invention.** Nothing may be "designed to fit"; every value must be extracted
  from the live original (see ADR-005 for the measurement process).
- **No clean export path.** Framer does not export maintainable React/Next code; it produces
  absolute-positioned machine markup tied to proprietary class names. The template is also a
  paid commercial product, so downloading its bundle wholesale was not an option.
- **Performance floor.** The project's premium bar targets a gzip bundle well under 170kB and
  no JS-runtime bloat (independent benchmarks put Framer's runtime at 350–500kB JS).

## Decision
Hand-code the clone as a **React 19 + Vite + TypeScript (strict) + Tailwind CSS v4** SPA:

- `vite` dev/preview tooling with `@tailwindcss/vite` plugin; Tailwind v4 `@theme`/CSS-first tokens.
- `framer-motion` v12 for the reveal/hover motion system (see ADR-004).
- `react-router-dom` v7 for the multi-page structure (see ADR-003).
- `lenis` for buttery smooth scrolling; `lucide-react` for icons; `clsx` for class merging.
- Self-hosted variable WOFF2 fonts extracted from the original (Halant display, Geist body,
  Fragment Mono labels) with `font-display: swap`, preloaded.
- All design tokens live in `src/index.css` under `:root` CSS variables (light theme — see ADR-002).

## Alternatives Considered

### Host the site in Framer itself
- Pros: Pixel-perfect by definition; free remix of the original template.
- Cons: Paid template; vendor lock-in; heavy runtime (median Lighthouse ≈62 vs ≈94 for custom
  code); no clean export if we ever leave; cannot satisfy "hand-coded" intent.
- Rejected: defeats the purpose of an independent, optimized clone.

### Next.js (SSR/SSG)
- Pros: SEO, server components, static generation.
- Cons: A client-rendered marketing site needs no SSR; Vite SPA keeps the toolchain minimal and
  the bundle smaller; the original is itself a client-rendered SPA.
- Rejected: added complexity without benefit for this project.

### Plain HTML/CSS with vanilla JS
- Pros: Zero framework.
- Cons: 8 routes + shared nav/footer + animation orchestration would become unmaintainable.
- Rejected: React is warranted by the page count and shared components.

## Consequences
- Full control over fidelity — every token, font, radius, and animation value is ours to tune
  against measurements.
- Shipping bundle stays lean: ~139kB gzip total at the time of writing (within the <170kB budget).
- Self-hosting fonts removes third-party requests and matches the original's payload profile.
- The clone is independent of Framer licensing — no template purchase, no runtime dependency.
- Future maintainers must keep extracting values from the live original rather than inventing them
  (see ADR-005).
