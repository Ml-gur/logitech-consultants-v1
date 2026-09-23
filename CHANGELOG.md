# Changelog

Notable changes to the Naivolabs website and CMS. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `.github/workflows/ci.yml` — typecheck, production build and the E2E suite on
  every push and pull request.
- `tsconfig.e2e.json` — the E2E suite and the Playwright config are now
  typechecked (`npm run typecheck` compiles both projects). They were previously
  outside every tsconfig, so a spec could reference a helper that no longer
  existed and nothing failed until the suite ran. Enabling it immediately
  surfaced two untyped Web Vitals entry shapes, now declared locally, and a
  consent helper that wrote a localStorage record the app rejects.
- Bundle-size and image-count budgets in the performance spec, replacing the
  stale logo-strip numbers.
- `e2e/fonts.ts` and `e2e/test.ts` — specs import `test`/`expect` from the latter,
  which waits for the site's webfonts after every navigation. With
  `font-display: swap` on a machine that has no system fonts, text set in a face
  that has not arrived measures 0px tall, which turned every touch-target and
  visibility assertion into a coin flip. The face list is read out of the loaded
  stylesheets so it cannot drift from `src/index.css`.

### Changed

- **The site has one accent and one typeface, on a near-black canvas.** The
  design system moved to the direction recorded in
  [`ADR-002`](docs/decisions/ADR-002-design-system.md): a near-black canvas
  (`#0e100f`) with a faint green cast, a single pale-lime accent (`#f3ffc9`) used
  for both statement type and fills, sage secondary text, and generous corners
  (20px panels, 30px cards, full pills for anything you can press). Brass, the
  near-square panels and the serif/sans/mono mix are gone from `src/` — 93 colour
  and 25 type/radius references were migrated in one pass, and the radii now come
  from the tokens (`rounded-panel`, `rounded-field`) rather than arbitrary
  values.
- **The home hero is one full-bleed panel.** The two-column hero with a
  schematic of the four actions is gone. The statement now sits in the accent
  inside a full-bleed panel, the action sits beside it, and a band of what the
  systems actually do runs along the bottom edge — capabilities from
  `src/lib/brand.ts`, not outcome claims. The panel carries the one gradient in
  the system (`.hero-glow`), with a scrim over the copy so the headline is
  measured against the panel rather than the colour field. The header moved with
  it: the links sit in a centred pill and the CTA is a header-level outlined
  control, so the hero owns the screen's single filled button.
- **Dark is the resting state.** The dark half of the token set is canonical;
  light is the inversion, still available from the toggle or an OS that asks for
  it. `playwright.config.ts` pins `colorScheme: 'dark'` so the E2E suite and the
  visual goldens exercise the canonical theme instead of Chromium's default light
  preference.
- **The display face is self-hosted, then retired.** Instrument Serif was loaded
  from Google Fonts, which the production CSP (`font-src 'self' data:`) blocks —
  so it was silently falling back to Georgia in production. It was moved to
  `public/fonts/` with latin / latin-ext subsets, and then removed entirely when
  the system moved to a single grotesk: Inter (400/500) and JetBrains Mono now
  live in `public/fonts/`, and the two first-paint faces are preloaded. No remote
  font, no third-party request on the critical path.
- **Deployment targets one place.** The Hetzner Docker Compose stack in
  `deploy/` is now the only documented path: `deploy/SHARED-HOST-DEPLOY.md`,
  `vercel.json` and the Vercel migration workflow are gone, and `README.md`,
  `cms/README.md` and `.env.example` describe the Hetzner stack instead of a
  second hosting provider.
