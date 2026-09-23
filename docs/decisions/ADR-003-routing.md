# ADR-003: Multi-page routing with real URLs

## Status

Accepted

## Date

2026-08-03

## Context

The site needs addressable pages, not scroll positions:

- A deployment pattern has to be linkable on its own (`/deployment-patterns/:slug`)
  because it is the unit a prospective client forwards to a colleague.
- Blog posts need stable URLs that survive a redesign, so that an inbound link or
  a search result does not break.
- Legal pages, the contact page and the FAQ hub are destinations, not sections.

The route table also has to answer to the past: earlier iterations of this site
published `/case-studies` and `/case-studies/:slug`, and those URLs are in the
wild. Dropping them would 404 every existing inbound link.

## Decision

`react-router-dom` v7 with `BrowserRouter`, one route table in `src/main.tsx`,
and a shared shell.

```
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>        fixed Nav + <Outlet/> + Footer + consent banner
      /                                 HomePage            (statically imported)
      /capabilities                     CapabilitiesPage    (lazy)
      /deployment-patterns              DeploymentPatternsPage (lazy)
      /deployment-patterns/:slug        DeploymentPatternDetail (lazy)
      /blog, /blog/:slug                BlogPage, BlogPostPage  (lazy)
      /contact                          ContactPage         (lazy)
      /about                            AboutPage           (lazy)
      /ai-automation-nairobi            NairobiPillarPage   (lazy)
      /privacy, /terms                  LegalPage-backed    (lazy)
      /case-studies, /case-studies/:slug → 301-style redirect to /deployment-patterns
      *                                 NotFoundPage        (lazy, noindex)
    </Route>
  </Routes>
</BrowserRouter>
```

Supporting decisions:

- **Code splitting.** Only the home page is statically imported; every other
  route is `React.lazy` with a `<Suspense fallback={<RouteFallback />}>` boundary
  so the first paint ships only what the landing page needs and the fallback is
  layout-stable.
- **Scroll restoration.** `Layout` resets scroll on `pathname` change but honours
  an in-page `hash` (for example `/privacy#cookies`), because a legal page is
  often linked to a specific clause.
- **Legacy redirects, not deletions.** `/case-studies` and `/case-studies/:slug`
  render `<Navigate replace />` to `/deployment-patterns`, so the old URLs keep
  resolving. `public/robots.txt` also disallows `/case-studies` so crawlers stop
  spending budget on them.
- **Titles and metadata per route.** `src/lib/Seo.tsx` writes title, description,
  canonical, Open Graph and route-level JSON-LD at runtime; `public/sitemap.xml`
  and `public/robots.txt` are kept in sync with the route table by hand, and the
  list of crawlable routes is asserted in the E2E suite.
- **SPA fallback is a deployment requirement.** `deploy/nginx.conf` rewrites
  unmatched paths to `index.html`. Without it every deep link 404s, which is both
  a user-facing break and the single largest search-visibility risk in the stack.

## Alternatives considered

### Single page with modal detail views

- Pros: one scroll context, less routing code.
- Cons: the shared unit breaks (a modal has no URL to send), back button
  behaviour is wrong, and analytics cannot attribute a page view.
- Rejected.

### `HashRouter` (`/#/about`)

- Pros: works on any static host with no rewrite rule.
- Cons: ugly and unshareable URLs, poor SEO, and it would hide the missing
  rewrite rule instead of forcing it to be configured.
- Rejected. Getting the SPA fallback right is a one-line nginx rule.

### Static HTML files per route, no client router

- Pros: nothing to fall back to.
- Cons: the shared shell, the nav state, the CMS content swap and the transition
  between routes would all be reimplemented per page.
- Rejected.

## Consequences

- Deep links, refreshes, sharing and the back/forward buttons all behave.
- Each route is its own chunk, so the home page stays small.
- `public/sitemap.xml`, `public/robots.txt` and `e2e/global-setup.ts` each carry
  a copy of the route list. Adding a route means updating all three; the E2E
  suite fails if a route renders without a title or an `<h1>`.
- The server must rewrite unknown paths. This is documented in `deploy/README.md`
  and implemented in `deploy/nginx.conf`.
