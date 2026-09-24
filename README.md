# naivolabs.com

The Naivolabs website, and the content system behind it.

Naivolabs is an applied AI systems company. The site's job is narrow: explain
what we build, show the deployment patterns we work from, and get a qualified
enquiry into a conversation. It is not a blog with a landing page bolted on, and
it deliberately does not publish client logos, testimonials or outcome metrics —
see "Content rules" below.

```
Internet
   │
   ▼
Caddy  (443/80, automatic TLS, HTTP/3)          deploy/Caddyfile
   ├── naivolabs.com       → site  (nginx, :8080)   static Vite build
   └── cms.naivolabs.com   → cms   (Next.js, :3000) Payload admin + REST API
                                    │
                                    └── db (PostgreSQL 16)   internal network only
```

One `docker compose` stack, one Hetzner server. The reasoning is in
[`docs/research/hetzner-deployment.md`](docs/research/hetzner-deployment.md);
the runbook is [`deploy/README.md`](deploy/README.md).

---

## Quick start

Requires Node 20+.

```bash
npm install
npm run dev            # http://localhost:3000
```

The site runs with zero configuration: all content is bundled in
`src/data/content.ts`, and the CMS is optional.

To also run the CMS locally (blog posts, FAQs and contact details become
editable):

```bash
cd cms && npm install && npm run dev     # admin at http://localhost:3100/admin
cd cms && npm run seed                   # import the bundled content + create an admin

# in a second terminal, from the repo root:
VITE_CMS_URL=http://localhost:3100 npm run dev
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on :3000 |
| `npm run typecheck` | `tsc` over `src` and the E2E suite (two projects) |
| `npm run build` | typecheck, then the production build into `dist/` |
| `npm run preview` | serve the production build locally |
| `npm test` | alias for `typecheck` — the real suite needs a browser and a build |
| `npm run test:e2e` | full Playwright suite (builds, serves on :4173, runs) |
| `npm run test:e2e:mobile` | phone project only |
| `npm run test:e2e:visual` | visual goldens only |
| `npm run test:e2e:visual:update` | regenerate goldens after an intentional change |
| `npm run brand-assets` | regenerate favicons and `og-image.png` |

Run `npm run typecheck && npm run test:e2e` before claiming a change is green.

## Stack

React 19 · Vite 8 · TypeScript (strict) · Tailwind CSS v4 · framer-motion ·
react-router-dom 7 · Payload CMS 3 in `cms/`.

Why this stack, and what was rejected: [`ADR-001`](docs/decisions/ADR-001-stack.md).

```
src/
  main.tsx              route table + lazy boundaries       ADR-003
  index.css             design tokens (@theme)              ADR-002
  motion.ts             the only place timings are declared ADR-004
  lib/
    brand.ts            company identity, messaging, contact details
    Seo.tsx             per-route title/description/canonical/OG/JSON-LD
    cms.ts              Payload client, every fetch falls back to bundled data
    CmsProvider.tsx     loads live content, merges over the fallback
    cookieConsent.ts    consent state (localStorage)
    useLenis.ts         smooth scroll, off for reduced motion
  components/           presentational, shared across routes
  pages/                route-level compositions, each code-split
  data/content.ts       bundled content = the CMS fallback
