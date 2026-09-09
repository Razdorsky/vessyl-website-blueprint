# Vessyl Blueprint design contract

## Direction

A photographic editorial journey: generous but content-related intervals, aligned paired collections, quiet material surfaces and controlled transitions. The visual identity belongs to Vessyl; the reference articles supply a method, not replacement colors, fonts or marketing copy.

## System ownership

1. `lib/approved-copy.json`, `lib/locales`, `lib/classic-photography.json`, `lib/header-theme.ts`: approved content, media and canvas authority.
2. `app/blueprint-tokens.css`: semantic dimensions, material and motion tokens.
3. `app/classic-spacing.css`: adjacency rules and photo bridges; Blueprint remaps the scale without duplicating section boundaries.
4. `app/blueprint.css`: final Blueprint component/composition rules.
5. `app/blueprint-motion.css` and `BlueprintMotion.tsx`: progressive entrances and shared state motion.

Inherited Classic files retain exact editorial/media contracts. Do not append page-specific patches to `globals.css`; extend an existing role in the Blueprint layer.

## Roles

| Role | Composition and spacing |
|---|---|
| Photographic opening | Full-width photo; centered copy; header uses its shared gradient. Portrait openings and Sessions preserve tested crops. |
| Utility opening | Content-sized Press/Contact/FAQ, without viewport-height filler. |
| Prose | Centered, 680px prose measure; heading/body gap 28px. |
| Photographic story | Two-column grid, shared 32–96px gap; alternate direct page stories on desktop; stack on mobile. |
| Collection | Experience in aligned pairs, 4:3 photography; practice cards share image/title/body spacing and filter states. |
| Accent surface | Forest Two Doors, copper quotation, neutral fans for Experience facilitators; internal insets own boundaries. |
| Film/gallery | Preserve 80%/95% films, 10px corners and interactive behavior. Elevation is restricted to photographic layers and floating panels. |
| Photo bridge | Existing deliberate overlap 32–64px with positive copy clearance; never slide a photograph over a film. |
| Divider | Straight 2px copper gradient, with its own air. |

Closed spacing scale: 8, 16, 24, 32, 48, 64, 96, 128px. The approved 28px copy gap, 4px control and 10px photograph radii are intentional brand-specific exceptions. Section insets vary fluidly from 64 to 128px; photograph overlaps retain their established range. Mobile heading gutters remain 16px independently of 24px body/photo gutters.

## Motion

Signature curve `cubic-bezier(.16,1,.3,1)`, no bounce. Response 160ms, control 240ms, panel 420ms, page 480ms, one-time editorial reveal 800ms, exit 180ms. Collection stagger is 70ms within each pair, never an accumulating delay down the page.

- Interactive changes use interruptible transitions and static selected/focus cues.
- Semantic content groups enter once; no letter-by-letter prose, repeating scroll animations or content hidden before hydration.
- Desktop scenic opening photos move by at most 24px, with modest overscan; portrait/Sessions/Dome crops are excluded. Reduced motion, smaller screens and constrained devices skip the scene effect.
- Keyboard focus reveals pending content immediately. New filter content cannot remain hidden. Observer/listener/animation cleanup is mandatory.
- Video state icons cross-fade without visible technical text or new controls. Functional audio/playback behavior remains identical for all four films.
- Existing measured accordion/filter height transitions remain an intentional usability exception to the motion article's blanket layout-animation ban.

## Applied references

- [The Design System Blueprint](https://copper-astronaut-40f.notion.site/The-Design-System-Blueprint-396b0fd1c010816c8314c86209b3d48d): grids, material roles, bounded scales, component states, shared signature motion, documentation.
- [15 Golden Skills](https://copper-astronaut-40f.notion.site/My-15-Golden-Skills-for-Motion-3b5b0fd1c01081118f0cd2a9fc92e0cb): relevant design-system, interface polish and motion principles.
- [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better/tree/main/skills/make-interfaces-feel-better): concentric controls, optical sizing, interruptible transitions, hit areas, image depth, icon state continuity, explicit transition properties.
- [ECC motion skills](https://github.com/affaan-m/ECC/tree/main/skills/motion-foundations): SSR/reduced-motion/device gates and token-based motion; patterns/advanced inform entrances, cleanup and preservation of gallery gestures.

The motion/react recipes are adapted to the existing CSS, browser View Transitions and DOM observer implementation. No animation framework was installed solely for these effects. Blueprint's generic blue palette, pill buttons and example fonts, spring recipes, continuous decoration and paid/research-only integrations were intentionally omitted. Author-specific values are not universal standards.

## Acceptance

Validate both languages, 17 routes, header-canvas parity, mobile heading gutters, logical collection order (Dome third), film behavior, dropdown/keyboard focus, filters/dialogs, gallery gestures and reduced-motion behavior. The original repository must remain at its recorded baseline and clean. Deployment must target only the independent Blueprint repository and URL.
