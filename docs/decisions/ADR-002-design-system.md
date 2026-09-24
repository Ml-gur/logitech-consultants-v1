# ADR-002: The design system — near-black canvas, one pale-lime accent, one grotesk

## Status

Accepted (supersedes the warm-charcoal/bone/brass system of 2026-09-23)

## Date

2026-09-23

## Context

The first iteration of this site wore the default uniform of an applied-AI
company: indigo and electric blue on a blue-black canvas, a radial glow behind
the hero, a floating blurred pill navigation, 30px radius on every surface, an
all-caps tracked eyebrow above every section, monospace micro-labels, an arrow
glyph appended to every link, and a headline with a single accent-coloured word.

None of those choices are wrong in isolation. The problem is that they are
*defaults*: they are what you get if you do not decide.

A second iteration replaced them with a warm-charcoal canvas, bone type, a brass
accent and near-square panels — quieter, and defensible, but still a set of
choices made in isolation. The direction that replaced it is taken from a
deliberate reference: a near-black canvas with a faint green cast, a single pale
lime used for both statement type and fills, sage secondary text, generous
rounded corners, and one neutral grotesk carrying the hierarchy. The reasoning
is recorded here rather than in a screenshot so it can be argued with.

The same applied to structure. The home page ran to seven sections, several of
them long-form prose, and carried content that could not be defended: a
fabricated "live deployment" panel (`94%`, `1,240 hours returned`), a stat band
of numbers nobody had measured, and a logo strip of third-party vendor marks
captioned as if they were customers.

## Decision

### 1. Palette: near-black canvas, one pale-lime accent

| Token | Dark (resting) | Light | Role |
|---|---|---|---|
| `--color-ink` | `#0e100f` | `#fbfcf5` | page canvas |
| `--color-carbon` | `#161a18` | `#f2f4ec` | raised panel |
| `--color-smoke` | `#1e2321` | `#e8ebdf` | secondary panel |
| `--color-graphite` | `#33372c` | `#d3d7c7` | strong border / muted surface |
| `--color-paper` | `#f2f4e9` | `#14170d` | headings |
| `--color-ash` | `#c2c8b4` | `#3c4033` | body |
| `--color-fog` | `#9aa189` | `#5c6150` | secondary text, meta, placeholder |
| `--color-slate` | `#6f7666` | `#7f8470` | non-text only: icons at rest, input borders |
| `--color-lime` | `#f3ffc9` | `#4d5c0f` | the single accent |
| `--color-lime-bright` | `#f7ffdd` | `#5f7314` | hover |
| `--color-lime-deep` | `#dcecab` | `#3c4a08` | pressed |
| `--color-on-lime` | `#0e100f` | `#f3ffc9` | text on a lime fill |
| `--color-error` | `#e4746a` | `#a8271f` | form errors |
| `--color-success` | `#7fb894` | `#1f6f43` | confirmations |

The canvas is near-black with a faint green cast rather than a neutral grey: a
grey canvas makes a pale-lime accent read as medical, and the whole system hangs
off that accent.

**Lime is both a fill and the emphasis tone.** It is a button background, the
wordmark's second half, a checkmark, a focused input border, an ordinal label.
It is never used to colour one word inside a sentence.

**The accent is themed as a pair, not a value.** A pale lime on white is 1.1:1
and a deep olive on black is 1.2:1, so the light theme reads the *same* accent
at the opposite end: `#4d5c0f` for text and fills, with `on-lime` pale text
sitting on it.

**Every text tone clears WCAG AA on every surface it can land on.** The light
theme is the hard case, because its panels are lighter than its canvas; the
tones are chosen against `smoke`, the lightest surface they reach. `--color-slate`
stays for non-text use only, at the 3:1 floor. Two tones from the previous system
failed and were removed rather than darkened into duplicates — `--color-muted`
(4.2:1 on a panel) and `--color-steel` (2.0:1). The axe run in
`e2e/accessibility.spec.ts` is what caught that, and what caught the brass accent
failing at 4.25:1 on a panel on all nineteen routes.

**Elevation is a fill plus spacing, with one deliberate exception.** Panels lift
one step off the canvas, and `--shadow-lift` is used sparingly, on surfaces that
genuinely float over content. The exception is the hero: a panel at that size
reads as a hole on a near-black canvas, so `.hero-glow` (`src/index.css`) lays a
single soft, heavily blurred colour field behind it, with a dark scrim over the
copy so the headline is measured against the panel and not against whatever hue
happens to be behind it. It is the only gradient in the system, it is decorative
(`aria-hidden`, no pointer events), and it is deliberately not reused — a second
one would turn the page into a set of washes.

### 2. Type: one grotesk

Inter (400/500) carries statement type, body copy, UI and form text. JetBrains
Mono (400) is reserved for content that is genuinely data — a measure, a step
count, a code fragment — never for decoration.

There is no display face. A second voice competes with the accent for attention,
and the reference direction is a single neutral grotesk in which size, weight and
measure carry the hierarchy. Instrument Serif was therefore retired on
2026-09-23, along with its two subset files, its `preload` entries and
`scripts/fetch-fonts.mjs`. Headlines are never part-coloured and never italicised
for emphasis.

The direction this design was drawn from sets its headline and its stat marks in
a retro dot-matrix face loaded from a font CDN. That face is not adopted, for
three reasons that all point the same way: the production CSP is
`font-src 'self' data:`, so a remote face silently falls back in production (the
exact failure that removed Google Fonts); the file is not licensed for a
commercial site; and a decorative display face on an enterprise page is a
borrowed mannerism rather than a decision. The *idea* behind it — a screen that
reads as engineered rather than decorated — is instead carried by a dot field in
the hero backdrop (`.hero-dots`), which costs about 200 bytes, follows the theme
through `--color-hairline-strong`, and sets no type. `e2e/home.spec.ts` asserts
the statement renders in one face, so a display face cannot be reintroduced by
accident.

