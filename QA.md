# Blueprint cinematic release verification — 2026-09-09

Independent repository: `Razdorsky/vessyl-website-blueprint`, publication branch `blueprint`. Original Classic remains at `cf87d51256a608376815a1b1a77a024250f7400d` with a clean local tree and matching remote main.

## Verified

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

Responsive checks use Chromium emulation and browser interaction, not a physical-device laboratory or full screen-reader certification. No real-user Core Web Vitals claim. The Dome is a photographic spatial composition, not a rebuilt 3D architectural model. Temporary screenshots/scripts/reports stay in ignored `docs/qa/`; raw masters stay outside Git.
