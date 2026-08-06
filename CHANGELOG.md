# Changelog

All notable changes to the AIthor clone are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **GitHub Action: automatic CMS migrations** (`.github/workflows/cms-migrate.yml`, 2026-08-06):
  runs `npm run migrate` against the production Postgres database on every push
  to `main` that changes `cms/` (or on manual `workflow_dispatch`), so the
  schema is always ready before the CMS deploys. Uses repo secrets
  `CMS_DATABASE_URL` + `CMS_PAYLOAD_SECRET` (with a fail-fast check that both
  are configured); optional `VERCEL_CMS_DEPLOY_HOOK_URL` triggers the Vercel
  CMS deploy only after migrations succeed. Documented in `README.md` +
  `cms/README.md`.

### Fixed
- **Payload DB migrations were untracked — production deploy blocker** (2026-08-06
  daily triage): `cms/src/migrations/` (generated after the previous commit) was
  never committed, and Payload does **not** auto-create tables in production —
  the schema comes from `payload migrate`, which reads those files. A fresh
  Neon/Vercel database would have been empty and the documented "seed once
  against production" step would have failed. Fixed: migrations tracked in git,
  `migrate` npm script added to `cms/package.json`, and the deploy guides
  (`README.md` + `cms/README.md`) now run `npm run migrate` **before** `npm run
  seed`. Verified end-to-end: migration applied to a scratch Postgres 16
  container (all 21 tables created), then `npm run seed` against that schema
  succeeded (4 posts, 3 case studies, contact-info + faqs globals, admin user);
  CMS `next build` clean; full E2E suite 60/60.

### Added
- **Payload CMS (`cms/`) — full content management for blog + contact details**
  (2026-08-05, operator request: "create an admin CMS for managing blogs and
  contact us page details… fully works and syncs to the live website"):
  - Scoped via `npx skills find cms` → installed the `payloadcms/payload`
    skill; Gravity Index compared Contentful/Sanity/DatoCMS/Prismic; operator
    chose **Payload (self-hosted) + Vercel hosting**.
  - `cms/` is a Payload 3.87 app (Next.js, SQLite for local dev; Neon Postgres
    + Vercel Blob for production). Content model: `blog-posts` collection
    (title/slug/category/date/order/image/author/excerpt/paragraphs + draft/
    publish workflow), `media`, `inquiries` (contact-form submissions — public
    create, admin-only read), `contact-info` + `faqs` globals. Public REST reads
    published posts only; all writes admin-only. Admin panel at `/admin` with
    Logitech branding. `cms/src/seed.ts` imports the site's existing content
    (idempotent) and creates the admin user.
  - **Site sync:** `src/lib/cms.ts` + `CmsProvider.tsx` fetch blog posts,
    contact info, and FAQs from the CMS REST API on load when `VITE_CMS_URL` is
    set, with **graceful fallback to the bundled static data** on any error.
    Contact form POSTs to `/api/inquiries` when the CMS is configured. With no
    `VITE_CMS_URL` the site is byte-for-byte the previous static site.
  - FAQ numbering moved out of the data into the component (so static and
    CMS-sourced FAQs render identically); `src/data/content.ts` now exports
    `contactInfo` + `faqs` as the static fallback.
  - Docs: `docs/decisions/ADR-007-cms-architecture.md`, `cms/README.md`,
    `.env.example`, README section.
  - Verified: seed imports 4 posts + contact + 7 FAQs; REST API returns all
    content in the site's display order; end-to-end sync probe (build with
    `VITE_CMS_URL=http://localhost:3100`) confirmed blog cards, post detail,
    contact info, and a form submission that landed in the CMS inquiries
    collection; admin login works. Full E2E suite still **60/60** (static mode),
    typecheck + build green.

