# Blueprint QA

Independent repository: `Razdorsky/vessyl-website-blueprint`, publication branch `blueprint`. Original Classic remains at `cf87d51256a608376815a1b1a77a024250f7400d` with a clean local tree and matching remote main.

## Systemic correction pass - 2026-09-10

User screenshots exposed defects that the previous overflow checks missed. The earlier checks below are historical evidence, not proof of visual consistency. This pass measures alignment and proportions and reviews complete rendered pages.

- Shared fixes: 16px mobile heading/prose/photo alignment; container-based heading flow; 29px flowing quotation outlines; 48px desktop header controls and centered hamburger; full-width Experience menu; uncapped Home Founder container; source-aspect editorial photos; wrapping collection heading/action rows; restored lightweight Two Doors and original closing composition.
- Shared rhythm fixes: 28px prose/action and Room Concept heading/body gaps, compact accordion rows without extra heading margins, matching Contact photo corners, and room for the English filter label at narrow widths.
- Complete visual review: all 17 English pages at 375px and 1440px, plus localized component views. Independent mobile review measured 514 heading/prose boxes on all 34 localized routes and 76 photographs on all 17 English pages at 375px; all align at 16px. Independent 360/560px review found a remaining travel prose cap, corrected in both uses/locales.
- Independent desktop/tablet review covered 34 localized routes at 821, 1000, 1440 and 1920px, plus 20 short-window desktop menu cases. It found the fixed-height photo crops and squeezed Spanish Dome action; both were corrected at component level.
- Responsive sweep (rechecked against the publication export): 1,870 page/locale/viewport combinations across Chromium, Firefox and WebKit, 360-3840px, breakpoint boundaries and short landscape windows; no horizontal overflow, clipped text, header collisions, page errors or failed resource requests. A further 60 final checks confirm Room Concept spacing, compact FAQ rows, Contact corners and filter label fit, including 360px.
- Component regression checks: 192 cases across EN/es-LA and widths 360-2560px confirm quotation width/type size, Founder proportions, header geometry, full-width menu, lightweight Two Doors, photo aspect ratios and CTA gaps.
- Independent functional review: 78 scenarios in Chromium/WebKit/Firefox, 68 axe page scans, 62 navigation observations, 12 settled drawer-focus checks and 20 gallery gesture cases. No new actionable functional issue; only user-approved heading-order advisories. The reviewer report is in `/tmp/vessyl-blueprint-a11y-2026-09-10/report.md`.
- Slow local uncompressed-export lab (150ms RTT, 1.6Mbps, 4x CPU, 390px): all visible images loaded, no overflow or long tasks, CLS below 0.001. LCP remained over 2.5s under this deliberately constrained local delivery; this is not a claim of a passing real-user speed score. Public compressed delivery is checked separately.
- Final delivery follow-up: the public Dome lab identified the full-size interior as the mobile LCP resource. Added a 94,700-byte / 800px derivative, approximately half the original payload, with matching responsive preload. All 48 delivery cases pass across Chromium, Firefox and WebKit, both locales, DPR 1/2/3, mobile/tablet/desktop, short windows and reduced motion: one interior request, no hidden exterior requests, correct density selection, no overflow or page/resource errors. Original and derivative renderings were visually compared; desktop progression is unchanged.
- Source checks pass for all 34 exports, 331 internal links/assets, approved text, duplicate prose, 251 translations and 132 image descriptions. No approved prose, registry photo assignment or font size was changed.

Evidence: ignored `docs/qa/system-2026-09-10/` and independent reports. Minimum supported design width is 360px; 375px is mandatory. Physical-device and real-user performance claims remain outside this evidence.

## Historical checks - 2026-09-09

### Deep follow-up

- Chromium, Firefox and WebKit: 17 pages in both locales. Responsive matrix covers 1,904 combinations, including widths 320–3840px, each CSS breakpoint on both sides, portrait/landscape and short desktop windows. A 720×450 CSS viewport checks reflow equivalent to 200% zoom on a 1440×900 window.
- Independent SVG glyph measurements: 13,014 checks across eight EN/es-LA routes, every width from 320 through 560px. Mobile glass frames now extend to an 8px outer gutter while heading artwork retains its approved 16px viewport gutter. No final glyph escapes its card.
- Fixed the joint-logo/close overlap at 320px, unequal Technology tab heights, off-center stacked Technology prose, short-window Dome clipping and Founder sticky clipping. Reduced motion uses a compact single-column Dome composition with no empty side column.
- Independent accessibility review: 68 page scans, 20 open-state scans, 136 Tab steps, menu/dialog focus traps and focus restoration. Fixed the press-caption contrast and the first ArrowDown in the reduced-motion desktop submenu. Explicitly approved Home/Sessions H1-to-H3 hierarchy remains intentional; this is not a claim of zero automated advisories.
- 78 behavioral cases across the three engines: all four films, EN/es-LA, desktop/mobile; mute/pause/resume, off-screen pause, rapid gallery arrows/edge clicks, room keys, session filtering/dialogs and reduced motion. Additional trusted touch swipes followed by edge taps pass in both locales.
- Fixed a real gallery race: pointer-down could interrupt the current animation before an edge click and change its starting index. Controls now advance from the index at pointer-down while preserving native drag gestures. Explicit focus after control activation makes inline room keyboard navigation consistent in WebKit.
- Firefox's intermittent automated video-click miss was isolated with native event tracing. Five full native touchscreen sequences passed without player changes or CSS overrides. Tests now await the controls' entrance and send actual touch events to their current positions.
- Cold-cache slow-network lab: 150ms RTT, 1.6Mbps down, 4× CPU, 390×844 DPR2. All four sampled local pages retain their layout and visible media; no recorded long tasks, CLS below 0.004. Local uncompressed export and public compressed hosting are measured separately. The Dome no longer downloads its hidden exterior on mobile, short screens or reduced motion; the visible interior receives high fetch priority. Hidden desktop-menu photos use deferred loading and low priority; their requests are absent on mobile and the photos load when the desktop submenu opens (both locales, all three engines).
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
