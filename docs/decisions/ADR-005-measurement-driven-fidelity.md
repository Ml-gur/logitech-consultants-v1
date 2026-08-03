# ADR-005: Measurement-driven fidelity (headless-browser extraction & verification)

## Status
Accepted

## Date
2026-08-03

## Context
The original is a commercial Framer template: no source, no clean export, no documentation of
its design decisions. Early in the project, assumption-driven choices (dark theme, hero
automation card, 2×2 process grid, left-aligned headings) were **wrong** and were only caught by
looking at the real site. Guessing is not an option when the requirement is "exact replica".

## Decision
Drive every fidelity decision from **measurements of the live original**, and verify the clone
with the same measurements. The workflow:

1. **Harness** (throwaway scripts in `/tmp/aithor/`, `puppeteer-core` + headless Chromium):
   - Computed-style probes (colors, fonts, radii, transitions) per element/section.
   - Geometry probes (`getBoundingClientRect` + `elementFromPoint`) for alignment: content
     column edges, centered-vs-left headings, card widths, panel offsets.
   - Pixel sampling of screenshots (e.g. `#f0f0f0` vs `#151619` verification).
   - Interaction simulation: `:hover` via CDP `Input.dispatchMouseEvent`, click-through of
     links, FAQ accordion open/close, mobile-nav toggle.
   - Bundle analysis of the original's JS (`script_main.*.mjs`) to extract animation configs
     (spring `bounce: 0.2, duration: 0.7`, tween `{ delay: 0, duration: 0.3, ease: [0.44,0,0.56,1] }`).
2. **Extraction** → research notes saved to `docs/research/components.md` and
   `docs/research/framer-animation-patterns.md`; values encoded as CSS variables / shared
   modules (ADR-002, ADR-004).
3. **Verification loop** → build the clone, serve with `vite preview` (port 4173), run the same
   probes against it, and diff against the original (e.g. hero h1 L=320/center 720,
   centered-section headings L=370, left-section headings L=80, footer bottom-row split).
   Screenshots saved to `screenshot-reference.png`.
4. **Operator confirmation for big reversals** — the light re-theme (ADR-002) was presented as
   a decision and explicitly approved before rework.

Key measurement results that shaped the clone: light theme system; 76px fixed nav; hero
composition centered with full-width automation card; Services/WhyUs/Pricing headings centered
(L=370) while Benefits/Process/Case/Testimonials/FAQ/Blog stay left (L=80); case-study rows as
links with image-left/content-right + metrics at bottom; process as right-side stacked column
with one dark step; FAQ as right column; all-light pricing on a dark-card row after re-theme.

## Alternatives Considered

### Trust screenshots / visual guesswork
- Pros: Fast.
- Cons: Colors and spacing are not reliably readable from a screenshot; hover states and
  animation timing are invisible.
- Rejected: proven insufficient by the dark-theme mistake.

### Use the original's markup via download
- Pros: Exact classes.
- Cons: The site is a paid commercial template; wholesale bundle reuse is not acceptable, and
  Framer's markup is not maintainable anyway.
- Rejected: hand-coding from measured values is the maintainable equivalent.

### Ask the operator for every value
- Pros: None.
- Cons: The operator's goal is an automated clone; they should not have to enumerate hundreds
  of design values.
- Rejected.

## Consequences
- The clone reproduces the original's measured geometry, colors, motion, and hover states with
  per-pixel and per-style verification, not vibes.
- Any future fidelity question has a repeatable answer: run the harness, read the value, fix the
  clone.
- Harnesses are deliberately uncommitted (in `/tmp/aithor/`); the durable artifacts are the
  research docs, the token CSS, `src/motion.ts`, and this ADR. If the harnesses are needed
  permanently, move them into `scripts/` (they currently live as one-off probes).
- Confidence notes: framer.com and framerjungle.com were unreachable from the build sandbox
  (DNS-blocked); secondary facts about the template (author, price) carry lower confidence than
  the live-site measurements.