- **Asset filenames are semantic.** The fonts and images carried build-hash
  names from the asset pipeline that produced them (`5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,
  `WZnkJ0N8GjD8YGH73bVRdcc9tvI.webp`). They are now `inter-400.woff2`,
  `ai-strategy.webp` and so on.
- **The token aliases are gone.** `--color-signal`, `--color-voltage`,
  `--color-gold`, `--color-plasma` and `--color-midnight` all pointed at values
  already covered by `--color-brass` and `--color-ink`. Every use was migrated;
  `src/index.css` now declares one name per value.
- **The CMS client requests the collection that exists.** `fetchCaseStudies`
  tried `/api/deployment-patterns` first, which the CMS does not expose, so every
  CMS-mode page load paid for a guaranteed 404 before falling back. It now
  requests `/api/case-studies` directly and is named
  `fetchDeploymentPatterns`, matching the rest of the codebase.
- **The CMS re-sync listener is correct.** `visibilitychange` was registered with
  an anonymous handler and removed by reference to the `focus` handler, so the
  listener leaked and the focus handler was removed twice.
- Documentation rewritten as a product: `README.md` is a contributor guide
  rather than a build log, the ADRs describe decisions rather than measurements
  taken from a reference site, and `CHANGELOG.md` no longer carries the
  iteration history of the design process.
- **One name for one action.** The header CTA said "Book a call" while the hero,
  the closing band, the mobile menu and every other page said "Book a discovery
  call" — the same action, two names, on the same screen. The header nav also
  labelled `/deployment-patterns` as "Deployments" while the footer, the page
  title and the breadcrumb all said "Deployment patterns". Both now read the same
  everywhere, and the nav's links and CTA moved to the `lg` breakpoint (with the
  menu button taking over below it) so the longer label fits.
- **Three font weights were shipped and never rendered.** Inter 600 and 700, and
  JetBrains Mono 500, were declared as faces and downloaded while nothing on the
  site set them; the two Instrument Serif italic subsets were the same. All five
  files are gone (~65 kB), and the faces on the first-paint path are preloaded.
- **`scrollbar-gutter: stable` on `html`.** Without it the content box is ~15px
  wider on pages short enough not to scroll, so moving between a short page and a
  long one shifted the whole layout sideways. It also made the `/capabilities`
  full-page visual golden alternate between two heights: a full-page capture
  resizes the viewport, which removes the scrollbar, which re-wraps every
  paragraph on the page.
- The code-sample scroll container and the input borders now use `slate` instead
  of the removed `steel`.

### Removed

Removed as unused, superseded or never part of the product:

- Instrument Serif and its two subset files, `scripts/fetch-fonts.mjs` and the
  `npm run fonts` script. The system uses one grotesk now (ADR-002), so the
  display face, its preloads and the tooling that fetched it had nothing left to
  do.
- 14 one-off browser probe scripts at the repository root, `capture-sections.mjs`
  and `scripts/download-assets.mjs` — scratch tooling from the initial build.
- `scripts/prerender.mjs` and the `build:prerender` script. It captured a
  post-hydration DOM per route, but it needs a Chromium binary, which neither the
  production build image (Node-only) nor a fresh clone has, so it could not run
  where it was supposed to.
- `scripts/design-audit.mjs`, `scripts/probe-mobile-audit.mjs`,
  `scripts/probe-seo-audit.mjs` and `scripts/optimize-images.py` — superseded by
  the E2E suite and `scripts/live-smoke.mjs`.
- `STATE.md`, `LOOP.md`, `loop-budget.md`, `loop-constraints.md`,
  `loop-run-log.md`, `skills-lock.json` and `.claude/` — automation scaffolding
  that described a workflow rather than the product.
- `docs/research/components.md`, `docs/research/framer-animation-patterns.md`,
  `docs/research/image-skills-and-visual-judgment.md`, both SEO research dumps,
  `docs/plans/` and `docs/screenshots/` — notes from the design process,
  superseded by the ADRs and by the site itself.
- `deploy/nginx/` — a second nginx vhost pair for a host we no longer deploy to.
- 17 third-party vendor logo SVGs in `public/images/logos/` and six unused
  images. Nothing referenced them; the logo strip they were built for was
  removed.
- `screenshot-reference.png`.

### Fixed

- **The accent failed WCAG AA on every panel.** The previous brass accent was
  chosen for contrast on the canvas but measured 4.25:1 on a panel, and it is a
  text tone (the wordmark tail, the hero's ordinal labels, inline links, the
  cookie-banner link), so axe failed colour-contrast on all nineteen routes. The
  re-skin replaces the value entirely: lime is themed as a pair, so the light
  theme reads the same accent as a deep olive that clears AA on its lightest
  panel, and the dark one as a pale lime that clears it on its darkest.
- **An E2E assertion had one theme's accent hardcoded.** *positioning: the
  Naivolabs column is the accent one* compared the checkmark against a literal
  `rgb(… )` from the dark theme, so it only held while the suite happened to run
  dark. It now reads the live accent token.
- **The E2E consent helper wrote a record the app discarded.** `readConsent`
  rejects a stored record whose `version` does not match, and the helper only
  got one by accident (`version` was smuggled in through a default object). Every
  test that seeded consent was one refactor away from the cookie banner
  rendering over its captures. The helper now builds a proper record from
  constants imported from the app.
- The production CSP no longer allows `app.dograh.com` / `api.dograh.com`. It
  still listed the voice-widget origins after the widget itself was removed.
- Stale E2E specs that described a page which no longer exists: a tabbed
  capability control, a `01/`-prefixed FAQ, and a logo strip all still had
  assertions. INP is now measured on the FAQ accordion on `/capabilities`
  (the home page is deliberately link-only, so it has no interaction to time),
  and the console-error filter no longer excuses errors from origins the site
  does not load.
- Visual goldens were deleted rather than kept. They had been recorded before a
  redesign and comparing against them would have reported accurate drift as a
  pass. The set has since been re-recorded against the current design with
  `npm run test:e2e:visual:update`.
- `favicon.ico` is now declared in the document head. It was being generated and
  asserted by the E2E suite but never linked, so it was only reachable by
  browsers guessing at the conventional path. `favicon-64.png` was dropped: no
  document, manifest or `.ico` container referred to it.
- **The scroll-reveal system was documented as removed but was still running.**
  ADR-004 described a policy of "content is present from first paint", and
  `src/motion.ts` stated it, while sixteen components and eight pages still
  faded every section in from `opacity: 0` behind an IntersectionObserver. All of
  it is gone: the four reveal helpers no longer exist in `src`, and two media
  fade-ins became plain elements.
- **Three of the six text tones failed WCAG AA.** `--color-muted` was 4.2:1 on
  the footer's surface and `--color-steel` (input borders) was 2.0:1, below the
  3:1 non-text floor, so axe failed all nineteen routes. The ladder is now three
  tones (`paper`, `ash`, `fog`) that clear AA on every surface they can land on,
  plus `slate` for non-text use only. Placeholders were moved off `slate`, and
  both failing tokens were deleted rather than darkened into duplicates.
- **The headline read "Intelligence thatfinishes the work."** when selected,
  copied, or parsed by anything that flattens block boundaries: the two masked
  lines are separate block boxes with nothing between them in the DOM. An
  explicit space now separates them (invisible in layout, because whitespace
  between block boxes collapses).
- **Touch targets under 44px on the footer, in the menu, and in landscape.** The
  footer's link and contact rows were 40px, the hero's CTA measured 32px on a
  landscape phone, and the mobile menu's CTA 28px.
- **`/deployment-patterns` had no closing call to action.** Every other page
  ends with the same single ask; this one ended on the last pattern and left the
  reader to find their way back.

## [1.0.0] — 2026-09-23

First production release: the marketing site, the content system and the
single-node deployment.

### The site

- Five-section home page: hero, four capabilities, four deployment patterns,
  three commitments, one call to action.
- `/capabilities` (governance and the ten-stage deployment model),
  `/deployment-patterns` and a page per pattern, `/about`, `/blog` and a page per
  post, `/contact`, `/privacy`, `/terms`, `/ai-automation-nairobi`, and a
  branded 404.
- Legacy `/case-studies` URLs redirect to `/deployment-patterns`.

### The design system

Near-black canvas (`#0e100f`), near-white headings and sage secondary text, and a
single pale-lime accent (`#f3ffc9`) used as both statement type and a fill.
Inter for statement and reading, JetBrains Mono only for genuine data — one
grotesk, with hierarchy carried by size and weight.
Generously rounded panels (20-30px) with pills reserved for actions; elevation
from a lifted fill and spacing rather than glows or gradient washes.

Motion is one orchestrated page load plus motion that answers the reader.
Animate only `transform` and `opacity`; `prefers-reduced-motion` is a hard floor.
Rationale: [`ADR-002`](docs/decisions/ADR-002-design-system.md) and
[`ADR-004`](docs/decisions/ADR-004-motion.md).

### The content system

Self-hosted Payload CMS 3 in `cms/` managing blog posts, deployment patterns,
FAQs, contact details and contact-form submissions, with an admin panel at
`cms.naivolabs.com/admin`. Every fetch on the site falls back to bundled content
in `src/data/content.ts`, so a CMS outage cannot break a page.

### The deployment

One Hetzner Cloud server running Caddy (automatic TLS, HTTP/3), an nginx
container serving the static build, the CMS, PostgreSQL 16 on an internal-only
network, a nightly verified `pg_dump`, and an off-box copy of those dumps.
Releases are gated on migrations completing and on both services reporting
healthy, and roll back by image tag. Rationale and runbook:
[`docs/research/hetzner-deployment.md`](docs/research/hetzner-deployment.md) and
[`deploy/README.md`](deploy/README.md).

### Verification

`npm run typecheck`, the production build, and the Playwright suite: functional
coverage on desktop and phone, axe (WCAG 2.0/2.1 A + AA) on every route, Core Web
Vitals and per-route transfer budgets, and visual goldens for the home-page
sections, every route and 390px.
