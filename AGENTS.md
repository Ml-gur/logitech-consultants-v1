# AGENTS.md

Instructions for coding agents working on this repository.

## What this repo is

The Naivolabs website (`naivolabs.com`) — a React 19 + Vite + TypeScript SPA
with Tailwind v4 and framer-motion — plus `cms/`, a self-hosted Payload 3
content management application. Production is a single Hetzner server running
the Docker Compose stack in `deploy/`.

Read before changing anything structural:

- `docs/decisions/` — ADRs. Stack, design system, routing, motion and CMS
  decisions are all recorded here with their reasoning. Cite the ADR if a change
  contradicts one, and update it if the decision is actually changing.
- `docs/research/hetzner-deployment.md` — why the deploy stack looks the way it
  does.
- `README.md` — the contributor guide: commands, layout, conventions.
- `CHANGELOG.md` — what changed and when.

## Commands

```bash
npm run dev          # Vite dev server (http://localhost:3000)
npm run typecheck    # tsc for src AND the E2E suite (two projects)
npm run build        # typecheck + production build
npm run preview      # serve the production build
npm run test:e2e     # Playwright suite (builds + serves on :4173)
npm run test:e2e:visual          # visual goldens only
npm run test:e2e:visual:update   # regenerate goldens after an intentional change
npm run brand-assets             # regenerate favicons + og-image (needs Chromium)
```

`npm test` is an alias for `typecheck`; the real suite needs a browser and a
build. Run `npm run typecheck && npm run test:e2e` before claiming a change is
green.

## Conventions

- **The brand name is one word: `Naivolabs`.** Never "Naivo Labs", "NaivoLabs"
  or bare "Naivo" in user-facing copy. Source constants from `src/lib/brand.ts`
  rather than typing the name, the domain or an email address inline. The E2E
  suite asserts this.
- **Evidence over claims.** Do not add invented client names, testimonials,
  statistics or outcome metrics. Deployment patterns describe what we build and
  what we measure; named references go live only with a client's written
  approval. This is a brand rule, not a style preference.
- **Design tokens live in `src/index.css`** (`@theme`). Use the Tailwind utility
  names (`bg-carbon`, `text-lime`, `border-hairline`, `rounded-panel`), never a
  raw hex value or an arbitrary radius. One accent only (lime), panels and cards
  are generously rounded, pills are reserved for actions. **Dark is the resting
  state**; light is the inversion. See ADR-002.
- **A text tone must clear WCAG AA (4.5:1) on every surface it can land on.**
  That is why there are only three of them (`paper`, `ash`, `fog`), and why
  `slate` is restricted to non-text use: icons at rest, input borders, disabled
  text. Never set a placeholder or body copy in `slate` — a tone that has to be
  darkened until it equals the one above it was never a step in a ladder. The
  accent is a text tone too: lime must clear AA on every surface it lands on, and
  a `lime` fill must keep its `on-lime` label above AA. Add a font weight only
  when something sets it.
- **Motion goes through `src/motion.ts`.** One orchestrated page load; nothing
  else animates on entry. Scroll-driven work uses `useScroll` + `useTransform`.
  Wrap animated components in `MotionConfig reducedMotion="user"`. See ADR-004.
- **Accessibility is a gate, not a nicety.** `e2e/accessibility.spec.ts` runs axe
  on every route with no exclusions. Interactive targets are ≥ 44px, form
  controls are ≥ 16px font-size (iOS zoom), and errors are wired with
  `aria-invalid` + `aria-describedby` + a live region.
- **Mobile breakpoints are explicit**, not implied: check 320 / 360 / 390 / 414 /
  768 / 1024 / 1440, in both phone orientations. Nothing may cause horizontal
  overflow.
- **Lazy-load routes.** `src/main.tsx` code-splits every route except the home
  page; new routes get a `Suspense` boundary with `<RouteFallback />`, plus an
  entry in `public/sitemap.xml`, `public/robots.txt` and `e2e/global-setup.ts`.
- **CMS content always has a static fallback.** Add content to
  `src/data/content.ts` and map it in `src/lib/cms.ts`. A CMS outage must never
  break a page.
- **Never commit a secret.** `VITE_*` values are compiled into the public
  bundle; a private API key must never appear in `src/`. Stack secrets live in
  `deploy/.env` on the server.

## Testing

The suite runs against the production build served statically on :4173, not the
dev server, because `vite dev` compiles on demand and raced under parallel
workers. `reuseExistingServer: false` guarantees it is never a stale build.

Visual goldens are recorded per environment. After an intentional visual change,
regenerate them with `npm run test:e2e:visual:update` and include the regenerated
PNGs in the change; never hand-edit a golden, and never widen a diff threshold to
make a real change pass.

Specs import `test` and `expect` from `./test`, not from `@playwright/test`. That
wrapper waits for the site's webfonts after every navigation (`e2e/fonts.ts`),
because `font-display: swap` plus a machine with no system fonts makes text
measure 0px tall until the real face arrives — which turns any touch-target or
visibility assertion into a coin flip. If you add a spec, import from `./test`.

Windows for the same capture must not move: `scrollbar-gutter: stable` is set on
`html` for that reason. Removing it re-wraps every paragraph on pages that
toggle a scrollbar, which shifts layout between routes and made the
`/capabilities` full-page golden alternate between two heights.
