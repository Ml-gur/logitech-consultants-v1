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
| `npm run test:e2e` | Run the Playwright E2E suite (desktop + mobile) |
| `npm run test:e2e:mobile` | Run only the mobile (Pixel 7) tests |
| `npm run test:e2e:report` | Open the HTML test report |

## Testing (Playwright E2E)

The repo includes a full Playwright suite in `e2e/` covering all routes, navigation,
the integration marquee animation, animated service charts, WhyUs icons, FAQ
accordion, contact form validation, footer newsletter, rebrand checks, and mobile
(390px, Pixel 7) behavior — zero console errors and no horizontal overflow are
asserted on every route.

```bash
npm run test:e2e            # full suite (builds + serves production build on port 4173)
npx playwright test --project=desktop-chromium
npx playwright test --project=mobile-chromium
npx playwright test --grep @smoke
```

Included beyond the functional coverage above:
- **Accessibility** (`e2e/accessibility.spec.ts`) — axe-core scans every route
  against WCAG 2.0/2.1 A+AA (desktop project).
- **Performance budgets** (`e2e/performance.spec.ts`) — Lighthouse-equivalent
  lab Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1) plus TTFB / total-transfer
  / JS / image-count budgets per route. Runs serially to avoid CPU contention.
- **Visual regression** (`e2e/visual.spec.ts`) — golden screenshots for the key
  home sections (hero, services, testimonials, metrics, pricing, FAQ, footer),
  every route (full page), plus mobile-width (390px) goldens for the sections
  that historically regressed on phones. CSS animations are frozen at capture
  time; framer-motion loops are masked or waited out.

```bash
npm run test:e2e:visual          # visual goldens only
npm run test:e2e:visual:update   # regenerate after an intentional visual change
```

Notes:
- The suite builds the app and serves it with `vite preview` (static files). This
  is deterministic: `vite dev`'s on-demand compilation was intermittently flaky
  under parallel workers (cold-start races — see `e2e/global-setup.ts`).
- `e2e/global-setup.ts` warms every route once before tests start.
- Uses the **system Chromium** (`/usr/bin/chromium-browser`) via
  `PLAYWRIGHT_CHROMIUM_PATH` (or set that env var to another binary). No browser
  download is required.
- Playwright best-practices guidance lives in `.agents/skills/playwright-best-practices/`.
- HTML reports land in `playwright-report/`; failure artifacts in `test-results/`.

## Architecture

```
src/
  main.tsx            # BrowserRouter + route table (see ADR-003)
  index.css           # Design-system tokens (light theme, ADR-002), marquee keyframes, safe areas
  motion.ts           # Measured scroll-reveal config — single source of truth (ADR-004)
  utils.ts            # cn() class merge helper
  lib/cms.ts          # CMS API client — fetches live content, falls back to bundled data
  lib/CmsProvider.tsx # React context that loads CMS content on mount (see ADR-007)
  components/         # Presentational, shared components (Nav, Footer, Hero, Marquee, …)
  pages/              # Route-level pages (Home, About, CaseStudies(+detail), Blog(+post), Contact)
  data/content.ts     # Static fallback content: case studies, blog posts, contact, FAQs
e2e/
  *.spec.ts           # Playwright E2E suite (site, home, contact, mobile)
  global-setup.ts     # Warms all routes before the suite runs (stability)
  playwright.config.ts
cms/                  # Payload CMS (own Vercel project) — see cms/README.md
  src/collections/    # blog-posts, inquiries, media, users
  src/globals/        # contact-info, faqs
  src/seed.ts         # Imports the site's bundled content into the CMS
  src/payload.config.ts
docs/
  decisions/          # ADRs — read these before changing the theme, motion, routing, or fidelity process
  research/           # Measurement notes extracted from the live original
```

## Content Management (Payload CMS)

The site ships fully static (content bundled in `src/data/content.ts`) and works
with zero configuration. Optionally, a headless **Payload CMS** in `cms/`
manages blog posts, contact details, and FAQs — edits published in the admin
panel (`/admin`) appear on the live site on the next load, no redeploy needed.

