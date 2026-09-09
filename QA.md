# Blueprint release verification — 2026-09-09

Baseline: original Classic at `cf87d51256a608376815a1b1a77a024250f7400d`. Independent repository and publication branch: `Razdorsky/vessyl-website-blueprint`, `blueprint`.

## Verified

- Production export with `/vessyl-website-blueprint` prefix; TypeScript and lint; 34 English/Spanish routes, one H1 each, 331 linked internal resources and working booking destinations.
- All rendered editorial text remains linked to the approved dictionary. Founder and within-page duplicate-prose checks pass. All 251 Spanish entries, 132 image descriptions, numeric facts and usted register pass.
- Browser layout inspection: all 17 pages at 1440px, all 17 at 390px, all 17 Spanish pages at 390px, plus 56 representative checks across 320, 560, 561, 820, 821, 1200, 1201 and 1280px. No horizontal overflow or headings outside the viewport. Mobile heading gutters and 95% film widths preserved.
- Visual inspection of Home, Experience, Sessions, Stay galleries, video and dialog states. Independently reviewed grid specificity, story alternation and keyboard focus behavior; findings fixed and verified.
- Desktop/mobile navigation; page-preserving language switch; filter tabs; session dialog; Escape and focus restoration.
- Gallery keyboard arrows, image-edge clicks and drag; opener focus restored after closing. Existing room/gallery component preserved.
- Music film first activation restarts at zero, unmutes and disables looping; mute/pause/resume work. Both controls remain available. All four films use this shared component and retain source hashes.
- Reduced-motion browser emulation: all entrance targets visible without translation; automatic video playback paused. No-JavaScript browser context: complete editorial content/cards visible.
- Focus on a pending card reveals it immediately with no entrance transition. Page transitions recognize the new root routes.
- No JavaScript page errors in the behavioral regression run.
- Original repository local tree is clean; original local and public main remain at the baseline. Approved copy, locales, photograph registry, public assets and shared header palette are unchanged in the new fork.

## Scope of evidence

Responsive browser checks are emulation, not physical-device testing. No claim of a full screen-reader certification, real-user Core Web Vitals or exhaustive device coverage. Browser behavior reports and temporary scripts remain in ignored `docs/qa/`; production code and release checks are tracked.
