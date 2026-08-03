# Plan: Fidelity-gap fixes — Buy-template block (2026-08-03)

Executed with subagent-driven development (fresh implementer per task, task review after each,
final whole-branch review). Ledger: `.superpowers/sdd/progress.md`.

## Global Constraints (binding — from measurement, do not invent values)

- **Buy-template block:** `position: fixed`, `right: 20px`, `bottom: 60px`, **142×145px**,
  `border-radius: 10px`, background `#1c1c1c`, text label "Template" (10px, uppercase,
  `#999`) above a pill button "Buy template" (bg `#f2f2f2`, dark `#0a0a0a` text). Visible on
  **all pages** (measured identical on home and `/blog`) and on **mobile** (measured at 390px:
  right 20 / bottom 60). **No entrance animation** (measured static, opacity 1). Links to
  `buyTemplateUrl` already exported from `src/data/content.ts` (Polar checkout).
- **Nav:** must NOT contain a "Buy template" link (the original's nav has only "Book a call").
  Current `Nav.tsx` already complies — do not add one.
- **Reveals:** stay `once: true` (`src/motion.ts`) — original confirmed once-only. Do not change.
- **No parallax** anywhere (original has none — every hero element measured ratio 1.0). Do not add.
- **No image-zoom hovers** (original has none).
- **Marquee stays as-is** — operator-mandated MagicUI component; the original's testimonials are
  static (measured). Do not remove it and do not change the 35s duration.
- Code style: no semicolons, single quotes, 2-space indent, TS strict, components < 200 lines.
- No regressions to `prefers-reduced-motion` handling or 44px touch targets.

## Research Findings (measured live, 2026-08-03)

| Question | Verdict |
|---|---|
| Reveal re-fire | once-only (case-study row Genesy 1280×470: 16/16 samples no re-animation on re-pass) |
| Hero parallax | none (badge, headline, CTAs all moved exactly 400px / 400px scroll) |
| Testimonial marquee | original is **static** — 78 elements page-wide moved 0px over 2.4s; no `marquee`-named CSS animation; no inline transform animation |
| Buy-template block | fixed bottom-right (right 20 / bottom 60, 142×145, `#1c1c1c`, radius 10), **global** (home + `/blog`), visible on mobile, href = Polar checkout |

## Task 1 — Global fixed Buy-template component (the only code fix)

Extract the Buy-template block out of `src/components/Hero.tsx` into a new
`src/components/BuyTemplate.tsx`, render it once in `src/components/Layout.tsx` (all routes), and
delete the block from Hero.tsx. See `/tmp/sdd/task-1-brief.md` for the exact spec.

## Task 2 — Record findings in docs

Add a "Fidelity-gap verification (2026-08-03)" section to `docs/research/components.md` and add
`docs/decisions/ADR-006-fidelity-gaps.md` capturing: once-only reveals confirmed, no parallax,
marquee is an operator-mandated deviation (original static), and the global fixed Buy-template
block with exact geometry. See `/tmp/sdd/task-2-brief.md`.

## Task 3 — Verification (controller-run)

`npm run typecheck`, `vite build`, then browser probes: buy block fixed (right 20 / bottom 60)
on home, a subpage, and mobile 390px; persists through scroll; href correct; no console errors;
no horizontal overflow; nav unchanged (no Buy-template link).