### Added
- **Vercel deploy readiness (2026-08-05, operator: "ensure the website is ready
  for deployment to vercel")**:
  - `vercel.json` (site): **SPA fallback rewrite** `/(.*) → /index.html`
    (required — the site uses `BrowserRouter`, so deep links like `/blog/:slug`
    would 404 without it) + cache headers (hashed assets/fonts immutable,
    images weekly, favicon daily).
  - README: full step-by-step deploy guide for BOTH Vercel projects — site
    (root dir `./`, Vite, optional `VITE_CMS_URL`) and CMS (root dir `cms/`,
    Next.js, env: `DATABASE_URL` Neon, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`,
    `CORS_ORIGINS`).
  - CMS root `/` now redirects to `/admin` (replaces the Payload template demo
    page); removed the stale `pnpm` engines constraint (project uses npm).
  - `.gitignore`: added `.env*` and the raw `logitech logo.png` source (the
    optimized copy in `public/images/` is what ships).
  - Verified: **CMS production build** (`next build`) passes for the first
    time; site production build passes; SPA fallback smoke-tested (all 8
    routes incl. deep links + unknown paths → HTTP 200); full E2E suite
    **60/60**; both typechecks clean.

### Added
- **taste-skill skills installed globally + adapted for any-agent use**
  (2026-08-05): all 13 skills from `Leonxlnx/taste-skill` are installed at
  `~/.agents/skills/` (the cross-agent AGENTS.md location, PC-wide). The
  installed copies were adapted so they work with ANY coding agent, not just
  the Claude-Code-packaged repo: `image-to-code` lost all 16 Codex-only
  references, `stitch-design-taste` was reframed as agent-agnostic (Stitch is
  optional), and an "agent-agnostic" note was added to `image-to-code`.
- **E2E stability**: `e2e/global-setup.ts` warms every route in a real browser
  before the suite starts; `e2e/chromium-options.ts` is the single shared
  Chromium launch config.
- **Playwright E2E testing** (`@playwright/test` 1.62.1 + `playwright.config.ts`):
  full browser test suite in `e2e/` covering all routes (heading, zero console
  errors, no horizontal overflow), nav, rebrand checks, no buy-sticker,
  integration marquee animation, animated Work-automated chart, WhyUs X/check
  glyphs, FAQ accordion, pricing, contact form validation + submit, footer
  newsletter, and mobile (Pixel 7) hamburger menu / touch targets / 390px
  overflow. Uses the system Chromium (no browser download). Run with
  `npm run test:e2e`; desktop + mobile projects, 28 tests green.
- **playwright-best-practices skill** installed to
  `.agents/skills/playwright-best-practices/`.
- **Integration logo marquee** (`src/components/IntegrationMarquee.tsx`): the
  operator-provided dual-row infinite marquee now lives inside the **Data &
  Integrations** service card, matching the pasted component's exact look: white
  tiles (`bg-white`, gray-100 border, `shadow-sm`, radius 12), zinc-700 brand
  glyphs at 20px in 44px tiles, hover `scale-110`, row 1 scrolls left / row 2
  right, 35s linear, pause-on-hover, edge fades to the card `#151619`,
  `prefers-reduced-motion` honored. Full glyph set: GitHub, HubSpot, Figma,
  Zapier, Slack, Trello, Twitter (bird), YouTube, Twitch / Chrome, Claude
  (spark + crosshair), CodePen, n8n (nodes + links), Dribbble, Framer, GitLab,
  Hexagon, Layers — inlined as SVG (this lucide-react version ships no brand
  icons). 72 glyphs render (18 × 4 seamless copies).
- **Animated "Work automated" chart** in the Business Consulting card: Jan +20% →
  Apr +51% bars grow in sequence on scroll into view (was a static ROI chart). The
  duplicated standalone "Work automated" section was removed.
- **Animated workflow rows** in the Workflow Automations card (staggered slide-in).

### Changed
- **Service-card illustrations rebuilt to the original's light theme + looping
  animations** (measured live on aithor.framer.website):
  - All three illustration panels are now `#e5e5e5` (was dark `#151619`).
  - **Workflow card:** `#f0f0f0` rows (radius 10) with dark `#151619` 50×50 chips
    (radius 7); chip icons **spin ~180° sequentially with spring overshoot
    (icon1 → icon2 → icon3) then loop forever** — the rows themselves are static,
    matching the original. Row copy matches the original exactly ("AI enriches &
    scores it / Under 30 sec · Automated", "0 Manual handoffs"); green status
    text replaced with the original's `#4f4f4f` 20px status checkmark.
  - **Data card marquee:** tiles now `#e5e5e5` with `#f0f0f0` inner chips (radius
    10) and dark icons; row 1 scrolls **right** and row 2 **left** (measured
    directions — was row 1 left / row 2 right); edge fades to `#e5e5e5`.
  - **Business Consulting chart:** light theme (all bars `#e5e5e5`, radius 8, with
    a `#f0f0f0` cap strip; black labels; no orange bar), bars grow Jan→Apr
    sequentially, **HOLD, then RESET and LOOP forever** (measured cycle ≈4s).
- **E2E:** chart test now asserts the looping height animation; locator scoped to
  the card via the heading parent.

### Fixed
- **Mobile/tablet overflow on service cards:** the 3-card grid blew out to a
  2088px-wide single column below 768px (marquee row sized the implicit `auto`
  grid column). Base grid is now `grid-cols-1` with `min-w-0` on cards, and the
  breakpoints now match the measured original exactly: **≤800px 1 column,
  810–1180px 2 columns + third card full-width, ≥1200px 3 columns** (was 3-col
  from 768px). Verified 390/768/900/1100/1280px — zero overflow.
- **Flaky FAQ E2E test:** scroll helper now uses direct `window.scrollTo` instead
  of `scrollIntoViewIfNeeded` (races with Lenis smooth scroll).
- **WhyUs icons:** light columns (Freelance / Other Agencies) keep the dark-gray X;
  the dark "Working with Us" column now uses `#ff3700` **checkmarks** (measured on
  the original).
- **Case Studies page heading:** now "Real problems, real outcomes." (matches the
  original; was "Real business results.").
- **Buy-template sticker removed** per operator instruction (`BuyTemplate.tsx`
  deleted, `Layout` no longer renders it, `buyTemplateUrl` export dropped).

### Changed
- **Rebrand: AIthor → Logitech Consultants** (operator: "the name of the company is
  Logitech Consultants") across Nav logo, Footer brand + copyright, FAQ, testi-
  monials, About mission copy, contact email, and `index.html` title/OG tags.

### Fixed
- **Section backgrounds (major fidelity correction):** the original has **no
  full-bleed `#e5e5e5` section panels** — every section sits transparent on the page
  `#f0f0f0`, with `#e5e5e5` only on individual cards/rows (verified-scroll pixel
  ground truth, 2026-08-04). `section-panel-light`/`-dark` are now transparent;
  cards flipped `#f0f0f0 → #e5e5e5` across Services, Benefits, Process, WhyUs,
  CaseStudyRow, and Testimonials.
- **Process dark step:** moved from step 03 to step 02 (matches original).
- **Testimonial marquee fade edges:** now fade to the page `#f0f0f0` (not `#e5e5e5`).
- **Sub-pages flattened to light theme:** About, Contact, Case Studies, Blog, Blog
  Post, and Case Study Detail now render dark text on the light page instead of
  dark-hero styling; contact form fields are transparent with `#0a0a0a` borders and
  the contact info cards stay dark `#151619` (measured on original).
- **FAQ white-on-white bug:** heading is now `#0a0a0a` on `#e5e5e5` radius-16 rows;
  two-column layout; `#ff3700` plus icon; accordion a11y (aria-controls,
  role=region).
- **Blog image zoom removed** (original has no image zoom on hover).
- **Nav touch targets:** all visible nav links and the "Book a call" pill now meet
  the 44px minimum.

### Changed
- **Pricing rebuilt** to the measured original structure: light `#f0f0f0` card +
  `#e5e5e5` inner layer + dark `#151619` top block (name/subtitle/badge/price/CTA);
  hover is a soft layered shadow (no bg change).
- **Section labels** to `#0a0a0a`, 11.2px, weight 600 (was 14px).
- **Design tokens** in `src/index.css`: `--color-bg-page: #f0f0f0`,
  `--color-bg-card: #e5e5e5`; removed the obsolete `--color-bg-panel`.

### Fixed
- **`tsc -b` build error (TS5011):** added `"rootDir": "src"` to `tsconfig.json`
  so `npm run build` passes (typecheck already passed; build-mode `tsc -b`
  requires an explicit rootDir when `outDir` is set).
- **E2E flakiness eliminated (root cause):** the suite previously ran against
  `vite dev`, whose on-demand module compilation raced parallel workers on a
  cold start (failures "moved" between runs: /about h1, contact form, nav). The
  suite now builds the app and serves the static production build via
  `vite preview` — no compile races; verified **28/28 on four consecutive runs**.
- **Visual-spec reveal race (2026-08-05, latent root cause #2):**
  `settleReveals` swept the page in 720px jumps with a 60ms dwell, racing
  framer-motion's IntersectionObserver. Under CPU contention below-fold
  `whileInView` reveals fired (sections/rows appeared); under light load they
  didn't — so the route goldens captured pages with below-fold content
  **invisible** and the same test flipped pass/fail run-to-run (measured:
  route-case-studies rows 2–3 appear at `--workers=2`, stay hidden at
  `--workers=1`; the earlier "60 passed" runs only passed because the capture
  happened to match the invisible goldens). `settleReveals` now sweeps in fine
  150px/50ms steps and then force-fires any element still at its hidden
  opacity-0 state with a **multi-pass** scroll-into-view loop (reveals are
  `once: true`, so already-fired elements are unaffected). The route tests now
  also assert that **zero** rendered reveals remain hidden before screenshotting
  — so a reveal that ever silently fails to fire fails the test loudly instead
  of re-capturing a content-invisible golden (this guard immediately caught one
  late-firing reveal on /about that the 80ms force-fire dwell had missed). The 4
  stale route goldens (about, case-studies, case-study-etery, blog-post) were
  regenerated with fully-revealed content. Full suite now **60/60 on consecutive
  `--workers=2` runs**; visual spec green at both `--workers=1` and
  `--workers=2`.
- **Contact success message em-dash → period** (taste-skill copy self-audit):
  "Thanks {name}. We'll get back to you...".

### Changed
- **E2E server:** `playwright.config.ts` webServer is now
  `npm run build && npm run preview -- --port 4173 --strictPort` with
  `reuseExistingServer: false` (a lingering preview server would otherwise
  silently serve a stale build) and workers pinned to 2 (documented-green;
  CI stays single-worker). Shared Chromium options extracted to
  `e2e/chromium-options.ts`.

### Added
- **CHANGELOG.md** — this file (kept updated with every change from now on).

## [2026-08-03] — Fidelity-gap fixes

### Added
- **Global fixed Buy-template block** (`src/components/BuyTemplate.tsx`), rendered
  once in `Layout` (all routes): fixed bottom-right (right 20 / bottom 60), 142×145,
  `#1c1c1c`, radius 10, links to the Polar checkout. Visible on mobile. Focus-visible
  ring added for a11y.
- **Docs:** `docs/decisions/ADR-006-fidelity-gaps.md`,
  `docs/research/components.md` "Fidelity-gap verification" section.

### Fixed
- **Once-only scroll reveals** confirmed and kept (`src/motion.ts`, `once: true`).
- **No parallax** anywhere (original has none).
- **Nav** no longer contains a "Buy template" link (original has only "Book a call").

### Notes
- Testimonials marquee is an **operator-mandated** MagicUI-style deviation: the
  original's testimonials are static, but the two-row 35s marquee stays per operator
  instruction.

## [2026-08-02] — A11y pass

### Added
- Designed keyboard focus rings (accent `#ff3700`, offset 3px, follows element
  radius).
- Skip-to-content link in `Layout` (first tab stop, WCAG 2.4.1).

### Fixed
- Consistent focus/ring treatment on form fields.

## [2026-08-01] — Baseline

### Added
- Initial clone of aithor.framer.website: multi-page routing (Home, About, Case
  Studies, Case Study Detail, Blog, Blog Post, Contact), light theme, self-hosted
  Halant/Geist/Fragment Mono fonts, Lenis smooth scroll, framer-motion reveals.
- ADRs 001–005, research docs, asset download script.
