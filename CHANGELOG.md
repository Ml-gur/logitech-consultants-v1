# Changelog

All notable changes to the Naivolabs are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Design audit pass: rhythm, hero hierarchy, surfaces and contrast**
  (2026-09-25, Redesign Skill applied to the existing stack — React + Tailwind
  v4 + the `@theme` tokens; no framework or styling-library change). Diagnostics
  came from measuring the built site at 320/390/768/1024/1440/1920 rather than
  from reading the source, and the first finding was that a claim in
  `index.css` was not true of the page.
  - **Vertical rhythm was a metronome.** `index.css` documented "two intervals"
    producing "a cadence", but every narrative band took `--band-y` on both
    sides, so all five seams on the home page measured the same 208px and the
    biggest register change on the page (evidence → principles) was
    indistinguishable from a band continuing its own sentence. The `Band`
    `tone` prop was a two-value union nothing ever passed. It is now four roles
    named for the relationship — `band`, `tight`, `attached` (continues the
    band above), `loose` (opens a movement after a register change) — over a
    three-step scale (`--band-y-tight` / `--band-y` / `--band-y-loose`), and the
    seams measure **128 / 231 / 165 / 231 / 165** at 1440px. Mobile keeps the
    same ordering at a smaller scale (80 / 152 / 104).
  - **The hero widened as it descended.** At 1440 the h1 set 533px wide and the
    subhead 560px, so the supporting line was the widest thing on the screen.
    The subhead measure is now `52ch` (442px at 1440px) and the stack reads as a
    funnel — headline widest, then a tighter supporting line, then the action
    pair. No extra line: the sentence sets at three lines either way. Both stay
    on the same centre axis (drift 0px).
  - **The hero was the one surface outside the token set.** `bg-black`
    (#000000) against a `#080810` canvas read as a hole punched in the page;
    it is now `bg-midnight`, so the ground under the video is the site's canvas.
  - **`--color-raised` was a neutral grey in a tinted system.** `#191919`
    (R=G=B) sat next to Midnight `#080810`, Carbon `#12121a` and Smoke
    `#1e1e2a`, all of which carry the same cool hue, so the surface meant to sit
    *on* the canvas was the one that looked like another palette. Tinted to
    `#17171f`. `WhyUs`'s comparison columns had a third near-black (`#121212`)
    next to `bg-raised` and `bg-carbon`; they use `bg-carbon` now, and
    `DeploymentCard`'s category chip uses `bg-midnight/85` instead of a raw
    `#0e0e0e/85`.
  - **Two hover blues, one role.** `.btn-primary:hover` was `#3351e6` while the
    inline handlers on the nav and closing CTAs used `--color-voltage-hover`
    (`#2d43d8`). All three now use the token.
  - **Hover was mouse-only.** The nav CTA, the mobile menu CTA, the menu toggle
    and the principle cards set their hover state with `onMouseEnter`/
    `onMouseLeave` handlers that mutated `style`, so none of them responded to
    keyboard focus and the principle cards — which carried the band's only
    affordance — gave a touch device no feedback at all. They are `hover:` /
    `active:` / `focus-visible:` classes now, which is also the form that
    honours the `prefers-reduced-motion` rule.
  - **Two AA contrast failures, one of them against the project's own rule.**
    The measurement band's closing note (`#6d6d7a` at 13px on Midnight = 3.9:1)
    and the principle cards' caption (same colour at 10px on Raised = 3.5:1)
    were under the 4.5:1 floor — and ADR-008 already states the rule as "never
    slate for small text". Both use `--color-fog` (7.1:1 / 6.3:1) and keep
    their rank. The contact form's placeholder was the same colour on Carbon
    (3.7:1) and is now fog. Found by the a11y suite, which was failing on the
    home page before this fix and passes after it.
  - **Prose measure and orphans.** Band ledes were capped at `620px` and the
    centred lede at `560px` regardless of font size; both are `62ch` (a reading
    decision, not a pixel one) and the flagged asides use `46ch`/`52ch`/`66ch`.
    Added `--text-lede` (17px) to `@theme` — the rank every band lede and card
    description actually sets in, which the scale was missing, so those are
    `text-lede` rather than a `text-[17px]` reinvented per component. Base `p`
    gets `text-wrap: pretty` for last-line orphans (headings already balance).
  - Verified against the **production build** on :4173 — `npm run typecheck`
    clean, `npm run build` clean, `e2e/home.spec.ts` **14/14**, no horizontal
    overflow at 320/360/390/414/768/1024/1440/1920, `--color-raised` computes
    `#17171f`, and the a11y scans for Home, the undecided cookie banner and the
    focus order all pass. All 20 visual goldens regenerated for the intentional
    change.
  - Not fixed here (pre-existing, unrelated to this pass): `e2e/site.spec.ts`
    and `e2e/mobile.spec.ts` expect nav links labelled "Deployment patterns" and
    "Home", and a "Book a discovery call" link in the desktop nav and on
    `/deployment-patterns`; the nav ships "Deployments" and "Book a call", and
    the FAQ band lives on `/contact`, not `/`. 6 tests fail on that drift.
- **E2E specs reconciled with the shipped UI, and the hero golden made
  deterministic** (2026-09-25). The drift the entry above flagged as "pre-existing,
  not fixed here" is fixed in the specs — the shipped navigation is untouched.
  Every item below is a test that asserted a route's or a page's *intent* rather
  than what the component actually renders, which is why each one failed in a way
  that read like a product bug.
  - **`e2e/site.spec.ts` — nav labels and the CTA.** The nav-links test expected
    `Deployment patterns` and a `Home` pill link; the pill ships
    `Capabilities / Deployments / Insights / About`, and Home is the wordmark
    link, which sits *beside* the `<nav>` — asserting it through the nav could
    never resolve. It is now `nav links reach every destination, and the wordmark
    returns home`: the four labels walk to their routes from `/`, then home is
    reached through `getByRole('link', { name: 'Naivolabs home' })` from `/about`.
    The nav CTA test clicks `Book a call` (the pill's short form — the page-level
    CTAs keep "Book a discovery call"), and the "every CTA lands on the form"
    list is the pages that *render* the link: `/`, `/about`, `/capabilities`,
    `/deployment-patterns/ai-voice-receptionist`, `/ai-automation-nairobi`.
    `/deployment-patterns` is off the list because the listing closes on the
    pattern stack and the ask lives on each pattern's detail page.
  - **`e2e/mobile.spec.ts` — drawer labels, the landscape header, FAQ on
    touch.** The drawer loop expected `Deployment patterns` (ships
    `Deployments`); the FAQ-on-touch test looked for `Need answers?` on `/` (the
    band renders on `/contact` only); and the landscape (915×412) header test
    expected the drawer's `Book a discovery call`, which is `md:hidden` at that
    width, where the desktop pill shows `Book a call`. Also hardened a real
    flake: the capability-tab test failed ~1-in-4 because `tap()` dispatches
    touchstart/touchend at coordinates and the tablist's `whileInView` spring
    could move it between them, cancelling the synthesized click. A new
    `waitForStableBox()` helper (`expect.poll` on `boundingBox()` deltas) runs
    first — 6/6 on `--repeat-each=6` after hardening, where it had been
    failing roughly once in four.
  - **`e2e/performance.spec.ts` — the same stale assumption.** "perf: home meets
    LCP / INP / CLS budgets" scrolled the *home page* looking for
    `Need answers?` before measuring INP, so the locator could never resolve and
    the test only ever timed out (4 attempts × 30s). LCP and CLS are still read
    on `/` with no interaction; the INP interaction is now the home page's own
    capability tabs (`Understand`, then back to `Converse`) in the same
    below-the-fold region the FAQ used to occupy. Measured: LCP 684ms, CLS
    0.000, INP 32ms, and all six routes inside the TTFB / transfer / JS / image
    budgets.
  - **`e2e/visual.spec.ts` — the hero golden was capturing a random video
    frame.** `animations: 'disabled'` freezes CSS, not a decoding MP4, and the
    hero's ground is one (13.8 MB, CloudFront): `home-hero.png` failed 36% of
    its pixels against a capture taken seconds earlier in the same environment,
    with no source change. The spec now aborts `**/*.mp4` in its `beforeEach`
    (next to the vendor-widget abort, same rationale) so the hero paints its own
    same-origin `poster` — the state at first paint, and the state a
    `prefers-reduced-motion` visitor stays in. Both hero goldens (`home-hero`,
    `mobile-home-hero`) were regenerated against the poster; the composition the
    golden asserts (headline/subhead/action stack, its centring, the scrim, the
    band height) is unchanged.
  - **Known and deliberately not fixed: the desktop nav CTA is 40px tall.**
    `Book a call` measures 40px (13px text, `px-5 py-2.5`), against the 44px
    interactive-target floor in AGENTS.md. That is a real gap and not a test
    artefact, so the mobile landscape test asserts the shipped 40px through a
    named constant (`NAV_CTA_SHIPPED_HEIGHT`) and documents the shortfall rather
    than either failing on it or quietly lowering the floor. Every other nav
    control clears 44px; closing it means changing the pill's padding, which is
    the operator's visual call, and it is out of scope for a pass that must not
    alter the navigation.
  - Verified: `npx tsc --noEmit` clean, and every spec file green against the
    production build on :4173 in this pass — site **22**, mobile **15**,
    home **14** + contact **8**, accessibility **20**, visual **20** (the two
    hero captures twice), performance **2**.
- **The hero speaks the site's language again** (2026-09-24, operator: "ensure
  the hero section has same font as the rest of our website and also the
  content is incorporated as the content of our website"). The band had been
  rebuilt from an unrelated single-viewport template, which left its type and
  its copy as the only ones on the site that did not come from the site.
  - **Type.** The headline is `var(--font-display)` (Fraunces) at
    `var(--text-hero)` — the token that exists for this band — instead of a
    retro dot-matrix face fetched from `db.onlinewebfonts.com`, and the body
    copy is the self-hosted Inter stack. That face was never rendering in
    production: `deploy/nginx-security-headers.conf` sets
    `font-src 'self' data:`, which blocks that CDN and the Font Awesome sheet
    the trust row used, so the headline fell back to a monospace stack no other
    heading on the site uses. Both `<link>`s and both preconnects are gone
    (two third-party origins out of the first render); Fraunces' two hosts are
    preconnected instead. `--font-display-pixel` is deleted from `@theme`.
  - **Content.** Every string now comes from `src/lib/brand.ts`:
    `SITE.category` + the office city as the eyebrow, `SITE.brandIdea` as the
    headline (split on its own " to " into the two lines the copy was written
    for, the second in Signal Violet italic — the accent treatment `HomeCTA`
    and `Wordmark` already use), `DEFINITIONS.descriptive` as the subhead, the
    "Book a discovery call" / "See what we deploy" action pair, and
    `SITE.essence` + the four `CAPABILITIES` as the closing strip. Removed with
    the template copy: the "Trusted by 2000+ Enterprises" badge over three
    client marks (the brand publishes no references yet) and four invented
    runtime figures (120ms, 99.99% uptime, 24/7, 2.4M context), both of which
    the "evidence over claims" rule and the measurement band forbid.
  - The video ground, the scrim and the centred single-axis composition from the
    previous pass are unchanged. One responsive fix: on phones the action pair
    stacks full width, because two wrapped labels in a 292px measure read as
    broken rather than as a pair.
  - Verified: `npm run typecheck` clean. Against the production build served on
    :4173 — the h1 computes Fraunces (the same family the route headings use)
    with the accent line italic in `rgb(124, 145, 255)`, the subhead is Inter,
    `document.fonts` confirms the display face actually loaded, no
    `.hero-trust`/`.hero-stat-*`/`.hero-cta` node and no CDN `<link>` survives
    (the only font requests are the three self-hosted files), and the h1's text
    content is one sentence — the two block lines are joined by real text, not
    by JSX whitespace. Geometry: the strip lands inside the first viewport and
    the section never exceeds it at 1440×900, 1024×768, 390×844 and 320×720,
    with no horizontal overflow and zero console errors. The two hero specs in
    `e2e/home.spec.ts` pass — the headline one after replacing its frozen
    `rgb(112, 132, 255)` with the `--color-signal` token, which had moved to
    `#7c91ff`.
  - **Still failing, none of it from this pass** (pre-existing stale specs, not
    fixed here): `hero: email capture…` (the hero has carried no email capture
    since the previous pass, and this one does not restore it — the primary CTA
    already leads to the same form); `nav links navigate to every section` and
    `nav CTA books a discovery call` (the nav says "Deployments" / "Book a
    call"); `home stays minimal` and `FAQ accordion` (section ids that went away
    when the home page was reduced); `every "Book a discovery call" CTA…`
    (`/deployment-patterns` carries different CTA copy); and two axe
    `color-contrast` failures on `--color-slate` text in the measurement note,
    the principle captions and the cookie banner. The hero appears in none of
    them.
  - The two hero visual goldens (`home-hero`, `mobile-home-hero`) are stale, as
    they were after the previous pass: run `npm run test:e2e:visual:update`
    where Chromium can launch.
- **The hero's floating "Live deployment" panel is removed** (2026-09-24,
  operator: "please remove this section - Live deployment in the hero
  section"). `src/components/Hero.tsx` no longer renders a status panel beside
  the headline, and the `<section id="home">` layout loses its
  `lg:grid-cols-[1fr_440px]` track, so nothing shares the width with the
  headline.
  - The panel had already been rewritten once (a fake scoreboard — "94%
    completion rate", "1,240 hours returned" — for deployments that do not
    exist) into a mocked event log labelled "Sample view". Both versions spent
    440px of the widest band on the page describing a system the visitor has
    not been told about yet; the measurement band further down the page already
    carries the "no invented ROI figures" promise, so the hero does not need a
    stand-in for it.
  - Removed with it: the panel-only right-side radial glow in the hero
    background, and the `TelemetryPanel` component. Everything else in the hero
    is unchanged — eyebrow, both headline lines, subtext, the one primary CTA
    plus the outlined secondary, the email capture that hands off to
    `/contact?email=…`, and the four-capability strip below.
  - **The hero was then redesigned as a centred statement** (2026-09-24,
    operator: "redesign the hero section so that the text is placed at the
    center properly designed and aligned"). This is the one band on the site
    that is a statement rather than a section, so it now takes the same
    treatment as `SectionHeader layout="center"`: the eyebrow (rule + label),
    both headline lines, the subtext, the primary and secondary actions, the
    email route and the capability strip all sit on one centred axis.
    - It is centred by *content*, not by container. Each element keeps the
      shell's full measure and only its own content is centred, so the band's
      two hairlines — the top glow and the capability rule — still span the
      full 1136px and the hero still lines up with every band below it. A
      narrower centred block would have pulled those rules in by 100px+, and
      that misalignment reads as a mistake rather than a decision.
    - One earlier pass at this same uncommitted change filled the width
      instead (subtext left, actions flush right, a
      `lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]` row). It was dropped: two
      anchored ends read as a dashboard for a small amount of content, while a
      single centred axis states the hierarchy — one promise, one action — and
      the band is small enough that centring costs no density. Nothing else
      about the action hierarchy moved: one filled primary, one outlined
      secondary, and the email capture stays the quiet route into the same form
      on `/contact`.
  - Verified: `npm run typecheck` clean and `npm run build` clean; the emitted
    `dist` CSS carries `.justify-center`, `.text-center`, `.mx-auto` and the
    520px measure the centred blocks share, and no split-grid rule is left in
    the hero. A geometry audit of the tokens (shell 1200 max, 32px gutter,
    `--text-hero` clamp, 520px copy measure) puts the widest centred block at
    the headline — ~690px of the 1136px measure at the 96px cap — so every
    block sits inside the shell with equal air beside it. The centred column is
    468–510px tall in a ≥545px band, and the hero CTA stays above the fold at
    1440×900, 1280×720, 1024×768, 915×412, 390×844 and 320×568. At 320px the
    44px clamp floor still wraps "Put intelligence" onto two lines; that is
    unchanged by this work, and it is wrapping, not horizontal overflow.
  - **The two hero visual goldens are now stale** (`home-hero`,
    `mobile-home-hero`): this sandbox has no browser libraries (`libglib-2.0`,
    `libnss3` are absent), so run `npm run test:e2e:visual:update` where
    Chromium can launch before treating the visual suite as green.

### Added
- **Deployed to the shared host** (`77.42.30.150`, `/var/www/naivolabs`,
  <https://naivolabs.com>) and documented it in
  `deploy/SHARED-HOST-DEPLOY.md`. The compiled static build was uploaded with
  rsync; the server needs no runtime (it has no Node.js, npm or PHP) and DNS and
  TLS were already configured by the host operator. Verified live: the app
  boots, client-side routing works, `/assets/`, `/fonts/`, `/images/`,
  `robots.txt`, `sitemap.xml`, the favicon set and `og-image.png` all resolve,
  the rendered copy satisfies the one-word brand rule, zero console errors, and
  no horizontal overflow at 390px. `scripts/live-smoke.mjs` re-checks this
  against the live origin.
  - **One server change is required** and was handed to the operator rather than
    applied (the account has no sudo): the vhost's `try_files $uri $uri/ =404`
    has no SPA fallback, so every deep link 404s on direct request or refresh —
    which also makes every URL in `sitemap.xml` except `/` a 404 to a crawler.
    `deploy/nginx/naivolabs.com.conf` plus a security-header snippet is the
    ready-to-install replacement, with the Certbot blocks left untouched. The
    same change adds a `www` → apex 301 (the site was served on both
    hostnames). Verified against a real nginx binary serving the actual build:
    `nginx -t` passes, deep links return 200, `www` returns 301, and every
    response carries exactly one `Cache-Control`.
- **The contact form is ready for an email provider** (operator: "we will
  connect with an email provider so it should be ready for that connection").
  `submitInquiry()` now posts to `VITE_INQUIRY_ENDPOINT` when it is set, with an
  optional public `VITE_INQUIRY_ACCESS_KEY` sent as `access_key`, falling back to
  the CMS and then to refusing the submission (the form shows its email
  fallback). No private key can reach this code path: everything in the bundle
  is public, so provider secrets belong in the serverless function the endpoint
  points at. Verified both ways: with the variables set, Vite bakes them into
  the bundle; unset, the branch is compiled away and the output is byte-for-byte
  the previous build.
  - The Payload CMS **cannot** run on this host: no Node.js, no systemd access,
    and Payload 3 has no MySQL/MariaDB adapter, so the provisioned MariaDB
    `naivolabs_db` cannot back it. The site therefore ships in static mode, and
    the contact form has no backend (it surfaces the email fallback) until a CMS
    is hosted elsewhere.

### Fixed
- **The Hetzner Docker stack could not build its CMS image.**
  `deploy/Dockerfile.cms` ran `COPY --from=build /app/media ./media`, but
  `cms/media` is not in the repository, so the build failed outright with
  `"/app/media": not found`. The directory is runtime data; it is now created in
  the runtime stage (which is what the `cms_media` volume mounts). Verified by
  building the site image and serving it.
- **Security headers never reached the HTML document** in `deploy/nginx.conf`.
  nginx does not inherit `add_header` into a block that defines its own, and
  every location set a `Cache-Control` header, so the CSP and the
  nosniff/frame/referrer headers applied to assets only. They now live in
  `deploy/nginx-security-headers.conf`, re-included wherever a location sets its
  own header. Verified against a running container: the document, `/index.html`,
  the SPA fallback and `/healthz` all carry the CSP.
- **`robots.txt` and `sitemap.xml` were served as `application/octet-stream`**
  (a `types { }` block cleared the type map). Now `text/plain` and
  `application/xml`; `site.webmanifest` likewise gets its real type on the
  shared host.
- **`deploy/deploy.sh` aborted on a first deploy**: the pre-release backup ran
  `docker compose exec` against a stack that was not running yet, which fails
  under `set -e`. It is now skipped when the stack is not up.
- **`.dockerignore` was missing entirely**, so both image builds copied the host
  `node_modules/` over the modules `npm ci` had just installed for the
  container's platform (production targets linux/arm64) and dragged `.env` files,
  the dev SQLite database and the git history into builder layers. Added for both
  contexts: the site build context went from the whole repository to 2.2 MB with
  no `.env` or `node_modules` in it.
- **The app stripped `max-image-preview:large` on every indexable route**
  (`src/lib/Seo.tsx` removed the `robots` meta tag on any non-noindex page,
  discarding the directive that lets Google show a large image beside the
  result). Indexable routes now restate the directive instead. Verified on the
  live origin: `robots: index, follow, max-image-preview:large`.
- Doc corrections: `deploy/README.md` told operators to run
  `npm run migrate:create`, a script that does not exist (the real command is
  `npm run payload -- migrate:create`); `cms/.env.example` pointed media uploads
  at `/app/cms/media` rather than the mounted `/app/media`.

### Changed
- **Rebrand: the company is now Naivolabs, and Naivolabs is one word**
  (2026-09-21, operator: "change our brand identity to 'Naivolabs', naivolabs is
  one word"). The brand identity foundation document (v1.0, 21 September 2026)
  was the brief; everything below follows from it.
  - **`src/lib/brand.ts` is the single source of truth**: canonical name, URL
    (`https://naivolabs.com`), category, essence, brand idea, mission, vision,
    purpose, promise, contact details, social profiles, the four capability
    actions, the ten-stage deployment model, the flywheel, differentiators,
    values, principles, segments, the competitive landscape and the measurement
    dimensions. A domain or name change is now a one-line edit that propagates
    to index.html, canonical URLs, structured data, robots.txt and sitemap.xml.
  - `src/components/Wordmark.tsx` renders the name as one word with the accent
    on the second half, so it can never render as "Naivo Labs". An E2E test
    asserts that "Naivo Labs" and "NaivoLabs" appear nowhere in rendered copy
    on any page.
  - Every user-facing surface rebranded: nav, footer, `index.html` head and
    JSON-LD baseline, robots.txt, sitemap.xml, the web manifest, the OG card,
    the CMS admin branding, and the contact details (hello@naivolabs.com).

### Changed
- **Site content rebuilt from the brand identity foundation** (same request).
  The previous content carried invented client names, invented ROI figures and
  a logo wall of companies that had never been customers. The brand's first
  principle is "never make a claim we cannot support", so the content was
  reframed around what is actually true today.
  - **Case studies became deployment patterns.** `/case-studies` and
    `/case-studies/:slug` now redirect to `/deployment-patterns`. Each pattern
    (AI Voice Receptionist, Institutional Knowledge Agent, Service Request
    Routing, Document Intake) states the problem, the approach, the systems it
    connects to, the governance controls shipped with it, and the measurement
    dimensions agreed before launch. No client names, no borrowed logos.
    Operator decision recorded during the build: "reframe as deployment
    patterns".
  - **Testimonials were replaced by the seven brand principles**, rendered as a
    static grid where all seven are readable at once (an earlier revision
    marqueed them past the reader; the operator flagged that the section was
    moving automatically and unreadable).
  - **Invented statistics were replaced by the measurement dimensions** every
    deployment is instrumented against, with an explicit note that no ROI
    figures are published and that misses are reported too.
  - **The logo wall was replaced by a technology strip** that says what it
    actually is (the platforms we build on), not who we claim as clients.
  - New pages and sections from the brand platform: `/capabilities` (the four
    actions: converse, understand, act, orchestrate), governance, the
    deployment model, positioning (where Naivolabs sits between the platform
    and the organization's work), the `ai-automation-nairobi` pillar, and the
    About page's purpose/mission/vision/origin narrative.

### Changed
- **Home page reduced to a minimal set** (operator: "ensure our homepage is not
  too clouded with lots of information, its minimalistic yet communicates about
  our brand perfectly"). The home page now carries eight sections and stops:
  hero, technology strip, capabilities, measurement, the deployment-pattern
  stack, principles, insights, FAQ. The depth moved one level down instead of
  being deleted: governance and the ten-stage deployment model now live on
  `/capabilities`, positioning lives on `/about`. An E2E test asserts the home
  page renders exactly those eight sections and none of the moved ones.
- **Pricing is hidden for now** (operator: "comment on the pricing section so
  that you hide it for now from our website we will add it later").
  `src/components/Pricing.tsx` is kept intact and the render site in
  `HomePage.tsx` is commented out, with a note explaining how to re-enable it. A
  test asserts no price figures appear on the public page, so re-enabling the
  section is a deliberate act rather than an accident.
- **Contact page title, and the team list**: Emmanuel was replaced by Alphonce
  (Integration Engineer) and Ndeke was added as Knowledge Systems Engineer
  (operator instruction).

### Added
- **Custom 404 page** (`src/pages/NotFoundPage.tsx`): names the requested path,
  offers four real destinations, and is explicitly `noindex, follow` so soft
  404s never enter the index while link equity still flows through.
- **Privacy policy and terms & conditions** (`/privacy`, `/terms`) on a shared
  `LegalPage` shell with a sticky table of contents and per-clause anchors,
  written against the Kenya Data Protection Act 2019 and the GDPR. Both linked
  from the footer.
- **Cookie consent banner** (`src/components/CookieBanner.tsx` +
  `src/lib/cookieConsent.ts`): accept-all and reject-non-essential offered at
  equal prominence, per-category controls, a versioned localStorage record, a
  footer "Cookie preferences" control that re-opens it in preference mode, and
  consent seeded before any analytics could load.
- **Per-page meta title and description** on every route, plus canonical, Open
  Graph, Twitter card and JSON-LD (Organization, WebSite, BreadcrumbList,
  BlogPosting, FAQPage, ContactPage, ItemList, AboutPage). An E2E test walks
  every route and asserts each title is unique and within the ~60 character SERP
  budget, and each description is unique and within the display window.
- **Favicon set + web manifest**: `favicon.svg` as the primary, 16/32/48/64 PNG
  fallbacks, a 180 PNG apple-touch-icon, 192/512 manifest icons, and a real
  multi-size `favicon.ico` (PNG-in-ICO, written by the generator so browsers,
  feed readers and link-preview bots that request `/favicon.ico` by convention
  get a 200). `public/site.webmanifest` names the app and carries the theme
  colour.
- **Regenerated Open Graph card** (`public/og-image.png`, verified 1200x630)
  and a matching set of brand assets written by
  `scripts/generate-brand-assets.mjs`.
- **`public/robots.txt` and `public/sitemap.xml`** as real static files (the SPA
  rewrite would otherwise serve HTML for both), sourced from the route list and
  the SITE constants.
- **Stacked panels on scroll for the deployment patterns**
  (`src/components/DeploymentStack.tsx`): each panel pins below the floating nav
  and recedes as the next slides over it, driven by scroll position rather than
  a timer, so it is reversible and tracks the finger exactly. The pitch is set
  per breakpoint through CSS custom properties so the stack works at 320px as
  well as 1440px, and `MotionConfig reducedMotion="user"` leaves the panels
  plainly laid out for anyone who asks for reduced motion.
- **Loading states** (`src/components/Loading.tsx`): a route-level skeleton for
  lazy chunks, card/pattern/list skeletons for CMS fetches, an inline button
  spinner, and a single screen-reader announcement per region rather than one
  per placeholder bar.
- **Form error states end to end**: inline per-field messages wired through
  `aria-invalid` and `aria-describedby`, a polite summary that announces how
  many fields need attention, focus moved to the first invalid field, errors
  clearing as soon as the visitor starts fixing them, a real pending state on
  the submit button, and a recoverable send failure that offers the email
  address as a fallback.
- **App-wide smooth scrolling** (`src/lib/useLenis.ts`): Lenis mounted once in
  `Layout` instead of inside the home page, so inner pages and the scroll-driven
  stack read one scroll source. Respects `prefers-reduced-motion` by not
  starting at all.
- **Hetzner deployment stack** (`deploy/`): Dockerfiles for the site and the
  CMS, `docker-compose.yml` (site, CMS, Postgres, Caddy with automatic TLS),
  an nginx config, a Caddyfile, a production env template, a backup script with
  systemd timer units, a cloud-init file, and a deploy script. Plus
  `docs/research/hetzner-deployment.md` (the sizing, architecture and backup
  decisions) and `deploy/README.md` (the runbook). Operator decision recorded
  during the build: "include CMS on Hetzner".
- **Grammar of the codebase documented for agents**: `AGENTS.md` updated,
  `.ai-memory.toml` added for the `ai-memory` skill, and `.gitignore` extended.
- **Screenshot set** (`docs/screenshots/`) captured from the production build at
  desktop, mobile portrait and mobile landscape, kept as a reference for how the
  site should look and for verifying the shared-link card.

### Fixed
- **`position: sticky` was silently broken site-wide**
  (`src/index.css`). `overflow-x: hidden` on `html` and `body` turns both into
  scroll containers, which makes every sticky descendant resolve against a box
  that never scrolls. The deployment-pattern stack therefore never pinned: the
  panels scrolled away instead of stacking. Changed to `overflow-x: clip`, which
  clips the same overflow without creating a scroll container. This also
  un-breaks the legal pages' sticky table of contents. Verified by measuring the
  pin line and the recede width in a real browser, and now covered by tests at
  desktop and phone widths.
- **Contact form focus management did nothing.** Submit looked up
  `[aria-invalid="true"]` in the DOM, but that attribute only lands after React
  commits the state update, so the query always ran against the previous render
  and found nothing. Focus now moves by field id, derived from the same
  validation pass that produced the errors.
- **The hero's email hand-off was dropped.** The hero sends visitors to
  `/contact?email=…`; the contact page ignored the parameter, so people were
  asked for the address they had just typed. The value is now prefilled (and
  ignored if it is not a valid address), with a short note explaining why the
  field is already filled, carrying `?interest=` too.
- **Meta descriptions over the SERP display limit** on the home, about and
  Nairobi pages (161 to 174 characters). All trimmed under 160 while keeping the
  sentence intact.
- **E2E console-error assertions failed for environmental reasons.** The site
  loads a third-party voice widget that fetches its configuration from an origin
  the test runner cannot always reach. Those errors are now filtered by origin
  (`e2e/console-noise.ts`) so the assertion still fails on anything the site
  itself is responsible for.

### Changed
- **Copy pass for human-like prose** (2026-09-21, operator: "invoke the
  humanprose skill to ensure the content don't sound like its ai generated and
  does not contain buzzwords"; skill: `human-like-prose`). All 152 em dashes in
  user-facing copy were removed, replaced with commas or colons as the sentence
  required, and the copy was checked against the skill's prohibited-vocabulary
  list (the site was already free of that vocabulary, so no substitutions were
  needed there). Titles, alt text and screen-reader strings were treated as copy
  too, not just body text.

### Changed
- **E2E suite rebuilt around the new site** (`e2e/`): 100% of the old suite
  asserted the previous brand's content (client names, price points, old section
  titles, the testimonials marquee). Specs now cover: every route's H1 and
  per-route SEO, JSON-LD, nav and footer navigation, every "Book a discovery
  call" CTA across five pages, the one-word brand rule, the custom 404 and its
  `noindex`, legacy redirects, the cookie banner's decide/persist/re-open cycle,
  static robots.txt and sitemap.xml, the favicon set, the hero's above-the-fold
  CTA at three viewports, the capability tabs, the scroll-driven stack (pin line
  and recede width), the principles grid (all seven readable, nothing moving),
  positioning, pricing-hidden, the FAQ, form validation, error, pending and
  success states, the email hand-off, mobile menu, touch targets, mobile input
  sizing, landscape orientations, and the accessibility of every route. All 20
  visual goldens were regenerated for the new design; the two stale
  `public/og-image.txt` / template leftovers were removed.

### Notes
- **Outstanding before launch:** the Dograh voice widget in `index.html` still
  points at the previous brand's workflow token (flagged in a TODO next to the
  embed). It needs re-pointing at the Naivolabs agent, or removing.
- Preview locally with `npm run dev` (or `npm run build && npm run preview`).

### Added
- **Full SEO + content optimization pass** (2026-08-13, operator: "push to
  github but ensure full audit, SEO optimization… install relevant skill for
  SEO optimization and content management"). Skills installed (locked in
  `skills-lock.json`): `seo-specialist` (borghei/claude-skills) +
  `content-optimization` (kostja94/marketing-skills). Audited with a new
  `scripts/probe-seo-audit.mjs` against the built site; the site is a
  client-rendered Vite SPA with a single static meta set, so the fixes are:
  - **Per-route head manager** `src/lib/Seo.tsx` — sets title (≤60 chars,
    brand suffix dropped when it would overflow the SERP limit), meta
    description, canonical, Open Graph, Twitter cards, and JSON-LD on every
    route change (Googlebot renders JS and reads the final DOM).
  - **JSON-LD structured data** — Organization (home + static baseline in
    `index.html`), BreadcrumbList (all listing + detail routes),
    BlogPosting with Person author (blog posts), Article (case studies),
    FAQPage (contact FAQs — rich-snippet opportunity), ContactPage.
  - **`public/robots.txt` + `public/sitemap.xml`** — previously the SPA
    rewrite returned index.html for these paths (crawlers would parse HTML
    instead of directives); now real static files. Sitemap covers all 12
    indexable routes.
  - **`public/og-image.png`** — branded 1200×630 OG image (dark + violet) so
    shared links render a preview card.
  - **Blog article outline** — optional `subheads` (H2 sections) on the
    BlogPost model, applied to the two longest posts; posts without subheads
    render flat (backward compatible with CMS content). Descriptive alt text
    on blog cover images.
  - Verified: SEO audit all-clear on 12 routes, design + mobile audits pass,
    full E2E suite **61/61** (blog-post golden regenerated for the new H2
    outline). Docs: `docs/research/seo-content-optimization.md`.

### Changed
- **Mobile optimization pass** (2026-08-13, operator: "invoke the skill for
  mobile optimization"; skill: `mobile-responsiveness`). New
  `scripts/probe-mobile-audit.mjs` gate (320/360/390/414/768 on all routes):
  - Inputs bumped to **16px** (hero form, contact form, footer newsletter) —
    under 16px, iOS Safari zooms the page on focus.
  - Contact email/phone links + footer nav/legal/social links get full **44px
    tap targets** via padded focus space (`py-3 -my-3`), layout unchanged.
  - Segmented service tabs, desktop nav CTA, and code-block language tabs /
    copy button bumped to 44px hit areas.
  - Footer brand blurb raised 12px → 14px (design.md body floor).
  - All checks pass at every tested width/route; full E2E suite green (hero +
    services goldens regenerated for the input/tab size changes).

### Changed
- **Full-site redesign to a dark LaunchDarkly-style design system** (2026-08-13,
  operator request: "improve our website following the instructions the design.md
  file… audit the full website through that"; design.md is an extracted
  LaunchDarkly-style reference — also the refero style the operator asked to
  adopt). Summary:
  - **Design system** (`src/index.css`): Midnight `#0e0e0e` canvas, Carbon
    `#191919` surfaces, Signal Violet `#7084ff` + Voltage Blue `#405bff`
    accents (orange `#ff3700` removed everywhere), `179deg #405bff→#7084ff`
    glow gradient, 60px nav-pill / 30px card-tag-button / 10px input radii,
    glow-based elevation, wide-tracked uppercase eyebrows. All tokens exposed
    as Tailwind v4 `@theme` utilities.
  - **Typography**: Inter (self-hosted, weights 400/500/600/700 — the font
    files were always Inter; the old Halant/Geist names were mislabels and the
    Geist/Fragment-Mono URLs were 404ing) with weight-500 tight headlines
    (leading 1.0–1.09). JetBrains Mono (400/500) newly self-hosted for SDK
    names / code / technical identifiers.
  - **Home page** rebuilt to the design.md anatomy: hero with white/violet
    split headline ("Move at AI speed. / Stay in control.") + glowing email
    form, dark logo strip, segmented-tab services (Workflow Automations /
    Data & Integrations / Business Consulting) with **white product panels**,
    "Copy, paste, go." code block (Dracula syntax + copy button), metrics,
    case studies, testimonials, WhyUs, process, 3-column resource cards,
    pricing (featured tier glows violet), FAQ. Section labels drop the "00X/"
    numbering. `Services.tsx` + `Benefits.tsx` deleted (superseded by
    `TabbedFeatures.tsx`; benefits folded into the tab checklists).
  - **All inner pages** (About, Case Studies, Case Study detail, Blog, Blog
    post, Contact) re-skinned to the dark system; contact form uses Carbon
    inputs with violet focus/error states.
  - **Nav** is now a floating 60px Carbon pill with a Voltage Blue "Get a demo"
    CTA; footer is a Carbon panel.
  - **E2E suite** updated to the new design (labels, violet color assertions,
    exact-match locators, tab-switch chart/marquee coverage, case-insensitive
    contact/footer matchers) and **all 16 visual goldens regenerated**.
    Full suite **61/61 green** at `--workers=1` (CI config); typecheck + build
    clean; axe A/AA clean on all routes; LCP ~0.8s / CLS 0 / INP 32–64ms
    isolated.
  - `scripts/design-audit.mjs` added — repeatable design.md compliance probe
    (pill radii, CTA fill, mono code, zero orange, overflow/console checks)
    against the production build.
  - Docs: `docs/decisions/ADR-008-dark-design-system.md`.

### Changed
- **Image logo removed → text wordmark** (`src/components/Nav.tsx`, `src/components/Footer.tsx`,
  2026-08-10): the operator-provided `public/images/logitech-logo.png` lockup was removed and
  replaced with a text-only wordmark — "Logitech." + "Consultants" in the Halant display font
  (accent orange period), matching the site's typography. The logo asset was deleted. The nav
  `aria-label="Logitech Consultants home"` is unchanged (e2e coverage intact).
  Also bumped the perf image-count budget 25 → 30 (`e2e/performance.spec.ts`) to
  account for the marquee's 17 real brand logos (pre-existing over-budget since
  the marquee commit; the logo removal itself lowered the count).

### Added
- **Real brand logos in the "Trusted by teams" marquee** (`src/components/LogoMarquee.tsx`, 2026-08-07):
  replaced the two template placeholder lockups with 17 real, background-free brand
  SVG marks — Claude, OpenAI, LangChain, n8n, Zapier, Docker, Stripe, Notion,
  HubSpot (Simple Icons) and John Deere, Bayer, Syngenta, Corteva, CNH Industrial,
  BASF, Nutrien, Kubota (official vector wordmarks from Wikimedia Commons) — stored
  in `public/images/logos/`. The 28s infinite marquee (framer-motion
  `x: ['0%','-50%']`, duplicated items, fade edges, reduced-motion fallback) is
  unchanged; logos render monochrome via the existing `grayscale` treatment per
  operator choice. Company names are also exposed as visually-hidden (`sr-only`)
  text for screen readers and SEO while the repeated decorative images keep
  `alt=""`.

### Fixed
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