The weight list is short on purpose. Inter 600 and 700 and JetBrains Mono 500
were shipped as files and declared as faces while nothing on the site set them:
`grep -c font-semibold src` was 0. Type weight is a token like any other;
declaring a face nothing uses means a browser downloads a file it never renders.

Type scale, from `--text-caption` (12px) to `--text-display` (84px), is declared
in `src/index.css`; components use the token names, not raw pixel values. Body
measure is capped below 80 characters.

### 3. Radii: generous, and pills for actions only

`--radius-panel: 20px`, `--radius-card: 30px`, `--radius-field: 12px`,
`--radius-button`/`--radius-tag`/`--radius-pill: 999px`. Panels and cards are
soft and round; anything you can press is a full pill, so a pill always means
"you can press this". One small radius applied to every surface was the single
strongest template signal in the previous build.

### 4. Dark is the resting state

The dark half of the token set is canonical — it is the one the design is drawn
from, and what a visitor sees before any preference is expressed. Light is the
inversion, available from the toggle or an operating system that explicitly asks
for it. Two consequences:

- The E2E suite pins `colorScheme: 'dark'` (`playwright.config.ts`). Chromium's
  default is a light preference, which would otherwise resolve every run to the
  inversion and leave the canonical design untested.
- `src/index.css` declares `--color-…` values once in `@theme` (the light half)
  and re-declares them under `html.dark`, so every utility resolves to the active
  theme with no `dark:` branch in any component.

### 5. Structure: five sections, and nothing we cannot stand behind

Home is hero → capabilities → deployment patterns → commitments → call to
action. Depth (the deployment model, governance, positioning, the FAQ) lives on
`/capabilities` and `/about`. Section rhythm is `clamp(72px, 9vw, 144px)`.

The header is a floating bar: the wordmark left, the links in a centred pill of
their own, and the one action right — a header-level control rather than a nav
item, because it is the page's action, not a destination. The header CTA is
outlined, so the hero owns the screen's single filled control.

The hero is one full-bleed screen in three regions (`src/components/Hero.tsx`):
a row above the statement, the statement and its single action, and a band of four
numbers along the bottom edge. Every number is checkable against the rest of the
site (the published first-deployment window, the stages of the deployment model,
the dimensions we measure, and the count of benchmarks the company has invented,
which is zero), and the band counts up once on load and skips straight to the
final values under `prefers-reduced-motion`.

**The statement is set in `paper`, not in the accent.** The first version of this
hero set the headline in lime, on the reading that the accent is the statement
tone. At hero size that turned the accent into decoration — a wall of pale lime
that said nothing about where the action is, and it competed with the fill the
hero's button uses. Lime now means "this is the action" or "this is ours"
(fills, links, marks, the wordmark's second half) and never large display type.
The hero's own backdrop is a near-black plate: a low light field, a dot field
that is masked clear where the type sits, and a vignette — lit depth rather than
a colour wash, which is the one thing a large dark panel needs in order not to
read as a hole.

Content rules that follow from the brand's evidence-over-claims position:

- No invented client names, testimonials, statistics or outcome metrics. What we
  publish instead is the dimensions we measure, stated as commitments.
- No third-party vendor logos presented as a client wall.
- No numbered markers on lists that are not sequences.

> The reference direction publishes testimonials, client logos and outcome
> percentages. None of that is adopted here: the visual language is, the
> fabricated proof is not. See the "Evidence over claims" rule in `AGENTS.md`.

### 6. Fonts are self-hosted

Inter and JetBrains Mono are served from `/fonts/`. Google Fonts was removed on
2026-09-23: the production CSP (`font-src 'self' data:`) blocks
`fonts.gstatic.com`, so a remote face was silently falling back in production.
Self-hosting removes the third-party request, the extra DNS/TLS handshake on the
critical path, and the dependency on a service we do not control.

Every face is `font-display: swap`. The two faces on the first-paint path
(Inter 400 and Inter 500) are `preload`ed in `index.html`: together they are
under 40 kB, and preloading them removes the swap reflow on headings and section
labels. JetBrains Mono is not preloaded — it only appears in small numeric labels
further down a page.

### 7. Motion: one orchestrated moment

The hero runs a single staggered load sequence. Everything below the fold is
present. See ADR-004.

## Consequences

- All components read tokens from `src/index.css`. Adding a raw hex value or an
  arbitrary radius in a component is a review failure.
- A single accent means an accent always means the same thing: this is the
  action, or this is ours.
- The palette is verified by the accessibility suite (`e2e/accessibility.spec.ts`)
  and by explicit assertions that the home-page headline renders in one colour and
  in one face, and that the hero carries exactly one filled action
  (`e2e/home.spec.ts`).
- `scrollbar-gutter: stable` is set on `html`. Without it the content box is
  ~15px wider on pages short enough not to scroll, so moving between a short page
  and a long one shifts the entire layout sideways — a layout shift on every
  route change, and the reason a full-page visual golden could not settle.
- `public/favicon.svg` is a flat lime tile with an ink glyph — no gradient, which
  turns to mud in a 16px browser tab.
- `scripts/generate-brand-assets.mjs` renders the PNG icons and `og-image.png`
  from the same tokens; run it after changing the palette.