```bash
cd cms && npm install && npm run dev    # CMS admin at http://localhost:3100/admin
cd cms && npm run seed                  # import existing content + create admin user
# in a second terminal, from the repo root:
VITE_CMS_URL=http://localhost:3100 npm run dev
```

The site always falls back to the bundled data when the CMS is unreachable or
`VITE_CMS_URL` is unset — the E2E suite tests this static mode. See
`cms/README.md` for collections, access control, and Vercel deployment
(Neon Postgres + Vercel Blob).

## Key decisions

- **ADR-001** — Why this stack (React+Vite+Tailwind) instead of Framer or Next.js.
- **ADR-002** — The light theme (page `#f0f0f0`, panels `#e5e5e5`, dark `#151619` accents only).
- **ADR-003** — Multi-page routing with real URLs (`/case-studies/:slug`, `/blog/:slug`, …).
- **ADR-004** — The measured motion system: spring reveals + CSS marquee + reduced-motion floor.
- **ADR-005** — How fidelity is measured from the live site and verified against the clone.
- **ADR-007** — The CMS architecture (Payload + runtime sync + static fallback).

## Conventions

- TypeScript strict mode; no semicolons; single quotes; 2-space indent.
- Components < 200 lines; split before exceeding.
- Animate only `transform` and `opacity`; honor `prefers-reduced-motion`.
- Never invent design values — measure the live original first (ADR-005).

## Deployment (Vercel)

The repo contains **two independent Vercel projects**: the website (this repo root)
and the CMS (`cms/`). Deploy them separately.

### 1. Website project (this repo root)

1. Push the repo to GitHub, then in Vercel: **Add New → Project → Import** the repo.
2. **Framework Preset:** Vite (auto-detected). **Root Directory:** `./` (the repo root).
3. Build command `npm run build` and output `dist/` are auto-detected.
4. `vercel.json` (committed) provides the **SPA fallback rewrite** — required
   because the site uses `BrowserRouter`; without it, deep links like
   `/blog/some-post` return 404. It also sets immutable caching for hashed
   assets/fonts and weekly caching for images.
5. Optional env var at build time — points the site at the deployed CMS so
   blog posts / contact / FAQs / case studies sync live:
   `VITE_CMS_URL=https://<your-cms-project>.vercel.app`
   (omit to ship the bundled static content — the site works either way).

### 2. CMS project (`cms/`)

1. In Vercel: **Add New → Project → Import** the same repo.
2. **Framework Preset:** Next.js (auto-detected). **Root Directory:** `cms/`.
3. Add the production env vars (Project Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Serverless Postgres (e.g. Neon) connection string — **required** (SQLite is dev-only) |
   | `PAYLOAD_SECRET` | Long random string — **required**; build fails without it |
   | `BLOB_READ_WRITE_TOKEN` | Vercel Blob token — enables image uploads in the admin panel |
   | `CORS_ORIGINS` | Your site's origin, e.g. `https://your-site.vercel.app` |

4. After first deploy, run the seed once against production (from `cms/`) to load
   the initial content + admin user:

   ```bash
   DATABASE_URL=<prod-postgres-url> PAYLOAD_SECRET=<prod-secret> \
   SEED_ADMIN_PASSWORD=<strong-password> npm run seed
   ```

   See `cms/README.md` for the full CMS guide.

### Verify after first CMS deploy

- Admin panel on serverless functions can hit function-size / cold-start
  limits — if `/admin` is slow, bump `maxDuration` or switch the CMS project to
  Vercel Fluid compute.
- With Vercel Blob, uploaded media URLs are remote (`*.blob.vercel-storage.com`)
  — the website uses plain `<img>` tags so it's unaffected; just confirm the
  admin's media previews render.

### Verified

- `npm run build` clean for both projects (site: Vite; CMS: Next.js production).
- Full E2E suite 60/60 against the production build (all routes, mobile,
  a11y, visual goldens, performance budgets).
- SPA fallback verified: `/`, `/about`, `/case-studies/:slug`, `/blog/:slug`,
  `/contact`, and unknown paths all serve the app (HTTP 200).
