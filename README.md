# AIthor Clone

A hand-coded, pixel-faithful clone of **aithor.framer.website** ("AIthor · AI Agency Template"
by Marso Angelov) built with React 19, Vite, TypeScript (strict), Tailwind CSS v4, framer-motion,
and react-router-dom v7. Every design value (colors, fonts, radii, layout geometry, animation
timing, hover states) is extracted from the live original via headless-browser measurement — see
[the ADRs](docs/decisions/) for the reasoning.

## Quick Start

```bash
npm install      # install dependencies
npm run dev      # start dev server (Vite)
```

Open the printed local URL (default http://localhost:5173).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run typecheck` | TypeScript strict check (`tsc --noEmit`) |
| `npm run build` | Type-check + production build (`tsc -b && vite build`) |
| `npm run preview` | Serve the production build locally (used for fidelity verification) |

## Architecture

```
src/
  main.tsx            # BrowserRouter + route table (see ADR-003)
  index.css           # Design-system tokens (light theme, ADR-002), marquee keyframes, safe areas
  motion.ts           # Measured scroll-reveal config — single source of truth (ADR-004)
  utils.ts            # cn() class merge helper
  components/         # Presentational, shared components (Nav, Footer, Hero, Marquee, …)
  pages/              # Route-level pages (Home, About, CaseStudies(+detail), Blog(+post), Contact)
  data/content.ts     # Case studies (incl. Formix) and blog posts with full articles
docs/
  decisions/          # ADRs — read these before changing the theme, motion, routing, or fidelity process
  research/           # Measurement notes extracted from the live original
```

Key decisions:

- **ADR-001** — Why this stack (React+Vite+Tailwind) instead of Framer or Next.js.
- **ADR-002** — The light theme (page `#f0f0f0`, panels `#e5e5e5`, dark `#151619` accents only).
- **ADR-003** — Multi-page routing with real URLs (`/case-studies/:slug`, `/blog/:slug`, …).
- **ADR-004** — The measured motion system: spring reveals + CSS marquee + reduced-motion floor.
- **ADR-005** — How fidelity is measured from the live site and verified against the clone.

## Conventions

- TypeScript strict mode; no semicolons; single quotes; 2-space indent.
- Components < 200 lines; split before exceeding.
- Animate only `transform` and `opacity`; honor `prefers-reduced-motion`.
- Never invent design values — measure the live original first (ADR-005).

## Deployment note

`BrowserRouter` requires a static-host rewrite of unknown paths to `index.html` (SPA fallback),
e.g. a `_redirects` file on Netlify/Cloudflare Pages or an equivalent rewrite rule on any host.
