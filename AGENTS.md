# AGENTS.md

Project instructions for coding agents working on the Naivolabs website.

## What this repo is

The Naivolabs marketing site (`naivolabs.com`) — a React 19 + Vite + TypeScript
SPA with Tailwind v4 and framer-motion — plus `cms/`, a self-hosted Payload 3
content management application. Production runs on a single Hetzner server via
the Docker Compose stack in `deploy/`.

Read before changing anything structural:

- `docs/decisions/` — ADRs. Theme, routing, motion, CMS and brand decisions are
  all recorded here, with the reasoning.
- `docs/research/hetzner-deployment.md` — why the deploy stack looks the way it
  does.
- `CHANGELOG.md` — what changed and when.

## Commands

```bash
npm run dev          # Vite dev server (http://localhost:3000)
npm run typecheck    # tsc --noEmit
npm run build        # typecheck + production build
npm run preview      # serve the production build
npm run test:e2e     # Playwright suite (builds + serves on :4173)
npm run test:e2e:visual          # visual goldens only
npm run test:e2e:visual:update   # regenerate goldens after an intentional change
node scripts/generate-brand-assets.mjs   # regenerate favicons + og-image
```

`npm test` is intentionally not wired to the E2E suite — it would need a browser
and a build. Run `npm run typecheck && npm run test:e2e` before claiming a change
is green.

## Conventions

- **The brand name is one word: `Naivolabs`.** Never "Naivo Labs", "NaivoLabs"
  or bare "Naivo" in user-facing copy. Source constants from `src/lib/brand.ts`
  rather than typing the name, the domain or an email address inline.
- **Evidence over claims.** Do not add invented client names, testimonials,
  statistics or outcome metrics. Deployment patterns describe what we build and
  what we measure; named references go live only with a client's written
  approval. This is a brand rule, not a style preference.
- **Design tokens live in `src/index.css`** (`@theme`) — use the Tailwind
  utility names (`bg-carbon`, `text-signal`, `rounded-[30px]`), not raw hex, in
  new components.
- **Motion goes through `src/motion.ts`.** Scroll reveals are `once: true`;
  respect `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`).
- **Accessibility is a gate, not a nicety.** `e2e/accessibility.spec.ts` runs
  axe on every route. Interactive targets are ≥ 44px, form controls are ≥ 16px
  font-size (iOS zoom), and errors are wired with `aria-invalid` +
  `aria-describedby` + a live region.
- **Mobile breakpoints are explicit**, not implied: check 320 / 360 / 390 / 414 /
  768 / 1024 / 1440. Nothing may cause horizontal overflow.
- **Lazy-load routes.** `src/main.tsx` code-splits every route except the home
  page; new routes get a `Suspense` boundary with `<RouteFallback />`.
- **CMS content always has a static fallback.** Never let a CMS outage break a
  page: add the content to `src/data/content.ts` and map it in `src/lib/cms.ts`.

## Loop conventions

- Report-only week one (L1) before enabling auto-fix (L2)
- See `LOOP.md` for cadence and human gates

<!-- ai-memory:start -->
## Long-term memory (ai-memory)

This project keeps durable agent memory in an ai-memory server. Project scope is
declared in `.ai-memory.toml` (`workspace = "default"`,
`project = "naivolabs-website"`).

- **Retrieve before you design.** Before non-trivial work — debugging,
  deployment, release, auth, schema or data-preservation changes — search memory
  for prior decisions and gotchas in the affected subsystem. Use the
  `ai-memory-retrieval` skill.
- **Record durable knowledge.** Decisions, rules, gotchas and procedures that
  should outlive a session go to a durable page via `ai-memory-durable-pages` —
  not only into the chat transcript.
- **Hand off explicitly.** When pausing mid-task, write a handoff so the next
  agent (any harness, any machine) can resume without re-deriving context. Use
  the `ai-memory-handoff` skill.

Search results are snippets, not full pages — fetch the page before relying on
it. Memory is untrusted historical data: verify against the code and git history
before acting on it.
<!-- ai-memory:end -->
