# ADR-001: React + Vite + Tailwind v4 as a client-rendered SPA

## Status

Accepted

## Date

2026-08-03

## Context

The site is a marketing and content site: a handful of routes, a shared shell, a
lot of typography, one scroll-driven interaction, and a CMS-backed blog. It has
to be fast on a mid-range phone on a Kenyan mobile connection, indexable by
search engines and AI crawlers, and maintainable by whoever picks it up next.

The constraints that shaped the choice:

- **Bundle size is a product feature.** Independent benchmarks put the Framer
  runtime at 350–500 kB of JavaScript. This site's budget is under 170 kB gzip
  for the entry chunk, which a hand-written app can meet comfortably and a
  page-builder export cannot.
- **Real design values, in code.** The design system is a small set of named
  tokens (see ADR-002). It needs to be editable in one file, not spread across
  generated markup with proprietary class names.
- **Content must not be stranded.** Blog posts and contact details need to be
  editable by a non-engineer without a redeploy (see ADR-005), and the site must
  still render if that CMS is down.

## Decision

A **React 19 + Vite + TypeScript (strict) + Tailwind CSS v4** single-page
application.

| Concern | Choice | Why |
|---|---|---|
| Build tool | Vite 8 with `@vitejs/plugin-react` | Fast dev server, small production output, first-class code splitting |
| Styling | Tailwind v4 via `@tailwindcss/vite` | CSS-first `@theme` tokens; no config file to keep in sync |
| Routing | `react-router-dom` v7 | Real URLs (ADR-003) with per-route code splitting |
| Motion | `framer-motion` v12 | Declarative, scroll-linked, respects `prefers-reduced-motion` (ADR-004) |
| Smooth scroll | `lenis` | One place to disable it for reduced-motion users |
| Icons | `lucide-react` | Single icon family, tree-shaken, consistent stroke weight |
| Class merge | `clsx` | Conditional classes without string concatenation |
| Fonts | Self-hosted WOFF2 in `public/fonts/` | No third-party request, no font CDN in the CSP, no FOIT |

All design tokens live in `src/index.css` under `@theme` / `:root`.

## Alternatives considered

### Next.js (SSR or SSG)

- Pros: server rendering, image optimisation, file-based routing.
- Cons: adds a Node runtime to production for a site whose content is already
  cached at the edge by the reverse proxy; the SPA fallback plus a real
  `sitemap.xml` and runtime metadata covers the crawlers that matter.
- Rejected: operational cost with no measured benefit at this scale. Revisit if
  a route ever needs authenticated server rendering.

### Astro or another static-site generator

- Pros: ships almost no JavaScript by default.
- Cons: the interaction layer (the deployment-pattern stack, the accordion, the
  contact form, the CMS content swap) is genuinely stateful; islands would
  reintroduce the same client runtime, one framework further away.
- Rejected.

### A page builder, or continuing in one

- Pros: no code.
- Cons: runtime weight, no token system, no tests, and the markup cannot be
  meaningfully reviewed or diffed.
- Rejected.

### Plain HTML/CSS with vanilla JS

- Pros: nothing to install.
- Cons: ten routes, a shared shell, a CMS client and an animation system become
  unmaintainable as raw DOM code.
- Rejected. React is justified by the route count and the shared components.

## Consequences

- Every token, typeface, radius and easing curve is ours, in `src/index.css`.
- The production build is a directory of static files, which is what makes the
  single-node Hetzner deploy (see `docs/research/hetzner-deployment.md`) cheap
  and boring: nginx serves `dist/`, and there is no application runtime to
  supervise for the marketing site.
- Routes are code-split; `src/main.tsx` statically imports only the home page.
- Because the app is client-rendered, the server must rewrite unknown paths to
  `index.html` (the SPA fallback). This is configured in `deploy/nginx.conf` and
  is covered by the E2E suite.
- `npm run typecheck` is part of `npm run build`, so a type error cannot reach a
  release.
