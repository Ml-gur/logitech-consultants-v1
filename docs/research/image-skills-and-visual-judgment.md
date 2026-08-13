# Image Skills & Visual-Judgment Research (2026-08-13)

## Goal
Find, install, and verify skills that let an agent:
1. Download / crawl / optimize / add images without breaking site functionality
   (mobile + all orientations).
2. See and interact with rendered images (Playwright).
3. Judge images with "human eyes" — whether they're appealing and on-theme.

## Research method
- Invoked `firecrawl-deep-research` skill (methodology; hosted run needs
  `FIRECRAWL_API_KEY`, which is unset here — used web_search + agent-reach
  backends instead) and `agent-reach` (`agent-reach doctor` — YouTube OK,
  other channels warn on missing creds; its CLI has no `search` subcommand,
  so the marketplace search went through `npx skills find`).
- `npx skills find` across the marketplace for image download, optimization,
  visual testing, and image-review skills.

## Installed skills (all locked in skills-lock.json)
| Skill | Source | Purpose |
|---|---|---|
| `image-optimization` | aj-geddes/useful-ai-prompts | Web image optimization: WebP, compression, responsive images, alt text, LCP. |
| `screenshot-critique` | dzhng/skills | Second set of eyes before accepting visual work — unprimed sub-agent critique of screenshots/crops; catches defects primed eyes miss. |
| `seeing-images` | oaustegard/claude-skills | Augmented vision toolchain (`see.py`): `grid`, `sample`, `palette`, `edges`, `enhance`, `compare`, `histogram`, `count_elements` — pixel-level ground truth for judging imagery. |
| `review-image` | mizchi/skills | Cheap vision-model review via OpenRouter (needs Deno + `OPENROUTER_API_KEY` — not installed here; optional CI gate). |
| `visual-content` | kostja94/marketing-skills | Image planning/specs by context (web vs social), repurposing, format specs. |
| `playwright-best-practices` | (pre-existing) | See/interact with rendered pages and images via Playwright. |

Not installed: `serpdownloaders/skills@serp-image-downloader` (private repo —
auth failed); `daymade/...@download-gemini-images` (Gemini-chat specific);
`curiositech/some_claude_skills` (clone too slow). For downloading images,
Playwright's `context.request` is the practical tool.

## Adaptation made
`seeing-images/scripts/see.py` hardcodes output dir `/home/claude` (not
creatable here). Patched to `os.environ.get("SEE_OUT_DIR", "/home/claude")` so
`SEE_OUT_DIR=/tmp` works in this environment.

## Live-site verification (Playwright + seeing-images)
- Crawled the homepage with Playwright: **129 images** (brand logo strip SVG
  marquees, 3 case-study WebP photos, avatar icons); verified rendered vs
  natural sizes and loading mode.
- Captured hero + services screenshots; `palette()` confirms the theme is
  on-brand: hero is 41.8% `#0e0e0e` (Midnight), 38.1% near-carbon, with
  violet-tinted glow (`#2a2d41`), ~0.2% warm hues. Services section 66.8%
  Midnight + white product panel.
- **Human-eyes finding (theme fit — the judgment the user asked for):** the
  three photographic case-study images **do not fit** the dark
  LaunchDarkly-style system:
  - `cs-0` (Etery): light/warm (54% bright, 17% warm beige) — a light photo on
    a midnight canvas.
  - `cs-1` (Genesy): muted blue-gray drone/factory tones, 5.4% green.
  - `cs-2` (Zenon): **87% warm, dominated by deep red** (`#670e11`, `#991a1f`,
    `#ca2e30`) — red is explicitly off-brand per design.md ("no green, red, or
    yellow"). This is the strongest clash.
  - design.md also says imagery is "sparse and functional" and "no lifestyle
    photography" — the product UI panels are the visual language. So these
    photos dilute the signal.

## Follow-up options
- Replace/restyle case-study photos (dark, violet-tinted, or white product
  panels per design.md) — verify with the screenshot-critique second-eyes pass.
- Run `review-image` CI gate once Deno + an OpenRouter key are available.
