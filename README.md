# Vessyl Blueprint

An independent, Classic-based Vessyl website, published at **https://razdorsky.github.io/vessyl-website-blueprint/**.

The `blueprint` branch in `Razdorsky/vessyl-website-blueprint` is the only publication target. The original `Razdorsky/vessyl-website` repository and Classic/Immersive deployments are separate and unchanged. Baseline: `cf87d51256a608376815a1b1a77a024250f7400d`.

## Design

The Blueprint interpretation uses Vessyl's approved Telugu MN/Roboto typography, forest/copper/paper palette, selected imagery and source-linked English, Latin American Spanish and Simplified Chinese copy. It introduces a shared semantic token layer, a two-column Experience collection, alternating editorial stories, consistent borders/elevation, a forest footer, polished control states and a restrained motion system. The cinematic iteration adds glass navigation and cards, a scroll-linked photographic Dome chapter, the Classic Founder text composition with an ordinary scrolling portrait, a wide Nature composition and the approved lightweight Two Doors composition. See [BLUEPRINT.md](BLUEPRINT.md) for the design contract and reference mapping.

All 17 pages are available at clean URLs, such as `/founder/`, `/experience/`, `/sessions/` and `/stay/`. Spanish uses `/es-LA/` with formal usted and document language `es-419`. Simplified Chinese uses `/zh-Hans/`, native Chinese phrasing and the same document language tag. The shared globe selector preserves the current page in all three languages.

## Local development

Node.js 24 and Python 3 are required.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5174
```

Production preview:

```sh
npm run build
npm run check
npm run preview
```

Open http://localhost:4174/. This port is independent of the original Classic preview.

## Publication

GitHub Actions publishes pushes to `blueprint`. GitHub Pages uses Actions as its source. Reproduce the artifact with:

```sh
npm run build:github
NEXT_PUBLIC_BASE_PATH=/vessyl-website-blueprint npm run check
```

To preview this prefixed build, run `npm run preview` and open `http://localhost:4174/vessyl-website-blueprint/` (do not set `BASE_PATH`; the exported directory already includes the prefix).

Only `outputs/github-pages` is deployed. Run `npm run build` again to restore unprefixed local URLs. Original raw sources, full media masters and research archives remain outside Git.

## Preserved product contracts

- Approved English source, Spanish and Simplified Chinese translations, all 17 pages, booking/email destinations, and required disabled app-store placeholders.
- Mobile minimum 360px, with 375px also required in design and QA.
- H1 Bold; mobile H1 39px and shared 16px mobile content gutters; desktop display artwork preserved. Prose measure 680px, H3/prose gap 28px.
- Outlined 12px content CTAs; capsule-shaped desktop header groups at a shared 50px height and 16px text size, matching content CTAs: navigation (Experience, Founder, Book a stay, Sessions), then language. The separate desktop Booking/App group is removed; mobile retains its App action. Selected photograph/video radius 10px, original optical Dome alignment and 2× Dome mark.
- Film width 80% desktop and 95% at <=820px; silent loop on view, restart with sound/no loop at first activation, then icon-only sound/playback controls on every film.
- Stacked gallery previews, keyboard/edge/swipe navigation, thumbnails, Escape and opener-focus restoration.
- Header top, html/body canvas and theme-color all derive from `lib/header-theme.ts`, including mobile overscroll. Keep native zoom, safe-area behavior and scrolling.
- Progressive motion: content exists in SSR, reduced motion disables entrances and scenic drift, offscreen/background video pauses, focus reveals content immediately.

`npm run check` validates types, lint, all 51 language/page exports, internal assets, source-linked copy, duplicate prose, heading artwork, translation completeness, numeric facts, usted register, Chinese font coverage, protected names, page-by-page source correspondence and the localized press overview. UI changes also require browser inspection at desktop/mobile and the affected breakpoints.

## Simplified Chinese

Direct entry: https://razdorsky.github.io/vessyl-website-blueprint/zh-Hans/

`lib/locales/zh-Hans.json` translates the approved en-US dictionary directly; `zh-Hans-images.json` covers every photograph description. Brand and personal names remain in their approved spelling. Page headings, prose, menus, FAQ answers, gallery/player controls, course dialogs and the downloadable press overview are localized. Existing booking destinations and app-store placeholders are retained.

The primary translation received a separate source-versus-target review of all 253 original entries, 133 alt descriptions and 10 press-overview blocks; the added language endonym brings the dictionary to 254 entries. Corrections preserve intended effects, uncertainty, sourcing, timing and photograph descriptions without adding claims. Subsequent copy changes require the same independent second pass.

Chinese headings and quotations use self-hosted Noto Serif SC; prose and controls use self-hosted Noto Sans SC. Chinese keeps Blueprint's shared H1/H2/H3 size tokens, Bold H1 and 16px mobile gutters. Native text shaping replaces Latin SVG outlines only for this locale. Both variable WOFF2 subsets cover the current copy and weights 400–700; `npm run check` rejects new characters outside their coverage. See [the typography tooling](scripts/typography/README.md) for regeneration and licenses.