e2e/                    Playwright suite (functional, a11y, perf, visual)
cms/                    Payload CMS — its own app, its own image
deploy/                 Docker Compose stack, Caddy, cloud-init, runbook
docs/                   decisions (ADRs) and research
```

## Content rules

These are brand rules, not style preferences, and the E2E suite enforces several
of them.

- **The name is one word: `Naivolabs`.** Never "Naivo Labs", "NaivoLabs" or bare
  "Naivo" in user-facing copy. Source it from `src/lib/brand.ts` rather than
  typing it inline.
- **Evidence over claims.** No invented client names, testimonials, statistics
  or outcome metrics. Deployment patterns describe what we build and what we
  measure. Named references go live only with the client's written approval.
- **One accent.** Lime (`text-lime`, `bg-lime`) means "this is the action" or
  "this is ours" and nothing else. Never colour one word inside a headline.

## Conventions

- **Design values live in `src/index.css`.** Use the generated Tailwind utility
  names (`bg-carbon`, `text-paper`, `border-hairline`, `rounded-panel`), never a
  raw hex value or an arbitrary pixel radius. Panels and cards are generously
  rounded; pills are reserved for actions. Dark is the resting state — the suite
  pins `colorScheme: 'dark'` so the canonical theme is the one under test.
- **The hero's background loop ships as a 338 kB WebM**
  (`src/components/hero-loop.webm`), picked up by `Hero.tsx` and attached after
  first paint — never under `prefers-reduced-motion`, Data Saver or 2G, and never
  in the light theme. To replace it, drop a new `hero-loop.webm` (or `.mp4`) in
  that directory and delete the old one; the component takes whichever is
  present. Keep it small: it is budgeted like any other asset, and the per-route
  transfer budget in `e2e/performance.spec.ts` counts every byte. The source clip
  this was cut from is a 14 MB H.264 file on a third-party CDN — do not link it
  directly: the production CSP is `default-src 'self'`, and 14 MB per visitor for
  a backdrop is not a trade this site makes.
- **Motion goes through `src/motion.ts`.** One orchestrated moment per page,
  scroll-linked transforms for anything that moves with the page, and
  `MotionConfig reducedMotion="user"` around every animated component.
- **Accessibility is a gate, not a nicety.** `e2e/accessibility.spec.ts` runs axe
  on every route, with no exclusions. Interactive targets are ≥ 44px, form
  controls are ≥ 16px font-size (so iOS does not zoom on focus), and errors are
  wired with `aria-invalid` + `aria-describedby` + a live region.
- **Mobile breakpoints are explicit.** Check 320 / 360 / 390 / 414 / 768 / 1024 /
  1440, and both phone orientations. Nothing may cause horizontal overflow.
- **Every route is code-split** except the home page, with a `<RouteFallback />`
  Suspense boundary. Adding a route means updating `src/main.tsx`,
  `public/sitemap.xml`, `public/robots.txt` and `e2e/global-setup.ts`.
- **CMS content always has a static fallback.** Add content to
  `src/data/content.ts` and map it in `src/lib/cms.ts`; never let a CMS outage
  break a page.

## Testing

The Playwright suite runs against the **production build**, served statically on
:4173, not the dev server — `vite dev` compiles on demand, which raced under
parallel workers and produced failures that did not reproduce against a real
build.

```bash
npm run test:e2e                  # everything, desktop + phone
npx playwright test --grep @smoke
npm run test:e2e:visual           # goldens only
npm run test:e2e:visual:update    # regenerate after an intentional visual change
```

Beyond functional coverage, the suite includes:

- **Accessibility** — axe (WCAG 2.0/2.1 A + AA) on every route, plus the cookie
  banner, plus a keyboard-focus check.
- **Performance** — LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, plus per-route TTFB,
  transfer, JS and image budgets.
- **Visual regression** — home-page sections, the FAQ, every route full-page, and
  390px captures for the sections that have regressed on phones before.

Chromium: the suite uses a system binary (`e2e/chromium-options.ts`, override
with `PLAYWRIGHT_CHROMIUM_PATH`). On a machine without one, run
`npx playwright install chromium`.

## Deployment

Everything runs on one Hetzner Cloud server via [`deploy/`](deploy/README.md).

```bash
# from your machine
rsync -avz --delete --exclude node_modules --exclude .git --exclude dist \
  --exclude cms/node_modules --exclude cms/.next --exclude cms/cms.db \
  --exclude .agents --exclude .github --exclude docs --exclude e2e \
  --exclude test-results --exclude playwright-report \
  ./ deploy@naivolabs.com:/srv/naivolabs/

# on the server
cd /srv/naivolabs/deploy && ./deploy.sh
```

`deploy.sh` dumps the database, builds the images, brings the stack up, and
fails the release unless the site answers `/healthz` and the CMS answers
`/api/access`. Migrations are gated: the CMS container will not start until the
`cms-migrate` one-shot exits successfully.

After a deploy, verify the live origin:

```bash
node scripts/live-smoke.mjs
```

That script loads the deployed site in Chromium, walks client-side routing,
reads the head the way a crawler does, fetches and validates the share image,
checks the brand name appears correctly, and measures horizontal overflow at
390px.

### Environment

| Variable | Where | Purpose |
|---|---|---|
| `VITE_CMS_URL` | site, **build time** | points the site at the CMS. Empty = bundled content only. |
| `VITE_INQUIRY_ENDPOINT` | site, build time | form endpoint, for an email provider |
| `VITE_INQUIRY_ACCESS_KEY` | site, build time | public form key, if the provider needs one |
| `DATABASE_URL`, `PAYLOAD_SECRET`, `POSTGRES_*`, `CORS_ORIGINS` | `deploy/.env` | runtime stack secrets |

`VITE_*` values are inlined by Vite, so changing one requires a rebuild. See
`.env.example` and `deploy/.env.production.example`.

## Decisions and research

- [`ADR-001`](docs/decisions/ADR-001-stack.md) — the stack, and why not Next.js
- [`ADR-002`](docs/decisions/ADR-002-design-system.md) — the design system
- [`ADR-003`](docs/decisions/ADR-003-routing.md) — routing, real URLs, legacy redirects
- [`ADR-004`](docs/decisions/ADR-004-motion.md) — the motion policy
- [`ADR-005`](docs/decisions/ADR-005-cms.md) — Payload CMS with a static fallback
- [`docs/research/hetzner-deployment.md`](docs/research/hetzner-deployment.md) — why the deploy stack looks the way it does
