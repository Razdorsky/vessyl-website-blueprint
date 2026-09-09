# Blueprint deep QA — 2026-09-09

Independent repository: `Razdorsky/vessyl-website-blueprint`, publication branch `blueprint`. Original Classic remains at `cf87d51256a608376815a1b1a77a024250f7400d` with a clean local tree and matching remote main.


## Deep follow-up

- Chromium, Firefox and WebKit: 17 pages in both locales. Responsive matrix covers 1,904 combinations, including widths 320–3840px, each CSS breakpoint on both sides, portrait/landscape and short desktop windows. A 720×450 CSS viewport checks reflow equivalent to 200% zoom on a 1440×900 window.
- Independent SVG glyph measurements: 13,014 checks across eight EN/es-LA routes, every width from 320 through 560px. Mobile glass frames now extend to an 8px outer gutter while heading artwork retains its approved 16px viewport gutter. No final glyph escapes its card.
- Fixed the joint-logo/close overlap at 320px, unequal Technology tab heights, off-center stacked Technology prose, short-window Dome clipping and Founder sticky clipping. Reduced motion uses a compact single-column Dome composition with no empty side column.
- Independent accessibility review: 68 page scans, 20 open-state scans, 136 Tab steps, menu/dialog focus traps and focus restoration. Fixed the press-caption contrast and the first ArrowDown in the reduced-motion desktop submenu. Explicitly approved Home/Sessions H1-to-H3 hierarchy remains intentional; this is not a claim of zero automated advisories.
- 78 behavioral cases across the three engines: all four films, EN/es-LA, desktop/mobile; mute/pause/resume, off-screen pause, rapid gallery arrows/edge clicks, room keys, session filtering/dialogs and reduced motion. Additional trusted touch swipes followed by edge taps pass in both locales.
- Fixed a real gallery race: pointer-down could interrupt the current animation before an edge click and change its starting index. Controls now advance from the index at pointer-down while preserving native drag gestures. Explicit focus after control activation makes inline room keyboard navigation consistent in WebKit.
- Firefox's intermittent automated video-click miss was isolated with native event tracing. Five full native touchscreen sequences passed without player changes or CSS overrides. Tests now await the controls' entrance and send actual touch events to their current positions.
- Cold-cache slow-network lab: 150ms RTT, 1.6Mbps down, 4× CPU, 390×844 DPR2. All four sampled local pages retain their layout and visible media; no recorded long tasks, CLS below 0.004. Local uncompressed export and public compressed hosting are measured separately. The Dome no longer downloads its hidden exterior on mobile, short screens or reduced motion; the visible interior receives high fetch priority.
- Final screenshots reviewed at mobile, tablet, desktop and short-height sizes. Approved text, locales, media sources and original Classic remain unchanged.

## Cinematic baseline retained

- Production GitHub Pages export, TypeScript and lint; 34 EN/es-LA routes, one H1 per page, 331 internal links/assets, source-linked copy, no repeated within-page editorial sentences, and unique Founder prose. All 251 Spanish entries, 132 image descriptions, numeric facts and usted register pass.
- Layout review of all 17 routes in both languages at 1440px and 390px, plus representative pages at 320, 560, 561, 820, 821, 1000, 1001, 1320 and 1321px and Spanish desktop navigation at 1321px: 114 combinations. No horizontal overflow or clipped headings remain. The detected Sessions heading overflow was corrected and affected cases rechecked.
- Visual browser inspection of Home/Two Doors, Founder, Dome exterior/interior, Nature, Stay, Sessions and desktop/mobile menus. Independent read-only review found mobile sheet height, Two Doors heading clipping and submenu keyboard order issues; each was fixed and verified.
- Experience Enter/Tab/Shift+Tab/ArrowDown/Escape behavior; submenu exit returns to Founder. Label-only underline, bounded image hover, Overview and mobile language selection preserve their roles. The globe changes language while retaining the current page.
- Mobile menu fits with a 12px exterior inset. Two Doors keeps 16px heading gutters inside the panels. The Founder portrait sticks beside the desktop biography and stacks on mobile.
- Dome progression goes from exterior to interior based on its own chapter; the stage sticks at viewport top. Audio/Video/Vibro-Tactile selection updates its state. Reduced motion displays the static interior; no-JavaScript content remains present.
- Existing behavior regression: video restarts at zero with sound and no loop, sound/pause/resume work; reduced-motion autoplay stays paused. Gallery keyboard arrows, image drag and focus restoration pass. No JavaScript page errors in behavioral runs.
- Practice card focus reveals content immediately while keeping border/shadow feedback; normal entrances retain opacity/translation transitions. Existing shared page/dialog transitions remain in use.
- Approved copy, locales, photo registry, header palette, original media files and dependency versions are unchanged. Added two optimized Dome layers and two centered Technology heading variants using existing authorized Telugu MN outlines.

## Evidence limits

Responsive checks use Chromium, Firefox and WebKit desktop engines with viewport/touch emulation, not physical iPhones/Android devices or full screen-reader certification. The tested matrix is finite; it does not claim every possible resolution or OS browser build. No real-user Core Web Vitals claim. The Dome is a photographic spatial composition, not a rebuilt 3D architectural model. Temporary screenshots/scripts/reports stay in ignored `docs/qa/`; raw masters stay outside Git.
