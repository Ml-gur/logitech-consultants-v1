# ADR-003: Multi-page client-side routing with react-router-dom v7

## Status
Accepted

## Date
2026-08-03

## Context
Probing the original's navigation revealed it is **genuinely multi-page**, not a single-page
scroll site:

- Nav links carry real URLs: About → `/about`, Case Studies → `/case-studies`,
  Blog → `/blog`, "Book a call" → `/contact`.
- Case-study rows are `<a>` links to `/case-studies/etery|genesy|zenon` (a 4th case, Formix,
  also exists).
- Blog cards link to real post URLs; posts have full article content.
- The contact page has a real form (sales@aithor.com, Sofia address).

The initial clone was a single `HomePage`; every "page" was an in-page section or dead anchor.

## Decision
Use **react-router-dom v7** `BrowserRouter` with a shared shell and route-level pages:

- `main.tsx`: `<BrowserRouter><Routes>` nesting everything under `<Route element={<Layout/>}>`.
- `components/Layout.tsx`: fixed `Nav` + `<Outlet/>` + `Footer`; scrolls to top on route change
  (`useLocation` + `window.scrollTo(0,0)`); page background `#f0f0f0`.
- Routes: `/`, `/about`, `/case-studies`, `/case-studies/:slug`, `/blog`, `/blog/:slug`,
  `/contact`, and a `*` catch-all that renders the home page (matching the original's 404→home
  behavior).
- `src/pages/*` are route-level compositions; `src/components/*` stay presentational and are
  shared across pages.
- Content lives in `src/data/content.ts` (case studies incl. Formix; blog posts with full
  articles), fetched via a scripted pass over the live site.

## Alternatives Considered

### Single page with modal/detail overlays
- Pros: One scroll context; simpler state.
- Cons: The original exposes real URLs and full pages; modals would break deep-linking, share
  links, and back-button behavior; unfaithful.
- Rejected.

### HashRouter (`#/about`)
- Pros: Works on any static host without rewrites.
- Cons: URLs diverge from the original (`/#/about` vs `/about`); hostile to sharing/SEO.
- Rejected: `BrowserRouter` + a static-host rewrite rule is the correct pattern.

### Keeping all links as dead anchors (`#`)
- Pros: None beyond initial speed.
- Cons: The operator explicitly required working buttons and pages.
- Rejected.

## Consequences
- Real URLs, deep links, and browser back/forward all work like the original.
- `NavLink` active styling (underline/active state) highlights the current route.
- Each route page uses the same fixed-nav offset (`pt-[76px]`), matching the measured 76px nav.
- Deployment must rewrite unknown paths to `index.html` (SPA fallback) — a static-host
  config requirement that did not exist with a single page.
